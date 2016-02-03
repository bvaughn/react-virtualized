import InfiniteLoader, { isRangeVisible, scanForUnloadedRanges } from './InfiniteLoader'
import React from 'react'
import VirtualScroll from '../VirtualScroll'
import { findDOMNode, render } from 'react-dom'

describe('InfiniteLoader', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  // Used by the renderOrUpdateComponent() helper method
  var node = null
  beforeEach(() => {
    node = document.createElement('div')
  })

  let isRowLoadedCalls = []
  let isRowLoadedMap = {}
  let loadMoreRowsCalls = []

  beforeEach(() => {
    isRowLoadedCalls = []
    isRowLoadedMap = {}
    loadMoreRowsCalls = []
  })

  function isRowLoaded (index) {
    isRowLoadedCalls.push(index)
    return !!isRowLoadedMap[index]
  }

  function loadMoreRows ({ startIndex, stopIndex }) {
    loadMoreRowsCalls.push({ startIndex, stopIndex })
  }

  function getMarkup ({
    height = 100,
    onRowsRendered = undefined,
    rowHeight = 20,
    rowsCount = 100,
    threshold = 10,
    width = 200
  } = {}) {
    return (
      <InfiniteLoader
        height={height}
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowsCount={rowsCount}
        threshold={threshold}
        width={width}
      >
        <VirtualScroll
          height={0}
          onRowsRendered={onRowsRendered}
          rowHeight={rowHeight}
          rowRenderer={index => <div key={index}/>}
          rowsCount={rowsCount}
          width={0}
        />
      </InfiniteLoader>
    )
  }

  function renderOrUpdateComponent (props) {
    const component = findDOMNode(render(getMarkup(props), node))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return component
  }

  it('should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', () => {
    renderOrUpdateComponent()
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  })

  it('should call :loadMoreRows for unloaded rows within the threshold', () => {
    renderOrUpdateComponent()
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }])
  })

  it('should not override the specified :onRowsRendered', () => {
    const onRowsRenderedCalls = []
    renderOrUpdateComponent({
      onRowsRendered: params => onRowsRenderedCalls.push(params)
    })
    expect(onRowsRenderedCalls.length).toEqual(1)
  })
})

describe('scanForUnloadedRanges', () => {
  function createIsRowLoaded (rows) {
    return index => rows[index]
  }

  it('should return an empty array for a range of rows that have all been loaded', () => {
    expect(scanForUnloadedRanges({
      isRowLoaded: createIsRowLoaded([true, true, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([])
  })

  it('return a range of only 1 unloaded row', () => {
    expect(scanForUnloadedRanges({
      isRowLoaded: createIsRowLoaded([true, false, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([
      { startIndex: 1, stopIndex: 1 }
    ])
  })

  it('return a range of multiple unloaded rows', () => {
    expect(scanForUnloadedRanges({
      isRowLoaded: createIsRowLoaded([false, false, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([
      { startIndex: 0, stopIndex: 1 }
    ])
  })

  it('return multiple ranges of unloaded rows', () => {
    expect(scanForUnloadedRanges({
      isRowLoaded: createIsRowLoaded([true, false, false, true, false, true, false]),
      startIndex: 0,
      stopIndex: 6
    })).toEqual([
      { startIndex: 1, stopIndex: 2 },
      { startIndex: 4, stopIndex: 4 },
      { startIndex: 6, stopIndex: 6 }
    ])
  })
})

describe('isRangeVisible', () => {
  it('first row(s) are visible', () => {
    expect(isRangeVisible({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 20,
      stopIndex: 30
    })).toEqual(true)
  })

  it('last row(s) are visible', () => {
    expect(isRangeVisible({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 0,
      stopIndex: 10
    })).toEqual(true)
  })

  it('all row(s) are visible', () => {
    expect(isRangeVisible({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 12,
      stopIndex: 14
    })).toEqual(true)
  })

  it('no row(s) are visible', () => {
    expect(isRangeVisible({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 0,
      stopIndex: 9
    })).toEqual(false)

    expect(isRangeVisible({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 21,
      stopIndex: 30
    })).toEqual(false)
  })
})
