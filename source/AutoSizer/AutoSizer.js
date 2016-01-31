/** @flow */
import cn from 'classnames'
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
    /** Component to manage width/height of */
    children: PropTypes.element,
    /** Optional CSS class name */
    className: PropTypes.string,
    /** Disable dynamic :height property */
    disableHeight: PropTypes.bool,
    /** Disable dynamic :width property */
    disableWidth: PropTypes.bool
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
    const { children, className, disableHeight, disableWidth, ...props } = this.props
    const { height, width } = this.state

    const childProps = {}

    if (!disableHeight) {
      childProps.height = height
    }

    if (!disableWidth) {
      childProps.width = width
    }

    let child = React.Children.only(children)
    child = React.cloneElement(child, childProps)

    return (
      <div
        ref={this._setRef}
        className={cn('AutoSizer', className)}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {child}
      </div>
    )
  }

  _onResize () {
    const { height, width } = this._parentNode.getBoundingClientRect()

    this.setState({
      height: height,
      width: width
    })
  }

  _setRef (autoSizer) {
    // In case the component has been unmounted
    this._parentNode = autoSizer && autoSizer.parentNode
  }
}
