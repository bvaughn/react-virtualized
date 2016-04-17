"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOverscanIndices;
/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 * @param cellCount Number of rows or columns in the current axis
 * @param overscanCellsCount Maximum number of cells to over-render in either direction
 * @param startIndex Begin of range of visible cells
 * @param stopIndex End of range of visible cells
 */
function getOverscanIndices(_ref) {
  var cellCount = _ref.cellCount;
  var overscanCellsCount = _ref.overscanCellsCount;
  var startIndex = _ref.startIndex;
  var stopIndex = _ref.stopIndex;

  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
  };
}