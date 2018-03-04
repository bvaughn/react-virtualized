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

const renderWindowScroller = ({scrollElement}) => {
  const {render} = window.ReactDOM;
  const {createElement} = window.React;
  const {WindowScroller} = window.ReactVirtualized;

  const container = document.createElement('div');
  container.id = 'container';
  container.style.margin = '100px';
  container.style.padding = '50px';
  document.body.appendChild(container);
  document.body.style.margin = 0;

  if (scrollElement === 'container') {
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'auto';
  }

  render(
    createElement(
      WindowScroller,
      {
        scrollElement: scrollElement === 'container' ? container : window,
        onScroll: window.scrollFn,
        onResize: window.resizeFn,
      },
      () => createElement('div', {style: {width: 2000, height: 3000}}),
    ),
    container,
  );
};

const delay = time => new Promise(resolve => setTimeout(resolve, time));

test('save position after resize and then scroll in window', async () => {
  const page = await bootstrap();
  const scrollFn = jest.fn();
  const resizeFn = jest.fn();
  await page.exposeFunction('scrollFn', scrollFn);
  await page.exposeFunction('resizeFn', resizeFn);

  await page.setViewport({width: 400, height: 600});
  await page.evaluate(renderWindowScroller, {scrollElement: 'window'});

  // scroll more than viewport
  await page.evaluate(() => window.scrollTo(610, 830));
  await delay(100);
  // resize a bit container/window
  await page.setViewport({width: 300, height: 500});
  await delay(100);
  // scroll again
  await page.evaluate(() => window.scrollTo(620, 840));
  await delay(100);

  await page.close();

  expect(scrollFn.mock.calls).toEqual([
    [{scrollLeft: 610 - 150, scrollTop: 830 - 150}],
    [{scrollLeft: 620 - 150, scrollTop: 840 - 150}],
  ]);
  expect(resizeFn.mock.calls).toEqual([[{width: 300, height: 500}]]);
});

test('save position after resize and then scroll in container', async () => {
  const page = await bootstrap();
  const scrollFn = jest.fn();
  const resizeFn = jest.fn();
  await page.exposeFunction('scrollFn', scrollFn);
  await page.exposeFunction('resizeFn', resizeFn);

  await page.setViewport({width: 400, height: 600});
  await page.evaluate(renderWindowScroller, {scrollElement: 'container'});

  // scroll more than viewport
  await page.$eval('#container', el => el.scrollTo(610, 830));
  await delay(100);
  // resize a bit container/window
  await page.setViewport({width: 300, height: 500});
  await delay(100);
  // scroll again
  await page.$eval('#container', el => el.scrollTo(620, 840));
  await delay(100);

  await page.close();

  expect(scrollFn.mock.calls).toEqual([
    [{scrollLeft: 610 - 50, scrollTop: 830 - 50}],
    [{scrollLeft: 620 - 50, scrollTop: 840 - 50}],
  ]);
  expect(resizeFn.mock.calls).toEqual([
    [{width: 500, height: 700}],
    [{width: 400, height: 600}],
  ]);
});

test('react on container resize without window changing', async () => {
  const page = await bootstrap();
  const resizeFn = jest.fn();
  await page.exposeFunction('resizeFn', resizeFn);

  await page.evaluate(() => {
    const {render} = window.ReactDOM;
    const {createElement} = window.React;
    const {WindowScroller} = window.ReactVirtualized;

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    Object.assign(wrapper.style, {
      width: '1000px',
      height: '800px',
      display: 'flex',
    });
    const container = document.createElement('div');
    Object.assign(container.style, {
      flex: '1',
    });
    wrapper.appendChild(container);
    document.body.style.margin = 0;
    document.body.appendChild(wrapper);

    render(
      createElement(
        WindowScroller,
        {scrollElement: container, onResize: window.resizeFn},
        () => null,
      ),
      container,
    );
  });

  await delay(100);

  await page.$eval('#wrapper', el => {
    el.style.width = '500px';
    el.style.height = '700px';
  });

  await delay(100);

  await page.close();

  expect(resizeFn.mock.calls).toEqual([
    [{width: 1000, height: 800}],
    [{width: 500, height: 700}],
  ]);
});
