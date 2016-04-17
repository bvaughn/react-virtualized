import getVisibleCellIndices from './getVisibleCellIndices'
import { getCellMetadata } from '../../utils/TestHelper'

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
    expect(start).toEqual(6)
    expect(stop).toEqual(8)
  })

  it('should handle scrolled past the beginning', () => {
    const { start, stop } = testHelper(-50)
    expect(start).toEqual(0)
    expect(stop).toEqual(3)
  })
})

