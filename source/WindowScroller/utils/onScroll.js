// @flow

import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
import type WindowScroller from '../WindowScroller.js';
import {isWindow} from './dimensions';

let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;

function enablePointerEventsIfDisabled(doc) {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null;
    if (doc.body && originalBodyPointerEvents != null) {
      doc.body.style.pointerEvents = originalBodyPointerEvents;
    }

    originalBodyPointerEvents = null;
  }
}

const createEnablePointerEventsAfterDelayCallback = doc => () => {
  enablePointerEventsIfDisabled(doc);
  mountedInstances.forEach(instance => instance.__resetIsScrolling());
};

function enablePointerEventsAfterDelay(element) {
  if (disablePointerEventsTimeoutId) {
    cancelAnimationTimeout(disablePointerEventsTimeoutId);
  }

  var maximumTimeout = 0;
  mountedInstances.forEach(instance => {
    maximumTimeout = Math.max(
      maximumTimeout,
      instance.props.scrollingResetTimeInterval,
    );
  });

  disablePointerEventsTimeoutId = requestAnimationTimeout(
    createEnablePointerEventsAfterDelayCallback(element),
    maximumTimeout,
  );
}

function onScrollWindow(event) {
  const element = event.currentTarget;
  const doc = element.document;

  if (
    isWindow(event.currentTarget) &&
    originalBodyPointerEvents == null &&
    doc.body
  ) {
    originalBodyPointerEvents = doc.body.style.pointerEvents;

    doc.body.style.pointerEvents = 'none';
  }
  enablePointerEventsAfterDelay(doc);
  mountedInstances.forEach(instance => {
    if (instance.props.scrollElement === event.currentTarget) {
      instance.__handleWindowScrollEvent();
    }
  });
}

export function registerScrollListener(
  component: WindowScroller,
  element: any,
) {
  if (
    !mountedInstances.some(instance => instance.props.scrollElement === element)
  ) {
    element.addEventListener('scroll', onScrollWindow);
  }
  mountedInstances.push(component);
}

export function unregisterScrollListener(
  component: WindowScroller,
  element: any,
) {
  const doc = isWindow(element) ? element.document : document;
  mountedInstances = mountedInstances.filter(
    instance => instance !== component,
  );
  if (!mountedInstances.length) {
    element.removeEventListener('scroll', onScrollWindow);
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled(doc);
    }
  }
}
