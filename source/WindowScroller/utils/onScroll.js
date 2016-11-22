import styles from '../WindowScroller.css'
let mountedInstances = []
let disablePointerEventsTimeoutId = null

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150

function enablePointerEventsIfDisabled (element) {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null
    element.classList.remove(styles.disabled)
  }
}

function enablePointerEventsAfterDelayCallback (element) {
  enablePointerEventsIfDisabled(element)
  mountedInstances.forEach(component => component._enablePointerEventsAfterDelayCallback())
}

function enablePointerEventsAfterDelay (element) {
  if (disablePointerEventsTimeoutId) {
    clearTimeout(disablePointerEventsTimeoutId)
  }

  disablePointerEventsTimeoutId = setTimeout(
    enablePointerEventsAfterDelayCallback,
    IS_SCROLLING_TIMEOUT,
    element
  )
}

function onScrollWindow (event) {
  const disabledElement = event.currentTarget === window ? document.documentElement : event.currentTarget
  disabledElement.classList.add(styles.disabled)

  enablePointerEventsAfterDelay(disabledElement)
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
      enablePointerEventsIfDisabled(element === window ? document.documentElement : element)
    }
  }
}

