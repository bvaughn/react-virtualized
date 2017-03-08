/** @flow */
import { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

type Props = {
  cache: mixed,
  children: mixed,
  columnIndex: number,
  parent: mixed,
  rowIndex: number,
  style: mixed
};

function warnAboutImproperUse (parent) {
  if (process.env.NODE_ENV !== 'production') {
    if (
      parent &&
      parent.props.deferredMeasurementCache === undefined &&
      parent.__warnedAboutImproperUse !== true
    ) {
      parent.__warnedAboutImproperUse = true
      console.warn('CellMeasurer should be rendered within a Grid that has a deferredMeasurementCache prop.')
    }
  }
}

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
export default class CellMeasurer extends PureComponent {
  props: Props;

  constructor (props, context) {
    super(props, context)

    this._measure = this._measure.bind(this)
  }

  componentDidMount () {
    this._maybeMeasureCell()
  }

  componentDidUpdate (prevProps, prevState) {
    this._maybeMeasureCell()
  }

  render () {
    const { children } = this.props

    if (process.env.NODE_ENV !== 'production') {
      const { parent } = this.props

      warnAboutImproperUse(parent)
    }

    return typeof children === 'function'
      ? children({ measure: this._measure })
      : children
  }

  _maybeMeasureCell () {
    const { cache, columnIndex, parent, rowIndex } = this.props

    if (!cache.has(rowIndex, columnIndex)) {
      const node = findDOMNode(this)
      const height = node.offsetHeight
      const width = node.offsetWidth

      cache.set(
        rowIndex,
        columnIndex,
        width,
        height
      )

      // If size has changed, let Grid know to re-render.
      if (parent !== undefined) {
        parent.invalidateCellSizeAfterRender({
          columnIndex,
          rowIndex
        })
      }
    }
  }

  _measure () {
    const { cache, columnIndex, parent, rowIndex } = this.props

    const node = findDOMNode(this)

    // If we are re-measuring a cell that has already been measured,
    // It will have a hard-coded width/height from the previous measurement.
    // The fact that we are measuring indicates this measurement is probably stale,
    // So explicitly clear it out (eg set to "auto") so we can recalculate.
    // See issue #593 for more info.
    if (!cache.hasFixedWidth()) {
      node.style.width = 'auto'
    }
    if (!cache.hasFixedHeight()) {
      node.style.height = 'auto'
    }

    const height = node.offsetHeight
    const width = node.offsetWidth

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

      parent.recomputeGridSize({
        columnIndex,
        rowIndex
      })
    }
  }
}

// Used for DEV mode warning check
if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true
}
