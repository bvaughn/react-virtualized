/**
 * Gets the vertical scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
export function getVerticalScroll (element) {
  return element === window
    ? (('scrollY' in window) ? window.scrollY : document.documentElement.scrollTop)
    : element.scrollTop
}

/**
 * Gets the height of the element, accounting for API differences between
 * `window` and other DOM elements.
 */
export function getHeight (element) {
  return element === window
    ? window.innerHeight
    : element.getBoundingClientRect().height
}

/**
 * Gets the vertical position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top position will be a negative number and this element’s top will be increased (by that amount).
 */
export function getPositionFromTop (element, container) {
  const containerElement = container === window ? document.documentElement : container
  return element.getBoundingClientRect().top + getVerticalScroll(container) - containerElement.getBoundingClientRect().top
}
