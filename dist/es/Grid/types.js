import * as React from 'react';
import ScalingCellSizeAndPositionManager from './utils/ScalingCellSizeAndPositionManager';
/*:: export type CellPosition = {columnIndex: number, rowIndex: number};*/

/*:: export type CellRendererParams = {
  columnIndex: number,
  isScrolling: boolean,
  isVisible: boolean,
  key: string,
  parent: Object,
  rowIndex: number,
  style: Object,
};*/

/*:: export type CellRenderer = (props: CellRendererParams) => React.Element<*>;*/

/*:: export type CellCache = {[key: string]: React.Element<*>};*/

/*:: export type StyleCache = {[key: string]: Object};*/

/*:: export type CellRangeRendererParams = {
  cellCache: CellCache,
  cellRenderer: CellRenderer,
  columnSizeAndPositionManager: ScalingCellSizeAndPositionManager,
  columnStartIndex: number,
  columnStopIndex: number,
  deferredMeasurementCache?: Object,
  horizontalOffsetAdjustment: number,
  isScrolling: boolean,
  isScrollingOptOut: boolean,
  parent: Object,
  rowSizeAndPositionManager: ScalingCellSizeAndPositionManager,
  rowStartIndex: number,
  rowStopIndex: number,
  scrollLeft: number,
  scrollTop: number,
  styleCache: StyleCache,
  verticalOffsetAdjustment: number,
  visibleColumnIndices: Object,
  visibleRowIndices: Object,
};*/

/*:: export type CellRangeRenderer = (
  params: CellRangeRendererParams,
) => React.Element<*>[];*/

/*:: export type CellSizeGetter = (params: {index: number}) => number;*/

/*:: export type CellSize = CellSizeGetter | number;*/

/*:: export type NoContentRenderer = () => React.Element<*> | null;*/

/*:: export type Scroll = {
  clientHeight: number,
  clientWidth: number,
  scrollHeight: number,
  scrollLeft: number,
  scrollTop: number,
  scrollWidth: number,
};*/

/*:: export type ScrollbarPresenceChange = {
  horizontal: boolean,
  vertical: boolean,
  size: number,
};*/

/*:: export type RenderedSection = {
  columnOverscanStartIndex: number,
  columnOverscanStopIndex: number,
  columnStartIndex: number,
  columnStopIndex: number,
  rowOverscanStartIndex: number,
  rowOverscanStopIndex: number,
  rowStartIndex: number,
  rowStopIndex: number,
};*/

/*:: export type OverscanIndicesGetterParams = {
  // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
  direction: 'horizontal' | 'vertical',

  // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
  scrollDirection: -1 | 1,

  // Number of rows or columns in the current axis
  cellCount: number,

  // Maximum number of cells to over-render in either direction
  overscanCellsCount: number,

  // Begin of range of visible cells
  startIndex: number,

  // End of range of visible cells
  stopIndex: number,
};*/

/*:: export type OverscanIndices = {
  overscanStartIndex: number,
  overscanStopIndex: number,
};*/

/*:: export type OverscanIndicesGetter = (
  params: OverscanIndicesGetterParams,
) => OverscanIndices;*/

/*:: export type Alignment = 'auto' | 'end' | 'start' | 'center';*/

/*:: export type VisibleCellRange = {
  start?: number,
  stop?: number,
};*/