/** @flow */
import CellSizeAndPositionManager from './CellSizeAndPositionManager'

/**
 * Browsers have scroll offset limitations.
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 */
export const DEFAULT_MAX_SCROLL_SIZE = 1000000 // @TODO Pick a less arbitrary ceiling that's safe for all browsers?

/**
 * @TODO
 */
export default class ScalingCellSizeAndPositionManager extends CellSizeAndPositionManager {
  constructor ({
    maxScrollSize = DEFAULT_MAX_SCROLL_SIZE,
    ...params
  }) {
    super(params)

    this._maxScrollSize = maxScrollSize
  }

  getOffsetAdjustment ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()
    const maxOffset = totalSize - containerSize

    return unboundTotalSize === totalSize
      ? 0
      : (totalSize - unboundTotalSize) * (offset / maxOffset)
  }

  getTotalSize (): number {
    return Math.min(this._maxScrollSize, super.getTotalSize())
  }

  getUpdatedOffsetForIndex (params) {
    const offset = super.getUpdatedOffsetForIndex(params)

    return this._getUnscaledOffset({
      containerSize: params.containerSize,
      offset
    })
  }

  getVisibleCellRange ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): VisibleCellRange {
    offset = this._getScaledOffset({
      containerSize,
      offset
    })

    return super.getVisibleCellRange({
      containerSize,
      offset
    })
  }

  _getScaledOffset ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()

    if (unboundTotalSize === totalSize) {
      return offset
    } else {
      const scrolledFraction = offset / (totalSize - containerSize)

      return (offset * unboundTotalSize / totalSize) + (scrolledFraction * containerSize)
    }
  }

  _getUnscaledOffset ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): number {
    const unboundTotalSize = super.getTotalSize()
    const totalSize = this.getTotalSize()

    if (unboundTotalSize === totalSize) {
      return offset
    } else {
      const scrolledFraction = offset / (unboundTotalSize - containerSize)

      return scrolledFraction * (totalSize - containerSize)
    }
  }
}

type ContainerSizeAndOffset = {
  containerSize: number,
  offset: number
};

type VisibleCellRange = {
  start: ?number,
  stop: ?number
};
