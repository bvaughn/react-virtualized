/** @flow */
export type CellDataGetterParams = {
  columnData: ?any,
  dataKey: string,
  rowData: any
};

export type CellRendererParams = {
  cellData: ?any,
  columnData: ?any,
  dataKey: string,
  rowData: any,
  rowIndex: number
};

export type HeaderRowRendererParams = {
  className: string,
  columns: any[],
  style: any,
  scrollbarWidth: number,
  height: number,
  width: number
};

export type HeaderRendererParams = {
  columnData: ?any,
  dataKey: string,
  disableSort: ?boolean,
  label: ?string,
  sortBy: ?string,
  sortDirection: ?string
};

export type RowRendererParams = {
  className: string,
  columns: any[],
  index: number,
  isScrolling: boolean,
  onRowClick: ?Function,
  onRowDoubleClick: ?Function,
  onRowMouseOver: ?Function,
  onRowMouseOut: ?Function,
  rowData: any,
  style: any
};
