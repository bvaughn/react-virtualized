import type { ListImperativeAPI } from "react-virtualized";

declare const listRef: { current: ListImperativeAPI | null };
declare const listElementRef: { current: HTMLElement | null };

// <begin>

// Smoothly scrolls the window to a row of a List with scrollElement="window".
// (listElementRef is passed to the List's elementRef prop.)
function smoothScrollToRow(index: number) {
  const list = listRef.current;
  const listElement = listElementRef.current;
  if (list && listElement) {
    // Offset of the row within the List, and of the List within the page
    const rowOffset = list.getOffsetForRow({ align: "start", index });
    const listOffset = listElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({ behavior: "smooth", top: listOffset + rowOffset });
  }
}

// <end>

export { smoothScrollToRow };
