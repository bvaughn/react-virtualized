/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import FlexColumn from './FlexColumn'
import FlexTable, { SortDirection } from './FlexTable'
import shouldPureComponentUpdate from 'react-pure-render/function'
import styles from './FlexTable.example.css'

export default class TableExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      headerHeight: 30,
      height: 270,
      overscanRowsCount: 0,
      rowHeight: 40,
      rowsCount: 1000,
      scrollToIndex: undefined,
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
      useDynamicRowHeight: false
    }

    this._getRowHeight = this._getRowHeight.bind(this)
    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._sort = this._sort.bind(this)
  }

  render () {
    const {
      headerHeight,
      height,
      overscanRowsCount,
      rowHeight,
      rowsCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      useDynamicRowHeight
    } = this.state

    const { list, ...props } = this.props
    const sortedList = this._isSortEnabled()
      ? list
        .sortBy(index => list.getIn([index, sortBy]))
        .update(list =>
          sortDirection === SortDirection.DESC
            ? list.reverse()
            : list
        )
      : list

    const rowGetter = index => this._getDatum(sortedList, index)

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='FlexTable'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/FlexTable/FlexTable.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/FlexTable.md'
        />

        <ContentBoxParagraph>
          The table layout below is created with flexboxes.
          This allows it to have a fixed header scrollable body content.
          It also makes use of <code>VirtualScroll</code> so that large lists of tabular data can be rendered efficiently.
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
            name='height'
            onChange={event => this.setState({ height: parseInt(event.target.value, 10) || 1 })}
            value={height}
          />
          <LabeledInput
            disabled={useDynamicRowHeight}
            label='Row height'
            name='rowHeight'
            onChange={event => this.setState({ rowHeight: parseInt(event.target.value, 10) || 1 })}
            value={rowHeight}
          />
          <LabeledInput
            label='Header height'
            name='headerHeight'
            onChange={event => this.setState({ headerHeight: parseInt(event.target.value, 10) || 1 })}
            value={headerHeight}
          />
          <LabeledInput
            label='Overscan'
            name='overscanRowsCount'
            onChange={event => this.setState({ overscanRowsCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanRowsCount}
          />
        </InputRow>

        <div>
          <AutoSizer disableHeight>
            <FlexTable
              ref='Table'
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowsCount={overscanRowsCount}
              rowClassName={::this._rowClassName}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              rowsCount={rowsCount}
              scrollToIndex={scrollToIndex}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={0}
            >
              <FlexColumn
                label='Index'
                cellDataGetter={
                  (dataKey, rowData, columnData) => rowData.index
                }
                dataKey='index'
                disableSort={!this._isSortEnabled()}
                width={50}
              />
              <FlexColumn
                label='Name'
                dataKey='name'
                disableSort={!this._isSortEnabled()}
                width={90}
              />
              <FlexColumn
                width={210}
                disableSort
                label='The description label is really long so that it will be truncated'
                dataKey='random'
                cellClassName={styles.exampleColumn}
                cellRenderer={
                  (cellData, cellDataKey, rowData, rowIndex, columnData) => cellData
                }
                flexGrow={1}
              />
            </FlexTable>
          </AutoSizer>
        </div>
      </ContentBox>
    )
  }

  _getDatum (list, index) {
    return list.get(index % list.size)
  }

  _getRowHeight (index) {
    const { list } = this.props

    return this._getDatum(list, index).size
  }

  _isSortEnabled () {
    const { list } = this.props
    const { rowsCount } = this.state

    return rowsCount <= list.size
  }

  _noRowsRenderer () {
    return (
      <div className={styles.noRows}>
        No rows
      </div>
    )
  }

  _onRowsCountChange (event) {
    const rowsCount = parseInt(event.target.value, 10) || 0

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

  _rowClassName (index) {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  _sort (sortBy, sortDirection) {
    this.setState({ sortBy, sortDirection })
  }

  _updateUseDynamicRowHeight (value) {
    this.setState({
      useDynamicRowHeight: value
    })
  }
}
