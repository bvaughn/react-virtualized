import { expect, test, type Page } from "@playwright/test";
import { ROW_COUNT, ROW_HEIGHT } from "../src";
import {
  expectVisibleRowsRendered,
  getScrollTop,
  open,
  scrollTo
} from "./utils";

// The header above the List changes height without the List re-rendering
// (the header's height is its own state; see integrations/vite/src/components/Header.tsx).
// The List measures its position within the window when the window scrolls or is resized, and when it re-renders (e.g. forceUpdateGrid()).

// Without overscanning, so that any rows that aren't rendered for the actual viewport show up as a gap.
// (Not exact: while the top of the List is below the top of the viewport, it renders a viewport's height of rows.)
const rowsOptions = {
  grid: "#list",
  rowCount: ROW_COUNT,
  scroller: "window"
};

async function render(page: Page, headerHeight: number) {
  await open(
    page,
    `/scroll-element/list?scrollElement=window&headerHeight=${headerHeight}&overscan=0`
  );
  await expect(page.locator('[data-row-index="0"]')).toBeAttached();
}

function setHeaderHeight(page: Page, height: number) {
  return page.evaluate((height) => window.setHeaderHeight!(height), height);
}

function forceUpdateGrid(page: Page) {
  return page.evaluate(() => window.list!.forceUpdateGrid());
}

function disableScrollAnchoring(page: Page) {
  return page.evaluate(() => {
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
  });
}

test("header resize while the page is scrolled (with scroll anchoring)", async ({
  page
}) => {
  await render(page, 200);

  await scrollTo(page, "window", 200 + 50 * ROW_HEIGHT);
  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible[0]).toBe(50);

  // The browser's scroll anchoring keeps the (visible) rows in place by adjusting the scroll position;
  // the resulting scroll event updates the List
  for (const height of [600, 0, 350]) {
    await setHeaderHeight(page, height);
    ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
    expect(visible[0]).toBe(50);
    expect(await getScrollTop(page, "window")).toBe(height + 50 * ROW_HEIGHT);
  }
});

test("header resize at scrollTop 0, followed by forceUpdateGrid()", async ({
  page
}) => {
  await render(page, 400);

  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible).toEqual([0, 1, 2, 3]);

  // The List gets more space in the viewport
  await setHeaderHeight(page, 0);
  await forceUpdateGrid(page);
  ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
  expect(visible.length).toBe(600 / ROW_HEIGHT);

  // ... and less
  await setHeaderHeight(page, 500);
  await forceUpdateGrid(page);
  ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
  expect(visible).toEqual([0, 1]);

  expect(await getScrollTop(page, "window")).toBe(0);

  // Scrolling still renders the right rows (the new position of the List is used)
  await scrollTo(page, "window", 500 + 20 * ROW_HEIGHT);
  ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
  expect(visible[0]).toBe(20);
});

test("header resize while the header is partially scrolled out of view, followed by forceUpdateGrid()", async ({
  page
}) => {
  await render(page, 200);

  await scrollTo(page, "window", 100);
  await expectVisibleRowsRendered(page, rowsOptions);

  // (The header is the scroll anchor, so the scroll position isn't adjusted: the List moves up by 200px)
  await setHeaderHeight(page, 0);
  await forceUpdateGrid(page);
  const { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible[0]).toBe(2);
});

test("header resize while the page is scrolled, without scroll anchoring", async ({
  page
}) => {
  await render(page, 200);
  await disableScrollAnchoring(page);

  await scrollTo(page, "window", 200 + 50 * ROW_HEIGHT);
  await expectVisibleRowsRendered(page, rowsOptions);

  // The List moves down by 400px (the scroll position isn't adjusted), until the List re-measures its position
  await setHeaderHeight(page, 600);
  await forceUpdateGrid(page);
  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible[0]).toBe(50 - 400 / ROW_HEIGHT);

  // The next scroll event also re-measures the position of the List
  await setHeaderHeight(page, 0);
  await scrollTo(page, "window", 200 + 50 * ROW_HEIGHT + 10);
  ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
  expect(visible[0]).toBe(54);
  expect(await getScrollTop(page, "window")).toBe(200 + 50 * ROW_HEIGHT + 10);
});
