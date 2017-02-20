/**
 * Gets the height of the element, accounting for API differences between
 * `window` and other DOM elements.
 */
export function getHeight (element) {
  if (element === window) {
    return typeof window.innerHeight === 'number'
      ? window.innerHeight
      : 0
  }

  return element.getBoundingClientRect().height
}

/**
 * Gets the vertical position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top position will be a negative number and this element’s top will be increased (by that amount).
 */
export function getPositionFromTop (element, container) {
  const offset = container === window ? 0 : getScrollTop(container)
  const containerElement = container === window
    ? document.documentElement
    : container
  return (
    element.getBoundingClientRect().top +
    offset -
    containerElement.getBoundingClientRect().top
  )
}

/**
 * Gets the vertical scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
export function getScrollTop (element) {
  if (element === window) {
    return ('scrollY' in window)
      ? window.scrollY
      : document.documentElement.scrollTop
  } else {
    return element.scrollTop
  }
}
