// Which scrollbars a Grid shows, accounting for cross-axis overflow:
// a vertical scrollbar narrows the Grid and so can cause a horizontal one (and vice versa).
// A linked Grid renders at its full height, so it never has a vertical scrollbar of its own.
// "overflow" values describe whether the content needs to scroll (even if scrollbars take up no space, e.g. size 0).
export function getScrollbarSizes({
  autoContainerWidth,
  height,
  isLinked,
  scrollbarSize,
  totalColumnsWidth,
  totalRowsHeight,
  width
}: {
  autoContainerWidth: boolean;
  height: number;
  isLinked: boolean;
  scrollbarSize: number;
  totalColumnsWidth: number;
  totalRowsHeight: number;
  width: number;
}) {
  const verticalContentOverflows = !isLinked && totalRowsHeight > height;
  // With autoContainerWidth the content shrinks to the client width, so a vertical scrollbar never causes horizontal overflow.
  const horizontalOverflow =
    totalColumnsWidth +
      (verticalContentOverflows && !autoContainerWidth ? scrollbarSize : 0) >
    width;
  const verticalOverflow =
    totalRowsHeight + (horizontalOverflow ? scrollbarSize : 0) > height;
  return {
    horizontalOverflow,
    horizontalSize: horizontalOverflow ? scrollbarSize : 0,
    verticalOverflow,
    verticalSize: verticalOverflow && !isLinked ? scrollbarSize : 0
  };
}
