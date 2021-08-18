import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import Column from './Column';
import Table from './Table';
import SortDirection from './SortDirection';
import SortIndicator from './SortIndicator';
import styles from './Table.example.css';

var TableExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(TableExample, _React$PureComponent);

  function TableExample(props, context) {
    var _this;

    _classCallCheck(this, TableExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TableExample).call(this, props, context));
    var sortBy = 'index';
    var sortDirection = SortDirection.ASC;

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
    _this._getRowHeight = _this._getRowHeight.bind(_assertThisInitialized(_this));
    _this._headerRenderer = _this._headerRenderer.bind(_assertThisInitialized(_this));
    _this._footerRenderer = _this._footerRenderer.bind(_assertThisInitialized(_this));
    _this._noRowsRenderer = _this._noRowsRenderer.bind(_assertThisInitialized(_this));
    _this._onRowCountChange = _this._onRowCountChange.bind(_assertThisInitialized(_this));
    _this._onScrollToRowChange = _this._onScrollToRowChange.bind(_assertThisInitialized(_this));
    _this._rowClassName = _this._rowClassName.bind(_assertThisInitialized(_this));
    _this._sort = _this._sort.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TableExample, [{
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

      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "Table",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Table/Table.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md"
      }), React.createElement(ContentBoxParagraph, null, "The table layout below is created with flexboxes. This allows it to have a fixed header and scrollable body content. It also makes use of", ' ', React.createElement("code", null, "Grid"), " for windowing table content so that large lists are rendered efficiently. Adjust its configurable properties below to see how it reacts."), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use dynamic row heights?",
        checked: useDynamicRowHeight,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2._updateUseDynamicRowHeight(event.target.checked);
        }
      }), "Use dynamic row heights?"), React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Hide index?",
        checked: hideIndexRow,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            hideIndexRow: event.target.checked
          });
        }
      }), "Hide index?"), React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Hide header?",
        checked: disableHeader,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            disableHeader: event.target.checked
          });
        }
      }), "Hide header?"), React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show footer?",
        checked: enableFooter,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            enableFooter: event.target.checked
          });
        }
      }), "Show footer?")), React.createElement(InputRow, null, React.createElement(LabeledInput, {
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
        label: "Header height",
        name: "headerHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            headerHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: headerHeight
      }), React.createElement(LabeledInput, {
        label: "Footer height",
        name: "footerHeight",
        onChange: function onChange(event) {
          return _this2.setState({
            footerHeight: parseInt(event.target.value, 10) || 1
          });
        },
        value: footerHeight
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
      }, function (_ref2) {
        var width = _ref2.width;
        return React.createElement(Table, {
          ref: "Table",
          disableHeader: disableHeader,
          enableFooter: enableFooter,
          headerClassName: styles.headerColumn,
          headerHeight: headerHeight,
          footerClassName: styles.footerColumn,
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
        }, !hideIndexRow && React.createElement(Column, {
          label: "Index",
          cellDataGetter: function cellDataGetter(_ref3) {
            var rowData = _ref3.rowData;
            return rowData.index;
          },
          dataKey: "index",
          disableSort: !_this2._isSortEnabled(),
          width: 60
        }), React.createElement(Column, {
          dataKey: "name",
          disableSort: !_this2._isSortEnabled(),
          headerRenderer: _this2._headerRenderer,
          footerRenderer: _this2._footerRenderer,
          width: 90
        }), React.createElement(Column, {
          width: 210,
          disableSort: true,
          label: "The description label is really long so that it will be truncated",
          dataKey: "random",
          className: styles.exampleColumn,
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
      return React.createElement("div", null, "Full Name", sortBy === dataKey && React.createElement(SortIndicator, {
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
    key: "_rowClassName",
    value: function _rowClassName(_ref7) {
      var index = _ref7.index;

      if (index < 0) {
        return styles.headerRow;
      } else {
        return index % 2 === 0 ? styles.evenRow : styles.oddRow;
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
        return sortDirection === SortDirection.DESC ? list.reverse() : list;
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

_defineProperty(TableExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { TableExample as default };