import clsx from "clsx";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useInsertionEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type UIEvent
} from "react";
import {
  cancelAnimationTimeout,
  requestAnimationTimeout,
  type AnimationTimeoutId
} from "../../utils/requestAnimationTimeout";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type { ScrollElementLinkTarget } from "../../utils/scrollElement/types";
import { useMissingHeightWarning } from "../../utils/scrollElement/useMissingHeightWarning";
import { useScrollElementLink } from "../../utils/scrollElement/useScrollElementLink";
import { defaultMasonryProps } from "./defaultMasonryProps";
import { PositionCache } from "./PositionCache";
import type {
  MasonryCellMeasurerCache,
  MasonryImperativeAPI,
  MasonryProps,
  Positioner
} from "./types";

type State = {
  isScrolling: boolean;

  // Scroll offset of the Masonry's own scrolling container
  scrollTop: number;

  // The viewport of the scroll element the Masonry is linked to (its scrollElement prop; see useScrollElementLink), or null if not linked.
  // While linked, the Masonry renders at its full height and is scrolled by the scroll element.
  linkedViewport: LinkedViewport | null;
};

type LinkedViewport = {
  // Height of the scroll element's viewport
  height: number;
  // Scroll offset of the scroll element, relative to the top of the Masonry (and at least 0)
  scrollTop: number;
};

// Values from the most recently committed render, used by the (stable) imperative handle and event handlers
type LatestValues = {
  cellCount: number;
  cellMeasurerCache: MasonryCellMeasurerCache;
  cellPositioner: Positioner;
  height: number;
  scrollingResetTimeInterval: number;
  width: number;
};

type MasonryInternals = {
  debounceResetIsScrollingId: AnimationTimeoutId | null;
  element: HTMLDivElement | null;
  invalidateOnUpdateStartIndex: number | null;
  invalidateOnUpdateStopIndex: number | null;
  latest: LatestValues;
  // Mirrors State.linkedViewport (updated by the link target methods, during commit or event handlers)
  linkedViewport: LinkedViewport | null;
  onScrollMemoized: number | undefined;
  positionCache: PositionCache;
  startIndexMemoized: number | null;
  stopIndexMemoized: number | null | undefined;
};

type MasonryInstance = {
  handle: MasonryImperativeAPI;
  linkTarget: ScrollElementLinkTarget;
  internals: MasonryInternals;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  setElementRef: (element: HTMLDivElement | null) => void;
};

const increment = (value: number) => value + 1;

/**
 * This component efficiently displays arbitrarily positioned cells using windowing techniques.
 * Cell position is determined by an injected `cellPositioner` property.
 * Windowing is vertical; this component does not support horizontal scrolling.
 *
 * Rendering occurs in two phases:
 * 1) First pass uses estimated cell sizes (provided by the cache) to determine how many cells to measure in a batch.
 *    Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled.
 *    After measurement is complete (once the render has been committed) this component evaluates positioned cells
 *    in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes).
 *    All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.
 * 2) Second pass uses the external `cellPositioner` to layout cells.
 *    At this time the positioner has access to cached size measurements for all cells.
 *    The positions it returns are cached by Masonry for fast access later.
 *    Phase one is repeated if the user scrolls beyond the current layout's bounds.
 *    If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()`.
 *
 * Animation constraints:
 *   Simple animations are supported (eg translate/slide into place on initial reveal).
 *   More complex animations are not (eg flying from one position to another on resize).
 *
 * Layout constraints:
 *   This component supports multi-column layout.
 *   The height of each item may vary.
 *   The width of each item must not exceed the width of the column it is "in".
 *   The left position of all items within a column must align.
 *   (Items may not span multiple columns.)
 */
export const Masonry = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<MasonryImperativeAPI, MasonryProps>(
    function Masonry(props, ref) {
      const {
        "aria-label": ariaLabel,
        cellCount,
        cellMeasurerCache,
        cellPositioner,
        cellRenderer,
        className,
        height: heightProp,
        id,
        keyMapper = defaultMasonryProps.keyMapper,
        onCellsRendered = defaultMasonryProps.onCellsRendered,
        onScroll = defaultMasonryProps.onScroll,
        overscanByPixels = defaultMasonryProps.overscanByPixels,
        role = defaultMasonryProps.role,
        rowDirection = defaultMasonryProps.rowDirection,
        scrollElement,
        scrollingResetTimeInterval = defaultMasonryProps.scrollingResetTimeInterval,
        style = defaultMasonryProps.style,
        tabIndex = defaultMasonryProps.tabIndex,
        width
      } = props;

      const [state, setState] = useState<State>(() => ({
        isScrolling: false,
        linkedViewport: null,
        scrollTop: 0
      }));
      const [, forceUpdate] = useReducer(increment, 0);

      // A Masonry with a scrollElement is scrolled by that element (e.g. the window) rather than scrolling itself:
      // it renders at its full height, and renders the cells within the scroll element's viewport.
      // Until the scroll element has been measured (e.g. during server rendering), the height prop is used as the viewport height.
      const linked = scrollElement !== undefined;
      const { linkedViewport } = state;
      const height =
        linkedViewport !== null ? linkedViewport.height : (heightProp ?? 0);

      // The instance (and its stable imperative handle) is created once
      const [
        {
          handle,
          internals,
          linkTarget,
          onScroll: onScrollEvent,
          setElementRef
        }
      ] = useState(() =>
        createMasonryInstance(
          {
            cellCount,
            cellMeasurerCache,
            cellPositioner,
            height,
            scrollingResetTimeInterval,
            width
          },
          setState,
          forceUpdate
        )
      );

      useImperativeHandle(ref, () => handle, [handle]);

      useMissingHeightWarning("Masonry", heightProp, scrollElement);

      useScrollElementLink(
        scrollElement,
        linkTarget,
        scrollingResetTimeInterval
      );

      const latest: LatestValues = {
        cellCount,
        cellMeasurerCache,
        cellPositioner,
        height,
        scrollingResetTimeInterval,
        width
      };
      useInsertionEffect(() => {
        internals.latest = latest;
      });

      const { isScrolling } = state;
      const scrollTop = linked
        ? (linkedViewport?.scrollTop ?? 0)
        : state.scrollTop;

      const positionCache = internals.positionCache;

      const children: ReactNode[] = [];

      const estimatedTotalHeight = getEstimatedTotalHeight(
        positionCache,
        cellCount,
        cellMeasurerCache,
        width
      );

      const shortestColumnSize = positionCache.shortestColumnSize;
      const measuredCellCount = positionCache.count;

      let startIndex = 0;
      let stopIndex: number | undefined;

      positionCache.range(
        Math.max(0, scrollTop - overscanByPixels),
        height + overscanByPixels * 2,
        (index: number, left: number, top: number) => {
          // The position cache may contain cells that have since been removed (cellCount shrank)
          if (index >= cellCount) {
            return;
          }

          if (typeof stopIndex === "undefined") {
            startIndex = index;
            stopIndex = index;
          } else {
            startIndex = Math.min(startIndex, index);
            stopIndex = Math.max(stopIndex, index);
          }

          children.push(
            cellRenderer({
              index,
              isScrolling,
              key: keyMapper(index),
              parent: handle,
              style: {
                height: cellMeasurerCache.getHeight(index),
                [rowDirection === "ltr" ? "left" : "right"]: left,
                position: "absolute",
                top,
                width: cellMeasurerCache.getWidth(index)
              }
            })
          );
        }
      );

      // We need to measure additional cells for this layout
      if (
        shortestColumnSize < scrollTop + height + overscanByPixels &&
        measuredCellCount < cellCount
      ) {
        const batchSize = Math.min(
          cellCount - measuredCellCount,
          Math.ceil(
            (((scrollTop + height + overscanByPixels - shortestColumnSize) /
              cellMeasurerCache.defaultHeight) *
              width) /
              cellMeasurerCache.defaultWidth
          )
        );

        for (
          let index = measuredCellCount;
          index < measuredCellCount + batchSize;
          index++
        ) {
          stopIndex = index;

          children.push(
            cellRenderer({
              index: index,
              isScrolling,
              key: keyMapper(index),
              parent: handle,
              style: {
                width: cellMeasurerCache.getWidth(index)
              }
            })
          );
        }
      }

      // Equivalent of the 9.x componentDidMount/componentDidUpdate
      useIsomorphicLayoutEffect(() => {
        // Query external layout logic for position of newly-measured cells
        if (typeof internals.invalidateOnUpdateStartIndex === "number") {
          const invalidateStartIndex = internals.invalidateOnUpdateStartIndex;
          const invalidateStopIndex = internals.invalidateOnUpdateStopIndex!;

          internals.invalidateOnUpdateStartIndex = null;
          internals.invalidateOnUpdateStopIndex = null;

          populatePositionCache(
            internals.positionCache,
            cellMeasurerCache,
            cellPositioner,
            invalidateStartIndex,
            invalidateStopIndex
          );

          forceUpdate();
        }

        if (internals.onScrollMemoized !== scrollTop) {
          internals.onScrollMemoized = scrollTop;

          if (onScroll) {
            onScroll({
              clientHeight: height,
              scrollHeight: getEstimatedTotalHeight(
                internals.positionCache,
                cellCount,
                cellMeasurerCache,
                width
              ),
              scrollTop
            });
          }
        }

        if (
          internals.startIndexMemoized !== startIndex ||
          internals.stopIndexMemoized !== stopIndex
        ) {
          internals.startIndexMemoized = startIndex;
          internals.stopIndexMemoized = stopIndex;

          if (onCellsRendered) {
            onCellsRendered({ startIndex, stopIndex });
          }
        }
      });

      useEffect(
        () => () => {
          if (internals.debounceResetIsScrollingId) {
            cancelAnimationTimeout(internals.debounceResetIsScrollingId);
            internals.debounceResetIsScrollingId = null;
          }
        },
        [internals]
      );

      return (
        <div
          aria-label={ariaLabel}
          className={clsx("ReactVirtualized__Masonry", className)}
          id={id ?? undefined}
          onScroll={onScrollEvent}
          ref={setElementRef}
          role={role}
          style={{
            boxSizing: "border-box",
            direction: "ltr",
            // A linked Masonry renders at its full height (it doesn't scroll itself)
            height: linked ? "auto" : height,
            overflowX: "hidden",
            overflowY: estimatedTotalHeight < height ? "hidden" : "auto",
            position: "relative",
            width,
            WebkitOverflowScrolling: "touch",
            willChange: "transform",
            ...style
          }}
          tabIndex={tabIndex}
        >
          <div
            className="ReactVirtualized__Masonry__innerScrollContainer"
            style={{
              width: "100%",
              height: estimatedTotalHeight,
              maxWidth: "100%",
              maxHeight: estimatedTotalHeight,
              overflow: "hidden",
              pointerEvents: isScrolling ? "none" : ("" as "auto"),
              position: "relative"
            }}
          >
            {children}
          </div>
        </div>
      );
    }
  )
);

function getEstimatedTotalHeight(
  positionCache: PositionCache,
  cellCount: number,
  cellMeasurerCache: MasonryCellMeasurerCache,
  width: number
) {
  const estimatedColumnCount = Math.max(
    1,
    Math.floor(width / cellMeasurerCache.defaultWidth)
  );

  return positionCache.estimateTotalHeight(
    cellCount,
    estimatedColumnCount,
    cellMeasurerCache.defaultHeight
  );
}

function populatePositionCache(
  positionCache: PositionCache,
  cellMeasurerCache: MasonryCellMeasurerCache,
  cellPositioner: Positioner,
  startIndex: number,
  stopIndex: number
) {
  for (let index = startIndex; index <= stopIndex; index++) {
    const { left, top } = cellPositioner(index);

    positionCache.setPosition(
      index,
      left,
      top,
      cellMeasurerCache.getHeight(index)
    );
  }
}

// Creates the (stable) imperative handle of a Masonry, its scroll event handler and its mutable internals.
function createMasonryInstance(
  initialValues: LatestValues,
  setState: Dispatch<SetStateAction<State>>,
  forceUpdate: () => void
): MasonryInstance {
  const internals: MasonryInternals = {
    debounceResetIsScrollingId: null,
    element: null,
    invalidateOnUpdateStartIndex: null,
    invalidateOnUpdateStopIndex: null,
    latest: initialValues,
    linkedViewport: null,
    onScrollMemoized: undefined,
    positionCache: new PositionCache(),
    startIndexMemoized: null,
    stopIndexMemoized: null
  };

  const debounceResetIsScrollingCallback = () => {
    internals.debounceResetIsScrollingId = null;

    setState((prevState) =>
      prevState.isScrolling ? { ...prevState, isScrolling: false } : prevState
    );
  };

  const debounceResetIsScrolling = () => {
    if (internals.debounceResetIsScrollingId) {
      cancelAnimationTimeout(internals.debounceResetIsScrollingId);
    }

    internals.debounceResetIsScrollingId = requestAnimationTimeout(
      debounceResetIsScrollingCallback,
      internals.latest.scrollingResetTimeInterval
    );
  };

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { cellCount, cellMeasurerCache, height, width } = internals.latest;

    const eventScrollTop = event.currentTarget.scrollTop;

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
    const scrollTop = Math.min(
      Math.max(
        0,
        getEstimatedTotalHeight(
          internals.positionCache,
          cellCount,
          cellMeasurerCache,
          width
        ) - height
      ),
      eventScrollTop
    );

    // On iOS, we can arrive at negative offsets by swiping past the start or end.
    // Avoid re-rendering in this case as it can cause problems; see #532 for more.
    if (eventScrollTop !== scrollTop) {
      return;
    }

    // Prevent pointer events from interrupting a smooth scroll
    debounceResetIsScrolling();

    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    setState((prevState) =>
      prevState.scrollTop !== scrollTop
        ? { ...prevState, isScrolling: true, scrollTop }
        : prevState
    );
  };

  // Linked to the Masonry's scroll element (if it has one) by useScrollElementLink.
  // (A Masonry has no scroll methods, so the link source isn't used.)
  const linkTarget: ScrollElementLinkTarget = {
    getElement() {
      return internals.element;
    },

    link(source, viewport) {
      const linkedViewport =
        source !== null
          ? {
              height: viewport.height,
              scrollTop: Math.max(0, viewport.scrollTop)
            }
          : null;
      internals.linkedViewport = linkedViewport;
      setState((prevState) => ({ ...prevState, linkedViewport }));
    },

    setViewport(viewport) {
      const prevViewport = internals.linkedViewport;
      if (prevViewport === null) {
        return;
      }

      const linkedViewport = {
        height: viewport.height,
        scrollTop: Math.max(0, viewport.scrollTop)
      };
      if (
        linkedViewport.height === prevViewport.height &&
        linkedViewport.scrollTop === prevViewport.scrollTop
      ) {
        return;
      }
      internals.linkedViewport = linkedViewport;

      // A change of the scroll offset marks the Masonry as scrolling (like a scroll event of its own container would)
      const scrolled = linkedViewport.scrollTop !== prevViewport.scrollTop;
      if (scrolled) {
        debounceResetIsScrolling();
      }
      setState((prevState) => ({
        ...prevState,
        isScrolling: prevState.isScrolling || scrolled,
        linkedViewport
      }));
    }
  };

  const handle: MasonryImperativeAPI = {
    clearCellPositions() {
      internals.positionCache = new PositionCache();
      forceUpdate();
    },

    forceUpdate() {
      forceUpdate();
    },

    // HACK This method signature was intended for Grid
    invalidateCellSizeAfterRender({ rowIndex: index }) {
      if (internals.invalidateOnUpdateStartIndex === null) {
        internals.invalidateOnUpdateStartIndex = index;
        internals.invalidateOnUpdateStopIndex = index;
      } else {
        internals.invalidateOnUpdateStartIndex = Math.min(
          internals.invalidateOnUpdateStartIndex,
          index
        );
        internals.invalidateOnUpdateStopIndex = Math.max(
          internals.invalidateOnUpdateStopIndex!,
          index
        );
      }

      // The invalidated cells are positioned once the (next) render has been committed.
      // (Within a commit this re-render is batched with the one the layout effect schedules.)
      forceUpdate();
    },

    recomputeCellPositions() {
      const { cellCount, cellMeasurerCache, cellPositioner } = internals.latest;

      // Don't re-populate positions for cells that have been removed (cellCount shrank)
      const stopIndex = Math.min(internals.positionCache.count, cellCount) - 1;

      const positionCache = new PositionCache();
      populatePositionCache(
        positionCache,
        cellMeasurerCache,
        cellPositioner,
        0,
        stopIndex
      );
      internals.positionCache = positionCache;

      forceUpdate();
    },

    recomputeGridSize() {
      forceUpdate();
    }
  };

  const setElementRef = (element: HTMLDivElement | null) => {
    internals.element = element;
  };

  return { handle, internals, linkTarget, onScroll, setElementRef };
}
