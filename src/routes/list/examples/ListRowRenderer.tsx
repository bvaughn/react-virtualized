import { LIST } from "../../../utils/data";

const list = LIST;

// <begin>

import { type RowRendererParams } from "react-virtualized";

// The following named parameters are passed to the row renderer:
//   index: Index of row
//   isScrolling: The List is currently being scrolled
//   isVisible: This row is visible within the List (eg it is not an overscanned row)
//   key: Unique key within array of rendered rows
//   parent: Reference to the parent List (can be passed to CellMeasurer)
//   style: Style object to be applied to row (to position it)
function rowRenderer({ index, isScrolling, key, style }: RowRendererParams) {
  const user = list[index];

  // If row content is complex, consider rendering a light-weight placeholder while scrolling.
  const content = isScrolling ? "..." : user.name;

  // Style is required since it specifies how the row is to be sized and positioned.
  // React Virtualized depends on this sizing/positioning for proper scrolling behavior.
  // By default, List provides the following style properties:
  //    position, left, top, height, width
  // You can add additional class names or style properties as you would like.
  // Key is also required by React to more efficiently manage the array of rows.
  return (
    <div key={key} style={style}>
      {content}
    </div>
  );
}

// <end>

export { rowRenderer as listRowRenderer };
