/** @flow */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import raf from 'raf'

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
      scrollTop: 0,
      height: 0
    }

    this._onScrollWindow = this._onScrollWindow.bind(this)
    this._onResizeWindow = this._onResizeWindow.bind(this)
  }

  componentDidMount () {
    this._positionFromTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top

    this.setState({ height: window.innerHeight })

    window.addEventListener('scroll', this._onScrollWindow, false)
    window.addEventListener('resize', this._onResizeWindow, false)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this._onScrollWindow, false)
    window.removeEventListener('resize', this._onResizeWindow, false)
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
    const { scrollTop, height } = this.state

    return (
      <div>
        {children({
          height,
          scrollTop
        })}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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

    this._setNextState({ scrollTop })

    onScroll({ scrollTop })
  }
}
