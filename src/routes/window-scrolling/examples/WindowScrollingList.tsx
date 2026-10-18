import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { useRef } from "react";
import { List, type ListImperativeAPI } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({
  rowCount,
  rowRenderer
}: {
  rowCount: number;
  rowRenderer: RowRenderer;
}) {
  // A regular ref; the List's scroll methods scroll the window
  const listRef = useRef<ListImperativeAPI>(null);

  return (
    // Only the width is measured; the height is that of the window
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <List
            ref={listRef}
            rowCount={rowCount}
            rowHeight={30}
            rowRenderer={rowRenderer}
            scrollElement="window"
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
