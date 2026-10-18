import { memo, useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type { ColumnSizerProps, ColumnSizerRegisteredChild } from "./types";

/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */
export const ColumnSizer = /* @__PURE__ */ memo(function ColumnSizer({
  children,
  columnMaxWidth,
  columnMinWidth,
  columnCount,
  width
}: ColumnSizerProps) {
  const registeredChildRef = useRef<ColumnSizerRegisteredChild | null>(null);

  const registerChild = useCallback(
    (child: ColumnSizerRegisteredChild | null) => {
      if (child && typeof child.recomputeGridSize !== "function") {
        throw Error(
          "Unexpected child type registered; only Grid/MultiGrid children are supported."
        );
      }

      registeredChildRef.current = child;

      if (child) {
        child.recomputeGridSize();
      }
    },
    []
  );

  // Recompute the registered child's sizes when the sizing inputs change (but not on mount;
  // registering the child already does that). Comparing against the previously committed values
  // (rather than skipping the first effect run) keeps this correct when StrictMode re-runs effects.
  const committedInputsRef = useRef<{
    columnCount: number;
    columnMaxWidth: number | undefined;
    columnMinWidth: number | undefined;
    width: number;
  } | null>(null);
  useIsomorphicLayoutEffect(() => {
    const prev = committedInputsRef.current;
    committedInputsRef.current = {
      columnCount,
      columnMaxWidth,
      columnMinWidth,
      width
    };

    if (
      prev !== null &&
      (columnMaxWidth !== prev.columnMaxWidth ||
        columnMinWidth !== prev.columnMinWidth ||
        columnCount !== prev.columnCount ||
        width !== prev.width)
    ) {
      registeredChildRef.current?.recomputeGridSize();
    }
  }, [columnCount, columnMaxWidth, columnMinWidth, width]);

  const safeColumnMinWidth = columnMinWidth || 1;

  const safeColumnMaxWidth = columnMaxWidth
    ? Math.min(columnMaxWidth, width)
    : width;

  let columnWidth = width / columnCount;
  columnWidth = Math.max(safeColumnMinWidth, columnWidth);
  columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
  columnWidth = Math.floor(columnWidth);

  const adjustedWidth = Math.min(width, columnWidth * columnCount);

  return children({
    adjustedWidth,
    columnWidth,
    getColumnWidth: () => columnWidth,
    registerChild
  });
});
