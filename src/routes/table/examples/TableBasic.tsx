import { LIST } from "../../../utils/data";

const list = LIST;

// <begin>

import { Column, Table } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

// Table data is an array of objects, e.g.
// const list = [{ name: "Brian Vaughn", random: "Software engineer" }, ...];

function Example() {
  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            headerHeight={30}
            height={250}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
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

export { Example as TableBasic };
