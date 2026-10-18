// <begin>

import { CellMeasurerCache } from "react-virtualized";

// Normally every cell is measured individually, which can be slow.
// If all rows are known to have the same (but unknown) height,
// a keyMapper that returns a constant tells CellMeasurer that
// every measurement after the first one will hit the cache.
const cache = new CellMeasurerCache({
  defaultHeight: 30,
  fixedWidth: true,
  keyMapper: () => 1
});

// <end>

export { cache };
