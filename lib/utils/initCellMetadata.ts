export type CellMetadata = {
  offset: number;
  size: number;
};

/**
 * Initializes metadata for an axis and its cells.
 * This data is used to determine which cells are visible given a container size and scroll position.
 *
 * @param cellCount Total number of cells.
 * @param size Either a fixed size or a function that returns the size for a given given an index.
 * @return Object mapping cell index to cell metadata (size, offset)
 */
export function initCellMetadata({
  cellCount,
  size
}: {
  cellCount: number;
  size: number | ((params: { index: number }) => number);
}): CellMetadata[] {
  const sizeGetter = typeof size === "function" ? size : () => size;

  const cellMetadata: CellMetadata[] = [];
  let offset = 0;

  for (let i = 0; i < cellCount; i++) {
    const size = sizeGetter({ index: i });

    if (size == null || isNaN(size)) {
      throw Error(`Invalid size returned for cell ${i} of value ${size}`);
    }

    cellMetadata[i] = {
      size,
      offset
    };

    offset += size;
  }

  return cellMetadata;
}
