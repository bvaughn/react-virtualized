'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_VisibleCellRange = exports.bpfrpt_proptype_Alignment = exports.bpfrpt_proptype_OverscanIndicesGetter = exports.bpfrpt_proptype_OverscanIndices = exports.bpfrpt_proptype_OverscanIndicesGetterParams = exports.bpfrpt_proptype_RenderedSection = exports.bpfrpt_proptype_ScrollbarPresenceChange = exports.bpfrpt_proptype_Scroll = exports.bpfrpt_proptype_NoContentRenderer = exports.bpfrpt_proptype_CellSize = exports.bpfrpt_proptype_CellSizeGetter = exports.bpfrpt_proptype_CellRangeRenderer = exports.bpfrpt_proptype_CellRangeRendererParams = exports.bpfrpt_proptype_StyleCache = exports.bpfrpt_proptype_CellCache = exports.bpfrpt_proptype_CellRenderer = exports.bpfrpt_proptype_CellRendererParams = exports.bpfrpt_proptype_CellPosition = void 0;

var React = _interopRequireWildcard(require('react'));

var _ScalingCellSizeAndPositionManager = _interopRequireDefault(
  require('./utils/ScalingCellSizeAndPositionManager'),
);

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_CellPosition =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        columnIndex: _propTypes['default'].number.isRequired,
        rowIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_CellPosition = bpfrpt_proptype_CellPosition;
var bpfrpt_proptype_CellRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        columnIndex: _propTypes['default'].number.isRequired,
        isScrolling: _propTypes['default'].bool.isRequired,
        isVisible: _propTypes['default'].bool.isRequired,
        key: _propTypes['default'].string.isRequired,
        parent: _propTypes['default'].object.isRequired,
        rowIndex: _propTypes['default'].number.isRequired,
        style: _propTypes['default'].object.isRequired,
      };
exports.bpfrpt_proptype_CellRendererParams = bpfrpt_proptype_CellRendererParams;
var bpfrpt_proptype_CellRenderer =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_CellRenderer = bpfrpt_proptype_CellRenderer;
var bpfrpt_proptype_CellCache =
  process.env.NODE_ENV === 'production'
    ? null
    : _propTypes['default'].objectOf(_propTypes['default'].node.isRequired);
exports.bpfrpt_proptype_CellCache = bpfrpt_proptype_CellCache;
var bpfrpt_proptype_StyleCache =
  process.env.NODE_ENV === 'production'
    ? null
    : _propTypes['default'].objectOf(_propTypes['default'].object.isRequired);
exports.bpfrpt_proptype_StyleCache = bpfrpt_proptype_StyleCache;
var bpfrpt_proptype_CellRangeRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        cellCache: _propTypes['default'].objectOf(
          _propTypes['default'].node.isRequired,
        ).isRequired,
        cellRenderer: _propTypes['default'].func.isRequired,
        columnSizeAndPositionManager: function columnSizeAndPositionManager() {
          return (typeof _ScalingCellSizeAndPositionManager['default'] ===
          'function'
            ? _propTypes['default'].instanceOf(
                _ScalingCellSizeAndPositionManager['default'],
              ).isRequired
            : _propTypes['default'].any.isRequired
          ).apply(this, arguments);
        },
        columnStartIndex: _propTypes['default'].number.isRequired,
        columnStopIndex: _propTypes['default'].number.isRequired,
        deferredMeasurementCache: _propTypes['default'].object,
        horizontalOffsetAdjustment: _propTypes['default'].number.isRequired,
        isScrolling: _propTypes['default'].bool.isRequired,
        isScrollingOptOut: _propTypes['default'].bool.isRequired,
        parent: _propTypes['default'].object.isRequired,
        rowSizeAndPositionManager: function rowSizeAndPositionManager() {
          return (typeof _ScalingCellSizeAndPositionManager['default'] ===
          'function'
            ? _propTypes['default'].instanceOf(
                _ScalingCellSizeAndPositionManager['default'],
              ).isRequired
            : _propTypes['default'].any.isRequired
          ).apply(this, arguments);
        },
        rowStartIndex: _propTypes['default'].number.isRequired,
        rowStopIndex: _propTypes['default'].number.isRequired,
        scrollLeft: _propTypes['default'].number.isRequired,
        scrollTop: _propTypes['default'].number.isRequired,
        styleCache: _propTypes['default'].objectOf(
          _propTypes['default'].object.isRequired,
        ).isRequired,
        verticalOffsetAdjustment: _propTypes['default'].number.isRequired,
        visibleColumnIndices: _propTypes['default'].object.isRequired,
        visibleRowIndices: _propTypes['default'].object.isRequired,
      };
exports.bpfrpt_proptype_CellRangeRendererParams = bpfrpt_proptype_CellRangeRendererParams;
var bpfrpt_proptype_CellRangeRenderer =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_CellRangeRenderer = bpfrpt_proptype_CellRangeRenderer;
var bpfrpt_proptype_CellSizeGetter =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_CellSizeGetter = bpfrpt_proptype_CellSizeGetter;
var bpfrpt_proptype_CellSize =
  process.env.NODE_ENV === 'production'
    ? null
    : _propTypes['default'].oneOfType([
        _propTypes['default'].func,
        _propTypes['default'].number,
      ]);
exports.bpfrpt_proptype_CellSize = bpfrpt_proptype_CellSize;
var bpfrpt_proptype_NoContentRenderer =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_NoContentRenderer = bpfrpt_proptype_NoContentRenderer;
var bpfrpt_proptype_Scroll =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        clientHeight: _propTypes['default'].number.isRequired,
        clientWidth: _propTypes['default'].number.isRequired,
        scrollHeight: _propTypes['default'].number.isRequired,
        scrollLeft: _propTypes['default'].number.isRequired,
        scrollTop: _propTypes['default'].number.isRequired,
        scrollWidth: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_Scroll = bpfrpt_proptype_Scroll;
var bpfrpt_proptype_ScrollbarPresenceChange =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        horizontal: _propTypes['default'].bool.isRequired,
        vertical: _propTypes['default'].bool.isRequired,
        size: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_ScrollbarPresenceChange = bpfrpt_proptype_ScrollbarPresenceChange;
var bpfrpt_proptype_RenderedSection =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        columnOverscanStartIndex: _propTypes['default'].number.isRequired,
        columnOverscanStopIndex: _propTypes['default'].number.isRequired,
        columnStartIndex: _propTypes['default'].number.isRequired,
        columnStopIndex: _propTypes['default'].number.isRequired,
        rowOverscanStartIndex: _propTypes['default'].number.isRequired,
        rowOverscanStopIndex: _propTypes['default'].number.isRequired,
        rowStartIndex: _propTypes['default'].number.isRequired,
        rowStopIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_RenderedSection = bpfrpt_proptype_RenderedSection;
var bpfrpt_proptype_OverscanIndicesGetterParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        // One of SCROLL_DIRECTION_HORIZONTAL or SCROLL_DIRECTION_VERTICAL
        direction: _propTypes['default'].oneOf(['horizontal', 'vertical'])
          .isRequired,
        // One of SCROLL_DIRECTION_BACKWARD or SCROLL_DIRECTION_FORWARD
        scrollDirection: _propTypes['default'].oneOf([-1, 1]).isRequired,
        // Number of rows or columns in the current axis
        cellCount: _propTypes['default'].number.isRequired,
        // Maximum number of cells to over-render in either direction
        overscanCellsCount: _propTypes['default'].number.isRequired,
        // Begin of range of visible cells
        startIndex: _propTypes['default'].number.isRequired,
        // End of range of visible cells
        stopIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_OverscanIndicesGetterParams = bpfrpt_proptype_OverscanIndicesGetterParams;
var bpfrpt_proptype_OverscanIndices =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        overscanStartIndex: _propTypes['default'].number.isRequired,
        overscanStopIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_OverscanIndices = bpfrpt_proptype_OverscanIndices;
var bpfrpt_proptype_OverscanIndicesGetter =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_OverscanIndicesGetter = bpfrpt_proptype_OverscanIndicesGetter;
var bpfrpt_proptype_Alignment =
  process.env.NODE_ENV === 'production'
    ? null
    : _propTypes['default'].oneOf(['auto', 'end', 'start', 'center']);
exports.bpfrpt_proptype_Alignment = bpfrpt_proptype_Alignment;
var bpfrpt_proptype_VisibleCellRange =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        start: _propTypes['default'].number,
        stop: _propTypes['default'].number,
      };
exports.bpfrpt_proptype_VisibleCellRange = bpfrpt_proptype_VisibleCellRange;
