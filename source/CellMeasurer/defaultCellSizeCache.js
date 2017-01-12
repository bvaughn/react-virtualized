/**
 * Default CellMeasurer `cellSizeCache` implementation.
 * Permanently caches all cell sizes (identified by column and row index) unless explicitly cleared.
 * Can be configured to handle uniform cell widths and/or heights as a way of optimizing certain use cases.
 */
export default class DefaultCellSizeCache {
  constructor ({
    uniformRowHeight = false,
    uniformColumnWidth = false
  } = {}) {
    this._uniformRowHeight = uniformRowHeight
    this._uniformColumnWidth = uniformColumnWidth

    this._cachedColumnWidth = undefined
    this._cachedRowHeight = undefined

    this._cachedColumnWidths = {}
    this._cachedRowHeights = {}
  }

  clearAllColumnWidths () {
    this._cachedColumnWidth = undefined
    this._cachedColumnWidths = {}
  }

  clearAllRowHeights () {
    this._cachedRowHeight = undefined
    this._cachedRowHeights = {}
  }

  clearColumnWidth (index: any) {
    this._cachedColumnWidth = undefined

    delete this._cachedColumnWidths[index]
  }

  clearRowHeight (index: any) {
    this._cachedRowHeight = undefined

    delete this._cachedRowHeights[index]
  }

  getColumnWidth (index: any): ?number {
    return this._uniformColumnWidth
      ? this._cachedColumnWidth
      : this._cachedColumnWidths[index]
  }

  getRowHeight (index: any): ?number {
    return this._uniformRowHeight
      ? this._cachedRowHeight
      : this._cachedRowHeights[index]
  }

  setColumnWidth (index: any, width: number) {
    this._cachedColumnWidth = width
    this._cachedColumnWidths[index] = width
  }

  setRowHeight (index: any, height: number) {
    this._cachedRowHeight = height
    this._cachedRowHeights[index] = height
  }
}
