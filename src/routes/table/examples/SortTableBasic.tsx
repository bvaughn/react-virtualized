import { LIST, type ListItem } from "../../../utils/data";

const list = LIST;

// <begin>

import { useMemo, useState } from "react";
import {
  Column,
  SortDirection,
  Table,
  type TableProps
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example() {
  const [sortBy, setSortBy] = useState<TableProps["sortBy"]>("index");
  const [sortDirection, setSortDirection] = useState<
    TableProps["sortDirection"]
  >(SortDirection.ASC);

  // Table does not sort data itself; it only tells you how to sort it
  const sortedList = useMemo(
    () => sortList(list, sortBy, sortDirection),
    [sortBy, sortDirection]
  );

  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            headerHeight={36}
            height={250}
            rowClassName="border-b border-ink/10"
            rowCount={sortedList.length}
            rowGetter={({ index }) => sortedList[index]}
            rowHeight={30}
            sort={({ sortBy, sortDirection }) => {
              setSortBy(sortBy);
              setSortDirection(sortDirection);
            }}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={width}
          >
            <Column dataKey="index" label="Index" width={80} />
            <Column
              dataKey="name"
              // Sort descending when this column is first clicked
              defaultSortDirection={SortDirection.DESC}
              label="Name"
              width={120}
            />
            <Column
              dataKey="random"
              // This column can't be sorted
              disableSort
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

function sortList(
  list: ListItem[],
  sortBy: TableProps["sortBy"],
  sortDirection: TableProps["sortDirection"]
) {
  if (!sortBy) {
    return list;
  }

  const key = sortBy as keyof ListItem;
  const sorted = [...list].sort((a, b) =>
    a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
  );

  return sortDirection === SortDirection.DESC ? sorted.reverse() : sorted;
}

// <end>

export { Example as SortTableBasic };
