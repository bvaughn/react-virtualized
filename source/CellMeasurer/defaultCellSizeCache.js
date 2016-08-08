/**
 * Default CellMeasurer `cellSizeCache` implementation.
 * Permanently caches all cell sizes (identified by column and row index) unless explicitly cleared.
 */
export default class CellSizeCache {
  constructor () {
    this._cachedColumnWidths = {}
    this._cachedRowHeights = {}
  }

  clearAllColumnWidths () {
    this._cachedColumnWidths = {}
  }

  clearAllRowHeights () {
    this._cachedRowHeights = {}
  }

  clearColumnWidth (index: number) {
    delete this._cachedColumnWidths[index]
  }

  clearRowHeight (index: number) {
    delete this._cachedRowHeights[index]
  }

  getColumnWidth (index: number): number {
    return this._cachedColumnWidths[index]
  }

  getRowHeight (index: number): number {
    return this._cachedRowHeights[index]
  }

  hasColumnWidth (index: number): boolean {
    return this._cachedColumnWidths[index] >= 0
  }

  hasRowHeight (index: number): boolean {
    return this._cachedRowHeights[index] >= 0
  }

  setColumnWidth (index: number, width: number) {
    this._cachedColumnWidths[index] = width
  }

  setRowHeight (index: number, height: number) {
    this._cachedRowHeights[index] = height
  }
}
