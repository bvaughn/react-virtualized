import { LIST, type ListItem } from "../../../utils/data";

type Item = ListItem & { createdAt: Date };

let itemCount = 0;

function createItem(): Item {
  const item = LIST[itemCount++ % LIST.length];
  return { ...item, createdAt: new Date() };
}

// <begin>

import { useEffect, useRef, useState } from "react";
import {
  List,
  type ListImperativeAPI,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

const MAX_ITEMS = 100;

function ReverseList({ paused }: { paused: boolean }) {
  const listRef = useRef<ListImperativeAPI>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = setInterval(() => {
      // Add new items to the front of the list (instead of the end)
      setItems((prevItems) => [createItem(), ...prevItems].slice(0, MAX_ITEMS));
    }, 500);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    // If you want to scroll to the top when items are added, you can do it like this
    listRef.current?.scrollToRow({ index: 0 });
  }, [items]);

  const rowRenderer = ({ index, key, style }: RowRendererParams) => {
    const item = items[index];

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
        <div className="min-w-0">
          <div className="font-bold">{item.name}</div>
          <div className="text-xs text-ink/60 truncate">
            {item.createdAt.toLocaleTimeString()} &middot; {item.random}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            height={height}
            ref={listRef}
            rowCount={items.length}
            rowHeight={60}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { ReverseList };
