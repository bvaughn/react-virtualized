export const SCROLL_DIRECTION_BACKWARD = -1;
export const SCROLL_DIRECTION_FORWARD = 1;

export const SCROLL_DIRECTION_HORIZONTAL = "horizontal";
export const SCROLL_DIRECTION_VERTICAL = "vertical";
/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 *
 * @param direction One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
 * @param cellCount Number of rows or columns in the current axis
 * @param scrollDirection One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
 * @param overscanCellsCount Maximum number of cells to over-render in either direction
 * @param startIndex Begin of range of visible cells
 * @param stopIndex End of range of visible cells
 */
export default function defaultOverscanIndicesGetter({
  direction,
  cellCount,
  overscanCellsCount,
  scrollDirection,
  startIndex,
  stopIndex
}) {
  let overscanStartIndex;
  let overscanStopIndex;

  // Make sure we render at least 1 cell extra before and after (except near boundaries)
  // This is necessary in order to support keyboard navigation (TAB/SHIFT+TAB) in some cases
  // For more info see issues #625
  overscanCellsCount = Math.max(1, overscanCellsCount);

  switch (scrollDirection) {
    case SCROLL_DIRECTION_FORWARD:
      overscanStartIndex = startIndex - 1;
      overscanStopIndex = stopIndex + overscanCellsCount;
      break;
    case SCROLL_DIRECTION_BACKWARD:
      overscanStartIndex = startIndex - overscanCellsCount;
      overscanStopIndex = stopIndex + 1;
      break;
  }

  return {
    overscanStartIndex: Math.max(0, overscanStartIndex),
    overscanStopIndex: Math.min(cellCount - 1, overscanStopIndex)
  };
}
