import type { ColumnProps } from "./types";

/**
 * Describes the header and cell contents of a table column.
 *
 * This component does not render anything itself;
 * `Table` reads the props of its children to render headers and cells
 * (applying `defaultColumnProps` to each child's props).
 * Components that render a `Column` (e.g. `const MyColumn = (props) => <Column {...props} />`) can be used as `Table` children too;
 * their props are read the same way (the wrapper component itself is never rendered).
 */
export function Column(props: ColumnProps): null {
  void props;
  return null;
}
