import React from 'react';
import reactDom from 'react-dom/server';
import test from 'tape';
import dom from 'cheerio';

import createTitle from '../../source/title';

const Title = createTitle(React);
const render = reactDom.renderToStaticMarkup;

test('Title', assert => {
  const titleText = 'Hello!';
  const props = {
    title: titleText,
    className: 'title'
  };
  const re = new RegExp(titleText, 'g');
  const el = <Title { ...props } />;
  const $ = dom.load(render(el));
  const output = $('.title').html();

  const actual = re.test(output);
  const expected = true;

  assert.equal(actual, expected,
    'should output the correct title text');

  assert.end();
});
