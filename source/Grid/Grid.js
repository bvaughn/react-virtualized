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
import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
const IS_SCROLLING_TIMEOUT = 150

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
const SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: 'observed',
  REQUESTED: 'requested'
}

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
     * Number of columns to fix to the left of the grid while scrolling.
     */
    columnsLocked: PropTypes.number,

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
     * Number of rows to fix along the top of the grid while scrolling.
     */
    rowsLocked: PropTypes.number,

    /** Horizontal offset. */
    scrollLeft: PropTypes.number,

    /**
     * Column index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToColumn: PropTypes.number,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

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
    const newState = {
      scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
    }

    if (scrollLeft >= 0) {
      newState.scrollLeft = scrollLeft
    }

    if (scrollTop >= 0) {
      newState.scrollTop = scrollTop
    }

    if (
      scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft ||
      scrollTop >= 0 && scrollTop !== this.state.scrollTop
    ) {
      this.setState(newState)
    }
  }

  componentDidMount () {
    const { scrollLeft, scrollToColumn, scrollTop, scrollToRow } = this.props

    if (scrollLeft >= 0 || scrollTop >= 0) {
      this.setScrollPosition({ scrollLeft, scrollTop })
    }

    if (scrollToColumn >= 0 || scrollToRow >= 0) {
      this._updateScrollLeftForScrollToColumn()
      this._updateScrollTopForScrollToRow()
    }

    // Update onRowsRendered callback
    this._invokeOnGridRenderedHelper()

    // Initialize onScroll callback
    this._invokeOnScrollMemoizer({
      scrollLeft: scrollLeft || 0,
      scrollTop: scrollTop || 0,
      totalColumnsWidth: this._getTotalColumnsWidth(),
      totalRowsHeight: this._getTotalRowsHeight()
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { columnsCount, columnWidth, height, rowHeight, rowsCount, scrollToColumn, scrollToRow, width } = this.props
    const { scrollLeft, scrollPositionChangeReason, scrollTop } = this.state

    // Make sure requested changes to :scrollLeft or :scrollTop get applied.
    // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
    // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
    // So we only set these when we require an adjustment of the scroll position.
    // See issue #2 for more information.
    if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
      if (
        scrollLeft >= 0 &&
        scrollLeft !== prevState.scrollLeft &&
        scrollLeft !== this.refs.scrollingContainer.scrollLeft
      ) {
        this.refs.scrollingContainer.scrollLeft = scrollLeft
      }
      if (
        scrollTop >= 0 &&
        scrollTop !== prevState.scrollTop &&
        scrollTop !== this.refs.scrollingContainer.scrollTop
      ) {
        this.refs.scrollingContainer.scrollTop = scrollTop
      }
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

    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (
      nextProps.columnsCount === 0 &&
      nextState.scrollLeft !== 0
    ) {
      this.setScrollPosition({ scrollLeft: 0 })
    }

    if (
      nextProps.rowsCount === 0 &&
      nextState.scrollTop !== 0
    ) {
      this.setScrollPosition({ scrollTop: 0 })
    }

    if (nextProps.scrollLeft !== this.props.scrollLeft) {
      this.setScrollPosition({ scrollLeft: nextProps.scrollLeft })
    }

    if (nextProps.scrollTop !== this.props.scrollTop) {
      this.setScrollPosition({ scrollTop: nextProps.scrollTop })
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
      rowsCount,
      width,
      rowsLocked,
      columnsLocked
    } = this.props

    const {
      isScrolling,
      scrollLeft,
      scrollTop
    } = this.state

    let childrenToDisplay = []

    // Render only enough columns and rows to cover the visible area of the grid.
    if (height > 0 && width > 0) {
      const visibleColumnIndices = getVisibleCellIndices({
        cellsCount: columnsCount,
        cellsLocked: columnsLocked,
        cellMetadata: this._columnMetadata,
        containerSize: width,
        currentOffset: scrollLeft
      })

      const visibleRowIndices = getVisibleCellIndices({
        cellsCount: rowsCount,
        cellsLocked: rowsLocked,
        cellMetadata: this._rowMetadata,
        containerSize: height,
        currentOffset: scrollTop
      })

      // Store for _invokeOnGridRenderedHelper()
      this._renderedColumnStartIndex = visibleColumnIndices.start
      this._renderedColumnStopIndex = visibleColumnIndices.stop
      this._renderedRowStartIndex = visibleRowIndices.start
      this._renderedRowStopIndex = visibleRowIndices.stop

      const overscanColumnIndices = getOverscanIndices({
        cellsCount: columnsCount,
        cellsLocked: columnsLocked,
        overscanCellsCount: overscanColumnsCount,
        startIndex: this._renderedColumnStartIndex,
        stopIndex: this._renderedColumnStopIndex
      })

      const overscanRowIndices = getOverscanIndices({
        cellsCount: rowsCount,
        cellsLocked: rowsLocked,
        overscanCellsCount: overscanRowsCount,
        startIndex: this._renderedRowStartIndex,
        stopIndex: this._renderedRowStopIndex
      })

      // Store for _invokeOnGridRenderedHelper()
      this._columnStartIndex = overscanColumnIndices.overscanStartIndex
      this._columnStopIndex = overscanColumnIndices.overscanStopIndex
      this._rowStartIndex = overscanRowIndices.overscanStartIndex
      this._rowStopIndex = overscanRowIndices.overscanStopIndex

      let lockedOffset = scrollTop
      for (let rowIndex = 0; rowIndex < rowsLocked; rowIndex++) {
        this.renderColumns(childrenToDisplay, rowIndex, lockedOffset)
        lockedOffset += this._getRowHeight(rowIndex)
      }

      for (let rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) {
        this.renderColumns(childrenToDisplay, rowIndex, null)
      }
    }

    const gridStyle = {
      height: height,
      width: width
    }

    const totalColumnsWidth = this._getTotalColumnsWidth()
    const totalRowsHeight = this._getTotalRowsHeight()

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    if (totalColumnsWidth <= width) {
      gridStyle.overflowX = 'hidden'
    }

    if (totalRowsHeight <= height) {
      gridStyle.overflowY = 'hidden'
    }

    return (
      <div
        ref='scrollingContainer'
        className={cn('Grid', className)}
        onKeyDown={this._onKeyPress}
        onScroll={this._onScroll}
        tabIndex={0}
        style={gridStyle}
      >
        {childrenToDisplay.length > 0 &&
          <div
            className='Grid__innerScrollContainer'
            style={{
              width: totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
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

  renderColumns (childrenToDisplay, rowIndex, top) {
    let { columnsLocked } = this.props
    let lockedOffset = this.state.scrollLeft

    for (let columnIndex = 0; columnIndex < columnsLocked; columnIndex++) {
      let child = this.renderCell(columnIndex, rowIndex, lockedOffset, top)
      lockedOffset += this._getColumnWidth(columnIndex)

      childrenToDisplay.push(child)
    }

    for (let columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
      let child = this.renderCell(columnIndex, rowIndex, null, top)
      childrenToDisplay.push(child)
    }
  }

  renderCell (columnIndex, rowIndex, left, top) {
    let rowDatum = this._rowMetadata[rowIndex]
    let columnDatum = this._columnMetadata[columnIndex]
    let renderedCell = this.props.renderCell({ columnIndex, rowIndex })
    let key = `${rowIndex}-${columnIndex}`

    return (
      <div
        key={key}
        className={cn('Grid__cell', {
          'Grid__cell--locked-row': top != null,
          'Grid__cell--locked-column': left != null
        })}
        style={{
          height: this._getRowHeight(rowIndex),
          left: `${left || columnDatum.offset}px`,
          top: `${top || rowDatum.offset}px`,
          width: this._getColumnWidth(columnIndex)
        }}
      >
        {renderedCell}
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

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Grid.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _enablePointerEventsAfterDelay () {
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
    const { onSectionRendered } = this.props

    this._onGridRenderedMemoizer({
      callback: onSectionRendered,
      indices: {
        columnOverscanStartIndex: this._columnStartIndex,
        columnOverscanStopIndex: this._columnStopIndex,
        columnStartIndex: this._renderedColumnStartIndex,
        columnStopIndex: this._renderedColumnStopIndex,
        rowOverscanStartIndex: this._rowStartIndex,
        rowOverscanStopIndex: this._rowStopIndex,
        rowStartIndex: this._renderedRowStartIndex,
        rowStopIndex: this._renderedRowStopIndex
      }
    })
  }

  _invokeOnScrollMemoizer ({ scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight }) {
    const { height, onScroll, width } = this.props

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
        this.setScrollPosition({
          scrollLeft: calculatedScrollLeft
        })
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
        this.setScrollPosition({
          scrollTop: calculatedScrollTop
        })
      }
    }
  }

  /* ---------------------------- Event handlers ---------------------------- */

  _onKeyPress (event) {
    const { columnsCount, height, rowsCount, width } = this.props
    const { scrollLeft, scrollTop } = this.state

    let datum, newScrollLeft, newScrollTop

    if (columnsCount === 0 || rowsCount === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        datum = this._rowMetadata[this._renderedRowStartIndex]
        newScrollTop = Math.min(
          this._getTotalRowsHeight() - height,
          scrollTop + datum.size
        )

        this.setScrollPosition({
          scrollTop: newScrollTop
        })
        break
      case 'ArrowLeft':
        this.scrollToCell({
          scrollToColumn: Math.max(0, this._renderedColumnStartIndex - 1),
          scrollToRow: this.props.scrollToRow
        })
        break
      case 'ArrowRight':
        datum = this._columnMetadata[this._renderedColumnStartIndex]
        newScrollLeft = Math.min(
          this._getTotalColumnsWidth() - width,
          scrollLeft + datum.size
        )

        this.setScrollPosition({
          scrollLeft: newScrollLeft
        })
        break
      case 'ArrowUp':
        this.scrollToCell({
          scrollToColumn: this.props.scrollToColumn,
          scrollToRow: Math.max(0, this._renderedRowStartIndex - 1)
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

    // Prevent pointer events from interrupting a smooth scroll
    this._enablePointerEventsAfterDelay()

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
    const { height, width } = this.props
    const scrollbarSize = getScrollbarSize()
    const totalRowsHeight = this._getTotalRowsHeight()
    const totalColumnsWidth = this._getTotalColumnsWidth()
    const scrollLeft = Math.min(totalColumnsWidth - width + scrollbarSize, event.target.scrollLeft)
    const scrollTop = Math.min(totalRowsHeight - height + scrollbarSize, event.target.scrollTop)

    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    if (
      this.state.scrollLeft !== scrollLeft ||
      this.state.scrollTop !== scrollTop
    ) {
      // Browsers with cancelable scroll events (eg. Firefox) interrupt scrolling animations if scrollTop/scrollLeft is set.
      // Other browsers (eg. Safari) don't scroll as well without the help under certain conditions (DOM or style changes during scrolling).
      // All things considered, this seems to be the best current work around that I'm aware of.
      // For more information see https://github.com/bvaughn/react-virtualized/pull/124
      const scrollPositionChangeReason = event.cancelable
        ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED
        : SCROLL_POSITION_CHANGE_REASONS.REQUESTED

      if (!this.state.isScrolling) {
        this.setState({
          isScrolling: true
        })
      }

      this._setNextState({
        isScrolling: true,
        scrollLeft,
        scrollPositionChangeReason,
        scrollTop
      })
    }

    this._invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight })
  }
}
