import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate } from 'react-addons-test-utils'
import { render } from '../TestUtils'
import shallowCompare from 'react-addons-shallow-compare'
import Grid, { DEFAULT_SCROLLING_RESET_TIME_INTERVAL } from './Grid'
import { SCROLL_DIRECTION_BACKWARD, SCROLL_DIRECTION_FORWARD } from './utils/getOverscanIndices'

const DEFAULT_COLUMN_WIDTH = 50
const DEFAULT_HEIGHT = 100
const DEFAULT_ROW_HEIGHT = 20
const DEFAULT_WIDTH = 200
const NUM_ROWS = 100
const NUM_COLUMNS = 50

describe('Grid', () => {
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

  function simulateScroll ({
    grid,
    scrollLeft = 0,
    scrollTop = 0
  }) {
    const target = { scrollLeft, scrollTop }
    grid._scrollingContainer = target // HACK to work around _onScroll target check
    Simulate.scroll(findDOMNode(grid), { target })
  }

  function getMarkup (props = {}) {
    return (
      <Grid
        cellRenderer={defaultCellRenderer}
        columnCount={NUM_COLUMNS}
        columnWidth={DEFAULT_COLUMN_WIDTH}
        height={DEFAULT_HEIGHT}
        overscanColumnCount={0}
        overscanRowCount={0}
        autoHeight={false}
        rowHeight={DEFAULT_ROW_HEIGHT}
        rowCount={NUM_ROWS}
        width={DEFAULT_WIDTH}
        {...props}
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
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        if (columnIndex === 0) {
          return null
        } else if (rowIndex === 0) {
          return false
        } else {
          return (
            <div
              className='cell'
              key={key}
              style={style}
            >
              {`row:${rowIndex}, column:${columnIndex}`}
            </div>
          )
        }
      }
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 3,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowCount: 3,
        cellRenderer
      })))
      expect(rendered.querySelectorAll('.cell').length).toEqual(4) // [1,1], [1,2], [2,1], and [2,2]
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

    it('should accept styles that overwrite calculated ones', () => {
      const rendered = findDOMNode(render(getMarkup({
        columnCount: 1,
        height: 1,
        rowCount: 1,
        style: {
          overflowY: 'visible',
          overflowX: 'visible'
        },
        width: 1
      })))
      expect(rendered.style.overflowY).toEqual('visible')
      expect(rendered.style.overflowX).toEqual('visible')
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
      // Viewport width is 200
      // Column 24 starts at 1,200, center point at 1,225, so...
      expect(grid.state.scrollLeft).toEqual(1125)
      // 100 rows * 20 item height = 2,000 total item height
      // Viewport height is 100
      // Row 49 starts at 980, center point at 990, so...
      expect(grid.state.scrollTop).toEqual(940)
    })

    // Tests issue #218
    it('should set the correct :scrollTop after row and column counts increase from 0', () => {
      const expectedScrollTop = 100 * DEFAULT_ROW_HEIGHT - DEFAULT_HEIGHT + DEFAULT_ROW_HEIGHT
      render(getMarkup({
        columnCount: 0,
        rowCount: 150,
        scrollToRow: 100
      }))
      expect(
        findDOMNode(render(getMarkup({
          columnCount: 150,
          rowCount: 150,
          scrollToRow: 100
        }))).scrollTop
      ).toEqual(expectedScrollTop)
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

    // Sanity check for bvaughn/react-virtualized/pull/348
    it('should render an empty body if :rowCount or :columnCount changes to 0', () => {
      function noContentRenderer () {
        return <div>No data</div>
      }

      let list = findDOMNode(render(getMarkup({
        noContentRenderer
      })))
      expect(list.textContent).not.toEqual('No data')

      list = findDOMNode(render(getMarkup({
        noContentRenderer,
        rowCount: 0
      })))
      expect(list.textContent).toEqual('No data')

      list = findDOMNode(render(getMarkup({
        noContentRenderer
      })))
      expect(list.textContent).not.toEqual('No data')

      list = findDOMNode(render(getMarkup({
        columnCount: 0,
        noContentRenderer
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
      findDOMNode(render(getMarkup({
        onSectionRendered: params => ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params),
        scrollLeft: 250,
        scrollTop: 100
      })))
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

  describe('styles, classNames, and ids', () => {
    it('should use the expected global CSS classNames', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.className).toEqual('ReactVirtualized__Grid')
    })

    it('should use a custom :className if specified', () => {
      const rendered = findDOMNode(render(getMarkup({ className: 'foo' })))
      expect(rendered.className).toContain('foo')
    })

    it('should use a custom :id if specified', () => {
      const rendered = findDOMNode(render(getMarkup({ id: 'bar' })))
      expect(rendered.getAttribute('id')).toEqual('bar')
    })

    it('should use a custom :style if specified', () => {
      const style = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ style })))
      expect(rendered.style.backgroundColor).toEqual('red')
    })

    it('should use a custom :containerStyle if specified', () => {
      const containerStyle = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ containerStyle })))
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.backgroundColor).toEqual('red')
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

    // Support use-cases like WindowScroller; enable them to stay in sync with scroll-to-cell changes.
    it('should trigger when :scrollToColumn or :scrollToRow are changed via props', () => {
      const onScrollCalls = []
      render(getMarkup())
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params),
        scrollToColumn: 24,
        scrollToRow: 49
      }))
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 1050,
        scrollTop: 900,
        scrollWidth: 2500
      }])
    })
  })

  describe('overscanColumnCount & overscanRowCount', () => {
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
      expect(helper.columnOverscanStartIndex()).toEqual(22)
      expect(helper.columnOverscanStopIndex()).toEqual(27)
      expect(helper.columnStartIndex()).toEqual(22)
      expect(helper.columnStopIndex()).toEqual(25)
      expect(helper.rowOverscanStartIndex()).toEqual(46)
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

    it('should set the correct scroll direction', () => {
      // Do not pass in the initial state as props, otherwise the internal state is forbidden from
      // updating itself
      const grid = render(getMarkup())

      // Simulate a scroll to set the initial internal state
      simulateScroll({
        grid,
        scrollLeft: 50,
        scrollTop: 50
      })

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_FORWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_FORWARD)

      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      })

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_BACKWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_BACKWARD)

      simulateScroll({
        grid,
        scrollLeft: 100,
        scrollTop: 100
      })

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_FORWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_FORWARD)
    })

    it('should set the correct scroll direction when scroll position is updated from props', () => {
      let grid = render(getMarkup({
        scrollLeft: 50,
        scrollTop: 50
      }))

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_FORWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_FORWARD)

      grid = render(getMarkup({
        scrollLeft: 0,
        scrollTop: 0
      }))

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_BACKWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_BACKWARD)

      grid = render(getMarkup({
        scrollLeft: 100,
        scrollTop: 100
      }))

      expect(grid.state.scrollDirectionHorizontal).toEqual(SCROLL_DIRECTION_FORWARD)
      expect(grid.state.scrollDirectionVertical).toEqual(SCROLL_DIRECTION_FORWARD)
    })

    it('should overscan in the direction being scrolled', async (done) => {
      const helper = createHelper()

      let onSectionRenderedResolve

      function onSectionRendered (params) {
        helper.onSectionRendered(params)

        if (onSectionRenderedResolve) {
          onSectionRenderedResolve()
        }
      }

      const grid = render(getMarkup({
        onSectionRendered,
        overscanColumnCount: 2,
        overscanRowCount: 5
      }))

      // Wait until the onSectionRendered handler / debouncer has processed
      let onSectionRenderedPromise = new Promise(resolve => {
        onSectionRenderedResolve = resolve
      })

      simulateScroll({
        grid,
        scrollLeft: 200,
        scrollTop: 200
      })

      await onSectionRenderedPromise

      // It should overscan in the direction being scrolled while scroll is in progress
      expect(helper.columnOverscanStartIndex()).toEqual(4)
      expect(helper.columnOverscanStopIndex()).toEqual(9)
      expect(helper.columnStartIndex()).toEqual(4)
      expect(helper.columnStopIndex()).toEqual(7)
      expect(helper.rowOverscanStartIndex()).toEqual(10)
      expect(helper.rowOverscanStopIndex()).toEqual(19)
      expect(helper.rowStartIndex()).toEqual(10)
      expect(helper.rowStopIndex()).toEqual(14)

      // Wait until the onSectionRendered handler / debouncer has processed
      onSectionRenderedPromise = new Promise(resolve => {
        onSectionRenderedResolve = resolve
      })

      simulateScroll({
        grid,
        scrollLeft: 100,
        scrollTop: 100
      })

      await onSectionRenderedPromise

      // It reset overscan once scrolling has finished
      expect(helper.columnOverscanStartIndex()).toEqual(0)
      expect(helper.columnOverscanStopIndex()).toEqual(5)
      expect(helper.columnStartIndex()).toEqual(2)
      expect(helper.columnStopIndex()).toEqual(5)
      expect(helper.rowOverscanStartIndex()).toEqual(0)
      expect(helper.rowOverscanStopIndex()).toEqual(9)
      expect(helper.rowStartIndex()).toEqual(5)
      expect(helper.rowStopIndex()).toEqual(9)

      done()
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

  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', async (done) => {
    const cellRendererCalls = []
    function cellRenderer ({ columnIndex, isScrolling, key, rowIndex, style }) {
      cellRendererCalls.push(isScrolling)
      return defaultCellRenderer({ columnIndex, key, rowIndex, style })
    }
    const grid = render(getMarkup({
      cellRenderer
    }))
    expect(cellRendererCalls[0]).toEqual(false)
    cellRendererCalls.splice(0)

    // Give React time to process the queued setState()
    await new Promise(resolve => setTimeout(resolve, 1))

    simulateScroll({ grid, scrollTop: 100 })
    expect(cellRendererCalls[0]).toEqual(true)

    done()
  })

  it('should pass the cellRenderer an :isVisible flag', () => {
    const cellRendererCalls = []
    function cellRenderer (props) {
      cellRendererCalls.push(props)
      return defaultCellRenderer(props)
    }
    render(getMarkup({
      cellRenderer,
      height: DEFAULT_ROW_HEIGHT,
      overscanColumnCount: 1,
      overscanRowCount: 1,
      width: DEFAULT_COLUMN_WIDTH
    }))
    cellRendererCalls.forEach((props) => {
      expect(props.isVisible).toEqual(
        props.columnIndex === 0 &&
        props.rowIndex === 0
      ) // Only the first cell is visible
    })
  })

  describe('cell caching', () => {
    it('should not cache cells if the Grid is not scrolling', () => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, key, rowIndex, style })
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
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, key, rowIndex, style })
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
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

      // Rows 0-2 have already rendered but row 3 is not yet visible
      // This means that only row 3 should be newly-created
      // The others should come from the cache
      render(getMarkup({
        ...props,
        scrollToRow: 3
      }))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 3 }
      ])
    })

    it('should clear cache once :isScrolling is false', async (done) => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, key, rowIndex, style })
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
      await new Promise(resolve => setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2))

      cellRendererCalls.splice(0)

      render(getMarkup({
        ...props,
        scrollToRow: 1
      }))
      expect(cellRendererCalls.length).not.toEqual(0)

      done()
    })

    it('should clear cache if :recomputeGridSize is called', () => {
      const cellRendererCalls = []
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, key, rowIndex, style })
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollTop: 0,
        width: 100
      }

      const grid = render(getMarkup(props))
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ])

      simulateScroll({ grid, scrollTop: 1 })

      cellRendererCalls.splice(0)

      grid.recomputeGridSize()

      expect(cellRendererCalls.length).not.toEqual(0)
    })

    it('should support a custom :scrollingResetTimeInterval prop', async (done) => {
      const cellRendererCalls = []
      const scrollingResetTimeInterval = DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2
      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        cellRendererCalls.push({ columnIndex, rowIndex })
        return defaultCellRenderer({ columnIndex, key, rowIndex, style })
      }
      const props = {
        cellRenderer,
        scrollingResetTimeInterval
      }

      const grid = render(getMarkup(props))
      expect(cellRendererCalls.length > 0).toEqual(true)

      simulateScroll({ grid, scrollTop: 1 })

      await new Promise(resolve => setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL))

      cellRendererCalls.splice(0)
      render(getMarkup({
        ...props,
        className: 'foo'
      }))
      expect(cellRendererCalls.length).toEqual(0)

      await new Promise(resolve => setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2))

      cellRendererCalls.splice(0)
      render(getMarkup({
        ...props,
        className: 'bar'
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
      const columnIndices = []
      const rowIndices = []
      function columnWidth ({ index }) {
        columnIndices.push(index)
        return 10
      }
      function rowHeight ({ index }) {
        rowIndices.push(index)
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

      columnIndices.splice(0)
      rowIndices.splice(0)

      component.recomputeGridSize()

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(0)
      expect(columnIndices[columnIndices.length - 1]).toEqual(9)
      expect(rowIndices[0]).toEqual(0)
      expect(rowIndices[rowIndices.length - 1]).toEqual(4)

      columnIndices.splice(0)
      rowIndices.splice(0)

      component.recomputeGridSize({
        columnIndex: 4,
        rowIndex: 2
      })

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(4)
      expect(columnIndices[columnIndices.length - 1]).toEqual(9)
      expect(rowIndices[0]).toEqual(2)
      expect(rowIndices[rowIndices.length - 1]).toEqual(4)
    })
  })

  describe('autoContainerWidth', () => {
    it('should set the innerScrollContainer width to auto to better support single-column HOCs', () => {
      const props = {
        autoContainerWidth: true
      }
      const rendered = findDOMNode(render(getMarkup(props)))
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto')
    })

    it('should set the innerScrollContainer width to :totalColumnsWidth unless :autoContainerWidth', () => {
      const props = {
        autoContainerWidth: false
      }
      const rendered = findDOMNode(render(getMarkup(props)))
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('2500px') // 50 columns x 50px
    })
  })

  describe('autoHeight', () => {
    it('should set the container height to auto to adjust to innerScrollContainer height', () => {
      const props = {
        autoHeight: true
      }
      const rendered = findDOMNode(render(getMarkup(props)))
      expect(rendered.style.height).toEqual('auto')
    })

    it('should have container height still affecting number of rows rendered', () => {
      const props = {
        height: 500,
        autoHeight: true
      }
      const rendered = findDOMNode(render(getMarkup(props)))
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(100) // 25 rows x 4 columns
    })

    it('should have innerScrollContainer height to be equal number of rows * rowHeight', () => {
      const props = {
        autoHeight: true
      }
      const grid = render(getMarkup(props))
      const rendered = findDOMNode(grid)
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.height).toEqual('2000px') // 100 rows * 20px rowHeight
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(2000)
    })
  })

  describe('tabIndex', () => {
    it('should be focusable by default', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.tabIndex).toEqual(0)
    })

    it('should allow tabIndex to be overridden', () => {
      const rendered = findDOMNode(render(getMarkup({
        tabIndex: -1
      })))
      expect(rendered.tabIndex).toEqual(-1)
    })
  })

  describe('pure', () => {
    it('should not re-render unless props have changed', () => {
      let cellRendererCalled = false
      function cellRenderer () {
        cellRendererCalled = true
        return 'foo'
      }
      const markup = getMarkup({ cellRenderer })
      render(markup)
      expect(cellRendererCalled).toEqual(true)
      cellRendererCalled = false
      render(markup)
      expect(cellRendererCalled).toEqual(false)
    })

    it('should not re-render grid components if they shallowCompare style', () => {
      let componentUpdates = 0

      class GridComponent extends React.Component {
        shouldComponentUpdate (nextProps, nextState) {
          return shallowCompare(this, nextProps, nextState)
        }

        componentDidUpdate () {
          componentUpdates++
        }

        render () {
          const { columnIndex, rowIndex, style } = this.props
          return (
            <div
              className='gridItem'
              style={style}
            >
              {`row:${rowIndex}, column:${columnIndex}`}
            </div>
          )
        }
      }

      function cellRenderer ({ columnIndex, key, rowIndex, style }) {
        return <GridComponent
          key={key}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          style={style}
        />
      }

      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollTop: 0,
        width: 100
      }

      const grid = render(getMarkup(props))
      simulateScroll({ grid, scrollTop: 1 })

      expect(componentUpdates).toEqual(0)
    })
  })
})
