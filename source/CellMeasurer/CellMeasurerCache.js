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
  _defaultHeight: ?number;
  _defaultWidth: ?number;
  _keyMapper: KeyMapper;
  _heightCache: Cache;
  _widthCache: Cache;

  constructor (params : CellMeasurerCacheParams = {}) {
    this._defaultHeight = params.defaultHeight
    this._defaultWidth = params.defaultWidth
    this._keyMapper = params.keyMapper || defaultKeyMapper

    this._heightCache = {}
    this._widthCache = {}
  }

  clear (
    rowIndex: number,
    columnIndex: number
  ) : void {
    const key = this._keyMapper(rowIndex, columnIndex)

    delete this._heightCache[key]
    delete this._widthCache[key]
  }

  clearAll() : void {
    this._heightCache = {}
    this._widthCache = {}
  }

  columnWidth = ({ index } : IndexParam) => {
    return this.getWidth(0, index)
  }

  getHeight (
    rowIndex: number,
    columnIndex: number
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._heightCache.hasOwnProperty(key)
      ? this._heightCache[key]
      : this._defaultHeight
  }

  getWidth (
    rowIndex: number,
    columnIndex: number
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._widthCache.hasOwnProperty(key)
      ? this._widthCache[key]
      : this._defaultWidth
  }

  has (
    rowIndex: number,
    columnIndex: number
  ) : boolean {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._heightCache.hasOwnProperty(key)
  }

  rowHeight = ({ index } : IndexParam) => {
    return this.getHeight(index, 0)
  }

  set (
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ) : void {
    const key = this._keyMapper(rowIndex, columnIndex)

    this._heightCache[key] = height
    this._widthCache[key] = width
  }
}

function defaultKeyMapper (
  rowIndex: number,
  columnIndex: number
): any {
  return `${rowIndex}-${columnIndex}`
}
