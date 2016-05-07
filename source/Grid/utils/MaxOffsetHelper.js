/** @flow */

/**
 * Browsers have scroll offset limitations.
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 * @TODO
 */
export const MAX_SIZE = 1000000

/**
 * @TODO
 */
export function getTotalSize (unboundSize: number): number {
  return Math.min(MAX_SIZE, unboundSize)
}

/**
 * @TODO
 */
export function getOffsetAdjustment ({
  containerSize,
  offset,
  totalSize,
  unboundTotalSize
}: GetOffsetAdjustment): number {
  const maxOffset = totalSize - containerSize

  return unboundTotalSize === totalSize
    ? 0
    : Math.round((totalSize - unboundTotalSize) * (offset / maxOffset))
}

/*
_getScaledOffset (offset: number): number {
  const unboundTotalSize = this._getUnboundTotalSize()
  const totalSize = this.getTotalSize()

  // @TODO Does this need to subtract container size?
  return unboundTotalSize === totalSize
    ? offset
    : offset * unboundTotalSize / totalSize
}
*/

type GetOffsetAdjustment = {
  containerSize: number,
  offset: number,
  totalSize: number,
  unboundTotalSize: number
};
