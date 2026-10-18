import { useEffect } from "react";
import type { ScrollElement } from "./types";

/** Warns (in DEV) if a component has neither a `height` nor a `scrollElement` (it then renders nothing). */
export function useMissingHeightWarning(
  componentName: string,
  height: number | undefined,
  scrollElement: ScrollElement | null | undefined
) {
  const heightMissing = height === undefined && scrollElement === undefined;
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && heightMissing) {
      console.warn(
        `${componentName} requires a height prop (unless a scrollElement is specified)`
      );
    }
  }, [componentName, heightMissing]);
}
