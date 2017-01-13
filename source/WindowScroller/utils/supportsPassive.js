let resolved = false
let supportsPassive = false

export function isPassiveSupported () {
  if (resolved) {
    return supportsPassive
  }
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}

  resolved = true
  return supportsPassive
}
