import { CellMeasurer, type MasonryProps } from "react-virtualized";
import {
  cache,
  cellPositioner
} from "../../masonry/examples/MasonryCellPositioner";

const cellRenderer: MasonryProps["cellRenderer"] = ({
  index,
  key,
  parent,
  style
}) => (
  <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
    <div style={style}>{index}</div>
  </CellMeasurer>
);

// <begin>

import { useRef } from "react";
import { Masonry, type MasonryImperativeAPI } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ cellCount }: { cellCount: number }) {
  const masonryRef = useRef<MasonryImperativeAPI>(null);

  // When the available width changes, update the number of columns
  const onResize = ({ width }: { width: number }) => {
    const columnWidth = 200;
    const spacer = 10;

    cellPositioner.reset({
      columnCount: Math.max(
        1,
        Math.floor((width + spacer) / (columnWidth + spacer))
      ),
      columnWidth,
      spacer
    });
    masonryRef.current?.recomputeCellPositions();
  };

  return (
    <AutoSizer
      onResize={onResize}
      renderProp={({ width }) =>
        width !== undefined ? (
          <Masonry
            cellCount={cellCount}
            cellMeasurerCache={cache}
            cellPositioner={cellPositioner}
            cellRenderer={cellRenderer}
            ref={masonryRef}
            // The page (rather than the Masonry) scrolls
            scrollElement="window"
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
