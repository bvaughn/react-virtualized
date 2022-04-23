'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = defaultHeaderRenderer;

var React = _interopRequireWildcard(require('react'));

var _SortIndicator = _interopRequireDefault(require('./SortIndicator'));

var _types = require('./types');

var _propTypes = _interopRequireDefault(require('prop-types'));

/**
 * Default table header renderer.
 */
function defaultHeaderRenderer(_ref) {
  var dataKey = _ref.dataKey,
    label = _ref.label,
    sortBy = _ref.sortBy,
    sortDirection = _ref.sortDirection;
  var showSortIndicator = sortBy === dataKey;
  var children = [
    /*#__PURE__*/ React.createElement(
      'span',
      {
        className: 'ReactVirtualized__Table__headerTruncatedText',
        key: 'label',
        title: typeof label === 'string' ? label : null,
      },
      label,
    ),
  ];

  if (showSortIndicator) {
    children.push(
      /*#__PURE__*/ React.createElement(_SortIndicator['default'], {
        key: 'SortIndicator',
        sortDirection: sortDirection,
      }),
    );
  }

  return children;
}

defaultHeaderRenderer.propTypes =
  process.env.NODE_ENV === 'production'
    ? null
    : _types.bpfrpt_proptype_HeaderRendererParams === _propTypes['default'].any
    ? {}
    : _types.bpfrpt_proptype_HeaderRendererParams;
