import { LIST } from "../../../utils/data";

const list = LIST;

// <begin>

import { useState } from "react";
import {
  Column,
  defaultTableRowRenderer,
  Table,
  type TableProps
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Decorate the default row renderer rather than re-implementing it;
  // it takes care of event handlers and ARIA attributes.
  const rowRenderer: TableProps["rowRenderer"] = (props) =>
    defaultTableRowRenderer({
      ...props,
      className:
        props.index === selectedIndex
          ? `${props.className} bg-sky-500/30`
          : props.className
    });

  // The header row can be customized in the same way
  const headerRowRenderer: TableProps["headerRowRenderer"] = ({
    className,
    columns,
    style
  }) => (
    <div
      className={`${className} bg-sky-950 text-sky-200`}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );

  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            headerHeight={36}
            headerRowRenderer={headerRowRenderer}
            height={250}
            onRowClick={({ index }) => setSelectedIndex(index)}
            rowClassName="border-b border-white/10 cursor-pointer"
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
            rowHeight={36}
            rowRenderer={rowRenderer}
            width={width}
          >
            <Column dataKey="index" label="Index" width={60} />
            <Column dataKey="name" label="Name" width={120} />
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

export { Example as TableRowRenderer };
