import { expect, type Page } from "@playwright/test";
import { ROW_HEIGHT } from "../src";

export const HOST = "http://localhost:3012";

export const VIEWPORT_WIDTH = 1000;
export const VIEWPORT_HEIGHT = 600;

export async function open(page: Page, path: string) {
  await page.setViewportSize({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT
  });
  await page.goto(`${HOST}${path}`);
  await expect(page.locator('[data-test-id="header"]')).toBeAttached();
}

/** The scroll element of a scenario: the window, or a scrollable element (CSS selector). */
export type Scroller = "window" | string;

export async function getScrollTop(page: Page, scroller: Scroller) {
  return page.evaluate(
    (scroller) =>
      scroller === "window"
        ? window.scrollY
        : document.querySelector(scroller)!.scrollTop,
    scroller
  );
}

export async function scrollTo(page: Page, scroller: Scroller, top: number) {
  await page.evaluate(
    ({ scroller, top }) => {
      if (scroller === "window") {
        window.scrollTo(0, top);
      } else {
        document.querySelector(scroller)!.scrollTop = top;
      }
    },
    { scroller, top }
  );
}

export type RowsInfo = {
  /** Indices of the rows (partially) visible within the scroll element's viewport. */
  visible: number[];

  /** Indices of the rendered rows. */
  rendered: number[];

  /** Rendered rows that are not where they should be (relative to the top of the component). */
  misplaced: number[];
};

/**
 * Measures which rows of a virtualized component are visible within its scroll element's viewport, and which are rendered.
 *
 * - `grid`: selector of the element whose top is the top of the first row
 * - `row`: selector of the rendered rows (within `grid`)
 * - `indexAttribute`: attribute of a row containing its index (`aria-rowindex` is 1-based)
 */
export async function getRowsInfo(
  page: Page,
  {
    grid,
    indexAttribute = "data-row-index",
    row = "[data-row-index]",
    rowCount,
    rowHeight = ROW_HEIGHT,
    scroller
  }: {
    grid: string;
    indexAttribute?: string;
    row?: string;
    rowCount: number;
    rowHeight?: number;
    scroller: Scroller;
  }
): Promise<RowsInfo> {
  return page.evaluate(
    ({ grid, indexAttribute, row, rowCount, rowHeight, scroller }) => {
      let viewportTop = 0;
      let viewportBottom = window.innerHeight;
      if (scroller !== "window") {
        const element = document.querySelector(scroller)!;
        viewportTop = element.getBoundingClientRect().top + element.clientTop;
        viewportBottom = viewportTop + element.clientHeight;
      }

      const gridElement = document.querySelector(grid)!;
      const gridTop = gridElement.getBoundingClientRect().top;

      const visible: number[] = [];
      const first = Math.max(
        0,
        Math.floor((viewportTop - gridTop) / rowHeight)
      );
      const last = Math.min(
        rowCount - 1,
        Math.ceil((viewportBottom - gridTop) / rowHeight) - 1
      );
      for (let index = first; index <= last; index++) {
        visible.push(index);
      }

      const rendered = new Set<number>();
      const misplaced: number[] = [];
      gridElement.querySelectorAll(row).forEach((element) => {
        let index = Number(element.getAttribute(indexAttribute));
        if (indexAttribute === "aria-rowindex") {
          index--;
        }
        rendered.add(index);

        const top = element.getBoundingClientRect().top;
        if (Math.abs(top - (gridTop + index * rowHeight)) > 1) {
          misplaced.push(index);
        }
      });

      return {
        visible,
        rendered: Array.from(rendered).sort((a, b) => a - b),
        misplaced
      };
    },
    { grid, indexAttribute, row, rowCount, rowHeight, scroller }
  );
}

/**
 * Asserts that every row visible within the scroll element's viewport is rendered (in the right place), i.e. that there is no blank gap.
 * With `exact`, asserts that only the visible rows are rendered (e.g. with `overscanRowCount` 0);
 * except for the rows just above and below the viewport (the Grid's visible range includes the row starting exactly at the bottom of the viewport,
 * and the default overscanIndicesGetter always overscans one row in the direction opposite to scrolling).
 * Retries, since the component re-renders asynchronously after scroll and resize events.
 */
export async function expectVisibleRowsRendered(
  page: Page,
  options: Parameters<typeof getRowsInfo>[1] & { exact?: boolean }
) {
  await expect(async () => {
    const { misplaced, rendered, visible } = await getRowsInfo(page, options);
    expect(visible.length).toBeGreaterThan(0);
    expect(misplaced).toEqual([]);
    expect(rendered).toEqual(expect.arrayContaining(visible));
    if (options.exact) {
      const last = visible[visible.length - 1];
      expect(
        rendered.filter((index) => index < visible[0] - 1 || index > last + 1)
      ).toEqual([]);
    }
  }).toPass({ timeout: 2_000 });

  return getRowsInfo(page, options);
}

/** Waits for the scroll offset to settle at the expected value. */
export async function expectScrollTop(
  page: Page,
  scroller: Scroller,
  expected: number
) {
  await expect
    .poll(() => getScrollTop(page, scroller), { timeout: 2_000 })
    .toBe(expected);
}
