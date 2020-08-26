// @flow

import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
import type WindowScroller from '../WindowScroller.js';

// mountedInstances: [Instance, scrollElement][]
let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;

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
  mountedInstances.forEach(instance => instance[0].__resetIsScrolling());
}

function enablePointerEventsAfterDelay() {
  if (disablePointerEventsTimeoutId) {
    cancelAnimationTimeout(disablePointerEventsTimeoutId);
  }

  var maximumTimeout = 0;
  mountedInstances.forEach(instance => {
    maximumTimeout = Math.max(
      maximumTimeout,
      instance[0].props.scrollingResetTimeInterval,
    );
  });

  disablePointerEventsTimeoutId = requestAnimationTimeout(
    enablePointerEventsAfterDelayCallback,
    maximumTimeout,
  );
}

function onScrollWindow(event: Event) {
  if (
    event.currentTarget === window &&
    originalBodyPointerEvents == null &&
    document.body
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = 'none';
  }
  enablePointerEventsAfterDelay();
  mountedInstances.forEach(instance => {
    if (instance[1] === event.currentTarget) {
      instance[0].__handleWindowScrollEvent();
    }
  });
}

export function registerScrollListener(
  component: WindowScroller,
  element: Element,
) {
  if (!mountedInstances.some(instance => instance[1] === element)) {
    element.addEventListener('scroll', onScrollWindow);
  }
  mountedInstances.push([component, component.props.scrollElement]);
}

export function unregisterScrollListener(
  component: WindowScroller,
  element: Element,
) {
  // remove current instance
  mountedInstances = mountedInstances.filter(
    instance => instance[0] !== component,
  );

  // filter all instance => element === prevScrollElement
  const prevScrollElementInstances = mountedInstances.filter(
    instance => instance[1] === element,
  );

  if (!prevScrollElementInstances.length) {
    element.removeEventListener('scroll', onScrollWindow);
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}
