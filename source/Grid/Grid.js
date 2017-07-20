/** @flow */

import type { CellSizeGetter, Alignment } from "./types.js";

import React, { PureComponent } from "react";
import cn from "classnames";
import calculateSizeAndPositionDataAndUpdateScrollOffset from "./utils/calculateSizeAndPositionDataAndUpdateScrollOffset";
import ScalingCellSizeAndPositionManager from "./utils/ScalingCellSizeAndPositionManager";
import createCallbackMemoizer from "../utils/createCallbackMemoizer";
import defaultOverscanIndicesGetter, {
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FORWARD
} from "./defaultOverscanIndicesGetter";
import updateScrollIndexHelper from "./utils/updateScrollIndexHelper";
import defaultCellRangeRenderer from "./defaultCellRangeRenderer";
import scrollbarSize from "dom-helpers/util/scrollbarSize";

/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
const SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: "observed",
  REQUESTED: "requested"
};

type ScrollPosition = { scrollTop: number, scrollLeft: number };

type CellPosition = { columnIndex: number, rowIndex: number };

type CellRenderer = (props: CellPosition) => React.Element<*>;

type Props = {
  "aria-label": string,
  "aria-readonly": boolean,

  /**
   * Set the width of the inner scrollable container to 'auto'.
   * This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar.
   */
  autoContainerWidth: boolean,

  /**
   * Removes fixed height from the scrollingContainer so that the total height of rows can stretch the window.
   * Intended for use with WindowScroller
   */
  autoHeight: boolean,

  /**
   * Removes fixed width from the scrollingContainer so that the total width of rows can stretch the window.
   * Intended for use with WindowScroller
   */
  autoWidth: boolean,

  /**
   * Responsible for rendering a cell given an row and column index.
   */
  cellRenderer: CellRenderer,

  /**
   * Responsible for rendering a group of cells given their index ranges.
   */
  cellRangeRenderer: (params: {
    cellCache: Object,
    cellRenderer: CellRenderer,
    columnSizeAndPositionManager: ScalingCellSizeAndPositionManager,
    columnStartIndex: number,
    columnStopIndex: number,
    isScrolling: boolean,
    rowSizeAndPositionManager: ScalingCellSizeAndPositionManager,
    rowStartIndex: number,
    rowStopIndex: number,
    scrollLeft: number,
    scrollTop: number
  }) => React.Element<*>[],
  /**
   * Optional custom CSS class name to attach to root Grid element.
   */
  className?: string,

  /**
   * Number of columns in grid.
   */
  columnCount: number,

  /**
   * Either a fixed column width (number) or a function that returns the width of a column given its index.
   */
  columnWidth: CellSizeGetter | number,

  /**
   * ARIA role for the cell-container.
   */
  containerRole: string,

  /** Optional inline style applied to inner cell-container */
  containerStyle?: Object,

  /**
   * If CellMeasurer is used to measure this Grid's children, this should be a pointer to its CellMeasurerCache.
   * A shared CellMeasurerCache reference enables Grid and CellMeasurer to share measurement data.
   */
  deferredMeasurementCache?: Object,

  /**
   * Used to estimate the total width of a Grid before all of its columns have actually been measured.
   * The estimated total width is adjusted as columns are rendered.
   */
  estimatedColumnSize: number,

  /**
   * Used to estimate the total height of a Grid before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize: number,

  /**
   * Exposed for testing purposes only.
   */
  getScrollbarSize: () => number,

  /**
   * Height of Grid; this property determines the number of visible (vs virtualized) rows.
   */
  height: number,

  /**
   * Optional custom id to attach to root Grid element.
   */
  id?: string,

  /**
   * Override internal is-scrolling state tracking.
   * This property is primarily intended for use with the WindowScroller component.
   */
  isScrolling?: boolean,

  /**
   * Optional renderer to be used in place of rows when either :rowCount or :columnCount is 0.
   */
  noContentRenderer: () => React.Element<*> | null,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll: (params: {
    clientHeight: number,
    clientWidth: number,
    scrollHeight: number,
    scrollLeft: number,
    scrollTop: number,
    scrollWidth: number
  }) => void,

  /**
   * Called whenever a horizontal or vertical scrollbar is added or removed.
   * This prop is not intended for end-user use;
   * It is used by MultiGrid to support fixed-row/fixed-column scroll syncing.
   */
  onScrollbarPresenceChange: (params: {
    horizontal: boolean,
    vertical: boolean,
    size: number
  }) => void,

  /**
   * Callback invoked with information about the section of the Grid that was just rendered.
   */
  onSectionRendered: (params: {
    columnStartIndex: number,
    columnStopIndex: number,
    rowStartIndex: number,
    rowStopIndex: number
  }) => void,

  /**
   * Number of columns to render before/after the visible section of the grid.
   * These columns can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
   */
  overscanColumnCount: number,

  /**
   * Calculates the number of cells to overscan before and after a specified range.
   * This function ensures that overscanning doesn't exceed the available cells.
   */
  overscanIndicesGetter: (params: {
    cellCount: number,
    overscanCellsCount: number,
    scrollDirection: number,
    startIndex: number,
    stopIndex: number
  }) => {
    overscanStartIndex: number,
    overscanStopIndex: number
  },

  /**
   * Number of rows to render above/below the visible section of the grid.
   * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
   */
  overscanRowCount: number,

  /**
   * ARIA role for the grid element.
   */
  role: string,

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index.
   * Should implement the following interface: ({ index: number }): number
   */
  rowHeight: CellSizeGetter | number,

  /**
   * Number of rows in grid.
   */
  rowCount: number,

  /** Wait this amount of time after the last scroll event before resetting Grid `pointer-events`. */
  scrollingResetTimeInterval: number,

  /** Horizontal offset. */
  scrollLeft: number,

  /**
   * Controls scroll-to-cell behavior of the Grid.
   * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
   * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
   */
  scrollToAlignment: Alignment,

  /**
   * Column index to ensure visible (by forcefully scrolling if necessary)
   */
  scrollToColumn: number,

  /** Vertical offset. */
  scrollTop: number,

  /**
   * Row index to ensure visible (by forcefully scrolling if necessary)
   */
  scrollToRow: number,

  /** Optional inline style */
  style: Object,

  /** Tab index for focus */
  tabIndex: number,

  /**
   * Width of Grid; this property determines the number of visible (vs virtualized) columns.
   */
  width: number
};

type State = {
  isScrolling: boolean,
  scrollDirectionHorizontal: -1 | 1,
  scrollDirectionVertical: -1 | 1,
  scrollLeft: number,
  scrollTop: number,
  scrollPositionChangeReason?: "observed" | "requested"
};

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 */
export default class Grid extends PureComponent {
  static defaultProps = {
    "aria-label": "grid",
    "aria-readonly": true,
    cellRangeRenderer: defaultCellRangeRenderer,
    containerRole: "rowgroup",
    estimatedColumnSize: 100,
    estimatedRowSize: 30,
    getScrollbarSize: scrollbarSize,
    noContentRenderer: () => null,
    onScroll: () => null,
    onScrollbarPresenceChange: () => null,
    onSectionRendered: () => null,
    overscanColumnCount: 0,
    overscanIndicesGetter: defaultOverscanIndicesGetter,
    overscanRowCount: 10,
    role: "grid",
    scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
    scrollToAlignment: "auto",
    scrollToColumn: -1,
    scrollToRow: -1,
    style: {},
    tabIndex: 0
  };

  props: Props;

  state: State = {
    isScrolling: false,
    scrollDirectionHorizontal: SCROLL_DIRECTION_FORWARD,
    scrollDirectionVertical: SCROLL_DIRECTION_FORWARD,
    scrollLeft: 0,
    scrollTop: 0
  };

  // Invokes onSectionRendered callback only when start/stop row or column indices change
  _onGridRenderedMemoizer = createCallbackMemoizer();
  _onScrollMemoizer = createCallbackMemoizer(false);

  _deferredInvalidateColumnIndex = null;
  _deferredInvalidateRowIndex = null;
  _recomputeScrollLeftFlag = false;
  _recomputeScrollTopFlag = false;

  _horizontalScrollBarSize = 0;
  _verticalScrollBarSize = 0;
  _scrollbarPresenceChanged = false;

  _columnWidthGetter: CellSizeGetter;
  _rowHeightGetter: CellSizeGetter;

  _columnSizeAndPositionManager: ScalingCellSizeAndPositionManager;
  _rowSizeAndPositionManager: ScalingCellSizeAndPositionManager;

  // See defaultCellRangeRenderer() for more information on the usage of these caches
  _cellCache = {};
  _styleCache = {};

  _scrollbarSize: number;
  _scrollbarSizeMeasured = false;
  _scrollingContainer: Element;

  _childrenToDisplay: React.Element<*>[];

  _renderedColumnStartIndex = 0;
  _renderedColumnStopIndex = 0;
  _renderedRowStartIndex = 0;
  _renderedRowStopIndex = 0;

  _columnStartIndex: number;
  _columnStopIndex: number;
  _rowStartIndex: number;
  _rowStopIndex: number;

  _disablePointerEventsTimeoutId: ?number;
  _scrollDebounceStart: number;

  constructor(props: Props) {
    super(props);

    this._columnWidthGetter = this._wrapSizeGetter(props.columnWidth);
    this._rowHeightGetter = this._wrapSizeGetter(props.rowHeight);

    const deferredMeasurementCache = props.deferredMeasurementCache;

    this._columnSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      batchAllCells:
        deferredMeasurementCache !== undefined &&
        !deferredMeasurementCache.hasFixedHeight(),
      cellCount: props.columnCount,
      cellSizeGetter: params => this._columnWidthGetter(params),
      estimatedCellSize: this._getEstimatedColumnSize(props)
    });
    this._rowSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      batchAllCells:
        deferredMeasurementCache !== undefined &&
        !deferredMeasurementCache.hasFixedWidth(),
      cellCount: props.rowCount,
      cellSizeGetter: params => this._rowHeightGetter(params),
      estimatedCellSize: this._getEstimatedRowSize(props)
    });
  }

  /**
   * Gets offsets for a given cell and alignment.
   */
  getOffsetForCell(
    {
      alignment = this.props.scrollToAlignment,
      columnIndex = this.props.scrollToColumn,
      rowIndex = this.props.scrollToRow
    }: {
      alignment: Alignment,
      columnIndex: number,
      rowIndex: number
    } = {}
  ) {
    const offsetProps = {
      ...this.props,
      scrollToAlignment: alignment,
      scrollToColumn: columnIndex,
      scrollToRow: rowIndex
    };

    return {
      scrollLeft: this._getCalculatedScrollLeft(offsetProps),
      scrollTop: this._getCalculatedScrollTop(offsetProps)
    };
  }

  /**
   * This method handles a scroll event originating from an external scroll control.
   * It's an advanced method and should probably not be used unless you're implementing a custom scroll-bar solution.
   */
  handleScrollEvent({
    scrollLeft: scrollLeftParam = 0,
    scrollTop: scrollTopParam = 0
  }: ScrollPosition) {
    // On iOS, we can arrive at negative offsets by swiping past the start.
    // To prevent flicker here, we make playing in the negative offset zone cause nothing to happen.
    if (scrollTopParam < 0) {
      return;
    }

    // Prevent pointer events from interrupting a smooth scroll
    this._debounceScrollEnded();

    const { autoHeight, autoWidth, height, width } = this.props;

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
    const scrollbarSize = this._scrollbarSize;
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
    const scrollLeft = Math.min(
      Math.max(0, totalColumnsWidth - width + scrollbarSize),
      scrollLeftParam
    );
    const scrollTop = Math.min(
      Math.max(0, totalRowsHeight - height + scrollbarSize),
      scrollTopParam
    );

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
      const scrollDirectionHorizontal =
        scrollLeft !== this.state.scrollLeft
          ? scrollLeft > this.state.scrollLeft
            ? SCROLL_DIRECTION_FORWARD
            : SCROLL_DIRECTION_BACKWARD
          : this.state.scrollDirectionHorizontal;
      const scrollDirectionVertical =
        scrollTop !== this.state.scrollTop
          ? scrollTop > this.state.scrollTop
            ? SCROLL_DIRECTION_FORWARD
            : SCROLL_DIRECTION_BACKWARD
          : this.state.scrollDirectionVertical;

      const newState: Object = {
        isScrolling: true,
        scrollDirectionHorizontal,
        scrollDirectionVertical,
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.OBSERVED
      };

      if (!autoHeight) {
        newState.scrollTop = scrollTop;
      }

      if (!autoWidth) {
        newState.scrollLeft = scrollLeft;
      }

      this.setState(newState);
    }

    this._invokeOnScrollMemoizer({
      scrollLeft,
      scrollTop,
      totalColumnsWidth,
      totalRowsHeight
    });
  }

  /**
   * Invalidate Grid size and recompute visible cells.
   * This is a deferred wrapper for recomputeGridSize().
   * It sets a flag to be evaluated on cDM/cDU to avoid unnecessary renders.
   * This method is intended for advanced use-cases like CellMeasurer.
   */
  // @TODO (bvaughn) Add automated test coverage for this.
  invalidateCellSizeAfterRender({ columnIndex, rowIndex }: CellPosition) {
    this._deferredInvalidateColumnIndex =
      typeof this._deferredInvalidateColumnIndex === "number"
        ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
        : columnIndex;
    this._deferredInvalidateRowIndex =
      typeof this._deferredInvalidateRowIndex === "number"
        ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
        : rowIndex;
  }

  /**
   * Pre-measure all columns and rows in a Grid.
   * Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
   * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
   */
  measureAllCells() {
    const { columnCount, rowCount } = this.props;

    this._columnSizeAndPositionManager.getSizeAndPositionOfCell(
      columnCount - 1
    );
    this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowCount - 1);
  }

  /**
   * Forced recompute of row heights and column widths.
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since Grid only receives :columnCount and :rowCount it has no way of detecting when the underlying data changes.
   */
  recomputeGridSize({ columnIndex = 0, rowIndex = 0 }: CellPosition = {}) {
    const { scrollToColumn, scrollToRow } = this.props;

    this._columnSizeAndPositionManager.resetCell(columnIndex);
    this._rowSizeAndPositionManager.resetCell(rowIndex);

    // Cell sizes may be determined by a function property.
    // In this case the cDU handler can't know if they changed.
    // Store this flag to let the next cDU pass know it needs to recompute the scroll offset.
    this._recomputeScrollLeftFlag =
      scrollToColumn >= 0 && columnIndex <= scrollToColumn;
    this._recomputeScrollTopFlag = scrollToRow >= 0 && rowIndex <= scrollToRow;

    // Clear cell cache in case we are scrolling;
    // Invalid row heights likely mean invalid cached content as well.
    this._cellCache = {};
    this._styleCache = {};

    this.forceUpdate();
  }

  /**
   * Ensure column and row are visible.
   */
  scrollToCell({ columnIndex, rowIndex }: CellPosition) {
    const { columnCount } = this.props;

    const props = this.props;

    // Don't adjust scroll offset for single-column grids (eg List, Table).
    // This can cause a funky scroll offset because of the vertical scrollbar width.
    if (columnCount > 1) {
      this._updateScrollLeftForScrollToColumn({
        ...props,
        scrollToColumn: columnIndex
      });
    }

    this._updateScrollTopForScrollToRow({
      ...props,
      scrollToRow: rowIndex
    });
  }

  /**
   * Scroll to the specified offset(s).
   * Useful for animating position changes.
   */
  scrollToPosition({ scrollLeft, scrollTop }: ScrollPosition = {}) {
    this._setScrollPosition({ scrollLeft, scrollTop });
  }

  componentDidMount() {
    const {
      getScrollbarSize,
      height,
      scrollLeft,
      scrollToColumn,
      scrollTop,
      scrollToRow,
      width
    } = this.props;

    // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
    // We must do this at the start of the method as we may calculate and update scroll position below.
    this._handleInvalidatedGridSize();

    // If this component was first rendered server-side, scrollbar size will be undefined.
    // In that event we need to remeasure.
    if (!this._scrollbarSizeMeasured) {
      this._scrollbarSize = getScrollbarSize();
      this._scrollbarSizeMeasured = true;
      this.setState({});
    }

    if (scrollLeft >= 0 || scrollTop >= 0) {
      this._setScrollPosition({ scrollLeft, scrollTop });
    }

    // Don't update scroll offset if the size is 0; we don't render any cells in this case.
    // Setting a state may cause us to later thing we've updated the offce when we haven't.
    const sizeIsBiggerThanZero = height > 0 && width > 0;
    if (scrollToColumn >= 0 && sizeIsBiggerThanZero) {
      this._updateScrollLeftForScrollToColumn();
    }
    if (scrollToRow >= 0 && sizeIsBiggerThanZero) {
      this._updateScrollTopForScrollToRow();
    }

    // Update onRowsRendered callback
    this._invokeOnGridRenderedHelper();

    // Initialize onScroll callback
    this._invokeOnScrollMemoizer({
      scrollLeft: scrollLeft || 0,
      scrollTop: scrollTop || 0,
      totalColumnsWidth: this._columnSizeAndPositionManager.getTotalSize(),
      totalRowsHeight: this._rowSizeAndPositionManager.getTotalSize()
    });

    this._maybeCallOnScrollbarPresenceChange();
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) New scroll-to-cell props have been set
   */
  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      autoHeight,
      autoWidth,
      columnCount,
      height,
      rowCount,
      scrollToAlignment,
      scrollToColumn,
      scrollToRow,
      width
    } = this.props;
    const { scrollLeft, scrollPositionChangeReason, scrollTop } = this.state;

    // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
    // We must do this at the start of the method as we may calculate and update scroll position below.
    this._handleInvalidatedGridSize();

    // Handle edge case where column or row count has only just increased over 0.
    // In this case we may have to restore a previously-specified scroll offset.
    // For more info see bvaughn/react-virtualized/issues/218
    const columnOrRowCountJustIncreasedFromZero =
      (columnCount > 0 && prevProps.columnCount === 0) ||
      (rowCount > 0 && prevProps.rowCount === 0);

    // Make sure requested changes to :scrollLeft or :scrollTop get applied.
    // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
    // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
    // So we only set these when we require an adjustment of the scroll position.
    // See issue #2 for more information.
    if (
      scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED
    ) {
      // @TRICKY :autoHeight and :autoWidth properties instructs Grid to leave :scrollTop and :scrollLeft management to an external HOC (eg WindowScroller).
      // In this case we should avoid checking scrollingContainer.scrollTop and scrollingContainer.scrollLeft since it forces layout/flow.
      if (
        !autoWidth &&
        scrollLeft >= 0 &&
        ((scrollLeft !== prevState.scrollLeft &&
          scrollLeft !== this._scrollingContainer.scrollLeft) ||
          columnOrRowCountJustIncreasedFromZero)
      ) {
        this._scrollingContainer.scrollLeft = scrollLeft;
      }
      if (
        !autoHeight &&
        scrollTop >= 0 &&
        ((scrollTop !== prevState.scrollTop &&
          scrollTop !== this._scrollingContainer.scrollTop) ||
          columnOrRowCountJustIncreasedFromZero)
      ) {
        this._scrollingContainer.scrollTop = scrollTop;
      }
    }

    // Special case where the previous size was 0:
    // In this case we don't show any windowed cells at all.
    // So we should always recalculate offset afterwards.
    const sizeJustIncreasedFromZero =
      (prevProps.width === 0 || prevProps.height === 0) &&
      (height > 0 && width > 0);

    // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
    // @TODO Do we also need this check or can the one in componentWillUpdate() suffice?
    if (this._recomputeScrollLeftFlag) {
      this._recomputeScrollLeftFlag = false;
      this._updateScrollLeftForScrollToColumn(this.props);
    } else {
      updateScrollIndexHelper({
        cellSizeAndPositionManager: this._columnSizeAndPositionManager,
        previousCellsCount: prevProps.columnCount,
        previousCellSize:
          typeof prevProps.columnWidth === "number"
            ? prevProps.columnWidth
            : null,
        previousScrollToAlignment: prevProps.scrollToAlignment,
        previousScrollToIndex: prevProps.scrollToColumn,
        previousSize: prevProps.width,
        scrollOffset: scrollLeft,
        scrollToAlignment,
        scrollToIndex: scrollToColumn,
        size: width,
        sizeJustIncreasedFromZero,
        updateScrollIndexCallback: () =>
          this._updateScrollLeftForScrollToColumn(this.props)
      });
    }

    if (this._recomputeScrollTopFlag) {
      this._recomputeScrollTopFlag = false;
      this._updateScrollTopForScrollToRow(this.props);
    } else {
      updateScrollIndexHelper({
        cellSizeAndPositionManager: this._rowSizeAndPositionManager,
        previousCellsCount: prevProps.rowCount,
        previousCellSize:
          typeof prevProps.rowHeight === "number" ? prevProps.rowHeight : null,
        previousScrollToAlignment: prevProps.scrollToAlignment,
        previousScrollToIndex: prevProps.scrollToRow,
        previousSize: prevProps.height,
        scrollOffset: scrollTop,
        scrollToAlignment,
        scrollToIndex: scrollToRow,
        size: height,
        sizeJustIncreasedFromZero,
        updateScrollIndexCallback: () =>
          this._updateScrollTopForScrollToRow(this.props)
      });
    }

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnGridRenderedHelper();

    // Changes to :scrollLeft or :scrollTop should also notify :onScroll listeners
    if (
      scrollLeft !== prevState.scrollLeft ||
      scrollTop !== prevState.scrollTop
    ) {
      const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
      const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();

      this._invokeOnScrollMemoizer({
        scrollLeft,
        scrollTop,
        totalColumnsWidth,
        totalRowsHeight
      });
    }

    this._maybeCallOnScrollbarPresenceChange();
  }

  componentWillMount() {
    const { getScrollbarSize } = this.props;

    // If this component is being rendered server-side, getScrollbarSize() will return undefined.
    // We handle this case in componentDidMount()
    this._scrollbarSize = getScrollbarSize();
    if (this._scrollbarSize === undefined) {
      this._scrollbarSizeMeasured = false;
      this._scrollbarSize = 0;
    } else {
      this._scrollbarSizeMeasured = true;
    }

    this._calculateChildrenToRender();
  }

  componentWillUnmount() {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId);
    }
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) Empty content (0 rows or columns)
   * 2) New scroll props overriding the current state
   * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
   */
  componentWillReceiveProps(nextProps: Props) {
    const { scrollLeft, scrollTop } = this.state;

    if (
      (nextProps.columnCount === 0 && scrollLeft !== 0) ||
      (nextProps.rowCount === 0 && scrollTop !== 0)
    ) {
      this._setScrollPosition({
        scrollLeft: 0,
        scrollTop: 0
      });
    } else if (
      nextProps.scrollLeft !== this.props.scrollLeft ||
      nextProps.scrollTop !== this.props.scrollTop
    ) {
      const newState = {};

      if (nextProps.scrollLeft != null) {
        newState.scrollLeft = nextProps.scrollLeft;
      }
      if (nextProps.scrollTop != null) {
        newState.scrollTop = nextProps.scrollTop;
      }

      this._setScrollPosition(newState);
    }

    if (
      nextProps.columnWidth !== this.props.columnWidth ||
      nextProps.rowHeight !== this.props.rowHeight
    ) {
      this._styleCache = {};
    }

    this._columnWidthGetter = this._wrapSizeGetter(nextProps.columnWidth);
    this._rowHeightGetter = this._wrapSizeGetter(nextProps.rowHeight);

    this._columnSizeAndPositionManager.configure({
      cellCount: nextProps.columnCount,
      estimatedCellSize: this._getEstimatedColumnSize(nextProps)
    });
    this._rowSizeAndPositionManager.configure({
      cellCount: nextProps.rowCount,
      estimatedCellSize: this._getEstimatedRowSize(nextProps)
    });

    let { columnCount, rowCount } = this.props;

    // Special case when either cols or rows were 0
    // This would prevent any cells from rendering
    // So we need to reset row scroll if cols changed from 0 (and vice versa)
    if (columnCount === 0 || rowCount === 0) {
      columnCount = 0;
      rowCount = 0;
    }

    // If scrolling is controlled outside this component, clear cache when scrolling stops
    if (
      nextProps.autoHeight &&
      nextProps.isScrolling === false &&
      this.props.isScrolling === true
    ) {
      this._resetStyleCache();
    }

    // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: columnCount,
      cellSize:
        typeof this.props.columnWidth === "number"
          ? this.props.columnWidth
          : null,
      computeMetadataCallback: () =>
        this._columnSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.columnCount,
      nextCellSize:
        typeof nextProps.columnWidth === "number"
          ? nextProps.columnWidth
          : null,
      nextScrollToIndex: nextProps.scrollToColumn,
      scrollToIndex: this.props.scrollToColumn,
      updateScrollOffsetForScrollToIndex: () =>
        this._updateScrollLeftForScrollToColumn(nextProps, this.state)
    });
    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount: rowCount,
      cellSize:
        typeof this.props.rowHeight === "number" ? this.props.rowHeight : null,
      computeMetadataCallback: () =>
        this._rowSizeAndPositionManager.resetCell(0),
      computeMetadataCallbackProps: nextProps,
      nextCellsCount: nextProps.rowCount,
      nextCellSize:
        typeof nextProps.rowHeight === "number" ? nextProps.rowHeight : null,
      nextScrollToIndex: nextProps.scrollToRow,
      scrollToIndex: this.props.scrollToRow,
      updateScrollOffsetForScrollToIndex: () =>
        this._updateScrollTopForScrollToRow(nextProps, this.state)
    });
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    this._calculateChildrenToRender(nextProps, nextState);
  }

  render() {
    const {
      autoContainerWidth,
      autoHeight,
      autoWidth,
      className,
      containerRole,
      containerStyle,
      height,
      id,
      noContentRenderer,
      role,
      style,
      tabIndex,
      width
    } = this.props;

    const isScrolling = this._isScrolling();

    const gridStyle: Object = {
      boxSizing: "border-box",
      direction: "ltr",
      height: autoHeight ? "auto" : height,
      position: "relative",
      width: autoWidth ? "auto" : width,
      WebkitOverflowScrolling: "touch",
      willChange: "transform"
    };

    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize =
      totalRowsHeight > height ? this._scrollbarSize : 0;
    const horizontalScrollBarSize =
      totalColumnsWidth > width ? this._scrollbarSize : 0;

    if (
      horizontalScrollBarSize !== this._horizontalScrollBarSize ||
      verticalScrollBarSize !== this._verticalScrollBarSize
    ) {
      this._horizontalScrollBarSize = horizontalScrollBarSize;
      this._verticalScrollBarSize = verticalScrollBarSize;
      this._scrollbarPresenceChanged = true;
    }

    // Also explicitly init styles to 'auto' if scrollbars are required.
    // This works around an obscure edge case where external CSS styles have not yet been loaded,
    // But an initial scroll index of offset is set as an external prop.
    // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
    // This was originally reported via clauderic/react-infinite-calendar/issues/23
    gridStyle.overflowX =
      totalColumnsWidth + verticalScrollBarSize <= width ? "hidden" : "auto";
    gridStyle.overflowY =
      totalRowsHeight + horizontalScrollBarSize <= height ? "hidden" : "auto";

    const childrenToDisplay = this._childrenToDisplay;

    const showNoContentRenderer =
      childrenToDisplay.length === 0 && height > 0 && width > 0;

    return (
      <div
        ref={this._setScrollingContainerRef}
        aria-label={this.props["aria-label"]}
        aria-readonly={this.props["aria-readonly"]}
        className={cn("ReactVirtualized__Grid", className)}
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
            className="ReactVirtualized__Grid__innerScrollContainer"
            role={containerRole}
            style={{
              width: autoContainerWidth ? "auto" : totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
              overflow: "hidden",
              pointerEvents: isScrolling ? "none" : "",
              position: "relative",
              ...containerStyle
            }}
          >
            {childrenToDisplay}
          </div>}
        {showNoContentRenderer && noContentRenderer()}
      </div>
    );
  }

  /* ---------------------------- Helper methods ---------------------------- */

  _calculateChildrenToRender(
    props: Props = this.props,
    state: State = this.state
  ) {
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
    } = props;

    const {
      scrollDirectionHorizontal,
      scrollDirectionVertical,
      scrollLeft,
      scrollTop
    } = state;

    const isScrolling = this._isScrolling(props, state);

    this._childrenToDisplay = [];

    // Render only enough columns and rows to cover the visible area of the grid.
    if (height > 0 && width > 0) {
      const visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange(
        {
          containerSize: width,
          offset: scrollLeft
        }
      );
      const visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange(
        {
          containerSize: height,
          offset: scrollTop
        }
      );

      const horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment(
        {
          containerSize: width,
          offset: scrollLeft
        }
      );
      const verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment(
        {
          containerSize: height,
          offset: scrollTop
        }
      );

      // Store for _invokeOnGridRenderedHelper()
      this._renderedColumnStartIndex = visibleColumnIndices.start;
      this._renderedColumnStopIndex = visibleColumnIndices.stop;
      this._renderedRowStartIndex = visibleRowIndices.start;
      this._renderedRowStopIndex = visibleRowIndices.stop;

      const overscanColumnIndices = overscanIndicesGetter({
        direction: "horizontal",
        cellCount: columnCount,
        overscanCellsCount: overscanColumnCount,
        scrollDirection: scrollDirectionHorizontal,
        startIndex:
          typeof this._renderedColumnStartIndex === "number"
            ? this._renderedColumnStartIndex
            : 0,
        stopIndex:
          typeof this._renderedColumnStopIndex === "number"
            ? this._renderedColumnStopIndex
            : -1
      });

      const overscanRowIndices = overscanIndicesGetter({
        direction: "vertical",
        cellCount: rowCount,
        overscanCellsCount: overscanRowCount,
        scrollDirection: scrollDirectionVertical,
        startIndex:
          typeof this._renderedRowStartIndex === "number"
            ? this._renderedRowStartIndex
            : 0,
        stopIndex:
          typeof this._renderedRowStopIndex === "number"
            ? this._renderedRowStopIndex
            : -1
        // stopIndex: this._renderedRowStopIndex
      });

      // Store for _invokeOnGridRenderedHelper()
      this._columnStartIndex = overscanColumnIndices.overscanStartIndex;
      this._columnStopIndex = overscanColumnIndices.overscanStopIndex;
      this._rowStartIndex = overscanRowIndices.overscanStartIndex;
      this._rowStopIndex = overscanRowIndices.overscanStopIndex;

      this._childrenToDisplay = cellRangeRenderer({
        cellCache: this._cellCache,
        cellRenderer,
        columnSizeAndPositionManager: this._columnSizeAndPositionManager,
        columnStartIndex: this._columnStartIndex,
        columnStopIndex: this._columnStopIndex,
        deferredMeasurementCache,
        horizontalOffsetAdjustment,
        isScrolling,
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
      });
    }
  }

  /**
   * Check if the difference between current time and the last scroll ended event is greater.
   * than the scrollingResetTimeInterval prop, else schedule this function to execute again.
   */
  _delayScrollEnded = () => {
    const { scrollingResetTimeInterval } = this.props;
    if (Date.now() - this._scrollDebounceStart >= scrollingResetTimeInterval) {
      this._debounceScrollEndedCallback();
    } else {
      this._disablePointerEventsTimeoutId = window.requestAnimationFrame(
        this._delayScrollEnded
      );
    }
  };

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Grid.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _debounceScrollEnded() {
    if (this._disablePointerEventsTimeoutId) {
      window.cancelAnimationFrame(this._disablePointerEventsTimeoutId);
    }
    this._scrollDebounceStart = Date.now();
    this._disablePointerEventsTimeoutId = window.requestAnimationFrame(
      this._delayScrollEnded
    );
  }

  _debounceScrollEndedCallback = () => {
    this._disablePointerEventsTimeoutId = null;
    this._resetStyleCache();
  };

  _getEstimatedColumnSize(props: Props) {
    return typeof props.columnWidth === "number"
      ? props.columnWidth
      : props.estimatedColumnSize;
  }

  _getEstimatedRowSize(props: Props) {
    return typeof props.rowHeight === "number"
      ? props.rowHeight
      : props.estimatedRowSize;
  }

  /**
   * Check for batched CellMeasurer size invalidations.
   * This will occur the first time one or more previously unmeasured cells are rendered.
   */
  _handleInvalidatedGridSize() {
    if (
      typeof this._deferredInvalidateColumnIndex === "number" &&
      typeof this._deferredInvalidateRowIndex === "number"
    ) {
      const columnIndex = this._deferredInvalidateColumnIndex;
      const rowIndex = this._deferredInvalidateRowIndex;

      this._deferredInvalidateColumnIndex = null;
      this._deferredInvalidateRowIndex = null;

      this.recomputeGridSize({ columnIndex, rowIndex });
    }
  }

  _invokeOnGridRenderedHelper = () => {
    const { onSectionRendered } = this.props;

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
    });
  };

  _invokeOnScrollMemoizer({
    scrollLeft,
    scrollTop,
    totalColumnsWidth,
    totalRowsHeight
  }: {
    scrollLeft: number,
    scrollTop: number,
    totalColumnsWidth: number,
    totalRowsHeight: number
  }) {
    this._onScrollMemoizer({
      callback: ({ scrollLeft, scrollTop }) => {
        const { height, onScroll, width } = this.props;

        onScroll({
          clientHeight: height,
          clientWidth: width,
          scrollHeight: totalRowsHeight,
          scrollLeft,
          scrollTop,
          scrollWidth: totalColumnsWidth
        });
      },
      indices: {
        scrollLeft,
        scrollTop
      }
    });
  }

  _isScrolling(props: Props = this.props, state: State = this.state): boolean {
    // If isScrolling is defined in props, use it to override the value in state
    // This is a performance optimization for WindowScroller + Grid
    return Object.hasOwnProperty.call(props, "isScrolling")
      ? Boolean(props.isScrolling)
      : Boolean(state.isScrolling);
  }

  _maybeCallOnScrollbarPresenceChange() {
    if (this._scrollbarPresenceChanged) {
      const { onScrollbarPresenceChange } = this.props;

      this._scrollbarPresenceChanged = false;

      onScrollbarPresenceChange({
        horizontal: this._horizontalScrollBarSize > 0,
        size: this._scrollbarSize,
        vertical: this._verticalScrollBarSize > 0
      });
    }
  }

  _setScrollingContainerRef = (ref: Element) => {
    this._scrollingContainer = ref;
  };

  _setScrollPosition({ scrollLeft, scrollTop }: ScrollPosition) {
    const newState: Object = {
      scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
    };

    if (scrollLeft >= 0) {
      newState.scrollDirectionHorizontal =
        scrollLeft > this.state.scrollLeft
          ? SCROLL_DIRECTION_FORWARD
          : SCROLL_DIRECTION_BACKWARD;
      newState.scrollLeft = scrollLeft;
    }

    if (scrollTop >= 0) {
      newState.scrollDirectionVertical =
        scrollTop > this.state.scrollTop
          ? SCROLL_DIRECTION_FORWARD
          : SCROLL_DIRECTION_BACKWARD;
      newState.scrollTop = scrollTop;
    }

    if (
      (scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft) ||
      (scrollTop >= 0 && scrollTop !== this.state.scrollTop)
    ) {
      this.setState(newState);
    }
  }

  _wrapSizeGetter(value: CellSizeGetter | number): CellSizeGetter {
    return typeof value === "function" ? value : () => (value: any);
  }

  _getCalculatedScrollLeft(
    props: Props = this.props,
    state: State = this.state
  ) {
    const {
      columnCount,
      height,
      scrollToAlignment,
      scrollToColumn,
      width
    } = props;
    const { scrollLeft } = state;

    if (scrollToColumn >= 0 && columnCount > 0) {
      const targetIndex = Math.max(
        0,
        Math.min(columnCount - 1, scrollToColumn)
      );
      const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
      const scrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0;

      return this._columnSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: scrollToAlignment,
        containerSize: width - scrollBarSize,
        currentOffset: scrollLeft,
        targetIndex
      });
    }
  }

  _updateScrollLeftForScrollToColumn(
    props: Props = this.props,
    state: State = this.state
  ) {
    const { scrollLeft } = state;
    const calculatedScrollLeft = this._getCalculatedScrollLeft(props, state);

    if (
      typeof calculatedScrollLeft === "number" &&
      calculatedScrollLeft >= 0 &&
      scrollLeft !== calculatedScrollLeft
    ) {
      this._setScrollPosition({
        scrollLeft: calculatedScrollLeft,
        scrollTop: -1
      });
    }
  }

  _getCalculatedScrollTop(
    props: Props = this.props,
    state: State = this.state
  ) {
    const { height, rowCount, scrollToAlignment, scrollToRow, width } = props;
    const { scrollTop } = state;

    if (scrollToRow >= 0 && rowCount > 0) {
      const targetIndex = Math.max(0, Math.min(rowCount - 1, scrollToRow));
      const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
      const scrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0;

      return this._rowSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: scrollToAlignment,
        containerSize: height - scrollBarSize,
        currentOffset: scrollTop,
        targetIndex
      });
    }
  }

  _resetStyleCache() {
    const styleCache = this._styleCache;

    // Reset cell and style caches once scrolling stops.
    // This makes Grid simpler to use (since cells commonly change).
    // And it keeps the caches from growing too large.
    // Performance is most sensitive when a user is scrolling.
    this._cellCache = {};
    this._styleCache = {};

    // Copy over the visible cell styles so avoid unnecessary re-render.
    for (
      let rowIndex = this._rowStartIndex;
      rowIndex <= this._rowStopIndex;
      rowIndex++
    ) {
      for (
        let columnIndex = this._columnStartIndex;
        columnIndex <= this._columnStopIndex;
        columnIndex++
      ) {
        let key = `${rowIndex}-${columnIndex}`;
        this._styleCache[key] = styleCache[key];
      }
    }

    this.setState({
      isScrolling: false
    });
  }

  _updateScrollTopForScrollToRow(
    props: Props = this.props,
    state: State = this.state
  ) {
    const { scrollTop } = state;
    const calculatedScrollTop = this._getCalculatedScrollTop(props, state);

    if (
      typeof calculatedScrollTop === "number" &&
      calculatedScrollTop >= 0 &&
      scrollTop !== calculatedScrollTop
    ) {
      this._setScrollPosition({
        scrollLeft: -1,
        scrollTop: calculatedScrollTop
      });
    }
  }

  _onScroll = (event: Event) => {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target === this._scrollingContainer) {
      this.handleScrollEvent((event.target: any));
    }
  };
}
