/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import AutoSizer from './AutoSizer';
test('should render content with default widths and heights initially', function () {
  var rendered = ReactDOMServer.renderToString(React.createElement(AutoSizer, {
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