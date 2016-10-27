/** @flow */

const overlap = (parent, child) => {
  let visXStart, visXEnd, xHidden,
    visYStart, visYEnd, yHidden

  // x
  if (parent.x > child.x) {
    visXStart = 0
    xHidden = parent.x - child.x
  } else {
    visXStart = child.x - parent.x
    xHidden = 0
  }

  visXEnd = visXStart + (child.width - xHidden) < parent.width
    ? visXStart + (child.width - xHidden)
    : parent.width

  // y
  if (parent.y > child.y) {
    visYStart = 0
    yHidden = parent.y - child.y
  } else {
    visYStart = child.y - parent.y
    yHidden = 0
  }

  visYEnd = visYStart + (child.height - yHidden) < parent.y
    ? visYStart + (child.height - yHidden)
    : parent.height

  // area
  let area = {
    x: (visXEnd - visXStart) / child.width,
    y: (visYEnd - visYStart) / child.height
  }

  return area
}

const findOverlap = (grid, cell) => {
  let parent = {
    x: grid.scrollLeft,
    y: grid.scrollTop,
    width: grid.width,
    height: grid.height
  }
  let child = {
    x: cell.left,
    y: cell.top,
    width: cell.width,
    height: cell.height
  }
  return overlap(parent, child)
}
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
  height,
  width
}: DefaultCellRangeRendererParams) {
  const renderedCells = []
  const gridDimensions = {width, height, scrollLeft, scrollTop}

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
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
        key,
        rowIndex,
        style,
        visibility: findOverlap(gridDimensions, style)
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
  height: number,
  horizontalOffsetAdjustment: number,
  isScrolling: boolean,
  rowSizeAndPositionManager: Object,
  rowStartIndex: number,
  rowStopIndex: number,
  scrollLeft: number,
  scrollTop: number,
  verticalOffsetAdjustment: number,
  width: number
};
