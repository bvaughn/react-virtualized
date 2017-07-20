/** @flow */
import cn from "classnames";
import Column from "./Column";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import Grid, { accessibilityOverscanIndicesGetter } from "../Grid";
import defaultRowRenderer from "./defaultRowRenderer";
import defaultHeaderRowRenderer from "./defaultHeaderRowRenderer";
import SortDirection from "./SortDirection";

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
export default class Table extends PureComponent {
  static propTypes = {
    "aria-label": PropTypes.string,

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
          return new Error("Table only accepts children of type Column");
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
    scrollToAlignment: PropTypes.oneOf(["auto", "end", "start", "center"])
      .isRequired,

    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number.isRequired,

    /** Vertical offset. */
    scrollTop: PropTypes.number,

    /**
     * Sort function to be called if a sortable header is clicked.
     * ({ sortBy: string, sortDirection: SortDirection }): void
     */
    sort: PropTypes.func,

    /** Table data is currently sorted by this :dataKey (if it is sorted at all) */
    sortBy: PropTypes.string,

    /** Table data is currently sorted in this direction (if it is sorted at all) */
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),

    /** Optional inline style */
    style: PropTypes.object,

    /** Tab index for focus */
    tabIndex: PropTypes.number,

    /** Width of list */
    width: PropTypes.number.isRequired
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
    scrollToAlignment: "auto",
    scrollToIndex: -1,
    style: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollbarWidth: 0
    };

    this._createColumn = this._createColumn.bind(this);
    this._createRow = this._createRow.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onSectionRendered = this._onSectionRendered.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  forceUpdateGrid() {
    this.Grid.forceUpdate();
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({ alignment, index }) {
    const { scrollTop } = this.Grid.getOffsetForCell({
      alignment,
      rowIndex: index
    });

    return scrollTop;
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    this.Grid.measureAllCells();
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index = 0) {
    this.Grid.recomputeGridSize({
      rowIndex: index
    });
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop = 0) {
    this.Grid.scrollToPosition({ scrollTop });
  }

  /** See Grid#scrollToCell */
  scrollToRow(index = 0) {
    this.Grid.scrollToCell({
      columnIndex: 0,
      rowIndex: index
    });
  }

  componentDidMount() {
    this._setScrollbarWidth();
  }

  componentDidUpdate() {
    this._setScrollbarWidth();
  }

  render() {
    const {
      children,
      className,
      disableHeader,
      gridClassName,
      gridStyle,
      headerHeight,
      headerRowRenderer,
      height,
      id,
      noRowsRenderer,
      rowClassName,
      rowStyle,
      scrollToIndex,
      style,
      width
    } = this.props;
    const { scrollbarWidth } = this.state;

    const availableRowsHeight = disableHeader ? height : height - headerHeight;

    const rowClass =
      typeof rowClassName === "function"
        ? rowClassName({ index: -1 })
        : rowClassName;
    const rowStyleObject =
      typeof rowStyle === "function" ? rowStyle({ index: -1 }) : rowStyle;

    // Precompute and cache column styles before rendering rows and columns to speed things up
    this._cachedColumnStyles = [];
    React.Children.toArray(children).forEach((column, index) => {
      const flexStyles = this._getFlexStyleForColumn(
        column,
        column.props.style
      );

      this._cachedColumnStyles[index] = {
        ...flexStyles,
        overflow: "hidden"
      };
    });

    // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
    // This is done because Grid is a pure component and won't update unless its properties or state has changed.
    // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.
    return (
      <div
        className={cn("ReactVirtualized__Table", className)}
        id={id}
        role="grid"
        style={style}
      >
        {!disableHeader &&
          headerRowRenderer({
            className: cn("ReactVirtualized__Table__headerRow", rowClass),
            columns: this._getHeaderColumns(),
            style: {
              ...rowStyleObject,
              height: headerHeight,
              overflow: "hidden",
              paddingRight: scrollbarWidth,
              width: width
            }
          })}

        <Grid
          {...this.props}
          autoContainerWidth
          className={cn("ReactVirtualized__Table__Grid", gridClassName)}
          cellRenderer={this._createRow}
          columnWidth={width}
          columnCount={1}
          height={availableRowsHeight}
          id={undefined}
          noContentRenderer={noRowsRenderer}
          onScroll={this._onScroll}
          onSectionRendered={this._onSectionRendered}
          ref={this._setRef}
          role="rowgroup"
          scrollbarWidth={scrollbarWidth}
          scrollToRow={scrollToIndex}
          style={{
            ...gridStyle,
            overflowX: "hidden"
          }}
        />
      </div>
    );
  }

  _createColumn({
    column,
    columnIndex,
    isScrolling,
    parent,
    rowData,
    rowIndex
  }) {
    const {
      cellDataGetter,
      cellRenderer,
      className,
      columnData,
      dataKey,
      id
    } = column.props;

    const cellData = cellDataGetter({ columnData, dataKey, rowData });
    const renderedCell = cellRenderer({
      cellData,
      columnData,
      columnIndex,
      dataKey,
      isScrolling,
      parent,
      rowData,
      rowIndex
    });

    const style = this._cachedColumnStyles[columnIndex];

    const title = typeof renderedCell === "string" ? renderedCell : null;

    const a11yProps = {
      role: "gridcell"
    };

    if (id) {
      a11yProps["aria-describedby"] = id;
    }

    return (
      <div
        {...a11yProps}
        key={`Row${rowIndex}-Col${columnIndex}`}
        className={cn("ReactVirtualized__Table__rowColumn", className)}
        style={style}
        title={title}
      >
        {renderedCell}
      </div>
    );
  }

  _createHeader({ column, index }) {
    const {
      headerClassName,
      headerStyle,
      onHeaderClick,
      sort,
      sortBy,
      sortDirection
    } = this.props;
    const {
      dataKey,
      disableSort,
      headerRenderer,
      id,
      label,
      columnData
    } = column.props;
    const sortEnabled = !disableSort && sort;

    const classNames = cn(
      "ReactVirtualized__Table__headerColumn",
      headerClassName,
      column.props.headerClassName,
      {
        ReactVirtualized__Table__sortableHeaderColumn: sortEnabled
      }
    );
    const style = this._getFlexStyleForColumn(column, headerStyle);

    const renderedHeader = headerRenderer({
      columnData,
      dataKey,
      disableSort,
      label,
      sortBy,
      sortDirection
    });

    const a11yProps = {
      role: "columnheader"
    };

    if (sortEnabled || onHeaderClick) {
      // If this is a sortable header, clicking it should update the table data's sorting.
      const newSortDirection =
        sortBy !== dataKey || sortDirection === SortDirection.DESC
          ? SortDirection.ASC
          : SortDirection.DESC;

      const onClick = event => {
        sortEnabled &&
          sort({
            sortBy: dataKey,
            sortDirection: newSortDirection
          });
        onHeaderClick && onHeaderClick({ columnData, dataKey, event });
      };

      const onKeyDown = event => {
        if (event.key === "Enter" || event.key === " ") {
          onClick(event);
        }
      };

      a11yProps["aria-label"] = column.props["aria-label"] || label || dataKey;
      a11yProps.tabIndex = 0;
      a11yProps.onClick = onClick;
      a11yProps.onKeyDown = onKeyDown;
    }

    if (sortBy === dataKey) {
      a11yProps["aria-sort"] =
        sortDirection === SortDirection.ASC ? "ascending" : "descending";
    }

    if (id) {
      a11yProps.id = id;
    }

    return (
      <div
        {...a11yProps}
        key={`Header-Col${index}`}
        className={classNames}
        style={style}
      >
        {renderedHeader}
      </div>
    );
  }

  _createRow({ rowIndex: index, isScrolling, key, parent, style }) {
    const {
      children,
      onRowClick,
      onRowDoubleClick,
      onRowRightClick,
      onRowMouseOver,
      onRowMouseOut,
      rowClassName,
      rowGetter,
      rowRenderer,
      rowStyle
    } = this.props;

    const { scrollbarWidth } = this.state;

    const rowClass =
      typeof rowClassName === "function"
        ? rowClassName({ index })
        : rowClassName;
    const rowStyleObject =
      typeof rowStyle === "function" ? rowStyle({ index }) : rowStyle;
    const rowData = rowGetter({ index });

    const columns = React.Children
      .toArray(children)
      .map((column, columnIndex) =>
        this._createColumn({
          column,
          columnIndex,
          isScrolling,
          parent,
          rowData,
          rowIndex: index,
          scrollbarWidth
        })
      );

    const className = cn("ReactVirtualized__Table__row", rowClass);
    const flattenedStyle = {
      ...style,
      ...rowStyleObject,
      height: this._getRowHeight(index),
      overflow: "hidden",
      paddingRight: scrollbarWidth
    };

    return rowRenderer({
      className,
      columns,
      index,
      isScrolling,
      key,
      onRowClick,
      onRowDoubleClick,
      onRowRightClick,
      onRowMouseOver,
      onRowMouseOut,
      rowData,
      style: flattenedStyle
    });
  }

  /**
   * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
   */
  _getFlexStyleForColumn(column, customStyle = {}) {
    const flexValue = `${column.props.flexGrow} ${column.props
      .flexShrink} ${column.props.width}px`;

    const style = {
      ...customStyle,
      flex: flexValue,
      msFlex: flexValue,
      WebkitFlex: flexValue
    };

    if (column.props.maxWidth) {
      style.maxWidth = column.props.maxWidth;
    }

    if (column.props.minWidth) {
      style.minWidth = column.props.minWidth;
    }

    return style;
  }

  _getHeaderColumns() {
    const { children, disableHeader } = this.props;
    const items = disableHeader ? [] : React.Children.toArray(children);

    return items.map((column, index) => this._createHeader({ column, index }));
  }

  _getRowHeight(rowIndex) {
    const { rowHeight } = this.props;

    return typeof rowHeight === "function"
      ? rowHeight({ index: rowIndex })
      : rowHeight;
  }

  _onScroll({ clientHeight, scrollHeight, scrollTop }) {
    const { onScroll } = this.props;

    onScroll({ clientHeight, scrollHeight, scrollTop });
  }

  _onSectionRendered({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex
  }) {
    const { onRowsRendered } = this.props;

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    });
  }

  _setRef(ref) {
    this.Grid = ref;
  }

  _setScrollbarWidth() {
    const Grid = findDOMNode(this.Grid);
    const clientWidth = Grid.clientWidth || 0;
    const offsetWidth = Grid.offsetWidth || 0;
    const scrollbarWidth = offsetWidth - clientWidth;

    this.setState({ scrollbarWidth });
  }
}
