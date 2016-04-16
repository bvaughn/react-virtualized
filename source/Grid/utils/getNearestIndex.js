/**
 * Finds the nearest valid index to the one specified if the specified index is invalid.
 * @param cellCount Number of rows or columns in the current axis
 * @param targetIndex Index to use if possible
 */
export default function getNearestIndex ({
  cellCount,
  targetIndex
}) {
  return Math.max(0, Math.min(cellCount - 1, targetIndex))
}
