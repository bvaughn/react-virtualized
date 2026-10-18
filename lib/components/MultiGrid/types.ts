import type { CSSProperties } from "react";
import type {
  Alignment,
  CellPosition,
  GridProps,
  ScrollbarPresenceChange,
  ScrollPosition
} from "../Grid/types";

/**
 * `MultiGrid` accepts most `Grid` props (most of which, eg `cellRenderer`, are relayed to all child `Grid`s;
 * some, eg `columnCount` and `rowCount`, are adjusted slightly to support fixed rows and columns),
 * plus the following props.
 *
 * A `MultiGrid` always scrolls itself (it doesn't support a `scrollElement`).
 * To scroll a `MultiGrid`, use its imperative `scrollToCell` or `scrollToPosition` methods.
 */
export type MultiGridProps = Omit<
  GridProps,
  "height" | "onScrollbarPresenceChange" | "scrollElement" | "style"
> & {
  /** Height of the `MultiGrid` (including its fixed rows); determines the number of visible (vs virtualized) rows. */
  height: number;

  /**
   * Optional custom className to attach to bottom-left `Grid` element.
   * @default ""
   */
  classNameBottomLeftGrid?: string;

  /**
   * Optional custom className to attach to bottom-right `Grid` element.
   * @default ""
   */
  classNameBottomRightGrid?: string;

  /**
   * Optional custom className to attach to top-left `Grid` element.
   * @default ""
   */
  classNameTopLeftGrid?: string;

  /**
   * Optional custom className to attach to top-right `Grid` element.
   * @default ""
   */
  classNameTopRightGrid?: string;

  /**
   * Fixed columns can be actively scrolled (e.g. with a mouse wheel while the cursor is over them).
   * @default false
   */
  enableFixedColumnScroll?: boolean;

  /**
   * Fixed rows can be actively scrolled (e.g. with a mouse wheel while the cursor is over them).
   * @default false
   */
  enableFixedRowScroll?: boolean;

  /**
   * Number of fixed columns.
   * @default 0
   */
  fixedColumnCount?: number;

  /**
   * Number of fixed rows.
   * @default 0
   */
  fixedRowCount?: number;

  /**
   * Optionally hides the bottom-left `Grid` scrollbar by adding an additional wrapper.
   * Only useful if `enableFixedColumnScroll` is set to `true`.
   * @default false
   */
  hideBottomLeftGridScrollbar?: boolean;

  /**
   * Optionally hides the top-right `Grid` scrollbar by adding an additional wrapper.
   * Only useful if `enableFixedRowScroll` is set to `true`.
   * @default false
   */
  hideTopRightGridScrollbar?: boolean;

  /**
   * Called whenever a horizontal or vertical scrollbar is added or removed from the bottom-right `Grid`:
   * `({ horizontal: boolean, size: number, vertical: boolean }): void`.
   */
  onScrollbarPresenceChange?: (params: ScrollbarPresenceChange) => void;

  /**
   * Optional custom inline style to attach to root `MultiGrid` element.
   * @default {}
   */
  style?: CSSProperties;

  /**
   * Optional custom inline style to attach to bottom-left `Grid` element.
   * @default {}
   */
  styleBottomLeftGrid?: CSSProperties;

  /**
   * Optional custom inline style to attach to bottom-right `Grid` element.
   * @default {}
   */
  styleBottomRightGrid?: CSSProperties;

  /**
   * Optional custom inline style to attach to top-left `Grid` element.
   * @default {}
   */
  styleTopLeftGrid?: CSSProperties;

  /**
   * Optional custom inline style to attach to top-right `Grid` element.
   * @default {}
   */
  styleTopRightGrid?: CSSProperties;
};

/** Public (imperative) methods of a `MultiGrid` instance. */
export interface MultiGridImperativeAPI {
  /**
   * Pass-thru that calls `forceUpdate` on all child `Grid`s.
   */
  forceUpdateGrids(): void;

  /**
   * Invalidate the size of a cell (after the current render has been committed); see `Grid#invalidateCellSizeAfterRender`.
   * The invalidated cells (of all child `Grid`s) are recomputed, and the `MultiGrid` re-rendered, once the current render has been committed.
   * This method is intended for `CellMeasurer`.
   */
  invalidateCellSizeAfterRender(params?: Partial<CellPosition>): void;

  /**
   * Pass-thru that calls `measureAllCells` on all child `Grid`s.
   */
  measureAllCells(): void;

  /**
   * Pass-thru that calls `recomputeGridSize` on all child `Grid`s
   * (adjusting the specified indices for fixed rows and columns).
   * Both indices default to 0.
   *
   * This also recomputes the `MultiGrid`'s own layout (the height of the fixed rows and the width of the fixed columns)
   * and re-renders it.
   */
  recomputeGridSize(params?: { columnIndex?: number; rowIndex?: number }): void;

  /**
   * Ensure the specified column and/or row is visible (scrolling if necessary); see `Grid#scrollToCell`.
   * Indices include the fixed columns and rows (which are always visible, so they are not scrolled to).
   * The fixed rows and columns are kept in sync with the scrolled section.
   */
  scrollToCell(params: {
    align?: Alignment;
    columnIndex?: number;
    rowIndex?: number;
  }): void;

  /**
   * Scroll to the specified offset(s) of the scrollable (bottom-right) section; see `Grid#scrollToPosition`.
   * The fixed rows and columns are kept in sync with it.
   * This allows a `MultiGrid` to be used with `ScrollSync`.
   */
  scrollToPosition(params: ScrollPosition): void;
}
