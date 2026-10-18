import { expect, test, type Page } from "@playwright/test";
import type { Alignment } from "react-virtualized";
import {
  CONTAINER_HEIGHT,
  HEADER_HEIGHT,
  ROW_COUNT,
  ROW_HEIGHT,
  WIDTH
} from "../src";
import {
  expectScrollTop,
  expectVisibleRowsRendered,
  getRowsInfo,
  getScrollTop,
  open,
  scrollTo,
  VIEWPORT_HEIGHT,
  type Scroller
} from "./utils";

const scenarios: {
  name: string;
  scrollElement: "container" | "window";
  scroller: Scroller;
  viewportHeight: number;
}[] = [
  {
    name: 'scrollElement="window"',
    scrollElement: "window",
    scroller: "window",
    viewportHeight: VIEWPORT_HEIGHT
  },
  {
    name: "scrollElement={container}",
    scrollElement: "container",
    scroller: "#container",
    viewportHeight: CONTAINER_HEIGHT
  }
];

// The List is rendered below the header (at the top of the scroll element)
const LIST_TOP = HEADER_HEIGHT;

for (const { name, scrollElement, scroller, viewportHeight } of scenarios) {
  test.describe(`List with ${name}`, () => {
    const rowsOptions = { grid: "#list", rowCount: ROW_COUNT, scroller };

    async function render(page: Page) {
      await open(page, `/scroll-element/list?scrollElement=${scrollElement}`);
      await expect(page.locator('[data-row-index="0"]')).toBeAttached();
    }

    test("renders at its full height, and renders the rows visible within the viewport", async ({
      page
    }) => {
      await render(page);

      const box = await page.locator("#list").boundingBox();
      expect(box?.height).toBe(ROW_COUNT * ROW_HEIGHT);
      expect(box?.width).toBe(WIDTH);

      // Initially, only the part of the List below the header is visible
      const { visible } = await expectVisibleRowsRendered(page, rowsOptions);
      expect(visible).toEqual(
        Array.from(
          { length: Math.ceil((viewportHeight - LIST_TOP) / ROW_HEIGHT) },
          (_, index) => index
        )
      );

      // Scroll to (the middle of) a row far below
      for (const offset of [100 * ROW_HEIGHT, 500 * ROW_HEIGHT + 25, 50]) {
        await scrollTo(page, scroller, LIST_TOP + offset);
        const { rendered, visible } = await expectVisibleRowsRendered(
          page,
          rowsOptions
        );
        expect(visible[0]).toBe(Math.floor(offset / ROW_HEIGHT));
        if (offset > 20 * ROW_HEIGHT) {
          expect(rendered).not.toContain(0);
        }
      }

      // Scroll back to the top
      await scrollTo(page, scroller, 0);
      await expectVisibleRowsRendered(page, rowsOptions);
    });

    test("scrollToRow scrolls the scroll element", async ({ page }) => {
      await render(page);

      const scrollToRow = (index: number, align?: Alignment) =>
        page.evaluate(
          ({ align, index }) =>
            window.list!.scrollToRow({
              align,
              index
            }),
          { align, index }
        );

      // "auto" (the default) aligns a row below the viewport to the bottom of the viewport
      await scrollToRow(500);
      await expectScrollTop(
        page,
        scroller,
        LIST_TOP + 501 * ROW_HEIGHT - viewportHeight
      );
      await expectVisibleRowsRendered(page, rowsOptions);
      await expect(page.locator('[data-row-index="500"]')).toBeInViewport();

      // A row that is already visible is not scrolled to
      const scrollTop = await getScrollTop(page, scroller);
      await scrollToRow(499);
      await page.waitForTimeout(100);
      expect(await getScrollTop(page, scroller)).toBe(scrollTop);

      // "auto" aligns a row above the viewport to the top of the viewport
      await scrollToRow(10);
      await expectScrollTop(page, scroller, LIST_TOP + 10 * ROW_HEIGHT);
      await expectVisibleRowsRendered(page, rowsOptions);

      await scrollToRow(300, "center");
      await expectScrollTop(
        page,
        scroller,
        LIST_TOP + 300 * ROW_HEIGHT - (viewportHeight - ROW_HEIGHT) / 2
      );
      await expectVisibleRowsRendered(page, rowsOptions);

      await scrollToRow(200, "start");
      await expectScrollTop(page, scroller, LIST_TOP + 200 * ROW_HEIGHT);

      await scrollToRow(100, "end");
      await expectScrollTop(
        page,
        scroller,
        LIST_TOP + 101 * ROW_HEIGHT - viewportHeight
      );

      // The offset is clamped to the end of the List
      await scrollToRow(ROW_COUNT - 1, "start");
      await expectScrollTop(
        page,
        scroller,
        LIST_TOP + ROW_COUNT * ROW_HEIGHT - viewportHeight
      );
      await expectVisibleRowsRendered(page, rowsOptions);

      // Scrolling to the first row leaves the header (above the List) scrolled out of view
      await scrollToRow(0);
      await expectScrollTop(page, scroller, LIST_TOP);
      await expectVisibleRowsRendered(page, rowsOptions);
    });

    test("scrollToPosition scrolls the scroll element", async ({ page }) => {
      await render(page);

      await page.evaluate(() =>
        window.list!.scrollToPosition({ scrollTop: 1234 })
      );
      await expectScrollTop(page, scroller, LIST_TOP + 1234);
      const { visible } = await expectVisibleRowsRendered(page, rowsOptions);
      expect(visible[0]).toBe(Math.floor(1234 / ROW_HEIGHT));

      await page.evaluate(() =>
        window.list!.scrollToPosition({ scrollTop: 0 })
      );
      await expectScrollTop(page, scroller, LIST_TOP);
      await expectVisibleRowsRendered(page, rowsOptions);
    });
  });
}

test.describe("List with a scrollElement that is initially null", () => {
  const rowsOptions = {
    grid: "#list",
    rowCount: ROW_COUNT,
    scroller: "window"
  };

  test("renders the top rows (using the height prop), then renders the visible rows once linked", async ({
    page
  }) => {
    await open(page, "/scroll-element/list?scrollElement=deferred&overscan=0");
    await expect(page.locator('[data-row-index="0"]')).toBeAttached();

    // The height prop (300) is used until the List is linked to its scroll element;
    // the List renders at its full height, with the rows at its top rendered
    // (including the row starting at 300px, which the Grid's visible range includes)
    const topRows = Array.from(
      { length: 300 / ROW_HEIGHT + 1 },
      (_, index) => index
    );
    expect((await getRowsInfo(page, rowsOptions)).rendered).toEqual(topRows);
    expect((await page.locator("#list").boundingBox())?.height).toBe(
      ROW_COUNT * ROW_HEIGHT
    );

    // Scrolling the window does not affect the List while it isn't linked
    await scrollTo(page, "window", LIST_TOP + 100 * ROW_HEIGHT);
    await page.waitForTimeout(200);
    expect((await getRowsInfo(page, rowsOptions)).rendered).toEqual(topRows);

    await page.evaluate(() => window.linkScrollElement!());

    const { visible } = await expectVisibleRowsRendered(page, {
      ...rowsOptions,
      exact: true
    });
    expect(visible[0]).toBe(100);
    expect(visible.length).toBe(VIEWPORT_HEIGHT / ROW_HEIGHT);

    // It is scrolled by the window from then on
    await scrollTo(page, "window", LIST_TOP + 200 * ROW_HEIGHT);
    await expectVisibleRowsRendered(page, { ...rowsOptions, exact: true });
    await page.evaluate(() => window.list!.scrollToRow({ index: 10 }));
    await expectScrollTop(page, "window", LIST_TOP + 10 * ROW_HEIGHT);
  });
});
