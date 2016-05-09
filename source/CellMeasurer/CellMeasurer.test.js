import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import CellMeasurer from './CellMeasurer'

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
  columnCount = 1,
  columnWidth,
  rowCount = 1,
  rowHeight
} = {}) {
  const params = {}
  findDOMNode(render(
    <div>
      <CellMeasurer
        cellRenderer={cellRenderer}
        columnCount={columnCount}
        height={rowHeight}
        rowCount={rowCount}
        width={columnWidth}
      >
        {({ getColumnWidth, getRowHeight }) => {
          params.getColumnWidth = getColumnWidth
          params.getRowHeight = getRowHeight

          return <div>foo</div>
        }}
      </CellMeasurer>
    </div>
  ))

  return params
}

describe('CellMeasurer', () => {
  it('should calculate the height of a single-column row', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const params = renderHelper({
      cellRenderer,
      columnWidth: 100
    })
    expect(cellRendererParams).toEqual([])
    expect(params.getRowHeight({ index: 0 })).toEqual(75)
    expect(cellRendererParams).toEqual([{ columnIndex: 0, rowIndex: 0 }])
    expect(params.getColumnWidth({ index: 0 })).toEqual(100)

    // For some reason this explicit unmount is necessary.
    // Without it, Jasmine's :afterEach doesn't pick up and unmount the component correctly.
    render.unmount()
  })

  it('should calculate the width of a single-row column', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const params = renderHelper({
      cellRenderer,
      rowHeight: 50
    })
    expect(cellRendererParams).toEqual([])
    expect(params.getColumnWidth({ index: 0 })).toEqual(125)
    expect(cellRendererParams).toEqual([{ columnIndex: 0, rowIndex: 0 }])
    expect(params.getRowHeight({ index: 0 })).toEqual(50)
  })

  it('should calculate the height of a multi-column row based on the tallest column-cell', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const params = renderHelper({
      cellRenderer,
      columnCount: 5,
      columnWidth: 100
    })
    expect(cellRendererParams.length).toEqual(0)
    expect(params.getRowHeight({ index: 0 })).toEqual(150)
    expect(cellRendererParams.length).toEqual(5)
    expect(params.getColumnWidth({ index: 0 })).toEqual(100)
  })

  it('should calculate the width of a multi-row column based on the widest row-cell', () => {
    const {
      cellRenderer,
      cellRendererParams
    } = createCellRenderer()
    const params = renderHelper({
      cellRenderer,
      rowCount: 5,
      rowHeight: 50
    })
    expect(cellRendererParams.length).toEqual(0)
    expect(params.getColumnWidth({ index: 0 })).toEqual(200)
    expect(cellRendererParams.length).toEqual(5)
    expect(params.getRowHeight({ index: 0 })).toEqual(50)
  })
})
