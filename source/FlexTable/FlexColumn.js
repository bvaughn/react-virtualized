/** @flow */
import React, { Component, PropTypes } from 'react'
import SortIndicator from './SortIndicator'

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
export function defaultCellRenderer (
  cellData: any,
  cellDataKey: string,
  rowData: any,
  rowIndex: number,
  columnData: any
): string {
  if (cellData === null || cellData === undefined) {
    return ''
  } else {
    return String(cellData)
  }
}

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
export function defaultCellDataGetter (
  dataKey: string,
  rowData: any,
  columnData: any
) {
  if (rowData.get instanceof Function) {
    return rowData.get(dataKey)
  } else {
    return rowData[dataKey]
  }
}

/**
 * Default table header renderer.
 */
export function defaultHeaderRenderer ({
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection
}) {
  const showSortIndicator = sortBy === dataKey
  const children = [
    <div
      className='FlexTable__headerTruncatedText'
      key='label'
      title={label}
    >
      {label}
    </div>
  ]

  if (showSortIndicator) {
    children.push(
      <SortIndicator
        key='SortIndicator'
        sortDirection={sortDirection}
      />
    )
  }

  return children
}

/**
 * Describes the header and cell contents of a table column.
 */
export default class Column extends Component {

  static defaultProps = {
    cellDataGetter: defaultCellDataGetter,
    cellRenderer: defaultCellRenderer,
    flexGrow: 0,
    flexShrink: 1,
    headerRenderer: defaultHeaderRenderer
  }

  static propTypes = {
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
  }
}
