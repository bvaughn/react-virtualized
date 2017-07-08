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
  mountedInstances.forEach(
    instance => instance.__resetIsScrolling()
  )
}

function enablePointerEventsAfterDelay () {
  if (disablePointerEventsTimeoutId) {
    clearTimeout(disablePointerEventsTimeoutId)
  }

  var maximumTimeout = IS_SCROLLING_TIMEOUT
  mountedInstances.forEach(function (instance) {
    if (instance.props.scrollingResetTimeInterval) {
      if (instance.props.scrollingResetTimeInterval > maximumTimeout) {
        maximumTimeout = instance.props.scrollingResetTimeInterval
      }
    }
  })

  disablePointerEventsTimeoutId = setTimeout(
      enablePointerEventsAfterDelayCallback,
      maximumTimeout
    )
}

function onScrollWindow (event) {
  if (event.currentTarget === window && originalBodyPointerEvents == null) {
    originalBodyPointerEvents = document.body.style.pointerEvents

    document.body.style.pointerEvents = 'none'
  }
  enablePointerEventsAfterDelay()
  mountedInstances.forEach(instance => {
    if (instance.scrollElement === event.currentTarget) {
      instance.__handleWindowScrollEvent(event)
    }
  })
}

export function registerScrollListener (component, element) {
  if (
    !mountedInstances.some(
      instance => instance.scrollElement === element
    )
  ) {
    element.addEventListener('scroll', onScrollWindow)
  }
  mountedInstances.push(component)
}

export function unregisterScrollListener (component, element) {
  mountedInstances = mountedInstances.filter(
    instance => instance !== component
  )
  if (!mountedInstances.length) {
    element.removeEventListener('scroll', onScrollWindow)
    if (disablePointerEventsTimeoutId) {
      clearTimeout(disablePointerEventsTimeoutId)
      enablePointerEventsIfDisabled()
    }
  }
}

