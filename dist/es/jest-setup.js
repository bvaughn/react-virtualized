jest.mock('dom-helpers/scrollbarSize', function () {
  return function getScrollbarSize() {
    return 20;
  };
});