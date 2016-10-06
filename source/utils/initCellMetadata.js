/**
 * Initializes metadata for an axis and its cells.
 * This data is used to determine which cells are visible given a container size and scroll position.
 *
 * @flow
 * @param cellCount Total number of cells.
 * @param size Either a fixed size or a function that returns the size for a given given an index.
 * @return Object mapping cell index to cell metadata (size, offset)
 */

type SizeGetter = (p: {index: number}) => number;

export default function initCellMetadata (params: {
  cellCount: number;
  size: SizeGetter | number;
}) {
  const {size, cellCount} = params;
  const sizeGetter = typeof size === 'number'
    ? ({ index }) => size
    : size;

  const cellMetadata = []
  let offset = 0

  for (var i = 0; i < cellCount; i++) {
    let size = sizeGetter({ index: i })

    if (size == null || isNaN(size)) {
      throw Error(`Invalid size returned for cell ${i} of value ${size}`)
    }

    cellMetadata[i] = {
      size,
      offset
    }

    offset += size
  }

  return cellMetadata
}
