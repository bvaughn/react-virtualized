/**
 * Helper method that determines when to recalculate row or column metadata.
 *
 * @param cellsCount Number of rows or columns in the current axis
 * @param cellsSize Width or height of cells for the current axis
 * @param computeMetadataCallback Method to invoke if cell metadata should be recalculated
 * @param computeMetadataCallbackProps Parameters to pass to :computeMetadataCallback
 * @param computeMetadataOnNextUpdate Flag specifying that metadata should be recalculated
 * @param nextCellsCount Newly updated number of rows or columns in the current axis
 * @param nextCellsSize Newly updated width or height of cells for the current axis
 * @param nextScrollToIndex Newly updated scroll-to-index
 * @param scrollToIndex Scroll-to-index
 * @param updateScrollOffsetForScrollToIndex Callback to invoke if the scroll position should be recalculated
 */
export function computeCellMetadataAndUpdateScrollOffsetHelper ({
  cellsCount,
  cellSize,
  computeMetadataCallback,
  computeMetadataCallbackProps,
  computeMetadataOnNextUpdate,
  nextCellsCount,
  nextCellSize,
  nextScrollToIndex,
  scrollToIndex,
  updateScrollOffsetForScrollToIndex
}) {
  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
  // In that event users should use the manual recompute methods to inform of changes.
  if (
    computeMetadataOnNextUpdate ||
    cellsCount !== nextCellsCount ||
    (
      (
        typeof cellSize === 'number' ||
        typeof nextCellSize === 'number'
      ) &&
      cellSize !== nextCellSize
    )
  ) {
    computeMetadataCallback(computeMetadataCallbackProps)

    // Updated cell metadata may have hidden the previous scrolled-to item.
    // In this case we should also update the scrollTop to ensure it stays visible.
    if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
      updateScrollOffsetForScrollToIndex()
    }
  }
}

/**
 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
 */
export function createCallbackMemoizer (requireAllKeys = true) {
  let cachedIndices = {}

  return ({
    callback,
    indices
  }) => {
    const keys = Object.keys(indices)
    const allInitialized = !requireAllKeys || keys.every(key => indices[key] >= 0)
    const indexChanged = keys.some(key => cachedIndices[key] !== indices[key])

    cachedIndices = indices

    if (allInitialized && indexChanged) {
      callback(indices)
    }
  }
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

  if (mode === findNearestCell.EQUAL_OR_LOWER && low > 0) {
    return low - 1
  } else if (mode === findNearestCell.EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
    return high + 1
  }
}

findNearestCell.EQUAL_OR_LOWER = 1
findNearestCell.EQUAL_OR_HIGHER = 2

export function getOverscanIndices ({ cellsCount, overscanCellsCount, startIndex, stopIndex }) {
  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellsCount - 1, stopIndex + overscanCellsCount)
  }
}

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
 * @param cellsCount Total number of cells.
 * @param cellMetadata Metadata initially computed by initCellMetadata()
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @return An object containing :start and :stop attributes, each specifying a cell index
 */
export function getVisibleCellIndices ({
  cellsCount,
  cellMetadata,
  containerSize,
  currentOffset
}) {
  if (cellsCount === 0) {
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
    mode: findNearestCell.EQUAL_OR_LOWER,
    offset: currentOffset
  })

  let datum = cellMetadata[start]
  currentOffset = datum.offset + datum.size

  let stop = start

  while (currentOffset < maxOffset && stop < cellsCount - 1) {
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
 * @param cellsCount Total number of cells.
 * @param size Either a fixed size or a function that returns the size for a given given an index.
 * @return Object mapping cell index to cell metadata (size, offset)
 */
export function initCellMetadata ({
  cellsCount,
  size
}) {
  const sizeGetter = size instanceof Function
    ? size
    : index => size

  const cellMetadata = []
  let offset = 0

  for (var i = 0; i < cellsCount; i++) {
    let size = sizeGetter(i)

    if (size == null || isNaN(size)) {
      throw Error(`Invalid size returned for cell ${i} of value ${size}`)
    }

    cellMetadata[i] = {
      size,
      offset
    }

    offset += size
  }

  return cellMetadata
}

/**
 * Helper function that determines when to update scroll offsets to ensure that a scroll-to-index remains visible.
 *
 * @param cellMetadata Metadata initially computed by initCellMetadata()
 * @param cellsCount Number of rows or columns in the current axis
 * @param cellsSize Width or height of cells for the current axis
 * @param previousCellsCount Previous number of rows or columns
 * @param previousCellsSize Previous width or height of cells
 * @param previousScrollToIndex Previous scroll-to-index
 * @param previousSize Previous width or height of the virtualized container
 * @param scrollOffset Current scrollLeft or scrollTop
 * @param scrollToIndex Scroll-to-index
 * @param size Width or height of the virtualized container
 * @param updateScrollIndexCallback Callback to invoke with an optional scroll-to-index override
 */
export function updateScrollIndexHelper ({
  cellMetadata,
  cellsCount,
  cellSize,
  previousCellsCount,
  previousCellSize,
  previousScrollToIndex,
  previousSize,
  scrollOffset,
  scrollToIndex,
  size,
  updateScrollIndexCallback
}) {
  const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellsCount
  const sizeHasChanged = (
    size !== previousSize ||
    !previousCellSize ||
    (
      typeof cellSize === 'number' &&
      cellSize !== previousCellSize
    )
  )

  // If we have a new scroll target OR if height/row-height has changed,
  // We should ensure that the scroll target is visible.
  if (hasScrollToIndex && (sizeHasChanged || scrollToIndex !== previousScrollToIndex)) {
    updateScrollIndexCallback()

  // If we don't have a selected item but list size or number of children have decreased,
  // Make sure we aren't scrolled too far past the current content.
  } else if (!hasScrollToIndex && (size < previousSize || cellsCount < previousCellsCount)) {
    const calculatedScrollOffset = getUpdatedOffsetForIndex({
      cellMetadata,
      containerSize: size,
      currentOffset: scrollOffset,
      targetIndex: cellsCount - 1
    })

    // Only adjust the scroll position if we've scrolled below the last set of rows.
    if (calculatedScrollOffset < scrollOffset) {
      updateScrollIndexCallback(cellsCount - 1)
    }
  }
}
