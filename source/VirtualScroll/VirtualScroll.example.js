/**
 * @flow
 */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import styles from './VirtualScroll.example.css'
import VirtualScroll from './VirtualScroll'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class VirtualScrollExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      overscanRowsCount: 0,
      rowsCount: props.list.size,
      scrollToIndex: undefined,
      useDynamicRowHeight: false,
      virtualScrollHeight: 300,
      virtualScrollRowHeight: 60
    }

    this._getRowHeight = this._getRowHeight.bind(this)
    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
    this._updateUseDynamicRowHeight = this._updateUseDynamicRowHeight.bind(this)
  }

  render () {
    const {
      overscanRowsCount,
      rowsCount,
      scrollToIndex,
      useDynamicRowHeight,
      virtualScrollHeight,
      virtualScrollRowHeight
    } = this.state

    return (
      <ContentBox {...this.props}>
        <ContentBoxHeader
          text='VirtualScroll'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/VirtualScroll/VirtualScroll.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/VirtualScroll.md'
        />

        <ContentBoxParagraph>
          The list below is virtualized, meaning that only the visible rows are rendered.
          Adjust its configurable properties below to see how it reacts.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              className={styles.checkbox}
              type='checkbox'
              value={useDynamicRowHeight}
              onChange={event => this._updateUseDynamicRowHeight(event.target.checked)}
            />
            Use dynamic row heights?
          </label>
        </ContentBoxParagraph>

        <InputRow>
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
            disabled={useDynamicRowHeight}
            label='Row height'
            name='virtualScrollRowHeight'
            onChange={event => this.setState({ virtualScrollRowHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollRowHeight}
          />
          <LabeledInput
            disabled={useDynamicRowHeight}
            label='Overscan'
            name='overscanRowsCount'
            onChange={event => this.setState({ overscanRowsCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanRowsCount}
          />
        </InputRow>

        <VirtualScroll
          ref='VirtualScroll'
          className={styles.VirtualScroll}
          height={virtualScrollHeight}
          noRowsRenderer={this._noRowsRenderer}
          overscanRowsCount={overscanRowsCount}
          rowsCount={rowsCount}
          rowHeight={useDynamicRowHeight ? this._getRowHeight : virtualScrollRowHeight}
          rowRenderer={this._rowRenderer}
          scrollToIndex={scrollToIndex}
        />
      </ContentBox>
    )
  }

  _getRowHeight (index) {
    const { list } = this.props
    return list.get(index).size
  }

  _noRowsRenderer () {
    return (
      <div className={styles.noRows}>
        No rows
      </div>
    )
  }

  _onRowsCountChange (event) {
    const { list } = this.props

    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(list.size, rowsCount))

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
    const { list } = this.props
    const { useDynamicRowHeight, virtualScrollRowHeight } = this.state

    const datum = list.get(index)
    const height = useDynamicRowHeight
      ? datum.size
      : virtualScrollRowHeight

    let additionalContent

    if (useDynamicRowHeight) {
      switch (datum.size) {
        case 75:
          additionalContent = <div>It is medium-sized.</div>
          break
        case 100:
          additionalContent = <div>It is large-sized.<br/>It has a 3rd row.</div>
          break
      }
    }

    return (
      <div
        key={index}
        className={styles.row}
        style={{ height }}
      >
        <div
          className={styles.letter}
          style={{
            backgroundColor: datum.color
          }}
        >
          {datum.name.charAt(0)}
        </div>
        <div>
          <div className={styles.name}>
            {datum.name}
          </div>
          <div className={styles.index}>
            This is row {index}
          </div>
          {additionalContent}
        </div>
        {useDynamicRowHeight &&
          <span className={styles.height}>
            {datum.size}px
          </span>
        }
      </div>
    )
  }

  _updateUseDynamicRowHeight (value) {
    this.setState({
      rowsCount: 100,
      useDynamicRowHeight: value
    })
  }
}
