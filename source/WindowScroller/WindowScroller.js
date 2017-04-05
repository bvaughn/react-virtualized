/** @flow */
import { PropTypes, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll'
import { getDimensions, getPositionOffset, getScrollOffset } from './utils/dimensions'

export default class WindowScroller extends PureComponent {
  static propTypes = {
    /**
     * Function responsible for rendering children.
     * This function should implement the following signature:
     * ({ height, isScrolling, scrollTop }) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /** Callback to be invoked on-resize: ({ height }) */
    onResize: PropTypes.func.isRequired,

    /** Callback to be invoked on-scroll: ({ scrollTop }) */
    onScroll: PropTypes.func.isRequired,

    /** Element to attach scroll event listeners. Defaults to window. */
    scrollElement: PropTypes.any
  };

  static defaultProps = {
    onResize: () => {},
    onScroll: () => {}
  };

  constructor (props) {
    super(props)

    // Handle server-side rendering case
    const { width, height } = typeof window !== 'undefined'
      ? getDimensions(props.scrollElement || window)
      : { width: 0, height: 0 }

    this.state = {
      height,
      width,
      isScrolling: false,
      scrollTop: 0
    }

    this._onResize = this._onResize.bind(this)
    this.__handleWindowScrollEvent = this.__handleWindowScrollEvent.bind(this)
    this.__resetIsScrolling = this.__resetIsScrolling.bind(this)
  }

  // Can’t use defaultProps for scrollElement without breaking server-side rendering
  get scrollElement () {
    return this.props.scrollElement || window
  }

  updatePosition (scrollElement) {
    const { onResize } = this.props
    const { height, width } = this.state

    scrollElement = scrollElement || this.props.scrollElement || window
    const offset = getPositionOffset(ReactDOM.findDOMNode(this), scrollElement)
    this._positionFromTop = offset.top
    this._positionFromLeft = offset.left

    const dimensions = getDimensions(scrollElement)
    if (height !== dimensions.height || width !== dimensions.width) {
      this.setState({
        height: dimensions.height,
        width: dimensions.width
      })
      onResize({
        height: dimensions.height,
        width: dimensions.width
      })
    }
  }

  componentDidMount () {
    const scrollElement = this.props.scrollElement || window

    this.updatePosition(scrollElement)

    registerScrollListener(this, scrollElement)

    window.addEventListener('resize', this._onResize, false)
  }

  componentWillReceiveProps (nextProps) {
    const scrollElement = this.props.scrollElement || window
    const nextScrollElement = nextProps.scrollElement || window

    if (scrollElement !== nextScrollElement) {
      this.updatePosition(nextScrollElement)

      unregisterScrollListener(this, scrollElement)
      registerScrollListener(this, nextScrollElement)
    }
  }

  componentWillUnmount () {
    unregisterScrollListener(this, this.props.scrollElement || window)

    window.removeEventListener('resize', this._onResize, false)
  }

  render () {
    const { children } = this.props
    const { isScrolling, scrollTop, scrollLeft, height, width } = this.state

    return children({
      width,
      height,
      isScrolling,
      scrollLeft,
      scrollTop
    })
  }

  _onResize (event) {
    this.updatePosition()
  }

  // Referenced by utils/onScroll
  __handleWindowScrollEvent (event) {
    const { onScroll } = this.props

    const scrollElement = this.props.scrollElement || window
    const scrollOffset = getScrollOffset(scrollElement)
    const scrollLeft = Math.max(0, scrollOffset.left - this._positionFromLeft)
    const scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop)

    this.setState({
      isScrolling: true,
      scrollLeft,
      scrollTop
    })

    onScroll({
      scrollLeft,
      scrollTop
    })
  }

  // Referenced by utils/onScroll
  __resetIsScrolling () {
    this.setState({
      isScrolling: false
    })
  }
}
