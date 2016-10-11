/** @noflow */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll'

export default class WindowScroller extends Component {

  static propTypes = {
    /**
     * Function responsible for rendering children.
     * This function should implement the following signature:
     * ({ height, scrollTop }) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /** Callback to be invoked on-resize: ({ height }) */
    onResize: PropTypes.func.isRequired,

    /** Callback to be invoked on-scroll: ({ scrollTop }) */
    onScroll: PropTypes.func.isRequired
  }

  static defaultProps = {
    onResize: () => {},
    onScroll: () => {}
  }

  constructor (props) {
    super(props)

    const height = typeof window !== 'undefined'
      ? window.innerHeight
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

  componentDidMount () {
    const { height } = this.state

    // Subtract documentElement top to handle edge-case where a user is navigating back (history) from an already-scrolled bage.
    // In this case the body's top position will be a negative number and this element's top will be increased (by that amount).
    this._positionFromTop =
      ReactDOM.findDOMNode(this).getBoundingClientRect().top -
      document.documentElement.getBoundingClientRect().top

    if (height !== window.innerHeight) {
      this.setState({
        height: window.innerHeight
      })
    }

    registerScrollListener(this)
    window.addEventListener('resize', this._onResizeWindow, false)
  }

  componentWillUnmount () {
    unregisterScrollListener(this)

    window.removeEventListener('resize', this._onResizeWindow, false)
  }

  render () {
    const { children } = this.props
    const { isScrolling, scrollTop, height } = this.state

    return (
      <div>
        {children({
          height,
          isScrolling,
          scrollTop
        })}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _enablePointerEventsAfterDelayCallback () {
    this.setState({
      isScrolling: false
    })
  }

  _onResizeWindow (event) {
    const { onResize } = this.props

    const height = window.innerHeight || 0

    this.setState({ height })

    onResize({ height })
  }

  _onScrollWindow (event) {
    const { onScroll } = this.props

    // In IE10+ scrollY is undefined, so we replace that with the latter
    const scrollY = ('scrollY' in window)
      ? window.scrollY
      : document.documentElement.scrollTop

    const scrollTop = Math.max(0, scrollY - this._positionFromTop)

    this.setState({
      isScrolling: true,
      scrollTop
    })

    onScroll({ scrollTop })
  }
}
