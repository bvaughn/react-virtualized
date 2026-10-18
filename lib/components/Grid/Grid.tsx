import clsx from "clsx";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useInsertionEffect,
  useReducer,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type UIEvent
} from "react";
import { createCallbackMemoizer } from "../../utils/createCallbackMemoizer";
import { getUpdatedOffsetForIndex } from "../../utils/getUpdatedOffsetForIndex";
import {
  cancelAnimationTimeout,
  requestAnimationTimeout,
  type AnimationTimeoutId
} from "../../utils/requestAnimationTimeout";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type {
  ScrollElementLinkSource,
  ScrollElementLinkTarget,
  ScrollElementViewport
} from "../../utils/scrollElement/types";
import { useMissingHeightWarning } from "../../utils/scrollElement/useMissingHeightWarning";
import { useScrollElementLink } from "../../utils/scrollElement/useScrollElementLink";
import { defaultGridProps } from "./defaultGridProps";
import {
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FORWARD
} from "./defaultOverscanIndicesGetter";
import type {
  Alignment,
  CellCache,
  CellSize,
  CellSizeGetter,
  GridImperativeAPI,
  GridProps,
  RenderedSection,
  Scroll,
  ScrollbarPresenceChange,
  StyleCache
} from "./types";
import { ScalingCellSizeAndPositionManager } from "./utils/ScalingCellSizeAndPositionManager";
import { updateScrollIndexHelper } from "./utils/updateScrollIndexHelper";

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
const SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: "observed",
  REQUESTED: "requested"
} as const;

type ScrollDirection = -1 | 1;

type ScrollState = {
  isScrolling: boolean;
  scrollDirectionHorizontal: ScrollDirection;
  scrollDirectionVertical: ScrollDirection;
  scrollLeft: number;
  scrollTop: number;
  scrollPositionChangeReason: "observed" | "requested" | null;
};

const INITIAL_SCROLL_STATE: ScrollState = {
  isScrolling: false,
  scrollDirectionHorizontal: SCROLL_DIRECTION_FORWARD,
  scrollDirectionVertical: SCROLL_DIRECTION_FORWARD,
  scrollLeft: 0,
  scrollTop: 0,
  scrollPositionChangeReason: null
};

// Props read by the imperative methods.
// They are updated in an insertion effect, so they are current when the methods are called during the commit phase
// (e.g. by a CellMeasurer cell that mounts before the Grid's own layout effects run).
type LatestValues = {
  columnCount: number;
  height: number;
  onScroll: (params: Scroll) => void;
  rowCount: number;
  scrollbarSize: number;
  scrollbarSizeMeasured: boolean;
  scrollingResetTimeInterval: number;
  width: number;
};

// The props that the size managers (and the style/cell caches) were last updated for.
// This is a render-time cache: it is updated while rendering, alongside the managers it describes,
// so it is always consistent with them (even if a render is repeated or discarded).
type SizeInputs = {
  columnCount: number;
  columnSizeGetter: CellSizeGetter;
  columnWidth: CellSize;
  estimatedColumnSize: number;
  estimatedRowSize: number;
  rowCount: number;
  rowHeight: CellSize;
  rowSizeGetter: CellSizeGetter;
};

// Range of cells (including overscan) rendered by the most recent render; used to retain their cached styles
type RenderedRange = {
  columnStartIndex: number;
  columnStopIndex: number;
  rowStartIndex: number;
  rowStopIndex: number;
};

// Values of the most recently committed render, compared by the layout effect to detect changes
// (the equivalent of the "prevProps"/"prevState" of the 9.x componentDidUpdate).
type CommittedValues = {
  columnCount: number;
  columnWidth: CellSize;
  height: number;
  rowCount: number;
  rowHeight: CellSize;
  scrollLeft: number;
  scrollTop: number;
  width: number;
};

// The viewport of the scroll element the Grid is linked to (its scrollElement prop; see useScrollElementLink),
// and the direction its offset last moved in (for overscanning).
// While linked, the Grid renders at its full height and is scrolled vertically by the scroll element.
type LinkState = {
  direction: ScrollDirection;
  viewport: ScrollElementViewport;
};

type GridLink = LinkState & {
  source: ScrollElementLinkSource;
};

// Mutable, per-instance values (the equivalent of the instance fields of the 9.x class component).
// Except for the render-time caches (see below), they are only modified by the imperative methods, event handlers and effects.
type GridInternals = {
  // Render-time caches (see SizeInputs); styles and (while scrolling) cells are cached by `${rowIndex}-${columnIndex}`
  cellCache: CellCache;
  cellCacheForceUpdateCount: number;
  cellCacheProps: GridProps | null;
  columnSizeAndPositionManager: ScalingCellSizeAndPositionManager;
  renderedRange: RenderedRange | null;
  rowSizeAndPositionManager: ScalingCellSizeAndPositionManager;
  sizeInputs: SizeInputs;
  styleCache: StyleCache;

  committed: CommittedValues | null;
  deferredInvalidateColumnIndex: number | null;
  deferredInvalidateRowIndex: number | null;
  disablePointerEventsTimeoutId: AnimationTimeoutId | null;
  element: HTMLDivElement | null;
  latest: LatestValues;

  // The scroll element the Grid is linked to (if any); updated by the link target methods (during commit or event handlers)
  link: GridLink | null;

  onGridRenderedMemoizer: ReturnType<typeof createCallbackMemoizer>;
  onScrollMemoizer: ReturnType<typeof createCallbackMemoizer>;
  scrollbarPresence: { horizontal: number; vertical: number };

  // The most recently requested scroll state (including updates that have not been rendered yet)
  scrollState: ScrollState;
  // Dispatches scroll state updates (the setter of the scrollState state); set once the Grid has been committed
  scrollStateDispatch: Dispatch<ScrollState> | null;

  // The scroll offsets rendered (as a shift of the inner container) during server rendering and hydration
  // still have to be applied to the scrolling element (see the layout effect)
  scrollOffsetsPendingHydration: boolean;
};

type GridInstance = {
  handle: GridImperativeAPI;
  internals: GridInternals;
  invokeOnScrollMemoizer: (
    scrollLeft: number,
    scrollTop: number,
    totalColumnsWidth: number,
    totalRowsHeight: number
  ) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  setScrollState: (update: Partial<ScrollState>) => void;
  updateScrollLeftForColumn: (
    alignment: Alignment,
    columnIndex: number
  ) => void;
  updateScrollTopForRow: (alignment: Alignment, rowIndex: number) => void;
  linkTarget: ScrollElementLinkTarget;
};

const increment = (value: number) => value + 1;

const subscribeToNothing = () => () => {};

// The scrollbar size can't be measured during server rendering (or hydration)
const getServerScrollbarSize = () => undefined;

// Whether the Grid is rendered on the client (true) or is being server-rendered or hydrated (false)
const getClientRendered = () => true;
const getServerRendered = () => false;

function wrapSizeGetter(value: CellSize): CellSizeGetter {
  return typeof value === "function" ? value : () => value;
}

function isNumericSizeChange(prevSize: CellSize, nextSize: CellSize) {
  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
  // In that event users should use the manual recompute methods to inform of changes.
  return (
    (typeof prevSize === "number" || typeof nextSize === "number") &&
    prevSize !== nextSize
  );
}

function createGridInstance(
  initialProps: Pick<
    GridProps,
    | "columnCount"
    | "columnWidth"
    | "estimatedColumnSize"
    | "estimatedRowSize"
    | "initialScrollLeft"
    | "initialScrollTop"
    | "onScroll"
    | "rowCount"
    | "rowHeight"
    | "scrollingResetTimeInterval"
    | "width"
  > &
    Required<
      Pick<
        GridProps,
        | "estimatedColumnSize"
        | "estimatedRowSize"
        | "onScroll"
        | "scrollingResetTimeInterval"
      >
    > & {
      // The height of the Grid (or, for a Grid with a scrollElement, of the scroll element's viewport)
      height: number;
    },
  setLinkState: Dispatch<LinkState | null>,
  forceUpdate: () => void
): GridInstance {
  const {
    columnCount,
    columnWidth,
    estimatedColumnSize,
    estimatedRowSize,
    rowCount,
    rowHeight
  } = initialProps;

  const columnSizeGetter = wrapSizeGetter(columnWidth);
  const rowSizeGetter = wrapSizeGetter(rowHeight);

  const internals: GridInternals = {
    cellCache: {},
    cellCacheForceUpdateCount: 0,
    cellCacheProps: null,
    columnSizeAndPositionManager: new ScalingCellSizeAndPositionManager({
      cellCount: columnCount,
      cellSizeGetter: columnSizeGetter,
      estimatedCellSize:
        typeof columnWidth === "number" ? columnWidth : estimatedColumnSize
    }),
    renderedRange: null,
    rowSizeAndPositionManager: new ScalingCellSizeAndPositionManager({
      cellCount: rowCount,
      cellSizeGetter: rowSizeGetter,
      estimatedCellSize:
        typeof rowHeight === "number" ? rowHeight : estimatedRowSize
    }),
    sizeInputs: {
      columnCount,
      columnSizeGetter,
      columnWidth,
      estimatedColumnSize,
      estimatedRowSize,
      rowCount,
      rowHeight,
      rowSizeGetter
    },
    styleCache: {},

    committed: null,
    deferredInvalidateColumnIndex: null,
    deferredInvalidateRowIndex: null,
    disablePointerEventsTimeoutId: null,
    element: null,
    latest: {
      columnCount,
      height: initialProps.height,
      onScroll: initialProps.onScroll,
      rowCount,
      scrollbarSize: 0,
      scrollbarSizeMeasured: false,
      scrollingResetTimeInterval: initialProps.scrollingResetTimeInterval,
      width: initialProps.width
    },
    link: null,
    // Invokes onSectionRendered callback only when start/stop row or column indices change
    onGridRenderedMemoizer: createCallbackMemoizer(),
    onScrollMemoizer: createCallbackMemoizer(false),
    scrollbarPresence: { horizontal: 0, vertical: 0 },
    scrollState: INITIAL_SCROLL_STATE,
    scrollStateDispatch: null,
    scrollOffsetsPendingHydration: false
  };

  // The initial scroll offsets (e.g. for server rendering) are clamped to the scrollable range,
  // using the estimated sizes of the cells that haven't been measured yet.
  // (They are applied to the scrolling element when the Grid mounts; see the layout effect.)
  const { initialScrollLeft = 0, initialScrollTop = 0 } = initialProps;
  internals.scrollState = {
    ...INITIAL_SCROLL_STATE,
    scrollLeft: Math.max(
      0,
      Math.min(
        initialScrollLeft,
        internals.columnSizeAndPositionManager.getTotalSize() -
          initialProps.width
      )
    ),
    scrollTop: Math.max(
      0,
      Math.min(
        initialScrollTop,
        internals.rowSizeAndPositionManager.getTotalSize() - initialProps.height
      )
    )
  };

  const setScrollState = (update: Partial<ScrollState>) => {
    const prevState = internals.scrollState;
    let changed = false;
    for (const key in update) {
      if (
        update[key as keyof ScrollState] !== prevState[key as keyof ScrollState]
      ) {
        changed = true;
        break;
      }
    }
    if (changed) {
      const nextState = { ...prevState, ...update };
      internals.scrollState = nextState;
      internals.scrollStateDispatch?.(nextState);
    }
  };

  const getCalculatedScrollLeft = (
    alignment: Alignment,
    scrollToColumn: number,
    currentScrollLeft: number
  ): number => {
    const { columnCount, height, scrollbarSize, scrollbarSizeMeasured, width } =
      internals.latest;

    if (columnCount > 0) {
      const finalColumn = columnCount - 1;
      const targetIndex =
        scrollToColumn < 0
          ? finalColumn
          : Math.min(finalColumn, scrollToColumn);
      const totalRowsHeight =
        internals.rowSizeAndPositionManager.getTotalSize();
      const scrollBarSize =
        scrollbarSizeMeasured && totalRowsHeight > height ? scrollbarSize : 0;

      return internals.columnSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: alignment,
        containerSize: width - scrollBarSize,
        currentOffset: currentScrollLeft,
        targetIndex
      });
    }
    return 0;
  };

  const getCalculatedScrollTop = (
    alignment: Alignment,
    scrollToRow: number,
    currentScrollTop: number
  ): number => {
    const { height, rowCount, scrollbarSize, scrollbarSizeMeasured, width } =
      internals.latest;

    if (rowCount > 0) {
      const finalRow = rowCount - 1;
      const targetIndex =
        scrollToRow < 0 ? finalRow : Math.min(finalRow, scrollToRow);
      const totalColumnsWidth =
        internals.columnSizeAndPositionManager.getTotalSize();
      const scrollBarSize =
        scrollbarSizeMeasured && totalColumnsWidth > width ? scrollbarSize : 0;
      const containerSize = height - scrollBarSize;
      const rowSizeAndPositionManager = internals.rowSizeAndPositionManager;

      // The viewport of a linked Grid (e.g. the window) may extend beyond the Grid itself (e.g. above or below it),
      // so its offset may be outside of the Grid's scrollable range (e.g. negative).
      // The offset isn't limited to the end of the Grid (e.g. so that the last rows can be scrolled to the top of the
      // viewport when there is content below the Grid); the scroll element limits it to its own scrollable range (#1895).
      // With "auto" alignment, a row that is already visible within the viewport is not scrolled to.
      if (
        internals.link !== null &&
        containerSize > 0 &&
        !rowSizeAndPositionManager.areOffsetsAdjusted()
      ) {
        const { offset, size } =
          rowSizeAndPositionManager.getSizeAndPositionOfCell(targetIndex);
        if (
          alignment === "auto" &&
          offset >= currentScrollTop &&
          offset + size <= currentScrollTop + containerSize
        ) {
          return currentScrollTop;
        }

        return getUpdatedOffsetForIndex({
          align: alignment,
          cellOffset: offset,
          cellSize: size,
          containerSize,
          currentOffset: currentScrollTop
        });
      }

      return rowSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: alignment,
        containerSize,
        currentOffset: currentScrollTop,
        targetIndex
      });
    }
    return 0;
  };

  // The current vertical scroll offset: the Grid's own, or (if linked) the offset of the scroll element's viewport
  // (which may be negative; see ScrollElementViewport)
  const getCurrentScrollTop = () =>
    internals.link !== null
      ? internals.link.viewport.scrollTop
      : internals.scrollState.scrollTop;

  // Scrolls a linked Grid (i.e. its scroll element)
  const scrollLinkTo = (link: GridLink, scrollTop: number) => {
    link.source.scrollTo(scrollTop);
  };

  // Scrolls to the specified column (or to the last column, if the index is negative)
  const updateScrollLeftForColumn = (
    alignment: Alignment,
    columnIndex: number
  ) => {
    const { scrollLeft } = internals.scrollState;
    const calculatedScrollLeft = getCalculatedScrollLeft(
      alignment,
      columnIndex,
      scrollLeft
    );

    if (calculatedScrollLeft >= 0 && calculatedScrollLeft !== scrollLeft) {
      setScrollState({
        scrollDirectionHorizontal:
          calculatedScrollLeft > scrollLeft
            ? SCROLL_DIRECTION_FORWARD
            : SCROLL_DIRECTION_BACKWARD,
        scrollLeft: calculatedScrollLeft,
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
      });
    }
  };

  // Scrolls to the specified row (or to the last row, if the index is negative)
  const updateScrollTopForRow = (alignment: Alignment, rowIndex: number) => {
    const scrollTop = getCurrentScrollTop();
    const calculatedScrollTop = getCalculatedScrollTop(
      alignment,
      rowIndex,
      scrollTop
    );

    const link = internals.link;
    if (link !== null) {
      if (calculatedScrollTop !== scrollTop) {
        scrollLinkTo(link, calculatedScrollTop);
      }
      return;
    }

    if (calculatedScrollTop >= 0 && calculatedScrollTop !== scrollTop) {
      setScrollState({
        scrollDirectionVertical:
          calculatedScrollTop > scrollTop
            ? SCROLL_DIRECTION_FORWARD
            : SCROLL_DIRECTION_BACKWARD,
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
        scrollTop: calculatedScrollTop
      });
    }
  };

  const invokeOnScrollMemoizer = (
    scrollLeft: number,
    scrollTop: number,
    totalColumnsWidth: number,
    totalRowsHeight: number
  ) => {
    internals.onScrollMemoizer({
      callback: ({ scrollLeft, scrollTop }) => {
        const { height, onScroll, width } = internals.latest;

        onScroll({
          clientHeight: height,
          clientWidth: width,
          scrollHeight: totalRowsHeight,
          scrollLeft,
          scrollTop,
          scrollWidth: totalColumnsWidth
        });
      },
      indices: {
        scrollLeft,
        scrollTop
      }
    });
  };

  const debounceScrollEndedCallback = () => {
    internals.disablePointerEventsTimeoutId = null;
    // isScrolling is used to determine if we reset styleCache
    setScrollState({ isScrolling: false });
  };

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Grid.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  const debounceScrollEnded = () => {
    if (internals.disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(internals.disablePointerEventsTimeoutId);
    }

    internals.disablePointerEventsTimeoutId = requestAnimationTimeout(
      debounceScrollEndedCallback,
      internals.latest.scrollingResetTimeInterval
    );
  };

  const handle: GridImperativeAPI = {
    forceUpdate() {
      forceUpdate();
    },

    getOffsetForCell({
      alignment = "auto",
      columnIndex = -1,
      rowIndex = -1
    } = {}) {
      const { scrollLeft } = internals.scrollState;

      return {
        scrollLeft: getCalculatedScrollLeft(alignment, columnIndex, scrollLeft),
        scrollTop: getCalculatedScrollTop(
          alignment,
          rowIndex,
          getCurrentScrollTop()
        )
      };
    },

    getTotalRowsHeight() {
      return internals.rowSizeAndPositionManager.getTotalSize();
    },

    getTotalColumnsWidth() {
      return internals.columnSizeAndPositionManager.getTotalSize();
    },

    handleScrollEvent({
      scrollLeft: scrollLeftParam = 0,
      scrollTop: scrollTopParam = 0
    }) {
      // On iOS, we can arrive at negative offsets by swiping past the start.
      // To prevent flicker here, we make playing in the negative offset zone cause nothing to happen.
      if (scrollTopParam < 0) {
        return;
      }

      // Prevent pointer events from interrupting a smooth scroll
      debounceScrollEnded();

      const { height, scrollbarSize, width } = internals.latest;
      const link = internals.link;

      // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
      // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
      // This causes a series of rapid renders that is slow for long lists.
      // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
      const totalRowsHeight =
        internals.rowSizeAndPositionManager.getTotalSize();
      const totalColumnsWidth =
        internals.columnSizeAndPositionManager.getTotalSize();
      const scrollLeft = Math.min(
        Math.max(0, totalColumnsWidth - width + scrollbarSize),
        scrollLeftParam
      );
      const scrollTop = Math.min(
        Math.max(0, totalRowsHeight - height + scrollbarSize),
        scrollTopParam
      );

      // Certain devices (like Apple touchpad) rapid-fire duplicate events.
      // Don't force a re-render if this is the case.
      // The mouse may move faster then the animation frame does.
      // Use requestAnimationFrame to avoid over-updating.
      const prevState = internals.scrollState;
      if (
        prevState.scrollLeft !== scrollLeft ||
        prevState.scrollTop !== scrollTop
      ) {
        // Track scrolling direction so we can more efficiently overscan rows to reduce empty space around the edges while scrolling.
        // Don't change direction for an axis unless scroll offset has changed.
        const scrollDirectionHorizontal =
          scrollLeft !== prevState.scrollLeft
            ? scrollLeft > prevState.scrollLeft
              ? SCROLL_DIRECTION_FORWARD
              : SCROLL_DIRECTION_BACKWARD
            : prevState.scrollDirectionHorizontal;
        const scrollDirectionVertical =
          scrollTop !== prevState.scrollTop
            ? scrollTop > prevState.scrollTop
              ? SCROLL_DIRECTION_FORWARD
              : SCROLL_DIRECTION_BACKWARD
            : prevState.scrollDirectionVertical;

        const update: Partial<ScrollState> = {
          isScrolling: true,
          scrollDirectionHorizontal,
          scrollDirectionVertical,
          scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.OBSERVED
        };

        // A linked Grid is scrolled vertically by its scroll element (see setViewport), so the vertical offset is ignored.
        if (link === null) {
          update.scrollTop = scrollTop;
        }
        update.scrollLeft = scrollLeft;

        setScrollState(update);
      }

      invokeOnScrollMemoizer(
        scrollLeft,
        link !== null ? Math.max(0, link.viewport.scrollTop) : scrollTop,
        totalColumnsWidth,
        totalRowsHeight
      );
    },

    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
      internals.deferredInvalidateColumnIndex =
        typeof internals.deferredInvalidateColumnIndex === "number"
          ? Math.min(internals.deferredInvalidateColumnIndex, columnIndex)
          : columnIndex;
      internals.deferredInvalidateRowIndex =
        typeof internals.deferredInvalidateRowIndex === "number"
          ? Math.min(internals.deferredInvalidateRowIndex, rowIndex)
          : rowIndex;
    },

    measureAllCells() {
      const { columnCount, rowCount } = internals.latest;
      if (columnCount > 0) {
        internals.columnSizeAndPositionManager.getSizeAndPositionOfCell(
          columnCount - 1
        );
      }
      if (rowCount > 0) {
        internals.rowSizeAndPositionManager.getSizeAndPositionOfCell(
          rowCount - 1
        );
      }
    },

    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
      internals.columnSizeAndPositionManager.resetCell(columnIndex);
      internals.rowSizeAndPositionManager.resetCell(rowIndex);

      // Clear cell cache in case we are scrolling;
      // Invalid row heights likely mean invalid cached content as well.
      internals.styleCache = {};
      internals.cellCache = {};

      forceUpdate();
    },

    scrollToCell({ align = "auto", columnIndex, rowIndex }) {
      const { columnCount, height, width } = internals.latest;

      // This is a one-time scroll: the cell isn't kept in view afterwards (e.g. if cell sizes change).
      // Nothing is scrolled if the size is 0, since no cells are rendered in that case.
      if (height <= 0 || width <= 0) {
        return;
      }

      // Don't adjust scroll offset for single-column grids (eg List, Table).
      // This can cause a funky scroll offset because of the vertical scrollbar width.
      if (columnCount > 1 && columnIndex !== undefined && columnIndex >= 0) {
        updateScrollLeftForColumn(align, columnIndex);
      }

      if (rowIndex !== undefined && rowIndex >= 0) {
        updateScrollTopForRow(align, rowIndex);
      }
    },

    scrollToPosition({ scrollLeft, scrollTop }) {
      const { height, scrollbarSize, width } = internals.latest;
      const prevState = internals.scrollState;
      const update: Partial<ScrollState> = {};

      // Offsets are clamped the same way handleScrollEvent() clamps observed offsets,
      // so that an offset reported by this Grid (e.g. via onScroll) is never changed by passing it back.
      // (If the browser can't scroll quite as far, the offset is corrected after it has been applied; see the layout effect.)
      const totalRowsHeight =
        internals.rowSizeAndPositionManager.getTotalSize();
      const totalColumnsWidth =
        internals.columnSizeAndPositionManager.getTotalSize();

      if (typeof scrollLeft === "number" && !isNaN(scrollLeft)) {
        const clampedScrollLeft = Math.max(
          0,
          Math.min(scrollLeft, totalColumnsWidth - width + scrollbarSize)
        );
        if (clampedScrollLeft !== prevState.scrollLeft) {
          update.scrollDirectionHorizontal =
            clampedScrollLeft > prevState.scrollLeft
              ? SCROLL_DIRECTION_FORWARD
              : SCROLL_DIRECTION_BACKWARD;
          update.scrollLeft = clampedScrollLeft;
        }
      }

      const link = internals.link;
      if (typeof scrollTop === "number" && !isNaN(scrollTop) && link !== null) {
        // A linked Grid scrolls its scroll element instead.
        // The current offset is clamped as well (it is reported that way by onScroll),
        // so that passing back a reported offset doesn't scroll (e.g. while the Grid is below the top of the viewport).
        const maxScrollTop = Math.max(0, totalRowsHeight - height);
        const clampedScrollTop = Math.max(0, Math.min(scrollTop, maxScrollTop));
        const currentScrollTop = Math.max(
          0,
          Math.min(link.viewport.scrollTop, maxScrollTop)
        );
        if (clampedScrollTop !== currentScrollTop) {
          scrollLinkTo(link, clampedScrollTop);
        }
      } else if (typeof scrollTop === "number" && !isNaN(scrollTop)) {
        const clampedScrollTop = Math.max(
          0,
          Math.min(scrollTop, totalRowsHeight - height + scrollbarSize)
        );
        if (clampedScrollTop !== prevState.scrollTop) {
          update.scrollDirectionVertical =
            clampedScrollTop > prevState.scrollTop
              ? SCROLL_DIRECTION_FORWARD
              : SCROLL_DIRECTION_BACKWARD;
          update.scrollTop = clampedScrollTop;
        }
      }

      // No-op (no state update or render) if the offsets haven't changed
      if (update.scrollLeft !== undefined || update.scrollTop !== undefined) {
        update.scrollPositionChangeReason =
          SCROLL_POSITION_CHANGE_REASONS.REQUESTED;
        setScrollState(update);
      }
    }
  };

  // Linked to the Grid's scroll element (if it has one) by useScrollElementLink
  const linkTarget: ScrollElementLinkTarget = {
    getElement() {
      return internals.element;
    },

    link(source, viewport) {
      if (source === null) {
        if (internals.link !== null) {
          internals.link = null;
          setLinkState(null);
        }
        return;
      }

      const direction = internals.link?.direction ?? SCROLL_DIRECTION_FORWARD;
      internals.link = { direction, source, viewport };
      setLinkState({ direction, viewport });
    },

    setViewport(viewport) {
      const link = internals.link;
      if (link === null) {
        return;
      }

      const prevViewport = link.viewport;
      if (
        prevViewport.height === viewport.height &&
        prevViewport.isScrolling === viewport.isScrolling &&
        prevViewport.scrollTop === viewport.scrollTop
      ) {
        return;
      }

      if (viewport.scrollTop !== prevViewport.scrollTop) {
        // Track the scrolling direction (for overscanning)
        link.direction =
          viewport.scrollTop > prevViewport.scrollTop
            ? SCROLL_DIRECTION_FORWARD
            : SCROLL_DIRECTION_BACKWARD;
      }

      link.viewport = viewport;
      setLinkState({ direction: link.direction, viewport });
    }
  };

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target === internals.element) {
      handle.handleScrollEvent(event.target as HTMLDivElement);
    }
  };

  return {
    handle,
    internals,
    linkTarget,
    invokeOnScrollMemoizer,
    onScroll,
    setScrollState,
    updateScrollLeftForColumn,
    updateScrollTopForRow
  };
}

/**
 * Updates the size managers (and invalidates the style and cell caches) after a size-related prop has changed.
 * This is the render-time part of the 9.x getDerivedStateFromProps.
 */
function updateSizeInputs(internals: GridInternals, next: SizeInputs) {
  const prev = internals.sizeInputs;

  // Cached styles (and the cells rendered with them) are stale once cell sizes or counts change.
  // Counts matter too: a size getter may return different values for an index after rows are added or removed (bug #16).
  if (
    next.columnWidth !== prev.columnWidth ||
    next.rowHeight !== prev.rowHeight ||
    next.columnCount !== prev.columnCount ||
    next.rowCount !== prev.rowCount
  ) {
    internals.styleCache = {};
    internals.cellCache = {};
  }

  internals.columnSizeAndPositionManager.configure({
    cellCount: next.columnCount,
    estimatedCellSize:
      typeof next.columnWidth === "number"
        ? next.columnWidth
        : next.estimatedColumnSize,
    cellSizeGetter: next.columnSizeGetter
  });
  internals.rowSizeAndPositionManager.configure({
    cellCount: next.rowCount,
    estimatedCellSize:
      typeof next.rowHeight === "number"
        ? next.rowHeight
        : next.estimatedRowSize,
    cellSizeGetter: next.rowSizeGetter
  });

  // Cells are (re)measured along an axis whose count (or numeric cell size) has changed;
  // if either count was 0, along both axes.
  // (Cells along one axis may have been measured while the other count was 0, e.g. the columns of a MultiGrid quadrant without rows;
  // so they are also reset if the count stays 0. See #1351.)
  const eitherCountWasZero = prev.columnCount === 0 || prev.rowCount === 0;
  if (
    eitherCountWasZero ||
    prev.columnCount !== next.columnCount ||
    isNumericSizeChange(prev.columnWidth, next.columnWidth)
  ) {
    internals.columnSizeAndPositionManager.resetCell(0);
  }
  if (
    eitherCountWasZero ||
    prev.rowCount !== next.rowCount ||
    isNumericSizeChange(prev.rowHeight, next.rowHeight)
  ) {
    internals.rowSizeAndPositionManager.resetCell(0);
  }

  internals.sizeInputs = next;
}

// Shallowly compares props
function areCellPropsEqual(prevProps: GridProps, nextProps: GridProps) {
  if (prevProps === nextProps) {
    return true;
  }

  const prev = prevProps as { [key: string]: unknown };
  const next = nextProps as { [key: string]: unknown };
  for (const key in prev) {
    if (prev[key] !== next[key]) {
      return false;
    }
  }
  for (const key in next) {
    if (!(key in prev)) {
      return false;
    }
  }
  return true;
}

/**
 * Drops the cached styles (and cells) of cells that were not rendered by the previous render.
 * This keeps the caches from growing too large, while avoiding unnecessary re-renders of the visible cells.
 */
function resetStyleCache(internals: GridInternals, keepCells: boolean) {
  const { cellCache, renderedRange, styleCache } = internals;

  // Reset cell and style caches once scrolling stops.
  // This makes Grid simpler to use (since cells commonly change).
  // And it keeps the caches from growing too large.
  // Performance is most sensitive when a user is scrolling.
  // Don't clear visible cells from cellCache if isScrollingOptOut is specified (and the cells are still current).
  // This keeps the cellCache to a resonable size.
  const nextCellCache: CellCache = {};
  const nextStyleCache: StyleCache = {};

  // Copy over the visible cell styles so avoid unnecessary re-render.
  if (renderedRange !== null) {
    for (
      let rowIndex = renderedRange.rowStartIndex;
      rowIndex <= renderedRange.rowStopIndex;
      rowIndex++
    ) {
      for (
        let columnIndex = renderedRange.columnStartIndex;
        columnIndex <= renderedRange.columnStopIndex;
        columnIndex++
      ) {
        const key = `${rowIndex}-${columnIndex}`;
        const style = styleCache[key];
        if (style !== undefined) {
          nextStyleCache[key] = style;
        }

        if (keepCells) {
          const cell = cellCache[key];
          if (cell !== undefined) {
            nextCellCache[key] = cell;
          }
        }
      }
    }
  }

  internals.cellCache = nextCellCache;
  internals.styleCache = nextStyleCache;
}

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 *
 * Scrolling is done through the imperative handle (`ref`): see `scrollToCell` and `scrollToPosition`.
 */
export const Grid = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<GridImperativeAPI, GridProps>(
    function Grid(props, ref) {
      // (The props object itself is needed as well, to detect prop changes for isScrollingOptOut; see below.)
      const {
        "aria-label": ariaLabel = defaultGridProps["aria-label"],
        "aria-readonly": ariaReadonly = defaultGridProps["aria-readonly"],
        autoContainerWidth = defaultGridProps.autoContainerWidth,
        cellRangeRenderer = defaultGridProps.cellRangeRenderer,
        cellRenderer,
        className,
        columnCount,
        columnWidth,
        containerProps,
        containerRole = defaultGridProps.containerRole,
        containerStyle = defaultGridProps.containerStyle,
        deferredMeasurementCache,
        elementRef,
        estimatedColumnSize = defaultGridProps.estimatedColumnSize,
        estimatedRowSize = defaultGridProps.estimatedRowSize,
        getScrollbarSize = defaultGridProps.getScrollbarSize,
        height: heightProp,
        id,
        initialScrollLeft,
        initialScrollTop,
        isScrollingOptOut = defaultGridProps.isScrollingOptOut,
        noContentRenderer = defaultGridProps.noContentRenderer,
        onScroll = defaultGridProps.onScroll,
        onScrollbarPresenceChange = defaultGridProps.onScrollbarPresenceChange,
        onSectionRendered = defaultGridProps.onSectionRendered,
        overscanColumnCount = defaultGridProps.overscanColumnCount,
        overscanIndicesGetter = defaultGridProps.overscanIndicesGetter,
        overscanRowCount = defaultGridProps.overscanRowCount,
        role = defaultGridProps.role,
        rowCount,
        rowHeight,
        scrollElement,
        scrollingResetTimeInterval = defaultGridProps.scrollingResetTimeInterval,
        style = defaultGridProps.style,
        tabIndex = defaultGridProps.tabIndex,
        width
      } = props;

      const [linkState, setLinkState] = useState<LinkState | null>(null);
      const [forceUpdateCount, forceUpdate] = useReducer(increment, 0);

      // A Grid with a scrollElement is scrolled vertically by that element (e.g. the window) rather than scrolling itself:
      // it renders at its full height, and renders the rows within the scroll element's viewport.
      // (It may still scroll horizontally itself.)
      // Until the scroll element has been measured (e.g. during server rendering), the height prop is used as the viewport height.
      const linked = scrollElement !== undefined;
      const height =
        linkState !== null ? linkState.viewport.height : (heightProp ?? 0);

      useMissingHeightWarning("Grid", heightProp, scrollElement);

      // The instance (and its stable imperative handle) is created once
      const [
        {
          handle,
          internals,
          invokeOnScrollMemoizer,
          onScroll: onScrollEvent,
          setScrollState,
          updateScrollLeftForColumn,
          updateScrollTopForRow,
          linkTarget
        }
      ] = useState(() =>
        createGridInstance(
          {
            columnCount,
            columnWidth,
            estimatedColumnSize,
            estimatedRowSize,
            height,
            initialScrollLeft,
            // The vertical offset of a Grid with a scrollElement is determined by the scroll element
            initialScrollTop: linked ? undefined : initialScrollTop,
            onScroll,
            rowCount,
            rowHeight,
            scrollingResetTimeInterval,
            width
          },
          setLinkState,
          forceUpdate
        )
      );

      // (Initialized with the initial scroll offsets; see createGridInstance)
      const [scrollState, setScrollStateDispatch] = useState<ScrollState>(
        () => internals.scrollState
      );

      useImperativeHandle(ref, () => handle, [handle]);

      useScrollElementLink(
        scrollElement,
        linkTarget,
        scrollingResetTimeInterval
      );

      // If this component is server-rendered (or hydrated), the scrollbar size is measured after hydration.
      const measuredScrollbarSize = useSyncExternalStore<number | undefined>(
        subscribeToNothing,
        getScrollbarSize,
        getServerScrollbarSize
      );
      const scrollbarSizeMeasured = measuredScrollbarSize !== undefined;
      const scrollbarSize = measuredScrollbarSize ?? 0;

      const latest: LatestValues = {
        columnCount,
        height,
        onScroll,
        rowCount,
        scrollbarSize,
        scrollbarSizeMeasured,
        scrollingResetTimeInterval,
        width
      };
      useInsertionEffect(() => {
        internals.latest = latest;
        internals.scrollStateDispatch = setScrollStateDispatch;
      });

      // The browser can't apply a scroll offset before the page has been hydrated.
      // So if the Grid is server-rendered (or hydrated) with initial scroll offsets,
      // its inner container is shifted by those offsets instead (so that the rendered cells are visible),
      // until the offsets have been applied to the scrolling element after hydration (see the layout effect).
      const clientRendered = useSyncExternalStore(
        subscribeToNothing,
        getClientRendered,
        getServerRendered
      );
      const [hydrationShift, setHydrationShift] = useState<{
        left: number;
        top: number;
      } | null>(() =>
        clientRendered ||
        (internals.scrollState.scrollLeft === 0 &&
          internals.scrollState.scrollTop === 0)
          ? null
          : {
              left: internals.scrollState.scrollLeft,
              top: internals.scrollState.scrollTop
            }
      );

      const setScrollingContainerRef = useCallback(
        (element: HTMLDivElement | null) => {
          internals.element = element;

          if (typeof elementRef === "function") {
            elementRef(element);
          } else if (elementRef) {
            (elementRef as MutableRefObject<HTMLDivElement | null>).current =
              element;
          }
        },
        [elementRef, internals]
      );

      // Update cell metadata (and invalidate cached styles) if cell counts or sizes have changed
      const sizeInputs = internals.sizeInputs;
      if (
        columnCount !== sizeInputs.columnCount ||
        columnWidth !== sizeInputs.columnWidth ||
        estimatedColumnSize !== sizeInputs.estimatedColumnSize ||
        rowCount !== sizeInputs.rowCount ||
        rowHeight !== sizeInputs.rowHeight ||
        estimatedRowSize !== sizeInputs.estimatedRowSize
      ) {
        updateSizeInputs(internals, {
          columnCount,
          columnSizeGetter:
            columnWidth === sizeInputs.columnWidth
              ? sizeInputs.columnSizeGetter
              : wrapSizeGetter(columnWidth),
          columnWidth,
          estimatedColumnSize,
          estimatedRowSize,
          rowCount,
          rowHeight,
          rowSizeGetter:
            rowHeight === sizeInputs.rowHeight
              ? sizeInputs.rowSizeGetter
              : wrapSizeGetter(rowHeight)
        });
      }

      const { columnSizeAndPositionManager, rowSizeAndPositionManager } =
        internals;

      const isScrolling =
        scrollState.isScrolling ||
        (linkState !== null && linkState.viewport.isScrolling);
      const scrollLeft = scrollState.scrollLeft;
      const scrollTop = linked
        ? Math.max(0, linkState?.viewport.scrollTop ?? 0)
        : scrollState.scrollTop;
      const scrollDirectionHorizontal = scrollState.scrollDirectionHorizontal;
      const scrollDirectionVertical =
        linkState !== null
          ? linkState.direction
          : scrollState.scrollDirectionVertical;

      // Reset the style cache (keeping the styles of the cells rendered last time) once scrolling has stopped.
      // (For a linked Grid, this includes the scrolling of its scroll element.)
      if (!isScrolling) {
        // With isScrollingOptOut, cached cells are kept as well; but only if they are still current (bug #13):
        // i.e. the props haven't changed (and forceUpdate() hasn't been called) since the cells were cached.
        const keepCells =
          isScrollingOptOut &&
          internals.cellCacheForceUpdateCount === forceUpdateCount &&
          internals.cellCacheProps !== null &&
          areCellPropsEqual(internals.cellCacheProps, props);

        resetStyleCache(internals, keepCells);

        internals.cellCacheProps = props;
        internals.cellCacheForceUpdateCount = forceUpdateCount;
      }

      let childrenToDisplay: ReactNode[] = [];
      let renderedSection: Partial<RenderedSection> | null = null;

      // Render only enough columns and rows to cover the visible area of the grid.
      if (height > 0 && width > 0) {
        const visibleColumnIndices =
          columnSizeAndPositionManager.getVisibleCellRange({
            containerSize: width,
            offset: scrollLeft
          });
        const visibleRowIndices = rowSizeAndPositionManager.getVisibleCellRange(
          {
            containerSize: height,
            offset: scrollTop
          }
        );

        const horizontalOffsetAdjustment =
          columnSizeAndPositionManager.getOffsetAdjustment({
            containerSize: width,
            offset: scrollLeft
          });
        const verticalOffsetAdjustment =
          rowSizeAndPositionManager.getOffsetAdjustment({
            containerSize: height,
            offset: scrollTop
          });

        const overscanColumnIndices = overscanIndicesGetter({
          direction: "horizontal",
          cellCount: columnCount,
          overscanCellsCount: overscanColumnCount,
          scrollDirection: scrollDirectionHorizontal,
          startIndex:
            typeof visibleColumnIndices.start === "number"
              ? visibleColumnIndices.start
              : 0,
          stopIndex:
            typeof visibleColumnIndices.stop === "number"
              ? visibleColumnIndices.stop
              : -1
        });

        const overscanRowIndices = overscanIndicesGetter({
          direction: "vertical",
          cellCount: rowCount,
          overscanCellsCount: overscanRowCount,
          scrollDirection: scrollDirectionVertical,
          startIndex:
            typeof visibleRowIndices.start === "number"
              ? visibleRowIndices.start
              : 0,
          stopIndex:
            typeof visibleRowIndices.stop === "number"
              ? visibleRowIndices.stop
              : -1
        });

        let columnStartIndex = overscanColumnIndices.overscanStartIndex;
        let columnStopIndex = overscanColumnIndices.overscanStopIndex;
        let rowStartIndex = overscanRowIndices.overscanStartIndex;
        let rowStopIndex = overscanRowIndices.overscanStopIndex;

        // Advanced use-cases (eg CellMeasurer) require batched measurements to determine accurate sizes.
        if (deferredMeasurementCache) {
          // If rows have a dynamic height, scan the rows we are about to render.
          // If any have not yet been measured, then we need to render all columns initially,
          // Because the height of the row is equal to the tallest cell within that row,
          // (And so we can't know the height without measuring all column-cells first).
          if (!deferredMeasurementCache.hasFixedHeight()) {
            for (
              let rowIndex = rowStartIndex;
              rowIndex <= rowStopIndex;
              rowIndex++
            ) {
              if (!deferredMeasurementCache.has(rowIndex, 0)) {
                columnStartIndex = 0;
                columnStopIndex = columnCount - 1;
                break;
              }
            }
          }

          // If columns have a dynamic width, scan the columns we are about to render.
          // If any have not yet been measured, then we need to render all rows initially,
          // Because the width of the column is equal to the widest cell within that column,
          // (And so we can't know the width without measuring all row-cells first).
          if (!deferredMeasurementCache.hasFixedWidth()) {
            for (
              let columnIndex = columnStartIndex;
              columnIndex <= columnStopIndex;
              columnIndex++
            ) {
              if (!deferredMeasurementCache.has(0, columnIndex)) {
                rowStartIndex = 0;
                rowStopIndex = rowCount - 1;
                break;
              }
            }
          }
        }

        childrenToDisplay = cellRangeRenderer({
          cellCache: internals.cellCache,
          cellRenderer,
          columnSizeAndPositionManager,
          columnStartIndex,
          columnStopIndex,
          deferredMeasurementCache,
          horizontalOffsetAdjustment,
          isScrolling,
          isScrollingOptOut,
          parent: handle,
          rowSizeAndPositionManager,
          rowStartIndex,
          rowStopIndex,
          scrollLeft,
          scrollTop,
          styleCache: internals.styleCache,
          verticalOffsetAdjustment,
          visibleColumnIndices,
          visibleRowIndices
        });

        // Retained by the next resetStyleCache()
        internals.renderedRange = {
          columnStartIndex,
          columnStopIndex,
          rowStartIndex,
          rowStopIndex
        };

        // Reported by onSectionRendered once committed.
        // Indices may be undefined (if no cells are visible); the memoizer skips the callback in that case.
        renderedSection = {
          columnOverscanStartIndex: columnStartIndex,
          columnOverscanStopIndex: columnStopIndex,
          columnStartIndex: visibleColumnIndices.start,
          columnStopIndex: visibleColumnIndices.stop,
          rowOverscanStartIndex: rowStartIndex,
          rowOverscanStopIndex: rowStopIndex,
          rowStartIndex: visibleRowIndices.start,
          rowStopIndex: visibleRowIndices.stop
        };
      }

      const totalColumnsWidth = columnSizeAndPositionManager.getTotalSize();
      const totalRowsHeight = rowSizeAndPositionManager.getTotalSize();

      // Force browser to hide scrollbars when we know they aren't necessary.
      // Otherwise once scrollbars appear they may not disappear again.
      // For more info see issue #116
      const verticalScrollBarSize =
        totalRowsHeight > height ? scrollbarSize : 0;
      const horizontalScrollBarSize =
        totalColumnsWidth > width ? scrollbarSize : 0;

      // Equivalent of the 9.x componentDidMount/componentDidUpdate
      useIsomorphicLayoutEffect(() => {
        const committed = internals.committed;
        const element = internals.element;

        // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
        // We must do this at the start of the method as we may calculate and update scroll position below.
        if (
          typeof internals.deferredInvalidateColumnIndex === "number" &&
          typeof internals.deferredInvalidateRowIndex === "number"
        ) {
          const columnIndex = internals.deferredInvalidateColumnIndex;
          const rowIndex = internals.deferredInvalidateRowIndex;

          internals.deferredInvalidateColumnIndex = null;
          internals.deferredInvalidateRowIndex = null;

          handle.recomputeGridSize({ columnIndex, rowIndex });
        }

        if (committed === null && hydrationShift !== null) {
          // Hydrated with initial scroll offsets (rendered as a shift of the inner container; see above):
          // remove the shift, then apply the offsets to the scrolling element (on the next commit, before the browser paints).
          // If the user scrolled before the page was hydrated, the content they see is kept in place.
          internals.scrollOffsetsPendingHydration = true;
          setHydrationShift(null);
          if (element && (element.scrollLeft > 0 || element.scrollTop > 0)) {
            setScrollState({
              scrollLeft: hydrationShift.left + element.scrollLeft,
              scrollTop: hydrationShift.top + element.scrollTop
            });
          }
        } else if (committed === null) {
          // Mount
          if (element) {
            if (element.scrollLeft !== scrollState.scrollLeft) {
              element.scrollLeft = scrollState.scrollLeft;
            }
            if (element.scrollTop !== scrollState.scrollTop) {
              element.scrollTop = scrollState.scrollTop;
            }
          }
        } else {
          if (
            internals.scrollOffsetsPendingHydration &&
            hydrationShift === null
          ) {
            internals.scrollOffsetsPendingHydration = false;
            if (element) {
              element.scrollLeft = scrollState.scrollLeft;
              if (!linked) {
                element.scrollTop = scrollState.scrollTop;
              }
            }
          }

          // Handle edge case where column or row count has only just increased over 0.
          // In this case we may have to restore a previously-specified scroll offset.
          // For more info see bvaughn/react-virtualized/issues/218
          const columnOrRowCountJustIncreasedFromZero =
            (columnCount > 0 && committed.columnCount === 0) ||
            (rowCount > 0 && committed.rowCount === 0);

          // Make sure requested changes to :scrollLeft or :scrollTop get applied.
          // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
          // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
          // So we only set these when we require an adjustment of the scroll position.
          // See issue #2 for more information.
          if (
            element &&
            scrollState.scrollPositionChangeReason ===
              SCROLL_POSITION_CHANGE_REASONS.REQUESTED
          ) {
            // @TRICKY A linked Grid leaves its vertical scroll offset to its scroll element.
            // In this case we should avoid checking scrollingContainer.scrollTop since it forces layout/flow.
            const update: Partial<ScrollState> = {};
            if (
              scrollState.scrollLeft >= 0 &&
              (scrollState.scrollLeft !== element.scrollLeft ||
                columnOrRowCountJustIncreasedFromZero)
            ) {
              element.scrollLeft = scrollState.scrollLeft;

              // If the browser couldn't scroll that far (e.g. its overflow is hidden by a custom style),
              // no scroll event is dispatched; so update the offset to match.
              if (Math.abs(element.scrollLeft - scrollState.scrollLeft) >= 1) {
                update.scrollLeft = element.scrollLeft;
              }
            }
            if (
              !linked &&
              scrollState.scrollTop >= 0 &&
              (scrollState.scrollTop !== element.scrollTop ||
                columnOrRowCountJustIncreasedFromZero)
            ) {
              element.scrollTop = scrollState.scrollTop;

              if (Math.abs(element.scrollTop - scrollState.scrollTop) >= 1) {
                update.scrollTop = element.scrollTop;
              }
            }
            if (
              update.scrollLeft !== undefined ||
              update.scrollTop !== undefined
            ) {
              update.scrollPositionChangeReason =
                SCROLL_POSITION_CHANGE_REASONS.OBSERVED;
              setScrollState(update);
            }
          }

          // If the Grid (or its number of cells) has shrunk, make sure it isn't scrolled past its last cell
          updateScrollIndexHelper({
            cellSizeAndPositionManager: columnSizeAndPositionManager,
            previousCellsCount: committed.columnCount,
            previousSize: committed.width,
            scrollOffset: scrollState.scrollLeft,
            size: width,
            updateScrollIndexCallback: (columnIndex) =>
              updateScrollLeftForColumn("auto", columnIndex)
          });
          updateScrollIndexHelper({
            cellSizeAndPositionManager: rowSizeAndPositionManager,
            previousCellsCount: committed.rowCount,
            previousSize: committed.height,
            // The viewport of a linked Grid may extend past its end (e.g. the window may be scrolled past it),
            // so its offset doesn't need to be corrected when rows are removed
            scrollOffset: linked ? 0 : scrollState.scrollTop,
            size: height,
            updateScrollIndexCallback: (rowIndex) =>
              updateScrollTopForRow("auto", rowIndex)
          });
        }

        // An empty Grid is scrolled back to the start
        if (
          (columnCount === 0 && scrollState.scrollLeft !== 0) ||
          (rowCount === 0 && scrollState.scrollTop !== 0)
        ) {
          setScrollState({ scrollLeft: 0, scrollTop: 0 });
        }

        // Update onSectionRendered callback if start/stop indices have changed
        if (renderedSection !== null) {
          internals.onGridRenderedMemoizer({
            callback: onSectionRendered,
            indices: renderedSection as RenderedSection
          });
        }

        // Initialize onScroll callback (on mount); changes to the scroll offsets should also notify onScroll listeners
        if (
          committed === null ||
          scrollLeft !== committed.scrollLeft ||
          scrollTop !== committed.scrollTop
        ) {
          invokeOnScrollMemoizer(
            scrollLeft,
            scrollTop,
            totalColumnsWidth,
            totalRowsHeight
          );
        }

        const { scrollbarPresence } = internals;
        if (
          horizontalScrollBarSize !== scrollbarPresence.horizontal ||
          verticalScrollBarSize !== scrollbarPresence.vertical
        ) {
          internals.scrollbarPresence = {
            horizontal: horizontalScrollBarSize,
            vertical: verticalScrollBarSize
          };

          const params: ScrollbarPresenceChange = {
            horizontal: horizontalScrollBarSize > 0,
            size: scrollbarSize,
            vertical: verticalScrollBarSize > 0
          };
          onScrollbarPresenceChange(params);
        }

        internals.committed = {
          columnCount,
          columnWidth,
          height,
          rowCount,
          rowHeight,
          scrollLeft,
          scrollTop,
          width
        };
      });

      useEffect(
        () => () => {
          if (internals.disablePointerEventsTimeoutId) {
            cancelAnimationTimeout(internals.disablePointerEventsTimeoutId);
            internals.disablePointerEventsTimeoutId = null;
          }
        },
        [internals]
      );

      const gridStyle: CSSProperties = {
        boxSizing: "border-box",
        direction: "ltr",
        // A linked Grid renders at its full height (it doesn't scroll vertically itself)
        height: linked ? "auto" : height,
        position: "relative",
        width,
        WebkitOverflowScrolling: "touch",
        willChange: "transform"
      };

      // Also explicitly init styles to 'auto' if scrollbars are required.
      // This works around an obscure edge case where external CSS styles have not yet been loaded,
      // But an initial scroll index of offset is set as an external prop.
      // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
      // This was originally reported via clauderic/react-infinite-calendar/issues/23
      gridStyle.overflowX =
        totalColumnsWidth + verticalScrollBarSize <= width ? "hidden" : "auto";
      gridStyle.overflowY =
        totalRowsHeight + horizontalScrollBarSize <= height ? "hidden" : "auto";

      const showNoContentRenderer =
        childrenToDisplay.length === 0 && height > 0 && width > 0;

      return (
        <div
          ref={setScrollingContainerRef}
          {...containerProps}
          aria-label={ariaLabel}
          aria-readonly={ariaReadonly}
          className={clsx("ReactVirtualized__Grid", className)}
          id={id}
          onScroll={onScrollEvent}
          role={role}
          style={{
            ...gridStyle,
            ...style
          }}
          tabIndex={tabIndex as number | undefined}
        >
          {childrenToDisplay.length > 0 && (
            <div
              className="ReactVirtualized__Grid__innerScrollContainer"
              role={containerRole}
              style={{
                width: autoContainerWidth ? "auto" : totalColumnsWidth,
                height: totalRowsHeight,
                maxWidth: totalColumnsWidth,
                maxHeight: totalRowsHeight,
                overflow: "hidden",
                pointerEvents: (isScrolling
                  ? "none"
                  : "") as CSSProperties["pointerEvents"],
                position: "relative",
                ...(hydrationShift !== null && {
                  marginLeft: -hydrationShift.left,
                  marginTop: -hydrationShift.top
                }),
                ...containerStyle
              }}
            >
              {childrenToDisplay}
            </div>
          )}
          {showNoContentRenderer && noContentRenderer()}
        </div>
      );
    }
  )
);
