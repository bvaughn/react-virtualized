import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  type CellRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  // Cells have a fixed height and a dynamic width.
  // Unmeasured columns are assumed to be 100px wide.
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultWidth: 100, fixedHeight: true })
  );

  const cellRenderer = ({
    columnIndex,
    key,
    parent,
    rowIndex,
    style
  }: CellRendererParams) => {
    const item = items[(rowIndex + columnIndex) % items.length];

    let content;
    switch (columnIndex % 3) {
      case 0:
        content = item.color;
        break;
      case 1:
        content = item.name;
        break;
      default:
        content = item.random;
        break;
    }

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className="flex items-center px-3 whitespace-nowrap border-r border-b border-ink/10"
          style={{ ...style, height: 35 }}
        >
          {content}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={1000}
            columnWidth={cache.columnWidth}
            deferredMeasurementCache={cache}
            height={height}
            rowCount={50}
            rowHeight={35}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
