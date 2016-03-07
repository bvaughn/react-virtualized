import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Immutable from 'immutable'
import FlexColumn from './FlexColumn'
import FlexTable from './FlexTable'
import SortDirection from './SortDirection'

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
const immutableRowGetter = (index) => list.get(index)

// Works with an Array of Objects
const vanillaRowGetter = (index) => array[index]

function getMarkup ({
  cellRenderer,
  cellDataGetter,
  className,
  columnData = { data: 123 },
  disableSort = false,
  headerClassName,
  headerHeight = 20,
  headerRenderer = undefined,
  height = 100,
  noRowsRenderer = undefined,
  onHeaderClick = undefined,
  onRowClick = undefined,
  onRowsRendered = undefined,
  onScroll = undefined,
  overscanRowsCount = 0,
  rowClassName = undefined,
  rowGetter = immutableRowGetter,
  rowHeight = 10,
  rowsCount = list.size,
  scrollToIndex,
  scrollTop,
  sort,
  sortBy,
  sortDirection,
  width = 100
} = {}) {
  return (
    <FlexTable
      className={className}
      headerClassName={headerClassName}
      headerHeight={headerHeight}
      height={height}
      noRowsRenderer={noRowsRenderer}
      onHeaderClick={onHeaderClick}
      onRowClick={onRowClick}
      onRowsRendered={onRowsRendered}
      onScroll={onScroll}
      overscanRowsCount={overscanRowsCount}
      rowClassName={rowClassName}
      rowGetter={rowGetter}
      rowHeight={rowHeight}
      rowsCount={rowsCount}
      scrollToIndex={scrollToIndex}
      scrollTop={scrollTop}
      sort={sort}
      sortBy={sortBy}
      sortDirection={sortDirection}
      width={width}
    >
      <FlexColumn
        label='Name'
        dataKey='name'
        columnData={columnData}
        width={50}
        cellRenderer={cellRenderer}
        cellDataGetter={cellDataGetter}
        headerRenderer={headerRenderer}
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

function getHeaderColumn (mounted, columnIndex) {
  return mounted
    .find('.FlexTable__headerRow').at(0)
    .find('.FlexTable__headerColumn').at(columnIndex)
}

// Maybe test FlexTable.propTypes.children directly
test('FlexTable should not accept non-FlexColumn children', (assert) => {
  const result = FlexTable.propTypes.children({ children: <div/> }, 'children', 'FlexTable')
  assert.ok(result instanceof Error)
  assert.end()
})

// Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
const useImmutable = [true, false]
useImmutable.forEach(useImmutable => {
  test('FlexTable initial rendering should render the correct number of rows', (assert) => {
    const mounted = mount(getMarkup({
      rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
    }))

    // 100px height should fit 1 header (20px) and 8 rows (10px each) -
    assert.equal(mounted.find('.FlexTable__headerRow').length, 1)
    assert.equal(mounted.find('.FlexTable__row').length, 8)
    assert.end()
  })

  test('FlexTable initial rendering should render the expected headers', (assert) => {
    const mounted = mount(getMarkup({
      rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
    }))
    const columns = mounted.find('.FlexTable__headerColumn')

    assert.equal(columns.length, 2)
    assert.equal(columns.at(0).text(), 'Name')
    assert.equal(columns.at(1).text(), 'Email')
    assert.end()
  })

  test('FlexTable initial rendering should render the expected rows and columns', (assert) => {
    const mounted = mount(getMarkup({
      rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
      headerHeight: 10,
      rowHeight: 20,
      height: 50
    }))
    const rows = mounted.find('.FlexTable__row')
    assert.equal(rows.length, 2)

    for (let index = 0; index < rows.length; index++) {
      let row = rows.at(index)
      let rowData = list.get(index)
      let columns = row.find('.FlexTable__rowColumn')
      assert.equal(columns.length, 2)
      assert.equal(columns.at(0).text(), rowData.get('name'))
      assert.equal(columns.at(1).text(), rowData.get('email'))
    }

    assert.end()
  })
}) // forEach Immutable vs Array

test('FlexTable should use a custom cellDataGetter if specified', (assert) => {
  const mounted = mount(getMarkup({
    cellDataGetter: (dataKey, rowData, columnData) => `Custom ${dataKey} for row ${rowData.get('id')}`
  }))
  mounted.find('.FlexTable__row').forEach(
    (row, index) => {
      const text = row.find('.FlexTable__rowColumn').at(0).text()
      assert.equal(text, `Custom name for row ${index}`)
    }
  )
  assert.end()
})

test('FlexTable should use a custom cellRenderer if specified', (assert) => {
  const mounted = mount(getMarkup({
    cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => `Custom ${cellData}`
  }))
  mounted.find('.FlexTable__row').forEach(
    (row, index) => {
      let rowData = list.get(index)
      const text = row.find('.FlexTable__rowColumn').at(0).text()
      assert.equal(text, `Custom ${rowData.get('name')}`)
    }
  )
  assert.end()
})

test('FlexTable should set the rendered cell content as the cell :title if it is a string', (assert) => {
  const mounted = mount(getMarkup({
    cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => 'Custom'
  }))
  const row = mounted.find('.FlexTable__row').at(0)
  const nameColumn = row.find('.FlexTable__rowColumn').at(0)
  assert.ok(nameColumn.children().at(0).prop('title').includes('Custom'))
  assert.end()
})

test('FlexTable should not set a cell :title if the rendered cell content is not a string', (assert) => {
  const mounted = mount(getMarkup({
    cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => <div>Custom</div>
  }))
  const row = mounted.find('.FlexTable__row').at(0)
  const nameColumn = row.find('.FlexTable__rowColumn').at(0)
  assert.equal(nameColumn.children().at(0).prop('title'), null)
  assert.end()
})

test('FlexTable should not render sort indicators if no sort function is provided', (assert) => {
  const mounted = mount(getMarkup())
  const nameColumn = getHeaderColumn(mounted, 0)
  assert.ok(!nameColumn.hasClass('FlexTable__sortableHeaderColumn'))
  assert.end()
})

test('FlexTable should not render sort indicators for non-sortable columns', (assert) => {
  const mounted = mount(getMarkup({
    disableSort: true,
    sort: () => {}
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  assert.ok(!nameColumn.hasClass('FlexTable__sortableHeaderColumn'))
  const emailColumn = getHeaderColumn(mounted, 1)
  assert.ok(emailColumn.hasClass('FlexTable__sortableHeaderColumn'))
  assert.end()
})

test('FlexTable should render sortable column headers as sortable', (assert) => {
  const mounted = mount(getMarkup({
    sort: () => {}
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  assert.ok(nameColumn.hasClass('FlexTable__sortableHeaderColumn'))
  const emailColumn = getHeaderColumn(mounted, 1)
  assert.ok(emailColumn.hasClass('FlexTable__sortableHeaderColumn'))
  assert.end()
})

test('FlexTable should render the correct sort indicator by the current sort-by column', (assert) => {
  const sortDirections = [SortDirection.ASC, SortDirection.DESC]
  sortDirections.forEach(sortDirection => {
    const mounted = mount(getMarkup({
      sort: () => {},
      sortBy: 'name',
      sortDirection
    }))
    const nameColumn = getHeaderColumn(mounted, 0)
    assert.ok(nameColumn.find('.FlexTable__sortableHeaderIcon').length > 0)
    assert.ok(nameColumn.find(`.FlexTable__sortableHeaderIcon--${sortDirection}`).length > 0)
  })
  assert.end()
})

test('FlexTable should call sort with the correct arguments when the current sort-by column header is clicked', (assert) => {
  const sortDirections = [SortDirection.ASC, SortDirection.DESC]
  sortDirections.forEach(sortDirection => {
    const sortCalls = []
    const mounted = mount(getMarkup({
      sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
      sortBy: 'name',
      sortDirection
    }))
    const nameColumn = getHeaderColumn(mounted, 0)

    nameColumn.simulate('click')
    assert.equal(sortCalls.length, 1)

    const {dataKey, newSortDirection} = sortCalls[0]
    const expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    assert.equal(dataKey, 'name')
    assert.equal(newSortDirection, expectedSortDirection)
  })
  assert.end()
})

test('FlexTable should call sort with the correct arguments when a new sort-by column header is clicked', (assert) => {
  const sortCalls = []
  const mounted = mount(getMarkup({
    sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
    sortBy: 'email',
    sortDirection: SortDirection.ASC
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  nameColumn.simulate('click')
  assert.equal(sortCalls.length, 1)

  const {dataKey, newSortDirection} = sortCalls[0]
  assert.equal(dataKey, 'name')
  assert.equal(newSortDirection, SortDirection.ASC)
  assert.end()
})

test('FlexTable should render a custom header if one is provided', (assert) => {
  const columnData = { foo: 'foo', bar: 'bar' }
  const headerRendererCalls = []
  const mounted = mount(getMarkup({
    columnData,
    headerRenderer: (params) => {
      headerRendererCalls.push(params)
      return 'custom header'
    },
    sortBy: 'name',
    sortDirection: SortDirection.ASC
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  assert.ok(nameColumn.text().includes('custom header'))
  assert.equal(headerRendererCalls.length, 1)

  const headerRendererCall = headerRendererCalls[0]
  assert.equal(headerRendererCalls.length, 1)
  assert.equal(headerRendererCall.columnData, columnData)
  assert.equal(headerRendererCall.dataKey, 'name')
  assert.equal(headerRendererCall.disableSort, false)
  assert.equal(headerRendererCall.label, 'Name')
  assert.equal(headerRendererCall.sortBy, 'name')
  assert.equal(headerRendererCall.sortDirection, SortDirection.ASC)
  assert.end()
})

test('FlexTable should honor sort for custom headers', (assert) => {
  const sortCalls = []
  const mounted = mount(getMarkup({
    headerRenderer: (params) => 'custom header',
    sort: (sortKey, sortDirection) => sortCalls.push([sortKey, sortDirection]),
    sortBy: 'name',
    sortDirection: SortDirection.ASC
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  nameColumn.simulate('click')

  assert.equal(sortCalls.length, 1)
  const sortCall = sortCalls[0]
  assert.equal(sortCall[0], 'name')
  assert.equal(sortCall[1], SortDirection.DESC)
  assert.end()
})

test('FlexTable should honor :onHeaderClick for custom header', (assert) => {
  const columnData = { foo: 'foo', bar: 'bar' }
  const onHeaderClickCalls = []
  const mounted = mount(getMarkup({
    columnData,
    headerRenderer: (params) => 'custom header',
    onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push([dataKey, columnData])
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  nameColumn.simulate('click')

  assert.equal(onHeaderClickCalls.length, 1)
  const onHeaderClickCall = onHeaderClickCalls[0]
  assert.equal(onHeaderClickCall[0], 'name')
  assert.equal(onHeaderClickCall[1], columnData)
  assert.end()
})

test('FlexTable should call :noRowsRenderer if :rowsCount is 0', (assert) => {
  const mounted = mount(getMarkup({
    noRowsRenderer: () => <div>No rows!</div>,
    rowsCount: 0
  }))
  assert.equal(mounted.find('.FlexTable__Grid').at(0).text(), 'No rows!')
  assert.end()
})

test('FlexTable should render an empty body if :rowsCount is 0 and there is no :noRowsRenderer', (assert) => {
  const mounted = mount(getMarkup({
    rowsCount: 0
  }))
  assert.equal(mounted.find('.FlexTable__Grid').at(0).text(), '')
  assert.end()
})

test('FlexTable should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', (assert) => {
  let onHeaderClickCalls = []
  const mounted = mount(getMarkup({
    disableSort: true,
    onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push({dataKey, columnData})
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  nameColumn.simulate('click')
  assert.equal(onHeaderClickCalls.length, 1)
  assert.equal(onHeaderClickCalls[0].dataKey, 'name')
  assert.equal(onHeaderClickCalls[0].columnData.data, 123)
  assert.end()
})

test('FlexTable should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', (assert) => {
  let onHeaderClickCalls = []
  const mounted = mount(getMarkup({
    disableSort: false,
    onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push({dataKey, columnData})
  }))
  const nameColumn = getHeaderColumn(mounted, 0)
  nameColumn.simulate('click')
  assert.equal(onHeaderClickCalls.length, 1)
  assert.equal(onHeaderClickCalls[0].dataKey, 'name')
  assert.equal(onHeaderClickCalls[0].columnData.data, 123)
  assert.end()
})

test('FlexTable should call :onRowClick with the correct :rowIndex when a row is clicked', (assert) => {
  const onRowClickCalls = []
  const mounted = mount(getMarkup({
    onRowClick: index => onRowClickCalls.push(index)
  }))
  const rows = mounted.find('.FlexTable__row')
  rows.at(0).simulate('click')
  rows.at(3).simulate('click')
  assert.deepEqual(onRowClickCalls, [0, 3])
  assert.end()
})

test('FlexTable should render a static classname given :rowClassName as a string', (assert) => {
  const staticClassName = 'staticClass'
  const mounted = mount(getMarkup({
    rowClassName: staticClassName
  }))
  const rows = mounted.find('.FlexTable__row')
  for (let index = 0; index < rows.length; index++) {
    let row = rows.at(index)
    assert.ok(row.hasClass(staticClassName))
  }
  assert.end()
})

test('FlexTable should render dynamic classname given :rowClassName as a function', (assert) => {
  const mounted = mount(getMarkup({
    rowClassName: rowIndex => rowIndex % 2 === 0 ? 'even' : 'odd'
  }))
  const rows = mounted.find('.FlexTable__row')
  for (let index = 0; index < rows.length; index++) {
    let row = rows.at(index)
    if (index % 2 === 0) {
      assert.ok(row.hasClass('even'))
      assert.ok(!row.hasClass('odd'))
    } else {
      assert.ok(row.hasClass('odd'))
      assert.ok(!row.hasClass('even'))
    }
  }
  assert.end()
})

test('FlexTable should call :onRowsRendered at least one row is rendered', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  assert.end()
})

test('FlexTable should not call :onRowsRendered unless the start or stop indices have changed', (assert) => {
  let numCalls = 0
  let startIndex
  let stopIndex
  const onRowsRendered = params => {
    startIndex = params.startIndex
    stopIndex = params.stopIndex
    numCalls++
  }
  const mounted = mount(getMarkup({ onRowsRendered }))
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  mounted.setProps({ onRowsRendered })
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  assert.end()
})

test('FlexTable should call :onRowsRendered if the start or stop indices have changed', (assert) => {
  let numCalls = 0
  let startIndex
  let stopIndex
  const onRowsRendered = params => {
    startIndex = params.startIndex
    stopIndex = params.stopIndex
    numCalls++
  }
  const mounted = mount(getMarkup({ onRowsRendered }))
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  mounted.setProps({
    height: 50,
    onRowsRendered
  })
  assert.equal(numCalls, 2)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 2)
  assert.end()
})

test('FlexTable should not call :onRowsRendered if no rows are rendered', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    height: 0,
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, undefined)
  assert.equal(stopIndex, undefined)
  assert.end()
})

test('FlexTable should render correctly when an initial :scrollTop property is specified', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params),
    scrollTop: 80
  }))
  assert.equal(startIndex, 8)
  assert.equal(stopIndex, 15)
  assert.end()
})

test('FlexTable should render correctly when :scrollTop property is updated', (assert) => {
  let startIndex, stopIndex

  const mounted = mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)

  mounted.setProps({
    onRowsRendered: params => ({ startIndex, stopIndex } = params),
    scrollTop: 80
  })
  assert.equal(startIndex, 8)
  assert.equal(stopIndex, 15)
  assert.end()
})

// Enzyme does not reliably match class names on root element
// See https://github.com/airbnb/enzyme/issues/134
function safeHasClass (mounted, className) {
  const regExp = new RegExp(`class="[^"]*${className}[^"]*"`)
  return !!mounted.html().match(regExp)
}

test('FlexTable should use the expected global CSS classNames', (assert) => {
  const node = mount(getMarkup({
    sort: () => {},
    sortBy: 'name',
    sortDirection: SortDirection.ASC
  }))
  assert.ok(safeHasClass(node, 'FlexTable'), 'element uses default class "FlexTable"')
  assert.ok(node.find('.FlexTable__headerRow').length)
  assert.ok(node.find('.FlexTable__rowColumn').length)
  assert.ok(node.find('.FlexTable__truncatedColumnText').length)
  assert.ok(node.find('.FlexTable__headerColumn').length)
  assert.ok(node.find('.FlexTable__headerTruncatedText').length)
  assert.ok(node.find('.FlexTable__row').length)
  assert.ok(node.find('.FlexTable__sortableHeaderColumn').length)
  assert.ok(node.find('.FlexTable__sortableHeaderIcon').length)
  assert.end()
})

test('FlexTable should use a custom :className if specified', (assert) => {
  const node = mount(getMarkup({
    className: 'foo',
    headerClassName: 'bar',
    rowClassName: 'baz'
  }))
  assert.ok(safeHasClass(node, 'foo'), 'element uses class "foo"')
  assert.equal(node.find('.bar').length, 2)
  assert.equal(node.find('.baz').length, 9)
  assert.end()
})

test('FlexTable should not overscan by default', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params)
  }))
  assert.equal(overscanStartIndex, startIndex)
  assert.equal(overscanStopIndex, stopIndex)
  assert.end()
})

test('FlexTable should overscan the specified amount', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10,
    scrollToIndex: 30
  }))
  assert.equal(overscanStartIndex, 13)
  assert.equal(startIndex, 23)
  assert.equal(stopIndex, 30)
  assert.equal(overscanStopIndex, 40)
  assert.end()
})

test('FlexTable should not overscan beyond the start of the list', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10
  }))
  assert.equal(overscanStartIndex, 0)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  assert.equal(overscanStopIndex, 17)
  assert.end()
})

test('FlexTable should not overscan beyond the end of the list', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10,
    rowsCount: 15
  }))
  assert.equal(overscanStartIndex, 0)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 7)
  assert.equal(overscanStopIndex, 14)
  assert.end()
})

test('FlexTable should trigger callback when component initially mounts', (assert) => {
  const onScrollCalls = []
  mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  assert.deepEqual(onScrollCalls, [{
    clientHeight: 80,
    scrollHeight: 1000,
    scrollTop: 0
  }])
  assert.end()
})

/* TODO This test causes Tape to hang
test('FlexTable should trigger callback when component scrolls', (assert) => {
  const onScrollCalls = []
  mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  list.simulate('scroll', { target: { scrollTop: 100 } })
  assert.equal(onScrollCalls.length, 2)
  assert.deepEqual(onScrollCalls[1], {
    clientHeight: 80,
    scrollHeight: 1000,
    scrollTop: 100
  })
  assert.end()
})
*/

// TODO Add tests for :scrollToRow and :setScrollTop.
// This probably requires the creation of an inner test-only class with refs.
