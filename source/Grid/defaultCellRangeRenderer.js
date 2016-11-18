/** @flow */
/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
export default function defaultCellRangeRenderer ({
  cellCache,
  cellRenderer,
  columnSizeAndPositionManager,
  columnStartIndex,
  columnStopIndex,
  horizontalOffsetAdjustment,
  isScrolling,
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  scrollLeft,
  scrollTop,
  verticalOffsetAdjustment,
  visibleColumnIndices,
  visibleRowIndices
}: DefaultCellRangeRendererParams) {
  const renderedCells = []

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
      let isVisible = (
        columnIndex >= visibleColumnIndices.start &&
        columnIndex <= visibleColumnIndices.stop &&
        rowIndex >= visibleRowIndices.start &&
        rowIndex <= visibleRowIndices.stop
      )
      let key = `${rowIndex}-${columnIndex}`
      let style = {
        height: rowDatum.size,
        left: columnDatum.offset + horizontalOffsetAdjustment,
        position: 'absolute',
        top: rowDatum.offset + verticalOffsetAdjustment,
        width: columnDatum.size
      }

      let cellRendererParams = {
        columnIndex,
        isScrolling,
        isVisible,
        key,
        rowIndex,
        style
      }

      let renderedCell

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling completes.
      // However if we are scaling scroll positions and sizes, we should also avoid caching.
      // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
      // For more info refer to issue #395
      if (
        isScrolling &&
        !horizontalOffsetAdjustment &&
        !verticalOffsetAdjustment
      ) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer(cellRendererParams)
        }
        renderedCell = cellCache[key]
      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer(cellRendererParams)
      }

      if (renderedCell == null || renderedCell === false) {
        continue
      }

      renderedCells.push(renderedCell)
    }
  }

  return renderedCells
}

type DefaultCellRangeRendererParams = {
  cellCache: Object,
  cellRenderer: Function,
  columnSizeAndPositionManager: Object,
  columnStartIndex: number,
  columnStopIndex: number,
  horizontalOffsetAdjustment: number,
  isScrolling: boolean,
  rowSizeAndPositionManager: Object,
  rowStartIndex: number,
  rowStopIndex: number,
  scrollLeft: number,
  scrollTop: number,
  verticalOffsetAdjustment: number,
  visibleColumnIndices: Object,
  visibleRowIndices: Object
};
