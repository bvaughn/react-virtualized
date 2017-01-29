/* global Element, Event */

import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import AutoSizer from './AutoSizer'

function ChildComponent ({ height, width, foo, bar }) {
  return (
    <div>{`width:${width}, height:${height}, foo:${foo}, bar:${bar}`}</div>
  )
}

describe('AutoSizer', () => {
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

    // AutoSizer uses getBoundingClientRect().
    // Jest runs in JSDom which doesn't support measurements APIs.
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width,
      height
    }))

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

  it('should relay properties to ChildComponent or React child', () => {
    const rendered = findDOMNode(render(getMarkup()))
    expect(rendered.textContent).toContain('foo:456')
    expect(rendered.textContent).toContain('bar:123')
  })

  it('should set the correct initial width and height of ChildComponent or React child', () => {
    const rendered = findDOMNode(render(getMarkup()))
    expect(rendered.textContent).toContain('height:100')
    expect(rendered.textContent).toContain('width:200')
  })

  it('should account for padding when calculating the available width and height', () => {
    const rendered = findDOMNode(render(getMarkup({
      paddingBottom: 10,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 15
    })))
    expect(rendered.textContent).toContain('height:75')
    expect(rendered.textContent).toContain('width:192')
  })

  it('should not update :width if :disableWidth is true', () => {
    const rendered = findDOMNode(render(getMarkup({ disableWidth: true })))
    expect(rendered.textContent).toContain('height:100')
    expect(rendered.textContent).toContain('width:undefined')
  })

  it('should not update :height if :disableHeight is true', () => {
    const rendered = findDOMNode(render(getMarkup({ disableHeight: true })))
    expect(rendered.textContent).toContain('height:undefined')
    expect(rendered.textContent).toContain('width:200')
  })

  async function simulateResize ({ element, height, width }) {
    // Specific to the implementation of detectElementResize helper
    element.offsetHeight = height
    element.offsetWidth = width

    Element.prototype.getBoundingClientRect.mockReturnValue({
      width,
      height
    })

    // Trigger detectElementResize library by faking a scroll event
    // TestUtils Simulate doesn't work here in JSDom so we manually dispatch
    const trigger = element.querySelector('.contract-trigger')
    trigger.dispatchEvent(new Event('scroll'))

    // Allow requestAnimationFrame to be invoked before continuing
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  it('should update :height after a resize event', async (done) => {
    const rendered = findDOMNode(render(getMarkup({
      height: 100,
      width: 200
    })))
    expect(rendered.textContent).toContain('height:100')
    expect(rendered.textContent).toContain('width:200')
    await simulateResize({ element: rendered, height: 400, width: 300 })
    expect(rendered.textContent).toContain('height:400')
    expect(rendered.textContent).toContain('width:300')
    done()
  })
})
