/** @flow */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import calculateSizeAndPositionDataAndUpdateScrollOffset from './utils/calculateSizeAndPositionDataAndUpdateScrollOffset'
import ScalingCellSizeAndPositionManager from './utils/ScalingCellSizeAndPositionManager'
import createCallbackMemoizer from '../utils/createCallbackMemoizer'
import defaultOverscanIndicesGetter, { SCROLL_DIRECTION_BACKWARD, SCROLL_DIRECTION_FORWARD } from './defaultOverscanIndicesGetter'
import updateScrollIndexHelper from './utils/updateScrollIndexHelper'
import defaultCellRangeRenderer from './defaultCellRangeRenderer'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import defaultKeyMapper from '../utils/defaultKeyMapper'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150

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
export default class Grid extends PureComponent {
  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Set the width of the inner scrollable container to 'auto'.
     * This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar.
     */
    autoContainerWidth: PropTypes.bool,

    /**
     * Removes fixed height from the scrollingContainer so that the total height of rows can stretch the window.
     * Intended for use with WindowScroller
     */
    autoHeight: PropTypes.bool,

    /**
     * Removes fixed width from the scrollingContainer so that the total width of rows can stretch the window.
     * Intended for use with WindowScroller
     */
    autoWidth: PropTypes.bool,

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
     *   rowStopIndex: number,
     *   scrollLeft: number,
     *   scrollTop: number
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

    /** Optional inline style applied to inner cell-container */
    containerStyle: PropTypes.object,

    /**
     * If CellMeasurer is used to measure this Grid's children, this should be a pointer to its CellMeasurerCache.
     * A shared CellMeasurerCache reference enables Grid and CellMeasurer to share measurement data.
     */
    deferredMeasurementCache: PropTypes.object,

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
     * Exposed for testing purposes only.
     */
    getScrollbarSize: PropTypes.func.isRequired,

    /**
     * Height of Grid; this property determines the number of visible (vs virtualized) rows.
     */
    height: PropTypes.number.isRequired,

    /**
     * Optional custom id to attach to root Grid element.
     */
    id: PropTypes.string,

    /**
     * Override internal is-scrolling state tracking.
     * This property is primarily intended for use with the WindowScroller component.
     */
    isScrolling: PropTypes.bool,

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
     * Calculates the number of cells to overscan before and after a specified range.
     * This function ensures that overscanning doesn't exceed the available cells.
     * Should implement the following interface: ({
     *   cellCount: number,
     *   overscanCellsCount: number,
     *   scrollDirection: number,
     *   startIndex: number,
     *   stopIndex: number
     * }): {overscanStartIndex: number, overscanStopIndex: number}
     */
    overscanIndicesGetter: PropTypes.func.isRequired,

    /**
     * Number of rows to render above/below the visible section of the grid.
     * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanRowCount: PropTypes.number.isRequired,

    /**
     * ARIA role for the grid element.
     */
    role: PropTypes.string,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * Should implement the following interface: ({ index: number }): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /**
     * Number of rows in grid.
     */
    rowCount: PropTypes.number.isRequired,

    /** Wait this amount of time after the last scroll event before resetting Grid `pointer-events`. */
    scrollingResetTimeInterval: PropTypes.number,

    /** Horizontal offset. */
    scrollLeft: PropTypes.number,

    /**
     * Controls scroll-to-cell behavior of the Grid.
     * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
     * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
     */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

    /**
     * Column index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToColumn: PropTypes.number.isRequired,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /**
     * Row index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToRow: PropTypes.number.isRequired,

    /** Optional inline style */
    style: PropTypes.object,

    /** Tab index for focus */
    tabIndex: PropTypes.number,

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
    getScrollbarSize: scrollbarSize,
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    overscanColumnCount: 0,
    overscanIndicesGetter: defaultOverscanIndicesGetter,
    overscanRowCount: 10,
    role: 'grid',
    scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
    scrollToAlignment: 'auto',
    scrollToColumn: -1,
    scrollToRow: -1,
    style: {},
    tabIndex: 0
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      isScrolling: false,
      scrollDirectionHorizontal: SCROLL_DIRECTION_FORWARD,
      scrollDirectionVertical: SCROLL_DIRECTION_FORWARD,
      scrollLeft: 0,
      scrollTop: 0
    }

    // Invokes onSectionRendered callback only when start/stop row or column indices change
    this._onGridRenderedMemoizer = createCallbackMemoizer()
    this._onScrollMemoizer = createCallbackMemoizer(false)

    // Bind functions to instance so they don't lose context when passed around
    this._debounceScrollEndedCallback = this._debounceScrollEndedCallback.bind(this)
    this._invokeOnGridRenderedHelper = this._invokeOnGridRenderedHelper.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._setScrollingContainerRef = this._setScrollingContainerRef.bind(this)

    this._columnWidthGetter = this._wrapSizeGetter(props.columnWidth)
    this._rowHeightGetter = this._wrapSizeGetter(props.rowHeight)

    this._deferredInvalidateColumnIndex = null
    this._deferredInvalidateRowIndex = null
    this._recomputeScrollLeftFlag = false
    this._recomputeScrollTopFlag = false

    const deferredMeasurementCache = props.deferredMeasurementCache
    const deferredMode = typeof deferredMeasurementCache !== 'undefined'

    this._keyMapper = deferredMode ? deferredMeasurementCache._keyMapper : defaultKeyMapper

    this._columnSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      batchAllCells: deferredMode && !deferredMeasurementCache.hasFixedHeight(),
      cellCount: props.columnCount,
      cellSizeGetter: (params) => this._columnWidthGetter(params),
      estimatedCellSize: this._getEstimatedColumnSize(props)
    })
    this._rowSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      batchAllCells: deferredMode && !deferredMeasurementCache.hasFixedWidth(),
      cellCount: props.rowCount,
      cellSizeGetter: (params) => this._rowHeightGetter(params),
      estimatedCellSize: this._getEstimatedRowSize(props)
    })

    // See defaultCellRangeRenderer() for more information on the usage of these caches
    this._cellCache = {}
    this._styleCache = {}
  }

  /**
   * Gets offsets for a given cell and alignment.
   */
  getOffsetForCell ({
    alignment = this.props.scrollToAlignment,
    columnIndex = this.props.scrollToColumn,
    rowIndex = this.props.scrollToRow
  } = {}) {
    const offsetProps = {
      ...this.props,
      scrollToAlignment: alignment,
      scrollToColumn: columnIndex,
      scrollToRow: rowIndex
    }

    return {
      scrollLeft: this._getCalculatedScrollLeft(offsetProps),
      scrollTop: this._getCalculatedScrollTop(offsetProps)
    }
  }

  /**
   * Invalidate Grid size and recompute visible cells.
   * This is a deferred wrapper for recomputeGridSize().
   * It sets a flag to be evaluated on cDM/cDU to avoid unnecessary renders.
   * This method is intended for advanced use-cases like CellMeasurer.
   */
  // @TODO (bvaughn) Add automated test coverage for this.
  invalidateCellSizeAfterRender ({
    columnIndex,
    rowIndex
  }) {
    this._deferredInvalidateColumnIndex = typeof this._deferredInvalidateColumnIndex === 'number'
      ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
      : columnIndex
    this._deferredInvalidateRowIndex = typeof this._deferredInvalidateRowIndex === 'number'
      ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
      : rowIndex
  }

  /**
   * Pre-measure all columns and rows in a Grid.
   * Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
   * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
   */
  measureAllCells () {
    const { columnCount, rowCount } = this.props

    this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnCount - 1)
    this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowCount - 1)
  }

  /**
   * Forced recompute of row heights and column widths.
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since Grid only receives :columnCount and :rowCount it has no way of detecting when the underlying data changes.
   */
  recomputeGridSize ({
    columnIndex = 0,
    rowIndex = 0
  } = {}) {
    const { scrollToColumn, scrollToRow } = this.props

    this._columnSizeAndPositionManager.resetCell(columnIndex)
    this._rowSizeAndPositionManager.resetCell(rowIndex)

    // Cell sizes may be determined by a function property.
    // In this case the cDU handler can't know if they changed.
    // Store this flag to let the next cDU pass know it needs to recompute the scroll offset.
    this._recomputeScrollLeftFlag = scrollToColumn >= 0 && columnIndex <= scrollToColumn
    this._recomputeScrollTopFlag = scrollToRow >= 0 && rowIndex <= scrollToRow

    // Clear cell cache in case we are scrolling;
    // Invalid row heights likely mean invalid cached content as well.
    this._cellCache = {}
    this._styleCache = {}

    this.forceUpdate()
  }

  /**
   * Ensure column and row are visible.
   */
  scrollToCell ({
    columnIndex,
    rowIndex
  }) {
    const { columnCount } = this.props

    const props = this.props

    // Don't adjust scroll offset for single-column grids (eg List, Table).
    // This can cause a funky scroll offset because of the vertical scrollbar width.
    if (columnCount > 1) {
      this._updateScrollLeftForScrollToColumn({
        ...props,
        scrollToColumn: columnIndex
      })
    }

    this._updateScrollTopForScrollToRow({
      ...props,
      scrollToRow: rowIndex
    })
  }

  /**
   * Scroll to the specified offset(s).
   * Useful for animating position changes.
   */
  scrollToPosition ({
    scrollLeft,
    scrollTop
  } = {}) {
    this._setScrollPosition({ scrollLeft, scrollTop })
  }

  componentDidMount () {
    const { getScrollbarSize, scrollLeft, scrollToColumn, scrollTop, scrollToRow } = this.props

    // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
    // We must do this at the start of the method as we may calculate and update scroll position below.
    this._handleInvalidatedGridSize()

    // If this component was first rendered server-side, scrollbar size will be undefined.
    // In that event we need to remeasure.
    if (!this._scrollbarSizeMeasured) {
      this._scrollbarSize = getScrollbarSize()
      this._scrollbarSizeMeasured = true
      this.setState({})
    }

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
    const { autoHeight, autoWidth, columnCount, height, rowCount, scrollToAlignment, scrollToColumn, scrollToRow, width } = this.props
    const { scrollLeft, scrollPositionChangeReason, scrollTop } = this.state

    // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
    // We must do this at the start of the method as we may calculate and update scroll position below.
    this._handleInvalidatedGridSize()

    // Handle edge case where column or row count has only just increased over 0.
    // In this case we may have to restore a previously-specified scroll offset.
    // For more info see bvaughn/react-virtualized/issues/218
    const columnOrRowCountJustIncreasedFromZero = (
      columnCount > 0 &&
      prevProps.columnCount === 0 ||
      rowCount > 0 &&
      prevProps.rowCount === 0
    )

    // Make sure requested changes to :scrollLeft or :scrollTop get applied.
    // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
    // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
    // So we only set these when we require an adjustment of the scroll position.
    // See issue #2 for more information.
    if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
      // @TRICKY :autoHeight and :autoWidth properties instructs Grid to leave :scrollTop and :scrollLeft management to an external HOC (eg WindowScroller).
      // In this case we should avoid checking scrollingContainer.scrollTop and scrollingContainer.scrollLeft since it forces layout/flow.
      if (
        !autoWidth &&
        scrollLeft >= 0 &&
        (
          scrollLeft !== prevState.scrollLeft &&
          scrollLeft !== this._scrollingContainer.scrollLeft ||
          columnOrRowCountJustIncreasedFromZero
        )
      ) {
        this._scrollingContainer.scrollLeft = scrollLeft
      }
      if (
        !autoHeight &&
        scrollTop >= 0 &&
        (
          scrollTop !== prevState.scrollTop &&
          scrollTop !== this._scrollingContainer.scrollTop ||
          columnOrRowCountJustIncreasedFromZero
        )
      ) {
        this._scrollingContainer.scrollTop = scrollTop
      }
    }

    // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
    // @TODO Do we also need this check or can the one in componentWillUpdate() suffice?
    if (this._recomputeScrollLeftFlag) {
      this._recomputeScrollLeftFlag = false
      this._updateScrollLeftForScrollToColumn(this.props)
    } else {
      updateScrollIndexHelper({
        cellSizeAndPositionManager: this._columnSizeAndPositionManager,
        previousCellsCount: prevProps.columnCount,
        previousCellSize: prevProps.columnWidth,
        previousScrollToAlignment: prevProps.scrollToAlignment,
        previousScrollToIndex: prevProps.scrollToColumn,
        previousSize: prevProps.width,
        scrollOffset: scrollLeft,
        scrollToAlignment,
        scrollToIndex: scrollToColumn,
        size: width,
        updateScrollIndexCallback: (scrollToColumn) => this._updateScrollLeftForScrollToColumn(this.props)
      })
    }

    if (this._recomputeScrollTopFlag) {
      this._recomputeScrollTopFlag = false
      this._updateScrollTopForScrollToRow(this.props)
    } else {
      updateScrollIndexHelper({
        cellSizeAndPositionManager: this._rowSizeAndPositionManager,
        previousCellsCount: prevProps.rowCount,
        previousCellSize: prevProps.rowHeight,
        previousScrollToAlignment: prevProps.scrollToAlignment,
        previousScrollToIndex: prevProps.scrollToRow,
        previousSize: prevProps.height,
        scrollOffset: scrollTop,
        scrollToAlignment,
        scrollToIndex: scrollToRow,
        size: height,
        updateScrollIndexCallback: (scrollToRow) => this._updateScrollTopForScrollToRow(this.props)
      })
    }

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnGridRenderedHelper()

    // Changes to :scrollLeft or :scrollTop should also notify :onScroll listeners
    if (
      scrollLeft !== prevState.scrollLeft ||
      scrollTop !== prevState.scrollTop
    ) {
      const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()
      const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()

      this._invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight })
    }
  }

  componentWillMount () {
    const { getScrollbarSize } = this.props

    // If this component is being rendered server-side, getScrollbarSize() will return undefined.
    // We handle this case in componentDidMount()
    this._scrollbarSize = getScrollbarSize()
    if (this._scrollbarSize === undefined) {
      this._scrollbarSizeMeasured = false
      this._scrollbarSize = 0
    } else {
      this._scrollbarSizeMeasured = true
    }

    this._calculateChildrenToRender()
  }

  componentWillUnmount () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) Empty content (0 rows or columns)
   * 2) New scroll props overriding the current state
   * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
   */
  componentWillReceiveProps (nextProps) {
    const { scrollLeft, scrollTop } = this.state

    if (
      nextProps.columnCount === 0 &&
      scrollLeft !== 0 ||
      nextProps.rowCount === 0 &&
      scrollTop !== 0
    ) {
      this._setScrollPosition({
        scrollLeft: 0,
        scrollTop: 0
      })
    } else if (
      nextProps.scrollLeft !== this.props.scrollLeft ||
      nextProps.scrollTop !== this.props.scrollTop
    ) {
      const newState = {}

      if (nextProps.scrollLeft != null) {
        newState.scrollLeft = nextProps.scrollLeft
      }
      if (nextProps.scrollTop != null) {
        newState.scrollTop = nextProps.scrollTop
      }

      this._setScrollPosition(newState)
    }

    if (
      nextProps.columnWidth !== this.props.columnWidth ||
      nextProps.rowHeight !== this.props.rowHeight
    ) {
      this._styleCache = {}
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

    let { columnCount, rowCount } = this.props

    // Special case when either cols or rows were 0
    // This would prevent any cells from rendering
    // So we need to reset row scroll if cols changed from 0 (and vice versa)
    if (
      columnCount === 0 ||
      rowCount === 0
    ) {
      columnCount = 0
      rowCount = 0
    }

    // If scrolling is controlled outside this component, clear cache when scrolling stops
    if (
      nextProps.autoHeight &&
      nextProps.isScrolling === false &&
      this.props.isScrolling === true
    ) {
      this._resetStyleCache()
    }

    // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: columnCount,
      cellSize: this.props.columnWidth,
      computeMetadataCallback: () => this._columnSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.columnCount,
      nextCellSize: nextProps.columnWidth,
      nextScrollToIndex: nextProps.scrollToColumn,
      scrollToIndex: this.props.scrollToColumn,
      updateScrollOffsetForScrollToIndex: () => this._updateScrollLeftForScrollToColumn(nextProps, this.state)
    })
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: rowCount,
      cellSize: this.props.rowHeight,
      computeMetadataCallback: () => this._rowSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.rowCount,
      nextCellSize: nextProps.rowHeight,
      nextScrollToIndex: nextProps.scrollToRow,
      scrollToIndex: this.props.scrollToRow,
      updateScrollOffsetForScrollToIndex: () => this._updateScrollTopForScrollToRow(nextProps, this.state)
    })
  }

  componentWillUpdate (nextProps, nextState) {
    this._calculateChildrenToRender(nextProps, nextState)
  }

  render () {
    const {
      autoContainerWidth,
      autoHeight,
      autoWidth,
      className,
      containerStyle,
      height,
      id,
      noContentRenderer,
      role,
      style,
      tabIndex,
      width
    } = this.props

    const isScrolling = this._isScrolling()

    const gridStyle = {
      boxSizing: 'border-box',
      direction: 'ltr',
      height: autoHeight ? 'auto' : height,
      position: 'relative',
      width: autoWidth ? 'auto' : width,
      WebkitOverflowScrolling: 'touch',
      willChange: 'transform'
    }

    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0
    const horizontalScrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0

    // Also explicitly init styles to 'auto' if scrollbars are required.
    // This works around an obscure edge case where external CSS styles have not yet been loaded,
    // But an initial scroll index of offset is set as an external prop.
    // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
    // This was originally reported via clauderic/react-infinite-calendar/issues/23
    gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize <= width
      ? 'hidden'
      : 'auto'
    gridStyle.overflowY = totalRowsHeight + horizontalScrollBarSize <= height
      ? 'hidden'
      : 'auto'

    const childrenToDisplay = this._childrenToDisplay

    const showNoContentRenderer = (
      childrenToDisplay.length === 0 &&
      height > 0 &&
      width > 0
    )

    return (
      <div
        ref={this._setScrollingContainerRef}
        aria-label={this.props['aria-label']}
        className={cn('ReactVirtualized__Grid', className)}
        id={id}
        onScroll={this._onScroll}
        role={role}
        style={{
          ...gridStyle,
          ...style
        }}
        tabIndex={tabIndex}
      >
        {childrenToDisplay.length > 0 &&
          <div
            className='ReactVirtualized__Grid__innerScrollContainer'
            style={{
              width: autoContainerWidth ? 'auto' : totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              position: 'relative',
              ...containerStyle
            }}
          >
            {childrenToDisplay}
          </div>
        }
        {showNoContentRenderer &&
          noContentRenderer()
        }
      </div>
    )
  }

  /* ---------------------------- Helper methods ---------------------------- */

  _calculateChildrenToRender (props = this.props, state = this.state) {
    const {
      cellRenderer,
      cellRangeRenderer,
      columnCount,
      deferredMeasurementCache,
      height,
      overscanColumnCount,
      overscanIndicesGetter,
      overscanRowCount,
      rowCount,
      width
    } = props

    const {
      scrollDirectionHorizontal,
      scrollDirectionVertical,
      scrollLeft,
      scrollTop
    } = state

    const isScrolling = this._isScrolling(props, state)

    this._childrenToDisplay = []

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

      const horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment({
        containerSize: width,
        offset: scrollLeft
      })
      const verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment({
        containerSize: height,
        offset: scrollTop
      })

      // Store for _invokeOnGridRenderedHelper()
      this._renderedColumnStartIndex = visibleColumnIndices.start
      this._renderedColumnStopIndex = visibleColumnIndices.stop
      this._renderedRowStartIndex = visibleRowIndices.start
      this._renderedRowStopIndex = visibleRowIndices.stop

      const overscanColumnIndices = overscanIndicesGetter({
        direction: 'horizontal',
        cellCount: columnCount,
        overscanCellsCount: overscanColumnCount,
        scrollDirection: scrollDirectionHorizontal,
        startIndex: this._renderedColumnStartIndex,
        stopIndex: this._renderedColumnStopIndex
      })

      const overscanRowIndices = overscanIndicesGetter({
        direction: 'vertical',
        cellCount: rowCount,
        overscanCellsCount: overscanRowCount,
        scrollDirection: scrollDirectionVertical,
        startIndex: this._renderedRowStartIndex,
        stopIndex: this._renderedRowStopIndex
      })

      // Store for _invokeOnGridRenderedHelper()
      this._columnStartIndex = overscanColumnIndices.overscanStartIndex
      this._columnStopIndex = overscanColumnIndices.overscanStopIndex
      this._rowStartIndex = overscanRowIndices.overscanStartIndex
      this._rowStopIndex = overscanRowIndices.overscanStopIndex

      this._childrenToDisplay = cellRangeRenderer({
        cellCache: this._cellCache,
        cellRenderer,
        columnSizeAndPositionManager: this._columnSizeAndPositionManager,
        columnStartIndex: this._columnStartIndex,
        columnStopIndex: this._columnStopIndex,
        deferredMeasurementCache,
        horizontalOffsetAdjustment,
        isScrolling,
        keyMapper: this._keyMapper,
        parent: this,
        rowSizeAndPositionManager: this._rowSizeAndPositionManager,
        rowStartIndex: this._rowStartIndex,
        rowStopIndex: this._rowStopIndex,
        scrollLeft,
        scrollTop,
        styleCache: this._styleCache,
        verticalOffsetAdjustment,
        visibleColumnIndices,
        visibleRowIndices
      })
    }
  }

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Grid.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _debounceScrollEnded () {
    const { scrollingResetTimeInterval } = this.props

    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    this._disablePointerEventsTimeoutId = setTimeout(
      this._debounceScrollEndedCallback,
      scrollingResetTimeInterval
    )
  }

  _debounceScrollEndedCallback () {
    this._disablePointerEventsTimeoutId = null
    this._resetStyleCache()
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

  /**
   * Check for batched CellMeasurer size invalidations.
   * This will occur the first time one or more previously unmeasured cells are rendered.
   */
  _handleInvalidatedGridSize () {
    if (typeof this._deferredInvalidateColumnIndex === 'number') {
      const columnIndex = this._deferredInvalidateColumnIndex
      const rowIndex = this._deferredInvalidateRowIndex

      this._deferredInvalidateColumnIndex = null
      this._deferredInvalidateRowIndex = null

      this.recomputeGridSize({ columnIndex, rowIndex })
    }
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

  _isScrolling (props = this.props, state = this.state) {
    // If isScrolling is defined in props, use it to override the value in state
    // This is a performance optimization for WindowScroller + Grid
    return Object.hasOwnProperty.call(props, 'isScrolling')
      ? props.isScrolling
      : state.isScrolling
  }

  _setScrollingContainerRef (ref) {
    this._scrollingContainer = ref
  }

  _setScrollPosition ({ scrollLeft, scrollTop }) {
    const newState = {
      scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
    }

    if (scrollLeft >= 0) {
      newState.scrollDirectionHorizontal = scrollLeft > this.state.scrollLeft
        ? SCROLL_DIRECTION_FORWARD
        : SCROLL_DIRECTION_BACKWARD
      newState.scrollLeft = scrollLeft
    }

    if (scrollTop >= 0) {
      newState.scrollDirectionVertical = scrollTop > this.state.scrollTop
        ? SCROLL_DIRECTION_FORWARD
        : SCROLL_DIRECTION_BACKWARD
      newState.scrollTop = scrollTop
    }

    if (
      scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft ||
      scrollTop >= 0 && scrollTop !== this.state.scrollTop
    ) {
      this.setState(newState)
    }
  }

  _wrapPropertyGetter (value) {
    return typeof value === 'function'
      ? value
      : () => value
  }

  _wrapSizeGetter (size) {
    return this._wrapPropertyGetter(size)
  }

  _getCalculatedScrollLeft (props = this.props, state = this.state) {
    const { columnCount, height, scrollToAlignment, scrollToColumn, width } = props
    const { scrollLeft } = state

    if (scrollToColumn >= 0 && columnCount > 0) {
      const targetIndex = Math.max(0, Math.min(columnCount - 1, scrollToColumn))
      const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()
      const scrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0

      return this._columnSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: scrollToAlignment,
        containerSize: width - scrollBarSize,
        currentOffset: scrollLeft,
        targetIndex
      })
    }
  }

  _updateScrollLeftForScrollToColumn (props = this.props, state = this.state) {
    const { scrollLeft } = state
    const calculatedScrollLeft = this._getCalculatedScrollLeft(props, state)

    if (calculatedScrollLeft >= 0 && scrollLeft !== calculatedScrollLeft) {
      this._setScrollPosition({
        scrollLeft: calculatedScrollLeft
      })
    }
  }

  _getCalculatedScrollTop (props = this.props, state = this.state) {
    const { height, rowCount, scrollToAlignment, scrollToRow, width } = props
    const { scrollTop } = state

    if (scrollToRow >= 0 && rowCount > 0) {
      const targetIndex = Math.max(0, Math.min(rowCount - 1, scrollToRow))
      const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()
      const scrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0

      return this._rowSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: scrollToAlignment,
        containerSize: height - scrollBarSize,
        currentOffset: scrollTop,
        targetIndex
      })
    }
  }

  _resetStyleCache () {
    const styleCache = this._styleCache

    // Reset cell and style caches once scrolling stops.
    // This makes Grid simpler to use (since cells commonly change).
    // And it keeps the caches from growing too large.
    // Performance is most sensitive when a user is scrolling.
    this._cellCache = {}
    this._styleCache = {}

    // Copy over the visible cell styles so avoid unnecessary re-render.
    for (let rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) {
      for (let columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
        let key = this._keyMapper(rowIndex, columnIndex)
        this._styleCache[key] = styleCache[key]
      }
    }

    this.setState({
      isScrolling: false
    })
  }

  _updateScrollTopForScrollToRow (props = this.props, state = this.state) {
    const { scrollTop } = state
    const calculatedScrollTop = this._getCalculatedScrollTop(props, state)

    if (calculatedScrollTop >= 0 && scrollTop !== calculatedScrollTop) {
      this._setScrollPosition({
        scrollTop: calculatedScrollTop
      })
    }
  }

  _onScroll (event) {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target !== this._scrollingContainer) {
      return
    }

    // On iOS, we can arrive at negative offsets by swiping past the start.
    // To prevent flicker here, we make playing in the negative offset zone cause nothing to happen.
    if (event.target.scrollTop < 0) {
      return
    }

    // Prevent pointer events from interrupting a smooth scroll
    this._debounceScrollEnded()

    const { autoHeight, autoWidth, height, width } = this.props

    const {
      scrollLeft: eventScrollLeft,
      scrollTop: eventScrollTop
    } = event.target

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
    const scrollbarSize = this._scrollbarSize
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize()
    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize()
    const scrollLeft = Math.min(Math.max(0, totalColumnsWidth - width + scrollbarSize), eventScrollLeft)
    const scrollTop = Math.min(Math.max(0, totalRowsHeight - height + scrollbarSize), eventScrollTop)

    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    if (
      this.state.scrollLeft !== scrollLeft ||
      this.state.scrollTop !== scrollTop
    ) {
      // Track scrolling direction so we can more efficiently overscan rows to reduce empty space around the edges while scrolling.
      // Don't change direction for an axis unless scroll offset has changed.
      const scrollDirectionHorizontal = scrollLeft !== this.state.scrollLeft
        ? scrollLeft > this.state.scrollLeft
          ? SCROLL_DIRECTION_FORWARD
          : SCROLL_DIRECTION_BACKWARD
        : this.state.scrollDirectionHorizontal
      const scrollDirectionVertical = scrollTop !== this.state.scrollTop
        ? scrollTop > this.state.scrollTop
          ? SCROLL_DIRECTION_FORWARD
          : SCROLL_DIRECTION_BACKWARD
        : this.state.scrollDirectionVertical

      const newState = {
        isScrolling: true,
        scrollDirectionHorizontal,
        scrollDirectionVertical,
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.OBSERVED
      }

      if (!autoHeight) {
        newState.scrollTop = scrollTop
      }
      if (!autoWidth) {
        newState.scrollLeft = scrollLeft
      }

      this.setState(newState)
    }

    this._invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight })
  }
}
