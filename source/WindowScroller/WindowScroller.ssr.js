/**
 * @jest-environment node
 */

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import WindowScroller from './WindowScroller';

test('should render content with default widths and heights initially', () => {
  const rendered = ReactDOMServer.renderToString(
    <WindowScroller serverHeight={100} serverWidth={200}>
      {({height, width}) => <div>{`height:${height};width:${width}`}</div>}
    </WindowScroller>,
  );

  expect(rendered).toContain('height:100');
  expect(rendered).toContain('width:200');
});
