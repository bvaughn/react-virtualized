/** @flow */
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export default class ArrowKeyStepper extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    children: PropTypes.func.isRequired,
    columnsCount: PropTypes.number.isRequired,
    rowsCount: PropTypes.number.isRequired
  }

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
    const { children } = this.props
    const { scrollToColumn, scrollToRow } = this.state

    return (
      <div onKeyDown={this._onKeyDown}>
        {children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn,
          scrollToRow
        })}
      </div>
    )
  }

  _onKeyDown (event) {
    const { columnsCount, rowsCount } = this.props

    // The above cases all prevent default event event behavior.
    // This is to keep the grid from scrolling after the snap-to update.
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.setState({
          scrollToRow: Math.min(this._rowStopIndex + 1, rowsCount - 1)
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
          scrollToColumn: Math.min(this._columnStopIndex + 1, columnsCount - 1)
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
