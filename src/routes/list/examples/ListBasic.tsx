import { LIST } from "../../../utils/data";

// <begin>

import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

// List data as an array of objects, e.g.
// [{ color: "#f44336", name: "Brian Vaughn" }, ...]
const list = LIST;

function rowRenderer({ index, key, style }: RowRendererParams) {
  const item = list[index];

  // Rows must apply the "style" parameter (it positions and sizes the row)
  // and the "key" parameter (it identifies the row to React).
  return (
    <div
      className="flex items-center gap-4 px-4 overflow-hidden border-b border-ink/10"
      key={key}
      style={style}
    >
      <div
        className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-ink"
        style={{ backgroundColor: item.color }}
      >
        {item.name.charAt(0)}
      </div>
      <div>
        <div className="font-bold">{item.name}</div>
        <div className="text-xs text-ink/60">This is row {index}</div>
      </div>
    </div>
  );
}

function Example() {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            height={height}
            rowCount={list.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example as ListBasic };
