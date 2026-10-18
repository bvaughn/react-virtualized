/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent } from "@testing-library/react";
import {
  act,
  createRef,
  PureComponent,
  StrictMode,
  useLayoutEffect,
  type CSSProperties
} from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getObserverCount,
  mockResizeObserver
} from "../../utils/test/mockResizeObserver";
import {
  findDOMNode as findDOMNodeUntyped,
  getMountNode,
  render
} from "../../utils/test/render";
import {
  createScrollContainer,
  mockWindowScrolling
} from "../../utils/test/scrollElement";
import { CellMeasurer } from "../CellMeasurer/CellMeasurer";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import { defaultCellRangeRenderer } from "./defaultCellRangeRenderer";
import {
  defaultOverscanIndicesGetter,
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FORWARD
} from "./defaultOverscanIndicesGetter";
import { DEFAULT_SCROLLING_RESET_TIME_INTERVAL } from "./constants";
import { Grid } from "./Grid";
import type {
  Alignment,
  CellRangeRendererParams,
  CellRendererParams,
  GridImperativeAPI,
  GridProps,
  OverscanIndicesGetterParams,
  RenderedSection,
  StyleCache
} from "./types";
import { getMaxElementSize } from "./utils/maxElementSize";

function findDOMNode(
  instance: Parameters<typeof findDOMNodeUntyped>[0]
): HTMLDivElement {
  return findDOMNodeUntyped(instance) as HTMLDivElement;
}

const DEFAULT_COLUMN_WIDTH = 50;
const DEFAULT_HEIGHT = 100;
const DEFAULT_ROW_HEIGHT = 20;
const DEFAULT_WIDTH = 200;
const NUM_ROWS = 100;
const NUM_COLUMNS = 50;

function getScrollbarSize0() {
  return 0;
}

function getScrollbarSize20() {
  return 20;
}

describe("Grid", () => {
  function defaultCellRenderer({
    columnIndex,
    key,
    rowIndex,
    style
  }: Pick<CellRendererParams, "columnIndex" | "key" | "rowIndex" | "style">) {
    return (
      <div className="gridItem" key={key} style={style}>
        {`row:${rowIndex}, column:${columnIndex}`}
      </div>
    );
  }

  function simulateScroll({
    grid,
    scrollLeft = 0,
    scrollTop = 0
  }: {
    grid: any;
    scrollLeft?: number;
    scrollTop?: number;
  }) {
    fireEvent.scroll(findDOMNode(grid), { target: { scrollLeft, scrollTop } });
  }

  function getScrollPosition(grid: GridImperativeAPI) {
    const node = findDOMNode(grid);
    return { scrollLeft: node.scrollLeft, scrollTop: node.scrollTop };
  }

  function renderAndScrollToCell(
    props: Partial<GridProps>,
    params: { align?: Alignment; columnIndex?: number; rowIndex?: number }
  ): GridImperativeAPI {
    const grid = render<GridImperativeAPI>(getMarkup(props));
    act(() => {
      grid.scrollToCell(params);
    });
    return grid;
  }

  // Records the scroll directions Grid passes to its overscanIndicesGetter (i.e. its current scroll direction)
  function createScrollDirectionTracker() {
    let horizontal: number | undefined;
    let vertical: number | undefined;

    return {
      horizontal: () => horizontal,
      overscanIndicesGetter: (params: OverscanIndicesGetterParams) => {
        if (params.direction === "horizontal") {
          horizontal = params.scrollDirection;
        } else {
          vertical = params.scrollDirection;
        }
        return defaultOverscanIndicesGetter(params);
      },
      vertical: () => vertical
    };
  }

  // Captures the style cache Grid passes to its cellRangeRenderer
  function createStyleCacheTracker() {
    let styleCache: StyleCache = {};

    return {
      cellRangeRenderer: (params: CellRangeRendererParams) => {
        styleCache = params.styleCache;
        return defaultCellRangeRenderer(params);
      },
      keys: () => Object.keys(styleCache)
    };
  }

  function getMarkup(props: Partial<GridProps> = {}) {
    return (
      <Grid
        cellRenderer={defaultCellRenderer}
        columnCount={NUM_COLUMNS}
        columnWidth={DEFAULT_COLUMN_WIDTH}
        getScrollbarSize={getScrollbarSize0}
        height={DEFAULT_HEIGHT}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowHeight={DEFAULT_ROW_HEIGHT}
        rowCount={NUM_ROWS}
        width={DEFAULT_WIDTH}
        {...props}
      />
    );
  }

  describe("number of rendered children", () => {
    it("should render enough children to fill the available area", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll(".gridItem").length).toEqual(20); // 5 rows x 4 columns
    });

    it("should not render more rows than available if the area is not filled", () => {
      const rendered = findDOMNode(render(getMarkup({ rowCount: 2 })));
      expect(rendered.querySelectorAll(".gridItem").length).toEqual(8); // 2 rows x 4 columns
    });

    it("should not render more columns than available if the area is not filled", () => {
      const rendered = findDOMNode(render(getMarkup({ columnCount: 2 })));
      expect(rendered.querySelectorAll(".gridItem").length).toEqual(10); // 5 rows x 2 columns
    });

    // Small performance tweak added in 5.5.6
    it("should not render/parent cells that are null or false", () => {
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        if (columnIndex === 0) {
          return null;
        } else if (rowIndex === 0) {
          return false;
        } else {
          return (
            <div className="cell" key={key} style={style}>
              {`row:${rowIndex}, column:${columnIndex}`}
            </div>
          );
        }
      }
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 3,
            overscanColumnCount: 0,
            overscanRowCount: 0,
            rowCount: 3,
            cellRenderer
          })
        )
      );
      expect(rendered.querySelectorAll(".cell").length).toEqual(4); // [1,1], [1,2], [2,1], and [2,2]
      expect(rendered.textContent).not.toContain("column:0");
      expect(rendered.textContent).not.toContain("row:0");
    });

    it("should scroll to the last existing point when rows are removed", () => {
      const grid = render(
        getMarkup({
          rowCount: 15
        })
      );

      simulateScroll({
        grid,
        scrollTop: 200
      });

      const updatedGrid = render(
        getMarkup({
          rowCount: 10
        })
      );

      expect(getScrollPosition(updatedGrid).scrollTop).toEqual(100);
    });

    it("should scroll to the last existing point when columns are removed", () => {
      const grid = render(
        getMarkup({
          columnCount: 12
        })
      );

      simulateScroll({
        grid,
        scrollLeft: 400
      });

      const updatedGrid = render(
        getMarkup({
          columnCount: 8
        })
      );

      expect(getScrollPosition(updatedGrid).scrollLeft).toEqual(200);
    });

    it("should not scroll unseen rows are removed", () => {
      render(
        getMarkup({
          rowCount: 15
        })
      );
      const updatedGrid = render(
        getMarkup({
          rowCount: 10
        })
      );

      expect(getScrollPosition(updatedGrid).scrollTop).toEqual(0);
    });

    it("should not scroll when unseen columns are removed", () => {
      render(
        getMarkup({
          columnCount: 12
        })
      );
      const updatedGrid = render(
        getMarkup({
          columnCount: 8
        })
      );

      expect(getScrollPosition(updatedGrid).scrollLeft).toEqual(0);
    });
  });

  describe("shows and hides scrollbars based on rendered content", () => {
    it("should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 4,
            getScrollbarSize: getScrollbarSize20,
            rowCount: 5
          })
        )
      );
      expect(rendered.style.overflowX).toEqual("hidden");
    });

    it("should set overflowX:hidden if columns and y-axis scrollbar fit within the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 4,
            getScrollbarSize: getScrollbarSize20,
            width: 200 + getScrollbarSize20()
          })
        )
      );
      expect(rendered.style.overflowX).toEqual("hidden");
    });

    it("should leave overflowX:auto if columns require more than the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 4,
            getScrollbarSize: getScrollbarSize20,
            width: 200 - 1,
            rowCount: 5
          })
        )
      );
      expect(rendered.style.overflowX).not.toEqual("hidden");
    });

    it("should leave overflowX:auto if columns and y-axis scrollbar require more than the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 4,
            getScrollbarSize: getScrollbarSize20,
            width: 200 + getScrollbarSize20() - 1
          })
        )
      );
      expect(rendered.style.overflowX).not.toEqual("hidden");
    });

    it("should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            getScrollbarSize: getScrollbarSize20,
            rowCount: 5,
            columnCount: 4
          })
        )
      );
      expect(rendered.style.overflowY).toEqual("hidden");
    });

    it("should set overflowY:hidden if rows and x-axis scrollbar fit within the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            getScrollbarSize: getScrollbarSize20,
            rowCount: 5,
            height: 100 + getScrollbarSize20()
          })
        )
      );
      expect(rendered.style.overflowY).toEqual("hidden");
    });

    it("should leave overflowY:auto if rows require more than the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            getScrollbarSize: getScrollbarSize20,
            rowCount: 5,
            height: 100 - 1,
            columnCount: 4
          })
        )
      );
      expect(rendered.style.overflowY).not.toEqual("hidden");
    });

    it("should leave overflowY:auto if rows and x-axis scrollbar require more than the available width", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            getScrollbarSize: getScrollbarSize20,
            rowCount: 5,
            height: 100 + getScrollbarSize20() - 1
          })
        )
      );
      expect(rendered.style.overflowY).not.toEqual("hidden");
    });

    it("should accept styles that overwrite calculated ones", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnCount: 1,
            getScrollbarSize: getScrollbarSize20,
            height: 1,
            rowCount: 1,
            style: {
              overflowY: "visible",
              overflowX: "visible"
            },
            width: 1
          })
        )
      );
      expect(rendered.style.overflowY).toEqual("visible");
      expect(rendered.style.overflowX).toEqual("visible");
    });
  });

  /** Tests scrolling via the imperative scrollToCell() method */
  describe("scrollToCell", () => {
    it("should scroll to the left", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 0 });
      expect(getScrollPosition(grid).scrollLeft).toEqual(0);
    });

    it("should scroll over to the middle", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 24 });
      // 50 columns * 50 item width = 2,500 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(getScrollPosition(grid).scrollLeft).toEqual(1050);
    });

    it("should scroll to the far right", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 49 });
      // 50 columns * 50 item width = 2,500 total item width
      // Target offset for the last item then is 2,500 - 200
      expect(getScrollPosition(grid).scrollLeft).toEqual(2300);
    });

    it("should scroll to the top", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 0 });
      expect(getScrollPosition(grid).scrollTop).toEqual(0);
    });

    it("should scroll down to the middle", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 49 });
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(getScrollPosition(grid).scrollTop).toEqual(900);
    });

    it("should scroll to the bottom", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 99 });
      // 100 rows * 20 item height = 2,000 total item height
      // Target offset for the last item then is 2,000 - 100
      expect(getScrollPosition(grid).scrollTop).toEqual(1900);
    });

    it("should render the cells that were scrolled to", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 24, rowIndex: 49 });
      expect(findDOMNode(grid).textContent).toContain("row:49, column:24");
      expect(findDOMNode(grid).textContent).not.toContain("row:0, column:0");
    });

    it("should scroll to a row and column just added", () => {
      let grid = render(getMarkup());
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });
      grid = renderAndScrollToCell(
        {
          columnCount: NUM_COLUMNS + 1,
          rowCount: NUM_ROWS + 1
        },
        { columnIndex: NUM_COLUMNS, rowIndex: NUM_ROWS }
      );
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 2350,
        scrollTop: 1920
      });
    });

    it('should scroll to the correct position for align "start"', () => {
      const grid = renderAndScrollToCell(
        {},
        {
          align: "start",
          columnIndex: 24,
          rowIndex: 49
        }
      );
      // 50 columns * 50 item width = 2,500 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // 4 columns and 5 rows can be visible at a time.
      // The minimum amount of scrolling leaves the specified cell in the bottom/right corner (just scrolled into view).
      // Since alignment is set to "start" we should scroll past this point until the cell is aligned top/left.
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 1200,
        scrollTop: 980
      });
    });

    it('should scroll to the correct position for align "end"', () => {
      const grid = renderAndScrollToCell(
        {},
        {
          columnIndex: 99,
          rowIndex: 99
        }
      );
      act(() => {
        grid.scrollToCell({
          align: "end",
          columnIndex: 24,
          rowIndex: 49
        });
      });
      // 50 columns * 50 item width = 2,500 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // We first scroll past the specified cell and then back.
      // The minimum amount of scrolling then should leave the specified cell in the top/left corner (just scrolled into view).
      // Since alignment is set to "end" we should scroll past this point until the cell is aligned bottom/right.
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 1050,
        scrollTop: 900
      });
    });

    it('should scroll to the correct position for align "center"', () => {
      const grid = renderAndScrollToCell(
        {},
        {
          columnIndex: 99,
          rowIndex: 99
        }
      );
      act(() => {
        grid.scrollToCell({
          align: "center",
          columnIndex: 24,
          rowIndex: 49
        });
      });
      // 50 columns * 50 item width = 2,500 total item width
      // Viewport width is 200
      // Column 24 starts at 1,200, center point at 1,225, so...
      expect(getScrollPosition(grid).scrollLeft).toEqual(1125);
      // 100 rows * 20 item height = 2,000 total item height
      // Viewport height is 100
      // Row 49 starts at 980, center point at 990, so...
      expect(getScrollPosition(grid).scrollTop).toEqual(940);
    });

    // Tests issue #218
    it("should set the correct :scrollTop after row and column counts increase from 0", () => {
      const expectedScrollTop =
        100 * DEFAULT_ROW_HEIGHT - DEFAULT_HEIGHT + DEFAULT_ROW_HEIGHT;
      const grid = renderAndScrollToCell(
        {
          columnCount: 0,
          rowCount: 150
        },
        { rowIndex: 100 }
      );
      render(
        getMarkup({
          columnCount: 150,
          rowCount: 150
        })
      );
      expect(getScrollPosition(grid).scrollTop).toEqual(expectedScrollTop);
    });

    it("should support scrollToCell() public method", () => {
      const grid = render<GridImperativeAPI>(getMarkup());
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });
      act(() => {
        grid.scrollToCell({
          columnIndex: 24,
          rowIndex: 49
        });
      });
      // 50 columns * 50 item width = 2,500 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(getScrollPosition(grid).scrollLeft).toEqual(1050);
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(getScrollPosition(grid).scrollTop).toEqual(900);

      // Change column without affecting row
      act(() => {
        grid.scrollToCell({
          columnIndex: 49
        });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 2300,
        scrollTop: 900
      });

      // Change row without affecting column
      act(() => {
        grid.scrollToCell({
          rowIndex: 99
        });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 2300,
        scrollTop: 1900
      });
    });

    it("should scroll back to a cell that the user has scrolled away from", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 24, rowIndex: 49 });
      simulateScroll({ grid, scrollLeft: 0, scrollTop: 0 });
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });
      act(() => {
        grid.scrollToCell({ columnIndex: 24, rowIndex: 49 });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 1050,
        scrollTop: 900
      });
    });

    it("should ignore the column of single-column grids", () => {
      const grid = renderAndScrollToCell(
        { columnCount: 1, columnWidth: 250 },
        { columnIndex: 0, rowIndex: 49 }
      );
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 0,
        scrollTop: 900
      });
    });

    it("should support scrollToPosition() public method", () => {
      const grid = render<GridImperativeAPI>(getMarkup());
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });

      act(() => {
        grid.scrollToPosition({
          scrollLeft: 50,
          scrollTop: 100
        });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 50,
        scrollTop: 100
      });

      // Change column without affecting row
      act(() => {
        grid.scrollToPosition({
          scrollLeft: 25
        });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 25,
        scrollTop: 100
      });

      // Change row without affecting column
      act(() => {
        grid.scrollToPosition({
          scrollTop: 50
        });
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 25,
        scrollTop: 50
      });
    });

    it("should clamp scrollToPosition() offsets to the scrollable range", () => {
      const grid = render<GridImperativeAPI>(getMarkup());

      act(() => {
        grid.scrollToPosition({
          scrollLeft: 10000,
          scrollTop: 10000
        });
      });
      // 2,500 - 200 and 2,000 - 100
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 2300,
        scrollTop: 1900
      });

      act(() => {
        grid.scrollToPosition({
          scrollLeft: -100,
          scrollTop: -100
        });
      });
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });
    });

    it("should not re-render when scrollToPosition() is called with the current offsets", () => {
      const cellRenderer = vi.fn(defaultCellRenderer);
      const direction = createScrollDirectionTracker();
      const grid = render<GridImperativeAPI>(
        getMarkup({
          cellRenderer,
          overscanIndicesGetter: direction.overscanIndicesGetter
        })
      );
      act(() => {
        grid.scrollToPosition({ scrollLeft: 100, scrollTop: 100 });
      });
      act(() => {
        grid.scrollToPosition({ scrollLeft: 50, scrollTop: 50 });
      });
      expect(direction.horizontal()).toBe(SCROLL_DIRECTION_BACKWARD);
      expect(direction.vertical()).toBe(SCROLL_DIRECTION_BACKWARD);

      cellRenderer.mockClear();
      act(() => {
        grid.scrollToPosition({ scrollLeft: 50, scrollTop: 50 });
        grid.scrollToPosition({ scrollLeft: 50 });
        grid.scrollToPosition({});
      });
      expect(cellRenderer).not.toHaveBeenCalled();

      // A clamped offset that equals the current one is a no-op as well
      act(() => {
        grid.scrollToPosition({ scrollLeft: 10000, scrollTop: 10000 });
      });
      cellRenderer.mockClear();
      act(() => {
        grid.scrollToPosition({ scrollLeft: 20000, scrollTop: 20000 });
      });
      expect(cellRenderer).not.toHaveBeenCalled();
      expect(direction.horizontal()).toBe(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toBe(SCROLL_DIRECTION_FORWARD);
    });

    it("should sync its scroll offsets with the browser if it can't scroll as far as requested", () => {
      // E.g. a Grid whose overflow is hidden by a custom style; browsers clamp the offset (and dispatch no scroll event)
      const elementRef = (element: HTMLDivElement | null) => {
        if (element) {
          let scrollTop = 0;
          Object.defineProperty(element, "scrollTop", {
            configurable: true,
            get: () => scrollTop,
            set: (value: number) => {
              scrollTop = Math.min(value, 20);
            }
          });
        }
      };
      const grid = render<GridImperativeAPI>(getMarkup({ elementRef }));
      act(() => {
        grid.scrollToPosition({ scrollTop: 100 });
      });
      expect(getScrollPosition(grid).scrollTop).toEqual(20);
      // Rows 1-5 are visible (rather than rows 5-9)
      expect(findDOMNode(grid).textContent).toContain("row:1, column:0");
      expect(findDOMNode(grid).textContent).not.toContain("row:6, column:0");
    });

    it("should support handleScrollEvent() public method", () => {
      const grid = render<GridImperativeAPI>(getMarkup());
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });

      act(() => {
        grid.handleScrollEvent({
          scrollLeft: 50,
          scrollTop: 100
        });
      });
      const node = findDOMNode(grid);
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.pointerEvents
      ).toEqual("none"); // isScrolling
      expect(node.textContent).toContain("row:5, column:1");
      expect(node.textContent).not.toContain("row:4, column:0");
    });

    it("should support getOffsetForCell() public method", () => {
      const grid = render<GridImperativeAPI>(getMarkup());
      const { scrollLeft, scrollTop } = grid.getOffsetForCell({
        columnIndex: 24,
        rowIndex: 49
      });
      // 50 columns * 50 item width = 2,500 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(scrollLeft).toEqual(1050);
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(scrollTop).toEqual(900);
    });

    it("should default getOffsetForCell() parameters to the last cell (and auto alignment)", () => {
      const grid = render<GridImperativeAPI>(getMarkup());
      expect(grid.getOffsetForCell()).toEqual({
        scrollLeft: 2300,
        scrollTop: 1900
      });
      // The cell most recently scrolled to isn't remembered
      act(() => {
        grid.scrollToCell({ align: "start", columnIndex: 24, rowIndex: 49 });
      });
      expect(grid.getOffsetForCell()).toEqual({
        scrollLeft: 2300,
        scrollTop: 1900
      });
    });

    it("should not scroll if the Grid has no size", () => {
      const grid = renderAndScrollToCell(
        { height: 0, width: 0 },
        { columnIndex: 10, rowIndex: 50 }
      );
      render(getMarkup());
      expect(getScrollPosition(grid)).toEqual({ scrollLeft: 0, scrollTop: 0 });
    });

    it("should support getTotalRowsHeight() public method", () => {
      const grid = render(getMarkup());
      act(() => {
        grid.recomputeGridSize();
      });
      const totalHeight = grid.getTotalRowsHeight();
      // 100 rows * 20 item height = 2,000 total item height
      expect(totalHeight).toEqual(2000);
    });

    it("should support getTotalColumnsWidth() public method", () => {
      const grid = render(getMarkup());
      act(() => {
        grid.recomputeGridSize();
      });
      const totalWidth = grid.getTotalColumnsWidth();
      // 50 columns * 50 item width = 2,500 total item width
      expect(totalWidth).toEqual(2500);
    });

    it("should not restore scrollLeft when scrolling left and recomputeGridSize with columnIndex smaller than the cell scrolled to", () => {
      const direction = createScrollDirectionTracker();
      const props = {
        columnWidth: 50,
        columnCount: 100,
        height: 100,
        overscanIndicesGetter: direction.overscanIndicesGetter,
        rowCount: 100,
        rowHeight: 20,
        width: 100
      };
      const grid = renderAndScrollToCell(props, {
        columnIndex: 50,
        rowIndex: 50
      });

      expect(getScrollPosition(grid).scrollLeft).toEqual(2450);

      simulateScroll({ grid, scrollLeft: 2250, scrollTop: 920 });
      expect(getScrollPosition(grid).scrollLeft).toEqual(2250);
      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_BACKWARD);

      act(() => {
        grid.recomputeGridSize({ columnIndex: 30 });
      });
      expect(getScrollPosition(grid).scrollLeft).toEqual(2250);
    });

    it("should not restore scrollTop when scrolling up and recomputeGridSize with rowIndex smaller than the cell scrolled to", () => {
      const direction = createScrollDirectionTracker();
      const props = {
        columnWidth: 50,
        columnCount: 100,
        height: 100,
        overscanIndicesGetter: direction.overscanIndicesGetter,
        rowCount: 100,
        rowHeight: 20,
        width: 100
      };
      const grid = renderAndScrollToCell(props, {
        columnIndex: 50,
        rowIndex: 50
      });

      expect(getScrollPosition(grid).scrollTop).toEqual(920);

      simulateScroll({ grid, scrollLeft: 2450, scrollTop: 720 });
      expect(getScrollPosition(grid).scrollTop).toEqual(720);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      act(() => {
        grid.recomputeGridSize({ rowIndex: 20 });
      });
      expect(getScrollPosition(grid).scrollTop).toEqual(720);
    });

    it("should not restore the scroll offset of a cell scrolled to backward when recomputeGridSize is called with a smaller index", () => {
      let rowHeight = 20;
      const props = {
        height: 100,
        rowCount: 100,
        rowHeight: ({ index }: { index: number }) =>
          index === 10 ? rowHeight : 20
      };
      const grid = renderAndScrollToCell(props, { rowIndex: 99 });
      act(() => {
        grid.scrollToCell({ align: "start", rowIndex: 50 });
      });
      expect(getScrollPosition(grid).scrollTop).toEqual(1000);

      rowHeight = 40;
      act(() => {
        grid.recomputeGridSize({ rowIndex: 10 });
      });
      // Scrolling backward; only cells after the target are re-aligned
      expect(getScrollPosition(grid).scrollTop).toEqual(1000);
    });

    it("should take scrollbar size into account when aligning cells", () => {
      const grid = renderAndScrollToCell(
        {
          columnWidth: 50,
          columnCount: 100,
          getScrollbarSize: getScrollbarSize20,
          height: 100,
          rowCount: 100,
          rowHeight: 20,
          width: 100
        },
        { columnIndex: 50, rowIndex: 50 }
      );

      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 2450 + getScrollbarSize20(),
        scrollTop: 920 + getScrollbarSize20()
      });
    });
  });

  describe("property updates", () => {
    it("should not keep the cell scrolled to in view when cell sizes change", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 10, rowIndex: 50 });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 350,
        scrollTop: 920
      });
      // scrollToCell is a one-time scroll; the offsets aren't adjusted afterwards
      render(getMarkup({ columnWidth: 100, rowHeight: 40 }));
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 350,
        scrollTop: 920
      });
      act(() => {
        grid.recomputeGridSize();
      });
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 350,
        scrollTop: 920
      });
    });

    it("should not keep the cell scrolled to in view when the Grid's size changes", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 10, rowIndex: 50 });
      render(getMarkup({ height: 50, width: 100 }));
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 350,
        scrollTop: 920
      });
    });

    it("should not keep the row scrolled to visible once the user has scrolled", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 50 });
      expect(findDOMNode(grid).textContent).toContain("row:50");
      simulateScroll({ grid, scrollTop: 100 });
      render(getMarkup({ height: 20 }));
      expect(getScrollPosition(grid).scrollTop).toEqual(100);
      expect(findDOMNode(grid).textContent).not.toContain("row:50");
    });

    it("should not keep the row scrolled to visible once scrollToPosition() has been called", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 50 });
      act(() => {
        grid.scrollToPosition({ scrollTop: 100 });
      });
      render(getMarkup({ rowHeight: 40 }));
      expect(getScrollPosition(grid).scrollTop).toEqual(100);
    });

    it("should update scroll position if size shrinks smaller than the current scroll", () => {
      const grid = renderAndScrollToCell({}, { columnIndex: 250 });
      render(getMarkup({ columnCount: 10 }));
      expect(findDOMNode(grid).textContent).toContain("column:9");
    });

    it("should update scroll position if size shrinks smaller than the current scroll (rows)", () => {
      const grid = renderAndScrollToCell({}, { rowIndex: 500 });
      render(getMarkup({ rowCount: 10 }));
      expect(findDOMNode(grid).textContent).toContain("row:9");
    });
  });

  describe("noContentRenderer", () => {
    it("should call :noContentRenderer if :columnCount is 0", () => {
      const list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer: () => <div>No data</div>,
            columnCount: 0
          })
        )
      );
      expect(list.textContent).toEqual("No data");
    });

    it("should call :noContentRenderer if :rowCount is 0", () => {
      const list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer: () => <div>No data</div>,
            rowCount: 0
          })
        )
      );
      expect(list.textContent).toEqual("No data");
    });

    // Sanity check for bvaughn/react-virtualized/pull/348
    it("should render an empty body if :rowCount or :columnCount changes to 0", () => {
      function noContentRenderer() {
        return <div>No data</div>;
      }

      let list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer
          })
        )
      );
      expect(list.textContent).not.toEqual("No data");

      list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer,
            rowCount: 0
          })
        )
      );
      expect(list.textContent).toEqual("No data");

      list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer
          })
        )
      );
      expect(list.textContent).not.toEqual("No data");

      list = findDOMNode(
        render(
          getMarkup({
            columnCount: 0,
            noContentRenderer
          })
        )
      );
      expect(list.textContent).toEqual("No data");
    });

    it("should render an empty body if :columnCount is 0 and there is no :noContentRenderer", () => {
      const list = findDOMNode(
        render(
          getMarkup({
            columnCount: 0
          })
        )
      );
      expect(list.textContent).toEqual("");
    });

    it("should render an empty body if :rowCount is 0 and there is no :noContentRenderer", () => {
      const list = findDOMNode(
        render(
          getMarkup({
            rowCount: 0
          })
        )
      );
      expect(list.textContent).toEqual("");
    });

    it("should render an empty body there is a :noContentRenderer but :height or :width are 0", () => {
      let list = findDOMNode(
        render(
          getMarkup({
            height: 0,
            noContentRenderer: () => <div>No data</div>
          })
        )
      );
      expect(list.textContent).toEqual("");
      list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer: () => <div>No data</div>,
            width: 0
          })
        )
      );
      expect(list.textContent).toEqual("");
    });
  });

  describe("onSectionRendered", () => {
    it("should call :onSectionRendered if at least one cell is rendered", () => {
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex;
      render(
        getMarkup({
          onSectionRendered: (params) =>
            ({
              columnStartIndex,
              columnStopIndex,
              rowStartIndex,
              rowStopIndex
            } = params)
        })
      );
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
    });

    it("should not call :onSectionRendered unless the column or row start or stop indices have changed", () => {
      let numCalls = 0;
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex;
      const onSectionRendered = (params: RenderedSection) => {
        columnStartIndex = params.columnStartIndex;
        columnStopIndex = params.columnStopIndex;
        rowStartIndex = params.rowStartIndex;
        rowStopIndex = params.rowStopIndex;
        numCalls++;
      };
      render(getMarkup({ onSectionRendered }));
      expect(numCalls).toEqual(1);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
      render(getMarkup({ onSectionRendered }));
      expect(numCalls).toEqual(1);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
    });

    it("should call :onSectionRendered if the row or column start or stop indices have changed", () => {
      let numCalls = 0;
      let columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex;
      const onSectionRendered = (params: RenderedSection) => {
        columnStartIndex = params.columnStartIndex;
        columnStopIndex = params.columnStopIndex;
        rowStartIndex = params.rowStartIndex;
        rowStopIndex = params.rowStopIndex;
        numCalls++;
      };
      render(getMarkup({ onSectionRendered }));
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
      render(
        getMarkup({
          height: 50,
          onSectionRendered
        })
      );
      expect(numCalls).toEqual(2);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(2);
      render(
        getMarkup({
          height: 50,
          onSectionRendered,
          width: 100
        })
      );
      expect(numCalls).toEqual(3);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(1);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(2);
    });

    it("should not call :onSectionRendered if no cells are rendered", () => {
      let numCalls = 0;
      render(
        getMarkup({
          height: 0,
          onSectionRendered: () => numCalls++
        })
      );
      expect(numCalls).toEqual(0);
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
      vi.restoreAllMocks();
    });

    function getSectionTracker() {
      const section: Partial<RenderedSection> = {};
      return {
        onSectionRendered: (params: RenderedSection) =>
          Object.assign(section, params),
        section
      };
    }

    // Renders the Grid within a scroll container (whose viewport is as big as the Grid's default size),
    // below `contentOffset` pixels of other content; the container is initially scrolled to `scrollTop`.
    function renderInScrollContainer(
      props: Partial<GridProps> = {},
      {
        contentOffset = 0,
        height = DEFAULT_HEIGHT,
        scrollTop = 0
      }: { contentOffset?: number; height?: number; scrollTop?: number } = {}
    ) {
      const container = createScrollContainer({
        contentOffset,
        height,
        width: DEFAULT_WIDTH
      });
      container.element.scrollTop = scrollTop;
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      const markup = (moreProps: Partial<GridProps> = {}) =>
        getMarkup({ scrollElement: container.element, ...props, ...moreProps });
      const grid = render<GridImperativeAPI>(markup());
      return { container, grid, markup, scrollTo };
    }

    it("should render the rows within the viewport of the scroll element", () => {
      const { onSectionRendered, section } = getSectionTracker();
      renderInScrollContainer({ onSectionRendered }, { scrollTop: 100 });
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);
      expect(section.columnStartIndex).toEqual(0);
      expect(section.columnStopIndex).toEqual(3);
    });

    it("should render the rows within the viewport when the scroll element is scrolled", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container, grid } = renderInScrollContainer({
        onSectionRendered
      });
      expect(section.rowStartIndex).toEqual(0);
      expect(section.rowStopIndex).toEqual(4);

      container.scroll(100);
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);
      expect(findDOMNode(grid).textContent).toContain("row:5, column:0");
    });

    it("should render the first rows while the Grid is below the top of the viewport", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container } = renderInScrollContainer(
        { onSectionRendered },
        { contentOffset: 50 }
      );
      expect(section.rowStartIndex).toEqual(0);
      expect(section.rowStopIndex).toEqual(4);

      // The top of the Grid is still 20px below the top of the viewport
      container.scroll(30);
      expect(section.rowStartIndex).toEqual(0);

      container.scroll(150);
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);
    });

    it("should not write the viewport's offset to the DOM", () => {
      const { grid } = renderInScrollContainer({}, { scrollTop: 100 });
      expect(getScrollPosition(grid).scrollTop).toEqual(0);
      expect(findDOMNode(grid).textContent).toContain("row:5, column:0");
    });

    it("should measure the position of its own element within the scroll element", () => {
      const { onSectionRendered, section } = getSectionTracker();
      renderInScrollContainer(
        { onSectionRendered },
        { contentOffset: 50, scrollTop: 150 }
      );
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);
    });

    it("should set the scroll direction when the scroll element is scrolled", async () => {
      const direction = createScrollDirectionTracker();
      const { container } = renderInScrollContainer({
        overscanIndicesGetter: direction.overscanIndicesGetter,
        scrollingResetTimeInterval: 10
      });
      container.scroll(100);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);
      container.scroll(50);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      // Once scrolling stops, the direction is kept
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      container.scroll(150);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);
    });

    it("should still scroll horizontally itself", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { grid } = renderInScrollContainer(
        { onSectionRendered },
        { scrollTop: 100 }
      );
      simulateScroll({ grid, scrollLeft: 250, scrollTop: 0 });
      expect(section.columnStartIndex).toEqual(5);
      expect(section.columnStopIndex).toEqual(8);
      expect(section.rowStartIndex).toEqual(5);
    });

    it("should scroll itself again once the scrollElement is removed", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container, grid, markup } = renderInScrollContainer(
        { onSectionRendered },
        { scrollTop: 100 }
      );
      expect(findDOMNode(grid).style.height).toEqual("auto");

      render(markup({ scrollElement: undefined }));
      expect(findDOMNode(grid).style.height).toEqual(`${DEFAULT_HEIGHT}px`);
      expect(section.rowStartIndex).toEqual(0);

      container.scroll(200);
      expect(section.rowStartIndex).toEqual(0);

      simulateScroll({ grid, scrollTop: 100 });
      expect(section.rowStartIndex).toEqual(5);
    });

    it("should link once the scrollElement is specified", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const container = createScrollContainer({
        height: DEFAULT_HEIGHT,
        width: DEFAULT_WIDTH
      });
      container.element.scrollTop = 200;
      const grid = render(getMarkup({ onSectionRendered }));
      expect(findDOMNode(grid).style.height).toEqual(`${DEFAULT_HEIGHT}px`);
      expect(section.rowStartIndex).toEqual(0);

      render(
        getMarkup({ onSectionRendered, scrollElement: container.element })
      );
      expect(findDOMNode(grid).style.height).toEqual("auto");
      expect(section.rowStartIndex).toEqual(10);
      expect(getObserverCount(container.element)).toBe(1);
    });

    it("should report the viewport's offset to onScroll", () => {
      const onScroll = vi.fn();
      const { container } = renderInScrollContainer(
        { onScroll },
        { contentOffset: 100 }
      );
      onScroll.mockClear();

      container.scroll(200);
      expect(onScroll).toHaveBeenLastCalledWith({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 100,
        scrollWidth: 2500
      });

      // Offsets above the Grid are reported as 0
      container.scroll(0);
      expect(onScroll).toHaveBeenLastCalledWith(
        expect.objectContaining({ scrollTop: 0 })
      );
    });

    describe("scrollToCell", () => {
      it("should scroll the scroll element instead of itself (#32)", () => {
        const { container, grid, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToCell({ rowIndex: 49 });
        });
        expect(scrollTo).toHaveBeenCalledTimes(1);
        expect(scrollTo).toHaveBeenLastCalledWith(0, 900);
        expect(container.element.scrollTop).toEqual(900);
        expect(getScrollPosition(grid).scrollTop).toEqual(0);

        // The rendered rows are updated once the scroll element has been scrolled
        expect(findDOMNode(grid).textContent).toContain("row:49, column:0");
        expect(scrollTo).toHaveBeenCalledTimes(1);
      });

      it("should scroll by the position of the Grid within the scroll element", () => {
        const { grid, scrollTo } = renderInScrollContainer(
          {},
          { contentOffset: 300 }
        );

        act(() => {
          grid.scrollToCell({ align: "start", rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 200 + 300);
        expect(findDOMNode(grid).textContent).toContain("row:10, column:0");
      });

      it("should support the align parameter", () => {
        const { grid, scrollTo } = renderInScrollContainer(
          {},
          { scrollTop: 500 }
        );

        act(() => {
          grid.scrollToCell({ align: "start", rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 200);

        act(() => {
          grid.scrollToCell({ align: "end", rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 120);

        act(() => {
          grid.scrollToCell({ align: "center", rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 160);
      });

      it("should not scroll to a row that is already visible within the viewport", () => {
        // The top of the Grid is 50px below the top of the viewport
        const { grid, scrollTo } = renderInScrollContainer(
          {},
          { contentOffset: 50 }
        );

        act(() => {
          grid.scrollToCell({ rowIndex: 0 });
        });
        expect(scrollTo).not.toHaveBeenCalled();

        // The least amount possible (the end of row 2 is 10px below the bottom of the viewport)
        act(() => {
          grid.scrollToCell({ rowIndex: 2 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 10);
      });

      it("should scroll the last rows to the start of the viewport, leaving the scroll element to limit the offset (#1895)", () => {
        // e.g. content below the Grid lets the last rows be scrolled to the top of the viewport
        const { grid, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToCell({ align: "start", rowIndex: 99 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 1980);

        act(() => {
          grid.scrollToCell({ align: "center", rowIndex: 99 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 1940);
      });

      it("should align a row taller than the viewport to its start with auto alignment (#1264)", () => {
        const { grid, scrollTo } = renderInScrollContainer({
          rowHeight: ({ index }) => (index === 10 ? 300 : 20)
        });

        act(() => {
          grid.scrollToCell({ rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 200);
      });

      it("should keep scrolling its own element horizontally", () => {
        const { grid, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToCell({ columnIndex: 24, rowIndex: 49 });
        });
        expect(getScrollPosition(grid).scrollLeft).toEqual(1050);
        expect(scrollTo).toHaveBeenLastCalledWith(0, 900);
      });

      it("should preserve the horizontal scroll position of the scroll element (#18)", () => {
        const { container, grid, scrollTo } = renderInScrollContainer();
        container.scroll(0, 30);

        act(() => {
          grid.scrollToCell({ align: "start", rowIndex: 10 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(30, 200);
      });

      it("should stop keeping the row in view once the user scrolls", () => {
        const { container, grid, markup, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToCell({ align: "start", rowIndex: 10 });
        });
        expect(container.element.scrollTop).toEqual(200);

        // A scroll by the user
        container.scroll(400);

        render(markup({ rowHeight: 30 }));
        expect(scrollTo).toHaveBeenCalledTimes(1);
      });
    });

    describe("scrollToPosition", () => {
      it("should scroll the scroll element instead of itself", () => {
        const { grid, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToPosition({ scrollTop: 300 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 300);
        expect(getScrollPosition(grid).scrollTop).toEqual(0);
        expect(findDOMNode(grid).textContent).toContain("row:15, column:0");
      });

      it("should clamp the offset to the scrollable range", () => {
        const { grid, scrollTo } = renderInScrollContainer(
          {},
          { scrollTop: 100 }
        );

        act(() => {
          grid.scrollToPosition({ scrollTop: 5000 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 1900);

        act(() => {
          grid.scrollToPosition({ scrollTop: -100 });
        });
        expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
      });

      it("should do nothing if the offset equals the current (reported) offset", () => {
        const { container, grid, scrollTo } = renderInScrollContainer(
          {},
          { contentOffset: 100, scrollTop: 200 }
        );

        act(() => {
          grid.scrollToPosition({ scrollTop: 100 });
        });
        expect(scrollTo).not.toHaveBeenCalled();

        // Above the Grid, the offset is reported as 0
        container.scroll(0);
        act(() => {
          grid.scrollToPosition({ scrollTop: 0 });
        });
        expect(scrollTo).not.toHaveBeenCalled();
      });

      it("should scroll its own element horizontally", () => {
        const { grid, scrollTo } = renderInScrollContainer();

        act(() => {
          grid.scrollToPosition({ scrollLeft: 250 });
        });
        expect(getScrollPosition(grid).scrollLeft).toEqual(250);
        expect(scrollTo).not.toHaveBeenCalled();
      });

      it("should set scrollTop on a scroll element without scrollTo()", () => {
        const { container, grid } = renderInScrollContainer(
          {},
          { contentOffset: 100 }
        );
        (container.element as any).scrollTo = undefined;

        act(() => {
          grid.scrollToPosition({ scrollTop: 200 });
        });
        expect(container.element.scrollTop).toEqual(300);
      });
    });

    it("should calculate offsets (getOffsetForCell) relative to the viewport", () => {
      const { grid } = renderInScrollContainer({}, { contentOffset: 50 });
      expect(grid.getOffsetForCell({ rowIndex: 0 }).scrollTop).toEqual(-50);
      expect(grid.getOffsetForCell({ rowIndex: 49 }).scrollTop).toEqual(900);
    });

    it("should pass the cellRenderer an :isScrolling flag while the scroll element is scrolled", async () => {
      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation(({ key, style }) => (
        <div key={key} style={style} />
      ));
      const { container } = renderInScrollContainer({
        cellRenderer,
        scrollingResetTimeInterval: 10
      });
      expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(false);

      cellRenderer.mockClear();
      container.scroll(100);
      expect(cellRenderer).toHaveBeenCalled();
      expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(true);

      cellRenderer.mockClear();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      expect(cellRenderer).toHaveBeenCalled();
      expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(false);
    });

    it("should use the viewport height of the scroll element (rather than the height prop)", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container } = renderInScrollContainer(
        { height: 40, onSectionRendered },
        { height: 200 }
      );
      expect(section.rowStopIndex).toEqual(9);

      // Not required with a scrollElement
      render(
        getMarkup({
          height: undefined,
          onSectionRendered,
          scrollElement: container.element
        })
      );
      expect(section.rowStopIndex).toEqual(9);
    });

    it("should use the height prop until the scroll element is available", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const grid = render(
        getMarkup({ height: 60, onSectionRendered, scrollElement: null })
      );
      // Rendered in full-height style, as if at the top of the scroll element
      expect(findDOMNode(grid).style.height).toEqual("auto");
      expect(section.rowStartIndex).toEqual(0);
      expect(section.rowStopIndex).toEqual(2);
    });

    it("should re-measure the viewport and position when the scroll element is resized", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container } = renderInScrollContainer(
        { onSectionRendered },
        { contentOffset: 100, scrollTop: 200 }
      );
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);

      container.resize({ height: 200 });
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(14);

      // The content above the Grid grows along with it
      container.setContentOffset(140);
      container.resize({ height: 100 });
      expect(section.rowStartIndex).toEqual(3);
      expect(section.rowStopIndex).toEqual(7);
    });

    it("should re-measure its position after a re-render", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container, grid, markup, scrollTo } = renderInScrollContainer(
        { onSectionRendered },
        { contentOffset: 100, scrollTop: 200 }
      );
      expect(section.rowStartIndex).toEqual(5);

      // The content above the Grid changed size (without a scroll or resize event)
      container.setContentOffset(140);
      act(() => {
        grid.forceUpdate();
      });
      expect(section.rowStartIndex).toEqual(3);

      container.setContentOffset(100);
      render(markup({ className: "updated" }));
      expect(section.rowStartIndex).toEqual(5);

      // Scrolling measures the position again as well
      container.setContentOffset(0);
      act(() => {
        grid.scrollToCell({ align: "start", rowIndex: 20 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 400);
    });

    it("should start and stop listening when the scrollElement changes from null to an element and back (#6)", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const container = createScrollContainer({
        height: DEFAULT_HEIGHT,
        width: DEFAULT_WIDTH
      });
      container.element.scrollTop = 250;
      const addEventListener = vi.spyOn(container.element, "addEventListener");
      const removeEventListener = vi.spyOn(
        container.element,
        "removeEventListener"
      );

      const grid = render(
        getMarkup({ onSectionRendered, scrollElement: null })
      );
      expect(section.rowStartIndex).toEqual(0);
      expect(addEventListener).not.toHaveBeenCalled();

      render(
        getMarkup({ onSectionRendered, scrollElement: container.element })
      );
      expect(addEventListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );
      expect(getObserverCount(container.element)).toBe(1);
      expect(section.rowStartIndex).toEqual(12);

      container.scroll(500);
      expect(section.rowStartIndex).toEqual(25);

      render(getMarkup({ onSectionRendered, scrollElement: null }));
      expect(removeEventListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );
      expect(getObserverCount(container.element)).toBe(0);
      // Rendered as if at the top again, in full-height style
      expect(findDOMNode(grid).style.height).toEqual("auto");
      expect(section.rowStartIndex).toEqual(0);

      container.scroll(1000);
      expect(section.rowStartIndex).toEqual(0);
    });

    it("should move its listeners when the scrollElement changes from one element to another", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const containerA = createScrollContainer({ height: DEFAULT_HEIGHT });
      const containerB = createScrollContainer({
        adopt: false,
        height: DEFAULT_HEIGHT
      });
      containerB.element.scrollTop = 400;

      render(
        getMarkup({ onSectionRendered, scrollElement: containerA.element })
      );
      containerB.adopt();
      render(
        getMarkup({ onSectionRendered, scrollElement: containerB.element })
      );
      expect(getObserverCount(containerA.element)).toBe(0);
      expect(getObserverCount(containerB.element)).toBe(1);
      expect(section.rowStartIndex).toEqual(20);

      containerA.scroll(100);
      expect(section.rowStartIndex).toEqual(20);

      containerB.scroll(200);
      expect(section.rowStartIndex).toEqual(10);
    });

    it("should remove its listeners when it unmounts", () => {
      const container = createScrollContainer({ height: DEFAULT_HEIGHT });
      const removeEventListener = vi.spyOn(
        container.element,
        "removeEventListener"
      );
      render(getMarkup({ scrollElement: container.element }));
      expect(getObserverCount(container.element)).toBe(1);

      render.unmount();
      expect(removeEventListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );
      expect(getObserverCount(container.element)).toBe(0);
    });

    it("should ignore initialScrollTop", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const { container, grid, scrollTo } = renderInScrollContainer({
        initialScrollLeft: 100,
        initialScrollTop: 500,
        onSectionRendered
      });
      expect(section.rowStartIndex).toEqual(0);
      expect(section.columnStartIndex).toEqual(2);
      expect(scrollTo).not.toHaveBeenCalled();
      expect(container.element.scrollTop).toEqual(0);
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 100,
        scrollTop: 0
      });
    });

    it("should warn in DEV if there is neither a height nor a scrollElement", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      render(getMarkup({ height: undefined }));
      expect(console.warn).toHaveBeenCalledWith(
        "Grid requires a height prop (unless a scrollElement is specified)"
      );
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("should not warn about a missing height with a scrollElement", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      const container = createScrollContainer();
      render(
        getMarkup({ height: undefined, scrollElement: container.element })
      );
      render(getMarkup({ height: undefined, scrollElement: null }));
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should be scrolled by the window (scrollElement="window")', () => {
      const { onSectionRendered, section } = getSectionTracker();
      const windowScrolling = mockWindowScrolling({ innerHeight: 100 });
      const scrollTo = vi.spyOn(windowScrolling, "scrollTo");
      // Content above the Grid (100px)
      const contentAbove = document.createElement("div");
      contentAbove.style.height = "100px";
      document.body.insertBefore(contentAbove, getMountNode());

      const grid = render<GridImperativeAPI>(
        getMarkup({ onSectionRendered, scrollElement: "window" })
      );
      expect(findDOMNode(grid).style.height).toEqual("auto");
      expect(section.rowStartIndex).toEqual(0);
      expect(section.rowStopIndex).toEqual(4);

      windowScrolling.scroll(200);
      expect(section.rowStartIndex).toEqual(5);
      expect(section.rowStopIndex).toEqual(9);

      windowScrolling.resize({ height: 200 });
      expect(section.rowStopIndex).toEqual(14);

      act(() => {
        grid.scrollToCell({ align: "start", rowIndex: 49 });
      });
      expect(window.scrollY).toEqual(980 + 100);
      expect(section.rowStartIndex).toEqual(49);
      void scrollTo;
      contentAbove.remove();
    });

    it("should work in StrictMode", () => {
      const { onSectionRendered, section } = getSectionTracker();
      const ref = createRef<GridImperativeAPI>();
      const container = createScrollContainer({ height: DEFAULT_HEIGHT });
      container.element.scrollTop = 100;
      const addEventListener = vi.spyOn(container.element, "addEventListener");
      const removeEventListener = vi.spyOn(
        container.element,
        "removeEventListener"
      );
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(
        <StrictMode>
          <div>
            {getMarkup({
              onSectionRendered,
              ref,
              scrollElement: container.element
            } as Partial<GridProps>)}
          </div>
        </StrictMode>
      );
      expect(section.rowStartIndex).toEqual(5);
      // Effects are mounted, unmounted and re-mounted; exactly one listener/observer remains
      const countScrollListeners = (spy: typeof addEventListener) =>
        spy.mock.calls.filter(([type]) => type === "scroll").length;
      expect(
        countScrollListeners(addEventListener) -
          countScrollListeners(removeEventListener)
      ).toBe(1);
      expect(getObserverCount(container.element)).toBe(1);

      container.scroll(200);
      expect(section.rowStartIndex).toEqual(10);

      act(() => {
        ref.current!.scrollToCell({ align: "start", rowIndex: 50 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 1000);
      expect(section.rowStartIndex).toEqual(50);
    });
  });

  describe("styles, classNames, ids, and roles", () => {
    it("should use the expected global CSS classNames", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.className).toEqual("ReactVirtualized__Grid");
    });

    it("should use a custom :className if specified", () => {
      const rendered = findDOMNode(render(getMarkup({ className: "foo" })));
      expect(rendered.className).toContain("foo");
    });

    it("should use a custom :id if specified", () => {
      const rendered = findDOMNode(render(getMarkup({ id: "bar" })));
      expect(rendered.getAttribute("id")).toEqual("bar");
    });

    it("should use a custom :style if specified", () => {
      const style = { backgroundColor: "red" };
      const rendered = findDOMNode(render(getMarkup({ style })));
      expect(rendered.style.backgroundColor).toEqual("red");
    });

    it("should use a custom :containerStyle if specified", () => {
      const containerStyle = { backgroundColor: "red" };
      const rendered = findDOMNode(render(getMarkup({ containerStyle })));
      expect(
        rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.backgroundColor
      ).toEqual("red");
    });

    it("should have the gridcell role", () => {
      const containerStyle = { backgroundColor: "red" };
      const rendered = findDOMNode(render(getMarkup({ containerStyle })));
      expect(rendered.querySelectorAll('[role="gridcell"]').length).toEqual(20);
    });
  });

  describe("onScroll", () => {
    it("should trigger callback when component is mounted", () => {
      const onScrollCalls: any[] = [];
      render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 100,
          clientWidth: 200,
          scrollHeight: 2000,
          scrollLeft: 0,
          scrollTop: 0,
          scrollWidth: 2500
        }
      ]);
    });

    it("should be called with the latest props", () => {
      const onScrollA = vi.fn();
      const onScrollB = vi.fn();
      const grid = render(getMarkup({ onScroll: onScrollA }));
      render(getMarkup({ height: 50, onScroll: onScrollB }));
      simulateScroll({ grid, scrollTop: 100 });
      expect(onScrollA).toHaveBeenCalledTimes(1); // On mount
      expect(onScrollB).toHaveBeenCalledTimes(1);
      expect(onScrollB.mock.calls[0][0]).toMatchObject({
        clientHeight: 50,
        scrollTop: 100
      });
    });

    it("should trigger callback when component scrolls horizontally", () => {
      const onScrollCalls: any[] = [];
      const grid = render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      simulateScroll({
        grid,
        scrollLeft: 100,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 100,
        scrollTop: 0,
        scrollWidth: 2500
      });
    });

    it("should trigger callback when component scrolls vertically", () => {
      const onScrollCalls: any[] = [];
      const grid = render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 100
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 100,
        scrollWidth: 2500
      });
    });

    it("should trigger callback with scrollLeft of 0 when total columns width is less than width", () => {
      const onScrollCalls: any[] = [];
      const grid = render(
        getMarkup({
          columnCount: 1,
          columnWidth: 50,
          onScroll: (params) => onScrollCalls.push(params),
          width: 200
        })
      );
      act(() => {
        grid.scrollToPosition({ scrollTop: 10 });
      });
      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(3);
      expect(onScrollCalls[2]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 50
      });
    });

    it("should trigger callback with scrollTop of 0 when total rows height is less than height", () => {
      const onScrollCalls: any[] = [];
      const grid = render(
        getMarkup({
          rowCount: 1,
          rowHeight: 50,
          onScroll: (params) => onScrollCalls.push(params),
          height: 200
        })
      );
      act(() => {
        grid.scrollToPosition({ scrollLeft: 10 });
      });
      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(3);
      expect(onScrollCalls[2]).toEqual({
        clientHeight: 200,
        clientWidth: 200,
        scrollHeight: 50,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 2500
      });
    });

    // Lets onScroll listeners (e.g. ScrollSync) stay in sync with scroll-to-cell changes.
    it("should trigger when scrollToCell() is called", () => {
      const onScrollCalls: any[] = [];
      const grid = render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      onScrollCalls.splice(0);
      act(() => {
        grid.scrollToCell({ columnIndex: 24, rowIndex: 49 });
      });
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 100,
          clientWidth: 200,
          scrollHeight: 2000,
          scrollLeft: 1050,
          scrollTop: 900,
          scrollWidth: 2500
        }
      ]);
    });
  });

  describe("overscanColumnCount & overscanRowCount", () => {
    function createHelper() {
      let columnOverscanStartIndex: number | undefined,
        columnOverscanStopIndex: number | undefined,
        columnStartIndex: number | undefined,
        columnStopIndex: number | undefined,
        rowOverscanStartIndex: number | undefined,
        rowOverscanStopIndex: number | undefined,
        rowStartIndex: number | undefined,
        rowStopIndex: number | undefined;

      function onSectionRendered(params: any) {
        columnOverscanStartIndex = params.columnOverscanStartIndex;
        columnOverscanStopIndex = params.columnOverscanStopIndex;
        columnStartIndex = params.columnStartIndex;
        columnStopIndex = params.columnStopIndex;
        rowOverscanStartIndex = params.rowOverscanStartIndex;
        rowOverscanStopIndex = params.rowOverscanStopIndex;
        rowStartIndex = params.rowStartIndex;
        rowStopIndex = params.rowStopIndex;
      }

      return {
        columnOverscanStartIndex: () => columnOverscanStartIndex,
        columnOverscanStopIndex: () => columnOverscanStopIndex,
        columnStartIndex: () => columnStartIndex,
        columnStopIndex: () => columnStopIndex,
        onSectionRendered,
        rowOverscanStartIndex: () => rowOverscanStartIndex,
        rowOverscanStopIndex: () => rowOverscanStopIndex,
        rowStartIndex: () => rowStartIndex,
        rowStopIndex: () => rowStopIndex
      };
    }

    it("should not overscan if disabled", () => {
      const helper = createHelper();
      render(
        getMarkup({
          onSectionRendered: helper.onSectionRendered
        })
      );
      expect(helper.columnOverscanStartIndex()).toEqual(
        helper.columnStartIndex()
      );
      expect(helper.columnOverscanStopIndex()).toEqual(
        helper.columnStopIndex()
      );
      expect(helper.rowOverscanStartIndex()).toEqual(helper.rowStartIndex());
      expect(helper.rowOverscanStopIndex()).toEqual(helper.rowStopIndex());
    });

    it("should overscan the specified amount", () => {
      const helper = createHelper();
      renderAndScrollToCell(
        {
          onSectionRendered: helper.onSectionRendered,
          overscanColumnCount: 2,
          overscanRowCount: 5
        },
        { columnIndex: 25, rowIndex: 50 }
      );
      expect(helper.columnOverscanStartIndex()).toEqual(22);
      expect(helper.columnOverscanStopIndex()).toEqual(27);
      expect(helper.columnStartIndex()).toEqual(22);
      expect(helper.columnStopIndex()).toEqual(25);
      expect(helper.rowOverscanStartIndex()).toEqual(46);
      expect(helper.rowOverscanStopIndex()).toEqual(55);
      expect(helper.rowStartIndex()).toEqual(46);
      expect(helper.rowStopIndex()).toEqual(50);
    });

    it("should not overscan beyond the bounds of the grid", () => {
      const helper = createHelper();
      render(
        getMarkup({
          onSectionRendered: helper.onSectionRendered,
          columnCount: 6,
          overscanColumnCount: 10,
          overscanRowCount: 10,
          rowCount: 5
        })
      );
      expect(helper.columnOverscanStartIndex()).toEqual(0);
      expect(helper.columnOverscanStopIndex()).toEqual(5);
      expect(helper.columnStartIndex()).toEqual(0);
      expect(helper.columnStopIndex()).toEqual(3);
      expect(helper.rowOverscanStartIndex()).toEqual(0);
      expect(helper.rowOverscanStopIndex()).toEqual(4);
      expect(helper.rowStartIndex()).toEqual(0);
      expect(helper.rowStopIndex()).toEqual(4);
    });

    it("should set the correct scroll direction", () => {
      const direction = createScrollDirectionTracker();
      const grid = render(
        getMarkup({ overscanIndicesGetter: direction.overscanIndicesGetter })
      );

      simulateScroll({
        grid,
        scrollLeft: 50,
        scrollTop: 50
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_BACKWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      simulateScroll({
        grid,
        scrollLeft: 100,
        scrollTop: 100
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);
    });

    it("should set the correct scroll direction when scroll position is updated with scrollToPosition()", () => {
      const direction = createScrollDirectionTracker();
      const grid = render(
        getMarkup({ overscanIndicesGetter: direction.overscanIndicesGetter })
      );

      act(() => {
        grid.scrollToPosition({ scrollLeft: 50, scrollTop: 50 });
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);

      act(() => {
        grid.scrollToPosition({ scrollLeft: 0, scrollTop: 0 });
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_BACKWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      act(() => {
        grid.scrollToPosition({ scrollLeft: 100, scrollTop: 100 });
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);

      // Only the axis that changed changes direction
      act(() => {
        grid.scrollToPosition({ scrollLeft: 50, scrollTop: 100 });
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_BACKWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);
    });

    it("should not reset scroll direction for one axis when scrolled in another", () => {
      const direction = createScrollDirectionTracker();
      const grid = render(
        getMarkup({ overscanIndicesGetter: direction.overscanIndicesGetter })
      );

      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 5
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid,
        scrollLeft: 5,
        scrollTop: 5
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid,
        scrollLeft: 5,
        scrollTop: 0
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_FORWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);

      simulateScroll({
        grid,
        scrollLeft: 0,
        scrollTop: 0
      });

      expect(direction.horizontal()).toEqual(SCROLL_DIRECTION_BACKWARD);
      expect(direction.vertical()).toEqual(SCROLL_DIRECTION_BACKWARD);
    });

    it("should overscan in the direction being scrolled", async () => {
      const helper = createHelper();

      let onSectionRenderedResolve: any;

      function onSectionRendered(params: any) {
        helper.onSectionRendered(params);

        if (onSectionRenderedResolve) {
          onSectionRenderedResolve();
        }
      }

      const grid = render(
        getMarkup({
          onSectionRendered,
          overscanColumnCount: 2,
          overscanRowCount: 5
        })
      );

      // Wait until the onSectionRendered handler / debouncer has processed
      let onSectionRenderedPromise = new Promise((resolve) => {
        onSectionRenderedResolve = resolve;
      });

      simulateScroll({
        grid,
        scrollLeft: 200,
        scrollTop: 200
      });

      await onSectionRenderedPromise;

      // It should overscan in the direction being scrolled while scroll is in progress
      expect(helper.columnOverscanStartIndex()).toEqual(4);
      expect(helper.columnOverscanStopIndex()).toEqual(9);
      expect(helper.columnStartIndex()).toEqual(4);
      expect(helper.columnStopIndex()).toEqual(7);
      expect(helper.rowOverscanStartIndex()).toEqual(10);
      expect(helper.rowOverscanStopIndex()).toEqual(19);
      expect(helper.rowStartIndex()).toEqual(10);
      expect(helper.rowStopIndex()).toEqual(14);

      // Wait until the onSectionRendered handler / debouncer has processed
      onSectionRenderedPromise = new Promise((resolve) => {
        onSectionRenderedResolve = resolve;
      });

      simulateScroll({
        grid,
        scrollLeft: 100,
        scrollTop: 100
      });

      await onSectionRenderedPromise;

      // It reset overscan once scrolling has finished
      expect(helper.columnOverscanStartIndex()).toEqual(0);
      expect(helper.columnOverscanStopIndex()).toEqual(5);
      expect(helper.columnStartIndex()).toEqual(2);
      expect(helper.columnStopIndex()).toEqual(5);
      expect(helper.rowOverscanStartIndex()).toEqual(0);
      expect(helper.rowOverscanStopIndex()).toEqual(9);
      expect(helper.rowStartIndex()).toEqual(5);
      expect(helper.rowStopIndex()).toEqual(9);
    });
  });

  describe("cellRangeRenderer", () => {
    it("should use a custom :cellRangeRenderer if specified", () => {
      let cellRangeRendererCalled = 0;
      let cellRangeRendererParams: any;
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRangeRenderer: (params) => {
              cellRangeRendererParams = params;
              cellRangeRendererCalled++;

              return [<div key="0">Fake content</div>];
            }
          })
        )
      );
      expect(cellRangeRendererCalled).toEqual(1);
      expect(cellRangeRendererParams.columnStartIndex).toEqual(0);
      expect(cellRangeRendererParams.columnStopIndex).toEqual(3);
      expect(cellRangeRendererParams.rowStartIndex).toEqual(0);
      expect(cellRangeRendererParams.rowStopIndex).toEqual(4);
      expect(rendered.textContent).toContain("Fake content");
    });
  });

  describe("estimated row and column sizes", () => {
    it("should not estimate sizes if actual sizes are numbers", () => {
      // (No cells are measured, since nothing is rendered)
      const grid = render(
        getMarkup({
          columnWidth: 100,
          estimatedColumnSize: 150,
          estimatedRowSize: 15,
          height: 0,
          rowHeight: 20,
          width: 0
        })
      );
      expect(grid.getTotalColumnsWidth()).toEqual(NUM_COLUMNS * 100);
      expect(grid.getTotalRowsHeight()).toEqual(NUM_ROWS * 20);
    });

    it("should estimate row and column sizes if actual sizes are functions", () => {
      // (No cells are measured, since nothing is rendered)
      const grid = render(
        getMarkup({
          columnWidth: () => 100,
          estimatedColumnSize: 150,
          estimatedRowSize: 15,
          height: 0,
          rowHeight: () => 20,
          width: 0
        })
      );
      expect(grid.getTotalColumnsWidth()).toEqual(NUM_COLUMNS * 150);
      expect(grid.getTotalRowsHeight()).toEqual(NUM_ROWS * 15);

      // Changing an estimated size is reflected as well
      render(
        getMarkup({
          columnWidth: () => 100,
          estimatedColumnSize: 75,
          estimatedRowSize: 15,
          height: 0,
          rowHeight: () => 20,
          width: 0
        })
      );
      expect(grid.getTotalColumnsWidth()).toEqual(NUM_COLUMNS * 75);
    });
  });

  it("should pass the cellRenderer an :isScrolling flag when scrolling is in progress", async () => {
    const cellRendererCalls: any[] = [];
    function cellRenderer({
      columnIndex,
      isScrolling,
      key,
      rowIndex,
      style
    }: any) {
      cellRendererCalls.push(isScrolling);
      return defaultCellRenderer({ columnIndex, key, rowIndex, style });
    }
    const grid = render(
      getMarkup({
        cellRenderer
      })
    );
    expect(cellRendererCalls[0]).toEqual(false);
    cellRendererCalls.splice(0);

    // Give React time to process the queued setState()
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    simulateScroll({ grid, scrollTop: 100 });
    expect(cellRendererCalls[0]).toEqual(true);
  });

  it("should pass the cellRenderer an :isScrolling flag based on the scrolling of its scroll element", async () => {
    const cellRenderer = vi.fn();
    cellRenderer.mockImplementation(({ key, style }) => (
      <div key={key} style={style} />
    ));
    const container = createScrollContainer({ height: DEFAULT_HEIGHT });
    render(
      getMarkup({
        cellRenderer,
        scrollElement: container.element,
        scrollingResetTimeInterval: 10
      })
    );
    cellRenderer.mockReset();
    container.scroll(10);
    expect(cellRenderer).toHaveBeenCalled();
    expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(true);
    cellRenderer.mockReset();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(cellRenderer).toHaveBeenCalled();
    expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(false);
  });

  it("should pass the cellRenderer an :isVisible flag", () => {
    const cellRendererCalls: any[] = [];
    function cellRenderer(props: any) {
      cellRendererCalls.push(props);
      return defaultCellRenderer(props);
    }
    render(
      getMarkup({
        cellRenderer,
        height: DEFAULT_ROW_HEIGHT,
        overscanColumnCount: 1,
        overscanRowCount: 1,
        width: DEFAULT_COLUMN_WIDTH
      })
    );
    cellRendererCalls.forEach((props: any) => {
      expect(props.isVisible).toEqual(
        props.columnIndex === 0 && props.rowIndex === 0
      ); // Only the first cell is visible
    });
  });

  describe("cell caching", () => {
    it("should not cache cells if the Grid is not scrolling", () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      cellRendererCalls.splice(0);

      act(() => {
        grid.forceUpdate();
      });
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);
    });

    it("should not cache cells if the offsets are not adjusted", () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        rowCount: 100000,
        width: 100
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      cellRendererCalls.splice(0);

      act(() => {
        grid.forceUpdate();
      });
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);
    });

    it("should cache a cell once it has been rendered while scrolling", () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      simulateScroll({ grid, scrollTop: 1 });

      cellRendererCalls.splice(0);

      // Rows 0-2 have already rendered but row 3 is not yet visible
      // This means that only row 3 should be newly-created
      // The others should come from the cache
      act(() => {
        grid.scrollToCell({ rowIndex: 3 });
      });
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 3 }]);
    });

    it("should clear cache once :isScrolling is false", async () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      simulateScroll({ grid, scrollTop: 1 });

      // Allow scrolling timeout to complete so that cell cache is reset
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2)
        );
      });

      cellRendererCalls.splice(0);

      act(() => {
        grid.forceUpdate();
      });
      expect(cellRendererCalls.length).not.toEqual(0);
    });

    it("should clear cache once its scroll element stops scrolling", async () => {
      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation((params: any) => (
        <div key={params.key} style={params.style} />
      ));

      const container = createScrollContainer({ height: DEFAULT_HEIGHT });
      const props = {
        cellRenderer,
        columnCount: 1,
        rowCount: 1,
        scrollElement: container.element,
        scrollingResetTimeInterval: 10
      };

      render(getMarkup(props));
      container.scroll(1);
      expect(cellRenderer.mock.lastCall![0].isScrolling).toBe(true);
      const scrollingStyle = cellRenderer.mock.lastCall![0].style;
      cellRenderer.mockReset();

      render(getMarkup(props));
      container.scroll(2);
      expect(cellRenderer).toHaveBeenCalledTimes(0); // Due to cell cache

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      expect(cellRenderer).toHaveBeenCalledTimes(1); // Reset cell cache
      expect(cellRenderer.mock.calls[0][0].isScrolling).toBe(false);
      expect(cellRenderer.mock.calls[0][0].style).toEqual(scrollingStyle);
    });

    it("should clear cache if :recomputeGridSize is called", () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      simulateScroll({ grid, scrollTop: 1 });

      cellRendererCalls.splice(0);

      act(() => {
        grid.recomputeGridSize();
      });

      expect(cellRendererCalls.length).not.toEqual(0);
    });

    it("should not clear cache if :isScrollingOptOut is true", async () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const container = createScrollContainer({ height: 40, width: 100 });
      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100,
        isScrollingOptOut: true,
        scrollElement: container.element,
        scrollingResetTimeInterval: 10
      };

      render(getMarkup(props));
      render(getMarkup(props));
      // Visible cells are cached (also when the Grid is linked to its scroll element, after mounting)
      expect(cellRendererCalls).toEqual([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 0, rowIndex: 1 }
      ]);

      cellRendererCalls.splice(0);

      // The scroll element scrolls (without changing the visible cells)
      container.scroll(0);

      // Only cleared non-visible cells
      expect(cellRendererCalls.length).toEqual(0);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      expect(cellRendererCalls.length).toEqual(0);
    });

    it("should not re-render visible cells when scrolling stops if :isScrollingOptOut is true", async () => {
      const cellRenderer = vi.fn(defaultCellRenderer);
      const grid = render(
        getMarkup({
          cellRenderer,
          columnWidth: 100,
          height: 40,
          isScrollingOptOut: true,
          rowHeight: 20,
          width: 100
        })
      );

      simulateScroll({ grid, scrollTop: 20 });
      cellRenderer.mockClear();

      // Allow the scrolling timeout to complete
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2)
        );
      });

      expect(
        findDOMNode(grid).querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.pointerEvents
      ).toEqual(""); // No longer scrolling
      expect(cellRenderer).not.toHaveBeenCalled();
    });

    // Bug #13
    it("should re-render visible cells when props change (or forceUpdate is called) even if :isScrollingOptOut is true", () => {
      const props = {
        columnWidth: 100,
        height: 40,
        isScrollingOptOut: true,
        rowHeight: 20,
        width: 100
      };

      const grid = render(
        getMarkup({
          ...props,
          cellRenderer: ({ key, rowIndex, style }) => (
            <div key={key} style={style}>
              {`A${rowIndex}`}
            </div>
          )
        })
      );
      expect(findDOMNode(grid).textContent).toEqual("A0A1");

      let label = "B";
      const cellRenderer = ({ key, rowIndex, style }: CellRendererParams) => (
        <div key={key} style={style}>
          {`${label}${rowIndex}`}
        </div>
      );
      render(getMarkup({ ...props, cellRenderer }));
      expect(findDOMNode(grid).textContent).toEqual("B0B1");

      label = "C";
      act(() => {
        grid.forceUpdate();
      });
      expect(findDOMNode(grid).textContent).toEqual("C0C1");

      // E.g. Table passes extra props to re-render its rows
      label = "D";
      render(
        getMarkup({
          ...props,
          cellRenderer,
          // @ts-expect-error Not a Grid prop
          sortBy: "foo"
        })
      );
      expect(findDOMNode(grid).textContent).toEqual("D0D1");
    });

    it("should not trigger render by _debounceScrollEndedCallback if process slow table", async () => {
      const scrollingResetTimeInterval = 50;
      let cellRangeRendererCalls = 0;
      function cellRangeRenderer(props: any) {
        const startTime = Date.now();
        while (Date.now() - startTime <= scrollingResetTimeInterval); // imitate very slow render
        cellRangeRendererCalls++;
        return defaultCellRangeRenderer(props);
      }
      const props = {
        scrollingResetTimeInterval,
        cellRangeRenderer
      };

      const grid = render(getMarkup(props));
      render(getMarkup(props));
      expect(cellRangeRendererCalls).toEqual(1);

      for (let i = 1; i <= 5; i++) {
        cellRangeRendererCalls = 0;
        simulateScroll({ grid, scrollTop: i });
        // small wait for maybe early _debounceScrollEndedCallback
        await act(async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, scrollingResetTimeInterval / 2)
          );
        });
        expect(cellRangeRendererCalls).toEqual(1);
      }

      cellRangeRendererCalls = 0;
      // wait for real _debounceScrollEndedCallback
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, scrollingResetTimeInterval * 1.5)
        );
      });
      expect(cellRangeRendererCalls).toEqual(1);
    });

    it("should support a custom :scrollingResetTimeInterval prop", async () => {
      const cellRendererCalls: any[] = [];
      const scrollingResetTimeInterval =
        DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2;
      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        cellRendererCalls.push({ columnIndex, rowIndex });
        return defaultCellRenderer({ columnIndex, key, rowIndex, style });
      }
      const props = {
        cellRenderer,
        scrollingResetTimeInterval
      };

      const grid = render(getMarkup(props));
      expect(cellRendererCalls.length > 0).toEqual(true);

      simulateScroll({ grid, scrollTop: 1 });

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL)
        );
      });

      cellRendererCalls.splice(0);
      render(
        getMarkup({
          ...props,
          className: "foo"
        })
      );
      expect(cellRendererCalls.length).toEqual(0);

      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2)
        );
      });

      cellRendererCalls.splice(0);
      render(
        getMarkup({
          ...props,
          className: "bar"
        })
      );
      expect(cellRendererCalls.length).not.toEqual(0);
    });
  });

  describe("measureAllCells", () => {
    it("should measure any unmeasured columns and rows", () => {
      const grid = render(
        getMarkup({
          columnCount: 10,
          columnWidth: () => 100,
          estimatedColumnSize: 150,
          estimatedRowSize: 15,
          height: 0,
          rowCount: 10,
          rowHeight: () => 20,
          width: 0
        })
      );
      expect(grid.getTotalColumnsWidth()).toEqual(1500);
      expect(grid.getTotalRowsHeight()).toEqual(150);
      grid.measureAllCells();
      expect(grid.getTotalColumnsWidth()).toEqual(1000);
      expect(grid.getTotalRowsHeight()).toEqual(200);
    });

    it("should not throw if there are no rows or columns", () => {
      const grid = render(
        getMarkup({
          columnCount: 0,
          rowCount: 0
        })
      );
      expect(() => grid.measureAllCells()).not.toThrow();
    });

    // #1351 (e.g. the bottom quadrants of a MultiGrid whose rows are all fixed)
    it("should not throw when the column count drops to 0 while there are no rows (and vice versa)", () => {
      const columnWidth = () => 45;
      render(getMarkup({ columnCount: 1, columnWidth, rowCount: 0 }));
      expect(() =>
        render(getMarkup({ columnCount: 0, columnWidth, rowCount: 0 }))
      ).not.toThrow();

      const rowHeight = () => 15;
      render(getMarkup({ columnCount: 0, rowCount: 1, rowHeight }));
      expect(() =>
        render(getMarkup({ columnCount: 0, rowCount: 0, rowHeight }))
      ).not.toThrow();

      // Cells are rendered (and measured) again once there are rows and columns
      const rendered = findDOMNode(
        render(
          getMarkup({ columnCount: 2, columnWidth, rowCount: 1, rowHeight })
        )
      );
      expect(rendered.textContent).toContain("row:0, column:1");
    });

    it("should measure columns if there are no rows (and vice versa)", () => {
      let grid = render(
        getMarkup({
          columnCount: 10,
          columnWidth: () => 100,
          estimatedColumnSize: 150,
          rowCount: 0
        })
      );
      grid.measureAllCells();
      expect(grid.getTotalColumnsWidth()).toEqual(1000);

      grid = render(
        getMarkup({
          columnCount: 0,
          estimatedRowSize: 15,
          rowCount: 10,
          rowHeight: () => 20
        })
      );
      grid.measureAllCells();
      expect(grid.getTotalRowsHeight()).toEqual(200);
    });
  });

  describe("recomputeGridSize", () => {
    it("should recompute cell sizes and other values when called", () => {
      const columnIndices: any[] = [];
      const rowIndices: any[] = [];
      function columnWidth({ index }: any) {
        columnIndices.push(index);
        return 10;
      }
      function rowHeight({ index }: any) {
        rowIndices.push(index);
        return 10;
      }
      const props = {
        columnCount: 50,
        columnWidth,
        height: 50,
        rowHeight,
        rowCount: 50,
        width: 100
      };
      const component = render(getMarkup(props));

      columnIndices.splice(0);
      rowIndices.splice(0);

      act(() => {
        component.recomputeGridSize();
      });

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(0);
      expect(columnIndices[columnIndices.length - 1]).toEqual(9);
      expect(rowIndices[0]).toEqual(0);
      expect(rowIndices[rowIndices.length - 1]).toEqual(4);

      columnIndices.splice(0);
      rowIndices.splice(0);

      act(() => {
        component.recomputeGridSize({
          columnIndex: 4,
          rowIndex: 2
        });
      });

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(4);
      expect(columnIndices[columnIndices.length - 1]).toEqual(9);
      expect(rowIndices[0]).toEqual(2);
      expect(rowIndices[rowIndices.length - 1]).toEqual(4);
    });
  });

  describe("autoContainerWidth", () => {
    it("should set the innerScrollContainer width to auto to better support single-column HOCs", () => {
      const props = {
        autoContainerWidth: true
      };
      const rendered = findDOMNode(render(getMarkup(props)));
      expect(
        rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.width
      ).toEqual("auto");
    });

    it("should set the innerScrollContainer width to :totalColumnsWidth unless :autoContainerWidth", () => {
      const props = {
        autoContainerWidth: false
      };
      const rendered = findDOMNode(render(getMarkup(props)));
      expect(
        rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.width
      ).toEqual("2500px"); // 50 columns x 50px
    });
  });

  describe("with a scrollElement (full height)", () => {
    it("should set the container height to auto to adjust to innerScrollContainer height", () => {
      const container = createScrollContainer({ height: DEFAULT_HEIGHT });
      const grid = render(getMarkup({ scrollElement: container.element }));
      expect(findDOMNode(grid).style.height).toEqual("auto");
    });

    it("should have the viewport height (of the scroll element) still affecting number of rows rendered", () => {
      const container = createScrollContainer({ height: 500 });
      const grid = render(getMarkup({ scrollElement: container.element }));
      expect(findDOMNode(grid).querySelectorAll(".gridItem").length).toEqual(
        100
      ); // 25 rows x 4 columns
    });

    it("should have innerScrollContainer height to be equal number of rows * rowHeight", () => {
      const container = createScrollContainer({ height: DEFAULT_HEIGHT });
      const grid = render<GridImperativeAPI>(
        getMarkup({ scrollElement: container.element })
      );
      const rendered = findDOMNode(grid);
      expect(
        rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.height
      ).toEqual("2000px"); // 100 rows * 20px rowHeight
      expect(grid.getTotalRowsHeight()).toEqual(2000);
    });
  });

  describe("tabIndex", () => {
    it("should be focusable by default", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.tabIndex).toEqual(0);
    });

    it("should allow tabIndex to be overridden", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            tabIndex: -1
          })
        )
      );
      expect(rendered.tabIndex).toEqual(-1);
    });
  });

  describe("role", () => {
    it("should have grid role by default", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.getAttribute("role")).toEqual("grid");
    });

    it("should allow role to be overridden", () => {
      const role = null as any;
      const rendered = findDOMNode(render(getMarkup({ role })));
      expect(rendered.getAttribute("role")).toEqual(role);
    });
  });

  describe("pure", () => {
    it("should not re-render unless props have changed", () => {
      let cellRendererCalled = false;
      function cellRenderer({ key, style }: any) {
        cellRendererCalled = true;
        return <div key={key} style={style} />;
      }
      const markup = getMarkup({ cellRenderer });
      render(markup);
      expect(cellRendererCalled).toEqual(true);
      cellRendererCalled = false;
      render(markup);
      expect(cellRendererCalled).toEqual(false);
    });

    it("should not re-render grid components if they extend PureComponent", () => {
      let componentUpdates = 0;

      class GridComponent extends PureComponent<{
        columnIndex: number;
        rowIndex: number;
        style: CSSProperties;
      }> {
        componentDidUpdate() {
          componentUpdates++;
        }

        render() {
          const { columnIndex, rowIndex, style } = this.props;
          return (
            <div className="gridItem" style={style}>
              {`row:${rowIndex}, column:${columnIndex}`}
            </div>
          );
        }
      }

      function cellRenderer({ columnIndex, key, rowIndex, style }: any) {
        return (
          <GridComponent
            key={key}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            style={style}
          />
        );
      }

      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      const grid = render(getMarkup(props));
      simulateScroll({ grid });

      expect(componentUpdates).toEqual(0);
    });

    it("should clear all but the visible rows from the style cache once :isScrolling is false", async () => {
      const styleCache = createStyleCacheTracker();
      const props = {
        cellRangeRenderer: styleCache.cellRangeRenderer,
        columnWidth: 50,
        height: 100,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowHeight: 50,
        width: 100
      };

      const grid = render(getMarkup(props));

      expect(styleCache.keys().length).toBe(4);

      simulateScroll({ grid, scrollTop: 50 });

      expect(styleCache.keys().length).toBe(6);

      // Allow scrolling timeout to complete so that cell cache is reset
      await act(async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2)
        );
      });

      expect(styleCache.keys().length).toBe(4);
    });

    it("should clear style cache if :recomputeGridSize is called", () => {
      const styleCache = createStyleCacheTracker();
      const props = {
        cellRangeRenderer: styleCache.cellRangeRenderer,
        columnWidth: 50,
        height: 100,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowHeight: 50,
        width: 100
      };

      const grid = render(getMarkup(props));

      expect(styleCache.keys().length).toBe(4);

      act(() => {
        grid.scrollToPosition({ scrollTop: 50 });
      });

      expect(styleCache.keys().length).toBe(6);

      act(() => {
        grid.recomputeGridSize();
      });

      expect(styleCache.keys().length).toBe(4);
    });

    it("should clear style cache if cell sizes change", () => {
      const cellRendererCalls: any[] = [];
      function cellRenderer(params: any) {
        cellRendererCalls.push(params);
        return <div key={params.key} style={params.style} />;
      }

      const props = {
        cellRenderer,
        columnWidth: 100,
        height: 100,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowHeight: 100,
        width: 100
      };

      render(getMarkup(props));

      expect(cellRendererCalls.length).toEqual(1);
      expect(cellRendererCalls[0].style.width).toEqual(100);

      render(
        getMarkup({
          ...props,
          columnWidth: 50,
          width: 50
        })
      );

      expect(cellRendererCalls.length).toEqual(2);
      expect(cellRendererCalls[1].style.width).toEqual(50);
    });

    // Bug #16
    it("should clear style cache if cell counts change", () => {
      const heights = [20, 20, 20, 20, 20];
      const rowHeight = ({ index }: { index: number }) => heights[index];

      const props = {
        columnCount: 1,
        height: 100,
        rowHeight,
        width: 100
      };

      const grid = render(getMarkup({ ...props, rowCount: heights.length }));
      const getStyles = () =>
        Array.from(findDOMNode(grid).querySelectorAll<HTMLElement>(".gridItem"))
          .slice(0, 3)
          .map((cell) => `${cell.style.top}/${cell.style.height}`);
      expect(getStyles()).toEqual(["0px/20px", "20px/20px", "40px/20px"]);

      // Prepend a 40px row (with the same, stable size getter)
      heights.unshift(40);
      render(getMarkup({ ...props, rowCount: heights.length }));
      expect(getStyles()).toEqual(["0px/40px", "40px/20px", "60px/20px"]);
    });
  });

  it("should not pull from the style cache while scrolling if there is an offset adjustment", () => {
    const cellRendererCalls: any[] = [];
    function cellRenderer(params: any) {
      cellRendererCalls.push(params);
      return <div key={params.key} style={params.style} />;
    }

    const grid = render(
      getMarkup({
        cellRenderer,
        width: 100,
        height: 100,
        rowHeight: 100,
        columnWidth: 100,
        rowCount: (getMaxElementSize() * 2) / 100 // lots of offset
      })
    );
    act(() => {
      grid.scrollToPosition({ scrollTop: 2000 });
    });
    cellRendererCalls.splice(0, cellRendererCalls.length - 1);

    simulateScroll({
      grid,
      scrollTop: 2100
    });

    // cellRendererCalls[0] is the cell rendered after scrollToPosition(), cellRendererCalls[1] the one rendered after scrolling
    const firstProps = cellRendererCalls[0];
    const secondProps = cellRendererCalls[1];

    expect(cellRendererCalls.length).toEqual(2);
    expect(firstProps.style).not.toBe(secondProps.style);
  });

  // #1394, #1178, #1457, #1847: version 9 scaled offsets beyond 1.5M px in every browser other than Chrome
  it("should not scale offsets until the content is taller than the max element size, in every browser", () => {
    expect((window as Window & { chrome?: unknown }).chrome).toBeUndefined();
    expect(getMaxElementSize()).toEqual(16777100);

    const grid = render(
      getMarkup({
        columnCount: 1,
        columnWidth: 100,
        rowCount: 100_000,
        rowHeight: 30
      })
    );
    const innerScrollContainer = findDOMNode(grid).querySelector<HTMLElement>(
      ".ReactVirtualized__Grid__innerScrollContainer"
    )!;
    // 100,000 rows * 30px = 3,000,000px (not scaled down to 1,500,000px)
    expect(innerScrollContainer.style.height).toEqual("3000000px");

    act(() => {
      grid.scrollToCell({ align: "start", rowIndex: 50_000 });
    });
    expect(findDOMNode(grid).scrollTop).toEqual(1_500_000);
    expect(findDOMNode(grid).textContent).toContain("row:50000,");
  });

  it("should only cache styles when a :deferredMeasurementCache is provided if the cell has already been measured", () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 100);
    cache.set(1, 1, 100, 100);

    const styleCache = createStyleCacheTracker();
    render(
      getMarkup({
        cellRangeRenderer: styleCache.cellRangeRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 2
      })
    );

    expect(styleCache.keys()).toEqual(["0-0", "1-1"]);
  });

  describe("DEV warnings", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should warn about cells that forget to include the :style property", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      function cellRenderer(params: any) {
        return <div key={params.key} />;
      }

      render(
        getMarkup({
          cellRenderer
        })
      );

      expect(console.warn).toHaveBeenCalledWith(
        "Rendered cell should include style property for positioning."
      );
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("should warn about CellMeasurer measured cells that forget to include the :style property", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const cache = new CellMeasurerCache({
        fixedWidth: true
      });

      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation((params: any) => (
        <CellMeasurer
          cache={cache}
          columnIndex={params.columnIndex}
          key={params.key}
          parent={params.parent}
          rowIndex={params.rowIndex}
          // @ts-expect-error CellMeasurer does not accept a style prop
          style={params.style}
        >
          <div />
        </CellMeasurer>
      ));

      render(
        getMarkup({
          cellRenderer,
          columnCount: 1,
          deferredMeasurementCache: cache,
          rowCount: 1
        })
      );

      expect(console.warn).toHaveBeenCalledWith(
        "Rendered cell should include style property for positioning."
      );
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe("deferredMeasurementCache", () => {
    it("invalidateCellSizeAfterRender should invalidate cache and refresh displayed cells after mount", () => {
      const cache = new CellMeasurerCache({
        fixedWidth: true
      });

      let invalidateCellSizeAfterRender = true;

      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation((params: any) => {
        // Don't get stuck in a loop
        if (invalidateCellSizeAfterRender) {
          invalidateCellSizeAfterRender = false;

          params.parent.invalidateCellSizeAfterRender({
            columnIndex: 1,
            rowIndex: 0
          });
        }
        return <div key={params.key} style={params.style} />;
      });

      const props = {
        cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 2
      };

      render(getMarkup(props));

      // 4 times for initial render + 4 once cellCache was cleared
      expect(cellRenderer).toHaveBeenCalledTimes(8);
    });

    it("should invalidate cache and refresh displayed cells after update", () => {
      const cache = new CellMeasurerCache({
        fixedWidth: true
      });

      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation((params: any) => (
        <div key={params.key} style={params.style} />
      ));

      const props = {
        cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 2
      };

      const grid = render(getMarkup(props));

      expect(cellRenderer).toHaveBeenCalledTimes(4);

      let invalidateCellSizeAfterRender = false;

      cellRenderer.mockReset();
      cellRenderer.mockImplementation((params: any) => {
        // Don't get stuck in a loop
        if (invalidateCellSizeAfterRender) {
          invalidateCellSizeAfterRender = false;
          params.parent.invalidateCellSizeAfterRender({
            columnIndex: 1,
            rowIndex: 0
          });
        }
        return <div key={params.key} style={params.style} />;
      });

      invalidateCellSizeAfterRender = true;
      act(() => {
        grid.recomputeGridSize();
      });

      // 4 times for initial render + 4 once cellCache was cleared
      expect(cellRenderer).toHaveBeenCalledTimes(8);
    });

    it("should not cache cells until they have been measured by CellMeasurer", () => {
      const cache = new CellMeasurerCache({
        fixedWidth: true
      });

      // Fake measure cell 0,0 but not cell 0,1
      cache.set(0, 0, 100, 30);

      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation((params: any) => (
        <div key={params.key} style={params.style} />
      ));

      const props = {
        cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 1
      };

      // Trigger 2 renders
      // The second render should re-use the style for cell 0,0
      // But should not re-use the style for cell 0,1 since it was not measured
      const grid = render(getMarkup(props));
      act(() => {
        grid.forceUpdate();
      });

      // 0,0 - 0,1 - 0,0 - 0,1
      expect(cellRenderer).toHaveBeenCalledTimes(4);
      const style00A = cellRenderer.mock.calls[0][0].style;
      const style01A = cellRenderer.mock.calls[1][0].style;
      const style00B = cellRenderer.mock.calls[2][0].style;
      const style01B = cellRenderer.mock.calls[3][0].style;
      expect(style00A).toBe(style00B);
      expect(style01A).not.toBe(style01B);
    });
  });

  describe("onScrollbarPresenceChange", () => {
    it("should not trigger on-mount if scrollbars are hidden", () => {
      const onScrollbarPresenceChange = vi.fn();

      render(
        getMarkup({
          columnCount: 1,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 1
        })
      );
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });

    it("should trigger on-mount if scrollbars are visible", () => {
      const onScrollbarPresenceChange = vi.fn();

      render(
        getMarkup({
          columnCount: 100,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 100
        })
      );
      expect(onScrollbarPresenceChange).toHaveBeenCalled();

      const args = onScrollbarPresenceChange.mock.calls[0][0];
      expect(args.horizontal).toBe(true);
      expect(args.size).toBe(getScrollbarSize20());
      expect(args.vertical).toBe(true);
    });

    it("should trigger on-update if scrollbar visibility has changed", () => {
      const onScrollbarPresenceChange = vi.fn();
      render(
        getMarkup({
          columnCount: 1,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 1
        })
      );
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();

      render(
        getMarkup({
          columnCount: 100,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 100
        })
      );
      expect(onScrollbarPresenceChange).toHaveBeenCalled();

      const args = onScrollbarPresenceChange.mock.calls[0][0];
      expect(args.horizontal).toBe(true);
      expect(args.size).toBe(getScrollbarSize20());
      expect(args.vertical).toBe(true);
    });

    it("should not trigger on-update if scrollbar visibility does not change", () => {
      const onScrollbarPresenceChange = vi.fn();
      render(
        getMarkup({
          columnCount: 1,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 1
        })
      );
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
      render(
        getMarkup({
          columnCount: 2,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 2
        })
      );
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });
  });

  describe("StrictMode", () => {
    function renderStrict(props: Partial<GridProps>) {
      const ref = createRef<GridImperativeAPI>();
      render(
        <StrictMode>
          <div>{getMarkup({ ...props, ref } as Partial<GridProps>)}</div>
        </StrictMode>
      );
      return ref;
    }

    function getGridNode() {
      return document.body.querySelector<HTMLDivElement>(
        ".ReactVirtualized__Grid"
      )!;
    }

    it("should update cell styles when cell sizes change", () => {
      const ref = renderStrict({ rowHeight: 20 });
      act(() => {
        ref.current!.scrollToCell({ columnIndex: 0, rowIndex: 50 });
      });
      expect(getGridNode().scrollTop).toEqual(920);

      renderStrict({ rowHeight: 40 });

      // The scroll offset is unchanged (scrollToCell is a one-time scroll); row 23 is now at the top
      expect(getGridNode().scrollTop).toEqual(920);
      const cells = Array.from(
        getGridNode().querySelectorAll<HTMLElement>(".gridItem")
      );
      const cell = cells.find((cell) =>
        cell.textContent!.startsWith("row:23,")
      )!;
      expect(cell).toBeDefined();
      expect(cell.style.height).toEqual("40px");
      expect(cell.style.top).toEqual("920px");
      cells.forEach((cell) => expect(cell.style.height).toEqual("40px"));

      renderStrict({ columnWidth: 100, rowHeight: 40 });
      Array.from(
        getGridNode().querySelectorAll<HTMLElement>(".gridItem")
      ).forEach((cell) => expect(cell.style.width).toEqual("100px"));
    });

    it("should call onSectionRendered and onScroll once per change", () => {
      const onScroll = vi.fn();
      const onSectionRendered = vi.fn();
      const ref = renderStrict({ onScroll, onSectionRendered });
      expect(onScroll).toHaveBeenCalledTimes(1);
      expect(onSectionRendered).toHaveBeenCalledTimes(1);

      act(() => {
        ref.current!.scrollToPosition({ scrollTop: 100 });
      });
      expect(onScroll).toHaveBeenCalledTimes(2);
      expect(onScroll.mock.calls[1][0].scrollTop).toEqual(100);
      expect(onSectionRendered).toHaveBeenCalledTimes(2);
      expect(onSectionRendered.mock.calls[1][0].rowStartIndex).toEqual(5);
    });

    it("should handle scroll events", () => {
      const ref = renderStrict({});
      fireEvent.scroll(getGridNode(), {
        target: { scrollLeft: 100, scrollTop: 200 }
      });
      expect(getGridNode().textContent).toContain("row:10, column:2");
      expect(
        ref.current!.getOffsetForCell({ columnIndex: 2, rowIndex: 10 })
      ).toEqual({ scrollLeft: 100, scrollTop: 200 });
    });
  });

  describe("imperative handle", () => {
    it("should be stable across renders", () => {
      const grid = render(getMarkup());
      const updated = render(getMarkup({ width: 300 }));
      expect(updated).toBe(grid);
    });

    it("should be passed to cell renderers as their parent (e.g. for CellMeasurer)", () => {
      const cellRenderer = vi.fn((params: CellRendererParams) =>
        defaultCellRenderer(params)
      );
      const grid = render(getMarkup({ cellRenderer }));
      expect(cellRenderer.mock.calls[0][0].parent).toBe(grid);
    });

    it("should support forceUpdate()", () => {
      const cellRenderer = vi.fn(defaultCellRenderer);
      const grid = render(getMarkup({ cellRenderer }));
      cellRenderer.mockClear();
      act(() => {
        grid.forceUpdate();
      });
      expect(cellRenderer).toHaveBeenCalledTimes(20);
    });

    it("should support an :elementRef", () => {
      const elementRef = createRef<HTMLDivElement>();
      const grid = render(getMarkup({ elementRef }));
      expect(elementRef.current).toBe(findDOMNode(grid));
    });

    it("should see the latest props when called by a cell during the commit phase", () => {
      // E.g. a cell (like CellMeasurer) that calls a parent method when it mounts or updates,
      // before the Grid's own layout effects have run
      function ScrollingCell({
        columnIndex,
        parent,
        rowIndex,
        scrollToRow,
        style
      }: CellRendererParams & { scrollToRow?: number }) {
        useLayoutEffect(() => {
          if (scrollToRow !== undefined) {
            (parent as GridImperativeAPI).scrollToCell({
              rowIndex: scrollToRow
            });
          }
        }, [parent, scrollToRow]);

        return (
          <div className="gridItem" style={style}>
            {`row:${rowIndex}, column:${columnIndex}`}
          </div>
        );
      }

      const grid = render(
        getMarkup({
          cellRenderer: ({ key, ...params }) => (
            <ScrollingCell key={key} {...params} />
          ),
          rowCount: 10
        })
      );
      render(
        getMarkup({
          cellRenderer: ({ key, ...params }) => (
            <ScrollingCell
              key={key}
              {...params}
              scrollToRow={
                params.columnIndex === 0 && params.rowIndex === 0
                  ? 50
                  : undefined
              }
            />
          ),
          rowCount: 100
        })
      );
      // (With stale props, the Grid would only have scrolled to its 10th row)
      expect(getScrollPosition(grid).scrollTop).toEqual(920);
      expect(findDOMNode(grid).textContent).toContain("row:50, column:0");
    });
  });

  describe("server rendering", () => {
    it("should hydrate server-rendered markup and then measure the scrollbar size", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      const onScrollbarPresenceChange = vi.fn();
      const markup = getMarkup({
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange
      });

      const container = document.createElement("div");
      container.innerHTML = renderToString(markup);
      document.body.appendChild(container);

      let root: ReturnType<typeof hydrateRoot> | null = null;
      act(() => {
        root = hydrateRoot(container, markup);
      });

      expect(console.error).not.toHaveBeenCalled();
      expect(onScrollbarPresenceChange).toHaveBeenCalledTimes(1);
      expect(onScrollbarPresenceChange.mock.calls[0][0]).toEqual({
        horizontal: true,
        size: 20,
        vertical: true
      });

      act(() => root!.unmount());
      document.body.removeChild(container);
      vi.restoreAllMocks();
    });

    function getInnerScrollContainer(element: ParentNode) {
      return element.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid__innerScrollContainer"
      )!;
    }

    function hydrate(
      markup: ReturnType<typeof getMarkup>,
      // Simulates the user scrolling the server-rendered markup before the page is hydrated
      preHydrationScroll?: { scrollLeft: number; scrollTop: number }
    ) {
      const container = document.createElement("div");
      container.innerHTML = renderToString(markup);
      document.body.appendChild(container);

      const element = container.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid"
      )!;
      if (preHydrationScroll) {
        element.scrollLeft = preHydrationScroll.scrollLeft;
        element.scrollTop = preHydrationScroll.scrollTop;
      }

      let root: ReturnType<typeof hydrateRoot> | null = null;
      act(() => {
        root = hydrateRoot(container, markup);
      });

      return {
        element,
        unmount() {
          act(() => root!.unmount());
          document.body.removeChild(container);
        }
      };
    }

    it("should render the cells at the initial scroll offsets, shifted into view", () => {
      const html = renderToString(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600 })
      );
      // Row 30 and column 10 are at the top/left of the viewport
      expect(html).toContain("row:30, column:10");
      expect(html).not.toContain("row:0, column:0");
      // The browser can't scroll before hydration, so the inner container is shifted instead
      expect(html).toContain("margin-left:-500px");
      expect(html).toContain("margin-top:-600px");
    });

    it("should apply the initial scroll offsets after hydration, without moving the rendered cells", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      const { element, unmount } = hydrate(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600 })
      );

      expect(console.error).not.toHaveBeenCalled();
      expect(element.scrollLeft).toEqual(500);
      expect(element.scrollTop).toEqual(600);
      const inner = getInnerScrollContainer(element);
      expect(inner.style.marginLeft).toEqual("");
      expect(inner.style.marginTop).toEqual("");
      expect(element.textContent).toContain("row:30, column:10");
      expect(element.textContent).not.toContain("row:0, column:0");

      unmount();
      vi.restoreAllMocks();
    });

    it("should keep the content in place if the user scrolled before hydration", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      const { element, unmount } = hydrate(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600 }),
        { scrollLeft: 50, scrollTop: 40 }
      );

      expect(console.error).not.toHaveBeenCalled();
      expect(element.scrollLeft).toEqual(550);
      expect(element.scrollTop).toEqual(640);
      expect(getInnerScrollContainer(element).style.marginTop).toEqual("");
      expect(element.textContent).toContain("row:32, column:11");

      unmount();
      vi.restoreAllMocks();
    });

    it("should not shift the inner container without initial scroll offsets", () => {
      const html = renderToString(getMarkup());
      expect(html).not.toContain("margin-top");
      expect(html).not.toContain("margin-left");
    });
  });

  describe("initial scroll offsets", () => {
    it("should render and scroll to the initial scroll offsets on mount", () => {
      const grid = render<GridImperativeAPI>(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600 })
      );
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 500,
        scrollTop: 600
      });
      const element = findDOMNode(grid);
      expect(element.textContent).toContain("row:30, column:10");
      // Client rendering doesn't shift the inner container
      const inner = element.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid__innerScrollContainer"
      )!;
      expect(inner.style.marginTop).toEqual("");
    });

    it("should clamp the initial scroll offsets to the scrollable range", () => {
      const grid = render<GridImperativeAPI>(
        getMarkup({ initialScrollLeft: 99999, initialScrollTop: 99999 })
      );
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: NUM_COLUMNS * DEFAULT_COLUMN_WIDTH - DEFAULT_WIDTH,
        scrollTop: NUM_ROWS * DEFAULT_ROW_HEIGHT - DEFAULT_HEIGHT
      });
    });

    it("should ignore changes to the initial scroll offsets after mounting", () => {
      const grid = render<GridImperativeAPI>(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600 })
      );
      render(getMarkup({ initialScrollLeft: 0, initialScrollTop: 100 }));
      expect(getScrollPosition(grid)).toEqual({
        scrollLeft: 500,
        scrollTop: 600
      });
    });

    it("should report the initial scroll offsets through onScroll", () => {
      const onScroll = vi.fn();
      render(
        getMarkup({ initialScrollLeft: 500, initialScrollTop: 600, onScroll })
      );
      expect(onScroll).toHaveBeenCalledTimes(1);
      expect(onScroll.mock.calls[0][0]).toMatchObject({
        scrollLeft: 500,
        scrollTop: 600
      });
    });

    it("should work in StrictMode", () => {
      const ref = createRef<GridImperativeAPI>();
      render(
        <StrictMode>
          <div>
            {getMarkup({
              initialScrollLeft: 500,
              initialScrollTop: 600,
              ref
            } as Partial<GridProps>)}
          </div>
        </StrictMode>
      );
      const element = document.body.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid"
      )!;
      expect(element.scrollLeft).toEqual(500);
      expect(element.scrollTop).toEqual(600);
      expect(element.textContent).toContain("row:30, column:10");
    });
  });
});
