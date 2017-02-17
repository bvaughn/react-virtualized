/**
 * CellMeasurer cache must be used with a custom cell measurer supporting cache
 * per item
 *
 * The following cache disable the cache per row/column completely and replace
 * it by a cache per item
 *
 * Two functions must be provided:
 * - getItem(rowIndex, columnIndex): return the item at the given row and column
 * - getItemId(item): return a unique id for an item
 *
 * The structure of per item caches are the following:
 *
 *  cachedItemHeight = {
 *    height: 150,
 *    item: Object
 *  }
 *
 *  cachedItemHeight = {
 *    width: 300,
 *    items: Object
 *  }
 *
 * The cached value is returned only if the itemId is found and if the item
 * reference didn't change since last time
 *
 */
export default class DefaultCellSizeCache {
  constructor ({
    getItem,
    getItemId,
    uniformRowHeight = false,
    uniformColumnWidth = false,
    uniformItemHeight = false,
    uniformItemWidth = false
  } = {}) {

    this._getItem = getItem
    this._getItemId = getItemId

    this._uniformRowHeight = uniformRowHeight
    this._uniformColumnWidth = uniformColumnWidth

    this._cachedColumnWidth = undefined
    this._cachedRowHeight = undefined

    this._cachedItemWidth = undefined
    this._cachedItemHeight = undefined

    this._cachedItemWidths = {}
    this._cachedItemHeights = {}
  }

  /*
   * Row/column caching
   * This has been disabled since we cache per item
   */
  clearAllColumnWidths () {
    this._cachedColumnWidth = undefined
    // this._cachedColumnWidths = {}
  }

  clearAllRowHeights () {
    this._cachedRowHeight = undefined
    // this._cachedRowHeights = {}
  }

  clearColumnWidth (index) {
    this._cachedColumnWidth = undefined
    // delete this._cachedColumnWidths[index]
  }

  clearRowHeight (index) {
    this._cachedRowHeight = undefined
    // delete this._cachedRowHeights[index]
  }

  // Don't return the width for each column
  getColumnWidth (index) {
    return this._uniformColumnWidth
      ? this._cachedColumnWidth
      : null;
  }

  // Don't return the height for each row
  getRowHeight (index) {
    return this._uniformRowHeight
      ? this._cachedRowHeight
      : null;
  }

  // Don't cache the width for each column
  setColumnWidth (index, width) {
    this._cachedColumnWidth = width
  }

  // Don't cache the height for each column
  setRowHeight (index, height) {
    this._cachedRowHeight = height
  }


  /*
   * Item caching
   */
  clearAllItemWidths () {
    this._cachedItemWidth = undefined
    this._cachedItemWidths = {}
  }

  clearAllItemHeights () {
    this._cachedItemHeight = undefined
    this._cachedItemHeights = {}
  }

  clearItemWidth (rowIndex, columnIndex) {
    this._cachedItemWidth = undefined
    var item = this._getItem(rowIndex, columnIndex);
    delete this._cachedItemWidths[this.getItemId(item)]
  }

  clearItemHeight (rowIndex, columnIndex) {
    this._cachedItemWidth = undefined
    var item = this._getItem(rowIndex, columnIndex);
    delete this._cachedItemHeights[this.getItemId(item)]
  }

  getItemWidth (rowIndex, columnIndex) {
    if (this._uniformItemWidth) {
      return this._cachedItemWidth;
    }

    var item = this._getItem(rowIndex, columnIndex);
    var cached = this._cachedItemWidths[this._getItemId(item)]
    if(cached && cached.item && cached.item === item) {
      return cached.width;
    }
    return null;
  }

  getItemHeight (rowIndex, columnIndex) {
    if (this._uniformItemHeight) {
      return this._cachedItemHeight;
    }

    var item = this._getItem(rowIndex, columnIndex);
    var cached = this._cachedItemHeights[this._getItemId(item)]
    if(cached && cached.item && cached.item === item) {
      return cached.height;
    }
    return null;
  }

  setItemWidth (rowIndex, columnIndex, width) {
    this._cachedItemWidth = width

    var item = this._getItem(rowIndex, columnIndex);
    this._cachedItemWidths[this._getItemId(item)] = {
      width: width,
      item: item,
    };
  }

  setItemHeight (rowIndex, columnIndex, height) {
    this._cachedItemHeight = height

    var item = this._getItem(rowIndex, columnIndex);
    this._cachedItemHeights[this._getItemId(item)] = {
      height: height,
      item: item,
    };
  }
}
