export const SCROLL_DIRECTION_BACKWARD = -1
export const SCROLL_DIRECTION_FIXED = 0
export const SCROLL_DIRECTION_FORWARD = 1

/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 *
 * @param cellCount Number of rows or columns in the current axis
 * @param scrollDirection One of SCROLL_DIRECTION_BACKWARD
 * @param overscanCellsCount Maximum number of cells to over-render in either direction
 * @param startIndex Begin of range of visible cells
 * @param stopIndex End of range of visible cells
 */
export default function getOverscanIndices ({ cellCount, overscanCellsCount, scrollDirection, startIndex, stopIndex }) {
  let overscanStartIndex
  let overscanStopIndex

  if (scrollDirection === SCROLL_DIRECTION_FORWARD) {
    overscanStartIndex = startIndex
    overscanStopIndex = stopIndex + overscanCellsCount * 2
  } else if (scrollDirection === SCROLL_DIRECTION_BACKWARD) {
    overscanStartIndex = startIndex - overscanCellsCount * 2
    overscanStopIndex = stopIndex
  } else {
    overscanStartIndex = startIndex - overscanCellsCount
    overscanStopIndex = stopIndex + overscanCellsCount
  }

  return {
    overscanStartIndex: Math.max(0, overscanStartIndex),
    overscanStopIndex: Math.min(cellCount - 1, overscanStopIndex)
  }
}
