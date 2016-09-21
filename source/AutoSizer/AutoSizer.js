/** @flow */
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */
export default class AutoSizer extends Component {
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
    this._setRef = this._setRef.bind(this)
  }

  componentDidMount () {
    // Delay access of parentNode until mount.
    // This handles edge-cases where the component has already been unmounted before its ref has been set,
    // As well as libraries like react-lite which have a slightly different lifecycle.
    this._parentNode = this._autoSizer.parentNode

    // Defer requiring resize handler in order to support server-side rendering.
    // See issue #41
    this._detectElementResize = require('../vendor/detectElementResize')
    this._detectElementResize.addResizeListener(this._parentNode, this._onResize)

    this._onResize()
  }

  componentWillUnmount () {
    if (this._detectElementResize) {
      this._detectElementResize.removeResizeListener(this._parentNode, this._onResize)
    }
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
        style={outerStyle}
      >
        {children({ height, width })}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _onResize () {
    const { onResize } = this.props

    // Gaurd against AutoSizer component being removed from the DOM immediately after being added.
    // This can result in invalid style values which can result in NaN values if we don't handle them.
    // See issue #150 for more context.

    const boundingRect = this._parentNode.getBoundingClientRect()
    const height = boundingRect.height || 0
    const width = boundingRect.width || 0

    const style = getComputedStyle(this._parentNode)
    const paddingLeft = parseInt(style.paddingLeft, 10) || 0
    const paddingRight = parseInt(style.paddingRight, 10) || 0
    const paddingTop = parseInt(style.paddingTop, 10) || 0
    const paddingBottom = parseInt(style.paddingBottom, 10) || 0

    this.setState({
      height: height - paddingTop - paddingBottom,
      width: width - paddingLeft - paddingRight
    })

    onResize({ height, width })
  }

  _setRef (autoSizer) {
    this._autoSizer = autoSizer
  }
}
