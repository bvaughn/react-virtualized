/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent } from "@testing-library/react";
import { act, createRef, StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  findDOMNode as findDOMNodeUtil,
  render
} from "../../utils/test/render";
import { CellMeasurer } from "../CellMeasurer/CellMeasurer";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import type { CellMeasurerCacheParams } from "../CellMeasurer/types";
import { InfiniteLoader } from "../InfiniteLoader/InfiniteLoader";
import {
  getObserverCount,
  mockResizeObserver
} from "../../utils/test/mockResizeObserver";
import { createScrollContainer } from "../../utils/test/scrollElement";
import { DEFAULT_SCROLLING_RESET_TIME_INTERVAL } from "./constants";
import { createCellPositioner as createCellPositionerUtil } from "./createCellPositioner";
import { defaultMasonryProps } from "./defaultMasonryProps";
import { Masonry } from "./Masonry";
import type {
  MasonryCellRendererParams,
  MasonryImperativeAPI,
  MasonryProps
} from "./types";

const ALTERNATING_CELL_HEIGHTS = [100, 50, 100, 150];
const CELL_SIZE_MULTIPLIER = 50;
const COLUMN_COUNT = 3;

function findDOMNode(instance: any): any {
  return findDOMNodeUtil(instance);
}

function assertVisibleCells(rendered: any, text: string) {
  expect(
    Array.from(rendered.querySelectorAll(".cell"))
      .map((node: any) => node.textContent)
      .sort()
      .join(",")
  ).toEqual(text);
}

function createCellMeasurerCache(props: CellMeasurerCacheParams = {}) {
  return new CellMeasurerCache({
    defaultHeight: CELL_SIZE_MULTIPLIER,
    defaultWidth: CELL_SIZE_MULTIPLIER,
    fixedWidth: true,
    keyMapper: (index: number) => index,
    ...props
  });
}

function createCellPositioner(cache: CellMeasurerCache) {
  return createCellPositionerUtil({
    cellMeasurerCache: cache,
    columnCount: COLUMN_COUNT,
    columnWidth: CELL_SIZE_MULTIPLIER
  });
}

function createCellRenderer(
  cache: CellMeasurerCache,
  renderCallback?: (index: number, params: MasonryCellRendererParams) => any
) {
  renderCallback =
    typeof renderCallback === "function"
      ? renderCallback
      : (index: number) => index;

  return function cellRenderer({
    index,
    isScrolling,
    key,
    parent,
    style
  }: MasonryCellRendererParams) {
    const height =
      ALTERNATING_CELL_HEIGHTS[index % ALTERNATING_CELL_HEIGHTS.length];
    const width = CELL_SIZE_MULTIPLIER;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          className="cell"
          ref={(ref) => {
            if (ref) {
              // Accounts for the fact that JSDom doesn't support measurements.
              Object.defineProperty(ref, "offsetHeight", {
                configurable: true,
                value: height
              });
              Object.defineProperty(ref, "offsetWidth", {
                configurable: true,
                value: width
              });
            }
          }}
          style={{
            ...style,
            minHeight: height,
            minWidth: width
          }}
        >
          {renderCallback!(index, { index, isScrolling, key, parent, style })}
        </div>
      </CellMeasurer>
    );
  };
}

function getMarkup(
  props: Partial<MasonryProps> & Record<string, unknown> = {}
) {
  const cellMeasurerCache =
    (props.cellMeasurerCache as CellMeasurerCache) || createCellMeasurerCache();

  return (
    <Masonry
      cellCount={1000}
      cellMeasurerCache={cellMeasurerCache}
      cellPositioner={createCellPositioner(cellMeasurerCache)}
      cellRenderer={createCellRenderer(cellMeasurerCache)}
      {...({ columnCount: COLUMN_COUNT } as Record<string, unknown>)}
      height={CELL_SIZE_MULTIPLIER * 2}
      overscanByPixels={CELL_SIZE_MULTIPLIER}
      width={CELL_SIZE_MULTIPLIER * COLUMN_COUNT}
      {...props}
    />
  );
}

function simulateScroll(masonry: any, scrollTop = 0) {
  const masonryNode = findDOMNode(masonry);
  masonryNode.scrollTop = scrollTop;
  fireEvent.scroll(masonryNode);
}

describe("Masonry", () => {
  beforeEach(render.unmount);

  it("should warn in DEV if there is neither a height nor a scrollElement", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(getMarkup({ height: undefined }));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "Masonry requires a height prop (unless a scrollElement is specified)"
    );
    warn.mockRestore();
  });

  describe("layout and measuring", () => {
    it("should measure only enough cells required for initial render", () => {
      // avg cell size: CELL_SIZE_MULTIPLIER
      // width: CELL_SIZE_MULTIPLIER * 3
      // height: CELL_SIZE_MULTIPLIER * 2
      // overcsan by: CELL_SIZE_MULTIPLIER
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache();
      render(getMarkup({ cellMeasurerCache }));
      for (let i = 0; i <= 8; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }
      expect(cellMeasurerCache.has(9)).toBe(false);
    });

    it("should not measure cells while scrolling until they are needed", () => {
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const rendered = findDOMNode(
        render(getMarkup({ cellMeasurerCache, cellRenderer }))
      );
      renderCallback.mockClear();
      // Scroll a little bit, but not so much to require re-measuring
      simulateScroll(rendered, 51);
      // Verify that render was only called enough times to fill view port (no extra for measuring)
      expect(renderCallback).toHaveBeenCalledTimes(9);
    });

    it("should measure additional cells on scroll when it runs out of measured cells", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const rendered = findDOMNode(
        render(getMarkup({ cellRenderer, cellMeasurerCache }))
      );
      expect(cellMeasurerCache.has(9)).toBe(false);

      renderCallback.mockClear();

      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      expect(cellMeasurerCache.has(10)).toBe(false);
    });

    // Masonry used to do a render pass for only unmeasured cells,
    // But this resulting in removing (and later re-adding) measured cells from the DOM,
    // Which was bad for performance. See GitHub issue #875
    it("should not remove previously-measured cells when measuring new ones", () => {
      const log: number[] = [];

      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = (index: number) => {
        log.push(index);
      };
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );

      const rendered = findDOMNode(
        render(
          getMarkup({
            cellMeasurerCache,
            cellRenderer
          })
        )
      );

      // Expected to have rendered twice:
      // 1st time to measure 9 cells (b'c of esimated size)
      // 2nd time to render and position 9 cells (b'c of actual size)
      expect(log).toHaveLength(18);

      log.splice(0);

      simulateScroll(rendered, 101);

      // Expected to have rendered twice:
      // 1st time to measure additional cells (based on estimated size)
      // 2nd time to render and position with new cells
      // The 1st render should also have included the pre-measured cells,
      // To prevent them from being removed, recreated, and re-added to the DOM.
      expect(log).toHaveLength(18);
    });

    it("should only render enough cells to fill the viewport", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            overscanByPixels: 0
          })
        )
      );
      assertVisibleCells(rendered, "0,1,2,3,4,5");
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, "0,2,3,4,5,6");
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, "3,4,5,6,7,8");
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, "30,31,32,33,34,35");
    });

    it("should only render enough cells to fill the viewport plus overscanByPixels", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            overscanByPixels: 100
          })
        )
      );
      assertVisibleCells(rendered, "0,1,10,11,2,3,4,5,6,7,8,9");
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, "0,1,10,11,2,3,4,5,6,7,8,9");
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, "0,1,10,11,2,3,4,5,6,7,8,9");
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, "26,27,28,29,30,31,32,33,34,35,36,37");
    });

    it("should still render correctly with a scrollElement", () => {
      // Share instances between renders to avoid resetting state in ways we don't intend
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const container = createScrollContainer({
        height: CELL_SIZE_MULTIPLIER * 2,
        width: CELL_SIZE_MULTIPLIER * COLUMN_COUNT
      });

      const masonry = render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
          scrollElement: container.element
        })
      );
      const rendered = findDOMNode(masonry);
      expect(rendered.style.height).toBe("auto");
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");
      container.scroll(51);
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");
      container.scroll(101);
      assertVisibleCells(rendered, "0,2,3,4,5,6,7,8,9");
      container.scroll(1001);
      assertVisibleCells(rendered, "27,29,30,31,32,33,34,35,36");
      expect(rendered.scrollTop).toBe(0);

      // Offsets above the Masonry (which is now 200px below the top of the viewport)
      container.setContentOffset(200);
      container.scroll(0);
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      // Without a scrollElement, it scrolls itself again
      render(getMarkup({ cellMeasurerCache, cellPositioner }));
      expect(rendered.style.height).toBe("100px");
    });

    it("should set right instead of left in a cell styles for rtl row direction", () => {
      // Share instances between renders to avoid resetting state in ways we don't intend
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);

      const rendered = findDOMNode(
        render(
          getMarkup({
            cellMeasurerCache,
            cellPositioner,
            rowDirection: "rtl"
          })
        )
      );
      Array.from(rendered.querySelectorAll(".cell")).map((node: any) => {
        expect(node.style.right).toMatch(/px/);
      });
    });

    it("should consider scroll only of the container element and not of any ancestor element", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderScrollableCell = (index: number) => (
        <div
          style={{ height: "50px", overflow: "visible" }}
          id={`scrollable-cell-${index}`}
        >
          <div style={{ height: "500px" }}>{index}</div>
        </div>
      );
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderScrollableCell
      );

      const rendered = findDOMNode(
        render(
          getMarkup({
            overscanByPixels: 0,
            cellMeasurerCache,
            cellRenderer
          })
        )
      );
      assertVisibleCells(rendered, "0,1,2,3,4,5");
      const cellEl = rendered.querySelector("#scrollable-cell-1");
      fireEvent.scroll(cellEl, { target: { scrollTop: 100 } });
      assertVisibleCells(rendered, "0,1,2,3,4,5");
    });
  });

  describe("recomputeCellPositions", () => {
    it("should refresh all cell positions", () => {
      // Share instances between renders to avoid resetting state in ways we don't intend
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = vi
        .fn()
        .mockImplementation(createCellPositioner(cellMeasurerCache));

      let rendered = findDOMNode(
        render(
          getMarkup({
            cellMeasurerCache,
            cellPositioner
          })
        )
      );
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      cellPositioner.mockImplementation((index: number) => ({
        left: 0,
        top: index * CELL_SIZE_MULTIPLIER
      }));

      const component = render<MasonryImperativeAPI>(
        getMarkup({
          cellMeasurerCache,
          cellPositioner
        })
      );
      rendered = findDOMNode(component);
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");
      act(() => {
        component.recomputeCellPositions();
      });
      assertVisibleCells(rendered, "0,1,2,3,4");
    });

    it("should not reset measurement cache", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const component = render<MasonryImperativeAPI>(
        getMarkup({ cellMeasurerCache })
      );
      const rendered = findDOMNode(component);
      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      simulateScroll(rendered, 0);
      act(() => {
        component.recomputeCellPositions();
      });
      for (let i = 0; i <= 9; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }
    });
  });

  describe("cellCount", () => {
    it("should not render cells that were removed when cellCount shrinks", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const renderedIndices: number[] = [];
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        (index: number) => {
          renderedIndices.push(index);
          return index;
        }
      );

      let rendered = findDOMNode(
        render(
          getMarkup({
            cellCount: 20,
            cellMeasurerCache,
            cellPositioner,
            cellRenderer
          })
        )
      );
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      renderedIndices.splice(0);
      rendered = findDOMNode(
        render(
          getMarkup({
            cellCount: 3,
            cellMeasurerCache,
            cellPositioner,
            cellRenderer
          })
        )
      );
      assertVisibleCells(rendered, "0,1,2");
      expect(renderedIndices.length).toBeGreaterThan(0);
      expect(renderedIndices.every((index) => index < 3)).toBe(true);
    });

    it("should not re-populate positions for removed cells in recomputeCellPositions", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = vi
        .fn()
        .mockImplementation(createCellPositioner(cellMeasurerCache));

      render(getMarkup({ cellCount: 20, cellMeasurerCache, cellPositioner }));

      const component = render<MasonryImperativeAPI>(
        getMarkup({ cellCount: 3, cellMeasurerCache, cellPositioner })
      );

      cellPositioner.mockClear();
      act(() => {
        component.recomputeCellPositions();
      });
      expect(cellPositioner.mock.calls.map(([index]) => index)).toEqual([
        0, 1, 2
      ]);
    });
  });

  describe("isScrolling", () => {
    it("should be true for cellRenderer while scrolling is in progress", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const rendered = findDOMNode(
        render(getMarkup({ cellMeasurerCache, cellRenderer }))
      );
      renderCallback.mockClear();
      simulateScroll(rendered, 51);
      expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(true);
    });

    it("should be reset after a small debounce when scrolling stops", async () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const rendered = findDOMNode(
        render(getMarkup({ cellMeasurerCache, cellRenderer }))
      );
      simulateScroll(rendered, 51);
      renderCallback.mockClear();
      // Jest silently ignored this assertion (it ran in an un-awaited setTimeout after the test had finished);
      // Vitest reports it as an unhandled error, so wait for the debounce to complete instead.
      // Updates scheduled within an async act() scope are only flushed when the scope exits,
      // so wait for the debounce interval (plus some padding for the animation frame) inside of act().
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL + 50)
        );
      });
      await vi.waitFor(() => {
        expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(false);
      });
    });
  });

  describe("callbacks", () => {
    it("should call onCellsRendered when rendered cells change", () => {
      const onCellsRendered = vi.fn();
      const rendered = findDOMNode(render(getMarkup({ onCellsRendered })));
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 8 }]
      ]);
      simulateScroll(rendered, 51);
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 8 }]
      ]);
      simulateScroll(rendered, 101);
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 8 }],
        [{ startIndex: 0, stopIndex: 9 }]
      ]);
    });

    it("should call onScroll when scroll position changes", () => {
      const onScroll = vi.fn();
      const rendered = findDOMNode(render(getMarkup({ onScroll })));
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }]
      ]);
      simulateScroll(rendered, 51);
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 51 }]
      ]);
      simulateScroll(rendered, 0);
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 51 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }]
      ]);
    });
  });

  describe("keyMapper", () => {
    it("should pass the correct key to rendered cells", () => {
      const keyMapper = vi
        .fn()
        .mockImplementation((index: number) => `key:${index}`);
      const cellRenderer = vi
        .fn()
        .mockImplementation(
          ({ index, key, style }: MasonryCellRendererParams) => (
            <div key={key} style={style}>
              {index}
            </div>
          )
        );
      findDOMNode(render(getMarkup({ cellRenderer, keyMapper })));
      expect(keyMapper).toHaveBeenCalled();
      expect(cellRenderer).toHaveBeenCalled();
      expect(cellRenderer.mock.calls[0][0].key).toEqual("key:0");
    });
  });

  describe("with a scrollElement", () => {
    let unmockResizeObserver: () => void;
    beforeEach(() => {
      unmockResizeObserver = mockResizeObserver();
    });
    afterEach(() => {
      render.unmount();
      unmockResizeObserver();
    });

    function createContainer(height = CELL_SIZE_MULTIPLIER * 2) {
      return createScrollContainer({
        height,
        width: CELL_SIZE_MULTIPLIER * COLUMN_COUNT
      });
    }

    it("should set isScrolling while the scroll element is scrolled and reset it afterwards", async () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const container = createContainer();
      render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
          cellRenderer,
          scrollElement: container.element
        })
      );
      expect(renderCallback.mock.lastCall![1].isScrolling).toBe(false);

      renderCallback.mockClear();
      container.scroll(51);
      expect(renderCallback.mock.lastCall![1].isScrolling).toBe(true);

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL + 50)
        );
      });
      expect(renderCallback.mock.lastCall![1].isScrolling).toBe(false);
    });

    it("should report the viewport's offset to onScroll", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const onScroll = vi.fn();
      const container = createContainer();
      render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
          onScroll,
          scrollElement: container.element
        })
      );
      container.scroll(101);
      expect(onScroll.mock.calls.map(([params]) => params.scrollTop)).toEqual([
        0, 101
      ]);
    });

    it("should measure its position within the scroll element", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const container = createScrollContainer({
        contentOffset: 500,
        height: CELL_SIZE_MULTIPLIER * 2,
        width: CELL_SIZE_MULTIPLIER * COLUMN_COUNT
      });
      container.element.scrollTop = 1501;
      const masonry = render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
          scrollElement: container.element
        })
      );
      assertVisibleCells(findDOMNode(masonry), "27,29,30,31,32,33,34,35,36");
    });

    it("should render and measure the cells within the viewport of the scroll element", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const onCellsRendered = vi.fn();
      // Twice as high as the height prop
      const container = createContainer(CELL_SIZE_MULTIPLIER * 4);
      const masonry = render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
          onCellsRendered,
          overscanByPixels: 0,
          scrollElement: container.element
        })
      );
      assertVisibleCells(findDOMNode(masonry), "0,1,2,3,4,5,6,7,8");
      for (let index = 0; index <= 8; index++) {
        expect(cellMeasurerCache.has(index, 0)).toBe(true);
      }
      expect(cellMeasurerCache.has(9, 0)).toBe(false);
      expect(onCellsRendered).toHaveBeenLastCalledWith({
        startIndex: 0,
        stopIndex: 8
      });
    });

    it("should start and stop being scrolled when the scrollElement changes from null to an element and back (#6)", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const container = createContainer();
      container.element.scrollTop = 1001;
      const props = { cellMeasurerCache, cellPositioner };

      const rendered = findDOMNode(
        render(getMarkup({ ...props, scrollElement: null }))
      );
      expect(rendered.style.height).toBe("auto");
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      render(getMarkup({ ...props, scrollElement: container.element }));
      assertVisibleCells(rendered, "27,29,30,31,32,33,34,35,36");
      expect(getObserverCount(container.element)).toBe(1);

      render(getMarkup({ ...props, scrollElement: null }));
      expect(getObserverCount(container.element)).toBe(0);
      expect(rendered.style.height).toBe("auto");
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      container.scroll(1001);
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");
    });

    it("should work in StrictMode", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const ref = createRef<MasonryImperativeAPI>();
      const container = createContainer();
      container.element.scrollTop = 1001;
      render(
        <StrictMode>
          <div>
            {getMarkup({
              cellMeasurerCache,
              cellPositioner,
              ref,
              scrollElement: container.element
            } as any)}
          </div>
        </StrictMode>
      );
      assertVisibleCells(container.element, "27,29,30,31,32,33,34,35,36");

      container.scroll(0);
      assertVisibleCells(container.element, "0,1,2,3,4,5,6,7,8");
    });
  });

  describe("estimated total height", () => {
    it("should not count cells that were removed when cellCount shrinks", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);

      render(getMarkup({ cellCount: 20, cellMeasurerCache, cellPositioner }));
      const rendered = findDOMNode(
        render(getMarkup({ cellCount: 3, cellMeasurerCache, cellPositioner }))
      );

      // Cells 0, 1 and 2 are 100px, 50px and 100px tall (one per column)
      const inner = rendered.querySelector(
        ".ReactVirtualized__Masonry__innerScrollContainer"
      );
      expect(inner.style.height).toBe("100px");
    });
  });

  describe("imperative handle", () => {
    it("should be stable and passed to cellRenderer as parent", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const parents = new Set();
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        (index, { parent }) => {
          parents.add(parent);
          return index;
        }
      );
      const ref = createRef<MasonryImperativeAPI>();
      const props = { cellMeasurerCache, cellRenderer, ref };
      render(getMarkup(props));
      const handle = ref.current;
      render(getMarkup({ ...props, height: 200 }));
      expect(ref.current).toBe(handle);
      expect(Array.from(parents)).toEqual([handle]);
    });

    it("should clear cell positions and re-position cells as they are rendered", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const component = render<MasonryImperativeAPI>(
        getMarkup({ cellMeasurerCache, cellPositioner })
      );
      const rendered = findDOMNode(component);
      assertVisibleCells(rendered, "0,1,2,3,4,5,6,7,8");

      cellPositioner.reset({
        columnCount: 1,
        columnWidth: CELL_SIZE_MULTIPLIER
      });
      // Cells are re-positioned as they are (re-)measured
      cellMeasurerCache.clearAll();
      act(() => {
        component.clearCellPositions();
      });
      // Cells 0 (100px), 1 (50px) and 2 are stacked in a single column; the viewport (100px) and overscan (50px) reach cell 2
      assertVisibleCells(rendered, "0,1,2");
    });

    it("should re-render visible cells on forceUpdate and recomputeGridSize", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = vi
        .fn()
        .mockImplementation((index: number) => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback
      );
      const props = {
        cellMeasurerCache,
        cellPositioner: createCellPositioner(cellMeasurerCache),
        cellRenderer
      };
      const component = render<MasonryImperativeAPI>(getMarkup(props));

      // Re-rendering with the same props doesn't re-render cells (memo)
      renderCallback.mockClear();
      render(getMarkup(props));
      expect(renderCallback).not.toHaveBeenCalled();

      act(() => {
        component.forceUpdate();
      });
      expect(renderCallback).toHaveBeenCalledTimes(9);

      renderCallback.mockClear();
      act(() => {
        component.recomputeGridSize({ rowIndex: 3 });
      });
      expect(renderCallback).toHaveBeenCalledTimes(9);
    });

    it("should position cells invalidated outside of a render", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = vi
        .fn()
        .mockImplementation(createCellPositioner(cellMeasurerCache));
      const component = render<MasonryImperativeAPI>(
        getMarkup({ cellMeasurerCache, cellPositioner })
      );
      cellPositioner.mockClear();
      act(() => {
        component.invalidateCellSizeAfterRender({ rowIndex: 9 });
      });
      expect(cellPositioner.mock.calls.map(([index]) => index)).toEqual([9]);
    });
  });

  describe("InfiniteLoader", () => {
    it("should re-render loaded cells when used as an InfiniteLoader child", async () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const loaded = new Set<number>();
      const cellRenderer = createCellRenderer(cellMeasurerCache, (index) =>
        loaded.has(index) ? `loaded-${index}` : `loading-${index}`
      );
      let resolveLoad: () => void = () => {};

      render(
        <InfiniteLoader
          isRowLoaded={({ index }) => loaded.has(index)}
          loadMoreRows={({ startIndex, stopIndex }) =>
            new Promise<void>((resolve) => {
              resolveLoad = () => {
                for (let index = startIndex; index <= stopIndex; index++) {
                  loaded.add(index);
                }
                resolve();
              };
            })
          }
          minimumBatchSize={1}
          rowCount={100}
          threshold={0}
        >
          {({ onRowsRendered, registerChild }) =>
            getMarkup({
              cellCount: 100,
              cellMeasurerCache,
              cellRenderer,
              // InfiniteLoader expects a stopIndex (Masonry reports undefined if it renders no cells)
              onCellsRendered:
                onRowsRendered as MasonryProps["onCellsRendered"],
              ref: registerChild
            })
          }
        </InfiniteLoader>
      );

      const container = document.querySelector(".ReactVirtualized__Masonry")!;
      expect(container.textContent).toContain("loading-0");

      await act(async () => {
        resolveLoad();
      });
      expect(container.textContent).toContain("loaded-0");
      expect(container.textContent).not.toContain("loading-");
    });
  });

  describe("CellMeasurer", () => {
    it("should re-render after a cell has been re-measured", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      let measureCell0: () => void = () => {};
      let cell0Height = 100;
      const cellRenderer = ({
        index,
        key,
        parent,
        style
      }: MasonryCellRendererParams) => (
        <CellMeasurer
          cache={cellMeasurerCache}
          index={index}
          key={key}
          parent={parent}
        >
          {({ measure, registerChild }) => {
            if (index === 0) {
              measureCell0 = measure;
            }
            return (
              <div
                className="cell"
                ref={(ref) => {
                  if (ref) {
                    Object.defineProperty(ref, "offsetHeight", {
                      configurable: true,
                      get: () => (index === 0 ? cell0Height : 50)
                    });
                    Object.defineProperty(ref, "offsetWidth", {
                      configurable: true,
                      value: CELL_SIZE_MULTIPLIER
                    });
                  }
                  registerChild(ref);
                }}
                style={style}
              >
                {index}
              </div>
            );
          }}
        </CellMeasurer>
      );
      const rendered = findDOMNode(
        render(getMarkup({ cellMeasurerCache, cellRenderer }))
      );
      const getCell0 = () =>
        Array.from(rendered.querySelectorAll(".cell")).find(
          (node: any) => node.textContent === "0"
        ) as HTMLElement;
      expect(getCell0().style.height).toBe("100px");

      cell0Height = 150;
      act(() => {
        measureCell0();
      });
      expect(cellMeasurerCache.getHeight(0)).toBe(150);
      expect(getCell0().style.height).toBe("150px");
    });
  });

  describe("StrictMode", () => {
    it("should measure, position and scroll cells", () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);
      const onCellsRendered = vi.fn();
      const onScroll = vi.fn();
      const ref = createRef<MasonryImperativeAPI>();
      render(
        <StrictMode>
          {getMarkup({
            cellMeasurerCache,
            cellPositioner,
            onCellsRendered,
            onScroll,
            overscanByPixels: 0,
            ref
          })}
        </StrictMode>
      );
      const rendered = document.querySelector(".ReactVirtualized__Masonry")!;
      assertVisibleCells(rendered, "0,1,2,3,4,5");
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 5 }]
      ]);
      expect(onScroll).toHaveBeenCalledTimes(1);

      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, "3,4,5,6,7,8");
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, "30,31,32,33,34,35");

      cellPositioner.reset({
        columnCount: COLUMN_COUNT,
        columnWidth: CELL_SIZE_MULTIPLIER
      });
      act(() => {
        ref.current!.recomputeCellPositions();
      });
      assertVisibleCells(rendered, "30,31,32,33,34,35");
    });
  });

  describe("DOM output", () => {
    it("should render class names, ARIA attributes and styles", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            "aria-label": "Photos",
            className: "custom",
            id: "masonry",
            style: { backgroundColor: "red" }
          })
        )
      );
      expect(rendered.className).toBe("ReactVirtualized__Masonry custom");
      expect(rendered.getAttribute("aria-label")).toBe("Photos");
      expect(rendered.getAttribute("id")).toBe("masonry");
      expect(rendered.getAttribute("role")).toBe(defaultMasonryProps.role);
      expect(rendered.getAttribute("tabindex")).toBe("0");
      expect(rendered.style.backgroundColor).toBe("red");
      expect(rendered.style.height).toBe("100px");
      expect(rendered.style.width).toBe("150px");
    });

    it("should export frozen default props", () => {
      expect(Object.isFrozen(defaultMasonryProps)).toBe(true);
      expect(defaultMasonryProps.overscanByPixels).toBe(20);
      expect(defaultMasonryProps.scrollingResetTimeInterval).toBe(150);
    });
  });
});
