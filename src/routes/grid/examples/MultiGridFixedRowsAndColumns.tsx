// <begin>

import { MultiGrid, type CellRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  return (
    <div
      className="flex items-center justify-center border-r border-b border-ink/10"
      key={key}
      style={style}
    >
      {columnIndex}, {rowIndex}
    </div>
  );
}

function Example({
  fixedColumnCount,
  fixedRowCount
}: {
  fixedColumnCount: number;
  fixedRowCount: number;
}) {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <MultiGrid
            cellRenderer={cellRenderer}
            classNameBottomLeftGrid="bg-ink/5 border-r-2 border-ink/20"
            classNameTopLeftGrid="bg-ink/10 font-bold border-r-2 border-b-2 border-ink/20"
            classNameTopRightGrid="bg-ink/10 font-bold border-b-2 border-ink/20"
            columnCount={50}
            columnWidth={75}
            enableFixedColumnScroll
            enableFixedRowScroll
            fixedColumnCount={fixedColumnCount}
            fixedRowCount={fixedRowCount}
            height={height}
            hideBottomLeftGridScrollbar
            hideTopRightGridScrollbar
            rowCount={100}
            rowHeight={40}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
