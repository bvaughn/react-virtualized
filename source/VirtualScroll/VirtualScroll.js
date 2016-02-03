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
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ scrollTop }): void
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
    onScroll: () => null
  }

  /**
   * Forced recompute of row heights.
   * This function should be called if dynamic row heights have changed but nothing else has.
   * Since VirtualScroll receives a :rowsCount it has no way of knowing if the underlying list data has changed.
   */
  recomputeRowHeights () {
    this.refs.Grid.recomputeGridSize()
  }

  /**
   * Scroll the list to ensure the row at the specified index is visible.
   * This method exists so that a user can forcefully scroll to the same row twice.
   * (The :scrollToIndex property would not change in that case, so it would not be picked up by the component.)
   */
  scrollToRow (scrollToIndex) {
    this.refs.Grid.scrollToCell({
      scrollToColumn: 0,
      scrollToRow: scrollToIndex
    })
  }

  /**
   * Set the :scrollTop position within the inner scroll container.
   * Normally it is best to let VirtualScroll manage this properties or to use a method like :scrollToRow.
   * This method enables VirtualScroll to be scroll-synced to another react-virtualized component though.
   * It is appropriate to use in that case.
   */
  setScrollTop (scrollTop) {
    this.refs.Grid.setScrollPosition({
      scrollLeft: 0,
      scrollTop
    })
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
        onScroll={({ scrollTop }) => onScroll({ scrollTop })}
        onSectionRendered={({ rowStartIndex, rowStopIndex }) => onRowsRendered({
          startIndex: rowStartIndex,
          stopIndex: rowStopIndex
        })}
        renderCell={({ columnIndex, rowIndex }) => rowRenderer(rowIndex)}
        rowHeight={rowHeight}
        rowsCount={rowsCount}
        scrollToRow={scrollToIndex}
        width={width}
      />
    )
  }
}
