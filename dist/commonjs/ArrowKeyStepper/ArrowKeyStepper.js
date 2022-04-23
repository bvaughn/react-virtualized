'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

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

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var React = _interopRequireWildcard(require('react'));

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _Grid = require('../Grid');

var _types = require('./types');

var _propTypes = _interopRequireDefault(require('prop-types'));

var _class, _temp;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function() {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

var ArrowKeyStepper =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    (0, _inherits2['default'])(ArrowKeyStepper, _React$PureComponent);

    var _super = _createSuper(ArrowKeyStepper);

    function ArrowKeyStepper() {
      var _this;

      (0, _classCallCheck2['default'])(this, ArrowKeyStepper);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        'state',
        {
          scrollToColumn: 0,
          scrollToRow: 0,
          instanceProps: {
            prevScrollToColumn: 0,
            prevScrollToRow: 0,
          },
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_columnStartIndex',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_columnStopIndex',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_rowStartIndex',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_rowStopIndex',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onKeyDown',
        function(event) {
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
            scrollToRow = _this$_getScrollState2.scrollToRow; // The above cases all prevent default event event behavior.
          // This is to keep the grid from scrolling after the snap-to update.

          switch (event.key) {
            case 'ArrowDown':
              scrollToRow =
                mode === 'cells'
                  ? Math.min(scrollToRow + 1, rowCount - 1)
                  : Math.min(_this._rowStopIndex + 1, rowCount - 1);
              break;

            case 'ArrowLeft':
              scrollToColumn =
                mode === 'cells'
                  ? Math.max(scrollToColumn - 1, 0)
                  : Math.max(_this._columnStartIndex - 1, 0);
              break;

            case 'ArrowRight':
              scrollToColumn =
                mode === 'cells'
                  ? Math.min(scrollToColumn + 1, columnCount - 1)
                  : Math.min(_this._columnStopIndex + 1, columnCount - 1);
              break;

            case 'ArrowUp':
              scrollToRow =
                mode === 'cells'
                  ? Math.max(scrollToRow - 1, 0)
                  : Math.max(_this._rowStartIndex - 1, 0);
              break;
          }

          if (
            scrollToColumn !== scrollToColumnPrevious ||
            scrollToRow !== scrollToRowPrevious
          ) {
            event.preventDefault();

            _this._updateScrollState({
              scrollToColumn: scrollToColumn,
              scrollToRow: scrollToRow,
            });
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onSectionRendered',
        function(_ref) {
          var columnStartIndex = _ref.columnStartIndex,
            columnStopIndex = _ref.columnStopIndex,
            rowStartIndex = _ref.rowStartIndex,
            rowStopIndex = _ref.rowStopIndex;
          _this._columnStartIndex = columnStartIndex;
          _this._columnStopIndex = columnStopIndex;
          _this._rowStartIndex = rowStartIndex;
          _this._rowStopIndex = rowStopIndex;
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(
      ArrowKeyStepper,
      [
        {
          key: 'setScrollIndexes',
          value: function setScrollIndexes(_ref2) {
            var scrollToColumn = _ref2.scrollToColumn,
              scrollToRow = _ref2.scrollToRow;
            this.setState({
              scrollToRow: scrollToRow,
              scrollToColumn: scrollToColumn,
            });
          },
        },
        {
          key: 'render',
          value: function render() {
            var _this$props2 = this.props,
              className = _this$props2.className,
              children = _this$props2.children;

            var _this$_getScrollState3 = this._getScrollState(),
              scrollToColumn = _this$_getScrollState3.scrollToColumn,
              scrollToRow = _this$_getScrollState3.scrollToRow;

            return /*#__PURE__*/ React.createElement(
              'div',
              {
                className: className,
                onKeyDown: this._onKeyDown,
              },
              children({
                onSectionRendered: this._onSectionRendered,
                scrollToColumn: scrollToColumn,
                scrollToRow: scrollToRow,
              }),
            );
          },
        },
        {
          key: '_getScrollState',
          value: function _getScrollState() {
            return this.props.isControlled ? this.props : this.state;
          },
        },
        {
          key: '_updateScrollState',
          value: function _updateScrollState(_ref3) {
            var scrollToColumn = _ref3.scrollToColumn,
              scrollToRow = _ref3.scrollToRow;
            var _this$props3 = this.props,
              isControlled = _this$props3.isControlled,
              onScrollToChange = _this$props3.onScrollToChange;

            if (typeof onScrollToChange === 'function') {
              onScrollToChange({
                scrollToColumn: scrollToColumn,
                scrollToRow: scrollToRow,
              });
            }

            if (!isControlled) {
              this.setState({
                scrollToColumn: scrollToColumn,
                scrollToRow: scrollToRow,
              });
            }
          },
        },
      ],
      [
        {
          key: 'getDerivedStateFromProps',
          value: function getDerivedStateFromProps(nextProps, prevState) {
            if (nextProps.isControlled) {
              return {};
            }

            if (
              nextProps.scrollToColumn !==
                prevState.instanceProps.prevScrollToColumn ||
              nextProps.scrollToRow !== prevState.instanceProps.prevScrollToRow
            ) {
              return _objectSpread(
                _objectSpread({}, prevState),
                {},
                {
                  scrollToColumn: nextProps.scrollToColumn,
                  scrollToRow: nextProps.scrollToRow,
                  instanceProps: {
                    prevScrollToColumn: nextProps.scrollToColumn,
                    prevScrollToRow: nextProps.scrollToRow,
                  },
                },
              );
            }

            return {};
          },
        },
      ],
    );
    return ArrowKeyStepper;
  })(React.PureComponent)),
  (0, _defineProperty2['default'])(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production'
      ? null
      : {
          children: _propTypes['default'].func.isRequired,
          className: _propTypes['default'].string,
          columnCount: _propTypes['default'].number.isRequired,
          disabled: _propTypes['default'].bool.isRequired,
          isControlled: _propTypes['default'].bool.isRequired,
          mode: _propTypes['default'].oneOf(['cells', 'edges']).isRequired,
          onScrollToChange: _propTypes['default'].func,
          rowCount: _propTypes['default'].number.isRequired,
          scrollToColumn: _propTypes['default'].number.isRequired,
          scrollToRow: _propTypes['default'].number.isRequired,
        },
  ),
  _temp);
(0, _defineProperty2['default'])(ArrowKeyStepper, 'defaultProps', {
  disabled: false,
  isControlled: false,
  mode: 'edges',
  scrollToColumn: 0,
  scrollToRow: 0,
});
(0, _reactLifecyclesCompat.polyfill)(ArrowKeyStepper);
var _default = ArrowKeyStepper;
exports['default'] = _default;
