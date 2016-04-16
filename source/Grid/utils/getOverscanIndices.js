// @TODO
export default function getOverscanIndices ({ cellCount, overscanCellsCount, startIndex, stopIndex }) {
  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
  }
}
