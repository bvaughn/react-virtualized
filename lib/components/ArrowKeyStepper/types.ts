import type { ReactNode } from "react";
import type { RenderedSection } from "../Grid/types";

/**
 * Scroll-to indices managed by `ArrowKeyStepper`.
 */
export type ScrollIndices = {
  /** Index of the column that should be scrolled into view. */
  scrollToColumn: number;

  /** Index of the row that should be scrolled into view. */
  scrollToRow: number;
};

/**
 * Range of cells currently visible in the decorated component.
 * This is a subset of the parameters passed to `Grid`'s `onSectionRendered` callback.
 */
export type ArrowKeyStepperRenderedSection = Pick<
  RenderedSection,
  "columnStartIndex" | "columnStopIndex" | "rowStartIndex" | "rowStopIndex"
>;

/**
 * Imperative API of the component decorated by `ArrowKeyStepper` (e.g. a `Grid` ref),
 * registered through the `registerChild` parameter.
 */
export interface ArrowKeyStepperChild {
  /** Ensure the specified column and row are visible. */
  scrollToCell(params: { columnIndex?: number; rowIndex?: number }): void;
}

/**
 * Parameters passed to the `ArrowKeyStepper` children render function.
 */
export type ArrowKeyStepperChildProps = {
  /**
   * Pass-through callback to be attached to the child component (e.g. `Grid`'s `onSectionRendered` prop);
   * informs the key-stepper which range of cells are currently visible.
   */
  onSectionRendered: (params: ArrowKeyStepperRenderedSection) => void;

  /**
   * Stable ref callback to be attached to the decorated component (e.g. `<Grid ref={registerChild} />`).
   * Whenever the active cell (`scrollToColumn`/`scrollToRow`) changes, `ArrowKeyStepper` scrolls it into view
   * by calling `scrollToCell({ columnIndex, rowIndex })` on the registered component.
   * The active cell is also scrolled into view when a component is first registered.
   */
  registerChild: (child: ArrowKeyStepperChild | null) => void;

  /**
   * Column index of the active cell.
   * It is scrolled into view automatically (see `registerChild`); it can also be used to e.g. highlight the active cell.
   */
  scrollToColumn: number;

  /**
   * Row index of the active cell.
   * It is scrolled into view automatically (see `registerChild`); it can also be used to e.g. highlight the active cell.
   */
  scrollToRow: number;
};

export type ArrowKeyStepperProps = {
  /**
   * Function responsible for rendering children.
   * It is passed `onSectionRendered` and `registerChild` parameters, which should be attached to the decorated
   * virtualized component (e.g. `<Grid onSectionRendered={onSectionRendered} ref={registerChild} />`),
   * and the `scrollToColumn` and `scrollToRow` indices of the active cell (e.g. to highlight it).
   * The active cell is scrolled into view through the registered component's `scrollToCell` method.
   */
  children: (params: ArrowKeyStepperChildProps) => ReactNode;

  /** CSS class name to attach to the wrapper `<div>`. */
  className?: string;

  /** Number of columns in grid; for `Table` and `List` this property should always be `1`. */
  columnCount: number;

  /**
   * Disables all scrolling using arrow-keys.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * This component is "controlled"; it will not update `scrollToColumn` or `scrollToRow` itself.
   * This property should be used with `onScrollToChange`.
   *
   * @default false
   */
  isControlled?: boolean;

  /**
   * Controls behavior of stepper when arrow key direction changes.
   * "cells" means that the index will only increment or decrement by 1;
   * "edges" means that the opposite side of the grid will be incremented.
   *
   * @default "edges"
   */
  mode?: "cells" | "edges";

  /** Called when arrow key navigation should update the current scroll-to values. */
  onScrollToChange?: (params: ScrollIndices) => void;

  /** Number of rows in grid. */
  rowCount: number;

  /**
   * Default/initial `scrollToColumn` value.
   * When `isControlled` is true, this is the current `scrollToColumn` value.
   *
   * @default 0
   */
  scrollToColumn?: number;

  /**
   * Default/initial `scrollToRow` value.
   * When `isControlled` is true, this is the current `scrollToRow` value.
   *
   * @default 0
   */
  scrollToRow?: number;
};

/**
 * Public methods available on an `ArrowKeyStepper` ref.
 */
export interface ArrowKeyStepperImperativeAPI {
  /**
   * Override the local state of the component with new values for `scrollToRow` and `scrollToColumn`.
   */
  setScrollIndexes(params: ScrollIndices): void;
}
