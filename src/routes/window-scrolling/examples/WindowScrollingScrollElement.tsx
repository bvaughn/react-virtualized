import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  // The List needs the scrollable element itself,
  // so store it in state (rather than a ref) to re-render once it's mounted;
  // until then it's null, and the List renders its first rows
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );

  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div
      className="flex items-center px-3 border-b border-white/10"
      key={key}
      style={style}
    >
      {items[index].name}
    </div>
  );

  return (
    <div className="h-full overflow-auto" ref={setScrollElement}>
      <div className="p-3 mb-2 rounded bg-white/10">Content above the list</div>
      <AutoSizer
        renderProp={({ width }) =>
          width !== undefined ? (
            <List
              rowCount={items.length}
              rowHeight={30}
              rowRenderer={rowRenderer}
              scrollElement={scrollElement}
              width={width}
            />
          ) : null
        }
      />
    </div>
  );
}

// <end>

export { Example };
