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
    scrollElement: PropTypes.any,

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
      height,
      isScrolling: false,
      scrollTop: 0
    }

    this._onScrollWindow = this._onScrollWindow.bind(this)
    this._onResizeWindow = this._onResizeWindow.bind(this)
    this._enablePointerEventsAfterDelayCallback = this._enablePointerEventsAfterDelayCallback.bind(this)
  }

  get scrollElement () {
    return this.props.scrollElement || window
  }

  updatePosition () {
    this._updateDimensions()
  }

  componentDidMount () {
    this._updateDimensions()

    registerScrollListener(this, this.scrollElement)

    window.addEventListener('resize', this._onResizeWindow, false)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.scrollElement !== this.scrollElement) {
      this._updateDimensions(nextProps.scrollElement || window)

      unregisterScrollListener(this, this.scrollElement)
      registerScrollListener(this, nextProps.scrollElement || window)
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

  _enablePointerEventsAfterDelayCallback () {
    this.setState({
      isScrolling: false
    })
  }

  _updateDimensions (scrollElement = this.scrollElement) {
    const { onResize } = this.props
    const { height } = this.state

    this._positionFromTop = getPositionFromTop(ReactDOM.findDOMNode(this), scrollElement)

    const newHeight = getHeight(scrollElement)

    if (height !== newHeight) {
      this.setState({
        height: newHeight
      })

      onResize({ height: newHeight })
    }
  }

  _onResizeWindow (event) {
    this._updateDimensions()
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
