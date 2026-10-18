import type { ListItem } from "../../../utils/data";

// <begin>

import { useEffect, useRef } from "react";
import {
  List,
  type ListImperativeAPI,
  type RowRendererParams
} from "react-virtualized";

function Example({ items }: { items: ListItem[] }) {
  const listRef = useRef<ListImperativeAPI>(null);

  // List only knows about the rowHeight function, not the data behind it,
  // so tell it to re-measure rows whenever the underlying data changes.
  useEffect(() => {
    listRef.current?.recomputeRowHeights();
  }, [items]);

  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );

  return (
    <List
      height={300}
      ref={listRef}
      rowCount={items.length}
      rowHeight={({ index }) => items[index].size}
      rowRenderer={rowRenderer}
      width={300}
    />
  );
}

// <end>

export { Example as ListRecomputeRowHeights };
