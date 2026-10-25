import { LIST } from "../../../utils/data";

const list = LIST;

// <begin>

import { Column, defaultTableHeaderRenderer, Table } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example() {
  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            headerHeight={36}
            height={250}
            rowClassName="border-b border-ink/10"
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
            rowHeight={40}
            width={width}
          >
            <Column
              // Render a custom cell (a colored badge)
              cellRenderer={({ cellData, rowData }) => (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-ink"
                  style={{ backgroundColor: rowData.color }}
                >
                  {cellData}
                </div>
              )}
              // Derive the cell's data from the row (rather than reading rowData[dataKey])
              cellDataGetter={({ rowData }) => rowData.name.charAt(0)}
              dataKey="initial"
              label=""
              width={30}
            />
            <Column dataKey="name" label="Name" width={120} />
            <Column
              dataKey="random"
              flexGrow={1}
              // Decorate the default header (label and sort indicator)
              headerRenderer={(props) => (
                <span className="text-sky-700 dark:text-sky-300">
                  {defaultTableHeaderRenderer(props)}
                </span>
              )}
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

export { Example as TableColumnRenderers };
