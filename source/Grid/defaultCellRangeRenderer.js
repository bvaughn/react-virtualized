/** @flow */
import React from 'react'
import CellSizeAndPositionManager from './utils/CellSizeAndPositionManager'

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
  isScrolling,
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  scrollLeft,
  scrollTop
}: DefaultCellRangeRendererParams) {
  const renderedCells = []

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
      let key = `${rowIndex}-${columnIndex}`
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

      let child = (
        <div
          key={key}
          className='Grid__cell'
          style={{
            height: rowDatum.size,
            left: columnDatum.offset,
            top: rowDatum.offset,
            width: columnDatum.size
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
  cellRenderer: Function,
  columnSizeAndPositionManager: CellSizeAndPositionManager,
  columnStartIndex: number,
  columnStopIndex: number,
  isScrolling: boolean,
  rowSizeAndPositionManager: CellSizeAndPositionManager,
  rowStartIndex: number,
  rowStopIndex: number,
  scrollLeft: number,
  scrollTop: number
};
