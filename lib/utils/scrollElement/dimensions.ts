import type { ResolvedScrollElement } from "./types";

/**
 * Gets the dimensions of the element, accounting for API differences between
 * `window` and other DOM elements.
 */

type Dimensions = {
  height: number;
  width: number;
};

type Offset = {
  top: number;
  left: number;
};

const isWindow = (element: ResolvedScrollElement): element is Window =>
  element === window;

const getBoundingBox = (element: Element) => element.getBoundingClientRect();

export function getDimensions(
  scrollElement: ResolvedScrollElement
): Dimensions {
  if (isWindow(scrollElement)) {
    const { innerHeight, innerWidth } = window;
    return {
      height: typeof innerHeight === "number" ? innerHeight : 0,
      width: typeof innerWidth === "number" ? innerWidth : 0
    };
  } else {
    // Read the fields explicitly; DOMRect fields are prototype getters,
    // so spreading a DOMRect (e.g. into state) would copy nothing
    const { height, width } = getBoundingBox(scrollElement);
    return { height, width };
  }
}

/**
 * Gets the vertical and horizontal position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top or left position will be a negative number and this element’s top or left will be increased (by that amount).
 */
export function getPositionOffset(
  element: Element,
  container: ResolvedScrollElement
): Offset {
  if (isWindow(container) && document.documentElement) {
    const containerElement = document.documentElement;
    const elementRect = getBoundingBox(element);
    const containerRect = getBoundingBox(containerElement);
    return {
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left
    };
  } else {
    const scrollOffset = getScrollOffset(container);
    const elementRect = getBoundingBox(element);
    const containerRect = getBoundingBox(container as Element);
    return {
      top: elementRect.top + scrollOffset.top - containerRect.top,
      left: elementRect.left + scrollOffset.left - containerRect.left
    };
  }
}

/**
 * Gets the vertical and horizontal scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
export function getScrollOffset(element: ResolvedScrollElement): Offset {
  if (isWindow(element) && document.documentElement) {
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
      top: (element as Element).scrollTop,
      left: (element as Element).scrollLeft
    };
  }
}
