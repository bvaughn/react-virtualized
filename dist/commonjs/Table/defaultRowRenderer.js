'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = defaultRowRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default row renderer for Table.
 */
var babelPluginFlowReactPropTypes_proptype_RowRendererParams = require('./types').babelPluginFlowReactPropTypes_proptype_RowRendererParams || require('prop-types').any;

function defaultRowRenderer(_ref) {
  var className = _ref.className,
      columns = _ref.columns,
      index = _ref.index,
      key = _ref.key,
      onRowClick = _ref.onRowClick,
      onRowDoubleClick = _ref.onRowDoubleClick,
      onRowMouseOut = _ref.onRowMouseOut,
      onRowMouseOver = _ref.onRowMouseOver,
      onRowRightClick = _ref.onRowRightClick,
      rowData = _ref.rowData,
      style = _ref.style;

  var a11yProps = {};

  if (onRowClick || onRowDoubleClick || onRowMouseOut || onRowMouseOver || onRowRightClick) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = function (event) {
        return onRowClick({ event: event, index: index, rowData: rowData });
      };
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = function (event) {
        return onRowDoubleClick({ event: event, index: index, rowData: rowData });
      };
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = function (event) {
        return onRowMouseOut({ event: event, index: index, rowData: rowData });
      };
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = function (event) {
        return onRowMouseOver({ event: event, index: index, rowData: rowData });
      };
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = function (event) {
        return onRowRightClick({ event: event, index: index, rowData: rowData });
      };
    }
  }

  return _react2.default.createElement(
    'div',
    _extends({}, a11yProps, {
      className: className,
      key: key,
      role: 'row',
      style: style }),
    columns
  );
}
defaultRowRenderer.propTypes = babelPluginFlowReactPropTypes_proptype_RowRendererParams === require('prop-types').any ? {} : babelPluginFlowReactPropTypes_proptype_RowRendererParams;