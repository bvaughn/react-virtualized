import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { InfiniteLoader, List } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({
  isRowLoaded,
  loadMoreRows,
  rowCount,
  rowRenderer
}: {
  isRowLoaded: (params: { index: number }) => boolean;
  loadMoreRows: (params: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<unknown>;
  rowCount: number;
  rowRenderer: RowRenderer;
}) {
  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer
          renderProp={({ height, width }) =>
            height !== undefined && width !== undefined ? (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={rowCount}
                rowHeight={30}
                rowRenderer={rowRenderer}
                width={width}
              />
            ) : null
          }
        />
      )}
    </InfiniteLoader>
  );
}

// <end>

export { Example };
