/** @flow */
import Grid, { accessibilityOverscanIndicesGetter } from '../Grid'
import React, { PropTypes, PureComponent } from 'react'
import cn from 'classnames'

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export default class List extends PureComponent {
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
     * Used to estimate the total height of a List before all of its rows have actually been measured.
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
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll: PropTypes.func.isRequired,

    /** See Grid#overscanIndicesGetter */
    overscanIndicesGetter: PropTypes.func.isRequired,

    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowCount: PropTypes.number.isRequired,

    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

    /** Responsible for rendering a row given an index; ({ index: number }): node */
    rowRenderer: PropTypes.func.isRequired,

    /** Number of rows in list. */
    rowCount: PropTypes.number.isRequired,

    /** See Grid#scrollToAlignment */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number.isRequired,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /** Optional inline style */
    style: PropTypes.object,

    /** Tab index for focus */
    tabIndex: PropTypes.number,

    /** Width of list */
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    estimatedRowSize: 30,
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {}
  };

  constructor (props, context) {
    super(props, context)

    this._cellRenderer = this._cellRenderer.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._onSectionRendered = this._onSectionRendered.bind(this)
    this._setRef = this._setRef.bind(this)
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
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow ({
    alignment,
    index
  }) {
    const { scrollTop } = this.Grid.getOffsetForCell({
      alignment,
      rowIndex: index
    })

    return scrollTop
  }

  /** See Grid#scrollToCell */
  scrollToRow (index = 0) {
    this.Grid.scrollToCell({
      columnIndex: 0,
      rowIndex: index
    })
  }

  /** See Grid#scrollToPosition */
  scrollToPosition (scrollTop = 0) {
    this.Grid.scrollToPosition({ scrollTop })
  }

  render () {
    const {
      className,
      noRowsRenderer,
      scrollToIndex,
      width
    } = this.props

    const classNames = cn('ReactVirtualized__List', className)

    return (
      <Grid
        {...this.props}
        autoContainerWidth
        cellRenderer={this._cellRenderer}
        className={classNames}
        columnWidth={width}
        columnCount={1}
        noContentRenderer={noRowsRenderer}
        onScroll={this._onScroll}
        onSectionRendered={this._onSectionRendered}
        ref={this._setRef}
        scrollToRow={scrollToIndex}
      />
    )
  }

  _cellRenderer ({ rowIndex, style, ...rest }) {
    const { rowRenderer } = this.props

    // TRICKY The style object is sometimes cached by Grid.
    // This prevents new style objects from bypassing shallowCompare().
    // However as of React 16, style props are auto-frozen (at least in dev mode)
    // Check to make sure we can still modify the style before proceeding.
    // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
    const { writable } = Object.getOwnPropertyDescriptor(style, 'width')
    if (writable) {
      // By default, List cells should be 100% width.
      // This prevents them from flowing under a scrollbar (if present).
      style.width = '100%'
    }

    return rowRenderer({
      index: rowIndex,
      style,
      ...rest
    })
  }

  _setRef (ref) {
    this.Grid = ref
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
