import React from 'react'
import { findDOMNode } from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Grid from './Grid'

const NUM_ROWS = 100
const NUM_COLUMNS = 50

describe('Grid', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  // Used by the renderOrUpdateGrid() helper method
/*
  var node = null
  beforeEach(() => node = document.createElement('div'))
*/

  function getMarkup ({
    className = undefined,
    columnsCount = NUM_COLUMNS,
    columnWidth = 50,
    height = 100,
    noContentRenderer = undefined,
    onSectionRendered = undefined,
    rowHeight = 20,
    rowsCount = NUM_ROWS,
    scrollToColumn = undefined,
    scrollToRow = undefined,
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
      <Grid
        className={className}
        columnsCount={columnsCount}
        columnWidth={columnWidth}
        height={height}
        noContentRenderer={noContentRenderer}
        onSectionRendered={onSectionRendered}
        renderCell={renderCell}
        rowHeight={rowHeight}
        rowsCount={rowsCount}
        scrollToColumn={scrollToColumn}
        scrollToRow={scrollToRow}
        width={width}
      />
    )
  }

  function renderGrid (props) {
    const grid = TestUtils.renderIntoDocument(getMarkup(props))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return grid
  }

/*
  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // TestUtils.renderIntoDocument creates a new component/instance each time
  function renderOrUpdateGrid (props) {
    let grid = render(getMarkup(props), node)

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return findDOMNode(grid)
  }
*/

  describe('number of rendered children', () => {
    it('should render enough children to fill the available area', () => {
      const node = findDOMNode(renderGrid())
      expect(node.querySelectorAll('.gridItem').length).toEqual(20) // 5 rows x 4 columns
    })

    it('should not render more rows than available if the area is not filled', () => {
      const node = findDOMNode(renderGrid({ rowsCount: 2 }))
      expect(node.querySelectorAll('.gridItem').length).toEqual(8) // 2 rows x 4 columns
    })

    it('should not render more columns than available if the area is not filled', () => {
      const node = findDOMNode(renderGrid({ columnsCount: 2 }))
      expect(node.querySelectorAll('.gridItem').length).toEqual(10) // 5 rows x 2 columns
    })
  })

  /** Tests scrolling via initial props */
  describe(':scrollToColumn and :scrollToRow', () => {
    it('should scroll to the left', () => {
      const grid = renderGrid({ scrollToColumn: 0 })
      expect(grid.state.scrollLeft).toEqual(0)
    })

    it('should scroll over to the middle', () => {
      const grid = renderGrid({ scrollToColumn: 24 })
      // 100 columns * 50 item width = 5,000 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(grid.state.scrollLeft).toEqual(1050)
    })

    it('should scroll to the far right', () => {
      const grid = renderGrid({ scrollToColumn: 49 })
      // 100 columns * 50 item width = 5,000 total item width
      // Target offset for the last item then is 5,000 - 200
      expect(grid.state.scrollLeft).toEqual(2300)
    })

    it('should scroll to the top', () => {
      const grid = renderGrid({ scrollToRow: 0 })
      expect(grid.state.scrollTop).toEqual(0)
    })

    it('should scroll down to the middle', () => {
      const grid = renderGrid({ scrollToRow: 49 })
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(grid.state.scrollTop).toEqual(900)
    })

    it('should scroll to the bottom', () => {
      const grid = renderGrid({ scrollToRow: 99 })
      // 100 rows * 20 item height = 2,000 total item height
      // Target offset for the last item then is 2,000 - 100
      expect(grid.state.scrollTop).toEqual(1900)
    })
  })
})

// TODO Add more tests
