import React from 'react'
import { findDOMNode, render } from 'react-dom'
import ScrollSync from './ScrollSync'

function ChildComponent ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }) {
  return (
    <div>
      {`clientHeight:${clientHeight}`}
      {`clientWidth:${clientWidth}`}
      {`scrollHeight:${scrollHeight}`}
      {`scrollLeft:${scrollLeft}`}
      {`scrollTop:${scrollTop}`}
      {`scrollWidth:${scrollWidth}`}
    </div>
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
        {({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
          <ChildComponent
            clientHeight={clientHeight}
            clientWidth={clientWidth}
            scrollHeight={scrollHeight}
            scrollLeft={scrollLeft}
            scrollTop={scrollTop}
            scrollWidth={scrollWidth}
          />
        )}
      </ScrollSync>
    )
    expect(findDOMNode(component).textContent).toContain('clientHeight:0')
    expect(findDOMNode(component).textContent).toContain('clientWidth:0')
    expect(findDOMNode(component).textContent).toContain('scrollHeight:0')
    expect(findDOMNode(component).textContent).toContain('scrollLeft:0')
    expect(findDOMNode(component).textContent).toContain('scrollTop:0')
    expect(findDOMNode(component).textContent).toContain('scrollWidth:0')
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
    onScroll({
      clientHeight: 400,
      clientWidth: 200,
      scrollHeight: 1000,
      scrollLeft: 50,
      scrollTop: 100,
      scrollWidth: 500
    })
    expect(findDOMNode(component).textContent).toContain('clientHeight:400')
    expect(findDOMNode(component).textContent).toContain('clientWidth:200')
    expect(findDOMNode(component).textContent).toContain('scrollHeight:1000')
    expect(findDOMNode(component).textContent).toContain('scrollLeft:50')
    expect(findDOMNode(component).textContent).toContain('scrollTop:100')
    expect(findDOMNode(component).textContent).toContain('scrollWidth:500')
  })
})
