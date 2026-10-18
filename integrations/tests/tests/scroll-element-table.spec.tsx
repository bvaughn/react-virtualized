import { expect, test, type Page } from "@playwright/test";
import {
  HEADER_HEIGHT,
  ROW_COUNT,
  ROW_HEIGHT,
  TABLE_HEADER_HEIGHT
} from "../src";
import {
  expectScrollTop,
  expectVisibleRowsRendered,
  open,
  scrollTo,
  VIEWPORT_HEIGHT
} from "./utils";

// The rows start below the page header and the Table's header row
const ROWS_TOP = HEADER_HEIGHT + TABLE_HEADER_HEIGHT;

const rowsOptions = {
  grid: ".ReactVirtualized__Table__Grid",
  indexAttribute: "aria-rowindex",
  row: ".ReactVirtualized__Table__row",
  rowCount: ROW_COUNT,
  scroller: "window"
};

async function render(page: Page) {
  await open(page, "/scroll-element/table");
  await expect(page.locator('[aria-rowindex="1"]')).toBeAttached();
}

function getRowBox(page: Page, index: number) {
  return page.locator(`[aria-rowindex="${index + 1}"]`).boundingBox();
}

test("the header row scrolls with the page, and the rows visible within the window are rendered", async ({
  page
}) => {
  await render(page);

  const headerRow = page.locator(".ReactVirtualized__Table__headerRow");
  expect((await headerRow.boundingBox())?.y).toBe(HEADER_HEIGHT);

  let { visible } = await expectVisibleRowsRendered(page, rowsOptions);
  expect(visible[0]).toBe(0);
  expect(visible.length).toBe(
    Math.ceil((VIEWPORT_HEIGHT - ROWS_TOP) / ROW_HEIGHT)
  );

  // The rows (all of them, below the header row) fill the window
  await scrollTo(page, "window", HEADER_HEIGHT + 10);
  await expectVisibleRowsRendered(page, rowsOptions);
  expect((await headerRow.boundingBox())?.y).toBe(-10);

  await scrollTo(page, "window", ROWS_TOP + 300 * ROW_HEIGHT + 20);
  ({ visible } = await expectVisibleRowsRendered(page, rowsOptions));
  expect(visible[0]).toBe(300);
  expect(visible.length).toBe(VIEWPORT_HEIGHT / ROW_HEIGHT + 1);
  await expect(headerRow).not.toBeInViewport();
});

test("scrollToRow scrolls the window, taking the header row into account", async ({
  page
}) => {
  await render(page);

  // "auto" aligns the row with the bottom of the window
  await page.evaluate(() => window.table!.scrollToRow({ index: 500 }));
  await expectScrollTop(
    page,
    "window",
    ROWS_TOP + 501 * ROW_HEIGHT - VIEWPORT_HEIGHT
  );
  await expectVisibleRowsRendered(page, rowsOptions);
  let box = await getRowBox(page, 500);
  expect(box!.y + box!.height).toBe(VIEWPORT_HEIGHT);

  // "start" aligns the row with the top of the window
  await page.evaluate(() =>
    window.table!.scrollToRow({ align: "start", index: 10 })
  );
  await expectScrollTop(page, "window", ROWS_TOP + 10 * ROW_HEIGHT);
  await expectVisibleRowsRendered(page, rowsOptions);
  box = await getRowBox(page, 10);
  expect(box!.y).toBe(0);

  await page.evaluate(() =>
    window.table!.scrollToRow({ align: "center", index: 200 })
  );
  await expectScrollTop(
    page,
    "window",
    ROWS_TOP + 200 * ROW_HEIGHT - (VIEWPORT_HEIGHT - ROW_HEIGHT) / 2
  );
  box = await getRowBox(page, 200);
  expect(box!.y).toBe((VIEWPORT_HEIGHT - ROW_HEIGHT) / 2);

  await page.evaluate(() =>
    window.table!.scrollToPosition({ scrollTop: 1000 })
  );
  await expectScrollTop(page, "window", ROWS_TOP + 1000);
  await expectVisibleRowsRendered(page, rowsOptions);
  box = await getRowBox(page, 1000 / ROW_HEIGHT);
  expect(box!.y).toBe(0);
});
