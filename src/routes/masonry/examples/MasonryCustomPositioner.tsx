import { CellMeasurerCache } from "react-virtualized";

const cache = new CellMeasurerCache({
  defaultHeight: 250,
  defaultWidth: 200,
  fixedWidth: true
});

// <begin>

// Places cells in columns round-robin (left to right, in index order)
// rather than always choosing the shortest column
function createRoundRobinPositioner(columnCount: number, columnWidth: number) {
  let columnHeights = new Array<number>(columnCount).fill(0);

  function cellPositioner(index: number) {
    const column = index % columnCount;
    const left = column * columnWidth;
    const top = columnHeights[column];

    // Sizes have already been measured (and cached) by the time a cell is positioned
    columnHeights[column] = top + cache.getHeight(index);

    return { left, top };
  }

  // recomputeCellPositions() asks for every cell's position again (starting at index 0)
  // so the positioner's internal state must be reset before calling it
  cellPositioner.reset = () => {
    columnHeights = new Array<number>(columnCount).fill(0);
  };

  return cellPositioner;
}

// <end>

export { createRoundRobinPositioner };
