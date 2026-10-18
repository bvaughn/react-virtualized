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
        "flex items-center justify-center border-r border-b border-white/10 text-sm",
        rowIndex % 2 === 1 ? "bg-white/5" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {`r:${rowIndex}, c:${columnIndex}`}
    </div>
  );
}

const BUTTON_CLASS_NAME =
  "cursor-pointer whitespace-nowrap rounded border border-white/15 bg-white/5 px-2 py-1 text-sm hover:bg-white/10";
const INPUT_CLASS_NAME =
  "w-24 rounded border border-white/15 bg-slate-900 px-2 py-1 text-sm";
const LABEL_CLASS_NAME = "flex flex-col gap-1 text-sm";

// <begin>

import { useRef, useState, type FormEvent } from "react";
import {
  Grid,
  type Alignment,
  type GridImperativeAPI
} from "react-virtualized";

const COLUMN_COUNT = 1000;
const ROW_COUNT = 1000;

function GridScrollToCell({ width }: { width: number }) {
  const gridRef = useRef<GridImperativeAPI>(null);

  const [align, setAlign] = useState<Alignment>("auto");
  const [columnIndex, setColumnIndex] = useState("50");
  const [rowIndex, setRowIndex] = useState("500");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    gridRef.current?.scrollToCell({
      align,
      columnIndex: parseInt(columnIndex, 10),
      rowIndex: parseInt(rowIndex, 10)
    });
  };

  return (
    <>
      <form className="mb-2 flex flex-wrap items-end gap-2" onSubmit={onSubmit}>
        <label className={LABEL_CLASS_NAME}>
          Row
          <input
            className={INPUT_CLASS_NAME}
            max={ROW_COUNT - 1}
            min={0}
            onChange={(event) => setRowIndex(event.target.value)}
            required
            type="number"
            value={rowIndex}
          />
        </label>
        <label className={LABEL_CLASS_NAME}>
          Column
          <input
            className={INPUT_CLASS_NAME}
            max={COLUMN_COUNT - 1}
            min={0}
            onChange={(event) => setColumnIndex(event.target.value)}
            required
            type="number"
            value={columnIndex}
          />
        </label>
        <label className={LABEL_CLASS_NAME}>
          Alignment
          <select
            className={INPUT_CLASS_NAME}
            onChange={(event) => setAlign(event.target.value as Alignment)}
            value={align}
          >
            <option value="auto">auto</option>
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
          </select>
        </label>
        <button className={BUTTON_CLASS_NAME} type="submit">
          Scroll
        </button>
      </form>
      <Grid
        cellRenderer={cellRenderer}
        columnCount={COLUMN_COUNT}
        columnWidth={100}
        height={250}
        ref={gridRef}
        rowCount={ROW_COUNT}
        rowHeight={40}
        width={width}
      />
    </>
  );
}

// <end>

export { GridScrollToCell };
