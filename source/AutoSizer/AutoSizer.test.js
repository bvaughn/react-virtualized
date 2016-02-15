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

  function getMarkup ({
    bar = 123,
    disableHeight = false,
    disableWidth = false,
    foo = 456,
    height = 100,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
    width = 200
  } = {}) {
    const style = {
      boxSizing: 'border-box',
      height,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      width
    }

    return (
      <div style={style}>
        <AutoSizer>
          {({ height, width }) => (
            <ChildComponent
              width={disableWidth ? undefined : width}
              height={disableHeight ? undefined : height}
              bar={bar}
              foo={foo}
            />
          )}
        </AutoSizer>
      </div>
    )
  }

  function renderOrUpdateComponent (props) {
    const rendered = render(getMarkup(props), node)

    return findDOMNode(rendered)
  }

  it('should relay properties to ChildComponent or React child', () => {
    const component = renderOrUpdateComponent()
    expect(findDOMNode(component).textContent).toContain('foo:456')
    expect(findDOMNode(component).textContent).toContain('bar:123')
  })

  it('should set the correct initial width and height of ChildComponent or React child', () => {
    const component = renderOrUpdateComponent()
    const domNode = findDOMNode(component)
    expect(domNode.textContent).toContain('height:100')
    expect(domNode.textContent).toContain('width:200')
  })

  it('should account for padding when calculating the available width and height', () => {
    const component = renderOrUpdateComponent({
      paddingBottom: 10,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 15
    })
    const domNode = findDOMNode(component)
    expect(domNode.textContent).toContain('height:75')
    expect(domNode.textContent).toContain('width:192')
  })

  it('should not update :width if :disableWidth is true', () => {
    const component = renderOrUpdateComponent({ disableWidth: true })
    const domNode = findDOMNode(component)
    expect(domNode.textContent).toContain('height:100')
    expect(domNode.textContent).toContain('width:undefined')
  })

  it('should not update :height if :disableHeight is true', () => {
    const component = renderOrUpdateComponent({ disableHeight: true })
    const domNode = findDOMNode(component)
    expect(domNode.textContent).toContain('height:undefined')
    expect(domNode.textContent).toContain('width:200')
  })

  // TODO It would be nice to test that resize events update the width/height
})
