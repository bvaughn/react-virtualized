/** @flow */
import { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll'
import { getVerticalScroll, getPositionFromTop, getHeight } from './utils/dimensions'

export default class WindowScroller extends Component {
  static propTypes = {
    /**
     * Function responsible for rendering children.
     * This function should implement the following signature:
     * ({ height, scrollTop }) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /** Element to attach scroll event listeners. Defaults to window. */
    scrollElement: PropTypes.object,

    /** Callback to be invoked on-resize: ({ height }) */
    onResize: PropTypes.func.isRequired,

    /** Callback to be invoked on-scroll: ({ scrollTop }) */
    onScroll: PropTypes.func.isRequired
  };

  static defaultProps = {
    onResize: () => {},
    onScroll: () => {}
  };

  constructor (props) {
    super(props)

    const height = typeof this.scrollElement !== 'undefined'
      ? getHeight(this.scrollElement)
      : 0

    this.state = {
      isScrolling: false,
      height,
      scrollTop: 0
    }

    this._onScrollWindow = this._onScrollWindow.bind(this)
    this._onResizeWindow = this._onResizeWindow.bind(this)
    this._enablePointerEventsAfterDelayCallback = this._enablePointerEventsAfterDelayCallback.bind(this)
  }

  // Can’t really use defaultProps for `window` without breaking server-side rendering
  get scrollElement () {
    return this.props.scrollElement || window
  }


  updatePosition () {
    // Subtract documentElement top to handle edge-case where a user is navigating back (history) from an already-scrolled bage.
    // In this case the body's top position will be a negative number and this element's top will be increased (by that amount).
    this._positionFromTop =
      ReactDOM.findDOMNode(this).getBoundingClientRect().top -
      document.documentElement.getBoundingClientRect().top
  }

  componentDidMount () {7db0ed738a92042e5b76b61
    const { height } = this.state

    this.updatePosition()

    const scrollElementHeight = getHeight(this.scrollElement)

    if (height !== scrollElementHeight) {
      this.setState({
        height: scrollElementHeight
      })
    }

    registerScrollListener(this)

    window.addEventListener('resize', this._onResizeWindow, false)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.scrollElement && nextProps.scrollElement !== this.scrollElement) {
      this._updateDimensions()
      unregisterScrollListener(this, this.scrollElement)
      registerScrollListener(this, nextProps.scrollElement)
    } else if (!nextProps.scrollElement && this.scrollElement !== window) {
      unregisterScrollListener(this, this.scrollElement)
      registerScrollListener(this, window)
    }
  }

  componentWillUnmount () {
    unregisterScrollListener(this, this.scrollElement)

    window.removeEventListener('resize', this._onResizeWindow, false)
  }

  render () {
    const { children } = this.props
    const { isScrolling, scrollTop, height } = this.state

    return children({
      height,
      isScrolling,
      scrollTop
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _updateDimensions () {
    const { height } = this.state

    this._positionFromTop = getPositionFromTop(ReactDOM.findDOMNode(this), this.scrollElement)

    const newHeight = getHeight(this.scrollElement)

    if (height !== newHeight) {
      this.setState({
        height: newHeight
      })
    }
  }

  _enablePointerEventsAfterDelayCallback () {
    this.setState({
      isScrolling: false
    })
  }

  _onResizeWindow (event) {
    const { onResize } = this.props

    this.updatePosition()

    const height = getHeight(this.scrollElement)

    this.setState({ height })

    onResize({ height })
  }

  _onScrollWindow (event) {
    const { onScroll } = this.props

    const scrollY = getVerticalScroll(this.scrollElement)

    const scrollTop = Math.max(0, scrollY - this._positionFromTop)

    this.setState({
      isScrolling: true,
      scrollTop
    })

    onScroll({ scrollTop })
  }
}
