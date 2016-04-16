import React, { Component, PropTypes } from 'react'
import CollectionView from './CollectionView'
import shallowCompare from 'react-addons-shallow-compare'
import calculateSizeAndPositionData from './utils/calculateSizeAndPositionData'
import getUpdatedOffsetForIndex from '../utils/getUpdatedOffsetForIndex'
import type { ScrollPosition, SizeInfo } from './types'

export default class Collection extends Component {

  static propTypes = {
    cellCount: PropTypes.number.isRequired,
    cellRenderer: PropTypes.func.isRequired,
    cellSizeAndPositionGetter: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cellMetadata = []
    this._lastRenderedCellIndices = []
  }

  /** React lifecycle methods */

  render () {
    const { ...props } = this.props

    return (
      <CollectionView
        cellLayoutManager={this}
        {...props}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /** CellLayoutManager interface */

  calculateSizeAndPositionData () {
    const { cellCount, cellSizeAndPositionGetter } = this.props

    const data = calculateSizeAndPositionData({
      cellCount,
      cellSizeAndPositionGetter
    })

    this._cellMetadata = data.cellMetadata
    this._sectionManager = data.sectionManager
    this._height = data.height
    this._width = data.width
  }

  /**
   * Returns the most recently rendered set of cell indices.
   */
  getLastRenderedIndices () {
    return this._lastRenderedCellIndices
  }

  /**
   * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
   */
  getScrollPositionForCell ({
    cellIndex,
    height,
    scrollLeft,
    scrollTop,
    width
  }): ScrollPosition {
    const { cellCount } = this.props

    if (
      cellIndex >= 0 &&
      cellIndex < cellCount
    ) {
      const cellMetadata = this._cellMetadata[cellIndex]

      scrollLeft = getUpdatedOffsetForIndex({
        cellOffset: cellMetadata.x,
        cellSize: cellMetadata.width,
        containerSize: width,
        currentOffset: scrollLeft,
        targetIndex: cellIndex
      })

      scrollTop = getUpdatedOffsetForIndex({
        cellOffset: cellMetadata.y,
        cellSize: cellMetadata.height,
        containerSize: height,
        currentOffset: scrollTop,
        targetIndex: cellIndex
      })
    }

    return {
      scrollLeft,
      scrollTop
    }
  }

  getTotalSize (): SizeInfo {
    return {
      height: this._height,
      width: this._width
    }
  }

  renderCells ({
    height,
    isScrolling,
    width,
    x,
    y
  }) {
    const { cellRenderer } = this.props

    this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
      height,
      width,
      x,
      y
    })

    return this._lastRenderedCellIndices.map((index) => {
      const cellMetadata = this._sectionManager.getCellMetadata(index)
      const renderedCell = cellRenderer(index)

      return (
        <div
          className='Grid__cell'
          key={index}
          style={{
            height: cellMetadata.height,
            left: cellMetadata.x,
            top: cellMetadata.y,
            width: cellMetadata.width
          }}
        >
          {renderedCell}
        </div>
      )
    })
  }
}
