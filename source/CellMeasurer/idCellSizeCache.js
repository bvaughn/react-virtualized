/** @flow */
import DefaultCellSizeCache from './defaultCellSizeCache'

type IdCellSizeCacheConstructorParams = {
  indexToIdMap : Function,
  uniformRowHeight ?: boolean,
  uniformColumnWidth ?: boolean
};

/**
 * Alternate CellMeasurer `cellSizeCache` implementation.
 * Similar to `defaultCellSizeCache` except that sizes are tied to data id rather than index.
 * Requires an index-to-id map function (passed in externally) to operate.
 */
export default function idCellSizeCache ({
  indexToIdMap,
  uniformColumnWidth = false,
  uniformRowHeight = false
} : IdCellSizeCacheConstructorParams) {
  const cellSizeCache = new DefaultCellSizeCache({
    uniformColumnWidth,
    uniformRowHeight
  })

  return {
    clearAllColumnWidths () {
      cellSizeCache.clearAllColumnWidths()
    },

    clearAllRowHeights () {
      cellSizeCache.clearAllRowHeights()
    },

    clearColumnWidth (index: number) {
      cellSizeCache.clearColumnWidth(
        indexToIdMap(index)
      )
    },

    clearRowHeight (index: number) {
      cellSizeCache.clearRowHeight(
        indexToIdMap(index)
      )
    },

    getColumnWidth (index: number): ?number {
      return cellSizeCache.getColumnWidth(
        indexToIdMap(index)
      )
    },

    getRowHeight (index: number): ?number {
      return cellSizeCache.getRowHeight(
        indexToIdMap(index)
      )
    },

    setColumnWidth (index: number, width: number) {
      cellSizeCache.setColumnWidth(
        indexToIdMap(index),
        width
      )
    },

    setRowHeight (index: number, height: number) {
      cellSizeCache.setRowHeight(
        indexToIdMap(index),
        height
      )
    }
  }
}
