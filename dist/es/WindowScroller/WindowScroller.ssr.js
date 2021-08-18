/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import WindowScroller from './WindowScroller';
test('should render content with default widths and heights initially', function () {
  var rendered = ReactDOMServer.renderToString(React.createElement(WindowScroller, {
    serverHeight: 100,
    serverWidth: 200
  }, function (_ref) {
    var height = _ref.height,
        width = _ref.width;
    return React.createElement("div", null, "height:".concat(height, ";width:").concat(width));
  }));
  expect(rendered).toContain('height:100');
  expect(rendered).toContain('width:200');
});