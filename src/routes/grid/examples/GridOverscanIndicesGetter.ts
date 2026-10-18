// <begin>

import type { OverscanIndicesGetter } from "react-virtualized";

// Overscan the same number of cells before and after the visible range,
// regardless of which direction the user is scrolling
const overscanIndicesGetter: OverscanIndicesGetter = ({
  cellCount, // Number of rows or columns in the current axis
  overscanCellsCount, // Maximum number of cells to over-render in either direction
  startIndex, // Begin of range of visible cells
  stopIndex // End of range of visible cells
  // Also available:
  // direction: "horizontal" or "vertical"
  // scrollDirection: 1 (forward) or -1 (backward)
}) => ({
  overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
  overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
});

// <end>

export { overscanIndicesGetter };
