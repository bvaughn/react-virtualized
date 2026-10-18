import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode
} from "react";
import type {
  CellMeasureCache,
  CellMeasurerParent
} from "../CellMeasurer/types";
import type {
  Alignment,
  CellPosition,
  CellSize,
  GridProps,
  OverscanIndicesGetter,
  ScrollPosition
} from "../Grid/types";
import type { ScrollElement } from "../../utils/scrollElement/types";

/**
 * Specifies which direction `Table` data is sorted in:
 * - `"ASC"`: ascending order; from the lowest value to the highest (e.g. a-z, 0-9).
 * - `"DESC"`: descending order; from the highest value to the lowest (e.g. z-a, 9-0).
 */
export type SortDirectionType = "ASC" | "DESC";

/** Parameters passed to a `Column` `cellDataGetter`. */
export type TableCellDataGetterParams = {
  /** Additional data passed to this column (the `Column` `columnData` prop). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnData?: any;

  /** Uniquely identifies the row-data attribute corresponding to this cell. */
  dataKey: string;

  /** Data for the current row (as returned by the `Table` `rowGetter`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;
};

/** Returns a cell's data, given its `dataKey` and row data. */
export type TableCellDataGetter = (
  params: TableCellDataGetterParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

/** Parameters passed to a `Column` `cellRenderer`. */
export type TableCellProps = {
  /** Cell data (as returned by the column's `cellDataGetter`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellData: any;

  /** Additional data passed to this column (the `Column` `columnData` prop). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnData?: any;

  /** Index of the column being rendered. */
  columnIndex: number;

  /** Uniquely identifies the row-data attribute corresponding to this cell. */
  dataKey: string;

  /** The `Table` is currently being scrolled. */
  isScrolling: boolean;

  /**
   * Reference to the `Table` (its imperative handle), which delegates the `CellMeasurer` methods to the inner `Grid`.
   * This value can be passed as-is to `CellMeasurer`.
   */
  parent: CellMeasurerParent;

  /** Data for the current row (as returned by the `Table` `rowGetter`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;

  /** Index of the row being rendered. */
  rowIndex: number;
};

/** Renders a cell's contents. */
export type TableCellRenderer = (params: TableCellProps) => ReactNode;

/** Parameters passed to a `Column` `headerRenderer`. */
export type TableHeaderProps = {
  /** Additional data passed to this column (the `Column` `columnData` prop). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnData?: any;

  /** Uniquely identifies the row-data attribute corresponding to this column. */
  dataKey: string;

  /** Sorting has been disabled for this column. */
  disableSort?: boolean;

  /** Header label for this column. */
  label?: ReactNode;

  /** Table data is currently sorted by this `dataKey` (if it is sorted at all). */
  sortBy?: string;

  /** Table data is currently sorted in this direction (if it is sorted at all). */
  sortDirection?: SortDirectionType;
};

/** Renders a column header's contents. */
export type TableHeaderRenderer = (params: TableHeaderProps) => ReactNode;

/** Parameters passed to a `Table` `headerRowRenderer`. */
export type TableHeaderRowProps = {
  /** Header row class name. */
  className: string;

  /** Array of rendered column headers. */
  columns: ReactNode[];

  /** Header row style object. */
  style: CSSProperties;
};

/** Renders the header row of a `Table`. */
export type TableHeaderRowRenderer = (params: TableHeaderRowProps) => ReactNode;

/** Parameters passed to `Table` row mouse event callbacks (e.g. `onRowClick`). */
export type TableRowMouseEventHandlerParams = {
  /** The DOM event. */
  event: MouseEvent<HTMLDivElement>;

  /** Index of the row. */
  index: number;

  /** Data for the row (as returned by the `Table` `rowGetter`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;
};

/** Callback invoked in response to a mouse event on a `Table` row. */
export type TableRowMouseEventHandler = (
  params: TableRowMouseEventHandlerParams
) => void;

/** Parameters passed to a `Table` `rowRenderer`. */
export type TableRowProps = {
  /** Row-level class name. */
  className: string;

  /** Array of rendered cells (one per column). */
  columns: ReactNode[];

  /** Row index. */
  index: number;

  /** The `Table` is currently being scrolled. */
  isScrolling: boolean;

  /** Unique key within array of rendered rows. */
  key: string;

  /** Optional row `onClick` handler. */
  onRowClick?: TableRowMouseEventHandler;

  /** Optional row `onDoubleClick` handler. */
  onRowDoubleClick?: TableRowMouseEventHandler;

  /** Optional row `onMouseOut` handler. */
  onRowMouseOut?: TableRowMouseEventHandler;

  /** Optional row `onMouseOver` handler. */
  onRowMouseOver?: TableRowMouseEventHandler;

  /** Optional row `onContextMenu` (right-click) handler. */
  onRowRightClick?: TableRowMouseEventHandler;

  /** Row data (as returned by the `Table` `rowGetter`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;

  /** Row-level style object; this must be applied to the rendered row element. */
  style: CSSProperties;
};

/** Renders a `Table` row, given its rendered columns. */
export type TableRowRenderer = (params: TableRowProps) => ReactNode;

/** Parameters passed to the `Table` `onColumnClick` and `onHeaderClick` callbacks. */
export type TableColumnEventHandlerParams = {
  /** Additional data passed to this column (the `Column` `columnData` prop). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnData: any;

  /** Uniquely identifies the row-data attribute corresponding to this column. */
  dataKey: string;

  /** The DOM event (a keyboard event if a header was activated via the ENTER or SPACE key). */
  event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>;
};

/** Parameters passed to the `Table` `sort` callback. */
export type TableSortParams = {
  /** Default sort direction of the clicked column. */
  defaultSortDirection: SortDirectionType;

  /** The DOM event (a keyboard event if the header was activated via the ENTER or SPACE key). */
  event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>;

  /** `dataKey` of the clicked column. */
  sortBy: string;

  /**
   * New sort direction: the column's `defaultSortDirection` if the column is not currently sorted,
   * else the opposite of the current `sortDirection`.
   */
  sortDirection: SortDirectionType;
};

/** Parameters passed to the `Table` `onRowsRendered` callback. */
export type TableRowsRenderedParams = {
  /** Index of the first rendered row (including overscanned rows). */
  overscanStartIndex: number;

  /** Index of the last rendered row (including overscanned rows). */
  overscanStopIndex: number;

  /** Index of the first visible row. */
  startIndex: number;

  /** Index of the last visible row. */
  stopIndex: number;
};

/** Parameters passed to the `Table` `onScroll` callback. */
export type TableScrollParams = {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
};

type TableOwnProps = {
  /** ARIA label set on the outer `Table` element. */
  "aria-label"?: string;

  /** ARIA labelledby attribute set on the outer `Table` element. */
  "aria-labelledby"?: string;

  /**
   * One or more `Column`s describing the data displayed in this table.
   * Falsy children are ignored, to allow easier dynamic showing/hiding of columns.
   *
   * `Table` reads the props of its children (with `defaultColumnProps` applied) without rendering them,
   * so components that wrap `Column` (e.g. `const MyColumn = (props: ColumnProps) => <Column {...props} />`) can be used as children too.
   * (Subclassing `Column` is no longer supported.)
   */
  children?: ReactNode;

  /** Optional custom CSS class name to attach to root `Table` element. */
  className?: string;

  /**
   * If `CellMeasurer` is used to measure this Table's cells, this should be a pointer to its `CellMeasurerCache`.
   * It is passed through to the inner `Grid`.
   */
  deferredMeasurementCache?: CellMeasureCache;

  /**
   * Do not render the table header (only the rows).
   * @default false
   */
  disableHeader?: boolean;

  /**
   * Used to estimate the total height of a `Table` before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   * @default 30
   */
  estimatedRowSize?: number;

  /** Optional custom CSS class name to attach to inner `Grid` element. */
  gridClassName?: string;

  /** Optional inline style to attach to inner `Grid` element. */
  gridStyle?: CSSProperties;

  /** Optional CSS class to apply to all column headers. */
  headerClassName?: string;

  /**
   * Fixed height of header row.
   * @default 0
   */
  headerHeight?: number;

  /**
   * Responsible for rendering the table header row given an array of columns:
   * `({ className: string, columns: ReactNode[], style: CSSProperties }): ReactNode`.
   *
   * This is an advanced property.
   * It is useful for situations where you require additional hooks into `Table` to render additional custom UI elements.
   * You may want to start by forking the `defaultTableHeaderRowRenderer` function (the default).
   */
  headerRowRenderer?: TableHeaderRowRenderer;

  /**
   * Optional custom inline style to attach to table header columns.
   * @default {}
   */
  headerStyle?: CSSProperties;

  /**
   * Fixed/available height for the outer DOM element.
   * Required, unless a `scrollElement` is specified.
   *
   * With a `scrollElement`, the height of the scroll element's viewport is used instead;
   * this prop is then only used until the scroll element has been measured (e.g. during server rendering).
   */
  height?: number;

  /** Optional custom id to attach to root `Table` element. */
  id?: string;

  /**
   * Vertical scroll offset to initially render (and scroll to) the `Table` at.
   * Only the initial value is used: changing this prop later has no effect (use `scrollToPosition` to scroll).
   * This also works with server rendering: the rows at this offset are rendered on the server,
   * and they stay in place when the page is hydrated.
   * Ignored if a `scrollElement` is specified (which then determines the vertical offset).
   */
  initialScrollTop?: number;

  /** Optional renderer to be used in place of table body rows when `rowCount` is 0. */
  noRowsRenderer?: () => ReactNode;

  /**
   * Callback invoked when a user clicks on a table column (cell):
   * `({ columnData: any, dataKey: string, event: Event }): void`.
   */
  onColumnClick?: (params: TableColumnEventHandlerParams) => void;

  /**
   * Callback invoked when a user clicks on (or activates via the ENTER or SPACE key) a table header:
   * `({ columnData: any, dataKey: string, event: Event }): void`.
   */
  onHeaderClick?: (params: TableColumnEventHandlerParams) => void;

  /**
   * Callback invoked when a user clicks on a table row:
   * `({ event: Event, index: number, rowData: any }): void`.
   */
  onRowClick?: TableRowMouseEventHandler;

  /**
   * Callback invoked when a user double-clicks on a table row:
   * `({ event: Event, index: number, rowData: any }): void`.
   */
  onRowDoubleClick?: TableRowMouseEventHandler;

  /**
   * Callback invoked when the mouse leaves a table row:
   * `({ event: Event, index: number, rowData: any }): void`.
   */
  onRowMouseOut?: TableRowMouseEventHandler;

  /**
   * Callback invoked when a user moves the mouse over a table row:
   * `({ event: Event, index: number, rowData: any }): void`.
   */
  onRowMouseOver?: TableRowMouseEventHandler;

  /**
   * Callback invoked when a user right-clicks on a table row:
   * `({ event: Event, index: number, rowData: any }): void`.
   */
  onRowRightClick?: TableRowMouseEventHandler;

  /**
   * Callback invoked with information about the slice of rows that were just rendered:
   * `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void`.
   */
  onRowsRendered?: (params: TableRowsRenderedParams) => void;

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region:
   * `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll?: (params: TableScrollParams) => void;

  /**
   * Responsible for calculating the number of rows to overscan before and after a specified range (see `Grid` `overscanIndicesGetter`).
   * By default (`accessibilityOverscanIndicesGetter`), `Table` overscans by at least one row in each direction (for accessibility).
   */
  overscanIndicesGetter?: OverscanIndicesGetter;

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * This can help reduce flickering during scrolling on certain browsers/devices.
   * @default 10
   */
  overscanRowCount?: number;

  /**
   * Optional CSS class to apply to all table rows (including the header row).
   * This value may be either a static string or a function with the signature `({ index: number }): string`.
   * Note that for the header row an index of `-1` is provided.
   */
  rowClassName?: string | ((params: { index: number }) => string);

  /** Number of rows in table. */
  rowCount: number;

  /**
   * Callback responsible for returning a data row given an index:
   * `({ index: number }): any`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowGetter: (params: { index: number }) => any;

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index:
   * `({ index: number }): number`.
   */
  rowHeight: CellSize;

  /**
   * Responsible for rendering a table row given an array of columns.
   *
   * This is an advanced property.
   * It is useful for situations where you require additional hooks into `Table` (eg integration with a library like `react-sortable-hoc`).
   * The easiest way to override it is to decorate (or fork) the `defaultTableRowRenderer` function (the default).
   */
  rowRenderer?: TableRowRenderer;

  /**
   * Optional custom inline style to attach to table rows (including the header row).
   * This value may be either a style object or a function with the signature `({ index: number }): CSSProperties`.
   * Note that for the header row an index of `-1` is provided.
   * @default {}
   */
  rowStyle?: CSSProperties | ((params: { index: number }) => CSSProperties);

  /**
   * Sort function to be called if a sortable header is clicked:
   * `({ defaultSortDirection: SortDirection, event: Event, sortBy: string, sortDirection: SortDirection }): void`.
   */
  sort?: (params: TableSortParams) => void;

  /** Data is currently sorted by this `dataKey` (if it is sorted at all). */
  sortBy?: string;

  /** Data is currently sorted in this direction (if it is sorted at all). */
  sortDirection?: SortDirectionType;

  /**
   * Element that scrolls the `Table` (instead of the `Table` scrolling itself): `"window"`, or a scrollable DOM element
   * (e.g. a container that the `Table` is rendered within, along with other content).
   *
   * The `Table` then renders all of its rows at their full height (below its header, which scrolls along with them), renders only the rows visible within the scroll element's viewport,
   * and its scroll methods scroll the scroll element.
   * Its position within the scroll element is measured when the scroll element scrolls or is resized, and when the `Table` re-renders
   * (e.g. call `forceUpdateGrid()` if content above the `Table` changes size without the `Table` re-rendering).
   * Pass `null` while the scroll element isn't available yet (e.g. before a ref to it has been attached);
   * the `Table` then renders the rows at its top.
   */
  scrollElement?: ScrollElement | null;

  /**
   * Optional custom inline style to attach to root `Table` element.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Optional override of inner `Grid` tab index default.
   * @default 0
   */
  tabIndex?: number | null;

  /** Width of the table. */
  width: number;
};

// Grid props that Table sets on its inner Grid itself, or that don't apply to its single column of rows
type OverriddenGridPropKeys =
  | "aria-readonly"
  | "autoContainerWidth"
  | "cellRenderer"
  | "columnCount"
  | "columnWidth"
  | "elementRef"
  | "estimatedColumnSize"
  | "initialScrollLeft"
  | "noContentRenderer"
  | "onSectionRendered"
  | "overscanColumnCount"
  | "role";

/**
 * `Table` props.
 * All other props are relayed to the inner `Grid` (see `GridProps`).
 */
export type TableProps = Omit<
  GridProps,
  OverriddenGridPropKeys | keyof TableOwnProps
> &
  TableOwnProps;

/** Public (imperative) methods of a `Table` instance. */
export interface TableImperativeAPI {
  /**
   * Forcefully re-render the inner `Grid` component.
   *
   * Calling `forceUpdate` on `Table` may not re-render the inner `Grid` since it uses `shallowCompare` as a performance optimization.
   * Use this method if you want to manually trigger a re-render.
   * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
   */
  forceUpdateGrid(): void;

  /**
   * Gets offset for a given row and alignment (`align`; `alignment` is a deprecated alias).
   * The alignment defaults to "auto"; an index of `-1` (the default) refers to the last row.
   */
  getOffsetForRow(params?: {
    align?: Alignment;
    /** @deprecated Use `align` instead. */
    alignment?: Alignment;
    index?: number;
  }): number;

  /**
   * Gets the scrollbar width used to pad the table-header.
   */
  getScrollbarWidth(): number;

  /**
   * Invalidate the size of a row (after the current render has been committed); see `Grid#invalidateCellSizeAfterRender`.
   * This method is intended for `CellMeasurer`.
   */
  invalidateCellSizeAfterRender(params: CellPosition): void;

  /**
   * Pre-measure all rows in a `Table`.
   *
   * Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
   * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
   */
  measureAllRows(): void;

  /**
   * Recompute row heights and offsets after the specified index (defaults to 0).
   *
   * `Table` has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property.
   * If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone.
   * In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.
   *
   * This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered table.
   */
  recomputeRowHeights(index?: number): void;

  /**
   * Recompute row heights and offsets after the specified row index (defaults to 0); see `Grid#recomputeGridSize`.
   * (The column index is ignored.) This method is intended for `CellMeasurer`; also see `recomputeRowHeights`.
   */
  recomputeGridSize(params?: Partial<CellPosition>): void;

  /**
   * Ensure the specified row is visible (scrolling if necessary); the column index is ignored.
   * This allows a `Table` to be used with `ArrowKeyStepper`; also see `scrollToRow`.
   */
  scrollToCell(params: {
    align?: Alignment;
    columnIndex?: number;
    rowIndex?: number;
  }): void;

  /**
   * Scroll to the specified vertical offset; `scrollLeft` is ignored (tables don't scroll horizontally).
   * Offsets are clamped to the scrollable range. This allows a `Table` to be used with `ScrollSync`.
   * Useful for animating position changes.
   *
   * If the `Table` has a `scrollElement`, the scroll element (e.g. the window) is scrolled instead.
   */
  scrollToPosition(params: ScrollPosition): void;

  /**
   * Ensure the row at the specified index is visible (scrolling if necessary).
   * This method can be used to safely scroll back to a row that a user has scrolled away from even if it was previously scrolled to.
   *
   * The `align` parameter (default "auto") controls the alignment of the row:
   * "auto" scrolls the least amount possible to ensure that the specified row is fully visible
   * (a row taller than the table is aligned to its start, so that its start is visible);
   * "start" aligns the row to the top of the table and "end" to the bottom; "center" aligns it in the middle.
   * This is a one-time scroll: the row is not kept in view afterwards (e.g. if the table's size or its row heights change).
   * Rows that haven't been measured yet (e.g. by `CellMeasurer`) are positioned using their estimated heights.
   *
   * If the `Table` has a `scrollElement`, the scroll element (e.g. the window) is scrolled instead.
   */
  scrollToRow(params: { align?: Alignment; index: number }): void;
}

/**
 * Props of a `Column`.
 * `Table` reads these from the props of each of its child elements (applying `defaultColumnProps`),
 * so a component that renders a `Column` and accepts these props can be used as a column as well.
 */
export type ColumnProps = {
  /** Optional aria-label value to set on the column header. */
  "aria-label"?: string;

  /**
   * Callback responsible for returning a cell's data, given its `dataKey`:
   * `({ columnData: any, dataKey: string, rowData: any }): any`.
   *
   * The default `cellDataGetter` expects to operate on either a vanilla Object or a Map-like object with a `get` method.
   * You should override it if your data is calculated or requires any custom processing.
   * Defaults to `defaultTableCellDataGetter`.
   */
  cellDataGetter?: TableCellDataGetter;

  /**
   * Callback responsible for rendering a cell's contents:
   * `({ cellData: any, columnData: any, columnIndex: number, dataKey: string, isScrolling: boolean, parent: TableImperativeAPI, rowData: any, rowIndex: number }): ReactNode`.
   *
   * The default `cellRenderer` (`defaultTableCellRenderer`) displays an attribute as a simple string.
   * You should override it if your data is some other type of object or requires custom formatting.
   */
  cellRenderer?: TableCellRenderer;

  /** Optional CSS class to apply to the rendered cell container. */
  className?: string;

  /**
   * Additional data passed to this column's `cellDataGetter`, `cellRenderer`, and `headerRenderer`.
   * Use this object to relay action-creators or relational data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnData?: any;

  /**
   * Uniquely identifies the row-data attribute corresponding to this cell
   * (eg this might be "name" in an array of user objects).
   */
  dataKey: string;

  /**
   * Default sort order when clicked for the first time.
   * @default "ASC"
   */
  defaultSortDirection?: SortDirectionType;

  /** If sort is enabled for the table at large, disable it for this column. */
  disableSort?: boolean;

  /**
   * Flex grow style.
   * @default 0
   */
  flexGrow?: number;

  /**
   * Flex shrink style.
   * @default 1
   */
  flexShrink?: number;

  /** Optional CSS class to apply to this column's header. */
  headerClassName?: string;

  /**
   * Optional callback responsible for rendering a column's header contents:
   * `({ columnData: any, dataKey: string, disableSort: boolean, label: ReactNode, sortBy: string, sortDirection: SortDirection }): ReactNode`.
   *
   * The default `headerRenderer` (`defaultTableHeaderRenderer`) displays the column `label` along with a sort indicator if the column is sort-enabled and active.
   */
  headerRenderer?: TableHeaderRenderer;

  /** Optional inline style to apply to this column's header. */
  headerStyle?: CSSProperties;

  /** Optional id to set on the column header; used for the cells' `aria-describedby`. */
  id?: string;

  /** Header label for this column. */
  label?: ReactNode;

  /** Maximum width of column; this property will only be used if `flexGrow` is greater than 0. */
  maxWidth?: number;

  /** Minimum width of column. */
  minWidth?: number;

  /**
   * Optional inline style to apply to the rendered cell container.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Flex basis (width) for this column;
   * This value can grow or shrink based on `flexGrow` and `flexShrink` properties.
   */
  width: number;
};

export type SortIndicatorProps = {
  /** Direction the column is currently sorted in. */
  sortDirection?: SortDirectionType;
};

/** Maps a `dataKey` to the direction it is sorted in. */
export type SortDirectionMap = { [dataKey: string]: SortDirectionType };

/** Parameters passed to the `sort` function returned by `createMultiSort` (compatible with the `Table` `sort` prop). */
export type MultiSortParams = {
  /** Sort direction to use if the column is not already sorted. */
  defaultSortDirection: SortDirectionType;

  /**
   * The event that triggered the sort.
   * SHIFT + click appends a column to the existing sort criteria (or toggles its direction);
   * CONTROL/META + click removes a column from the sort criteria.
   */
  event: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean };

  /** `dataKey` of the column that was clicked. */
  sortBy: string;
};

/** Parameters passed to the `createMultiSort` `sortCallback`. */
export type MultiSortCallbackParams = {
  /** Ordered array of fields to sort by, in order of importance. */
  sortBy: string[];

  /** Map of field name to "ASC" or "DESC" direction. */
  sortDirection: SortDirectionMap;
};

/** Callback notified (by `createMultiSort`) whenever the sort criteria change. */
export type MultiSortCallback = (params: MultiSortCallbackParams) => void;

/** Options accepted by `createMultiSort`. */
export type MultiSortOptions = {
  /**
   * Fields to initially sort by, in order of importance.
   * (The array is copied; it isn't mutated.)
   */
  defaultSortBy?: string[] | null;

  /** Initial sort direction of each `defaultSortBy` field; fields not specified default to "ASC". */
  defaultSortDirection?: SortDirectionMap;
};

/** Value returned by `createMultiSort`. */
export type MultiSortReturn = {
  /**
   * Sort property to be passed to the `Table` component.
   * This function replaces the `sortBy` and `sortDirection` values (and passes the new values to the sort callback).
   */
  sort: (params: MultiSortParams) => void;

  /**
   * Specifies the fields currently responsible for sorting data,
   * In order of importance.
   * A new array is created whenever the sort criteria change (it isn't mutated), so read it from this object when needed.
   */
  readonly sortBy: string[];

  /**
   * Specifies the direction a specific field is being sorted in.
   * A new object is created whenever the sort criteria change (it isn't mutated), so read it from this object when needed.
   */
  readonly sortDirection: SortDirectionMap;
};
