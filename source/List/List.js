/** @flow */

import type {
  NoContentRenderer,
  Alignment,
  CellSize,
  CellPosition,
  OverscanIndicesGetter,
  RenderedSection,
  CellRendererParams,
  Scroll as GridScroll,
} from '../Grid';
import type {RowRenderer, RenderedRows, Scroll} from './types';

import Grid, {accessibilityOverscanIndicesGetter} from '../Grid';
import * as React from 'react';
import clsx from 'clsx';

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */

type Props = {
  'aria-label'?: string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight: boolean,

  /** Optional CSS class name */
  className?: string,

  /**
   * Used to estimate the total height of a List before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize: number,

  /** Height constraint for list (determines how many actual rows are rendered) */
  height: number,

  /** Optional renderer to be used in place of rows when rowCount is 0 */
  noRowsRenderer: NoContentRenderer,

  /** Callback invoked with information about the slice of rows that were just rendered.  */

  onRowsRendered: (params: RenderedRows) => void,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll: (params: Scroll) => void,

  /** See Grid#overscanIndicesGetter */
  overscanIndicesGetter: OverscanIndicesGetter,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount: number,

  /** Either a fixed row height (number) or a function that returns the height of a row given its index.  */
  rowHeight: CellSize,

  /** Responsible for rendering a row given an index; ({ index: number }): node */
  rowRenderer: RowRenderer,

  /** Number of rows in list. */
  rowCount: number,

  /** See Grid#scrollToAlignment */
  scrollToAlignment: Alignment,

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex: number,

  /** Vertical offset. */
  scrollTop?: number,

  /** Optional inline style */
  style: Object,

  /** Tab index for focus */
  tabIndex?: number,

  /** Width of list */
  width: number,
};

export default class List extends React.PureComponent<Props> {
  static defaultProps = {
    autoHeight: false,
    estimatedRowSize: 30,
    onScroll: () => {},
    noRowsRenderer: () => null,
    onRowsRendered: () => {},
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {},
  };

  Grid: ?React.ElementRef<typeof Grid>;

  forceUpdateGrid() {
    if (this.Grid) {
      this.Grid.forceUpdate();
    }
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({alignment, index}: {alignment: Alignment, index: number}) {
    if (this.Grid) {
      const {scrollTop} = this.Grid.getOffsetForCell({
        alignment,
        rowIndex: index,
        columnIndex: 0,
      });

      return scrollTop;
    }
    return 0;
  }

  /** CellMeasurer compatibility */
  invalidateCellSizeAfterRender({columnIndex, rowIndex}: CellPosition) {
    if (this.Grid) {
      this.Grid.invalidateCellSizeAfterRender({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    if (this.Grid) {
      this.Grid.measureAllCells();
    }
  }

  /** CellMeasurer compatibility */
  recomputeGridSize({columnIndex = 0, rowIndex = 0}: CellPosition = {}) {
    if (this.Grid) {
      this.Grid.recomputeGridSize({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index: number = 0) {
    if (this.Grid) {
      this.Grid.recomputeGridSize({
        rowIndex: index,
        columnIndex: 0,
      });
    }
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop: number = 0) {
    if (this.Grid) {
      this.Grid.scrollToPosition({scrollTop});
    }
  }

  /** See Grid#scrollToCell */
  scrollToRow(index: number = 0) {
    if (this.Grid) {
      this.Grid.scrollToCell({
        columnIndex: 0,
        rowIndex: index,
      });
    }
  }

  render() {
    const {className, noRowsRenderer, scrollToIndex, width} = this.props;

    const classNames = clsx('ReactVirtualized__List', className);

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
    );
  }

  _cellRenderer = ({
    parent,
    rowIndex,
    style,
    isScrolling,
    isVisible,
    key,
  }: CellRendererParams) => {
    const {rowRenderer} = this.props;

    // TRICKY The style object is sometimes cached by Grid.
    // This prevents new style objects from bypassing shallowCompare().
    // However as of React 16, style props are auto-frozen (at least in dev mode)
    // Check to make sure we can still modify the style before proceeding.
    // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
    const {writable} = Object.getOwnPropertyDescriptor(style, 'width');
    if (writable) {
      // By default, List cells should be 100% width.
      // This prevents them from flowing under a scrollbar (if present).
      style.width = '100%';
    }

    return rowRenderer({
      index: rowIndex,
      style,
      isScrolling,
      isVisible,
      key,
      parent,
    });
  };

  _setRef = (ref: ?React.ElementRef<typeof Grid>) => {
    this.Grid = ref;
  };

  _onScroll = ({clientHeight, scrollHeight, scrollTop}: GridScroll) => {
    const {onScroll} = this.props;

    onScroll({clientHeight, scrollHeight, scrollTop});
  };

  _onSectionRendered = ({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex,
  }: RenderedSection) => {
    const {onRowsRendered} = this.props;

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex,
    });
  };
}
