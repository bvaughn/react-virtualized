jest.mock('dom-helpers/util/scrollbarSize', () => {
  return function getScrollbarSize() {
    return 20;
  };
});
