import React from 'react'
import WindowScroller from '../WindowScroller'

function ChildComponent ({ scrollTop, isScrolling, height }) {
  return (
    <div>{`scrollTop:${scrollTop}, isScrolling:${isScrolling}, height:${height}`}</div>
  )
}

export function getMarkup ({
  headerElements,
  ...props
} = {}) {
  const windowScroller = (
    <WindowScroller {...props}>
      {({ height, isScrolling, scrollTop }) => (
        <ChildComponent
          height={height}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
        />
      )}
    </WindowScroller>
  )

  if (headerElements) {
    return (
      <div>
        {headerElements}
        {windowScroller}
      </div>
    )
  } else {
    return windowScroller
  }
}

export function simulateWindowScroll ({
  scrollY = 0
}) {
  document.body.style.height = '10000px'
  window.scrollY = scrollY
  document.dispatchEvent(new window.Event('scroll', { bubbles: true }))
  document.body.style.height = ''
}

export function simulateWindowResize ({
  height = 0
}) {
  window.innerHeight = height
  document.dispatchEvent(new window.Event('resize', { bubbles: true }))
}
