import type { ListItem } from "../../../utils/data";

// <begin>

import { Column, Table } from "react-virtualized";

function Example({ items }: { items: ListItem[] }) {
  return (
    <Table
      headerHeight={30}
      headerStyle={{ color: "#7dd3fc" }}
      height={300}
      rowCount={items.length}
      rowGetter={({ index }) => items[index]}
      rowHeight={30}
      rowStyle={({ index }) =>
        index % 2 === 0 ? { backgroundColor: "rgba(255, 255, 255, 0.05)" } : {}
      }
      style={{ fontSize: "0.875rem" }}
      width={400}
    >
      <Column dataKey="name" label="Name" width={250} />
      <Column
        dataKey="color"
        label="Color"
        style={{ fontFamily: "monospace" }}
        width={100}
      />
    </Table>
  );
}

// <end>

export { Example };
