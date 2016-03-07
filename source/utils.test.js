import test from 'tape'
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
    cellsCount: cellSizes.length,
    size: index => cellSizes[index]
  })
}

function computeCellMetadataAndUpdateScrollOffsetHelper_helper ({
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

test('computeCellMetadataAndUpdateScrollOffsetHelper should call :computeMetadataCallback if :computeMetadataOnNextUpdate is true', (assert) => {
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({ computeMetadataOnNextUpdate: true })
  assert.equal(computeMetadataCallbackCalls.length, 1)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should pass the specified :computeMetadataCallbackProps to :computeMetadataCallback', (assert) => {
  const params = { foo: 'bar' }
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    computeMetadataCallbackProps: params,
    computeMetadataOnNextUpdate: true
  })
  assert.deepEqual(computeMetadataCallbackCalls, [params])
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should call :computeMetadataCallback if :cellsCount has changed', (assert) => {
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    cellsCount: 100,
    nextCellsCount: 200
  })
  assert.equal(computeMetadataCallbackCalls.length, 1)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should call :computeMetadataCallback if numeric :cellSize has changed', (assert) => {
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    cellSize: 10,
    nextCellSize: 20
  })
  assert.equal(computeMetadataCallbackCalls.length, 1)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should not call :computeMetadataCallback if :cellSize callback has changed', (assert) => {
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    cellSize: () => {},
    nextCellSize: () => {}
  })
  assert.equal(computeMetadataCallbackCalls.length, 0)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should call :updateScrollOffsetForScrollToIndex if metadata has changed and :scrollToIndex has not', (assert) => {
  const { updateScrollOffsetForScrollToIndexCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    computeMetadataOnNextUpdate: true,
    scrollToIndex: 10,
    nextScrollToIndex: 10
  })
  assert.equal(updateScrollOffsetForScrollToIndexCalls.length, 1)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex is not specified', (assert) => {
  const { updateScrollOffsetForScrollToIndexCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    computeMetadataOnNextUpdate: true
  })
  assert.equal(updateScrollOffsetForScrollToIndexCalls.length, 0)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex has also changed', (assert) => {
  const { updateScrollOffsetForScrollToIndexCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper({
    computeMetadataOnNextUpdate: true,
    scrollToIndex: 10,
    nextScrollToIndex: 20
  })
  assert.equal(updateScrollOffsetForScrollToIndexCalls.length, 0)
  assert.end()
})

test('computeCellMetadataAndUpdateScrollOffsetHelper should not call :computeMetadataCallback if the above conditions are not true', (assert) => {
  const { computeMetadataCallbackCalls } = computeCellMetadataAndUpdateScrollOffsetHelper_helper()
  assert.equal(computeMetadataCallbackCalls.length, 0)
  assert.end()
})

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

test('createCallbackMemoizer should not call onRowsRendered if startIndex or stopIndex are invalid', (assert) => {
  const util = new OnRowsRendered()
  const helper = createCallbackMemoizer()
  helper({
    callback: util.update,
    indices: {
      startIndex: 0,
      stopIndex: undefined
    }
  })
  assert.equal(util.numCalls(), 0)
  helper({
    callback: util.update,
    indices: {
      startIndex: undefined,
      stopIndex: 0
    }
  })
  assert.equal(util.numCalls(), 0)
  assert.end()
})

test('createCallbackMemoizer should call onRowsRendered if startIndex and stopIndex are valid', (assert) => {
  const util = new OnRowsRendered()
  const helper = createCallbackMemoizer()
  helper({
    callback: util.update,
    indices: {
      startIndex: 0,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 1)
  assert.equal(util.startIndex(), 0)
  assert.equal(util.stopIndex(), 1)
  assert.end()
})

test('createCallbackMemoizer should call onRowsRendered if startIndex and stopIndex are invalid but :requireAllKeys is false', (assert) => {
  const util = new OnRowsRendered()
  const helper = createCallbackMemoizer(false)
  helper({
    callback: util.update,
    indices: {
      startIndex: undefined,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 1)
  assert.equal(util.startIndex(), undefined)
  assert.equal(util.stopIndex(), 1)
  assert.end()
})

test('createCallbackMemoizer should not call onRowsRendered if startIndex or stopIndex have not changed', (assert) => {
  const util = new OnRowsRendered()
  const helper = createCallbackMemoizer()
  helper({
    callback: util.update,
    indices: {
      startIndex: 0,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 1)
  assert.equal(util.startIndex(), 0)
  assert.equal(util.stopIndex(), 1)
  helper({
    callback: util.update,
    indices: {
      startIndex: 0,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 1)
  assert.end()
})

test('createCallbackMemoizer should not call onRowsRendered if startIndex or stopIndex have changed', (assert) => {
  const util = new OnRowsRendered()
  const helper = createCallbackMemoizer()
  helper({
    callback: util.update,
    indices: {
      startIndex: 0,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 1)
  assert.equal(util.startIndex(), 0)
  assert.equal(util.stopIndex(), 1)
  helper({
    callback: util.update,
    indices: {
      startIndex: 1,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 2)
  assert.equal(util.startIndex(), 1)
  assert.equal(util.stopIndex(), 1)
  helper({
    callback: util.update,
    indices: {
      startIndex: 1,
      stopIndex: 2
    }
  })
  assert.equal(util.numCalls(), 3)
  assert.equal(util.startIndex(), 1)
  assert.equal(util.stopIndex(), 2)
  assert.end()
})

test('createCallbackMemoizer should call onRowsRendered if :overscanCellsCount changes', (assert) => {
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
  assert.equal(util.numCalls(), 1)
  assert.equal(util.startIndex(), 0)
  assert.equal(util.stopIndex(), 1)
  assert.equal(util.overscanStartIndex(), 0)
  assert.equal(util.overscanStopIndex(), 2)
  helper({
    callback: util.update,
    indices: {
      overscanStartIndex: 0,
      overscanStopIndex: 3,
      startIndex: 0,
      stopIndex: 1
    }
  })
  assert.equal(util.numCalls(), 2)
  assert.equal(util.startIndex(), 0)
  assert.equal(util.stopIndex(), 1)
  assert.equal(util.overscanStartIndex(), 0)
  assert.equal(util.overscanStopIndex(), 3)
  assert.end()
})

function getUpdatedOffsetForIndex_helper (targetIndex, currentOffset, cellMetadata = getCellMetadata()) {
  return getUpdatedOffsetForIndex({
    cellMetadata,
    containerSize: 50,
    currentOffset,
    targetIndex
  })
}

test('getUpdatedOffsetForIndex should scroll to the beginning', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(0, 100), 0)
  assert.end()
})

test('getUpdatedOffsetForIndex should scroll forward to the middle', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(4, 0), 20)
  assert.end()
})

test('getUpdatedOffsetForIndex should scroll backward to the middle', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(2, 100), 30)
  assert.end()
})

test('getUpdatedOffsetForIndex should not scroll if an item is already visible', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(2, 20), 20)
  assert.end()
})

test('getUpdatedOffsetForIndex should scroll to the end', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(8, 0), 110)
  assert.end()
})

test('getUpdatedOffsetForIndex should not scroll too far backward', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(-5, 0), 0)
  assert.end()
})

test('getUpdatedOffsetForIndex should not scroll too far forward', (assert) => {
  assert.equal(getUpdatedOffsetForIndex_helper(105, 0), 110)
  assert.end()
})

function getVisibleCellIndices_helper (currentOffset, cellMetadata = getCellMetadata()) {
  return getVisibleCellIndices({
    cellsCount: cellMetadata.length,
    cellMetadata,
    containerSize: 50,
    currentOffset
  })
}

test('getVisibleCellIndices should handle unscrolled', (assert) => {
  const { start, stop } = getVisibleCellIndices_helper(0)
  assert.equal(start, 0)
  assert.equal(stop, 3)
  assert.end()
})

test('getVisibleCellIndices should handle scrolled to the middle', (assert) => {
  const { start, stop } = getVisibleCellIndices_helper(50)
  assert.equal(start, 3)
  assert.equal(stop, 5)
  assert.end()
})

test('getVisibleCellIndices should handle scrolled to the end', (assert) => {
  const { start, stop } = getVisibleCellIndices_helper(110)
  assert.equal(start, 6)
  assert.equal(stop, 8)
  assert.end()
})

test('getVisibleCellIndices should handle scrolled past the end', (assert) => {
  const { start, stop } = getVisibleCellIndices_helper(200)
  assert.equal(start, 8) // TODO Should this actually be 6?
  assert.equal(stop, 8)
  assert.end()
})

test('getVisibleCellIndices should handle scrolled past the beginning', (assert) => {
  const { start, stop } = getVisibleCellIndices_helper(-50)
  assert.equal(start, 0)
  assert.equal(stop, 3)
  assert.end()
})

function updateScrollIndexHelper_helper ({
  cellsCount = 100,
  cellMetadata = getCellMetadata(),
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
    cellsCount,
    cellMetadata,
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

test('updateScrollIndexHelper should not call :updateScrollIndexCallback if there is no :scrollToIndex and size has not changed', (assert) => {
  assert.equal(updateScrollIndexHelper_helper(), false)
  assert.end()
})

test('updateScrollIndexHelper should not call :updateScrollIndexCallback if an invalid :scrollToIndex has been specified', (assert) => {
  assert.notOk(updateScrollIndexHelper_helper({
    size: 100,
    previousSize: 50,
    scrollToIndex: -1
  }))
  assert.end()
})

test('updateScrollIndexHelper should call :updateScrollIndexCallback if there is a :scrollToIndex and :size has changed', (assert) => {
  assert.ok(updateScrollIndexHelper_helper({
    size: 100,
    previousSize: 50,
    scrollToIndex: 10
  }))
  assert.end()
})

test('updateScrollIndexHelper should call :updateScrollIndexCallback if there is a :scrollToIndex and :cellSize has changed', (assert) => {
  assert.ok(updateScrollIndexHelper_helper({
    cellSize: 15,
    previousCellSize: 20,
    scrollToIndex: 10
  }))
  assert.end()
})

test('updateScrollIndexHelper should call :updateScrollIndexCallback if previous :scrollToIndex has changed', (assert) => {
  assert.ok(updateScrollIndexHelper_helper({
    previousScrollToIndex: 20,
    scrollToIndex: 10
  }))
  assert.end()
})

test('updateScrollIndexHelper should call :updateScrollIndexCallback if :cellsCount has been reduced past the current scroll offset', (assert) => {
  assert.ok(updateScrollIndexHelper_helper({
    cellsCount: 50,
    previousCellsCount: 100,
    scrollOffset: 510
  }))
  assert.end()
})

test('updateScrollIndexHelper should call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been reduced', (assert) => {
  assert.ok(updateScrollIndexHelper_helper({
    previousSize: 100,
    scrollOffset: 510,
    size: 50
  }))
  assert.end()
})

test('updateScrollIndexHelper should not call :updateScrollIndexCallback if there is no :scrollToIndex but :cellsCount has been increased', (assert) => {
  assert.notOk(updateScrollIndexHelper_helper({
    cellsCount: 100,
    previousCellsCount: 50
  }))
  assert.end()
})

test('updateScrollIndexHelper should not call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been increased', (assert) => {
  assert.notOk(updateScrollIndexHelper_helper({
    previousSize: 50,
    size: 100
  }))
  assert.end()
})

function getOverscanIndices_helper (cellsCount, startIndex, stopIndex, overscanCellsCount) {
  return getOverscanIndices({
    cellsCount,
    overscanCellsCount,
    startIndex,
    stopIndex
  })
}

test('getOverscanIndices should not overscan if :overscanCellsCount is 0', (assert) => {
  assert.deepEqual(getOverscanIndices_helper(100, 10, 20, 0), {
    overscanStartIndex: 10,
    overscanStopIndex: 20
  })
  assert.end()
})

test('getOverscanIndices should overscan by the specified :overscanCellsCount', (assert) => {
  assert.deepEqual(getOverscanIndices_helper(100, 10, 20, 10), {
    overscanStartIndex: 0,
    overscanStopIndex: 30
  })
  assert.end()
})

test('getOverscanIndices should not overscan beyond the start of the list', (assert) => {
  assert.deepEqual(getOverscanIndices_helper(100, 5, 15, 10), {
    overscanStartIndex: 0,
    overscanStopIndex: 25
  })
  assert.end()
})

test('getOverscanIndices should not overscan beyond the end of the list', (assert) => {
  assert.deepEqual(getOverscanIndices_helper(25, 10, 20, 10), {
    overscanStartIndex: 0,
    overscanStopIndex: 24
  })
  assert.end()
})
