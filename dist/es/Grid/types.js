import * as React from 'react';
import ScalingCellSizeAndPositionManager from './utils/ScalingCellSizeAndPositionManager';

var bpfrpt_proptype_CellPosition = process.env.NODE_ENV === 'production' ? null : {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired
};
var bpfrpt_proptype_CellRendererParams = process.env.NODE_ENV === 'production' ? null : {
  columnIndex: PropTypes.number.isRequired,
  isScrolling: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  key: PropTypes.string.isRequired,
  parent: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};
var bpfrpt_proptype_CellRenderer = process.env.NODE_ENV === 'production' ? null : PropTypes.func;
var bpfrpt_proptype_CellCache = process.env.NODE_ENV === 'production' ? null : PropTypes.objectOf(PropTypes.node.isRequired);
var bpfrpt_proptype_StyleCache = process.env.NODE_ENV === 'production' ? null : PropTypes.objectOf(PropTypes.object.isRequired);
var bpfrpt_proptype_CellRangeRendererParams = process.env.NODE_ENV === 'production' ? null : {
  cellCache: PropTypes.objectOf(PropTypes.node.isRequired).isRequired,
  cellRenderer: PropTypes.func.isRequired,
  columnSizeAndPositionManager: function columnSizeAndPositionManager() {
    return (typeof ScalingCellSizeAndPositionManager === 'function' ? PropTypes.instanceOf(ScalingCellSizeAndPositionManager).isRequired : PropTypes.any.isRequired).apply(this, arguments);
  },
  columnStartIndex: PropTypes.number.isRequired,
  columnStopIndex: PropTypes.number.isRequired,
  deferredMeasurementCache: PropTypes.object,
  horizontalOffsetAdjustment: PropTypes.number.isRequired,
  isScrolling: PropTypes.bool.isRequired,
  isScrollingOptOut: PropTypes.bool.isRequired,
  parent: PropTypes.object.isRequired,
  rowSizeAndPositionManager: function rowSizeAndPositionManager() {
    return (typeof ScalingCellSizeAndPositionManager === 'function' ? PropTypes.instanceOf(ScalingCellSizeAndPositionManager).isRequired : PropTypes.any.isRequired).apply(this, arguments);
  },
  rowStartIndex: PropTypes.number.isRequired,
  rowStopIndex: PropTypes.number.isRequired,
  scrollLeft: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  styleCache: PropTypes.objectOf(PropTypes.object.isRequired).isRequired,
  verticalOffsetAdjustment: PropTypes.number.isRequired,
  visibleColumnIndices: PropTypes.object.isRequired,
  visibleRowIndices: PropTypes.object.isRequired
};
var bpfrpt_proptype_CellRangeRenderer = process.env.NODE_ENV === 'production' ? null : PropTypes.func;
var bpfrpt_proptype_CellSizeGetter = process.env.NODE_ENV === 'production' ? null : PropTypes.func;
var bpfrpt_proptype_CellSize = process.env.NODE_ENV === 'production' ? null : PropTypes.oneOfType([PropTypes.func, PropTypes.number]);
var bpfrpt_proptype_NoContentRenderer = process.env.NODE_ENV === 'production' ? null : PropTypes.func;
var bpfrpt_proptype_Scroll = process.env.NODE_ENV === 'production' ? null : {
  clientHeight: PropTypes.number.isRequired,
  clientWidth: PropTypes.number.isRequired,
  scrollHeight: PropTypes.number.isRequired,
  scrollLeft: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  scrollWidth: PropTypes.number.isRequired
};
var bpfrpt_proptype_ScrollbarPresenceChange = process.env.NODE_ENV === 'production' ? null : {
  horizontal: PropTypes.bool.isRequired,
  vertical: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired
};
var bpfrpt_proptype_RenderedSection = process.env.NODE_ENV === 'production' ? null : {
  columnOverscanStartIndex: PropTypes.number.isRequired,
  columnOverscanStopIndex: PropTypes.number.isRequired,
  columnStartIndex: PropTypes.number.isRequired,
  columnStopIndex: PropTypes.number.isRequired,
  rowOverscanStartIndex: PropTypes.number.isRequired,
  rowOverscanStopIndex: PropTypes.number.isRequired,
  rowStartIndex: PropTypes.number.isRequired,
  rowStopIndex: PropTypes.number.isRequired
};
var bpfrpt_proptype_OverscanIndicesGetterParams = process.env.NODE_ENV === 'production' ? null : {
  // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
  direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,


  // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
  scrollDirection: PropTypes.oneOf([-1, 1]).isRequired,


  // Number of rows or columns in the current axis
  cellCount: PropTypes.number.isRequired,


  // Maximum number of cells to over-render in either direction
  overscanCellsCount: PropTypes.number.isRequired,


  // Begin of range of visible cells
  startIndex: PropTypes.number.isRequired,


  // End of range of visible cells
  stopIndex: PropTypes.number.isRequired
};
var bpfrpt_proptype_OverscanIndices = process.env.NODE_ENV === 'production' ? null : {
  overscanStartIndex: PropTypes.number.isRequired,
  overscanStopIndex: PropTypes.number.isRequired
};
var bpfrpt_proptype_OverscanIndicesGetter = process.env.NODE_ENV === 'production' ? null : PropTypes.func;
var bpfrpt_proptype_Alignment = process.env.NODE_ENV === 'production' ? null : PropTypes.oneOf(['auto', 'end', 'start', 'center']);
var bpfrpt_proptype_VisibleCellRange = process.env.NODE_ENV === 'production' ? null : {
  start: PropTypes.number,
  stop: PropTypes.number
};
import PropTypes from 'prop-types';
export { bpfrpt_proptype_CellPosition };
export { bpfrpt_proptype_CellRendererParams };
export { bpfrpt_proptype_CellRenderer };
export { bpfrpt_proptype_CellCache };
export { bpfrpt_proptype_StyleCache };
export { bpfrpt_proptype_CellRangeRendererParams };
export { bpfrpt_proptype_CellRangeRenderer };
export { bpfrpt_proptype_CellSizeGetter };
export { bpfrpt_proptype_CellSize };
export { bpfrpt_proptype_NoContentRenderer };
export { bpfrpt_proptype_Scroll };
export { bpfrpt_proptype_ScrollbarPresenceChange };
export { bpfrpt_proptype_RenderedSection };
export { bpfrpt_proptype_OverscanIndicesGetterParams };
export { bpfrpt_proptype_OverscanIndices };
export { bpfrpt_proptype_OverscanIndicesGetter };
export { bpfrpt_proptype_Alignment };
export { bpfrpt_proptype_VisibleCellRange };