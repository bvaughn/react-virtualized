/** @flow */
import React, { Component } from 'react'
import FlexColumn from './FlexColumn'
import FlexTable, { SortDirection } from './FlexTable'
import Immutable from 'immutable'
import './FlexTable.example.less'

export default class TableExample extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      rowsCount: 1000,
      scrollToIndex: undefined,
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
      virtualScrollHeight: 300,
      virtualScrollHeaderHeight: 20,
      virtualScrollRowHeight: 30
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
      rowsCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      virtualScrollHeaderHeight,
      virtualScrollHeight,
      virtualScrollRowHeight
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
      <div className='FlexTableExample'>
        <h1 className='FlexTableExample__header'>
          FlexTable
          <small className='FlexTableExample__header__small'>
            <a href='https://github.com/bvaughn/react-virtualized/blob/master/source/FlexTable/FlexTable.example.js'>
              View source
            </a>
          </small>
        </h1>
        <p>
          The table layout below is created with flexboxes.
          This allows it to have a fixed header scrollable body content.
          It also makes use of <code>VirtualScroll</code> so that large lists of tabular data can be rendered efficiently.
          Adjust its configurable properties below to see how it reacts.
        </p>
        <div className='FlexTableExample__row'>
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
          <LabeledInput
            label='Header height'
            name='virtualScrollHeaderHeight'
            onChange={event => this.setState({ virtualScrollHeaderHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollHeaderHeight}
          />
        </div>

        <div className='FlexTableExample__container'>
          <FlexTable
            ref='Table'
            className='FlexTableExample__FlexTable'
            width={390}
            headerHeight={virtualScrollHeaderHeight}
            height={virtualScrollHeight}
            rowClassName='FlexTableExample__FlexTable__row'
            rowHeight={virtualScrollRowHeight}
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
              width={50}/>

            <FlexColumn
              label='Name'
              dataKey='name'
              width={90}/>

            <FlexColumn
              width={210}
              disableSort
              label='The description label is really long'
              dataKey='random'
              cellClassName='FlexTableExample__exampleColumn'
              cellRenderer={
                (cellData, cellDataKey, rowData, rowIndex, columnData) => cellData
              }
              flexGrow={1}/>
          </FlexTable>
        </div>
      </div>
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
