import CellSizeCache from './defaultCellSizeCache'

describe('CellSizeCache', () => {
  function verifyUniformColumnWidths (cellSizeCache) {
    cellSizeCache.setColumnWidth(1, 1)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(1)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(1)
    cellSizeCache.setColumnWidth(2, 2)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(2)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(2)
    expect(cellSizeCache.getColumnWidth(3)).toEqual(2)
    cellSizeCache.clearColumnWidth(1)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(undefined)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(undefined)
  }

  function verifyUniformRowHeights (cellSizeCache) {
    cellSizeCache.setRowHeight(1, 1)
    expect(cellSizeCache.getRowHeight(1)).toEqual(1)
    expect(cellSizeCache.getRowHeight(2)).toEqual(1)
    cellSizeCache.setRowHeight(2, 2)
    expect(cellSizeCache.getRowHeight(1)).toEqual(2)
    expect(cellSizeCache.getRowHeight(2)).toEqual(2)
    expect(cellSizeCache.getRowHeight(3)).toEqual(2)
    cellSizeCache.clearRowHeight(1)
    expect(cellSizeCache.getRowHeight(1)).toEqual(undefined)
    expect(cellSizeCache.getRowHeight(2)).toEqual(undefined)
  }

  function verifyVaryingColumnWidths (cellSizeCache) {
    cellSizeCache.setColumnWidth(1, 1)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(1)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(undefined)
    cellSizeCache.setColumnWidth(2, 2)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(1)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(2)
    expect(cellSizeCache.getColumnWidth(3)).toEqual(undefined)
    cellSizeCache.clearColumnWidth(1)
    expect(cellSizeCache.getColumnWidth(1)).toEqual(undefined)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(2)
    cellSizeCache.clearAllColumnWidths()
    expect(cellSizeCache.getColumnWidth(1)).toEqual(undefined)
    expect(cellSizeCache.getColumnWidth(2)).toEqual(undefined)
  }

  function verifyVaryingRowHeights (cellSizeCache) {
    cellSizeCache.setRowHeight(1, 1)
    expect(cellSizeCache.getRowHeight(1)).toEqual(1)
    expect(cellSizeCache.getRowHeight(2)).toEqual(undefined)
    cellSizeCache.setRowHeight(2, 2)
    expect(cellSizeCache.getRowHeight(1)).toEqual(1)
    expect(cellSizeCache.getRowHeight(2)).toEqual(2)
    expect(cellSizeCache.getRowHeight(3)).toEqual(undefined)
    cellSizeCache.clearRowHeight(1)
    expect(cellSizeCache.getRowHeight(1)).toEqual(undefined)
    expect(cellSizeCache.getRowHeight(2)).toEqual(2)
    cellSizeCache.clearAllRowHeights()
    expect(cellSizeCache.getRowHeight(1)).toEqual(undefined)
    expect(cellSizeCache.getRowHeight(2)).toEqual(undefined)
  }

  it('should support uniform height and width', () => {
    const cellSizeCache = new CellSizeCache({
      uniformColumnWidth: true,
      uniformRowHeight: true
    })
    verifyUniformColumnWidths(cellSizeCache)
    verifyUniformRowHeights(cellSizeCache)
  })

  it('should support uniform height only', () => {
    const cellSizeCache = new CellSizeCache({
      uniformColumnWidth: false,
      uniformRowHeight: true
    })
    verifyVaryingColumnWidths(cellSizeCache)
    verifyUniformRowHeights(cellSizeCache)
  })

  it('should support uniform width only', () => {
    const cellSizeCache = new CellSizeCache({
      uniformColumnWidth: true,
      uniformRowHeight: false
    })
    verifyUniformColumnWidths(cellSizeCache)
    verifyVaryingRowHeights(cellSizeCache)
  })

  it('should support varying height and width', () => {
    const cellSizeCache = new CellSizeCache({
      uniformColumnWidth: false,
      uniformRowHeight: false
    })
    verifyVaryingColumnWidths(cellSizeCache)
    verifyVaryingRowHeights(cellSizeCache)
  })
})
