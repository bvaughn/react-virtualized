import type { ListItem } from "../../../utils/data";

// <begin>

import { Column, Table } from "react-virtualized";

function Example({ items, width }: { items: ListItem[]; width: number }) {
  return (
    <Table
      headerHeight={30}
      rowCount={items.length}
      rowGetter={({ index }) => items[index]}
      rowHeight={30}
      // The header scrolls along with the page (it isn't sticky)
      scrollElement="window"
      width={width}
    >
      <Column dataKey="name" label="Name" width={200} />
      <Column dataKey="color" label="Color" width={100} flexGrow={1} />
    </Table>
  );
}

// <end>

export { Example };
