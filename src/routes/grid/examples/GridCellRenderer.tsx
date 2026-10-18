import type { ReactElement } from "react";
import type { ListItem } from "../../../utils/data";

// Defined elsewhere in a real application
declare function User(props: { user: ListItem }): ReactElement;

// Grid data is a 2d array in this example
declare const list: ListItem[][];

// <begin>

import type { CellRendererParams } from "react-virtualized";

function cellRenderer({
  columnIndex, // Horizontal (column) index of cell
  isScrolling, // The Grid is currently being scrolled
  key, // Unique key within array of cells
  rowIndex, // Vertical (row) index of cell
  style // Style object to be applied to cell (to position it)
  // Also available:
  // isVisible: This cell is visible within the grid (eg it is not an overscanned cell)
  // parent: Reference to the parent Grid (instance)
}: CellRendererParams) {
  const user = list[rowIndex][columnIndex];

  // If cell content is complex, consider rendering a lighter-weight placeholder while scrolling
  const content = isScrolling ? "..." : <User user={user} />;

  // Style is required since it specifies how the cell is to be sized and positioned;
  // Grid depends on this sizing/positioning for proper scrolling behavior.
  // By default it contains position, left, top, height, and width properties.
  // You can add class names or style properties as you like (but don't mutate the object).
  // Key is also required by React to more efficiently manage the array of cells.
  return (
    <div key={key} style={style}>
      {content}
    </div>
  );
}

// <end>

export { cellRenderer };
