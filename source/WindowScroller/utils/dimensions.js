/**
 * Gets the dimensions of the element, accounting for API differences between
 * `window` and other DOM elements.
 */

export function getDimensions(element) {
  if (element === window) {
    return {
      height: typeof window.innerHeight === "number" ? window.innerHeight : 0,
      width: typeof window.innerWidth === "number" ? window.innerWidth : 0
    };
  }

  const { width, height } = element.getBoundingClientRect();
  return { width, height };
}

/**
 * Gets the vertical and horizontal position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top or left position will be a negative number and this element’s top or left will be increased (by that amount).
 */
export function getPositionOffset(element, container) {
  const scrollOffset =
    container === window ? { top: 0, left: 0 } : getScrollOffset(container);
  const containerElement =
    container === window ? document.documentElement : container;
  const elementRect = element.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();
  return {
    top: elementRect.top + scrollOffset.top - containerRect.top,
    left: elementRect.left + scrollOffset.left - containerRect.left
  };
}

/**
 * Gets the vertical and horizontal scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
export function getScrollOffset(element) {
  if (element === window) {
    return {
      top:
        "scrollY" in window
          ? window.scrollY
          : document.documentElement.scrollTop,
      left:
        "scrollX" in window
          ? window.scrollX
          : document.documentElement.scrollLeft
    };
  } else {
    return {
      top: element.scrollTop,
      left: element.scrollLeft
    };
  }
}
