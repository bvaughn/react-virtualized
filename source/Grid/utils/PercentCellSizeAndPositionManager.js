/** @flow */

import parseSize from './parseSize'

/**
 * Alternative implementation of CellSizeAndPositionManager that sizes cells
 * based on a percentage of the given total size.
 */
export default class PercentCellSizeAndPositionManager {
  constructor ({
    cellCount,
    cellSizeGetter,
    totalSize
  }: ConstructorParams) {
    this._cellCount = cellCount
    this._cellSizeGetter = cellSizeGetter
    this._totalSize = totalSize

    // Cache of size and position data for cells, mapped by cell index.
    // Note that invalid values may exist in this map so only rely on cells up to this._lastMeasuredIndex
    this._cellSizeAndPositionData = {}

    // Measurements for cells up to this index can be trusted; cells afterward should be estimated.
    this._lastMeasuredIndex = -1
  }

  configure ({
    cellCount,
    totalSize
  }: ConfigureParams): void {
    this._cellCount = cellCount
    this._totalSize = totalSize
  }

  getCellCount (): number {
    return this._cellCount
  }

  getTotalSize (): number {
    return this._totalSize
  }

  getLastMeasuredIndex (): number {
    return this._lastMeasuredIndex
  }

  getOffsetAdjustment (): number {
    return 0
  }

  getUnit (): string {
    return '%'
  }

  /**
   * This method returns the size and position for the cell at the specified index.
   * It just-in-time calculates (or used cached values) for cells leading up to the index.
   */
  getSizeAndPositionOfCell (index: number): SizeAndPositionData {
    if (index < 0 || index >= this._cellCount) {
      throw Error(`Requested index ${index} is outside of range 0..${this._cellCount}`)
    }

    if (index > this._lastMeasuredIndex) {
      const lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell()
      let offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size

      for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
        const rawSize = this._cellSizeGetter({ index: i })
        const parsedSize = parseSize(rawSize, '%')

        if (parsedSize == null || parsedSize.unit !== '%' ||
            parsedSize.value < 0 || parsedSize.value > 100) {
          throw Error(`Invalid size returned for % cell ${i} of value ${rawSize}`)
        }

        const size = parsedSize.value
        this._cellSizeAndPositionData[i] = {
          offset,
          size
        }

        offset += size
      }

      this._lastMeasuredIndex = index
    }

    return this._cellSizeAndPositionData[index]
  }

  getSizeAndPositionOfLastMeasuredCell (): SizeAndPositionData {
    return this._lastMeasuredIndex >= 0
      ? this._cellSizeAndPositionData[this._lastMeasuredIndex]
      : {
        offset: 0,
        size: 0
      }
  }

  /**
   * Determines a new offset that ensures a certain cell is visible, given the current offset.
   * Since all cells are always visible, the given current offset is returned.
   *
   * @param currentOffset Container's current (x or y) offset
   * @return Always returns currentOffset
   */
  getUpdatedOffsetForIndex ({ currentOffset }): number {
    return currentOffset
  }

  getVisibleCellRange (): VisibleCellRange {
    if (this._cellCount < 1) {
      return {
        start: undefined,
        stop: undefined
      }
    }

    // all cells are always visible
    return {
      start: 0,
      stop: this._cellCount - 1
    }
  }

  /**
   * Clear all cached values for cells after the specified index.
   * This method should be called for any cell that has changed its size.
   * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionOfCell() is called.
   */
  resetCell (index: number): void {
    this._lastMeasuredIndex = index - 1
  }
}

type ConstructorParams = {
  cellCount: number,
  cellSizeGetter: Function,
  totalSize: number
};

type ConfigureParams = {
  cellCount: number,
  totalSize: number
};

type SizeAndPositionData = {
  offset: number,
  size: number
};

type VisibleCellRange = {
  start: ?number,
  stop: ?number
};
