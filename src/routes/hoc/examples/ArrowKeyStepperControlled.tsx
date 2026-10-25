function getColumnWidth({ index }: { index: number }) {
  return (1 + (index % 3)) * 60;
}

function getRowHeight({ index }: { index: number }) {
  return (1 + (index % 3)) * 30;
}

// <begin>

import { useState } from "react";
import {
  ArrowKeyStepper,
  Grid,
  type CellRendererParams,
  type ScrollIndices
} from "react-virtualized";

function ArrowKeyStepperControlled({ width }: { width: number }) {
  const [selected, setSelected] = useState<ScrollIndices>({
    scrollToColumn: 0,
    scrollToRow: 0
  });

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style
  }: CellRendererParams) => {
    const isSelected =
      columnIndex === selected.scrollToColumn &&
      rowIndex === selected.scrollToRow;

    return (
      <div
        className={[
          "flex cursor-pointer items-center justify-center border-r border-b border-ink/10 text-sm",
          isSelected ? "bg-sky-500/40 text-ink" : "hover:bg-ink/5"
        ].join(" ")}
        key={key}
        onClick={() =>
          setSelected({ scrollToColumn: columnIndex, scrollToRow: rowIndex })
        }
        style={style}
      >
        {`r:${rowIndex}, c:${columnIndex}`}
      </div>
    );
  };

  return (
    <ArrowKeyStepper
      columnCount={100}
      isControlled
      onScrollToChange={setSelected}
      rowCount={100}
      scrollToColumn={selected.scrollToColumn}
      scrollToRow={selected.scrollToRow}
    >
      {({ onSectionRendered, registerChild }) => (
        <Grid
          cellRenderer={cellRenderer}
          columnCount={100}
          columnWidth={getColumnWidth}
          height={200}
          onSectionRendered={onSectionRendered}
          ref={registerChild}
          rowCount={100}
          rowHeight={getRowHeight}
          width={width}
        />
      )}
    </ArrowKeyStepper>
  );
}

// <end>

export { ArrowKeyStepperControlled };
