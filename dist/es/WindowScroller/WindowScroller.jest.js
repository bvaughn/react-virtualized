import _regeneratorRuntime from "@babel/runtime/regenerator";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import WindowScroller, { IS_SCROLLING_TIMEOUT } from './WindowScroller';

function mockGetBoundingClientRectForHeader(_ref) {
  var _ref$documentOffset = _ref.documentOffset,
      documentOffset = _ref$documentOffset === void 0 ? 0 : _ref$documentOffset,
      height = _ref.height,
      width = _ref.width;
  // Mock the WindowScroller element and window separately
  // The only way to mock the former (before its created) is globally
  Element.prototype.getBoundingClientRect = jest.fn(function () {
    return {
      top: height,
      left: width
    };
  });
  document.documentElement.getBoundingClientRect = jest.fn(function () {
    return {
      top: documentOffset,
      left: documentOffset
    };
  });
}

function getMarkup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      headerElements = _ref2.headerElements,
      documentOffset = _ref2.documentOffset,
      renderFn = _ref2.renderFn,
      props = _objectWithoutProperties(_ref2, ["headerElements", "documentOffset", "renderFn"]);

  var windowScroller = React.createElement(WindowScroller, props, function (params) {
    return React.createElement("div", null, renderFn && renderFn(params));
  }); // JSDome doesn't implement a working getBoundingClientRect()
  // But WindowScroller requires it

  mockGetBoundingClientRectForHeader({
    documentOffset: documentOffset,
    height: headerElements ? headerElements.props.style.height : 0,
    width: headerElements ? headerElements.props.style.width : 0
  });

  if (headerElements) {
    return React.createElement("div", null, headerElements, windowScroller);
  } else {
    return windowScroller;
  }
}

function simulateWindowScroll(_ref3) {
  var _ref3$scrollX = _ref3.scrollX,
      scrollX = _ref3$scrollX === void 0 ? 0 : _ref3$scrollX,
      _ref3$scrollY = _ref3.scrollY,
      scrollY = _ref3$scrollY === void 0 ? 0 : _ref3$scrollY;
  document.body.style.height = '10000px';
  window.scrollX = scrollX;
  window.scrollY = scrollY;
  document.dispatchEvent(new window.Event('scroll', {
    bubbles: true
  }));
  document.body.style.height = '';
}

function simulateWindowResize(_ref4) {
  var _ref4$height = _ref4.height,
      height = _ref4$height === void 0 ? 0 : _ref4$height,
      _ref4$width = _ref4.width,
      width = _ref4$width === void 0 ? 0 : _ref4$width;
  window.innerHeight = height;
  window.innerWidth = width;
  document.dispatchEvent(new window.Event('resize', {
    bubbles: true
  }));
}

describe('WindowScroller', function () {
  // Set default window height and scroll position between tests
  beforeEach(function () {
    window.scrollY = 0;
    window.scrollX = 0;
    window.innerHeight = 500;
    window.innerWidth = 500;
  }); // Starts updating scrollTop only when the top position is reached

  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft', function () {
    var component = render(getMarkup());
    var rendered = findDOMNode(component);

    var _rendered$getBounding = rendered.getBoundingClientRect(),
        top = _rendered$getBounding.top,
        left = _rendered$getBounding.left;

    expect(component._positionFromTop).toEqual(top);
    expect(component._positionFromLeft).toEqual(left);
  });
  it('should allow passing child element with registerChild of children function param', function () {
    var scrollElement = document.createElement('div');
    scrollElement.scrollTop = 100;
    scrollElement.scrollLeft = 150;

    scrollElement.getBoundingClientRect = function () {
      return {
        top: 200,
        left: 250
      };
    };

    var child = document.createElement('div');

    child.getBoundingClientRect = function () {
      return {
        top: 300,
        left: 350
      };
    };

    var renderFn = jest.fn();
    var component = render(getMarkup({
      scrollElement: scrollElement,
      renderFn: renderFn
    }));
    renderFn.mock.calls[0][0].registerChild(child);
    expect(component._positionFromTop).toEqual(300 + 100 - 200);
    expect(component._positionFromLeft).toEqual(350 + 150 - 250);
  });
  it('should warn on passing non-element or not null', function () {
    var warnFn = jest.spyOn(console, 'warn');
    var renderFn = jest.fn();
    render(getMarkup({
      renderFn: renderFn
    }));
    renderFn.mock.calls[0][0].registerChild(1);
    renderFn.mock.calls[0][0].registerChild(document.createElement('div'));
    renderFn.mock.calls[0][0].registerChild(null);
    expect(warnFn).toHaveBeenCalledTimes(1);
    warnFn.mockRestore();
  }); // Test edge-case reported in bvaughn/react-virtualized/pull/346

  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft if documentElement is scrolled', function () {
    render.unmount(); // Simulate scrolled documentElement

    var component = render(getMarkup({
      documentOffset: -100
    }));
    var rendered = findDOMNode(component);

    var _rendered$getBounding2 = rendered.getBoundingClientRect(),
        top = _rendered$getBounding2.top,
        left = _rendered$getBounding2.left;

    expect(component._positionFromTop).toEqual(top + 100);
    expect(component._positionFromLeft).toEqual(left + 100); // Reset override

    delete document.documentElement.getBoundingClientRect;
  });
  it('inherits the window height and passes it to child component', function () {
    var renderFn = jest.fn();
    var component = render(getMarkup({
      renderFn: renderFn
    }));
    expect(component.state.height).toEqual(window.innerHeight);
    expect(component.state.height).toEqual(500);
    expect(renderFn).lastCalledWith(expect.objectContaining({
      height: 500
    }));
  });
  it('should restore pointerEvents on body after IS_SCROLLING_TIMEOUT', function _callee() {
    return _regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            render(getMarkup());
            document.body.style.pointerEvents = 'all';
            simulateWindowScroll({
              scrollY: 5000
            });
            expect(document.body.style.pointerEvents).toEqual('none');
            _context.next = 6;
            return _regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, IS_SCROLLING_TIMEOUT + 100);
            }));

          case 6:
            expect(document.body.style.pointerEvents).toEqual('all');

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('should restore pointerEvents on body after unmount', function () {
    render(getMarkup());
    document.body.style.pointerEvents = 'all';
    simulateWindowScroll({
      scrollY: 5000
    });
    expect(document.body.style.pointerEvents).toEqual('none');
    render.unmount();
    expect(document.body.style.pointerEvents).toEqual('all');
  });
  describe('onScroll', function () {
    it('should trigger callback when window scrolls', function _callee2() {
      var onScroll;
      return _regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              onScroll = jest.fn();
              render(getMarkup({
                onScroll: onScroll
              }));
              simulateWindowScroll({
                scrollY: 5000
              }); // Allow scrolling timeout to complete so that the component computes state

              _context2.next = 5;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 150);
              }));

            case 5:
              expect(onScroll).toHaveBeenCalledWith({
                scrollLeft: 0,
                scrollTop: 5000
              });
              simulateWindowScroll({
                scrollX: 2500,
                scrollY: 5000
              }); // Allow scrolling timeout to complete so that the component computes state

              _context2.next = 9;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 150);
              }));

            case 9:
              expect(onScroll).toHaveBeenCalledWith({
                scrollLeft: 2500,
                scrollTop: 5000
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    it('should update :scrollTop when window is scrolled', function _callee3() {
      var renderFn, component, componentScrollTop;
      return _regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              renderFn = jest.fn();
              component = render(getMarkup({
                renderFn: renderFn
              })); // Initial load of the component should have 0 scrollTop

              expect(renderFn).lastCalledWith(expect.objectContaining({
                scrollTop: 0
              }));
              simulateWindowScroll({
                scrollY: 5000
              }); // Allow scrolling timeout to complete so that the component computes state

              _context3.next = 6;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 150);
              }));

            case 6:
              componentScrollTop = window.scrollY - component._positionFromTop;
              expect(component.state.scrollTop).toEqual(componentScrollTop);
              expect(renderFn).lastCalledWith(expect.objectContaining({
                scrollTop: componentScrollTop
              }));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it('should specify :isScrolling when scrolling and reset after scrolling', function _callee4() {
      var renderFn;
      return _regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              renderFn = jest.fn();
              render(getMarkup({
                renderFn: renderFn
              }));
              simulateWindowScroll({
                scrollY: 5000
              });
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: true
              }));
              _context4.next = 6;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 250);
              }));

            case 6:
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: false
              }));

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it('should support a custom :scrollingResetTimeInterval prop', function _callee5() {
      var renderFn;
      return _regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              renderFn = jest.fn();
              render(getMarkup({
                scrollingResetTimeInterval: 500,
                renderFn: renderFn
              }));
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: false
              }));
              simulateWindowScroll({
                scrollY: 5000
              });
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: true
              }));
              _context5.next = 7;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              }));

            case 7:
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: true
              }));
              _context5.next = 10;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              }));

            case 10:
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: true
              }));
              _context5.next = 13;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 400);
              }));

            case 13:
              expect(renderFn).lastCalledWith(expect.objectContaining({
                isScrolling: false
              }));

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
  describe('onResize', function () {
    it('should trigger callback on init and when window resizes', function () {
      var resizeFn = jest.fn();
      render(getMarkup({
        onResize: resizeFn
      }));
      simulateWindowResize({
        height: 1000,
        width: 1024
      });
      expect(resizeFn).toHaveBeenCalledTimes(1);
      expect(resizeFn).lastCalledWith({
        height: 1000,
        width: 1024
      });
    });
    it('should update height when window resizes', function () {
      var renderFn = jest.fn();
      var component = render(getMarkup({
        renderFn: renderFn
      })); // Initial load of the component should have the same window height = 500

      expect(component.state.height).toEqual(window.innerHeight);
      expect(component.state.height).toEqual(500);
      expect(renderFn).lastCalledWith(expect.objectContaining({
        height: 500
      }));
      simulateWindowResize({
        height: 1000
      });
      expect(component.state.height).toEqual(window.innerHeight);
      expect(component.state.height).toEqual(1000);
      expect(renderFn).lastCalledWith(expect.objectContaining({
        height: 1000
      }));
    });
  });
  describe('updatePosition', function () {
    it('should calculate the initial offset from the top of the page when mounted', function () {
      var windowScroller;
      render(getMarkup({
        headerElements: React.createElement("div", {
          style: {
            height: 100
          }
        }),
        ref: function ref(_ref5) {
          windowScroller = _ref5;
        }
      }));
      expect(windowScroller._positionFromTop).toBe(100);
    });
    it('should recalculate the offset from the top when the window resizes', function () {
      var windowScroller;
      render(getMarkup({
        headerElements: React.createElement("div", {
          id: "header",
          style: {
            height: 100,
            width: 150
          }
        }),
        ref: function ref(_ref6) {
          windowScroller = _ref6;
        }
      }));
      expect(windowScroller._positionFromTop).toBe(100);
      expect(windowScroller._positionFromLeft).toBe(150);
      mockGetBoundingClientRectForHeader({
        height: 200,
        width: 300
      });
      expect(windowScroller._positionFromTop).toBe(100);
      expect(windowScroller._positionFromLeft).toBe(150);
      simulateWindowResize({
        height: 1000,
        width: 1000
      });
      expect(windowScroller._positionFromTop).toBe(200);
      expect(windowScroller._positionFromLeft).toBe(300);
    });
    it('should recalculate the offset from the top if called externally', function () {
      var windowScroller;
      render(getMarkup({
        headerElements: React.createElement("div", {
          id: "header",
          style: {
            height: 100,
            width: 150
          }
        }),
        ref: function ref(_ref7) {
          windowScroller = _ref7;
        }
      }));
      expect(windowScroller._positionFromTop).toBe(100);
      expect(windowScroller._positionFromLeft).toBe(150);
      mockGetBoundingClientRectForHeader({
        height: 200,
        width: 300
      });
      windowScroller.updatePosition();
      expect(windowScroller._positionFromTop).toBe(200);
      expect(windowScroller._positionFromLeft).toBe(300);
    });
  });
  describe('when child scrolls', function () {
    var originalScrollTo;
    beforeEach(function () {
      originalScrollTo = window.scrollTo;

      window.scrollTo = function (scrollX, scrollY) {
        return simulateWindowScroll({
          scrollX: scrollX,
          scrollY: scrollY
        });
      };
    });
    afterEach(function () {
      window.scrollTo = originalScrollTo;
      render.unmount();
    });
    it('should scroll the scrollElement (when it is window) the desired amount', function () {
      var renderFn = jest.fn();
      var windowScroller;
      render(getMarkup({
        ref: function ref(_ref8) {
          windowScroller = _ref8;
        },
        renderFn: renderFn
      }));
      renderFn.mock.calls[0][0].onChildScroll({
        scrollTop: 200
      });
      expect(window.scrollY).toEqual(200 + windowScroller._positionFromTop);
    });
    it('should not scroll the scrollElement if trying to scroll to where we already are', function () {
      var renderFn = jest.fn();
      render(getMarkup({
        renderFn: renderFn
      }));
      simulateWindowScroll({
        scrollY: 200
      });
      window.scrollTo = jest.fn();
      renderFn.mock.calls[0][0].onChildScroll({
        scrollTop: 200
      });
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
    it('should scroll the scrollElement (when it is an element) the desired amount', function () {
      var windowScroller;
      var renderFn = jest.fn();
      var divEl = document.createElement('div');
      render(getMarkup({
        ref: function ref(_ref9) {
          windowScroller = _ref9;
        },
        renderFn: renderFn,
        scrollElement: divEl
      }));
      renderFn.mock.calls[0][0].onChildScroll({
        scrollTop: 200
      });
      expect(divEl.scrollTop).toEqual(200 + windowScroller._positionFromTop);
    });
    it('should update own scrollTop', function () {
      var renderFn = jest.fn();
      render(getMarkup({
        renderFn: renderFn
      }));
      renderFn.mock.calls[0][0].onChildScroll({
        scrollTop: 200
      });
      expect(renderFn).lastCalledWith(expect.objectContaining({
        scrollTop: 200
      }));
    });
  });
});