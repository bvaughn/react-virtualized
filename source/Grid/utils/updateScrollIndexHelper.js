// @flow

import type {Alignment, CellSize} from '../types';

import ScalingCellSizeAndPositionManager from './ScalingCellSizeAndPositionManager.js';

/**
 * Helper function that determines when to update scroll offsets to ensure that a scroll-to-index remains visible.
 * This function also ensures that the scroll ofset isn't past the last column/row of cells.
 */

type Params = {
  // Width or height of cells for the current axis
  cellSize?: CellSize,

  // Manages size and position metadata of cells
  cellSizeAndPositionManager: ScalingCellSizeAndPositionManager,

  // Previous number of rows or columns
  previousCellsCount: number,

  // Previous width or height of cells
  previousCellSize: CellSize,

  previousScrollToAlignment: Alignment,

  // Previous scroll-to-index
  previousScrollToIndex: number,

  // Previous width or height of the virtualized container
  previousSize: number,

  // Current scrollLeft or scrollTop
  scrollOffset: number,

  scrollToAlignment: Alignment,

  // Scroll-to-index
  scrollToIndex: number,

  // Width or height of the virtualized container
  size: number,

  sizeJustIncreasedFromZero: boolean,

  // Callback to invoke with an scroll-to-index value
  updateScrollIndexCallback: (index: number) => void,
};

export default function updateScrollIndexHelper({
  cellSize,
  cellSizeAndPositionManager,
  previousCellsCount,
  previousCellSize,
  previousScrollToAlignment,
  previousScrollToIndex,
  previousSize,
  scrollOffset,
  scrollToAlignment,
  scrollToIndex,
  size,
  sizeJustIncreasedFromZero,
  updateScrollIndexCallback,
}: Params) {
  const cellCount = cellSizeAndPositionManager.getCellCount();
  const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellCount;
  const sizeHasChanged =
    size !== previousSize ||
    sizeJustIncreasedFromZero ||
    !previousCellSize ||
    (typeof cellSize === 'number' && cellSize !== previousCellSize);

  // If we have a new scroll target OR if height/row-height has changed,
  // We should ensure that the scroll target is visible.
  if (
    hasScrollToIndex &&
    (sizeHasChanged ||
      scrollToAlignment !== previousScrollToAlignment ||
      scrollToIndex !== previousScrollToIndex)
  ) {
    updateScrollIndexCallback(scrollToIndex);

    // If we don't have a selected item but list size or number of children have decreased,
    // Make sure we aren't scrolled too far past the current content.
  } else if (
    !hasScrollToIndex &&
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
