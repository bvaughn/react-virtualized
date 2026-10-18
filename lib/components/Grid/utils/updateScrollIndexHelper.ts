import type { ScalingCellSizeAndPositionManager } from "./ScalingCellSizeAndPositionManager";

/**
 * Helper function that ensures that the scroll offset isn't past the last column/row of cells
 * after the size of the Grid (or its number of columns/rows) has decreased.
 */

type Params = {
  // Manages size and position metadata of cells
  cellSizeAndPositionManager: Pick<
    ScalingCellSizeAndPositionManager,
    "getCellCount" | "getTotalSize"
  >;

  // Previous number of rows or columns
  previousCellsCount: number;

  // Previous width or height of the virtualized container
  previousSize: number;

  // Current scrollLeft or scrollTop
  scrollOffset: number;

  // Width or height of the virtualized container
  size: number;

  // Callback to invoke with the index of the last cell
  updateScrollIndexCallback: (index: number) => void;
};

export function updateScrollIndexHelper({
  cellSizeAndPositionManager,
  previousCellsCount,
  previousSize,
  scrollOffset,
  size,
  updateScrollIndexCallback
}: Params) {
  const cellCount = cellSizeAndPositionManager.getCellCount();

  // If the size or number of children have decreased,
  // make sure we aren't scrolled too far past the current content.
  if (
    cellCount > 0 &&
    (size < previousSize || cellCount < previousCellsCount)
  ) {
    // We need to ensure that the current scroll offset is still within the collection's range.
    // To do this, we don't need to measure everything; CellMeasurer would perform poorly.
    // Just check to make sure we're still okay.
    // Only adjust the scroll position if we've scrolled below the last set of rows.
    if (scrollOffset > cellSizeAndPositionManager.getTotalSize() - size) {
      updateScrollIndexCallback(cellCount - 1);
    }
  }
}
