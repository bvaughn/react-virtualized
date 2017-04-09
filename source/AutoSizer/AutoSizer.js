/** @flow */
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import createDetectElementResize from '../vendor/detectElementResize'

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */
export default class AutoSizer extends PureComponent {
  static propTypes = {
    /**
    * Function responsible for rendering children.
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
  };

  static defaultProps = {
    onResize: () => {}
  };

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
    this._detectElementResize = createDetectElementResize()
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

    /**
     * TODO: Avoid rendering children before the initial measurements have been collected.
     * At best this would just be wasting cycles.
     * Add this check into version 10 though as it could break too many ref callbacks in version 9.
    if (
      height !== 0 &&
      width !== 0
    ) {
      child = children({ height, width })
    }
    */

    return (
      <div
        ref={this._setRef}
        style={outerStyle}
      >
        {children({ height, width })}
      </div>
    )
  }

  _onResize () {
    const {
      disableHeight,
      disableWidth,
      onResize
    } = this.props

    // Guard against AutoSizer component being removed from the DOM immediately after being added.
    // This can result in invalid style values which can result in NaN values if we don't handle them.
    // See issue #150 for more context.

    const height = this._parentNode.offsetHeight || 0
    const width = this._parentNode.offsetWidth || 0

    const style = window.getComputedStyle(this._parentNode) || {}
    const paddingLeft = parseInt(style.paddingLeft, 10) || 0
    const paddingRight = parseInt(style.paddingRight, 10) || 0
    const paddingTop = parseInt(style.paddingTop, 10) || 0
    const paddingBottom = parseInt(style.paddingBottom, 10) || 0

    const newHeight = height - paddingTop - paddingBottom
    const newWidth = width - paddingLeft - paddingRight

    if (
      !disableHeight &&
      this.state.height !== newHeight ||
      !disableWidth &&
      this.state.width !== newWidth
    ) {
      this.setState({
        height: height - paddingTop - paddingBottom,
        width: width - paddingLeft - paddingRight
      })

      onResize({ height, width })
    }
  }

  _setRef (autoSizer) {
    this._autoSizer = autoSizer
  }
}
