/** @flow */
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import styles from './AutoSizer.css'

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */
export default class AutoSizer extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /**
     * Component to manage width/height of.
     */
    children: PropTypes.element,

    /**
     * React component to manage as a child.
     * This property is left in place for backwards compatibility but is not preferred.
     * If specified it will override any React children,
     * Although it is recommended to declare child component as a normal React child instead.
     */
    ChildComponent: PropTypes.any
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
    const { children, ChildComponent, ...props } = this.props
    const { height, width } = this.state

    let child

    if (ChildComponent) {
      child = (
        <ChildComponent
          height={height}
          width={width}
          {...props}
        />
      )
    } else {
      child = React.Children.only(children)
      child = React.cloneElement(child, { height, width })
    }

    return (
      <div
        ref={this._setRef}
        className={styles.Wrapper}
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
    this._parentNode = autoSizer.parentNode
  }
}
