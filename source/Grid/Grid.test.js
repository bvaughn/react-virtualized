import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { Simulate } from 'react-addons-test-utils'
import Grid from './Grid'

const NUM_ROWS = 100
const NUM_COLUMNS = 50

describe('Grid', () => {
  function getMarkup ({
    className,
    columnsCount = NUM_COLUMNS,
    columnsLocked,
    columnWidth = 50,
    height = 100,
    noContentRenderer,
    onSectionRendered,
    onScroll,
    overscanColumnsCount = 0,
    overscanRowsCount = 0,
    rowHeight = 20,
    rowsLocked,
    rowsCount = NUM_ROWS,
    scrollLeft = undefined,
    scrollToColumn,
    scrollToRow,
    scrollTop = undefined,
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
        columnsLocked={columnsLocked}
        height={height}
        noContentRenderer={noContentRenderer}
        onSectionRendered={onSectionRendered}
        onScroll={onScroll}
        overscanColumnsCount={overscanColumnsCount}
        overscanRowsCount={overscanRowsCount}
        renderCell={renderCell}
        rowHeight={rowHeight}
        rowsCount={rowsCount}
        rowsLocked={rowsLocked}
        scrollLeft={scrollLeft}
        scrollToColumn={scrollToColumn}
        scrollToRow={scrollToRow}
        scrollTop={scrollTop}
        width={width}
      />
    )
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the available area', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(20) // 5 rows x 4 columns
    })

    it('should not render more rows than available if the area is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({ rowsCount: 2 })))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(8) // 2 rows x 4 columns
    })

    it('should not render more columns than available if the area is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({ columnsCount: 2 })))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(10) // 5 rows x 2 columns
    })
  })

  describe('shows and hides scrollbars based on rendered content', () => {
    it('should set overflowX:hidden on scroll-container if columns fit within the available width', () => {
      const rendered = findDOMNode(render(getMarkup({ columnsCount: 4 })))
      expect(rendered.style.overflowX).toEqual('hidden')
    })

    it('should leave overflowX:auto on scroll-container if columns require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({ columnsCount: 25 })))
      expect(rendered.style.overflowX).not.toEqual('hidden')
    })

    it('should set overflowY:hidden on scroll-container if rows fit within the available height', () => {
      const rendered = findDOMNode(render(getMarkup({ rowsCount: 5 })))
      expect(rendered.style.overflowY).toEqual('hidden')
    })

    it('should leave overflowY:auto on scroll-container if rows require more than the available height', () => {
      const rendered = findDOMNode(render(getMarkup({ rowsCount: 25 })))
      expect(rendered.style.overflowY).not.toEqual('hidden')
    })
  })

  /** Tests scrolling via initial props */
  describe(':scrollToColumn and :scrollToRow', () => {
    it('should scroll to the left', () => {
      const grid = render(getMarkup({ scrollToColumn: 0 }))
      expect(grid.state.scrollLeft).toEqual(0)
    })

    it('should scroll over to the middle', () => {
      const grid = render(getMarkup({ scrollToColumn: 24 }))
      // 100 columns * 50 item width = 5,000 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(grid.state.scrollLeft).toEqual(1050)
    })

    it('should scroll to the far right', () => {
      const grid = render(getMarkup({ scrollToColumn: 49 }))
      // 100 columns * 50 item width = 5,000 total item width
      // Target offset for the last item then is 5,000 - 200
      expect(grid.state.scrollLeft).toEqual(2300)
    })

    it('should scroll to the top', () => {
      const grid = render(getMarkup({ scrollToRow: 0 }))
      expect(grid.state.scrollTop).toEqual(0)
    })

    it('should scroll down to the middle', () => {
      const grid = render(getMarkup({ scrollToRow: 49 }))
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(grid.state.scrollTop).toEqual(900)
    })

    it('should scroll to the bottom', () => {
      const grid = render(getMarkup({ scrollToRow: 99 }))
      // 100 rows * 20 item height = 2,000 total item height
      // Target offset for the last item then is 2,000 - 100
      expect(grid.state.scrollTop).toEqual(1900)
    })
  })

  describe('property updates', () => {
    it('should update :scrollToColumn position when :columnWidth changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToColumn: 25 })))
      expect(grid.textContent).toContain('column:25')
      // Making columns taller pushes name off/beyond the scrolled area
      grid = findDOMNode(render(getMarkup({ scrollToColumn: 25, columnWidth: 20 })))
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :rowHeight changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToRow: 50 })))
      expect(grid.textContent).toContain('row:50')
      // Making rows taller pushes name off/beyond the scrolled area
      grid = findDOMNode(render(getMarkup({ scrollToRow: 50, rowHeight: 20 })))
      expect(grid.textContent).toContain('row:50')
    })

    it('should update :scrollToColumn position when :height changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToColumn: 25 })))
      expect(grid.textContent).toContain('column:25')
      // Making the grid narrower leaves only room for 1 item
      grid = findDOMNode(render(getMarkup({ scrollToColumn: 25, width: 50 })))
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :height changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToRow: 50 })))
      expect(grid.textContent).toContain('row:50')
      // Making the grid shorter leaves only room for 1 item
      grid = findDOMNode(render(getMarkup({ scrollToRow: 50, height: 20 })))
      expect(grid.textContent).toContain('row:50')
    })

    it('should update :scrollToColumn position when :scrollToColumn changes', () => {
      let grid = findDOMNode(render(getMarkup()))
      expect(grid.textContent).not.toContain('column:25')
      grid = findDOMNode(render(getMarkup({ scrollToColumn: 25 })))
      expect(grid.textContent).toContain('column:25')
    })

    it('should update :scrollToRow position when :scrollToRow changes', () => {
      let grid = findDOMNode(render(getMarkup()))
      expect(grid.textContent).not.toContain('row:50')
      grid = findDOMNode(render(getMarkup({ scrollToRow: 50 })))
      expect(grid.textContent).toContain('row:50')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToColumn: 250 })))
      grid = findDOMNode(render(getMarkup()))
      grid = findDOMNode(render(getMarkup({ scrollToColumn: 250, columnsCount: 10 })))
      expect(grid.textContent).toContain('column:9')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToRow: 500 })))
      grid = findDOMNode(render(getMarkup()))
      grid = findDOMNode(render(getMarkup({ scrollToRow: 500, rowsCount: 10 })))
      expect(grid.textContent).toContain('row:9')
    })
  })

  describe('noContentRenderer', () => {
    it('should call :noContentRenderer if :columnsCount is 0', () => {
      let list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        columnsCount: 0
      })))
      expect(list.textContent).toEqual('No data')
    })

    it('should call :noContentRenderer if :rowsCount is 0', () => {
      let list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        rowsCount: 0
      })))
      expect(list.textContent).toEqual('No data')
    })

    it('should render an empty body if :columnsCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(render(getMarkup({
        columnsCount: 0
      })))
      expect(list.textContent).toEqual('')
    })

    it('should render an empty body if :rowsCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(render(getMarkup({
        rowsCount: 0
      })))
      expect(list.textContent).toEqual('')
    })
  })

  describe('onSectionRendered', () => {
    it('should call :onSectionRendered if at least one cell is rendered', () => {
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
      render(getMarkup({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params)
      }))
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
      render(getMarkup({ onSectionRendered }))
      expect(numCalls).toEqual(1)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
      render(getMarkup({ onSectionRendered }))
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
      render(getMarkup({ onSectionRendered }))
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
      render(getMarkup({
        height: 50,
        onSectionRendered
      }))
      expect(numCalls).toEqual(2)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(2)
      render(getMarkup({
        height: 50,
        onSectionRendered,
        width: 100
      }))
      expect(numCalls).toEqual(3)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(1)
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(2)
    })

    it('should not call :onSectionRendered if no cells are rendered', () => {
      let numCalls = 0
      render(getMarkup({
        height: 0,
        onSectionRendered: params => numCalls++
      }))
      expect(numCalls).toEqual(0)
    })
  })

  describe(':scrollLeft and :scrollTop properties', () => {
    it('should render correctly when an initial :scrollLeft and :scrollTop properties are specified', () => {
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
      render(getMarkup({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params),
        scrollLeft: 250,
        scrollTop: 100
      }))
      expect(rowStartIndex).toEqual(5)
      expect(rowStopIndex).toEqual(9)
      expect(columnStartIndex).toEqual(5)
      expect(columnStopIndex).toEqual(8)
    })

    it('should render correctly when :scrollLeft and :scrollTop properties are updated', () => {
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex

      render(getMarkup({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params)
      }))
      expect(rowStartIndex).toEqual(0)
      expect(rowStopIndex).toEqual(4)
      expect(columnStartIndex).toEqual(0)
      expect(columnStopIndex).toEqual(3)

      render(getMarkup({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params),
        scrollLeft: 250,
        scrollTop: 100
      }))
      expect(rowStartIndex).toEqual(5)
      expect(rowStopIndex).toEqual(9)
      expect(columnStartIndex).toEqual(5)
      expect(columnStopIndex).toEqual(8)
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.className).toEqual('Grid')
    })

    it('should use a custom :className if specified', () => {
      const rendered = findDOMNode(render(getMarkup({ className: 'foo' })))
      expect(rendered.className).toContain('foo')
    })
  })

  describe('onScroll', () => {
    function helper ({ grid, scrollLeft, scrollTop }) {
      const target = { scrollLeft, scrollTop }
      grid.refs.scrollingContainer = target // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(grid), { target })
    }

    it('should trigger callback when component is mounted', () => {
      const onScrollCalls = []
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params),
        scrollLeft: 50,
        scrollTop: 100
      }))
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 50,
        scrollTop: 100,
        scrollWidth: 2500
      }])
    })

    it('should trigger callback when component scrolls horizontally', () => {
      const onScrollCalls = []
      const grid = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      helper({
        grid,
        scrollLeft: 100,
        scrollTop: 0
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 100,
        scrollTop: 0,
        scrollWidth: 2500
      })
    })

    it('should trigger callback when component scrolls vertically', () => {
      const onScrollCalls = []
      const grid = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      helper({
        grid,
        scrollLeft: 0,
        scrollTop: 100
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 100,
        scrollWidth: 2500
      })
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
      render(getMarkup({
        onSectionRendered: helper.onSectionRendered
      }))
      expect(helper.columnOverscanStartIndex()).toEqual(helper.columnStartIndex())
      expect(helper.columnOverscanStopIndex()).toEqual(helper.columnStopIndex())
      expect(helper.rowOverscanStartIndex()).toEqual(helper.rowStartIndex())
      expect(helper.rowOverscanStopIndex()).toEqual(helper.rowStopIndex())
    })

    it('should overscan the specified amount', () => {
      const helper = createHelper()
      render(getMarkup({
        onSectionRendered: helper.onSectionRendered,
        overscanColumnsCount: 2,
        overscanRowsCount: 5,
        scrollToColumn: 25,
        scrollToRow: 50
      }))
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
      render(getMarkup({
        onSectionRendered: helper.onSectionRendered,
        columnsCount: 6,
        overscanColumnsCount: 10,
        overscanRowsCount: 10,
        rowsCount: 5
      }))
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
