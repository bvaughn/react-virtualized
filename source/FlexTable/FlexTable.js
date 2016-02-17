/** @flow */
import cn from 'classnames'
import FlexColumn from './FlexColumn'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import shouldPureComponentUpdate from 'react-pure-render/function'
import Grid from '../Grid'

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

    /** Optional renderer to be used in place of table body rows when rowsCount is 0 */
    noRowsRenderer: PropTypes.func,

    /**
    * Optional callback when a column's header is clicked.
    * (dataKey: string): void
    */
    onHeaderClick: PropTypes.func,

    /**
     * Callback invoked when a user clicks on a table row.
     * (rowIndex: number): void
     */
    onRowClick: PropTypes.func,

    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered: PropTypes.func,

    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll: PropTypes.func.isRequired,

    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowsCount: PropTypes.number.isRequired,

    /**
     * Optional CSS class to apply to all table rows (including the header row).
     * This property can be a CSS class name (string) or a function that returns a class name.
     * If a function is provided its signature should be: (rowIndex: number): string
     */
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * Callback responsible for returning a data row given an index.
     * (index: number): any
     */
    rowGetter: PropTypes.func.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * (index: number): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /** Number of rows in table. */
    rowsCount: PropTypes.number.isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /**
     * Sort function to be called if a sortable header is clicked.
     * (dataKey: string, sortDirection: SortDirection): void
     */
    sort: PropTypes.func,

    /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
    sortBy: PropTypes.string,

    /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),

    /** Width of list */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    disableHeader: false,
    headerHeight: 0,
    noRowsRenderer: () => null,
    onHeaderClick: () => null,
    onRowClick: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowsCount: 10
  }

  constructor (props) {
    super(props)

    this.state = {
      scrollbarWidth: 0
    }

    this._createRow = this._createRow.bind(this)
  }

  /**
   * See Grid#recomputeGridSize
   */
  recomputeRowHeights () {
    this.refs.Grid.recomputeGridSize()
  }

  /**
   * See Grid#scrollToIndex
   */
  scrollToRow (scrollToIndex) {
    this.refs.Grid.scrollToCell({
      scrollToColumn: 0,
      scrollToRow: scrollToIndex
    })
  }

  /**
   * See Grid#setScrollPosition
   */
  setScrollTop (scrollTop) {
    this.refs.Grid.setScrollPosition({
      scrollLeft: 0,
      scrollTop
    })
  }

  componentDidMount () {
    const { scrollTop } = this.props

    if (scrollTop >= 0) {
      this.setScrollTop(scrollTop)
    }

    this._setScrollbarWidth()
  }

  componentDidUpdate () {
    this._setScrollbarWidth()
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.scrollTop !== this.props.scrollTop) {
      this.setScrollTop(nextProps.scrollTop)
    }
  }

  render () {
    const {
      className,
      disableHeader,
      headerHeight,
      height,
      noRowsRenderer,
      onRowsRendered,
      onScroll,
      overscanRowsCount,
      rowClassName,
      rowHeight,
      rowsCount,
      scrollToIndex,
      width
    } = this.props
    const { scrollbarWidth } = this.state

    const availableRowsHeight = height - headerHeight

    // This row-renderer wrapper function is necessary in order to trigger re-render when the
    // sort-by or sort-direction have changed (else Grid will not see any props changes)
    const rowRenderer = index => {
      return this._createRow(index)
    }

    const rowClass = rowClassName instanceof Function ? rowClassName(-1) : rowClassName

    return (
      <div
        className={cn('FlexTable', className)}
      >
        {!disableHeader && (
          <div
            className={cn('FlexTable__headerRow', rowClass)}
            style={{
              height: headerHeight,
              paddingRight: scrollbarWidth,
              width: width
            }}
          >
            {this._getRenderedHeaderRow()}
          </div>
        )}

        <Grid
          ref='Grid'
          className={'FlexTable__Grid'}
          columnWidth={width}
          columnsCount={1}
          height={availableRowsHeight}
          noContentRenderer={noRowsRenderer}
          onScroll={({ clientHeight, scrollHeight, scrollTop }) => onScroll({ clientHeight, scrollHeight, scrollTop })}
          onSectionRendered={({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) => onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex
          })}
          overscanRowsCount={overscanRowsCount}
          renderCell={({ columnIndex, rowIndex }) => rowRenderer(rowIndex)}
          rowHeight={rowHeight}
          rowsCount={rowsCount}
          scrollToRow={scrollToIndex}
          width={width}
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

    const style = this._getFlexStyleForColumn(column)

    const title = typeof renderedCell === 'string'
      ? renderedCell
      : null

    return (
      <div
        key={`Row${rowIndex}-Col${columnIndex}`}
        className={cn('FlexTable__rowColumn', cellClassName)}
        style={style}
      >
        <div
          className='FlexTable__truncatedColumnText'
          title={title}
        >
          {renderedCell}
        </div>
      </div>
    )
  }

  _createHeader (column, columnIndex) {
    const { headerClassName, onHeaderClick, sort, sortBy, sortDirection } = this.props
    const { dataKey, disableSort, label, columnData } = column.props
    const showSortIndicator = sortBy === dataKey
    const sortEnabled = !disableSort && sort

    const classNames = cn(
      'FlexTable__headerColumn',
      headerClassName,
      column.props.headerClassName,
      {
        'FlexTable__sortableHeaderColumn': sortEnabled
      }
    )
    const style = this._getFlexStyleForColumn(column)

    // If this is a sortable header, clicking it should update the table data's sorting.
    const newSortDirection = sortBy !== dataKey || sortDirection === SortDirection.DESC
      ? SortDirection.ASC
      : SortDirection.DESC
    const onClick = () => {
      sortEnabled && sort(dataKey, newSortDirection)
      onHeaderClick(dataKey, columnData)
    }

    return (
      <div
        key={`Header-Col${columnIndex}`}
        className={classNames}
        style={style}
        onClick={onClick}
      >
        <div
          className='FlexTable__headerTruncatedText'
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
      onRowClick,
      rowClassName,
      rowGetter
    } = this.props
    const { scrollbarWidth } = this.state

    const rowClass = rowClassName instanceof Function ? rowClassName(rowIndex) : rowClassName

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
        className={cn('FlexTable__row', rowClass)}
        onClick={() => onRowClick(rowIndex)}
        style={{
          height: this._getRowHeight(rowIndex),
          paddingRight: scrollbarWidth
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
    const flexValue = `${column.props.flexGrow} ${column.props.flexShrink} ${column.props.width}px`

    return {
      flex: flexValue,
      msFlex: flexValue,
      WebkitFlex: flexValue
    }
  }

  _getRenderedHeaderRow () {
    const { children, disableHeader } = this.props
    const items = disableHeader ? [] : children
    return React.Children.map(items, (column, columnIndex) =>
      this._createHeader(column, columnIndex)
    )
  }

  _getRowHeight (rowIndex) {
    const { rowHeight } = this.props

    return rowHeight instanceof Function
      ? rowHeight(rowIndex)
      : rowHeight
  }

  _setScrollbarWidth () {
    const Grid = findDOMNode(this.refs.Grid)
    const clientWidth = Grid.clientWidth || 0
    const offsetWidth = Grid.offsetWidth || 0
    const scrollbarWidth = offsetWidth - clientWidth

    this.setState({ scrollbarWidth })
  }
}

/**
 * Displayed beside a header to indicate that a FlexTable is currently sorted by this column.
 */
export function SortIndicator ({ sortDirection }) {
  const classNames = cn('FlexTable__sortableHeaderIcon', {
    'FlexTable__sortableHeaderIcon--ASC': sortDirection === SortDirection.ASC,
    'FlexTable__sortableHeaderIcon--DESC': sortDirection === SortDirection.DESC
  })

  return (
    <svg
      className={classNames}
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
