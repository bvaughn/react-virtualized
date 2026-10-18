import type { ListItem } from "../../../utils/data";

// <begin>

import { useState } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  Column,
  Table
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  // Rows have a dynamic height (but are never shorter than 25px)
  const [cache] = useState(
    () => new CellMeasurerCache({ fixedWidth: true, minHeight: 25 })
  );

  return (
    <AutoSizer
      onResize={() => cache.clearAll()}
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <Table
            deferredMeasurementCache={cache}
            headerClassName="text-white"
            headerHeight={30}
            height={height}
            rowClassName="border-b border-white/10"
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            rowHeight={cache.rowHeight}
            width={width}
          >
            <Column dataKey="name" label="Name" width={125} />
            <Column dataKey="color" label="Color" width={75} />
            {/* Only this column is measured; the others are a single line */}
            <Column
              cellRenderer={({ parent, rowData, rowIndex }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  rowIndex={rowIndex}
                >
                  <div className="py-1 whitespace-normal">
                    {rowData.randomLong}
                  </div>
                </CellMeasurer>
              )}
              dataKey="randomLong"
              flexGrow={1}
              label="Description"
              width={200}
            />
          </Table>
        ) : null
      }
    />
  );
}

// <end>

export { Example };
