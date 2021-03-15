'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = defaultHeaderRowRenderer;

var React = _interopRequireWildcard(require('react'));

var _types = require('./types');

var _propTypes = _interopRequireDefault(require('prop-types'));

function defaultHeaderRowRenderer(_ref) {
  var className = _ref.className,
    columns = _ref.columns,
    style = _ref.style;
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: className,
      role: 'row',
      style: style,
    },
    columns,
  );
}

defaultHeaderRowRenderer.propTypes =
  process.env.NODE_ENV === 'production'
    ? null
    : _types.bpfrpt_proptype_HeaderRowRendererParams ===
      _propTypes['default'].any
    ? {}
    : _types.bpfrpt_proptype_HeaderRowRendererParams;
