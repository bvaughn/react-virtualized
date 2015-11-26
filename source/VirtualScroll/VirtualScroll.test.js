import React from 'react'
import { findDOMNode, render } from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import VirtualScroll from './VirtualScroll'

describe('VirtualScroll', () => {
  beforeAll(() => {
    jasmine.clock().install()
  })

  var node = null
  beforeEach(() => {
    node = document.createElement('div')
  })

  const array = []
  for (var i = 0; i < 1000; i++) {
    array.push({
      id: '${i}',
      name: `Name ${i}`,
      email: 'user-${i}@treasure-data.com'
    })
  }
  const list = Immutable.fromJS(array)

  function getMarkup ({
    height = 100,
    rowHeight = 10,
    rowsCount = list.size,
    scrollToIndex = undefined
  } = {}) {
    return (
      <VirtualScroll
        height={height}
        rowHeight={rowHeight}
        scrollToIndex={scrollToIndex}
      >
        {list
          .slice(0, rowsCount)
          .map(index => (
            <div
              key={index}
              className='listItem'
            >
              {`Row ${index + 1}`}
            </div>
          ))
        }
      </VirtualScroll>
    )
  }

  function renderList (props) {
    const virtualScroll = TestUtils.renderIntoDocument(getMarkup(props))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick(100)

    return virtualScroll
  }

  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // TestUtils.renderIntoDocument creates a new component/instance each time
  function renderOrUpdateList (props) {
    let virtualScroll = render(getMarkup(props), node)

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick(100)

    return findDOMNode(virtualScroll)
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the view +1 for partial visibility at top and bottom', () => {
      const list = renderList()
      const listDOMNode = findDOMNode(list)

      expect(listDOMNode.querySelectorAll('.listItem').length).toEqual(11)
    })

    it('should not render more children than available if the list is not filled', () => {
      const list = renderList({ rowsCount: 5 })
      const listDOMNode = findDOMNode(list)

      expect(listDOMNode.querySelectorAll('.listItem').length).toEqual(5)
    })
  })

  // Allows for testing initial rendering of component and scrolling via props
  describe('scrollToIndex', () => {
    it('should scroll to the top', () => {
      const list = renderList({ scrollToIndex: 0 })
      expect(list.state.scrollTop).toEqual(0)
    })

    it('should scroll down to the middle', () => {
      const list = renderList({ scrollToIndex: 49 })
      // 100 items * 10 item height = 1,000 total item height
      // 10 items can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(list.state.scrollTop).toEqual(400)
    })

    it('should scroll to the bottom', () => {
      const list = renderList({ scrollToIndex: 99 })
      // 100 height - 10 header = 90 available scroll space.
      // 100 items * 10 item height = 1,000 total item height
      // Target height for the last item then is 1000 - 90
      expect(list.state.scrollTop).toEqual(900)
    })
  })

  // Allows more fine-grained control of scrolling from position A to B
  describe('scrollToIndex / _calculateScrollTopForIndex', () => {
    function calculateScrollTopForIndex (scrollToIndex, scrollTop = 0) {
      return VirtualScroll._calculateScrollTopForIndex({
        height: 100,
        rowHeight: 10,
        rowsCount: list.size,
        scrollToIndex,
        scrollTop
      })
    }

    it('should scroll to the top', () => {
      expect(calculateScrollTopForIndex(0)).toEqual(0)
    })

    it('should scroll down to the middle', () => {
      expect(calculateScrollTopForIndex(49)).toEqual(400)
    })

    it('should scroll up to the middle', () => {
      expect(calculateScrollTopForIndex(49, 800)).toEqual(490)
    })

    it('should not scroll if an item is already visible', () => {
      expect(calculateScrollTopForIndex(49, 470)).toEqual(470)
    })

    it('should scroll to the bottom', () => {
      expect(calculateScrollTopForIndex(99)).toEqual(900)
    })

    it('should not scroll past the top', () => {
      expect(calculateScrollTopForIndex(-5)).toEqual(0)
    })

    it('should not scroll past the bottom', () => {
      expect(calculateScrollTopForIndex(105)).toEqual(900)
    })
  })

  describe('_getMaxVisibleRows', () => {
    function getMaxVisibleRows (rowsCount) {
      return VirtualScroll._getMaxVisibleRows({
        height: 100,
        rowHeight: 20,
        rowsCount
      })
    }

    it('should handle no rows', () => {
      expect(getMaxVisibleRows(0)).toEqual(0)
    })

    it('should handle when there are fewer rows than available height', () => {
      expect(getMaxVisibleRows(2)).toEqual(2)
    })

    it('should handle when the rows exactly fit', () => {
      expect(getMaxVisibleRows(5)).toEqual(5)
    })

    it('should handle when there are more rows than the available height', () => {
      expect(getMaxVisibleRows(100)).toEqual(6) // Exact fit +1 extra for overlap
    })
  })

  describe('_getStartAndStopIndexForScrollTop', () => {
    function getStartAndStopIndexForScrollTop (scrollTop) {
      return VirtualScroll._getStartAndStopIndexForScrollTop({
        height: 100,
        rowHeight: 20,
        rowsCount: 100,
        scrollTop
      })
    }

    it('should handle unscrolled', () => {
      const { rowIndexStart, rowIndexStop } = getStartAndStopIndexForScrollTop(0)
      expect(rowIndexStart).toEqual(0)
      expect(rowIndexStop).toEqual(5)
    })

    it('should handle scrolled to the middle', () => {
      const { rowIndexStart, rowIndexStop } = getStartAndStopIndexForScrollTop(1000)
      expect(rowIndexStart).toEqual(50)
      expect(rowIndexStop).toEqual(55)
    })

    it('should handle scrolled to the end', () => {
      const { rowIndexStart, rowIndexStop } = getStartAndStopIndexForScrollTop(1920)
      expect(rowIndexStart).toEqual(95)
      expect(rowIndexStop).toEqual(99)
    })

    it('should handle scrolled past the end', () => {
      const { rowIndexStart, rowIndexStop } = getStartAndStopIndexForScrollTop(3000)
      expect(rowIndexStart).toEqual(95)
      expect(rowIndexStop).toEqual(99)
    })

    it('should handle scrolled past the beginning', () => {
      const { rowIndexStart, rowIndexStop } = getStartAndStopIndexForScrollTop(-200)
      expect(rowIndexStart).toEqual(0)
      expect(rowIndexStop).toEqual(5)
    })
  })

  describe('property updates', () => {
    it('should update :scrollToIndex position when :rowHeight changes', () => {
      let list = renderOrUpdateList({ scrollToIndex: 50 })
      expect(list.textContent).toContain('Name 50')
      // Making rows taller pushes name off/beyond the scrolled area
      list = renderOrUpdateList({ scrollToIndex: 50, rowHeight: 20 })
      expect(list.textContent).toContain('Name 50')
    })

    it('should update :scrollToIndex position when :height changes', () => {
      let list = renderOrUpdateList({ scrollToIndex: 50 })
      expect(list.textContent).toContain('Name 50')
      // Making the list shorter leaves only room for 1 item
      list = renderOrUpdateList({ scrollToIndex: 50, height: 20 })
      expect(list.textContent).toContain('Name 50')
    })

    it('should update :scrollToIndex position when :scrollToIndex changes', () => {
      let list = renderOrUpdateList()
      expect(list.textContent).not.toContain('Name 50')
      list = renderOrUpdateList({ scrollToIndex: 50 })
      expect(list.textContent).toContain('Name 50')
    })

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      let list = renderOrUpdateList({ scrollToIndex: 500 })
      list = renderOrUpdateList()
      list = renderOrUpdateList({ scrollToIndex: 500, rowsCount: 10 })
      expect(list.textContent).toContain('Name 9')
    })
  })
})
