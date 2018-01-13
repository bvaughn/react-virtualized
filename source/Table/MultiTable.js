/** @flow */

import type {CellPosition} from '../Grid';

import cn from 'classnames';
import Column from './Column';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import Grid, {accessibilityOverscanIndicesGetter} from '../Grid';
import defaultRowRenderer from './defaultRowRenderer';
import defaultHeaderRowRenderer from './defaultHeaderRowRenderer';
import Table from './Table';
import SortDirection from './SortDirection';

export default class MultiTable extends PureComponent {
  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
    autoHeight: PropTypes.bool,

    /** One or more Columns describing the data displayed in this row */
    children: props => {
      const children = React.Children.toArray(props.children);
      for (let i = 0; i < children.length; i++) {
        const childType = children[i].type;
        if (childType !== Column && !(childType.prototype instanceof Column)) {
          return new Error('Table only accepts children of type Column');
        }
      }
    },

    /** Optional CSS class name */
    className: PropTypes.string,

    /** Disable rendering the header at all */
    disableHeader: PropTypes.bool,

    /**
     * Used to estimate the total height of a Table before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize: PropTypes.number.isRequired,

    /** Optional custom CSS class name to attach to inner Grid element. */
    gridClassName: PropTypes.string,

    /** Optional inline style to attach to inner Grid element. */
    gridStyle: PropTypes.object,

    /** Optional CSS class to apply to all column headers */
    headerClassName: PropTypes.string,

    /** Fixed height of header row */
    headerHeight: PropTypes.number.isRequired,

    /**
     * Responsible for rendering a table row given an array of columns:
     * Should implement the following interface: ({
     *   className: string,
     *   columns: any[],
     *   style: any
     * }): PropTypes.node
     */
    headerRowRenderer: PropTypes.func,

    /** Optional custom inline style to attach to table header columns. */
    headerStyle: PropTypes.object,

    /** Fixed/available height for out DOM element */
    height: PropTypes.number.isRequired,

    /** Optional id */
    id: PropTypes.string,

    /** Optional renderer to be used in place of table body rows when rowCount is 0 */
    noRowsRenderer: PropTypes.func,

    /**
     * Optional callback when a column's header is clicked.
     * ({ columnData: any, dataKey: string }): void
     */
    onHeaderClick: PropTypes.func,

    /**
     * Callback invoked when a user clicks on a table row.
     * ({ index: number }): void
     */
    onRowClick: PropTypes.func,

    /**
     * Callback invoked when a user double-clicks on a table row.
     * ({ index: number }): void
     */
    onRowDoubleClick: PropTypes.func,

    /**
     * Callback invoked when the mouse leaves a table row.
     * ({ index: number }): void
     */
    onRowMouseOut: PropTypes.func,

    /**
     * Callback invoked when a user moves the mouse over a table row.
     * ({ index: number }): void
     */
    onRowMouseOver: PropTypes.func,

    /**
     * Callback invoked when a user right-clicks on a table row.
     * ({ index: number }): void
     */
    onRowRightClick: PropTypes.func,

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

    /** See Grid#overscanIndicesGetter */
    overscanIndicesGetter: PropTypes.func.isRequired,

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
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
      .isRequired,

    /** Number of rows in table. */
    rowCount: PropTypes.number.isRequired,

    /**
     * Responsible for rendering a table row given an array of columns:
     * Should implement the following interface: ({
     *   className: string,
     *   columns: Array,
     *   index: number,
     *   isScrolling: boolean,
     *   onRowClick: ?Function,
     *   onRowDoubleClick: ?Function,
     *   onRowMouseOver: ?Function,
     *   onRowMouseOut: ?Function,
     *   rowData: any,
     *   style: any
     * }): PropTypes.node
     */
    rowRenderer: PropTypes.func,

    /** Optional custom inline style to attach to table rows. */
    rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
      .isRequired,

    /** See Grid#scrollToAlignment */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center'])
      .isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number.isRequired,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /**
     * Sort function to be called if a sortable header is clicked.
     * ({ sortBy: string[], sortDirection: SortDirection[] }): void
     */
    sort: PropTypes.func,

    /** Table data is currently sorted by these :dataKey (if it is sorted at all) */
    sortBy: PropTypes.arrayOf(PropTypes.string),

    /** Table data is currently sorted in these directions (if it is sorted at all) */
    sortDirection: PropTypes.arrayOf(
      PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    ),

    /** Optional inline style */
    style: PropTypes.object,

    /** Tab index for focus */
    tabIndex: PropTypes.number,

    /** Width of list */
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    disableHeader: false,
    estimatedRowSize: 30,
    headerHeight: 0,
    headerStyle: {},
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    rowRenderer: defaultRowRenderer,
    headerRowRenderer: defaultHeaderRowRenderer,
    rowStyle: {},
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    sortBy: [],
    sortDirection: [],
    style: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollbarWidth: 0,
    };

    this._calcNewSort = this._calcNewSort.bind(this);
    this._sortState = this._sortState.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  forceUpdateGrid() {
    this.Table.forceUpdateGrid();
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({alignment, index}) {
    return this.Table.getOffsetForRow({alignment, index});
  }

  /** CellMeasurer compatibility */
  invalidateCellSizeAfterRender({columnIndex, rowIndex}: CellPosition) {
    this.Table.invalidateCellSizeAfterRender({columnIndex, rowIndex});
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    this.Table.measureAllRows();
  }

  /** CellMeasurer compatibility */
  recomputeGridSize({columnIndex = 0, rowIndex = 0}: CellPosition = {}) {
    this.Table.recomputeGridSize({columnIndex, rowIndex});
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index = 0) {
    this.Table.recomputeRowHeights(index);
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop = 0) {
    this.Table.scrollToPosition(scrollTop);
  }

  /** See Grid#scrollToCell */
  scrollToRow(index = 0) {
    this.Table.scrollToRow(index);
  }

  render() {
    const {sortBy, sortDirection, ...props} = this.props;
    return (
      <Table
        ref={this._setRef}
        {...props}
        calcNewSort={this._calcNewSort}
        sortState={this._sortState}
      />
    );
  }

  get Grid() {
    return this.Table.Grid;
  }

  _calcNewSort({dataKey, defaultSortDirection, event}) {
    let {sortBy, sortDirection} = this.props;
    const index = sortBy.findIndex(o => o === dataKey);
    if (event.shiftKey) {
      // If this is the firstTime sort of this column, add column default sort
      // order to sort info. Otherwise, invert the direction of the sort.
      if (index === -1) {
        sortBy = sortBy.slice();
        sortDirection = sortDirection.slice();

        sortBy.push(dataKey);
        sortDirection.push(defaultSortDirection);
      } else {
        // no need to slice sortBy
        sortDirection = sortDirection.slice();
        sortDirection[index] =
          sortDirection[index] === SortDirection.DESC
            ? SortDirection.ASC
            : SortDirection.DESC;
      }
    } else if (event.ctrlKey) {
      // If this column is sorted by, removed it from sort.
      if (index !== -1) {
        sortBy = sortBy.slice();
        sortDirection = sortDirection.slice();

        sortBy.splice(index, 1);
        sortDirection.splice(index, 1);
      }
    } else {
      // If this is the firstTime sort of this column, use the column default
      // sort order. Otherwise, invert the direction of the sort.
      sortBy = [dataKey];
      sortDirection = [
        index === -1
          ? defaultSortDirection
          : sortDirection[index] === SortDirection.DESC
            ? SortDirection.ASC
            : SortDirection.DESC,
      ];
    }

    return {
      sortBy,
      sortDirection,
    };
  }

  _sortState({dataKey}) {
    const {sortBy, sortDirection} = this.props;
    const index = sortBy.findIndex(o => o === dataKey);
    if (index !== -1) {
      return {sortDirection: sortDirection[index]};
    }

    return {};
  }

  _setRef(ref) {
    this.Table = ref;
  }
}
