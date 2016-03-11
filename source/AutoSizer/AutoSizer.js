/** @flow */
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */
export default class AutoSizer extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /**
     * Function respondible for rendering children.
     * This function should implement the following signature:
     * ({ height, width }) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /** Disable dynamic :height property */
    disableHeight: PropTypes.bool,

    /** Disable dynamic :width property */
    disableWidth: PropTypes.bool,

    /** Callback to be invoked on-resize: ({ height, width }) */
    onResize: PropTypes.func.isRequired
  }

  static defaultProps = {
    onResize: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      height: 0,
      width: 0
    }

    this._onResize = this._onResize.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._setRef = this._setRef.bind(this)
  }

  componentDidMount () {
    // Defer requiring resize handler in order to support server-side rendering.
    // See issue #41
    this._detectElementResize = require('../vendor/detectElementResize')
    this._detectElementResize.addResizeListener(this._parentNode, this._onResize)

    this._onResize()
  }

  componentWillUnmount () {
    this._detectElementResize.removeResizeListener(this._parentNode, this._onResize)
  }

  render () {
    const { children, disableHeight, disableWidth } = this.props
    const { height, width } = this.state

    // Outer div should not force width/height since that may prevent containers from shrinking.
    // Inner component should overflow and use calculated width/height.
    // See issue #68 for more information.
    const outerStyle = { overflow: 'visible' }

    if (!disableHeight) {
      outerStyle.height = 0
    }

    if (!disableWidth) {
      outerStyle.width = 0
    }

    return (
      <div
        ref={this._setRef}
        onScroll={this._onScroll}
        style={outerStyle}
      >
        {children({ height, width })}
      </div>
    )
  }

  _onResize () {
    const { onResize } = this.props
    const { height, width } = this._parentNode.getBoundingClientRect()

    const style = getComputedStyle(this._parentNode)
    const paddingLeft = parseInt(style.paddingLeft, 10)
    const paddingRight = parseInt(style.paddingRight, 10)
    const paddingTop = parseInt(style.paddingTop, 10)
    const paddingBottom = parseInt(style.paddingBottom, 10)

    this.setState({
      height: height - paddingTop - paddingBottom,
      width: width - paddingLeft - paddingRight
    })

    onResize({ height, width })
  }

  _onScroll (event) {
    // Prevent detectElementResize library from being triggered by this scroll event.
    event.stopPropagation()
  }

  _setRef (autoSizer) {
    // In case the component has been unmounted
    this._parentNode = autoSizer && autoSizer.parentNode
  }
}
