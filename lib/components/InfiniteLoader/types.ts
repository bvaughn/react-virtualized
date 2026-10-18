import type { ReactNode } from "react";
import type { CellPosition } from "../Grid/types";

/**
 * A range of rows (inclusive).
 */
export type IndexRange = {
  /** Index of the first row in the range. */
  startIndex: number;

  /** Index of the last row in the range (inclusive). */
  stopIndex: number;
};

/**
 * Structural type describing the virtualized component registered via `registerChild`:
 * either a component instance or a function component's imperative handle (e.g. `List`, `Table`, `Grid` or `MultiGrid`).
 *
 * Once rows have finished loading, `InfiniteLoader` re-renders the child by calling the **first** of these methods that it implements:
 * `recomputeGridSize`, `recomputeRowHeights`, `forceUpdateGrid`, `forceUpdate`.
 * Function components have no `forceUpdate()` method, so a custom function component child should expose one of the other methods
 * through its imperative handle (e.g. via `useImperativeHandle`).
 */
export interface InfiniteLoaderChildInstance {
  /**
   * Recomputes cell sizes and re-renders (e.g. `Grid`, `List`, `Table` or `MultiGrid`); preferred over the other methods if defined.
   * Note that `InfiniteLoader` calls this method with the most recently rendered start index (`{ rowIndex }`).
   */
  recomputeGridSize?(params?: Partial<CellPosition>): void;

  /**
   * Recomputes row heights after the specified index and re-renders (e.g. `List` or `Table`); used if `recomputeGridSize` is not defined.
   * Note that `InfiniteLoader` calls this method with the most recently rendered start index.
   */
  recomputeRowHeights?(index?: number): void;

  /** Re-renders the inner `Grid` (e.g. `List` or `Table`); used if neither recompute method is defined. */
  forceUpdateGrid?(): void;

  /**
   * Forces a class component to re-render; used only if none of the other methods are defined.
   * (Function components have no `forceUpdate()`; expose one of the other methods instead.)
   */
  forceUpdate?(): void;
}

/**
 * Parameters passed to the `InfiniteLoader` children render function.
 */
export type InfiniteLoaderChildProps = {
  /**
   * This function should be passed as the child's `onRowsRendered` property.
   * It informs the loader when the user is scrolling.
   */
  onRowsRendered: (params: IndexRange) => void;

  /**
   * This function should be set as the child's `ref` property.
   * The child (instance or imperative handle) should implement one of the methods described by `InfiniteLoaderChildInstance`.
   * It enables a set of rows to be refreshed once their data has finished loading.
   */
  registerChild: (registeredChild: InfiniteLoaderChildInstance | null) => void;
};

export type InfiniteLoaderProps = {
  /**
   * Function responsible for rendering a virtualized component.
   * It is passed `onRowsRendered` and `registerChild` parameters.
   * The `onRowsRendered` function should be passed through to the child's `onRowsRendered` property.
   * The `registerChild` callback should be set as the virtualized component's `ref`.
   */
  children: (params: InfiniteLoaderChildProps) => ReactNode;

  /**
   * Function responsible for tracking the loaded state of each row.
   * Rows that are currently loading can be treated as loaded to avoid requesting them multiple times.
   */
  isRowLoaded: (params: { index: number }) => boolean;

  /**
   * Callback to be invoked when more rows must be loaded.
   * The returned Promise should be resolved once row data has finished loading.
   * It will be used to determine when to refresh the list with the newly-loaded data.
   * This callback may be called multiple times in reaction to a single scroll event.
   */
  loadMoreRows: (params: IndexRange) => Promise<unknown> | void;

  /**
   * Minimum number of rows to be loaded at a time.
   * This property can be used to batch requests to reduce HTTP requests.
   *
   * @default 10
   */
  minimumBatchSize?: number;

  /**
   * Number of rows in list; can be arbitrary high number if actual number is unknown.
   *
   * @default 0
   */
  rowCount?: number;

  /**
   * Threshold at which to pre-fetch data.
   * A threshold X means that data will start loading when a user scrolls within X rows.
   *
   * @default 15
   */
  threshold?: number;
};

/**
 * Imperative API exposed by `InfiniteLoader` (e.g. via `useRef<InfiniteLoaderImperativeAPI>(null)`).
 */
export interface InfiniteLoaderImperativeAPI {
  /**
   * Reset any cached data about already-loaded rows.
   * This method should be called if any/all loaded data needs to be refetched (e.g. a filtered list where the search criteria changes).
   * If `autoReload` is true, the last loaded batch will be automatically reloaded.
   */
  resetLoadMoreRowsCache(autoReload?: boolean): void;
}
