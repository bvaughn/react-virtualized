import CellMeasurerCache, { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './CellMeasurerCache'

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
    keyMapper.mockReturnValue('a')

    const cache = new CellMeasurerCache({ keyMapper })
    cache.set(0, 0, 100, 20)
    expect(cache.has(0, 0)).toBe(true)

    keyMapper.mock.calls.splice(0)
    keyMapper.mockReturnValue('b')
    expect(cache.has(0, 0)).toBe(false)
    expect(keyMapper.mock.calls).toHaveLength(1)
  })

  it('should provide a Grid-compatible :columnWidth method', () => {
    const cache = new CellMeasurerCache()
    expect(cache.columnWidth({ index: 0 })).toBe(DEFAULT_WIDTH)
    cache.set(0, 0, 100, 50)
    expect(cache.columnWidth({ index: 0 })).toBe(100)
    expect(cache.columnWidth({ index: 1 })).toBe(DEFAULT_WIDTH)
    cache.set(1, 0, 75, 50)
    expect(cache.columnWidth({ index: 0 })).toBe(100)
    cache.set(2, 0, 125, 50)
    expect(cache.columnWidth({ index: 0 })).toBe(125)
  })

  it('should provide a Grid-compatible :rowHeight method', () => {
    const cache = new CellMeasurerCache()
    expect(cache.rowHeight({ index: 0 })).toBe(DEFAULT_HEIGHT)
    cache.set(0, 0, 100, 50)
    expect(cache.rowHeight({ index: 0 })).toBe(50)
    expect(cache.rowHeight({ index: 1 })).toBe(DEFAULT_HEIGHT)
    cache.set(0, 1, 100, 25)
    expect(cache.rowHeight({ index: 0 })).toBe(50)
    cache.set(0, 2, 100, 75)
    expect(cache.rowHeight({ index: 0 })).toBe(75)
  })

  it('should return the :defaultWidth for :columnWidth if not measured', () => {
    const cache = new CellMeasurerCache({
      defaultWidth: 25
    })
    expect(cache.columnWidth({ index: 0 })).toBe(25)
  })

  it('should return the :defaultHeight for :rowHeight if not measured', () => {
    const cache = new CellMeasurerCache({
      defaultHeight: 25
    })
    expect(cache.rowHeight({ index: 0 })).toBe(25)
  })
})
