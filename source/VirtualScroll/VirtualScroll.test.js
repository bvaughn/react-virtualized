import React from 'react'
import { findDOMNode, render } from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import VirtualScroll from './VirtualScroll'

describe('VirtualScroll', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  // Used by the renderOrUpdateList() helper method
  var node = null
  beforeEach(() => node = document.createElement('div'))

  const array = []
  for (var i = 0; i < 100; i++) {
    array.push(`Name ${i}`)
  }
  const list = Immutable.fromJS(array)

  function getMarkup ({
    className = undefined,
    height = 100,
    noRowsRenderer = undefined,
    onRowsRendered = undefined,
    rowHeight = 10,
    rowsCount = list.size,
    scrollToIndex = undefined,
    styleSheet = undefined
  } = {}) {
    function rowRenderer (index) {
      return (
        <div
          key={index}
          className='listItem'
        >
          {list.get(index)}
        </div>
      )
    }

    return (
      <VirtualScroll
        className={className}
        height={height}
        noRowsRenderer={noRowsRenderer}
        onRowsRendered={onRowsRendered}
        rowHeight={rowHeight}
        rowRenderer={rowRenderer}
        rowsCount={rowsCount}
        scrollToIndex={scrollToIndex}
        styleSheet={styleSheet}
      />
    )
  }

  function renderList (props) {
    const virtualScroll = TestUtils.renderIntoDocument(getMarkup(props))

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return virtualScroll
  }

  // Use ReactDOM.render for certain tests so that props changes will update the existing component
  // TestUtils.renderIntoDocument creates a new component/instance each time
  function renderOrUpdateList (props) {
    let virtualScroll = render(getMarkup(props), node)

    // Allow initial setImmediate() to set :scrollTop
    jasmine.clock().tick()

    return findDOMNode(virtualScroll)
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the view', () => {
      const list = renderList()
      const listDOMNode = findDOMNode(list)

      expect(listDOMNode.querySelectorAll('.listItem').length).toEqual(10)
    })

    it('should not render more children than available if the list is not filled', () => {
      const list = renderList({ rowsCount: 5 })
      const listDOMNode = findDOMNode(list)

      expect(listDOMNode.querySelectorAll('.listItem').length).toEqual(5)
    })
  })

  /** Tests scrolling via initial props */
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

  describe('noRowsRenderer', () => {
    it('should call :noRowsRenderer if :rowsCount is 0', () => {
      let list = renderOrUpdateList({
        noRowsRenderer: () => <div>No rows!</div>,
        rowsCount: 0
      })
      expect(list.textContent).toEqual('No rows!')
    })

    it('should render an empty body if :rowsCount is 0 and there is no :noRowsRenderer', () => {
      let list = renderOrUpdateList({
        rowsCount: 0
      })
      expect(list.textContent).toEqual('')
    })
  })

  describe('onRowsRendered', () => {
    it('should call :onRowsRendered if at least one row is rendered', () => {
      let startIndex, stopIndex
      renderList({
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      })
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
      renderOrUpdateList({ onRowsRendered })
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      renderOrUpdateList({ onRowsRendered })
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
      renderOrUpdateList({ onRowsRendered })
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(9)
      renderOrUpdateList({
        height: 50,
        onRowsRendered
      })
      expect(numCalls).toEqual(2)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(4)
    })

    it('should not call :onRowsRendered if no rows are rendered', () => {
      let startIndex, stopIndex
      renderList({
        height: 0,
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      })
      expect(startIndex).toEqual(undefined)
      expect(stopIndex).toEqual(undefined)
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(renderList())
      expect(node.className).toEqual('VirtualScroll')
    })

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(renderList({ className: 'foo' }))
      expect(node.className).toContain('foo')
    })
  })
})
