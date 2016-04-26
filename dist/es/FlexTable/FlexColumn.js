
import React, { Component, PropTypes } from 'react';
import SortIndicator from './SortIndicator';

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
export function defaultCellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
  if (cellData === null || cellData === undefined) {
    return '';
  } else {
    return String(cellData);
  }
}

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
export function defaultCellDataGetter(dataKey, rowData, columnData) {
  if (rowData.get instanceof Function) {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}

/**
 * Default table header renderer.
 */
export function defaultHeaderRenderer(_ref) {
  var columnData = _ref.columnData;
  var dataKey = _ref.dataKey;
  var disableSort = _ref.disableSort;
  var label = _ref.label;
  var sortBy = _ref.sortBy;
  var sortDirection = _ref.sortDirection;

  var showSortIndicator = sortBy === dataKey;
  var children = [React.createElement(
    'div',
    {
      className: 'FlexTable__headerTruncatedText',
      key: 'label',
      title: label
    },
    label
  )];

  if (showSortIndicator) {
    children.push(React.createElement(SortIndicator, {
      key: 'SortIndicator',
      sortDirection: sortDirection
    }));
  }

  return children;
}

/**
 * Describes the header and cell contents of a table column.
 */

var Column = function (_Component) {
  babelHelpers.inherits(Column, _Component);

  function Column() {
    babelHelpers.classCallCheck(this, Column);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Column).apply(this, arguments));
  }

  return Column;
}(Component);

Column.defaultProps = {
  cellDataGetter: defaultCellDataGetter,
  cellRenderer: defaultCellRenderer,
  flexGrow: 0,
  flexShrink: 1,
  headerRenderer: defaultHeaderRenderer
};
Column.propTypes = {
  /** Optional aria-label value to set on the column header */
  'aria-label': PropTypes.string,

  /** Optional CSS class to apply to cell */
  cellClassName: PropTypes.string,

  /**
   * Callback responsible for returning a cell's data, given its :dataKey
   * (dataKey: string, rowData: any): any
   */
  cellDataGetter: PropTypes.func,

  /**
   * Callback responsible for rendering a cell's contents.
   * (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
   */
  cellRenderer: PropTypes.func,

  /** Optional additional data passed to this column's :cellDataGetter */
  columnData: PropTypes.object,

  /** Uniquely identifies the row-data attribute correspnding to this cell */
  dataKey: PropTypes.any.isRequired,

  /** If sort is enabled for the table at large, disable it for this column */
  disableSort: PropTypes.bool,

  /** Flex grow style; defaults to 0 */
  flexGrow: PropTypes.number,

  /** Flex shrink style; defaults to 1 */
  flexShrink: PropTypes.number,

  /** Optional CSS class to apply to this column's header */
  headerClassName: PropTypes.string,

  /**
   * Optional callback responsible for rendering a column header contents.
   * ({ columnData: object, dataKey: string, disableSort: boolean, label: string, sortBy: string, sortDirection: string }): PropTypes.node
   */
  headerRenderer: PropTypes.func.isRequired,

  /** Header label for this column */
  label: PropTypes.string,

  /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
  maxWidth: PropTypes.number,

  /** Minimum width of column. */
  minWidth: PropTypes.number,

  /** Inline styles to be specified by the user */
  style: PropTypes.object,

  /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
  width: PropTypes.number.isRequired
};
export default Column;