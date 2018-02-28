/**
 * @jest-environment node
 */

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import AutoSizer from './AutoSizer';

test('should render content with default widths and heights initially', () => {
  const rendered = ReactDOMServer.renderToString(
    <AutoSizer defaultHeight={100} defaultWidth={200}>
      {({height, width}) => <div>{`height:${height};width:${width}`}</div>}
    </AutoSizer>,
  );
  expect(rendered).toContain('height:100');
  expect(rendered).toContain('width:200');
});
