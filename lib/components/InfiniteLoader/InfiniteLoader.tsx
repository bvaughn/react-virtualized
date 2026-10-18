import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useInsertionEffect,
  useMemo,
  useRef
} from "react";
import { createCallbackMemoizer } from "../../utils/createCallbackMemoizer";
import type {
  IndexRange,
  InfiniteLoaderChildInstance,
  InfiniteLoaderImperativeAPI,
  InfiniteLoaderProps
} from "./types";
import { defaultInfiniteLoaderProps } from "./defaultInfiniteLoaderProps";
import {
  forceUpdateReactVirtualizedComponent,
  isRangeVisible,
  scanForUnloadedRanges
} from "./utils";

type LatestProps = Pick<InfiniteLoaderProps, "isRowLoaded" | "loadMoreRows"> & {
  minimumBatchSize: number;
  rowCount: number;
  threshold: number;
};

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */
export const InfiniteLoader = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<InfiniteLoaderImperativeAPI, InfiniteLoaderProps>(
    function InfiniteLoader(
      {
        children,
        isRowLoaded,
        loadMoreRows,
        minimumBatchSize = defaultInfiniteLoaderProps.minimumBatchSize,
        rowCount = defaultInfiniteLoaderProps.rowCount,
        threshold = defaultInfiniteLoaderProps.threshold
      },
      ref
    ) {
      // The registered child calls onRowsRendered from its own commit phase (e.g. componentDidMount/componentDidUpdate),
      // which runs before this component's layout effects; so the latest props are stored in an insertion effect,
      // which runs before any layout effects (without mutating anything during render).
      const latestPropsRef = useRef<LatestProps>({
        isRowLoaded,
        loadMoreRows,
        minimumBatchSize,
        rowCount,
        threshold
      });
      useInsertionEffect(() => {
        latestPropsRef.current = {
          isRowLoaded,
          loadMoreRows,
          minimumBatchSize,
          rowCount,
          threshold
        };
      });

      const lastRenderedRangeRef = useRef<{
        startIndex: number | undefined;
        stopIndex: number | undefined;
      }>({ startIndex: undefined, stopIndex: undefined });
      const loadMoreRowsMemoizerRef = useRef<ReturnType<
        typeof createCallbackMemoizer
      > | null>(null);
      const registeredChildRef = useRef<InfiniteLoaderChildInstance | null>(
        null
      );

      const getLoadMoreRowsMemoizer = useCallback(() => {
        if (loadMoreRowsMemoizerRef.current === null) {
          loadMoreRowsMemoizerRef.current = createCallbackMemoizer();
        }
        return loadMoreRowsMemoizerRef.current;
      }, []);

      const loadUnloadedRanges = useCallback((unloadedRanges: IndexRange[]) => {
        const { loadMoreRows } = latestPropsRef.current;

        unloadedRanges.forEach((unloadedRange) => {
          const promise = loadMoreRows(unloadedRange);
          if (promise) {
            promise.then(() => {
              // Refresh the visible rows if any of them have just been loaded.
              // Otherwise they will remain in their unloaded visual state.
              // (If the child has been unmounted, it is no longer registered and nothing is updated.)
              const { startIndex, stopIndex } = lastRenderedRangeRef.current;
              if (
                isRangeVisible({
                  lastRenderedStartIndex: startIndex as number,
                  lastRenderedStopIndex: stopIndex as number,
                  startIndex: unloadedRange.startIndex,
                  stopIndex: unloadedRange.stopIndex
                })
              ) {
                const registeredChild = registeredChildRef.current;
                if (registeredChild) {
                  forceUpdateReactVirtualizedComponent(
                    registeredChild,
                    startIndex
                  );
                }
              }
            });
          }
        });
      }, []);

      const loadRange = useCallback(
        (startIndex: number, stopIndex: number) => {
          const { isRowLoaded, minimumBatchSize, rowCount, threshold } =
            latestPropsRef.current;

          const unloadedRanges = scanForUnloadedRanges({
            isRowLoaded,
            minimumBatchSize,
            rowCount,
            startIndex: Math.max(0, startIndex - threshold),
            stopIndex: Math.min(rowCount - 1, stopIndex + threshold)
          });

          // For memoize comparison
          const squashedUnloadedRanges = ([] as number[]).concat(
            ...unloadedRanges.map(({ startIndex, stopIndex }) => [
              startIndex,
              stopIndex
            ])
          );

          getLoadMoreRowsMemoizer()({
            callback: () => {
              loadUnloadedRanges(unloadedRanges);
            },
            indices: { squashedUnloadedRanges }
          });
        },
        [getLoadMoreRowsMemoizer, loadUnloadedRanges]
      );

      const onRowsRendered = useCallback(
        ({ startIndex, stopIndex }: IndexRange) => {
          lastRenderedRangeRef.current = { startIndex, stopIndex };

          loadRange(startIndex, stopIndex);
        },
        [loadRange]
      );

      const registerChild = useCallback(
        (registeredChild: InfiniteLoaderChildInstance | null) => {
          registeredChildRef.current = registeredChild;
        },
        []
      );

      // The handle object is created once, so it stays stable even if the ref itself changes.
      const imperativeHandle = useMemo<InfiniteLoaderImperativeAPI>(
        () => ({
          resetLoadMoreRowsCache(autoReload?: boolean) {
            loadMoreRowsMemoizerRef.current = createCallbackMemoizer();

            if (autoReload) {
              const { startIndex, stopIndex } = lastRenderedRangeRef.current;
              loadRange(startIndex as number, stopIndex as number);
            }
          }
        }),
        [loadRange]
      );
      useImperativeHandle(ref, () => imperativeHandle, [imperativeHandle]);

      return children({
        onRowsRendered,
        registerChild
      });
    }
  )
);
