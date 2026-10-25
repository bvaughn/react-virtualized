import { type ListItem } from "../../../utils/data";

// <begin>

import { useLayoutEffect, useRef, useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  type MasonryImperativeAPI
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({
  columnWidth,
  gutterSize,
  items
}: {
  columnWidth: number;
  gutterSize: number;
  items: ListItem[];
}) {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <MasonryLayout
            columnWidth={columnWidth}
            gutterSize={gutterSize}
            height={height}
            items={items}
            // Changing the column width changes how text wraps (and so the height of each cell);
            // the simplest way to handle that is to start over with a fresh cache and positioner
            key={columnWidth}
            width={width}
          />
        ) : null
      }
    />
  );
}

function MasonryLayout({
  columnWidth,
  gutterSize,
  height,
  items,
  width
}: {
  columnWidth: number;
  gutterSize: number;
  height: number;
  items: ListItem[];
  width: number;
}) {
  const columnCount = Math.max(
    1,
    Math.floor((width + gutterSize) / (columnWidth + gutterSize))
  );

  // Default sizes help Masonry decide how many cells to batch-measure
  const [cache] = useState(
    () =>
      new CellMeasurerCache({
        defaultHeight: 250,
        defaultWidth: columnWidth,
        fixedWidth: true
      })
  );

  // The built-in positioner places each cell in the shortest column
  const [cellPositioner] = useState(() =>
    createMasonryCellPositioner({
      cellMeasurerCache: cache,
      columnCount,
      columnWidth,
      spacer: gutterSize
    })
  );

  const masonryRef = useRef<MasonryImperativeAPI>(null);

  // When the number of columns (or the space between them) changes,
  // update the positioner and re-position the (already measured) cells
  useLayoutEffect(() => {
    cellPositioner.reset({ columnCount, columnWidth, spacer: gutterSize });
    masonryRef.current?.recomputeCellPositions();
  }, [cellPositioner, columnCount, columnWidth, gutterSize]);

  return (
    <Masonry
      cellCount={items.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={({ index, key, parent, style }) => {
        const item = items[index];

        return (
          <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
            <div
              className="flex flex-col gap-2 rounded-lg bg-ink/5 p-2 text-sm"
              style={{ ...style, width: columnWidth }}
            >
              <div
                className="flex items-center justify-center rounded-md text-xl text-white"
                style={{ backgroundColor: item.color, height: item.size * 2 }}
              >
                {index}
              </div>
              {item.random}
            </div>
          </CellMeasurer>
        );
      }}
      height={height}
      ref={masonryRef}
      width={width}
    />
  );
}

// <end>

export { Example as MasonryExample };
