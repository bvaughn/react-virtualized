import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import { findDOMNode } from 'react-dom'
import Grid from './Grid'

const NUM_ROWS = 100
const NUM_COLUMNS = 50

function getMarkup ({
  className,
  columnsCount = NUM_COLUMNS,
  columnWidth = 50,
  height = 100,
  noContentRenderer,
  onSectionRendered,
  onScroll,
  overscanColumnsCount = 0,
  overscanRowsCount = 0,
  rowHeight = 20,
  rowsCount = NUM_ROWS,
  scrollLeft = undefined,
  scrollToColumn,
  scrollToRow,
  scrollTop = undefined,
  width = 200
} = {}) {
  function renderCell ({ columnIndex, rowIndex }) {
    return (
      <div className='gridItem'>
        {`row:${rowIndex}, column:${columnIndex}`}
      </div>
    )
  }

  return (
    <Grid
      className={className}
      columnsCount={columnsCount}
      columnWidth={columnWidth}
      height={height}
      noContentRenderer={noContentRenderer}
      onSectionRendered={onSectionRendered}
      onScroll={onScroll}
      overscanColumnsCount={overscanColumnsCount}
      overscanRowsCount={overscanRowsCount}
      renderCell={renderCell}
      rowHeight={rowHeight}
      rowsCount={rowsCount}
      scrollLeft={scrollLeft}
      scrollToColumn={scrollToColumn}
      scrollToRow={scrollToRow}
      scrollTop={scrollTop}
      width={width}
    />
  )
}

test('Grid should render enough children to fill the available area', (assert) => {
  const node = mount(getMarkup())
  assert.equal(node.find('.gridItem').length, 20) // 5 rows x 4 columns
  assert.end()
})

test('Grid should not render more rows than available if the area is not filled', (assert) => {
  const node = mount(getMarkup({ rowsCount: 2 }))
  assert.equal(node.find('.gridItem').length, 8) // 2 rows x 4 columns
  assert.end()
})

test('Grid should not render more columns than available if the area is not filled', (assert) => {
  const node = mount(getMarkup({ columnsCount: 2 }))
  assert.equal(node.find('.gridItem').length, 10) // 5 rows x 2 columns
  assert.end()
})

test('Grid should set overflowX:hidden on scroll-container if columns fit within the available width', (assert) => {
  const node = mount(getMarkup({ columnsCount: 4 }))
  const element = node.single((n) => findDOMNode(n))
  assert.equal(element.style.overflowX, 'hidden')
  assert.end()
})

test('Grid should leave overflowX:auto on scroll-container if columns require more than the available width', (assert) => {
  const node = mount(getMarkup({ columnsCount: 25 }))
  const element = node.single((n) => findDOMNode(n))
  assert.notEqual(element.style.overflowX, 'hidden')
  assert.end()
})

test('Grid should set overflowY:hidden on scroll-container if rows fit within the available height', (assert) => {
  const node = mount(getMarkup({ rowsCount: 5 }))
  const element = node.single((n) => findDOMNode(n))
  assert.equal(element.style.overflowY, 'hidden')
  assert.end()
})

test('Grid should leave overflowY:auto on scroll-container if rows require more than the available height', (assert) => {
  const node = mount(getMarkup({ rowsCount: 25 }))
  const element = node.single((n) => findDOMNode(n))
  assert.notEqual(element.style.overflowY, 'hidden')
  assert.end()
})

/** Tests scrolling via initial props */
test('Grid should scroll to the left', (assert) => {
  const grid = mount(getMarkup({ scrollToColumn: 0 }))
  assert.equal(grid.instance().state.scrollLeft, 0)
  assert.end()
})

test('Grid should scroll over to the middle', (assert) => {
  const grid = mount(getMarkup({ scrollToColumn: 24 }))
  // 100 columns * 50 item width = 5,000 total item width
  // 4 columns can be visible at a time and :scrollLeft is initially 0,
  // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
  assert.equal(grid.instance().state.scrollLeft, 1050)
  assert.end()
})

test('Grid should scroll to the far right', (assert) => {
  const grid = mount(getMarkup({ scrollToColumn: 49 }))
  // 100 columns * 50 item width = 5,000 total item width
  // Target offset for the last item then is 5,000 - 200
  assert.equal(grid.instance().state.scrollLeft, 2300)
  assert.end()
})

test('Grid should scroll to the top', (assert) => {
  const grid = mount(getMarkup({ scrollToRow: 0 }))
  assert.equal(grid.instance().state.scrollTop, 0)
  assert.end()
})

test('Grid should scroll down to the middle', (assert) => {
  const grid = mount(getMarkup({ scrollToRow: 49 }))
  // 100 rows * 20 item height = 2,000 total item height
  // 5 rows can be visible at a time and :scrollTop is initially 0,
  // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
  assert.equal(grid.instance().state.scrollTop, 900)
  assert.end()
})

test('Grid should scroll to the bottom', (assert) => {
  const grid = mount(getMarkup({ scrollToRow: 99 }))
  // 100 rows * 20 item height = 2,000 total item height
  // Target offset for the last item then is 2,000 - 100
  assert.equal(grid.instance().state.scrollTop, 1900)
  assert.end()
})

test('Grid should update :scrollToColumn position when :columnWidth changes', (assert) => {
  let grid = mount(getMarkup({ scrollToColumn: 25 }))
  assert.ok(grid.text().includes('column:25'))
  // Making columns taller pushes name off/beyond the scrolled area
  grid.setProps({ scrollToColumn: 25, columnWidth: 20 })
  assert.ok(grid.text().includes('column:25'))
  assert.end()
})

test('Grid should update :scrollToRow position when :rowHeight changes', (assert) => {
  let grid = mount(getMarkup({ scrollToRow: 50 }))
  assert.ok(grid.text().includes('row:50'))
  // Making rows taller pushes name off/beyond the scrolled area
  grid.setProps({ scrollToRow: 50, rowHeight: 20 })
  assert.ok(grid.text().includes('row:50'))
  assert.end()
})

test('Grid should update :scrollToColumn position when :height changes', (assert) => {
  let grid = mount(getMarkup({ scrollToColumn: 25 }))
  assert.ok(grid.text().includes('column:25'))
  // Making the grid narrower leaves only room for 1 item
  grid.setProps({ scrollToColumn: 25, width: 50 })
  assert.ok(grid.text().includes('column:25'))
  assert.end()
})

test('Grid should update :scrollToRow position when :height changes', (assert) => {
  let grid = mount(getMarkup({ scrollToRow: 50 }))
  assert.ok(grid.text().includes('row:50'))
  // Making the grid shorter leaves only room for 1 item
  grid.setProps({ scrollToRow: 50, height: 20 })
  assert.ok(grid.text().includes('row:50'))
  assert.end()
})

test('Grid should update :scrollToColumn position when :scrollToColumn changes', (assert) => {
  let grid = mount(getMarkup())
  assert.ok(!grid.text().includes('column:25'))
  grid.setProps({ scrollToColumn: 25 })
  assert.ok(grid.text().includes('column:25'))
  assert.end()
})

test('Grid should update :scrollToRow position when :scrollToRow changes', (assert) => {
  let grid = mount(getMarkup())
  assert.ok(!grid.text().includes('row:50'))
  grid.setProps({ scrollToRow: 50 })
  assert.ok(grid.text().includes('row:50'))
  assert.end()
})

test('Grid should update scroll position if size shrinks smaller than the current scroll', (assert) => {
  let grid = mount(getMarkup({ scrollToColumn: 250 }))
  grid.setProps()
  grid.setProps({ scrollToColumn: 250, columnsCount: 10 })
  assert.ok(grid.text().includes('column:9'))
  assert.end()
})

test('Grid should update scroll position if size shrinks smaller than the current scroll', (assert) => {
  let grid = mount(getMarkup({ scrollToRow: 500 }))
  grid.setProps()
  grid.setProps({ scrollToRow: 500, rowsCount: 10 })
  assert.ok(grid.text().includes('row:9'))
  assert.end()
})

test('Grid should call :noContentRenderer if :columnsCount is 0', (assert) => {
  let list = mount(getMarkup({
    noContentRenderer: () => <div>No data</div>,
    columnsCount: 0
  }))
  assert.equal(list.text(), 'No data')
  assert.end()
})

test('Grid should call :noContentRenderer if :rowsCount is 0', (assert) => {
  let list = mount(getMarkup({
    noContentRenderer: () => <div>No data</div>,
    rowsCount: 0
  }))
  assert.equal(list.text(), 'No data')
  assert.end()
})

test('Grid should render an empty body if :columnsCount is 0 and there is no :noContentRenderer', (assert) => {
  let list = mount(getMarkup({
    columnsCount: 0
  }))
  assert.equal(list.text(), '')
  assert.end()
})

test('Grid should render an empty body if :rowsCount is 0 and there is no :noContentRenderer', (assert) => {
  let list = mount(getMarkup({
    rowsCount: 0
  }))
  assert.equal(list.text(), '')
  assert.end()
})

test('Grid should call :onSectionRendered if at least one cell is rendered', (assert) => {
  let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
  mount(getMarkup({
    onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params)
  }))
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 4)
  assert.end()
})

test('Grid should not call :onSectionRendered unless the column or row start or stop indices have changed', (assert) => {
  let numCalls = 0
  let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
  const onSectionRendered = params => {
    columnStartIndex = params.columnStartIndex
    columnStopIndex = params.columnStopIndex
    rowStartIndex = params.rowStartIndex
    rowStopIndex = params.rowStopIndex
    numCalls++
  }
  const mounted = mount(getMarkup({ onSectionRendered }))
  assert.equal(numCalls, 1)
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 4)
  mounted.setProps({ onSectionRendered })
  assert.equal(numCalls, 1)
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 4)
  assert.end()
})

test('Grid should call :onSectionRendered if the row or column start or stop indices have changed', (assert) => {
  let numCalls = 0
  let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
  const onSectionRendered = params => {
    columnStartIndex = params.columnStartIndex
    columnStopIndex = params.columnStopIndex
    rowStartIndex = params.rowStartIndex
    rowStopIndex = params.rowStopIndex
    numCalls++
  }
  mount(getMarkup({ onSectionRendered }))
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 4)
  mount(getMarkup({
    height: 50,
    onSectionRendered
  }))
  assert.equal(numCalls, 2)
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 2)
  mount(getMarkup({
    height: 50,
    onSectionRendered,
    width: 100
  }))
  assert.equal(numCalls, 3)
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 1)
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 2)
  assert.end()
})

test('Grid should not call :onSectionRendered if no cells are rendered', (assert) => {
  let numCalls = 0
  mount(getMarkup({
    height: 0,
    onSectionRendered: params => numCalls++
  }))
  assert.equal(numCalls, 0)
  assert.end()
})

test('Grid should render correctly when an initial :scrollLeft and :scrollTop properties are specified', (assert) => {
  let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
  mount(getMarkup({
    onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params),
    scrollLeft: 250,
    scrollTop: 100
  }))
  assert.equal(rowStartIndex, 5)
  assert.equal(rowStopIndex, 9)
  assert.equal(columnStartIndex, 5)
  assert.equal(columnStopIndex, 8)
  assert.end()
})

test('Grid should render correctly when :scrollLeft and :scrollTop properties are updated', (assert) => {
  let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex

  mount(getMarkup({
    onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params)
  }))
  assert.equal(rowStartIndex, 0)
  assert.equal(rowStopIndex, 4)
  assert.equal(columnStartIndex, 0)
  assert.equal(columnStopIndex, 3)

  mount(getMarkup({
    onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params),
    scrollLeft: 250,
    scrollTop: 100
  }))
  assert.equal(rowStartIndex, 5)
  assert.equal(rowStopIndex, 9)
  assert.equal(columnStartIndex, 5)
  assert.equal(columnStopIndex, 8)
  assert.end()
})

// Enzyme does not reliably match class names on root element
// See https://github.com/airbnb/enzyme/issues/134
function safeHasClass (mounted, className) {
  const regExp = new RegExp(`class="[^"]*${className}[^"]*"`)
  return !!mounted.html().match(regExp)
}

test('Grid should use the expected global CSS classNames', (assert) => {
  const node = mount(getMarkup())
  assert.ok(safeHasClass(node, 'Grid'))
  assert.end()
})

test('Grid should use a custom :className if specified', (assert) => {
  const node = mount(getMarkup({ className: 'foo' }))
  assert.ok(safeHasClass(node, 'foo'))
  assert.end()
})

function helper ({ grid, scrollLeft, scrollTop }) {
  const target = { scrollLeft, scrollTop }
  grid.ref('scrollingContainer').simulate('scroll', { target })
}

test('Grid should trigger callback when component is mounted', (assert) => {
  const onScrollCalls = []
  mount(getMarkup({
    onScroll: params => onScrollCalls.push(params),
    scrollLeft: 50,
    scrollTop: 100
  }))
  assert.deepEqual(onScrollCalls, [{
    clientHeight: 100,
    clientWidth: 200,
    scrollHeight: 2000,
    scrollLeft: 50,
    scrollTop: 100,
    scrollWidth: 2500
  }])
  assert.end()
})

test('Grid should trigger callback when component scrolls horizontally', (assert) => {
  const onScrollCalls = []
  const grid = mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  helper({
    grid,
    scrollLeft: 100,
    scrollTop: 0
  })
  assert.equal(onScrollCalls.length, 2)
  assert.deepEqual(onScrollCalls[1], {
    clientHeight: 100,
    clientWidth: 200,
    scrollHeight: 2000,
    scrollLeft: 100,
    scrollTop: 0,
    scrollWidth: 2500
  })
  assert.end()
})

test('Grid should trigger callback when component scrolls vertically', (assert) => {
  const onScrollCalls = []
  const grid = mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  helper({
    grid,
    scrollLeft: 0,
    scrollTop: 100
  })
  assert.equal(onScrollCalls.length, 2)
  assert.deepEqual(onScrollCalls[1], {
    clientHeight: 100,
    clientWidth: 200,
    scrollHeight: 2000,
    scrollLeft: 0,
    scrollTop: 100,
    scrollWidth: 2500
  })
  assert.end()
})

function createHelper () {
  let columnOverscanStartIndex, columnOverscanStopIndex, columnStartIndex, columnStopIndex, rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex

  function onSectionRendered (params) {
    columnOverscanStartIndex = params.columnOverscanStartIndex
    columnOverscanStopIndex = params.columnOverscanStopIndex
    columnStartIndex = params.columnStartIndex
    columnStopIndex = params.columnStopIndex
    rowOverscanStartIndex = params.rowOverscanStartIndex
    rowOverscanStopIndex = params.rowOverscanStopIndex
    rowStartIndex = params.rowStartIndex
    rowStopIndex = params.rowStopIndex
  }

  return {
    columnOverscanStartIndex: () => columnOverscanStartIndex,
    columnOverscanStopIndex: () => columnOverscanStopIndex,
    columnStartIndex: () => columnStartIndex,
    columnStopIndex: () => columnStopIndex,
    onSectionRendered,
    rowOverscanStartIndex: () => rowOverscanStartIndex,
    rowOverscanStopIndex: () => rowOverscanStopIndex,
    rowStartIndex: () => rowStartIndex,
    rowStopIndex: () => rowStopIndex
  }
}

test('Grid should not overscan if disabled', (assert) => {
  const helper = createHelper()
  mount(getMarkup({
    onSectionRendered: helper.onSectionRendered
  }))
  assert.equal(helper.columnOverscanStartIndex(), helper.columnStartIndex())
  assert.equal(helper.columnOverscanStopIndex(), helper.columnStopIndex())
  assert.equal(helper.rowOverscanStartIndex(), helper.rowStartIndex())
  assert.equal(helper.rowOverscanStopIndex(), helper.rowStopIndex())
  assert.end()
})

test('Grid should overscan the specified amount', (assert) => {
  const helper = createHelper()
  mount(getMarkup({
    onSectionRendered: helper.onSectionRendered,
    overscanColumnsCount: 2,
    overscanRowsCount: 5,
    scrollToColumn: 25,
    scrollToRow: 50
  }))
  assert.equal(helper.columnOverscanStartIndex(), 20)
  assert.equal(helper.columnOverscanStopIndex(), 27)
  assert.equal(helper.columnStartIndex(), 22)
  assert.equal(helper.columnStopIndex(), 25)
  assert.equal(helper.rowOverscanStartIndex(), 41)
  assert.equal(helper.rowOverscanStopIndex(), 55)
  assert.equal(helper.rowStartIndex(), 46)
  assert.equal(helper.rowStopIndex(), 50)
  assert.end()
})

test('Grid should not overscan beyond the bounds of the grid', (assert) => {
  const helper = createHelper()
  mount(getMarkup({
    onSectionRendered: helper.onSectionRendered,
    columnsCount: 6,
    overscanColumnsCount: 10,
    overscanRowsCount: 10,
    rowsCount: 5
  }))
  assert.equal(helper.columnOverscanStartIndex(), 0)
  assert.equal(helper.columnOverscanStopIndex(), 5)
  assert.equal(helper.columnStartIndex(), 0)
  assert.equal(helper.columnStopIndex(), 3)
  assert.equal(helper.rowOverscanStartIndex(), 0)
  assert.equal(helper.rowOverscanStopIndex(), 4)
  assert.equal(helper.rowStartIndex(), 0)
  assert.equal(helper.rowStopIndex(), 4)
  assert.end()
})

// TODO Add tests for :scrollToCell and :setScrollPosition.
// This probably requires the creation of an inner test-only class with refs.
