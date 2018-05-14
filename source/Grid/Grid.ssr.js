/**
 * @flow
 * @jest-environment node
 */

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Grid from './Grid';

declare var test: any;
declare var expect: any;

test('should render Grid with dom server', () => {
  const rendered = ReactDOMServer.renderToString(
    <Grid
      cellRenderer={({style, key, rowIndex, columnIndex}) => (
        <div style={style} key={key}>
          {rowIndex + ':' + columnIndex}
        </div>
      )}
      columnCount={1000}
      columnWidth={20}
      height={500}
      rowCount={1000}
      rowHeight={20}
      width={500}
    />,
  );

  expect(rendered).toContain('0:0');
  expect(rendered).toContain('24:24');
  expect(rendered).not.toContain('25:25');
});

test('should support :scrollToColumn and :scrollToRow in server render', () => {
  const rendered = ReactDOMServer.renderToString(
    <Grid
      cellRenderer={({style, key, rowIndex, columnIndex}) => (
        <div style={style} key={key}>
          {rowIndex + ':' + columnIndex}
        </div>
      )}
      columnCount={1000}
      columnWidth={20}
      scrollToColumn={250}
      height={500}
      rowCount={1000}
      rowHeight={20}
      scrollToRow={250}
      width={500}
    />,
  );

  expect(rendered).toContain('250:250');
  expect(rendered).not.toContain('0:0');
});
