import type { ListItem } from "../../../utils/data";

// <begin>

import { Grid, type CellRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

const columns = ["name", "color", "random"] as const;

function Example({ items }: { items: ListItem[] }) {
  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style
  }: CellRendererParams) => (
    <div className="truncate px-2 leading-[30px]" key={key} style={style}>
      {items[rowIndex][columns[columnIndex]]}
    </div>
  );

  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        // Width and height are undefined until AutoSizer has measured its parent
        height !== undefined && width !== undefined ? (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={columns.length}
            columnWidth={200}
            height={height}
            rowCount={items.length}
            rowHeight={30}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
