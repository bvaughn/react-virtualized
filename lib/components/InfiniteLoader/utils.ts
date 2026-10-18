import type {
  IndexRange,
  InfiniteLoaderChildInstance,
  InfiniteLoaderProps
} from "./types";

/**
 * Determines if the specified start/stop range is visible based on the most recently rendered range.
 */
export function isRangeVisible({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex
}: {
  lastRenderedStartIndex: number;
  lastRenderedStopIndex: number;
  startIndex: number;
  stopIndex: number;
}): boolean {
  return !(
    startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex
  );
}

/**
 * Returns all of the ranges within a larger range that contain unloaded rows.
 */
export function scanForUnloadedRanges({
  isRowLoaded,
  minimumBatchSize,
  rowCount,
  startIndex,
  stopIndex
}: {
  isRowLoaded: InfiniteLoaderProps["isRowLoaded"];
  minimumBatchSize: number;
  rowCount: number;
  startIndex: number;
  stopIndex: number;
}): IndexRange[] {
  const unloadedRanges: IndexRange[] = [];

  let rangeStartIndex: number | null = null;
  let rangeStopIndex: number | null = null;

  for (let index = startIndex; index <= stopIndex; index++) {
    const loaded = isRowLoaded({ index });

    if (!loaded) {
      rangeStopIndex = index;
      if (rangeStartIndex === null) {
        rangeStartIndex = index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push({
        startIndex: rangeStartIndex!,
        stopIndex: rangeStopIndex
      });

      rangeStartIndex = rangeStopIndex = null;
    }
  }

  // If :rangeStopIndex is not null it means we haven't ran out of unloaded rows.
  // Scan forward to try filling our :minimumBatchSize.
  if (rangeStopIndex !== null) {
    const potentialStopIndex = Math.min(
      Math.max(rangeStopIndex, rangeStartIndex! + minimumBatchSize - 1),
      rowCount - 1
    );

    for (let index = rangeStopIndex + 1; index <= potentialStopIndex; index++) {
      if (!isRowLoaded({ index })) {
        rangeStopIndex = index;
      } else {
        break;
      }
    }

    unloadedRanges.push({
      startIndex: rangeStartIndex!,
      stopIndex: rangeStopIndex
    });
  }

  // Check to see if our first range ended prematurely.
  // In this case we should scan backwards to try filling our :minimumBatchSize.
  if (unloadedRanges.length) {
    const firstUnloadedRange = unloadedRanges[0];

    while (
      firstUnloadedRange.stopIndex - firstUnloadedRange.startIndex + 1 <
        minimumBatchSize &&
      firstUnloadedRange.startIndex > 0
    ) {
      const index = firstUnloadedRange.startIndex - 1;

      if (!isRowLoaded({ index })) {
        firstUnloadedRange.startIndex = index;
      } else {
        break;
      }
    }
  }

  return unloadedRanges;
}

/**
 * Since RV components skip re-rendering when their props haven't changed (`PureComponent`/`memo`),
 * a render must be forced once rows have loaded (even though props haven't changed).
 * The registered child may be a class instance (e.g. a 9.x-style component) or a function component's imperative handle,
 * and function components have no `forceUpdate()` method; so the first available method below is used:
 *
 * 1. `recomputeGridSize({ rowIndex })` (e.g. `Grid`, `List`, `Table`, `MultiGrid`)
 * 2. `recomputeRowHeights(index)` (e.g. `List`, `Table`)
 * 3. `forceUpdateGrid()` (e.g. `List`, `Table`)
 * 4. `forceUpdate()` (any class component)
 *
 * The recompute methods are preferred because, while a Grid is scrolling, its cells may be cached;
 * so it's important to invalidate that cache by recalculating sizes before forcing a re-render.
 * (Calling `forceUpdate()` on a `List` or `Table` would not re-render the inner `Grid`.)
 */
export function forceUpdateReactVirtualizedComponent(
  component: InfiniteLoaderChildInstance,
  currentIndex: number = 0
) {
  if (typeof component.recomputeGridSize === "function") {
    component.recomputeGridSize({ rowIndex: currentIndex });
  } else if (typeof component.recomputeRowHeights === "function") {
    component.recomputeRowHeights(currentIndex);
  } else if (typeof component.forceUpdateGrid === "function") {
    component.forceUpdateGrid();
  } else if (typeof component.forceUpdate === "function") {
    component.forceUpdate();
  } else if (process.env.NODE_ENV !== "production") {
    console.warn(
      "InfiniteLoader: the registered child does not implement recomputeGridSize(), recomputeRowHeights(), forceUpdateGrid() or forceUpdate(); it can't be re-rendered after rows have loaded."
    );
  }
}
