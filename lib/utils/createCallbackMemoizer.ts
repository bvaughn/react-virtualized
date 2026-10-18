/**
 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
 */
export function createCallbackMemoizer(requireAllKeys = true) {
  let cachedIndices: Record<string, unknown> = {};

  return <Indices extends object>({
    callback,
    indices
  }: {
    callback: (indices: Indices) => void;
    indices: Indices;
  }) => {
    const indicesMap = indices as Record<string, unknown>;
    const keys = Object.keys(indices);
    const allInitialized =
      !requireAllKeys ||
      keys.every((key) => {
        const value = indicesMap[key];
        return Array.isArray(value) ? value.length > 0 : (value as number) >= 0;
      });
    const indexChanged =
      keys.length !== Object.keys(cachedIndices).length ||
      keys.some((key) => {
        const cachedValue = cachedIndices[key];
        const value = indicesMap[key];

        return Array.isArray(value)
          ? (cachedValue as unknown[]).join(",") !== value.join(",")
          : cachedValue !== value;
      });

    cachedIndices = indicesMap;

    if (allInitialized && indexChanged) {
      callback(indices);
    }
  };
}
