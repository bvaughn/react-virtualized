import React from 'react';
import SortIndicator from './SortIndicator';

/**
 * Default table header renderer.
 */
var babelPluginFlowReactPropTypes_proptype_HeaderRendererParams = require('./types').babelPluginFlowReactPropTypes_proptype_HeaderRendererParams || require('prop-types').any;

export default function defaultHeaderRenderer(_ref) {
  var dataKey = _ref.dataKey,
      label = _ref.label,
      sortBy = _ref.sortBy,
      sortDirection = _ref.sortDirection;

  var showSortIndicator = sortBy === dataKey;
  var children = [React.createElement(
    'span',
    {
      className: 'ReactVirtualized__Table__headerTruncatedText',
      key: 'label',
      title: label },
    label
  )];

  if (showSortIndicator) {
    children.push(React.createElement(SortIndicator, { key: 'SortIndicator', sortDirection: sortDirection }));
  }

  return children;
}
defaultHeaderRenderer.propTypes = babelPluginFlowReactPropTypes_proptype_HeaderRendererParams === require('prop-types').any ? {} : babelPluginFlowReactPropTypes_proptype_HeaderRendererParams;