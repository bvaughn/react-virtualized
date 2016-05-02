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
  const rendered = Immutable.fromJS(array)

  function getMarkup ({
    className,
    height = 100,
    noRowsRenderer = undefined,
    onRowsRendered = undefined,
    onScroll = undefined,
    overscanRowCount = 0,
    rowHeight = 10,
    rowCount = rendered.size,
    scrollToIndex = undefined,
    scrollTop = undefined,
    width = 100
  } = {}) {
    function rowRenderer ({ index }) {
      return (
        <div
          key={index}
          className='listItem'
        >
          {rendered.get(index)}
        </div>
      )
    }

    return (
      <VirtualScroll
        className={className}
        height={height}
        noRowsRenderer={noRowsRenderer}
        onRowsRendered={onRowsRendered}
        onScroll={onScroll}
        overscanRowCount={overscanRowCount}
        rowHeight={rowHeight}
        rowRenderer={rowRenderer}
        rowCount={rowCount}
        scrollToIndex={scrollToIndex}
        scrollTop={scrollTop}
        width={width}
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
      // Rows won't actually be remeasured until the VirtualScroll is next rendered.
      render(getMarkup({
        rowHeight,
        rowCount: 50
      }))
      // And then only the rows necessary to fill the visible region.
      expect(highestRowIndex).toEqual(9)
    })
  })
})
