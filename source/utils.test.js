import {
  computeCellMetadataAndUpdateScrollOffsetHelper,
  createCallbackMemoizer,
  getOverscanIndices,
  getUpdatedOffsetForIndex,
  getVisibleCellIndices,
  initCellMetadata,
  updateScrollIndexHelper
} from './utils'

// Default cell sizes and offsets for use in below tests
function getCellMetadata () {
  const cellSizes = [
    10, // 0: 0..0 (min)
    20, // 1: 0..10
    15, // 2: 0..30
    10, // 3: 5..45
    15, // 4: 20..55
    30, // 5: 50..70
    20, // 6: 70..100
    10, // 7: 80..110
    30 //  8: 110..110 (max)
  ]
  return initCellMetadata({
    cellCount: cellSizes.length,
    size: index => cellSizes[index]
  })
}

describe('computeCellMetadataAndUpdateScrollOffsetHelper', () => {
  function helper ({
    cellsCount = 100,
    cellSize = 10,
    computeMetadataCallbackProps = {},
    computeMetadataOnNextUpdate = false,
    nextCellsCount = 100,
    nextCellSize = 10,
    nextScrollToIndex,
    scrollToIndex
  } = {}) {
    const computeMetadataCallbackCalls = []
    const updateScrollOffsetForScrollToIndexCalls = []

    computeCellMetadataAndUpdateScrollOffsetHelper({
      cellsCount,
      cellSize,
      computeMetadataCallback: params => computeMetadataCallbackCalls.push(params),
      computeMetadataCallbackProps,
      computeMetadataOnNextUpdate,
      nextCellsCount,
      nextCellSize,
      nextScrollToIndex,
      scrollToIndex,
      updateScrollOffsetForScrollToIndex: params => updateScrollOffsetForScrollToIndexCalls.push(params)
    })

    return {
      computeMetadataCallbackCalls,
      updateScrollOffsetForScrollToIndexCalls
    }
  }

  it('should call :computeMetadataCallback if :computeMetadataOnNextUpdate is true', () => {
    const { computeMetadataCallbackCalls } = helper({ computeMetadataOnNextUpdate: true })
    expect(computeMetadataCallbackCalls.length).toEqual(1)
  })

  it('should pass the specified :computeMetadataCallbackProps to :computeMetadataCallback', () => {
    const params = { foo: 'bar' }
    const { computeMetadataCallbackCalls } = helper({
      computeMetadataCallbackProps: params,
      computeMetadataOnNextUpdate: true
    })
    expect(computeMetadataCallbackCalls).toEqual([params])
  })

  it('should call :computeMetadataCallback if :cellsCount has changed', () => {
    const { computeMetadataCallbackCalls } = helper({
      cellsCount: 100,
      nextCellsCount: 200
    })
    expect(computeMetadataCallbackCalls.length).toEqual(1)
  })

  it('should call :computeMetadataCallback if numeric :cellSize has changed', () => {
    const { computeMetadataCallbackCalls } = helper({
      cellSize: 10,
      nextCellSize: 20
    })
    expect(computeMetadataCallbackCalls.length).toEqual(1)
  })

  it('should not call :computeMetadataCallback if :cellSize callback has changed', () => {
    const { computeMetadataCallbackCalls } = helper({
      cellSize: () => {},
      nextCellSize: () => {}
    })
    expect(computeMetadataCallbackCalls.length).toEqual(0)
  })

  it('should call :updateScrollOffsetForScrollToIndex if metadata has changed and :scrollToIndex has not', () => {
    const { updateScrollOffsetForScrollToIndexCalls } = helper({
      computeMetadataOnNextUpdate: true,
      scrollToIndex: 10,
      nextScrollToIndex: 10
    })
    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(1)
  })

  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex is not specified', () => {
    const { updateScrollOffsetForScrollToIndexCalls } = helper({
      computeMetadataOnNextUpdate: true
    })
    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0)
  })

  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex has also changed', () => {
    const { updateScrollOffsetForScrollToIndexCalls } = helper({
      computeMetadataOnNextUpdate: true,
      scrollToIndex: 10,
      nextScrollToIndex: 20
    })
    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0)
  })

  it('should not call :computeMetadataCallback if the above conditions are not true', () => {
    const { computeMetadataCallbackCalls } = helper()
    expect(computeMetadataCallbackCalls.length).toEqual(0)
  })
})

describe('createCallbackMemoizer', () => {
  function OnRowsRendered () {
    let numCalls = 0
    let overscanStartIndex
    let overscanStopIndex
    let startIndex
    let stopIndex

    return {
      numCalls: () => numCalls,
      overscanStartIndex: () => overscanStartIndex,
      overscanStopIndex: () => overscanStopIndex,
      startIndex: () => startIndex,
      stopIndex: () => stopIndex,
      update: (params) => {
        overscanStartIndex = params.overscanStartIndex
        overscanStopIndex = params.overscanStopIndex
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
    }
  }

  it('should not call onRowsRendered if startIndex or stopIndex are invalid', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: undefined
      }
    })
    expect(util.numCalls()).toEqual(0)
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 0
      }
    })
    expect(util.numCalls()).toEqual(0)
  })

  it('should call onRowsRendered if startIndex and stopIndex are valid', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
  })

  it('should call onRowsRendered if startIndex and stopIndex are invalid but :requireAllKeys is false', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer(false)
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(undefined)
    expect(util.stopIndex()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have not changed', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have changed', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 2
      }
    })
    expect(util.numCalls()).toEqual(3)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(2)
  })

  it('should call onRowsRendered if overscanRowsCount changes', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 2,
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(2)
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 3,
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(3)
  })
})

describe('getUpdatedOffsetForIndex', () => {
  function testHelper (targetIndex, currentOffset, cellMetadata = getCellMetadata()) {
    return getUpdatedOffsetForIndex({
      cellMetadata,
      containerSize: 50,
      currentOffset,
      targetIndex
    })
  }

  it('should scroll to the beginning', () => {
    expect(testHelper(0, 100)).toEqual(0)
  })

  it('should scroll forward to the middle', () => {
    expect(testHelper(4, 0)).toEqual(20)
  })

  it('should scroll backward to the middle', () => {
    expect(testHelper(2, 100)).toEqual(30)
  })

  it('should not scroll if an item is already visible', () => {
    expect(testHelper(2, 20)).toEqual(20)
  })

  it('should scroll to the end', () => {
    expect(testHelper(8, 0)).toEqual(110)
  })

  it('should not scroll too far backward', () => {
    expect(testHelper(-5, 0)).toEqual(0)
  })

  it('should not scroll too far forward', () => {
    expect(testHelper(105, 0)).toEqual(110)
  })
})

describe('getVisibleCellIndices', () => {
  function testHelper (currentOffset, cellMetadata = getCellMetadata()) {
    return getVisibleCellIndices({
      cellCount: cellMetadata.length,
      cellMetadata,
      containerSize: 50,
      currentOffset
    })
  }

  it('should handle unscrolled', () => {
    const { start, stop } = testHelper(0)
    expect(start).toEqual(0)
    expect(stop).toEqual(3)
  })

  it('should handle scrolled to the middle', () => {
    const { start, stop } = testHelper(50)
    expect(start).toEqual(3)
    expect(stop).toEqual(5)
  })

  it('should handle scrolled to the end', () => {
    const { start, stop } = testHelper(110)
    expect(start).toEqual(6)
    expect(stop).toEqual(8)
  })

  it('should handle scrolled past the end', () => {
    const { start, stop } = testHelper(200)
    expect(start).toEqual(8) // TODO Should this actually be 6?
    expect(stop).toEqual(8)
  })

  it('should handle scrolled past the beginning', () => {
    const { start, stop } = testHelper(-50)
    expect(start).toEqual(0)
    expect(stop).toEqual(3)
  })
})

describe('updateScrollIndexHelper', () => {
  function helper ({
    cellMetadata = getCellMetadata(),
    cellsCount = 100,
    cellSize = 10,
    previousCellsCount = 100,
    previousCellSize = 10,
    previousScrollToIndex,
    previousSize = 50,
    scrollOffset = 0,
    scrollToIndex,
    size = 50
  } = {}) {
    let updateScrollIndexCallbackCalled = false

    function updateScrollIndexCallback (params) {
      updateScrollIndexCallbackCalled = true
    }

    updateScrollIndexHelper({
      cellMetadata,
      cellsCount,
      cellSize,
      previousCellsCount,
      previousCellSize,
      previousScrollToIndex,
      previousSize,
      scrollOffset,
      scrollToIndex,
      size,
      updateScrollIndexCallback
    })

    return updateScrollIndexCallbackCalled
  }

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex and size has not changed', () => {
    expect(helper()).toEqual(false)
  })

  it('should not call :updateScrollIndexCallback if an invalid :scrollToIndex has been specified', () => {
    expect(helper({
      size: 100,
      previousSize: 50,
      scrollToIndex: -1
    })).toEqual(false)
  })

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :size has changed', () => {
    expect(helper({
      size: 100,
      previousSize: 50,
      scrollToIndex: 10
    })).toEqual(true)
  })

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :cellSize has changed', () => {
    expect(helper({
      cellSize: 15,
      previousCellSize: 20,
      scrollToIndex: 10
    })).toEqual(true)
  })

  it('should call :updateScrollIndexCallback if previous :scrollToIndex has changed', () => {
    expect(helper({
      previousScrollToIndex: 20,
      scrollToIndex: 10
    })).toEqual(true)
  })

  it('should call :updateScrollIndexCallback if :cellsCount has been reduced past the current scroll offset', () => {
    expect(helper({
      cellsCount: 50,
      previousCellsCount: 100,
      scrollOffset: 510
    })).toEqual(true)
  })

  it('should call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been reduced', () => {
    expect(helper({
      previousSize: 100,
      scrollOffset: 510,
      size: 50
    })).toEqual(true)
  })

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :cellsCount has been increased', () => {
    expect(helper({
      cellsCount: 100,
      previousCellsCount: 50
    })).toEqual(false)
  })

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been increased', () => {
    expect(helper({
      previousSize: 50,
      size: 100
    })).toEqual(false)
  })
})

describe('getOverscanIndices', () => {
  function testHelper (rowsCount, startIndex, stopIndex, overscanRowsCount) {
    return getOverscanIndices({
      overscanRowsCount,
      rowsCount,
      startIndex,
      stopIndex
    })
  }

  it('should not overscan if :overscanRowsCount is 0', () => {
    expect(testHelper(100, 10, 20, 0)).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 20
    })
  })

  it('should overscan by the specified :overscanRowsCount', () => {
    expect(testHelper(100, 10, 20, 10)).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 30
    })
  })

  it('should not overscan beyond the start of the list', () => {
    expect(testHelper(100, 5, 15, 10)).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 25
    })
  })

  it('should not overscan beyond the end of the list', () => {
    expect(testHelper(25, 10, 20, 10)).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 24
    })
  })
})
