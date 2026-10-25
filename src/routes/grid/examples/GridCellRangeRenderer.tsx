import type { CellRendererParams } from "react-virtualized";

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  return (
    <div
      className="flex items-center justify-center border-r border-b border-ink/10 text-xs text-ink/50"
      key={key}
      style={style}
    >
      {`r:${rowIndex}, c:${columnIndex}`}
    </div>
  );
}

// <begin>

import {
  defaultCellRangeRenderer,
  Grid,
  type CellRangeRenderer
} from "react-virtualized";

// Highlight a range of cells (e.g. an event in a calendar or a task in a Gantt chart)
const EVENT = { startColumn: 2, stopColumn: 5, startRow: 3, stopRow: 4 };

const cellRangeRenderer: CellRangeRenderer = (params) => {
  const {
    columnSizeAndPositionManager,
    horizontalOffsetAdjustment,
    rowSizeAndPositionManager,
    verticalOffsetAdjustment
  } = params;

  // Render the cells as usual...
  const children = defaultCellRangeRenderer(params);

  // ...then add the overlay, positioned using the same size and position data as the cells
  const start = {
    column: columnSizeAndPositionManager.getSizeAndPositionOfCell(
      EVENT.startColumn
    ),
    row: rowSizeAndPositionManager.getSizeAndPositionOfCell(EVENT.startRow)
  };
  const stop = {
    column: columnSizeAndPositionManager.getSizeAndPositionOfCell(
      EVENT.stopColumn
    ),
    row: rowSizeAndPositionManager.getSizeAndPositionOfCell(EVENT.stopRow)
  };

  children.push(
    <div
      className="pointer-events-none absolute flex items-center justify-center rounded border border-sky-400 bg-sky-400/20 text-sky-900 dark:text-sky-100"
      key="overlay"
      style={{
        left: start.column.offset + horizontalOffsetAdjustment,
        top: start.row.offset + verticalOffsetAdjustment,
        width: stop.column.offset + stop.column.size - start.column.offset,
        height: stop.row.offset + stop.row.size - start.row.offset
      }}
    >
      My custom overlay
    </div>
  );

  return children;
};

function GridCellRangeRenderer({ width }: { width: number }) {
  return (
    <Grid
      cellRangeRenderer={cellRangeRenderer}
      cellRenderer={cellRenderer}
      columnCount={50}
      columnWidth={100}
      height={250}
      rowCount={100}
      rowHeight={40}
      width={width}
    />
  );
}

// <end>

export { GridCellRangeRenderer };
