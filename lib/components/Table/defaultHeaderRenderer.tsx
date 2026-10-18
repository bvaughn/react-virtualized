import type { ReactElement } from "react";
import { SortIndicator } from "./SortIndicator";
import type { TableHeaderProps } from "./types";

/**
 * Default table header renderer.
 */
export function defaultHeaderRenderer({
  dataKey,
  label,
  sortBy,
  sortDirection
}: Pick<
  TableHeaderProps,
  "dataKey" | "label" | "sortBy" | "sortDirection"
>): ReactElement[] {
  const showSortIndicator = sortBy === dataKey;
  const children = [
    <span
      className="ReactVirtualized__Table__headerTruncatedText"
      key="label"
      // null (rather than undefined) is intentional; it matches the original implementation
      title={(typeof label === "string" ? label : null) as string | undefined}
    >
      {label}
    </span>
  ];

  if (showSortIndicator) {
    children.push(
      <SortIndicator key="SortIndicator" sortDirection={sortDirection} />
    );
  }

  return children;
}
