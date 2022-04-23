'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_Scroll = exports.bpfrpt_proptype_RenderedRows = exports.bpfrpt_proptype_RowRenderer = exports.bpfrpt_proptype_RowRendererParams = void 0;

var React = _interopRequireWildcard(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_RowRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        index: _propTypes['default'].number.isRequired,
        isScrolling: _propTypes['default'].bool.isRequired,
        isVisible: _propTypes['default'].bool.isRequired,
        key: _propTypes['default'].string.isRequired,
        parent: _propTypes['default'].object.isRequired,
        style: _propTypes['default'].object.isRequired,
      };
exports.bpfrpt_proptype_RowRendererParams = bpfrpt_proptype_RowRendererParams;
var bpfrpt_proptype_RowRenderer =
  process.env.NODE_ENV === 'production' ? null : _propTypes['default'].func;
exports.bpfrpt_proptype_RowRenderer = bpfrpt_proptype_RowRenderer;
var bpfrpt_proptype_RenderedRows =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        overscanStartIndex: _propTypes['default'].number.isRequired,
        overscanStopIndex: _propTypes['default'].number.isRequired,
        startIndex: _propTypes['default'].number.isRequired,
        stopIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_RenderedRows = bpfrpt_proptype_RenderedRows;
var bpfrpt_proptype_Scroll =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        clientHeight: _propTypes['default'].number.isRequired,
        scrollHeight: _propTypes['default'].number.isRequired,
        scrollTop: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_Scroll = bpfrpt_proptype_Scroll;
