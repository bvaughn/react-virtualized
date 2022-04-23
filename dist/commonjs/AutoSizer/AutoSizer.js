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

var _detectElementResize = _interopRequireDefault(
  require('../vendor/detectElementResize'),
);

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

var AutoSizer =
  ((_temp = _class = /*#__PURE__*/ (function(_React$Component) {
    (0, _inherits2['default'])(AutoSizer, _React$Component);

    var _super = _createSuper(AutoSizer);

    function AutoSizer() {
      var _this;

      (0, _classCallCheck2['default'])(this, AutoSizer);

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
          height: _this.props.defaultHeight || 0,
          width: _this.props.defaultWidth || 0,
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_parentNode',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_autoSizer',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_window',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_detectElementResize',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onResize',
        function() {
          var _this$props = _this.props,
            disableHeight = _this$props.disableHeight,
            disableWidth = _this$props.disableWidth,
            onResize = _this$props.onResize;

          if (_this._parentNode) {
            // Guard against AutoSizer component being removed from the DOM immediately after being added.
            // This can result in invalid style values which can result in NaN values if we don't handle them.
            // See issue #150 for more context.
            var height = _this._parentNode.offsetHeight || 0;
            var width = _this._parentNode.offsetWidth || 0;
            var win = _this._window || window;
            var style = win.getComputedStyle(_this._parentNode) || {};
            var paddingLeft = parseInt(style.paddingLeft, 10) || 0;
            var paddingRight = parseInt(style.paddingRight, 10) || 0;
            var paddingTop = parseInt(style.paddingTop, 10) || 0;
            var paddingBottom = parseInt(style.paddingBottom, 10) || 0;
            var newHeight = height - paddingTop - paddingBottom;
            var newWidth = width - paddingLeft - paddingRight;

            if (
              (!disableHeight && _this.state.height !== newHeight) ||
              (!disableWidth && _this.state.width !== newWidth)
            ) {
              _this.setState({
                height: height - paddingTop - paddingBottom,
                width: width - paddingLeft - paddingRight,
              });

              onResize({
                height: height,
                width: width,
              });
            }
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_setRef',
        function(autoSizer) {
          _this._autoSizer = autoSizer;
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(AutoSizer, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var nonce = this.props.nonce;

          if (
            this._autoSizer &&
            this._autoSizer.parentNode &&
            this._autoSizer.parentNode.ownerDocument &&
            this._autoSizer.parentNode.ownerDocument.defaultView &&
            this._autoSizer.parentNode instanceof
              this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
          ) {
            // Delay access of parentNode until mount.
            // This handles edge-cases where the component has already been unmounted before its ref has been set,
            // As well as libraries like react-lite which have a slightly different lifecycle.
            this._parentNode = this._autoSizer.parentNode;
            this._window = this._autoSizer.parentNode.ownerDocument.defaultView; // Defer requiring resize handler in order to support server-side rendering.
            // See issue #41

            this._detectElementResize = (0, _detectElementResize['default'])(
              nonce,
              this._window,
            );

            this._detectElementResize.addResizeListener(
              this._parentNode,
              this._onResize,
            );

            this._onResize();
          }
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this._detectElementResize && this._parentNode) {
            this._detectElementResize.removeResizeListener(
              this._parentNode,
              this._onResize,
            );
          }
        },
      },
      {
        key: 'render',
        value: function render() {
          var _this$props2 = this.props,
            children = _this$props2.children,
            className = _this$props2.className,
            disableHeight = _this$props2.disableHeight,
            disableWidth = _this$props2.disableWidth,
            style = _this$props2.style;
          var _this$state = this.state,
            height = _this$state.height,
            width = _this$state.width; // Outer div should not force width/height since that may prevent containers from shrinking.
          // Inner component should overflow and use calculated width/height.
          // See issue #68 for more information.

          var outerStyle = {
            overflow: 'visible',
          };
          var childParams = {};

          if (!disableHeight) {
            outerStyle.height = 0;
            childParams.height = height;
          }

          if (!disableWidth) {
            outerStyle.width = 0;
            childParams.width = width;
          }
          /**
       * TODO: Avoid rendering children before the initial measurements have been collected.
       * At best this would just be wasting cycles.
       * Add this check into version 10 though as it could break too many ref callbacks in version 9.
       * Note that if default width/height props were provided this would still work with SSR.
      if (
        height !== 0 &&
        width !== 0
      ) {
        child = children({ height, width })
      }
      */

          return /*#__PURE__*/ React.createElement(
            'div',
            {
              className: className,
              ref: this._setRef,
              style: _objectSpread(_objectSpread({}, outerStyle), style),
            },
            children(childParams),
          );
        },
      },
    ]);
    return AutoSizer;
  })(React.Component)),
  (0, _defineProperty2['default'])(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production'
      ? null
      : {
          /** Function responsible for rendering children.*/
          children: _propTypes['default'].func.isRequired,

          /** Optional custom CSS class name to attach to root AutoSizer element.  */
          className: _propTypes['default'].string,

          /** Default height to use for initial render; useful for SSR */
          defaultHeight: _propTypes['default'].number,

          /** Default width to use for initial render; useful for SSR */
          defaultWidth: _propTypes['default'].number,

          /** Disable dynamic :height property */
          disableHeight: _propTypes['default'].bool.isRequired,

          /** Disable dynamic :width property */
          disableWidth: _propTypes['default'].bool.isRequired,

          /** Nonce of the inlined stylesheet for Content Security Policy */
          nonce: _propTypes['default'].string,

          /** Callback to be invoked on-resize */
          onResize: _propTypes['default'].func.isRequired,

          /** Optional inline style */
          style: _propTypes['default'].object,
        },
  ),
  _temp);
exports['default'] = AutoSizer;
(0, _defineProperty2['default'])(AutoSizer, 'defaultProps', {
  onResize: function onResize() {},
  disableHeight: false,
  disableWidth: false,
  style: {},
});
