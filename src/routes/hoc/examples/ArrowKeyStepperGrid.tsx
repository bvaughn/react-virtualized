import type { CellRendererParams } from "react-virtualized";

function getColumnWidth({ index }: { index: number }) {
  return (1 + (index % 3)) * 60;
}

function getRowHeight({ index }: { index: number }) {
  return (1 + (index % 3)) * 30;
}

function renderCell({
  columnIndex,
  isSelected,
  key,
  rowIndex,
  style
}: CellRendererParams & { isSelected: boolean }) {
  return (
    <div
      className={[
        "flex items-center justify-center border-r border-b border-ink/10 text-sm",
        isSelected ? "bg-sky-500/40 text-ink" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {`r:${rowIndex}, c:${columnIndex}`}
    </div>
  );
}

// <begin>

import { ArrowKeyStepper, Grid } from "react-virtualized";

function ArrowKeyStepperGrid({
  mode,
  width
}: {
  mode: "cells" | "edges";
  width: number;
}) {
  return (
    <ArrowKeyStepper columnCount={100} mode={mode} rowCount={100}>
      {({ onSectionRendered, registerChild, scrollToColumn, scrollToRow }) => (
        <>
          <div className="mb-2 text-sm whitespace-nowrap">
            Most-recently-stepped column: {scrollToColumn}, row: {scrollToRow}
          </div>
          <Grid
            cellRenderer={(params) =>
              renderCell({
                ...params,
                isSelected:
                  params.columnIndex === scrollToColumn &&
                  params.rowIndex === scrollToRow
              })
            }
            columnCount={100}
            columnWidth={getColumnWidth}
            height={200}
            onSectionRendered={onSectionRendered}
            ref={registerChild}
            rowCount={100}
            rowHeight={getRowHeight}
            width={width}
          />
        </>
      )}
    </ArrowKeyStepper>
  );
}

// <end>

export { ArrowKeyStepperGrid };
