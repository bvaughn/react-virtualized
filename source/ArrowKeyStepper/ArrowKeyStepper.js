/** @flow */
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export default class ArrowKeyStepper extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollToColumn: 0,
      scrollToRow: 0
    }

    this._columnStartIndex = 0
    this._columnStopIndex = 0
    this._rowStartIndex = 0
    this._rowStopIndex = 0

    this._onKeyDown = this._onKeyDown.bind(this)
    this._onSectionRendered = this._onSectionRendered.bind(this)
  }

  render () {
    const { className, children } = this.props
    const { scrollToColumn, scrollToRow } = this.state

    return (
      <div
        className={className}
        onKeyDown={this._onKeyDown}
      >
        {children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn,
          scrollToRow
        })}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _onKeyDown (event) {
    const { columnCount, rowCount } = this.props

    // The above cases all prevent default event event behavior.
    // This is to keep the grid from scrolling after the snap-to update.
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.setState({
          scrollToRow: Math.min(this._rowStopIndex + 1, rowCount - 1)
        })
        break
      case 'ArrowLeft':
        event.preventDefault()
        this.setState({
          scrollToColumn: Math.max(this._columnStartIndex - 1, 0)
        })
        break
      case 'ArrowRight':
        event.preventDefault()
        this.setState({
          scrollToColumn: Math.min(this._columnStopIndex + 1, columnCount - 1)
        })
        break
      case 'ArrowUp':
        event.preventDefault()
        this.setState({
          scrollToRow: Math.max(this._rowStartIndex - 1, 0)
        })
        break
    }
  }

  _onSectionRendered ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) {
    this._columnStartIndex = columnStartIndex
    this._columnStopIndex = columnStopIndex
    this._rowStartIndex = rowStartIndex
    this._rowStopIndex = rowStopIndex
  }
}
