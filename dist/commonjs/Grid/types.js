'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_VisibleCellRange = exports.bpfrpt_proptype_Alignment = exports.bpfrpt_proptype_OverscanIndicesGetter = exports.bpfrpt_proptype_OverscanIndices = exports.bpfrpt_proptype_OverscanIndicesGetterParams = exports.bpfrpt_proptype_RenderedSection = exports.bpfrpt_proptype_ScrollbarPresenceChange = exports.bpfrpt_proptype_Scroll = exports.bpfrpt_proptype_NoContentRenderer = exports.bpfrpt_proptype_CellSize = exports.bpfrpt_proptype_CellSizeGetter = exports.bpfrpt_proptype_CellRangeRenderer = exports.bpfrpt_proptype_CellRangeRendererParams = exports.bpfrpt_proptype_StyleCache = exports.bpfrpt_proptype_CellCache = exports.bpfrpt_proptype_CellRenderer = exports.bpfrpt_proptype_CellRendererParams = exports.bpfrpt_proptype_CellPosition = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _ScalingCellSizeAndPositionManager = require('./utils/ScalingCellSizeAndPositionManager');

var _ScalingCellSizeAndPositionManager2 = _interopRequireDefault(_ScalingCellSizeAndPositionManager);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var bpfrpt_proptype_CellPosition = process.env.NODE_ENV === 'production' ? null : {
  columnIndex: _propTypes2.default.number.isRequired,
  rowIndex: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_CellRendererParams = process.env.NODE_ENV === 'production' ? null : {
  columnIndex: _propTypes2.default.number.isRequired,
  isScrolling: _propTypes2.default.bool.isRequired,
  isVisible: _propTypes2.default.bool.isRequired,
  key: _propTypes2.default.string.isRequired,
  parent: _propTypes2.default.object.isRequired,
  rowIndex: _propTypes2.default.number.isRequired,
  style: _propTypes2.default.object.isRequired
};
var bpfrpt_proptype_CellRenderer = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.func;
var bpfrpt_proptype_CellCache = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.objectOf(_propTypes2.default.node.isRequired);
var bpfrpt_proptype_StyleCache = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.objectOf(_propTypes2.default.object.isRequired);
var bpfrpt_proptype_CellRangeRendererParams = process.env.NODE_ENV === 'production' ? null : {
  cellCache: _propTypes2.default.objectOf(_propTypes2.default.node.isRequired).isRequired,
  cellRenderer: _propTypes2.default.func.isRequired,
  columnSizeAndPositionManager: function columnSizeAndPositionManager() {
    return (typeof _ScalingCellSizeAndPositionManager2.default === 'function' ? _propTypes2.default.instanceOf(_ScalingCellSizeAndPositionManager2.default).isRequired : _propTypes2.default.any.isRequired).apply(this, arguments);
  },
  columnStartIndex: _propTypes2.default.number.isRequired,
  columnStopIndex: _propTypes2.default.number.isRequired,
  deferredMeasurementCache: _propTypes2.default.object,
  horizontalOffsetAdjustment: _propTypes2.default.number.isRequired,
  isScrolling: _propTypes2.default.bool.isRequired,
  isScrollingOptOut: _propTypes2.default.bool.isRequired,
  parent: _propTypes2.default.object.isRequired,
  rowSizeAndPositionManager: function rowSizeAndPositionManager() {
    return (typeof _ScalingCellSizeAndPositionManager2.default === 'function' ? _propTypes2.default.instanceOf(_ScalingCellSizeAndPositionManager2.default).isRequired : _propTypes2.default.any.isRequired).apply(this, arguments);
  },
  rowStartIndex: _propTypes2.default.number.isRequired,
  rowStopIndex: _propTypes2.default.number.isRequired,
  scrollLeft: _propTypes2.default.number.isRequired,
  scrollTop: _propTypes2.default.number.isRequired,
  styleCache: _propTypes2.default.objectOf(_propTypes2.default.object.isRequired).isRequired,
  verticalOffsetAdjustment: _propTypes2.default.number.isRequired,
  visibleColumnIndices: _propTypes2.default.object.isRequired,
  visibleRowIndices: _propTypes2.default.object.isRequired
};
var bpfrpt_proptype_CellRangeRenderer = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.func;
var bpfrpt_proptype_CellSizeGetter = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.func;
var bpfrpt_proptype_CellSize = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.number]);
var bpfrpt_proptype_NoContentRenderer = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.func;
var bpfrpt_proptype_Scroll = process.env.NODE_ENV === 'production' ? null : {
  clientHeight: _propTypes2.default.number.isRequired,
  clientWidth: _propTypes2.default.number.isRequired,
  scrollHeight: _propTypes2.default.number.isRequired,
  scrollLeft: _propTypes2.default.number.isRequired,
  scrollTop: _propTypes2.default.number.isRequired,
  scrollWidth: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_ScrollbarPresenceChange = process.env.NODE_ENV === 'production' ? null : {
  horizontal: _propTypes2.default.bool.isRequired,
  vertical: _propTypes2.default.bool.isRequired,
  size: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_RenderedSection = process.env.NODE_ENV === 'production' ? null : {
  columnOverscanStartIndex: _propTypes2.default.number.isRequired,
  columnOverscanStopIndex: _propTypes2.default.number.isRequired,
  columnStartIndex: _propTypes2.default.number.isRequired,
  columnStopIndex: _propTypes2.default.number.isRequired,
  rowOverscanStartIndex: _propTypes2.default.number.isRequired,
  rowOverscanStopIndex: _propTypes2.default.number.isRequired,
  rowStartIndex: _propTypes2.default.number.isRequired,
  rowStopIndex: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_OverscanIndicesGetterParams = process.env.NODE_ENV === 'production' ? null : {
  // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
  direction: _propTypes2.default.oneOf(['horizontal', 'vertical']).isRequired,


  // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
  scrollDirection: _propTypes2.default.oneOf([-1, 1]).isRequired,


  // Number of rows or columns in the current axis
  cellCount: _propTypes2.default.number.isRequired,


  // Maximum number of cells to over-render in either direction
  overscanCellsCount: _propTypes2.default.number.isRequired,


  // Begin of range of visible cells
  startIndex: _propTypes2.default.number.isRequired,


  // End of range of visible cells
  stopIndex: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_OverscanIndices = process.env.NODE_ENV === 'production' ? null : {
  overscanStartIndex: _propTypes2.default.number.isRequired,
  overscanStopIndex: _propTypes2.default.number.isRequired
};
var bpfrpt_proptype_OverscanIndicesGetter = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.func;
var bpfrpt_proptype_Alignment = process.env.NODE_ENV === 'production' ? null : _propTypes2.default.oneOf(['auto', 'end', 'start', 'center']);
var bpfrpt_proptype_VisibleCellRange = process.env.NODE_ENV === 'production' ? null : {
  start: _propTypes2.default.number,
  stop: _propTypes2.default.number
};
exports.bpfrpt_proptype_CellPosition = bpfrpt_proptype_CellPosition;
exports.bpfrpt_proptype_CellRendererParams = bpfrpt_proptype_CellRendererParams;
exports.bpfrpt_proptype_CellRenderer = bpfrpt_proptype_CellRenderer;
exports.bpfrpt_proptype_CellCache = bpfrpt_proptype_CellCache;
exports.bpfrpt_proptype_StyleCache = bpfrpt_proptype_StyleCache;
exports.bpfrpt_proptype_CellRangeRendererParams = bpfrpt_proptype_CellRangeRendererParams;
exports.bpfrpt_proptype_CellRangeRenderer = bpfrpt_proptype_CellRangeRenderer;
exports.bpfrpt_proptype_CellSizeGetter = bpfrpt_proptype_CellSizeGetter;
exports.bpfrpt_proptype_CellSize = bpfrpt_proptype_CellSize;
exports.bpfrpt_proptype_NoContentRenderer = bpfrpt_proptype_NoContentRenderer;
exports.bpfrpt_proptype_Scroll = bpfrpt_proptype_Scroll;
exports.bpfrpt_proptype_ScrollbarPresenceChange = bpfrpt_proptype_ScrollbarPresenceChange;
exports.bpfrpt_proptype_RenderedSection = bpfrpt_proptype_RenderedSection;
exports.bpfrpt_proptype_OverscanIndicesGetterParams = bpfrpt_proptype_OverscanIndicesGetterParams;
exports.bpfrpt_proptype_OverscanIndices = bpfrpt_proptype_OverscanIndices;
exports.bpfrpt_proptype_OverscanIndicesGetter = bpfrpt_proptype_OverscanIndicesGetter;
exports.bpfrpt_proptype_Alignment = bpfrpt_proptype_Alignment;
exports.bpfrpt_proptype_VisibleCellRange = bpfrpt_proptype_VisibleCellRange;