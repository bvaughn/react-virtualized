import {
  getOverscanIndices,
  getUpdatedOffsetForIndex,
  getVisibleCellIndices,
  initCellMetadata,
  initOnRowsRenderedHelper
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

describe('initOnRowsRenderedHelper', () => {
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
    const helper = initOnRowsRenderedHelper()
    helper({
      onRowsRendered: util.update,
      startIndex: 0
    })
    expect(util.numCalls()).toEqual(0)
    helper({
      onRowsRendered: util.update,
      stopIndex: 0
    })
    expect(util.numCalls()).toEqual(0)
  })

  it('should call onRowsRendered if startIndex and stopIndex are valid', () => {
    const util = new OnRowsRendered()
    const helper = initOnRowsRenderedHelper()
    helper({
      onRowsRendered: util.update,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have not changed', () => {
    const util = new OnRowsRendered()
    const helper = initOnRowsRenderedHelper()
    helper({
      onRowsRendered: util.update,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      onRowsRendered: util.update,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have changed', () => {
    const util = new OnRowsRendered()
    const helper = initOnRowsRenderedHelper()
    helper({
      onRowsRendered: util.update,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      onRowsRendered: util.update,
      startIndex: 1,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(1)
    helper({
      onRowsRendered: util.update,
      startIndex: 1,
      stopIndex: 2
    })
    expect(util.numCalls()).toEqual(3)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(2)
  })

  it('should call onRowsRendered if overscanRowsCount changes', () => {
    const util = new OnRowsRendered()
    const helper = initOnRowsRenderedHelper()
    helper({
      onRowsRendered: util.update,
      overscanRowsCount: 1,
      rowsCount: 10,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(2)
    helper({
      onRowsRendered: util.update,
      overscanRowsCount: 2,
      rowsCount: 10,
      startIndex: 0,
      stopIndex: 1
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(3)
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
