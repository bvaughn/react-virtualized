var BINARY_INDEX_SEARCH_MODE = {
  EQUAL_OR_LOWER: 1,
  EQUAL_OR_HIGHER: 2
}

/**
 * Binary search function inspired by react-infinite.
 */
export function findNearestCell ({
  cellMetadata,
  mode,
  offset
}) {
  let high = cellMetadata.length - 1
  let low = 0
  let middle
  let currentOffset

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

  if (mode === BINARY_INDEX_SEARCH_MODE.EQUAL_OR_LOWER && low > 0) {
    return low - 1
  } else if (mode === BINARY_INDEX_SEARCH_MODE.EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
    return high + 1
  }
}

/**
 * Give a new offset that ensures a certain cell is visible, given the current offset.
 * If the cell is already visible then the current offset will be returned.
 *
 * @param cellMetadata Metadata initially computed by initCellMetadata()
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @param targetIndex Index of target cell
 * @return Offset to use to ensure the specified cell is visible
 */
export function getUpdatedOffsetForIndex ({
  cellMetadata,
  containerSize,
  currentOffset,
  targetIndex
}) {
  targetIndex = Math.max(0, Math.min(cellMetadata.length - 1, targetIndex))

  const datum = cellMetadata[targetIndex]
  const maxOffset = datum.offset
  const minOffset = maxOffset - containerSize + datum.size
  const newOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset))

  return newOffset
}

/**
 * Determines the range of cells to display for a given offset in order to fill the specified container.
 *
 * @param cellCount Total number of cells.
 * @param cellMetadata Metadata initially computed by initCellMetadata()
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @return An object containing :start and :stop attributes, each specifying a cell index
 */
export function getVisibleRowIndices ({
  cellCount,
  cellMetadata,
  containerSize,
  currentOffset
}) {
  if (cellCount === 0) {
    return {}
  }

  currentOffset = Math.max(0, currentOffset)

  let start = findNearestCell({
    cellMetadata,
    mode: BINARY_INDEX_SEARCH_MODE.EQUAL_OR_LOWER,
    offset: currentOffset
  })

  const maxOffset = currentOffset + containerSize

  // Account for the fact that we may have scrolled part way past the first cell.
  currentOffset += currentOffset - cellMetadata[start].offset

  let stop = start

  while (currentOffset < maxOffset && stop < cellCount - 1) {
    currentOffset += cellMetadata[++stop].size
  }

  // TODO Do I need to shift if we run out of cells before filling the container size? I don't think so...
  return {
    start,
    stop
  }
}

/**
 * Initializes metadata for an axis and its cells.
 * This data is used to determine which cells are visible given a container size and scroll position.
 *
 * @param cellCount Total number of cells.
 * @param fixedSize If provided this value will be used as the fixed size for all cells.
 * @param sizeGetter If provided this function will be used to determine the height of each cell.
 *   It should implement the signature: (cellIndex)
 * @return Object mapping cell index to cell metadata (size, offset)
 */
export function initCellMetadata ({
  cellCount,
  fixedSize,
  sizeGetter
}) {
  sizeGetter = sizeGetter || () => fixedSize

  const cellMetadata = []
  let offset = 0

  for (var i = 0; i < cellCount; i++) {
    let size = sizeGetter(i)

    cellMetadata[i] = {
      size,
      offset
    }

    offset += size
  }

  return cellMetadata
}
