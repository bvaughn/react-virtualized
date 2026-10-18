import type { ListItem } from "../../../utils/data";

// <begin>

import { useEffect, useRef } from "react";
import {
  InfiniteLoader,
  List,
  type InfiniteLoaderImperativeAPI,
  type RowRendererParams
} from "react-virtualized";

function Example({
  isRowLoaded,
  items,
  loadMoreRows,
  rowCount,
  searchText
}: {
  isRowLoaded: (params: { index: number }) => boolean;
  items: ListItem[];
  loadMoreRows: (params: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<unknown>;
  rowCount: number;
  searchText: string;
}) {
  const infiniteLoaderRef = useRef<InfiniteLoaderImperativeAPI>(null);

  // When the search criteria changes, previously loaded rows are no longer valid.
  // Clear InfiniteLoader's cache and reload the most recently requested batch of rows.
  useEffect(() => {
    infiniteLoaderRef.current?.resetLoadMoreRowsCache(true);
  }, [searchText]);

  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div key={key} style={style}>
      {items[index]?.name ?? "Loading..."}
    </div>
  );

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      ref={infiniteLoaderRef}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          height={200}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={20}
          rowRenderer={rowRenderer}
          width={300}
        />
      )}
    </InfiniteLoader>
  );
}

// <end>

export { Example as InfiniteLoaderResetCache };
