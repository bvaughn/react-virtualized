import type { CSSProperties } from "react";
import type {
  Alignment,
  CellRenderer,
  CellSize,
  GridProps,
  NoContentRenderer,
  OverscanIndicesGetter,
  CellPosition,
  Scroll as GridScroll,
  ScrollPosition
} from "../Grid/types";
import type { ScrollElement } from "../../utils/scrollElement/types";

/** Parameters passed to a `List` `rowRenderer`. */
export type RowRendererParams = {
  /** Index of row. */
  index: number;

  /** The List is currently being scrolled. */
  isScrolling: boolean;

  /** This row is visible within the List (eg it is not an overscanned row). */
  isVisible: boolean;

  /** Unique key within array of rendered rows. */
  key: string;

  /**
   * Reference to the parent `List` (its imperative handle).
   * This value can be passed as-is to `CellMeasurer`.
   */
  parent: ListImperativeAPI;

  /**
   * Style object to be applied to row (to position it).
   * This must be passed through to the rendered row element.
   */
  style: CSSProperties;
};

/**
 * Responsible for rendering a single row, given its index.
 * Rows must be rendered with the `key` and `style` parameters provided.
 */
export type RowRenderer = (
  params: RowRendererParams
) => ReturnType<CellRenderer>;

/** Parameters passed to the `List` `onRowsRendered` callback. */
export type RenderedRows = {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
};

/** Parameters passed to the `List` `onScroll` callback. */
export type Scroll = Pick<
  GridScroll,
  "clientHeight" | "scrollHeight" | "scrollTop"
>;

/**
 * `Grid` props that `List` sets itself (and so cannot be passed to `List`),
 * that don't apply to a (vertical) `List`,
 * or that `List` redefines with list-specific documentation.
 */
type OverriddenGridPropKeys =
  | "aria-label"
  | "aria-readonly"
  | "autoContainerWidth"
  | "cellRenderer"
  | "className"
  | "columnCount"
  | "columnWidth"
  | "containerRole"
  | "estimatedColumnSize"
  | "estimatedRowSize"
  | "height"
  | "id"
  | "initialScrollLeft"
  | "noContentRenderer"
  | "onScroll"
  | "onSectionRendered"
  | "overscanColumnCount"
  | "overscanIndicesGetter"
  | "overscanRowCount"
  | "role"
  | "rowCount"
  | "rowHeight"
  | "scrollElement"
  | "style"
  | "tabIndex"
  | "width";

/**
 * `List` props.
 * All other props are relayed to the inner `Grid` (see `GridProps`).
 */
export type ListProps = Omit<GridProps, OverriddenGridPropKeys> & {
  /**
   * ARIA label for the list element. There is no default label.
   * (With `role="grid"`, it defaults to `"grid"`, as in version 9.)
   */
  "aria-label"?: string;

  /**
   * ARIA readonly attribute for the list element.
   * Not set by default (it doesn't apply to `role="list"`); with `role="grid"`, it defaults to `true`.
   */
  "aria-readonly"?: boolean;

  /**
   * ARIA role for the inner container of the rows.
   * Defaults to `"presentation"` (so that the rows belong to the list), or to `"row"` with `role="grid"`.
   */
  containerRole?: string;

  /**
   * ARIA role for the list element.
   * With the default `"list"`, rows that don't specify a `role` get `role="listitem"` (#1657).
   * Pass `"grid"` for the version 9 roles (a `grid` element whose rows are `gridcell`s within a single `row`).
   * @default "list"
   */
  role?: string;

  /**
   * Optional custom CSS class name to attach to root `List` element.
   */
  className?: string;

  /**
   * Used to estimate the total height of a `List` before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   * @default 30
   */
  estimatedRowSize?: number;

  /**
   * Height constraint for list (determines how many actual rows are rendered).
   * Required, unless a `scrollElement` is specified.
   *
   * With a `scrollElement`, the height of the scroll element's viewport is used instead;
   * this prop is then only used until the scroll element has been measured (e.g. during server rendering).
   */
  height?: number;

  /**
   * Optional custom id to attach to root `List` element.
   */
  id?: string;

  /**
   * Callback used to render placeholder content when `rowCount` is 0.
   * By default, nothing is rendered.
   */
  noRowsRenderer?: NoContentRenderer;

  /**
   * Callback invoked with information about the slice of rows that were just rendered:
   * `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void`.
   */
  onRowsRendered?: (params: RenderedRows) => void;

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region:
   * `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll?: (params: Scroll) => void;

  /**
   * Responsible for calculating the number of rows to overscan before and after a specified range.
   * By default (`accessibilityOverscanIndicesGetter`), at least one row is overscanned in each direction (for accessibility).
   * See `Grid` `overscanIndicesGetter` for details.
   */
  overscanIndicesGetter?: OverscanIndicesGetter;

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * This can help reduce flickering during scrolling on certain browsers/devices.
   *
   * Note that this property has performance implications: the higher the value, the more work needs to be done in reaction to each scroll event.
   * @default 10
   */
  overscanRowCount?: number;

  /**
   * Number of rows in list.
   */
  rowCount: number;

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`.
   * If function is used, specify `estimatedRowSize` for more consistent scrolling behavior.
   */
  rowHeight: CellSize;

  /**
   * Responsible for rendering a row given its index.
   * It receives `index`, `isScrolling`, `isVisible`, `key`, `parent`, and `style` parameters.
   *
   * The `style` parameter specifies how the row is to be sized and positioned and must be passed through to the rendered row element.
   * The `key` parameter must also be applied to the rendered element.
   */
  rowRenderer: RowRenderer;

  /**
   * Element that scrolls the `List` (instead of the `List` scrolling itself): `"window"`, or a scrollable DOM element
   * (e.g. a container that the `List` is rendered within, along with other content).
   *
   * The `List` then renders at its full height, renders only the rows visible within the scroll element's viewport,
   * and its scroll methods scroll the scroll element.
   * Its position within the scroll element is measured when the scroll element scrolls or is resized, and when the `List` re-renders
   * (e.g. call `forceUpdateGrid()` if content above the `List` changes size without the `List` re-rendering).
   * Pass `null` while the scroll element isn't available yet (e.g. before a ref to it has been attached);
   * the `List` then renders the rows at its top.
   */
  scrollElement?: ScrollElement | null;

  /**
   * Optional custom inline style to attach to root `List` element.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Optional override of tab index default.
   * @default 0
   */
  tabIndex?: number | null;

  /**
   * Width of the list.
   */
  width: number;
};

/**
 * Public (imperative) methods of a `List` (its ref handle).
 * The handle is also passed to `rowRenderer` as `parent` (e.g. for `CellMeasurer`).
 */
export interface ListImperativeAPI {
  /**
   * Forcefully re-render the inner `Grid` component.
   *
   * Re-rendering a `List` with the same props does not re-render its rows (both `List` and the inner `Grid` are memoized).
   * Use this method if you want to manually trigger a re-render.
   * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
   */
  forceUpdateGrid(): void;

  /**
   * Gets the vertical offset (`scrollTop`) for a given row and alignment (see `scrollToRow` for the `align` values).
   * The alignment defaults to "auto"; an index of `-1` (the default) refers to the last row.
   *
   * `alignment` is a deprecated alias of `align` (`align` takes precedence if both are specified).
   */
  getOffsetForRow(params?: {
    align?: Alignment;
    /** @deprecated Use `align` instead. */
    alignment?: Alignment;
    index?: number;
  }): number;

  /**
   * Invalidate the size of a row (after the current render has been committed); see `Grid#invalidateCellSizeAfterRender`.
   * This method is intended for `CellMeasurer`.
   */
  invalidateCellSizeAfterRender(params: CellPosition): void;

  /**
   * Pre-measure all rows in a `List`.
   *
   * Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
   * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
   */
  measureAllRows(): void;

  /**
   * Recompute row heights and offsets after the specified index (defaults to 0).
   *
   * `List` has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property.
   * If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone.
   * In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.
   *
   * This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered list.
   */
  recomputeRowHeights(index?: number): void;

  /**
   * Recompute row heights and offsets after the specified row index (defaults to 0); see `Grid#recomputeGridSize`.
   * (The column index is ignored.) This method is intended for `CellMeasurer`; also see `recomputeRowHeights`.
   */
  recomputeGridSize(params?: Partial<CellPosition>): void;

  /**
   * Ensure the specified row is visible (scrolling if necessary); the column index is ignored.
   * This allows a `List` to be used with `ArrowKeyStepper`; also see `scrollToRow`.
   */
  scrollToCell(params: {
    align?: Alignment;
    columnIndex?: number;
    rowIndex?: number;
  }): void;

  /**
   * Scroll to the specified vertical offset; `scrollLeft` is ignored (lists don't scroll horizontally).
   * Offsets are clamped to the scrollable range. This allows a `List` to be used with `ScrollSync`.
   * Useful for animating position changes.
   *
   * If the `List` has a `scrollElement`, the scroll element (e.g. the window) is scrolled instead.
   */
  scrollToPosition(params: ScrollPosition): void;

  /**
   * Ensure the row at the specified index is visible (scrolling if necessary).
   * This method can be used to safely scroll back to a row that a user has scrolled away from even if it was previously scrolled to.
   *
   * The `align` parameter (default "auto") controls the alignment of the row:
   * "auto" scrolls the least amount possible to ensure that the specified row is fully visible
   * (a row taller than the list is aligned to its start, so that its start is visible);
   * "start" aligns the row to the top of the list and "end" to the bottom; "center" aligns it in the middle.
   * This is a one-time scroll: the row is not kept in view afterwards (e.g. if the list's size or its row heights change).
   * Rows that haven't been measured yet (e.g. by `CellMeasurer`) are positioned using their estimated heights.
   *
   * If the `List` has a `scrollElement`, the scroll element (e.g. the window) is scrolled instead.
   */
  scrollToRow(params: { align?: Alignment; index: number }): void;
}
