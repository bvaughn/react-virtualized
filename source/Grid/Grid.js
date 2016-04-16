/** @flow */
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import calculateSizeAndPositionDataAndUpdateScrollOffset from './utils/calculateSizeAndPositionDataAndUpdateScrollOffset'
import createCallbackMemoizer from '../utils/createCallbackMemoizer'
import getNearestIndex from './utils/getNearestIndex'
import getOverscanIndices from './utils/getOverscanIndices'
import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import getUpdatedOffsetForIndex from '../utils/getUpdatedOffsetForIndex'
import getVisibleCellIndices from './utils/getVisibleCellIndices'
import initCellMetadata from '../utils/initCellMetadata'
import raf from 'raf'
import shallowCompare from 'react-addons-shallow-compare'
import updateScrollIndexHelper from './utils/updateScrollIndexHelper'

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
     * Responsible for rendering a group of cells given their index ranges.
     * Should implement the following interface: ({
     *   columnMetadata:Array<Object>,
     *   columnStartIndex: number,
     *   columnStopIndex: number,
     *   renderCell: Function,
     *   rowMetadata:Array<Object>,
     *   rowStartIndex: number,
     *   rowStopIndex: number
     * }): Array<PropTypes.node>
     */
    renderCellRanges: PropTypes.func.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * Should implement the following interface: (index: number): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Number of rows in grid.
     */
    rowsCount: PropTypes.number.isRequired,

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
    'aria-label': 'grid',
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    overscanColumnsCount: 0,
    overscanRowsCount: 10,
    renderCellRanges: defaultRenderCellRanges
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
    this._computeColumnMetadata = this._computeColumnMetadata.bind(this)
    this._computeRowMetadata = this._computeRowMetadata.bind(this)
    this._invokeOnGridRenderedHelper = this._invokeOnGridRenderedHelper.bind(this)
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

  componentDidMount () {
    const { scrollLeft, scrollToColumn, scrollTop, scrollToRow } = this.props

    this._scrollbarSize = getScrollbarSize()

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
      totalColumnsWidth: this._getTotalColumnsWidth(),
      totalRowsHeight: this._getTotalRowsHeight()
    })
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) New scroll-to-cell props have been set
   */
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

    // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
    updateScrollIndexHelper({
      cellCount: columnsCount,
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
    updateScrollIndexHelper({
      cellCount: rowsCount,
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
    this._computeColumnMetadata(this.props)
    this._computeRowMetadata(this.props)
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
      nextProps.columnsCount === 0 &&
      nextState.scrollLeft !== 0 ||
      nextProps.rowsCount === 0 &&
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

    // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: this.props.columnsCount,
      cellSize: this.props.columnWidth,
      computeMetadataCallback: this._computeColumnMetadata,
      computeMetadataCallbackProps: nextProps,
      computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
      nextCellsCount: nextProps.columnsCount,
      nextCellSize: nextProps.columnWidth,
      nextScrollToIndex: nextProps.scrollToColumn,
      scrollToIndex: this.props.scrollToColumn,
      updateScrollOffsetForScrollToIndex: this._updateScrollLeftForScrollToColumn
    })
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: this.props.rowsCount,
      cellSize: this.props.rowHeight,
      computeMetadataCallback: this._computeRowMetadata,
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
      renderCellRanges,
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
      const visibleColumnIndices = getVisibleCellIndices({
        cellCount: columnsCount,
        cellMetadata: this._columnMetadata,
        containerSize: width,
        currentOffset: scrollLeft
      })

      const visibleRowIndices = getVisibleCellIndices({
        cellCount: rowsCount,
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
        cellCount: columnsCount,
        overscanCellsCount: overscanColumnsCount,
        startIndex: this._renderedColumnStartIndex,
        stopIndex: this._renderedColumnStopIndex
      })

      const overscanRowIndices = getOverscanIndices({
        cellCount: rowsCount,
        overscanCellsCount: overscanRowsCount,
        startIndex: this._renderedRowStartIndex,
        stopIndex: this._renderedRowStopIndex
      })

      // Store for _invokeOnGridRenderedHelper()
      this._columnStartIndex = overscanColumnIndices.overscanStartIndex
      this._columnStopIndex = overscanColumnIndices.overscanStopIndex
      this._rowStartIndex = overscanRowIndices.overscanStartIndex
      this._rowStopIndex = overscanRowIndices.overscanStopIndex

      childrenToDisplay = renderCellRanges({
        columnMetadata: this._columnMetadata,
        columnStartIndex: this._columnStartIndex,
        columnStopIndex: this._columnStopIndex,
        renderCell,
        rowMetadata: this._rowMetadata,
        rowStartIndex: this._rowStartIndex,
        rowStopIndex: this._rowStopIndex
      })
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

  _computeColumnMetadata (props) {
    const { columnsCount, columnWidth } = props

    this._columnMetadata = initCellMetadata({
      cellCount: columnsCount,
      size: columnWidth
    })
  }

  _computeRowMetadata (props) {
    const { rowHeight, rowsCount } = props

    this._rowMetadata = initCellMetadata({
      cellCount: rowsCount,
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

  _updateScrollLeftForScrollToColumn (scrollToColumnOverride) {
    const scrollToColumn = scrollToColumnOverride != null
      ? scrollToColumnOverride
      : this.props.scrollToColumn

    const { width } = this.props
    const { scrollLeft } = this.state

    if (scrollToColumn >= 0) {
      const targetIndex = getNearestIndex({
        cellCount: this._columnMetadata.length,
        targetIndex: scrollToColumn
      })
      const columnMetadata = this._columnMetadata[targetIndex]

      const calculatedScrollLeft = getUpdatedOffsetForIndex({
        cellOffset: columnMetadata.offset,
        cellSize: columnMetadata.size,
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

  _updateScrollTopForScrollToRow (scrollToRowOverride) {
    const scrollToRow = scrollToRowOverride != null
      ? scrollToRowOverride
      : this.props.scrollToRow

    const { height } = this.props
    const { scrollTop } = this.state

    if (scrollToRow >= 0) {
      const targetIndex = getNearestIndex({
        cellCount: this._rowMetadata.length,
        targetIndex: scrollToRow
      })
      const rowMetadata = this._rowMetadata[targetIndex]

      const calculatedScrollTop = getUpdatedOffsetForIndex({
        cellOffset: rowMetadata.offset,
        cellSize: rowMetadata.size,
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

function defaultRenderCellRanges ({
  columnMetadata,
  columnStartIndex,
  columnStopIndex,
  renderCell,
  rowMetadata,
  rowStartIndex,
  rowStopIndex
}) {
  const renderedCells = []

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    let rowDatum = rowMetadata[rowIndex]

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      let columnDatum = columnMetadata[columnIndex]
      let renderedCell = renderCell({ columnIndex, rowIndex })
      let key = `${rowIndex}-${columnIndex}`

      // any other falsey value will be rendered
      // as a text node by React
      if (renderedCell == null || renderedCell === false) {
        continue
      }

      let child = (
        <div
          key={key}
          className='Grid__cell'
          style={{
            height: rowDatum.size,
            left: columnDatum.offset,
            top: rowDatum.offset,
            width: columnDatum.size
          }}
        >
          {renderedCell}
        </div>
      )

      renderedCells.push(child)
    }
  }

  return renderedCells
}
