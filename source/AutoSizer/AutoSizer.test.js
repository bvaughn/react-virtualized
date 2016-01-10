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

  function getMarkup (
    useReactChild,
    {
      bar = 123,
      className = undefined,
      foo = 456,
      height = 100,
      styleSheet = undefined,
      width = 200
    } = {}
  ) {
    let autoSizer

    if (useReactChild) {
      autoSizer = (
        <AutoSizer
          className={className}
          styleSheet={styleSheet}
        >
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
          className={className}
          foo={foo}
          styleSheet={styleSheet}
        />
      )
    }

    return (
      <div style={{ height, width }}>
        {autoSizer}
      </div>
    )
  }

  function renderOrUpdateComponent (useReactChild, props) {
    let rendered = render(getMarkup(useReactChild, props), node)

    return findDOMNode(rendered)
  }

  it('should relay properties to ChildComponent or React child', () => {
    [false, true].forEach(useReactChild => {
      const component = renderOrUpdateComponent(useReactChild)
      expect(findDOMNode(component).textContent).toContain('foo:456')
      expect(findDOMNode(component).textContent).toContain('bar:123')
    })
  })

  it('should set the correct initial width and height of ChildComponent or React child', () => {
    [false, true].forEach(useReactChild => {
      const component = renderOrUpdateComponent(useReactChild)
      let domNode = findDOMNode(component)
      expect(domNode.textContent).toContain('height:100')
      expect(domNode.textContent).toContain('width:200')
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const node = renderOrUpdateComponent()
      expect(node.querySelector('.AutoSizer')).toBeTruthy()
    })

    it('should use a custom :className if specified', () => {
      const node = renderOrUpdateComponent(true, { className: 'foo' })
      expect(node.querySelector('.AutoSizer').className).toContain('foo')
    })

    it('should use custom :styleSheet if specified', () => {
      const node = renderOrUpdateComponent(true, {
        styleSheet: {
          AutoSizer: { color: 'red' }
        }
      })
      expect(node.querySelector('.AutoSizer').style.color).toEqual('red')
    })

    it('should use overriden static styles', () => {
      const backup = { ...AutoSizer.defaultStyleSheet }
      AutoSizer.defaultStyleSheet.AutoSizer = { color: 'blue' }
      const node = renderOrUpdateComponent()
      expect(node.querySelector('.AutoSizer').style.color).toEqual('blue')
      AutoSizer.defaultStyleSheet = backup
    })
  })

  // TODO It would be nice to test that resize events update the width/height
})
