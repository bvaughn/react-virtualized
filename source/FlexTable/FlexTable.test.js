import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate } from 'react-addons-test-utils'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import FlexColumn from './FlexColumn'
import FlexTable, { SortDirection } from './FlexTable'

describe('FlexTable', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

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
    disableSort = false,
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
          disableSort={disableSort}
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

  // Maybe test FlexTable.propTypes.children directly
  it('should not accept non-FlexColumn children', () => {
    const result = FlexTable.propTypes.children({ children: <div/> }, 'children', 'FlexTable')
    expect(result instanceof Error).toEqual(true)
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

  describe('sorting', () => {
    it('should not render sort indicators if no sort function is provided', () => {
      const table = renderTable()
      const tableDOMNode = findDOMNode(table)
      const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

      expect(nameColumn.className).not.toContain('FlexTable__headerRow__column--sortable')
    })

    it('should not render sort indicators for non-sortable columns', () => {
      const table = renderTable({
        disableSort: true,
        sort: () => {}
      })
      const tableDOMNode = findDOMNode(table)
      const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

      expect(nameColumn.className).not.toContain('FlexTable__headerRow__column--sortable')
    })

    it('should render sortable column headers as sortable', () => {
      const table = renderTable({
        sort: () => {}
      })
      const tableDOMNode = findDOMNode(table)
      const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

      expect(nameColumn.className).toContain('FlexTable__headerRow__column--sortable')
    })

    it('should render the correct sort indicator by the current sort-by column', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC]
      sortDirections.forEach(sortDirection => {
        const table = renderTable({
          sort: () => {},
          sortBy: 'name',
          sortDirection
        })
        const tableDOMNode = findDOMNode(table)
        const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

        expect(nameColumn.querySelector('.FlexTable__headerRow__SortIndicator')).not.toEqual(null)
        expect(nameColumn.querySelector(`.FlexTable__headerRow__SortIndicator--${sortDirection}`)).not.toEqual(null)
      })
    })

    it('should call sort with the correct arguments when the current sort-by column header is clicked', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC]
      sortDirections.forEach(sortDirection => {
        const sortCalls = []
        const table = renderTable({
          sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
          sortBy: 'name',
          sortDirection
        })
        const tableDOMNode = findDOMNode(table)
        const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

        Simulate.click(nameColumn)
        expect(sortCalls.length).toEqual(1)

        const {dataKey, newSortDirection} = sortCalls[0]
        const expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
        expect(dataKey).toEqual('name')
        expect(newSortDirection).toEqual(expectedSortDirection)
      })
    })

    it('should call sort with the correct arguments when a new sort-by column header is clicked', () => {
      const sortCalls = []
      const table = renderTable({
        sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
        sortBy: 'email',
        sortDirection: SortDirection.ASC
      })
      const tableDOMNode = findDOMNode(table)
      const nameColumn = tableDOMNode.querySelector('.FlexTable__headerRow__column:first-of-type')

      Simulate.click(nameColumn)
      expect(sortCalls.length).toEqual(1)

      const {dataKey, newSortDirection} = sortCalls[0]
      expect(dataKey).toEqual('name')
      expect(newSortDirection).toEqual(SortDirection.ASC)
    })
  })
})
