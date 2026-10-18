import { expect, test } from "@playwright/test";
import { CONTAINER_HEIGHT, HEADER_HEIGHT, ROW_COUNT, ROW_HEIGHT } from "../src";
import {
  expectVisibleRowsRendered,
  open,
  scrollTo,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH
} from "./utils";

const LIST_TOP = HEADER_HEIGHT;

test("the rendered rows follow the height of a container that is resized", async ({
  page
}) => {
  const rowsOptions = {
    exact: true,
    grid: "#list",
    rowCount: ROW_COUNT,
    scroller: "#container"
  };

  await open(page, "/scroll-element/list?scrollElement=container&overscan=0");
  await scrollTo(page, "#container", LIST_TOP + 100 * ROW_HEIGHT);

  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible.length).toBe(CONTAINER_HEIGHT / ROW_HEIGHT);

  // The container gets taller (the window doesn't change size)
  for (const height of [700, 150, 425]) {
    await page.evaluate((height) => {
      document.querySelector<HTMLElement>("#container")!.style.height =
        `${height}px`;
    }, height);

    ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
    expect(visible[0]).toBe(100);
    expect(visible.length).toBe(Math.ceil(height / ROW_HEIGHT));
  }
});

test("the rendered rows follow the height of the window", async ({ page }) => {
  const rowsOptions = {
    exact: true,
    grid: "#list",
    rowCount: ROW_COUNT,
    scroller: "window"
  };

  await open(page, "/scroll-element/list?scrollElement=window&overscan=0");
  await scrollTo(page, "window", LIST_TOP + 100 * ROW_HEIGHT);

  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible.length).toBe(VIEWPORT_HEIGHT / ROW_HEIGHT);

  for (const height of [900, 300, 625]) {
    await page.setViewportSize({ width: VIEWPORT_WIDTH, height });
    expect(await page.evaluate(() => window.innerHeight)).toBe(height);

    ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
    expect(visible[0]).toBe(100);
    expect(visible.length).toBe(Math.ceil(height / ROW_HEIGHT));
  }
});
