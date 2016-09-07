import getOverscanIndices, {
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FIXED,
  SCROLL_DIRECTION_FORWARD
} from './getOverscanIndices'

describe('getOverscanIndices', () => {
  function testHelper (cellCount, startIndex, stopIndex, overscanCellsCount, scrollDirection = SCROLL_DIRECTION_FIXED) {
    return getOverscanIndices({
      cellCount,
      overscanCellsCount,
      scrollDirection,
      startIndex,
      stopIndex
    })
  }

  it('should not overscan if :overscanCellsCount is 0', () => {
    expect(testHelper(100, 10, 20, 0)).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 20
    })
  })

  it('should overscan by the specified :overscanCellsCount', () => {
    expect(testHelper(100, 10, 20, 10)).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 30
    })
  })

  it('should double the overscan in the direction being scrolled', () => {
    expect(testHelper(100, 20, 30, 10, SCROLL_DIRECTION_FORWARD)).toEqual({
      overscanStartIndex: 20,
      overscanStopIndex: 50
    })

    expect(testHelper(100, 20, 30, 10, SCROLL_DIRECTION_BACKWARD)).toEqual({
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
