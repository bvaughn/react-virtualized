import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { useLayoutEffect, useRef, useState } from "react";
import { List, type ListImperativeAPI } from "react-virtualized";

function Example({
  rowCount,
  rowRenderer
}: {
  rowCount: number;
  rowRenderer: RowRenderer;
}) {
  const listRef = useRef<ListImperativeAPI>(null);
  const [showBanner, setShowBanner] = useState(true);

  // The banner above the list changed size, but the List's props didn't
  // (so it doesn't re-render); re-render it to re-measure its position
  useLayoutEffect(() => {
    listRef.current?.forceUpdateGrid();
  }, [showBanner]);

  return (
    <>
      {showBanner && (
        <div onClick={() => setShowBanner(false)}>Click to dismiss</div>
      )}
      <List
        ref={listRef}
        rowCount={rowCount}
        rowHeight={30}
        rowRenderer={rowRenderer}
        scrollElement="window"
        width={600}
      />
    </>
  );
}

// <end>

export { Example };
