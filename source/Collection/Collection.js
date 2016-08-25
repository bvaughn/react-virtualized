import React, { Component, PropTypes } from 'react'
import CollectionView from './CollectionView'
import calculateSizeAndPositionData from './utils/calculateSizeAndPositionData'
import getUpdatedOffsetForIndex from '../utils/getUpdatedOffsetForIndex'
import shallowCompare from 'react-addons-shallow-compare'
import type { ScrollPosition, SizeInfo } from './types'

/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */
export default class Collection extends Component {

  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Number of cells in Collection.
     */
    cellCount: PropTypes.number.isRequired,

    /**
     * Responsible for rendering a group of cells given their indices.
     * Should implement the following interface: ({
     *   cellSizeAndPositionGetter:Function,
     *   indices: Array<number>,
     *   cellRenderer: Function
     * }): Array<PropTypes.node>
     */
    cellGroupRenderer: PropTypes.func.isRequired,

    /**
     * Responsible for rendering a cell given an row and column index.
     * Should implement the following interface: ({ index: number }): PropTypes.element
     */
    cellRenderer: PropTypes.func.isRequired,

    /**
     * Callback responsible for returning size and offset/position information for a given cell (index).
     * ({ index: number }): { height: number, width: number, x: number, y: number }
     */
    cellSizeAndPositionGetter: PropTypes.func.isRequired,

    /**
     * Optionally override the size of the sections a Collection's cells are split into.
     */
    sectionSize: PropTypes.number
  };

  static defaultProps = {
    'aria-label': 'grid',
    cellGroupRenderer: defaultCellGroupRenderer
  };

  constructor (props, context) {
    super(props, context)

    this._cellMetadata = []
    this._lastRenderedCellIndices = []
  }

  /** See Collection#recomputeCellSizesAndPositions */
  recomputeCellSizesAndPositions () {
    // Clean data cached during scroll
    cellMetadataCache = []
    renderedCellCache = []

    this._collectionView.recomputeCellSizesAndPositions()
  }

  /** React lifecycle methods */

  render () {
    const { ...props } = this.props

    return (
      <CollectionView
        cellLayoutManager={this}
        ref={(ref) => {
          this._collectionView = ref
        }}
        {...props}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /** CellLayoutManager interface */

  calculateSizeAndPositionData () {
    const { cellCount, cellSizeAndPositionGetter, sectionSize } = this.props

    const data = calculateSizeAndPositionData({
      cellCount,
      cellSizeAndPositionGetter,
      sectionSize
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
    align,
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
        align,
        cellOffset: cellMetadata.x,
        cellSize: cellMetadata.width,
        containerSize: width,
        currentOffset: scrollLeft,
        targetIndex: cellIndex
      })

      scrollTop = getUpdatedOffsetForIndex({
        align,
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

  cellRenderers ({
    height,
    isScrolling,
    width,
    x,
    y
  }) {
    const { cellGroupRenderer, cellRenderer } = this.props

    // Store for later calls to getLastRenderedIndices()
    this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
      height,
      width,
      x,
      y
    })

    return cellGroupRenderer({
      cellRenderer,
      cellSizeAndPositionGetter: ({ index }) => this._sectionManager.getCellMetadata({ index }),
      indices: this._lastRenderedCellIndices,
      isScrolling
    })
  }
}

// Arrays where to store cache data during scroll
let cellMetadataCache = []
let renderedCellCache = []

function defaultCellGroupRenderer ({
  cellRenderer,
  cellSizeAndPositionGetter,
  indices,
  isScrolling
}) {
  return indices
    .map((index) => {
      let cellMetadata
      let renderedCell

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling complets.
      if (isScrolling) {
        if (index in renderedCellCache) {
          renderedCell = renderedCellCache[index]
          cellMetadata = cellMetadataCache[index]
        } else {
          cellMetadataCache[index] = cellSizeAndPositionGetter({ index })
          renderedCellCache[index] = cellRenderer({
            index,
            isScrolling
          })
        }
      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        cellMetadata = cellSizeAndPositionGetter({ index })
        renderedCell = cellRenderer({
          index,
          isScrolling
        })
      }

      if (renderedCell == null || renderedCell === false || cellMetadata == null || cellMetadata === false) {
        return null
      }

      return (
        <div
          className='Collection__cell'
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
    .filter((renderedCell) => !!renderedCell)
}
