/** @flow */

import type {
  Alignment,
  CellSizeGetter,
  OverscanIndicesGetterParams,
  OverscanIndices,
  RenderedSection,
  CellRendererParams,
  RowRendererParams,
  Scroll as GridScroll
} from "../types";

import Grid, { accessibilityOverscanIndicesGetter } from "../Grid";
import React from "react";
import cn from "classnames";

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */

type RenderedRows = {
  overscanStartIndex: number,
  overscanStopIndex: number,
  startIndex: number,
  stopIndex: number
};

type Scroll = {
  clientHeight: number,
  scrollHeight: number,
  scrollTop: number
};

type Props = {
  "aria-label"?: string,

  /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
  autoHeight?: boolean,

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
  noRowsRenderer: () => React.Element<*> | null,

  /**
     * Callback invoked with information about the slice of rows that were just rendered.
     */

  onRowsRendered: (params: RenderedRows) => void,

  /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     */
  onScroll: (params: Scroll) => void,

  /** See Grid#overscanIndicesGetter */
  overscanIndicesGetter: (
    params: OverscanIndicesGetterParams
  ) => OverscanIndices,

  /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
  overscanRowCount: number,

  /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
  rowHeight: CellSizeGetter | number,

  /** Responsible for rendering a row given an index; ({ index: number }): node */
  rowRenderer: (params: RowRendererParams) => React.Element<*>,

  /** Number of rows in list. */
  rowCount: number,

  /** See Grid#scrollToAlignment */
  scrollToAlignment: "auto" | "end" | "start" | "center",

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex: number,

  /** Vertical offset. */
  scrollTop?: number,

  /** Optional inline style */
  style: Object,

  /** Tab index for focus */
  tabIndex?: number,

  /** Width of list */
  width: number
};

export default class List extends React.PureComponent {
  static defaultProps = {
    estimatedRowSize: 30,
    onScroll: () => {},
    noRowsRenderer: () => null,
    onRowsRendered: () => {},
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    scrollToAlignment: "auto",
    scrollToIndex: -1,
    style: {}
  };

  props: Props;

  Grid: Grid;

  forceUpdateGrid() {
    this.Grid.forceUpdate();
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({
    alignment,
    index
  }: {
    alignment: Alignment,
    index: number
  }) {
    const { scrollTop } = this.Grid.getOffsetForCell({
      alignment,
      rowIndex: index,
      columnIndex: 0
    });

    return scrollTop;
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    this.Grid.measureAllCells();
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index: number = 0) {
    this.Grid.recomputeGridSize({
      rowIndex: index,
      columnIndex: 0
    });
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop: number = 0) {
    this.Grid.scrollToPosition({ scrollTop });
  }

  /** See Grid#scrollToCell */
  scrollToRow(index: number = 0) {
    this.Grid.scrollToCell({
      columnIndex: 0,
      rowIndex: index
    });
  }

  render() {
    const { className, noRowsRenderer, scrollToIndex, width } = this.props;

    const classNames = cn("ReactVirtualized__List", className);

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
    rowIndex,
    style,
    isScrolling,
    isVisible,
    key
  }: CellRendererParams) => {
    const { rowRenderer } = this.props;

    // TRICKY The style object is sometimes cached by Grid.
    // This prevents new style objects from bypassing shallowCompare().
    // However as of React 16, style props are auto-frozen (at least in dev mode)
    // Check to make sure we can still modify the style before proceeding.
    // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
    const { writable } = Object.getOwnPropertyDescriptor(style, "width");
    if (writable) {
      // By default, List cells should be 100% width.
      // This prevents them from flowing under a scrollbar (if present).
      style.width = "100%";
    }

    return rowRenderer({
      index: rowIndex,
      style,
      isScrolling,
      isVisible,
      key,
      parent: this
    });
  };

  _setRef = (ref: Grid) => {
    this.Grid = ref;
  };

  _onScroll = ({ clientHeight, scrollHeight, scrollTop }: GridScroll) => {
    const { onScroll } = this.props;

    onScroll({ clientHeight, scrollHeight, scrollTop });
  };

  _onSectionRendered = ({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex
  }: RenderedSection) => {
    const { onRowsRendered } = this.props;

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    });
  };
}
