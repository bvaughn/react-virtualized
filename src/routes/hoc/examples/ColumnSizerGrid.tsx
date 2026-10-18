import type { CellRendererParams } from "react-virtualized";

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  return (
    <div
      className={[
        "flex items-center justify-center truncate border-r border-b border-white/10 text-sm",
        columnIndex === 0 ? "border-l" : "",
        rowIndex === 0 ? "border-t" : "",
        rowIndex % 2 === 1 ? "bg-white/5" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {`R:${rowIndex}, C:${columnIndex}`}
    </div>
  );
}

// <begin>

import { ColumnSizer, Grid } from "react-virtualized";

function ColumnSizerGrid({
  columnCount,
  columnMaxWidth,
  columnMinWidth,
  width
}: {
  columnCount: number;
  columnMaxWidth?: number;
  columnMinWidth?: number;
  width: number;
}) {
  return (
    <ColumnSizer
      columnCount={columnCount}
      columnMaxWidth={columnMaxWidth}
      columnMinWidth={columnMinWidth}
      width={width}
    >
      {({ adjustedWidth, columnWidth, registerChild }) => (
        <Grid
          cellRenderer={cellRenderer}
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={160}
          ref={registerChild}
          rowCount={4}
          rowHeight={40}
          // Shrink to fit if the columns don't fill the available width
          width={adjustedWidth}
        />
      )}
    </ColumnSizer>
  );
}

// <end>

export { ColumnSizerGrid };
