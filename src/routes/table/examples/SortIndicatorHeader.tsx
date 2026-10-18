// <begin>

import { SortIndicator, type ColumnProps } from "react-virtualized";

const headerRenderer: ColumnProps["headerRenderer"] = ({
  dataKey,
  label,
  sortBy,
  sortDirection
}) => (
  <div className="flex items-center gap-1">
    <span className="italic">{label}</span>
    {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
  </div>
);

// <end>

export { headerRenderer as sortIndicatorHeaderRenderer };
