import ScalingCellSizeAndPositionManager from './utils/ScalingCellSizeAndPositionManager';
import type {CellCache, CellRenderer, StyleCache} from './types';

export type CellRangeRendererParams = {
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
};

export type CellRangeRenderer = (
  params: CellRangeRendererParams,
) => React.Element<*>[];
