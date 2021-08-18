/*:: type Callback = (timestamp: number) => void;*/

/*:: type CancelAnimationFrame = (requestId: number) => void;*/

/*:: type RequestAnimationFrame = (callback: Callback) => number;*/
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


var request = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback
/*: Callback*/
)
/*: RequestAnimationFrame*/
{
  return (win
  /*: any*/
  ).setTimeout(callback, 1000 / 60);
};

var cancel = win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame || function (id
/*: number*/
) {
  (win
  /*: any*/
  ).clearTimeout(id);
};

export var raf
/*: RequestAnimationFrame*/
= (request
/*: any*/
);
export var caf
/*: CancelAnimationFrame*/
= (cancel
/*: any*/
);