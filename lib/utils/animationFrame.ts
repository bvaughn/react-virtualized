type Callback = (timestamp: number) => void;
type CancelAnimationFrame = (requestId: number) => void;
type RequestAnimationFrame = (callback: Callback) => number;

type AnimationFrameHost = {
  requestAnimationFrame?: RequestAnimationFrame;
  webkitRequestAnimationFrame?: RequestAnimationFrame;
  mozRequestAnimationFrame?: RequestAnimationFrame;
  oRequestAnimationFrame?: RequestAnimationFrame;
  msRequestAnimationFrame?: RequestAnimationFrame;
  cancelAnimationFrame?: CancelAnimationFrame;
  webkitCancelAnimationFrame?: CancelAnimationFrame;
  mozCancelAnimationFrame?: CancelAnimationFrame;
  oCancelAnimationFrame?: CancelAnimationFrame;
  msCancelAnimationFrame?: CancelAnimationFrame;
  setTimeout: (callback: Callback, delay: number) => number;
  clearTimeout: (id: number) => void;
};

// Properly handle server-side rendering.
let win: AnimationFrameHost;
if (typeof window !== "undefined") {
  win = window as unknown as AnimationFrameHost;
} else if (typeof self !== "undefined") {
  win = self as unknown as AnimationFrameHost;
} else {
  win = {} as AnimationFrameHost;
}

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
const request: RequestAnimationFrame =
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  win.oRequestAnimationFrame ||
  win.msRequestAnimationFrame ||
  function (callback: Callback): number {
    return win.setTimeout(callback, 1000 / 60);
  };

const cancel: CancelAnimationFrame =
  win.cancelAnimationFrame ||
  win.webkitCancelAnimationFrame ||
  win.mozCancelAnimationFrame ||
  win.oCancelAnimationFrame ||
  win.msCancelAnimationFrame ||
  function (id: number) {
    win.clearTimeout(id);
  };

export const raf: RequestAnimationFrame = request;
export const caf: CancelAnimationFrame = cancel;
