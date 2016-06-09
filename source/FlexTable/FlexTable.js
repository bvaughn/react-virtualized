/** @flow */
import cn from 'classnames'
import FlexColumn from './FlexColumn'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import Grid from '../Grid'
import SortDirection from './SortDirection'

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
export default class FlexTable extends Component {
  static propTypes = {
    'aria-label': PropTypes.string,

    /** One or more FlexColumns describing the data displayed in this row */
    children: (props, propName, componentName) => {
      const children = React.Children.toArray(props.children)
      for (let i = 0; i < children.length; i++) {
        if (children[i].type !== FlexColumn) {
          return new Error('FlexTable only accepts children of type FlexColumn')
        }
      }
    },

    /** Optional CSS class name */
    className: PropTypes.string,

    /** Disable rendering the header at all */
    disableHeader: PropTypes.bool,

    /**
     * Used to estimate the total height of a FlexTable before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize: PropTypes.number.isRequired,

    /** Optional CSS class to apply to all column headers */
    headerClassName: PropTypes.string,

    /** Fixed height of header row */
    headerHeight: PropTypes.number.isRequired,

    /** Fixed/available height for out DOM element */
    height: PropTypes.number.isRequired,

    /** Optional renderer to be used in place of table body rows when rowCount is 0 */
    noRowsRenderer: PropTypes.func,

    /**
    * Optional callback when a column's header is clicked.
    * ({ columnData: any, dataKey: string }): void
    */
    onHeaderClick: PropTypes.func,

    /** Optional custom inline style to attach to table header columns. */
    headerStyle: PropTypes.object,

    /**
     * Callback invoked when a user clicks on a table row.
     * ({ index: number }): void
     */
    onRowClick: PropTypes.func,

    /**
     * Callback invoked when a user moves the mouse over a table row.
     * ({ index: number }): void
     */
    onRowMouseOver: PropTypes.func,

    /**
     * Callback invoked when the mouse leaves a table row.
     * ({ index: number }): void
     */
    onRowMouseOut: PropTypes.func,

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
    overscanRowCount: PropTypes.number.isRequired,

    /**
     * Optional CSS class to apply to all table rows (including the header row).
     * This property can be a CSS class name (string) or a function that returns a class name.
     * If a function is provided its signature should be: ({ index: number }): string
     */
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * Callback responsible for returning a data row given an index.
     * ({ index: number }): any
     */
    rowGetter: PropTypes.func.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /** Number of rows in table. */
    rowCount: PropTypes.number.isRequired,

    /** Optional custom inline style to attach to table rows. */
    rowStyle: PropTypes.object,

    /** See Grid#scrollToAlignment */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /**
     * Sort function to be called if a sortable header is clicked.
     * ({ sortBy: string, sortDirection: SortDirection }): void
     */
    sort: PropTypes.func,

    /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
    sortBy: PropTypes.string,

    /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),

    /** Optional inline style */
    style: PropTypes.object,

    /** Width of list */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    disableHeader: false,
    estimatedRowSize: 30,
    headerHeight: 0,
    headerStyle: {},
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowCount: 10,
    rowStyle: {},
    scrollToAlignment: 'auto',
    style: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      scrollbarWidth: 0
    }

    this._createRow = this._createRow.bind(this)
  }

  /** See Grid#measureAllCells */
  measureAllRows () {
    this.refs.Grid.measureAllCells()
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights () {
    this.refs.Grid.recomputeGridSize()
  }

  componentDidMount () {
    this._setScrollbarWidth()
  }

  componentDidUpdate () {
    this._setScrollbarWidth()
  }

  render () {
    const {
      className,
      disableHeader,
      estimatedRowSize,
      headerHeight,
      height,
      noRowsRenderer,
      onRowsRendered,
      onScroll,
      overscanRowCount,
      rowClassName,
      rowHeight,
      rowCount,
      rowStyle,
      scrollToAlignment,
      scrollToIndex,
      scrollTop,
      style,
      width
    } = this.props
    const { scrollbarWidth } = this.state

    const availableRowsHeight = height - headerHeight

    // This row-renderer wrapper function is necessary in order to trigger re-render when the
    // sort-by or sort-direction have changed (else Grid will not see any props changes)
    const rowRenderer = ({ index, isScrolling }) => {
      return this._createRow({
        index,
        isScrolling
      })
    }

    const rowClass = rowClassName instanceof Function ? rowClassName({ index: -1 }) : rowClassName

    return (
      <div
        className={cn('FlexTable', className)}
        style={style}
      >
        {!disableHeader && (
          <div
            className={cn('FlexTable__headerRow', rowClass)}
            style={{
              ...rowStyle,
              height: headerHeight,
              paddingRight: scrollbarWidth,
              width: width
            }}
          >
            {this._getRenderedHeaderRow()}
          </div>
        )}

        <Grid
          aria-label={this.props['aria-label']}
          className={'FlexTable__Grid'}
          cellRenderer={({ columnIndex, isScrolling, rowIndex }) => rowRenderer({
            index: rowIndex,
            isScrolling
          })}
          columnWidth={width}
          columnCount={1}
          estimatedRowSize={estimatedRowSize}
          height={availableRowsHeight}
          noContentRenderer={noRowsRenderer}
          onScroll={({ clientHeight, scrollHeight, scrollTop }) => onScroll({ clientHeight, scrollHeight, scrollTop })}
          onSectionRendered={({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) => onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex
          })}
          overscanRowCount={overscanRowCount}
          ref='Grid'
          rowHeight={rowHeight}
          rowCount={rowCount}
          scrollToAlignment={scrollToAlignment}
          scrollToRow={scrollToIndex}
          scrollTop={scrollTop}
          width={width}
        />
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _createColumn ({
    column,
    columnIndex,
    isScrolling,
    rowData,
    rowIndex
  }) {
    const {
      cellDataGetter,
      cellRenderer,
      className,
      columnData,
      dataKey,
      style: cellStyle
    } = column.props

    const cellData = cellDataGetter({ columnData, dataKey, rowData })
    const renderedCell = cellRenderer({ cellData, columnData, dataKey, isScrolling, rowData, rowIndex })

    const style = this._getFlexStyleForColumn(column, cellStyle)

    const title = typeof renderedCell === 'string'
      ? renderedCell
      : null

    return (
      <div
        key={`Row${rowIndex}-Col${columnIndex}`}
        className={cn('FlexTable__rowColumn', className)}
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
    const { headerClassName, headerStyle, onHeaderClick, sort, sortBy, sortDirection } = this.props
    const { dataKey, disableSort, headerRenderer, label, columnData } = column.props
    const sortEnabled = !disableSort && sort

    const classNames = cn(
      'FlexTable__headerColumn',
      headerClassName,
      column.props.headerClassName,
      {
        'FlexTable__sortableHeaderColumn': sortEnabled
      }
    )
    const style = this._getFlexStyleForColumn(column, headerStyle)

    const renderedHeader = headerRenderer({
      columnData,
      dataKey,
      disableSort,
      label,
      sortBy,
      sortDirection
    })

    const a11yProps = {}

    if (sortEnabled || onHeaderClick) {
      // If this is a sortable header, clicking it should update the table data's sorting.
      const newSortDirection = sortBy !== dataKey || sortDirection === SortDirection.DESC
        ? SortDirection.ASC
        : SortDirection.DESC

      const onClick = () => {
        sortEnabled && sort({
          sortBy: dataKey,
          sortDirection: newSortDirection
        })
        onHeaderClick && onHeaderClick({ columnData, dataKey })
      }

      const onKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClick()
        }
      }

      a11yProps['aria-label'] = column.props['aria-label'] || label || dataKey
      a11yProps.role = 'rowheader'
      a11yProps.tabIndex = 0
      a11yProps.onClick = onClick
      a11yProps.onKeyDown = onKeyDown
    }

    return (
      <div
        {...a11yProps}
        key={`Header-Col${columnIndex}`}
        className={classNames}
        style={style}
      >
        {renderedHeader}
      </div>
    )
  }

  _createRow ({
    index,
    isScrolling
  }) {
    const {
      children,
      onRowClick,
      onRowMouseOver,
      onRowMouseOut,
      rowClassName,
      rowGetter,
      rowStyle
    } = this.props
    const { scrollbarWidth } = this.state

    const rowClass = rowClassName instanceof Function ? rowClassName({ index }) : rowClassName
    const rowData = rowGetter({ index })

    const renderedRow = React.Children.toArray(children).map(
      (column, columnIndex) => this._createColumn({
        column,
        columnIndex,
        isScrolling,
        rowData,
        rowIndex: index
      })
    )

    const a11yProps = {}

    if (onRowClick || onRowMouseOver || onRowMouseOut) {
      a11yProps['aria-label'] = 'row'
      a11yProps.role = 'row'
      a11yProps.tabIndex = 0
      if (onRowClick) {
        a11yProps.onClick = () => onRowClick({index})
      }
      if (onRowMouseOver) {
        a11yProps.onMouseOver = () => onRowMouseOver({index})
      }
      if (onRowMouseOut) {
        a11yProps.onMouseOut = () => onRowMouseOut({index})
      }
    }

    return (
      <div
        {...a11yProps}
        key={index}
        className={cn('FlexTable__row', rowClass)}
        style={{
          ...rowStyle,
          height: this._getRowHeight(index),
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
  _getFlexStyleForColumn (column, customStyle = {}) {
    const flexValue = `${column.props.flexGrow} ${column.props.flexShrink} ${column.props.width}px`

    const style = {
      ...customStyle,
      flex: flexValue,
      msFlex: flexValue,
      WebkitFlex: flexValue
    }

    if (column.props.maxWidth) {
      style.maxWidth = column.props.maxWidth
    }

    if (column.props.minWidth) {
      style.minWidth = column.props.minWidth
    }

    return style
  }

  _getRenderedHeaderRow () {
    const { children, disableHeader } = this.props
    const items = disableHeader ? [] : React.Children.toArray(children)

    return items.map((column, index) =>
      this._createHeader(column, index)
    )
  }

  _getRowHeight (rowIndex) {
    const { rowHeight } = this.props

    return rowHeight instanceof Function
      ? rowHeight({ index: rowIndex })
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
