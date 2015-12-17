import React from 'react'
import { findDOMNode, render } from 'react-dom'
import AutoSizer from './AutoSizer'

function ChildComponent ({ height, width, foo, bar }) {
  return (
    <div>{`width:${width}, height:${height}, foo:${foo}, bar:${bar}`}</div>
  )
}

describe('AutoSizer', () => {
  beforeAll(() => jasmine.clock().install())
  afterAll(() => jasmine.clock().uninstall())

  // Used by the renderOrUpdateList() helper method
  // Unless we attach the node to body, getBoundingClientRect() won't work
  var node = null
  beforeEach(() => {
    node = document.createElement('div')
    document.body.appendChild(node)
  })
  afterEach(() => {
    document.body.removeChild(node)
  })

  function getMarkup ({
    bar = 123,
    foo = 456,
    height = 100,
    width = 200
  } = {}) {
    return (
      <div style={{ height, width }}>
        <AutoSizer
          ChildComponent={ChildComponent}
          bar={bar}
          foo={foo}
        />
      </div>
    )
  }

  function renderOrUpdateList (props) {
    let rendered = render(getMarkup(props), node)

    return findDOMNode(rendered)
  }

  it('should relay properties to ChildComponent', () => {
    const component = renderOrUpdateList()
    expect(findDOMNode(component).textContent).toContain('foo:456')
    expect(findDOMNode(component).textContent).toContain('bar:123')
  })

  it('should set the correct initial width and height of ChildComponent', () => {
    const component = renderOrUpdateList()
    let domNode = findDOMNode(component)
    expect(domNode.textContent).toContain('height:100')
    expect(domNode.textContent).toContain('width:200')
  })

  // TODO It would be nice to test that resize events update the width/height
})
