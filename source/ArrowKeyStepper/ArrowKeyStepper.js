/** @flow */
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export default class ArrowKeyStepper extends Component {
  static defaultProps = {
    disabled: false,
    mode: 'edges',
    scrollToColumn: 0,
    scrollToRow: 0
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['cells', 'edges', 'align:top-left', 'align:bottom-right']),
    rowCount: PropTypes.number.isRequired,
    scrollToColumn: PropTypes.number.isRequired,
    scrollToRow: PropTypes.number.isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollToColumn: props.scrollToColumn,
      scrollToRow: props.scrollToRow
    }

    this._columnStartIndex = 0
    this._columnStopIndex = 0
    this._rowStartIndex = 0
    this._rowStopIndex = 0

    this._onKeyDown = this._onKeyDown.bind(this)
    this._onSectionRendered = this._onSectionRendered.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    const { scrollToColumn, scrollToRow } = nextProps

    if (this.props.scrollToColumn !== scrollToColumn) {
      this.setState({ scrollToColumn })
    }

    if (this.props.scrollToRow !== scrollToRow) {
      this.setState({ scrollToRow })
    }
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
    const { columnCount, disabled, mode, rowCount } = this.props

    if (disabled) {
      return
    }

    const {
      scrollToColumn: scrollToColumnPrevious,
      scrollToRow: scrollToRowPrevious
    } = this.state

    let { scrollToColumn, scrollToRow } = this.state

    // The above cases all prevent default event event behavior.
    // This is to keep the grid from scrolling after the snap-to update.
    switch (event.key) {
      case 'ArrowDown':
        if (mode === 'cells') {
          scrollToRow = Math.min(scrollToRow + 1, rowCount - 1)
        } else if (mode === 'align:top-left') {
          scrollToRow = Math.min(this._rowStartIndex + 1, rowCount - 1)
        } else if (mode === 'align:bottom-right') {
          scrollToRow = Math.min(this._rowStopIndex + 1, rowCount - 1)
        } else {
          scrollToRow = Math.min(this._rowStopIndex + 1, rowCount - 1)
        }
        break
      case 'ArrowLeft':
        if (mode === 'cells') {
          scrollToColumn = Math.max(scrollToColumn - 1, 0)
        } else if (mode === 'align:top-left') {
          scrollToColumn = Math.max(this._columnStartIndex - 1, 0)
        } else if (mode === 'align:bottom-right') {
          scrollToColumn = Math.max(this._columnStopIndex - 1, 0)
        } else {
          scrollToColumn = Math.max(this._columnStartIndex - 1, 0)
        }
        break
      case 'ArrowRight':
        if (mode === 'cells') {
          scrollToColumn = Math.min(scrollToColumn + 1, columnCount - 1)
        } else if (mode === 'align:top-left') {
          scrollToColumn = Math.min(this._columnStartIndex + 1, columnCount - 1)
        } else if (mode === 'align:bottom-right') {
          scrollToColumn = Math.min(this._columnStopIndex + 1, columnCount - 1)
        } else {
          scrollToColumn = Math.min(this._columnStopIndex + 1, columnCount - 1)
        }
        break
      case 'ArrowUp':
        if (mode === 'cells') {
          scrollToRow = Math.max(scrollToRow - 1, 0)
        } else if (mode === 'align:top-left') {
          scrollToRow = Math.max(this._rowStartIndex - 1, 0)
        } else if (mode === 'align:bottom-right') {
          scrollToRow = Math.max(this._rowStopIndex - 1, 0)
        } else {
          scrollToRow = Math.max(this._rowStartIndex - 1, 0)
        }
        break
    }

    if (
      scrollToColumn !== scrollToColumnPrevious ||
      scrollToRow !== scrollToRowPrevious
    ) {
      event.preventDefault()

      this.setState({ scrollToColumn, scrollToRow })
    }
  }

  _onSectionRendered ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) {
    this._columnStartIndex = columnStartIndex
    this._columnStopIndex = columnStopIndex
    this._rowStartIndex = rowStartIndex
    this._rowStopIndex = rowStopIndex
  }
}
