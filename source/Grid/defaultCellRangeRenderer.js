/** @flow */
import React from 'react'
import cn from 'classnames'

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
export default function defaultCellRangeRenderer ({
  cellCache,
  cellClassName,
  cellRenderer,
  cellStyle,
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
  verticalOffsetAdjustment
}: DefaultCellRangeRendererParams) {
  const renderedCells = []

  let visibleRows = (rowStopIndex - rowStartIndex) + 1
  let visibleColumns = (columnStopIndex - columnStartIndex) + 1

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
      let key = `${rowIndex}-${columnIndex}`
      let cellStyleObject = cellStyle({ rowIndex, columnIndex })
      let renderedCell

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling complets.
      if (isScrolling) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer({
            columnIndex,
            isScrolling,
            rowIndex
          })
        }
        renderedCell = cellCache[key]
      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer({
          columnIndex,
          isScrolling,
          rowIndex
        })
      }

      if (renderedCell == null || renderedCell === false) {
        continue
      }

      const className = cellClassName({ columnIndex, rowIndex })

      let child = (
        <div
          key={`${rowIndex % visibleRows}-${columnIndex % visibleColumns}`}
          className={cn('Grid__cell', className)}
          style={{
            height: rowDatum.size,
            left: columnDatum.offset + horizontalOffsetAdjustment,
            top: rowDatum.offset + verticalOffsetAdjustment,
            width: columnDatum.size,
            ...cellStyleObject
          }}
        >
          {renderedCell}
        </div>
      )

      renderedCells.push(child)
    }
  }

  return renderedCells
}

type DefaultCellRangeRendererParams = {
  cellCache: Object,
  cellClassName: Function,
  cellRenderer: Function,
  cellStyle: Function,
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
  verticalOffsetAdjustment: number
};
