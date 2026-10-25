import type { ListItem } from "../../../utils/data";

// <begin>

import {
  InfiniteLoader,
  List,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function InfiniteLoadingList({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage
}: {
  /** Are there more items to load? (This information comes from the most recent API request.) */
  hasNextPage: boolean;
  /** Are we currently loading a page of items? (This may be an in-flight flag in your store, for example.) */
  isNextPageLoading: boolean;
  /** List of items loaded so far */
  items: ListItem[];
  /** Callback function responsible for loading the next page of items */
  loadNextPage: () => Promise<void>;
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }: { index: number }) =>
    !hasNextPage || index < items.length;

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div
      className="flex items-center px-4 border-b border-ink/10"
      key={key}
      style={style}
    >
      {isRowLoaded({ index }) ? (
        items[index].name
      ) : (
        <span className="italic text-slate-500">Loading...</span>
      )}
    </div>
  );

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

export { InfiniteLoadingList };
