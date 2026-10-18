import type { ReactNode } from "react";

/**
 * A child that can be registered with `ColumnSizer` (e.g. a `Grid` or `MultiGrid`, or its imperative handle).
 * It must implement a `recomputeGridSize` method.
 */
export type ColumnSizerRegisteredChild = {
  /** Recomputes column sizes; called by `ColumnSizer` whenever its sizing props change. */
  recomputeGridSize: () => void;
};

/**
 * Parameters passed to the `ColumnSizer` children render function.
 */
export type ColumnSizerChildProps = {
  /**
   * This number reflects the lesser of the overall `Grid` width or the width of all columns.
   * Use this to make your `Grid` shrink to fit sparse content.
   */
  adjustedWidth: number;

  /** This value should be passed to the `Grid`'s `columnWidth` property. */
  columnWidth: number;

  /**
   * This value can be passed to the `Grid`'s `columnWidth` property,
   * but it's recommended that you use the `columnWidth` property instead.
   *
   * @deprecated This is a legacy property; use `columnWidth` instead.
   */
  getColumnWidth: () => number;

  /**
   * This function should be set as the child's `ref` property.
   * It enables column sizes to be recomputed when the `ColumnSizer` props change.
   * Only `Grid`/`MultiGrid` children (components with a `recomputeGridSize` method) are supported;
   * registering any other type of component throws an error.
   *
   * This function is stable; it does not change between renders.
   */
  registerChild: (child: ColumnSizerRegisteredChild | null) => void;
};

export type ColumnSizerProps = {
  /**
   * Function responsible for rendering a virtualized `Grid`.
   * It is passed `{ adjustedWidth, columnWidth, getColumnWidth, registerChild }`.
   *
   * The `columnWidth` value should be passed to the `Grid`'s `columnWidth` property,
   * and `registerChild` should be passed to the `Grid`'s `ref` property.
   * The `adjustedWidth` value is optional; it reflects the lesser of the overall width or the width of all columns.
   */
  children: (params: ColumnSizerChildProps) => ReactNode;

  /** Optional maximum allowed column width. */
  columnMaxWidth?: number;

  /** Optional minimum allowed column width. */
  columnMinWidth?: number;

  /** Number of columns in the `Grid` or `Table` child. */
  columnCount: number;

  /** Width of the `Grid` or `Table` child. */
  width: number;
};
