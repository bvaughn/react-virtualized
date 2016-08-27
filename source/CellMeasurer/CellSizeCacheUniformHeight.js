/**
 * Alternative CellMeasurer `cellSizeCache` implementation
 * for lists with unknown **but uniform** row heights.
 * Permanently caches column widths (identified by column index) and
 * a single row height unless explicitly cleared.
 */
export default class CellSizeCacheUniformHeight {
  constructor () {
    this._cachedColumnWidths = {}
    this._cachedRowHeight = undefined
  }

  clearAllColumnWidths () {
    this._cachedColumnWidths = {}
  }

  clearAllRowHeights () {
    this._cachedRowHeight = undefined
  }

  clearColumnWidth (index: number) {
    this._cachedColumnWidths[index] = undefined
  }

  clearRowHeight (index: number) {
    this._cachedRowHeight = undefined
  }

  getColumnWidth (index: number): number {
    return this._cachedColumnWidths[index]
  }

  getRowHeight (index: number): number {
    return this._cachedRowHeight
  }

  hasColumnWidth (index: number): boolean {
    return this._cachedColumnWidths[index] >= 0
  }

  hasRowHeight (index: number): boolean {
    return this._cachedRowHeight >= 0
  }

  setColumnWidth (index: number, width: number) {
    this._cachedColumnWidths[index] = width
  }

  setRowHeight (index: number, height: number) {
    this._cachedRowHeight = height
  }
}
