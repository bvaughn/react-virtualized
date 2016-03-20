'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */

var ArrowKeyStepper = function (_Component) {
  _inherits(ArrowKeyStepper, _Component);

  function ArrowKeyStepper(props, context) {
    _classCallCheck(this, ArrowKeyStepper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrowKeyStepper).call(this, props, context));

    _this.state = {
      scrollToColumn: 0,
      scrollToRow: 0
    };

    _this._columnStartIndex = 0;
    _this._columnStopIndex = 0;
    _this._rowStartIndex = 0;
    _this._rowStopIndex = 0;

    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
    return _this;
  }

  _createClass(ArrowKeyStepper, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;
      var _state = this.state;
      var scrollToColumn = _state.scrollToColumn;
      var scrollToRow = _state.scrollToRow;


      return _react2.default.createElement(
        'div',
        {
          className: className,
          onKeyDown: this._onKeyDown
        },
        children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        })
      );
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      var _props2 = this.props;
      var columnsCount = _props2.columnsCount;
      var rowsCount = _props2.rowsCount;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.setState({
            scrollToRow: Math.min(this._rowStopIndex + 1, rowsCount - 1)
          });
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.setState({
            scrollToColumn: Math.max(this._columnStartIndex - 1, 0)
          });
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.setState({
            scrollToColumn: Math.min(this._columnStopIndex + 1, columnsCount - 1)
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.setState({
            scrollToRow: Math.max(this._rowStartIndex - 1, 0)
          });
          break;
      }
    }
  }, {
    key: '_onSectionRendered',
    value: function _onSectionRendered(_ref) {
      var columnStartIndex = _ref.columnStartIndex;
      var columnStopIndex = _ref.columnStopIndex;
      var rowStartIndex = _ref.rowStartIndex;
      var rowStopIndex = _ref.rowStopIndex;

      this._columnStartIndex = columnStartIndex;
      this._columnStopIndex = columnStopIndex;
      this._rowStartIndex = rowStartIndex;
      this._rowStopIndex = rowStopIndex;
    }
  }]);

  return ArrowKeyStepper;
}(_react.Component);

ArrowKeyStepper.propTypes = {
  children: _react.PropTypes.func.isRequired,
  className: _react.PropTypes.string,
  columnsCount: _react.PropTypes.number.isRequired,
  rowsCount: _react.PropTypes.number.isRequired
};
exports.default = ArrowKeyStepper;