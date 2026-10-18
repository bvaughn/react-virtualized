import type { InfiniteLoaderProps } from "./types";

/**
 * Default values for `InfiniteLoader`'s optional props.
 */
export const defaultInfiniteLoaderProps = /* @__PURE__ */ Object.freeze({
  minimumBatchSize: 10,
  rowCount: 0,
  threshold: 15
} as const satisfies Partial<InfiniteLoaderProps>);
