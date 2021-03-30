/**
 * @jest-environment jest-environment-puppeteer
 */

const bootstrap = async () => {
  const page = await global.browser.newPage();
  const scripts = [
    './node_modules/react/umd/react.development.js',
    './node_modules/react-dom/umd/react-dom.development.js',
    './dist/umd/react-virtualized.js',
  ];

  for (const path of scripts) {
    await page.addScriptTag({path});
  }

  return page;
};

const renderWindowScroller = updateScrollTopOnUpdatePosition => {
  const {render} = window.ReactDOM;
  const {createElement, useState, useEffect} = window.React;
  const {WindowScroller} = window.ReactVirtualized;

  const container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);
  document.body.style.margin = 0;

  function Header({height}) {
    return createElement('div', {style: {height, backgroundColor: 'red'}});
  }

  function App() {
    const [height, setHeight] = useState(100);
    window.setHeaderHeight = setHeight;
    useEffect(() => () => (window.setHeaderHeight = null));

    return createElement(
      'div',
      {},
      createElement(Header, {height}),
      createElement(
        WindowScroller,
        {
          updateScrollTopOnUpdatePosition,
          ref: windowScroller => {
            window.windowScroller = windowScroller;
          },
          onScroll: window.scrollFn,
          onResize: window.resizeFn,
        },
        ({width, scrollTop}) => {
          console.log({scrollTop});
          window.windowScrollerScrollTop = scrollTop;
          return createElement('div', {
            style: {
              width,
              height: 3000,
              backgroundColor: 'yellow',
            },
          });
        },
      ),
    );
  }

  render(
    createElement(
      'div',
      {'data-test-id': 'main-container'},
      createElement(App, {}),
    ),
    container,
  );
};

jest.setTimeout(1200000);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

test('will react to header height updates if notified through updatePosition', async () => {
  const page = await bootstrap();
  const scrollFn = jest.fn();
  const resizeFn = jest.fn();
  await page.exposeFunction('scrollFn', scrollFn);
  await page.exposeFunction('resizeFn', resizeFn);

  await page.setViewport({width: 400, height: 600});
  await page.evaluate(renderWindowScroller, true);

  const el = await page.$('[data-test-id="main-container"]');
  expect(el).not.toBeNull();

  await page.evaluate(() => window.scrollTo(0, 200));
  await delay(500);

  {
    const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
    expect(scrollTop).toEqual(100);
  }
  await delay(500);

  // Update the header height
  await page.evaluate(() => {
    console.log('change header height');
    window.setHeaderHeight(200);
  });
  await delay(500);

  await page.evaluate(() => {
    console.log('update position');
    window.windowScroller.updatePosition();
  });
  await delay(500);

  // Despite header updates, we'd expect the scrollTop to be the same.
  {
    const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
    expect(scrollTop).toEqual(100);
  }
});

test('will NOT react to header height updates if notified through updatePosition if `updateScrollTopOnUpdatePosition` is false', async () => {
  const page = await bootstrap();
  const scrollFn = jest.fn();
  const resizeFn = jest.fn();
  await page.exposeFunction('scrollFn', scrollFn);
  await page.exposeFunction('resizeFn', resizeFn);

  await page.setViewport({width: 400, height: 600});
  await page.evaluate(renderWindowScroller, false);

  const el = await page.$('[data-test-id="main-container"]');
  expect(el).not.toBeNull();

  await page.evaluate(() => window.scrollTo(0, 200));
  await delay(500);

  {
    const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
    expect(scrollTop).toEqual(100);
  }
  await delay(500);

  // Update the header height
  await page.evaluate(() => {
    console.log('change header height');
    window.setHeaderHeight(200);
  });
  await delay(500);

  await page.evaluate(() => {
    console.log('update position');
    window.windowScroller.updatePosition();
  });
  await delay(500);

  // Despite header updates, we'd expect the scrollTop to be the same.
  // As the fix is off, this will fail.
  const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
  expect(() => {
    expect(scrollTop).toEqual(100);
  }).toThrow();
});

test('will properly process scroll events after header height updates', async () => {
  const page = await bootstrap();
  const scrollFn = jest.fn();
  const resizeFn = jest.fn();
  await page.exposeFunction('scrollFn', scrollFn);
  await page.exposeFunction('resizeFn', resizeFn);

  await page.setViewport({width: 400, height: 600});
  await page.evaluate(renderWindowScroller, true);

  const el = await page.$('[data-test-id="main-container"]');
  expect(el).not.toBeNull();

  await page.evaluate(() => window.scrollTo(0, 200));
  await delay(500);

  {
    const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
    expect(scrollTop).toEqual(100);
  }
  await delay(500);

  // Update the header height
  await page.evaluate(() => {
    window.setHeaderHeight(200);
  });
  await delay(500);

  await page.evaluate(() => {
    window.windowScroller.updatePosition();
  });
  await delay(500);
  // This is only 50px under the first position
  await page.evaluate(() => window.scrollTo(0, 350));

  {
    const scrollTop = await page.evaluate(() => window.windowScrollerScrollTop);
    expect(scrollTop).toEqual(150);
  }
});
