/** @flow */
export type CellDataGetterParams = {
  columnData: ?any,
  dataKey: string,
  rowData: any,
};

export type CellRendererParams = {
  cellData: ?any,
  columnData: ?any,
  dataKey: string,
  rowData: any,
  rowIndex: number,
};

export type HeaderRowRendererParams = {
  className: string,
  columns: Array<any>,
  style: any,
};

export type HeaderRendererParams = {
  columnData: ?any,
  dataKey: string,
  disableSort: ?boolean,
  label: ?any,
  sortBy: ?string,
  sortDirection: ?string,
};

export type RowRendererParams = {
  className: string,
  columns: Array<any>,
  index: number,
  isScrolling: boolean,
  onRowClick: ?Function,
  onRowDoubleClick: ?Function,
  onRowMouseOver: ?Function,
  onRowMouseOut: ?Function,
  rowData: any,
  style: any,
};
