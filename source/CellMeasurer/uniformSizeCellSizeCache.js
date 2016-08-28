/**
 * Alternative CellMeasurer `cellSizeCache` implementation for lists with uniform (but unknown) cell width or height.
 * Permanently caches cell sizes until explicitly cleared.
 */
export default class UniformSizeCellSizeCache {
  constructor ({ uniformWidth = true, uniformHeight = true } = {}) {
    this.uniformWidth = uniformWidth
    this.uniformHeight = uniformHeight
    this._cachedColumnWidth = (uniformWidth ? undefined : {})
    this._cachedRowHeight = (uniformHeight ? undefined : {})
  }

  clearAllColumnWidths () {
    this._cachedColumnWidth = this.uniformWidth ? undefined : {}
  }

  clearAllRowHeights () {
    this._cachedRowHeight = this.uniformHeight ? undefined : {}
  }

  clearColumnWidth (index: number) {
    this.setColumnWidth(index, undefined)
  }

  clearRowHeight (index: number) {
    this.setRowHeight(index, undefined)
  }

  getColumnWidth (index: number): number {
    return this.uniformWidth ? this._cachedColumnWidth : this._cachedColumnWidth[index]
  }

  getRowHeight (index: number): number {
    return this.uniformHeight ? this._cachedRowHeight : this._cachedRowHeight[index]
  }

  hasColumnWidth (index: number): boolean {
    return (this.uniformWidth ? this._cachedColumnWidth : this._cachedColumnWidth[index]) != null
  }

  hasRowHeight (index: number): boolean {
    return (this.uniformHeight ? this._cachedRowHeight : this._cachedRowHeight[index]) != null
  }

  setColumnWidth (index: number, width: number) {
    if (this.uniformWidth) {
      this._cachedColumnWidth = width
    } else {
      this._cachedColumnWidth[index] = width
    }
  }

  setRowHeight (index: number, height: number) {
    if (this.uniformHeight) {
      this._cachedRowHeight = height
    } else {
      this._cachedRowHeight[index] = height
    }
  }
}
