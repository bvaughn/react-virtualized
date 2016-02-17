'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.SortIndicator = SortIndicator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _FlexColumn = require('./FlexColumn');

var _FlexColumn2 = _interopRequireDefault(_FlexColumn);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var _Grid = require('../Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var SortDirection = {
  /**
   * Sort items in ascending order.
   * This means arranging from the lowest value to the highest (e.g. a-z, 0-9).
   */
  ASC: 'ASC',

  /**
   * Sort items in descending order.
   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
   */
  DESC: 'DESC'
};

exports.SortDirection = SortDirection;
/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */

var FlexTable = (function (_Component) {
  _inherits(FlexTable, _Component);

  _createClass(FlexTable, null, [{
    key: 'propTypes',
    value: {
      /** One or more FlexColumns describing the data displayed in this row */
      children: function children(props, propName, componentName) {
        var children = _react2['default'].Children.toArray(props.children);
        for (var i = 0; i < children.length; i++) {
          if (children[i].type !== _FlexColumn2['default']) {
            return new Error('FlexTable only accepts children of type FlexColumn');
          }
        }
      },

      /** Optional CSS class name */
      className: _react.PropTypes.string,

      /** Disable rendering the header at all */
      disableHeader: _react.PropTypes.bool,

      /** Optional CSS class to apply to all column headers */
      headerClassName: _react.PropTypes.string,

      /** Fixed height of header row */
      headerHeight: _react.PropTypes.number.isRequired,

      /** Fixed/available height for out DOM element */
      height: _react.PropTypes.number.isRequired,

      /** Optional renderer to be used in place of table body rows when rowsCount is 0 */
      noRowsRenderer: _react.PropTypes.func,

      /**
      * Optional callback when a column's header is clicked.
      * (dataKey: string): void
      */
      onHeaderClick: _react.PropTypes.func,

      /**
       * Callback invoked when a user clicks on a table row.
       * (rowIndex: number): void
       */
      onRowClick: _react.PropTypes.func,

      /**
       * Callback invoked with information about the slice of rows that were just rendered.
       * ({ startIndex, stopIndex }): void
       */
      onRowsRendered: _react.PropTypes.func,

      /**
       * Callback invoked whenever the scroll offset changes within the inner scrollable region.
       * This callback can be used to sync scrolling between lists, tables, or grids.
       * ({ clientHeight, scrollHeight, scrollTop }): void
       */
      onScroll: _react.PropTypes.func.isRequired,

      /**
       * Number of rows to render above/below the visible bounds of the list.
       * These rows can help for smoother scrolling on touch devices.
       */
      overscanRowsCount: _react.PropTypes.number.isRequired,

      /**
       * Optional CSS class to apply to all table rows (including the header row).
       * This property can be a CSS class name (string) or a function that returns a class name.
       * If a function is provided its signature should be: (rowIndex: number): string
       */
      rowClassName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

      /**
       * Callback responsible for returning a data row given an index.
       * (index: number): any
       */
      rowGetter: _react.PropTypes.func.isRequired,

      /**
       * Either a fixed row height (number) or a function that returns the height of a row given its index.
       * (index: number): number
       */
      rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

      /** Number of rows in table. */
      rowsCount: _react.PropTypes.number.isRequired,

      /** Row index to ensure visible (by forcefully scrolling if necessary) */
      scrollToIndex: _react.PropTypes.number,

      /** Vertical offset. */
      scrollTop: _react.PropTypes.number,

      /**
       * Sort function to be called if a sortable header is clicked.
       * (dataKey: string, sortDirection: SortDirection): void
       */
      sort: _react.PropTypes.func,

      /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
      sortBy: _react.PropTypes.string,

      /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
      sortDirection: _react.PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),

      /** Width of list */
      width: _react.PropTypes.number.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      disableHeader: false,
      headerHeight: 0,
      noRowsRenderer: function noRowsRenderer() {
        return null;
      },
      onHeaderClick: function onHeaderClick() {
        return null;
      },
      onRowClick: function onRowClick() {
        return null;
      },
      onRowsRendered: function onRowsRendered() {
        return null;
      },
      onScroll: function onScroll() {
        return null;
      },
      overscanRowsCount: 10
    },
    enumerable: true
  }]);

  function FlexTable(props) {
    _classCallCheck(this, FlexTable);

    _get(Object.getPrototypeOf(FlexTable.prototype), 'constructor', this).call(this, props);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
    this.state = {
      scrollbarWidth: 0
    };

    this._createRow = this._createRow.bind(this);
  }

  /**
   * Displayed beside a header to indicate that a FlexTable is currently sorted by this column.
   */

  /**
   * See Grid#recomputeGridSize
   */

  _createClass(FlexTable, [{
    key: 'recomputeRowHeights',
    value: function recomputeRowHeights() {
      this.refs.Grid.recomputeGridSize();
    }

    /**
     * See Grid#scrollToIndex
     */
  }, {
    key: 'scrollToRow',
    value: function scrollToRow(scrollToIndex) {
      this.refs.Grid.scrollToCell({
        scrollToColumn: 0,
        scrollToRow: scrollToIndex
      });
    }

    /**
     * See Grid#setScrollPosition
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.refs.Grid.setScrollPosition({
        scrollLeft: 0,
        scrollTop: scrollTop
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var scrollTop = this.props.scrollTop;

      if (scrollTop >= 0) {
        this.setScrollTop(scrollTop);
      }

      this._setScrollbarWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._setScrollbarWidth();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.scrollTop !== this.props.scrollTop) {
        this.setScrollTop(nextProps.scrollTop);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var _props = this.props;
      var className = _props.className;
      var disableHeader = _props.disableHeader;
      var headerHeight = _props.headerHeight;
      var height = _props.height;
      var noRowsRenderer = _props.noRowsRenderer;
      var onRowsRendered = _props.onRowsRendered;
      var onScroll = _props.onScroll;
      var overscanRowsCount = _props.overscanRowsCount;
      var rowClassName = _props.rowClassName;
      var rowHeight = _props.rowHeight;
      var rowsCount = _props.rowsCount;
      var scrollToIndex = _props.scrollToIndex;
      var width = _props.width;
      var scrollbarWidth = this.state.scrollbarWidth;

      var availableRowsHeight = height - headerHeight;

      // This row-renderer wrapper function is necessary in order to trigger re-render when the
      // sort-by or sort-direction have changed (else Grid will not see any props changes)
      var rowRenderer = function rowRenderer(index) {
        return _this._createRow(index);
      };

      var rowClass = rowClassName instanceof Function ? rowClassName(-1) : rowClassName;

      return _react2['default'].createElement(
        'div',
        {
          className: (0, _classnames2['default'])('FlexTable', className)
        },
        !disableHeader && _react2['default'].createElement(
          'div',
          {
            className: (0, _classnames2['default'])('FlexTable__headerRow', rowClass),
            style: {
              height: headerHeight,
              paddingRight: scrollbarWidth,
              width: width
            }
          },
          this._getRenderedHeaderRow()
        ),
        _react2['default'].createElement(_Grid2['default'], {
          ref: 'Grid',
          className: 'FlexTable__Grid',
          columnWidth: width,
          columnsCount: 1,
          height: availableRowsHeight,
          noContentRenderer: noRowsRenderer,
          onScroll: function (_ref) {
            var clientHeight = _ref.clientHeight;
            var scrollHeight = _ref.scrollHeight;
            var scrollTop = _ref.scrollTop;
            return onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
          },
          onSectionRendered: function (_ref2) {
            var rowOverscanStartIndex = _ref2.rowOverscanStartIndex;
            var rowOverscanStopIndex = _ref2.rowOverscanStopIndex;
            var rowStartIndex = _ref2.rowStartIndex;
            var rowStopIndex = _ref2.rowStopIndex;
            return onRowsRendered({
              overscanStartIndex: rowOverscanStartIndex,
              overscanStopIndex: rowOverscanStopIndex,
              startIndex: rowStartIndex,
              stopIndex: rowStopIndex
            });
          },
          overscanRowsCount: overscanRowsCount,
          renderCell: function (_ref3) {
            var columnIndex = _ref3.columnIndex;
            var rowIndex = _ref3.rowIndex;
            return rowRenderer(rowIndex);
          },
          rowHeight: rowHeight,
          rowsCount: rowsCount,
          scrollToRow: scrollToIndex,
          width: width
        })
      );
    }
  }, {
    key: '_createColumn',
    value: function _createColumn(column, columnIndex, rowData, rowIndex) {
      var _column$props = column.props;
      var cellClassName = _column$props.cellClassName;
      var cellDataGetter = _column$props.cellDataGetter;
      var columnData = _column$props.columnData;
      var dataKey = _column$props.dataKey;
      var cellRenderer = _column$props.cellRenderer;

      var cellData = cellDataGetter(dataKey, rowData, columnData);
      var renderedCell = cellRenderer(cellData, dataKey, rowData, rowIndex, columnData);

      var style = this._getFlexStyleForColumn(column);

      var title = typeof renderedCell === 'string' ? renderedCell : null;

      return _react2['default'].createElement(
        'div',
        {
          key: 'Row' + rowIndex + '-Col' + columnIndex,
          className: (0, _classnames2['default'])('FlexTable__rowColumn', cellClassName),
          style: style
        },
        _react2['default'].createElement(
          'div',
          {
            className: 'FlexTable__truncatedColumnText',
            title: title
          },
          renderedCell
        )
      );
    }
  }, {
    key: '_createHeader',
    value: function _createHeader(column, columnIndex) {
      var _props2 = this.props;
      var headerClassName = _props2.headerClassName;
      var onHeaderClick = _props2.onHeaderClick;
      var sort = _props2.sort;
      var sortBy = _props2.sortBy;
      var sortDirection = _props2.sortDirection;
      var _column$props2 = column.props;
      var dataKey = _column$props2.dataKey;
      var disableSort = _column$props2.disableSort;
      var label = _column$props2.label;
      var columnData = _column$props2.columnData;

      var showSortIndicator = sortBy === dataKey;
      var sortEnabled = !disableSort && sort;

      var classNames = (0, _classnames2['default'])('FlexTable__headerColumn', headerClassName, column.props.headerClassName, {
        'FlexTable__sortableHeaderColumn': sortEnabled
      });
      var style = this._getFlexStyleForColumn(column);

      // If this is a sortable header, clicking it should update the table data's sorting.
      var newSortDirection = sortBy !== dataKey || sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;
      var onClick = function onClick() {
        sortEnabled && sort(dataKey, newSortDirection);
        onHeaderClick(dataKey, columnData);
      };

      return _react2['default'].createElement(
        'div',
        {
          key: 'Header-Col' + columnIndex,
          className: classNames,
          style: style,
          onClick: onClick
        },
        _react2['default'].createElement(
          'div',
          {
            className: 'FlexTable__headerTruncatedText',
            title: label
          },
          label
        ),
        showSortIndicator && _react2['default'].createElement(SortIndicator, { sortDirection: sortDirection })
      );
    }
  }, {
    key: '_createRow',
    value: function _createRow(rowIndex) {
      var _this2 = this;

      var _props3 = this.props;
      var children = _props3.children;
      var onRowClick = _props3.onRowClick;
      var rowClassName = _props3.rowClassName;
      var rowGetter = _props3.rowGetter;
      var scrollbarWidth = this.state.scrollbarWidth;

      var rowClass = rowClassName instanceof Function ? rowClassName(rowIndex) : rowClassName;

      var renderedRow = _react2['default'].Children.map(children, function (column, columnIndex) {
        return _this2._createColumn(column, columnIndex, rowGetter(rowIndex), rowIndex);
      });

      return _react2['default'].createElement(
        'div',
        {
          key: rowIndex,
          className: (0, _classnames2['default'])('FlexTable__row', rowClass),
          onClick: function () {
            return onRowClick(rowIndex);
          },
          style: {
            height: this._getRowHeight(rowIndex),
            paddingRight: scrollbarWidth
          }
        },
        renderedRow
      );
    }

    /**
     * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
     */
  }, {
    key: '_getFlexStyleForColumn',
    value: function _getFlexStyleForColumn(column) {
      var flexValue = column.props.flexGrow + ' ' + column.props.flexShrink + ' ' + column.props.width + 'px';

      return {
        flex: flexValue,
        msFlex: flexValue,
        WebkitFlex: flexValue
      };
    }
  }, {
    key: '_getRenderedHeaderRow',
    value: function _getRenderedHeaderRow() {
      var _this3 = this;

      var _props4 = this.props;
      var children = _props4.children;
      var disableHeader = _props4.disableHeader;

      var items = disableHeader ? [] : children;
      return _react2['default'].Children.map(items, function (column, columnIndex) {
        return _this3._createHeader(column, columnIndex);
      });
    }
  }, {
    key: '_getRowHeight',
    value: function _getRowHeight(rowIndex) {
      var rowHeight = this.props.rowHeight;

      return rowHeight instanceof Function ? rowHeight(rowIndex) : rowHeight;
    }
  }, {
    key: '_setScrollbarWidth',
    value: function _setScrollbarWidth() {
      var Grid = (0, _reactDom.findDOMNode)(this.refs.Grid);
      var clientWidth = Grid.clientWidth || 0;
      var offsetWidth = Grid.offsetWidth || 0;
      var scrollbarWidth = offsetWidth - clientWidth;

      this.setState({ scrollbarWidth: scrollbarWidth });
    }
  }]);

  return FlexTable;
})(_react.Component);

exports['default'] = FlexTable;

function SortIndicator(_ref4) {
  var sortDirection = _ref4.sortDirection;

  var classNames = (0, _classnames2['default'])('FlexTable__sortableHeaderIcon', {
    'FlexTable__sortableHeaderIcon--ASC': sortDirection === SortDirection.ASC,
    'FlexTable__sortableHeaderIcon--DESC': sortDirection === SortDirection.DESC
  });

  return _react2['default'].createElement(
    'svg',
    {
      className: classNames,
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      xmlns: 'http://www.w3.org/2000/svg'
    },
    sortDirection === SortDirection.ASC ? _react2['default'].createElement('path', { d: 'M7 14l5-5 5 5z' }) : _react2['default'].createElement('path', { d: 'M7 10l5 5 5-5z' }),
    _react2['default'].createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' })
  );
}

SortIndicator.propTypes = {
  sortDirection: _react.PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC])
};