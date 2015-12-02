import React from 'react'
import { findDOMNode } from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import FlexColumn from './FlexColumn'
import FlexTable from './FlexTable'

describe('FlexTable', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  /*
  var node = null
  beforeEach(() => {
    node = document.createElement('div')
  })
  */

  const array = []
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: `Name ${i}`,
      email: `user-${i}@treasure-data.com`
    })
  }
  const list = Immutable.fromJS(array)

  // Works with an Immutable List of Maps
  function immutableRowGetter (index) {
    return list.get(index)
  }

  // Works with an Array of Objects
  function vanillaRowGetter (index) {
    return array[index]
  }

  function getMarkup ({
    cellRenderer = undefined,
    cellDataGetter = undefined,
    headerHeight = 20,
    height = 100,
    rowGetter = immutableRowGetter,
    rowHeight = 10,
    rowsCount = list.size,
    scrollToIndex = undefined,
    sort = undefined,
    sortBy = undefined,
    sortDirection = undefined,
    width = 100
  } = {}) {
    return (
      <FlexTable
        width={width}
        headerHeight={headerHeight}
        height={height}
        rowHeight={rowHeight}
        rowGetter={rowGetter}
        rowsCount={rowsCount}
        sort={sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
      >
        <FlexColumn
          label='Name'
          dataKey='name'
          width={50}
          cellRenderer={cellRenderer}
          cellDataGetter={cellDataGetter}
        />
        <FlexColumn
          label='Email'
          dataKey='email'
          width={50}
        />
      </FlexTable>
    )
  }

  function renderTable (props) {
    const flexTable = TestUtils.renderIntoDocument(getMarkup(props))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return flexTable
  }

  /*
  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // TestUtils.renderIntoDocument creates a new component/instance each time
  function renderOrUpdateTable (props) {
    let flexTable = render(getMarkup(props), node)

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return findDOMNode(flexTable)
  }
  */

  it('should not allow children of any type but FlexColumn', () => {
    expect(() => {
      TestUtils.renderIntoDocument(
        <FlexTable
          width={100}
          headerHeight={10}
          height={100}
          rowHeight={10}
          rowGetter={index => {}}
          rowsCount={10}
        >
          <div>Not a FlexColumn</div>
        </FlexTable>
      )
    }).toThrow()
  })

  describe('initial rendering', () => {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    const useImmutable = [true, false]
    useImmutable.forEach(useImmutable => {
      it('should render the correct number of rows', () => {
        const table = renderTable({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })
        const tableDOMNode = findDOMNode(table)

        // 100px height should fit 1 header (20px) and 9 rows (10px each) -
        // 8 to fill the remaining space and 1 to account for partial scrolling
        expect(tableDOMNode.querySelectorAll('.FlexTable__headerRow').length).toEqual(1)
        expect(tableDOMNode.querySelectorAll('.FlexTable__row').length).toEqual(9)
      })

      it('should render the expected headers', () => {
        const table = renderTable({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })
        const tableDOMNode = findDOMNode(table)
        const columns = tableDOMNode.querySelectorAll('.FlexTable__headerRow__column')

        expect(columns.length).toEqual(2)
        expect(columns[0].textContent).toEqual('Name')
        expect(columns[1].textContent).toEqual('Email')
      })

      it('should render the expected rows and columns', () => {
        const table = renderTable({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
          headerHeight: 10,
          rowHeight: 20,
          height: 50
        })
        const tableDOMNode = findDOMNode(table)
        const rows = tableDOMNode.querySelectorAll('.FlexTable__row')

        for (let index = 0; index < rows.length; index++) {
          let row = rows[index]
          let rowData = list.get(index)
          let columns = row.querySelectorAll('.FlexTable__row__column')
          expect(columns.length).toEqual(2)
          expect(columns[0].textContent).toEqual(rowData.get('name'))
          expect(columns[1].textContent).toEqual(rowData.get('email'))
        }
      })
    })
  })

  describe('custom getter functions', () => {
    it('should use a custom cellDataGetter if specified', () => {
      const table = renderTable({
        cellDataGetter: (dataKey, rowData, columnData) => `Custom ${dataKey} for row ${rowData.get('id')}`
      })
      const tableDOMNode = findDOMNode(table)
      const nameColumns = tableDOMNode.querySelectorAll('.FlexTable__row .FlexTable__row__column:first-of-type')

      for (let index = 0; index < nameColumns.length; index++) {
        let nameColumn = nameColumns[index]
        expect(nameColumn.textContent).toEqual(`Custom name for row ${index}`)
      }
    })

    it('should use a custom cellRenderer if specified', () => {
      const table = renderTable({
        cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => `Custom ${cellData}`
      })
      const tableDOMNode = findDOMNode(table)
      const nameColumns = tableDOMNode.querySelectorAll('.FlexTable__row .FlexTable__row__column:first-of-type')

      for (let index = 0; index < nameColumns.length; index++) {
        let nameColumn = nameColumns[index]
        let rowData = list.get(index)
        expect(nameColumn.textContent).toEqual(`Custom ${rowData.get('name')}`)
      }
    })
  })

  // TODO Test sorting
})
