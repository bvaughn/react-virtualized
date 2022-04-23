'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_AnimationTimeoutId = exports.requestAnimationTimeout = exports.cancelAnimationTimeout = void 0;

var _animationFrame = require('./animationFrame');

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_AnimationTimeoutId =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        id: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_AnimationTimeoutId = bpfrpt_proptype_AnimationTimeoutId;

var cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return (0, _animationFrame.caf)(frame.id);
};
/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */

exports.cancelAnimationTimeout = cancelAnimationTimeout;

var requestAnimationTimeout = function requestAnimationTimeout(
  callback,
  delay,
) {
  var start; // wait for end of processing current event handler, because event handler may be long

  Promise.resolve().then(function() {
    start = Date.now();
  });

  var timeout = function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = (0, _animationFrame.raf)(timeout);
    }
  };

  var frame = {
    id: (0, _animationFrame.raf)(timeout),
  };
  return frame;
};

exports.requestAnimationTimeout = requestAnimationTimeout;
