import { LIST } from "../../../utils/data";

// <begin>

import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

// Each item specifies its own height (50, 75, or 100 pixels)
const list = LIST;

function rowHeight({ index }: { index: number }) {
  return list[index].size;
}

function rowRenderer({ index, key, style }: RowRendererParams) {
  const item = list[index];

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
      <div className="grow">
        <div className="font-bold">{item.name}</div>
        <div className="text-xs text-ink/60">This is row {index}</div>
        {item.size >= 75 && (
          <div className="text-xs text-ink/60">It is a taller row.</div>
        )}
        {item.size >= 100 && (
          <div className="text-xs text-ink/60">It has a 4th line.</div>
        )}
      </div>
      <div className="text-xs text-slate-500">{item.size}px</div>
    </div>
  );
}

function Example() {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            estimatedRowSize={75}
            height={height}
            rowCount={list.length}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example as ListVariableRowHeights };
