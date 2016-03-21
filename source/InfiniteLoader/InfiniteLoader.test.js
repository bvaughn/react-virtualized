import InfiniteLoader, { isRangeVisible, scanForUnloadedRanges } from './InfiniteLoader'
import React from 'react'
import VirtualScroll from '../VirtualScroll'
import { render } from '../TestUtils'

describe('InfiniteLoader', () => {
  let innerOnRowsRendered
  let isRowLoadedCalls = []
  let isRowLoadedMap = {}
  let loadMoreRowsCalls = []
  let rowRendererCalls = []

  beforeEach(() => {
    isRowLoadedCalls = []
    isRowLoadedMap = {}
    loadMoreRowsCalls = []
    rowRendererCalls = []
  })

  function isRowLoaded (index) {
    isRowLoadedCalls.push(index)
    return !!isRowLoadedMap[index]
  }

  function defaultLoadMoreRows ({ startIndex, stopIndex }) {
    loadMoreRowsCalls.push({ startIndex, stopIndex })
  }

  function rowRenderer (index) {
    rowRendererCalls.push(index)
    return (
      <div key={index}/>
    )
  }

  function getMarkup ({
    height = 100,
    loadMoreRows = defaultLoadMoreRows,
    rowHeight = 20,
    rowsCount = 100,
    threshold = 10,
    width = 200
  } = {}) {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowsCount={rowsCount}
        threshold={threshold}
      >
        {({ onRowsRendered, registerChild }) => {
          innerOnRowsRendered = onRowsRendered

          return (
            <VirtualScroll
              ref={registerChild}
              height={height}
              onRowsRendered={onRowsRendered}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              rowsCount={rowsCount}
              width={width}
            />
          )
        }}
      </InfiniteLoader>
    )
  }

  it('should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', () => {
    render(getMarkup())
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  })

  it('should call :loadMoreRows for unloaded rows within the threshold', () => {
    render(getMarkup())
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }])
  })

  it('should :forceUpdate once rows have loaded if :loadMoreRows returns a Promise', async (done) => {
    let resolve
    function loadMoreRows () {
      return new Promise((innerResolve) => resolve = innerResolve)
    }
    render(getMarkup({ loadMoreRows }))
    rowRendererCalls.splice(0)
    await resolve()
    expect(rowRendererCalls.length > 0).toEqual(true)
    done()
  })

  it('should not :forceUpdate once rows have loaded rows are no longer visible', async (done) => {
    let resolves = []
    function loadMoreRows () {
      return new Promise((innerResolve) => resolves.push(innerResolve))
    }
    render(getMarkup({ loadMoreRows }))
    // Simulate a new range of rows being loaded
    innerOnRowsRendered({ startIndex: 100, stopIndex: 101 })
    rowRendererCalls.splice(0)
    await resolves[0]() // Resolve the first request only, not the simulated row-change
    expect(rowRendererCalls.length).toEqual(0)
    done()
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
