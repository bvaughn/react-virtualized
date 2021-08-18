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

var React = _interopRequireWildcard(require("react"));

var _ContentBox = require("../demo/ContentBox");

var _AutoSizer = _interopRequireDefault(require("../AutoSizer"));

var _Grid = _interopRequireDefault(require("../Grid"));

var _ScrollSync = _interopRequireDefault(require("./ScrollSync"));

var _clsx = _interopRequireDefault(require("clsx"));

var _ScrollSyncExample = _interopRequireDefault(require("./ScrollSync.example.css"));

var _scrollbarSize = _interopRequireDefault(require("dom-helpers/scrollbarSize"));

var LEFT_COLOR_FROM = hexToRgb('#471061');
var LEFT_COLOR_TO = hexToRgb('#BC3959');
var TOP_COLOR_FROM = hexToRgb('#000000');
var TOP_COLOR_TO = hexToRgb('#333333');

var GridExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(GridExample, _React$PureComponent);

  function GridExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, GridExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GridExample).call(this, props, context));
    _this.state = {
      columnWidth: 75,
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 100
    };
    _this._renderBodyCell = _this._renderBodyCell.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderHeaderCell = _this._renderHeaderCell.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderLeftSideCell = _this._renderLeftSideCell.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(GridExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          columnCount = _this$state.columnCount,
          columnWidth = _this$state.columnWidth,
          height = _this$state.height,
          overscanColumnCount = _this$state.overscanColumnCount,
          overscanRowCount = _this$state.overscanRowCount,
          rowHeight = _this$state.rowHeight,
          rowCount = _this$state.rowCount;
      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "ScrollSync",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/ScrollSync/ScrollSync.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/ScrollSync.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "High order component that simplifies the process of synchronizing scrolling between two or more virtualized components."), React.createElement(_ContentBox.ContentBoxParagraph, null, "This example shows two ", React.createElement("code", null, "Grid"), "s and one ", React.createElement("code", null, "List"), ' ', "configured to mimic a spreadsheet with a fixed header and first column. It also shows how a scroll callback can be used to control UI properties such as background color."), React.createElement(_ScrollSync["default"], null, function (_ref) {
        var clientHeight = _ref.clientHeight,
            clientWidth = _ref.clientWidth,
            onScroll = _ref.onScroll,
            scrollHeight = _ref.scrollHeight,
            scrollLeft = _ref.scrollLeft,
            scrollTop = _ref.scrollTop,
            scrollWidth = _ref.scrollWidth;
        var x = scrollLeft / (scrollWidth - clientWidth);
        var y = scrollTop / (scrollHeight - clientHeight);
        var leftBackgroundColor = mixColors(LEFT_COLOR_FROM, LEFT_COLOR_TO, y);
        var leftColor = '#ffffff';
        var topBackgroundColor = mixColors(TOP_COLOR_FROM, TOP_COLOR_TO, x);
        var topColor = '#ffffff';
        var middleBackgroundColor = mixColors(leftBackgroundColor, topBackgroundColor, 0.5);
        var middleColor = '#ffffff';
        return React.createElement("div", {
          className: _ScrollSyncExample["default"].GridRow
        }, React.createElement("div", {
          className: _ScrollSyncExample["default"].LeftSideGridContainer,
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            color: leftColor,
            backgroundColor: "rgb(".concat(topBackgroundColor.r, ",").concat(topBackgroundColor.g, ",").concat(topBackgroundColor.b, ")")
          }
        }, React.createElement(_Grid["default"], {
          cellRenderer: _this2._renderLeftHeaderCell,
          className: _ScrollSyncExample["default"].HeaderGrid,
          width: columnWidth,
          height: rowHeight,
          rowHeight: rowHeight,
          columnWidth: columnWidth,
          rowCount: 1,
          columnCount: 1
        })), React.createElement("div", {
          className: _ScrollSyncExample["default"].LeftSideGridContainer,
          style: {
            position: 'absolute',
            left: 0,
            top: rowHeight,
            color: leftColor,
            backgroundColor: "rgb(".concat(leftBackgroundColor.r, ",").concat(leftBackgroundColor.g, ",").concat(leftBackgroundColor.b, ")")
          }
        }, React.createElement(_Grid["default"], {
          overscanColumnCount: overscanColumnCount,
          overscanRowCount: overscanRowCount,
          cellRenderer: _this2._renderLeftSideCell,
          columnWidth: columnWidth,
          columnCount: 1,
          className: _ScrollSyncExample["default"].LeftSideGrid,
          height: height - (0, _scrollbarSize["default"])(),
          rowHeight: rowHeight,
          rowCount: rowCount,
          scrollTop: scrollTop,
          width: columnWidth
        })), React.createElement("div", {
          className: _ScrollSyncExample["default"].GridColumn
        }, React.createElement(_AutoSizer["default"], {
          disableHeight: true
        }, function (_ref2) {
          var width = _ref2.width;
          return React.createElement("div", null, React.createElement("div", {
            style: {
              backgroundColor: "rgb(".concat(topBackgroundColor.r, ",").concat(topBackgroundColor.g, ",").concat(topBackgroundColor.b, ")"),
              color: topColor,
              height: rowHeight,
              width: width - (0, _scrollbarSize["default"])()
            }
          }, React.createElement(_Grid["default"], {
            className: _ScrollSyncExample["default"].HeaderGrid,
            columnWidth: columnWidth,
            columnCount: columnCount,
            height: rowHeight,
            overscanColumnCount: overscanColumnCount,
            cellRenderer: _this2._renderHeaderCell,
            rowHeight: rowHeight,
            rowCount: 1,
            scrollLeft: scrollLeft,
            width: width - (0, _scrollbarSize["default"])()
          })), React.createElement("div", {
            style: {
              backgroundColor: "rgb(".concat(middleBackgroundColor.r, ",").concat(middleBackgroundColor.g, ",").concat(middleBackgroundColor.b, ")"),
              color: middleColor,
              height: height,
              width: width
            }
          }, React.createElement(_Grid["default"], {
            className: _ScrollSyncExample["default"].BodyGrid,
            columnWidth: columnWidth,
            columnCount: columnCount,
            height: height,
            onScroll: onScroll,
            overscanColumnCount: overscanColumnCount,
            overscanRowCount: overscanRowCount,
            cellRenderer: _this2._renderBodyCell,
            rowHeight: rowHeight,
            rowCount: rowCount,
            width: width
          })));
        })));
      }));
    }
  }, {
    key: "_renderBodyCell",
    value: function _renderBodyCell(_ref3) {
      var columnIndex = _ref3.columnIndex,
          key = _ref3.key,
          rowIndex = _ref3.rowIndex,
          style = _ref3.style;

      if (columnIndex < 1) {
        return;
      }

      return this._renderLeftSideCell({
        columnIndex: columnIndex,
        key: key,
        rowIndex: rowIndex,
        style: style
      });
    }
  }, {
    key: "_renderHeaderCell",
    value: function _renderHeaderCell(_ref4) {
      var columnIndex = _ref4.columnIndex,
          key = _ref4.key,
          rowIndex = _ref4.rowIndex,
          style = _ref4.style;

      if (columnIndex < 1) {
        return;
      }

      return this._renderLeftHeaderCell({
        columnIndex: columnIndex,
        key: key,
        rowIndex: rowIndex,
        style: style
      });
    }
  }, {
    key: "_renderLeftHeaderCell",
    value: function _renderLeftHeaderCell(_ref5) {
      var columnIndex = _ref5.columnIndex,
          key = _ref5.key,
          style = _ref5.style;
      return React.createElement("div", {
        className: _ScrollSyncExample["default"].headerCell,
        key: key,
        style: style
      }, "C".concat(columnIndex));
    }
  }, {
    key: "_renderLeftSideCell",
    value: function _renderLeftSideCell(_ref6) {
      var columnIndex = _ref6.columnIndex,
          key = _ref6.key,
          rowIndex = _ref6.rowIndex,
          style = _ref6.style;
      var rowClass = rowIndex % 2 === 0 ? columnIndex % 2 === 0 ? _ScrollSyncExample["default"].evenRow : _ScrollSyncExample["default"].oddRow : columnIndex % 2 !== 0 ? _ScrollSyncExample["default"].evenRow : _ScrollSyncExample["default"].oddRow;
      var classNames = (0, _clsx["default"])(rowClass, _ScrollSyncExample["default"].cell);
      return React.createElement("div", {
        className: classNames,
        key: key,
        style: style
      }, "R".concat(rowIndex, ", C").concat(columnIndex));
    }
  }]);
  return GridExample;
}(React.PureComponent);

exports["default"] = GridExample;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */


function mixColors(color1, color2, amount) {
  var weight1 = amount;
  var weight2 = 1 - amount;
  var r = Math.round(weight1 * color1.r + weight2 * color2.r);
  var g = Math.round(weight1 * color1.g + weight2 * color2.g);
  var b = Math.round(weight1 * color1.b + weight2 * color2.b);
  return {
    r: r,
    g: g,
    b: b
  };
}