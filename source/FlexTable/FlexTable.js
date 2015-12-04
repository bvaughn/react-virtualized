/** @flow */
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import VirtualScroll from '../VirtualScroll'
import FlexColumn from './FlexColumn'
import './FlexTable.less'

export const SortDirection = {
  /**
   * Sort items in ascending order.
   * This means arranging from the lowest value to the highest (e.g. a-z, 0-9).
   */
  ASC: 'ASC',

  /**
   * Sort items in descending order.
   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
   */
  DESC: 'DESC'
}

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
export default class FlexTable extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static defaultProps = {
    disableHeader: false,
    horizontalPadding: 0,
    verticalPadding: 0
  }

  static propTypes = {
    /** One or more FlexColumns describing the data displayed in this row */
    children: (props, propName, componentName) => {
      const children = React.Children.toArray(props.children)
      for (let i = 0; i < children.length; i++) {
        if (children[i].type !== FlexColumn) {
          return new Error(`FlexTable only accepts children of type FlexColumn`)
        }
      }
    },
    /** Optional CSS class name */
    className: PropTypes.string,
    /** Disable rendering the header at all */
    disableHeader: PropTypes.bool,
    /** Optional CSS class to apply to all column headers */
    headerClassName: PropTypes.string,
    /** Fixed height of header row */
    headerHeight: PropTypes.number.isRequired,
    /** Fixed/available height for out DOM element */
    height: PropTypes.number.isRequired,
    /** Horizontal padding of outer DOM element */
    horizontalPadding: PropTypes.number,
    /** Optional CSS class to apply to all table rows (including the header row) */
    rowClassName: PropTypes.string,
    /**
     * Callback responsible for returning a data row given an index.
     * (index: int): any
     */
    rowGetter: PropTypes.func.isRequired,
    /** Fixed height of table row */
    rowHeight: PropTypes.number.isRequired,
    /** Number of rows in table. */
    rowsCount: PropTypes.number.isRequired,
    /**
     * Sort function to be called if a sortable header is clicked.
     * (dataKey: string, sortDirection: SortDirection): void
     */
    sort: PropTypes.func,
    /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
    sortBy: PropTypes.string,
    /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    /** Fixed/available width for out DOM element */
    width: PropTypes.number.isRequired,
    /** Vertical padding of outer DOM element */
    verticalPadding: PropTypes.number
  }

  constructor (props) {
    super(props)

    this._createRow = this._createRow.bind(this)
  }

  /**
   * Scroll the table to ensure the specified index is visible.
   *
   * @private
   * Why was this functionality implemented as a method instead of a property?
   * Short answer: A user of this component may want to scroll to the same row twice.
   * In this case the scroll-to-row property would not change and so it would not be picked up by the component.
   */
  scrollToRow (scrollToIndex) {
    this.refs.VirtualScroll.scrollToRow(scrollToIndex)
  }

  getRenderedHeaderRow () {
    const { children, disableHeader } = this.props
    const items = disableHeader ? [] : children
    return React.Children.map(items, (column, columnIndex) =>
      this._createHeader(column, columnIndex)
    )
  }

  render () {
    const {
      className,
      disableHeader,
      headerHeight,
      height,
      rowClassName,
      rowHeight,
      rowsCount,
      verticalPadding,
      width
    } = this.props

    const availableRowsHeight = height - headerHeight - verticalPadding

    // This row-renderer wrapper function is necessary in order to trigger re-render when the
    // sort-by or sort-direction have changed (else VirtualScroll will not see any props changes)
    const rowRenderer = index => {
      return this._createRow(index)
    }

    return (
      <div
        className={`FlexTable ${className || ''}`}
        style={{
          maxWidth: width
        }}
      >
        {!disableHeader && (
          <div
            className={`FlexTable__headerRow ${rowClassName || ''}`}
            style={{
              height: headerHeight
            }}
          >
            {this.getRenderedHeaderRow()}
          </div>
        )}

        <VirtualScroll
          ref='VirtualScroll'
          width={width}
          height={availableRowsHeight}
          rowHeight={rowHeight}
          rowRenderer={rowRenderer}
          rowsCount={rowsCount}
        />
      </div>
    )
  }

  _createColumn (column, columnIndex, rowData, rowIndex) {
    const {
      cellClassName,
      cellDataGetter,
      columnData,
      dataKey,
      cellRenderer
    } = column.props
    const cellData = cellDataGetter(dataKey, rowData, columnData)
    const renderedCell = cellRenderer(cellData, dataKey, rowData, rowIndex, columnData)

    const flex = this._getFlexStyleForColumn(column)
    const style = {
      WebkitFlex: flex,
      msFlex: flex,
      flex: flex
    }

    return (
      <div
        key={`Row${rowIndex}-Col${columnIndex}`}
        className='FlexTable__row__column'
        style={style}
      >
        <div
          className={`FlexTable__row__column__truncatedText ${cellClassName || ''}`}
          title={renderedCell}
        >
          {renderedCell}
        </div>
      </div>
    )
  }

  _createHeader (column, columnIndex) {
    const { sort, sortBy, sortDirection } = this.props
    const { dataKey, disableSort, label } = column.props
    const showSortIndicator = sortBy === dataKey
    const sortEnabled = !disableSort && sort

    const classNames = [
      'FlexTable__headerRow__column',
      this.props.headerClassName,
      column.props.headerClassName,
      sortEnabled && 'FlexTable__headerRow__column'
    ].filter(str => str).join(' ')

    const style = {
      flex: this._getFlexStyleForColumn(column)
    }

    // If this is a sortable header, clicking it should update the table data's sorting.
    const newSortDirection = sortBy !== dataKey || sortDirection === SortDirection.DESC
      ? SortDirection.ASC
      : SortDirection.DESC
    const onClick = () => sortEnabled && sort(dataKey, newSortDirection)

    return (
      <div
        key={`Header-Col${columnIndex}`}
        className={classNames}
        style={style}
        onClick={onClick}
      >
        <div
          className='FlexTable__headerRow__truncatedText'
          title={label}
        >
          {label}
        </div>
        {showSortIndicator &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>
    )
  }

  _createRow (rowIndex) {
    const {
      children,
      rowClassName,
      rowGetter,
      rowHeight
    } = this.props

    const renderedRow = React.Children.map(
      children,
      (column, columnIndex) => this._createColumn(
        column,
        columnIndex,
        rowGetter(rowIndex),
        rowIndex
      )
    )

    return (
      <div
        key={rowIndex}
        className={`FlexTable__row ${rowClassName || ''}`}
        style={{
          height: rowHeight
        }}
      >
        {renderedRow}
      </div>
    )
  }

  /**
   * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
   */
  _getFlexStyleForColumn (column) {
    const flex = []
    flex.push(column.props.flexGrow)
    flex.push(column.props.flexShrink)
    flex.push(
      column.props.width
        ? `${column.props.width}px`
        : 'auto'
    )

    return flex.join(' ')
  }
}

/**
 * Displayed beside a header to indicate that a FlexTable is currently sorted by this column.
 */
export function SortIndicator ({ sortDirection }) {
  return (
    <svg
      className={`FlexTable__headerRow__SortIndicator FlexTable__headerRow__SortIndicator--${sortDirection}`}
      width={18}
      height={18}
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      {sortDirection === SortDirection.ASC
        ? <path d='M7 14l5-5 5 5z'/>
        : <path d='M7 10l5 5 5-5z'/>
      }
      <path d='M0 0h24v24H0z' fill='none'/>
    </svg>
  )
}
SortIndicator.propTypes = {
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC])
}
