import InfiniteLoader from './InfiniteLoader'
import React from 'react'
import VirtualScroll from '../VirtualScroll'
import { findDOMNode, render } from 'react-dom'
import { scanForUnloadedRanges } from './InfiniteLoader'

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
    rowHeight = 20,
    rowsCount = 100,
    threshold = 10
  } = {}) {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowsCount={rowsCount}
        threshold={threshold}
      >
        <VirtualScroll
          height={height}
          rowHeight={rowHeight}
          rowRenderer={index => <div key={index}/>}
          rowsCount={rowsCount}
        />
      </InfiniteLoader>
    )
  }

  function renderOrUpdateComponent (props) {
    return findDOMNode(render(getMarkup(props), node))
  }

  it('should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', () => {
    renderOrUpdateComponent()
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  })

  it('should call :loadMoreRows for unloaded rows within the threshold', () => {
    renderOrUpdateComponent()
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }])
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
