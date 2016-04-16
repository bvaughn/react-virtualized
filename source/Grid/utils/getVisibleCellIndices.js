/**
 * Determines the range of cells to display for a given offset in order to fill the specified container.
 *
 * @param cellCount Total number of cells.
 * @param cellMetadata Metadata initially computed by initCellMetadata()
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @return An object containing :start and :stop attributes, each specifying a cell index
 */
export default function getVisibleCellIndices ({
  cellCount,
  cellMetadata,
  containerSize,
  currentOffset
}) {
  if (cellCount === 0) {
    return {}
  }

  // TODO Add better guards here against NaN offset

  const lastDatum = cellMetadata[cellMetadata.length - 1]
  const totalCellSize = lastDatum.offset + lastDatum.size

  // Ensure offset is within reasonable bounds
  currentOffset = Math.max(0, Math.min(totalCellSize - containerSize, currentOffset))

  const maxOffset = Math.min(totalCellSize, currentOffset + containerSize)

  let start = findNearestCell({
    cellMetadata,
    mode: EQUAL_OR_LOWER,
    offset: currentOffset
  })

  let datum = cellMetadata[start]
  currentOffset = datum.offset + datum.size

  let stop = start

  while (currentOffset < maxOffset && stop < cellCount - 1) {
    stop++

    currentOffset += cellMetadata[stop].size
  }

  return {
    start,
    stop
  }
}

/**
 * Binary search function inspired by react-infinite.
 */
function findNearestCell ({
  cellMetadata,
  mode,
  offset
}) {
  let high = cellMetadata.length - 1
  let low = 0
  let middle
  let currentOffset

  // TODO Add better guards here against NaN offset

  while (low <= high) {
    middle = low + Math.floor((high - low) / 2)
    currentOffset = cellMetadata[middle].offset

    if (currentOffset === offset) {
      return middle
    } else if (currentOffset < offset) {
      low = middle + 1
    } else if (currentOffset > offset) {
      high = middle - 1
    }
  }

  if (mode === EQUAL_OR_LOWER && low > 0) {
    return low - 1
  } else if (mode === EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
    return high + 1
  }
}

const EQUAL_OR_LOWER = 1
const EQUAL_OR_HIGHER = 2
