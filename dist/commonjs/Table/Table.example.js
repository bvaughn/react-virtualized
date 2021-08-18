"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _immutable = _interopRequireDefault(require("immutable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _ContentBox = require("../demo/ContentBox");

var _LabeledInput = require("../demo/LabeledInput");

var _AutoSizer = _interopRequireDefault(require("../AutoSizer"));

var _Column = _interopRequireDefault(require("./Column"));

var _Table = _interopRequireDefault(require("./Table"));

var _SortDirection = _interopRequireDefault(require("./SortDirection"));

var _SortIndicator = _interopRequireDefault(require("./SortIndicator"));

var _TableExample = _interopRequireDefault(require("./Table.example.css"));

var TableExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(TableExample, _React$PureComponent);

  function TableExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, TableExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TableExample).call(this, props, context));
    var sortBy = 'index';
    var sortDirection = _SortDirection["default"].ASC;

    var sortedList = _this._sortList({
      sortBy: sortBy,
      sortDirection: sortDirection
    });

    _this.state = {
      disableHeader: false,
      enableFooter: false,
      headerHeight: 30,
      footerHeight: 30,
      height: 270,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: 1000,
      scrollToIndex: undefined,
      sortBy: sortBy,
      sortDirection: sortDirection,
      sortedList: sortedList,
      useDynamicRowHeight: false
    };
    _this._getRowHeight = _this._getRowHeight.bind((0, _assertThisInitialized2["default"])(_this));
    _this._headerRenderer = _this._headerRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._footerRenderer = _this._footerRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._noRowsRenderer = _this._noRowsRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._rowClassName = _this._rowClassName.bind((0, _assertThisInitialized2["default"])(_this));
    _this._sort = _this._sort.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(TableExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          disableHeader = _this$state.disableHeader,
          enableFooter = _this$state.enableFooter,
          headerHeight = _this$state.headerHeight,
          footerHeight = _this$state.footerHeight,
          height = _this$state.height,
          hideIndexRow = _this$state.hideIndexRow,
          overscanRowCount = _this$state.overscanRowCount,
          rowHeight = _this$state.rowHeight,
          rowCount = _this$state.rowCount,
          scrollToIndex = _this$state.scrollToIndex,
          sortBy = _this$state.sortBy,
          sortDirection = _this$state.sortDirection,
          sortedList = _this$state.sortedList,
          useDynamicRowHeight = _this$state.useDynamicRowHeight;

      var rowGetter = function rowGetter(_ref) {
        var index = _ref.index;
        return _this2._getDatum(sortedList, index);
      };

      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "Table",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Table/Table.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "The table layout below is created with flexboxes. This allows it to have a fixed header and scrollable body content. It also makes use of", ' ', React.createElement("code", null, "Grid"), " for windowing table content so that large lists are rendered efficiently. Adjust its configurable properties below to see how it reacts."), React.createElement(_ContentBox.ContentBoxParagraph, null, React.createElement("label", {
        className: _TableExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row heights?",
        checked: useDynamicRowHeight,
        className: _TableExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2._updateUseDynamicRowHeight(event.target.checked);
        }
      }), "Use dynamic row heights?"), React.createElement("label", {
        className: _TableExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Hide index?",
        checked: hideIndexRow,
        className: _TableExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            hideIndexRow: event.target.checked
          });
        }
      }), "Hide index?"), React.createElement("label", {
        className: _TableExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Hide header?",
        checked: disableHeader,
        className: _TableExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            disableHeader: event.target.checked
          });
        }
      }), "Hide header?"), React.createElement("label", {
        className: _TableExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show footer?",
        checked: enableFooter,
        className: _TableExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            enableFooter: event.target.checked
          });
        }
      }), "Show footer?")), React.createElement(_LabeledInput.InputRow, null, React.createElement(_LabeledInput.LabeledInput, {
        label: "Num rows",
        name: "rowCount",
        onChange: this._onRowCountChange,
        value: rowCount
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Scroll to",
        name: "onScrollToRow",
        placeholder: "Index...",
        onChange: this._onScrollToRowChange,
        value: scrollToIndex || ''
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "List height",
        name: "height",
        onChange: function onChange(event) {
          return _this2.setState({
            height: parseInt(event.target.value, 10) || 1
          });
        },
        value: height
      }), React.createElement(_LabeledInput.LabeledInput, {
        disabled: useDynamicRowHeight,
        label: "Row height",
        name: "rowHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            rowHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: rowHeight
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Header height",
        name: "headerHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            headerHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: headerHeight
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Footer height",
        name: "footerHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            footerHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: footerHeight
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Overscan",
        name: "overscanRowCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanRowCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanRowCount
      })), React.createElement("div", null, React.createElement(_AutoSizer["default"], {
        disableHeight: true
      }, function (_ref2) {
        var width = _ref2.width;
        return React.createElement(_Table["default"], {
          ref: "Table",
          disableHeader: disableHeader,
          enableFooter: enableFooter,
          headerClassName: _TableExample["default"].headerColumn,
          headerHeight: headerHeight,
          footerClassName: _TableExample["default"].footerColumn,
          footerHeight: footerHeight,
          height: height,
          noRowsRenderer: _this2._noRowsRenderer,
          overscanRowCount: overscanRowCount,
          rowClassName: _this2._rowClassName,
          rowHeight: useDynamicRowHeight ? _this2._getRowHeight : rowHeight,
          rowGetter: rowGetter,
          rowCount: rowCount,
          scrollToIndex: scrollToIndex,
          sort: _this2._sort,
          sortBy: sortBy,
          sortDirection: sortDirection,
          width: width
        }, !hideIndexRow && React.createElement(_Column["default"], {
          label: "Index",
          cellDataGetter: function cellDataGetter(_ref3) {
            var rowData = _ref3.rowData;
            return rowData.index;
          },
          dataKey: "index",
          disableSort: !_this2._isSortEnabled(),
          width: 60
        }), React.createElement(_Column["default"], {
          dataKey: "name",
          disableSort: !_this2._isSortEnabled(),
          headerRenderer: _this2._headerRenderer,
          footerRenderer: _this2._footerRenderer,
          width: 90
        }), React.createElement(_Column["default"], {
          width: 210,
          disableSort: true,
          label: "The description label is really long so that it will be truncated",
          dataKey: "random",
          className: _TableExample["default"].exampleColumn,
          cellRenderer: function cellRenderer(_ref4) {
            var cellData = _ref4.cellData;
            return cellData;
          },
          flexGrow: 1
        }));
      })));
    }
  }, {
    key: "_getDatum",
    value: function _getDatum(list, index) {
      return list.get(index % list.size);
    }
  }, {
    key: "_getRowHeight",
    value: function _getRowHeight(_ref5) {
      var index = _ref5.index;
      var list = this.context.list;
      return this._getDatum(list, index).size;
    }
  }, {
    key: "_headerRenderer",
    value: function _headerRenderer(_ref6) {
      var dataKey = _ref6.dataKey,
          sortBy = _ref6.sortBy,
          sortDirection = _ref6.sortDirection;
      return React.createElement("div", null, "Full Name", sortBy === dataKey && React.createElement(_SortIndicator["default"], {
        sortDirection: sortDirection
      }));
    }
  }, {
    key: "_footerRenderer",
    value: function _footerRenderer() {
      return React.createElement("div", null, "Full Name");
    }
  }, {
    key: "_isSortEnabled",
    value: function _isSortEnabled() {
      var list = this.context.list;
      var rowCount = this.state.rowCount;
      return rowCount <= list.size;
    }
  }, {
    key: "_noRowsRenderer",
    value: function _noRowsRenderer() {
      return React.createElement("div", {
        className: _TableExample["default"].noRows
      }, "No rows");
    }
  }, {
    key: "_onRowCountChange",
    value: function _onRowCountChange(event) {
      var rowCount = parseInt(event.target.value, 10) || 0;
      this.setState({
        rowCount: rowCount
      });
    }
  }, {
    key: "_onScrollToRowChange",
    value: function _onScrollToRowChange(event) {
      var rowCount = this.state.rowCount;
      var scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10));

      if (isNaN(scrollToIndex)) {
        scrollToIndex = undefined;
      }

      this.setState({
        scrollToIndex: scrollToIndex
      });
    }
  }, {
    key: "_rowClassName",
    value: function _rowClassName(_ref7) {
      var index = _ref7.index;

      if (index < 0) {
        return _TableExample["default"].headerRow;
      } else {
        return index % 2 === 0 ? _TableExample["default"].evenRow : _TableExample["default"].oddRow;
      }
    }
  }, {
    key: "_sort",
    value: function _sort(_ref8) {
      var sortBy = _ref8.sortBy,
          sortDirection = _ref8.sortDirection;

      var sortedList = this._sortList({
        sortBy: sortBy,
        sortDirection: sortDirection
      });

      this.setState({
        sortBy: sortBy,
        sortDirection: sortDirection,
        sortedList: sortedList
      });
    }
  }, {
    key: "_sortList",
    value: function _sortList(_ref9) {
      var sortBy = _ref9.sortBy,
          sortDirection = _ref9.sortDirection;
      var list = this.context.list;
      return list.sortBy(function (item) {
        return item[sortBy];
      }).update(function (list) {
        return sortDirection === _SortDirection["default"].DESC ? list.reverse() : list;
      });
    }
  }, {
    key: "_updateUseDynamicRowHeight",
    value: function _updateUseDynamicRowHeight(value) {
      this.setState({
        useDynamicRowHeight: value
      });
    }
  }]);
  return TableExample;
}(React.PureComponent);

exports["default"] = TableExample;
(0, _defineProperty2["default"])(TableExample, "contextTypes", {
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired
});