import getNearestIndex from './getNearestIndex'

describe('getNearestIndex', () => {
  it('should return the specified index if target is within range', () => {
    const indices = [0, 5, 9]
    indices.forEach((targetIndex) => {
      expect(getNearestIndex({
        cellCount: 10,
        targetIndex
      })).toEqual(targetIndex)
    })
  })

  it('should return the first index if target is too low', () => {
    expect(getNearestIndex({
      cellCount: 10,
      targetIndex: -1
    })).toEqual(0)
  })

  it('should return the last index if target is too high', () => {
    expect(getNearestIndex({
      cellCount: 10,
      targetIndex: 11
    })).toEqual(9)
  })
})
