import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import AutoSizer from './AutoSizer'

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

  function ChildComponent ({ height, width, foo, bar }) {
    return (
      <div>{`width:${width}, height:${height}, foo:${foo}, bar:${bar}`}</div>
    )
  }

  // tmpvar/jsdom getBoundingClientRect() returns 0 for all values
  // See https://github.com/tmpvar/jsdom/issues/135
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    return { height, width }
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

test('AutoSizer should relay properties to ChildComponent or React child', (assert) => {
  const mounted = mount(getMarkup())
  assert.ok(mounted.text().includes('foo:456'))
  assert.ok(mounted.text().includes('bar:123'))
  assert.end()
})

test('AutoSizer should set the correct initial width and height of ChildComponent or React child', (assert) => {
  const mounted = mount(getMarkup())
  assert.ok(mounted.text().includes('height:100'))
  assert.ok(mounted.text().includes('width:200'))
  assert.end()
})

test('AutoSizer should account for padding when calculating the available width and height', (assert) => {
  const mounted = mount(getMarkup({
    paddingBottom: 10,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 15
  }))
  assert.ok(mounted.text().includes('height:75'))
  assert.ok(mounted.text().includes('width:192'))
  assert.end()
})

test('AutoSizer should not update :width if :disableWidth is true', (assert) => {
  const mounted = mount(getMarkup({ disableWidth: true }))
  assert.ok(mounted.text().includes('height:100'))
  assert.ok(mounted.text().includes('width:undefined'))
  assert.end()
})

test('AutoSizer should not update :height if :disableHeight is true', (assert) => {
  const mounted = mount(getMarkup({ disableHeight: true }))
  assert.ok(mounted.text().includes('height:undefined'))
  assert.ok(mounted.text().includes('width:200'))
  assert.end()
})

// TODO It would be nice to test the following (if I could trigger /vendor/detectElementResize event)
// The :onResize callback
// That resize events update the width/height
