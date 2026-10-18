import type { ReactNode } from "react";

/**
 * Interface for a cache of cell measurements shared between `CellMeasurer` and its parent
 * (e.g. `Grid`, `List`, `Table`, `MultiGrid` or `Masonry`).
 * `CellMeasurerCache` is the default implementation.
 */
export interface CellMeasureCache {
  /** Returns true if cells have a fixed width (and a dynamic, measured height). */
  hasFixedWidth(): boolean;

  /** Returns true if cells have a fixed height (and a dynamic, measured width). */
  hasFixedHeight(): boolean;

  /** Returns true if the specified cell has already been measured. */
  has(rowIndex: number, columnIndex: number): boolean;

  /** Stores the measured size of the specified cell. */
  set(
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ): void;

  /** Returns the (measured or default) height of the specified cell. */
  getHeight(rowIndex: number, columnIndex?: number): number;

  /** Returns the (measured or default) width of the specified cell. */
  getWidth(rowIndex: number, columnIndex?: number): number;
}

/**
 * Identifies a cell within a parent `Grid`.
 */
export type CellMeasurerCellPosition = {
  columnIndex: number;
  rowIndex: number;
};

/**
 * Structural type of the parent component (e.g. a `Grid`, `List`, `Table`, `MultiGrid` or `Masonry` instance)
 * that `CellMeasurer` notifies when a cell's measured size changes.
 */
export type CellMeasurerParent = {
  /** Called after a cell has been measured for the first time (while rendering). */
  invalidateCellSizeAfterRender?: (cell: CellMeasurerCellPosition) => void;

  /** Called when a cell has been re-measured (via `measure`) and its size has changed. */
  recomputeGridSize?: (cell: CellMeasurerCellPosition) => void;
};

/**
 * Parameters passed to a `CellMeasurer` function child.
 */
export type CellMeasurerChildParams = {
  /**
   * Perform the cell measurements (e.g. after an image within the cell has loaded).
   * Calling this after the `CellMeasurer` has unmounted (e.g. from a timer or a load event) does nothing.
   *
   * This function is stable (it's the same function for the lifetime of the `CellMeasurer`).
   */
  measure: () => void;

  /**
   * Specify the DOM element to be measured; can be used as a `ref` (e.g. `<div ref={registerChild} />`).
   * By default the element returned by the function child is measured;
   * an element registered with `registerChild` takes precedence over it.
   * Use this when the element to be measured is nested within the returned element,
   * or when the returned element is a component that doesn't pass its `ref` along to a DOM element.
   *
   * This function is stable (it's the same function for the lifetime of the `CellMeasurer`).
   */
  registerChild: (element: Element | null | undefined) => void;
};

/**
 * Function child of `CellMeasurer`.
 */
export type CellMeasurerChildFunction = (
  params: CellMeasurerChildParams
) => ReactNode;

export type CellMeasurerProps = {
  /**
   * Cache to be shared between `CellMeasurer` and its parent `Grid`.
   * Typically an instance of `CellMeasurerCache`.
   */
  cache: CellMeasureCache;

  /**
   * Either a React element as a child (eg `<div />`) or a function
   * (eg. `({ measure, registerChild }) => <div ref={registerChild} />`).
   *
   * `CellMeasurer` attaches a `ref` to the child element to find the DOM element to measure
   * (the child's own `ref`, if any, still receives the element).
   * So the child must be a DOM element (e.g. `<div>`) or a component that passes its `ref` along to one:
   * in React 19, a function component can pass its `ref` prop to a DOM element;
   * in React 18, function components must use `forwardRef` for this.
   *
   * The function receives a `measure` callback (to re-measure the cell, e.g. after an image has loaded)
   * and a `registerChild` callback (to specify the DOM element to be measured; can be used as a `ref`).
   * Use `registerChild` if the child doesn't pass its `ref` along to a DOM element,
   * or to measure an element nested within the child.
   *
   * Children that can't be measured (e.g. text, an array or a fragment, without `registerChild`) are rendered as-is,
   * and a warning is logged in development mode.
   */
  children: ReactNode | CellMeasurerChildFunction;

  /**
   * Index of column being measured (within the parent `Grid`) or 0 (if used within a `List` or `Table`).
   *
   * @default 0
   */
  columnIndex?: number;

  /**
   * Index of row being measured; alias of `rowIndex` (as passed to a `List` row renderer).
   * Only used if `rowIndex` is not specified.
   */
  index?: number;

  /**
   * Reference to the parent `Grid` (or `List`, `Table`, `MultiGrid`, `Masonry`);
   * this value is passed by `Grid` to the `cellRenderer` and should be passed along as-is.
   */
  parent: CellMeasurerParent;

  /**
   * Index of row being measured (within the parent `Grid`).
   * Defaults to `index` (or 0 if neither is specified).
   */
  rowIndex?: number;
};

export type CellMeasurerCacheParams = {
  /**
   * Unmeasured cells will initially report this height
   * (or `minHeight`, if that is greater).
   *
   * @default 30
   */
  defaultHeight?: number;

  /**
   * Unmeasured cells will initially report this width
   * (or `minWidth`, if that is greater).
   *
   * @default 100
   */
  defaultWidth?: number;

  /**
   * Rendered cells will have a fixed height and a dynamic (measured) width.
   *
   * @default false
   */
  fixedHeight?: boolean;

  /**
   * Rendered cells will have a fixed width and a dynamic (measured) height.
   *
   * @default false
   */
  fixedWidth?: boolean;

  /**
   * Derived row height (of multiple cells) should not be less than this value.
   *
   * @default 0
   */
  minHeight?: number;

  /**
   * Derived column width (of multiple cells) should not be less than this value.
   *
   * @default 0
   */
  minWidth?: number;

  /**
   * Maps a cell's row and column index to a cache key, e.g. an item ID.
   * This prevents the cached measurements from being invalidated when the parent collection is modified
   * (e.g. items are inserted or reordered).
   * Defaults to a mapper that returns `` `${rowIndex}-${columnIndex}` ``.
   */
  keyMapper?: (rowIndex: number, columnIndex: number) => unknown;
};

/**
 * Public API of a `CellMeasurerCache` instance.
 */
export interface CellMeasurerCacheAPI {
  /**
   * Reset cached measurements for a specific cell.
   *
   * This should be called when a cell needs to be re-measured to handle dynamic content
   * (e.g. replacing a loading indicator with loaded content, or reacting to state changes for stateful cells).
   * `columnIndex` defaults to `0`.
   */
  clear(rowIndex: number, columnIndex?: number): void;

  /**
   * Reset cached measurements for all cells.
   *
   * This should be called when a `Grid`, `List` or `Table` needs to reflow its content due to a resize in a responsive layout
   * (e.g. a change in window width may impact the height of cells).
   */
  clearAll(): void;

  /**
   * Returns the derived width of a column (its widest measured cell) or the default width.
   * Pass this as the `columnWidth` prop of a `Grid` (or `MultiGrid`);
   * it's bound to the cache, so it can be passed as-is.
   */
  columnWidth(params: { index: number }): number;

  /**
   * Height reported for unmeasured cells (read-only).
   */
  readonly defaultHeight: number;

  /**
   * Width reported for unmeasured cells (read-only).
   */
  readonly defaultWidth: number;

  /**
   * Returns the (measured or default) height of the specified cell.
   * `columnIndex` defaults to `0`.
   */
  getHeight(rowIndex: number, columnIndex?: number): number;

  /**
   * Returns the (measured or default) width of the specified cell.
   * `columnIndex` defaults to `0`.
   */
  getWidth(rowIndex: number, columnIndex?: number): number;

  /**
   * Returns true if the specified cell has already been measured.
   * `columnIndex` defaults to `0`.
   */
  has(rowIndex: number, columnIndex?: number): boolean;

  /**
   * Returns true if cells have a fixed height (and a dynamic, measured width);
   * see the `fixedHeight` option.
   */
  hasFixedHeight(): boolean;

  /**
   * Returns true if cells have a fixed width (and a dynamic, measured height);
   * see the `fixedWidth` option.
   */
  hasFixedWidth(): boolean;

  /**
   * Returns the derived height of a row (its tallest measured cell) or the default height.
   * Pass this as the `rowHeight` prop of a `Grid`, `List` or `Table`;
   * it's bound to the cache, so it can be passed as-is.
   */
  rowHeight(params: { index: number }): number;

  /**
   * Stores the measured size of the specified cell.
   * This is called by `CellMeasurer` and doesn't usually need to be called directly.
   */
  set(
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ): void;
}
