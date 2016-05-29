/** @flow */
import CellSizeAndPositionManager from './CellSizeAndPositionManager'

/**
 * Browsers have scroll offset limitations.
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 */
export const DEFAULT_MAX_SCROLL_SIZE = 100000 // @TODO Pick a less arbitrary ceiling that's safe for all browsers?

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
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()
    const scrolledFraction = this._getOffsetFraction({
      containerSize,
      offset,
      safeTotalSize
    })

    return totalSize === safeTotalSize
      ? 0
      : scrolledFraction * (safeTotalSize - totalSize)
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

  _getOffsetFraction ({
    containerSize,
    offset,
    safeTotalSize
  }) {
    return safeTotalSize <= containerSize
      ? 0
      : offset / (safeTotalSize - containerSize)
  }

  _getScaledOffset ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): number {
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()

    if (totalSize === safeTotalSize) {
      return offset
    } else {
      const scrolledFraction = this._getOffsetFraction({
        containerSize,
        offset,
        safeTotalSize
      })

      return (offset * totalSize / safeTotalSize) + (scrolledFraction * containerSize)
    }
  }

  _getUnscaledOffset ({
    containerSize,
    offset
  }: ContainerSizeAndOffset): number {
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()

    if (totalSize === safeTotalSize) {
      return offset
    } else {
      const scrolledFraction = this._getOffsetFraction({
        containerSize,
        offset,
        safeTotalSize
      })

      return scrolledFraction * (safeTotalSize - containerSize)
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
