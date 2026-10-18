import type {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import type {
  CellMeasureCache,
  CellMeasurerParent
} from "../CellMeasurer/types";
import type { ScrollElement } from "../../utils/scrollElement/types";
import type { ScalingCellSizeAndPositionManager } from "./utils/ScalingCellSizeAndPositionManager";

/** Identifies a cell by its column and row index. */
export type CellPosition = { columnIndex: number; rowIndex: number };

/** Parameters passed to a `Grid` `cellRenderer`. */
export type CellRendererParams = {
  /** Horizontal (column) index of cell. */
  columnIndex: number;

  /** The Grid is currently being scrolled. */
  isScrolling: boolean;

  /** This cell is visible within the grid (eg it is not an overscanned cell). */
  isVisible: boolean;

  /** Unique key within array of cells. */
  key: string;

  /**
   * Reference to the parent Grid instance (or the component that wraps it, eg `MultiGrid`).
   * This value can be passed as-is to `CellMeasurer`.
   */
  parent: CellMeasurerParent;

  /** Vertical (row) index of cell. */
  rowIndex: number;

  /**
   * Style object to be applied to cell (to position it).
   * This must be passed through to the rendered cell element.
   */
  style: CSSProperties;
};

/**
 * Responsible for rendering a single cell, given its row and column index.
 * Cells must be rendered with the `key` and `style` parameters provided.
 */
export type CellRenderer = (
  props: CellRendererParams
) => ReactElement | false | null | undefined;

/** Temporary cell cache (used while scrolling), mapped by `${rowIndex}-${columnIndex}` key. */
export type CellCache = { [key: string]: ReturnType<CellRenderer> };

/** Temporary cell style cache, mapped by `${rowIndex}-${columnIndex}` key. */
export type StyleCache = { [key: string]: CSSProperties };

/** Parameters passed to a `Grid` `cellRangeRenderer`. */
export type CellRangeRendererParams = {
  /** Temporary cell cache used while scrolling. */
  cellCache: CellCache;

  /** Cell renderer prop supplied to Grid. */
  cellRenderer: CellRenderer;

  /** Manages size and position metadata of columns. */
  columnSizeAndPositionManager: ScalingCellSizeAndPositionManager;

  /** Index of first column (inclusive) to render. */
  columnStartIndex: number;

  /** Index of last column (inclusive) to render. */
  columnStopIndex: number;

  /** CellMeasurer cache, if one was passed to Grid. */
  deferredMeasurementCache?: CellMeasureCache;

  /** Horizontal pixel offset (required for scaling). */
  horizontalOffsetAdjustment: number;

  /** The Grid is currently being scrolled. */
  isScrolling: boolean;

  /** Always cache cells (even when the Grid is not scrolling). */
  isScrollingOptOut: boolean;

  /** Reference to the parent Grid instance (or the component that wraps it). */
  parent: CellMeasurerParent;

  /** Manages size and position metadata of rows. */
  rowSizeAndPositionManager: ScalingCellSizeAndPositionManager;

  /** Index of first row (inclusive) to render. */
  rowStartIndex: number;

  /** Index of last row (inclusive) to render. */
  rowStopIndex: number;

  /** Current horizontal scroll offset of Grid. */
  scrollLeft: number;

  /** Current vertical scroll offset of Grid. */
  scrollTop: number;

  /** Temporary style (size & position) cache used while scrolling. */
  styleCache: StyleCache;

  /** Vertical pixel offset (required for scaling). */
  verticalOffsetAdjustment: number;

  /** Range of visible (not overscanned) columns. */
  visibleColumnIndices: VisibleCellRange;

  /** Range of visible (not overscanned) rows. */
  visibleRowIndices: VisibleCellRange;
};

/** Responsible for rendering a group of cells given their index ranges. */
export type CellRangeRenderer = (
  params: CellRangeRendererParams
) => ReactNode[];

/** Returns the size (width or height) of the cell at the specified index. */
export type CellSizeGetter = (params: { index: number }) => number;

/** Either a fixed cell size (number) or a function that returns the size of a cell given its index. */
export type CellSize = CellSizeGetter | number;

/** Renders content to be shown when a Grid has no cells. */
export type NoContentRenderer = () => ReactNode;

/** Parameters passed to the `Grid` `onScroll` callback. */
export type Scroll = {
  clientHeight: number;
  clientWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
};

/** Parameters passed to the `Grid` `onScrollbarPresenceChange` callback. */
export type ScrollbarPresenceChange = {
  horizontal: boolean;
  vertical: boolean;
  size: number;
};

/** Parameters passed to the `Grid` `onSectionRendered` callback. */
export type RenderedSection = {
  columnOverscanStartIndex: number;
  columnOverscanStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  rowOverscanStartIndex: number;
  rowOverscanStopIndex: number;
  rowStartIndex: number;
  rowStopIndex: number;
};

/** Parameters passed to an `OverscanIndicesGetter`. */
export type OverscanIndicesGetterParams = {
  /** One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL */
  direction: "horizontal" | "vertical";

  /** One of SCROLL_DIRECTION_BACKWARD (-1) or SCROLL_DIRECTION_FORWARD (1) */
  scrollDirection: -1 | 1;

  /** Number of rows or columns in the current axis */
  cellCount: number;

  /** Maximum number of cells to over-render in either direction */
  overscanCellsCount: number;

  /** Begin of range of visible cells */
  startIndex: number;

  /** End of range of visible cells */
  stopIndex: number;
};

/** Range of cells (inclusive) to render, including overscanned cells. */
export type OverscanIndices = {
  overscanStartIndex: number;
  overscanStopIndex: number;
};

/** Calculates the number of cells to overscan before and after a specified range. */
export type OverscanIndicesGetter = (
  params: OverscanIndicesGetterParams
) => OverscanIndices;

/** Alignment of a scrolled-to cell within the Grid. */
export type Alignment = "auto" | "end" | "start" | "center";

/** Range of visible cells; empty if there are no cells. */
export type VisibleCellRange = {
  start?: number;
  stop?: number;
};

/** Scroll offsets (as accepted by `scrollToPosition` and `handleScrollEvent`). */
export type ScrollPosition = {
  scrollLeft?: number;
  scrollTop?: number;
};

export type GridProps = {
  /**
   * ARIA label for the grid element.
   * @default "grid"
   */
  "aria-label"?: string;

  /**
   * ARIA readonly attribute for the grid element.
   * @default true
   */
  "aria-readonly"?: boolean;

  /**
   * Set the width of the inner scrollable container to 'auto'.
   * This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar.
   * @default false
   */
  autoContainerWidth?: boolean;

  /**
   * Responsible for rendering a group of cells given their index ranges.
   *
   * This is an advanced property.
   * It is useful for situations where the `Grid` requires additional, overlayed UI (such as a Gantt chart or a calendar application).
   * The easiest way to override it is to decorate `defaultCellRangeRenderer`.
   *
   * Defaults to `defaultCellRangeRenderer`.
   */
  cellRangeRenderer?: CellRangeRenderer;

  /**
   * Responsible for rendering a cell given an row and column index.
   * It receives `columnIndex`, `isScrolling`, `isVisible`, `key`, `parent`, `rowIndex`, and `style` parameters.
   *
   * The `style` parameter specifies how the cell is to be sized and positioned and must be passed through to the rendered cell element.
   * The `key` parameter must also be applied to the rendered element.
   */
  cellRenderer: CellRenderer;

  /**
   * Optional custom CSS class name to attach to root `Grid` element.
   */
  className?: string;

  /**
   * Number of columns in grid.
   */
  columnCount: number;

  /**
   * Either a fixed column width (number) or a function that returns the width of a column given its index: `({ index: number }): number`.
   * If function is used, specify `estimatedColumnSize` for more consistent scrolling behavior.
   */
  columnWidth: CellSize;

  /**
   * Additional props (eg `onWheel`) to spread onto the outer `Grid` element.
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;

  /**
   * ARIA role for the inner cell-container.
   * @default "row"
   */
  containerRole?: string;

  /**
   * Optional custom inline style to attach to inner cell-container element.
   * @default {}
   */
  containerStyle?: CSSProperties;

  /**
   * If CellMeasurer is used to measure this Grid's children, this should be a pointer to its CellMeasurerCache.
   * A shared CellMeasurerCache reference enables Grid and CellMeasurer to share measurement data.
   */
  deferredMeasurementCache?: CellMeasureCache;

  /**
   * Reference to the outer (scrolling) DOM element.
   */
  elementRef?: Ref<HTMLDivElement>;

  /**
   * Used to estimate the total width of a `Grid` before all of its columns have actually been measured.
   * The estimated total width is adjusted as columns are rendered.
   * @default 100
   */
  estimatedColumnSize?: number;

  /**
   * Used to estimate the total height of a `Grid` before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   * @default 30
   */
  estimatedRowSize?: number;

  /**
   * Returns the size of the browser's scrollbar.
   * Exposed for testing purposes only.
   *
   * Defaults to `dom-helpers`' `scrollbarSize` (which returns `undefined` during server rendering).
   */
  getScrollbarSize?: () => number;

  /**
   * Height of Grid; this property determines the number of visible (vs virtualized) rows.
   * Required, unless a `scrollElement` is specified.
   *
   * With a `scrollElement`, the height of the scroll element's viewport is used instead;
   * this prop is then only used until the scroll element has been measured (e.g. during server rendering).
   */
  height?: number;

  /**
   * Optional custom id to attach to root `Grid` element.
   */
  id?: string;

  /**
   * Horizontal scroll offset to initially render (and scroll to) the `Grid` at.
   * Only the initial value is used: changing this prop later has no effect (use `scrollToPosition` to scroll).
   * This also works with server rendering: the cells at this offset are rendered on the server,
   * and they stay in place when the page is hydrated.
   */
  initialScrollLeft?: number;

  /**
   * Vertical scroll offset to initially render (and scroll to) the `Grid` at.
   * Only the initial value is used: changing this prop later has no effect (use `scrollToPosition` to scroll).
   * This also works with server rendering: the cells at this offset are rendered on the server,
   * and they stay in place when the page is hydrated.
   * Ignored if a `scrollElement` is specified (which then determines the vertical offset).
   */
  initialScrollTop?: number;

  /**
   * Prevents re-rendering of visible cells on scroll end.
   * (Opts out of the isScrolling param passed to cellRangeRenderer, to avoid the extra render when scroll stops.)
   * Visible cells are still re-rendered when the `Grid`'s props change or `forceUpdate()` is called.
   * @default false
   */
  isScrollingOptOut?: boolean;

  /**
   * Optional renderer to be rendered inside the grid when either `rowCount` or `columnCount` is empty.
   * Renders nothing by default.
   */
  noContentRenderer?: NoContentRenderer;

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region:
   * `({ clientHeight: number, clientWidth: number, scrollHeight: number, scrollLeft: number, scrollTop: number, scrollWidth: number }): void`.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll?: (params: Scroll) => void;

  /**
   * Called whenever a horizontal or vertical scrollbar is added or removed:
   * `({ horizontal: boolean, size: number, vertical: boolean }): void`.
   * This prop is not intended for end-user use;
   * it is used by MultiGrid to support fixed-row/fixed-column scroll syncing.
   */
  onScrollbarPresenceChange?: (params: ScrollbarPresenceChange) => void;

  /**
   * Callback invoked with information about the section of the Grid that was just rendered.
   * This callback is only invoked when visible rows have changed:
   * `({ columnOverscanStartIndex: number, columnOverscanStopIndex: number, columnStartIndex: number, columnStopIndex: number, rowOverscanStartIndex: number, rowOverscanStopIndex: number, rowStartIndex: number, rowStopIndex: number }): void`.
   */
  onSectionRendered?: (params: RenderedSection) => void;

  /**
   * Number of columns to render before/after the visible slice of the grid.
   * This can help reduce flickering during scrolling on certain browsers/devices.
   *
   * Note that this property has performance implications: the higher the value, the more work needs to be done in reaction to each scroll event.
   * Aim to use the lowest value possible that still generally avoids any empty space from appearing during normal scrolling.
   * @default 0
   */
  overscanColumnCount?: number;

  /**
   * Responsible for calculating the number of cells to overscan before and after a specified range.
   * By default, cells are overscanned in the direction the user is scrolling.
   * This function receives `direction`, `cellCount`, `scrollDirection`, `overscanCellsCount`, `startIndex`, and `stopIndex` parameters
   * and returns an `{ overscanStartIndex, overscanStopIndex }` object.
   *
   * Defaults to `defaultOverscanIndicesGetter`.
   */
  overscanIndicesGetter?: OverscanIndicesGetter;

  /**
   * Number of rows to render above/below the visible slice of the grid.
   * This can help reduce flickering during scrolling on certain browsers/devices.
   *
   * Note that this property has performance implications: the higher the value, the more work needs to be done in reaction to each scroll event.
   * The default value (10) is a good starting point; lower it if possible.
   * @default 10
   */
  overscanRowCount?: number;

  /**
   * Optional override of ARIA role default.
   * @default "grid"
   */
  role?: string;

  /**
   * Number of rows in grid.
   */
  rowCount: number;

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`.
   * If function is used, specify `estimatedRowSize` for more consistent scrolling behavior.
   */
  rowHeight: CellSize;

  /**
   * Element that scrolls the `Grid` (instead of the `Grid` scrolling itself): `"window"`, or a scrollable DOM element
   * (e.g. a container that the `Grid` is rendered within, along with other content).
   *
   * The `Grid` then renders at its full height (it may still scroll horizontally itself), renders only the rows visible within the scroll element's viewport,
   * and its scroll methods scroll the scroll element.
   * Its position within the scroll element is measured when the scroll element scrolls or is resized, and when the `Grid` re-renders
   * (e.g. call `forceUpdate()` if content above the `Grid` changes size without the `Grid` re-rendering).
   * Pass `null` while the scroll element isn't available yet (e.g. before a ref to it has been attached);
   * the `Grid` then renders the rows at its top.
   */
  scrollElement?: ScrollElement | null;

  /**
   * Wait this amount of time (in milliseconds) after the last scroll event before resetting Grid `pointer-events`.
   * @default 150
   */
  scrollingResetTimeInterval?: number;

  /**
   * Optional custom inline style to attach to root `Grid` element.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Optional override of tab index default.
   * @default 0
   */
  tabIndex?: number | null;

  /**
   * Width of Grid; this property determines the number of visible (vs virtualized) columns.
   */
  width: number;
};

/** Public (imperative) methods of a `Grid` (its ref handle). */
export interface GridImperativeAPI {
  /**
   * Forcefully re-render the `Grid` (and its visible cells),
   * e.g. because the data rendered by `cellRenderer` has changed but the `Grid`'s props have not.
   */
  forceUpdate(): void;

  /**
   * Gets offsets for a given cell and alignment (see `scrollToCell` for the alignment values).
   * The alignment defaults to "auto"; an index of `-1` (the default) refers to the last column or row.
   */
  getOffsetForCell(params?: {
    alignment?: Alignment;
    columnIndex?: number;
    rowIndex?: number;
  }): { scrollLeft: number; scrollTop: number };

  /**
   * Gets estimated total rows' height.
   */
  getTotalRowsHeight(): number;

  /**
   * Gets estimated total columns' width.
   */
  getTotalColumnsWidth(): number;

  /**
   * This method handles a scroll event originating from an external scroll control.
   * It's an advanced method and should probably not be used unless you're implementing a custom scroll-bar solution.
   */
  handleScrollEvent(params: ScrollPosition): void;

  /**
   * Invalidate the size of a cell and recompute visible cells after the current render has been committed.
   * This is a deferred version of `recomputeGridSize()` (batching the invalidations of a render);
   * it is intended for advanced use-cases like `CellMeasurer`.
   */
  invalidateCellSizeAfterRender(params: CellPosition): void;

  /**
   * Pre-measure all columns and rows in a `Grid`.
   *
   * Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
   * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
   */
  measureAllCells(): void;

  /**
   * Recomputes row heights and column widths after the specified index (both default to 0).
   *
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since `Grid` only receives `columnCount` and `rowCount` it has no way of detecting when the underlying data changes.
   *
   * This method will also force a render cycle to ensure that the updated measurements are reflected in the rendered grid.
   */
  recomputeGridSize(params?: { columnIndex?: number; rowIndex?: number }): void;

  /**
   * Ensure the specified column and/or row is visible (scrolling if necessary).
   * This method can be used to safely scroll back to a cell that a user has scrolled away from even if it was previously scrolled to.
   *
   * The `align` parameter (default "auto") controls the alignment of the cell:
   * "auto" scrolls the least amount possible to ensure that the specified cell is fully visible
   * (a cell larger than the `Grid` is aligned to its start, so that its start is visible);
   * "start" aligns the cell to the top/left of the `Grid` and "end" to the bottom/right;
   * "center" aligns the cell in the middle of the `Grid`.
   *
   * This is a one-time scroll: the cell is not kept in view afterwards (e.g. if the `Grid`'s size or its cell sizes change).
   * Cells that haven't been measured yet (e.g. by `CellMeasurer`) are positioned using their estimated sizes.
   * Nothing is scrolled while the `Grid`'s width or height is 0.
   * The column is ignored for single-column grids (e.g. `List`, `Table`).
   *
   * If the `Grid` has a `scrollElement`, the scroll element (e.g. the window) is scrolled vertically instead.
   */
  scrollToCell(params: {
    align?: Alignment;
    columnIndex?: number;
    rowIndex?: number;
  }): void;

  /**
   * Scroll to the specified offset(s); an omitted offset is left unchanged.
   * Offsets are clamped to the scrollable range.
   * Calling this method with the current offsets does nothing.
   *
   * If the `Grid` has a `scrollElement`, `scrollTop` scrolls the scroll element (e.g. the window) instead
   * (to the position at which the `Grid` is scrolled by `scrollTop`).
   */
  scrollToPosition(params: ScrollPosition): void;
}
