'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _TestUtils = require('../TestUtils');

var _AutoSizer = require('./AutoSizer');

var _AutoSizer2 = _interopRequireDefault(_AutoSizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global Element, Event */

function DefaultChildComponent(_ref) {
  var height = _ref.height,
      width = _ref.width,
      foo = _ref.foo,
      bar = _ref.bar;

  return _react2.default.createElement(
    'div',
    null,
    'width:' + width + ', height:' + height + ', foo:' + foo + ', bar:' + bar
  );
}

describe('AutoSizer', function () {
  var simulateResize = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref5) {
      var element = _ref5.element,
          height = _ref5.height,
          width = _ref5.width;
      var trigger;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mockOffsetSize(width, height);

              // Trigger detectElementResize library by faking a scroll event
              // TestUtils Simulate doesn't work here in JSDom so we manually dispatch
              trigger = element.querySelector('.contract-trigger');

              trigger.dispatchEvent(new Event('scroll'));

              // Allow requestAnimationFrame to be invoked before continuing
              _context.next = 5;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function simulateResize(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  function getMarkup() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$bar = _ref2.bar,
        bar = _ref2$bar === undefined ? 123 : _ref2$bar,
        _ref2$ChildComponent = _ref2.ChildComponent,
        ChildComponent = _ref2$ChildComponent === undefined ? DefaultChildComponent : _ref2$ChildComponent,
        _ref2$defaultHeight = _ref2.defaultHeight,
        defaultHeight = _ref2$defaultHeight === undefined ? undefined : _ref2$defaultHeight,
        _ref2$defaultWidth = _ref2.defaultWidth,
        defaultWidth = _ref2$defaultWidth === undefined ? undefined : _ref2$defaultWidth,
        _ref2$disableHeight = _ref2.disableHeight,
        disableHeight = _ref2$disableHeight === undefined ? false : _ref2$disableHeight,
        _ref2$disableWidth = _ref2.disableWidth,
        disableWidth = _ref2$disableWidth === undefined ? false : _ref2$disableWidth,
        _ref2$foo = _ref2.foo,
        foo = _ref2$foo === undefined ? 456 : _ref2$foo,
        _ref2$height = _ref2.height,
        height = _ref2$height === undefined ? 100 : _ref2$height,
        onResize = _ref2.onResize,
        _ref2$paddingBottom = _ref2.paddingBottom,
        paddingBottom = _ref2$paddingBottom === undefined ? 0 : _ref2$paddingBottom,
        _ref2$paddingLeft = _ref2.paddingLeft,
        paddingLeft = _ref2$paddingLeft === undefined ? 0 : _ref2$paddingLeft,
        _ref2$paddingRight = _ref2.paddingRight,
        paddingRight = _ref2$paddingRight === undefined ? 0 : _ref2$paddingRight,
        _ref2$paddingTop = _ref2.paddingTop,
        paddingTop = _ref2$paddingTop === undefined ? 0 : _ref2$paddingTop,
        _ref2$width = _ref2.width,
        width = _ref2$width === undefined ? 200 : _ref2$width;

    var style = {
      boxSizing: 'border-box',
      height: height,
      paddingBottom: paddingBottom,
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      width: width
    };

    mockOffsetSize(width, height);

    return _react2.default.createElement(
      'div',
      { style: style },
      _react2.default.createElement(
        _AutoSizer2.default,
        {
          defaultHeight: defaultHeight,
          defaultWidth: defaultWidth,
          disableHeight: disableHeight,
          disableWidth: disableWidth,
          onResize: onResize },
        function (_ref3) {
          var height = _ref3.height,
              width = _ref3.width;
          return _react2.default.createElement(ChildComponent, {
            width: disableWidth ? undefined : width,
            height: disableHeight ? undefined : height,
            bar: bar,
            foo: foo
          });
        }
      )
    );
  }

  // AutoSizer uses offsetWidth and offsetHeight.
  // Jest runs in JSDom which doesn't support measurements APIs.
  function mockOffsetSize(width, height) {
    Object.defineProperty(Element.prototype, 'offsetHeight', {
      configurable: true,
      value: height
    });
    Object.defineProperty(Element.prototype, 'offsetWidth', {
      configurable: true,
      value: width
    });
  }

  it('should relay properties to ChildComponent or React child', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
    expect(rendered.textContent).toContain('foo:456');
    expect(rendered.textContent).toContain('bar:123');
  });

  it('should set the correct initial width and height of ChildComponent or React child', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:200');
  });

  it('should account for padding when calculating the available width and height', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
      paddingBottom: 10,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 15
    })));
    expect(rendered.textContent).toContain('height:75');
    expect(rendered.textContent).toContain('width:192');
  });

  it('should not update :width if :disableWidth is true', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ disableWidth: true })));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:undefined');
  });

  it('should not update :height if :disableHeight is true', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ disableHeight: true })));
    expect(rendered.textContent).toContain('height:undefined');
    expect(rendered.textContent).toContain('width:200');
  });

  it('should update :height after a resize event', function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(done) {
      var rendered;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
                height: 100,
                width: 200
              })));

              expect(rendered.textContent).toContain('height:100');
              expect(rendered.textContent).toContain('width:200');
              _context2.next = 5;
              return simulateResize({ element: rendered, height: 400, width: 300 });

            case 5:
              expect(rendered.textContent).toContain('height:400');
              expect(rendered.textContent).toContain('width:300');
              done();

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3) {
      return _ref6.apply(this, arguments);
    };
  }());

  describe('onResize and (re)render', function () {
    it('should trigger when size changes', function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(done) {
        var onResize, ChildComponent, rendered;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                onResize = jest.fn();
                ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
                rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
                  ChildComponent: ChildComponent,
                  height: 100,
                  onResize: onResize,
                  width: 200
                })));

                ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
                expect(onResize).toHaveBeenCalledTimes(1);
                _context3.next = 7;
                return simulateResize({ element: rendered, height: 400, width: 300 });

              case 7:
                expect(ChildComponent).toHaveBeenCalledTimes(1);
                expect(onResize).toHaveBeenCalledTimes(2);
                done();

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function (_x4) {
        return _ref7.apply(this, arguments);
      };
    }());

    it('should only trigger when height changes for disableWidth == true', function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(done) {
        var onResize, ChildComponent, rendered;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                onResize = jest.fn();
                ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
                rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
                  ChildComponent: ChildComponent,
                  disableWidth: true,
                  height: 100,
                  onResize: onResize,
                  width: 200
                })));

                ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
                expect(onResize).toHaveBeenCalledTimes(1);
                _context4.next = 7;
                return simulateResize({ element: rendered, height: 100, width: 300 });

              case 7:
                expect(ChildComponent).toHaveBeenCalledTimes(0);
                expect(onResize).toHaveBeenCalledTimes(1);
                _context4.next = 11;
                return simulateResize({ element: rendered, height: 200, width: 300 });

              case 11:
                expect(ChildComponent).toHaveBeenCalledTimes(1);
                expect(onResize).toHaveBeenCalledTimes(2);
                done();

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function (_x5) {
        return _ref8.apply(this, arguments);
      };
    }());

    it('should only trigger when width changes for disableHeight == true', function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(done) {
        var onResize, ChildComponent, rendered;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                onResize = jest.fn();
                ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
                rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
                  ChildComponent: ChildComponent,
                  disableHeight: true,
                  height: 100,
                  onResize: onResize,
                  width: 200
                })));

                ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
                expect(onResize).toHaveBeenCalledTimes(1);
                _context5.next = 7;
                return simulateResize({ element: rendered, height: 200, width: 200 });

              case 7:
                expect(ChildComponent).toHaveBeenCalledTimes(0);
                expect(onResize).toHaveBeenCalledTimes(1);
                _context5.next = 11;
                return simulateResize({ element: rendered, height: 200, width: 300 });

              case 11:
                expect(ChildComponent).toHaveBeenCalledTimes(1);
                expect(onResize).toHaveBeenCalledTimes(2);
                done();

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function (_x6) {
        return _ref9.apply(this, arguments);
      };
    }());
  });

  describe('server-side rendering', function () {
    it('should render content with default widths and heights initially', function () {
      var rendered = _server2.default.renderToString(getMarkup({
        defaultHeight: 100,
        defaultWidth: 200,
        height: 400,
        width: 800
      }));
      expect(rendered).toContain('height:100');
      expect(rendered).toContain('width:200');
    });
  });
});