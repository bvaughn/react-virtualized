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

// <begin>

import { useRef } from "react";
import { Grid, type GridImperativeAPI } from "react-virtualized";

function GridMethodsRef({ width }: { width: number }) {
  // A ref provides access to the Grid's imperative methods
  const gridRef = useRef<GridImperativeAPI>(null);

  const scrollToMiddle = () => {
    gridRef.current?.scrollToCell({
      align: "center",
      columnIndex: 50,
      rowIndex: 500
    });
  };

  const scrollToTop = () => {
    gridRef.current?.scrollToPosition({ scrollLeft: 0, scrollTop: 0 });
  };

  return (
    <>
      <div className="mb-2 flex gap-2">
        <button className={BUTTON_CLASS_NAME} onClick={scrollToMiddle}>
          Center row 500, column 50
        </button>
        <button className={BUTTON_CLASS_NAME} onClick={scrollToTop}>
          Scroll to top
        </button>
      </div>
      <Grid
        cellRenderer={cellRenderer}
        columnCount={100}
        columnWidth={120}
        height={200}
        ref={gridRef}
        rowCount={1000}
        rowHeight={35}
        width={width}
      />
    </>
  );
}

// <end>

export { GridMethodsRef };
