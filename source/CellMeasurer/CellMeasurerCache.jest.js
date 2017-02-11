import CellMeasurerCache from './CellMeasurerCache'

describe('CellMeasurerCache', () => {
  it('should correctly report cache status', () => {
    const cache = new CellMeasurerCache()
    expect(cache.has(0, 0)).toBe(false)
  })

  it('should cache cells', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)
    expect(cache.has(0, 0)).toBe(true)
  })

  it('should return the correct default sizes for uncached cells if specified', () => {
    const cache = new CellMeasurerCache({
      defaultHeight: 20,
      defaultWidth: 100
    })
    expect(cache.getWidth(0, 0)).toBe(100)
    expect(cache.getHeight(0, 0)).toBe(20)
    cache.set(0, 0, 150, 30)
    expect(cache.getWidth(0, 0)).toBe(150)
    expect(cache.getHeight(0, 0)).toBe(30)
  })

  it('should clear a single cached cell', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)
    cache.set(1, 0, 100, 20)
    expect(cache.has(0, 0)).toBe(true)
    expect(cache.has(1, 0)).toBe(true)
    cache.clear(0, 0)
    expect(cache.has(0, 0)).toBe(false)
    expect(cache.has(1, 0)).toBe(true)
  })

  it('should clear all cached cells', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)
    cache.set(1, 0, 100, 20)
    expect(cache.has(0, 0)).toBe(true)
    expect(cache.has(1, 0)).toBe(true)
    cache.clearAll()
    expect(cache.has(0, 0)).toBe(false)
    expect(cache.has(1, 0)).toBe(false)
  })

  it('should support a custom :keyMapper', () => {
    const keyMapper = jest.fn()
    const cache = new CellMeasurerCache({ keyMapper })
    keyMapper.mockReturnValueOnce('a')
    cache.set(0, 0, 100, 20)
    keyMapper.mockReturnValueOnce('a')
    expect(cache.has(0, 0)).toBe(true)
    keyMapper.mockReturnValueOnce('b')
    expect(cache.has(0, 0)).toBe(false)
    expect(keyMapper.mock.calls).toHaveLength(3)
  })

  it('should provide a Grid-compatible :columnWidth method', () => {
    const cache = new CellMeasurerCache()
    expect(cache.columnWidth({ index: 0 })).toBe(undefined)
    cache.set(0, 0, 100, 50)
    expect(cache.columnWidth({ index: 0 })).toBe(100)
    expect(cache.columnWidth({ index: 1 })).toBe(undefined)
  })

  it('should provide a Grid-compatible :rowHeight method', () => {
    const cache = new CellMeasurerCache()
    expect(cache.rowHeight({ index: 0 })).toBe(undefined)
    cache.set(0, 0, 100, 50)
    expect(cache.rowHeight({ index: 0 })).toBe(50)
    expect(cache.rowHeight({ index: 1 })).toBe(undefined)
  })
})
