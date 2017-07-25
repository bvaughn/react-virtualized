// @flow

export type Alignment = "auto" | "end" | "start" | "center";

export type CellSizeGetter = (params: { index: number }) => number;

export type ScrollDirection = -1 | 1;

export type Scroll = {
  clientHeight: number,
  clientWidth: number,
  scrollHeight: number,
  scrollLeft: number,
  scrollTop: number,
  scrollWidth: number
};

export type OverscanIndicesGetterParams = {
  // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
  direction: "horizontal" | "vertical",

  // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
  scrollDirection: ScrollDirection,

  // Number of rows or columns in the current axis
  cellCount: number,

  // Maximum number of cells to over-render in either direction
  overscanCellsCount: number,

  // Begin of range of visible cells
  startIndex: number,

  // End of range of visible cells
  stopIndex: number
};

export type OverscanIndices = {
  overscanStartIndex: number,
  overscanStopIndex: number
};

export type RenderedSection = {
  columnOverscanStartIndex: number,
  columnOverscanStopIndex: number,
  columnStartIndex: number,
  columnStopIndex: number,
  rowOverscanStartIndex: number,
  rowOverscanStopIndex: number,
  rowStartIndex: number,
  rowStopIndex: number
};

export type CellRendererParams = {
  columnIndex: number,
  isScrolling: boolean,
  isVisible: boolean,
  key: string,
  parent: Object,
  rowIndex: number,
  style: Object
};

export type RowRendererParams = {
  index: number,
  isScrolling: boolean,
  isVisible: boolean,
  key: string,
  parent: Object,
  style: Object
};
