import _regeneratorRuntime from "@babel/runtime/regenerator";

/**
 * @jest-environment jest-environment-puppeteer
 */
var bootstrap = function bootstrap() {
  var page, scripts, _i, _scripts, path;

  return _regeneratorRuntime.async(function bootstrap$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regeneratorRuntime.awrap(global.browser.newPage());

        case 2:
          page = _context.sent;
          scripts = ['./node_modules/react/umd/react.development.js', './node_modules/react-dom/umd/react-dom.development.js', './dist/umd/react-virtualized.js'];
          _i = 0, _scripts = scripts;

        case 5:
          if (!(_i < _scripts.length)) {
            _context.next = 12;
            break;
          }

          path = _scripts[_i];
          _context.next = 9;
          return _regeneratorRuntime.awrap(page.addScriptTag({
            path: path
          }));

        case 9:
          _i++;
          _context.next = 5;
          break;

        case 12:
          return _context.abrupt("return", page);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
};

var renderWindowScroller = function renderWindowScroller(_ref) {
  var scrollElement = _ref.scrollElement;
  var render = window.ReactDOM.render;
  var createElement = window.React.createElement;
  var WindowScroller = window.ReactVirtualized.WindowScroller;
  var container = document.createElement('div');
  container.id = 'container';
  container.style.margin = '100px';
  container.style.padding = '50px';
  document.body.appendChild(container);
  document.body.style.margin = 0;

  if (scrollElement === 'container') {
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'auto';
  }

  render(createElement(WindowScroller, {
    scrollElement: scrollElement === 'container' ? container : window,
    onScroll: window.scrollFn,
    onResize: window.resizeFn
  }, function () {
    return createElement('div', {
      style: {
        width: 2000,
        height: 3000
      }
    });
  }), container);
};

var delay = function delay(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};

test('save position after resize and then scroll in window', function _callee() {
  var page, scrollFn, resizeFn;
  return _regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _regeneratorRuntime.awrap(bootstrap());

        case 2:
          page = _context2.sent;
          scrollFn = jest.fn();
          resizeFn = jest.fn();
          _context2.next = 7;
          return _regeneratorRuntime.awrap(page.exposeFunction('scrollFn', scrollFn));

        case 7:
          _context2.next = 9;
          return _regeneratorRuntime.awrap(page.exposeFunction('resizeFn', resizeFn));

        case 9:
          _context2.next = 11;
          return _regeneratorRuntime.awrap(page.setViewport({
            width: 400,
            height: 600
          }));

        case 11:
          _context2.next = 13;
          return _regeneratorRuntime.awrap(page.evaluate(renderWindowScroller, {
            scrollElement: 'window'
          }));

        case 13:
          _context2.next = 15;
          return _regeneratorRuntime.awrap(page.evaluate(function () {
            return window.scrollTo(610, 830);
          }));

        case 15:
          _context2.next = 17;
          return _regeneratorRuntime.awrap(delay(100));

        case 17:
          _context2.next = 19;
          return _regeneratorRuntime.awrap(page.setViewport({
            width: 300,
            height: 500
          }));

        case 19:
          _context2.next = 21;
          return _regeneratorRuntime.awrap(delay(100));

        case 21:
          _context2.next = 23;
          return _regeneratorRuntime.awrap(page.evaluate(function () {
            return window.scrollTo(620, 840);
          }));

        case 23:
          _context2.next = 25;
          return _regeneratorRuntime.awrap(delay(100));

        case 25:
          _context2.next = 27;
          return _regeneratorRuntime.awrap(page.close());

        case 27:
          expect(scrollFn.mock.calls).toEqual([[{
            scrollLeft: 610 - 150,
            scrollTop: 830 - 150
          }], [{
            scrollLeft: 620 - 150,
            scrollTop: 840 - 150
          }]]);
          expect(resizeFn.mock.calls).toEqual([[{
            width: 300,
            height: 500
          }]]);

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  });
});
test('save position after resize and then scroll in container', function _callee2() {
  var page, scrollFn, resizeFn;
  return _regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _regeneratorRuntime.awrap(bootstrap());

        case 2:
          page = _context3.sent;
          scrollFn = jest.fn();
          resizeFn = jest.fn();
          _context3.next = 7;
          return _regeneratorRuntime.awrap(page.exposeFunction('scrollFn', scrollFn));

        case 7:
          _context3.next = 9;
          return _regeneratorRuntime.awrap(page.exposeFunction('resizeFn', resizeFn));

        case 9:
          _context3.next = 11;
          return _regeneratorRuntime.awrap(page.setViewport({
            width: 400,
            height: 600
          }));

        case 11:
          _context3.next = 13;
          return _regeneratorRuntime.awrap(page.evaluate(renderWindowScroller, {
            scrollElement: 'container'
          }));

        case 13:
          _context3.next = 15;
          return _regeneratorRuntime.awrap(page.$eval('#container', function (el) {
            return el.scrollTo(610, 830);
          }));

        case 15:
          _context3.next = 17;
          return _regeneratorRuntime.awrap(delay(100));

        case 17:
          _context3.next = 19;
          return _regeneratorRuntime.awrap(page.setViewport({
            width: 300,
            height: 500
          }));

        case 19:
          _context3.next = 21;
          return _regeneratorRuntime.awrap(delay(100));

        case 21:
          _context3.next = 23;
          return _regeneratorRuntime.awrap(page.$eval('#container', function (el) {
            return el.scrollTo(620, 840);
          }));

        case 23:
          _context3.next = 25;
          return _regeneratorRuntime.awrap(delay(100));

        case 25:
          _context3.next = 27;
          return _regeneratorRuntime.awrap(page.close());

        case 27:
          expect(scrollFn.mock.calls).toEqual([[{
            scrollLeft: 610 - 50,
            scrollTop: 830 - 50
          }], [{
            scrollLeft: 620 - 50,
            scrollTop: 840 - 50
          }]]);
          expect(resizeFn.mock.calls).toEqual([[{
            width: 500,
            height: 700
          }], [{
            width: 400,
            height: 600
          }]]);

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  });
});
test('react on container resize without window changing', function _callee3() {
  var page, resizeFn;
  return _regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _regeneratorRuntime.awrap(bootstrap());

        case 2:
          page = _context4.sent;
          resizeFn = jest.fn();
          _context4.next = 6;
          return _regeneratorRuntime.awrap(page.exposeFunction('resizeFn', resizeFn));

        case 6:
          _context4.next = 8;
          return _regeneratorRuntime.awrap(page.evaluate(function () {
            var render = window.ReactDOM.render;
            var createElement = window.React.createElement;
            var WindowScroller = window.ReactVirtualized.WindowScroller;
            var wrapper = document.createElement('div');
            wrapper.id = 'wrapper';
            Object.assign(wrapper.style, {
              width: '1000px',
              height: '800px',
              display: 'flex'
            });
            var container = document.createElement('div');
            Object.assign(container.style, {
              flex: '1'
            });
            wrapper.appendChild(container);
            document.body.style.margin = 0;
            document.body.appendChild(wrapper);
            render(createElement(WindowScroller, {
              scrollElement: container,
              onResize: window.resizeFn
            }, function () {
              return null;
            }), container);
          }));

        case 8:
          _context4.next = 10;
          return _regeneratorRuntime.awrap(delay(100));

        case 10:
          _context4.next = 12;
          return _regeneratorRuntime.awrap(page.$eval('#wrapper', function (el) {
            el.style.width = '500px';
            el.style.height = '700px';
          }));

        case 12:
          _context4.next = 14;
          return _regeneratorRuntime.awrap(delay(100));

        case 14:
          _context4.next = 16;
          return _regeneratorRuntime.awrap(page.close());

        case 16:
          expect(resizeFn.mock.calls).toEqual([[{
            width: 1000,
            height: 800
          }], [{
            width: 500,
            height: 700
          }]]);

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  });
});