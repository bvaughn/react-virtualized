/** @flow */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import raf from 'raf'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150

export default class WindowScroller extends Component {
  static propTypes = {
    /**
     * Function respondible for rendering children.
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

    this.state = {
      isScrolling: false,
      height: 0,
      scrollTop: 0
    }

    this._onScrollWindow = this._onScrollWindow.bind(this)
    this._onResizeWindow = this._onResizeWindow.bind(this)
    this._enablePointerEventsAfterDelayCallback = this._enablePointerEventsAfterDelayCallback.bind(this)
  }

  componentDidMount () {
    this._positionFromTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top -
        document.documentElement.getBoundingClientRect().top

    this.setState({ height: window.innerHeight })

    window.addEventListener('scroll', this._onScrollWindow, false)
    window.addEventListener('resize', this._onResizeWindow, false)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this._onScrollWindow, false)
    window.removeEventListener('resize', this._onResizeWindow, false)

    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)

      this._enablePointerEventsIfDisabled()
    }
  }

  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  _setNextState (state) {
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }

    this._setNextStateAnimationFrameId = raf(() => {
      this._setNextStateAnimationFrameId = null
      this.setState(state)
    })
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

  _enablePointerEventsAfterDelay () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    this._disablePointerEventsTimeoutId = setTimeout(
      this._enablePointerEventsAfterDelayCallback,
      IS_SCROLLING_TIMEOUT
    )
  }

  _enablePointerEventsAfterDelayCallback () {
    this._enablePointerEventsIfDisabled()

    this.setState({
      isScrolling: false
    })
  }

  _enablePointerEventsIfDisabled () {
    if (this._disablePointerEventsTimeoutId) {
      this._disablePointerEventsTimeoutId = null

      document.body.style.pointerEvents = this._originalBodyPointerEvents

      this._originalBodyPointerEvents = null
    }
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

    if (this._originalBodyPointerEvents == null) {
      this._originalBodyPointerEvents = document.body.style.pointerEvents

      document.body.style.pointerEvents = 'none'

      this._enablePointerEventsAfterDelay()
    }

    const state = {
      isScrolling: true,
      scrollTop
    }

    if (!this.state.isScrolling) {
      this.setState(state)
    } else {
      this._setNextState(state)
    }

    onScroll({ scrollTop })
  }
}
