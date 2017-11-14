import { caf, raf } from './animationFrame';

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId', {
  value: {
    id: require('prop-types').number.isRequired
  },
  configurable: true
});


export var cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return caf(frame.id);
};

/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
export var requestAnimationTimeout = function requestAnimationTimeout(callback, delay) {
  var start = Date.now();

  var timeout = function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf(timeout);
    }
  };

  var frame = {
    id: raf(timeout)
  };

  return frame;
};