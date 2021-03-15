'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _extends2 = _interopRequireDefault(
  require('@babel/runtime/helpers/extends'),
);

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var _clsx = _interopRequireDefault(require('clsx'));

var _Column = _interopRequireDefault(require('./Column'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var React = _interopRequireWildcard(require('react'));

var _reactDom = require('react-dom');

var _Grid2 = _interopRequireWildcard(require('../Grid'));

var _defaultRowRenderer = _interopRequireDefault(
  require('./defaultRowRenderer'),
);

var _defaultHeaderRowRenderer = _interopRequireDefault(
  require('./defaultHeaderRowRenderer'),
);

var _SortDirection = _interopRequireDefault(require('./SortDirection'));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function() {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
var Table = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(Table, _React$PureComponent);

  var _super = _createSuper(Table);

  function Table(props) {
    var _this;

    (0, _classCallCheck2['default'])(this, Table);
    _this = _super.call(this, props);
    _this.state = {
      scrollbarWidth: 0,
    };
    _this._createColumn = _this._createColumn.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._createRow = _this._createRow.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._onScroll = _this._onScroll.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._onSectionRendered = _this._onSectionRendered.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._setRef = _this._setRef.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    return _this;
  }

  (0, _createClass2['default'])(Table, [
    {
      key: 'forceUpdateGrid',
      value: function forceUpdateGrid() {
        if (this.Grid) {
          this.Grid.forceUpdate();
        }
      },
      /** See Grid#getOffsetForCell */
    },
    {
      key: 'getOffsetForRow',
      value: function getOffsetForRow(_ref) {
        var alignment = _ref.alignment,
          index = _ref.index;

        if (this.Grid) {
          var _this$Grid$getOffsetF = this.Grid.getOffsetForCell({
              alignment: alignment,
              rowIndex: index,
            }),
            scrollTop = _this$Grid$getOffsetF.scrollTop;

          return scrollTop;
        }

        return 0;
      },
      /** CellMeasurer compatibility */
    },
    {
      key: 'invalidateCellSizeAfterRender',
      value: function invalidateCellSizeAfterRender(_ref2) {
        var columnIndex = _ref2.columnIndex,
          rowIndex = _ref2.rowIndex;

        if (this.Grid) {
          this.Grid.invalidateCellSizeAfterRender({
            rowIndex: rowIndex,
            columnIndex: columnIndex,
          });
        }
      },
      /** See Grid#measureAllCells */
    },
    {
      key: 'measureAllRows',
      value: function measureAllRows() {
        if (this.Grid) {
          this.Grid.measureAllCells();
        }
      },
      /** CellMeasurer compatibility */
    },
    {
      key: 'recomputeGridSize',
      value: function recomputeGridSize() {
        var _ref3 =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {},
          _ref3$columnIndex = _ref3.columnIndex,
          columnIndex = _ref3$columnIndex === void 0 ? 0 : _ref3$columnIndex,
          _ref3$rowIndex = _ref3.rowIndex,
          rowIndex = _ref3$rowIndex === void 0 ? 0 : _ref3$rowIndex;

        if (this.Grid) {
          this.Grid.recomputeGridSize({
            rowIndex: rowIndex,
            columnIndex: columnIndex,
          });
        }
      },
      /** See Grid#recomputeGridSize */
    },
    {
      key: 'recomputeRowHeights',
      value: function recomputeRowHeights() {
        var index =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        if (this.Grid) {
          this.Grid.recomputeGridSize({
            rowIndex: index,
          });
        }
      },
      /** See Grid#scrollToPosition */
    },
    {
      key: 'scrollToPosition',
      value: function scrollToPosition() {
        var scrollTop =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        if (this.Grid) {
          this.Grid.scrollToPosition({
            scrollTop: scrollTop,
          });
        }
      },
      /** See Grid#scrollToCell */
    },
    {
      key: 'scrollToRow',
      value: function scrollToRow() {
        var index =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        if (this.Grid) {
          this.Grid.scrollToCell({
            columnIndex: 0,
            rowIndex: index,
          });
        }
      },
    },
    {
      key: 'getScrollbarWidth',
      value: function getScrollbarWidth() {
        if (this.Grid) {
          var _Grid = (0, _reactDom.findDOMNode)(this.Grid);

          var clientWidth = _Grid.clientWidth || 0;
          var offsetWidth = _Grid.offsetWidth || 0;
          return offsetWidth - clientWidth;
        }

        return 0;
      },
    },
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._setScrollbarWidth();
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this._setScrollbarWidth();
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          disableHeader = _this$props.disableHeader,
          gridClassName = _this$props.gridClassName,
          gridStyle = _this$props.gridStyle,
          headerHeight = _this$props.headerHeight,
          headerRowRenderer = _this$props.headerRowRenderer,
          height = _this$props.height,
          id = _this$props.id,
          noRowsRenderer = _this$props.noRowsRenderer,
          rowClassName = _this$props.rowClassName,
          rowStyle = _this$props.rowStyle,
          scrollToIndex = _this$props.scrollToIndex,
          style = _this$props.style,
          width = _this$props.width;
        var scrollbarWidth = this.state.scrollbarWidth;
        var availableRowsHeight = disableHeader
          ? height
          : height - headerHeight;
        var rowClass =
          typeof rowClassName === 'function'
            ? rowClassName({
                index: -1,
              })
            : rowClassName;
        var rowStyleObject =
          typeof rowStyle === 'function'
            ? rowStyle({
                index: -1,
              })
            : rowStyle; // Precompute and cache column styles before rendering rows and columns to speed things up

        this._cachedColumnStyles = [];
        React.Children.toArray(children).forEach(function(column, index) {
          var flexStyles = _this2._getFlexStyleForColumn(
            column,
            column.props.style,
          );

          _this2._cachedColumnStyles[index] = _objectSpread(
            {
              overflow: 'hidden',
            },
            flexStyles,
          );
        }); // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
        // This is done because Grid is a pure component and won't update unless its properties or state has changed.
        // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.

        return /*#__PURE__*/ React.createElement(
          'div',
          {
            'aria-label': this.props['aria-label'],
            'aria-labelledby': this.props['aria-labelledby'],
            'aria-colcount': React.Children.toArray(children).length,
            'aria-rowcount': this.props.rowCount,
            className: (0, _clsx['default'])(
              'ReactVirtualized__Table',
              className,
            ),
            id: id,
            role: 'grid',
            style: style,
          },
          !disableHeader &&
            headerRowRenderer({
              className: (0, _clsx['default'])(
                'ReactVirtualized__Table__headerRow',
                rowClass,
              ),
              columns: this._getHeaderColumns(),
              style: _objectSpread(
                {
                  height: headerHeight,
                  overflow: 'hidden',
                  paddingRight: scrollbarWidth,
                  width: width,
                },
                rowStyleObject,
              ),
            }),
          /*#__PURE__*/ React.createElement(
            _Grid2['default'],
            (0, _extends2['default'])({}, this.props, {
              'aria-readonly': null,
              autoContainerWidth: true,
              className: (0, _clsx['default'])(
                'ReactVirtualized__Table__Grid',
                gridClassName,
              ),
              cellRenderer: this._createRow,
              columnWidth: width,
              columnCount: 1,
              height: availableRowsHeight,
              id: undefined,
              noContentRenderer: noRowsRenderer,
              onScroll: this._onScroll,
              onSectionRendered: this._onSectionRendered,
              ref: this._setRef,
              role: 'rowgroup',
              scrollbarWidth: scrollbarWidth,
              scrollToRow: scrollToIndex,
              style: _objectSpread(
                _objectSpread({}, gridStyle),
                {},
                {
                  overflowX: 'hidden',
                },
              ),
            }),
          ),
        );
      },
    },
    {
      key: '_createColumn',
      value: function _createColumn(_ref4) {
        var column = _ref4.column,
          columnIndex = _ref4.columnIndex,
          isScrolling = _ref4.isScrolling,
          parent = _ref4.parent,
          rowData = _ref4.rowData,
          rowIndex = _ref4.rowIndex;
        var onColumnClick = this.props.onColumnClick;
        var _column$props = column.props,
          cellDataGetter = _column$props.cellDataGetter,
          cellRenderer = _column$props.cellRenderer,
          className = _column$props.className,
          columnData = _column$props.columnData,
          dataKey = _column$props.dataKey,
          id = _column$props.id;
        var cellData = cellDataGetter({
          columnData: columnData,
          dataKey: dataKey,
          rowData: rowData,
        });
        var renderedCell = cellRenderer({
          cellData: cellData,
          columnData: columnData,
          columnIndex: columnIndex,
          dataKey: dataKey,
          isScrolling: isScrolling,
          parent: parent,
          rowData: rowData,
          rowIndex: rowIndex,
        });

        var onClick = function onClick(event) {
          onColumnClick &&
            onColumnClick({
              columnData: columnData,
              dataKey: dataKey,
              event: event,
            });
        };

        var style = this._cachedColumnStyles[columnIndex];
        var title = typeof renderedCell === 'string' ? renderedCell : null; // Avoid using object-spread syntax with multiple objects here,
        // Since it results in an extra method call to 'babel-runtime/helpers/extends'
        // See PR https://github.com/bvaughn/react-virtualized/pull/942

        return /*#__PURE__*/ React.createElement(
          'div',
          {
            'aria-colindex': columnIndex + 1,
            'aria-describedby': id,
            className: (0, _clsx['default'])(
              'ReactVirtualized__Table__rowColumn',
              className,
            ),
            key: 'Row' + rowIndex + '-' + 'Col' + columnIndex,
            onClick: onClick,
            role: 'gridcell',
            style: style,
            title: title,
          },
          renderedCell,
        );
      },
    },
    {
      key: '_createHeader',
      value: function _createHeader(_ref5) {
        var column = _ref5.column,
          index = _ref5.index;
        var _this$props2 = this.props,
          headerClassName = _this$props2.headerClassName,
          headerStyle = _this$props2.headerStyle,
          onHeaderClick = _this$props2.onHeaderClick,
          sort = _this$props2.sort,
          sortBy = _this$props2.sortBy,
          sortDirection = _this$props2.sortDirection;
        var _column$props2 = column.props,
          columnData = _column$props2.columnData,
          dataKey = _column$props2.dataKey,
          defaultSortDirection = _column$props2.defaultSortDirection,
          disableSort = _column$props2.disableSort,
          headerRenderer = _column$props2.headerRenderer,
          id = _column$props2.id,
          label = _column$props2.label;
        var sortEnabled = !disableSort && sort;
        var classNames = (0, _clsx['default'])(
          'ReactVirtualized__Table__headerColumn',
          headerClassName,
          column.props.headerClassName,
          {
            ReactVirtualized__Table__sortableHeaderColumn: sortEnabled,
          },
        );

        var style = this._getFlexStyleForColumn(
          column,
          _objectSpread(
            _objectSpread({}, headerStyle),
            column.props.headerStyle,
          ),
        );

        var renderedHeader = headerRenderer({
          columnData: columnData,
          dataKey: dataKey,
          disableSort: disableSort,
          label: label,
          sortBy: sortBy,
          sortDirection: sortDirection,
        });
        var headerOnClick,
          headerOnKeyDown,
          headerTabIndex,
          headerAriaSort,
          headerAriaLabel;

        if (sortEnabled || onHeaderClick) {
          // If this is a sortable header, clicking it should update the table data's sorting.
          var isFirstTimeSort = sortBy !== dataKey; // If this is the firstTime sort of this column, use the column default sort order.
          // Otherwise, invert the direction of the sort.

          var newSortDirection = isFirstTimeSort
            ? defaultSortDirection
            : sortDirection === _SortDirection['default'].DESC
            ? _SortDirection['default'].ASC
            : _SortDirection['default'].DESC;

          var onClick = function onClick(event) {
            sortEnabled &&
              sort({
                defaultSortDirection: defaultSortDirection,
                event: event,
                sortBy: dataKey,
                sortDirection: newSortDirection,
              });
            onHeaderClick &&
              onHeaderClick({
                columnData: columnData,
                dataKey: dataKey,
                event: event,
              });
          };

          var onKeyDown = function onKeyDown(event) {
            if (event.key === 'Enter' || event.key === ' ') {
              onClick(event);
            }
          };

          headerAriaLabel = column.props['aria-label'] || label || dataKey;
          headerAriaSort = 'none';
          headerTabIndex = 0;
          headerOnClick = onClick;
          headerOnKeyDown = onKeyDown;
        }

        if (sortBy === dataKey) {
          headerAriaSort =
            sortDirection === _SortDirection['default'].ASC
              ? 'ascending'
              : 'descending';
        } // Avoid using object-spread syntax with multiple objects here,
        // Since it results in an extra method call to 'babel-runtime/helpers/extends'
        // See PR https://github.com/bvaughn/react-virtualized/pull/942

        return /*#__PURE__*/ React.createElement(
          'div',
          {
            'aria-label': headerAriaLabel,
            'aria-sort': headerAriaSort,
            className: classNames,
            id: id,
            key: 'Header-Col' + index,
            onClick: headerOnClick,
            onKeyDown: headerOnKeyDown,
            role: 'columnheader',
            style: style,
            tabIndex: headerTabIndex,
          },
          renderedHeader,
        );
      },
    },
    {
      key: '_createRow',
      value: function _createRow(_ref6) {
        var _this3 = this;

        var index = _ref6.rowIndex,
          isScrolling = _ref6.isScrolling,
          key = _ref6.key,
          parent = _ref6.parent,
          style = _ref6.style;
        var _this$props3 = this.props,
          children = _this$props3.children,
          onRowClick = _this$props3.onRowClick,
          onRowDoubleClick = _this$props3.onRowDoubleClick,
          onRowRightClick = _this$props3.onRowRightClick,
          onRowMouseOver = _this$props3.onRowMouseOver,
          onRowMouseOut = _this$props3.onRowMouseOut,
          rowClassName = _this$props3.rowClassName,
          rowGetter = _this$props3.rowGetter,
          rowRenderer = _this$props3.rowRenderer,
          rowStyle = _this$props3.rowStyle;
        var scrollbarWidth = this.state.scrollbarWidth;
        var rowClass =
          typeof rowClassName === 'function'
            ? rowClassName({
                index: index,
              })
            : rowClassName;
        var rowStyleObject =
          typeof rowStyle === 'function'
            ? rowStyle({
                index: index,
              })
            : rowStyle;
        var rowData = rowGetter({
          index: index,
        });
        var columns = React.Children.toArray(children).map(function(
          column,
          columnIndex,
        ) {
          return _this3._createColumn({
            column: column,
            columnIndex: columnIndex,
            isScrolling: isScrolling,
            parent: parent,
            rowData: rowData,
            rowIndex: index,
            scrollbarWidth: scrollbarWidth,
          });
        });
        var className = (0, _clsx['default'])(
          'ReactVirtualized__Table__row',
          rowClass,
        );

        var flattenedStyle = _objectSpread(
          _objectSpread({}, style),
          {},
          {
            height: this._getRowHeight(index),
            overflow: 'hidden',
            paddingRight: scrollbarWidth,
          },
          rowStyleObject,
        );

        return rowRenderer({
          className: className,
          columns: columns,
          index: index,
          isScrolling: isScrolling,
          key: key,
          onRowClick: onRowClick,
          onRowDoubleClick: onRowDoubleClick,
          onRowRightClick: onRowRightClick,
          onRowMouseOver: onRowMouseOver,
          onRowMouseOut: onRowMouseOut,
          rowData: rowData,
          style: flattenedStyle,
        });
      },
      /**
       * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
       */
    },
    {
      key: '_getFlexStyleForColumn',
      value: function _getFlexStyleForColumn(column) {
        var customStyle =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        var flexValue = ''
          .concat(column.props.flexGrow, ' ')
          .concat(column.props.flexShrink, ' ')
          .concat(column.props.width, 'px');

        var style = _objectSpread(
          _objectSpread({}, customStyle),
          {},
          {
            flex: flexValue,
            msFlex: flexValue,
            WebkitFlex: flexValue,
          },
        );

        if (column.props.maxWidth) {
          style.maxWidth = column.props.maxWidth;
        }

        if (column.props.minWidth) {
          style.minWidth = column.props.minWidth;
        }

        return style;
      },
    },
    {
      key: '_getHeaderColumns',
      value: function _getHeaderColumns() {
        var _this4 = this;

        var _this$props4 = this.props,
          children = _this$props4.children,
          disableHeader = _this$props4.disableHeader;
        var items = disableHeader ? [] : React.Children.toArray(children);
        return items.map(function(column, index) {
          return _this4._createHeader({
            column: column,
            index: index,
          });
        });
      },
    },
    {
      key: '_getRowHeight',
      value: function _getRowHeight(rowIndex) {
        var rowHeight = this.props.rowHeight;
        return typeof rowHeight === 'function'
          ? rowHeight({
              index: rowIndex,
            })
          : rowHeight;
      },
    },
    {
      key: '_onScroll',
      value: function _onScroll(_ref7) {
        var clientHeight = _ref7.clientHeight,
          scrollHeight = _ref7.scrollHeight,
          scrollTop = _ref7.scrollTop;
        var onScroll = this.props.onScroll;
        onScroll({
          clientHeight: clientHeight,
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
        });
      },
    },
    {
      key: '_onSectionRendered',
      value: function _onSectionRendered(_ref8) {
        var rowOverscanStartIndex = _ref8.rowOverscanStartIndex,
          rowOverscanStopIndex = _ref8.rowOverscanStopIndex,
          rowStartIndex = _ref8.rowStartIndex,
          rowStopIndex = _ref8.rowStopIndex;
        var onRowsRendered = this.props.onRowsRendered;
        onRowsRendered({
          overscanStartIndex: rowOverscanStartIndex,
          overscanStopIndex: rowOverscanStopIndex,
          startIndex: rowStartIndex,
          stopIndex: rowStopIndex,
        });
      },
    },
    {
      key: '_setRef',
      value: function _setRef(ref) {
        this.Grid = ref;
      },
    },
    {
      key: '_setScrollbarWidth',
      value: function _setScrollbarWidth() {
        var scrollbarWidth = this.getScrollbarWidth();
        this.setState({
          scrollbarWidth: scrollbarWidth,
        });
      },
    },
  ]);
  return Table;
})(React.PureComponent);

exports['default'] = Table;
(0, _defineProperty2['default'])(Table, 'defaultProps', {
  disableHeader: false,
  estimatedRowSize: 30,
  headerHeight: 0,
  headerStyle: {},
  noRowsRenderer: function noRowsRenderer() {
    return null;
  },
  onRowsRendered: function onRowsRendered() {
    return null;
  },
  onScroll: function onScroll() {
    return null;
  },
  overscanIndicesGetter: _Grid2.accessibilityOverscanIndicesGetter,
  overscanRowCount: 10,
  rowRenderer: _defaultRowRenderer['default'],
  headerRowRenderer: _defaultHeaderRowRenderer['default'],
  rowStyle: {},
  scrollToAlignment: 'auto',
  scrollToIndex: -1,
  style: {},
});
Table.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        /** This is just set on the grid top element. */
        'aria-label': _propTypes['default'].string,

        /** This is just set on the grid top element. */
        'aria-labelledby': _propTypes['default'].string,

        /**
         * Removes fixed height from the scrollingContainer so that the total height
         * of rows can stretch the window. Intended for use with WindowScroller
         */
        autoHeight: _propTypes['default'].bool,

        /** One or more Columns describing the data displayed in this row */
        children: function children(props) {
          var children = React.Children.toArray(props.children);

          for (var i = 0; i < children.length; i++) {
            var childType = children[i].type;

            if (
              childType !== _Column['default'] &&
              !(childType.prototype instanceof _Column['default'])
            ) {
              return new Error('Table only accepts children of type Column');
            }
          }
        },

        /** Optional CSS class name */
        className: _propTypes['default'].string,

        /** Disable rendering the header at all */
        disableHeader: _propTypes['default'].bool,

        /**
         * Used to estimate the total height of a Table before all of its rows have actually been measured.
         * The estimated total height is adjusted as rows are rendered.
         */
        estimatedRowSize: _propTypes['default'].number.isRequired,

        /** Optional custom CSS class name to attach to inner Grid element. */
        gridClassName: _propTypes['default'].string,

        /** Optional inline style to attach to inner Grid element. */
        gridStyle: _propTypes['default'].object,

        /** Optional CSS class to apply to all column headers */
        headerClassName: _propTypes['default'].string,

        /** Fixed height of header row */
        headerHeight: _propTypes['default'].number.isRequired,

        /**
         * Responsible for rendering a table row given an array of columns:
         * Should implement the following interface: ({
         *   className: string,
         *   columns: any[],
         *   style: any
         * }): PropTypes.node
         */
        headerRowRenderer: _propTypes['default'].func,

        /** Optional custom inline style to attach to table header columns. */
        headerStyle: _propTypes['default'].object,

        /** Fixed/available height for out DOM element */
        height: _propTypes['default'].number.isRequired,

        /** Optional id */
        id: _propTypes['default'].string,

        /** Optional renderer to be used in place of table body rows when rowCount is 0 */
        noRowsRenderer: _propTypes['default'].func,

        /**
         * Optional callback when a column is clicked.
         * ({ columnData: any, dataKey: string }): void
         */
        onColumnClick: _propTypes['default'].func,

        /**
         * Optional callback when a column's header is clicked.
         * ({ columnData: any, dataKey: string }): void
         */
        onHeaderClick: _propTypes['default'].func,

        /**
         * Callback invoked when a user clicks on a table row.
         * ({ index: number }): void
         */
        onRowClick: _propTypes['default'].func,

        /**
         * Callback invoked when a user double-clicks on a table row.
         * ({ index: number }): void
         */
        onRowDoubleClick: _propTypes['default'].func,

        /**
         * Callback invoked when the mouse leaves a table row.
         * ({ index: number }): void
         */
        onRowMouseOut: _propTypes['default'].func,

        /**
         * Callback invoked when a user moves the mouse over a table row.
         * ({ index: number }): void
         */
        onRowMouseOver: _propTypes['default'].func,

        /**
         * Callback invoked when a user right-clicks on a table row.
         * ({ index: number }): void
         */
        onRowRightClick: _propTypes['default'].func,

        /**
         * Callback invoked with information about the slice of rows that were just rendered.
         * ({ startIndex, stopIndex }): void
         */
        onRowsRendered: _propTypes['default'].func,

        /**
         * Callback invoked whenever the scroll offset changes within the inner scrollable region.
         * This callback can be used to sync scrolling between lists, tables, or grids.
         * ({ clientHeight, scrollHeight, scrollTop }): void
         */
        onScroll: _propTypes['default'].func.isRequired,

        /** See Grid#overscanIndicesGetter */
        overscanIndicesGetter: _propTypes['default'].func.isRequired,

        /**
         * Number of rows to render above/below the visible bounds of the list.
         * These rows can help for smoother scrolling on touch devices.
         */
        overscanRowCount: _propTypes['default'].number.isRequired,

        /**
         * Optional CSS class to apply to all table rows (including the header row).
         * This property can be a CSS class name (string) or a function that returns a class name.
         * If a function is provided its signature should be: ({ index: number }): string
         */
        rowClassName: _propTypes['default'].oneOfType([
          _propTypes['default'].string,
          _propTypes['default'].func,
        ]),

        /**
         * Callback responsible for returning a data row given an index.
         * ({ index: number }): any
         */
        rowGetter: _propTypes['default'].func.isRequired,

        /**
         * Either a fixed row height (number) or a function that returns the height of a row given its index.
         * ({ index: number }): number
         */
        rowHeight: _propTypes['default'].oneOfType([
          _propTypes['default'].number,
          _propTypes['default'].func,
        ]).isRequired,

        /** Number of rows in table. */
        rowCount: _propTypes['default'].number.isRequired,

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
        rowRenderer: _propTypes['default'].func,

        /** Optional custom inline style to attach to table rows. */
        rowStyle: _propTypes['default'].oneOfType([
          _propTypes['default'].object,
          _propTypes['default'].func,
        ]).isRequired,

        /** See Grid#scrollToAlignment */
        scrollToAlignment: _propTypes['default'].oneOf([
          'auto',
          'end',
          'start',
          'center',
        ]).isRequired,

        /** Row index to ensure visible (by forcefully scrolling if necessary) */
        scrollToIndex: _propTypes['default'].number.isRequired,

        /** Vertical offset. */
        scrollTop: _propTypes['default'].number,

        /**
         * Sort function to be called if a sortable header is clicked.
         * Should implement the following interface: ({
         *   defaultSortDirection: 'ASC' | 'DESC',
         *   event: MouseEvent,
         *   sortBy: string,
         *   sortDirection: SortDirection
         * }): void
         */
        sort: _propTypes['default'].func,

        /** Table data is currently sorted by this :dataKey (if it is sorted at all) */
        sortBy: _propTypes['default'].string,

        /** Table data is currently sorted in this direction (if it is sorted at all) */
        sortDirection: _propTypes['default'].oneOf([
          _SortDirection['default'].ASC,
          _SortDirection['default'].DESC,
        ]),

        /** Optional inline style */
        style: _propTypes['default'].object,

        /** Tab index for focus */
        tabIndex: _propTypes['default'].number,

        /** Width of list */
        width: _propTypes['default'].number.isRequired,
      }
    : {};
