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
     *
     */
    children: PropTypes.func.isRequired

  }

  constructor (props) {
    super(props)
    this.state = {
      scrollTop: 0,
      height: 0
    }

    this._onScroll = this._onScroll.bind(this)
  }

  componentDidMount () {
    this._positionFromTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top
    this.setState({ height: window.innerHeight })
    window.addEventListener('scroll', this._onScroll.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this._onScroll)
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
      <div onScroll={this._onScroll}>
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

  _onScroll (event) {
    this.setState({ scrollTop: Math.max(0, window.scrollY - Math.max(0, this._positionFromTop)) })
  }
}
