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

  function getMarkup (
    useReactChild,
    {
      bar = 123,
      foo = 456,
      height = 100,
      width = 200
    } = {}
  ) {
    let autoSizer

    if (useReactChild) {
      autoSizer = (
        <AutoSizer>
          <ChildComponent
            bar={bar}
            foo={foo}
          />
        </AutoSizer>
      )
    } else {
      autoSizer = (
        <AutoSizer
          ChildComponent={ChildComponent}
          bar={bar}
          foo={foo}
        />
      )
    }

    return (
      <div style={{ height, width }}>
        {autoSizer}
      </div>
    )
  }

  function renderOrUpdateList (useReactChild, props) {
    let rendered = render(getMarkup(props), node)

    return findDOMNode(rendered)
  }

  it('should relay properties to ChildComponent or React child', () => {
    [false, true].forEach(useReactChild => {
      const component = renderOrUpdateList(useReactChild)
      expect(findDOMNode(component).textContent).toContain('foo:456')
      expect(findDOMNode(component).textContent).toContain('bar:123')
    })
  })

  it('should set the correct initial width and height of ChildComponent or React child', () => {
    [false, true].forEach(useReactChild => {
      const component = renderOrUpdateList(useReactChild)
      let domNode = findDOMNode(component)
      expect(domNode.textContent).toContain('height:100')
      expect(domNode.textContent).toContain('width:200')
    })
  })

  // TODO It would be nice to test that resize events update the width/height
})
