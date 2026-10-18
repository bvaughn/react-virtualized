import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` in the browser; `useEffect` during server rendering (where layout effects warn and never run).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
