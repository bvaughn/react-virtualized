// <begin>

import {
  Grid,
  InfiniteLoader,
  type GridProps,
  type RenderedSection
} from "react-virtualized";

function Example({
  cellRenderer,
  columnCount,
  isRowLoaded,
  loadMoreRows,
  rowCount
}: {
  cellRenderer: GridProps["cellRenderer"];
  columnCount: number;
  isRowLoaded: (params: { index: number }) => boolean;
  loadMoreRows: (params: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<unknown>;
  rowCount: number;
}) {
  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount * columnCount}
    >
      {({ onRowsRendered, registerChild }) => {
        // Grid cells are mapped to a flat list of "rows" (one per cell)
        const onSectionRendered = ({
          columnStartIndex,
          columnStopIndex,
          rowStartIndex,
          rowStopIndex
        }: RenderedSection) => {
          onRowsRendered({
            startIndex: rowStartIndex * columnCount + columnStartIndex,
            stopIndex: rowStopIndex * columnCount + columnStopIndex
          });
        };

        return (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={columnCount}
            columnWidth={100}
            height={300}
            onSectionRendered={onSectionRendered}
            ref={registerChild}
            rowCount={rowCount}
            rowHeight={30}
            width={500}
          />
        );
      }}
    </InfiniteLoader>
  );
}

// <end>

export { Example as InfiniteLoaderGrid };
