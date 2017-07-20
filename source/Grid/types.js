// @flow

export type Alignment = "auto" | "end" | "start" | "center";

export type VisibleCellRange = {
  start?: number,
  stop?: number
};

export type CellSizeGetter = (params: { index: number }) => number;
