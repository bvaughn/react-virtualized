/** @flow */
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import calculateSizeAndPositionDataAndUpdateScrollOffset from './utils/calculateSizeAndPositionDataAndUpdateScrollOffset'
import CellSizeAndPositionManager from './utils/CellSizeAndPositionManager'
import createCallbackMemoizer from '../utils/createCallbackMemoizer'
import getOverscanIndices from './utils/getOverscanIndices'
import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import getUpdatedOffsetForIndex from '../utils/getUpdatedOffsetForIndex'
import raf from 'raf'
import shallowCompare from 'react-addons-shallow-compare'
import updateScrollIndexHelper from './utils/updateScrollIndexHelper'
import defaultCellRangeRenderer from './defaultCellRangeRenderer'

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
  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Responsible for rendering a cell given an row and column index.
     * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
     */
    cellRenderer: PropTypes.func.isRequired,

    /**
     * Responsible for rendering a group of cells given their index ranges.
     * Should implement the following interface: ({
     *   cellCache: Map,
     *   cellRenderer: Function,
     *   columnSizeAndPositionManager: CellSizeAndPositionManager,
     *   columnStartIndex: number,
     *   columnStopIndex: number,
     *   isScrolling: boolean,
     *   rowSizeAndPositionManager: CellSizeAndPositionManager,
     *   rowStartIndex: number,
     *   rowStopIndex: number
     * }): Array<PropTypes.node>
     */
    cellRangeRenderer: PropTypes.func.isRequired,

    /**
     * Optional custom CSS class name to attach to root Grid element.
     */
    className: PropTypes.string,

    /**
     * Number of columns in grid.
     */
    columnCount: PropTypes.number.isRequired,

    /**
     * Either a fixed column width (number) or a function that returns the width of a column given its index.
     * Should implement the following interface: (index: number): number
     */
    columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Used to estimate the total width of a Grid before all of its columns have actually been measured.
     * The estimated total width is adjusted as columns are rendered.
     */
    estimatedColumnSize: PropTypes.number.isRequired,

    /**
     * Used to estimate the total height of a Grid before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize: PropTypes.number.isRequired,

    /**
     * Height of Grid; this property determines the number of visible (vs virtualized) rows.
     */
    height: PropTypes.number.isRequired,

    /**
     * Optional renderer to be used in place of rows when either :rowCount or :columnCount is 0.
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
    overscanColumnCount: PropTypes.number.isRequired,

    /**
     * Number of rows to render above/below the visible section of the grid.
     * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanRowCount: PropTypes.number.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * Should implement the following interface: ({ index: number }): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Number of rows in grid.
     */
    rowCount: PropTypes.number.isRequired,

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

    /** Optional inline style */
    style: PropTypes.object,

    /**
     * Width of Grid; this property determines the number of visible (vs virtualized) columns.
     */
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    'aria-label': 'grid',
    cellRangeRenderer: defaultCellRangeRenderer,
    estimatedColumnSize: 100,
    estimatedRowSize: 30,
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    overscanColumnCount: 0,
    overscanRowCount: 10,
    style: {}
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    }

    // Invokes onSectionRendered callback only when start/stop row or column indices change
    this._onGridRenderedMemoizer = createCallbackMemoizer()
    this._onScrollMemoizer = createCallbackMemoizer(false)

    // Bind functions to instance so they don't lose context when passed around
    this._invokeOnGridRenderedHelper = this._invokeOnGridRenderedHelper.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._updateScrollLeftForScrollToColumn = this._updateScrollLeftForScrollToColumn.bind(this)
    this._updateScrollTopForScrollToRow = this._updateScrollTopForScrollToRow.bind(this)

    this._columnWidthGetter = this._wrapSizeGetter(props.columnWidth)
    this._rowHeightGetter = this._wrapSizeGetter(props.rowHeight)

    this._columnSizeAndPositionManager = new CellSizeAndPositionManager({
      cellCount: props.columnCount,
      cellSizeGetter: (index) => this._columnWidthGetter(index),
      estimatedCellSize: this._getEstimatedColumnSize(props)
    })
    this._rowSizeAndPositionManager = new CellSizeAndPositionManager({
      cellCount: props.rowCount,
      cellSizeGetter: (index) => this._rowHeightGetter(index),
      estimatedCellSize: this._getEstimatedRowSize(props)
    })

    // See defaultCellRangeRenderer() for more information on the usage of this cache
    this._cellCache = {}

    this._scrollbarSize = getScrollbarSize()
  }

  /**
   * Forced recompute of row heights and column widths.
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since Grid only receives :columnCount and :rowCount it has no way of detecting when the underlying data changes.
   */
  recomputeGridSize () {
    this._columnSizeAndPositionManager.resetCell(0)
    this._rowSizeAndPositionManager.resetCell(0)
  }

  componentDidMount () {
    const { scrollLeft, scrollToColumn, scrollTop, scrollToRow } = this.props

    if (scrollLeft >= 0 || scrollTop >= 0) {
      this._setScrollPosition({ scrollLeft, scrollTop })
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
      totalColumnsWidth: this._columnSizeAndPositionManager.getTotalSize(),
      totalRowsHeight: this._rowSizeAndPositionManager.getTotalSize()
    })
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) New scroll-to-cell props have been set
   */
  componentDidUpdate (prevProps, prevState) {
    const { height, scrollToColumn, scrollToRow, width } = this.props
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

    // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
    // @TODO Do we also need this check or can the one in componentWillUpdate() suffice?
    updateScrollIndexHelper({
      cellSizeAndPositionManager: this._columnSizeAndPositionManager,
      previousCellsCount: prevProps.columnCount,
      previousCellSize: prevProps.columnWidth,
      previousScrollToIndex: prevProps.scrollToColumn,
      previousSize: prevProps.width,
      scrollOffset: scrollLeft,
      scrollToIndex: scrollToColumn,
      size: width,
      updateScrollIndexCallback: (scrollToColumn) => this._updateScrollLeftForScrollToColumn({ ...this.props, scrollToColumn })
    })
    updateScrollIndexHelper({
      cellSizeAndPositionManager: this._rowSizeAndPositionManager,
      previousCellsCount: prevProps.rowCount,
      previousCellSize: prevProps.rowHeight,
      previousScrollToIndex: prevProps.scrollToRow,
      previousSize: prevProps.height,
      scrollOffset: scrollTop,
      scrollToIndex: scrollToRow,
      size: height,
      updateScrollIndexCallback: (scrollToRow) => this._updateScrollTopForScrollToRow({ ...this.props, scrollToRow })
    })

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnGridRenderedHelper()
  }

  componentWillUnmount () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) Empty content (0 rows or columns)
   * 2) New scroll props overriding the current state
   * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
   */
  componentWillUpdate (nextProps, nextState) {
    if (
      nextProps.columnCount === 0 &&
      nextState.scrollLeft !== 0 ||
      nextProps.rowCount === 0 &&
      nextState.scrollTop !== 0
    ) {
      this._setScrollPosition({
        scrollLeft: 0,
        scrollTop: 0
      })
    } else if (
      nextProps.scrollLeft !== this.props.scrollLeft ||
      nextProps.scrollTop !== this.props.scrollTop
    ) {
      this._setScrollPosition({
        scrollLeft: nextProps.scrollLeft,
        scrollTop: nextProps.scrollTop
      })
    }

    this._columnWidthGetter = this._wrapSizeGetter(nextProps.columnWidth)
    this._rowHeightGetter = this._wrapSizeGetter(nextProps.rowHeight)

    this._columnSizeAndPositionManager.configure({
      cellCount: nextProps.columnCount,
      estimatedCellSize: this._getEstimatedColumnSize(nextProps)
    })
    this._rowSizeAndPositionManager.configure({
      cellCount: nextProps.rowCount,
      estimatedCellSize: this._getEstimatedRowSize(nextProps)
    })

    // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: this.props.columnCount,
      cellSize: this.props.columnWidth,
      computeMetadataCallback: () => this._columnSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.columnCount,
      nextCellSize: nextProps.columnWidth,
      nextScrollToIndex: nextProps.scrollToColumn,
      scrollToIndex: this.props.scrollToColumn,
      updateScrollOffsetForScrollToIndex: () => this._updateScrollLeftForScrollToColumn(nextProps, nextState)
    })
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: this.props.rowCount,
      cellSize: this.props.rowHeight,
      computeMetadataCallback: () => this._rowSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.rowCount,
      nextCellSize: nextProps.rowHeight,
      nextScrollToIndex: nextProps.scrollToRow,
      scrollToIndex: this.props.scrollToRow,
      updateScrollOffsetForScrollToIndex: () => this._updateScrollTopForScrollToRow(nextProps, nextState)
    })
  }

  render () {
    const {
      cellRenderer,
      cellRangeRenderer,
      className,
      columnCount,
      height,
      noContentRenderer,
      overscanColumnCount,
      overscanRowCount,
      rowCount,
      style,
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
      const visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange({
        containerSize: width,
        offset: scrollLeft
      })

      const visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange({
        containerSize: height,
        offset: scrollTop
      })

      // Store for _invokeOnGridRenderedHelper()
      this._renderedColumnStartIndex = visibleColumnIndices.start
      this._renderedColumnStopIndex = visibleColumnIndices.stop
      this._renderedRowStartIndex = visibleRowIndices.start
      this._renderedRowStopIndex = visibleRowIndices.stop

      const overscanColumnIndices = getOverscanIndices({
        cellCount: columnCount,
        overscanCellsCount: overscanColumnCount,
        startIndex: this._renderedColumnStartIndex,
        stopIndex: this._renderedColumnStopIndex
      })

      const overscanRowIndices = getOverscanIndices({
        cellCount: rowCount,
        overscanCellsCount: overscanRowCount,
        startIndex: this._renderedRowStartIndex,
        stopIndex: this._renderedRowStopIndex
      })

      // Store for _invokeOnGridRenderedHelper()
      this._columnStartIndex = overscanColumnIndices.overscanStartIndex
      this._columnStopIndex = overscanColumnIndices.overscanStopIndex
      this._rowStartIndex = overscanRowIndices.overscanStartIndex
      this._rowStopIndex = overscanRowIndices.overscanStopIndex

      childrenToDisplay = cellRangeRenderer({
        cellCache: this._cellCache,
        cellRenderer,
        columnSizeAndPositionManager: this._columnSizeAndPositionManager,
        columnStartIndex: this._columnStartIndex,
        columnStopIndex: this._columnStopIndex,
        isScrolling,
        rowSizeAndPositionManager: this._rowSizeAndPositionManager,
        rowStartIndex: this._rowStartIndex,
        rowStopIndex: this._rowStopIndex
      })
    }

    const gridStyle = {
      ...style,
      height,
      width
    }

    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    if (totalColumnsWidth + (totalRowsHeight > height ? this._scrollbarSize : 0) <= width) {
      gridStyle.overflowX = 'hidden'
    }

    if (totalRowsHeight + (totalColumnsWidth > width ? this._scrollbarSize : 0) <= height) {
      gridStyle.overflowY = 'hidden'
    }

    return (
      <div
        ref='scrollingContainer'
        aria-label={this.props['aria-label']}
        className={cn('Grid', className)}
        onScroll={this._onScroll}
        role='grid'
        style={gridStyle}
        tabIndex={0}
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

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /* ---------------------------- Helper methods ---------------------------- */

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

      // Throw away cell cache once scrolling is complete
      this._cellCache = {}

      this.setState({
        isScrolling: false
      })
    }, IS_SCROLLING_TIMEOUT)
  }

  _getEstimatedColumnSize (props) {
    return typeof props.columnWidth === 'number'
      ? props.columnWidth
      : props.estimatedColumnSize
  }

  _getEstimatedRowSize (props) {
    return typeof props.rowHeight === 'number'
      ? props.rowHeight
      : props.estimatedRowSize
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
    this._onScrollMemoizer({
      callback: ({ scrollLeft, scrollTop }) => {
        const { height, onScroll, width } = this.props

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

  _setScrollPosition ({ scrollLeft, scrollTop }) {
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

  _wrapSizeGetter (size) {
    return typeof size === 'function'
      ? size
      : () => size
  }

  _updateScrollLeftForScrollToColumn (props = null, state = null) {
    const { columnCount, scrollToColumn, width } = props || this.props
    const { scrollLeft } = state || this.state

    if (scrollToColumn >= 0 && columnCount > 0) {
      const targetIndex = Math.max(0, Math.min(columnCount - 1, scrollToColumn))

      const columnMetadatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(targetIndex)

      const calculatedScrollLeft = getUpdatedOffsetForIndex({
        cellOffset: columnMetadatum.offset,
        cellSize: columnMetadatum.size,
        containerSize: width,
        currentOffset: scrollLeft,
        targetIndex: scrollToColumn
      })

      if (scrollLeft !== calculatedScrollLeft) {
        this._setScrollPosition({
          scrollLeft: calculatedScrollLeft
        })
      }
    }
  }

  _updateScrollTopForScrollToRow (props = null, state = null) {
    const { height, rowCount, scrollToRow } = props || this.props
    const { scrollTop } = state || this.state

    if (scrollToRow >= 0 && rowCount > 0) {
      const targetIndex = Math.max(0, Math.min(rowCount - 1, scrollToRow))

      const rowMetadatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(targetIndex)

      const calculatedScrollTop = getUpdatedOffsetForIndex({
        cellOffset: rowMetadatum.offset,
        cellSize: rowMetadatum.size,
        containerSize: height,
        currentOffset: scrollTop,
        targetIndex: scrollToRow
      })

      if (scrollTop !== calculatedScrollTop) {
        this._setScrollPosition({
          scrollTop: calculatedScrollTop
        })
      }
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
    const scrollbarSize = this._scrollbarSize
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()
    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()
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
