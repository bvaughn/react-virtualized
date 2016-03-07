import InfiniteLoader, { isRangeVisible, scanForUnloadedRanges } from './InfiniteLoader'
import React from 'react'
import VirtualScroll from '../VirtualScroll'
import test from 'tape'
import { mount } from 'enzyme'

function createIsRowLoaded (rows) {
  return index => rows[index]
}

function getMarkup ({
  height = 100,
  rowHeight = 20,
  rowsCount = 100,
  threshold = 10,
  width = 200
} = {}) {
  let isRowLoadedCalls = []
  let isRowLoadedMap = {}
  let loadMoreRowsCalls = []

  function isRowLoaded (index) {
    isRowLoadedCalls.push(index)
    return !!isRowLoadedMap[index]
  }

  function loadMoreRows ({ startIndex, stopIndex }) {
    loadMoreRowsCalls.push({ startIndex, stopIndex })
  }

  const mounted = mount(
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowsCount={rowsCount}
      threshold={threshold}
    >
      {({ onRowsRendered, registerChild }) => (
        <VirtualScroll
          ref={registerChild}
          height={height}
          onRowsRendered={onRowsRendered}
          rowHeight={rowHeight}
          rowRenderer={index => <div key={index}/>}
          rowsCount={rowsCount}
          width={width}
        />
      )}
    </InfiniteLoader>
  )

  return {
    isRowLoadedCalls,
    isRowLoadedMap,
    loadMoreRowsCalls,
    mounted
  }
}

test('InfiniteLoader should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', (assert) => {
  const { isRowLoadedCalls } = getMarkup()
  assert.deepEqual(isRowLoadedCalls, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  assert.end()
})

test('InfiniteLoader should call :loadMoreRows for unloaded rows within the threshold', (assert) => {
  const { loadMoreRowsCalls } = getMarkup()
  assert.deepEqual(loadMoreRowsCalls, [{ startIndex: 0, stopIndex: 14 }])
  assert.end()
})

test('InfiniteLoader scanForUnloadedRanges() should return an empty array for a range of rows that have all been loaded', (assert) => {
  assert.deepEqual(scanForUnloadedRanges({
    isRowLoaded: createIsRowLoaded([true, true, true]),
    startIndex: 0,
    stopIndex: 2
  }), [])
  assert.end()
})

test('InfiniteLoader scanForUnloadedRanges() return a range of only 1 unloaded row', (assert) => {
  assert.deepEqual(scanForUnloadedRanges({
    isRowLoaded: createIsRowLoaded([true, false, true]),
    startIndex: 0,
    stopIndex: 2
  }), [
    { startIndex: 1, stopIndex: 1 }
  ])
  assert.end()
})

test('InfiniteLoader scanForUnloadedRanges() return a range of multiple unloaded rows', (assert) => {
  assert.deepEqual(scanForUnloadedRanges({
    isRowLoaded: createIsRowLoaded([false, false, true]),
    startIndex: 0,
    stopIndex: 2
  }), [
    { startIndex: 0, stopIndex: 1 }
  ])
  assert.end()
})

test('InfiniteLoader scanForUnloadedRanges() return multiple ranges of unloaded rows', (assert) => {
  assert.deepEqual(scanForUnloadedRanges({
    isRowLoaded: createIsRowLoaded([true, false, false, true, false, true, false]),
    startIndex: 0,
    stopIndex: 6
  }), [
    { startIndex: 1, stopIndex: 2 },
    { startIndex: 4, stopIndex: 4 },
    { startIndex: 6, stopIndex: 6 }
  ])
  assert.end()
})

test('InfiniteLoader isRangeVisible() first row(s) are visible', (assert) => {
  assert.equal(isRangeVisible({
    lastRenderedStartIndex: 10,
    lastRenderedStopIndex: 20,
    startIndex: 20,
    stopIndex: 30
  }), true)
  assert.end()
})

test('InfiniteLoader isRangeVisible() last row(s) are visible', (assert) => {
  assert.equal(isRangeVisible({
    lastRenderedStartIndex: 10,
    lastRenderedStopIndex: 20,
    startIndex: 0,
    stopIndex: 10
  }), true)
  assert.end()
})

test('InfiniteLoader isRangeVisible() all row(s) are visible', (assert) => {
  assert.equal(isRangeVisible({
    lastRenderedStartIndex: 10,
    lastRenderedStopIndex: 20,
    startIndex: 12,
    stopIndex: 14
  }), true)
  assert.end()
})

test('InfiniteLoader isRangeVisible() no row(s) are visible', (assert) => {
  assert.equal(isRangeVisible({
    lastRenderedStartIndex: 10,
    lastRenderedStopIndex: 20,
    startIndex: 0,
    stopIndex: 9
  }), false)

  assert.equal(isRangeVisible({
    lastRenderedStartIndex: 10,
    lastRenderedStopIndex: 20,
    startIndex: 21,
    stopIndex: 30
  }), false)
  assert.end()
})
