'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var _Grid = require('../Grid');

var _Grid2 = _interopRequireDefault(_Grid);

/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */

var ColumnSizer = (function (_Component) {
  _inherits(ColumnSizer, _Component);

  _createClass(ColumnSizer, null, [{
    key: 'propTypes',
    value: {
      /**
       * Function respondible for rendering a virtualized Grid.
       * This function should implement the following signature:
       * ({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element
       *
       * The specified :getColumnWidth function should be passed to the Grid's :columnWidth property.
       * The :registerChild should be passed to the Grid's :ref property.
       * The :adjustedWidth property is optional; it reflects the lesser of the overall width or the width of all columns.
       */
      children: _react.PropTypes.func.isRequired,

      /** Optional maximum allowed column width */
      columnMaxWidth: _react.PropTypes.number,

      /** Optional minimum allowed column width */
      columnMinWidth: _react.PropTypes.number,

      /** Number of columns in Grid or FlexTable child */
      columnsCount: _react.PropTypes.number.isRequired,

      /** Width of Grid or FlexTable child */
      width: _react.PropTypes.number.isRequired
    },
    enumerable: true
  }]);

  function ColumnSizer(props, context) {
    _classCallCheck(this, ColumnSizer);

    _get(Object.getPrototypeOf(ColumnSizer.prototype), 'constructor', this).call(this, props, context);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
    this._registerChild = this._registerChild.bind(this);
  }

  _createClass(ColumnSizer, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _props = this.props;
      var columnMaxWidth = _props.columnMaxWidth;
      var columnMinWidth = _props.columnMinWidth;
      var columnsCount = _props.columnsCount;
      var width = _props.width;

      if (columnMaxWidth !== prevProps.columnMaxWidth || columnMinWidth !== prevProps.columnMinWidth || columnsCount !== prevProps.columnsCount || width !== prevProps.width) {
        if (this._registeredChild) {
          this._registeredChild.recomputeGridSize();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var children = _props2.children;
      var columnMaxWidth = _props2.columnMaxWidth;
      var columnMinWidth = _props2.columnMinWidth;
      var columnsCount = _props2.columnsCount;
      var width = _props2.width;

      var safeColumnMinWidth = columnMinWidth || 1;

      var safeColumnMaxWidth = columnMaxWidth ? Math.min(columnMaxWidth, width) : width;

      var columnWidth = width / columnsCount;
      columnWidth = Math.max(safeColumnMinWidth, columnWidth);
      columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
      columnWidth = Math.floor(columnWidth);

      var adjustedWidth = Math.min(width, columnWidth * columnsCount);

      return children({
        adjustedWidth: adjustedWidth,
        getColumnWidth: function getColumnWidth() {
          return columnWidth;
        },
        registerChild: this._registerChild
      });
    }
  }, {
    key: '_registerChild',
    value: function _registerChild(child) {
      if (child !== null && !(child instanceof _Grid2['default'])) {
        throw Error('Unexpected child type registered; only Grid children are supported.');
      }

      this._registeredChild = child;

      if (this._registeredChild) {
        this._registeredChild.recomputeGridSize();
      }
    }
  }]);

  return ColumnSizer;
})(_react.Component);

exports['default'] = ColumnSizer;
module.exports = exports['default'];