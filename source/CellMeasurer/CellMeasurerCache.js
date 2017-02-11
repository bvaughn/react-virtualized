/** @flow */

/**
 * Enables more intelligent mapping of a given column and row index to an item ID.
 * This prevents a cell cache from being invalidated when its parent collection is modified.
 */
type KeyMapper = (
  rowIndex: number,
  columnIndex: number
) => any;

type CellMeasurerCacheParams = {
  defaultHeight ?: number,
  defaultWidth ?: number,
  keyMapper ?: KeyMapper
};

type Cache = {
  [key: any]: number
};

type IndexParam = {
  index: number
};

export interface CellMeasurerCacheType {
  clear (
    rowIndex: number,
    columnIndex: number
  ) : void;

  clearAll () : void;

  columnWidth (
    index : number
  ) : ?number;

  getHeight (
    rowIndex: number,
    columnIndex: number
  ) : ?number;

  getWidth (
    rowIndex: number,
    columnIndex: number
  ) : ?number;

  has (
    rowIndex: number,
    columnIndex: number
  ) : boolean;

  rowHeight (
    index : number
  ) : ?number;

  set (
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ) : void;
};

/**
 * Caches measurements for a given cell.
 */
export default class CellMeasurerCache {
  _cellHeightCache: Cache;
  _cellWidthCache: Cache;
  _columnWidthCache: Cache;
  _defaultHeight: ?number;
  _defaultWidth: ?number;
  _keyMapper: KeyMapper;
  _rowHeightCache: Cache;

  constructor (params : CellMeasurerCacheParams = {}) {
    this._defaultHeight = params.defaultHeight || null
    this._defaultWidth = params.defaultWidth || null
    this._keyMapper = params.keyMapper || defaultKeyMapper

    this._columnCount = 0
    this._rowCount = 0

    this._cellHeightCache = {}
    this._cellWidthCache = {}
    this._columnWidthCache = {}
    this._rowHeightCache = {}
  }

  clear (
    rowIndex: number,
    columnIndex: number
  ) : void {
    const key = this._keyMapper(rowIndex, columnIndex)

    delete this._cellHeightCache[key]
    delete this._cellWidthCache[key]
  }

  clearAll() : void {
    this._cellHeightCache = {}
    this._cellWidthCache = {}
  }

  columnWidth = ({ index } : IndexParam) => {
    return this._columnWidthCache.hasOwnProperty(index)
      ? this._columnWidthCache[index]
      : this._defaultWidth
  }

  getHeight (
    rowIndex: number,
    columnIndex: number
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellHeightCache.hasOwnProperty(key)
      ? this._cellHeightCache[key]
      : this._defaultHeight
  }

  getWidth (
    rowIndex: number,
    columnIndex: number
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellWidthCache.hasOwnProperty(key)
      ? this._cellWidthCache[key]
      : this._defaultWidth
  }

  has (
    rowIndex: number,
    columnIndex: number
  ) : boolean {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellHeightCache.hasOwnProperty(key)
  }

  rowHeight = ({ index } : IndexParam) => {
    return this._rowHeightCache.hasOwnProperty(index)
      ? this._rowHeightCache[index]
      : this._defaultHeight
  }

  set (
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ) : void {
    const key = this._keyMapper(rowIndex, columnIndex)

    if (columnIndex >= this._columnCount) {
      this._columnCount = columnIndex + 1
    }
    if (rowIndex >= this._rowCount) {
      this._rowCount = rowIndex + 1
    }

    this._cellHeightCache[key] = height
    this._cellWidthCache[key] = width

    let columnWidth = 0
    for (let i = 0; i < this._rowCount; i++) {
      columnWidth = Math.max(columnWidth, this.getWidth(i, columnIndex))
    }
    let rowHeight = 0
    for (let i = 0; i < this._columnCount; i++) {
      rowHeight = Math.max(rowHeight, this.getHeight(rowIndex, i))
    }

    this._columnWidthCache[columnIndex] = columnWidth
    this._rowHeightCache[rowIndex] = rowHeight
  }
}

function defaultKeyMapper (
  rowIndex: number,
  columnIndex: number
): any {
  return `${rowIndex}-${columnIndex}`
}
