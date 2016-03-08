import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import ColumnSizer from './ColumnSizer'
import Grid from '../Grid'

describe('ColumnSizer', () => {
  function getMarkup ({
    columnMinWidth = undefined,
    columnMaxWidth = undefined,
    columnsCount = 10,
    width = 200
  } = {}) {
    function renderCell ({ columnIndex, rowIndex }) {
      return (
        <div className='gridItem'>
          {`row:${rowIndex}, column:${columnIndex}`}
        </div>
      )
    }

    return (
      <ColumnSizer
        columnMinWidth={columnMinWidth}
        columnMaxWidth={columnMaxWidth}
        columnsCount={columnsCount}
        width={width}
      >
        {({ adjustedWidth, getColumnWidth, registerChild }) => (
          <div>
            <Grid
              columnsCount={columnsCount}
              columnWidth={getColumnWidth}
              height={50}
              ref={registerChild}
              renderCell={renderCell}
              rowHeight={50}
              rowsCount={1}
              width={adjustedWidth}
            />
            <div className='debug'>
              {`adjustedWidth:${adjustedWidth} columnWidth:${getColumnWidth()}`}
            </div>
          </div>
        )}
      </ColumnSizer>
    )
  }

  it('should distribute column widths evenly if no min/max boundaries have been set', () => {
    const rendered = findDOMNode(render(getMarkup()))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:20')
  })

  it('should respect :columnMaxWidth if specified', () => {
    const rendered = findDOMNode(render(getMarkup({
      columnMaxWidth: 10
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:10')
  })

  it('should respect :columnMinWidth if specified', () => {
    const rendered = findDOMNode(render(getMarkup({
      columnMinWidth: 30
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:30')
  })

  it('should notify the child Grid to recompute its metadata sizes if any relevant constraints change', () => {
    let rendered
    render(getMarkup())
    rendered = findDOMNode(render(getMarkup({
      columnMinWidth: 30
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:30')
    rendered = findDOMNode(render(getMarkup({
      columnMaxWidth: 15
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:15')
    rendered = findDOMNode(render(getMarkup({
      width: 100
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:10')
  })

  it('should pass the :width as :adjustedWidth if columns require more than the :width to be displayed', () => {
    const rendered = findDOMNode(render(getMarkup({
      columnMinWidth: 30
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('adjustedWidth:200')
  })

  it('should pass an :adjustedWidth if columns require less than the :width to be displayed', () => {
    const rendered = findDOMNode(render(getMarkup({
      columnMaxWidth: 10
    })))
    expect(rendered.querySelector('.debug').textContent).toContain('adjustedWidth:100')
  })
})
