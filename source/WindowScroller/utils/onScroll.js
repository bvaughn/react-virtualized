let mountedInstances = []
let originalBodyPointerEvents = null
let disablePointerEventsTimeoutId = null

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150

function enablePointerEventsIfDisabled () {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null

    document.body.style.pointerEvents = originalBodyPointerEvents

    originalBodyPointerEvents = null
  }
}

function enablePointerEventsAfterDelayCallback () {
  enablePointerEventsIfDisabled()
  mountedInstances.forEach(component => component._enablePointerEventsAfterDelayCallback())
}

function enablePointerEventsAfterDelay () {
  if (disablePointerEventsTimeoutId) {
    clearTimeout(disablePointerEventsTimeoutId)
  }

  disablePointerEventsTimeoutId = setTimeout(
      enablePointerEventsAfterDelayCallback,
      IS_SCROLLING_TIMEOUT
    )
}

function onScrollWindow (event) {
  if (event.currentTarget === window && originalBodyPointerEvents == null) {
    originalBodyPointerEvents = document.body.style.pointerEvents

    document.body.style.pointerEvents = 'none'
  }
  enablePointerEventsAfterDelay()
  mountedInstances.forEach(component => component._onScrollWindow(event))
}

export function registerScrollListener (component, element = window) {
  if (!mountedInstances.length) {
    element.addEventListener('scroll', onScrollWindow)
  }
  mountedInstances.push(component)
}

export function unregisterScrollListener (component, element = window) {
  mountedInstances = mountedInstances.filter(c => (c !== component))
  if (!mountedInstances.length) {
    element.removeEventListener('scroll', onScrollWindow)
    if (disablePointerEventsTimeoutId) {
      clearTimeout(disablePointerEventsTimeoutId)
      enablePointerEventsIfDisabled()
    }
  }
}

