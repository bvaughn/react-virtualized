/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import FlexColumn from './FlexColumn'
import FlexTable, { SortDirection } from './FlexTable'
import styles from './FlexTable.example.css'

export default class TableExample extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      rowsCount: 1000,
      scrollToIndex: undefined,
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
      height: 270,
      headerHeight: 30,
      rowHeight: 40
    }

    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._sort = this._sort.bind(this)
  }

  render () {
    const {
      headerHeight,
      height,
      rowsCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      rowHeight
    } = this.state

    const { list } = this.props
    const filteredList = list
      .sortBy(index => list.getIn([index, sortBy]))
      .update(list =>
        sortDirection === SortDirection.DESC
          ? list.reverse()
          : list
      )

    function rowGetter (index) {
      return filteredList.get(index)
    }

    return (
      <ContentBox {...this.props}>
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
        </InputRow>

        <FlexTable
          ref='Table'
          className={styles.FlexTable}
          headerClassName={styles.headerColumn}
          headerHeight={headerHeight}
          height={height}
          noRowsRenderer={this._noRowsRenderer}
          rowClassName={::this._rowClassName}
          rowHeight={rowHeight}
          rowGetter={rowGetter}
          rowsCount={rowsCount}
          sort={this._sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          width={430}
        >
          <FlexColumn
            label='Index'
            cellDataGetter={
              (dataKey, rowData, columnData) => rowData.id
            }
            dataKey='index'
            width={50}
          />
          <FlexColumn
            label='Name'
            dataKey='name'
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
      </ContentBox>
    )
  }

  _noRowsRenderer () {
    return (
      <div className={styles.noRows}>
        No rows
      </div>
    )
  }

  _onRowsCountChange (event) {
    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this.props.list.size, rowsCount))

    this.setState({ rowsCount })
  }

  _onScrollToRowChange (event) {
    const { rowsCount } = this.state
    let scrollToIndex = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })

    this.refs.Table.scrollToRow(scrollToIndex)
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
}
