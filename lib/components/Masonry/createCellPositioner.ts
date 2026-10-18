import type {
  CellPositioner,
  CellPositionerResetParams,
  CreateCellPositionerParams,
  Position
} from "./types";

/**
 * Creates a simple `Masonry` cell positioner that always inserts a cell into the shortest column.
 */
export function createCellPositioner({
  cellMeasurerCache,
  columnCount,
  columnWidth,
  spacer = 0
}: CreateCellPositionerParams): CellPositioner {
  let columnHeights: number[];

  initOrResetDerivedValues();

  function cellPositioner(index: number): Position {
    // Find the shortest column and use it.
    let columnIndex = 0;
    for (let i = 1; i < columnHeights.length; i++) {
      if (columnHeights[i] < columnHeights[columnIndex]) {
        columnIndex = i;
      }
    }

    const left = columnIndex * (columnWidth + spacer);
    const top = columnHeights[columnIndex] || 0;

    columnHeights[columnIndex] =
      top + cellMeasurerCache.getHeight(index) + spacer;

    return {
      left,
      top
    };
  }

  function initOrResetDerivedValues(): void {
    // Track the height of each column.
    // Layout algorithm below always inserts into the shortest column.
    columnHeights = [];
    for (let i = 0; i < columnCount; i++) {
      columnHeights[i] = 0;
    }
  }

  function reset(params: CellPositionerResetParams): void {
    columnCount = params.columnCount;
    columnWidth = params.columnWidth;
    spacer = params.spacer ?? 0;

    initOrResetDerivedValues();
  }

  cellPositioner.reset = reset;

  return cellPositioner;
}
