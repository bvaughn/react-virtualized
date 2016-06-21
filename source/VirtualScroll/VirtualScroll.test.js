import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { Simulate } from 'react-addons-test-utils'
import Immutable from 'immutable'
import VirtualScroll from './VirtualScroll'

describe('VirtualScroll', () => {
  const array = []
  for (var i = 0; i < 100; i++) {
    array.push(`Name ${i}`)
  }
  const names = Immutable.fromJS(array)

  function getMarkup (props = {}) {
    function rowRenderer ({ index }) {
      return (
        <div
          key={index}
          className='listItem'
        >
          {names.get(index)}
        </div>
      )
    }

    return (
      <VirtualScroll
        height={100}
        overscanRowCount={0}
        rowHeight={10}
        rowCount={names.size}
        rowRenderer={rowRenderer}
        width={100}
        {...props}
      />
    )
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the view', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.querySelectorAll('.listItem').length).toEqual(10)
    })

    it('should not render more children than available if the list is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({ rowCount: 5 })))
      expect(rendered.querySelectorAll('.listItem').length).toEqual(5)
    })
  })

  /** Tests scrolling via initial props */
  describe('scrollToIndex', () => {
    it('should scroll to the top', () => {
      const rendered = findDOMNode(render(getMarkup({ scrollToIndex: 0 })))
      expect(rendered.textContent).toContain('Name 0')
    })

    it('should scroll down to the middle', () => {
      const rendered = findDOMNode(render(getMarkup({ scrollToIndex: 49 })))
      // 100 items * 10 item height = 1,000 total item height
      // 10 items can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(rendered.textContent).toContain('Name 49')
    })

    it('should scroll to the bottom', () => {
      const rendered = findDOMNode(render(getMarkup({ scrollToIndex: 99 })))
      // 100 height - 10 header = 90 available scroll space.
      // 100 items * 10 item height = 1,000 total item height
      // Target height for the last item then is 1000 - 90
      expect(rendered.textContent).toContain('Name 99')
    })

    it('should scroll to the correct position for :scrollToAlignment "start"', () => {
      const rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'start',
        scrollToIndex: 49
      })))
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 49')
      expect(rendered.textContent).toContain('Name 58')
    })

    it('should scroll to the correct position for :scrollToAlignment "end"', () => {
      render(getMarkup({
        scrollToIndex: 99
      }))
      const rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'end',
        scrollToIndex: 49
      })))
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 40')
      expect(rendered.textContent).toContain('Name 49')
    })

    it('should scroll to the correct position for :scrollToAlignment "center"', () => {
      render(getMarkup({
        scrollToIndex: 99
      }))
      const rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'center',
        scrollToIndex: 49
      })))
      // 100 items * 10 item height = 1,000 total item height; 11 items can be visible at a time (the first and last item are only partially visible)
      expect(rendered.textContent).toContain('Name 43')
      expect(rendered.textContent).toContain('Name 53')
    })
  })

  describe('property updates', () => {
    it('should update :scrollToIndex position when :rowHeight changes', () => {
      let rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })))
      expect(rendered.textContent).toContain('Name 50')
      // Making rows taller pushes name off/beyond the scrolled area
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50, rowHeight: 20 })))
      expect(rendered.textContent).toContain('Name 50')
    })

    it('should update :scrollToIndex position when :height changes', () => {
      let rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })))
      expect(rendered.textContent).toContain('Name 50')
      // Making the list shorter leaves only room for 1 item
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50, height: 20 })))
      expect(rendered.textContent).toContain('Name 50')
    })

    it('should update :scrollToIndex position when :scrollToIndex changes', () => {
      let rendered = findDOMNode(render(getMarkup()))
      expect(rendered.textContent).not.toContain('Name 50')
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })))
      expect(rendered.textContent).toContain('Name 50')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      findDOMNode(render(getMarkup({ scrollToIndex: 500 })))
      findDOMNode(render(getMarkup()))
      const rendered = findDOMNode(render(getMarkup({ scrollToIndex: 500, rowCount: 10 })))
      expect(rendered.textContent).toContain('Name 9')
    })
  })

  describe('noRowsRenderer', () => {
    it('should call :noRowsRenderer if :rowCount is 0', () => {
      let rendered = findDOMNode(render(getMarkup({
        noRowsRenderer: () => <div>No rows!</div>,
        rowCount: 0
      })))
      expect(rendered.textContent).toEqual('No rows!')
    })

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', () => {
      let rendered = findDOMNode(render(getMarkup({
        rowCount: 0
      })))
      expect(rendered.textContent).toEqual('')
    })
  })

  describe('onRowsRendered', () => {
    it('should call :onRowsRendered if at least one row is rendered', () => {
      let startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      }))
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
    })

    it('should not call :onRowsRendered unless the start or stop indices have changed', () => {
      let numCalls = 0
      let startIndex
      let stopIndex
      const onRowsRendered = params => {
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
      findDOMNode(render(getMarkup({ onRowsRendered })))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      findDOMNode(render(getMarkup({ onRowsRendered })))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
    })

    it('should call :onRowsRendered if the start or stop indices have changed', () => {
      let numCalls = 0
      let startIndex
      let stopIndex
      const onRowsRendered = params => {
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
      findDOMNode(render(getMarkup({ onRowsRendered })))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      findDOMNode(render(getMarkup({
        height: 50,
        onRowsRendered
      })))
      expect(numCalls).toEqual(2)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(4)
    })

    it('should not call :onRowsRendered if no rows are rendered', () => {
      let startIndex, stopIndex
      render(getMarkup({
        height: 0,
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      }))
      expect(startIndex).toEqual(undefined)
      expect(stopIndex).toEqual(undefined)
    })
  })

  describe(':scrollTop property', () => {
    it('should render correctly when an initial :scrollTop property is specified', () => {
      let startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params),
        scrollTop: 100
      }))
      expect(startIndex).toEqual(10)
      expect(stopIndex).toEqual(19)
    })

    it('should render correctly when :scrollTop property is updated', () => {
      let startIndex, stopIndex

      findDOMNode(render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      })))
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)

      findDOMNode(render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params),
        scrollTop: 100
      })))
      expect(startIndex).toEqual(10)
      expect(stopIndex).toEqual(19)
    })
  })

  describe('styles and classNames', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(render(getMarkup()))
      expect(node.className).toContain('VirtualScroll')
    })

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(render(getMarkup({ className: 'foo' })))
      expect(node.className).toContain('foo')
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
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.className === 'Grid__cell')
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :cellClassName if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        rowClassName: 'foo'
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.classList.contains('foo'))
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :cellClassName if function specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        rowClassName: () => 'foo'
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.classList.contains('foo'))
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :cellClassName indexes', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        rowClassName: ({index}) => `col-${index}`
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.className.split(' ')[1])
      expect(rows.length).toEqual(3)
      expect(rows).toEqual(['col-0', 'col-1', 'col-2'])
    })

    it('should use a custom :rowStyle if specified', () => {
      const rowStyle = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ rowStyle })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const result = Array.from(cells).map(el => el.style.backgroundColor)
      expect(result).toEqual((new Array(cells.length)).fill('red'))
    })

    it('should use a custom :rowStyle if function specified', () => {
      const rowStyle = () => { return { backgroundColor: 'red' } }
      const rendered = findDOMNode(render(getMarkup({ rowStyle })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const result = Array.from(cells).map(el => el.style.backgroundColor)
      expect(result).toEqual((new Array(cells.length)).fill('red'))
    })
  })

  describe('overscanRowCount', () => {
    it('should not overscan by default', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params)
      }))
      expect(overscanStartIndex).toEqual(startIndex)
      expect(overscanStopIndex).toEqual(stopIndex)
    })

    it('should overscan the specified amount', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10,
        scrollToIndex: 30
      }))
      expect(overscanStartIndex).toEqual(11)
      expect(startIndex).toEqual(21)
      expect(stopIndex).toEqual(30)
      expect(overscanStopIndex).toEqual(40)
    })

    it('should not overscan beyond the start of the list', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10
      }))
      expect(overscanStartIndex).toEqual(0)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      expect(overscanStopIndex).toEqual(19)
    })

    it('should not overscan beyond the end of the list', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10,
        rowCount: 15
      }))
      expect(overscanStartIndex).toEqual(0)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      expect(overscanStopIndex).toEqual(14)
    })
  })

  describe('onScroll', () => {
    it('should trigger callback when component initially mounts', () => {
      const onScrollCalls = []
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 0
      }])
    })

    it('should trigger callback when component scrolls', () => {
      const onScrollCalls = []
      const rendered = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      const target = {
        scrollTop: 100
      }
      rendered.refs.Grid.refs.scrollingContainer = target // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered), { target })
      expect(onScrollCalls[onScrollCalls.length - 1]).toEqual({
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 100
      })
    })
  })

  describe('measureAllRows', () => {
    it('should measure any unmeasured rows', () => {
      const rendered = render(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: () => 20,
        width: 0
      }))
      expect(rendered.refs.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150)
      rendered.measureAllRows()
      expect(rendered.refs.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200)
    })
  })

  describe('recomputeRowHeights', () => {
    it('should recompute row heights and other values when called', () => {
      let highestRowIndex = 0
      const rowHeight = ({ index }) => {
        highestRowIndex = Math.max(index, highestRowIndex)
        return 10
      }
      const component = render(getMarkup({
        rowHeight,
        rowCount: 50
      }))
      highestRowIndex = 0
      component.recomputeRowHeights()
      // Only the rows required to fill the current viewport will be rendered
      expect(highestRowIndex).toEqual(9)
    })
  })

  describe('forceUpdateGrid', () => {
    it('should refresh inner Grid content when called', () => {
      let marker = 'a'
      function rowRenderer ({ index }) {
        return `${index}${marker}`
      }
      const component = render(getMarkup({ rowRenderer }))
      const node = findDOMNode(component)
      expect(node.textContent).toContain('1a')
      marker = 'b'
      component.forceUpdateGrid()
      expect(node.textContent).toContain('1b')
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
})
