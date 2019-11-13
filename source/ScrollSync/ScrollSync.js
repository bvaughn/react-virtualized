/** @flow */
import * as React from 'react';
import PropTypes from 'prop-types';

type Scrollable = {
  +scrollToPosition: ({scrollTop: number, scrollLeft: number}) => void,
};

type ScrollableElement = ?React.ElementRef<any> & Scrollable;

type OnScrollParams = {
  clientHeight: number,
  clientWidth: number,
  scrollHeight: number,
  scrollLeft: number,
  scrollTop: number,
  scrollWidth: number,
};

type Props = {
  /**
   * Function responsible for rendering 2 or more virtualized components.
   * This function should implement the following signature:
   * ({ onScroll, scrollLeft, scrollTop, registerChild }) => PropTypes.element
   */
  children: (
    params: OnScrollParams & {onScroll: OnScrollParams => void} & {
      registerChild: (element: ScrollableElement | null) => void,
    },
  ) => React.Node,
};

type State = {
  clientHeight: number,
  clientWidth: number,
  scrollHeight: number,
  scrollLeft: number,
  scrollTop: number,
  scrollWidth: number,
};

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */
export default class ScrollSync extends React.PureComponent<Props, State> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  _elements: (ScrollableElement | null)[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollLeft: 0,
      scrollTop: 0,
      scrollWidth: 0,
    };
  }

  render() {
    const {children} = this.props;
    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
    } = this.state;

    return children({
      clientHeight,
      clientWidth,
      onScroll: this._onScroll,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
      registerChild: this._registerChild,
    });
  }

  _onScroll = ({
    clientHeight,
    clientWidth,
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth,
  }) => {
    this.setState({
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
    });
    this._elements.forEach(element => {
      if (!!element && element.scrollToPosition)
        element.scrollToPosition({scrollLeft, scrollTop});
    });
  };

  _registerChild = (element: ScrollableElement | null) => {
    if (!element || !element.scrollToPosition) {
      console.warn(
        "ScrollSync registerChild expects to be passed a component with 'scrollToPosition' function",
      );
    }
    this._elements.push(element);
  };
}
