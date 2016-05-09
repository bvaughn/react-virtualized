/**
 * Helper method that determines when to recalculate row or column metadata.
 *
 * @param cellCount Number of rows or columns in the current axis
 * @param cellsSize Width or height of cells for the current axis
 * @param computeMetadataCallback Method to invoke if cell metadata should be recalculated
 * @param computeMetadataCallbackProps Parameters to pass to :computeMetadataCallback
 * @param nextCellsCount Newly updated number of rows or columns in the current axis
 * @param nextCellsSize Newly updated width or height of cells for the current axis
 * @param nextScrollToIndex Newly updated scroll-to-index
 * @param scrollToIndex Scroll-to-index
 * @param updateScrollOffsetForScrollToIndex Callback to invoke if the scroll position should be recalculated
 */
export default function calculateSizeAndPositionDataAndUpdateScrollOffset ({
  cellCount,
  cellSize,
  computeMetadataCallback,
  computeMetadataCallbackProps,
  nextCellsCount,
  nextCellSize,
  nextScrollToIndex,
  scrollToIndex,
  updateScrollOffsetForScrollToIndex
}) {
  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
  // In that event users should use the manual recompute methods to inform of changes.
  if (
    cellCount !== nextCellsCount ||
    (
      (
        typeof cellSize === 'number' ||
        typeof nextCellSize === 'number'
      ) &&
      cellSize !== nextCellSize
    )
  ) {
    computeMetadataCallback(computeMetadataCallbackProps)

    // Updated cell metadata may have hidden the previous scrolled-to item.
    // In this case we should also update the scrollTop to ensure it stays visible.
    if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
      updateScrollOffsetForScrollToIndex()
    }
  }
}
