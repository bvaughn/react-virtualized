function createScrollingTestCase(component) {
  var scrollDown = getUrlParam('direction') !== 'up';

  return function testCase(completedCallback) {
    component.scrollTop = scrollDown ? 0 : component.scrollHeight;

    var maxScrollTop = component.scrollHeight;

    var interval = 1;
    var scrollTop = component.scrollTop;

    function incrementScrollDown() {
      if (!testRunner.isRunning()) {
        return;
      }

      interval *= 1.05;
      scrollTop = Math.min(scrollTop + interval, maxScrollTop);

      component.scrollTop = scrollTop;

      if (scrollTop < maxScrollTop) {
        requestAnimationFrame(incrementScrollDown);
      } else {
        completedCallback();
      }
    }

    function incrementScrollUp() {
      if (!testRunner.isRunning()) {
        return;
      }

      interval *= 1.05;
      scrollTop = Math.max(scrollTop - interval, 0);

      component.scrollTop = scrollTop;

      if (scrollTop > 0) {
        requestAnimationFrame(incrementScrollUp);
      } else {
        completedCallback();
      }
    }

    if (scrollDown) {
      incrementScrollDown();
    } else {
      incrementScrollUp();
    }
  };
}
