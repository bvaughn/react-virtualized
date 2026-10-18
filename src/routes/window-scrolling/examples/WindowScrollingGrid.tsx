import type { GridProps } from "react-virtualized";

type CellRenderer = GridProps["cellRenderer"];

// <begin>

import { Grid } from "react-virtualized";

function Example({
  cellRenderer,
  width
}: {
  cellRenderer: CellRenderer;
  width: number;
}) {
  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={20}
      columnWidth={150}
      rowCount={1000}
      rowHeight={30}
      // The window scrolls the Grid vertically;
      // columns wider than the width still scroll horizontally within the Grid
      scrollElement="window"
      width={width}
    />
  );
}

// <end>

export { Example };
