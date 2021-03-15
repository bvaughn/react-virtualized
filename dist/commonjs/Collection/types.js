'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_SizeInfo = exports.bpfrpt_proptype_SizeAndPositionInfo = exports.bpfrpt_proptype_ScrollPosition = exports.bpfrpt_proptype_PositionInfo = exports.bpfrpt_proptype_Index = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_Index =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        index: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_Index = bpfrpt_proptype_Index;
var bpfrpt_proptype_PositionInfo =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        x: _propTypes['default'].number.isRequired,
        y: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_PositionInfo = bpfrpt_proptype_PositionInfo;
var bpfrpt_proptype_ScrollPosition =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        scrollLeft: _propTypes['default'].number.isRequired,
        scrollTop: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_ScrollPosition = bpfrpt_proptype_ScrollPosition;
var bpfrpt_proptype_SizeAndPositionInfo =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        height: _propTypes['default'].number.isRequired,
        width: _propTypes['default'].number.isRequired,
        x: _propTypes['default'].number.isRequired,
        y: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_SizeAndPositionInfo = bpfrpt_proptype_SizeAndPositionInfo;
var bpfrpt_proptype_SizeInfo =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        height: _propTypes['default'].number.isRequired,
        width: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_SizeInfo = bpfrpt_proptype_SizeInfo;
