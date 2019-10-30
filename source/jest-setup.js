jest.mock('dom-helpers/scrollbarSize', () => {
  return function getScrollbarSize() {
    return 20;
  };
});
