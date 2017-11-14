'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_SCROLLING_TIMEOUT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _onScroll = require('./utils/onScroll');

var _dimensions = require('./utils/dimensions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
var IS_SCROLLING_TIMEOUT = exports.IS_SCROLLING_TIMEOUT = 150;

var WindowScroller = function (_PureComponent) {
  _inherits(WindowScroller, _PureComponent);

  function WindowScroller(props) {
    _classCallCheck(this, WindowScroller);

    // Handle server-side rendering case
    var _this = _possibleConstructorReturn(this, (WindowScroller.__proto__ || Object.getPrototypeOf(WindowScroller)).call(this, props));

    var _ref = typeof window !== 'undefined' ? (0, _dimensions.getDimensions)(props.scrollElement || window) : { width: 0, height: 0 },
        width = _ref.width,
        height = _ref.height;

    _this.state = {
      height: height,
      width: width,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    };

    _this._onResize = _this._onResize.bind(_this);
    _this._onChildScroll = _this._onChildScroll.bind(_this);
    _this.__handleWindowScrollEvent = _this.__handleWindowScrollEvent.bind(_this);
    _this.__resetIsScrolling = _this.__resetIsScrolling.bind(_this);
    return _this;
  }

  // Can’t use defaultProps for scrollElement without breaking server-side rendering


  _createClass(WindowScroller, [{
    key: 'updatePosition',
    value: function updatePosition(scrollElement) {
      var onResize = this.props.onResize;
      var _state = this.state,
          height = _state.height,
          width = _state.width;


      scrollElement = scrollElement || this.props.scrollElement || window;
      var offset = (0, _dimensions.getPositionOffset)(_reactDom2.default.findDOMNode(this), scrollElement);
      this._positionFromTop = offset.top;
      this._positionFromLeft = offset.left;

      var dimensions = (0, _dimensions.getDimensions)(scrollElement);
      if (height !== dimensions.height || width !== dimensions.width) {
        this.setState({
          height: dimensions.height,
          width: dimensions.width
        });
        onResize({
          height: dimensions.height,
          width: dimensions.width
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var scrollElement = this.props.scrollElement || window;

      this.updatePosition(scrollElement);

      (0, _onScroll.registerScrollListener)(this, scrollElement);

      window.addEventListener('resize', this._onResize, false);

      this._isMounted = true;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var scrollElement = this.props.scrollElement || window;
      var nextScrollElement = nextProps.scrollElement || window;

      if (scrollElement !== nextScrollElement) {
        this.updatePosition(nextScrollElement);

        (0, _onScroll.unregisterScrollListener)(this, scrollElement);
        (0, _onScroll.registerScrollListener)(this, nextScrollElement);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _onScroll.unregisterScrollListener)(this, this.props.scrollElement || window);
      window.removeEventListener('resize', this._onResize, false);

      this._isMounted = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;
      var _state2 = this.state,
          isScrolling = _state2.isScrolling,
          scrollTop = _state2.scrollTop,
          scrollLeft = _state2.scrollLeft,
          height = _state2.height,
          width = _state2.width;


      return children({
        onChildScroll: this._onChildScroll,
        height: height,
        isScrolling: isScrolling,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        width: width
      });
    }
  }, {
    key: '_onChildScroll',
    value: function _onChildScroll(_ref2) {
      var scrollTop = _ref2.scrollTop;

      if (this.state.scrollTop === scrollTop) {
        return;
      }

      var scrollElement = this.scrollElement;

      if (typeof scrollElement.scrollTo === 'function') {
        scrollElement.scrollTo(0, scrollTop + this._positionFromTop);
      } else {
        scrollElement.scrollTop = scrollTop + this._positionFromTop;
      }
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      this.updatePosition();
    }

    // Referenced by utils/onScroll

  }, {
    key: '__handleWindowScrollEvent',
    value: function __handleWindowScrollEvent() {
      if (!this._isMounted) {
        return;
      }

      var onScroll = this.props.onScroll;


      var scrollElement = this.props.scrollElement || window;
      var scrollOffset = (0, _dimensions.getScrollOffset)(scrollElement);
      var scrollLeft = Math.max(0, scrollOffset.left - this._positionFromLeft);
      var scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop);

      this.setState({
        isScrolling: true,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });

      onScroll({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
    }

    // Referenced by utils/onScroll

  }, {
    key: '__resetIsScrolling',
    value: function __resetIsScrolling() {
      this.setState({
        isScrolling: false
      });
    }
  }, {
    key: 'scrollElement',
    get: function get() {
      return this.props.scrollElement || window;
    }
  }]);

  return WindowScroller;
}(_react.PureComponent);

WindowScroller.defaultProps = {
  onResize: function onResize() {},
  onScroll: function onScroll() {},
  scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT
};
exports.default = WindowScroller;
WindowScroller.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * Function responsible for rendering children.
   * This function should implement the following signature:
   * ({ height, isScrolling, scrollLeft, scrollTop, width }) => PropTypes.element
   */
  children: _propTypes2.default.func.isRequired,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: _propTypes2.default.func.isRequired,

  /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) */
  onScroll: _propTypes2.default.func.isRequired,

  /** Element to attach scroll event listeners. Defaults to window. */
  scrollElement: _propTypes2.default.any,

  /**
   * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
   */
  scrollingResetTimeInterval: _propTypes2.default.number.isRequired
} : {};