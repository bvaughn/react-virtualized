import { LIST } from "../../../utils/data";

const list = LIST;

const buttonClassName =
  "px-2 py-1 rounded border border-ink/15 bg-ink/5 hover:bg-ink/10 cursor-pointer";

// <begin>

import { useRef, useState } from "react";
import {
  InfiniteLoader,
  List,
  type InfiniteLoaderImperativeAPI,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

type RowStatus = "loading" | "loaded";

function Example() {
  const infiniteLoaderRef = useRef<InfiniteLoaderImperativeAPI>(null);

  // InfiniteLoader doesn't track which rows have been requested;
  // the application must do this to avoid loading rows more than once.
  const rowStatusMapRef = useRef(new Map<number, RowStatus>());

  // Used to re-render after row statuses change
  const [, setVersion] = useState(0);

  const isRowLoaded = ({ index }: { index: number }) =>
    // Rows that are still loading are treated as loaded (to avoid requesting them again)
    rowStatusMapRef.current.has(index);

  const loadMoreRows = async ({
    startIndex,
    stopIndex
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    const rowStatusMap = rowStatusMapRef.current;
    for (let index = startIndex; index <= stopIndex; index++) {
      rowStatusMap.set(index, "loading");
    }
    setVersion((version) => version + 1);

    // Simulate a network request
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    if (rowStatusMap === rowStatusMapRef.current) {
      for (let index = startIndex; index <= stopIndex; index++) {
        rowStatusMap.set(index, "loaded");
      }
      setVersion((version) => version + 1);
    }
  };

  const clearData = () => {
    rowStatusMapRef.current = new Map();
    setVersion((version) => version + 1);

    // Reset InfiniteLoader's cache and reload the visible rows
    infiniteLoaderRef.current?.resetLoadMoreRowsCache(true);
  };

  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div
      className="flex items-center px-4 border-b border-ink/10"
      key={key}
      style={style}
    >
      {rowStatusMapRef.current.get(index) === "loaded" ? (
        list[index].name
      ) : (
        <div
          className="h-3 rounded bg-ink/10 animate-pulse"
          style={{ width: list[index].size }}
        />
      )}
    </div>
  );

  const statuses = Array.from(rowStatusMapRef.current.values());
  const loadingCount = statuses.filter((status) => status === "loading").length;
  const loadedCount = statuses.length - loadingCount;

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <button className={buttonClassName} onClick={clearData}>
          Flush cached data
        </button>
        <div className="text-sm text-ink/60">
          {loadingCount} loading, {loadedCount} loaded
        </div>
      </div>
      <div className="grow min-h-0">
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          ref={infiniteLoaderRef}
          rowCount={list.length}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer
              renderProp={({ height, width }) =>
                height !== undefined && width !== undefined ? (
                  <List
                    height={height}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={list.length}
                    rowHeight={30}
                    rowRenderer={rowRenderer}
                    width={width}
                  />
                ) : null
              }
            />
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
}

// <end>

export { Example as InfiniteLoaderList };
