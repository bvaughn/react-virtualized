import type { ListItem } from "../../../utils/data";

// <begin>

import { useMemo, useState } from "react";
import {
  Column,
  SortDirection,
  SortIndicator,
  Table,
  type ColumnProps,
  type TableProps
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({
  disableHeader,
  hideIndexColumn,
  list,
  useDynamicRowHeight
}: {
  disableHeader: boolean;
  hideIndexColumn: boolean;
  list: ListItem[];
  useDynamicRowHeight: boolean;
}) {
  const [sortBy, setSortBy] = useState("index");
  const [sortDirection, setSortDirection] = useState<
    TableProps["sortDirection"]
  >(SortDirection.ASC);

  const sortedList = useMemo(() => {
    const key = sortBy as keyof ListItem;
    const sorted = [...list].sort((a, b) =>
      a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    );
    return sortDirection === SortDirection.DESC ? sorted.reverse() : sorted;
  }, [list, sortBy, sortDirection]);

  return (
    <AutoSizer
      renderProp={({ width }) =>
        width !== undefined ? (
          <Table
            disableHeader={disableHeader}
            headerClassName="normal-case"
            headerHeight={36}
            height={300}
            noRowsRenderer={() => (
              <div className="h-full flex items-center justify-center text-slate-400">
                No rows
              </div>
            )}
            overscanRowCount={10}
            rowClassName={({ index }) =>
              index < 0
                ? "border-b border-white/20 bg-white/5"
                : index % 2 === 0
                  ? "border-b border-white/10"
                  : "border-b border-white/10 bg-white/5"
            }
            rowCount={sortedList.length}
            rowGetter={({ index }) => sortedList[index]}
            rowHeight={
              useDynamicRowHeight ? ({ index }) => sortedList[index].size : 40
            }
            sort={({ sortBy, sortDirection }) => {
              setSortBy(sortBy);
              setSortDirection(sortDirection);
            }}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={width}
          >
            {/* Falsy children are ignored, so columns can be shown or hidden */}
            {!hideIndexColumn && (
              <Column dataKey="index" label="Index" width={80} />
            )}
            <Column
              dataKey="name"
              headerRenderer={fullNameHeaderRenderer}
              width={120}
            />
            <Column
              cellRenderer={({ cellData }) => (
                <span className="text-slate-300">{cellData}</span>
              )}
              className="truncate"
              dataKey="random"
              disableSort
              flexGrow={1}
              label="The description label is really long so that it will be truncated"
              width={210}
            />
          </Table>
        ) : null
      }
    />
  );
}

const fullNameHeaderRenderer: ColumnProps["headerRenderer"] = ({
  dataKey,
  sortBy,
  sortDirection
}) => {
  return (
    <div className="flex items-center">
      Full Name
      {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
    </div>
  );
};

// <end>

export { Example as TableFullFeatured };
