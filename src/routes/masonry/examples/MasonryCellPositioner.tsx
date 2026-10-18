// <begin>

import {
  CellMeasurerCache,
  createMasonryCellPositioner
} from "react-virtualized";

const cache = new CellMeasurerCache({
  defaultHeight: 250,
  defaultWidth: 200,
  fixedWidth: true
});

const cellPositioner = createMasonryCellPositioner({
  // Contains cell measurements (eg item height); required
  cellMeasurerCache: cache,

  // Number of columns to use in layout; required
  columnCount: 3,

  // Width of each column; required
  columnWidth: 200,

  // Empty space between columns (and between cells within a column);
  // defaults to 0
  spacer: 10
});

// <end>

export { cache, cellPositioner };
