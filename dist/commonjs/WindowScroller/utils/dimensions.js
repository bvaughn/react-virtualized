'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDimensions = getDimensions;
exports.getPositionOffset = getPositionOffset;
exports.getScrollOffset = getScrollOffset;
/**
 * Gets the dimensions of the element, accounting for API differences between
 * `window` and other DOM elements.
 */

function getDimensions(element) {
  if (element === window) {
    return {
      height: typeof window.innerHeight === 'number' ? window.innerHeight : 0,
      width: typeof window.innerWidth === 'number' ? window.innerWidth : 0
    };
  }

  var _element$getBoundingC = element.getBoundingClientRect(),
      width = _element$getBoundingC.width,
      height = _element$getBoundingC.height;

  return { width: width, height: height };
}

/**
 * Gets the vertical and horizontal position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top or left position will be a negative number and this element’s top or left will be increased (by that amount).
 */
function getPositionOffset(element, container) {
  var scrollOffset = container === window ? { top: 0, left: 0 } : getScrollOffset(container);
  var containerElement = container === window ? document.documentElement : container;
  var elementRect = element.getBoundingClientRect();
  var containerRect = containerElement.getBoundingClientRect();
  return {
    top: elementRect.top + scrollOffset.top - containerRect.top,
    left: elementRect.left + scrollOffset.left - containerRect.left
  };
}

/**
 * Gets the vertical and horizontal scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
function getScrollOffset(element) {
  if (element === window) {
    return {
      top: 'scrollY' in window ? window.scrollY : document.documentElement.scrollTop,
      left: 'scrollX' in window ? window.scrollX : document.documentElement.scrollLeft
    };
  } else {
    return {
      top: element.scrollTop,
      left: element.scrollLeft
    };
  }
}