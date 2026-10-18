/**
 * Determines a new offset that ensures a certain cell is visible, given the current offset.
 * If the cell is already visible then the current offset will be returned.
 * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
 *
 * @param align Desired alignment within container; one of "auto" (default), "start", "end", or "center".
 *   With "auto", a cell that is larger than the container is aligned to its start.
 * @param cellOffset Offset (x or y) position for cell
 * @param cellSize Size (width or height) of cell
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @return Offset to use to ensure the specified cell is visible
 */
export function getUpdatedOffsetForIndex({
  align = "auto",
  cellOffset,
  cellSize,
  containerSize,
  currentOffset
}: {
  align?: "auto" | "end" | "start" | "center";
  cellOffset: number;
  cellSize: number;
  containerSize: number;
  currentOffset: number;
}): number {
  const maxOffset = cellOffset;
  const minOffset = maxOffset - containerSize + cellSize;

  switch (align) {
    case "start":
      return maxOffset;
    case "end":
      return minOffset;
    case "center":
      return maxOffset - (containerSize - cellSize) / 2;
    default:
      // A cell that doesn't fit within the container is aligned to its start, so that its start is visible (#1264)
      if (cellSize >= containerSize) {
        return maxOffset;
      }
      return Math.max(minOffset, Math.min(maxOffset, currentOffset));
  }
}
