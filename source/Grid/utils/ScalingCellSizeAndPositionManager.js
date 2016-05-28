/** @flow */
import CellSizeAndPositionManager from './CellSizeAndPositionManager'

/**
 * Browsers have scroll offset limitations.
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 * @TODO Pick a less arbitrary ceiling that's safe for all browsers?
 */
export const DEFAULT_MAX_SCROLL_SIZE = 1000000

/**
 * Just-in-time calculates and caches size and position information for a collection of cells.
 */
export default class ScalingCellSizeAndPositionManager extends CellSizeAndPositionManager {
  constructor ({
    maxScrollSize = DEFAULT_MAX_SCROLL_SIZE,
    ...params
  }) {
    super(params)

    this._maxScrollSize = maxScrollSize
  }

  /**
   * @TODO Add more comments here I'm too tired.
   */
  getOffsetAdjustment ({
    containerSize,
    offset
  }: GetOffsetAdjustment): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()
    const maxOffset = totalSize - containerSize

    return unboundTotalSize === totalSize
      ? 0
      : Math.round((totalSize - unboundTotalSize) * (offset / maxOffset))
  }

  /**
   * @TODO Add more comments here I'm too tired.
   */
  getTotalSize (): number {
    return Math.min(this._maxScrollSize, super.getTotalSize())
  }

  getVisibleCellRange ({
    containerSize,
    offset
  }: GetVisibleCellRangeParams): VisibleCellRange {
console.log(`getVisibleCellRange(): ${offset} ~> ${this._offsetToScaledOffset(offset)}`)
    offset = this._offsetToScaledOffset(offset)

    return super.getVisibleCellRange({
      containerSize,
      offset
    })
  }

  _offsetToScaledOffset (offset: number): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()

    // @TODO Does this need to subtract container size?
    return unboundTotalSize === totalSize
      ? offset
      : offset * unboundTotalSize / totalSize
  }

  _scaledOffsetToOffset (scaledOffset: number): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()

    // @TODO Does this need to subtract container size?
    return unboundTotalSize === totalSize
      ? scaledOffset
      : scaledOffset * totalSize / unboundTotalSize
  }
}

type GetOffsetAdjustment = {
  containerSize: number,
  offset: number
};

type GetVisibleCellRangeParams = {
  containerSize: number,
  offset: number
};

type SizeAndPositionData = {
  offset: number,
  size: number
};

type VisibleCellRange = {
  start: ?number,
  stop: ?number
};
