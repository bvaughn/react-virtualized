'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = defaultHeaderRowRenderer;

var React = _interopRequireWildcard(require('react'));

function defaultHeaderRowRenderer(_ref) {
  var className = _ref.className,
    columns = _ref.columns,
    style = _ref.style;
  return React.createElement(
    'div',
    {
      className: className,
      role: 'row',
      style: style,
    },
    columns,
  );
}
