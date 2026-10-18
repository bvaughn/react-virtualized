import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  type CellRendererParams
} from "react-virtualized";

function Example({ items, width }: { items: ListItem[]; width: number }) {
  // Columns have a fixed width (150px) and rows have a dynamic height;
  // each row is as tall as its tallest cell.
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultWidth: 150, fixedWidth: true })
  );

  const cellRenderer = ({
    columnIndex,
    key,
    parent,
    rowIndex,
    style
  }: CellRendererParams) => (
    <CellMeasurer
      cache={cache}
      columnIndex={columnIndex}
      key={key}
      parent={parent}
      rowIndex={rowIndex}
    >
      <div style={{ ...style, width: 150 }}>
        {items[(rowIndex + columnIndex) % items.length].randomLong}
      </div>
    </CellMeasurer>
  );

  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={50}
      columnWidth={150}
      deferredMeasurementCache={cache}
      height={400}
      rowCount={1000}
      rowHeight={cache.rowHeight}
      width={width}
    />
  );
}

// <end>

export { Example };
