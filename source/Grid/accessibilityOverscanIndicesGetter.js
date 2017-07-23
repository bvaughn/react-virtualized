// @flow

import type { OverscanIndices } from "../types";

export const SCROLL_DIRECTION_BACKWARD = -1;
export const SCROLL_DIRECTION_FORWARD = 1;

export const SCROLL_DIRECTION_HORIZONTAL = "horizontal";
export const SCROLL_DIRECTION_VERTICAL = "vertical";

/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 */

type Params = {
  // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
  direction: "horizontal" | "vertical",

  // Number of rows or columns in the current axis
  cellCount: number,

  // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
  scrollDirection: -1 | 1,

  // Maximum number of cells to over-render in either direction
  overscanCellsCount: number,

  // Begin of range of visible cells
  startIndex: number,

  // End of range of visible cells
  stopIndex: number
};

export default function defaultOverscanIndicesGetter({
  cellCount,
  overscanCellsCount,
  scrollDirection,
  startIndex,
  stopIndex
}: Params): OverscanIndices {
  // Make sure we render at least 1 cell extra before and after (except near boundaries)
  // This is necessary in order to support keyboard navigation (TAB/SHIFT+TAB) in some cases
  // For more info see issues #625
  overscanCellsCount = Math.max(1, overscanCellsCount);

  if (scrollDirection === SCROLL_DIRECTION_FORWARD) {
    return {
      overscanStartIndex: Math.max(0, startIndex - 1),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
    };
  } else {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + 1)
    };
  }
}
