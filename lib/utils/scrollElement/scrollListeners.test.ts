import { afterEach, describe, expect, it, vi } from "vitest";
import {
  registerScrollListener,
  unregisterScrollListener,
  type ScrollElementListener
} from "./scrollListeners";
import type { ResolvedScrollElement } from "./types";

function createListener(scrollingResetTimeInterval = 10) {
  return {
    getScrollingResetTimeInterval: vi.fn(() => scrollingResetTimeInterval),
    handleScrollEvent: vi.fn(),
    resetIsScrolling: vi.fn()
  } satisfies ScrollElementListener;
}

// Vitest's jsdom environment aliases the global `window` to `globalThis`, so the
// `currentTarget` of an event bubbling up to the (internal) jsdom Window is not `=== window`;
// report the global `window` as the current target (as a browser would).
function dispatchWindowScroll() {
  const event = new window.Event("scroll", { bubbles: true });
  Object.defineProperty(event, "currentTarget", { get: () => window });
  document.dispatchEvent(event);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("scrollListeners", () => {
  const registered: Array<[ScrollElementListener, ResolvedScrollElement]> = [];

  function register(
    listener: ScrollElementListener,
    element: ResolvedScrollElement
  ) {
    registered.push([listener, element]);
    registerScrollListener(listener, element);
  }

  afterEach(() => {
    registered
      .splice(0)
      .forEach(([listener, element]) =>
        unregisterScrollListener(listener, element)
      );
    document.body.style.pointerEvents = "";
    vi.restoreAllMocks();
  });

  it("should add one DOM listener per element, shared by all of its listeners", () => {
    const element = document.createElement("div");
    const addEventListener = vi.spyOn(element, "addEventListener");
    const listenerA = createListener();
    const listenerB = createListener();

    register(listenerA, element);
    register(listenerB, element);
    // Registering the same listener twice is ignored
    register(listenerA, element);
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    element.dispatchEvent(new window.Event("scroll"));
    expect(listenerA.handleScrollEvent).toHaveBeenCalledTimes(1);
    expect(listenerB.handleScrollEvent).toHaveBeenCalledTimes(1);
  });

  it("should only notify the listeners of the element that scrolled", () => {
    const elementA = document.createElement("div");
    const elementB = document.createElement("div");
    const listenerA = createListener();
    const listenerB = createListener();
    register(listenerA, elementA);
    register(listenerB, elementB);

    elementA.dispatchEvent(new window.Event("scroll"));
    expect(listenerA.handleScrollEvent).toHaveBeenCalledTimes(1);
    expect(listenerB.handleScrollEvent).not.toHaveBeenCalled();
  });

  it("should remove an element's DOM listener once its last listener unregisters, even if other elements still have listeners (#28)", () => {
    const elementA = document.createElement("div");
    const elementB = document.createElement("div");
    const removeEventListenerA = vi.spyOn(elementA, "removeEventListener");
    const removeEventListenerB = vi.spyOn(elementB, "removeEventListener");
    const listenerA1 = createListener();
    const listenerA2 = createListener();
    const listenerB = createListener();
    register(listenerA1, elementA);
    register(listenerA2, elementA);
    register(listenerB, elementB);

    unregisterScrollListener(listenerB, elementB);
    expect(removeEventListenerB).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeEventListenerA).not.toHaveBeenCalled();

    // Element A still has a listener
    unregisterScrollListener(listenerA1, elementA);
    expect(removeEventListenerA).not.toHaveBeenCalled();
    elementA.dispatchEvent(new window.Event("scroll"));
    expect(listenerA1.handleScrollEvent).not.toHaveBeenCalled();
    expect(listenerA2.handleScrollEvent).toHaveBeenCalledTimes(1);

    unregisterScrollListener(listenerA2, elementA);
    expect(removeEventListenerA).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should disable pointer events on the body while the window scrolls, and restore them after the longest interval", async () => {
    const listenerA = createListener(10);
    const listenerB = createListener(100);
    register(listenerA, window);
    register(listenerB, document.createElement("div"));
    document.body.style.pointerEvents = "all";

    dispatchWindowScroll();
    expect(document.body.style.pointerEvents).toEqual("none");
    expect(listenerA.handleScrollEvent).toHaveBeenCalledTimes(1);
    expect(listenerB.handleScrollEvent).not.toHaveBeenCalled();

    await wait(50);
    expect(document.body.style.pointerEvents).toEqual("none");
    expect(listenerA.resetIsScrolling).not.toHaveBeenCalled();

    await wait(150);
    expect(document.body.style.pointerEvents).toEqual("all");
    // Every listener is reset
    expect(listenerA.resetIsScrolling).toHaveBeenCalledTimes(1);
    expect(listenerB.resetIsScrolling).toHaveBeenCalledTimes(1);
  });

  it("should restart the interval on every scroll event", async () => {
    const listener = createListener(60);
    register(listener, window);

    dispatchWindowScroll();
    await wait(40);
    dispatchWindowScroll();
    await wait(40);
    expect(listener.resetIsScrolling).not.toHaveBeenCalled();
    expect(document.body.style.pointerEvents).toEqual("none");

    await wait(100);
    expect(listener.resetIsScrolling).toHaveBeenCalledTimes(1);
    expect(document.body.style.pointerEvents).toEqual("");
  });

  it("should not disable pointer events while an element scrolls", async () => {
    const element = document.createElement("div");
    const listener = createListener(10);
    register(listener, element);

    element.dispatchEvent(new window.Event("scroll"));
    expect(document.body.style.pointerEvents).toEqual("");

    // Its listeners are reset all the same
    await wait(50);
    expect(listener.resetIsScrolling).toHaveBeenCalledTimes(1);
  });

  it("should restore pointer events on the body once the last listener unregisters", () => {
    const listener = createListener(1000);
    registerScrollListener(listener, window);
    document.body.style.pointerEvents = "all";

    dispatchWindowScroll();
    expect(document.body.style.pointerEvents).toEqual("none");

    unregisterScrollListener(listener, window);
    expect(document.body.style.pointerEvents).toEqual("all");
  });
});
