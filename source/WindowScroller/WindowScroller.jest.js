/* global Element */

import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { IS_SCROLLING_TIMEOUT } from './utils/onScroll'
import WindowScroller from './WindowScroller'

class ChildComponent extends React.Component {
  render () {
    const { scrollTop, isScrolling, height } = this.props

    return (
      <div>{`scrollTop:${scrollTop}, isScrolling:${isScrolling}, height:${height}`}</div>
    )
  }
}

function mockGetBoundingClientRectForHeader ({
  documentOffset = 0,
  height,
  width
}) {
  // Mock the WindowScroller element and window separately
  // The only way to mock the former (before its created) is globally
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    top: height,
    left: width
  }))
  document.documentElement.getBoundingClientRect = jest.fn(() => ({
    top: documentOffset,
    left: documentOffset
  }))
}

function getMarkup ({
  headerElements,
  documentOffset,
  childRef,
  ...props
} = {}) {
  const windowScroller = (
    <WindowScroller {...props}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <ChildComponent
          ref={childRef}
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          scrollTop={scrollTop}
        />
      )}
    </WindowScroller>
  )

  // JSDome doesn't implement a working getBoundingClientRect()
  // But WindowScroller requires it
  mockGetBoundingClientRectForHeader({
    documentOffset,
    height: headerElements ? headerElements.props.style.height : 0,
    width: headerElements ? headerElements.props.style.width : 0
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
  scrollX = 0,
  scrollY = 0
}) {
  document.body.style.height = '10000px'
  window.scrollX = scrollX
  window.scrollY = scrollY
  document.dispatchEvent(new window.Event('scroll', { bubbles: true }))
  document.body.style.height = ''
}

function simulateWindowResize ({
  height = 0,
  width = 0
}) {
  window.innerHeight = height
  window.innerWidth = width
  document.dispatchEvent(new window.Event('resize', { bubbles: true }))
}

describe('WindowScroller', () => {
  // Set default window height and scroll position between tests
  beforeEach(() => {
    window.scrollY = 0
    window.scrollX = 0
    window.innerHeight = 500
    window.innerWidth = 500
  })

  // Starts updating scrollTop only when the top position is reached
  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft', () => {
    const component = render(getMarkup())
    const rendered = findDOMNode(component)
    const { top, left } = rendered.getBoundingClientRect()
    expect(component._positionFromTop).toEqual(top)
    expect(component._positionFromLeft).toEqual(left)
  })

  // Test edge-case reported in bvaughn/react-virtualized/pull/346
  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft if documentElement is scrolled', () => {
    render.unmount()

    // Simulate scrolled documentElement
    const component = render(getMarkup({
      documentOffset: -100
    }))
    const rendered = findDOMNode(component)
    const { top, left } = rendered.getBoundingClientRect()
    expect(component._positionFromTop).toEqual(top + 100)
    expect(component._positionFromLeft).toEqual(left + 100)
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
      const onScroll = jest.fn()
      render(getMarkup({ onScroll }))

      simulateWindowScroll({ scrollY: 5000 })

      // Allow scrolling timeout to complete so that the component computes state
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(onScroll).toHaveBeenCalledWith(
        {
          scrollLeft: 0,
          scrollTop: 5000
        }
      )

      simulateWindowScroll({
        scrollX: 2500,
        scrollY: 5000
      })

      // Allow scrolling timeout to complete so that the component computes state
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(onScroll).toHaveBeenCalledWith(
        {
          scrollLeft: 2500,
          scrollTop: 5000
        }
      )

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

      simulateWindowResize({ height: 1000, width: 1024 })

      expect(onResizeCalls.length).toEqual(1)
      expect(onResizeCalls[0]).toEqual({
        height: 1000,
        width: 1024
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
        headerElements: <div id='header' style={{ height: 100, width: 150 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop).toBe(100)
      expect(windowScroller._positionFromLeft).toBe(150)

      mockGetBoundingClientRectForHeader({
        height: 200,
        width: 300
      })

      expect(windowScroller._positionFromTop).toBe(100)
      expect(windowScroller._positionFromLeft).toBe(150)

      simulateWindowResize({ height: 1000, width: 1000 })

      expect(windowScroller._positionFromTop).toBe(200)
      expect(windowScroller._positionFromLeft).toBe(300)
    })

    it('should recalculate the offset from the top if called externally', () => {
      let windowScroller

      render(getMarkup({
        headerElements: <div id='header' style={{ height: 100, width: 150 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop).toBe(100)
      expect(windowScroller._positionFromLeft).toBe(150)

      mockGetBoundingClientRectForHeader({
        height: 200,
        width: 300
      })

      windowScroller.updatePosition()

      expect(windowScroller._positionFromTop).toBe(200)
      expect(windowScroller._positionFromLeft).toBe(300)
    })
  })

  describe('when child scrolls', () => {
    let originalScrollTo
    beforeEach(() => {
      originalScrollTo = window.scrollTo
      window.scrollTo = (scrollX, scrollY) => simulateWindowScroll({ scrollX, scrollY })
    })

    afterEach(() => {
      window.scrollTo = originalScrollTo
      render.unmount()
    })

    it('should scroll the scrollElement (when it is window) the desired amount', () => {
      let windowScroller, childComponent

      render(getMarkup({
        ref: (ref) => {
          windowScroller = ref
        },
        childRef: (ref) => {
          childComponent = ref
        }
      }))

      childComponent.props.onScroll({ scrollTop: 200 })

      expect(window.scrollY).toEqual(200 + windowScroller._positionFromTop)
    })

    it('should not scroll the scrollElement if trying to scroll to where we already are', () => {
      let childComponent

      render(getMarkup({
        childRef: (ref) => {
          childComponent = ref
        }
      }))

      simulateWindowScroll({ scrollY: 200 })

      window.scrollTo = jest.fn()

      childComponent.props.onScroll({ scrollTop: 200 })

      expect(window.scrollTo).not.toHaveBeenCalled()
    })

    it('should scroll the scrollElement (when it is an element) the desired amount', () => {
      let windowScroller, childComponent
      const divEl = document.createElement('div')

      render(getMarkup({
        ref: (ref) => {
          windowScroller = ref
        },
        scrollElement: divEl,
        childRef: (ref) => {
          childComponent = ref
        }
      }))

      childComponent.props.onScroll({ scrollTop: 200 })

      expect(divEl.scrollTop).toEqual(200 + windowScroller._positionFromTop)
    })

    it('should update own scrollTop', () => {
      let windowScroller, childComponent

      render(getMarkup({
        ref: (ref) => {
          windowScroller = ref
        },
        childRef: (ref) => {
          childComponent = ref
        }
      }))

      childComponent.props.onScroll({ scrollTop: 200 })

      expect(windowScroller.state.scrollTop).toEqual(200)
    })
  })
})
