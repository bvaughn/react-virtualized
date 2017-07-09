/** @flow */
import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import CellMeasurerCache from './CellMeasurerCache.js';

type Props = {
  cache: CellMeasurerCache,
  children: ((params: { measure: () => void }) => React.Children) | React.Children,
  columnIndex?: number,
  index?: number,
  parent: mixed,
  rowIndex?: number,
}

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
export default class CellMeasurer extends PureComponent {
  static __internalCellMeasurerFlag = false

  props: Props

  componentDidMount () {
    this._maybeMeasureCell()
  }

  componentDidUpdate () {
    this._maybeMeasureCell()
  }

  render () {
    const { children } = this.props

    return typeof children === 'function'
      ? children({ measure: this._measure })
      : children
  }

  _getCellMeasurements () {
    const { cache } = this.props

    const node = findDOMNode(this)

    if (!(node instanceof HTMLElement)) {
      return {
        width: 0,
        height: 0
      };
    }

    // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

    const styleWidth = node.style.width
    const styleHeight = node.style.height

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
      node.style.width = 'auto'
    }
    if (!cache.hasFixedHeight()) {
      node.style.height = 'auto'
    }

    const height = Math.ceil(node.offsetHeight)
    const width = Math.ceil(node.offsetWidth)

    // Reset after measuring to avoid breaking styles; see #660
    if (styleWidth) {
      node.style.width = styleWidth
    }
    if (styleHeight) {
      node.style.height = styleHeight
    }

    return { height, styleHeight, styleWidth, width }
  }

  _maybeMeasureCell () {
    const { cache, parent } = this.props
    const rowIndex = this.props.rowIndex || this.props.index || 0
    const columnIndex = this.props.columnIndex || 0

    if (!cache.has(rowIndex, columnIndex)) {
      const { height, width } = this._getCellMeasurements()

      cache.set(
        rowIndex,
        columnIndex,
        width,
        height
      )

      // If size has changed, let Grid know to re-render.
      if (
        parent &&
        typeof parent.invalidateCellSizeAfterRender === 'function'
      ) {
        parent.invalidateCellSizeAfterRender({
          columnIndex,
          rowIndex
        })
      }
    }
  }

  _measure = () => {
    const { cache, parent } = this.props
    const rowIndex = this.props.rowIndex || this.props.index || 0
    const columnIndex = this.props.columnIndex || 0

    const { height, width } = this._getCellMeasurements()

    if (
      height !== cache.getHeight(rowIndex, columnIndex) ||
      width !== cache.getWidth(rowIndex, columnIndex)
    ) {
      cache.set(
        rowIndex,
        columnIndex,
        width,
        height
      )

      if (
        parent &&
        typeof parent.recomputeGridSize === 'function'
      ) {
        parent.recomputeGridSize({
          columnIndex,
          rowIndex
        })
      }
    }
  }
}

// Used for DEV mode warning check
if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true
}
