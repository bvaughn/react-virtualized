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
        <h1>VirtualScroll</h1>
        <p>
          The list below is virtualized, meaning that only the visible rows are rendered.
          Adjust its configurable properties below to see how it reacts.
        </p>
        <div>
          <label className='VirtualScrollExample__label'>Num rows</label>
          <label className='VirtualScrollExample__label'>Scroll to</label>
          <label className='VirtualScrollExample__label'>List height</label>
          <label className='VirtualScrollExample__label'>Row height</label>
        </div>
        <div>
          <input
            className='VirtualScrollExample__input'
            name='rowsCount'
            onChange={this._onRowsCountChange}
            value={rowsCount}/>

          <input
            className='VirtualScrollExample__input'
            name='onScrollToRow'
            placeholder='Index...'
            onChange={this._onScrollToRowChange}
            value={scrollToIndex}/>

          <input
            className='VirtualScrollExample__input'
            name='virtualScrollHeight'
            onChange={event => this.setState({ virtualScrollHeight: Number.parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollHeight}/>

          <input
            className='VirtualScrollExample__input'
            name='virtualScrollRowHeight'
            onChange={event => this.setState({ virtualScrollRowHeight: Number.parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollRowHeight}/>
        </div>

        <VirtualScroll
          className='VirtualScrollExample__VirtualScroll'
          width={300}
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
    let rowsCount = Number.parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this._list.length, rowsCount))

    this.setState({ rowsCount })
  }

  _onScrollToRowChange (event) {
    const { rowsCount } = this.state
    let scrollToIndex = Math.min(rowsCount - 1, Number.parseInt(event.target.value, 10))

    if (Number.isNaN(scrollToIndex)) {
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
