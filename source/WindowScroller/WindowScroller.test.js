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
  function getMarkup () {
    return (
      <WindowScroller>
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

  it('should update :scrollTop when window is scrolled', async done => {
    const component = render(getMarkup())
    const rendered = findDOMNode(component)

    // Initial load of the component should have 0 scrollTop
    expect(rendered.textContent).toContain('scrollTop:0')

    // Simulate window scroll by 5000
    document.body.style.height = '10000px'
    window.scrollY = 5000
    const event = new window.Event('scroll', { bubbles: true, cancelable: false })
    document.dispatchEvent(event)

    // Allow scrolling timeout to complete so that the component computes state
    await new Promise(resolve => setTimeout(resolve, 500))

    const componentScrollTop = window.scrollY - component._positionFromTop
    expect(component.state.scrollTop).toEqual(componentScrollTop)
    expect(rendered.textContent).toContain(`scrollTop:${componentScrollTop}`)

    document.body.style.height = ''
    done()
  })

  it('inherits the window height and passes it to child component', () => {
    window.innerHeight = 500
    const component = render(getMarkup())

    expect(component.state.height).toEqual(window.innerHeight)
    expect(component.state.height).toEqual(500)

    const rendered = findDOMNode(component)
    expect(rendered.textContent).toContain('height:500')
  })
})
