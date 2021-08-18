import _extends from "@babel/runtime/helpers/extends";
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
import AutoSizer from '../AutoSizer';
import clsx from 'clsx';
import styles from './CellMeasurer.example.css';
import DynamicWidthGrid from './CellMeasurer.DynamicWidthGrid.example.js';
import DynamicHeightGrid from './CellMeasurer.DynamicHeightGrid.example.js';
import DynamicWidthMultiGrid from './CellMeasurer.DynamicWidthMultiGrid.example.js';
import DynamicHeightList from './CellMeasurer.DynamicHeightList.example.js';
import DynamicHeightTableColumn from './CellMeasurer.DynamicHeightTableColumn.example.js';
var demoComponents = [DynamicWidthGrid, DynamicHeightGrid, DynamicWidthMultiGrid, DynamicHeightList, DynamicHeightTableColumn];

var CellMeasurerExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CellMeasurerExample, _React$PureComponent);

  function CellMeasurerExample(props, context) {
    var _this;

    _classCallCheck(this, CellMeasurerExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CellMeasurerExample).call(this, props, context));
    _this.state = {
      currentTab: 0
    };
    _this._onClick = _this._onClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CellMeasurerExample, [{
    key: "render",
    value: function render() {
      var list = this.context.list;
      var currentTab = this.state.currentTab;
      var buttonProps = {
        currentTab: currentTab,
        onClick: this._onClick
      };
      var DemoComponent = demoComponents[currentTab];
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "CellMeasurer",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md"
      }), React.createElement(ContentBoxParagraph, null, "This component can be used to just-in-time measure dynamic content (eg. messages in a chat interface)."), React.createElement(AutoSizer, {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement("div", {
          style: {
            width: width
          }
        }, React.createElement("div", null, React.createElement("strong", null, "Grid"), ":", React.createElement(Tab, _extends({
          id: 0
        }, buttonProps), "dynamic width text"), React.createElement(Tab, _extends({
          id: 1
        }, buttonProps), "dynamic height text"), React.createElement("strong", null, "MultiGrid"), ":", React.createElement(Tab, _extends({
          id: 2
        }, buttonProps), "dynamic width text"), React.createElement("strong", null, "List"), ":", React.createElement(Tab, _extends({
          id: 3
        }, buttonProps), "dynamic height image"), React.createElement("strong", null, "Table"), ":", React.createElement(Tab, _extends({
          id: 4
        }, buttonProps), "mixed fixed and dynamic height text")), React.createElement(DemoComponent, {
          getClassName: getClassName,
          getContent: getContent,
          list: list,
          width: width
        }));
      }));
    }
  }, {
    key: "_onClick",
    value: function _onClick(id) {
      this.setState({
        currentTab: id
      });
    }
  }]);

  return CellMeasurerExample;
}(React.PureComponent);

_defineProperty(CellMeasurerExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { CellMeasurerExample as default };

function getClassName(_ref2) {
  var columnIndex = _ref2.columnIndex,
      rowIndex = _ref2.rowIndex;
  var rowClass = rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow;
  return clsx(rowClass, styles.cell, _defineProperty({}, styles.centeredCell, columnIndex > 2));
}

function getContent(_ref3) {
  var index = _ref3.index,
      datum = _ref3.datum,
      _ref3$long = _ref3["long"],
      _long = _ref3$long === void 0 ? true : _ref3$long;

  switch (index % 3) {
    case 0:
      return datum.color;

    case 1:
      return datum.name;

    case 2:
      return _long ? datum.randomLong : datum.random;
  }
}

function Tab(_ref4) {
  var children = _ref4.children,
      currentTab = _ref4.currentTab,
      id = _ref4.id,
      _onClick2 = _ref4.onClick;
  var classNames = clsx(styles.Tab, _defineProperty({}, styles.ActiveTab, currentTab === id));
  return React.createElement("button", {
    className: classNames,
    onClick: function onClick() {
      return _onClick2(id);
    }
  }, children);
}