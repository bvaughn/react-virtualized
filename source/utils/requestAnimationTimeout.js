/** @flow */

import {caf, raf, win} from './animationFrame';

export type AnimationTimeoutId = {
  id: number,
};

export const cancelAnimationTimeout = (frame: AnimationTimeoutId) =>
  caf.call(win, frame.id);

/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
export const requestAnimationTimeout = (
  callback: Function,
  delay: number,
): AnimationTimeoutId => {
  const start = Date.now();

  const timeout = () => {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf.call(win, timeout);
    }
  };

  const frame: AnimationTimeoutId = {
    id: raf.call(win, timeout),
  };

  return frame;
};
