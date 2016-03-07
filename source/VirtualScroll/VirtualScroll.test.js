import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Immutable from 'immutable'
import VirtualScroll from './VirtualScroll'

const array = []
for (var i = 0; i < 100; i++) {
  array.push(`Name ${i}`)
}
const list = Immutable.fromJS(array)

function getMarkup ({
  className,
  height = 100,
  noRowsRenderer = undefined,
  onRowsRendered = undefined,
  onScroll = undefined,
  overscanRowsCount = 0,
  rowHeight = 10,
  rowsCount = list.size,
  scrollToIndex = undefined,
  scrollTop = undefined,
  width = 100
} = {}) {
  function rowRenderer (index) {
    return (
      <div
        key={index}
        className='listItem'
      >
        {list.get(index)}
      </div>
    )
  }

  return (
    <VirtualScroll
      className={className}
      height={height}
      noRowsRenderer={noRowsRenderer}
      onRowsRendered={onRowsRendered}
      onScroll={onScroll}
      overscanRowsCount={overscanRowsCount}
      rowHeight={rowHeight}
      rowRenderer={rowRenderer}
      rowsCount={rowsCount}
      scrollToIndex={scrollToIndex}
      scrollTop={scrollTop}
      width={width}
    />
  )
}

test('VirtualScroll should render enough children to fill the view', (assert) => {
  const list = mount(getMarkup())
  assert.equal(list.find('.listItem').length, 10)
  assert.end()
})

test('VirtualScroll should not render more children than available if the list is not filled', (assert) => {
  const list = mount(getMarkup({ rowsCount: 5 }))
  assert.equal(list.find('.listItem').length, 5)
  assert.end()
})

test('VirtualScroll should scroll to the top', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 0 }))
  assert.ok(list.text().includes('Name 0'))
  assert.end()
})

test('VirtualScroll should scroll down to the middle', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 49 }))
  // 100 items * 10 item height = 1,000 total item height
  // 10 items can be visible at a time and :scrollTop is initially 0,
  // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
  assert.ok(list.text().includes('Name 49'))
  assert.end()
})

test('VirtualScroll should scroll to the bottom', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 99 }))
  // 100 height - 10 header = 90 available scroll space.
  // 100 items * 10 item height = 1,000 total item height
  // Target height for the last item then is 1000 - 90
  assert.ok(list.text().includes('Name 99'))
  assert.end()
})

test('VirtualScroll should update :scrollToIndex position when :rowHeight changes', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 50 }))
  assert.ok(list.text().includes('Name 50'))
  // Making rows taller pushes name off/beyond the scrolled area
  list.setProps({ scrollToIndex: 50, rowHeight: 20 })
  assert.ok(list.text().includes('Name 50'))
  assert.end()
})

test('VirtualScroll should update :scrollToIndex position when :height changes', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 50 }))
  assert.ok(list.text().includes('Name 50'))
  // Making the list shorter leaves only room for 1 item
  list.setProps({ scrollToIndex: 50, height: 20 })
  assert.ok(list.text().includes('Name 50'))
  assert.end()
})

test('VirtualScroll should update :scrollToIndex position when :scrollToIndex changes', (assert) => {
  const list = mount(getMarkup())
  assert.ok(!list.text().includes('Name 50'))
  list.setProps({ scrollToIndex: 50 })
  assert.ok(list.text().includes('Name 50'))
  assert.end()
})

test('VirtualScroll should update scroll position if size shrinks smaller than the current scroll', (assert) => {
  const list = mount(getMarkup({ scrollToIndex: 500 }))
  list.setProps()
  list.setProps({ scrollToIndex: 500, rowsCount: 10 })
  assert.ok(list.text().includes('Name 9'))
  assert.end()
})

test('VirtualScroll should call :noRowsRenderer if :rowsCount is 0', (assert) => {
  let list = mount(getMarkup({
    noRowsRenderer: () => <div>No rows!</div>,
    rowsCount: 0
  }))
  assert.equal(list.text(), 'No rows!')
  assert.end()
})

test('VirtualScroll should render an empty body if :rowsCount is 0 and there is no :noRowsRenderer', (assert) => {
  let list = mount(getMarkup({
    rowsCount: 0
  }))
  assert.equal(list.text(), '')
  assert.end()
})

test('VirtualScrollshould call :onRowsRendered if at least one row is rendered', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  assert.end()
})

test('VirtualScrollshould not call :onRowsRendered unless the start or stop indices have changed', (assert) => {
  let numCalls = 0
  let startIndex
  let stopIndex
  const onRowsRendered = params => {
    startIndex = params.startIndex
    stopIndex = params.stopIndex
    numCalls++
  }
  const list = mount(getMarkup({ onRowsRendered }))
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  list.setProps({ onRowsRendered })
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  assert.end()
})

test('VirtualScrollshould call :onRowsRendered if the start or stop indices have changed', (assert) => {
  let numCalls = 0
  let startIndex
  let stopIndex
  const onRowsRendered = params => {
    startIndex = params.startIndex
    stopIndex = params.stopIndex
    numCalls++
  }
  const list = mount(getMarkup({ onRowsRendered }))
  assert.equal(numCalls, 1)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  list.setProps({
    height: 50,
    onRowsRendered
  })
  assert.equal(numCalls, 2)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 4)
  assert.end()
})

test('VirtualScrollshould not call :onRowsRendered if no rows are rendered', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    height: 0,
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, undefined)
  assert.equal(stopIndex, undefined)
  assert.end()
})

test('VirtualScrollshould should render correctly when an initial :scrollTop property is specified', (assert) => {
  let startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params),
    scrollTop: 100
  }))
  assert.equal(startIndex, 10)
  assert.equal(stopIndex, 19)
  assert.end()
})

test('VirtualScrollshould should render correctly when :scrollTop property is updated', (assert) => {
  let startIndex, stopIndex

  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params)
  }))
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)

  mount(getMarkup({
    onRowsRendered: params => ({ startIndex, stopIndex } = params),
    scrollTop: 100
  }))
  assert.equal(startIndex, 10)
  assert.equal(stopIndex, 19)
  assert.end()
})

// Enzyme does not reliably match class names on root element
// See https://github.com/airbnb/enzyme/issues/134
function safeHasClass (mounted, className) {
  const regExp = new RegExp(`class="[^"]*${className}[^"]*"`)
  return !!mounted.html().match(regExp)
}

test('VirtualScrollshould should use the expected global CSS classNames', (assert) => {
  const list = mount(getMarkup())
  assert.ok(safeHasClass(list, 'VirtualScroll'))
  assert.end()
})

test('VirtualScrollshould should use a custom :className if specified', (assert) => {
  const list = mount(getMarkup({ className: 'foo' }))
  assert.ok(safeHasClass(list, 'foo'))
  assert.end()
})

test('should not overscan by default', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params)
  }))
  assert.equal(overscanStartIndex, startIndex)
  assert.equal(overscanStopIndex, stopIndex)
  assert.end()
})

test('should overscan the specified amount', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10,
    scrollToIndex: 30
  }))
  assert.equal(overscanStartIndex, 11)
  assert.equal(startIndex, 21)
  assert.equal(stopIndex, 30)
  assert.equal(overscanStopIndex, 40)
  assert.end()
})

test('should not overscan beyond the start of the list', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10
  }))
  assert.equal(overscanStartIndex, 0)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  assert.equal(overscanStopIndex, 19)
  assert.end()
})

test('should not overscan beyond the end of the list', (assert) => {
  let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
  mount(getMarkup({
    onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
    overscanRowsCount: 10,
    rowsCount: 15
  }))
  assert.equal(overscanStartIndex, 0)
  assert.equal(startIndex, 0)
  assert.equal(stopIndex, 9)
  assert.equal(overscanStopIndex, 14)
  assert.end()
})

test('should trigger callback when component initially mounts', (assert) => {
  const onScrollCalls = []
  mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  assert.equal(onScrollCalls.length, 1)
  assert.deepEqual(onScrollCalls[0], {
    clientHeight: 100,
    scrollHeight: 1000,
    scrollTop: 0
  })
  assert.end()
})

/* TODO This test causes Tape to hang
test('should trigger callback when component scrolls', (assert) => {
  const onScrollCalls = []
  const list = mount(getMarkup({
    onScroll: params => onScrollCalls.push(params)
  }))
  list.simulate('scroll', { target: { scrollTop: 100 } })
  assert.equal(onScrollCalls.length, 2)
  assert.deepEqual(onScrollCalls[1], {
    clientHeight: 100,
    scrollHeight: 1000,
    scrollTop: 100
  })
  assert.end()
})
*/

// TODO Add tests for :scrollToRow and :setScrollTop.
// This probably requires the creation of an inner test-only class with refs.
