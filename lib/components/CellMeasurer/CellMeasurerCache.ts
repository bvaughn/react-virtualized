import type {
  CellMeasureCache,
  CellMeasurerCacheAPI,
  CellMeasurerCacheParams
} from "./types";

export const DEFAULT_HEIGHT = 30;
export const DEFAULT_WIDTH = 100;

// Keys are produced by the (possibly user-supplied) key mapper and are coerced to strings when used as object keys.
type KeyMapper = (rowIndex: number, columnIndex: number) => string;

type Cache = Record<string, number>;

type IndexParam = {
  index: number;
};

/**
 * Caches measurements for a given cell.
 */
export class CellMeasurerCache
  implements CellMeasureCache, CellMeasurerCacheAPI
{
  _cellHeightCache: Cache = {};
  _cellWidthCache: Cache = {};
  _columnWidthCache: Cache = {};
  _rowHeightCache: Cache = {};
  // The number of rows (or columns) that each derived column width (or row height) was computed over,
  // so that it can be updated incrementally when a cell is measured (#1747)
  _columnWidthRowCount: Cache = {};
  _rowHeightColumnCount: Cache = {};
  _defaultHeight: number;
  _defaultWidth: number;
  _minHeight: number;
  _minWidth: number;
  _keyMapper: KeyMapper;
  _hasFixedHeight: boolean;
  _hasFixedWidth: boolean;
  _columnCount = 0;
  _rowCount = 0;

  constructor(params: CellMeasurerCacheParams = {}) {
    const {
      defaultHeight,
      defaultWidth,
      fixedHeight,
      fixedWidth,
      keyMapper,
      minHeight,
      minWidth
    } = params;

    this._hasFixedHeight = fixedHeight === true;
    this._hasFixedWidth = fixedWidth === true;
    this._minHeight = minHeight || 0;
    this._minWidth = minWidth || 0;
    this._keyMapper = (keyMapper || defaultKeyMapper) as KeyMapper;

    this._defaultHeight = Math.max(
      this._minHeight,
      typeof defaultHeight === "number" ? defaultHeight : DEFAULT_HEIGHT
    );
    this._defaultWidth = Math.max(
      this._minWidth,
      typeof defaultWidth === "number" ? defaultWidth : DEFAULT_WIDTH
    );

    if (process.env.NODE_ENV !== "production") {
      if (this._hasFixedHeight === false && this._hasFixedWidth === false) {
        console.warn(
          "CellMeasurerCache should only measure a cell's width or height. " +
            "You have configured CellMeasurerCache to measure both. " +
            "This will result in poor performance."
        );
      }

      if (this._hasFixedHeight === false && this._defaultHeight === 0) {
        console.warn(
          "Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. " +
            "Failing to do so will lead to unnecessary layout and poor performance."
        );
      }

      if (this._hasFixedWidth === false && this._defaultWidth === 0) {
        console.warn(
          "Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. " +
            "Failing to do so will lead to unnecessary layout and poor performance."
        );
      }
    }
  }

  /**
   * Reset cached measurements for a specific cell.
   *
   * This should be called when a cell needs to be re-measured to handle dynamic content
   * (eg. replacing a loading indicator with loaded content or reacting to state-changes for stateful cells).
   */
  clear(rowIndex: number, columnIndex: number = 0) {
    const key = this._keyMapper(rowIndex, columnIndex);

    delete this._cellHeightCache[key];
    delete this._cellWidthCache[key];

    this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
  }

  /**
   * Reset cached measurements for all cells.
   *
   * This method should be called when a `Grid`, `List` or `Table` needs to reflow content due to a resizing event
   * for a responsive layout (eg. a window width resize may have an impact on the height of cells).
   */
  clearAll() {
    this._cellHeightCache = {};
    this._cellWidthCache = {};
    this._columnWidthCache = {};
    this._rowHeightCache = {};
    this._columnWidthRowCount = {};
    this._rowHeightColumnCount = {};
    this._rowCount = 0;
    this._columnCount = 0;
  }

  /**
   * Returns the derived width of a column (the widest measured cell in that column) or the default width.
   * Compatible with the `columnWidth` prop of `Grid`.
   */
  columnWidth = ({ index }: IndexParam) => {
    const key = this._keyMapper(0, index);

    return this._columnWidthCache[key] !== undefined
      ? this._columnWidthCache[key]
      : this._defaultWidth;
  };

  /** Height reported for unmeasured cells. */
  get defaultHeight(): number {
    return this._defaultHeight;
  }

  /** Width reported for unmeasured cells. */
  get defaultWidth(): number {
    return this._defaultWidth;
  }

  /** Returns true if cells have a fixed height (and a dynamic, measured width). */
  hasFixedHeight(): boolean {
    return this._hasFixedHeight;
  }

  /** Returns true if cells have a fixed width (and a dynamic, measured height). */
  hasFixedWidth(): boolean {
    return this._hasFixedWidth;
  }

  /** Returns the (measured or default) height of the specified cell. */
  getHeight(rowIndex: number, columnIndex: number = 0): number {
    if (this._hasFixedHeight) {
      return this._defaultHeight;
    } else {
      const key = this._keyMapper(rowIndex, columnIndex);

      return this._cellHeightCache[key] !== undefined
        ? Math.max(this._minHeight, this._cellHeightCache[key])
        : this._defaultHeight;
    }
  }

  /** Returns the (measured or default) width of the specified cell. */
  getWidth(rowIndex: number, columnIndex: number = 0): number {
    if (this._hasFixedWidth) {
      return this._defaultWidth;
    } else {
      const key = this._keyMapper(rowIndex, columnIndex);

      return this._cellWidthCache[key] !== undefined
        ? Math.max(this._minWidth, this._cellWidthCache[key])
        : this._defaultWidth;
    }
  }

  /** Returns true if the specified cell has already been measured. */
  has(rowIndex: number, columnIndex: number = 0): boolean {
    const key = this._keyMapper(rowIndex, columnIndex);

    return this._cellHeightCache[key] !== undefined;
  }

  /**
   * Returns the derived height of a row (the tallest measured cell in that row) or the default height.
   * Compatible with the `rowHeight` prop of `Grid`.
   */
  rowHeight = ({ index }: IndexParam) => {
    const key = this._keyMapper(index, 0);

    return this._rowHeightCache[key] !== undefined
      ? this._rowHeightCache[key]
      : this._defaultHeight;
  };

  /** Stores the measured size of the specified cell. */
  set(
    rowIndex: number,
    columnIndex: number,
    width: number,
    height: number
  ): void {
    const key = this._keyMapper(rowIndex, columnIndex);
    const previousCachedWidth = this._cellWidthCache[key];
    const previousCachedHeight = this._cellHeightCache[key];

    if (columnIndex >= this._columnCount) {
      this._columnCount = columnIndex + 1;
    }
    if (rowIndex >= this._rowCount) {
      this._rowCount = rowIndex + 1;
    }

    // Size is cached per cell so we don't have to re-measure if cells are re-ordered.
    this._cellHeightCache[key] = height;
    this._cellWidthCache[key] = width;

    // The derived sizes are updated incrementally when possible, rather than recomputed from every cell in the column/row (#1747).
    this._updateCachedColumnAndRowSizes(rowIndex, columnIndex, {
      height: this._canUpdateIncrementally(
        this._rowHeightCache[this._keyMapper(rowIndex, 0)],
        this._rowHeightColumnCount[this._keyMapper(rowIndex, 0)],
        columnIndex,
        this.getHeight(rowIndex, columnIndex),
        previousCachedHeight === undefined
          ? undefined
          : Math.max(this._minHeight, previousCachedHeight)
      ),
      width: this._canUpdateIncrementally(
        this._columnWidthCache[this._keyMapper(0, columnIndex)],
        this._columnWidthRowCount[this._keyMapper(0, columnIndex)],
        rowIndex,
        this.getWidth(rowIndex, columnIndex),
        previousCachedWidth === undefined
          ? undefined
          : Math.max(this._minWidth, previousCachedWidth)
      )
    });
  }

  /**
   * Whether a derived column width (or row height) can be updated incrementally after a cell is measured:
   * i.e. whether the previous derived size is still a lower bound of the new one.
   * The maximum can only decrease if the cell's previous size was the maximum and it got smaller.
   *
   * @param derivedSize The current derived size (the maximum of the measured cells counted so far, if any)
   * @param countedCells The number of cells (rows of a column, or columns of a row) that the derived size was computed over
   * @param cellIndex The index of the measured cell within the column (or row)
   * @param size The cell's new (effective) size
   * @param previousSize The cell's previous (effective) size, or undefined if it wasn't measured (so it wasn't part of the maximum)
   */
  _canUpdateIncrementally(
    derivedSize: number | undefined,
    countedCells: number | undefined,
    cellIndex: number,
    size: number,
    previousSize: number | undefined
  ): boolean {
    if (countedCells === undefined) {
      return false;
    }

    // With the default keyMapper, a cell beyond the counted range wasn't part of the maximum.
    // (Other keyMappers may map it to the key of a counted cell, so it is treated as counted.)
    if (this._keyMapper === defaultKeyMapper && cellIndex >= countedCells) {
      return true;
    }

    return (
      previousSize === undefined ||
      size >= previousSize ||
      (derivedSize !== undefined && previousSize < derivedSize)
    );
  }

  _updateCachedColumnAndRowSizes(
    rowIndex: number,
    columnIndex: number,
    incremental: { height: boolean; width: boolean } = {
      height: false,
      width: false
    }
  ) {
    // :columnWidth and :rowHeight are derived from the measured cells in a column/row (the default size is only used if none are).
    // Unmeasured cells aren't counted, so a column measured past its first rows can be narrower than the default width.
    // Pre-cache these derived values for faster lookup later.
    // Reads are expected to occur more frequently than writes in this case.
    // Only update non-fixed dimensions though to avoid doing unnecessary work.
    if (!this._hasFixedWidth) {
      const columnKey = this._keyMapper(0, columnIndex);
      const cachedWidth = this._columnWidthCache[columnKey];
      const countedRows = this._columnWidthRowCount[columnKey];

      // Incrementally: the previous width, the measured cell, and any rows added since it was computed
      let columnWidth: number | undefined;
      let firstRow: number;
      if (incremental.width && countedRows !== undefined) {
        columnWidth = Math.max(
          cachedWidth ?? 0,
          this.getWidth(rowIndex, columnIndex)
        );
        firstRow = countedRows;
      } else {
        columnWidth = undefined;
        firstRow = 0;
      }
      for (let i = firstRow; i < this._rowCount; i++) {
        if (this.has(i, columnIndex)) {
          columnWidth = Math.max(
            columnWidth ?? 0,
            this.getWidth(i, columnIndex)
          );
        }
      }
      if (columnWidth === undefined) {
        delete this._columnWidthCache[columnKey];
      } else {
        this._columnWidthCache[columnKey] = columnWidth;
      }
      this._columnWidthRowCount[columnKey] = this._rowCount;
    }
    if (!this._hasFixedHeight) {
      const rowKey = this._keyMapper(rowIndex, 0);
      const cachedHeight = this._rowHeightCache[rowKey];
      const countedColumns = this._rowHeightColumnCount[rowKey];

      let rowHeight: number | undefined;
      let firstColumn: number;
      if (incremental.height && countedColumns !== undefined) {
        rowHeight = Math.max(
          cachedHeight ?? 0,
          this.getHeight(rowIndex, columnIndex)
        );
        firstColumn = countedColumns;
      } else {
        rowHeight = undefined;
        firstColumn = 0;
      }
      for (let i = firstColumn; i < this._columnCount; i++) {
        if (this.has(rowIndex, i)) {
          rowHeight = Math.max(rowHeight ?? 0, this.getHeight(rowIndex, i));
        }
      }
      if (rowHeight === undefined) {
        delete this._rowHeightCache[rowKey];
      } else {
        this._rowHeightCache[rowKey] = rowHeight;
      }
      this._rowHeightColumnCount[rowKey] = this._columnCount;
    }
  }
}

function defaultKeyMapper(rowIndex: number, columnIndex: number) {
  return `${rowIndex}-${columnIndex}`;
}
