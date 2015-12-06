/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import FlexColumn from './FlexColumn'
import FlexTable, { SortDirection } from './FlexTable'
import Immutable from 'immutable'
import './FlexTable.example.css'

export default class TableExample extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      rowsCount: 1000,
      scrollToIndex: undefined,
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
      height: 290,
      headerHeight: 20,
      rowHeight: 30
    }

    // HACK :)
    const list = []
    for (var i = 0; i < 1000; i++) {
      list.push({
        id: i,
        name: `Item ${i + 1}`,
        random: loremIpsum[i % loremIpsum.length]
      })
    }
    this._list = Immutable.List(list)

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

    const list = this._list
      .sortBy(index => this._list.getIn([index, sortBy]))
      .update(list =>
        sortDirection === SortDirection.DESC
          ? list.reverse()
          : list
      )

    function rowGetter (index) {
      return list.get(index)
    }

    return (
      <ContentBox className='FlexTableExample'>
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
          className='FlexTableExample__FlexTable'
          width={430}
          headerHeight={headerHeight}
          height={height}
          rowClassName='FlexTableExample__FlexTable__row'
          rowHeight={rowHeight}
          rowGetter={rowGetter}
          rowsCount={rowsCount}
          sort={this._sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
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
            label='The description label is really long'
            dataKey='random'
            cellClassName='FlexTableExample__exampleColumn'
            cellRenderer={
              (cellData, cellDataKey, rowData, rowIndex, columnData) => cellData
            }
            flexGrow={1}
          />
        </FlexTable>
      </ContentBox>
    )
  }

  _onRowsCountChange (event) {
    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this._list.size, rowsCount))

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

  _sort (sortBy, sortDirection) {
    this.setState({ sortBy, sortDirection })
  }
}

const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Phasellus vulputate odio commodo tortor sodales, et vehicula ipsum viverra.',
  'Cras tincidunt nisi in urna molestie varius.',
  'Curabitur ac enim dictum arcu varius fermentum vel sodales dui.',
  'Ut tristique augue at congue molestie.',
  'Cras eget enim nec odio feugiat tristique eu quis ante.',
  'Phasellus eget enim vitae nunc luctus sodales a eu erat.',
  'Nulla bibendum quam id velit blandit dictum.',
  'Donec dignissim mi ac libero feugiat, vitae lacinia odio viverra.',
  'Praesent vel lectus venenatis, elementum mauris vitae, ullamcorper nulla.',
  'Quisque sollicitudin nulla nec tellus feugiat hendrerit.',
  'Vestibulum a eros accumsan, lacinia eros non, pretium diam.',
  'Donec ornare felis et dui hendrerit, eget bibendum nibh interdum.',
  'Donec nec diam vel tellus egestas lobortis.',
  'Sed ornare nisl sit amet dolor pellentesque, eu fermentum leo interdum.',
  'Sed eget mauris condimentum, molestie justo eu, feugiat felis.',
  'Sed luctus justo vitae nibh bibendum blandit.',
  'Nulla ac eros vestibulum, mollis ante eu, rutrum nulla.',
  'Sed cursus magna ut vehicula rutrum.'
]
