import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  type MasonryProps
} from "react-virtualized";
import {
  getMasonryCellHeight,
  MASONRY_CELL_COUNT,
  MASONRY_COLUMN_COUNT,
  MASONRY_COLUMN_WIDTH,
  MASONRY_SPACER
} from "../../../tests";
import { Header } from "../components/Header";
import { useRouteParams } from "../utils/searchParams";

type MasonryCellRendererParams = Parameters<MasonryProps["cellRenderer"]>[0];

function setMasonryRef(masonry: Window["masonry"]) {
  window.masonry = masonry;
}

// A Masonry below a header, scrolled by the window
export function MasonryRoute() {
  const { headerHeight } = useRouteParams();

  const [cache] = useState(
    () =>
      new CellMeasurerCache({
        defaultHeight: 150,
        defaultWidth: MASONRY_COLUMN_WIDTH,
        fixedWidth: true
      })
  );

  const [cellPositioner] = useState(() =>
    createMasonryCellPositioner({
      cellMeasurerCache: cache,
      columnCount: MASONRY_COLUMN_COUNT,
      columnWidth: MASONRY_COLUMN_WIDTH,
      spacer: MASONRY_SPACER
    })
  );

  const [cellRenderer] = useState(
    () =>
      function cellRenderer({
        index,
        key,
        parent,
        style
      }: MasonryCellRendererParams) {
        return (
          <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
            <div
              data-cell-index={index}
              style={{ ...style, width: MASONRY_COLUMN_WIDTH }}
            >
              {/* The measured cell's own height is reset while CellMeasurer measures it; so the content determines its height */}
              <div
                style={{
                  backgroundColor: "lightgray",
                  height: getMasonryCellHeight(index)
                }}
              >
                Cell {index}
              </div>
            </div>
          </CellMeasurer>
        );
      }
  );

  return (
    <>
      <Header initialHeight={headerHeight} />
      <Masonry
        cellCount={MASONRY_CELL_COUNT}
        cellMeasurerCache={cache}
        cellPositioner={cellPositioner}
        cellRenderer={cellRenderer}
        id="masonry"
        ref={setMasonryRef}
        scrollElement="window"
        width={
          MASONRY_COLUMN_COUNT * (MASONRY_COLUMN_WIDTH + MASONRY_SPACER) -
          MASONRY_SPACER
        }
      />
    </>
  );
}
