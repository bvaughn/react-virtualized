import { LIST as list } from "../../../utils/data";

// <begin>

import { Grid, type CellRendererParams } from "react-virtualized";

// Column widths are returned by a function rather than being a fixed number
function getColumnWidth({ index }: { index: number }) {
  switch (index) {
    case 0:
      return 50;
    case 1:
      return 100;
    case 2:
      return 300;
    default:
      return 80;
  }
}

// Row heights can be returned by a function too
function getRowHeight({ index }: { index: number }) {
  return list[index % list.length].size;
}

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  const item = list[rowIndex % list.length];

  if (columnIndex === 0) {
    return (
      <div
        className="flex items-center justify-center border-b border-ink/10 text-xl text-ink"
        key={key}
        // Don't modify the style object; Grid caches and re-uses it
        style={{ ...style, backgroundColor: item.color }}
      >
        {item.name.charAt(0)}
      </div>
    );
  }

  let content;
  switch (columnIndex) {
    case 1:
      content = item.name;
      break;
    case 2:
      content = item.random;
      break;
    default:
      content = `r:${rowIndex}, c:${columnIndex}`;
      break;
  }

  return (
    <div
      className={[
        "flex items-center truncate border-r border-b border-ink/10 px-2",
        rowIndex % 2 === 1 ? "bg-ink/5" : "",
        columnIndex > 2 ? "justify-center" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {content}
    </div>
  );
}

function GridVariableSizes({
  useDynamicRowHeight,
  width
}: {
  useDynamicRowHeight: boolean;
  width: number;
}) {
  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={1000}
      columnWidth={getColumnWidth}
      estimatedColumnSize={80}
      height={300}
      noContentRenderer={() => <div>No cells</div>}
      estimatedRowSize={75}
      rowCount={1000}
      rowHeight={useDynamicRowHeight ? getRowHeight : 40}
      width={width}
    />
  );
}

// <end>

export { GridVariableSizes };
