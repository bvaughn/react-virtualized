import Prefixer from 'inline-style-prefixer'

const prefixer = new Prefixer()

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

  if (mode === findNearestCell.EQUAL_OR_LOWER && low > 0) {
    return low - 1
  } else if (mode === findNearestCell.EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
    return high + 1
  }
}

findNearestCell.EQUAL_OR_LOWER = 1
findNearestCell.EQUAL_OR_HIGHER = 2

/**
 * Determines a new offset that ensures a certain cell is visible, given the current offset.
 * If the cell is already visible then the current offset will be returned.
 * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
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
  if (cellMetadata.length === 0) {
    return 0
  }

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
export function getVisibleCellIndices ({
  cellCount,
  cellMetadata,
  containerSize,
  currentOffset
}) {
  if (cellCount === 0) {
    return {}
  }

  currentOffset = Math.max(0, currentOffset)

  const maxOffset = currentOffset + containerSize

  let start = findNearestCell({
    cellMetadata,
    mode: findNearestCell.EQUAL_OR_LOWER,
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
 * Initializes metadata for an axis and its cells.
 * This data is used to determine which cells are visible given a container size and scroll position.
 *
 * @param cellCount Total number of cells.
 * @param size Either a fixed size or a function that returns the size for a given given an index.
 * @return Object mapping cell index to cell metadata (size, offset)
 */
export function initCellMetadata ({
  cellCount,
  size
}) {
  const sizeGetter = size instanceof Function
    ? size
    : index => size

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

/**
 * Helper utility that updates the specified onRowsRendered callback on when start or stop indices have changed.
 */
export function initOnRowsRenderedHelper () {
  let cachedStartIndex, cachedStopIndex

  return ({
    onRowsRendered,
    startIndex,
    stopIndex
  }) => {
    if (
      startIndex >= 0 &&
      stopIndex >= 0 &&
      (
        startIndex !== cachedStartIndex ||
        stopIndex !== cachedStopIndex
      )
    ) {
      cachedStartIndex = startIndex
      cachedStopIndex = stopIndex

      onRowsRendered({ startIndex, stopIndex })
    }
  }
}

/**
 * Adds vender prefixes to a style object.
 */
export function prefixStyle (style) {
  return prefixer.prefix(style)
}

/**
 * Adds vender prefixes for all of the styles in a stylesheet and returns a prefixed copy.
 */
export function prefixStyleSheet (styleSheet) {
  const prefixedStyleSheet = {}
  for (var style in styleSheet) {
    prefixedStyleSheet[style] = prefixStyle(styleSheet[style])
  }
  return prefixedStyleSheet
}
