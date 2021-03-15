'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_ScrollIndices = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_ScrollIndices =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        scrollToColumn: _propTypes['default'].number.isRequired,
        scrollToRow: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_ScrollIndices = bpfrpt_proptype_ScrollIndices;
