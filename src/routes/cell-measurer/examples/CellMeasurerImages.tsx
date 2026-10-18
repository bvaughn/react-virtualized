// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  type RowRendererParams
} from "react-virtualized";

function Example({
  height,
  imageUrls,
  width
}: {
  height: number;
  imageUrls: string[];
  width: number;
}) {
  // Average row height is assumed to be about 50px;
  // the width of each row is not dynamic.
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true })
  );

  const rowRenderer = ({ index, key, parent, style }: RowRendererParams) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure, registerChild }) => (
        // "style" is required to position the row (within the parent List)
        <div ref={registerChild} style={style}>
          {/* Re-measure the row once the image has loaded */}
          <img onLoad={measure} src={imageUrls[index]} />
        </div>
      )}
    </CellMeasurer>
  );

  return (
    <List
      deferredMeasurementCache={cache}
      height={height}
      rowCount={imageUrls.length}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRenderer}
      width={width}
    />
  );
}

// <end>

export { Example };
