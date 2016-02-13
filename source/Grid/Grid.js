/** @flow */
import {
  computeCellMetadataAndUpdateScrollOffsetHelper,
  createCallbackMemoizer,
  getOverscanIndices,
  getUpdatedOffsetForIndex,
  getVisibleCellIndices,
  initCellMetadata,
  updateScrollIndexHelper
} from '../utils'
import cn from 'classnames'
import raf from 'raf'
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
const IS_SCROLLING_TIMEOUT = 150

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 */
export default class Grid extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /**
     * Optional custom CSS class name to attach to root Grid element.
     */
    className: PropTypes.string,

    /**
     * Number of columns in grid.
     */
    columnsCount: PropTypes.number.isRequired,

    /**
     * Either a fixed column width (number) or a function that returns the width of a column given its index.
     * Should implement the following interface: (index: number): number
     */
    columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Height of Grid; this property determines the number of visible (vs virtualized) rows.
     */
    height: PropTypes.number.isRequired,

    /**
     * Optional renderer to be used in place of rows when either :rowsCount or :columnsCount is 0.
     */
    noContentRenderer: PropTypes.func.isRequired,

    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
     */
    onScroll: PropTypes.func.isRequired,

    /**
     * Callback invoked with information about the section of the Grid that was just rendered.
     * ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }): void
     */
    onSectionRendered: PropTypes.func.isRequired,

    /**
     * Number of columns to render before/after the visible section of the grid.
     * These columns can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanColumnsCount: PropTypes.number.isRequired,

    /**
     * Number of rows to render above/below the visible section of the grid.
     * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanRowsCount: PropTypes.number.isRequired,

    /**
     * Responsible for rendering a cell given an row and column index.
     * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
     */
    renderCell: PropTypes.func.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * Should implement the following interface: (index: number): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Number of rows in grid.
     */
    rowsCount: PropTypes.number.isRequired,

    /**
     * Column index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToColumn: PropTypes.number,

    /**
     * Row index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToRow: PropTypes.number,

    /**
     * Width of Grid; this property determines the number of visible (vs virtualized) columns.
     */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    overscanColumnsCount: 0,
    overscanRowsCount: 10
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      computeGridMetadataOnNextUpdate: false,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    }

    // Invokes onSectionRendered callback only when start/stop row or column indices change
    this._onGridRenderedMemoizer = createCallbackMemoizer()
    this._onScrollMemoizer = createCallbackMemoizer(false)

    // Bind functions to instance so they don't lose context when passed around
    this._computeGridMetadata = this._computeGridMetadata.bind(this)
    this._invokeOnGridRenderedHelper = this._invokeOnGridRenderedHelper.bind(this)
    this._onKeyPress = this._onKeyPress.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._updateScrollLeftForScrollToColumn = this._updateScrollLeftForScrollToColumn.bind(this)
    this._updateScrollTopForScrollToRow = this._updateScrollTopForScrollToRow.bind(this)
  }

  /**
   * Forced recompute of row heights and column widths.
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since Grid only receives :columnsCount and :rowsCount it has no way of detecting when the underlying data changes.
   */
  recomputeGridSize () {
    this.setState({
      computeGridMetadataOnNextUpdate: true
    })
  }

  /**
   * Updates the Grid to ensure the cell at the specified row and column indices is visible.
   * This method exists so that a user can forcefully scroll to the same cell twice.
   * (The :scrollToColumn and :scrollToRow properties would not change in that case so it would not be picked up by the component.)
   */
  scrollToCell ({ scrollToColumn, scrollToRow }) {
    this._updateScrollLeftForScrollToColumn(scrollToColumn)
    this._updateScrollTopForScrollToRow(scrollToRow)
  }

  /**
   * Set the :scrollLeft and :scrollTop position within the inner scroll container.
   * Normally it is best to let Grid manage these properties or to use a method like :scrollToCell.
   * This method enables Grid to be scroll-synced to another react-virtualized component though.
   * It is appropriate to use in that case.
   */
  setScrollPosition ({ scrollLeft, scrollTop }) {
    const props = {}

    if (scrollLeft >= 0) {
      props.scrollLeft = scrollLeft
    }

    if (scrollTop >= 0) {
      props.scrollTop = scrollTop
    }

    if (
      scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft ||
      scrollTop >= 0 && scrollTop !== this.state.scrollTop
    ) {
      this.setState(props)
    }
  }

  componentDidMount () {
    const { scrollToColumn, scrollToRow } = this.props

    if (scrollToColumn >= 0 || scrollToRow >= 0) {
      // Without setImmediate() the initial scrollingContainer.scrollTop assignment doesn't work
      this._setImmediateId = setImmediate(() => {
        this._setImmediateId = null
        this._updateScrollLeftForScrollToColumn()
        this._updateScrollTopForScrollToRow()
      })
    }

    // Update onRowsRendered callback
    this._invokeOnGridRenderedHelper()
  }

  componentDidUpdate (prevProps, prevState) {
    const { columnsCount, columnWidth, height, rowHeight, rowsCount, scrollToColumn, scrollToRow, width } = this.props
    const { scrollLeft, scrollTop } = this.state

    // Make sure any changes to :scrollLeft or :scrollTop get applied
    if (
      (scrollLeft >= 0 && scrollLeft !== prevState.scrollLeft) ||
      (scrollTop >= 0 && scrollTop !== prevState.scrollTop)
    ) {
      this.refs.scrollingContainer.scrollLeft = scrollLeft
      this.refs.scrollingContainer.scrollTop = scrollTop
    }

    // Update scrollLeft if appropriate
    updateScrollIndexHelper({
      cellsCount: columnsCount,
      cellMetadata: this._columnMetadata,
      cellSize: columnWidth,
      previousCellsCount: prevProps.columnsCount,
      previousCellSize: prevProps.columnWidth,
      previousScrollToIndex: prevProps.scrollToColumn,
      previousSize: prevProps.width,
      scrollOffset: scrollLeft,
      scrollToIndex: scrollToColumn,
      size: width,
      updateScrollIndexCallback: this._updateScrollLeftForScrollToColumn
    })

    // Update scrollTop if appropriate
    updateScrollIndexHelper({
      cellsCount: rowsCount,
      cellMetadata: this._rowMetadata,
      cellSize: rowHeight,
      previousCellsCount: prevProps.rowsCount,
      previousCellSize: prevProps.rowHeight,
      previousScrollToIndex: prevProps.scrollToRow,
      previousSize: prevProps.height,
      scrollOffset: scrollTop,
      scrollToIndex: scrollToRow,
      size: height,
      updateScrollIndexCallback: this._updateScrollTopForScrollToRow
    })

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnGridRenderedHelper()
  }

  componentWillMount () {
    this._computeGridMetadata(this.props)
  }

  componentWillUnmount () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }
    if (this._setImmediateId) {
      clearImmediate(this._setImmediateId)
    }
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (
      nextProps.columnsCount === 0 &&
      nextState.scrollLeft !== 0
    ) {
      this.setState({ scrollLeft: 0 })
    }

    if (
      nextProps.rowsCount === 0 &&
      nextState.scrollTop !== 0
    ) {
      this.setState({ scrollTop: 0 })
    }

    computeCellMetadataAndUpdateScrollOffsetHelper({
      cellsCount: this.props.columnsCount,
      cellSize: this.props.columnWidth,
      computeMetadataCallback: this._computeGridMetadata,
      computeMetadataCallbackProps: nextProps,
      computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
      nextCellsCount: nextProps.columnsCount,
      nextCellSize: nextProps.columnWidth,
      nextScrollToIndex: nextProps.scrollToColumn,
      scrollToIndex: this.props.scrollToColumn,
      updateScrollOffsetForScrollToIndex: this._updateScrollLeftForScrollToColumn
    })

    computeCellMetadataAndUpdateScrollOffsetHelper({
      cellsCount: this.props.rowsCount,
      cellSize: this.props.rowHeight,
      computeMetadataCallback: this._computeGridMetadata,
      computeMetadataCallbackProps: nextProps,
      computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
      nextCellsCount: nextProps.rowsCount,
      nextCellSize: nextProps.rowHeight,
      nextScrollToIndex: nextProps.scrollToRow,
      scrollToIndex: this.props.scrollToRow,
      updateScrollOffsetForScrollToIndex: this._updateScrollTopForScrollToRow
    })

    this.setState({
      computeGridMetadataOnNextUpdate: false
    })
  }

  render () {
    const {
      className,
      columnsCount,
      height,
      noContentRenderer,
      overscanColumnsCount,
      overscanRowsCount,
      renderCell,
      rowsCount,
      width
    } = this.props

    const {
      isScrolling,
      scrollLeft,
      scrollTop
    } = this.state

    let childrenToDisplay = []

    // Render only enough columns and rows to cover the visible area of the grid.
    if (height > 0 && width > 0) {
      let {
        start: columnStartIndex,
        stop: columnStopIndex
      } = getVisibleCellIndices({
        cellsCount: columnsCount,
        cellMetadata: this._columnMetadata,
        containerSize: width,
        currentOffset: scrollLeft
      })

      let {
        start: rowStartIndex,
        stop: rowStopIndex
      } = getVisibleCellIndices({
        cellsCount: rowsCount,
        cellMetadata: this._rowMetadata,
        containerSize: height,
        currentOffset: scrollTop
      })

      // Store for :onSectionRendered callback in componentDidUpdate
      this._renderedColumnStartIndex = columnStartIndex
      this._renderedColumnStopIndex = columnStopIndex
      this._renderedRowStartIndex = rowStartIndex
      this._renderedRowStopIndex = rowStopIndex

      const overscanColumnIndices = getOverscanIndices({
        cellsCount: columnsCount,
        overscanCellsCount: overscanColumnsCount,
        startIndex: columnStartIndex,
        stopIndex: columnStopIndex
      })

      const overscanRowIndices = getOverscanIndices({
        cellsCount: rowsCount,
        overscanCellsCount: overscanRowsCount,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex
      })

      columnStartIndex = overscanColumnIndices.overscanStartIndex
      columnStopIndex = overscanColumnIndices.overscanStopIndex
      rowStartIndex = overscanRowIndices.overscanStartIndex
      rowStopIndex = overscanRowIndices.overscanStopIndex

      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        let rowDatum = this._rowMetadata[rowIndex]

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
          let columnDatum = this._columnMetadata[columnIndex]
          let child = renderCell({ columnIndex, rowIndex })

          child = (
            <div
              key={`row:${rowIndex}, column:${columnIndex}`}
              className='Grid__cell'
              style={{
                left: columnDatum.offset,
                top: rowDatum.offset,
                height: this._getRowHeight(rowIndex),
                width: this._getColumnWidth(columnIndex)
              }}
            >
              {child}
            </div>
          )

          childrenToDisplay.push(child)
        }
      }
    }

    return (
      <div
        ref='scrollingContainer'
        className={cn('Grid', className)}
        onKeyDown={this._onKeyPress}
        onScroll={this._onScroll}
        tabIndex={0}
        style={{
          height: height,
          width: width
        }}
      >
        {childrenToDisplay.length > 0 &&
          <div
            className='Grid__innerScrollContainer'
            style={{
              width: this._getTotalColumnsWidth(),
              height: this._getTotalRowsHeight(),
              maxWidth: this._getTotalColumnsWidth(),
              maxHeight: this._getTotalRowsHeight(),
              pointerEvents: isScrolling ? 'none' : 'auto'
            }}
          >
            {childrenToDisplay}
          </div>
        }
        {childrenToDisplay.length === 0 &&
          noContentRenderer()
        }
      </div>
    )
  }

  /* ---------------------------- Helper methods ---------------------------- */

  _computeGridMetadata (props) {
    const { columnsCount, columnWidth, rowHeight, rowsCount } = props

    this._columnMetadata = initCellMetadata({
      cellsCount: columnsCount,
      size: columnWidth
    })
    this._rowMetadata = initCellMetadata({
      cellsCount: rowsCount,
      size: rowHeight
    })
  }

  _getColumnWidth (index) {
    const { columnWidth } = this.props

    return columnWidth instanceof Function
      ? columnWidth(index)
      : columnWidth
  }

  _getRowHeight (index) {
    const { rowHeight } = this.props

    return rowHeight instanceof Function
      ? rowHeight(index)
      : rowHeight
  }

  _getTotalColumnsWidth () {
    if (this._columnMetadata.length === 0) {
      return 0
    }

    const datum = this._columnMetadata[this._columnMetadata.length - 1]
    return datum.offset + datum.size
  }

  _getTotalRowsHeight () {
    if (this._rowMetadata.length === 0) {
      return 0
    }

    const datum = this._rowMetadata[this._rowMetadata.length - 1]
    return datum.offset + datum.size
  }

  _invokeOnGridRenderedHelper () {
    const { columnsCount, onSectionRendered, overscanColumnsCount, overscanRowsCount, rowsCount } = this.props

    const {
      overscanStartIndex: columnOverscanStartIndex,
      overscanStopIndex: columnOverscanStopIndex
    } = getOverscanIndices({
      cellsCount: columnsCount,
      overscanCellsCount: overscanColumnsCount,
      startIndex: this._renderedColumnStartIndex,
      stopIndex: this._renderedColumnStopIndex
    })

    const {
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex
    } = getOverscanIndices({
      cellsCount: rowsCount,
      overscanCellsCount: overscanRowsCount,
      startIndex: this._renderedRowStartIndex,
      stopIndex: this._renderedRowStopIndex
    })

    this._onGridRenderedMemoizer({
      callback: onSectionRendered,
      indices: {
        columnOverscanStartIndex,
        columnOverscanStopIndex,
        columnStartIndex: this._renderedColumnStartIndex,
        columnStopIndex: this._renderedColumnStopIndex,
        rowOverscanStartIndex,
        rowOverscanStopIndex,
        rowStartIndex: this._renderedRowStartIndex,
        rowStopIndex: this._renderedRowStopIndex
      }
    })
  }

  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  _setNextState (state) {
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }

    this._setNextStateAnimationFrameId = raf(() => {
      this._setNextStateAnimationFrameId = null
      this.setState(state)
    })
  }

  _setNextStateForScrollHelper ({ scrollLeft, scrollTop }) {
    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    if (
      this.state.scrollLeft === scrollLeft &&
      this.state.scrollTop === scrollTop
    ) {
      return
    }

    // Prevent pointer events from interrupting a smooth scroll
    this._temporarilyDisablePointerEvents()

    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    this._setNextState({
      isScrolling: true,
      scrollLeft,
      scrollTop
    })
  }

  _stopEvent (event) {
    event.preventDefault()
  }

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Grid.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _temporarilyDisablePointerEvents () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    this._disablePointerEventsTimeoutId = setTimeout(() => {
      this._disablePointerEventsTimeoutId = null
      this.setState({
        isScrolling: false
      })
    }, IS_SCROLLING_TIMEOUT)
  }

  _updateScrollLeftForScrollToColumn (scrollToColumnOverride) {
    const scrollToColumn = scrollToColumnOverride != null
      ? scrollToColumnOverride
      : this.props.scrollToColumn

    const { width } = this.props
    const { scrollLeft } = this.state

    if (scrollToColumn >= 0) {
      const calculatedScrollLeft = getUpdatedOffsetForIndex({
        cellMetadata: this._columnMetadata,
        containerSize: width,
        currentOffset: scrollLeft,
        targetIndex: scrollToColumn
      })

      if (scrollLeft !== calculatedScrollLeft) {
        this.setState({ scrollLeft: calculatedScrollLeft })
      }
    }
  }

  _updateScrollTopForScrollToRow (scrollToRowOverride) {
    const scrollToRow = scrollToRowOverride != null
      ? scrollToRowOverride
      : this.props.scrollToRow

    const { height } = this.props
    const { scrollTop } = this.state

    if (scrollToRow >= 0) {
      const calculatedScrollTop = getUpdatedOffsetForIndex({
        cellMetadata: this._rowMetadata,
        containerSize: height,
        currentOffset: scrollTop,
        targetIndex: scrollToRow
      })

      if (scrollTop !== calculatedScrollTop) {
        this.setState({ scrollTop: calculatedScrollTop })
      }
    }
  }

  /* ---------------------------- Event handlers ---------------------------- */

  _onKeyPress (event) {
    const { columnsCount, height, rowsCount, width } = this.props
    const { scrollLeft, scrollTop } = this.state

    let start, datum, newScrollLeft, newScrollTop

    if (columnsCount === 0 || rowsCount === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: rowsCount,
          cellMetadata: this._rowMetadata,
          containerSize: height,
          currentOffset: scrollTop
        }).start
        datum = this._rowMetadata[start]
        newScrollTop = Math.min(
          this._getTotalRowsHeight() - height,
          scrollTop + datum.size
        )

        this.setState({
          scrollTop: newScrollTop
        })
        break
      case 'ArrowLeft':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: columnsCount,
          cellMetadata: this._columnMetadata,
          containerSize: width,
          currentOffset: scrollLeft
        }).start

        this.scrollToCell({
          scrollToColumn: Math.max(0, start - 1),
          scrollToRow: this.props.scrollToRow
        })
        break
      case 'ArrowRight':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: columnsCount,
          cellMetadata: this._columnMetadata,
          containerSize: width,
          currentOffset: scrollLeft
        }).start
        datum = this._columnMetadata[start]
        newScrollLeft = Math.min(
          this._getTotalColumnsWidth() - width,
          scrollLeft + datum.size
        )

        this.setState({
          scrollLeft: newScrollLeft
        })
        break
      case 'ArrowUp':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: rowsCount,
          cellMetadata: this._rowMetadata,
          containerSize: height,
          currentOffset: scrollTop
        }).start

        this.scrollToCell({
          scrollToColumn: this.props.scrollToColumn,
          scrollToRow: Math.max(0, start - 1)
        })
        break
    }
  }

  _onScroll (event) {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target !== this.refs.scrollingContainer) {
      return
    }

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
    const { height, onScroll, width } = this.props
    const totalRowsHeight = this._getTotalRowsHeight()
    const totalColumnsWidth = this._getTotalColumnsWidth()
    const scrollLeft = Math.min(totalColumnsWidth - width, event.target.scrollLeft)
    const scrollTop = Math.min(totalRowsHeight - height, event.target.scrollTop)

    this._setNextStateForScrollHelper({ scrollLeft, scrollTop })

    this._onScrollMemoizer({
      callback: ({ scrollLeft, scrollTop }) => {
        onScroll({
          clientHeight: height,
          clientWidth: width,
          scrollHeight: totalRowsHeight,
          scrollLeft,
          scrollTop,
          scrollWidth: totalColumnsWidth
        })
      },
      indices: {
        scrollLeft,
        scrollTop
      }
    })
  }
}
