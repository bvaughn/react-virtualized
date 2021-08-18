import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import Grid from './Grid';
import clsx from 'clsx';
import styles from './Grid.example.css';

var GridExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(GridExample, _React$PureComponent);

  function GridExample(props, context) {
    var _this;

    _classCallCheck(this, GridExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GridExample).call(this, props, context));
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
    _this._cellRenderer = _this._cellRenderer.bind(_assertThisInitialized(_this));
    _this._getColumnWidth = _this._getColumnWidth.bind(_assertThisInitialized(_this));
    _this._getRowClassName = _this._getRowClassName.bind(_assertThisInitialized(_this));
    _this._getRowHeight = _this._getRowHeight.bind(_assertThisInitialized(_this));
    _this._noContentRenderer = _this._noContentRenderer.bind(_assertThisInitialized(_this));
    _this._onColumnCountChange = _this._onColumnCountChange.bind(_assertThisInitialized(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind(_assertThisInitialized(_this));
    _this._onScrollToColumnChange = _this._onScrollToColumnChange.bind(_assertThisInitialized(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind(_assertThisInitialized(_this));
    _this._renderBodyCell = _this._renderBodyCell.bind(_assertThisInitialized(_this));
    _this._renderLeftSideCell = _this._renderLeftSideCell.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GridExample, [{
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
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "Grid",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md"
      }), React.createElement(ContentBoxParagraph, null, "Renders tabular data with virtualization along the vertical and horizontal axes. Row heights and column widths must be calculated ahead of time and specified as a fixed size or returned by a getter function."), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row height?",
        className: styles.checkbox,
        type: "checkbox",
        value: useDynamicRowHeight,
        onChange: function onChange(event) {
          return _this2._updateUseDynamicRowHeights(event.target.checked);
        }
      }), "Use dynamic row height?")), React.createElement(InputRow, null, React.createElement(LabeledInput, {
        label: "Num columns",
        name: "columnCount",
        onChange: this._onColumnCountChange,
        value: columnCount
      }), React.createElement(LabeledInput, {
        label: "Num rows",
        name: "rowCount",
        onChange: this._onRowCountChange,
        value: rowCount
      }), React.createElement(LabeledInput, {
        label: "Scroll to column",
        name: "onScrollToColumn",
        placeholder: "Index...",
        onChange: this._onScrollToColumnChange,
        value: scrollToColumn || ''
      }), React.createElement(LabeledInput, {
        label: "Scroll to row",
        name: "onScrollToRow",
        placeholder: "Index...",
        onChange: this._onScrollToRowChange,
        value: scrollToRow || ''
      }), React.createElement(LabeledInput, {
        label: "List height",
        name: "height",
        onChange: function onChange(event) {
          return _this2.setState({
            height: parseInt(event.target.value, 10) || 1
          });
        },
        value: height
      }), React.createElement(LabeledInput, {
        disabled: useDynamicRowHeight,
        label: "Row height",
        name: "rowHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            rowHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: rowHeight
      }), React.createElement(LabeledInput, {
        label: "Overscan columns",
        name: "overscanColumnCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanColumnCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanColumnCount
      }), React.createElement(LabeledInput, {
        label: "Overscan rows",
        name: "overscanRowCount",
        onChange: function onChange(event) {
          return _this2.setState({
            overscanRowCount: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanRowCount
      })), React.createElement(AutoSizer, {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(Grid, {
          cellRenderer: _this2._cellRenderer,
          className: styles.BodyGrid,
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
      return row % 2 === 0 ? styles.evenRow : styles.oddRow;
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
        className: styles.noCells
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

      var classNames = clsx(rowClass, styles.cell, _defineProperty({}, styles.centeredCell, columnIndex > 2));
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

      var classNames = clsx(styles.cell, styles.letterCell); // Don't modify styles.
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

_defineProperty(GridExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { GridExample as default };