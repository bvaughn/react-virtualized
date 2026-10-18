import { expect, test, type Page } from "@playwright/test";
import {
  COLUMN_COUNT,
  COLUMN_WIDTH,
  CONTAINER_HEIGHT,
  HEADER_HEIGHT,
  ROW_COUNT,
  ROW_HEIGHT
} from "../src";
import {
  expectScrollTop,
  expectVisibleRowsRendered,
  getScrollTop,
  open,
  scrollTo
} from "./utils";

const GRID_TOP = HEADER_HEIGHT;

const rowsOptions = {
  grid: "#grid",
  rowCount: ROW_COUNT,
  scroller: "#container"
};

async function render(page: Page) {
  await open(page, "/scroll-element/grid?scrollElement=container");
  await expect(
    page.locator('[data-row-index="0"][data-column-index="0"]')
  ).toBeAttached();
}

function getGridScrollLeft(page: Page) {
  return page.evaluate(() => document.querySelector("#grid")!.scrollLeft);
}

// Asserts that the columns visible within the Grid (which scrolls horizontally itself) are rendered, for each visible row
async function expectVisibleColumnsRendered(page: Page) {
  await expect(async () => {
    const { rendered, visible } = await page.evaluate(
      ({ columnCount, columnWidth }) => {
        const grid = document.querySelector("#grid")!;
        const first = Math.floor(grid.scrollLeft / columnWidth);
        const last = Math.min(
          columnCount - 1,
          Math.ceil((grid.scrollLeft + grid.clientWidth) / columnWidth) - 1
        );
        const visible: number[] = [];
        for (let index = first; index <= last; index++) {
          visible.push(index);
        }

        // Columns rendered for each row
        const rendered: Record<string, number[]> = {};
        grid.querySelectorAll("[data-column-index]").forEach((cell) => {
          const rowIndex = cell.getAttribute("data-row-index")!;
          (rendered[rowIndex] ??= []).push(
            Number(cell.getAttribute("data-column-index"))
          );
        });
        return { rendered, visible };
      },
      { columnCount: COLUMN_COUNT, columnWidth: COLUMN_WIDTH }
    );

    const rows = Object.values(rendered);
    expect(rows.length).toBeGreaterThan(0);
    for (const columns of rows) {
      expect(columns).toEqual(expect.arrayContaining(visible));
    }
  }).toPass({ timeout: 2_000 });
}

test("renders the rows visible within the container, and scrolls horizontally itself", async ({
  page
}) => {
  await render(page);

  // The Grid renders at its full height (plus its horizontal scrollbar, if any)
  const box = await page.locator("#grid").boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(ROW_COUNT * ROW_HEIGHT);

  await expectVisibleRowsRendered(page, rowsOptions);
  await expectVisibleColumnsRendered(page);

  // Scrolling the container scrolls the Grid vertically
  await scrollTo(page, "#container", GRID_TOP + 300 * ROW_HEIGHT + 10);
  const { rendered, visible } = await expectVisibleRowsRendered(
    page,
    rowsOptions
  );
  expect(visible[0]).toBe(300);
  expect(rendered).not.toContain(0);

  // The Grid still scrolls horizontally itself
  await page.evaluate(() => {
    document.querySelector("#grid")!.scrollLeft = 1550;
  });
  await expectVisibleColumnsRendered(page);
  await expect(
    page.locator('[data-row-index="300"][data-column-index="15"]')
  ).toBeInViewport();
  await expect(
    page.locator('[data-row-index="300"][data-column-index="0"]')
  ).not.toBeAttached();

  // Scrolling horizontally does not scroll the container
  expect(await getScrollTop(page, "#container")).toBe(
    GRID_TOP + 300 * ROW_HEIGHT + 10
  );

  // Scrolling vertically keeps the horizontal offset
  await scrollTo(page, "#container", GRID_TOP + 600 * ROW_HEIGHT);
  await expectVisibleRowsRendered(page, rowsOptions);
  await expectVisibleColumnsRendered(page);
  expect(await getGridScrollLeft(page)).toBe(1550);
});

test("scrollToCell scrolls the container vertically and the Grid horizontally", async ({
  page
}) => {
  await render(page);

  const clientWidth = await page.evaluate(
    () => document.querySelector("#grid")!.clientWidth
  );

  await page.evaluate(() =>
    window.grid!.scrollToCell({ columnIndex: 20, rowIndex: 300 })
  );
  await expectScrollTop(
    page,
    "#container",
    GRID_TOP + 301 * ROW_HEIGHT - CONTAINER_HEIGHT
  );
  await expect
    .poll(() => getGridScrollLeft(page))
    .toBe(21 * COLUMN_WIDTH - clientWidth);
  await expectVisibleRowsRendered(page, rowsOptions);
  await expectVisibleColumnsRendered(page);
  await expect(
    page.locator('[data-row-index="300"][data-column-index="20"]')
  ).toBeInViewport();

  await page.evaluate(() =>
    window.grid!.scrollToCell({ columnIndex: 2, rowIndex: 50 })
  );
  await expectScrollTop(page, "#container", GRID_TOP + 50 * ROW_HEIGHT);
  await expect.poll(() => getGridScrollLeft(page)).toBe(2 * COLUMN_WIDTH);
  await expectVisibleRowsRendered(page, rowsOptions);
  await expectVisibleColumnsRendered(page);

  // scrollToPosition scrolls the container vertically and the Grid horizontally
  await page.evaluate(() =>
    window.grid!.scrollToPosition({ scrollLeft: 750, scrollTop: 4321 })
  );
  await expectScrollTop(page, "#container", GRID_TOP + 4321);
  await expect.poll(() => getGridScrollLeft(page)).toBe(750);
  await expectVisibleRowsRendered(page, rowsOptions);
  await expectVisibleColumnsRendered(page);
});
