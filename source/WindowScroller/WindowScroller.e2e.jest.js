/**
 * @jest-environment ./source/jest-puppeteer-environment.js
 */

const bootstrap = async () => {
  const page = await global.__BROWSER__.newPage();
  const scripts = [
    "./node_modules/react/umd/react.development.js",
    "./node_modules/react-dom/umd/react-dom.development.js",
    "./dist/umd/react-virtualized.js"
  ];

  for (const path of scripts) {
    await page.addScriptTag({ path });
  }

  return page;
};

const renderWindowScroller = ({ scrollElement }) => {
  const { render } = window.ReactDOM;
  const { createElement } = window.React;
  const { WindowScroller } = window.ReactVirtualized;

  const container = document.createElement("div");
  container.id = "container";
  container.style.margin = "100px";
  container.style.padding = "50px";
  document.body.appendChild(container);
  document.body.style.margin = 0;

  if (scrollElement === "container") {
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.overflow = "auto";
  }

  render(
    createElement(
      WindowScroller,
      { scrollElement: scrollElement === "container" ? container : window },
      ({ height, scrollLeft, scrollTop, width }) =>
        createElement(
          "div",
          {
            id: "box",
            style: {
              width: 2000,
              height: 3000
            }
          },
          JSON.stringify({
            height,
            scrollLeft,
            scrollTop,
            width
          })
        )
    ),
    container
  );
};

const delay = time => new Promise(resolve => setTimeout(resolve, time));

test("save position after resize and then scroll in window", async () => {
  const page = await bootstrap();

  await page.evaluate(renderWindowScroller, { scrollElement: "window" });

  // scroll more than viewport
  await page.setViewport({ width: 400, height: 600 });
  await delay(100);
  await page.evaluate(() => window.scrollTo(610, 830));
  await delay(100);
  const result1 = await page.$eval("#box", el => JSON.parse(el.textContent));
  expect(result1).toEqual({
    width: 400,
    scrollLeft: 460,
    scrollTop: 680,
    height: 600
  });

  // resize a bit container/window and then scroll
  await page.setViewport({ width: 300, height: 500 });
  await delay(100);
  await page.evaluate(() => window.scrollTo(620, 840));
  await delay(100);
  const result2 = await page.$eval("#box", el => JSON.parse(el.textContent));
  expect(result2).toEqual({
    width: 300,
    scrollLeft: 470,
    scrollTop: 690,
    height: 500
  });

  await page.close();
});

test("save position after resize and then scroll in container", async () => {
  const page = await bootstrap();

  await page.evaluate(renderWindowScroller, { scrollElement: "container" });

  // scroll more than viewport
  await page.setViewport({ width: 400, height: 600 });
  await delay(100);
  await page.$eval("#container", el => el.scrollTo(610, 830));
  await delay(100);
  const result1 = await page.$eval("#box", el => JSON.parse(el.textContent));
  expect(result1).toEqual({
    width: 500,
    scrollLeft: 560,
    scrollTop: 780,
    height: 700
  });

  // resize a bit container/window and the scroll
  await page.setViewport({ width: 300, height: 500 });
  await delay(100);
  await page.$eval("#container", el => el.scrollTo(620, 840));
  await delay(100);
  const result2 = await page.$eval("#box", el => JSON.parse(el.textContent));
  expect(result2).toEqual({
    width: 400,
    scrollLeft: 570,
    scrollTop: 790,
    height: 600
  });

  await page.close();
});
