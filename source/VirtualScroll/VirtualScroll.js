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

    /** Optional CSS class name */
    className: PropTypes.string,

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

    /** Number of rows in list. */
    rowCount: PropTypes.number.isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /** Width of list */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowCount: 10
  }

  /**
   * See Grid#recomputeGridSize
   */
  recomputeRowHeights () {
    this.refs.Grid.recomputeGridSize()
  }

  render () {
    const {
      className,
      height,
      noRowsRenderer,
      onRowsRendered,
      onScroll,
      rowHeight,
      rowRenderer,
      overscanRowCount,
      rowCount,
      scrollToIndex,
      scrollTop,
      width
    } = this.props

    const classNames = cn('VirtualScroll', className)

    // @TODO version-7 Remove this wrapper once Grid's :rowHeight signature has been updated
    const wrappedRowHeight = typeof rowHeight === 'function'
      ? index => rowHeight({ index })
      : rowHeight

    return (
      <Grid
        ref='Grid'
        aria-label={this.props['aria-label']}
        className={classNames}
        columnWidth={width}
        columnCount={1}
        height={height}
        noContentRenderer={noRowsRenderer}
        onScroll={({ clientHeight, scrollHeight, scrollTop }) => onScroll({ clientHeight, scrollHeight, scrollTop })}
        onSectionRendered={({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) => onRowsRendered({
          overscanStartIndex: rowOverscanStartIndex,
          overscanStopIndex: rowOverscanStopIndex,
          startIndex: rowStartIndex,
          stopIndex: rowStopIndex
        })}
        overscanRowCount={overscanRowCount}
        cellRenderer={({ columnIndex, rowIndex }) => rowRenderer({ index: rowIndex })}
        rowHeight={wrappedRowHeight}
        rowCount={rowCount}
        scrollToRow={scrollToIndex}
        scrollTop={scrollTop}
        width={width}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
}
