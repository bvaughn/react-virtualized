/**
 * Browsers have scroll offset limits.
 * Elements positioned after a certain offset are not displayed.
 * This value represents the lowest-common-denominator (Edge, at ~1.5M pixels).
 */
const MAX_UNSCALED_SIZE = 1.5e6

/**
 * Do not adjust/scale offsets while a user scrolls slowly.
 * This way the scrolling experience feels more natural.
 * The scale will be adjusted once the user stops slow-scrolling (after a debounce).
 *
 * If a user scrolls over a large portion of the list however, immediately adjust the scale.
 * This threshold specifies the difference between a small and large scroll.
 */
const SLOW_SCROLL_THRESHOLD = 10e3

/**
 * The first N pixels from the top/bottom (or left/right) should never be scaled.
 * This reduces the likelihood of a user slow-scrolling to the end of the physical list,
 * Without reaching the end of the logical list.
 * These regions (near the edges) are also the most visited portions of a Grid.
 * By not scaling them we can avoid scaling altogether in most cases.
 */
const UNSCALED_SAFE_ZONE_SIZE = 50e3

export default class ScaledOffsetUtil {
  constructor ({
    logicalSize,
    maxPhysicalSize = MAX_UNSCALED_SIZE,
    slowScrollThreshold = SLOW_SCROLL_THRESHOLD,
    unscaledSafeZoneSize = UNSCALED_SAFE_ZONE_SIZE
  } = {}) {
    this._logicalSize = 0
    this._maxPhysicalSize = maxPhysicalSize
    this._slowScrollThreshold = slowScrollThreshold
    this._unscaledSafeZoneSize = unscaledSafeZoneSize

    this._lastLogicalOffset = 0
  }

  /**
   * Is utility required, given the current sizes?
   */
  isRequired () {
    return this._logicalSize > this._maxPhysicalSize
  }

  /**
   * Map the current pysical offset to a logical offset.
   * This allows Grid to determine which slice of cells to render.
   */
  getLogicalOffset (physicalOffset: number) {
    this._lastPhysicalOffset = this._newPhysicalOffset
    this._newPhysicalOffset = physicalOffset

    const logicalSize = this._logicalSize
    const lastPhysicalOffset = this._lastPhysicalOffset
    const lastLogicalOffset = this._lastLogicalOffset
    const newPhysicalOffset = this._newPhysicalOffset
    const physicalSize = this._physicalSize
    const slowScrollThreshold = this._slowScrollThreshold
    const unscaledSafeZoneSize = this._unscaledSafeZoneSize

    // 1:1 mapping for grids that aren't large enough to require scaling 
    if (!this.isRequired()) {
      return physicalOffset
    }

    // 1:1 mapping near the edges of the grid
    if (newPhysicalOffset < unscaledSafeZoneSize) {
      this._lastLogicalOffset = newPhysicalOffset

      return this._lastLogicalOffset
    } else if (newPhysicalOffset >= physicalSize - unscaledSafeZoneSize) {
      this._lastLogicalOffset = logicalSize - newPhysicalOffset

      return this._lastLogicalOffset
    }

    // 1:1 mapping near current position for more natural scrolling
    if (Math.abs(newPhysicalOffset - lastPhysicalOffset) < slowScrollThreshold) {
      this._lastLogicalOffset = lastLogicalOffset + newPhysicalOffset - lastPhysicalOffset

      return this._lastLogicalOffset
    }

    let topOfPhysicalRegion
    let topOfLogicalRegion
    let endOfPhysicalRegion
    let endOfLogicalRegion

    if (lastPhysicalOffset < newPhysicalOffset) {
      topOfPhysicalRegion = unscaledSafeZoneSize
      topOfLogicalRegion = unscaledSafeZoneSize
      endOfPhysicalRegion = lastPhysicalOffset - slowScrollThreshold
      endOfLogicalRegion = lastLogicalOffset - slowScrollThreshold
      // @TODO ? assert(newPhysicalOffset >= topOfPhysicalRegion && newPhysicalOffset <= endOfPhysicalRegion)
    } else {
      topOfPhysicalRegion = lastPhysicalOffset + slowScrollThreshold
      topOfLogicalRegion = lastLogicalOffset + slowScrollThreshold
      endOfPhysicalRegion = physicalSize - unscaledSafeZoneSize
      endOfLogicalRegion = logicalSize - unscaledSafeZoneSize
      // @TODO ? assert(newPhysicalOffset >= topOfPhysicalRegion && newPhysicalOffset <= endOfPhysicalRegion)
    }

    // Linear interpolation between the two points:
    this._lastLogicalOffset = Math.round(
      (newPhysicalOffset - topOfPhysicalRegion) * (endOfLogicalRegion - topOfLogicalRegion) /
      (endOfPhysicalRegion - topOfPhysicalRegion) +
      topOfPhysicalRegion
    )

    return this._lastLogicalOffset
  }

  /**
   * Adjusts (resets) the most recent physical offset once scrolling has stopped.
   * This method should be called once scrolling has stopped completely.
   */
  getAdjustedPhsysicalOffset () {
    const lastLogicalOffset = this._lastLogicalOffset
    const logicalSize = this._logicalSize
    const physicalSize = this._physicalSize
    const unscaledSafeZoneSize = this._unscaledSafeZoneSize
console.group('getAdjustedPhsysicalOffset')
    // FIXME: Not sure if this is quite right. Probably not. Maybe should be:
    // const adjustedPhysicalOffset = Math.round(this._lastLogicalOffset / this._scale)
    const adjustedPhysicalOffset = Math.round(
      (lastLogicalOffset - unscaledSafeZoneSize) * (physicalSize - unscaledSafeZoneSize * 2) /
      (logicalSize - unscaledSafeZoneSize * 2) +
      unscaledSafeZoneSize
    )
console.log('scale:', this._scale)
console.log('lastLogicalOffset:', this._lastLogicalOffset)
console.log('lastPhysicalOffset:', this._lastPhysicalOffset)
console.log('physicalSize:', this._physicalSize)
console.log('logicalSize:', this._logicalSize)
console.log('adjustedPhysicalOffset:', adjustedPhysicalOffset)
console.groupEnd()

    this._lastPhysicalOffset = adjustedPhysicalOffset
    this._newPhysicalOffset = adjustedPhysicalOffset

    return adjustedPhysicalOffset
  }

  /**
   * Update total, unscaled size of all rows (may be estimated)
   */
  setLogicalSize (logicalSize: number) {
    this._logicalSize = logicalSize
    this._physicalSize = Math.min(this._logicalSize, this._maxPhysicalSize)
    this._scale = this._logicalSize / this._physicalSize
  }
}
