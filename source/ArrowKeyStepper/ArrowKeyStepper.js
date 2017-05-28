/** @flow */
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export default class ArrowKeyStepper extends PureComponent {
  static defaultProps = {
    disabled: false,
    isControlled: false,
    mode: 'edges',
    scrollToColumn: 0,
    scrollToRow: 0
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    isControlled: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['cells', 'edges']),
    onScrollToChange: PropTypes.func,
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

  componentWillReceiveProps (nextProps) {
    if (this.props.isControlled) {
      return
    }

    const { scrollToColumn, scrollToRow } = nextProps

    const {
      scrollToColumn: prevScrollToColumn,
      scrollToRow: prevScrollToRow
    } = this.props

    if (
      prevScrollToColumn !== scrollToColumn &&
      prevScrollToRow !== scrollToRow
    ) {
      this.setState({
        scrollToColumn,
        scrollToRow
      })
    } else if (prevScrollToColumn !== scrollToColumn) {
      this.setState({ scrollToColumn })
    } else if (prevScrollToRow !== scrollToRow) {
      this.setState({ scrollToRow })
    }
  }

  setScrollIndexes ({
    scrollToColumn,
    scrollToRow
  }) {
    this.setState({
      scrollToRow,
      scrollToColumn
    })
  }

  render () {
    const { className, children } = this.props
    const { scrollToColumn, scrollToRow } = this._getScrollState()

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

  _onKeyDown (event) {
    const { columnCount, disabled, mode, rowCount } = this.props

    if (disabled) {
      return
    }

    const {
      scrollToColumn: scrollToColumnPrevious,
      scrollToRow: scrollToRowPrevious
    } = this._getScrollState()

    let { scrollToColumn, scrollToRow } = this._getScrollState()

    // The above cases all prevent default event event behavior.
    // This is to keep the grid from scrolling after the snap-to update.
    switch (event.key) {
      case 'ArrowDown':
        scrollToRow = mode === 'cells'
          ? Math.min(scrollToRow + 1, rowCount - 1)
          : Math.min(this._rowStopIndex + 1, rowCount - 1)
        break
      case 'ArrowLeft':
        scrollToColumn = mode === 'cells'
          ? Math.max(scrollToColumn - 1, 0)
          : Math.max(this._columnStartIndex - 1, 0)
        break
      case 'ArrowRight':
        scrollToColumn = mode === 'cells'
          ? Math.min(scrollToColumn + 1, columnCount - 1)
          : Math.min(this._columnStopIndex + 1, columnCount - 1)
        break
      case 'ArrowUp':
        scrollToRow = mode === 'cells'
          ? Math.max(scrollToRow - 1, 0)
          : Math.max(this._rowStartIndex - 1, 0)
        break
    }

    if (
      scrollToColumn !== scrollToColumnPrevious ||
      scrollToRow !== scrollToRowPrevious
    ) {
      event.preventDefault()

      this._updateScrollState({ scrollToColumn, scrollToRow })
    }
  }

  _onSectionRendered ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) {
    this._columnStartIndex = columnStartIndex
    this._columnStopIndex = columnStopIndex
    this._rowStartIndex = rowStartIndex
    this._rowStopIndex = rowStopIndex
  }

  _getScrollState () {
    return this.props.isControlled ? this.props : this.state
  }

  _updateScrollState ({ scrollToColumn, scrollToRow }) {
    if (this.props.isControlled) {
      this.props.onScrollToChange({ scrollToColumn, scrollToRow })
    } else {
      this.setState({ scrollToColumn, scrollToRow })
    }
  }
}
