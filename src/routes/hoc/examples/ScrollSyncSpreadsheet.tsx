import type { CellRendererParams } from "react-virtualized";

function headerCellRenderer({ columnIndex, key, style }: CellRendererParams) {
  return (
    <div
      className="flex items-center justify-center font-bold"
      key={key}
      style={style}
    >
      {`C${columnIndex}`}
    </div>
  );
}

function leftCellRenderer({ key, rowIndex, style }: CellRendererParams) {
  return (
    <div
      className="flex items-center justify-center font-bold"
      key={key}
      style={style}
    >
      {`R${rowIndex}`}
    </div>
  );
}

function bodyCellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  return (
    <div
      className={[
        "flex items-center justify-center text-sm",
        (rowIndex + columnIndex) % 2 === 1 ? "bg-black/15" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {`R${rowIndex}, C${columnIndex}`}
    </div>
  );
}

// <begin>

import scrollbarSize from "dom-helpers/scrollbarSize";
import { Grid, ScrollSync } from "react-virtualized";

const COLUMN_COUNT = 50;
const COLUMN_WIDTH = 75;
const HEIGHT = 300;
const ROW_COUNT = 100;
const ROW_HEIGHT = 40;

function ScrollSyncSpreadsheet({ width }: { width: number }) {
  const bodyWidth = width - COLUMN_WIDTH;

  return (
    <ScrollSync>
      {({
        clientHeight,
        clientWidth,
        onScroll,
        registerChild,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth
      }) => {
        // Scroll values can also be used to drive other UI, such as these background colors
        const x = scrollLeft / Math.max(1, scrollWidth - clientWidth);
        const y = scrollTop / Math.max(1, scrollHeight - clientHeight);

        return (
          <div className="flex">
            <div style={{ width: COLUMN_WIDTH }}>
              {/* Fixed top-left cell */}
              <div
                className="flex items-center justify-center border-r border-b border-white/10"
                style={{ height: ROW_HEIGHT }}
              />
              {/* Fixed first column; ScrollSync scrolls it vertically with the body */}
              <Grid
                cellRenderer={leftCellRenderer}
                className="overflow-hidden! shadow-[inset_-1px_0_0_rgb(255_255_255/0.1)]"
                columnCount={1}
                columnWidth={COLUMN_WIDTH}
                height={HEIGHT - scrollbarSize()}
                ref={registerChild("left")}
                rowCount={ROW_COUNT}
                rowHeight={ROW_HEIGHT}
                style={{ backgroundColor: `rgb(188 57 89 / ${0.2 + y * 0.6})` }}
                tabIndex={null}
                width={COLUMN_WIDTH}
              />
            </div>
            <div>
              {/* Fixed header row; ScrollSync scrolls it horizontally with the body */}
              <Grid
                cellRenderer={headerCellRenderer}
                className="overflow-hidden! shadow-[inset_0_-1px_0_rgb(255_255_255/0.1)]"
                columnCount={COLUMN_COUNT}
                columnWidth={COLUMN_WIDTH}
                height={ROW_HEIGHT}
                ref={registerChild("header")}
                rowCount={1}
                rowHeight={ROW_HEIGHT}
                style={{ backgroundColor: `rgb(71 16 97 / ${0.2 + x * 0.6})` }}
                tabIndex={null}
                width={bodyWidth - scrollbarSize()}
              />
              {/* Scrollable body; its onScroll drives the other two grids */}
              <Grid
                cellRenderer={bodyCellRenderer}
                columnCount={COLUMN_COUNT}
                columnWidth={COLUMN_WIDTH}
                height={HEIGHT}
                onScroll={onScroll}
                ref={registerChild("body")}
                rowCount={ROW_COUNT}
                rowHeight={ROW_HEIGHT}
                width={bodyWidth}
              />
            </div>
          </div>
        );
      }}
    </ScrollSync>
  );
}

// <end>

export { ScrollSyncSpreadsheet };
