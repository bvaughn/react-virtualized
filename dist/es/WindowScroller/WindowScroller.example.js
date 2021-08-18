import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import clsx from 'clsx';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';
import WindowScroller from './WindowScroller';
import List from '../List';
import AutoSizer from '../AutoSizer';
import styles from './WindowScroller.example.css';
/*:: type State = {
  scrollToIndex: number,
  showHeaderText: boolean,
};*/

var WindowScrollerExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(WindowScrollerExample, _React$PureComponent);

  function WindowScrollerExample() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, WindowScrollerExample);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WindowScrollerExample)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      scrollToIndex: -1,
      showHeaderText: true
    });

    _defineProperty(_assertThisInitialized(_this), "_windowScroller", void 0);

    _defineProperty(_assertThisInitialized(_this), "_hideHeader", function () {
      var showHeaderText = _this.state.showHeaderText;

      _this.setState({
        showHeaderText: !showHeaderText
      }, function () {
        if (_this._windowScroller) {
          _this._windowScroller.updatePosition();
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_rowRenderer", function (_ref) {
      var _clsx;

      var index = _ref.index,
          isScrolling = _ref.isScrolling,
          isVisible = _ref.isVisible,
          key = _ref.key,
          style = _ref.style;
      var list = _this.context.list;
      var row = list.get(index);
      var className = clsx(styles.row, (_clsx = {}, _defineProperty(_clsx, styles.rowScrolling, isScrolling), _defineProperty(_clsx, "isVisible", isVisible), _clsx));
      return React.createElement("div", {
        key: key,
        className: className,
        style: style
      }, row.name);
    });

    _defineProperty(_assertThisInitialized(_this), "_setRef", function (windowScroller) {
      _this._windowScroller = windowScroller;
    });

    _defineProperty(_assertThisInitialized(_this), "_onCheckboxChange", function (event) {
      _this.context.setScrollingCustomElement(event.target.checked);
    });

    _defineProperty(_assertThisInitialized(_this), "_onScrollToRowChange", function (event) {
      var list = _this.context.list;
      var scrollToIndex = Math.min(list.size - 1, parseInt(event.target.value, 10));

      if (isNaN(scrollToIndex)) {
        scrollToIndex = undefined;
      }

      setTimeout(function () {
        _this.setState({
          scrollToIndex: scrollToIndex
        });
      }, 0);
    });

    return _this;
  }

  _createClass(WindowScrollerExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$context = this.context,
          customElement = _this$context.customElement,
          isScrollingCustomElement = _this$context.isScrollingCustomElement,
          list = _this$context.list;
      var _this$state = this.state,
          scrollToIndex = _this$state.scrollToIndex,
          showHeaderText = _this$state.showHeaderText;
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "WindowScroller",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/WindowScroller/WindowScroller.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md"
      }), showHeaderText && React.createElement(ContentBoxParagraph, null, "This component decorates ", React.createElement("code", null, "List"), ", ", React.createElement("code", null, "Table"), ", or any other component and manages the window scroll to scroll through the list"), showHeaderText && React.createElement(ContentBoxParagraph, null, React.createElement("button", {
        onClick: this._hideHeader
      }, "Hide header text")), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use custom element for scrolling",
        className: styles.checkbox,
        type: "checkbox",
        checked: isScrollingCustomElement,
        onChange: this._onCheckboxChange
      }), "Use custom element for scrolling")), React.createElement(InputRow, null, React.createElement(LabeledInput, {
        label: "Scroll to",
        name: "onScrollToRow",
        placeholder: "Index...",
        onChange: this._onScrollToRowChange,
        value: scrollToIndex || ''
      })), React.createElement(WindowScroller, {
        ref: this._setRef,
        scrollElement: isScrollingCustomElement ? customElement : window
      }, function (_ref2) {
        var height = _ref2.height,
            isScrolling = _ref2.isScrolling,
            registerChild = _ref2.registerChild,
            onChildScroll = _ref2.onChildScroll,
            scrollTop = _ref2.scrollTop;
        return React.createElement("div", {
          className: styles.WindowScrollerWrapper
        }, React.createElement(AutoSizer, {
          disableHeight: true
        }, function (_ref3) {
          var width = _ref3.width;
          return React.createElement("div", {
            ref: registerChild
          }, React.createElement(List, {
            ref: function ref(el) {
              window.listEl = el;
            },
            autoHeight: true,
            className: styles.List,
            height: height,
            isScrolling: isScrolling,
            onScroll: onChildScroll,
            overscanRowCount: 2,
            rowCount: list.size,
            rowHeight: 30,
            rowRenderer: _this2._rowRenderer,
            scrollToIndex: scrollToIndex,
            scrollTop: scrollTop,
            width: width
          }));
        }));
      }));
    }
  }]);

  return WindowScrollerExample;
}(React.PureComponent);

_defineProperty(WindowScrollerExample, "contextTypes", {
  customElement: PropTypes.any,
  isScrollingCustomElement: PropTypes.bool.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  setScrollingCustomElement: PropTypes.func
});

export { WindowScrollerExample as default };