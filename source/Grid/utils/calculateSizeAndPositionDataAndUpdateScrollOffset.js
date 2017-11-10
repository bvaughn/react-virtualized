// @flow

/**
 * Helper method that determines when to recalculate row or column metadata.
 */

type Params<T> = {
  // Number of rows or columns in the current axis
  cellCount: number,

  // Width or height of cells for the current axis
  cellSize: ?number,

  // Method to invoke if cell metadata should be recalculated
  computeMetadataCallback: (props: T) => void,

  // Parameters to pass to :computeMetadataCallback
  computeMetadataCallbackProps: T,

  // Newly updated number of rows or columns in the current axis
  nextCellsCount: number,

  // Newly updated width or height of cells for the current axis
  nextCellSize: ?number,

  // Newly updated scroll-to-index
  nextScrollToIndex: number,

  // Scroll-to-index
  scrollToIndex: number,

  // Callback to invoke if the scroll position should be recalculated
  updateScrollOffsetForScrollToIndex: () => void,
};

export default function calculateSizeAndPositionDataAndUpdateScrollOffset({
  cellCount,
  cellSize,
  computeMetadataCallback,
  computeMetadataCallbackProps,
  nextCellsCount,
  nextCellSize,
  nextScrollToIndex,
  scrollToIndex,
  updateScrollOffsetForScrollToIndex,
}: Params<*>) {
  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
  // In that event users should use the manual recompute methods to inform of changes.
  if (
    cellCount !== nextCellsCount ||
    ((typeof cellSize === 'number' || typeof nextCellSize === 'number') &&
      cellSize !== nextCellSize)
  ) {
    computeMetadataCallback(computeMetadataCallbackProps);

    // Updated cell metadata may have hidden the previous scrolled-to item.
    // In this case we should also update the scrollTop to ensure it stays visible.
    if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
      updateScrollOffsetForScrollToIndex();
    }
  }
}
