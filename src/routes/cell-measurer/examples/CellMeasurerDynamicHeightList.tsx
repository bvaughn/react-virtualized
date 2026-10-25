import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  // Rows have a fixed width (the width of the list) and a dynamic height.
  // Unmeasured rows are assumed to be 50px tall.
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true })
  );

  const rowRenderer = ({ index, key, parent, style }: RowRendererParams) => {
    const item = items[index];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div
          className="flex flex-col gap-1 px-3 py-2 border-b border-ink/10"
          style={style}
        >
          <div className="font-bold text-ink">{item.name}</div>
          <div>{item.randomLong}</div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    // Text wraps differently at different widths,
    // so measurements must be cleared when the list resizes
    <AutoSizer
      onResize={() => cache.clearAll()}
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            deferredMeasurementCache={cache}
            height={height}
            rowCount={items.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
