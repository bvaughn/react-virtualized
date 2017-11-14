import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Promise from 'babel-runtime/core-js/promise';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _this2 = this;

/* global Element */

import React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import WindowScroller, { IS_SCROLLING_TIMEOUT } from './WindowScroller';

var ChildComponent = function (_React$Component) {
  _inherits(ChildComponent, _React$Component);

  function ChildComponent() {
    _classCallCheck(this, ChildComponent);

    return _possibleConstructorReturn(this, (ChildComponent.__proto__ || _Object$getPrototypeOf(ChildComponent)).apply(this, arguments));
  }

  _createClass(ChildComponent, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          scrollTop = _props.scrollTop,
          isScrolling = _props.isScrolling,
          height = _props.height;


      return React.createElement(
        'div',
        null,
        'scrollTop:' + scrollTop + ', isScrolling:' + isScrolling + ', height:' + height
      );
    }
  }]);

  return ChildComponent;
}(React.Component);

function mockGetBoundingClientRectForHeader(_ref) {
  var _ref$documentOffset = _ref.documentOffset,
      documentOffset = _ref$documentOffset === undefined ? 0 : _ref$documentOffset,
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
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var headerElements = _ref2.headerElements,
      documentOffset = _ref2.documentOffset,
      childRef = _ref2.childRef,
      props = _objectWithoutProperties(_ref2, ['headerElements', 'documentOffset', 'childRef']);

  var windowScroller = React.createElement(
    WindowScroller,
    props,
    function (_ref3) {
      var height = _ref3.height,
          isScrolling = _ref3.isScrolling,
          onChildScroll = _ref3.onChildScroll,
          scrollTop = _ref3.scrollTop;
      return React.createElement(ChildComponent, {
        ref: childRef,
        height: height,
        isScrolling: isScrolling,
        onScroll: onChildScroll,
        scrollTop: scrollTop
      });
    }
  );

  // JSDome doesn't implement a working getBoundingClientRect()
  // But WindowScroller requires it
  mockGetBoundingClientRectForHeader({
    documentOffset: documentOffset,
    height: headerElements ? headerElements.props.style.height : 0,
    width: headerElements ? headerElements.props.style.width : 0
  });

  if (headerElements) {
    return React.createElement(
      'div',
      null,
      headerElements,
      windowScroller
    );
  } else {
    return windowScroller;
  }
}

function simulateWindowScroll(_ref4) {
  var _ref4$scrollX = _ref4.scrollX,
      scrollX = _ref4$scrollX === undefined ? 0 : _ref4$scrollX,
      _ref4$scrollY = _ref4.scrollY,
      scrollY = _ref4$scrollY === undefined ? 0 : _ref4$scrollY;

  document.body.style.height = '10000px';
  window.scrollX = scrollX;
  window.scrollY = scrollY;
  document.dispatchEvent(new window.Event('scroll', { bubbles: true }));
  document.body.style.height = '';
}

function simulateWindowResize(_ref5) {
  var _ref5$height = _ref5.height,
      height = _ref5$height === undefined ? 0 : _ref5$height,
      _ref5$width = _ref5.width,
      width = _ref5$width === undefined ? 0 : _ref5$width;

  window.innerHeight = height;
  window.innerWidth = width;
  document.dispatchEvent(new window.Event('resize', { bubbles: true }));
}

describe('WindowScroller', function () {
  // Set default window height and scroll position between tests
  beforeEach(function () {
    window.scrollY = 0;
    window.scrollX = 0;
    window.innerHeight = 500;
    window.innerWidth = 500;
  });

  // Starts updating scrollTop only when the top position is reached
  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft', function () {
    var component = render(getMarkup());
    var rendered = findDOMNode(component);

    var _rendered$getBounding = rendered.getBoundingClientRect(),
        top = _rendered$getBounding.top,
        left = _rendered$getBounding.left;

    expect(component._positionFromTop).toEqual(top);
    expect(component._positionFromLeft).toEqual(left);
  });

  // Test edge-case reported in bvaughn/react-virtualized/pull/346
  it('should have correct top and left properties to be defined on :_positionFromTop and :_positionFromLeft if documentElement is scrolled', function () {
    render.unmount();

    // Simulate scrolled documentElement
    var component = render(getMarkup({
      documentOffset: -100
    }));
    var rendered = findDOMNode(component);

    var _rendered$getBounding2 = rendered.getBoundingClientRect(),
        top = _rendered$getBounding2.top,
        left = _rendered$getBounding2.left;

    expect(component._positionFromTop).toEqual(top + 100);
    expect(component._positionFromLeft).toEqual(left + 100);
    // Reset override
    delete document.documentElement.getBoundingClientRect;
  });

  it('inherits the window height and passes it to child component', function () {
    var component = render(getMarkup());
    var rendered = findDOMNode(component);

    expect(component.state.height).toEqual(window.innerHeight);
    expect(component.state.height).toEqual(500);
    expect(rendered.textContent).toContain('height:500');
  });

  it('should restore pointerEvents on body after IS_SCROLLING_TIMEOUT', function () {
    var _ref6 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(done) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              render(getMarkup());
              document.body.style.pointerEvents = 'all';
              simulateWindowScroll({ scrollY: 5000 });
              expect(document.body.style.pointerEvents).toEqual('none');
              _context.next = 6;
              return new _Promise(function (resolve) {
                return setTimeout(resolve, IS_SCROLLING_TIMEOUT);
              });

            case 6:
              expect(document.body.style.pointerEvents).toEqual('all');
              done();

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    return function (_x2) {
      return _ref6.apply(this, arguments);
    };
  }());

  it('should restore pointerEvents on body after unmount', function () {
    render(getMarkup());
    document.body.style.pointerEvents = 'all';
    simulateWindowScroll({ scrollY: 5000 });
    expect(document.body.style.pointerEvents).toEqual('none');
    render.unmount();
    expect(document.body.style.pointerEvents).toEqual('all');
  });

  describe('onScroll', function () {
    it('should trigger callback when window scrolls', function () {
      var _ref7 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(done) {
        var onScroll;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                onScroll = jest.fn();

                render(getMarkup({ onScroll: onScroll }));

                simulateWindowScroll({ scrollY: 5000 });

                // Allow scrolling timeout to complete so that the component computes state
                _context2.next = 5;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 150);
                });

              case 5:

                expect(onScroll).toHaveBeenCalledWith({
                  scrollLeft: 0,
                  scrollTop: 5000
                });

                simulateWindowScroll({
                  scrollX: 2500,
                  scrollY: 5000
                });

                // Allow scrolling timeout to complete so that the component computes state
                _context2.next = 9;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 150);
                });

              case 9:

                expect(onScroll).toHaveBeenCalledWith({
                  scrollLeft: 2500,
                  scrollTop: 5000
                });

                done();

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x3) {
        return _ref7.apply(this, arguments);
      };
    }());

    it('should update :scrollTop when window is scrolled', function () {
      var _ref8 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(done) {
        var component, rendered, componentScrollTop;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                component = render(getMarkup());
                rendered = findDOMNode(component);

                // Initial load of the component should have 0 scrollTop

                expect(rendered.textContent).toContain('scrollTop:0');

                simulateWindowScroll({ scrollY: 5000 });

                // Allow scrolling timeout to complete so that the component computes state
                _context3.next = 6;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 150);
                });

              case 6:
                componentScrollTop = window.scrollY - component._positionFromTop;

                expect(component.state.scrollTop).toEqual(componentScrollTop);
                expect(rendered.textContent).toContain('scrollTop:' + componentScrollTop);

                done();

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x4) {
        return _ref8.apply(this, arguments);
      };
    }());

    it('should specify :isScrolling when scrolling and reset after scrolling', function () {
      var _ref9 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(done) {
        var component, rendered;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                component = render(getMarkup());
                rendered = findDOMNode(component);


                simulateWindowScroll({ scrollY: 5000 });

                expect(rendered.textContent).toContain('isScrolling:true');

                _context4.next = 6;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 250);
                });

              case 6:

                expect(rendered.textContent).toContain('isScrolling:false');

                done();

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x5) {
        return _ref9.apply(this, arguments);
      };
    }());

    it('should support a custom :scrollingResetTimeInterval prop', function () {
      var _ref10 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(done) {
        var component, rendered;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                component = render(getMarkup({
                  scrollingResetTimeInterval: 500
                }));
                rendered = findDOMNode(component);


                expect(rendered.textContent).toContain('isScrolling:false');

                simulateWindowScroll({ scrollY: 5000 });

                expect(rendered.textContent).toContain('isScrolling:true');

                _context5.next = 7;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 100);
                });

              case 7:

                expect(rendered.textContent).toContain('isScrolling:true');

                _context5.next = 10;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 100);
                });

              case 10:

                expect(rendered.textContent).toContain('isScrolling:true');

                _context5.next = 13;
                return new _Promise(function (resolve) {
                  return setTimeout(resolve, 300);
                });

              case 13:

                expect(rendered.textContent).toContain('isScrolling:false');

                done();

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this2);
      }));

      return function (_x6) {
        return _ref10.apply(this, arguments);
      };
    }());
  });

  describe('onResize', function () {
    it('should trigger callback when window resizes', function () {
      var onResizeCalls = [];
      render(getMarkup({
        onResize: function onResize(params) {
          return onResizeCalls.push(params);
        }
      }));

      simulateWindowResize({ height: 1000, width: 1024 });

      expect(onResizeCalls.length).toEqual(1);
      expect(onResizeCalls[0]).toEqual({
        height: 1000,
        width: 1024
      });
    });

    it('should update height when window resizes', function () {
      var component = render(getMarkup());
      var rendered = findDOMNode(component);

      // Initial load of the component should have the same window height = 500
      expect(component.state.height).toEqual(window.innerHeight);
      expect(component.state.height).toEqual(500);
      expect(rendered.textContent).toContain('height:500');

      simulateWindowResize({ height: 1000 });

      expect(component.state.height).toEqual(window.innerHeight);
      expect(component.state.height).toEqual(1000);
      expect(rendered.textContent).toContain('height:1000');
    });
  });

  describe('updatePosition', function () {
    it('should calculate the initial offset from the top of the page when mounted', function () {
      var windowScroller = void 0;

      render(getMarkup({
        headerElements: React.createElement('div', { style: { height: 100 } }),
        ref: function ref(_ref11) {
          windowScroller = _ref11;
        }
      }));

      expect(windowScroller._positionFromTop).toBe(100);
    });

    it('should recalculate the offset from the top when the window resizes', function () {
      var windowScroller = void 0;

      render(getMarkup({
        headerElements: React.createElement('div', { id: 'header', style: { height: 100, width: 150 } }),
        ref: function ref(_ref12) {
          windowScroller = _ref12;
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

      simulateWindowResize({ height: 1000, width: 1000 });

      expect(windowScroller._positionFromTop).toBe(200);
      expect(windowScroller._positionFromLeft).toBe(300);
    });

    it('should recalculate the offset from the top if called externally', function () {
      var windowScroller = void 0;

      render(getMarkup({
        headerElements: React.createElement('div', { id: 'header', style: { height: 100, width: 150 } }),
        ref: function ref(_ref13) {
          windowScroller = _ref13;
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
    var originalScrollTo = void 0;
    beforeEach(function () {
      originalScrollTo = window.scrollTo;
      window.scrollTo = function (scrollX, scrollY) {
        return simulateWindowScroll({ scrollX: scrollX, scrollY: scrollY });
      };
    });

    afterEach(function () {
      window.scrollTo = originalScrollTo;
      render.unmount();
    });

    it('should scroll the scrollElement (when it is window) the desired amount', function () {
      var windowScroller = void 0,
          childComponent = void 0;

      render(getMarkup({
        ref: function ref(_ref14) {
          windowScroller = _ref14;
        },
        childRef: function childRef(ref) {
          childComponent = ref;
        }
      }));

      childComponent.props.onScroll({ scrollTop: 200 });

      expect(window.scrollY).toEqual(200 + windowScroller._positionFromTop);
    });

    it('should not scroll the scrollElement if trying to scroll to where we already are', function () {
      var childComponent = void 0;

      render(getMarkup({
        childRef: function childRef(ref) {
          childComponent = ref;
        }
      }));

      simulateWindowScroll({ scrollY: 200 });

      window.scrollTo = jest.fn();

      childComponent.props.onScroll({ scrollTop: 200 });

      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should scroll the scrollElement (when it is an element) the desired amount', function () {
      var windowScroller = void 0,
          childComponent = void 0;
      var divEl = document.createElement('div');

      render(getMarkup({
        ref: function ref(_ref15) {
          windowScroller = _ref15;
        },
        scrollElement: divEl,
        childRef: function childRef(ref) {
          childComponent = ref;
        }
      }));

      childComponent.props.onScroll({ scrollTop: 200 });

      expect(divEl.scrollTop).toEqual(200 + windowScroller._positionFromTop);
    });

    it('should update own scrollTop', function () {
      var windowScroller = void 0,
          childComponent = void 0;

      render(getMarkup({
        ref: function ref(_ref16) {
          windowScroller = _ref16;
        },
        childRef: function childRef(ref) {
          childComponent = ref;
        }
      }));

      childComponent.props.onScroll({ scrollTop: 200 });

      expect(windowScroller.state.scrollTop).toEqual(200);
    });
  });
});