import getUpdatedOffsetForIndex from '../../utils/getUpdatedOffsetForIndex'

/**
 * Helper function that determines when to update scroll offsets to ensure that a scroll-to-index remains visible.
 * This function also ensures that the scroll ofset isn't past the last column/row of cells.
 *
 * @param cellsSize Width or height of cells for the current axis
 * @param cellSizeAndPositionManager Manages size and position metadata of cells
 * @param previousCellsCount Previous number of rows or columns
 * @param previousCellsSize Previous width or height of cells
 * @param previousScrollToIndex Previous scroll-to-index
 * @param previousSize Previous width or height of the virtualized container
 * @param scrollOffset Current scrollLeft or scrollTop
 * @param scrollToIndex Scroll-to-index
 * @param size Width or height of the virtualized container
 * @param updateScrollIndexCallback Callback to invoke with an scroll-to-index value
 */
export default function updateScrollIndexHelper ({
  cellSize,
  cellSizeAndPositionManager,
  previousCellsCount,
  previousCellSize,
  previousScrollToIndex,
  previousSize,
  scrollOffset,
  scrollToIndex,
  size,
  updateScrollIndexCallback
}) {
  const cellCount = cellSizeAndPositionManager.getCellCount()
  const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellCount
  const sizeHasChanged = (
    size !== previousSize ||
    !previousCellSize ||
    (
      typeof cellSize === 'number' &&
      cellSize !== previousCellSize
    )
  )

  // If we have a new scroll target OR if height/row-height has changed,
  // We should ensure that the scroll target is visible.
  if (
    hasScrollToIndex &&
    (
      sizeHasChanged ||
      scrollToIndex !== previousScrollToIndex
    )
  ) {
    updateScrollIndexCallback(scrollToIndex)

  // If we don't have a selected item but list size or number of children have decreased,
  // Make sure we aren't scrolled too far past the current content.
  } else if (
    !hasScrollToIndex &&
    cellCount > 0 &&
    (
      size < previousSize ||
      cellCount < previousCellsCount
    )
  ) {
    scrollToIndex = cellCount - 1

    const cellMetadatum = cellSizeAndPositionManager.getSizeAndPositionOfCell(scrollToIndex)
    const calculatedScrollOffset = getUpdatedOffsetForIndex({
      cellOffset: cellMetadatum.offset,
      cellSize: cellMetadatum.size,
      containerSize: size,
      currentOffset: scrollOffset
    })

    // Only adjust the scroll position if we've scrolled below the last set of rows.
    if (calculatedScrollOffset < scrollOffset) {
      updateScrollIndexCallback(cellCount - 1)
    }
  }
}
