/**
 * Alternative CellMeasurer `cellSizeCache` implementation for lists with uniform (but unknown) cell width or height.
 * Permanently caches cell sizes until explicitly cleared.
 */
export default class UniformSizeCellSizeCache {
  clearAllColumnWidths () {
    this._cachedColumnWidth = undefined
  }

  clearAllRowHeights () {
    this._cachedRowHeight = undefined
  }

  clearColumnWidth (index: number) {
    this._cachedColumnWidth = undefined
  }

  clearRowHeight (index: number) {
    this._cachedRowHeight = undefined
  }

  getColumnWidth (index: number): number {
    return this._cachedColumnWidth
  }

  getRowHeight (index: number): number {
    return this._cachedRowHeight
  }

  hasColumnWidth (index: number): boolean {
    return !!this._cachedColumnWidth
  }

  hasRowHeight (index: number): boolean {
    return !!this._cachedRowHeight
  }

  setColumnWidth (index: number, width: number) {
    this._cachedColumnWidth = width
  }

  setRowHeight (index: number, height: number) {
    this._cachedRowHeight = height
  }
}
