import type { ListItem } from "../../../utils/data";

// <begin>

import { Column, Table } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <Table
            className="text-sm"
            gridClassName="outline-none"
            headerClassName="text-sky-700 dark:text-sky-300"
            headerHeight={30}
            height={height}
            // The header row is passed an index of -1
            rowClassName={({ index }) =>
              index < 0
                ? "border-b-2 border-ink/20"
                : index % 2
                  ? "hover:bg-ink/10"
                  : "bg-ink/5 hover:bg-ink/10"
            }
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            rowHeight={30}
            width={width}
          >
            <Column dataKey="index" label="Index" width={60} />
            <Column
              className="font-bold"
              dataKey="name"
              flexGrow={1}
              label="Name"
              width={150}
            />
            <Column
              cellRenderer={({ cellData }) => (
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: cellData }}
                />
              )}
              dataKey="color"
              label="Color"
              style={{ display: "flex", alignItems: "center" }}
              width={60}
            />
          </Table>
        ) : null
      }
    />
  );
}

// <end>

export { Example };
