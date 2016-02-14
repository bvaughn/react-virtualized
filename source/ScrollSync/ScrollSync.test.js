import React from 'react'
import { findDOMNode, render } from 'react-dom'
import ScrollSync from './ScrollSync'

function ChildComponent ({ scrollLeft, scrollTop }) {
  return (
    <div>{`scrollLeft:${scrollLeft}, scrollTop:${scrollTop}`}</div>
  )
}

describe('ScrollSync', () => {
  // Used by the renderOrUpdateComponent() helper method
  // Unless we attach the node to body, getBoundingClientRect() won't work
  var node = null
  beforeEach(() => {
    node = document.createElement('div')
    document.body.appendChild(node)
  })
  afterEach(() => {
    document.body.removeChild(node)
  })

  function renderOrUpdateComponent (markup) {
    let rendered = render(markup, node)

    return findDOMNode(rendered)
  }

  it('should pass through an initial value of 0 for :scrollLeft and :scrollTop', () => {
    const component = renderOrUpdateComponent(
      <ScrollSync>
        {({ onScroll, scrollLeft, scrollTop }) => (
          <ChildComponent
            scrollLeft={scrollLeft}
            scrollTop={scrollTop}
          />
        )}
      </ScrollSync>
    )
    expect(findDOMNode(component).textContent).toContain('scrollLeft:0')
    expect(findDOMNode(component).textContent).toContain('scrollTop:0')
  })

  it('should update :scrollLeft and :scrollTop when :onScroll is called', () => {
    let onScroll
    const component = renderOrUpdateComponent(
      <ScrollSync>
        {(params) => {
          onScroll = params.onScroll
          return <ChildComponent {...params}/>
        }}
      </ScrollSync>
    )
    onScroll({ scrollLeft: 100, scrollTop: 200 })
    expect(findDOMNode(component).textContent).toContain('scrollLeft:100')
    expect(findDOMNode(component).textContent).toContain('scrollTop:200')
  })
})
