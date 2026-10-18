import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useInsertionEffect,
  useMemo,
  useReducer,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction
} from "react";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import type { CellMeasureCache } from "../CellMeasurer/types";
import { Grid } from "../Grid/Grid";
import type {
  CellRendererParams,
  CellSize,
  GridImperativeAPI,
  Scroll,
  ScrollbarPresenceChange
} from "../Grid/types";
import { CellMeasurerCacheDecorator } from "./CellMeasurerCacheDecorator";
import { defaultMultiGridProps } from "./defaultMultiGridProps";
import type { MultiGridImperativeAPI, MultiGridProps } from "./types";

const SCROLLBAR_SIZE_BUFFER = 20;

type ScrollInfo = Pick<Scroll, "scrollLeft" | "scrollTop">;

// Scrollbars of the bottom-right Grid (as reported by its onScrollbarPresenceChange)
type ScrollbarState = {
  scrollbarSize: number;
  showHorizontalScrollbar: boolean;
  showVerticalScrollbar: boolean;
};

const INITIAL_SCROLLBAR_STATE: ScrollbarState = {
  scrollbarSize: 0,
  showHorizontalScrollbar: false,
  showVerticalScrollbar: false
};

// Props read by the imperative methods and the inner Grids' callbacks.
// They are updated in an insertion effect, so they are current when these are called during the commit phase
// (e.g. by a CellMeasurer cell or an inner Grid, whose effects run before the MultiGrid's own layout effects).
type LatestValues = Pick<
  MultiGridProps,
  "onScroll" | "onScrollbarPresenceChange"
> & {
  fixedColumnCount: number;
  fixedRowCount: number;
};

// Mutable, per-instance values (the equivalent of the instance fields of the 9.x class component).
// They are only modified by the imperative methods, the inner Grids' callbacks and effects (never during render).
type MultiGridInternals = {
  bottomLeftGrid: GridImperativeAPI | null;
  bottomRightGrid: GridImperativeAPI | null;
  topLeftGrid: GridImperativeAPI | null;
  topRightGrid: GridImperativeAPI | null;

  // Cell sizes of the most recently committed render (to detect numeric size changes)
  committedSizes: { columnWidth: CellSize; rowHeight: CellSize } | null;

  deferredInvalidateColumnIndex: number | null;
  deferredInvalidateRowIndex: number | null;

  latest: LatestValues;

  // The most recently requested scrollbar state (including an update that has not been rendered yet)
  scrollbarState: ScrollbarState;

  // The scroll offsets the quadrants are kept in sync with: the bottom-right Grid's offsets
  // (or the top-right/bottom-left Grid's, if those are scrolled by the user; see enableFixedRowScroll/enableFixedColumnScroll).
  // These are updated by scroll events, so they aren't state: changing them doesn't re-render MultiGrid itself;
  // the quadrants are scrolled through their imperative handles instead.
  scrollLeft: number;
  scrollTop: number;
};

type MultiGridInstance = {
  handle: MultiGridImperativeAPI;
  internals: MultiGridInternals;
  onCommit: (columnWidth: CellSize, rowHeight: CellSize) => void;
  onScroll: (scrollInfo: ScrollInfo) => void;
  onScrollbarPresenceChange: (params: ScrollbarPresenceChange) => void;
  onScrollLeft: (scrollInfo: ScrollInfo) => void;
  onScrollTop: (scrollInfo: ScrollInfo) => void;
  setBottomLeftGrid: (grid: GridImperativeAPI | null) => void;
  setBottomRightGrid: (grid: GridImperativeAPI | null) => void;
  setTopLeftGrid: (grid: GridImperativeAPI | null) => void;
  setTopRightGrid: (grid: GridImperativeAPI | null) => void;
};

const increment = (value: number) => value + 1;

function isNumericSizeChange(prevSize: CellSize, nextSize: CellSize) {
  // Function sizes aren't compared (inline functions would cause infinite loops);
  // in that case the recompute methods should be used to inform of changes (as with Grid).
  return (
    (typeof prevSize === "number" || typeof nextSize === "number") &&
    prevSize !== nextSize
  );
}

// Total size of the first `count` columns (or rows)
function getFixedCellsSize(size: CellSize, count: number): number {
  if (typeof size === "function") {
    let total = 0;
    for (let index = 0; index < count; index++) {
      total += size({ index });
    }
    return total;
  }
  return size * count;
}

function createMultiGridInstance(
  initialLatest: LatestValues,
  setScrollbarState: Dispatch<SetStateAction<ScrollbarState>>,
  forceUpdate: () => void
): MultiGridInstance {
  const internals: MultiGridInternals = {
    bottomLeftGrid: null,
    bottomRightGrid: null,
    topLeftGrid: null,
    topRightGrid: null,
    committedSizes: null,
    deferredInvalidateColumnIndex: null,
    deferredInvalidateRowIndex: null,
    latest: initialLatest,
    scrollbarState: INITIAL_SCROLLBAR_STATE,
    scrollLeft: 0,
    scrollTop: 0
  };

  // Calls recomputeGridSize() on all child Grids (adjusting the indices for the fixed rows and columns)
  const recomputeGrids = (columnIndex: number, rowIndex: number) => {
    const { fixedColumnCount, fixedRowCount } = internals.latest;

    const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount);
    const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount);

    internals.bottomLeftGrid?.recomputeGridSize({
      columnIndex,
      rowIndex: adjustedRowIndex
    });
    internals.bottomRightGrid?.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex: adjustedRowIndex
    });
    internals.topLeftGrid?.recomputeGridSize({
      columnIndex,
      rowIndex
    });
    internals.topRightGrid?.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex
    });
  };

  // Scrolls the fixed Grids to the current scroll offsets (horizontally for the top-right Grid, vertically for the bottom-left Grid).
  // Grid's scrollToPosition() is a no-op for a Grid that is already there.
  // (The bottom-right Grid is not scrolled here: it reports its own offsets, and may have a pending scroll, e.g. to keep a cell in view.)
  const syncFixedGridScrollPositions = () => {
    const { scrollLeft, scrollTop } = internals;

    internals.topRightGrid?.scrollToPosition({ scrollLeft });
    internals.bottomLeftGrid?.scrollToPosition({ scrollTop });
  };

  const handle: MultiGridImperativeAPI = {
    forceUpdateGrids() {
      internals.bottomLeftGrid?.forceUpdate();
      internals.bottomRightGrid?.forceUpdate();
      internals.topLeftGrid?.forceUpdate();
      internals.topRightGrid?.forceUpdate();
    },

    invalidateCellSizeAfterRender({ columnIndex = 0, rowIndex = 0 } = {}) {
      internals.deferredInvalidateColumnIndex =
        typeof internals.deferredInvalidateColumnIndex === "number"
          ? Math.min(internals.deferredInvalidateColumnIndex, columnIndex)
          : columnIndex;
      internals.deferredInvalidateRowIndex =
        typeof internals.deferredInvalidateRowIndex === "number"
          ? Math.min(internals.deferredInvalidateRowIndex, rowIndex)
          : rowIndex;

      // The invalidated sizes are recomputed after the MultiGrid's next commit (see onCommit).
      // The cell may have been rendered by an inner Grid alone (e.g. while scrolling), so schedule a MultiGrid update.
      // (This is called during the commit phase, so the update is applied before the browser paints.)
      forceUpdate();
    },

    measureAllCells() {
      internals.bottomLeftGrid?.measureAllCells();
      internals.bottomRightGrid?.measureAllCells();
      internals.topLeftGrid?.measureAllCells();
      internals.topRightGrid?.measureAllCells();
    },

    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
      recomputeGrids(columnIndex, rowIndex);

      // Re-render the MultiGrid itself, recomputing the size of the fixed rows and columns (bug #7)
      forceUpdate();
    },

    scrollToCell({ align, columnIndex, rowIndex }) {
      const { fixedColumnCount, fixedRowCount } = internals.latest;

      // Fixed cells are always visible (in the corresponding axis)
      const adjustedColumnIndex =
        columnIndex !== undefined && columnIndex >= fixedColumnCount
          ? columnIndex - fixedColumnCount
          : undefined;
      const adjustedRowIndex =
        rowIndex !== undefined && rowIndex >= fixedRowCount
          ? rowIndex - fixedRowCount
          : undefined;

      // The other quadrants are synced when the bottom-right Grid reports its new offsets (via onScroll)
      internals.bottomRightGrid?.scrollToCell({
        align,
        columnIndex: adjustedColumnIndex,
        rowIndex: adjustedRowIndex
      });
    },

    scrollToPosition({ scrollLeft, scrollTop }) {
      internals.bottomRightGrid?.scrollToPosition({ scrollLeft, scrollTop });
    }
  };

  // Called after every commit of the MultiGrid (the equivalent of the 9.x componentDidMount/componentDidUpdate)
  const onCommit = (columnWidth: CellSize, rowHeight: CellSize) => {
    // Most of the inner Grids receive wrapped (function) cell sizes, which Grid can't compare;
    // so a change of a numeric size is passed on by recomputing them (as Grid does for its own numeric sizes).
    const committedSizes = internals.committedSizes;
    internals.committedSizes = { columnWidth, rowHeight };
    if (
      committedSizes !== null &&
      (isNumericSizeChange(committedSizes.columnWidth, columnWidth) ||
        isNumericSizeChange(committedSizes.rowHeight, rowHeight))
    ) {
      recomputeGrids(0, 0);
    }

    // Cell sizes invalidated by CellMeasurer (see invalidateCellSizeAfterRender)
    if (typeof internals.deferredInvalidateColumnIndex === "number") {
      const columnIndex = internals.deferredInvalidateColumnIndex;
      // Always set alongside the column index (by invalidateCellSizeAfterRender)
      const rowIndex = internals.deferredInvalidateRowIndex as number;

      internals.deferredInvalidateColumnIndex = null;
      internals.deferredInvalidateRowIndex = null;

      handle.recomputeGridSize({ columnIndex, rowIndex });
    }

    // E.g. a fixed Grid that has just been added (because the fixed row or column count changed)
    syncFixedGridScrollPositions();
  };

  // The bottom-right Grid has been scrolled
  const onScroll = (scrollInfo: ScrollInfo) => {
    const { scrollLeft, scrollTop } = scrollInfo;

    internals.scrollLeft = scrollLeft;
    internals.scrollTop = scrollTop;

    // Scroll the fixed Grids in the same batch of updates as the one that scrolled (so they don't lag behind).
    // (This is a no-op for a Grid that reported the new offsets.)
    syncFixedGridScrollPositions();

    const { onScroll } = internals.latest;
    if (onScroll) {
      // The full Scroll object is passed when invoked by the bottom-right Grid;
      // only scrollLeft and scrollTop are passed when invoked via onScrollLeft or onScrollTop
      onScroll(scrollInfo as Scroll);
    }
  };

  const onScrollbarPresenceChange = ({
    horizontal,
    size,
    vertical
  }: ScrollbarPresenceChange) => {
    const { showHorizontalScrollbar, showVerticalScrollbar } =
      internals.scrollbarState;

    if (
      horizontal !== showHorizontalScrollbar ||
      vertical !== showVerticalScrollbar
    ) {
      const scrollbarState: ScrollbarState = {
        scrollbarSize: size,
        showHorizontalScrollbar: horizontal,
        showVerticalScrollbar: vertical
      };
      internals.scrollbarState = scrollbarState;
      setScrollbarState(scrollbarState);

      const { onScrollbarPresenceChange } = internals.latest;
      if (typeof onScrollbarPresenceChange === "function") {
        onScrollbarPresenceChange({
          horizontal,
          size,
          vertical
        });
      }
    }
  };

  // The top-right Grid has been scrolled by the user (enableFixedRowScroll)
  const onScrollLeft = ({ scrollLeft }: ScrollInfo) => {
    internals.bottomRightGrid?.scrollToPosition({ scrollLeft });
    onScroll({
      scrollLeft,
      scrollTop: internals.scrollTop
    });
  };

  // The bottom-left Grid has been scrolled by the user (enableFixedColumnScroll)
  const onScrollTop = ({ scrollTop }: ScrollInfo) => {
    internals.bottomRightGrid?.scrollToPosition({ scrollTop });
    onScroll({
      scrollLeft: internals.scrollLeft,
      scrollTop
    });
  };

  return {
    handle,
    internals,
    onCommit,
    onScroll,
    onScrollbarPresenceChange,
    onScrollLeft,
    onScrollTop,
    setBottomLeftGrid: (grid) => {
      internals.bottomLeftGrid = grid;
    },
    setBottomRightGrid: (grid) => {
      internals.bottomRightGrid = grid;
    },
    setTopLeftGrid: (grid) => {
      internals.topLeftGrid = grid;
    },
    setTopRightGrid: (grid) => {
      internals.topRightGrid = grid;
    }
  };
}

// The CellMeasurerCache (wrapper) used by each of the inner Grids that don't start at the first row and column.
// (The wrappers translate the inner Grids' indices to indices of the full grid.)
function createDeferredMeasurementCaches(
  deferredMeasurementCache: CellMeasureCache | undefined,
  fixedColumnCount: number,
  fixedRowCount: number
) {
  if (!deferredMeasurementCache) {
    return {
      bottomLeftGrid: undefined,
      bottomRightGrid: undefined,
      topRightGrid: undefined
    };
  }

  // CellMeasurerCacheDecorator relies on CellMeasurerCache-specific methods (eg clearAll)
  const cellMeasurerCache = deferredMeasurementCache as CellMeasurerCache;

  return {
    bottomLeftGrid:
      fixedRowCount > 0
        ? new CellMeasurerCacheDecorator({
            cellMeasurerCache,
            columnIndexOffset: 0,
            rowIndexOffset: fixedRowCount
          })
        : deferredMeasurementCache,
    bottomRightGrid:
      fixedColumnCount > 0 || fixedRowCount > 0
        ? new CellMeasurerCacheDecorator({
            cellMeasurerCache,
            columnIndexOffset: fixedColumnCount,
            rowIndexOffset: fixedRowCount
          })
        : deferredMeasurementCache,
    topRightGrid:
      fixedColumnCount > 0
        ? new CellMeasurerCacheDecorator({
            cellMeasurerCache,
            columnIndexOffset: fixedColumnCount,
            rowIndexOffset: 0
          })
        : deferredMeasurementCache
  };
}

/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 *
 * Scrolling is done through the imperative handle (`ref`): see `scrollToCell` and `scrollToPosition`.
 */
export const MultiGrid = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<MultiGridImperativeAPI, MultiGridProps>(
    function MultiGrid(props, ref) {
      const {
        cellRenderer,
        classNameBottomLeftGrid = defaultMultiGridProps.classNameBottomLeftGrid,
        classNameBottomRightGrid = defaultMultiGridProps.classNameBottomRightGrid,
        classNameTopLeftGrid = defaultMultiGridProps.classNameTopLeftGrid,
        classNameTopRightGrid = defaultMultiGridProps.classNameTopRightGrid,
        columnCount,
        columnWidth,
        deferredMeasurementCache,
        enableFixedColumnScroll = defaultMultiGridProps.enableFixedColumnScroll,
        enableFixedRowScroll = defaultMultiGridProps.enableFixedRowScroll,
        fixedColumnCount = defaultMultiGridProps.fixedColumnCount,
        fixedRowCount = defaultMultiGridProps.fixedRowCount,
        height,
        hideBottomLeftGridScrollbar = defaultMultiGridProps.hideBottomLeftGridScrollbar,
        hideTopRightGridScrollbar = defaultMultiGridProps.hideTopRightGridScrollbar,
        // The initial offsets only apply to the quadrants that scroll along the corresponding axis
        initialScrollLeft,
        initialScrollTop,
        onScroll,
        onScrollbarPresenceChange,
        onSectionRendered,
        rowCount,
        rowHeight,
        style = defaultMultiGridProps.style,
        styleBottomLeftGrid = defaultMultiGridProps.styleBottomLeftGrid,
        styleBottomRightGrid = defaultMultiGridProps.styleBottomRightGrid,
        styleTopLeftGrid = defaultMultiGridProps.styleTopLeftGrid,
        styleTopRightGrid = defaultMultiGridProps.styleTopRightGrid,
        width,
        // The remaining (Grid) props are relayed to all of the inner Grids
        ...gridProps
      } = props;

      // Incremented to re-render the MultiGrid and recompute the size of its fixed rows and columns (see recomputeGridSize)
      const [layoutVersion, forceUpdate] = useReducer(increment, 0);
      const [scrollbarState, setScrollbarState] = useState<ScrollbarState>(
        INITIAL_SCROLLBAR_STATE
      );

      const latest: LatestValues = {
        fixedColumnCount,
        fixedRowCount,
        onScroll,
        onScrollbarPresenceChange
      };

      // The instance (and its stable imperative handle) is created once
      const [
        {
          handle,
          internals,
          onCommit,
          onScroll: onScrollBottomRightGrid,
          onScrollbarPresenceChange: onScrollbarPresenceChangeBottomRightGrid,
          onScrollLeft,
          onScrollTop,
          setBottomLeftGrid,
          setBottomRightGrid,
          setTopLeftGrid,
          setTopRightGrid
        }
      ] = useState(() =>
        createMultiGridInstance(latest, setScrollbarState, forceUpdate)
      );

      useImperativeHandle(ref, () => handle, [handle]);

      useInsertionEffect(() => {
        internals.latest = latest;
      });

      const { scrollbarSize, showHorizontalScrollbar, showVerticalScrollbar } =
        scrollbarState;

      // The size of the fixed columns and rows.
      // Function sizes are (only) re-read when they change or when recomputeGridSize() is called (see layoutVersion).
      const leftGridWidth = useMemo(
        () => getFixedCellsSize(columnWidth, fixedColumnCount),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [columnWidth, fixedColumnCount, layoutVersion]
      );
      const topGridHeight = useMemo(
        () => getFixedCellsSize(rowHeight, fixedRowCount),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rowHeight, fixedRowCount, layoutVersion]
      );
      const bottomGridHeight = height - topGridHeight;
      const rightGridWidth = width - leftGridWidth;

      // The fixed Grids need some extra room to scroll as far as the bottom-right Grid (which may have scrollbars):
      // the bottom-left Grid gets an extra row (as tall as the bottom-right Grid's horizontal scrollbar),
      // and the top-right Grid gets an extra column (as wide as the bottom-right Grid's vertical scrollbar).
      // (The bottom-right Grid's horizontal scrollbar shortens its scrollable height, and vice versa; bug #29.)
      // If the bottom-right Grid has no scrollbar, the extra space is overflow:hidden anyway.
      const additionalRowCount = showHorizontalScrollbar ? 1 : 0;
      const additionalColumnCount = showVerticalScrollbar ? 1 : 0;

      // Inline styles are memoized so that they don't defeat the inner Grids' memo().
      const containerOuterStyle = useMemo<CSSProperties>(
        () => ({
          height,
          overflow: "visible", // Let :focus outline show through
          width,
          ...style
        }),
        [height, style, width]
      );
      const containerTopStyle = useMemo<CSSProperties>(
        () => ({
          height: topGridHeight,
          position: "relative",
          width
        }),
        [topGridHeight, width]
      );
      const containerBottomStyle = useMemo<CSSProperties>(
        () => ({
          height: bottomGridHeight,
          overflow: "visible", // Let :focus outline show through
          position: "relative",
          width
        }),
        [bottomGridHeight, width]
      );
      // (Bug #8: these follow changes to enableFixedColumnScroll and enableFixedRowScroll)
      const bottomLeftGridStyle = useMemo<CSSProperties>(
        () => ({
          left: 0,
          overflowX: "hidden",
          overflowY: enableFixedColumnScroll ? "auto" : "hidden",
          position: "absolute",
          ...styleBottomLeftGrid
        }),
        [enableFixedColumnScroll, styleBottomLeftGrid]
      );
      const bottomRightGridStyle = useMemo<CSSProperties>(
        () => ({
          left: leftGridWidth,
          position: "absolute",
          ...styleBottomRightGrid
        }),
        [leftGridWidth, styleBottomRightGrid]
      );
      const topLeftGridStyle = useMemo<CSSProperties>(
        () => ({
          left: 0,
          overflowX: "hidden",
          overflowY: "hidden",
          position: "absolute",
          top: 0,
          ...styleTopLeftGrid
        }),
        [styleTopLeftGrid]
      );
      const topRightGridStyle = useMemo<CSSProperties>(
        () => ({
          left: leftGridWidth,
          overflowX: enableFixedRowScroll ? "auto" : "hidden",
          overflowY: "hidden",
          position: "absolute",
          top: 0,
          ...styleTopRightGrid
        }),
        [enableFixedRowScroll, leftGridWidth, styleTopRightGrid]
      );
      const topRightGridInnerStyle = useMemo<CSSProperties>(
        () =>
          hideTopRightGridScrollbar
            ? { ...topRightGridStyle, left: 0 }
            : topRightGridStyle,
        [hideTopRightGridScrollbar, topRightGridStyle]
      );

      // Bug #20: the wrappers (and their index offsets) follow changes to the cache and the fixed row and column counts
      const deferredMeasurementCaches = useMemo(
        () =>
          createDeferredMeasurementCaches(
            deferredMeasurementCache,
            fixedColumnCount,
            fixedRowCount
          ),
        [deferredMeasurementCache, fixedColumnCount, fixedRowCount]
      );

      // Cell sizes of the right and bottom Grids (whose indices are offset by the fixed columns and rows)
      const columnWidthRightGrid = useCallback(
        ({ index }: { index: number }): number => {
          // The extra column (see additionalColumnCount)
          if (
            showVerticalScrollbar &&
            index === columnCount - fixedColumnCount
          ) {
            return scrollbarSize;
          }

          return typeof columnWidth === "function"
            ? columnWidth({ index: index + fixedColumnCount })
            : columnWidth;
        },
        [
          columnCount,
          columnWidth,
          fixedColumnCount,
          scrollbarSize,
          showVerticalScrollbar
        ]
      );
      const rowHeightBottomGrid = useCallback(
        ({ index }: { index: number }): number => {
          // The extra row (see additionalRowCount)
          if (showHorizontalScrollbar && index === rowCount - fixedRowCount) {
            return scrollbarSize;
          }

          return typeof rowHeight === "function"
            ? rowHeight({ index: index + fixedRowCount })
            : rowHeight;
        },
        [
          fixedRowCount,
          rowCount,
          rowHeight,
          scrollbarSize,
          showHorizontalScrollbar
        ]
      );

      // Cell renderers of the inner Grids.
      // Indices are translated to indices of the full grid, and the MultiGrid's handle is passed as the parent (for CellMeasurer).
      const cellRendererTopLeftGrid = useCallback(
        (params: CellRendererParams) =>
          cellRenderer({
            ...params,
            // Bug #21: like the other quadrants (rather than the inner Grid)
            parent: handle
          }),
        [cellRenderer, handle]
      );
      const cellRendererTopRightGrid = useCallback(
        ({ columnIndex, ...rest }: CellRendererParams) => {
          if (columnIndex === columnCount - fixedColumnCount) {
            return (
              <div
                key={rest.key}
                style={{
                  ...rest.style,
                  width: SCROLLBAR_SIZE_BUFFER
                }}
              />
            );
          } else {
            return cellRenderer({
              ...rest,
              columnIndex: columnIndex + fixedColumnCount,
              parent: handle
            });
          }
        },
        [cellRenderer, columnCount, fixedColumnCount, handle]
      );
      const cellRendererBottomLeftGrid = useCallback(
        ({ rowIndex, ...rest }: CellRendererParams) => {
          if (rowIndex === rowCount - fixedRowCount) {
            return (
              <div
                key={rest.key}
                style={{
                  ...rest.style,
                  height: SCROLLBAR_SIZE_BUFFER
                }}
              />
            );
          } else {
            return cellRenderer({
              ...rest,
              parent: handle,
              rowIndex: rowIndex + fixedRowCount
            });
          }
        },
        [cellRenderer, fixedRowCount, handle, rowCount]
      );
      const cellRendererBottomRightGrid = useCallback(
        ({ columnIndex, rowIndex, ...rest }: CellRendererParams) =>
          cellRenderer({
            ...rest,
            columnIndex: columnIndex + fixedColumnCount,
            parent: handle,
            rowIndex: rowIndex + fixedRowCount
          }),
        [cellRenderer, fixedColumnCount, fixedRowCount, handle]
      );

      // Equivalent of the 9.x componentDidMount/componentDidUpdate
      useIsomorphicLayoutEffect(() => {
        onCommit(columnWidth, rowHeight);
      });

      // Don't render any of our Grids if there are no cells.
      // This mirrors what Grid does,
      // And prevents us from recording inaccurate measurements when used with CellMeasurer.
      if (width === 0 || height === 0) {
        return null;
      }

      let topLeftGrid = null;
      if (fixedColumnCount && fixedRowCount) {
        topLeftGrid = (
          <Grid
            {...gridProps}
            cellRenderer={cellRendererTopLeftGrid}
            className={classNameTopLeftGrid}
            columnCount={fixedColumnCount}
            columnWidth={columnWidth}
            deferredMeasurementCache={deferredMeasurementCache}
            height={topGridHeight}
            ref={setTopLeftGrid}
            rowCount={fixedRowCount}
            rowHeight={rowHeight}
            style={topLeftGridStyle}
            tabIndex={null}
            width={leftGridWidth}
          />
        );
      }

      let topRightGrid = null;
      if (fixedRowCount) {
        const additionalHeight = showHorizontalScrollbar ? scrollbarSize : 0;

        topRightGrid = (
          <Grid
            {...gridProps}
            cellRenderer={cellRendererTopRightGrid}
            className={classNameTopRightGrid}
            columnCount={
              Math.max(0, columnCount - fixedColumnCount) +
              additionalColumnCount
            }
            columnWidth={columnWidthRightGrid}
            deferredMeasurementCache={deferredMeasurementCaches.topRightGrid}
            height={
              hideTopRightGridScrollbar
                ? topGridHeight + additionalHeight
                : topGridHeight
            }
            initialScrollLeft={initialScrollLeft}
            onScroll={enableFixedRowScroll ? onScrollLeft : undefined}
            ref={setTopRightGrid}
            rowCount={fixedRowCount}
            rowHeight={rowHeight}
            style={topRightGridInnerStyle}
            tabIndex={null}
            width={rightGridWidth}
          />
        );

        if (hideTopRightGridScrollbar) {
          topRightGrid = (
            <div
              className="TopRightGrid_ScrollWrapper"
              style={{
                ...topRightGridStyle,
                height: topGridHeight,
                width: rightGridWidth,
                overflowX: "hidden"
              }}
            >
              {topRightGrid}
            </div>
          );
        }
      }

      let bottomLeftGrid = null;
      if (fixedColumnCount) {
        // The bottom-left Grid's own vertical scrollbar (see enableFixedColumnScroll)
        const additionalWidth = showVerticalScrollbar ? scrollbarSize : 0;

        bottomLeftGrid = (
          <Grid
            {...gridProps}
            cellRenderer={cellRendererBottomLeftGrid}
            className={classNameBottomLeftGrid}
            columnCount={fixedColumnCount}
            columnWidth={columnWidth}
            deferredMeasurementCache={deferredMeasurementCaches.bottomLeftGrid}
            height={bottomGridHeight}
            initialScrollTop={initialScrollTop}
            onScroll={enableFixedColumnScroll ? onScrollTop : undefined}
            ref={setBottomLeftGrid}
            rowCount={
              Math.max(0, rowCount - fixedRowCount) + additionalRowCount
            }
            rowHeight={rowHeightBottomGrid}
            style={bottomLeftGridStyle}
            tabIndex={null}
            width={
              hideBottomLeftGridScrollbar
                ? leftGridWidth + additionalWidth
                : leftGridWidth
            }
          />
        );

        if (hideBottomLeftGridScrollbar) {
          bottomLeftGrid = (
            <div
              className="BottomLeftGrid_ScrollWrapper"
              style={{
                ...bottomLeftGridStyle,
                height: bottomGridHeight,
                width: leftGridWidth,
                overflowY: "hidden"
              }}
            >
              {bottomLeftGrid}
            </div>
          );
        }
      }

      const bottomRightGrid = (
        <Grid
          {...gridProps}
          cellRenderer={cellRendererBottomRightGrid}
          className={classNameBottomRightGrid}
          columnCount={Math.max(0, columnCount - fixedColumnCount)}
          columnWidth={columnWidthRightGrid}
          deferredMeasurementCache={deferredMeasurementCaches.bottomRightGrid}
          height={bottomGridHeight}
          initialScrollLeft={initialScrollLeft}
          initialScrollTop={initialScrollTop}
          onScroll={onScrollBottomRightGrid}
          onScrollbarPresenceChange={onScrollbarPresenceChangeBottomRightGrid}
          onSectionRendered={onSectionRendered}
          ref={setBottomRightGrid}
          rowCount={Math.max(0, rowCount - fixedRowCount)}
          rowHeight={rowHeightBottomGrid}
          style={bottomRightGridStyle}
          width={rightGridWidth}
        />
      );

      return (
        <div style={containerOuterStyle}>
          <div style={containerTopStyle}>
            {topLeftGrid}
            {topRightGrid}
          </div>
          <div style={containerBottomStyle}>
            {bottomLeftGrid}
            {bottomRightGrid}
          </div>
        </div>
      );
    }
  )
);
