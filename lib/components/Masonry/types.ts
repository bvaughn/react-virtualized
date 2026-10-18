import type { CSSProperties, Key, ReactNode } from "react";
import type { ScrollElement } from "../../utils/scrollElement/types";
import type { CellMeasureCache } from "../CellMeasurer/types";

/**
 * Cache of cell measurements used by `Masonry` (typically an instance of `CellMeasurerCache`).
 * Default sizes help `Masonry` decide how many cells to batch-measure.
 */
export type MasonryCellMeasurerCache = Pick<
  CellMeasureCache,
  "getHeight" | "getWidth"
> & {
  /** Height reported for cells that have not yet been measured. */
  readonly defaultHeight: number;

  /** Width reported for cells that have not yet been measured. */
  readonly defaultWidth: number;
};

/**
 * Position of a cell within the `Masonry` layout.
 */
export type Position = {
  /** Offset (in pixels) from the left (or right, for `rtl` row direction) edge of the container. */
  left: number;

  /** Offset (in pixels) from the top edge of the container. */
  top: number;
};

/**
 * Positions a cell given its index.
 */
export type Positioner = (index: number) => Position;

/**
 * Configuration parameters for `createCellPositioner` (exported publicly as `createMasonryCellPositioner`).
 */
export type CreateCellPositionerParams = {
  /** Contains cell measurements (eg item height). */
  cellMeasurerCache: MasonryCellMeasurerCache;

  /** Number of columns to use in layout. */
  columnCount: number;

  /** Column width. */
  columnWidth: number;

  /** Empty space between columns; defaults to 0. */
  spacer?: number;
};

/**
 * Parameters for the `reset` method of a positioner created by `createCellPositioner`.
 */
export type CellPositionerResetParams = {
  /** Number of columns to use in layout. */
  columnCount: number;

  /** Column width. */
  columnWidth: number;

  /**
   * Empty space between columns.
   * Defaults to 0 (like `createCellPositioner`).
   */
  spacer?: number;
};

/**
 * Positioner returned by `createCellPositioner`.
 */
export type CellPositioner = Positioner & {
  /**
   * Updates the configuration settings (eg after a window resize) and resets the layout.
   * Call `recomputeCellPositions()` on the `Masonry` instance afterward.
   */
  reset: (params: CellPositionerResetParams) => void;
};

/**
 * Parameters passed to the `Masonry` `cellRenderer` prop.
 */
export type MasonryCellRendererParams = {
  /** Index of item within the collection. */
  index: number;

  /** The `Masonry` is currently being scrolled. */
  isScrolling: boolean;

  /** Unique key within array of cells. */
  key: Key;

  /**
   * Reference to the parent `Masonry` (its imperative handle).
   * This value should be passed as-is to `CellMeasurer`.
   */
  parent: MasonryImperativeAPI;

  /**
   * Style object to be applied to cell (to position it).
   * This must be passed through to the rendered cell element.
   */
  style: CSSProperties;
};

/**
 * Responsible for rendering a single cell given its index.
 */
export type MasonryCellRenderer = (
  params: MasonryCellRendererParams
) => ReactNode;

/**
 * Maps an index to a unique id to store cached measurement and position info for a cell.
 */
export type MasonryKeyMapper = (index: number) => Key;

/**
 * Parameters passed to the `Masonry` `onCellsRendered` callback.
 */
export type MasonryOnCellsRenderedParams = {
  /** Index of the first rendered cell (0 if no cells were rendered). */
  startIndex: number;

  /** Index of the last rendered cell (undefined if no cells were rendered). */
  stopIndex: number | undefined;
};

/**
 * Callback invoked with information about the cells that were most recently rendered.
 */
export type MasonryOnCellsRenderedCallback = (
  params: MasonryOnCellsRenderedParams
) => void;

/**
 * Parameters passed to the `Masonry` `onScroll` callback.
 */
export type MasonryOnScrollParams = {
  /** Height of the visible area (the `height` prop). */
  clientHeight: number;

  /** Estimated total height of all cells. */
  scrollHeight: number;

  /** Current vertical scroll offset. */
  scrollTop: number;
};

/**
 * Callback invoked whenever the scroll offset changes within the inner scrollable region.
 */
export type MasonryOnScrollCallback = (params: MasonryOnScrollParams) => void;

export type MasonryProps = {
  /** Optional ARIA label to attach to root `Masonry` element. */
  "aria-label"?: string;

  /** Total number of items. */
  cellCount: number;

  /**
   * Caches item measurements (typically an instance of `CellMeasurerCache`).
   * Default sizes help `Masonry` decide how many images to batch-measure.
   */
  cellMeasurerCache: MasonryCellMeasurerCache;

  /**
   * Positions a cell given an index: `(index: number) => ({ left: number, top: number })`.
   * See `createMasonryCellPositioner` for a built-in positioner.
   */
  cellPositioner: Positioner;

  /**
   * Responsible for rendering a cell given an index:
   * `({ index: number, isScrolling: boolean, key: Key, parent: MasonryImperativeAPI, style: CSSProperties }) => ReactNode`.
   * The `style` param must be passed through to the rendered cell element.
   * The cell should typically be wrapped in a `CellMeasurer`.
   */
  cellRenderer: MasonryCellRenderer;

  /** Optional custom CSS class name to attach to root `Masonry` element. */
  className?: string | null;

  /**
   * Height of the component; this value determines the number of visible items.
   * Required, unless a `scrollElement` is specified.
   *
   * With a `scrollElement`, the height of the scroll element's viewport is used instead;
   * this prop is then only used until the scroll element has been measured (e.g. during server rendering).
   */
  height?: number;

  /** Optional custom id to attach to root `Masonry` element. */
  id?: string | null;

  /**
   * Maps an index to a unique id to store cached measurement and position info for a cell.
   * This prevents eg cached measurements from being invalidated when a collection is re-ordered.
   * Defaults to the identity function (`index => index`).
   */
  keyMapper?: MasonryKeyMapper;

  /**
   * Callback invoked with information about the cells that were most recently rendered.
   * This callback is only invoked when visible cells have changed:
   * `({ startIndex: number, stopIndex: number }): void`.
   * Does nothing by default.
   */
  onCellsRendered?: MasonryOnCellsRenderedCallback | null;

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region:
   * `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`.
   * Does nothing by default.
   */
  onScroll?: MasonryOnScrollCallback | null;

  /**
   * Render this many additional pixels above and below the viewport.
   * This helps reduce flicker when a user scrolls quickly.
   * @default 20
   */
  overscanByPixels?: number;

  /**
   * Optional override of ARIA role default.
   * @default "grid"
   */
  role?: string;

  /**
   * Row direction of items; can be "ltr" or "rtl".
   * @default "ltr"
   */
  rowDirection?: string;

  /**
   * Element that scrolls the `Masonry` (instead of the `Masonry` scrolling itself): `"window"`, or a scrollable DOM element
   * (e.g. a container that the `Masonry` is rendered within, along with other content).
   *
   * The `Masonry` then renders at its full height, and renders only the cells visible within the scroll element's viewport.
   * Its position within the scroll element is measured when the scroll element scrolls or is resized, and when the `Masonry` re-renders
   * (e.g. call `forceUpdate()` if content above the `Masonry` changes size without the `Masonry` re-rendering).
   * Pass `null` while the scroll element isn't available yet (e.g. before a ref to it has been attached);
   * the `Masonry` then renders the cells at its top.
   */
  scrollElement?: ScrollElement | null;

  /**
   * Wait this amount of time (in milliseconds) after the last scroll event before resetting `pointer-events`
   * (and the `isScrolling` parameter passed to `cellRenderer`).
   * @default 150
   */
  scrollingResetTimeInterval?: number;

  /**
   * Optional custom inline style to attach to root `Masonry` element.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Optional override of tab index default.
   * @default 0
   */
  tabIndex?: number;

  /** Width of the component; this value determines the number of visible items. */
  width: number;
};

/**
 * Identifies a cell within a `Masonry` (for the `CellMeasurer` interop methods).
 * Only `rowIndex` (the cell's index) is used; `columnIndex` is accepted (and ignored) for compatibility with `Grid`.
 */
export type MasonryCellPosition = {
  columnIndex?: number;
  rowIndex: number;
};

/**
 * Imperative API of a `Masonry` (accessed using a ref, eg `useRef<MasonryImperativeAPI>(null)`).
 * This is also the `parent` value passed to `cellRenderer` (for `CellMeasurer`).
 */
export interface MasonryImperativeAPI {
  /**
   * Clears the internal position cache and re-renders.
   * Cells are positioned again (by the `cellPositioner`) as they are rendered.
   */
  clearCellPositions(): void;

  /**
   * Forcefully re-renders the `Masonry` (and its visible cells).
   *
   * Re-rendering a `Masonry` with the same props does not re-render its cells (it is memoized).
   * Use this method if the underlying cell data has changed but the props have not.
   */
  forceUpdate(): void;

  /**
   * Notifies the `Masonry` that the specified cell has been measured for the first time (while rendering);
   * the cell is positioned (by the `cellPositioner`) once the current render has been committed, then the `Masonry` re-renders.
   * Only `rowIndex` (the cell's index) is used.
   * This method is intended for `CellMeasurer`.
   */
  invalidateCellSizeAfterRender(params: MasonryCellPosition): void;

  /**
   * Resets the internal position cache, synchronously re-computes the positions of all measured cells
   * (by calling the `cellPositioner` for each of them, in index order), then re-renders.
   * Reset the `cellPositioner` (e.g. with its `reset` method) before calling this method.
   */
  recomputeCellPositions(): void;

  /**
   * Re-renders the `Masonry`, e.g. after more cells have been loaded (this method is called by `InfiniteLoader`)
   * or a cell has been re-measured (it is called by `CellMeasurer`'s `measure` function).
   * Parameters (the index of the first changed cell, as `rowIndex`) are accepted for compatibility with `Grid` and ignored.
   *
   * Cached cell positions are not changed: to re-position cells after their sizes have changed,
   * reset the `cellPositioner` and call `recomputeCellPositions()`.
   */
  recomputeGridSize(params?: Partial<MasonryCellPosition>): void;
}
