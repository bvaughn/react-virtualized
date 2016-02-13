import React from 'react'
import { findDOMNode, render } from 'react-dom'
import { renderIntoDocument, Simulate } from 'react-addons-test-utils'
import Grid from './Grid'

const NUM_ROWS = 100
const NUM_COLUMNS = 50

describe('Grid', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  // Used by the renderOrUpdateGrid() helper method
  var node = null
  beforeEach(() => node = document.createElement('div'))

  function getMarkup ({
    className,
    columnsCount = NUM_COLUMNS,
    columnWidth = 50,
    height = 100,
    noContentRenderer,
    onSectionRendered,
    onScroll,
    overscanColumnsCount = 0,
    overscanRowsCount = 0,
    rowHeight = 20,
    rowsCount = NUM_ROWS,
    scrollToColumn,
    scrollToRow,
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
        onScroll={onScroll}
        overscanColumnsCount={overscanColumnsCount}
        overscanRowsCount={overscanRowsCount}
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
    const grid = renderIntoDocument(getMarkup(props))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return grid
  }

  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // renderIntoDocument creates a new component/instance each time
  function renderOrUpdateGrid (props) {
    let grid = render(getMarkup(props), node)

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return findDOMNode(grid)
  }

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

  describe('property updates', () => {
    it('should update :scrollToColumn position when :columnWidth changes', () => {
      let grid = renderOrUpdateGrid({ scrollToColumn: 25 })
      expect(grid.textContent).toContain('column:25')
      // Making columns taller pushes name off/beyond the scrolled area
      grid = renderOrUpdateGrid({ scrollToColumn: 25, columnWidth: 20 })
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :rowHeight changes', () => {
      let grid = renderOrUpdateGrid({ scrollToRow: 50 })
      expect(grid.textContent).toContain('row:50')
      // Making rows taller pushes name off/beyond the scrolled area
      grid = renderOrUpdateGrid({ scrollToRow: 50, rowHeight: 20 })
      expect(grid.textContent).toContain('row:50')
    })

    it('should update :scrollToColumn position when :height changes', () => {
      let grid = renderOrUpdateGrid({ scrollToColumn: 25 })
      expect(grid.textContent).toContain('column:25')
      // Making the grid narrower leaves only room for 1 item
      grid = renderOrUpdateGrid({ scrollToColumn: 25, width: 50 })
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :height changes', () => {
      let grid = renderOrUpdateGrid({ scrollToRow: 50 })
      expect(grid.textContent).toContain('row:50')
      // Making the grid shorter leaves only room for 1 item
      grid = renderOrUpdateGrid({ scrollToRow: 50, height: 20 })
      expect(grid.textContent).toContain('row:50')
    })

    it('should update :scrollToColumn position when :scrollToColumn changes', () => {
      let grid = renderOrUpdateGrid()
      expect(grid.textContent).not.toContain('column:25')
      grid = renderOrUpdateGrid({ scrollToColumn: 25 })
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :scrollToRow changes', () => {
      let grid = renderOrUpdateGrid()
      expect(grid.textContent).not.toContain('row:50')
      grid = renderOrUpdateGrid({ scrollToRow: 50 })
      expect(grid.textContent).toContain('row:50')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let grid = renderOrUpdateGrid({ scrollToColumn: 250 })
      grid = renderOrUpdateGrid()
      grid = renderOrUpdateGrid({ scrollToColumn: 250, columnsCount: 10 })
      expect(grid.textContent).toContain('column:9')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let grid = renderOrUpdateGrid({ scrollToRow: 500 })
      grid = renderOrUpdateGrid()
      grid = renderOrUpdateGrid({ scrollToRow: 500, rowsCount: 10 })
      expect(grid.textContent).toContain('row:9')
    })
  })

  describe('noContentRenderer', () => {
    it('should call :noContentRenderer if :columnsCount is 0', () => {
      let list = renderOrUpdateGrid({
        noContentRenderer: () => <div>No data</div>,
        columnsCount: 0
      })
      expect(list.textContent).toEqual('No data')
    })

    it('should call :noContentRenderer if :rowsCount is 0', () => {
      let list = renderOrUpdateGrid({
        noContentRenderer: () => <div>No data</div>,
        rowsCount: 0
      })
      expect(list.textContent).toEqual('No data')
    })

    it('should render an empty body if :columnsCount is 0 and there is no :noContentRenderer', () => {
      let list = renderOrUpdateGrid({
        columnsCount: 0
      })
      expect(list.textContent).toEqual('')
    })

    it('should render an empty body if :rowsCount is 0 and there is no :noContentRenderer', () => {
      let list = renderOrUpdateGrid({
        rowsCount: 0
      })
      expect(list.textContent).toEqual('')
    })
  })

  describe('onSectionRendered', () => {
    it('should call :onSectionRendered if at least one cell is rendered', () => {
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
      renderGrid({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params)
      })
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
    })

    it('should not call :onSectionRendered unless the column or row start or stop indices have changed', () => {
      let numCalls = 0
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
      const onSectionRendered = params => {
        columnStartIndex = params.columnStartIndex
        columnStopIndex = params.columnStopIndex
        rowStartIndex = params.rowStartIndex
        rowStopIndex = params.rowStopIndex
        numCalls++
      }
      renderOrUpdateGrid({ onSectionRendered })
      expect(numCalls).toEqual(1)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
      renderOrUpdateGrid({ onSectionRendered })
      expect(numCalls).toEqual(1)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
    })

    it('should call :onSectionRendered if the row or column start or stop indices have changed', () => {
      let numCalls = 0
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
      const onSectionRendered = params => {
        columnStartIndex = params.columnStartIndex
        columnStopIndex = params.columnStopIndex
        rowStartIndex = params.rowStartIndex
        rowStopIndex = params.rowStopIndex
        numCalls++
      }
      renderOrUpdateGrid({ onSectionRendered })
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
      renderOrUpdateGrid({
        height: 50,
        onSectionRendered
      })
      expect(numCalls).toEqual(2)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(2)
      renderOrUpdateGrid({
        height: 50,
        onSectionRendered,
        width: 100
      })
      expect(numCalls).toEqual(3)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(1)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(2)
    })

    it('should not call :onSectionRendered if no cells are rendered', () => {
      let numCalls = 0
      renderGrid({
        height: 0,
        onSectionRendered: params => numCalls++
      })
      expect(numCalls).toEqual(0)
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(renderGrid())
      expect(node.className).toEqual('Grid')
    })

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(renderGrid({ className: 'foo' }))
      expect(node.className).toContain('foo')
    })
  })

  describe('onScroll', () => {
    function helper ({ grid, scrollLeft, scrollTop }) {
      const target = { scrollLeft, scrollTop }
      grid.refs.scrollingContainer = target // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(grid), { target })
    }

    it('should trigger callback when component scrolls horizontally', () => {
      const onScrollCalls = []
      const grid = renderGrid({
        onScroll: params => onScrollCalls.push(params)
      })
      helper({
        grid,
        scrollLeft: 100,
        scrollTop: 0
      })
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 100,
        scrollTop: 0,
        scrollWidth: 2500
      }])
    })

    it('should trigger callback when component scrolls horizontally', () => {
      const onScrollCalls = []
      const grid = renderGrid({
        onScroll: params => onScrollCalls.push(params)
      })
      helper({
        grid,
        scrollLeft: 0,
        scrollTop: 100
      })
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 100,
        scrollWidth: 2500
      }])
    })
  })

  describe('overscanRowsCount', () => {
    function createHelper () {
      let columnOverscanStartIndex, columnOverscanStopIndex, columnStartIndex, columnStopIndex, rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex

      function onSectionRendered (params) {
        columnOverscanStartIndex = params.columnOverscanStartIndex
        columnOverscanStopIndex = params.columnOverscanStopIndex
        columnStartIndex = params.columnStartIndex
        columnStopIndex = params.columnStopIndex
        rowOverscanStartIndex = params.rowOverscanStartIndex
        rowOverscanStopIndex = params.rowOverscanStopIndex
        rowStartIndex = params.rowStartIndex
        rowStopIndex = params.rowStopIndex
      }

      return {
        columnOverscanStartIndex: () => columnOverscanStartIndex,
        columnOverscanStopIndex: () => columnOverscanStopIndex,
        columnStartIndex: () => columnStartIndex,
        columnStopIndex: () => columnStopIndex,
        onSectionRendered,
        rowOverscanStartIndex: () => rowOverscanStartIndex,
        rowOverscanStopIndex: () => rowOverscanStopIndex,
        rowStartIndex: () => rowStartIndex,
        rowStopIndex: () => rowStopIndex
      }
    }

    it('should not overscan if disabled', () => {
      const helper = createHelper()
      renderGrid({
        onSectionRendered: helper.onSectionRendered
      })
      expect(helper.columnOverscanStartIndex()).toEqual(helper.columnStartIndex())
      expect(helper.columnOverscanStopIndex()).toEqual(helper.columnStopIndex())
      expect(helper.rowOverscanStartIndex()).toEqual(helper.rowStartIndex())
      expect(helper.rowOverscanStopIndex()).toEqual(helper.rowStopIndex())
    })

    it('should overscan the specified amount', () => {
      const helper = createHelper()
      renderGrid({
        onSectionRendered: helper.onSectionRendered,
        overscanColumnsCount: 2,
        overscanRowsCount: 5,
        scrollToColumn: 25,
        scrollToRow: 50
      })
      expect(helper.columnOverscanStartIndex()).toEqual(20)
      expect(helper.columnOverscanStopIndex()).toEqual(27)
      expect(helper.columnStartIndex()).toEqual(22)
      expect(helper.columnStopIndex()).toEqual(25)
      expect(helper.rowOverscanStartIndex()).toEqual(41)
      expect(helper.rowOverscanStopIndex()).toEqual(55)
      expect(helper.rowStartIndex()).toEqual(46)
      expect(helper.rowStopIndex()).toEqual(50)
    })

    it('should not overscan beyond the bounds of the grid', () => {
      const helper = createHelper()
      renderGrid({
        onSectionRendered: helper.onSectionRendered,
        columnsCount: 6,
        overscanColumnsCount: 10,
        overscanRowsCount: 10,
        rowsCount: 5
      })
      expect(helper.columnOverscanStartIndex()).toEqual(0)
      expect(helper.columnOverscanStopIndex()).toEqual(5)
      expect(helper.columnStartIndex()).toEqual(0)
      expect(helper.columnStopIndex()).toEqual(3)
      expect(helper.rowOverscanStartIndex()).toEqual(0)
      expect(helper.rowOverscanStopIndex()).toEqual(4)
      expect(helper.rowStartIndex()).toEqual(0)
      expect(helper.rowStopIndex()).toEqual(4)
    })
  })

  // TODO Add tests for :scrollToCell and :setScrollPosition.
  // This probably requires the creation of an inner test-only class with refs.
})
