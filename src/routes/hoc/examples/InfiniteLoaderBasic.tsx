// <begin>

import {
  InfiniteLoader,
  List,
  type RowRendererParams
} from "react-virtualized";

// This example assumes you have a way to know/load this information
const remoteRowCount = 1000;

const list: string[] = [];

function isRowLoaded({ index }: { index: number }) {
  return !!list[index];
}

async function loadMoreRows({
  startIndex,
  stopIndex
}: {
  startIndex: number;
  stopIndex: number;
}) {
  const response = await fetch(
    `path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`
  );
  const names: string[] = await response.json();

  // Store response data in list...
  names.forEach((name, offset) => {
    list[startIndex + offset] = name;
  });
}

function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div key={key} style={style}>
      {list[index] ?? "Loading..."}
    </div>
  );
}

function Example() {
  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={remoteRowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          height={200}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={remoteRowCount}
          rowHeight={20}
          rowRenderer={rowRenderer}
          width={300}
        />
      )}
    </InfiniteLoader>
  );
}

// <end>

export { Example as InfiniteLoaderBasic };
