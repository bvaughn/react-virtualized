/**
 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
 */
export default function createCallbackMemoizer (requireAllKeys = true) {
  let cachedIndices = {}

  return ({
    callback,
    indices
  }) => {
    const keys = Object.keys(indices)
    const allInitialized = !requireAllKeys || keys.every(key => indices[key] >= 0)
    const indexChanged =
      keys.length !== Object.keys(cachedIndices).length ||
      keys.some(key => cachedIndices[key] !== indices[key])

    cachedIndices = indices

    if (allInitialized && indexChanged) {
      callback(indices)
    }
  }
}
