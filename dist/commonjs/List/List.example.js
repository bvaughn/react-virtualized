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

var _clsx = _interopRequireDefault(require("clsx"));

var _immutable = _interopRequireDefault(require("immutable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _ListExample = _interopRequireDefault(require("./List.example.css"));

var _AutoSizer = _interopRequireDefault(require("../AutoSizer"));

var _List = _interopRequireDefault(require("./List"));

var _ContentBox = require("../demo/ContentBox");

var _LabeledInput = require("../demo/LabeledInput");

var ListExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(ListExample, _React$PureComponent);

  function ListExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, ListExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ListExample).call(this, props, context));
    _this.state = {
      listHeight: 300,
      listRowHeight: 50,
      overscanRowCount: 10,
      rowCount: context.list.size,
      scrollToIndex: undefined,
      showScrollingPlaceholder: false,
      useDynamicRowHeight: false
    };
    _this._getRowHeight = _this._getRowHeight.bind((0, _assertThisInitialized2["default"])(_this));
    _this._noRowsRenderer = _this._noRowsRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this._rowRenderer = _this._rowRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ListExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          listHeight = _this$state.listHeight,
          listRowHeight = _this$state.listRowHeight,
          overscanRowCount = _this$state.overscanRowCount,
          rowCount = _this$state.rowCount,
          scrollToIndex = _this$state.scrollToIndex,
          showScrollingPlaceholder = _this$state.showScrollingPlaceholder,
          useDynamicRowHeight = _this$state.useDynamicRowHeight;
      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "List",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/List/List.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "The list below is windowed (or \"virtualized\") meaning that only the visible rows are rendered. Adjust its configurable properties below to see how it reacts."), React.createElement(_ContentBox.ContentBoxParagraph, null, React.createElement("label", {
        className: _ListExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row heights?",
        checked: useDynamicRowHeight,
        className: _ListExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            useDynamicRowHeight: event.target.checked
          });
        }
      }), "Use dynamic row heights?"), React.createElement("label", {
        className: _ListExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show scrolling placeholder?",
        checked: showScrollingPlaceholder,
        className: _ListExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            showScrollingPlaceholder: event.target.checked
          });
        }
      }), "Show scrolling placeholder?")), React.createElement(_LabeledInput.InputRow, null, React.createElement(_LabeledInput.LabeledInput, {
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
        name: "listHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            listHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: listHeight
      }), React.createElement(_LabeledInput.LabeledInput, {
        disabled: useDynamicRowHeight,
        label: "Row height",
        name: "listRowHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            listRowHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: listRowHeight
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
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(_List["default"], {
          ref: "List",
          className: _ListExample["default"].List,
          height: listHeight,
          overscanRowCount: overscanRowCount,
          noRowsRenderer: _this2._noRowsRenderer,
          rowCount: rowCount,
          rowHeight: useDynamicRowHeight ? _this2._getRowHeight : listRowHeight,
          rowRenderer: _this2._rowRenderer,
          scrollToIndex: scrollToIndex,
          width: width
        });
      })));
    }
  }, {
    key: "_getDatum",
    value: function _getDatum(index) {
      var list = this.context.list;
      return list.get(index % list.size);
    }
  }, {
    key: "_getRowHeight",
    value: function _getRowHeight(_ref2) {
      var index = _ref2.index;
      return this._getDatum(index).size;
    }
  }, {
    key: "_noRowsRenderer",
    value: function _noRowsRenderer() {
      return React.createElement("div", {
        className: _ListExample["default"].noRows
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
    key: "_rowRenderer",
    value: function _rowRenderer(_ref3) {
      var index = _ref3.index,
          isScrolling = _ref3.isScrolling,
          key = _ref3.key,
          style = _ref3.style;
      var _this$state2 = this.state,
          showScrollingPlaceholder = _this$state2.showScrollingPlaceholder,
          useDynamicRowHeight = _this$state2.useDynamicRowHeight;

      if (showScrollingPlaceholder && isScrolling) {
        return React.createElement("div", {
          className: (0, _clsx["default"])(_ListExample["default"].row, _ListExample["default"].isScrollingPlaceholder),
          key: key,
          style: style
        }, "Scrolling...");
      }

      var datum = this._getDatum(index);

      var additionalContent;

      if (useDynamicRowHeight) {
        switch (datum.size) {
          case 75:
            additionalContent = React.createElement("div", null, "It is medium-sized.");
            break;

          case 100:
            additionalContent = React.createElement("div", null, "It is large-sized.", React.createElement("br", null), "It has a 3rd row.");
            break;
        }
      }

      return React.createElement("div", {
        className: _ListExample["default"].row,
        key: key,
        style: style
      }, React.createElement("div", {
        className: _ListExample["default"].letter,
        style: {
          backgroundColor: datum.color
        }
      }, datum.name.charAt(0)), React.createElement("div", null, React.createElement("div", {
        className: _ListExample["default"].name
      }, datum.name), React.createElement("div", {
        className: _ListExample["default"].index
      }, "This is row ", index), additionalContent), useDynamicRowHeight && React.createElement("span", {
        className: _ListExample["default"].height
      }, datum.size, "px"));
    }
  }]);
  return ListExample;
}(React.PureComponent);

exports["default"] = ListExample;
(0, _defineProperty2["default"])(ListExample, "contextTypes", {
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired
});