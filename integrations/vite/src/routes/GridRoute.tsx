import { useState } from "react";
import { Grid, type CellRendererParams } from "react-virtualized";
import {
  COLUMN_COUNT,
  COLUMN_WIDTH,
  ROW_COUNT,
  ROW_HEIGHT,
  WIDTH
} from "../../../tests";
import { Header } from "../components/Header";
import { ScrollContainer } from "../components/ScrollContainer";
import { useRouteParams } from "../utils/searchParams";

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  return (
    <div
      data-column-index={columnIndex}
      data-row-index={rowIndex}
      key={key}
      style={style}
    >
      {rowIndex}:{columnIndex}
    </div>
  );
}

function setGridRef(grid: Window["grid"]) {
  window.grid = grid;
}

// A Grid (wider than its width, so it scrolls horizontally itself) below a header,
// scrolled vertically by a scrollable container (or the window)
export function GridRoute() {
  const { headerHeight, overscanRowCount, scrollElementType } =
    useRouteParams();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const content = (
    <>
      <Header initialHeight={headerHeight} />
      <Grid
        cellRenderer={cellRenderer}
        columnCount={COLUMN_COUNT}
        columnWidth={COLUMN_WIDTH}
        id="grid"
        overscanRowCount={overscanRowCount}
        ref={setGridRef}
        rowCount={ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        scrollElement={scrollElementType === "container" ? container : "window"}
        width={WIDTH}
      />
    </>
  );

  return scrollElementType === "container" ? (
    <ScrollContainer ref={setContainer}>{content}</ScrollContainer>
  ) : (
    content
  );
}
