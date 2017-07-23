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
  scrollDirection: ScrollDirection,
  cellCount: number,
  overscanCellsCount: number,
  startIndex: number,
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
