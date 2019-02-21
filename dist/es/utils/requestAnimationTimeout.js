import _Promise from 'babel-runtime/core-js/promise';
import { caf, raf } from './animationFrame';

var bpfrpt_proptype_AnimationTimeoutId = process.env.NODE_ENV === 'production' ? null : {
  id: PropTypes.number.isRequired
};


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
  var start = void 0;
  // wait for end of processing current event handler, because event handler may be long
  _Promise.resolve().then(function () {
    start = Date.now();
  });

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
import PropTypes from 'prop-types';
export { bpfrpt_proptype_AnimationTimeoutId };