import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { getMarkup, simulateWindowResize } from './utils/TestUtils'

describe('WindowScroller', () => {
  describe('updatePosition', () => {
    fit('should calculate the initial offset from the top of the page when mounted', () => {
      let windowScroller

      render(getMarkup({
        headerElements: <div style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop > 100).toBeTruthy()
    })

    it('should recalculate the offset from the top when the window resizes', () => {
      let windowScroller

      const rendered = render(getMarkup({
        headerElements: <div id='header' style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop < 200).toBeTruthy()

      const header = findDOMNode(rendered).querySelector('#header')
      header.style.height = '200px'

      simulateWindowResize({ height: 1000 })

      expect(windowScroller._positionFromTop > 200).toBeTruthy()
    })

    it('should recalculate the offset from the top if called externally', () => {
      let windowScroller

      const rendered = render(getMarkup({
        headerElements: <div id='header' style={{ height: 100 }}></div>,
        ref: (ref) => {
          windowScroller = ref
        }
      }))

      expect(windowScroller._positionFromTop < 200).toBeTruthy()

      const header = findDOMNode(rendered).querySelector('#header')
      header.style.height = '200px'

      windowScroller.updatePosition()

      expect(windowScroller._positionFromTop > 200).toBeTruthy()
    })
  })
})
