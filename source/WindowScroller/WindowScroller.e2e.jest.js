/**
 * @jest-environment ./source/jest-puppeteer-environment.js
 */

const browser: Browser = global.__BROWSER__;

const addScripts = async page => {
  await page.addScriptTag({
    path: './node_modules/react/umd/react.development.js',
  });
  await page.addScriptTag({
    path: './node_modules/react-dom/umd/react-dom.development.js',
  });
  await page.addScriptTag({path: './dist/umd/react-virtualized.js'});
};

const renderWindowScroller = ({scrollElement}) => {
  const {render} = window.ReactDOM;
  const {createElement} = window.React;
  const {WindowScroller} = window.ReactVirtualized;

  const container = document.createElement('div');
  container.style.margin = '100px';
  container.style.padding = '50px';
  document.body.appendChild(container);
  document.body.style.margin = 0;

  if (scrollElement === 'container') {
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'auto';
    window.container = container;
  }

  render(
    createElement(
      WindowScroller,
      {scrollElement: scrollElement === 'container' ? container : window},
      ({height, scrollLeft, scrollTop, width}) =>
        createElement(
          'div',
          {
            id: 'box',
            style: {
              width: 2000,
              height: 3000,
            },
          },
          JSON.stringify({
            height,
            scrollLeft,
            scrollTop,
            width,
          }),
        ),
    ),
    container,
  );
};

const getJsonFromContent = async (selector, page) => {
  const elementHandle = await page.$(selector);
  const contentHandle = await elementHandle.getProperty('textContent');
  const value = await contentHandle.jsonValue();
  return JSON.parse(value);
};

const delay = time => new Promise(resolve => setTimeout(resolve, time));

test('save position after resize and then scroll in window', async () => {
  const page = await browser.newPage();

  await addScripts(page);

  await page.evaluate(renderWindowScroller, {scrollElement: 'window'});

  // scroll more than viewport
  await page.setViewport({height: 600, width: 400});
  await delay(100);
  await page.evaluate(() => window.scrollTo(/* left */ 610, /* top */ 830));
  await delay(100);
  expect(await getJsonFromContent('#box', page)).toEqual({
    width: 400,
    scrollLeft: 460,
    scrollTop: 680,
    height: 600,
  });

  // resize a bit container/window and then scroll
  await page.setViewport({height: 500, width: 300});
  await delay(100);
  await page.evaluate(() => window.scrollTo(/* left */ 620, /* top */ 840));
  await delay(100);
  expect(await getJsonFromContent('#box', page)).toEqual({
    width: 300,
    scrollLeft: 470,
    scrollTop: 690,
    height: 500,
  });

  await page.close();
});

test('save position after resize and then scroll in container', async () => {
  const page = await browser.newPage();

  await addScripts(page);

  await page.evaluate(renderWindowScroller, {scrollElement: 'container'});

  // scroll more than viewport
  await page.setViewport({height: 600, width: 400});
  await delay(100);
  await page.evaluate(() =>
    window.container.scrollTo(/* left */ 610, /* top */ 830),
  );
  await delay(100);
  expect(await getJsonFromContent('#box', page)).toEqual({
    width: 500,
    scrollLeft: 560,
    scrollTop: 780,
    height: 700,
  });

  // resize a bit container/window and the scroll
  await page.setViewport({height: 500, width: 300});
  await delay(100);
  await page.evaluate(() =>
    window.container.scrollTo(/* left */ 620, /* top */ 840),
  );
  await delay(100);
  expect(await getJsonFromContent('#box', page)).toEqual({
    width: 400,
    scrollLeft: 570,
    scrollTop: 790,
    height: 600,
  });

  await page.close();
});
