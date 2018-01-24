/**
 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
 */
export default function createCallbackMemoizer(requireAllKeys = true) {
  let cachedIndices = {};

  return ({callback, indices}) => {
    const keys = Object.keys(indices);
    const allInitialized =
      !requireAllKeys ||
      keys.every(key => {
        const value = indices[key];
        return Array.isArray(value) ? value.length > 0 : value >= 0;
      });
    const indexChanged =
      keys.length !== Object.keys(cachedIndices).length ||
      keys.some(key => {
        const cachedValue = cachedIndices[key];
        const value = indices[key];

        return Array.isArray(value)
          ? cachedValue.join(',') !== value.join(',')
          : cachedValue !== value;
      });

    cachedIndices = indices;

    if (allInitialized && indexChanged) {
      callback(indices);
    }
  };
}
