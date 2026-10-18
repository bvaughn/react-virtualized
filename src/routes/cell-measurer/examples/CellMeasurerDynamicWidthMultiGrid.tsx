import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  MultiGrid,
  type CellRendererParams
} from "react-virtualized";

function Example({ items, width }: { items: ListItem[]; width: number }) {
  // Rows have a fixed height (30px) and columns have a dynamic width;
  // each column is as wide as its widest cell.
  const [cache] = useState(
    () =>
      new CellMeasurerCache({
        defaultHeight: 30,
        defaultWidth: 150,
        fixedHeight: true
      })
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
      <div style={{ ...style, whiteSpace: "nowrap" }}>
        {items[(rowIndex + columnIndex) % items.length].random}
      </div>
    </CellMeasurer>
  );

  return (
    <MultiGrid
      cellRenderer={cellRenderer}
      columnCount={50}
      columnWidth={cache.columnWidth}
      deferredMeasurementCache={cache}
      fixedColumnCount={1}
      height={400}
      rowCount={50}
      rowHeight={30}
      width={width}
    />
  );
}

// <end>

export { Example };
