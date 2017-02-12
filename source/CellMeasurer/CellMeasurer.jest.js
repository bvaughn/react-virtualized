/* global Element */

import React from 'react'
import { render } from '../TestUtils'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache, { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './CellMeasurerCache'

// Accounts for the fact that JSDom doesn't support measurements.
function mockClientWidthAndHeight ({
  height,
  width
}) {
  Object.defineProperty(
    Element.prototype,
    'offsetHeight',
    {
      configurable: true,
      get: jest.fn().mockReturnValue(height)
    }
  )

  Object.defineProperty(
    Element.prototype,
    'offsetWidth',
    {
      configurable: true,
      get: jest.fn().mockReturnValue(width)
    }
  )
}

function renderHelper ({
  cache,
  invalidateGridSizeAfterRender
}) {
  render(
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      parent={{
        invalidateGridSizeAfterRender
      }}
      rowIndex={0}
      style={{}}
    >
      <div />
    </CellMeasurer>
  )
}

describe('CellMeasurer', () => {
  it('componentDidMount() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache()
    const invalidateGridSizeAfterRender = jest.fn()

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
    expect(cache.has(0, 0)).toBe(false)

    renderHelper({ cache, invalidateGridSizeAfterRender })

    expect(invalidateGridSizeAfterRender).toHaveBeenCalled()
    expect(offsetHeightMock.mock.calls).toHaveLength(1)
    expect(offsetWidthMock.mock.calls).toHaveLength(1)
    expect(cache.has(0, 0)).toBe(true)
    expect(cache.getWidth(0, 0)).toBe(100)
    expect(cache.getHeight(0, 0)).toBe(20)
  })

  it('componentDidMount() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)

    const invalidateGridSizeAfterRender = jest.fn()

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    expect(cache.has(0, 0)).toBe(true)

    renderHelper({ cache, invalidateGridSizeAfterRender })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(invalidateGridSizeAfterRender).not.toHaveBeenCalled()
    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
  })

  it('componentDidUpdate() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache()
    const invalidateGridSizeAfterRender = jest.fn()

    renderHelper({ cache, invalidateGridSizeAfterRender })

    cache.clear(0, 0)
    invalidateGridSizeAfterRender.mockReset()

    expect(cache.has(0, 0)).toBe(false)
    expect(cache.getWidth(0, 0)).toBe(DEFAULT_WIDTH)
    expect(cache.getHeight(0, 0)).toBe(DEFAULT_HEIGHT)

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    renderHelper({ cache, invalidateGridSizeAfterRender })

    expect(cache.has(0, 0)).toBe(true)

    expect(invalidateGridSizeAfterRender).toHaveBeenCalled()
    expect(offsetHeightMock.mock.calls).toHaveLength(1)
    expect(offsetWidthMock.mock.calls).toHaveLength(1)
    expect(cache.getWidth(0, 0)).toBe(100)
    expect(cache.getHeight(0, 0)).toBe(20)
  })

  it('componentDidUpdate() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)

    const invalidateGridSizeAfterRender = jest.fn()

    expect(cache.has(0, 0)).toBe(true)

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    renderHelper({ cache, invalidateGridSizeAfterRender })
    renderHelper({ cache, invalidateGridSizeAfterRender })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(invalidateGridSizeAfterRender).not.toHaveBeenCalled()
    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
  })
})
