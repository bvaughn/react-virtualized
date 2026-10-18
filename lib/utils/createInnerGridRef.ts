import type { CellPosition, GridImperativeAPI } from "../components/Grid/types";

export type InnerGridRef = {
  /** The inner Grid's handle (once its ref has been attached). */
  getGrid: () => GridImperativeAPI | null;

  /** Ref callback for the inner Grid. */
  setGridRef: (grid: GridImperativeAPI | null) => void;

  /** Calls the Grid's `invalidateCellSizeAfterRender`, or keeps the call until the Grid's ref has been attached. */
  invalidateCellSizeAfterRender: (cell: CellPosition) => void;

  /** Calls the Grid's `recomputeGridSize`, or keeps the call until the Grid's ref has been attached. */
  recomputeGridSize: (cell: CellPosition) => void;
};

// Merges two cell positions into the one that covers both (i.e. the smallest indices)
const mergeCellPositions = (
  prev: CellPosition | null,
  next: CellPosition
): CellPosition =>
  prev === null
    ? next
    : {
        columnIndex: Math.min(prev.columnIndex, next.columnIndex),
        rowIndex: Math.min(prev.rowIndex, next.rowIndex)
      };

/**
 * Tracks the inner Grid of a component that wraps one (e.g. List or Table, whose handles delegate to the Grid).
 *
 * When the wrapper mounts, its cells (e.g. CellMeasurer) run their layout effects before the inner Grid's handle
 * is attached to the wrapper's ref (the refs of parents are attached after the effects of their children run).
 * Cell size invalidations and recomputations requested in the meantime are kept (merged to the smallest indices)
 * and passed on to the Grid once its ref has been attached.
 * (The Grid attaches its handle before running its own layout effect, which then processes the invalidations.)
 */
export function createInnerGridRef(): InnerGridRef {
  let grid: GridImperativeAPI | null = null;
  let pendingInvalidation: CellPosition | null = null;
  let pendingRecomputation: CellPosition | null = null;

  return {
    getGrid: () => grid,

    setGridRef(value) {
      grid = value;
      if (grid === null) {
        return;
      }

      if (pendingRecomputation !== null) {
        const cell = pendingRecomputation;
        pendingRecomputation = null;
        grid.recomputeGridSize(cell);
      }
      if (pendingInvalidation !== null) {
        const cell = pendingInvalidation;
        pendingInvalidation = null;
        grid.invalidateCellSizeAfterRender(cell);
      }
    },

    invalidateCellSizeAfterRender(cell) {
      if (grid !== null) {
        grid.invalidateCellSizeAfterRender(cell);
      } else {
        pendingInvalidation = mergeCellPositions(pendingInvalidation, cell);
      }
    },

    recomputeGridSize(cell) {
      if (grid !== null) {
        grid.recomputeGridSize(cell);
      } else {
        pendingRecomputation = mergeCellPositions(pendingRecomputation, cell);
      }
    }
  };
}
