import { LIST as list } from "../../../utils/data";

// <begin>

import { Grid, type CellRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

// Each row is an item in the list; each column is one of its fields
const columns = ["index", "name", "color", "size", "random"] as const;

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  const item = list[rowIndex];
  const field = columns[columnIndex];

  return (
    <div
      className="truncate border-b border-ink/10 px-2 leading-[30px]"
      key={key}
      style={style}
    >
      {item[field]}
    </div>
  );
}

function GridBasic() {
  return (
    // AutoSizer measures the available space; Grid requires an explicit width and height
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={columns.length}
            columnWidth={150}
            height={height}
            rowCount={list.length}
            rowHeight={30}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { GridBasic };
