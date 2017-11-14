import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll';
import { getDimensions, getPositionOffset, getScrollOffset } from './utils/dimensions';

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export var IS_SCROLLING_TIMEOUT = 150;

var WindowScroller = function (_PureComponent) {
  _inherits(WindowScroller, _PureComponent);

  function WindowScroller(props) {
    _classCallCheck(this, WindowScroller);

    // Handle server-side rendering case
    var _this = _possibleConstructorReturn(this, (WindowScroller.__proto__ || _Object$getPrototypeOf(WindowScroller)).call(this, props));

    var _ref = typeof window !== 'undefined' ? getDimensions(props.scrollElement || window) : { width: 0, height: 0 },
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
      var offset = getPositionOffset(ReactDOM.findDOMNode(this), scrollElement);
      this._positionFromTop = offset.top;
      this._positionFromLeft = offset.left;

      var dimensions = getDimensions(scrollElement);
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

      registerScrollListener(this, scrollElement);

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

        unregisterScrollListener(this, scrollElement);
        registerScrollListener(this, nextScrollElement);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      unregisterScrollListener(this, this.props.scrollElement || window);
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
      var scrollOffset = getScrollOffset(scrollElement);
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
}(PureComponent);

WindowScroller.defaultProps = {
  onResize: function onResize() {},
  onScroll: function onScroll() {},
  scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT
};
export default WindowScroller;
WindowScroller.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * Function responsible for rendering children.
   * This function should implement the following signature:
   * ({ height, isScrolling, scrollLeft, scrollTop, width }) => PropTypes.element
   */
  children: PropTypes.func.isRequired,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: PropTypes.func.isRequired,

  /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) */
  onScroll: PropTypes.func.isRequired,

  /** Element to attach scroll event listeners. Defaults to window. */
  scrollElement: PropTypes.any,

  /**
   * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
   */
  scrollingResetTimeInterval: PropTypes.number.isRequired
} : {};