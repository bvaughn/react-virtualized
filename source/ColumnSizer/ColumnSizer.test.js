import React from 'react'
import ColumnSizer from './ColumnSizer'
import Grid from '../Grid'
import test from 'tape'
import { mount } from 'enzyme'

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

test('ColumnSizer should distribute column widths evenly if no min/max boundaries have been set', (assert) => {
  const mounted = mount(getMarkup())
  assert.ok(mounted.find('.debug').text().includes('columnWidth:20'))
  assert.end()
})

test('ColumnSizer should respect :columnMaxWidth if specified', (assert) => {
  const mounted = mount(getMarkup({
    columnMaxWidth: 10
  }))
  assert.ok(mounted.find('.debug').text().includes('columnWidth:10'))
  assert.end()
})

test('ColumnSizer should respect :columnMinWidth if specified', (assert) => {
  const mounted = mount(getMarkup({
    columnMinWidth: 30
  }))
  assert.ok(mounted.find('.debug').text().includes('columnWidth:30'))
  assert.end()
})

test('ColumnSizer should notify the child Grid to recompute its metadata sizes if any relevant constraints change', (assert) => {
  const mounted = mount(getMarkup())
  mounted.setProps({
    columnMinWidth: 30
  })
  assert.ok(mounted.find('.debug').text().includes('columnWidth:30'))
  mounted.setProps({
    columnMaxWidth: 15
  })
  assert.ok(mounted.find('.debug').text().includes('columnWidth:15'))
  mounted.setProps({
    columnMinWidth: undefined,
    columnMaxWidth: undefined,
    width: 100
  })
  assert.ok(mounted.find('.debug').text().includes('columnWidth:10'))
  assert.end()
})

test('ColumnSizer should pass the :width as :adjustedWidth if columns require more than the :width to be displayed', (assert) => {
  const mounted = mount(getMarkup({
    columnMinWidth: 30
  }))
  assert.ok(mounted.find('.debug').text().includes('adjustedWidth:200'))
  assert.end()
})

test('ColumnSizer should pass an :adjustedWidth if columns require less than the :width to be displayed', (assert) => {
  const mounted = mount(getMarkup({
    columnMaxWidth: 10
  }))
  assert.ok(mounted.find('.debug').text().includes('adjustedWidth:100'))
  assert.end()
})
