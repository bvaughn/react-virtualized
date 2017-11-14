'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultHeaderRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SortIndicator = require('./SortIndicator');

var _SortIndicator2 = _interopRequireDefault(_SortIndicator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default table header renderer.
 */
var babelPluginFlowReactPropTypes_proptype_HeaderRendererParams = require('./types').babelPluginFlowReactPropTypes_proptype_HeaderRendererParams || require('prop-types').any;

function defaultHeaderRenderer(_ref) {
  var dataKey = _ref.dataKey,
      label = _ref.label,
      sortBy = _ref.sortBy,
      sortDirection = _ref.sortDirection;

  var showSortIndicator = sortBy === dataKey;
  var children = [_react2.default.createElement(
    'span',
    {
      className: 'ReactVirtualized__Table__headerTruncatedText',
      key: 'label',
      title: label },
    label
  )];

  if (showSortIndicator) {
    children.push(_react2.default.createElement(_SortIndicator2.default, { key: 'SortIndicator', sortDirection: sortDirection }));
  }

  return children;
}
defaultHeaderRenderer.propTypes = babelPluginFlowReactPropTypes_proptype_HeaderRendererParams === require('prop-types').any ? {} : babelPluginFlowReactPropTypes_proptype_HeaderRendererParams;