import type { ListItem } from "../../../utils/data";

// <begin>

import { useRef, useState } from "react";
import {
  List,
  type ListImperativeAPI,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  // This example scrolls a container (see "Scrolling an element");
  // with scrollElement="window", the List's methods scroll the window instead
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );

  // A regular ref, to call the List's methods
  const listRef = useRef<ListImperativeAPI>(null);

  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div
      className="flex items-center gap-2 px-3 border-b border-white/10"
      key={key}
      style={style}
    >
      <span className="w-10 text-right text-slate-400">{index}</span>
      {items[index].name}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex flex-wrap gap-2">
        <button
          className="px-2 rounded bg-white/10"
          onClick={() =>
            listRef.current?.scrollToRow({ align: "center", index: 500 })
          }
        >
          Scroll to row 500
        </button>
        <button
          className="px-2 rounded bg-white/10"
          onClick={() =>
            listRef.current?.scrollToRow({ align: "start", index: 0 })
          }
        >
          Scroll to the first row
        </button>
      </div>
      <div className="grow min-h-0 overflow-auto" ref={setScrollElement}>
        <div className="p-3 mb-2 rounded bg-white/10">
          Content above the list
        </div>
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <List
                ref={listRef}
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
    </div>
  );
}

// <end>

export { Example };
