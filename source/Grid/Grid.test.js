import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate } from 'react-addons-test-utils'
import { render } from '../TestUtils'
import Grid from './Grid'

const NUM_ROWS = 100
const NUM_COLUMNS = 50

describe('Grid', () => {
  function defaultCellRenderer ({ columnIndex, rowIndex }) {
    return (
      <div className='gridItem'>
        {`row:${rowIndex}, column:${columnIndex}`}
      </div>
    )
  }

  function simulateScroll ({
    grid,
    scrollLeft = 0,
    scrollTop = 0
  }) {
    const target = { scrollLeft, scrollTop }
    grid.refs.scrollingContainer = target // HACK to work around _onScroll target check
    Simulate.scroll(findDOMNode(grid), { target })
  }

  function getMarkup ({
    cellRenderer = defaultCellRenderer,
    cellRangeRenderer,
    className,
    columnCount = NUM_COLUMNS,
    columnWidth = 50,
    estimatedColumnSize,
    estimatedRowSize,
    height = 100,
    noContentRenderer,
    onSectionRendered,
    onScroll,
    overscanColumnCount = 0,
    overscanRowCount = 0,
    rowHeight = 20,
    rowCount = NUM_ROWS,
    rowClassName = null,
    scrollLeft,
    scrollToAlignment,
    scrollToColumn,
    scrollToRow,
    scrollTop,
    style,
    width = 200
  } = {}) {
    return (
      <Grid
        cellRenderer={cellRenderer || defaultCellRenderer}
        cellRangeRenderer={cellRangeRenderer}
        className={className}
        columnCount={columnCount}
        columnWidth={columnWidth}
        estimatedColumnSize={estimatedColumnSize}
        estimatedRowSize={estimatedRowSize}
        height={height}
        noContentRenderer={noContentRenderer}
        onSectionRendered={onSectionRendered}
        onScroll={onScroll}
        overscanColumnCount={overscanColumnCount}
        overscanRowCount={overscanRowCount}
        rowHeight={rowHeight}
        rowCount={rowCount}
        rowClassName={rowClassName}
        scrollLeft={scrollLeft}
        scrollToAlignment={scrollToAlignment}
        scrollToColumn={scrollToColumn}
        scrollToRow={scrollToRow}
        scrollTop={scrollTop}
        style={style}
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
      const rendered = findDOMNode(render(getMarkup({ rowCount: 2 })))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(8) // 2 rows x 4 columns
    })

    it('should not render more columns than available if the area is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({ columnCount: 2 })))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(10) // 5 rows x 2 columns
    })

    // Small performance tweak added in 5.5.6
    it('should not render/parent cells that are null or false', () => {
      function cellRenderer ({ columnIndex, rowIndex }) {
        if (columnIndex === 0) {
          return null
        } else if (rowIndex === 0) {
          return false
        } else {
          return `row:${rowIndex}, column:${columnIndex}`
        }
      }
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 3,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowCount: 3,
        cellRenderer
      })))
      expect(rendered.querySelectorAll('.Grid__cell').length).toEqual(4) // [1,1], [1,2], [2,1], and [2,2]
      expect(rendered.textContent).not.toContain('column:0')
      expect(rendered.textContent).not.toContain('row:0')
    })
  })

  describe('shows and hides scrollbars based on rendered content', () => {
    let scrollbarSize

    beforeAll(() => {
      scrollbarSize = getScrollbarSize()
    })

    it('should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 4,
        rowCount: 5
      })))
      expect(rendered.style.overflowX).toEqual('hidden')
    })

    it('should set overflowX:hidden if columns and y-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 4,
        width: 200 + scrollbarSize
      })))
      expect(rendered.style.overflowX).toEqual('hidden')
    })

    it('should leave overflowX:auto if columns require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 4,
        width: 200 - 1,
        rowCount: 5
      })))
      expect(rendered.style.overflowX).not.toEqual('hidden')
    })

    it('should leave overflowX:auto if columns and y-axis scrollbar require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 4,
        width: 200 + scrollbarSize - 1
      })))
      expect(rendered.style.overflowX).not.toEqual('hidden')
    })

    it('should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 5,
        columnCount: 4
      })))
      expect(rendered.style.overflowY).toEqual('hidden')
    })

    it('should set overflowY:hidden if rows and x-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 5,
        height: 100 + scrollbarSize
      })))
      expect(rendered.style.overflowY).toEqual('hidden')
    })

    it('should leave overflowY:auto if rows require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 5,
        height: 100 - 1,
        columnCount: 4
      })))
      expect(rendered.style.overflowY).not.toEqual('hidden')
    })

    it('should leave overflowY:auto if rows and x-axis scrollbar require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 5,
        height: 100 + scrollbarSize - 1
      })))
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

    it('should scroll to a row and column just added', () => {
      let grid = render(getMarkup())
      expect(grid.state.scrollLeft).toEqual(0)
      expect(grid.state.scrollTop).toEqual(0)
      grid = render(getMarkup({
        columnCount: NUM_COLUMNS + 1,
        rowCount: NUM_ROWS + 1,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }))
      expect(grid.state.scrollLeft).toEqual(2350)
      expect(grid.state.scrollTop).toEqual(1920)
    })

    it('should scroll back to a newly-added cell without a change in prop', () => {
      let grid = render(getMarkup({
        columnCount: NUM_COLUMNS,
        rowCount: NUM_ROWS,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }))
      grid = render(getMarkup({
        columnCount: NUM_COLUMNS + 1,
        rowCount: NUM_ROWS + 1,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }))
      expect(grid.state.scrollLeft).toEqual(2350)
      expect(grid.state.scrollTop).toEqual(1920)
    })

    it('should scroll to the correct position for :scrollToAlignment "start"', () => {
      const grid = render(getMarkup({
        scrollToAlignment: 'start',
        scrollToColumn: 24,
        scrollToRow: 49
      }))
      // 100 columns * 50 item width = 5,000 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // 4 columns and 5 rows can be visible at a time.
      // The minimum amount of scrolling leaves the specified cell in the bottom/right corner (just scrolled into view).
      // Since alignment is set to "start" we should scroll past this point until the cell is aligned top/left.
      expect(grid.state.scrollLeft).toEqual(1200)
      expect(grid.state.scrollTop).toEqual(980)
    })

    it('should scroll to the correct position for :scrollToAlignment "end"', () => {
      render(getMarkup({
        scrollToColumn: 99,
        scrollToRow: 99
      }))
      const grid = render(getMarkup({
        scrollToAlignment: 'end',
        scrollToColumn: 24,
        scrollToRow: 49
      }))
      // 100 columns * 50 item width = 5,000 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // We first scroll past the specified cell and then back.
      // The minimum amount of scrolling then should leave the specified cell in the top/left corner (just scrolled into view).
      // Since alignment is set to "end" we should scroll past this point until the cell is aligned bottom/right.
      expect(grid.state.scrollLeft).toEqual(1050)
      expect(grid.state.scrollTop).toEqual(900)
    })

    it('should scroll to the correct position for :scrollToAlignment "center"', () => {
      render(getMarkup({
        scrollToColumn: 99,
        scrollToRow: 99
      }))
      const grid = render(getMarkup({
        scrollToAlignment: 'center',
        scrollToColumn: 24,
        scrollToRow: 49
      }))
      // 100 columns * 50 item width = 5,000 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // We first scroll past the specified cell and then back.
      // The minimum amount of scrolling then should leave the specified cell in the middle (just scrolled into view).
      // Since alignment is set to "center" we should scroll past this point until the cell is aligned center.
      expect(grid.state.scrollLeft).toEqual(1075)
      expect(grid.state.scrollTop).toEqual(920)
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

    it('should update :scrollToColumn position when :width changes', () => {
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
      grid = findDOMNode(render(getMarkup({ scrollToColumn: 250, columnCount: 10 })))
      expect(grid.textContent).toContain('column:9')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToRow: 500 })))
      grid = findDOMNode(render(getMarkup()))
      grid = findDOMNode(render(getMarkup({ scrollToRow: 500, rowCount: 10 })))
      expect(grid.textContent).toContain('row:9')
    })
  })

  describe('noContentRenderer', () => {
    it('should call :noContentRenderer if :columnCount is 0', () => {
      let list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        columnCount: 0
      })))
      expect(list.textContent).toEqual('No data')
    })

    it('should call :noContentRenderer if :rowCount is 0', () => {
      let list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        rowCount: 0
      })))
      expect(list.textContent).toEqual('No data')
    })

    it('should render an empty body if :columnCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(render(getMarkup({
        columnCount: 0
      })))
      expect(list.textContent).toEqual('')
    })

    it('should render an empty body if :rowCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(render(getMarkup({
        rowCount: 0
      })))
      expect(list.textContent).toEqual('')
    })

    it('should render an empty body there is a :noContentRenderer but :height or :width are 0', () => {
      let list = findDOMNode(render(getMarkup({
        height: 0,
        noContentRenderer: () => <div>No data</div>
      })))
      expect(list.textContent).toEqual('')
      list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        width: 0
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

    it('should use a custom :style if specified', () => {
      const style = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ style })))
      expect(rendered.style.backgroundColor).toEqual('red')
    })

    it('should use the expected global CSS classNames for rows', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1
      })))
      const rows = Array.from(rendered.querySelectorAll('.Grid__cell')).map(row => {
        return row.className === 'Grid__cell'
      })
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :rowClassName if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1,
        rowClassName: 'foo'
      })))
      const rows = Array.from(rendered.querySelectorAll('.Grid__cell')).map(row => {
        return row.classList.contains('foo')
      })
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :rowClassName if function specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1,
        rowClassName: () => 'foo'
      })))
      const rows = Array.from(rendered.querySelectorAll('.Grid__cell')).map(row => {
        return row.classList.contains('foo')
      })
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })
  })

  describe('onScroll', () => {
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
      simulateScroll({
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
      simulateScroll({
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

    it('should trigger callback with scrollLeft of 0 when total columns width is less than width', () => {
      const onScrollCalls = []
      const grid = render(getMarkup({
        columnCount: 1,
        columnWidth: 50,
        onScroll: params => onScrollCalls.push(params),
        scrollLeft: 0,
        scrollTop: 10,
        width: 200
      }))
      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 50
      })
    })

    it('should trigger callback with scrollTop of 0 when total rows height is less than height', () => {
      const onScrollCalls = []
      const grid = render(getMarkup({
        rowCount: 1,
        rowHeight: 50,
        onScroll: params => onScrollCalls.push(params),
        scrollLeft: 0,
        scrollTop: 10,
        height: 200
      }))
      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 200,
        clientWidth: 200,
        scrollHeight: 50,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 2500
      })
    })
  })

  describe('overscanRowCount', () => {
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
        overscanColumnCount: 2,
        overscanRowCount: 5,
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
        columnCount: 6,
        overscanColumnCount: 10,
        overscanRowCount: 10,
        rowCount: 5
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

  describe('cellRangeRenderer', () => {
    it('should use a custom :cellRangeRenderer if specified', () => {
      let cellRangeRendererCalled = 0
      let cellRangeRendererParams
      const rendered = findDOMNode(render(getMarkup({
        cellRangeRenderer: (params) => {
          cellRangeRendererParams = params
          cellRangeRendererCalled++

          return [
            <div key='0'>Fake content</div>
          ]
        }
      })))
      expect(cellRangeRendererCalled).toEqual(1)
      expect(cellRangeRendererParams.columnStartIndex).toEqual(0)
      expect(cellRangeRendererParams.columnStopIndex).toEqual(3)
      expect(cellRangeRendererParams.rowStartIndex).toEqual(0)
      expect(cellRangeRendererParams.rowStopIndex).toEqual(4)
      expect(rendered.textContent).toContain('Fake content')
    })
  })

  describe('estimated row and column sizes', () => {
    it('should not estimate sizes if actual sizes are numbers', () => {
      const grid = render(getMarkup({
        columnWidth: 100,
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        rowHeight: 20
      }))
      expect(grid._getEstimatedColumnSize(grid.props)).toEqual(100)
      expect(grid._getEstimatedRowSize(grid.props)).toEqual(20)
    })

    it('should estimate row and column sizes if actual sizes are functions', () => {
      const grid = render(getMarkup({
        columnWidth: () => 100,
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        rowHeight: () => 20
      }))
      expect(grid._getEstimatedColumnSize(grid.props)).toEqual(150)
      expect(grid._getEstimatedRowSize(grid.props)).toEqual(15)
    })
  })

  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', () => {
    const cellRendererCalls = []
    function cellRenderer ({ columnIndex, isScrolling, rowIndex }) {
      cellRendererCalls.push(isScrolling)
      return defaultCellRenderer({ columnIndex, rowIndex })
    }
    const grid = render(getMarkup({
      cellRenderer
    }))
    expect(cellRendererCalls[0]).toEqual(false)
    cellRendererCalls.splice(0)
    simulateScroll({ grid, scrollTop: 100 })
    expect(cellRendererCalls[0]).toEqual(true)
  })

  describe('cell caching', () => {
    it('should not cache cells if the Grid is not scrolling', () => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, rowIndex }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, rowIndex })
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollToRow: 0,
        width: 100
      }

      render(getMarkup({
        ...props,
        scrollToRow: 0
      }))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ])

      cellRendererCalls.splice(0)

      render(getMarkup({
        ...props,
        scrollToRow: 1
      }))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ])
    })

    it('should cache a cell once it has been rendered while scrolling', () => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, rowIndex }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, rowIndex })
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollToRow: 0,
        width: 100
      }

      const grid = render(getMarkup({
        ...props,
        scrollToRow: 0
      }))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ])

      simulateScroll({ grid, scrollTop: 1 })

      cellRendererCalls.splice(0)

      // Row 1 is already visible so no new cells are rendered
      render(getMarkup({
        ...props,
        scrollToRow: 1
      }))
      expect(cellRendererCalls).toEqual([])

      // Row 2 is not yet visible so 1 new cell must be rendered
      render(getMarkup({
        ...props,
        scrollToRow: 2
      }))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 2 }
      ])
    })

    it('should clear cache once :isScrolling is false', async (done) => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, rowIndex }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, rowIndex })
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollToRow: 0,
        width: 100
      }

      const grid = render(getMarkup(props))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ])

      simulateScroll({ grid, scrollTop: 1 })

      // Allow scrolling timeout to complete so that cell cache is reset
      await new Promise(resolve => setTimeout(resolve, 500))

      cellRendererCalls.splice(0)

      render(getMarkup({
        ...props,
        scrollToRow: 1
      }))
      expect(cellRendererCalls.length).not.toEqual(0)

      done()
    })
  })

  describe('measureAllCells', () => {
    it('should measure any unmeasured columns and rows', () => {
      const grid = render(getMarkup({
        columnCount: 10,
        columnWidth: () => 100,
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: () => 20,
        width: 0
      }))
      expect(grid._columnSizeAndPositionManager.getTotalSize()).toEqual(1500)
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150)
      grid.measureAllCells()
      expect(grid._columnSizeAndPositionManager.getTotalSize()).toEqual(1000)
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200)
    })
  })

  describe('recomputeGridSize', () => {
    it('should recompute cell sizes and other values when called', () => {
      let highestColumnIndex = 0
      let highestRowIndex = 0
      function columnWidth ({ index }) {
        highestColumnIndex = Math.max(index, highestColumnIndex)
        return 10
      }
      function rowHeight ({ index }) {
        highestRowIndex = Math.max(index, highestRowIndex)
        return 10
      }
      const props = {
        columnCount: 50,
        columnWidth,
        height: 50,
        rowHeight,
        rowCount: 50,
        width: 100
      }
      const component = render(getMarkup(props))
      highestColumnIndex = 0
      highestRowIndex = 0
      component.recomputeGridSize()
      // Cells won't actually be remeasured until the Grid is next rendered.
      render(getMarkup({
        ...props,
        rowCount: 51
      }))
      // And then only the rows necessary to fill the visible region.
      expect(highestColumnIndex).toEqual(9)
      expect(highestRowIndex).toEqual(4)
    })
  })
})
