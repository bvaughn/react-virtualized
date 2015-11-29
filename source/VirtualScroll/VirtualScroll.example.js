/**
 * @flow
 */
import React, { Component } from 'react'
import VirtualScroll from './VirtualScroll'
import './VirtualScroll.example.less'

export default class VirtualScrollExample extends Component {
  constructor (props) {
    super(props)

    // HACK :)
    this._list = []
    for (var i = 0; i < 1000; i++) {
      this._list.push(i)
    }

    this.state = {
      rowsCount: this._list.length,
      scrollToIndex: undefined,
      virtualScrollHeight: 150,
      virtualScrollRowHeight: 30
    }

    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { rowsCount, scrollToIndex, virtualScrollHeight, virtualScrollRowHeight } = this.state

    return (
      <div className='VirtualScrollExample'>
        <h1 className='VirtualScrollExample__header'>
          VirtualScroll
          <small className='VirtualScrollExample__header__small'>
            <a href='https://github.com/bvaughn/react-virtualized/blob/master/source/VirtualScroll/VirtualScroll.example.js'>
              View source
            </a>
          </small>
        </h1>
        <p>
          The list below is virtualized, meaning that only the visible rows are rendered.
          Adjust its configurable properties below to see how it reacts.
        </p>
        <div className='VirtualScrollExample__row'>
          <LabeledInput
            label='Num rows'
            name='rowsCount'
            onChange={this._onRowsCountChange}
            value={rowsCount}
          />
          <LabeledInput
            label='Scroll to'
            name='onScrollToRow'
            placeholder='Index...'
            onChange={this._onScrollToRowChange}
            value={scrollToIndex}
          />
          <LabeledInput
            label='List height'
            name='virtualScrollHeight'
            onChange={event => this.setState({ virtualScrollHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollHeight}
          />
          <LabeledInput
            label='Row height'
            name='virtualScrollRowHeight'
            onChange={event => this.setState({ virtualScrollRowHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollRowHeight}
          />
        </div>
        <VirtualScroll
          className='VirtualScrollExample__VirtualScroll'
          width={400}
          height={virtualScrollHeight}
          rowsCount={rowsCount}
          rowHeight={virtualScrollRowHeight}
          rowRenderer={this._rowRenderer}
          scrollToIndex={scrollToIndex}
        />
      </div>
    )
  }

  _onRowsCountChange (event) {
    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this._list.length, rowsCount))

    this.setState({ rowsCount })
  }

  _onScrollToRowChange (event) {
    const { rowsCount } = this.state
    let scrollToIndex = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  _rowRenderer (index) {
    const { virtualScrollRowHeight } = this.state
    const rowStyle = {
      height: virtualScrollRowHeight
    }

    return (
      <div
        key={index}
        className='VirtualScrollExample__VirtualScroll__row'
        style={rowStyle}
      >
        {`Row index: ${index}`}
      </div>
    )
  }
}

function LabeledInput ({ label, name, onChange, placeholder, value }) {
  return (
    <div className='FlexTableExample__column'>
      <label className='FlexTableExample__label'>
        {label}
      </label>
      <input
        className='FlexTableExample__input'
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
