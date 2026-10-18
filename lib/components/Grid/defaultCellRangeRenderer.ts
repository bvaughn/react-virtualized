import { cloneElement, type CSSProperties, type ReactElement } from "react";
import type { CellMeasurerParent } from "../CellMeasurer/types";
import type {
  CellRangeRendererParams,
  CellRendererParams,
  CellRenderer
} from "./types";

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */

export function defaultCellRangeRenderer({
  cellCache,
  cellRenderer,
  columnSizeAndPositionManager,
  columnStartIndex,
  columnStopIndex,
  deferredMeasurementCache,
  horizontalOffsetAdjustment,
  isScrolling,
  isScrollingOptOut,
  parent, // Grid (or List or Table)
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  styleCache,
  verticalOffsetAdjustment,
  visibleColumnIndices,
  visibleRowIndices
}: CellRangeRendererParams): ReactElement[] {
  const renderedCells: ReactElement[] = [];

  // Browsers have native size limits for elements (eg Chrome 33M pixels, IE 1.5M pixes).
  // User cannot scroll beyond these size limitations.
  // In order to work around this, ScalingCellSizeAndPositionManager compresses offsets.
  // We should never cache styles for compressed offsets though as this can lead to bugs.
  // See issue #576 for more.
  const areOffsetsAdjusted =
    columnSizeAndPositionManager.areOffsetsAdjusted() ||
    rowSizeAndPositionManager.areOffsetsAdjusted();

  const canCacheStyle = !isScrolling && !areOffsetsAdjusted;

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    const rowDatum =
      rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    for (
      let columnIndex = columnStartIndex;
      columnIndex <= columnStopIndex;
      columnIndex++
    ) {
      const columnDatum =
        columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
      // Note that start/stop may be undefined (in which case the comparisons below are false)
      const isVisible =
        columnIndex >= visibleColumnIndices.start! &&
        columnIndex <= visibleColumnIndices.stop! &&
        rowIndex >= visibleRowIndices.start! &&
        rowIndex <= visibleRowIndices.stop!;
      const key = `${rowIndex}-${columnIndex}`;
      let style: CSSProperties;

      // Cache style objects so shallow-compare doesn't re-render unnecessarily.
      if (canCacheStyle && styleCache[key]) {
        style = styleCache[key];
      } else {
        // In deferred mode, cells will be initially rendered before we know their size.
        // Don't interfere with CellMeasurer's measurements by setting an invalid size.
        if (
          deferredMeasurementCache &&
          !deferredMeasurementCache.has(rowIndex, columnIndex)
        ) {
          // Position not-yet-measured cells at top/left 0,0,
          // And give them width/height of 'auto' so they can grow larger than the parent Grid if necessary.
          // Positioning them further to the right/bottom influences their measured size.
          style = {
            height: "auto",
            left: 0,
            position: "absolute",
            top: 0,
            width: "auto"
          };
        } else {
          style = {
            height: rowDatum.size,
            left: columnDatum.offset + horizontalOffsetAdjustment,
            position: "absolute",
            top: rowDatum.offset + verticalOffsetAdjustment,
            width: columnDatum.size
          };

          styleCache[key] = style;
        }
      }

      const cellRendererParams: CellRendererParams = {
        columnIndex,
        isScrolling,
        isVisible,
        key,
        parent,
        rowIndex,
        style
      };

      let renderedCell: ReturnType<CellRenderer>;

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling completes.
      // However if we are scaling scroll positions and sizes, we should also avoid caching.
      // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
      // For more info refer to issue #395
      //
      // If isScrollingOptOut is specified, we always cache cells.
      // For more info refer to issue #1028
      if (
        (isScrollingOptOut || isScrolling) &&
        !horizontalOffsetAdjustment &&
        !verticalOffsetAdjustment
      ) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer(cellRendererParams);
        }

        renderedCell = cellCache[key];

        // If the user is no longer scrolling, don't cache cells.
        // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer(cellRendererParams);
      }

      if (renderedCell == null || renderedCell === false) {
        continue;
      }

      const cellElement = renderedCell as ReactElement<CellElementProps>;

      if (process.env.NODE_ENV !== "production") {
        warnAboutMissingStyle(parent, cellElement);
      }

      if (!cellElement.props.role) {
        renderedCell = cloneElement(cellElement, { role: "gridcell" });
      }

      renderedCells.push(renderedCell);
    }
  }

  return renderedCells;
}

// Props that Grid reads from rendered cells (React 19's types default element props to unknown)
type CellElementProps = {
  children?: unknown;
  role?: string;
  style?: CSSProperties;
};

function warnAboutMissingStyle(
  parent: CellMeasurerParent & { __warnedAboutMissingStyle?: boolean },
  renderedCell: ReactElement<CellElementProps>
) {
  if (process.env.NODE_ENV !== "production") {
    if (renderedCell) {
      // If the direct child is a CellMeasurer, then we should check its child
      // See issue #611
      if (
        renderedCell.type &&
        (renderedCell.type as { __internalCellMeasurerFlag?: boolean })
          .__internalCellMeasurerFlag
      ) {
        renderedCell = renderedCell.props
          .children as ReactElement<CellElementProps>;
      }

      if (
        renderedCell &&
        renderedCell.props &&
        renderedCell.props.style === undefined &&
        parent.__warnedAboutMissingStyle !== true
      ) {
        parent.__warnedAboutMissingStyle = true;

        console.warn(
          "Rendered cell should include style property for positioning."
        );
      }
    }
  }
}
