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

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _immutable = _interopRequireDefault(require("immutable"));

var _ContentBox = require("../demo/ContentBox");

var _LabeledInput = require("../demo/LabeledInput");

var _AutoSizer = _interopRequireDefault(require("../AutoSizer"));

var _Collection = _interopRequireDefault(require("./Collection"));

var _CollectionExample = _interopRequireDefault(require("./Collection.example.css"));

// Defines a pattern of sizes and positions for a range of 10 rotating cells
// These cells cover an area of 600 (wide) x 400 (tall)
var GUTTER_SIZE = 3;
var CELL_WIDTH = 75;

var CollectionExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(CollectionExample, _React$PureComponent);

  function CollectionExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, CollectionExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CollectionExample).call(this, props, context));
    _this.state = {
      cellCount: context.list.size,
      columnCount: _this._getColumnCount(context.list.size),
      height: 300,
      horizontalOverscanSize: 0,
      scrollToCell: undefined,
      showScrollingPlaceholder: false,
      verticalOverscanSize: 0
    };
    _this._columnYMap = [];
    _this._cellRenderer = _this._cellRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._cellSizeAndPositionGetter = _this._cellSizeAndPositionGetter.bind((0, _assertThisInitialized2["default"])(_this));
    _this._noContentRenderer = _this._noContentRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onCellCountChange = _this._onCellCountChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onHeightChange = _this._onHeightChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onHorizontalOverscanSizeChange = _this._onHorizontalOverscanSizeChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onScrollToCellChange = _this._onScrollToCellChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onVerticalOverscanSizeChange = _this._onVerticalOverscanSizeChange.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(CollectionExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          cellCount = _this$state.cellCount,
          height = _this$state.height,
          horizontalOverscanSize = _this$state.horizontalOverscanSize,
          scrollToCell = _this$state.scrollToCell,
          showScrollingPlaceholder = _this$state.showScrollingPlaceholder,
          verticalOverscanSize = _this$state.verticalOverscanSize;
      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "Collection",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Collection/Collection.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "Renders scattered or non-linear data. Unlike ", React.createElement("code", null, "Grid"), ", which renders checkerboard data, ", React.createElement("code", null, "Collection"), " can render arbitrarily positioned- even overlapping- data."), React.createElement(_ContentBox.ContentBoxParagraph, null, React.createElement("label", {
        className: _CollectionExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show placeholder while scrolling?",
        checked: showScrollingPlaceholder,
        className: _CollectionExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            showScrollingPlaceholder: event.target.checked
          });
        }
      }), "Show placeholder while scrolling?")), React.createElement(_LabeledInput.InputRow, null, React.createElement(_LabeledInput.LabeledInput, {
        label: "Num cells",
        name: "cellCount",
        onChange: this._onCellCountChange,
        value: cellCount
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Scroll to cell",
        name: "onScrollToCell",
        placeholder: "Index...",
        onChange: this._onScrollToCellChange,
        value: scrollToCell || ''
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Height",
        name: "height",
        onChange: this._onHeightChange,
        value: height
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Horizontal Overscan",
        name: "horizontalOverscanSize",
        onChange: this._onHorizontalOverscanSizeChange,
        value: horizontalOverscanSize
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Vertical Overscan",
        name: "verticalOverscanSize",
        onChange: this._onVerticalOverscanSizeChange,
        value: verticalOverscanSize
      })), React.createElement(_AutoSizer["default"], {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(_Collection["default"], {
          cellCount: cellCount,
          cellRenderer: _this2._cellRenderer,
          cellSizeAndPositionGetter: _this2._cellSizeAndPositionGetter,
          className: _CollectionExample["default"].collection,
          height: height,
          horizontalOverscanSize: horizontalOverscanSize,
          noContentRenderer: _this2._noContentRenderer,
          scrollToCell: scrollToCell,
          verticalOverscanSize: verticalOverscanSize,
          width: width
        });
      }));
    }
  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref2) {
      var index = _ref2.index,
          isScrolling = _ref2.isScrolling,
          key = _ref2.key,
          style = _ref2.style;
      var list = this.context.list;
      var showScrollingPlaceholder = this.state.showScrollingPlaceholder;
      var datum = list.get(index % list.size); // Customize style

      style.backgroundColor = datum.color;
      return React.createElement("div", {
        className: _CollectionExample["default"].cell,
        key: key,
        style: style
      }, showScrollingPlaceholder && isScrolling ? '...' : index);
    }
  }, {
    key: "_cellSizeAndPositionGetter",
    value: function _cellSizeAndPositionGetter(_ref3) {
      var index = _ref3.index;
      var list = this.context.list;
      var columnCount = this.state.columnCount;
      var columnPosition = index % (columnCount || 1);
      var datum = list.get(index % list.size); // Poor man's Masonry layout; columns won't all line up equally with the bottom.

      var height = datum.size;
      var width = CELL_WIDTH;
      var x = columnPosition * (GUTTER_SIZE + width);
      var y = this._columnYMap[columnPosition] || 0;
      this._columnYMap[columnPosition] = y + height + GUTTER_SIZE;
      return {
        height: height,
        width: width,
        x: x,
        y: y
      };
    }
  }, {
    key: "_getColumnCount",
    value: function _getColumnCount(cellCount) {
      return Math.round(Math.sqrt(cellCount));
    }
  }, {
    key: "_onHorizontalOverscanSizeChange",
    value: function _onHorizontalOverscanSizeChange(event) {
      var horizontalOverscanSize = parseInt(event.target.value, 10) || 0;
      this.setState({
        horizontalOverscanSize: horizontalOverscanSize
      });
    }
  }, {
    key: "_noContentRenderer",
    value: function _noContentRenderer() {
      return React.createElement("div", {
        className: _CollectionExample["default"].noCells
      }, "No cells");
    }
  }, {
    key: "_onCellCountChange",
    value: function _onCellCountChange(event) {
      var cellCount = parseInt(event.target.value, 10) || 0;
      this._columnYMap = [];
      this.setState({
        cellCount: cellCount,
        columnCount: this._getColumnCount(cellCount)
      });
    }
  }, {
    key: "_onHeightChange",
    value: function _onHeightChange(event) {
      var height = parseInt(event.target.value, 10) || 0;
      this.setState({
        height: height
      });
    }
  }, {
    key: "_onScrollToCellChange",
    value: function _onScrollToCellChange(event) {
      var cellCount = this.state.cellCount;
      var scrollToCell = Math.min(cellCount - 1, parseInt(event.target.value, 10));

      if (isNaN(scrollToCell)) {
        scrollToCell = undefined;
      }

      this.setState({
        scrollToCell: scrollToCell
      });
    }
  }, {
    key: "_onVerticalOverscanSizeChange",
    value: function _onVerticalOverscanSizeChange(event) {
      var verticalOverscanSize = parseInt(event.target.value, 10) || 0;
      this.setState({
        verticalOverscanSize: verticalOverscanSize
      });
    }
  }]);
  return CollectionExample;
}(React.PureComponent);

exports["default"] = CollectionExample;
(0, _defineProperty2["default"])(CollectionExample, "contextTypes", {
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired
});