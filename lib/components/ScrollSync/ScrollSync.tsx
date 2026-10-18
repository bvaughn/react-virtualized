import { memo, useCallback, useMemo, useRef, useState } from "react";
import type {
  ScrollSyncChild,
  ScrollSyncProps,
  ScrollSyncScrollParams
} from "./types";

type ScrollSyncRefCallback = (
  child: ScrollSyncChild | null
) => void | (() => void);

type ScrollOffsets = { scrollLeft: number; scrollTop: number };

const INITIAL_STATE: ScrollSyncScrollParams = {
  clientHeight: 0,
  clientWidth: 0,
  scrollHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
  scrollWidth: 0
};

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */
export const ScrollSync = /* @__PURE__ */ memo(function ScrollSync({
  children
}: ScrollSyncProps) {
  const [state, setState] = useState<ScrollSyncScrollParams>(INITIAL_STATE);

  // Registered children, by key
  const childrenRef = useRef<Map<string, ScrollSyncChild>>(new Map());

  // Stable ref callbacks, by key
  const refCallbacksRef = useRef<Map<string, ScrollSyncRefCallback>>(new Map());

  // The child most recently registered under each key (not cleared when it is detached)
  const lastRegisteredRef = useRef<Map<string, ScrollSyncChild>>(new Map());

  // The offsets the registered children have been synced to
  const syncedRef = useRef<ScrollOffsets>({ scrollLeft: 0, scrollTop: 0 });

  // Whether any registered child has been scrolled by ScrollSync yet
  const hasSyncedRef = useRef(false);

  const onScroll = useCallback((params: ScrollSyncScrollParams) => {
    const synced = syncedRef.current;
    const hasSynced = hasSyncedRef.current;

    // Once children have been synced, a reported offset that matches the synced one is a child echoing the
    // offset ScrollSync just scrolled it to; ignore it so that its size values don't replace the scrolled child's.
    if (
      hasSynced &&
      params.scrollLeft === synced.scrollLeft &&
      params.scrollTop === synced.scrollTop
    ) {
      return;
    }

    // A synced child that can't scroll as far as the synced offset (e.g. a header row that only scrolls horizontally)
    // reports its clamped offset (its maximum) the next time it scrolls; don't propagate that back to the other children.
    const isClamped = (
      offset: number,
      syncedOffset: number,
      scrollSize: number,
      clientSize: number
    ) =>
      hasSynced && offset < syncedOffset && offset >= scrollSize - clientSize;

    // (List and Table only report a scrollTop)
    const leftChanged =
      typeof params.scrollLeft === "number" &&
      params.scrollLeft !== synced.scrollLeft &&
      !isClamped(
        params.scrollLeft,
        synced.scrollLeft,
        params.scrollWidth,
        params.clientWidth
      );
    const topChanged =
      typeof params.scrollTop === "number" &&
      params.scrollTop !== synced.scrollTop &&
      !isClamped(
        params.scrollTop,
        synced.scrollTop,
        params.scrollHeight,
        params.clientHeight
      );

    if (hasSynced && !leftChanged && !topChanged) {
      return;
    }

    const scrollLeft = leftChanged ? params.scrollLeft : synced.scrollLeft;
    const scrollTop = topChanged ? params.scrollTop : synced.scrollTop;

    syncedRef.current = { scrollLeft, scrollTop };

    setState({
      clientHeight: params.clientHeight,
      clientWidth: params.clientWidth,
      scrollHeight: params.scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth: params.scrollWidth
    });

    if (leftChanged || topChanged) {
      const position: { scrollLeft?: number; scrollTop?: number } = {};
      if (leftChanged) {
        position.scrollLeft = scrollLeft;
      }
      if (topChanged) {
        position.scrollTop = scrollTop;
      }

      childrenRef.current.forEach((child) => {
        hasSyncedRef.current = true;

        // The child that reported this offset is already there, so this is a no-op for it
        child.scrollToPosition(position);
      });
    }
  }, []);

  const registerChild = useCallback((key: string) => {
    let refCallback = refCallbacksRef.current.get(key);
    if (!refCallback) {
      refCallback = (child: ScrollSyncChild | null) => {
        const map = childrenRef.current;
        if (child) {
          if (typeof child.scrollToPosition !== "function") {
            throw Error(
              "Unexpected child type registered; only components with a scrollToPosition() method (e.g. Grid) are supported."
            );
          }

          map.set(key, child);

          // Bring a child registered after scrolling has happened in line with the others
          // (unless it's the same child being re-attached, e.g. because of an inline ref callback or StrictMode).
          const isNewChild = lastRegisteredRef.current.get(key) !== child;
          lastRegisteredRef.current.set(key, child);

          const { scrollLeft, scrollTop } = syncedRef.current;
          if (isNewChild && (scrollLeft !== 0 || scrollTop !== 0)) {
            hasSyncedRef.current = true;
            child.scrollToPosition({ scrollLeft, scrollTop });
          }

          // React 19 calls this cleanup function (instead of calling the ref with null) when the child unmounts;
          // only unregister the child if it hasn't been replaced by another one registered under the same key.
          return () => {
            if (map.get(key) === child) {
              map.delete(key);
            }
          };
        } else {
          // React 18
          map.delete(key);
        }
      };
      refCallbacksRef.current.set(key, refCallback);
    }
    return refCallback;
  }, []);

  const childProps = useMemo(
    () => ({ ...state, onScroll, registerChild }),
    [onScroll, registerChild, state]
  );

  return children(childProps);
});
