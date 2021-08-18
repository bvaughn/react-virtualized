"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = defaultFooterRenderer;

var React = _interopRequireWildcard(require("react"));

/**
 * Default table footer renderer.
 */
function defaultFooterRenderer(_ref) {
  var label = _ref.label;
  var children = [React.createElement("span", {
    className: "ReactVirtualized__Table__footerTruncatedText",
    key: "label",
    title: typeof label === 'string' ? label : null
  }, label)];
  return children;
}