"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var React = _interopRequireWildcard(require("react"));

var ReactDOMServer = _interopRequireWildcard(require("react-dom/server"));

var _AutoSizer = _interopRequireDefault(require("./AutoSizer"));

/**
 * @jest-environment node
 */
test('should render content with default widths and heights initially', function () {
  var rendered = ReactDOMServer.renderToString(React.createElement(_AutoSizer["default"], {
    defaultHeight: 100,
    defaultWidth: 200
  }, function (_ref) {
    var height = _ref.height,
        width = _ref.width;
    return React.createElement("div", null, "height:".concat(height, ";width:").concat(width));
  }));
  expect(rendered).toContain('height:100');
  expect(rendered).toContain('width:200');
});