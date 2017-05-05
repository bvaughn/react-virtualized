/** @flow */
import defaultKeyMapper from '../utils/defaultKeyMapper'

export const DEFAULT_HEIGHT = 30
export const DEFAULT_WIDTH = 100

// Enables more intelligent mapping of a given column and row index to an item ID.
// This prevents a cell cache from being invalidated when its parent collection is modified.
type KeyMapper = (
  rowIndex: number,
  columnIndex: number
) => any;

type CellMeasurerCacheParams = {
  defaultHeight ?: number,
  defaultWidth ?: number,
  fixedHeight ?: boolean,
  fixedWidth ?: boolean,
  minHeight?: number,
  minWidth?: number,
  keyMapper ?: KeyMapper
};

type Cache = {
  [key: any]: number
};

type IndexParam = {
  index: number
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
  _minHeight: ?number;
  _minWidth: ?number;
  _keyMapper: KeyMapper;
  _rowHeightCache: Cache;

  constructor (params : CellMeasurerCacheParams = {}) {
    const {
      defaultHeight,
      defaultWidth,
      fixedHeight,
      fixedWidth,
      keyMapper,
      minHeight,
      minWidth
    } = params

    this._hasFixedHeight = fixedHeight === true
    this._hasFixedWidth = fixedWidth === true
    this._minHeight = minHeight || 0
    this._minWidth = minWidth || 0
    this._keyMapper = keyMapper || defaultKeyMapper

    this._defaultHeight = Math.max(
      this._minHeight,
      typeof defaultHeight === 'number'
        ? defaultHeight
        : DEFAULT_HEIGHT
    )
    this._defaultWidth = Math.max(
      this._minWidth,
      typeof defaultWidth === 'number'
        ? defaultWidth
        : DEFAULT_WIDTH
    )

    if (process.env.NODE_ENV !== 'production') {
      if (
        this._hasFixedHeight === false &&
        this._hasFixedWidth === false
      ) {
        console.warn(
          'CellMeasurerCache should only measure a cell\'s width or height. ' +
          'You have configured CellMeasurerCache to measure both. ' +
          'This will result in poor performance.'
        )
      }

      if (
        this._hasFixedHeight === false &&
        this._defaultHeight === 0
      ) {
        console.warn(
          'Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. ' +
          'Failing to do so will lead to unnecessary layout and poor performance.'
        )
      }

      if (
        this._hasFixedWidth === false &&
        this._defaultWidth === 0
      ) {
        console.warn(
          'Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. ' +
          'Failing to do so will lead to unnecessary layout and poor performance.'
        )
      }
    }

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

    this._updateCachedColumnAndRowSizes(rowIndex, columnIndex)
  }

  clearAll () : void {
    this._cellHeightCache = {}
    this._cellWidthCache = {}
    this._columnWidthCache = {}
    this._rowHeightCache = {}
  }

  columnWidth = ({ index } : IndexParam) => {
    const key = this._keyMapper(0, index)

    return this._columnWidthCache.hasOwnProperty(key)
      ? this._columnWidthCache[key]
      : this._defaultWidth
  }

  get defaultHeight () : number {
    return this._defaultHeight
  }

  get defaultWidth () : number {
    return this._defaultWidth
  }

  hasFixedHeight () : boolean {
    return this._hasFixedHeight
  }

  hasFixedWidth () : boolean {
    return this._hasFixedWidth
  }

  getHeight (
    rowIndex: number,
    columnIndex: ?number = 0
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellHeightCache.hasOwnProperty(key)
      ? Math.max(this._minHeight, this._cellHeightCache[key])
      : this._defaultHeight
  }

  getWidth (
    rowIndex: number,
    columnIndex: ?number = 0
  ) : ?number {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellWidthCache.hasOwnProperty(key)
      ? Math.max(this._minWidth, this._cellWidthCache[key])
      : this._defaultWidth
  }

  has (
    rowIndex: number,
    columnIndex: ?number = 0
  ) : boolean {
    const key = this._keyMapper(rowIndex, columnIndex)

    return this._cellHeightCache.hasOwnProperty(key)
  }

  rowHeight = ({ index } : IndexParam) => {
    const key = this._keyMapper(index, 0)

    return this._rowHeightCache.hasOwnProperty(key)
      ? this._rowHeightCache[key]
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

    // Size is cached per cell so we don't have to re-measure if cells are re-ordered.
    this._cellHeightCache[key] = height
    this._cellWidthCache[key] = width

    this._updateCachedColumnAndRowSizes(rowIndex, columnIndex)
  }

  _updateCachedColumnAndRowSizes (
    rowIndex: number,
    columnIndex: number
  ) : void {
    // :columnWidth and :rowHeight are derived based on all cells in a column/row.
    // Pre-cache these derived values for faster lookup later.
    // Reads are expected to occur more frequently than writes in this case.
    let columnWidth = 0
    for (let i = 0; i < this._rowCount; i++) {
      columnWidth = Math.max(columnWidth, this.getWidth(i, columnIndex))
    }
    let rowHeight = 0
    for (let i = 0; i < this._columnCount; i++) {
      rowHeight = Math.max(rowHeight, this.getHeight(rowIndex, i))
    }

    const columnKey = this._keyMapper(0, columnIndex)
    const rowKey = this._keyMapper(rowIndex, 0)

    this._columnWidthCache[columnKey] = columnWidth
    this._rowHeightCache[rowKey] = rowHeight
  }
}
