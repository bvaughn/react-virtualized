/** @flow */
import Grid from '../Grid'
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export default class VirtualScroll extends Component {
  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
    autoHeight: PropTypes.bool,

    /** Optional CSS class name */
    className: PropTypes.string,

    /**
     * Used to estimate the total height of a VirtualScroll before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize: PropTypes.number.isRequired,

    /** Height constraint for list (determines how many actual rows are rendered) */
    height: PropTypes.number.isRequired,

    /** Optional renderer to be used in place of rows when rowCount is 0 */
    noRowsRenderer: PropTypes.func.isRequired,

    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered: PropTypes.func.isRequired,

    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowCount: PropTypes.number.isRequired,

    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll: PropTypes.func.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /** Responsbile for rendering a row given an index; ({ index: number }): node */
    rowRenderer: PropTypes.func.isRequired,

    /** Optional custom CSS class for individual rows */
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /** Number of rows in list. */
    rowCount: PropTypes.number.isRequired,

    /** Optional custom styles for individual cells */
    rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    /** See Grid#scrollToAlignment */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /** Optional inline style */
    style: PropTypes.object,

    /** Tab index for focus */
    tabIndex: PropTypes.number,

    /** Width of list */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    estimatedRowSize: 30,
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowCount: 10,
    scrollToAlignment: 'auto',
    style: {}
  }

  constructor (props, context) {
    super(props, context)

    this._cellRenderer = this._cellRenderer.bind(this)
    this._createRowClassNameGetter = this._createRowClassNameGetter.bind(this)
    this._createRowStyleGetter = this._createRowStyleGetter.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._onSectionRendered = this._onSectionRendered.bind(this)
  }

  forceUpdateGrid () {
    this.Grid.forceUpdate()
  }

  /** See Grid#measureAllCells */
  measureAllRows () {
    this.Grid.measureAllCells()
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights (index = 0) {
    this.Grid.recomputeGridSize({
      rowIndex: index
    })
    this.forceUpdateGrid()
  }

  render () {
    const {
      className,
      noRowsRenderer,
      scrollToIndex,
      width
    } = this.props

    const classNames = cn('VirtualScroll', className)

    return (
      <Grid
        {...this.props}
        cellRenderer={this._cellRenderer}
        cellClassName={this._createRowClassNameGetter()}
        cellStyle={this._createRowStyleGetter()}
        className={classNames}
        columnWidth={width}
        columnCount={1}
        noContentRenderer={noRowsRenderer}
        onScroll={this._onScroll}
        onSectionRendered={this._onSectionRendered}
        ref={(ref) => {
          this.Grid = ref
        }}
        scrollToRow={scrollToIndex}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ columnIndex, isScrolling, rowIndex }) {
    const { rowRenderer } = this.props

    return rowRenderer({
      index: rowIndex,
      isScrolling
    })
  }

  _createRowClassNameGetter () {
    const { rowClassName } = this.props

    return rowClassName instanceof Function
      ? ({ rowIndex }) => rowClassName({ index: rowIndex })
      : () => rowClassName
  }

  _createRowStyleGetter () {
    const { rowStyle } = this.props

    const wrapped = rowStyle instanceof Function
      ? rowStyle
      : () => rowStyle

    // Default width to 100% to prevent list rows from flowing under the vertical scrollbar
    return ({ rowIndex }) => ({
      width: '100%',
      ...wrapped({ index: rowIndex })
    })
  }

  _onScroll ({ clientHeight, scrollHeight, scrollTop }) {
    const { onScroll } = this.props

    onScroll({ clientHeight, scrollHeight, scrollTop })
  }

  _onSectionRendered ({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) {
    const { onRowsRendered } = this.props

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    })
  }
}
