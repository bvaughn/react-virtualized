export const SCROLL_DIRECTION_BACKWARD = -1
export const SCROLL_DIRECTION_FORWARD = 1

/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 *
 * @param cellCount Number of rows or columns in the current axis
 * @param scrollDirection One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
 * @param overscanCellsCount Maximum number of cells to over-render in either direction
 * @param startIndex Begin of range of visible cells
 * @param stopIndex End of range of visible cells
 */
export default function defaultOverscanIndicesGetter ({ cellCount, overscanCellsCount, scrollDirection, startIndex, stopIndex }) {
  let overscanStartIndex
  let overscanStopIndex

  switch (scrollDirection) {
    case SCROLL_DIRECTION_FORWARD:
      overscanStartIndex = startIndex
      overscanStopIndex = stopIndex + overscanCellsCount
      break
    case SCROLL_DIRECTION_BACKWARD:
      overscanStartIndex = startIndex - overscanCellsCount
      overscanStopIndex = stopIndex
      break
  }

  return {
    overscanStartIndex: Math.max(0, overscanStartIndex),
    overscanStopIndex: Math.min(cellCount - 1, overscanStopIndex)
  }
}
