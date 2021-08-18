import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import PropTypes from 'prop-types';
import * as React from 'react';
import Immutable from 'immutable';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import Collection from './Collection';
import styles from './Collection.example.css'; // Defines a pattern of sizes and positions for a range of 10 rotating cells
// These cells cover an area of 600 (wide) x 400 (tall)

var GUTTER_SIZE = 3;
var CELL_WIDTH = 75;

var CollectionExample =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CollectionExample, _React$PureComponent);

  function CollectionExample(props, context) {
    var _this;

    _classCallCheck(this, CollectionExample);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CollectionExample).call(this, props, context));
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
    _this._cellRenderer = _this._cellRenderer.bind(_assertThisInitialized(_this));
    _this._cellSizeAndPositionGetter = _this._cellSizeAndPositionGetter.bind(_assertThisInitialized(_this));
    _this._noContentRenderer = _this._noContentRenderer.bind(_assertThisInitialized(_this));
    _this._onCellCountChange = _this._onCellCountChange.bind(_assertThisInitialized(_this));
    _this._onHeightChange = _this._onHeightChange.bind(_assertThisInitialized(_this));
    _this._onHorizontalOverscanSizeChange = _this._onHorizontalOverscanSizeChange.bind(_assertThisInitialized(_this));
    _this._onScrollToCellChange = _this._onScrollToCellChange.bind(_assertThisInitialized(_this));
    _this._onVerticalOverscanSizeChange = _this._onVerticalOverscanSizeChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CollectionExample, [{
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
      return React.createElement(ContentBox, null, React.createElement(ContentBoxHeader, {
        text: "Collection",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Collection/Collection.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md"
      }), React.createElement(ContentBoxParagraph, null, "Renders scattered or non-linear data. Unlike ", React.createElement("code", null, "Grid"), ", which renders checkerboard data, ", React.createElement("code", null, "Collection"), " can render arbitrarily positioned- even overlapping- data."), React.createElement(ContentBoxParagraph, null, React.createElement("label", {
        className: styles.checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Show placeholder while scrolling?",
        checked: showScrollingPlaceholder,
        className: styles.checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          return _this2.setState({
            showScrollingPlaceholder: event.target.checked
          });
        }
      }), "Show placeholder while scrolling?")), React.createElement(InputRow, null, React.createElement(LabeledInput, {
        label: "Num cells",
        name: "cellCount",
        onChange: this._onCellCountChange,
        value: cellCount
      }), React.createElement(LabeledInput, {
        label: "Scroll to cell",
        name: "onScrollToCell",
        placeholder: "Index...",
        onChange: this._onScrollToCellChange,
        value: scrollToCell || ''
      }), React.createElement(LabeledInput, {
        label: "Height",
        name: "height",
        onChange: this._onHeightChange,
        value: height
      }), React.createElement(LabeledInput, {
        label: "Horizontal Overscan",
        name: "horizontalOverscanSize",
        onChange: this._onHorizontalOverscanSizeChange,
        value: horizontalOverscanSize
      }), React.createElement(LabeledInput, {
        label: "Vertical Overscan",
        name: "verticalOverscanSize",
        onChange: this._onVerticalOverscanSizeChange,
        value: verticalOverscanSize
      })), React.createElement(AutoSizer, {
        disableHeight: true
      }, function (_ref) {
        var width = _ref.width;
        return React.createElement(Collection, {
          cellCount: cellCount,
          cellRenderer: _this2._cellRenderer,
          cellSizeAndPositionGetter: _this2._cellSizeAndPositionGetter,
          className: styles.collection,
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
        className: styles.cell,
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
        className: styles.noCells
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

_defineProperty(CollectionExample, "contextTypes", {
  list: PropTypes.instanceOf(Immutable.List).isRequired
});

export { CollectionExample as default };