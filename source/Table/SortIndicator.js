import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import SortDirection from "./SortDirection";

/**
 * Displayed beside a header to indicate that a Table is currently sorted by this column.
 */
export default function SortIndicator({ sortDirection }) {
  const classNames = cn("ReactVirtualized__Table__sortableHeaderIcon", {
    "ReactVirtualized__Table__sortableHeaderIcon--ASC":
      sortDirection === SortDirection.ASC,
    "ReactVirtualized__Table__sortableHeaderIcon--DESC":
      sortDirection === SortDirection.DESC
  });

  return (
    <svg className={classNames} width={18} height={18} viewBox="0 0 24 24">
      {sortDirection === SortDirection.ASC
        ? <path d="M7 14l5-5 5 5z" />
        : <path d="M7 10l5 5 5-5z" />}
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

SortIndicator.propTypes = {
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC])
};
