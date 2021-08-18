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
import { LabeledInput, InputRow } from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import MultiGrid from './MultiGrid';
import styles from './MultiGrid.example.css';
var STYLE = {
  border: '1px solid #ddd'
};
var STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7'
};
var STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold'
};
var STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold'
};

var MultiGridExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(MultiGridExample, _React$PureComponent);

  function MultiGridExample(props, context) {
    var _this;

    _classCallCheck(this, MultiGridExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultiGridExample).call(this, props, context));
    _this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0
    };
    _this._cellRenderer = _this._cellRenderer.bind(_assertThisInitialized(_this));
    _this._onFixedColumnCountChange = _this._createEventHandler('fixedColumnCount');
    _this._onFixedRowCountChange = _this._createEventHandler('fixedRowCount');
    _this._onScrollToColumnChange = _this._createEventHandler('scrollToColumn');
    _this._onScrollToRowChange = _this._createEventHandler('scrollToRow');
    return _this;
  }

  _createClass(MultiGridExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "MultiGrid",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md"
      }), React.createElement(ContentBoxParagraph, null, "This component stitches together several grids to provide a fixed column/row interface."), React.createElement(InputRow, null, this._createLabeledInput('fixedColumnCount', this._onFixedColumnCountChange), this._createLabeledInput('fixedRowCount', this._onFixedRowCountChange), this._createLabeledInput('scrollToColumn', this._onScrollToColumnChange), this._createLabeledInput('scrollToRow', this._onScrollToRowChange)), React.createElement(AutoSizer, {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(MultiGrid, _extends({}, _this2.state, {
          cellRenderer: _this2._cellRenderer,
          columnWidth: 75,
          columnCount: 50,
          enableFixedColumnScroll: true,
          enableFixedRowScroll: true,
          height: 300,
          rowHeight: 40,
          rowCount: 100,
          style: STYLE,
          styleBottomLeftGrid: STYLE_BOTTOM_LEFT_GRID,
          styleTopLeftGrid: STYLE_TOP_LEFT_GRID,
          styleTopRightGrid: STYLE_TOP_RIGHT_GRID,
          width: width,
          hideTopRightGridScrollbar: true,
          hideBottomLeftGridScrollbar: true
        }));
      }));
    }
  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref2) {
      var columnIndex = _ref2.columnIndex,
          key = _ref2.key,
          rowIndex = _ref2.rowIndex,
          style = _ref2.style;
      return React.createElement("div", {
        className: styles.Cell,
        key: key,
        style: style
      }, columnIndex, ", ", rowIndex);
    }
  }, {
    key: "_createEventHandler",
    value: function _createEventHandler(property) {
      var _this3 = this;

      return function (event) {
        var value = parseInt(event.target.value, 10) || 0;

        _this3.setState(_defineProperty({}, property, value));
      };
    }
  }, {
    key: "_createLabeledInput",
    value: function _createLabeledInput(property, eventHandler) {
      var value = this.state[property];
      return React.createElement(LabeledInput, {
        label: property,
        name: property,
        onChange: eventHandler,
        value: value
      });
    }
  }]);

  return MultiGridExample;
}(React.PureComponent);

_defineProperty(MultiGridExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { MultiGridExample as default };