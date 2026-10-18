import { useInsertionEffect, useState } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import {
  getDimensions,
  getPositionOffset,
  getScrollOffset
} from "./dimensions";
import {
  registerScrollListener,
  unregisterScrollListener,
  type ScrollElementListener
} from "./scrollListeners";
import type {
  ResolvedScrollElement,
  ScrollElement,
  ScrollElementLinkSource,
  ScrollElementLinkTarget,
  ScrollElementViewport
} from "./types";

type Instance = ScrollElementListener & {
  element: ResolvedScrollElement | null;
  scrollingResetTimeInterval: number;
  source: ScrollElementLinkSource;
  target: ScrollElementLinkTarget;
  // Most recently provided to the target
  viewport: ScrollElementViewport;

  // Measures the scroll element and the target's position within it, and provides the target with the resulting viewport (if it changed)
  update(isScrolling: boolean): void;
};

/** Resolves the `scrollElement` prop to the object that is listened to (null during server rendering, or if not specified). */
export function resolveScrollElement(
  scrollElement: ScrollElement | null | undefined
): ResolvedScrollElement | null {
  if (scrollElement === "window") {
    return typeof window !== "undefined" ? window : null;
  }
  return scrollElement ?? null;
}

function measureViewport(
  element: ResolvedScrollElement,
  target: ScrollElementLinkTarget,
  isScrolling: boolean
): ScrollElementViewport {
  const targetElement = target.getElement();
  const positionFromTop = targetElement
    ? getPositionOffset(targetElement, element).top
    : 0;

  return {
    height: getDimensions(element).height,
    isScrolling,
    scrollTop: getScrollOffset(element).top - positionFromTop
  };
}

function createInstance(
  target: ScrollElementLinkTarget,
  scrollingResetTimeInterval: number
): Instance {
  const instance: Instance = {
    element: null,
    scrollingResetTimeInterval,
    target,
    viewport: { height: 0, isScrolling: false, scrollTop: 0 },

    source: {
      scrollTo(scrollTop) {
        const { element } = instance;
        if (element === null) {
          return false;
        }

        // Measure the position again, in case content above the component has changed size since it was last measured
        const targetElement = instance.target.getElement();
        const positionFromTop = targetElement
          ? getPositionOffset(targetElement, element).top
          : 0;

        const scrollOffset = getScrollOffset(element);
        const top = scrollTop + positionFromTop;
        if (Math.abs(scrollOffset.top - top) < 1) {
          return false;
        }

        if (typeof element.scrollTo === "function") {
          // Preserve the current horizontal scroll position
          element.scrollTo(scrollOffset.left, top);
        } else {
          (element as Element).scrollTop = top;
        }
        return true;
      }
    },

    update(isScrolling) {
      const { element } = instance;
      if (element === null) {
        return;
      }

      const viewport = measureViewport(element, instance.target, isScrolling);
      const prevViewport = instance.viewport;
      if (
        viewport.height !== prevViewport.height ||
        viewport.isScrolling !== prevViewport.isScrolling ||
        viewport.scrollTop !== prevViewport.scrollTop
      ) {
        instance.viewport = viewport;
        instance.target.setViewport(viewport);
      }
    },

    // ScrollElementListener (called by scrollListeners.ts)
    getScrollingResetTimeInterval() {
      return instance.scrollingResetTimeInterval;
    },

    handleScrollEvent() {
      instance.update(true);
    },

    resetIsScrolling() {
      instance.update(false);
    }
  };

  return instance;
}

// Calls `onResize` when the scroll element is resized: the window (resize event) or an element (ResizeObserver).
// Returns a function that stops observing it.
function observeResize(element: ResolvedScrollElement, onResize: () => void) {
  if (element === window) {
    window.addEventListener("resize", onResize, false);
    return () => window.removeEventListener("resize", onResize, false);
  }

  const ResizeObserverImpl =
    (element as Element).ownerDocument?.defaultView?.ResizeObserver ??
    (typeof ResizeObserver !== "undefined" ? ResizeObserver : undefined);
  if (!ResizeObserverImpl) {
    return () => {};
  }

  const resizeObserver = new ResizeObserverImpl(onResize);
  resizeObserver.observe(element as Element, { box: "border-box" });
  return () => resizeObserver.disconnect();
}

/**
 * Links a component (the target) to the element that scrolls it (its `scrollElement` prop): the window or a scrollable element.
 *
 * While the scroll element is available, the target is linked to it (see `ScrollElementLinkTarget`):
 * it is provided with the part of the scroll element that is visible to it (its viewport),
 * which is measured again whenever the scroll element scrolls or is resized, and after every commit of the component
 * (so that its position within the scroll element is current, e.g. if content above it has changed size).
 * The target scrolls the scroll element through the link source it is provided with.
 *
 * The target is unlinked when the scroll element is removed (or changes) and when the component unmounts.
 * (During server rendering, effects don't run, so the target is never linked.)
 */
export function useScrollElementLink(
  scrollElement: ScrollElement | null | undefined,
  target: ScrollElementLinkTarget,
  scrollingResetTimeInterval: number
) {
  const [instance] = useState(() =>
    createInstance(target, scrollingResetTimeInterval)
  );

  useInsertionEffect(() => {
    instance.scrollingResetTimeInterval = scrollingResetTimeInterval;
  });

  const element = resolveScrollElement(scrollElement);

  useIsomorphicLayoutEffect(() => {
    if (element === null) {
      return;
    }

    instance.element = element;
    instance.viewport = measureViewport(element, instance.target, false);
    instance.target.link(instance.source, instance.viewport);

    registerScrollListener(instance, element);
    const stopObservingResize = observeResize(element, () =>
      instance.update(instance.viewport.isScrolling)
    );

    return () => {
      unregisterScrollListener(instance, element);
      stopObservingResize();

      instance.element = null;
      instance.target.link(null, instance.viewport);
    };
  }, [element, instance]);

  // The component's position within the scroll element may have changed (e.g. if content above it has changed size)
  useIsomorphicLayoutEffect(() => {
    instance.update(instance.viewport.isScrolling);
  });
}
