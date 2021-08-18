import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import * as React from 'react';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import ArrowKeyStepper from './';
/*:: import { type ScrollIndices } from './';*/

import AutoSizer from '../AutoSizer';
import Grid from '../Grid';
import clsx from 'clsx';
import styles from './ArrowKeyStepper.example.css';
/*:: type State = {
  mode: 'edges' | 'cells',
  isClickable: boolean,
  scrollToColumn: number,
  scrollToRow: number,
};*/

var ArrowKeyStepperExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ArrowKeyStepperExample, _React$PureComponent);

  function ArrowKeyStepperExample() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ArrowKeyStepperExample);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ArrowKeyStepperExample)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      mode: 'edges',
      isClickable: true,
      scrollToColumn: 0,
      scrollToRow: 0
    });

    _defineProperty(_assertThisInitialized(_this), "_getColumnWidth", function (_ref) {
      var index = _ref.index;
      return (1 + index % 3) * 60;
    });

    _defineProperty(_assertThisInitialized(_this), "_getRowHeight", function (_ref2) {
      var index = _ref2.index;
      return (1 + index % 3) * 30;
    });

    _defineProperty(_assertThisInitialized(_this), "_cellRenderer", function (_ref3) {
      var columnIndex = _ref3.columnIndex,
          key = _ref3.key,
          rowIndex = _ref3.rowIndex,
          scrollToColumn = _ref3.scrollToColumn,
          scrollToRow = _ref3.scrollToRow,
          style = _ref3.style;
      var className = clsx(styles.Cell, _defineProperty({}, styles.FocusedCell, columnIndex === scrollToColumn && rowIndex === scrollToRow));
      return React.createElement("span", {
        role: "none",
        className: className,
        key: key,
        onClick: _this.state.isClickable && function () {
          return _this._selectCell({
            scrollToColumn: columnIndex,
            scrollToRow: rowIndex
          });
        },
        style: style
      }, "r:".concat(rowIndex, ", c:").concat(columnIndex));
    });

    _defineProperty(_assertThisInitialized(_this), "_selectCell", function (_ref4) {
      var scrollToColumn = _ref4.scrollToColumn,
          scrollToRow = _ref4.scrollToRow;

      _this.setState({
        scrollToColumn: scrollToColumn,
        scrollToRow: scrollToRow
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onClickableChange", function (event
    /*: Event*/
    ) {
      if (event.target instanceof HTMLInputElement) {
        _this.setState({
          isClickable: event.target.checked,
          scrollToColumn: 0,
          scrollToRow: 0
        });
      }
    });

    return _this;
  }

  _createClass(ArrowKeyStepperExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          mode = _this$state.mode,
          isClickable = _this$state.isClickable,
          scrollToColumn = _this$state.scrollToColumn,
          scrollToRow = _this$state.scrollToRow;
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "ArrowKeyStepper",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md"
      }), React.createElement(ContentBoxParagraph, null, "This high-order component decorates a ", React.createElement("code", null, "List"), ",", ' ', React.createElement("code", null, "Table"), ", or ", React.createElement("code", null, "Grid"), " and responds to arrow-key events by scrolling one row or column at a time. Focus in the `Grid` below and use the left, right, up, or down arrow keys to move around within the grid."), React.createElement(ContentBoxParagraph, null, "Note that unlike the other HOCs in react-virtualized, the", ' ', React.createElement("code", null, "ArrowKeyStepper"), " adds a ", React.createElement("code", null, "<div>"), " element around its children in order to attach a key-down event handler."), React.createElement(ContentBoxParagraph, null, React.createElement("strong", null, "mode"), ":", React.createElement("label", null, React.createElement("input", {
        "aria-label": "Set mode equal to \"cells\"",
        checked: mode === 'cells',
        className: styles.Radio,
        type: "radio",
        onChange: function onChange(event) {
          return event.target.checked && _this2.setState({
            mode: 'cells'
          });
        },
        value: "cells"
      }), "cells"), React.createElement("label", null, React.createElement("input", {
        "aria-label": "Set mode equal to \"edges\"",
        checked: mode === 'edges',
        className: styles.Radio,
        type: "radio",
        onChange: function onChange(event) {
          return event.target.checked && _this2.setState({
            mode: 'edges'
          });
        },
        value: "edges"
      }), "edges (default)")), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Enable click selection? (resets selection)",
        className: styles.checkbox,
        type: "checkbox",
        checked: isClickable,
        onChange: this._onClickableChange
      }), "Enable click selection? (resets selection)")), React.createElement(ArrowKeyStepper, {
        columnCount: 100,
        isControlled: isClickable,
        onScrollToChange: isClickable ? this._selectCell : undefined,
        mode: mode,
        rowCount: 100,
        scrollToColumn: scrollToColumn,
        scrollToRow: scrollToRow
      }, function (_ref5) {
        var onSectionRendered = _ref5.onSectionRendered,
            scrollToColumn = _ref5.scrollToColumn,
            scrollToRow = _ref5.scrollToRow;
        return React.createElement("div", null, React.createElement(ContentBoxParagraph, null, "Most-recently-stepped column: ".concat(scrollToColumn, ", row: ").concat(scrollToRow)), React.createElement(AutoSizer, {
          disableHeight: true
        }, function (_ref6) {
          var width = _ref6.width;
          return React.createElement(Grid, {
            className: styles.Grid,
            columnWidth: _this2._getColumnWidth,
            columnCount: 100,
            height: 200,
            onSectionRendered: onSectionRendered,
            cellRenderer: function cellRenderer(_ref7) {
              var columnIndex = _ref7.columnIndex,
                  key = _ref7.key,
                  rowIndex = _ref7.rowIndex,
                  style = _ref7.style;
              return _this2._cellRenderer({
                columnIndex: columnIndex,
                key: key,
                rowIndex: rowIndex,
                scrollToColumn: scrollToColumn,
                scrollToRow: scrollToRow,
                style: style
              });
            },
            rowHeight: _this2._getRowHeight,
            rowCount: 100,
            scrollToColumn: scrollToColumn,
            scrollToRow: scrollToRow,
            width: width
          });
        }));
      }));
    }
  }]);

  return ArrowKeyStepperExample;
}(React.PureComponent);

export { ArrowKeyStepperExample as default };