'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var babelPluginFlowReactPropTypes_proptype_RenderedSection = require('../Grid').babelPluginFlowReactPropTypes_proptype_RenderedSection || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ScrollIndices = require('./types').babelPluginFlowReactPropTypes_proptype_ScrollIndices || require('prop-types').any;

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */

var ArrowKeyStepper = function (_React$PureComponent) {
  _inherits(ArrowKeyStepper, _React$PureComponent);

  function ArrowKeyStepper(props) {
    _classCallCheck(this, ArrowKeyStepper);

    var _this = _possibleConstructorReturn(this, (ArrowKeyStepper.__proto__ || Object.getPrototypeOf(ArrowKeyStepper)).call(this, props));

    _this._columnStartIndex = 0;
    _this._columnStopIndex = 0;
    _this._rowStartIndex = 0;
    _this._rowStopIndex = 0;

    _this._onKeyDown = function (event) {
      var _this$props = _this.props,
          columnCount = _this$props.columnCount,
          disabled = _this$props.disabled,
          mode = _this$props.mode,
          rowCount = _this$props.rowCount;


      if (disabled) {
        return;
      }

      var _this$_getScrollState = _this._getScrollState(),
          scrollToColumnPrevious = _this$_getScrollState.scrollToColumn,
          scrollToRowPrevious = _this$_getScrollState.scrollToRow;

      var _this$_getScrollState2 = _this._getScrollState(),
          scrollToColumn = _this$_getScrollState2.scrollToColumn,
          scrollToRow = _this$_getScrollState2.scrollToRow;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.


      switch (event.key) {
        case 'ArrowDown':
          scrollToRow = mode === 'cells' ? Math.min(scrollToRow + 1, rowCount - 1) : Math.min(_this._rowStopIndex + 1, rowCount - 1);
          break;
        case 'ArrowLeft':
          scrollToColumn = mode === 'cells' ? Math.max(scrollToColumn - 1, 0) : Math.max(_this._columnStartIndex - 1, 0);
          break;
        case 'ArrowRight':
          scrollToColumn = mode === 'cells' ? Math.min(scrollToColumn + 1, columnCount - 1) : Math.min(_this._columnStopIndex + 1, columnCount - 1);
          break;
        case 'ArrowUp':
          scrollToRow = mode === 'cells' ? Math.max(scrollToRow - 1, 0) : Math.max(_this._rowStartIndex - 1, 0);
          break;
      }

      if (scrollToColumn !== scrollToColumnPrevious || scrollToRow !== scrollToRowPrevious) {
        event.preventDefault();

        _this._updateScrollState({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }
    };

    _this._onSectionRendered = function (_ref) {
      var columnStartIndex = _ref.columnStartIndex,
          columnStopIndex = _ref.columnStopIndex,
          rowStartIndex = _ref.rowStartIndex,
          rowStopIndex = _ref.rowStopIndex;

      _this._columnStartIndex = columnStartIndex;
      _this._columnStopIndex = columnStopIndex;
      _this._rowStartIndex = rowStartIndex;
      _this._rowStopIndex = rowStopIndex;
    };

    _this.state = {
      scrollToColumn: props.scrollToColumn,
      scrollToRow: props.scrollToRow
    };
    return _this;
  }

  _createClass(ArrowKeyStepper, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.isControlled) {
        return;
      }

      var scrollToColumn = nextProps.scrollToColumn,
          scrollToRow = nextProps.scrollToRow;
      var _props = this.props,
          prevScrollToColumn = _props.scrollToColumn,
          prevScrollToRow = _props.scrollToRow;


      if (prevScrollToColumn !== scrollToColumn && prevScrollToRow !== scrollToRow) {
        this.setState({
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        });
      } else if (prevScrollToColumn !== scrollToColumn) {
        this.setState({ scrollToColumn: scrollToColumn });
      } else if (prevScrollToRow !== scrollToRow) {
        this.setState({ scrollToRow: scrollToRow });
      }
    }
  }, {
    key: 'setScrollIndexes',
    value: function setScrollIndexes(_ref2) {
      var scrollToColumn = _ref2.scrollToColumn,
          scrollToRow = _ref2.scrollToRow;

      this.setState({
        scrollToRow: scrollToRow,
        scrollToColumn: scrollToColumn
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          children = _props2.children;

      var _getScrollState2 = this._getScrollState(),
          scrollToColumn = _getScrollState2.scrollToColumn,
          scrollToRow = _getScrollState2.scrollToRow;

      return _react2.default.createElement(
        'div',
        { className: className, onKeyDown: this._onKeyDown },
        children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        })
      );
    }
  }, {
    key: '_getScrollState',
    value: function _getScrollState() {
      return this.props.isControlled ? this.props : this.state;
    }
  }, {
    key: '_updateScrollState',
    value: function _updateScrollState(_ref3) {
      var scrollToColumn = _ref3.scrollToColumn,
          scrollToRow = _ref3.scrollToRow;
      var _props3 = this.props,
          isControlled = _props3.isControlled,
          onScrollToChange = _props3.onScrollToChange;


      if (typeof onScrollToChange === 'function') {
        onScrollToChange({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }

      if (!isControlled) {
        this.setState({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }
    }
  }]);

  return ArrowKeyStepper;
}(_react2.default.PureComponent);

ArrowKeyStepper.defaultProps = {
  disabled: false,
  isControlled: false,
  mode: 'edges',
  scrollToColumn: 0,
  scrollToRow: 0
};
ArrowKeyStepper.propTypes = {
  children: require('prop-types').func.isRequired,
  className: require('prop-types').string,
  columnCount: require('prop-types').number.isRequired,
  disabled: require('prop-types').bool.isRequired,
  isControlled: require('prop-types').bool.isRequired,
  mode: require('prop-types').oneOf(['cells', 'edges']).isRequired,
  onScrollToChange: require('prop-types').func,
  rowCount: require('prop-types').number.isRequired,
  scrollToColumn: require('prop-types').number.isRequired,
  scrollToRow: require('prop-types').number.isRequired
};
exports.default = ArrowKeyStepper;