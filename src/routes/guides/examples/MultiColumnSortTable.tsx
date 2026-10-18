import { LIST, type ListItem } from "../../../utils/data";

const list = LIST;

// <begin>

import { useMemo, useState } from "react";
import {
  Column,
  createTableMultiSort,
  SortIndicator,
  Table,
  type ColumnProps
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

type SortState = {
  sortBy: string[];
  sortDirection: { [dataKey: string]: "ASC" | "DESC" };
};

function Example() {
  // Sort criteria are stored in React state so that changes re-render the Table
  const [{ sortBy, sortDirection }, setSortState] = useState<SortState>({
    sortBy: ["name"],
    sortDirection: { name: "ASC" }
  });

  // createTableMultiSort tracks the sort criteria;
  // it calls this function (with new sortBy and sortDirection values) whenever they change.
  const [multiSort] = useState(() =>
    createTableMultiSort(
      ({ sortBy, sortDirection }) => setSortState({ sortBy, sortDirection }),
      {
        defaultSortBy: ["name"],
        defaultSortDirection: { name: "ASC" }
      }
    )
  );

  // Sort the collection by each field, in order of importance
  const sortedList = useMemo(
    () =>
      [...list].sort((a, b) => {
        for (const dataKey of sortBy) {
          const key = dataKey as keyof ListItem;
          const order = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
          if (order !== 0) {
            return sortDirection[dataKey] === "DESC" ? -order : order;
          }
        }
        return 0;
      }),
    [sortBy, sortDirection]
  );

  // Use the multi-sort state (rather than the Table's sortBy prop) to show indicators
  const headerRenderer: ColumnProps["headerRenderer"] = ({
    dataKey,
    label
  }) => {
    const position = sortBy.indexOf(dataKey);
    return (
      <div className="flex items-center gap-1">
        <span title={typeof label === "string" ? label : undefined}>
          {label}
        </span>
        {position >= 0 && (
          <>
            <SortIndicator sortDirection={sortDirection[dataKey]} />
            {sortBy.length > 1 && (
              <span className="text-xs text-slate-400">{position + 1}</span>
            )}
          </>
        )}
      </div>
    );
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
            // Connect the multi-sort state to Table by way of the "sort" prop
            sort={multiSort.sort}
            sortBy={undefined}
            sortDirection={undefined}
            width={width}
          >
            <Column
              dataKey="name"
              headerRenderer={headerRenderer}
              label="Name"
              width={140}
            />
            <Column
              dataKey="size"
              headerRenderer={headerRenderer}
              label="Size"
              width={100}
            />
            <Column
              dataKey="random"
              flexGrow={1}
              headerRenderer={headerRenderer}
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

export { Example as MultiColumnSortTable };
