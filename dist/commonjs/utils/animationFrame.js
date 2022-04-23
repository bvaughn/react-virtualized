'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.caf = exports.raf = void 0;
// Properly handle server-side rendering.
var win;

if (typeof window !== 'undefined') {
  win = window;
} else if (typeof self !== 'undefined') {
  win = self;
} else {
  win = {};
} // requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/

var request =
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  win.oRequestAnimationFrame ||
  win.msRequestAnimationFrame ||
  function(callback) {
    return win.setTimeout(callback, 1000 / 60);
  };

var cancel =
  win.cancelAnimationFrame ||
  win.webkitCancelAnimationFrame ||
  win.mozCancelAnimationFrame ||
  win.oCancelAnimationFrame ||
  win.msCancelAnimationFrame ||
  function(id) {
    win.clearTimeout(id);
  };

var raf = request;
exports.raf = raf;
var caf = cancel;
exports.caf = caf;
