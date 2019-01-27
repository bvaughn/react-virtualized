/** @flow */

import LinearLayoutVector from 'linear-layout-vector';
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
  _layoutVector: LinearLayoutVector;

  // Measurements for cells up to this index can be trusted; cells afterward should be estimated.
  _lastMeasuredIndex = -1;

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
    this._layoutVector = new LinearLayoutVector();
    this._layoutVector.setLength(cellCount);
    this._layoutVector.setDefaultSize(estimatedCellSize);
  }

  areOffsetsAdjusted() {
    return false;
  }

  configure({cellCount, estimatedCellSize, cellSizeGetter}: ConfigureParams) {
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
    this._cellSizeGetter = cellSizeGetter;
    this._layoutVector.setLength(cellCount);
    this._layoutVector.setDefaultSize(estimatedCellSize);
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
    const vector = this._layoutVector;
    if (index > this._lastMeasuredIndex) {
      const token = {index: this._lastMeasuredIndex + 1};

      for (var i = token.index; i <= index; token.index = ++i) {
        const size = this._cellSizeGetter(token);
        // undefined or NaN probably means a logic error in the size getter.
        // null means we're using CellMeasurer and haven't yet measured a given index.
        if (size === undefined || size !== size) {
          throw Error(`Invalid size returned for cell ${i} of value ${size}`);
        } else if (size !== null) {
          vector.setItemSize(i, size);
        }
      }
      this._lastMeasuredIndex = Math.min(index, this._cellCount - 1);
    }

    return {
      offset: vector.start(index),
      size: vector.getItemSize(index),
    };
  }

  getSizeAndPositionOfLastMeasuredCell(): SizeAndPositionData {
    const index = this._lastMeasuredIndex;
    if (index <= 0) {
      return {
        offset: 0,
        size: 0,
      };
    }
    const vector = this._layoutVector;
    return {
      offset: vector.start(index),
      size: vector.getItemSize(index),
    };
  }

  /**
   * Total size of all cells being measured.
   * This value will be completely estimated initially.
   * As cells are measured, the estimate will be updated.
   */
  getTotalSize(): number {
    const lastIndex = this._cellCount - 1;
    return lastIndex >= 0 ? this._layoutVector.end(lastIndex) : 0;
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
    if (this.getTotalSize() === 0) {
      return {};
    }

    const {containerSize, offset} = params;
    const maxOffset = offset + containerSize - 1;
    return {
      start: this._findNearestCell(offset),
      stop: this._findNearestCell(maxOffset),
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

    const vector = this._layoutVector;
    const lastIndex = this._cellCount - 1;
    // Our search algorithms find the nearest match at or below the specified offset.
    // So make sure the offset is at least 0 or no match will be found.
    let targetOffset = Math.max(0, Math.min(offset, vector.start(lastIndex)));
    // First interrogate the constant-time lookup table
    let nearestCellIndex = vector.indexOf(targetOffset);

    // If we haven't yet measured this high, compute sizes for each cell up to the desired offset.
    while (nearestCellIndex > this._lastMeasuredIndex) {
      // Measure all the cells up to the one we want to find presently.
      // Do this before the last-index check to ensure the sparse array
      // is fully populated.
      this.getSizeAndPositionOfCell(nearestCellIndex);
      // No need to search and compare again if we're at the end.
      if (nearestCellIndex === lastIndex) {
        return nearestCellIndex;
      }
      nearestCellIndex = vector.indexOf(targetOffset);
      // Guard in case `getSizeAndPositionOfCell` didn't fully measure to
      // the nearestCellIndex. This might happen scrolling quickly down
      // and back up on large lists -- possible race with React or DOM?
      if (nearestCellIndex === -1) {
        nearestCellIndex = this._lastMeasuredIndex;
        this._lastMeasuredIndex = nearestCellIndex - 1;
        targetOffset = Math.max(0, Math.min(offset, vector.start(lastIndex)));
      }
    }

    return nearestCellIndex;
  }
}
