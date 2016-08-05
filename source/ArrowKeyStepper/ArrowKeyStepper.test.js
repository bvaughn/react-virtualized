import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import ArrowKeyStepper from './ArrowKeyStepper'
import { Simulate } from 'react-addons-test-utils'

function renderTextContent (scrollToColumn, scrollToRow) {
  return `scrollToColumn:${scrollToColumn}, scrollToRow:${scrollToRow}`
}

function ChildComponent ({ scrollToColumn, scrollToRow }) {
  return (
    <div>{renderTextContent(scrollToColumn, scrollToRow)}</div>
  )
}

describe('ArrowKeyStepper', () => {
  function renderHelper (props = {}) {
    let onSectionRenderedCallback

    const node = findDOMNode(render(
      <ArrowKeyStepper
        columnCount={10}
        rowCount={10}
        {...props}
      >
        {({ onSectionRendered, scrollToColumn, scrollToRow }) => {
          onSectionRenderedCallback = onSectionRendered

          return (
            <ChildComponent
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
            />
          )
        }}
      </ArrowKeyStepper>
    ))

    return {
      node,
      onSectionRendered: onSectionRenderedCallback
    }
  }

  function assertCurrentScrollTo (node, scrollToColumn, scrollToRow) {
    expect(node.textContent).toEqual(renderTextContent(scrollToColumn, scrollToRow))
  }

  it('should use a custom :className if one is specified', () => {
    const { node } = renderHelper({ className: 'foo' })
    expect(node.className).toEqual('foo')
  })

  it('should update :scrollToColumn and :scrollToRow in response to arrow keys', () => {
    const { node } = renderHelper()
    assertCurrentScrollTo(node, 0, 0)
    Simulate.keyDown(node, {key: 'ArrowDown'})
    assertCurrentScrollTo(node, 0, 1)
    Simulate.keyDown(node, {key: 'ArrowRight'})
    assertCurrentScrollTo(node, 1, 1)
    Simulate.keyDown(node, {key: 'ArrowUp'})
    assertCurrentScrollTo(node, 1, 0)
    Simulate.keyDown(node, {key: 'ArrowLeft'})
    assertCurrentScrollTo(node, 0, 0)
  })

  it('should not scroll past the row and column boundaries provided', () => {
    const { node } = renderHelper({
      columnCount: 2,
      rowCount: 2
    })
    Simulate.keyDown(node, {key: 'ArrowDown'})
    Simulate.keyDown(node, {key: 'ArrowDown'})
    Simulate.keyDown(node, {key: 'ArrowDown'})
    assertCurrentScrollTo(node, 0, 1)
    Simulate.keyDown(node, {key: 'ArrowUp'})
    Simulate.keyDown(node, {key: 'ArrowUp'})
    Simulate.keyDown(node, {key: 'ArrowUp'})
    assertCurrentScrollTo(node, 0, 0)
    Simulate.keyDown(node, {key: 'ArrowRight'})
    Simulate.keyDown(node, {key: 'ArrowRight'})
    Simulate.keyDown(node, {key: 'ArrowRight'})
    assertCurrentScrollTo(node, 1, 0)
    Simulate.keyDown(node, {key: 'ArrowLeft'})
    Simulate.keyDown(node, {key: 'ArrowLeft'})
    Simulate.keyDown(node, {key: 'ArrowLeft'})
    assertCurrentScrollTo(node, 0, 0)
  })

  it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', () => {
    const { node, onSectionRendered } = renderHelper()
    onSectionRendered({ // Simulate a scroll
      columnStartIndex: 0,
      columnStopIndex: 4,
      rowStartIndex: 4,
      rowStopIndex: 6
    })
    Simulate.keyDown(node, {key: 'ArrowDown'})
    assertCurrentScrollTo(node, 0, 7)

    onSectionRendered({ // Simulate a scroll
      columnStartIndex: 5,
      columnStopIndex: 10,
      rowStartIndex: 2,
      rowStopIndex: 4
    })
    Simulate.keyDown(node, {key: 'ArrowUp'})
    assertCurrentScrollTo(node, 0, 1)

    onSectionRendered({ // Simulate a scroll
      columnStartIndex: 4,
      columnStopIndex: 8,
      rowStartIndex: 5,
      rowStopIndex: 10
    })
    Simulate.keyDown(node, {key: 'ArrowRight'})
    assertCurrentScrollTo(node, 9, 1)

    onSectionRendered({ // Simulate a scroll
      columnStartIndex: 2,
      columnStopIndex: 4,
      rowStartIndex: 2,
      rowStopIndex: 4
    })
    Simulate.keyDown(node, {key: 'ArrowLeft'})
    assertCurrentScrollTo(node, 1, 1)
  })
})
