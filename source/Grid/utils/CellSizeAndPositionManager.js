/** @flow */

import type {Alignment, CellSizeGetter, VisibleCellRange} from '../types';

type CellSizeAndPositionManagerParams = {
  cellCount: number,
  cellSizeGetter: CellSizeGetter,
  estimatedCellSize: number,
};

type ConfigureParams = {
  cellCount: number,
  estimatedCellSize: number,
  cellSizeGetter: CellSizeGetter,
};

type GetUpdatedOffsetForIndex = {
  align: Alignment,
  containerSize: number,
  currentOffset: number,
  targetIndex: number,
};

type GetVisibleCellRangeParams = {
  containerSize: number,
  offset: number,
};

type SizeAndPositionData = {
  offset: number,
  size: number,
};

/**
 * Just-in-time calculates and caches size and position information for a collection of cells.
 */

export default class CellSizeAndPositionManager {
  // Cache of size and position data for cells, mapped by cell index.
  // Note that invalid values may exist in this map so only rely on cells up to this._lastMeasuredIndex
  _cellSizeAndPositionData = {};

  // Measurements for cells up to this index can be trusted; cells afterward should be estimated.
  _lastMeasuredIndex = -1;

  // Used in deferred mode to track which cells have been queued for measurement.
  _lastBatchedIndex = -1;

  _cellCount: number;
  _cellSizeGetter: CellSizeGetter;
  _estimatedCellSize: number;

  constructor({
    cellCount,
    cellSizeGetter,
    estimatedCellSize,
  }: CellSizeAndPositionManagerParams) {
    this._cellSizeGetter = cellSizeGetter;
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
  }

  areOffsetsAdjusted() {
    return false;
  }

  configure({cellCount, estimatedCellSize, cellSizeGetter}: ConfigureParams) {
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
    this._cellSizeGetter = cellSizeGetter;
  }

  getCellCount(): number {
    return this._cellCount;
  }

  getEstimatedCellSize(): number {
    return this._estimatedCellSize;
  }

  getLastMeasuredIndex(): number {
    return this._lastMeasuredIndex;
  }

  getOffsetAdjustment() {
    return 0;
  }

  /**
   * This method returns the size and position for the cell at the specified index.
   * It just-in-time calculates (or used cached values) for cells leading up to the index.
   */
  getSizeAndPositionOfCell(index: number): SizeAndPositionData {
    if (index < 0 || index >= this._cellCount) {
      throw Error(
        `Requested index ${index} is outside of range 0..${this._cellCount}`,
      );
    }

    if (index > this._lastMeasuredIndex) {
      let lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
      let offset =
        lastMeasuredCellSizeAndPosition.offset +
        lastMeasuredCellSizeAndPosition.size;

      for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
        let size = this._cellSizeGetter({index: i});

        // undefined or NaN probably means a logic error in the size getter.
        // null means we're using CellMeasurer and haven't yet measured a given index.
        if (size === undefined || isNaN(size)) {
          throw Error(`Invalid size returned for cell ${i} of value ${size}`);
        } else if (size === null) {
          this._cellSizeAndPositionData[i] = {
            offset,
            size: 0,
          };

          this._lastBatchedIndex = index;
        } else {
          this._cellSizeAndPositionData[i] = {
            offset,
            size,
          };

          offset += size;

          this._lastMeasuredIndex = index;
        }
      }
    }

    return this._cellSizeAndPositionData[index];
  }

  getSizeAndPositionOfLastMeasuredCell(): SizeAndPositionData {
    return this._lastMeasuredIndex >= 0
      ? this._cellSizeAndPositionData[this._lastMeasuredIndex]
      : {
          offset: 0,
          size: 0,
        };
  }

  /**
   * Total size of all cells being measured.
   * This value will be completely estimated initially.
   * As cells are measured, the estimate will be updated.
   */
  getTotalSize(): number {
    const lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
    const totalSizeOfMeasuredCells =
      lastMeasuredCellSizeAndPosition.offset +
      lastMeasuredCellSizeAndPosition.size;
    const numUnmeasuredCells = this._cellCount - this._lastMeasuredIndex - 1;
    const totalSizeOfUnmeasuredCells =
      numUnmeasuredCells * this._estimatedCellSize;
    return totalSizeOfMeasuredCells + totalSizeOfUnmeasuredCells;
  }

  /**
   * Determines a new offset that ensures a certain cell is visible, given the current offset.
   * If the cell is already visible then the current offset will be returned.
   * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
   *
   * @param align Desired alignment within container; one of "auto" (default), "start", or "end"
   * @param containerSize Size (width or height) of the container viewport
   * @param currentOffset Container's current (x or y) offset
   * @param totalSize Total size (width or height) of all cells
   * @return Offset to use to ensure the specified cell is visible
   */
  getUpdatedOffsetForIndex({
    align = 'auto',
    containerSize,
    currentOffset,
    targetIndex,
  }: GetUpdatedOffsetForIndex): number {
    if (containerSize <= 0) {
      return 0;
    }

    const datum = this.getSizeAndPositionOfCell(targetIndex);
    const maxOffset = datum.offset;
    const minOffset = maxOffset - containerSize + datum.size;

    let idealOffset;

    switch (align) {
      case 'start':
        idealOffset = maxOffset;
        break;
      case 'end':
        idealOffset = minOffset;
        break;
      case 'center':
        idealOffset = maxOffset - (containerSize - datum.size) / 2;
        break;
      default:
        idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
        break;
    }

    const totalSize = this.getTotalSize();

    return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
  }

  getVisibleCellRange(params: GetVisibleCellRangeParams): VisibleCellRange {
    let {containerSize, offset} = params;

    const totalSize = this.getTotalSize();

    if (totalSize === 0) {
      return {};
    }

    const maxOffset = offset + containerSize;
    const start = this._findNearestCell(offset);

    const datum = this.getSizeAndPositionOfCell(start);
    offset = datum.offset + datum.size;

    let stop = start;

    while (offset < maxOffset && stop < this._cellCount - 1) {
      stop++;

      offset += this.getSizeAndPositionOfCell(stop).size;
    }

    return {
      start,
      stop,
    };
  }

  /**
   * Clear all cached values for cells after the specified index.
   * This method should be called for any cell that has changed its size.
   * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionOfCell() is called.
   */
  resetCell(index: number): void {
    this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
  }

  _binarySearch(high: number, low: number, offset: number): number {
    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const currentOffset = this.getSizeAndPositionOfCell(middle).offset;

      if (currentOffset === offset) {
        return middle;
      } else if (currentOffset < offset) {
        low = middle + 1;
      } else if (currentOffset > offset) {
        high = middle - 1;
      }
    }

    if (low > 0) {
      return low - 1;
    } else {
      return 0;
    }
  }

  _exponentialSearch(index: number, offset: number): number {
    let interval = 1;

    while (
      index < this._cellCount &&
      this.getSizeAndPositionOfCell(index).offset < offset
    ) {
      index += interval;
      interval *= 2;
    }

    return this._binarySearch(
      Math.min(index, this._cellCount - 1),
      Math.floor(index / 2),
      offset,
    );
  }

  /**
   * Searches for the cell (index) nearest the specified offset.
   *
   * If no exact match is found the next lowest cell index will be returned.
   * This allows partially visible cells (with offsets just before/above the fold) to be visible.
   */
  _findNearestCell(offset: number): number {
    if (isNaN(offset)) {
      throw Error(`Invalid offset ${offset} specified`);
    }

    // Our search algorithms find the nearest match at or below the specified offset.
    // So make sure the offset is at least 0 or no match will be found.
    offset = Math.max(0, offset);

    const lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
    const lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);

    if (lastMeasuredCellSizeAndPosition.offset >= offset) {
      // If we've already measured cells within this range just use a binary search as it's faster.
      return this._binarySearch(lastMeasuredIndex, 0, offset);
    } else {
      // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
      // The exponential search avoids pre-computing sizes for the full set of cells as a binary search would.
      // The overall complexity for this approach is O(log n).
      return this._exponentialSearch(lastMeasuredIndex, offset);
    }
  }
}
