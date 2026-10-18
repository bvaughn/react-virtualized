import { expect, test, type Page } from "@playwright/test";
import { getMasonryCellHeight, HEADER_HEIGHT, MASONRY_SPACER } from "../src";
import { open, scrollTo, VIEWPORT_HEIGHT } from "./utils";

async function render(page: Page) {
  await open(page, "/scroll-element/masonry");
  await expect(page.locator('[data-cell-index="0"]')).toBeAttached();
}

// Measures the rendered cells, and the parts of the window (within the Masonry) that no rendered cell covers, per column
function getCellsInfo(page: Page) {
  return page.evaluate(
    ({ spacer }) => {
      const masonry = document.querySelector("#masonry")!;
      const masonryRect = masonry.getBoundingClientRect();
      const top = Math.max(0, masonryRect.top);
      const bottom = Math.min(window.innerHeight, masonryRect.bottom);

      const cells = Array.from(
        masonry.querySelectorAll<HTMLElement>("[data-cell-index]")
      ).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          index: Number(element.getAttribute("data-cell-index")),
          left: Math.round(rect.left),
          top: rect.top
        };
      });

      // Uncovered intervals of each column within the window (allowing for the space between cells).
      // (The tests don't scroll to the end of the Masonry, where the columns end at different heights.)
      const columns = new Map<number, typeof cells>();
      for (const cell of cells) {
        columns.set(cell.left, [...(columns.get(cell.left) ?? []), cell]);
      }
      const gaps: { bottom: number; left: number; top: number }[] = [];
      for (const [left, columnCells] of columns) {
        let covered = top;
        for (const cell of columnCells
          .filter((cell) => cell.bottom > top && cell.top < bottom)
          .sort((a, b) => a.top - b.top)) {
          if (cell.top > covered + spacer + 1) {
            gaps.push({ bottom: cell.top, left, top: covered });
          }
          covered = Math.max(covered, cell.bottom);
        }
        if (covered + spacer + 1 < bottom) {
          gaps.push({ bottom, left, top: covered });
        }
      }

      return {
        cells: cells.map(({ height, index }) => ({ height, index })),
        columnCount: columns.size,
        gaps,
        masonryTop: masonryRect.top
      };
    },
    { spacer: MASONRY_SPACER }
  );
}

async function expectVisibleCellsRendered(page: Page) {
  await expect(async () => {
    const { cells, columnCount, gaps } = await getCellsInfo(page);
    expect(cells.length).toBeGreaterThan(0);
    expect(columnCount).toBe(3);
    expect(gaps).toEqual([]);
  }).toPass({ timeout: 2_000 });

  return getCellsInfo(page);
}

test("renders the cells visible within the window while it is scrolled", async ({
  page
}) => {
  await render(page);

  const initial = await expectVisibleCellsRendered(page);
  expect(initial.masonryTop).toBe(HEADER_HEIGHT);
  let { cells } = initial;
  for (const { height, index } of cells) {
    expect(height).toBe(getMasonryCellHeight(index));
  }

  // Scroll down gradually (cells are measured as they are rendered)
  for (let scrollTop = 500; scrollTop <= 10_000; scrollTop += 500) {
    await scrollTo(page, "window", scrollTop);
    ({ cells } = await expectVisibleCellsRendered(page));
  }
  expect(cells.map(({ index }) => index)).not.toContain(0);

  // Jump far ahead (the cells in between are measured first)
  await scrollTo(page, "window", 30_000);
  ({ cells } = await expectVisibleCellsRendered(page));
  expect(Math.min(...cells.map(({ index }) => index))).toBeGreaterThan(400);

  // Jump back up
  await scrollTo(page, "window", 2_000);
  ({ cells } = await expectVisibleCellsRendered(page));
  expect(cells.map(({ index }) => index)).not.toContain(0);

  await scrollTo(page, "window", 0);
  ({ cells } = await expectVisibleCellsRendered(page));
  expect(cells.map(({ index }) => index)).toContain(0);

  // The Masonry is taller than the window (it renders at its full height)
  const box = await page.locator("#masonry").boundingBox();
  expect(box!.height).toBeGreaterThan(10_000 + VIEWPORT_HEIGHT);
});
