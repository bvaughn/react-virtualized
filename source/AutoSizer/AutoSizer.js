/** @flow */
import React, { Component, PropTypes } from 'react'
import detectElementResize from '../vendor/detectElementResize'
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
    /** React component to manage as a child */
    ChildComponent: PropTypes.any.isRequired
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
    detectElementResize.addResizeListener(this._parentNode, this._onResize)

    this._onResize()
  }

  componentWillUnmount () {
    detectElementResize.removeResizeListener(this._parentNode, this._onResize)
  }

  render () {
    const { ChildComponent, ...props } = this.props
    const { height, width } = this.state

    return (
      <div
        ref={this._setRef}
        className={styles.Wrapper}
      >
        <ChildComponent
          height={height}
          width={width}
          {...props}
        />
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
