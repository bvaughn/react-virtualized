jest.mock("dom-helpers/util/scrollbarSize", () => {
  return function getScrollbarSize() {
    return 20;
  };
});

// Polyfill requestAnimationFrame() for ReactDOMFrameScheduling
global.requestAnimationFrame = require("raf");
