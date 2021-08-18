'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.IS_SCROLLING_TIMEOUT = void 0;

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

var ReactDOM = _interopRequireWildcard(require('react-dom'));

var _onScroll = require('./utils/onScroll');

var _dimensions = require('./utils/dimensions');

var _detectElementResize = _interopRequireDefault(
  require('../vendor/detectElementResize'),
);

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
      ownKeys(source, true).forEach(function(key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
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

/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
var IS_SCROLLING_TIMEOUT = 150;
exports.IS_SCROLLING_TIMEOUT = IS_SCROLLING_TIMEOUT;

var getWindow = function getWindow() {
  return typeof window !== 'undefined' ? window : undefined;
};

var WindowScroller =
  /*#__PURE__*/
  (function(_React$PureComponent) {
    (0, _inherits2['default'])(WindowScroller, _React$PureComponent);

    function WindowScroller() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2['default'])(this, WindowScroller);

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
          WindowScroller,
        )).call.apply(_getPrototypeOf2, [this].concat(args)),
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_window',
        getWindow(),
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_isMounted',
        false,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_positionFromTop',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_positionFromLeft',
        0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_detectElementResize',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_child',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        'state',
        _objectSpread(
          {},
          (0, _dimensions.getDimensions)(
            _this.props.scrollElement,
            _this.props,
          ),
          {
            isScrolling: false,
            scrollLeft: 0,
            scrollTop: 0,
          },
        ),
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_registerChild',
        function(element) {
          if (element && !(element instanceof Element)) {
            console.warn(
              'WindowScroller registerChild expects to be passed Element or null',
            );
          }

          _this._child = element;

          _this.updatePosition();
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onChildScroll',
        function(_ref) {
          var scrollTop = _ref.scrollTop;

          if (_this.state.scrollTop === scrollTop) {
            return;
          }

          var scrollElement = _this.props.scrollElement;

          if (scrollElement) {
            if (typeof scrollElement.scrollTo === 'function') {
              scrollElement.scrollTo(0, scrollTop + _this._positionFromTop);
            } else {
              scrollElement.scrollTop = scrollTop + _this._positionFromTop;
            }
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_registerResizeListener',
        function(element) {
          if (element === window) {
            window.addEventListener('resize', _this._onResize, false);
          } else {
            _this._detectElementResize.addResizeListener(
              element,
              _this._onResize,
            );
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_unregisterResizeListener',
        function(element) {
          if (element === window) {
            window.removeEventListener('resize', _this._onResize, false);
          } else if (element) {
            _this._detectElementResize.removeResizeListener(
              element,
              _this._onResize,
            );
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onResize',
        function() {
          _this.updatePosition();
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '__handleWindowScrollEvent',
        function() {
          if (!_this._isMounted) {
            return;
          }

          var onScroll = _this.props.onScroll;
          var scrollElement = _this.props.scrollElement;

          if (scrollElement) {
            var scrollOffset = (0, _dimensions.getScrollOffset)(scrollElement);
            var scrollLeft = Math.max(
              0,
              scrollOffset.left - _this._positionFromLeft,
            );
            var scrollTop = Math.max(
              0,
              scrollOffset.top - _this._positionFromTop,
            );

            _this.setState({
              isScrolling: true,
              scrollLeft: scrollLeft,
              scrollTop: scrollTop,
            });

            onScroll({
              scrollLeft: scrollLeft,
              scrollTop: scrollTop,
            });
          }
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '__resetIsScrolling',
        function() {
          _this.setState({
            isScrolling: false,
          });
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(WindowScroller, [
      {
        key: 'updatePosition',
        value: function updatePosition() {
          var scrollElement =
            /*: ?Element*/
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : this.props.scrollElement;
          var onResize = this.props.onResize;
          var _this$state = this.state,
            height = _this$state.height,
            width = _this$state.width;
          var thisNode = this._child || ReactDOM.findDOMNode(this);

          if (thisNode instanceof Element && scrollElement) {
            var offset = (0, _dimensions.getPositionOffset)(
              thisNode,
              scrollElement,
            );
            this._positionFromTop = offset.top;
            this._positionFromLeft = offset.left;
          }

          var dimensions = (0, _dimensions.getDimensions)(
            scrollElement,
            this.props,
          );

          if (height !== dimensions.height || width !== dimensions.width) {
            this.setState({
              height: dimensions.height,
              width: dimensions.width,
            });
            onResize({
              height: dimensions.height,
              width: dimensions.width,
            });
          }

          if (this.props.updateScrollTopOnUpdatePosition === true) {
            this.__handleWindowScrollEvent();

            this.__resetIsScrolling();
          }
        },
      },
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var scrollElement = this.props.scrollElement;
          this._detectElementResize = (0, _detectElementResize['default'])();
          this.updatePosition(scrollElement);

          if (scrollElement) {
            (0, _onScroll.registerScrollListener)(this, scrollElement);

            this._registerResizeListener(scrollElement);
          }

          this._isMounted = true;
        },
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(
          prevProps,
          /*: Props*/
          prevState,
          /*: State*/
        ) {
          var scrollElement = this.props.scrollElement;
          var prevScrollElement = prevProps.scrollElement;

          if (
            prevScrollElement !== scrollElement &&
            prevScrollElement != null &&
            scrollElement != null
          ) {
            this.updatePosition(scrollElement);
            (0, _onScroll.unregisterScrollListener)(this, prevScrollElement);
            (0, _onScroll.registerScrollListener)(this, scrollElement);

            this._unregisterResizeListener(prevScrollElement);

            this._registerResizeListener(scrollElement);
          }
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var scrollElement = this.props.scrollElement;

          if (scrollElement) {
            (0, _onScroll.unregisterScrollListener)(this, scrollElement);

            this._unregisterResizeListener(scrollElement);
          }

          this._isMounted = false;
        },
      },
      {
        key: 'render',
        value: function render() {
          var children = this.props.children;
          var _this$state2 = this.state,
            isScrolling = _this$state2.isScrolling,
            scrollTop = _this$state2.scrollTop,
            scrollLeft = _this$state2.scrollLeft,
            height = _this$state2.height,
            width = _this$state2.width;
          return children({
            onChildScroll: this._onChildScroll,
            registerChild: this._registerChild,
            height: height,
            isScrolling: isScrolling,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            width: width,
          });
        },
      },
    ]);
    return WindowScroller;
  })(React.PureComponent);

exports['default'] = WindowScroller;
(0, _defineProperty2['default'])(WindowScroller, 'defaultProps', {
  onResize: function onResize() {},
  onScroll: function onScroll() {},
  scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT,
  scrollElement: getWindow(),
  serverHeight: 0,
  serverWidth: 0,
});
