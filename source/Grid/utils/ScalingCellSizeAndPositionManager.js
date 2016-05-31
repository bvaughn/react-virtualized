/** @flow */
import CellSizeAndPositionManager from './CellSizeAndPositionManager'

/**
 * Browsers have scroll offset limitations.
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 */
export const DEFAULT_MAX_SCROLL_SIZE = 1000000 // @TODO Pick a less arbitrary ceiling that's safe for all browsers?

/**
 * Extends CellSizeAndPositionManager and adds scaling behavior for lists that are too large to fit within a browser's native limits.
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
   * Number of pixels a cell at the given position (offset) should be shifted in order to fit within the scaled container.
   * The offset passed to this function is scalled (safe) as well.
   */
  getOffsetAdjustment ({
    containerSize,
    offset // safe
  }: ContainerSizeAndOffset): number {
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()
    const offsetPercentage = this._getOffsetPercentage({
      containerSize,
      offset,
      totalSize: safeTotalSize
    })

    return Math.round(offsetPercentage * (safeTotalSize - totalSize))
  }

  /** See CellSizeAndPositionManager#getTotalSize */
  getTotalSize (): number {
    return Math.min(this._maxScrollSize, super.getTotalSize())
  }

  /** See CellSizeAndPositionManager#getUpdatedOffsetForIndex */
  getUpdatedOffsetForIndex ({
    align = 'auto',
    containerSize,
    currentOffset, // safe
    targetIndex
  }) {
    currentOffset = this._safeOffsetToOffset({
      containerSize,
      offset: currentOffset
    })

    const offset = super.getUpdatedOffsetForIndex({
      align,
      containerSize,
      currentOffset,
      targetIndex
    })

    return this._offsetToSafeOffset({
      containerSize,
      offset
    })
  }

  /** See CellSizeAndPositionManager#getVisibleCellRange */
  getVisibleCellRange ({
    containerSize,
    offset // safe
  }: ContainerSizeAndOffset): VisibleCellRange {
    offset = this._safeOffsetToOffset({
      containerSize,
      offset
    })

    return super.getVisibleCellRange({
      containerSize,
      offset
    })
  }

  _getOffsetPercentage ({
    containerSize,
    offset, // safe
    totalSize
  }) {
    return totalSize <= containerSize
      ? 0
      : offset / (totalSize - containerSize)
  }

  _offsetToSafeOffset ({
    containerSize,
    offset // unsafe
  }: ContainerSizeAndOffset): number {
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()

    if (totalSize === safeTotalSize) {
      return offset
    } else {
      const offsetPercentage = this._getOffsetPercentage({
        containerSize,
        offset,
        totalSize
      })

      return Math.round(offsetPercentage * (safeTotalSize - containerSize))
    }
  }

  _safeOffsetToOffset ({
    containerSize,
    offset // safe
  }: ContainerSizeAndOffset): number {
    const totalSize = super.getTotalSize()
    const safeTotalSize = this.getTotalSize()

    if (totalSize === safeTotalSize) {
      return offset
    } else {
      const offsetPercentage = this._getOffsetPercentage({
        containerSize,
        offset,
        totalSize: safeTotalSize
      })

      return Math.round(offsetPercentage * (totalSize - containerSize))
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
