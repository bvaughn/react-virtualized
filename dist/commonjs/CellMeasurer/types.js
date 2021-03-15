'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_CellMeasureCache = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_CellMeasureCache =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        hasFixedWidth: _propTypes['default'].func.isRequired,
        hasFixedHeight: _propTypes['default'].func.isRequired,
        has: _propTypes['default'].func.isRequired,
        set: _propTypes['default'].func.isRequired,
        getHeight: _propTypes['default'].func.isRequired,
        getWidth: _propTypes['default'].func.isRequired,
      };
exports.bpfrpt_proptype_CellMeasureCache = bpfrpt_proptype_CellMeasureCache;
