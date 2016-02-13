/** @flow */
import Grid from '../Grid'
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export default class VirtualScroll extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /** Optional CSS class name */
    className: PropTypes.string,
    /** Height constraint for list (determines how many actual rows are rendered) */
    height: PropTypes.number.isRequired,
    /** Optional renderer to be used in place of rows when rowsCount is 0 */
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
    overscanRowsCount: PropTypes.number.isRequired,
    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll: PropTypes.func.isRequired,
    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * (index: number): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
    /** Responsbile for rendering a row given an index */
    rowRenderer: PropTypes.func.isRequired,
    /** Number of rows in list. */
    rowsCount: PropTypes.number.isRequired,
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,
    /** Width of list */
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowsCount: 10
  }

  /**
   * See Grid#recomputeGridSize
   */
  recomputeRowHeights () {
    this.refs.Grid.recomputeGridSize()
  }

  /**
   * See Grid#scrollToCell
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
    scrollTop = Number.isNaN(scrollTop) ? 0 : scrollTop

    this.setState({ scrollTop })
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
      overscanRowsCount,
      rowsCount,
      scrollToIndex,
      width
    } = this.props

    const classNames = cn('VirtualScroll', className)

    return (
      <Grid
        ref='Grid'
        className={classNames}
        columnWidth={width}
        columnsCount={1}
        height={height}
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
    )
  }
}
