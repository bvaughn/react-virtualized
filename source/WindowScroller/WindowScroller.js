/** @flow */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import {
  registerScrollListener,
  unregisterScrollListener
} from "./utils/onScroll";
import {
  getDimensions,
  getPositionOffset,
  getScrollOffset
} from "./utils/dimensions";

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150;

export default class WindowScroller extends PureComponent {
  static propTypes = {
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
  };

  static defaultProps = {
    onResize: () => {},
    onScroll: () => {},
    scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT
  };

  constructor(props) {
    super(props);

    // Handle server-side rendering case
    const { width, height } =
      typeof window !== "undefined"
        ? getDimensions(props.scrollElement || window)
        : { width: 0, height: 0 };

    this.state = {
      height,
      width,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    };

    this._onResize = this._onResize.bind(this);
    this._onChildScroll = this._onChildScroll.bind(this);
    this.__handleWindowScrollEvent = this.__handleWindowScrollEvent.bind(this);
    this.__resetIsScrolling = this.__resetIsScrolling.bind(this);
  }

  // Can’t use defaultProps for scrollElement without breaking server-side rendering
  get scrollElement() {
    return this.props.scrollElement || window;
  }

  updatePosition(scrollElement) {
    const { onResize } = this.props;
    const { height, width } = this.state;

    scrollElement = scrollElement || this.props.scrollElement || window;
    const offset = getPositionOffset(ReactDOM.findDOMNode(this), scrollElement);
    this._positionFromTop = offset.top;
    this._positionFromLeft = offset.left;

    const dimensions = getDimensions(scrollElement);
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

  componentDidMount() {
    const scrollElement = this.props.scrollElement || window;

    this.updatePosition(scrollElement);

    registerScrollListener(this, scrollElement);

    window.addEventListener("resize", this._onResize, false);

    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    const scrollElement = this.props.scrollElement || window;
    const nextScrollElement = nextProps.scrollElement || window;

    if (scrollElement !== nextScrollElement) {
      this.updatePosition(nextScrollElement);

      unregisterScrollListener(this, scrollElement);
      registerScrollListener(this, nextScrollElement);
    }
  }

  componentWillUnmount() {
    unregisterScrollListener(this, this.props.scrollElement || window);
    window.removeEventListener("resize", this._onResize, false);

    this._isMounted = false;
  }

  render() {
    const { children } = this.props;
    const { isScrolling, scrollTop, scrollLeft, height, width } = this.state;

    return children({
      onChildScroll: this._onChildScroll,
      height,
      isScrolling,
      scrollLeft,
      scrollTop,
      width
    });
  }

  _onChildScroll({ scrollTop }) {
    if (this.state.scrollTop === scrollTop) return;

    const scrollElement = this.scrollElement;

    if (typeof scrollElement.scrollTo === "function") {
      scrollElement.scrollTo(0, scrollTop + this._positionFromTop);
    } else {
      scrollElement.scrollTop = scrollTop + this._positionFromTop;
    }
  }

  _onResize() {
    this.updatePosition();
  }

  // Referenced by utils/onScroll
  __handleWindowScrollEvent() {
    if (!this._isMounted) return;

    const { onScroll } = this.props;

    const scrollElement = this.props.scrollElement || window;
    const scrollOffset = getScrollOffset(scrollElement);
    const scrollLeft = Math.max(0, scrollOffset.left - this._positionFromLeft);
    const scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop);

    this.setState({
      isScrolling: true,
      scrollLeft,
      scrollTop
    });

    onScroll({
      scrollLeft,
      scrollTop
    });
  }

  // Referenced by utils/onScroll
  __resetIsScrolling() {
    this.setState({
      isScrolling: false
    });
  }
}
