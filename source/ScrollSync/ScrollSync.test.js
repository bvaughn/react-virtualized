import React from 'react'
import ScrollSync from './ScrollSync'
import test from 'tape'
import { mount } from 'enzyme'

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

test('ScrollSync should pass through an initial value of 0 for :scrollLeft and :scrollTop', (assert) => {
  const component = mount(
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
  assert.ok(component.text().includes('clientHeight:0'))
  assert.ok(component.text().includes('clientWidth:0'))
  assert.ok(component.text().includes('scrollHeight:0'))
  assert.ok(component.text().includes('scrollLeft:0'))
  assert.ok(component.text().includes('scrollTop:0'))
  assert.ok(component.text().includes('scrollWidth:0'))
  assert.end()
})

test('ScrollSync should update :scrollLeft and :scrollTop when :onScroll is called', (assert) => {
  let onScroll
  const component = mount(
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
  assert.ok(component.text().includes('clientHeight:400'))
  assert.ok(component.text().includes('clientWidth:200'))
  assert.ok(component.text().includes('scrollHeight:1000'))
  assert.ok(component.text().includes('scrollLeft:50'))
  assert.ok(component.text().includes('scrollTop:100'))
  assert.ok(component.text().includes('scrollWidth:500'))
  assert.end()
})
