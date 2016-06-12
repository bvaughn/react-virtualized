import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import WindowScroller from './WindowScroller'

function ChildComponent ({ scrollTop, height }) {
  return (
    <div>{`scrollTop:${scrollTop}, height:${height}`}</div>
  )
}

describe('WindowScroller', () => {
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

  function getMarkup ({
    onScroll,
    onResize
  } = {}) {
    return (
      <WindowScroller
        onScroll={onScroll}
        onResize={onResize}
      >
        {({ height, scrollTop }) => (
          <ChildComponent
            height={height}
            scrollTop={scrollTop}
          />
        )}
      </WindowScroller>
    )
  }

  // Starts updating scrollTop only when the top position is reached
  it('should have correct top property to be defined on :_positionFromTop', () => {
    const component = render(getMarkup())
    const rendered = findDOMNode(component)
    const top = rendered.getBoundingClientRect().top
    expect(component._positionFromTop).toEqual(top)
  })

  it('inherits the window height and passes it to child component', () => {
    // Set default window height
    window.innerHeight = 500
    const component = render(getMarkup())
    const rendered = findDOMNode(component)

    expect(component.state.height).toEqual(window.innerHeight)
    expect(component.state.height).toEqual(500)
    expect(rendered.textContent).toContain('height:500')
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
        scrollTop: 4992 // 5000 - 8 (position from top)
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

      // Set default window height
      window.innerHeight = 500
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

      // Set default window height
      window.innerHeight = 500
    })
  })
})
