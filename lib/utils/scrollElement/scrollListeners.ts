import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
  type AnimationTimeoutId
} from "../requestAnimationTimeout";
import type { ResolvedScrollElement } from "./types";

/**
 * Stable, per-instance object that a component registers to receive the (shared) scroll events of its scroll element.
 * Its methods read the instance's latest props/state, so the object itself never changes.
 */
export type ScrollElementListener = {
  /** Wait time (in milliseconds) after the last scroll event before `resetIsScrolling()` is called. */
  getScrollingResetTimeInterval(): number;

  /** Called when the element the listener is registered for scrolls. */
  handleScrollEvent(): void;

  /** Called once scrolling has stopped (for the longest interval of all registered listeners). */
  resetIsScrolling(): void;
};

type Registration = {
  listener: ScrollElementListener;
  element: ResolvedScrollElement;
};

let registrations: Registration[] = [];
let originalBodyPointerEvents: string | null = null;
let disablePointerEventsTimeoutId: AnimationTimeoutId | null = null;

function enablePointerEventsIfDisabled() {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null;

    if (document.body && originalBodyPointerEvents != null) {
      document.body.style.pointerEvents = originalBodyPointerEvents;
    }

    originalBodyPointerEvents = null;
  }
}

function enablePointerEventsAfterDelayCallback() {
  enablePointerEventsIfDisabled();
  registrations.forEach(({ listener }) => listener.resetIsScrolling());
}

function enablePointerEventsAfterDelay() {
  if (disablePointerEventsTimeoutId) {
    cancelAnimationTimeout(disablePointerEventsTimeoutId);
  }

  let maximumTimeout = 0;
  registrations.forEach(({ listener }) => {
    maximumTimeout = Math.max(
      maximumTimeout,
      listener.getScrollingResetTimeInterval()
    );
  });

  disablePointerEventsTimeoutId = requestAnimationTimeout(
    enablePointerEventsAfterDelayCallback,
    maximumTimeout
  );
}

function onScroll(event: Event) {
  if (
    event.currentTarget === window &&
    originalBodyPointerEvents == null &&
    document.body
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = "none";
  }
  enablePointerEventsAfterDelay();
  registrations.forEach(({ listener, element }) => {
    if (element === event.currentTarget) {
      listener.handleScrollEvent();
    }
  });
}

export function registerScrollListener(
  listener: ScrollElementListener,
  element: ResolvedScrollElement
) {
  if (
    registrations.some(
      (registration) =>
        registration.listener === listener && registration.element === element
    )
  ) {
    return;
  }

  if (!registrations.some((registration) => registration.element === element)) {
    element.addEventListener("scroll", onScroll);
  }
  registrations.push({ listener, element });
}

export function unregisterScrollListener(
  listener: ScrollElementListener,
  element: ResolvedScrollElement
) {
  registrations = registrations.filter(
    (registration) =>
      registration.listener !== listener || registration.element !== element
  );

  // Remove the listener once no instance is listening to this element anymore,
  // even if other instances are still listening to other elements
  if (!registrations.some((registration) => registration.element === element)) {
    element.removeEventListener("scroll", onScroll);
  }

  if (!registrations.length) {
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}
