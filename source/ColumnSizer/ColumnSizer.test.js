import React from 'react'
import { findDOMNode, render } from 'react-dom'
import ColumnSizer from './ColumnSizer'
import Grid from '../Grid'

describe('ColumnSizer', () => {
  // Used by the renderOrUpdateGrid() helper method
  var node = null
  beforeEach(() => node = document.createElement('div'))

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

  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // renderIntoDocument creates a new component/instance each time
  function renderOrUpdateColumnSizer (props) {
    return findDOMNode(
      render(
        getMarkup(props),
        node
      )
    )
  }

  it('should distribute column widths evenly if no min/max boundaries have been set', () => {
    const node = renderOrUpdateColumnSizer()
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:20')
  })

  it('should respect :columnMaxWidth if specified', () => {
    const node = renderOrUpdateColumnSizer({
      columnMaxWidth: 10
    })
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:10')
  })

  it('should respect :columnMinWidth if specified', () => {
    const node = renderOrUpdateColumnSizer({
      columnMinWidth: 30
    })
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:30')
  })

  it('should notify the child Grid to recompute its metadata sizes if any relevant constraints change', () => {
    let node
    renderOrUpdateColumnSizer()
    node = renderOrUpdateColumnSizer({
      columnMinWidth: 30
    })
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:30')
    node = renderOrUpdateColumnSizer({
      columnMaxWidth: 15
    })
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:15')
    node = renderOrUpdateColumnSizer({
      width: 100
    })
    expect(node.querySelector('.debug').textContent).toContain('columnWidth:10')
  })

  it('should pass the :width as :adjustedWidth if columns require more than the :width to be displayed', () => {
    const node = renderOrUpdateColumnSizer({
      columnMinWidth: 30
    })
    expect(node.querySelector('.debug').textContent).toContain('adjustedWidth:200')
  })

  it('should pass an :adjustedWidth if columns require less than the :width to be displayed', () => {
    const node = renderOrUpdateColumnSizer({
      columnMaxWidth: 10
    })
    expect(node.querySelector('.debug').textContent).toContain('adjustedWidth:100')
  })
})
