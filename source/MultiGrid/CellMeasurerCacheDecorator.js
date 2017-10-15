/** @flow */
import {CellMeasurerCache} from '../CellMeasurer';

type CellMeasurerCacheDecoratorParams = {
  cellMeasurerCache: CellMeasurerCache,
  columnIndexOffset: number,
  rowIndexOffset: number,
};

type IndexParam = {
  index: number,
};

/**
 * Caches measurements for a given cell.
 */
export default class CellMeasurerCacheDecorator {
  _cellMeasurerCache: CellMeasurerCache;
  _columnIndexOffset: number;
  _rowIndexOffset: number;

  constructor(params: CellMeasurerCacheDecoratorParams = {}) {
    const {
      cellMeasurerCache,
      columnIndexOffset = 0,
      rowIndexOffset = 0,
    } = params;

    this._cellMeasurerCache = cellMeasurerCache;
    this._columnIndexOffset = columnIndexOffset;
    this._rowIndexOffset = rowIndexOffset;
  }

  clear(rowIndex: number, columnIndex: number): void {
    this._cellMeasurerCache.clear(
      rowIndex + this._rowIndexOffset,
      columnIndex + this._columnIndexOffset,
    );
  }

  clearAll(): void {
    this._cellMeasurerCache.clearAll();
  }

  columnWidth = ({index}: IndexParam) => {
    this._cellMeasurerCache.columnWidth({
      index: index + this._columnIndexOffset,
    });
  };

  get defaultHeight(): number {
    return this._cellMeasurerCache.defaultHeight;
  }

  get defaultWidth(): number {
    return this._cellMeasurerCache.defaultWidth;
  }

  hasFixedHeight(): boolean {
    return this._cellMeasurerCache.hasFixedHeight();
  }

  hasFixedWidth(): boolean {
    return this._cellMeasurerCache.hasFixedWidth();
  }

  getHeight(rowIndex: number, columnIndex: ?number = 0): ?number {
    return this._cellMeasurerCache.getHeight(
      rowIndex + this._rowIndexOffset,
      columnIndex + this._columnIndexOffset,
    );
  }

  getWidth(rowIndex: number, columnIndex: ?number = 0): ?number {
    return this._cellMeasurerCache.getWidth(
      rowIndex + this._rowIndexOffset,
      columnIndex + this._columnIndexOffset,
    );
  }

  has(rowIndex: number, columnIndex: ?number = 0): boolean {
    return this._cellMeasurerCache.has(
      rowIndex + this._rowIndexOffset,
      columnIndex + this._columnIndexOffset,
    );
  }

  rowHeight = ({index}: IndexParam) => {
    this._cellMeasurerCache.rowHeight({
      index: index + this._rowIndexOffset,
    });
  };

  set(
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number,
  ): void {
    this._cellMeasurerCache.set(
      rowIndex + this._rowIndexOffset,
      columnIndex + this._columnIndexOffset,
      (width: number),
      (height: number),
    );
  }
}
