import { LIST } from "../../../utils/data";

const list = LIST;

// <begin>

import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function rowRenderer({ index, isScrolling, key, style }: RowRendererParams) {
  if (isScrolling) {
    // Render a light-weight placeholder while the list is being scrolled
    return (
      <div
        className="flex items-center px-4 border-b border-ink/10 italic text-slate-500"
        key={key}
        style={style}
      >
        Scrolling...
      </div>
    );
  }

  return (
    <div
      className="flex items-center px-4 border-b border-ink/10"
      key={key}
      style={style}
    >
      {list[index].name}
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
            rowHeight={35}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example as ListScrollingPlaceholder };
