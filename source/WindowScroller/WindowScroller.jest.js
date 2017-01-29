/* global Element */

import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { IS_SCROLLING_TIMEOUT } from './utils/onScroll'
import WindowScroller from './WindowScroller'

function ChildComponent ({ scrollTop, isScrolling, height }) {
  return (
    <div>{`scrollTop:${scrollTop}, isScrolling:${isScrolling}, height:${height}`}</div>
  )
}

function mockGetBoundingClientRectForHeader ({
  documentOffset = 0,
  height
}) {
  // Mock the WindowScroller element and window separately
  // The only way to mock the former (before its created) is globally
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    top: height
  }))
  document.documentElement.getBoundingClientRect = jest.fn(() => ({
    top: documentOffset
  }))
}

function getMarkup ({
  headerElements,
  documentOffset,
  ...props
} = {}) {
  const windowScroller = (
    <WindowScroller {...props}>
      {({ height, isScrolling, scrollTop }) => (
        <ChildComponent
          height={height}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
        />
      )}
    </WindowScroller>
  )

  // JSDome doesn't implement a working getBoundingClientRect()
  // But WindowScroller requires it
  mockGetBoundingClientRectForHeader({
    documentOffset,
    height: headerElements ? headerElements.props.style.height : 0
  })

  if (headerElements) {
    return (
      <div>
        {headerElements}
        {windowScroller}
      </div>
    )
  } else {
    return windowScroller
  }
}

function simulateWindowScroll ({
  scrollY = 0
}) {
  document.body.style.height = '10000px'
  window.scrollY = scrollY
  document.dispatchEvent(new window.Event('scroll', { bubbles: true }))
  document.body.style.height = ''
}

function simulateWindowResize ({
  height = 0
}) {
  window.innerHeight = height
  document.dispatchEvent(new window.Event('resize', { bubbles: true }))
}

describe('WindowScroller', () => {
  // Set default window height and scroll position between tests
  beforeEach(() => {
    window.scrollY = 0
    window.innerHeight = 500
  })

  // Starts updating scrollTop only when the top position is reached
  it('should have correct top property to be defined on :_positionFromTop', () => {
    const component = render(getMarkup())
    const rendered = findDOMNode(component)
    const top = rendered.getBoundingClientRect().top
    expect(component._positionFromTop).toEqual(top)
  })

  // Test edge-case reported in bvaughn/react-virtualized/pull/346
  it('should have correct top property to be defined on :_positionFromTop if documentElement is scrolled', () => {
    render.unmount()

    // Simulate scrolled documentElement
    const component = render(getMarkup({
      documentOffset: -100
    }))
    const rendered = findDOMNode(component)
    const top = rendered.getBoundingClientRect().top
    expect(component._positionFromTop).toEqual(top + 100)
    // Reset override
    delete document.documentElement.getBoundingClientRect
  })

  it('inherits the window height and passes it to child component', () => {
    const component = render(getMarkup())
    const rendered = findDOMNode(component)

    expect(component.state.height).toEqual(window.innerHeight)
    expect(component.state.height).toEqual(500)
    expect(rendered.textContent).toContain('height:500')
  })

  it('should restore pointerEvents on body after IS_SCROLLING_TIMEOUT', async (done) => {
    render(getMarkup())
    document.body.style.pointerEvents = 'all'
    simulateWindowScroll({ scrollY: 5000 })
    expect(document.body.style.pointerEvents).toEqual('none')
    await new Promise(resolve => setTimeout(resolve, IS_SCROLLING_TIMEOUT))
    expect(document.body.style.pointerEvents).toEqual('all')
    done()
  })

  it('should restore pointerEvents on body after unmount', () => {
    render(getMarkup())
    document.body.style.pointerEvents = 'all'
    simulateWindowScroll({ scrollY: 5000 })
    expect(document.body.style.pointerEvents).toEqual('none')
    render.unmount()
    expect(document.body.style.pointerEvents).toEqual('all')
  })

  describe('onScroll', () => {
    it('should trigger callback when window scrolls', async done => {
      const onScrollCalls = []
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))

      simulateWindowScroll({ scrollY: 5000 })

      // Allow scrolling timeout to complete so that the component computes state
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(onScrollCalls.length).toEqual(1)
      expect(onScrollCalls[0]).toEqual({
        scrollTop: 5000
      })

      done()
    })

    it('should update :scrollTop when window is scrolled', async done => {
      const component = render(getMarkup())
      const rendered = findDOMNode(component)

      // Initial load of the component should have 0 scrollTop
      expect(rendered.textContent).toContain('scrollTop:0')

      simulateWindowScroll({ scrollY: 5000 })

      // Allow scrolling timeout to complete so that the component computes state
      await new Promise(resolve => setTimeout(resolve, 150))

      const componentScrollTop = window.scrollY - component._positionFromTop
      expect(component.state.scrollTop).toEqual(componentScrollTop)
      expect(rendered.textContent).toContain(`scrollTop:${componentScrollTop}`)

      done()
    })

    it('should specify :isScrolling when scrolling and reset after scrolling', async (done) => {
      const component = render(getMarkup())
      const rendered = findDOMNode(component)

      simulateWindowScroll({ scrollY: 5000 })

      expect(rendered.textContent).toContain('isScrolling:true')

      await new Promise(resolve => setTimeout(resolve, 250))

      expect(rendered.textContent).toContain('isScrolling:false')

      done()
    })
  })

  describe('onResize', () => {
    it('should trigger callback when window resizes', () => {
      const onResizeCalls = []
      render(getMarkup({
        onResize: params => onResizeCalls.push(params)
      }))

      simulateWindowResize({ height: 1000 })

      expect(onResizeCalls.length).toEqual(1)
      expect(onResizeCalls[0]).toEqual({
        height: 1000
      })
    })

    it('should update height when window resizes', () => {
      const component = render(getMarkup())
      const rendered = findDOMNode(component)

      // Initial load of the component should have the same window height = 500
      expect(component.state.height).toEqual(window.innerHeight)
      expect(component.state.height).toEqual(500)
      expect(rendered.textContent).toContain('height:500')

      simulateWindowResize({ height: 1000 })

      expect(component.state.height).toEqual(window.innerHeight)
      expect(component.state.height).toEqual(1000)
      expect(rendered.textContent).toContain('height:1000')
    })
  })

  describe('updatePosition', () => {
    it('should calculate the initial offset from the top of the page when mounted', () => {
      let windowScroller

      render(getMarkup({
        headerElements: <div style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop).toBe(100)
    })

    it('should recalculate the offset from the top when the window resizes', () => {
      let windowScroller

      render(getMarkup({
        headerElements: <div id='header' style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop).toBe(100)

      mockGetBoundingClientRectForHeader({
        height: 200
      })

      expect(windowScroller._positionFromTop).toBe(100)

      simulateWindowResize({ height: 1000 })

      expect(windowScroller._positionFromTop).toBe(200)
    })

    it('should recalculate the offset from the top if called externally', () => {
      let windowScroller

      render(getMarkup({
        headerElements: <div id='header' style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop).toBe(100)

      mockGetBoundingClientRectForHeader({
        height: 200
      })

      windowScroller.updatePosition()

      expect(windowScroller._positionFromTop).toBe(200)
    })
  })
})
