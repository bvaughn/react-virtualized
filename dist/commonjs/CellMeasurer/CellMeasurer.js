'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf3 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var React = _interopRequireWildcard(require('react'));

var _reactDom = require('react-dom');

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
var CellMeasurer =
  /*#__PURE__*/
  (function(_React$PureComponent) {
    (0, _inherits2['default'])(CellMeasurer, _React$PureComponent);

    function CellMeasurer() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2['default'])(this, CellMeasurer);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2['default'])(
        this,
        (_getPrototypeOf2 = (0, _getPrototypeOf3['default'])(
          CellMeasurer,
        )).call.apply(_getPrototypeOf2, [this].concat(args)),
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_child',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_measure',
        function() {
          var _this$props = _this.props,
            cache = _this$props.cache,
            _this$props$columnInd = _this$props.columnIndex,
            columnIndex =
              _this$props$columnInd === void 0 ? 0 : _this$props$columnInd,
            parent = _this$props.parent,
            _this$props$rowIndex = _this$props.rowIndex,
            rowIndex =
              _this$props$rowIndex === void 0
                ? _this.props.index || 0
                : _this$props$rowIndex;

          var _this$_getCellMeasure = _this._getCellMeasurements(),
            height = _this$_getCellMeasure.height,
            width = _this$_getCellMeasure.width;

          if (
            height !== cache.getHeight(rowIndex, columnIndex) ||
            width !== cache.getWidth(rowIndex, columnIndex)
          ) {
            cache.set(rowIndex, columnIndex, width, height);

            if (parent && typeof parent.recomputeGridSize === 'function') {
              parent.recomputeGridSize({
                columnIndex: columnIndex,
                rowIndex: rowIndex,
              });
            }
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_registerChild',
        function(element) {
          if (element && !(element instanceof Element)) {
            console.warn(
              'CellMeasurer registerChild expects to be passed Element or null',
            );
          }

          _this._child = element;

          if (element) {
            _this._maybeMeasureCell();
          }
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(CellMeasurer, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this._maybeMeasureCell();
        },
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          this._maybeMeasureCell();
        },
      },
      {
        key: 'render',
        value: function render() {
          var children = this.props.children;
          return typeof children === 'function'
            ? children({
                measure: this._measure,
                registerChild: this._registerChild,
              })
            : children;
        },
      },
      {
        key: '_getCellMeasurements',
        value: function _getCellMeasurements() {
          var cache = this.props.cache;
          var node = this._child || (0, _reactDom.findDOMNode)(this); // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

          if (
            node &&
            node.ownerDocument &&
            node.ownerDocument.defaultView &&
            node instanceof node.ownerDocument.defaultView.HTMLElement
          ) {
            var styleWidth = node.style.width;
            var styleHeight = node.style.height; // If we are re-measuring a cell that has already been measured,
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
            var width = Math.ceil(node.offsetWidth); // Reset after measuring to avoid breaking styles; see #660

            if (styleWidth) {
              node.style.width = styleWidth;
            }

            if (styleHeight) {
              node.style.height = styleHeight;
            }

            return {
              height: height,
              width: width,
            };
          } else {
            return {
              height: 0,
              width: 0,
            };
          }
        },
      },
      {
        key: '_maybeMeasureCell',
        value: function _maybeMeasureCell() {
          var _this$props2 = this.props,
            cache = _this$props2.cache,
            _this$props2$columnIn = _this$props2.columnIndex,
            columnIndex =
              _this$props2$columnIn === void 0 ? 0 : _this$props2$columnIn,
            parent = _this$props2.parent,
            _this$props2$rowIndex = _this$props2.rowIndex,
            rowIndex =
              _this$props2$rowIndex === void 0
                ? this.props.index || 0
                : _this$props2$rowIndex;

          if (!cache.has(rowIndex, columnIndex)) {
            var _this$_getCellMeasure2 = this._getCellMeasurements(),
              height = _this$_getCellMeasure2.height,
              width = _this$_getCellMeasure2.width;

            cache.set(rowIndex, columnIndex, width, height); // If size has changed, let Grid know to re-render.

            if (
              parent &&
              typeof parent.invalidateCellSizeAfterRender === 'function'
            ) {
              parent.invalidateCellSizeAfterRender({
                columnIndex: columnIndex,
                rowIndex: rowIndex,
              });
            }
          }
        },
      },
    ]);
    return CellMeasurer;
  })(React.PureComponent); // Used for DEV mode warning check

exports['default'] = CellMeasurer;
(0, _defineProperty2['default'])(
  CellMeasurer,
  '__internalCellMeasurerFlag',
  false,
);

if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true;
}
