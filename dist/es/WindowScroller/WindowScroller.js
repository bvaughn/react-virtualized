import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll';
import { getDimensions, getPositionOffset, getScrollOffset } from './utils/dimensions';
import createDetectElementResize from '../vendor/detectElementResize';
/*:: type Props = {
  /**
   * Function responsible for rendering children.
   * This function should implement the following signature:
   * ({ height, isScrolling, scrollLeft, scrollTop, width }) => PropTypes.element
   *-/
  children: ({
    onChildScroll: ({scrollTop: number}) => void,
    registerChild: (?Element) => void,
    height: number,
    isScrolling: boolean,
    scrollLeft: number,
    scrollTop: number,
    width: number,
  }) => React.Node,

  /** Callback to be invoked on-resize: ({ height, width }) *-/
  onResize: ({height: number, width: number}) => void,

  /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) *-/
  onScroll: ({scrollLeft: number, scrollTop: number}) => void,

  /** Element to attach scroll event listeners. Defaults to window. *-/
  scrollElement: ?(typeof window | Element),
  /**
   * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
   *-/
  scrollingResetTimeInterval: number,

  /** Height used for server-side rendering *-/
  serverHeight: number,

  /** Width used for server-side rendering *-/
  serverWidth: number,

  /** Force scrollTop updates when .updatePosition is called, fixing forced header height change updates *-/
  updateScrollTopOnUpdatePosition?: boolean,
};*/

/*:: type State = {
  height: number,
  width: number,
  isScrolling: boolean,
  scrollLeft: number,
  scrollTop: number,
};*/

/*:: type ResizeHandler = (element: Element, onResize: () => void) => void;*/

/*:: type DetectElementResize = {
  addResizeListener: ResizeHandler,
  removeResizeListener: ResizeHandler,
};*/

/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export var IS_SCROLLING_TIMEOUT = 150;

var getWindow = function getWindow() {
  return typeof window !== 'undefined' ? window : undefined;
};

var WindowScroller =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(WindowScroller, _React$PureComponent);

  function WindowScroller() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, WindowScroller);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WindowScroller)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_window", getWindow());

    _defineProperty(_assertThisInitialized(_this), "_isMounted", false);

    _defineProperty(_assertThisInitialized(_this), "_positionFromTop", 0);

    _defineProperty(_assertThisInitialized(_this), "_positionFromLeft", 0);

    _defineProperty(_assertThisInitialized(_this), "_detectElementResize", void 0);

    _defineProperty(_assertThisInitialized(_this), "_child", void 0);

    _defineProperty(_assertThisInitialized(_this), "state", _objectSpread({}, getDimensions(_this.props.scrollElement, _this.props), {
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    }));

    _defineProperty(_assertThisInitialized(_this), "_registerChild", function (element) {
      if (element && !(element instanceof Element)) {
        console.warn('WindowScroller registerChild expects to be passed Element or null');
      }

      _this._child = element;

      _this.updatePosition();
    });

    _defineProperty(_assertThisInitialized(_this), "_onChildScroll", function (_ref) {
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
    });

    _defineProperty(_assertThisInitialized(_this), "_registerResizeListener", function (element) {
      if (element === window) {
        window.addEventListener('resize', _this._onResize, false);
      } else {
        _this._detectElementResize.addResizeListener(element, _this._onResize);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_unregisterResizeListener", function (element) {
      if (element === window) {
        window.removeEventListener('resize', _this._onResize, false);
      } else if (element) {
        _this._detectElementResize.removeResizeListener(element, _this._onResize);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onResize", function () {
      _this.updatePosition();
    });

    _defineProperty(_assertThisInitialized(_this), "__handleWindowScrollEvent", function () {
      if (!_this._isMounted) {
        return;
      }

      var onScroll = _this.props.onScroll;
      var scrollElement = _this.props.scrollElement;

      if (scrollElement) {
        var scrollOffset = getScrollOffset(scrollElement);
        var scrollLeft = Math.max(0, scrollOffset.left - _this._positionFromLeft);
        var scrollTop = Math.max(0, scrollOffset.top - _this._positionFromTop);

        _this.setState({
          isScrolling: true,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop
        });

        onScroll({
          scrollLeft: scrollLeft,
          scrollTop: scrollTop
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "__resetIsScrolling", function () {
      _this.setState({
        isScrolling: false
      });
    });

    return _this;
  }

  _createClass(WindowScroller, [{
    key: "updatePosition",
    value: function updatePosition() {
      var scrollElement
      /*: ?Element*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.scrollElement;
      var onResize = this.props.onResize;
      var _this$state = this.state,
          height = _this$state.height,
          width = _this$state.width;
      var thisNode = this._child || ReactDOM.findDOMNode(this);

      if (thisNode instanceof Element && scrollElement) {
        var offset = getPositionOffset(thisNode, scrollElement);
        this._positionFromTop = offset.top;
        this._positionFromLeft = offset.left;
      }

      var dimensions = getDimensions(scrollElement, this.props);

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

      if (this.props.updateScrollTopOnUpdatePosition === true) {
        this.__handleWindowScrollEvent();

        this.__resetIsScrolling();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var scrollElement = this.props.scrollElement;
      this._detectElementResize = createDetectElementResize();
      this.updatePosition(scrollElement);

      if (scrollElement) {
        registerScrollListener(this, scrollElement);

        this._registerResizeListener(scrollElement);
      }

      this._isMounted = true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps
    /*: Props*/
    , prevState
    /*: State*/
    ) {
      var scrollElement = this.props.scrollElement;
      var prevScrollElement = prevProps.scrollElement;

      if (prevScrollElement !== scrollElement && prevScrollElement != null && scrollElement != null) {
        this.updatePosition(scrollElement);
        unregisterScrollListener(this, prevScrollElement);
        registerScrollListener(this, scrollElement);

        this._unregisterResizeListener(prevScrollElement);

        this._registerResizeListener(scrollElement);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var scrollElement = this.props.scrollElement;

      if (scrollElement) {
        unregisterScrollListener(this, scrollElement);

        this._unregisterResizeListener(scrollElement);
      }

      this._isMounted = false;
    }
  }, {
    key: "render",
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
        width: width
      });
    }
  }]);

  return WindowScroller;
}(React.PureComponent);

_defineProperty(WindowScroller, "defaultProps", {
  onResize: function onResize() {},
  onScroll: function onScroll() {},
  scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT,
  scrollElement: getWindow(),
  serverHeight: 0,
  serverWidth: 0
});

export { WindowScroller as default };