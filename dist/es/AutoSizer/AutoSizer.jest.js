import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import AutoSizer from './AutoSizer';

function DefaultChildComponent(_ref) {
  var height = _ref.height,
      width = _ref.width,
      foo = _ref.foo,
      bar = _ref.bar;
  return React.createElement("div", null, "width:".concat(width, ", height:").concat(height, ", foo:").concat(foo, ", bar:").concat(bar));
}

describe('AutoSizer', function () {
  function getMarkup() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$bar = _ref2.bar,
        bar = _ref2$bar === void 0 ? 123 : _ref2$bar,
        _ref2$ChildComponent = _ref2.ChildComponent,
        ChildComponent = _ref2$ChildComponent === void 0 ? DefaultChildComponent : _ref2$ChildComponent,
        _ref2$className = _ref2.className,
        className = _ref2$className === void 0 ? undefined : _ref2$className,
        _ref2$defaultHeight = _ref2.defaultHeight,
        defaultHeight = _ref2$defaultHeight === void 0 ? undefined : _ref2$defaultHeight,
        _ref2$defaultWidth = _ref2.defaultWidth,
        defaultWidth = _ref2$defaultWidth === void 0 ? undefined : _ref2$defaultWidth,
        _ref2$disableHeight = _ref2.disableHeight,
        disableHeight = _ref2$disableHeight === void 0 ? false : _ref2$disableHeight,
        _ref2$disableWidth = _ref2.disableWidth,
        disableWidth = _ref2$disableWidth === void 0 ? false : _ref2$disableWidth,
        _ref2$foo = _ref2.foo,
        foo = _ref2$foo === void 0 ? 456 : _ref2$foo,
        _ref2$height = _ref2.height,
        height = _ref2$height === void 0 ? 100 : _ref2$height,
        onResize = _ref2.onResize,
        _ref2$paddingBottom = _ref2.paddingBottom,
        paddingBottom = _ref2$paddingBottom === void 0 ? 0 : _ref2$paddingBottom,
        _ref2$paddingLeft = _ref2.paddingLeft,
        paddingLeft = _ref2$paddingLeft === void 0 ? 0 : _ref2$paddingLeft,
        _ref2$paddingRight = _ref2.paddingRight,
        paddingRight = _ref2$paddingRight === void 0 ? 0 : _ref2$paddingRight,
        _ref2$paddingTop = _ref2.paddingTop,
        paddingTop = _ref2$paddingTop === void 0 ? 0 : _ref2$paddingTop,
        _ref2$style = _ref2.style,
        style = _ref2$style === void 0 ? undefined : _ref2$style,
        _ref2$width = _ref2.width,
        width = _ref2$width === void 0 ? 200 : _ref2$width;

    var wrapperStyle = {
      boxSizing: 'border-box',
      height: height,
      paddingBottom: paddingBottom,
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      width: width
    };
    mockOffsetSize(width, height);
    return React.createElement("div", {
      style: wrapperStyle
    }, React.createElement(AutoSizer, {
      className: className,
      defaultHeight: defaultHeight,
      defaultWidth: defaultWidth,
      disableHeight: disableHeight,
      disableWidth: disableWidth,
      onResize: onResize,
      style: style
    }, function (_ref3) {
      var height = _ref3.height,
          width = _ref3.width;
      return React.createElement(ChildComponent, {
        width: disableWidth ? undefined : width,
        height: disableHeight ? undefined : height,
        bar: bar,
        foo: foo
      });
    }));
  } // AutoSizer uses offsetWidth and offsetHeight.
  // Jest runs in JSDom which doesn't support measurements APIs.


  function mockOffsetSize(width, height) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: height
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: width
    });
  }

  it('should relay properties to ChildComponent or React child', function () {
    var rendered = findDOMNode(render(getMarkup()));
    expect(rendered.textContent).toContain('foo:456');
    expect(rendered.textContent).toContain('bar:123');
  });
  it('should set the correct initial width and height of ChildComponent or React child', function () {
    var rendered = findDOMNode(render(getMarkup()));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:200');
  });
  it('should account for padding when calculating the available width and height', function () {
    var rendered = findDOMNode(render(getMarkup({
      paddingBottom: 10,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 15
    })));
    expect(rendered.textContent).toContain('height:75');
    expect(rendered.textContent).toContain('width:192');
  });
  it('should not update :width if :disableWidth is true', function () {
    var rendered = findDOMNode(render(getMarkup({
      disableWidth: true
    })));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:undefined');
  });
  it('should not update :height if :disableHeight is true', function () {
    var rendered = findDOMNode(render(getMarkup({
      disableHeight: true
    })));
    expect(rendered.textContent).toContain('height:undefined');
    expect(rendered.textContent).toContain('width:200');
  });

  function simulateResize(_ref4) {
    var element, height, width, trigger;
    return _regeneratorRuntime.async(function simulateResize$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            element = _ref4.element, height = _ref4.height, width = _ref4.width;
            mockOffsetSize(width, height); // Trigger detectElementResize library by faking a scroll event
            // TestUtils Simulate doesn't work here in JSDom so we manually dispatch

            trigger = element.querySelector('.contract-trigger');
            trigger.dispatchEvent(new Event('scroll')); // Allow requestAnimationFrame to be invoked before continuing

            _context.next = 6;
            return _regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 100);
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  it('should update :height after a resize event', function _callee(done) {
    var rendered;
    return _regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            rendered = findDOMNode(render(getMarkup({
              height: 100,
              width: 200
            })));
            expect(rendered.textContent).toContain('height:100');
            expect(rendered.textContent).toContain('width:200');
            _context2.next = 5;
            return _regeneratorRuntime.awrap(simulateResize({
              element: rendered,
              height: 400,
              width: 300
            }));

          case 5:
            expect(rendered.textContent).toContain('height:400');
            expect(rendered.textContent).toContain('width:300');
            done();

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  describe('onResize and (re)render', function () {
    it('should trigger when size changes', function _callee2(done) {
      var onResize, ChildComponent, rendered;
      return _regeneratorRuntime.async(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              onResize = jest.fn();
              ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
              rendered = findDOMNode(render(getMarkup({
                ChildComponent: ChildComponent,
                height: 100,
                onResize: onResize,
                width: 200
              })));
              ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()

              expect(onResize).toHaveBeenCalledTimes(1);
              _context3.next = 7;
              return _regeneratorRuntime.awrap(simulateResize({
                element: rendered,
                height: 400,
                width: 300
              }));

            case 7:
              expect(ChildComponent).toHaveBeenCalledTimes(1);
              expect(onResize).toHaveBeenCalledTimes(2);
              done();

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it('should only trigger when height changes for disableWidth == true', function _callee3(done) {
      var onResize, ChildComponent, rendered;
      return _regeneratorRuntime.async(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              onResize = jest.fn();
              ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
              rendered = findDOMNode(render(getMarkup({
                ChildComponent: ChildComponent,
                disableWidth: true,
                height: 100,
                onResize: onResize,
                width: 200
              })));
              ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()

              expect(onResize).toHaveBeenCalledTimes(1);
              _context4.next = 7;
              return _regeneratorRuntime.awrap(simulateResize({
                element: rendered,
                height: 100,
                width: 300
              }));

            case 7:
              expect(ChildComponent).toHaveBeenCalledTimes(0);
              expect(onResize).toHaveBeenCalledTimes(1);
              _context4.next = 11;
              return _regeneratorRuntime.awrap(simulateResize({
                element: rendered,
                height: 200,
                width: 300
              }));

            case 11:
              expect(ChildComponent).toHaveBeenCalledTimes(1);
              expect(onResize).toHaveBeenCalledTimes(2);
              done();

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it('should only trigger when width changes for disableHeight == true', function _callee4(done) {
      var onResize, ChildComponent, rendered;
      return _regeneratorRuntime.async(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              onResize = jest.fn();
              ChildComponent = jest.fn().mockImplementation(DefaultChildComponent);
              rendered = findDOMNode(render(getMarkup({
                ChildComponent: ChildComponent,
                disableHeight: true,
                height: 100,
                onResize: onResize,
                width: 200
              })));
              ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()

              expect(onResize).toHaveBeenCalledTimes(1);
              _context5.next = 7;
              return _regeneratorRuntime.awrap(simulateResize({
                element: rendered,
                height: 200,
                width: 200
              }));

            case 7:
              expect(ChildComponent).toHaveBeenCalledTimes(0);
              expect(onResize).toHaveBeenCalledTimes(1);
              _context5.next = 11;
              return _regeneratorRuntime.awrap(simulateResize({
                element: rendered,
                height: 200,
                width: 300
              }));

            case 11:
              expect(ChildComponent).toHaveBeenCalledTimes(1);
              expect(onResize).toHaveBeenCalledTimes(2);
              done();

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
  describe('className and style', function () {
    it('should use a custom :className if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        className: 'foo'
      })));
      expect(rendered.firstChild.className).toContain('foo');
    });
    it('should use a custom :style if specified', function () {
      var style = {
        backgroundColor: 'red'
      };
      var rendered = findDOMNode(render(getMarkup({
        style: style
      })));
      expect(rendered.firstChild.style.backgroundColor).toEqual('red');
    });
  });
});