// <begin>

import { useRef, useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  type ListImperativeAPI,
  type RowRendererParams
} from "react-virtualized";

function Example({ messages }: { messages: string[] }) {
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true })
  );
  const listRef = useRef<ListImperativeAPI>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

    // The row's content (and so its height) is about to change:
    // discard its cached measurement and tell the List to re-layout
    cache.clear(index, 0);
    listRef.current?.recomputeRowHeights(index);
  };

  const rowRenderer = ({ index, key, parent, style }: RowRendererParams) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      <div onClick={() => toggle(index)} style={style}>
        {expanded.has(index) ? messages[index] : messages[index].slice(0, 25)}
      </div>
    </CellMeasurer>
  );

  return (
    <List
      deferredMeasurementCache={cache}
      height={300}
      ref={listRef}
      rowCount={messages.length}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRenderer}
      width={300}
    />
  );
}

// <end>

export { Example };
