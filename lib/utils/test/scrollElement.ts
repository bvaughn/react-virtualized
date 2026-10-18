/**
 * Test-only helpers for components scrolled by a scroll element (their `scrollElement` prop): a scrollable container, or the window.
 *
 * jsdom has no layout (every `getBoundingClientRect()` is all zeros), so these helpers install a minimal layout model:
 * - Elements are laid out as blocks: an element's top is the sum of the heights of its previous (non-absolutely positioned) siblings
 *   plus the top of its parent; absolutely positioned elements are placed at their `top` style.
 *   An element's height is its inline `height` style in pixels or, without one (e.g. `height: auto`), the sum of the heights of its
 *   (non-absolutely positioned) children.
 * - A scroll container created by `createScrollContainer()` has a fixed rect; the elements inside it are positioned relative to it,
 *   moved up by its `scrollTop` (i.e. `top = containerTop + contentOffset - scrollTop`).
 * - Any other element is positioned relative to the document, moved up by `window.scrollY` (as is the document element itself).
 *
 * The layout model and all other mocks are installed on first use and restored after each test.
 */
import { act } from "react";
import { afterEach } from "vitest";
import { setElementSize } from "./mockResizeObserver";
import { getMountNode } from "./render";

type Rect = { height: number; left: number; top: number; width: number };

// jsdom allows these (readonly in the DOM typings) to be overwritten
const mutableWindow = window as unknown as {
  innerHeight: number;
  innerWidth: number;
  scrollTo: Window["scrollTo"];
  scrollX: number;
  scrollY: number;
};

const containerRects = new Map<Element, Rect>();
const containers: ScrollContainer[] = [];

let originalGetBoundingClientRect:
  | typeof Element.prototype.getBoundingClientRect
  | null = null;

function parsePixels(value: string): number | null {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  return match ? parseFloat(match[1]) : null;
}

function getStyle(element: Element): CSSStyleDeclaration | null {
  return element instanceof HTMLElement ? element.style : null;
}

function isAbsolutelyPositioned(element: Element) {
  const position = getStyle(element)?.position;
  return position === "absolute" || position === "fixed";
}

function getLayoutHeight(element: Element): number {
  const containerRect = containerRects.get(element);
  if (containerRect) {
    return containerRect.height;
  }

  const height = parsePixels(getStyle(element)?.height ?? "");
  if (height !== null) {
    return height;
  }

  let sum = 0;
  for (const child of Array.from(element.children)) {
    if (!isAbsolutelyPositioned(child)) {
      sum += getLayoutHeight(child);
    }
  }
  return sum;
}

// The top of the element relative to the top of the root (e.g. the content of a scroll container)
function getLayoutTop(element: Element, root: Element): number {
  let top = 0;
  let node: Element = element;
  while (node !== root && node.parentElement) {
    if (isAbsolutelyPositioned(node)) {
      top += parsePixels(getStyle(node)?.top ?? "") ?? 0;
    } else {
      for (
        let sibling = node.previousElementSibling;
        sibling;
        sibling = sibling.previousElementSibling
      ) {
        if (!isAbsolutelyPositioned(sibling)) {
          top += getLayoutHeight(sibling);
        }
      }
    }
    node = node.parentElement;
  }
  return top;
}

function getClosestContainer(element: Element): Element | null {
  for (
    let node = element.parentElement;
    node !== null;
    node = node.parentElement
  ) {
    if (containerRects.has(node)) {
      return node;
    }
  }
  return null;
}

function getBoundingClientRect(this: Element): DOMRect {
  const containerRect = containerRects.get(this);
  if (containerRect) {
    return new DOMRect(
      containerRect.left,
      containerRect.top,
      containerRect.width,
      containerRect.height
    );
  }

  const documentElement = document.documentElement;
  if (this === documentElement) {
    return new DOMRect(
      -mutableWindow.scrollX,
      -mutableWindow.scrollY,
      mutableWindow.innerWidth,
      getLayoutHeight(document.body)
    );
  }

  const height = getLayoutHeight(this);
  const width = parsePixels(getStyle(this)?.width ?? "");

  const container = getClosestContainer(this);
  if (container !== null) {
    const rect = containerRects.get(container)!;
    return new DOMRect(
      rect.left - container.scrollLeft,
      rect.top + getLayoutTop(this, container) - container.scrollTop,
      width ?? rect.width,
      height
    );
  }

  return new DOMRect(
    -mutableWindow.scrollX,
    getLayoutTop(this, documentElement) - mutableWindow.scrollY,
    width ?? mutableWindow.innerWidth,
    height
  );
}

/** Installs the layout model (see above); it is restored after each test. */
export function mockLayout() {
  if (originalGetBoundingClientRect === null) {
    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = getBoundingClientRect;
  }
}

export type ScrollContainer = {
  /** The scrollable container (to pass as `scrollElement`). */
  element: HTMLDivElement;

  /** Content above the component (within the container); its height is the component's offset. */
  contentAbove: HTMLDivElement;

  /** Moves the node rendered into by `render()` into this container (below `contentAbove`). Done on creation by default. */
  adopt(): void;

  /** Changes the height of the content above the component (without any events, like a layout change). */
  setContentOffset(offset: number): void;

  /** Resizes the container (and notifies the mocked ResizeObserver, if installed with `mockResizeObserver()`). */
  resize(size: { height?: number; width?: number }): void;

  /** Scrolls the container (dispatching a scroll event), inside `act()`. */
  scroll(scrollTop: number, scrollLeft?: number): void;

  /** Scrolls the container like the browser would (dispatching a scroll event); this is the container's `scrollTo()`. */
  scrollTo: (left: number, top: number) => void;
};

/**
 * Creates a scrollable container (appended to the body) with a fixed rect, for use as a `scrollElement`,
 * and (unless `adopt` is false) moves the node that `render()` renders into into it,
 * below `contentOffset` pixels of other content.
 * Its `scrollTo()` sets `scrollTop`/`scrollLeft` and dispatches a `scroll` event (jsdom doesn't scroll).
 */
export function createScrollContainer({
  adopt = true,
  contentOffset = 0,
  height = 100,
  left = 0,
  top = 0,
  width = 200
}: {
  adopt?: boolean;
  contentOffset?: number;
  height?: number;
  left?: number;
  top?: number;
  width?: number;
} = {}): ScrollContainer {
  mockLayout();

  const element = document.createElement("div");
  element.style.height = `${height}px`;
  element.style.overflow = "auto";
  element.style.width = `${width}px`;
  document.body.appendChild(element);
  containerRects.set(element, { height, left, top, width });

  const contentAbove = document.createElement("div");
  contentAbove.style.height = `${contentOffset}px`;
  element.appendChild(contentAbove);

  const scrollTo = (left: number, top: number) => {
    element.scrollLeft = left;
    element.scrollTop = top;
    element.dispatchEvent(new window.Event("scroll"));
  };
  element.scrollTo = ((
    leftOrOptions?: number | ScrollToOptions,
    top?: number
  ) => {
    if (typeof leftOrOptions === "object") {
      scrollTo(
        leftOrOptions.left ?? element.scrollLeft,
        leftOrOptions.top ?? element.scrollTop
      );
    } else {
      scrollTo(leftOrOptions ?? 0, top ?? 0);
    }
  }) as typeof element.scrollTo;

  const container: ScrollContainer = {
    element,
    contentAbove,
    adopt() {
      element.appendChild(getMountNode());
    },
    setContentOffset(offset) {
      contentAbove.style.height = `${offset}px`;
    },
    resize(size) {
      const rect = containerRects.get(element)!;
      const newRect = { ...rect, ...size };
      containerRects.set(element, newRect);
      element.style.height = `${newRect.height}px`;
      element.style.width = `${newRect.width}px`;
      act(() => {
        setElementSize({
          element,
          height: newRect.height,
          width: newRect.width
        });
      });
    },
    scroll(scrollTop, scrollLeft = element.scrollLeft) {
      act(() => {
        scrollTo(scrollLeft, scrollTop);
      });
    },
    scrollTo
  };

  if (adopt) {
    container.adopt();
  }

  containers.push(container);

  return container;
}

export type WindowScrolling = {
  /** Scrolls the window (dispatching a scroll event), inside `act()`. */
  scroll(scrollY: number, scrollX?: number): void;

  /** Resizes the window (dispatching a resize event), inside `act()`. */
  resize(size: { height?: number; width?: number }): void;

  /** The mocked `window.scrollTo()`, which scrolls the window (dispatching a scroll event). */
  scrollTo: Window["scrollTo"];
};

let originalWindow: {
  innerHeight: number;
  innerWidth: number;
  scrollTo: Window["scrollTo"];
} | null = null;

/** Dispatches a scroll event to the window (without `act()`). */
function dispatchWindowScroll() {
  const event = new window.Event("scroll", { bubbles: true });
  // Vitest's jsdom environment aliases the global `window` to `globalThis`, so the
  // `currentTarget` of an event bubbling up to the (internal) jsdom Window is not `=== window`.
  // Report the global `window` as the current target so that the scroll listeners recognize it.
  Object.defineProperty(event, "currentTarget", { get: () => window });
  document.dispatchEvent(event);
}

/**
 * Mocks scrolling the window: `scrollX`/`scrollY` (initially 0), `innerHeight`/`innerWidth` and `scrollTo()`
 * (which sets the scroll offsets and dispatches a scroll event); and installs the layout model (see above).
 * Everything is restored after each test.
 */
export function mockWindowScrolling({
  innerHeight = 500,
  innerWidth = 500,
  scrollX = 0,
  scrollY = 0
}: {
  innerHeight?: number;
  innerWidth?: number;
  scrollX?: number;
  scrollY?: number;
} = {}): WindowScrolling {
  mockLayout();

  if (originalWindow === null) {
    originalWindow = {
      innerHeight: mutableWindow.innerHeight,
      innerWidth: mutableWindow.innerWidth,
      scrollTo: mutableWindow.scrollTo
    };
  }

  mutableWindow.innerHeight = innerHeight;
  mutableWindow.innerWidth = innerWidth;
  mutableWindow.scrollX = scrollX;
  mutableWindow.scrollY = scrollY;

  const scrollTo = ((xOrOptions?: number | ScrollToOptions, y?: number) => {
    if (typeof xOrOptions === "object") {
      mutableWindow.scrollX = xOrOptions.left ?? mutableWindow.scrollX;
      mutableWindow.scrollY = xOrOptions.top ?? mutableWindow.scrollY;
    } else {
      mutableWindow.scrollX = xOrOptions ?? 0;
      mutableWindow.scrollY = y ?? 0;
    }
    dispatchWindowScroll();
  }) as Window["scrollTo"];
  mutableWindow.scrollTo = scrollTo;

  return {
    scroll(scrollY, scrollX = mutableWindow.scrollX) {
      act(() => {
        mutableWindow.scrollX = scrollX;
        mutableWindow.scrollY = scrollY;
        dispatchWindowScroll();
      });
    },
    resize({
      height = mutableWindow.innerHeight,
      width = mutableWindow.innerWidth
    }) {
      act(() => {
        mutableWindow.innerHeight = height;
        mutableWindow.innerWidth = width;
        document.dispatchEvent(new window.Event("resize", { bubbles: true }));
      });
    },
    scrollTo
  };
}

afterEach(() => {
  containers.splice(0).forEach((container) => container.element.remove());
  containerRects.clear();

  if (originalGetBoundingClientRect !== null) {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    originalGetBoundingClientRect = null;
  }

  if (originalWindow !== null) {
    mutableWindow.innerHeight = originalWindow.innerHeight;
    mutableWindow.innerWidth = originalWindow.innerWidth;
    mutableWindow.scrollTo = originalWindow.scrollTo;
    mutableWindow.scrollX = 0;
    mutableWindow.scrollY = 0;
    originalWindow = null;
  }

  document.body.style.pointerEvents = "";
});
