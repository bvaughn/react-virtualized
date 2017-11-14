jest.mock('dom-helpers/util/scrollbarSize', function () {
  return function getScrollbarSize() {
    return 20;
  };
});

// Polyfill requestAnimationFrame() for ReactDOMFrameScheduling
require('raf').polyfill();