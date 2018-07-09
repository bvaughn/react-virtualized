/* @flow */
import createTableMultiSort from './createTableMultiSort';
import defaultTableCellDataGetter from './defaultTableCellDataGetter';
import defaultTableCellRenderer from './defaultTableCellRenderer';
import defaultTableHeaderRowRenderer from './defaultTableHeaderRowRenderer.js';
import defaultTableHeaderRenderer from './defaultTableHeaderRenderer';
import defaultTableRowRenderer from './defaultTableRowRenderer';
import Column from './Column';
import SortDirection from './SortDirection';
import SortIndicator from './SortIndicator';
import Table from './Table';

export default Table;
// TODO Remove export aliases without -Table- in version 10
export {
  createTableMultiSort,
  createTableMultiSort as createMultiSort,
  defaultTableCellDataGetter,
  defaultTableCellDataGetter as defaultCellDataGetter,
  defaultTableCellRenderer,
  defaultTableCellRenderer as defaultCellRenderer,
  defaultTableHeaderRowRenderer,
  defaultTableHeaderRowRenderer as defaultHeaderRowRenderer,
  defaultTableHeaderRenderer,
  defaultTableHeaderRenderer as defaultHeaderRenderer,
  defaultTableRowRenderer,
  defaultTableRowRenderer as defaultRowRenderer,
  Column,
  SortDirection,
  SortIndicator,
  Table,
};
