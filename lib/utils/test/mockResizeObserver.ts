/**
 * Test-only `ResizeObserver` mock (jsdom does not implement `ResizeObserver`).
 *
 * Call `mockResizeObserver()` (e.g. in `beforeEach`) to install the mock; it returns a function that restores the original.
 * Then use `setElementSize()` to simulate an element being resized; this also updates the element's
 * `offsetWidth`/`offsetHeight` (which jsdom always reports as 0) and notifies every observer of that element.
 *
 * Like the real API, observers are notified once when they start observing an element.
 */

const elementSizes = new Map<Element, { height: number; width: number }>();
const observers = new Set<MockResizeObserver>();

const originalOffsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetHeight"
);
const originalOffsetWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetWidth"
);

export function mockResizeObserver() {
  const originalResizeObserver = window.ResizeObserver;

  window.ResizeObserver = MockResizeObserver;

  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return elementSizes.get(this)?.height ?? 0;
    }
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return elementSizes.get(this)?.width ?? 0;
    }
  });

  return function unmockResizeObserver() {
    window.ResizeObserver = originalResizeObserver;

    if (originalOffsetHeight) {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetHeight",
        originalOffsetHeight
      );
    }
    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetWidth",
        originalOffsetWidth
      );
    }

    elementSizes.clear();
    observers.clear();
  };
}

/** Returns the number of mock observers currently observing the specified element. */
export function getObserverCount(element: Element) {
  let count = 0;
  observers.forEach((observer) => {
    if (observer.isObserving(element)) {
      count++;
    }
  });
  return count;
}

/** Simulates the element being resized (notifying the observers of that element). */
export function setElementSize({
  element,
  height,
  width
}: {
  element: Element;
  height: number;
  width: number;
}) {
  elementSizes.set(element, { height, width });

  observers.forEach((observer) => observer.notify(element));
}

class MockResizeObserver implements ResizeObserver {
  readonly #callback: ResizeObserverCallback;
  readonly #elements = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback;
  }

  observe(element: Element) {
    this.#elements.add(element);

    observers.add(this);

    this.notify(element);
  }

  unobserve(element: Element) {
    this.#elements.delete(element);
  }

  disconnect() {
    this.#elements.clear();

    observers.delete(this);
  }

  isObserving(element: Element) {
    return this.#elements.has(element);
  }

  notify(element: Element) {
    if (!this.#elements.has(element)) {
      return;
    }

    const { height, width } = elementSizes.get(element) ?? {
      height: 0,
      width: 0
    };
    const size = { blockSize: height, inlineSize: width };
    const entry = {
      borderBoxSize: [size],
      contentBoxSize: [size],
      contentRect: new DOMRect(0, 0, width, height),
      devicePixelContentBoxSize: [],
      target: element
    } as unknown as ResizeObserverEntry;

    this.#callback([entry], this);
  }
}
