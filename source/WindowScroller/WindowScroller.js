// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  registerScrollListener,
  unregisterScrollListener,
} from './utils/onScroll';
import {
  getDimensions,
  getPositionOffset,
  getScrollOffset,
} from './utils/dimensions';

type Props = {
  /**
   * Function responsible for rendering children.
   * This function should implement the following signature:
   * ({ height, isScrolling, scrollLeft, scrollTop, width }) => PropTypes.element
   */
  children: (params: {
    onChildScroll: (params: {scrollTop: number}) => void,
    height: number,
    isScrolling: boolean,
    scrollLeft: number,
    scrollTop: number,
    width: number,
  }) => React.Node,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: (params: {height: number, width: number}) => void,

  /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) */
  onScroll: (params: {scrollLeft: number, scrollTop: number}) => void,

  /** Element to attach scroll event listeners. Defaults to window. */
  scrollElement: ?Element,

  /**
   * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
   */
  scrollingResetTimeInterval: number,

  /** Height used for server-side rendering */
  serverHeight: number,

  /** Width used for server-side rendering */
  serverWidth: number,
};

type State = {
  height: number,
  width: number,
  isScrolling: boolean,
  scrollLeft: number,
  scrollTop: number,
};

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150;

export default class WindowScroller extends React.PureComponent<Props, State> {
  static defaultProps = {
    onResize: () => {},
    onScroll: () => {},
    scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT,
    serverHeight: 0,
    serverWidth: 0,
  };

  _window = typeof window !== 'undefined' ? window : undefined;
  _isMounted = false;
  _positionFromTop = 0;
  _positionFromLeft = 0;

  constructor(props: Props) {
    super(props);

    const {width, height} = getDimensions(props.scrollElement, props);

    this.state = {
      height,
      width,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0,
    };
  }

  // Can’t use defaultProps for scrollElement without breaking server-side rendering
  get scrollElement(): ?Element {
    return this.props.scrollElement || this._window;
  }

  updatePosition(
    scrollElement: ?Element = this.scrollElement,
    props: Props = this.props,
  ) {
    const {onResize} = this.props;
    const {height, width} = this.state;

    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode instanceof Element && scrollElement) {
      const offset = getPositionOffset(thisNode, scrollElement);
      this._positionFromTop = offset.top;
      this._positionFromLeft = offset.left;
    }

    const dimensions = getDimensions(scrollElement, props);
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
  }

  componentDidMount() {
    const scrollElement = this.scrollElement;

    this.updatePosition(scrollElement);

    if (scrollElement) {
      registerScrollListener(this, scrollElement);
    }

     window.addEventListener('resize', this._onResize, false);

    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps: Props) {
    const scrollElement = this.scrollElement;
    const nextScrollElement = nextProps.scrollElement;

    if (
      scrollElement !== nextScrollElement &&
      scrollElement &&
      nextScrollElement
    ) {
      this.updatePosition(nextScrollElement, nextProps);

      unregisterScrollListener(this, scrollElement);
      registerScrollListener(this, nextScrollElement);
    }
  }

  componentWillUnmount() {
    if (this.scrollElement) {
      unregisterScrollListener(this, this.scrollElement);
    }
    window.removeEventListener('resize', this._onResize, false);

    this._isMounted = false;
  }

  render() {
    const {children} = this.props;
    const {isScrolling, scrollTop, scrollLeft, height, width} = this.state;

    return children({
      onChildScroll: this._onChildScroll,
      height,
      isScrolling,
      scrollLeft,
      scrollTop,
      width,
    });
  }

  _onChildScroll = ({scrollTop}: {scrollTop: number}) => {
    if (this.state.scrollTop === scrollTop) {
      return;
    }

    const scrollElement = this.scrollElement;
    if (scrollElement) {
      if (typeof scrollElement.scrollTo === 'function') {
        scrollElement.scrollTo(0, scrollTop + this._positionFromTop);
      } else {
        scrollElement.scrollTop = scrollTop + this._positionFromTop;
      }
    }
  };

  _onResize = () => {
    this.updatePosition();
  };

  // Referenced by utils/onScroll
  __handleWindowScrollEvent = () => {
    if (!this._isMounted) {
      return;
    }

    const {onScroll} = this.props;

    const scrollElement = this.scrollElement;
    if (scrollElement) {
      const scrollOffset = getScrollOffset(scrollElement);
      const scrollLeft = Math.max(
        0,
        scrollOffset.left - this._positionFromLeft,
      );
      const scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop);

      this.setState({
        isScrolling: true,
        scrollLeft,
        scrollTop,
      });

      onScroll({
        scrollLeft,
        scrollTop,
      });
    }
  };

  // Referenced by utils/onScroll
  __resetIsScrolling = () => {
    this.setState({
      isScrolling: false,
    });
  };
}
