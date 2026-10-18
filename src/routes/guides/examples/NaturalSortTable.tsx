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
  // Start out unsorted, in the list's "natural" order
  const [sortBy, setSortBy] = useState<TableProps["sortBy"]>(undefined);
  const [sortDirection, setSortDirection] =
    useState<TableProps["sortDirection"]>(undefined);

  const sortedList = useMemo(() => {
    if (!sortBy) {
      return list; // Natural order
    }

    const key = sortBy as keyof ListItem;
    const sorted = [...list].sort((a, b) =>
      a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    );

    return sortDirection === SortDirection.DESC ? sorted.reverse() : sorted;
  }, [sortBy, sortDirection]);

  const sort: TableProps["sort"] = (params) => {
    if (sortBy === params.sortBy && sortDirection === SortDirection.DESC) {
      // If the list was sorted DESC by this column,
      // return to the "natural" order rather than switching to ASC.
      setSortBy(undefined);
      setSortDirection(undefined);
    } else {
      setSortBy(params.sortBy);
      setSortDirection(params.sortDirection);
    }
  };

  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            headerHeight={36}
            height={250}
            rowClassName="border-b border-white/10"
            rowCount={sortedList.length}
            rowGetter={({ index }) => sortedList[index]}
            rowHeight={30}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={width}
          >
            <Column dataKey="index" label="Index" width={80} />
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

export { Example as NaturalSortTable };
