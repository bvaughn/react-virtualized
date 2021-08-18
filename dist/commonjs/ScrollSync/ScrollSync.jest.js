"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _TestUtils = require("../TestUtils");

var _ScrollSync = _interopRequireDefault(require("./ScrollSync"));

function ChildComponent(_ref) {
  var clientHeight = _ref.clientHeight,
      clientWidth = _ref.clientWidth,
      scrollHeight = _ref.scrollHeight,
      scrollLeft = _ref.scrollLeft,
      scrollTop = _ref.scrollTop,
      scrollWidth = _ref.scrollWidth;
  return React.createElement("div", null, "clientHeight:".concat(clientHeight), "clientWidth:".concat(clientWidth), "scrollHeight:".concat(scrollHeight), "scrollLeft:".concat(scrollLeft), "scrollTop:".concat(scrollTop), "scrollWidth:".concat(scrollWidth));
}

describe('ScrollSync', function () {
  it('should pass through an initial value of 0 for :scrollLeft and :scrollTop', function () {
    var component = (0, _TestUtils.render)(React.createElement(_ScrollSync["default"], null, function (_ref2) {
      var clientHeight = _ref2.clientHeight,
          clientWidth = _ref2.clientWidth,
          scrollHeight = _ref2.scrollHeight,
          scrollLeft = _ref2.scrollLeft,
          scrollTop = _ref2.scrollTop,
          scrollWidth = _ref2.scrollWidth;
      return React.createElement(ChildComponent, {
        clientHeight: clientHeight,
        clientWidth: clientWidth,
        scrollHeight: scrollHeight,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        scrollWidth: scrollWidth
      });
    }));
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientHeight:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientWidth:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollHeight:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollLeft:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollTop:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollWidth:0');
  });
  it('should update :scrollLeft and :scrollTop when :onScroll is called', function () {
    var onScroll;
    var component = (0, _TestUtils.render)(React.createElement(_ScrollSync["default"], null, function (params) {
      onScroll = params.onScroll;
      return React.createElement(ChildComponent, params);
    }));
    onScroll({
      clientHeight: 400,
      clientWidth: 200,
      scrollHeight: 1000,
      scrollLeft: 50,
      scrollTop: 100,
      scrollWidth: 500
    });
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientHeight:400');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientWidth:200');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollHeight:1000');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollLeft:50');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollTop:100');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollWidth:500');
  });
});