import React from 'react'
import { render } from '../TestUtils'
import CellMeasurer from './CellMeasurer'
import CellSizeCache from './defaultCellSizeCache'
import CellSizeCacheUniformHeight from './CellSizeCacheUniformHeight'

const HEIGHTS = [75, 50, 125, 100, 150]
const WIDTHS = [125, 50, 200, 175, 100]

function createCellRenderer () {
  const cellRendererParams = []
  const cellRenderer = (params) => {
    cellRendererParams.push(params)
    return (
      <div style={{
        height: HEIGHTS[params.columnIndex],
        width: WIDTHS[params.rowIndex]
      }}>
        cell
      </div>
    )
  }

  return {
    cellRenderer,
    cellRendererParams
  }
}

function renderHelper ({
  cellRenderer,
  cellSizeCache,
  columnCount = 1,
  columnWidth,
  rowCount = 1,
  rowHeight
} = {}) {
  let params
  render(
    <div>
      <CellMeasurer
        cellRenderer={cellRenderer}
        cellSizeCache={cellSizeCache}
        columnCount={columnCount}
        height={rowHeight}
        rowCount={rowCount}
        width={columnWidth}
      >
        {(paramsToSave) => {
          params = paramsToSave

          return <div>foo</div>
        }}
      </CellMeasurer>
    </div>
  )

  return params
}

describe('CellMeasurer', () => {
  it('should calculate the height of a single-column row', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      getRowHeight
    } = renderHelper({
      cellRenderer,
      columnWidth: 100
    })
    expect(cellRendererParams).toEqual([])
    expect(getRowHeight({ index: 0 })).toEqual(75)
    expect(cellRendererParams).toEqual([{ columnIndex: 0, rowIndex: 0 }])
    expect(getColumnWidth({ index: 0 })).toEqual(100)

    // For some reason this explicit unmount is necessary.
    // Without it, Jasmine's :afterEach doesn't pick up and unmount the component correctly.
    render.unmount()
  })

  it('should calculate the width of a single-row column', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      getRowHeight
    } = renderHelper({
      cellRenderer,
      rowHeight: 50
    })
    expect(cellRendererParams).toEqual([])
    expect(getColumnWidth({ index: 0 })).toEqual(125)
    expect(cellRendererParams).toEqual([{ columnIndex: 0, rowIndex: 0 }])
    expect(getRowHeight({ index: 0 })).toEqual(50)
  })

  it('should calculate the height of a multi-column row based on the tallest column-cell', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      getRowHeight
    } = renderHelper({
      cellRenderer,
      columnCount: 5,
      columnWidth: 100
    })
    expect(cellRendererParams.length).toEqual(0)
    expect(getRowHeight({ index: 0 })).toEqual(150)
    expect(cellRendererParams.length).toEqual(5)
    expect(getColumnWidth({ index: 0 })).toEqual(100)
  })

  it('should calculate the width of a multi-row column based on the widest row-cell', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      getRowHeight
    } = renderHelper({
      cellRenderer,
      rowCount: 5,
      rowHeight: 50
    })
    expect(cellRendererParams.length).toEqual(0)
    expect(getColumnWidth({ index: 0 })).toEqual(200)
    expect(cellRendererParams.length).toEqual(5)
    expect(getRowHeight({ index: 0 })).toEqual(50)
  })

  it('should cache cell measurements once a cell has been rendered', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getRowHeight
    } = renderHelper({ cellRenderer })

    expect(cellRendererParams).toEqual([])
    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 }
    ])

    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 }
    ])
  })

  it('should reset all cached measurements when resetMeasurements() is called', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getRowHeight,
      resetMeasurements
    } = renderHelper({ cellRenderer })

    expect(cellRendererParams).toEqual([])
    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 }
    ])

    resetMeasurements()

    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 },
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 }
    ])
  })

  it('should reset a specific cached row measurement when resetMeasurementForColumn() is called', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      resetMeasurementForColumn
    } = renderHelper({ cellRenderer })

    expect(cellRendererParams).toEqual([])
    getColumnWidth({ index: 0 })
    getColumnWidth({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 1, rowIndex: 0 }
    ])

    resetMeasurementForColumn(0)

    getColumnWidth({ index: 0 })
    getColumnWidth({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 1, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 0 }
    ])
  })

  it('should reset a specific cached row measurement when resetMeasurementForRow() is called', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getRowHeight,
      resetMeasurementForRow
    } = renderHelper({ cellRenderer })

    expect(cellRendererParams).toEqual([])
    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 }
    ])

    resetMeasurementForRow(0)

    getRowHeight({ index: 0 })
    getRowHeight({ index: 1 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 },
      { columnIndex: 0, rowIndex: 1 },
      { columnIndex: 0, rowIndex: 0 }
    ])
  })

  it('should allow a custom caching strategy to be specified', () => {
    const customCellSizeCache = new CellSizeCache()
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getColumnWidth,
      getRowHeight
    } = renderHelper({
      cellRenderer,
      cellSizeCache: customCellSizeCache,
      columnCount: 5,
      columnWidth: 200,
      rowCount: 2,
      rowHeight: 50
    })

    expect(customCellSizeCache.hasColumnWidth(0)).toEqual(false)
    expect(cellRendererParams.length).toEqual(0)
    expect(getColumnWidth({ index: 0 })).toEqual(200)
    expect(customCellSizeCache.hasColumnWidth(0)).toEqual(true)
    expect(customCellSizeCache.getColumnWidth(0)).toEqual(200)
    expect(cellRendererParams.length).toEqual(2)
    expect(getColumnWidth({ index: 0 })).toEqual(200)
    expect(cellRendererParams.length).toEqual(2)

    expect(customCellSizeCache.hasRowHeight(0)).toEqual(false)
    expect(cellRendererParams.length).toEqual(2)
    expect(getRowHeight({ index: 0 })).toEqual(50)
    expect(customCellSizeCache.hasRowHeight(0)).toEqual(true)
    expect(customCellSizeCache.getRowHeight(0)).toEqual(50)
    expect(cellRendererParams.length).toEqual(7)
    expect(getRowHeight({ index: 0 })).toEqual(50)
    expect(cellRendererParams.length).toEqual(7)
  })

  it('should support changing the custom caching strategy after initialization', () => {
    const customCellSizeCacheA = new CellSizeCache()
    const customCellSizeCacheB = new CellSizeCache()
    const { cellRenderer } = createCellRenderer()
    const { getColumnWidth: getColumnWidthA } = renderHelper({
      cellRenderer,
      cellSizeCache: customCellSizeCacheA,
      columnCount: 5,
      columnWidth: 200
    })
    expect(customCellSizeCacheA.hasColumnWidth(0)).toEqual(false)
    expect(getColumnWidthA({ index: 0 })).toEqual(200)
    expect(customCellSizeCacheA.hasColumnWidth(0)).toEqual(true)

    const { getColumnWidth: getColumnWidthB } = renderHelper({
      cellRenderer,
      cellSizeCache: customCellSizeCacheA,
      columnCount: 5,
      columnWidth: 100
    })
    expect(customCellSizeCacheA.hasColumnWidth(0)).toEqual(true)
    expect(getColumnWidthB({ index: 0 })).toEqual(200)
    expect(customCellSizeCacheA.hasColumnWidth(0)).toEqual(true)

    const { getColumnWidth: getColumnWidthC } = renderHelper({
      cellRenderer,
      cellSizeCache: customCellSizeCacheB,
      columnCount: 5,
      columnWidth: 50
    })
    expect(customCellSizeCacheB.hasColumnWidth(0)).toEqual(false)
    expect(getColumnWidthC({ index: 0 })).toEqual(50)
    expect(customCellSizeCacheB.hasColumnWidth(0)).toEqual(true)
  })

  it('should calculate row height just once when using the alternative uniform-height cell size cache', () => {
    const cellSizeCacheUniformHeight = new CellSizeCacheUniformHeight()
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const {
      getRowHeight
    } = renderHelper({
      cellRenderer,
      cellSizeCache: cellSizeCacheUniformHeight,
      rowCount: 5
    })

    expect(cellRendererParams).toEqual([])
    const height1 = getRowHeight({ index: 0 })
    const height2 = getRowHeight({ index: 1 })
    const height3 = getRowHeight({ index: 0 })
    expect(cellRendererParams).toEqual([
      { columnIndex: 0, rowIndex: 0 }
    ])

    expect(height1).toEqual(75)
    expect(height2).toEqual(75)
    expect(height3).toEqual(75)
  })
})
