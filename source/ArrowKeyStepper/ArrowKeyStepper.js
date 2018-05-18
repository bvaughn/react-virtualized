/** @flow */

import type {RenderedSection} from '../Grid';
import type {ScrollIndices} from './types';

import * as React from 'react';
import {polyfill} from 'react-lifecycles-compat';

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */

type ChildrenParams = {
  onSectionRendered: (params: RenderedSection) => void,
  scrollToColumn: number,
  scrollToRow: number,
};

type Props = {
  children: (params: ChildrenParams) => React.Element<*>,
  className?: string,
  columnCount: number,
  disabled: boolean,
  isControlled: boolean,
  mode: 'cells' | 'edges',
  onScrollToChange?: (params: ScrollIndices) => void,
  rowCount: number,
  scrollToColumn: number,
  scrollToRow: number,
};

type State = ScrollIndices;

class ArrowKeyStepper extends React.PureComponent<Props, State> {
  static defaultProps = {
    disabled: false,
    isControlled: false,
    mode: 'edges',
    scrollToColumn: 0,
    scrollToRow: 0,
  };

  state = {
    scrollToColumn: 0,
    scrollToRow: 0,
  };

  _columnStartIndex = 0;
  _columnStopIndex = 0;
  _rowStartIndex = 0;
  _rowStopIndex = 0;

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State,
  ): $Shape<State> {
    if (nextProps.isControlled) {
      return null;
    }

    if (
      nextProps.scrollToColumn !== prevState.scrollToColumn ||
      nextProps.scrollToRow !== prevState.scrollToRow
    ) {
      return {
        scrollToColumn: nextProps.scrollToColumn,
        scrollToRow: nextProps.scrollToRow,
      };
    }

    return null;
  }

  setScrollIndexes({scrollToColumn, scrollToRow}: ScrollIndices) {
    this.setState({
      scrollToRow,
      scrollToColumn,
    });
  }

  render() {
    const {className, children} = this.props;
    const {scrollToColumn, scrollToRow} = this._getScrollState();

    return (
      <div className={className} onKeyDown={this._onKeyDown}>
        {children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn,
          scrollToRow,
        })}
      </div>
    );
  }

  _onKeyDown = (event: KeyboardEvent) => {
    const {columnCount, disabled, mode, rowCount} = this.props;

    if (disabled) {
      return;
    }

    const {
      scrollToColumn: scrollToColumnPrevious,
      scrollToRow: scrollToRowPrevious,
    } = this._getScrollState();

    let {scrollToColumn, scrollToRow} = this._getScrollState();

    // The above cases all prevent default event event behavior.
    // This is to keep the grid from scrolling after the snap-to update.
    switch (event.key) {
      case 'ArrowDown':
        scrollToRow =
          mode === 'cells'
            ? Math.min(scrollToRow + 1, rowCount - 1)
            : Math.min(this._rowStopIndex + 1, rowCount - 1);
        break;
      case 'ArrowLeft':
        scrollToColumn =
          mode === 'cells'
            ? Math.max(scrollToColumn - 1, 0)
            : Math.max(this._columnStartIndex - 1, 0);
        break;
      case 'ArrowRight':
        scrollToColumn =
          mode === 'cells'
            ? Math.min(scrollToColumn + 1, columnCount - 1)
            : Math.min(this._columnStopIndex + 1, columnCount - 1);
        break;
      case 'ArrowUp':
        scrollToRow =
          mode === 'cells'
            ? Math.max(scrollToRow - 1, 0)
            : Math.max(this._rowStartIndex - 1, 0);
        break;
    }

    if (
      scrollToColumn !== scrollToColumnPrevious ||
      scrollToRow !== scrollToRowPrevious
    ) {
      event.preventDefault();

      this._updateScrollState({scrollToColumn, scrollToRow});
    }
  };

  _onSectionRendered = ({
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex,
  }: RenderedSection) => {
    this._columnStartIndex = columnStartIndex;
    this._columnStopIndex = columnStopIndex;
    this._rowStartIndex = rowStartIndex;
    this._rowStopIndex = rowStopIndex;
  };

  _getScrollState() {
    return this.props.isControlled ? this.props : this.state;
  }

  _updateScrollState({scrollToColumn, scrollToRow}: ScrollIndices) {
    const {isControlled, onScrollToChange} = this.props;

    if (typeof onScrollToChange === 'function') {
      onScrollToChange({scrollToColumn, scrollToRow});
    }

    if (!isControlled) {
      this.setState({scrollToColumn, scrollToRow});
    }
  }
}

polyfill(ArrowKeyStepper);

export default ArrowKeyStepper;
