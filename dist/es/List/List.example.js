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
import styles from './List.example.css';
import AutoSizer from '../AutoSizer';
import List from './List';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';

var ListExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ListExample, _React$PureComponent);

  function ListExample(props, context) {
    var _this;

    _classCallCheck(this, ListExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListExample).call(this, props, context));
    _this.state = {
      listHeight: 300,
      listRowHeight: 50,
      overscanRowCount: 10,
      rowCount: context.list.size,
      scrollToIndex: undefined,
      showScrollingPlaceholder: false,
      useDynamicRowHeight: false
    };
    _this._getRowHeight = _this._getRowHeight.bind(_assertThisInitialized(_this));
    _this._noRowsRenderer = _this._noRowsRenderer.bind(_assertThisInitialized(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind(_assertThisInitialized(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind(_assertThisInitialized(_this));
    _this._rowRenderer = _this._rowRenderer.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ListExample, [{
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
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "List",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/List/List.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md"
      }), React.createElement(ContentBoxParagraph, null, "The list below is windowed (or \"virtualized\") meaning that only the visible rows are rendered. Adjust its configurable properties below to see how it reacts."), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row heights?",
        checked: useDynamicRowHeight,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            useDynamicRowHeight: event.target.checked
          });
        }
      }), "Use dynamic row heights?"), React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show scrolling placeholder?",
        checked: showScrollingPlaceholder,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            showScrollingPlaceholder: event.target.checked
          });
        }
      }), "Show scrolling placeholder?")), React.createElement(InputRow, null, React.createElement(LabeledInput, {
        label: "Num rows",
        name: "rowCount",
        onChange: this._onRowCountChange,
        value: rowCount
      }), React.createElement(LabeledInput, {
        label: "Scroll to",
        name: "onScrollToRow",
        placeholder: "Index...",
        onChange: this._onScrollToRowChange,
        value: scrollToIndex || ''
      }), React.createElement(LabeledInput, {
        label: "List height",
        name: "listHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            listHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: listHeight
      }), React.createElement(LabeledInput, {
        disabled: useDynamicRowHeight,
        label: "Row height",
        name: "listRowHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            listRowHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: listRowHeight
      }), React.createElement(LabeledInput, {
        label: "Overscan",
        name: "overscanRowCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanRowCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanRowCount
      })), React.createElement("div", null, React.createElement(AutoSizer, {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(List, {
          ref: "List",
          className: styles.List,
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
        className: styles.noRows
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
          className: clsx(styles.row, styles.isScrollingPlaceholder),
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
        className: styles.row,
        key: key,
        style: style
      }, React.createElement("div", {
        className: styles.letter,
        style: {
          backgroundColor: datum.color
        }
      }, datum.name.charAt(0)), React.createElement("div", null, React.createElement("div", {
        className: styles.name
      }, datum.name), React.createElement("div", {
        className: styles.index
      }, "This is row ", index), additionalContent), useDynamicRowHeight && React.createElement("span", {
        className: styles.height
      }, datum.size, "px"));
    }
  }]);

  return ListExample;
}(React.PureComponent);

_defineProperty(ListExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { ListExample as default };