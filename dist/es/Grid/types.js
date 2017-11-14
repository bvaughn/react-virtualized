import React from 'react';
import ScalingCellSizeAndPositionManager from './utils/ScalingCellSizeAndPositionManager';

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellPosition', {
  value: {
    columnIndex: require('prop-types').number.isRequired,
    rowIndex: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellRendererParams', {
  value: {
    columnIndex: require('prop-types').number.isRequired,
    isScrolling: require('prop-types').bool.isRequired,
    isVisible: require('prop-types').bool.isRequired,
    key: require('prop-types').string.isRequired,
    parent: require('prop-types').object.isRequired,
    rowIndex: require('prop-types').number.isRequired,
    style: require('prop-types').object.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellRenderer', {
  value: require('prop-types').func,
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellRangeRendererParams', {
  value: {
    cellCache: require('prop-types').object.isRequired,
    cellRenderer: require('prop-types').func.isRequired,
    columnSizeAndPositionManager: typeof ScalingCellSizeAndPositionManager === 'function' ? require('prop-types').instanceOf(ScalingCellSizeAndPositionManager).isRequired : require('prop-types').any.isRequired,
    columnStartIndex: require('prop-types').number.isRequired,
    columnStopIndex: require('prop-types').number.isRequired,
    deferredMeasurementCache: require('prop-types').object,
    horizontalOffsetAdjustment: require('prop-types').number.isRequired,
    isScrolling: require('prop-types').bool.isRequired,
    parent: require('prop-types').object.isRequired,
    rowSizeAndPositionManager: typeof ScalingCellSizeAndPositionManager === 'function' ? require('prop-types').instanceOf(ScalingCellSizeAndPositionManager).isRequired : require('prop-types').any.isRequired,
    rowStartIndex: require('prop-types').number.isRequired,
    rowStopIndex: require('prop-types').number.isRequired,
    scrollLeft: require('prop-types').number.isRequired,
    scrollTop: require('prop-types').number.isRequired,
    styleCache: require('prop-types').object.isRequired,
    verticalOffsetAdjustment: require('prop-types').number.isRequired,
    visibleColumnIndices: require('prop-types').object.isRequired,
    visibleRowIndices: require('prop-types').object.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellRangeRenderer', {
  value: require('prop-types').func,
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellSizeGetter', {
  value: require('prop-types').func,
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellSize', {
  value: require('prop-types').oneOfType([require('prop-types').func, require('prop-types').number]),
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_NoContentRenderer', {
  value: require('prop-types').func,
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Scroll', {
  value: {
    clientHeight: require('prop-types').number.isRequired,
    clientWidth: require('prop-types').number.isRequired,
    scrollHeight: require('prop-types').number.isRequired,
    scrollLeft: require('prop-types').number.isRequired,
    scrollTop: require('prop-types').number.isRequired,
    scrollWidth: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ScrollbarPresenceChange', {
  value: {
    horizontal: require('prop-types').bool.isRequired,
    vertical: require('prop-types').bool.isRequired,
    size: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RenderedSection', {
  value: {
    columnOverscanStartIndex: require('prop-types').number.isRequired,
    columnOverscanStopIndex: require('prop-types').number.isRequired,
    columnStartIndex: require('prop-types').number.isRequired,
    columnStopIndex: require('prop-types').number.isRequired,
    rowOverscanStartIndex: require('prop-types').number.isRequired,
    rowOverscanStopIndex: require('prop-types').number.isRequired,
    rowStartIndex: require('prop-types').number.isRequired,
    rowStopIndex: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams', {
  value: {
    direction: require('prop-types').oneOf(['horizontal', 'vertical']).isRequired,
    scrollDirection: require('prop-types').oneOf([-1, 1]).isRequired,
    cellCount: require('prop-types').number.isRequired,
    overscanCellsCount: require('prop-types').number.isRequired,
    startIndex: require('prop-types').number.isRequired,
    stopIndex: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_OverscanIndices', {
  value: {
    overscanStartIndex: require('prop-types').number.isRequired,
    overscanStopIndex: require('prop-types').number.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter', {
  value: require('prop-types').func,
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Alignment', {
  value: require('prop-types').oneOf(['auto', 'end', 'start', 'center']),
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_VisibleCellRange', {
  value: {
    start: require('prop-types').number,
    stop: require('prop-types').number
  },
  configurable: true
});