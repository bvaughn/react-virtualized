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

var _Grid = _interopRequireDefault(require("./Grid"));

var _clsx2 = _interopRequireDefault(require("clsx"));

var _GridExample = _interopRequireDefault(require("./Grid.example.css"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var GridExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(GridExample, _React$PureComponent);

  function GridExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, GridExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GridExample).call(this, props, context));
    _this.state = {
      columnCount: 1000,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: 1000,
      scrollToColumn: undefined,
      scrollToRow: undefined,
      useDynamicRowHeight: false
    };
    _this._cellRenderer = _this._cellRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._getColumnWidth = _this._getColumnWidth.bind((0, _assertThisInitialized2["default"])(_this));
    _this._getRowClassName = _this._getRowClassName.bind((0, _assertThisInitialized2["default"])(_this));
    _this._getRowHeight = _this._getRowHeight.bind((0, _assertThisInitialized2["default"])(_this));
    _this._noContentRenderer = _this._noContentRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onColumnCountChange = _this._onColumnCountChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onScrollToColumnChange = _this._onScrollToColumnChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderBodyCell = _this._renderBodyCell.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderLeftSideCell = _this._renderLeftSideCell.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(GridExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          columnCount = _this$state.columnCount,
          height = _this$state.height,
          overscanColumnCount = _this$state.overscanColumnCount,
          overscanRowCount = _this$state.overscanRowCount,
          rowHeight = _this$state.rowHeight,
          rowCount = _this$state.rowCount,
          scrollToColumn = _this$state.scrollToColumn,
          scrollToRow = _this$state.scrollToRow,
          useDynamicRowHeight = _this$state.useDynamicRowHeight;
      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "Grid",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "Renders tabular data with virtualization along the vertical and horizontal axes. Row heights and column widths must be calculated ahead of time and specified as a fixed size or returned by a getter function."), React.createElement(_ContentBox.ContentBoxParagraph, null, React.createElement("label", {
        className: _GridExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row height?",
        className: _GridExample["default"].checkbox,
        type: "checkbox",
        value: useDynamicRowHeight,
        onChange: function onChange(event) {
          return _this2._updateUseDynamicRowHeights(event.target.checked);
        }
      }), "Use dynamic row height?")), React.createElement(_LabeledInput.InputRow, null, React.createElement(_LabeledInput.LabeledInput, {
        label: "Num columns",
        name: "columnCount",
        onChange: this._onColumnCountChange,
        value: columnCount
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Num rows",
        name: "rowCount",
        onChange: this._onRowCountChange,
        value: rowCount
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Scroll to column",
        name: "onScrollToColumn",
        placeholder: "Index...",
        onChange: this._onScrollToColumnChange,
        value: scrollToColumn || ''
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Scroll to row",
        name: "onScrollToRow",
        placeholder: "Index...",
        onChange: this._onScrollToRowChange,
        value: scrollToRow || ''
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
        label: "Overscan columns",
        name: "overscanColumnCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanColumnCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanColumnCount
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Overscan rows",
        name: "overscanRowCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanRowCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanRowCount
      })), React.createElement(_AutoSizer["default"], {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(_Grid["default"], {
          cellRenderer: _this2._cellRenderer,
          className: _GridExample["default"].BodyGrid,
          columnWidth: _this2._getColumnWidth,
          columnCount: columnCount,
          height: height,
          noContentRenderer: _this2._noContentRenderer,
          overscanColumnCount: overscanColumnCount,
          overscanRowCount: overscanRowCount,
          rowHeight: useDynamicRowHeight ? _this2._getRowHeight : rowHeight,
          rowCount: rowCount,
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow,
          width: width
        });
      }));
    }
  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref2) {
      var columnIndex = _ref2.columnIndex,
          key = _ref2.key,
          rowIndex = _ref2.rowIndex,
          style = _ref2.style;

      if (columnIndex === 0) {
        return this._renderLeftSideCell({
          columnIndex: columnIndex,
          key: key,
          rowIndex: rowIndex,
          style: style
        });
      } else {
        return this._renderBodyCell({
          columnIndex: columnIndex,
          key: key,
          rowIndex: rowIndex,
          style: style
        });
      }
    }
  }, {
    key: "_getColumnWidth",
    value: function _getColumnWidth(_ref3) {
      var index = _ref3.index;

      switch (index) {
        case 0:
          return 50;

        case 1:
          return 100;

        case 2:
          return 300;

        default:
          return 80;
      }
    }
  }, {
    key: "_getDatum",
    value: function _getDatum(index) {
      var list = this.context.list;
      return list.get(index % list.size);
    }
  }, {
    key: "_getRowClassName",
    value: function _getRowClassName(row) {
      return row % 2 === 0 ? _GridExample["default"].evenRow : _GridExample["default"].oddRow;
    }
  }, {
    key: "_getRowHeight",
    value: function _getRowHeight(_ref4) {
      var index = _ref4.index;
      return this._getDatum(index).size;
    }
  }, {
    key: "_noContentRenderer",
    value: function _noContentRenderer() {
      return React.createElement("div", {
        className: _GridExample["default"].noCells
      }, "No cells");
    }
  }, {
    key: "_renderBodyCell",
    value: function _renderBodyCell(_ref5) {
      var columnIndex = _ref5.columnIndex,
          key = _ref5.key,
          rowIndex = _ref5.rowIndex,
          style = _ref5.style;

      var rowClass = this._getRowClassName(rowIndex);

      var datum = this._getDatum(rowIndex);

      var content;

      switch (columnIndex) {
        case 1:
          content = datum.name;
          break;

        case 2:
          content = datum.random;
          break;

        default:
          content = "r:".concat(rowIndex, ", c:").concat(columnIndex);
          break;
      }

      var classNames = (0, _clsx2["default"])(rowClass, _GridExample["default"].cell, (0, _defineProperty2["default"])({}, _GridExample["default"].centeredCell, columnIndex > 2));
      return React.createElement("div", {
        className: classNames,
        key: key,
        style: style
      }, content);
    }
  }, {
    key: "_renderLeftSideCell",
    value: function _renderLeftSideCell(_ref6) {
      var key = _ref6.key,
          rowIndex = _ref6.rowIndex,
          style = _ref6.style;

      var datum = this._getDatum(rowIndex);

      var classNames = (0, _clsx2["default"])(_GridExample["default"].cell, _GridExample["default"].letterCell); // Don't modify styles.
      // These are frozen by React now (as of 16.0.0).
      // Since Grid caches and re-uses them, they aren't safe to modify.

      style = _objectSpread({}, style, {
        backgroundColor: datum.color
      });
      return React.createElement("div", {
        className: classNames,
        key: key,
        style: style
      }, datum.name.charAt(0));
    }
  }, {
    key: "_updateUseDynamicRowHeights",
    value: function _updateUseDynamicRowHeights(value) {
      this.setState({
        useDynamicRowHeight: value
      });
    }
  }, {
    key: "_onColumnCountChange",
    value: function _onColumnCountChange(event) {
      var columnCount = parseInt(event.target.value, 10) || 0;
      this.setState({
        columnCount: columnCount
      });
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
    key: "_onScrollToColumnChange",
    value: function _onScrollToColumnChange(event) {
      var columnCount = this.state.columnCount;
      var scrollToColumn = Math.min(columnCount - 1, parseInt(event.target.value, 10));

      if (isNaN(scrollToColumn)) {
        scrollToColumn = undefined;
      }

      this.setState({
        scrollToColumn: scrollToColumn
      });
    }
  }, {
    key: "_onScrollToRowChange",
    value: function _onScrollToRowChange(event) {
      var rowCount = this.state.rowCount;
      var scrollToRow = Math.min(rowCount - 1, parseInt(event.target.value, 10));

      if (isNaN(scrollToRow)) {
        scrollToRow = undefined;
      }

      this.setState({
        scrollToRow: scrollToRow
      });
    }
  }]);
  return GridExample;
}(React.PureComponent);

exports["default"] = GridExample;
(0, _defineProperty2["default"])(GridExample, "contextTypes", {
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired
});