/** @flow */
import * as React from 'react';
import type {CellMeasureCache} from './types';
import {cloneElement} from 'react';

type Children = (params: {measure: () => void}) => React.Element<*>;

type Cell = {
  columnIndex: number,
  rowIndex: number,
};

type Props = {
  cache: CellMeasureCache,
  children: Children | React.Element<*>,
  columnIndex?: number,
  index?: number,
  parent: {
    invalidateCellSizeAfterRender?: (cell: Cell) => void,
    recomputeGridSize?: (cell: Cell) => void,
  },
  rowIndex?: number,
};

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
export default class CellMeasurer extends React.PureComponent<Props> {
  static __internalCellMeasurerFlag = false;

  _child: {current: HTMLElement | null} = React.createRef();

  componentDidMount() {
    this._maybeMeasureCell();
  }

  componentDidUpdate() {
    this._maybeMeasureCell();
  }

  render() {
    const {children} = this.props;

    const resolvedChildren =
      typeof children === 'function'
        ? children({measure: this._measure, registerChild: this._registerChild})
        : children;

    if (resolvedChildren === null) {
      return resolvedChildren;
    }

    return cloneElement(resolvedChildren, {
      ref: node => {
        if (typeof resolvedChildren.ref === 'function') {
          resolvedChildren.ref(node);
        } else if (resolvedChildren.ref) {
          resolvedChildren.ref.current = node;
        }
        this._child.current = node;
      },
    });
  }

  _getCellMeasurements() {
    const {cache} = this.props;

    const node = this._child.current;

    // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

    if (
      node &&
      node.ownerDocument &&
      node.ownerDocument.defaultView &&
      node instanceof node.ownerDocument.defaultView.HTMLElement
    ) {
      const styleWidth = node.style.width;
      const styleHeight = node.style.height;

      // If we are re-measuring a cell that has already been measured,
      // It will have a hard-coded width/height from the previous measurement.
      // The fact that we are measuring indicates this measurement is probably stale,
      // So explicitly clear it out (eg set to "auto") so we can recalculate.
      // See issue #593 for more info.
      // Even if we are measuring initially- if we're inside of a MultiGrid component,
      // Explicitly clear width/height before measuring to avoid being tainted by another Grid.
      // eg top/left Grid renders before bottom/right Grid
      // Since the CellMeasurerCache is shared between them this taints derived cell size values.
      if (!cache.hasFixedWidth()) {
        node.style.width = 'auto';
      }
      if (!cache.hasFixedHeight()) {
        node.style.height = 'auto';
      }

      const height = Math.ceil(node.offsetHeight);
      const width = Math.ceil(node.offsetWidth);

      // Reset after measuring to avoid breaking styles; see #660
      if (styleWidth) {
        node.style.width = styleWidth;
      }
      if (styleHeight) {
        node.style.height = styleHeight;
      }

      return {height, width};
    } else {
      return {height: 0, width: 0};
    }
  }

  _maybeMeasureCell() {
    const {
      cache,
      columnIndex = 0,
      parent,
      rowIndex = this.props.index || 0,
    } = this.props;

    if (!cache.has(rowIndex, columnIndex)) {
      const {height, width} = this._getCellMeasurements();

      cache.set(rowIndex, columnIndex, width, height);

      // If size has changed, let Grid know to re-render.
      if (
        parent &&
        typeof parent.invalidateCellSizeAfterRender === 'function'
      ) {
        parent.invalidateCellSizeAfterRender({
          columnIndex,
          rowIndex,
        });
      }
    }
  }

  _measure = () => {
    const {
      cache,
      columnIndex = 0,
      parent,
      rowIndex = this.props.index || 0,
    } = this.props;

    const {height, width} = this._getCellMeasurements();

    if (
      height !== cache.getHeight(rowIndex, columnIndex) ||
      width !== cache.getWidth(rowIndex, columnIndex)
    ) {
      cache.set(rowIndex, columnIndex, width, height);

      if (parent && typeof parent.recomputeGridSize === 'function') {
        parent.recomputeGridSize({
          columnIndex,
          rowIndex,
        });
      }
    }
  };

  _registerChild = element => {
    if (element && !(element instanceof Element)) {
      console.warn(
        'CellMeasurer registerChild expects to be passed Element or null',
      );
    }
    this._child.current = element;
    if (element) {
      this._maybeMeasureCell();
    }
  };
}

// Used for DEV mode warning check
if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true;
}
