/** @flow */
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class GridCell extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const { children, height, left, top, width } = this.props

    return (
      <div
        className='Grid__cell'
        style={{
          height: this._getRowHeight(rowIndex),
          // left: `${left}px`,
          // top: `${top}px`,
          transform: `translate3d(${left}px, ${top}px, 0px)`,
          width
        }}
      >
        {children}
      </div>
    )
  }
}
