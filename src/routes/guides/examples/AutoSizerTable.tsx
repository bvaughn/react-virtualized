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
            headerClassName="text-white"
            headerHeight={30}
            height={height}
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            rowHeight={30}
            width={width}
          >
            <Column dataKey="name" label="Name" width={150} />
            <Column
              dataKey="random"
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
