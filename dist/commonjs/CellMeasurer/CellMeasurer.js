'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _CellMeasurerCache = require('./CellMeasurerCache.js');

var _CellMeasurerCache2 = _interopRequireDefault(_CellMeasurerCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
var CellMeasurer = function (_React$PureComponent) {
  _inherits(CellMeasurer, _React$PureComponent);

  function CellMeasurer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CellMeasurer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CellMeasurer.__proto__ || Object.getPrototypeOf(CellMeasurer)).call.apply(_ref, [this].concat(args))), _this), _this._measure = function () {
      var _this$props = _this.props,
          cache = _this$props.cache,
          _this$props$columnInd = _this$props.columnIndex,
          columnIndex = _this$props$columnInd === undefined ? 0 : _this$props$columnInd,
          parent = _this$props.parent,
          _this$props$rowIndex = _this$props.rowIndex,
          rowIndex = _this$props$rowIndex === undefined ? _this.props.index || 0 : _this$props$rowIndex;

      var _this$_getCellMeasure = _this._getCellMeasurements(),
          height = _this$_getCellMeasure.height,
          width = _this$_getCellMeasure.width;

      if (height !== cache.getHeight(rowIndex, columnIndex) || width !== cache.getWidth(rowIndex, columnIndex)) {
        cache.set(rowIndex, columnIndex, width, height);

        if (parent && typeof parent.recomputeGridSize === 'function') {
          parent.recomputeGridSize({
            columnIndex: columnIndex,
            rowIndex: rowIndex
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CellMeasurer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._maybeMeasureCell();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._maybeMeasureCell();
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return typeof children === 'function' ? children({ measure: this._measure }) : children;
    }
  }, {
    key: '_getCellMeasurements',
    value: function _getCellMeasurements() {
      var cache = this.props.cache;


      var node = (0, _reactDom.findDOMNode)(this);

      // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

      if (node instanceof HTMLElement) {
        var styleWidth = node.style.width;
        var styleHeight = node.style.height;

        // If we are re-measuring a cell that has already been measured,
        // It will have a hard-coded width/height from the previous measurement.
        // The fact that we are measuring indicates this measurement is probably stale,
        // So explicitly clear it out (eg set to "auto") so we can recalculate.
        // See issue #593 for more info.
        // Even if we are measuring initially- if we're inside of a MultiGrid component,
        // Explicitly clear width/height before measuring to avoid being tainted by another Grid.
        // eg top/left Grid renders before bottom/right Grid
        // Since the CellMeasurerCache is shared between them this taints derived cell size values.
        if (!cache.hasFixedWidth()) {
          node.style.width = 'auto';
        }
        if (!cache.hasFixedHeight()) {
          node.style.height = 'auto';
        }

        var height = Math.ceil(node.offsetHeight);
        var width = Math.ceil(node.offsetWidth);

        // Reset after measuring to avoid breaking styles; see #660
        if (styleWidth) {
          node.style.width = styleWidth;
        }
        if (styleHeight) {
          node.style.height = styleHeight;
        }

        return { height: height, width: width };
      } else {
        return { height: 0, width: 0 };
      }
    }
  }, {
    key: '_maybeMeasureCell',
    value: function _maybeMeasureCell() {
      var _props = this.props,
          cache = _props.cache,
          _props$columnIndex = _props.columnIndex,
          columnIndex = _props$columnIndex === undefined ? 0 : _props$columnIndex,
          parent = _props.parent,
          _props$rowIndex = _props.rowIndex,
          rowIndex = _props$rowIndex === undefined ? this.props.index || 0 : _props$rowIndex;


      if (!cache.has(rowIndex, columnIndex)) {
        var _getCellMeasurements2 = this._getCellMeasurements(),
            height = _getCellMeasurements2.height,
            width = _getCellMeasurements2.width;

        cache.set(rowIndex, columnIndex, width, height);

        // If size has changed, let Grid know to re-render.
        if (parent && typeof parent.invalidateCellSizeAfterRender === 'function') {
          parent.invalidateCellSizeAfterRender({
            columnIndex: columnIndex,
            rowIndex: rowIndex
          });
        }
      }
    }
  }]);

  return CellMeasurer;
}(_react2.default.PureComponent);

// Used for DEV mode warning check


CellMeasurer.__internalCellMeasurerFlag = false;
CellMeasurer.propTypes = {
  cache: typeof _CellMeasurerCache2.default === 'function' ? require('prop-types').instanceOf(_CellMeasurerCache2.default).isRequired : require('prop-types').any.isRequired,
  children: require('prop-types').oneOfType([require('prop-types').func, typeof (_react2.default.Element == null ? {} : _react2.default.Element) === 'function' ? require('prop-types').instanceOf(_react2.default.Element == null ? {} : _react2.default.Element) : require('prop-types').any]).isRequired,
  columnIndex: require('prop-types').number,
  index: require('prop-types').number,
  parent: require('prop-types').shape({
    invalidateCellSizeAfterRender: require('prop-types').func,
    recomputeGridSize: require('prop-types').func
  }).isRequired,
  rowIndex: require('prop-types').number
};
exports.default = CellMeasurer;
if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true;
}