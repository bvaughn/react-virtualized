/** @flow */

type Callback = (timestamp: number) => void;
type CancelAnimationFrame = (requestId: number) => void;
type RequestAnimationFrame = (callback: Callback) => number;

// Properly handle server-side rendering.
let win;
if (typeof window !== 'undefined') {
  win = window;
} else if (typeof self !== 'undefined') {
  win = self;
} else {
  win = {};
}

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
const request = (parentWindow?: any) =>
  (parentWindow || win).requestAnimationFrame ||
  (parentWindow || win).webkitRequestAnimationFrame ||
  (parentWindow || win).mozRequestAnimationFrame ||
  (parentWindow || win).oRequestAnimationFrame ||
  (parentWindow || win).msRequestAnimationFrame ||
  function(callback: Callback): RequestAnimationFrame {
    return (parentWindow || win: any).setTimeout(callback, 1000 / 60);
  };

const cancel = (parentWindow?: any) =>
  (parentWindow || win).cancelAnimationFrame ||
  (parentWindow || win).webkitCancelAnimationFrame ||
  (parentWindow || win).mozCancelAnimationFrame ||
  (parentWindow || win).oCancelAnimationFrame ||
  (parentWindow || win).msCancelAnimationFrame ||
  function(id: number) {
    (parentWindow || win: any).clearTimeout(id);
  };

export const rafCreator: (
  parentWindow?: any,
) => RequestAnimationFrame = (request: any);
export const cafCreator: (
  parentWindow?: any,
) => CancelAnimationFrame = (cancel: any);
