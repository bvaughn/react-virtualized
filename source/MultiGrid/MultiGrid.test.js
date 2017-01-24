import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import MultiGrid from './MultiGrid'

// These tests only focus on what MultiGrid does specifically.
// The inner Grid component is tested in depth elsewhere.
describe('MultiGrid', () => {
  function defaultCellRenderer ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className='gridItem'
        key={key}
        style={style}
      >
        {`row:${rowIndex}, column:${columnIndex}`}
      </div>
    )
  }

  function getMarkup (props = {}) {
    return (
      <MultiGrid
        cellRenderer={defaultCellRenderer}
        columnCount={50}
        columnWidth={50}
        fixedColumnCount={2}
        fixedRowCount={1}
        height={300}
        overscanColumnCount={0}
        overscanRowCount={0}
        autoHeight={false}
        rowHeight={20}
        rowCount={100}
        width={400}
        {...props}
      />
    )
  }

  describe('fixed columns and rows', () => {
    it('should render 4 Grids when configured for fixed columns and rows', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 1,
        fixedRowCount: 1
      })))
      const grids = rendered.querySelectorAll('.ReactVirtualized__Grid')
      expect(grids.length).toEqual(4)
      const [topLeft, topRight, bottomLeft, bottomRight] = grids
      expect(topLeft.style.getPropertyValue('overflow')).toEqual('hidden')
      expect(topLeft.style.getPropertyValue('overflow-x')).toEqual('hidden')
      expect(topLeft.style.getPropertyValue('overflow-y')).toEqual('hidden')
      expect(topRight.style.getPropertyValue('overflow')).toEqual('hidden')
      expect(topRight.style.getPropertyValue('overflow-x')).toEqual('hidden')
      expect(topRight.style.getPropertyValue('overflow-y')).toEqual('hidden')
      expect(bottomLeft.style.getPropertyValue('overflow')).toEqual('hidden')
      expect(bottomLeft.style.getPropertyValue('overflow-x')).toEqual('hidden')
      expect(bottomLeft.style.getPropertyValue('overflow-y')).toEqual('hidden')
      expect(bottomRight.style.getPropertyValue('overflow')).toEqual('auto')
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto')
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto')
    })

    it('should render 2 Grids when configured for fixed columns only', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 1,
        fixedRowCount: 0
      })))
      const grids = rendered.querySelectorAll('.ReactVirtualized__Grid')
      expect(grids.length).toEqual(2)
      const [bottomLeft, bottomRight] = grids
      expect(bottomLeft.style.getPropertyValue('overflow')).toEqual('hidden')
      expect(bottomRight.style.getPropertyValue('overflow')).toEqual('auto')
    })

    it('should render 2 Grids when configured for fixed rows only', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 1
      })))
      const grids = rendered.querySelectorAll('.ReactVirtualized__Grid')
      expect(grids.length).toEqual(2)
      const [topRight, bottomRight] = grids
      expect(topRight.style.getPropertyValue('overflow')).toEqual('hidden')
      expect(bottomRight.style.getPropertyValue('overflow')).toEqual('auto')
    })

    it('should render 1 Grid when configured for neither fixed columns and rows', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 0
      })))
      const grids = rendered.querySelectorAll('.ReactVirtualized__Grid')
      expect(grids.length).toEqual(1)
      const [bottomRight] = grids
      expect(bottomRight.style.getPropertyValue('overflow')).toEqual('auto')
    })

    it('should adjust the number of Grids when fixed column or row counts change', () => {
      let rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 2,
        fixedRowCount: 1
      })))
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(4)
      rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 0
      })))
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(1)
      rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 2
      })))
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(2)
    })
  })

  describe('scrollToColumn and scrollToRow', () => {
    it('should adjust :scrollLeft for the main Grid when scrollToColumn is used', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnWidth: 50,
        fixedColumnCount: 2,
        scrollToAlignment: 'start',
        scrollToColumn: 19
      })))
      // Bottom-right Grid is the last Grid
      const grid = rendered.querySelectorAll('.ReactVirtualized__Grid')[3]
      // 20th column, less 2 for the fixed-column Grid, 50px column width
      expect(grid.scrollLeft).toEqual(850)
    })

    it('should adjust :scrollTop for the main Grid when scrollToRow is used', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedRowCount: 1,
        rowHeight: 50,
        scrollToAlignment: 'start',
        scrollToRow: 19
      })))
      // Bottom-right Grid is the last Grid
      const grid = rendered.querySelectorAll('.ReactVirtualized__Grid')[3]
      // 20th row, less 1 for the fixed-row Grid, 50px row width
      expect(grid.scrollTop).toEqual(900)
    })
  })

  describe('styles', () => {
    it('should support custom style for the outer MultiGrid wrapper element', () => {
      const rendered = findDOMNode(render(getMarkup({
        style: { backgroundColor: 'black' }
      })))
      expect(rendered.style.backgroundColor).toEqual('black')
    })

    it('should support custom styles for each Grid', () => {
      const rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 2,
        fixedRowCount: 1,
        styleBottomLeftGrid: { backgroundColor: 'green' },
        styleBottomRightGrid: { backgroundColor: 'red' },
        styleTopLeftGrid: { backgroundColor: 'blue' },
        styleTopRightGrid: { backgroundColor: 'purple' }
      })))
      const grids = rendered.querySelectorAll('.ReactVirtualized__Grid')
      const topLeftGrid = grids[0]
      const topRightGrid = grids[1]
      const bottomLeftGrid = grids[2]
      const bottomRightGrid = grids[3]
      expect(topLeftGrid.style.backgroundColor).toEqual('blue')
      expect(topRightGrid.style.backgroundColor).toEqual('purple')
      expect(bottomLeftGrid.style.backgroundColor).toEqual('green')
      expect(bottomRightGrid.style.backgroundColor).toEqual('red')
    })
  })
})
