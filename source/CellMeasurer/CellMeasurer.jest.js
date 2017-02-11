import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'

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
  cache
}) {
  render(
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      rowIndex={0}
      style={{}}
    >
      <div/>
    </CellMeasurer>
  )
}

describe('CellMeasurer', () => {
  it('componentDidMount() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache()

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
    expect(cache.has(0, 0)).toBe(false)

    renderHelper({ cache })

    expect(offsetHeightMock.mock.calls).toHaveLength(1)
    expect(offsetWidthMock.mock.calls).toHaveLength(1)
    expect(cache.has(0, 0)).toBe(true)
    expect(cache.getWidth(0, 0)).toBe(100)
    expect(cache.getHeight(0, 0)).toBe(20)
  })

  it('componentDidMount() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    expect(cache.has(0, 0)).toBe(true)

    renderHelper({ cache })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
  })

  it('componentDidUpdate() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache()

    renderHelper({ cache })

    cache.clear(0, 0)

    expect(cache.has(0, 0)).toBe(false)
    expect(cache.getWidth(0, 0)).toBe(null)
    expect(cache.getHeight(0, 0)).toBe(null)

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    renderHelper({ cache })

    expect(cache.has(0, 0)).toBe(true)

    expect(offsetHeightMock.mock.calls).toHaveLength(1)
    expect(offsetWidthMock.mock.calls).toHaveLength(1)
    expect(cache.getWidth(0, 0)).toBe(100)
    expect(cache.getHeight(0, 0)).toBe(20)
  })

  it('componentDidUpdate() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache()
    cache.set(0, 0, 100, 20)

    expect(cache.has(0, 0)).toBe(true)

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    })

    renderHelper({ cache })
    renderHelper({ cache })

    const offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get
    const offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get

    expect(offsetHeightMock.mock.calls).toHaveLength(0)
    expect(offsetWidthMock.mock.calls).toHaveLength(0)
  })
})
