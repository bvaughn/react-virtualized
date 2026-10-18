/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent } from "@testing-library/react";
import { act, createRef, StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  findDOMNode as findDOMNodeUntyped,
  render
} from "../../utils/test/render";
import { CellMeasurer } from "../CellMeasurer/CellMeasurer";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import type { CellRendererParams } from "../Grid/types";
import { MultiGrid } from "./MultiGrid";
import type { MultiGridImperativeAPI, MultiGridProps } from "./types";

function findDOMNode(
  instance: Parameters<typeof findDOMNodeUntyped>[0]
): HTMLDivElement {
  return findDOMNodeUntyped(instance) as HTMLDivElement;
}

// These tests only focus on what MultiGrid does specifically.
// The inner Grid component is tested in depth elsewhere.
describe("MultiGrid", () => {
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

  function getMarkup(props: Partial<MultiGridProps> & { ref?: any } = {}) {
    return (
      <MultiGrid
        cellRenderer={defaultCellRenderer}
        columnCount={50}
        columnWidth={50}
        fixedColumnCount={2}
        fixedRowCount={1}
        height={300}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowHeight={20}
        rowCount={100}
        width={400}
        {...props}
      />
    );
  }

  describe("fixed columns and rows", () => {
    // #1351
    it("should not throw when columnCount drops to fixedColumnCount (with variable column widths)", () => {
      const props = {
        columnWidth: ({ index }: { index: number }) => [45, 120][index],
        fixedColumnCount: 1,
        fixedRowCount: 1,
        rowCount: 1
      };
      render(getMarkup({ ...props, columnCount: 2 }));
      let rendered: HTMLElement | null = null;
      expect(() => {
        rendered = findDOMNode(render(getMarkup({ ...props, columnCount: 1 })));
      }).not.toThrow();
      expect(rendered!.textContent).toContain("row:0, column:0");
      expect(rendered!.textContent).not.toContain("column:1");

      // And back
      rendered = findDOMNode(render(getMarkup({ ...props, columnCount: 2 })));
      expect(rendered.textContent).toContain("row:0, column:1");
    });

    it("should render 4 Grids when configured for fixed columns and rows", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 1,
            fixedRowCount: 1
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(4);
      const [topLeft, topRight, bottomLeft, bottomRight] = grids;
      expect(topLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(topLeft.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });

    it("should render 2 Grids when configured for fixed columns only", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 1,
            fixedRowCount: 0
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(2);
      const [bottomLeft, bottomRight] = grids;
      expect(bottomLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });

    it("should render 2 Grids when configured for fixed rows only", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 0,
            fixedRowCount: 1
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(2);
      const [topRight, bottomRight] = grids;
      expect(topRight.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });

    it("should render 1 Grid when configured for neither fixed columns and rows", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 0,
            fixedRowCount: 0
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(1);
      const [bottomRight] = grids;
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });

    it("should adjust the number of Grids when fixed column or row counts change", () => {
      let rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 2,
            fixedRowCount: 1
          })
        )
      );
      expect(
        rendered.querySelectorAll<HTMLElement>(".ReactVirtualized__Grid").length
      ).toEqual(4);
      rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 0,
            fixedRowCount: 0
          })
        )
      );
      expect(
        rendered.querySelectorAll<HTMLElement>(".ReactVirtualized__Grid").length
      ).toEqual(1);
      rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 0,
            fixedRowCount: 2
          })
        )
      );
      expect(
        rendered.querySelectorAll<HTMLElement>(".ReactVirtualized__Grid").length
      ).toEqual(2);
    });

    it("should allow scrolling of fixed Grids when configured for fixed columns and rows with scroll interaction", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            enableFixedColumnScroll: true,
            enableFixedRowScroll: true,
            fixedColumnCount: 1,
            fixedRowCount: 1
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(4);
      const [topLeft, topRight, bottomLeft, bottomRight] = grids;
      expect(topLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(topLeft.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(topRight.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-y")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });

    // Bug #8
    it("should update the fixed Grids' overflow when enableFixedColumnScroll or enableFixedRowScroll change", () => {
      const props = { fixedColumnCount: 1, fixedRowCount: 1 };
      const getOverflow = () => {
        const [, topRight, bottomLeft] =
          document.body.querySelectorAll<HTMLElement>(
            ".ReactVirtualized__Grid"
          );
        return {
          bottomLeftY: bottomLeft.style.overflowY,
          topRightX: topRight.style.overflowX
        };
      };

      render(getMarkup(props));
      expect(getOverflow()).toEqual({
        bottomLeftY: "hidden",
        topRightX: "hidden"
      });

      render(getMarkup({ ...props, enableFixedColumnScroll: true }));
      expect(getOverflow()).toEqual({
        bottomLeftY: "auto",
        topRightX: "hidden"
      });

      render(
        getMarkup({
          ...props,
          enableFixedColumnScroll: true,
          enableFixedRowScroll: true
        })
      );
      expect(getOverflow()).toEqual({
        bottomLeftY: "auto",
        topRightX: "auto"
      });

      render(getMarkup(props));
      expect(getOverflow()).toEqual({
        bottomLeftY: "hidden",
        topRightX: "hidden"
      });
    });
  });

  // Bug #29
  describe("scrollbar spacers", () => {
    function getScrollbarSize20() {
      return 20;
    }

    // Sizes of the inner Grids' content (once all cells have been measured)
    function getInnerSizes(multiGrid: MultiGridImperativeAPI) {
      act(() => {
        multiGrid.measureAllCells();
        multiGrid.forceUpdateGrids();
      });
      const [, topRight, bottomLeft, bottomRight] =
        document.body.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        );
      return {
        bottomLeftHeight: parseInt(bottomLeft.style.height, 10),
        bottomRightHeight: parseInt(bottomRight.style.height, 10),
        bottomRightWidth: parseInt(bottomRight.style.width, 10),
        topRightWidth: parseInt(topRight.style.width, 10)
      };
    }

    it("should give the bottom-left Grid an extra row for the main Grid's horizontal scrollbar", () => {
      const onScrollbarPresenceChange = vi.fn();
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          columnCount: 50,
          fixedColumnCount: 2,
          fixedRowCount: 1,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          // 9 scrollable rows (180px) fit into the bottom Grids (280px), even with a horizontal scrollbar
          rowCount: 10
        })
      );
      expect(onScrollbarPresenceChange).toHaveBeenLastCalledWith({
        horizontal: true,
        size: 20,
        vertical: false
      });

      // The fixed Grids can be scrolled exactly as far as the main Grid
      const sizes = getInnerSizes(multiGrid);
      expect(sizes.bottomRightHeight).toEqual(180);
      expect(sizes.bottomLeftHeight).toEqual(sizes.bottomRightHeight + 20);
      expect(sizes.topRightWidth).toEqual(sizes.bottomRightWidth);
    });

    it("should give the top-right Grid an extra column for the main Grid's vertical scrollbar", () => {
      const onScrollbarPresenceChange = vi.fn();
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          // 3 scrollable columns (150px) fit into the right Grids (300px), even with a vertical scrollbar
          columnCount: 5,
          fixedColumnCount: 2,
          fixedRowCount: 1,
          getScrollbarSize: getScrollbarSize20,
          onScrollbarPresenceChange,
          rowCount: 100
        })
      );
      expect(onScrollbarPresenceChange).toHaveBeenLastCalledWith({
        horizontal: false,
        size: 20,
        vertical: true
      });

      const sizes = getInnerSizes(multiGrid);
      expect(sizes.bottomRightWidth).toEqual(150);
      expect(sizes.topRightWidth).toEqual(sizes.bottomRightWidth + 20);
      expect(sizes.bottomLeftHeight).toEqual(sizes.bottomRightHeight);
    });

    it("should add both extras if the main Grid has both scrollbars", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          fixedColumnCount: 2,
          fixedRowCount: 1,
          getScrollbarSize: getScrollbarSize20
        })
      );
      const sizes = getInnerSizes(multiGrid);
      expect(sizes.bottomLeftHeight).toEqual(sizes.bottomRightHeight + 20);
      expect(sizes.topRightWidth).toEqual(sizes.bottomRightWidth + 20);
    });
  });

  describe("hideTopRightGridScrollbar, hideBottomLeftGridScrollbar should hide the scrollbars", () => {
    function getScrollbarSize20() {
      return 20;
    }
    it("should add scroll wrappers to hide scroll bar when configured for fixed columns and rows with scroll interaction", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            enableFixedColumnScroll: true,
            enableFixedRowScroll: true,
            fixedColumnCount: 1,
            fixedRowCount: 1,
            hideTopRightGridScrollbar: true,
            hideBottomLeftGridScrollbar: true,
            getScrollbarSize: getScrollbarSize20
          })
        )
      );
      let wrappers = rendered.querySelectorAll<HTMLElement>(
        ".TopRightGrid_ScrollWrapper"
      );
      expect(wrappers.length).toEqual(1);
      const [topRightWrapper] = wrappers;
      wrappers = rendered.querySelectorAll<HTMLElement>(
        ".BottomLeftGrid_ScrollWrapper"
      );
      expect(wrappers.length).toEqual(1);
      const [bottomLeftWrapper] = wrappers;

      expect(topRightWrapper.style.getPropertyValue("overflow-x")).toEqual(
        "hidden"
      );
      expect(topRightWrapper.style.getPropertyValue("overflow-y")).toEqual(
        "hidden"
      );
      expect(bottomLeftWrapper.style.getPropertyValue("overflow-x")).toEqual(
        "hidden"
      );
      expect(bottomLeftWrapper.style.getPropertyValue("overflow-y")).toEqual(
        "hidden"
      );

      expect(topRightWrapper.style.getPropertyValue("height")).toEqual("20px");
      expect(bottomLeftWrapper.style.getPropertyValue("height")).toEqual(
        "280px"
      );
      expect(topRightWrapper.style.getPropertyValue("width")).toEqual("350px");
      expect(bottomLeftWrapper.style.getPropertyValue("width")).toEqual("50px");

      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(4);
      const [topLeft, topRight, bottomLeft, bottomRight] = grids;
      expect(topLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(topLeft.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(topRight.style.getPropertyValue("overflow-y")).toEqual("hidden");
      expect(topRight.style.getPropertyValue("height")).toEqual("40px");
      expect(bottomLeft.style.getPropertyValue("overflow-x")).toEqual("hidden");
      expect(bottomLeft.style.getPropertyValue("overflow-y")).toEqual("auto");
      expect(bottomLeft.style.getPropertyValue("width")).toEqual("70px");
      expect(bottomRight.style.getPropertyValue("overflow-x")).toEqual("auto");
      expect(bottomRight.style.getPropertyValue("overflow-y")).toEqual("auto");
    });
  });

  describe("#recomputeGridSize", () => {
    // Bug #7
    it("should recompute (and re-render) the MultiGrid's own layout", () => {
      let fixedRowHeight = 75;
      let fixedColumnWidth = 100;

      function variableRowHeight({ index }: { index: number }) {
        if (index === 0) {
          return fixedRowHeight;
        }
        return 20;
      }
      function variableColumnWidth({ index }: { index: number }) {
        if (index === 0) {
          return fixedColumnWidth;
        }
        return 50;
      }

      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          fixedColumnCount: 1,
          fixedRowCount: 1,
          rowHeight: variableRowHeight,
          columnWidth: variableColumnWidth
        })
      );
      const rendered = findDOMNode(multiGrid);

      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids.length).toEqual(4);
      const [topLeft, topRight, bottomLeft, bottomRight] = grids;
      expect(topLeft.style.getPropertyValue("height")).toEqual("75px");
      expect(topRight.style.getPropertyValue("height")).toEqual("75px");
      expect(bottomLeft.style.getPropertyValue("height")).toEqual("225px");
      expect(bottomRight.style.getPropertyValue("height")).toEqual("225px");

      expect(topLeft.style.getPropertyValue("width")).toEqual("100px");
      expect(topRight.style.getPropertyValue("width")).toEqual("300px");
      expect(bottomLeft.style.getPropertyValue("width")).toEqual("100px");
      expect(bottomRight.style.getPropertyValue("width")).toEqual("300px");

      fixedRowHeight = 125;
      fixedColumnWidth = 75;
      act(() => {
        multiGrid.recomputeGridSize();
      });

      // No forceUpdate() is needed
      const topContainer = rendered.firstElementChild as HTMLElement;
      expect(topContainer.style.height).toEqual("125px");

      const gridsAfter = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(gridsAfter.length).toEqual(4);
      const [topLeftAfter, topRightAfter, bottomLeftAfter, bottomRightAfter] =
        gridsAfter;
      expect(topLeftAfter.style.getPropertyValue("height")).toEqual("125px");
      expect(topRightAfter.style.getPropertyValue("height")).toEqual("125px");
      expect(bottomLeftAfter.style.getPropertyValue("height")).toEqual("175px");
      expect(bottomRightAfter.style.getPropertyValue("height")).toEqual(
        "175px"
      );

      expect(topLeftAfter.style.getPropertyValue("width")).toEqual("75px");
      expect(topRightAfter.style.getPropertyValue("width")).toEqual("325px");
      expect(bottomLeftAfter.style.getPropertyValue("width")).toEqual("75px");
      expect(bottomRightAfter.style.getPropertyValue("width")).toEqual("325px");
      expect(topRightAfter.style.left).toEqual("75px");
      expect(bottomRightAfter.style.left).toEqual("75px");

      // The cells are repositioned as well
      const cell = Array.from(
        bottomRightAfter.querySelectorAll<HTMLElement>(".gridItem")
      ).find((cell) => cell.textContent === "row:1, column:1")!;
      expect(cell.style.top).toEqual("0px");
      expect(cell.style.left).toEqual("0px");
      const fixedCell = topLeftAfter.querySelector<HTMLElement>(".gridItem")!;
      expect(fixedCell.style.height).toEqual("125px");
      expect(fixedCell.style.width).toEqual("75px");
    });

    it("should update the cell sizes when a numeric columnWidth or rowHeight changes", () => {
      render(getMarkup({ fixedColumnCount: 1, fixedRowCount: 1 }));
      render(
        getMarkup({
          columnWidth: 100,
          fixedColumnCount: 1,
          fixedRowCount: 1,
          rowHeight: 40
        })
      );
      const cells = Array.from(
        document.body.querySelectorAll<HTMLElement>(".gridItem")
      );
      for (const text of [
        "row:0, column:0",
        "row:0, column:2",
        "row:2, column:0",
        "row:2, column:2"
      ]) {
        const cell = cells.find((cell) => cell.textContent === text)!;
        expect(cell).toBeDefined();
        expect(cell.style.width).toEqual("100px");
        expect(cell.style.height).toEqual("40px");
      }
      const cell = cells.find(
        (cell) => cell.textContent === "row:2, column:2"
      )!;
      expect(cell.style.left).toEqual("100px");
      expect(cell.style.top).toEqual("40px");
    });
  });

  describe("scrollToCell", () => {
    it("should adjust :scrollLeft for the main Grid when a column is scrolled to", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          columnWidth: 50,
          fixedColumnCount: 2
        })
      );
      act(() => {
        multiGrid.scrollToCell({ align: "start", columnIndex: 19 });
      });
      const grids = findDOMNode(multiGrid).querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      // 20th column, less 2 for the fixed-column Grid, 50px column width
      expect(grids[3].scrollLeft).toEqual(850);
      // The top-right Grid is kept in sync
      expect(grids[1].scrollLeft).toEqual(850);
    });

    it("should adjust :scrollTop for the main Grid when a row is scrolled to", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          fixedRowCount: 1,
          rowHeight: 50
        })
      );
      act(() => {
        multiGrid.scrollToCell({ align: "start", rowIndex: 19 });
      });
      const grids = findDOMNode(multiGrid).querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      // 20th row, less 1 for the fixed-row Grid, 50px row width
      expect(grids[3].scrollTop).toEqual(900);
      // The bottom-left Grid is kept in sync
      expect(grids[2].scrollTop).toEqual(900);
    });

    it("should not scroll an axis to a fixed column or row", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          fixedRowCount: 1,
          rowHeight: 50
        })
      );
      act(() => {
        multiGrid.scrollToCell({
          align: "start",
          columnIndex: 1,
          rowIndex: 19
        });
      });
      const grids = findDOMNode(multiGrid).querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      expect(grids[3].scrollLeft).toEqual(0);
      expect(grids[3].scrollTop).toEqual(900);
    });
  });

  describe("#measureAllCells", () => {
    it("should not throw if there are no rows or columns", () => {
      const multiGrid = render(getMarkup({ columnCount: 0, rowCount: 0 }));
      expect(() => {
        act(() => {
          multiGrid.measureAllCells();
        });
      }).not.toThrow();
    });

    it("should not throw if all rows and columns are fixed", () => {
      const multiGrid = render(
        getMarkup({
          columnCount: 2,
          fixedColumnCount: 2,
          fixedRowCount: 1,
          rowCount: 1
        })
      );
      expect(() => {
        act(() => {
          multiGrid.measureAllCells();
        });
      }).not.toThrow();
    });
  });

  describe("#forceUpdateGrids", () => {
    it("should call forceUpdate() on inner Grids", () => {
      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation(({ key }: CellRendererParams) => (
        <div key={key} style={{}} />
      ));

      const rendered = render(
        getMarkup({
          cellRenderer,
          columnCount: 2,
          fixedColumnCount: 1,
          fixedRowCount: 1,
          rowCount: 2
        })
      );

      expect(cellRenderer.mock.calls).toHaveLength(4);

      cellRenderer.mockReset();
      act(() => {
        rendered.forceUpdateGrids();
      });

      expect(cellRenderer.mock.calls).toHaveLength(4);
    });
  });

  describe("#invalidateCellSizeAfterRender", () => {
    it("should call invalidateCellSizeAfterRender() on inner Grids", () => {
      const cellRenderer = vi.fn();
      cellRenderer.mockImplementation(({ key }: CellRendererParams) => (
        <div key={key} style={{}} />
      ));

      const rendered = render(
        getMarkup({
          cellRenderer,
          columnCount: 2,
          fixedColumnCount: 1,
          fixedRowCount: 1,
          rowCount: 2
        })
      );

      cellRenderer.mockReset();
      act(() => {
        // (The invalidated cells are recomputed after the next commit, which is scheduled automatically)
        rendered.invalidateCellSizeAfterRender({
          columnIndex: 0,
          rowIndex: 0
        });
      });

      expect(cellRenderer.mock.calls).toHaveLength(4);
    });

    // Bug #21
    it("should specify itself as the :parent for the cells of all quadrants", () => {
      const parents = new Map<string, unknown>();
      function cellRenderer({
        columnIndex,
        key,
        parent,
        rowIndex
      }: CellRendererParams) {
        parents.set(`${rowIndex}-${columnIndex}`, parent);
        return <div key={key} style={{}} />;
      }

      const rendered = render(
        getMarkup({
          cellRenderer,
          columnCount: 2,
          fixedColumnCount: 1,
          fixedRowCount: 1,
          rowCount: 2
        })
      );

      expect(Array.from(parents.keys()).sort()).toEqual([
        "0-0",
        "0-1",
        "1-0",
        "1-1"
      ]);
      for (const parent of parents.values()) {
        expect(parent).toBe(rendered);
      }
    });
  });

  describe("styles", () => {
    it("should support custom style for the outer MultiGrid wrapper element", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            style: { backgroundColor: "black" }
          })
        )
      );
      expect(rendered.style.backgroundColor).toEqual("black");
    });

    it("should support custom styles for each Grid", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            fixedColumnCount: 2,
            fixedRowCount: 1,
            styleBottomLeftGrid: { backgroundColor: "green" },
            styleBottomRightGrid: { backgroundColor: "red" },
            styleTopLeftGrid: { backgroundColor: "blue" },
            styleTopRightGrid: { backgroundColor: "purple" }
          })
        )
      );
      const grids = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      );
      const topLeftGrid = grids[0];
      const topRightGrid = grids[1];
      const bottomLeftGrid = grids[2];
      const bottomRightGrid = grids[3];
      expect(topLeftGrid.style.backgroundColor).toEqual("blue");
      expect(topRightGrid.style.backgroundColor).toEqual("purple");
      expect(bottomLeftGrid.style.backgroundColor).toEqual("green");
      expect(bottomRightGrid.style.backgroundColor).toEqual("red");
    });
  });
  describe("scroll syncing", () => {
    function getGrids(multiGrid: MultiGridImperativeAPI) {
      const [topLeftGrid, topRightGrid, bottomLeftGrid, bottomRightGrid] =
        findDOMNode(multiGrid).querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Grid"
        );
      return { topLeftGrid, topRightGrid, bottomLeftGrid, bottomRightGrid };
    }

    it("should apply the initial scroll offsets to the quadrants that scroll along each axis", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          columnWidth: 50,
          fixedColumnCount: 2,
          fixedRowCount: 1,
          initialScrollLeft: 300,
          initialScrollTop: 400,
          rowHeight: 20
        })
      );
      const { topLeftGrid, topRightGrid, bottomLeftGrid, bottomRightGrid } =
        getGrids(multiGrid);
      expect(bottomRightGrid.scrollLeft).toEqual(300);
      expect(bottomRightGrid.scrollTop).toEqual(400);
      expect(topRightGrid.scrollLeft).toEqual(300);
      expect(topRightGrid.scrollTop).toEqual(0);
      expect(bottomLeftGrid.scrollLeft).toEqual(0);
      expect(bottomLeftGrid.scrollTop).toEqual(400);
      expect(topLeftGrid.scrollLeft).toEqual(0);
      expect(topLeftGrid.scrollTop).toEqual(0);
    });

    it("should adjust :scrollLeft for top-right and main grids when scrollToPosition is used", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          columnWidth: 50,
          fixedColumnCount: 2
        })
      );
      act(() => {
        multiGrid.scrollToPosition({ scrollLeft: 850 });
      });
      const { topRightGrid, bottomRightGrid } = getGrids(multiGrid);
      expect(topRightGrid.scrollLeft).toEqual(850);
      expect(bottomRightGrid.scrollLeft).toEqual(850);
    });

    it("should adjust :scrollTop for bottom-left and main grids when scrollToPosition is used", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          columnWidth: 50,
          fixedColumnCount: 2
        })
      );
      act(() => {
        multiGrid.scrollToPosition({ scrollTop: 500 });
      });
      const { bottomLeftGrid, bottomRightGrid } = getGrids(multiGrid);
      expect(bottomLeftGrid.scrollTop).toEqual(500);
      expect(bottomRightGrid.scrollTop).toEqual(500);
    });

    it("should adjust :scrollTop and :scrollLeft when scrollToPosition is called again", () => {
      const multiGrid = render<MultiGridImperativeAPI>(getMarkup());
      act(() => {
        multiGrid.scrollToPosition({ scrollLeft: 100, scrollTop: 100 });
      });
      act(() => {
        multiGrid.scrollToPosition({ scrollLeft: 900, scrollTop: 750 });
      });
      const { topRightGrid, bottomLeftGrid, bottomRightGrid } =
        getGrids(multiGrid);
      expect(topRightGrid.scrollLeft).toEqual(900);
      expect(bottomRightGrid.scrollLeft).toEqual(900);
      expect(bottomLeftGrid.scrollTop).toEqual(750);
      expect(bottomRightGrid.scrollTop).toEqual(750);
    });

    it("should sync the fixed Grids in the same update when the main Grid is scrolled", () => {
      const onScroll = vi.fn();
      const multiGrid = render<MultiGridImperativeAPI>(getMarkup({ onScroll }));
      const { topRightGrid, bottomLeftGrid, bottomRightGrid } =
        getGrids(multiGrid);

      // A single (synchronous) update renders all quadrants at the new offsets
      fireEvent.scroll(bottomRightGrid, {
        target: { scrollLeft: 300, scrollTop: 400 }
      });
      expect(topRightGrid.scrollLeft).toEqual(300);
      expect(bottomLeftGrid.scrollTop).toEqual(400);
      expect(bottomRightGrid.textContent).toContain("row:21, column:8");
      expect(topRightGrid.textContent).toContain("row:0, column:8");
      expect(bottomLeftGrid.textContent).toContain("row:21, column:0");
      expect(onScroll).toHaveBeenLastCalledWith(
        expect.objectContaining({ scrollLeft: 300, scrollTop: 400 })
      );
    });

    it("should sync the main Grid when a fixed Grid is scrolled (with scroll interaction)", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({
          enableFixedColumnScroll: true,
          enableFixedRowScroll: true
        })
      );
      const { topRightGrid, bottomLeftGrid, bottomRightGrid } =
        getGrids(multiGrid);

      fireEvent.scroll(topRightGrid, {
        target: { scrollLeft: 300, scrollTop: 0 }
      });
      expect(bottomRightGrid.scrollLeft).toEqual(300);
      expect(bottomRightGrid.scrollTop).toEqual(0);

      fireEvent.scroll(bottomLeftGrid, {
        target: { scrollLeft: 0, scrollTop: 400 }
      });
      expect(bottomRightGrid.scrollLeft).toEqual(300);
      expect(bottomRightGrid.scrollTop).toEqual(400);
      expect(topRightGrid.scrollLeft).toEqual(300);
    });

    it("should keep the quadrants in sync (without scrolling) when the size changes after scrollToCell", () => {
      const multiGrid = render<MultiGridImperativeAPI>(getMarkup());
      act(() => {
        multiGrid.scrollToCell({ columnIndex: 30, rowIndex: 50 });
      });
      const before = getGrids(multiGrid).bottomRightGrid;
      const { scrollLeft, scrollTop } = before;
      render(getMarkup({ height: 200, width: 300 }));
      const { topRightGrid, bottomLeftGrid, bottomRightGrid } =
        getGrids(multiGrid);
      // scrollToCell is a one-time scroll; the offsets aren't adjusted afterwards
      expect(bottomRightGrid.scrollTop).toEqual(scrollTop);
      expect(bottomRightGrid.scrollLeft).toEqual(scrollLeft);
      expect(bottomLeftGrid.scrollTop).toEqual(bottomRightGrid.scrollTop);
      expect(topRightGrid.scrollLeft).toEqual(bottomRightGrid.scrollLeft);
    });

    it("should sync a fixed Grid that is added after scrolling", () => {
      const multiGrid = render<MultiGridImperativeAPI>(
        getMarkup({ fixedColumnCount: 0, fixedRowCount: 0 })
      );
      act(() => {
        multiGrid.scrollToPosition({ scrollLeft: 300, scrollTop: 400 });
      });
      render(getMarkup({ fixedColumnCount: 2, fixedRowCount: 1 }));
      const { topRightGrid, bottomLeftGrid } = getGrids(multiGrid);
      expect(topRightGrid.scrollLeft).toEqual(300);
      expect(bottomLeftGrid.scrollTop).toEqual(400);
    });

    it("should sync the fixed Grids in StrictMode", () => {
      const ref = createRef<MultiGridImperativeAPI>();
      render(
        <StrictMode>
          <div>{getMarkup({ ref })}</div>
        </StrictMode>
      );
      act(() => {
        ref.current!.scrollToPosition({ scrollLeft: 300, scrollTop: 400 });
      });
      const [, topRightGrid, bottomLeftGrid, bottomRightGrid] =
        document.body.querySelectorAll<HTMLElement>(".ReactVirtualized__Grid");
      expect(bottomRightGrid.scrollLeft).toEqual(300);
      expect(bottomRightGrid.scrollTop).toEqual(400);
      expect(topRightGrid.scrollLeft).toEqual(300);
      expect(bottomLeftGrid.scrollTop).toEqual(400);
    });

    it("should not crash when decreasing :rowCount", () => {
      const multiGrid = render<MultiGridImperativeAPI>(getMarkup());
      act(() => {
        multiGrid.scrollToPosition({ scrollTop: 1000 });
      });
      render(
        getMarkup({
          rowCount: 2
        })
      );
      expect(document.body.textContent).toContain("row:1, column:0");
      expect(document.body.textContent).not.toContain("row:2,");
    });

    it("should not crash when decreasing :columnCount", () => {
      render(getMarkup());
      render(
        getMarkup({
          columnCount: 3
        })
      );
      expect(document.body.textContent).toContain("row:0, column:2");
      expect(document.body.textContent).not.toContain("column:3");
    });
  });

  describe("deferredMeasurementCache", () => {
    function getDeferredMeasurementCache() {
      const deferredMeasurementCache: any = new CellMeasurerCache({
        fixedHeight: true,
        fixedWidth: true
      });

      deferredMeasurementCache._columnIndices = {};
      deferredMeasurementCache._rowIndices = {};
      deferredMeasurementCache.has = (
        rowIndex: number,
        columnIndex: number
      ) => {
        deferredMeasurementCache._columnIndices[columnIndex] = columnIndex;
        deferredMeasurementCache._rowIndices[rowIndex] = rowIndex;
        return true;
      };

      return deferredMeasurementCache;
    }

    it("should wrap top-right and bottom-right deferredMeasurementCache if fixedColumnCount is > 0", () => {
      const deferredMeasurementCache = getDeferredMeasurementCache();
      render(
        getMarkup({
          deferredMeasurementCache: deferredMeasurementCache,
          columnCount: 3,
          fixedColumnCount: 1,
          fixedRowCount: 0,
          rowCount: 1
        })
      );

      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual([
        "0",
        "1",
        "2"
      ]);
    });

    it("should not wrap top-right and bottom-right deferredMeasurementCache if fixedColumnCount is 0", () => {
      const deferredMeasurementCache = getDeferredMeasurementCache();
      render(
        getMarkup({
          deferredMeasurementCache: deferredMeasurementCache,
          columnCount: 2,
          fixedColumnCount: 0,
          fixedRowCount: 0,
          rowCount: 1
        })
      );

      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual([
        "0",
        "1"
      ]);
    });

    it("should wrap bottom-left and bottom-right deferredMeasurementCache if fixedRowCount is > 0", () => {
      const deferredMeasurementCache = getDeferredMeasurementCache();
      render(
        getMarkup({
          deferredMeasurementCache: deferredMeasurementCache,
          columnCount: 1,
          fixedColumnCount: 0,
          fixedRowCount: 1,
          rowCount: 3
        })
      );

      expect(Object.keys(deferredMeasurementCache._rowIndices)).toEqual([
        "0",
        "1",
        "2"
      ]);
    });

    // Bug #20
    it("should update the wrappers when fixedColumnCount or fixedRowCount change", () => {
      const deferredMeasurementCache = getDeferredMeasurementCache();
      const props = {
        deferredMeasurementCache,
        columnCount: 4,
        rowCount: 4
      };
      render(getMarkup({ ...props, fixedColumnCount: 1, fixedRowCount: 1 }));
      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual([
        "0",
        "1",
        "2",
        "3"
      ]);

      deferredMeasurementCache._columnIndices = {};
      deferredMeasurementCache._rowIndices = {};
      render(getMarkup({ ...props, fixedColumnCount: 2, fixedRowCount: 2 }));
      // (With stale offsets, the last column and row would not be queried)
      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual([
        "0",
        "1",
        "2",
        "3"
      ]);
      expect(Object.keys(deferredMeasurementCache._rowIndices)).toEqual([
        "0",
        "1",
        "2",
        "3"
      ]);
    });

    // Bug #20
    it("should update the wrappers when deferredMeasurementCache changes", () => {
      function getDynamicWidthCache() {
        const cache = getDeferredMeasurementCache();
        cache.hasFixedWidth = () => false;
        return cache;
      }
      const props = {
        columnCount: 4,
        fixedColumnCount: 1,
        fixedRowCount: 0,
        rowCount: 1
      };

      const cacheA = getDynamicWidthCache();
      render(getMarkup({ ...props, deferredMeasurementCache: cacheA }));
      expect(Object.keys(cacheA._columnIndices)).toEqual(["0", "1", "2", "3"]);

      const cacheB = getDynamicWidthCache();
      cacheA._columnIndices = {};
      render(getMarkup({ ...props, deferredMeasurementCache: cacheB }));
      expect(Object.keys(cacheA._columnIndices)).toEqual([]);
      expect(Object.keys(cacheB._columnIndices)).toEqual(["0", "1", "2", "3"]);
    });

    it("should not wrap bottom-left and bottom-right deferredMeasurementCache if fixedRowCount is 0", () => {
      const deferredMeasurementCache = getDeferredMeasurementCache();
      render(
        getMarkup({
          deferredMeasurementCache: deferredMeasurementCache,
          columnCount: 1,
          fixedColumnCount: 0,
          fixedRowCount: 0,
          rowCount: 2
        })
      );

      expect(Object.keys(deferredMeasurementCache._rowIndices)).toEqual([
        "0",
        "1"
      ]);
    });
  });

  describe("CellMeasurer", () => {
    // jsdom doesn't measure elements; a cell reports the width specified by its data-width attribute instead
    let originalOffsetWidth: PropertyDescriptor | undefined;
    beforeEach(() => {
      originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetWidth"
      );
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
          return Number(this.dataset.width ?? 0);
        }
      });
    });
    afterEach(() => {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetWidth",
        originalOffsetWidth!
      );
    });

    const getColumnWidth = (columnIndex: number) => 60 + (columnIndex % 3) * 10;

    function renderMeasuredMultiGrid() {
      const cache = new CellMeasurerCache({
        defaultHeight: 20,
        defaultWidth: 50,
        fixedHeight: true
      });

      function cellRenderer({
        columnIndex,
        key,
        parent,
        rowIndex,
        style
      }: CellRendererParams) {
        return (
          <CellMeasurer
            cache={cache}
            columnIndex={columnIndex}
            key={key}
            parent={parent}
            rowIndex={rowIndex}
          >
            <div
              className="gridItem"
              data-width={getColumnWidth(columnIndex)}
              style={style}
            >
              {`row:${rowIndex}, column:${columnIndex}`}
            </div>
          </CellMeasurer>
        );
      }

      const ref = createRef<MultiGridImperativeAPI>();
      render(
        <StrictMode>
          <div>
            {getMarkup({
              cellRenderer,
              columnWidth: cache.columnWidth,
              deferredMeasurementCache: cache,
              fixedColumnCount: 1,
              fixedRowCount: 1,
              ref
            })}
          </div>
        </StrictMode>
      );
      return ref;
    }

    // Checks that the cells of all quadrants have their measured widths, and that the columns of the top and bottom Grids line up
    function expectMeasuredColumns() {
      const [topLeft, topRight, bottomLeft, bottomRight] =
        document.body.querySelectorAll<HTMLElement>(".ReactVirtualized__Grid");

      expect(topLeft.style.width).toEqual(`${getColumnWidth(0)}px`);
      expect(bottomLeft.style.width).toEqual(`${getColumnWidth(0)}px`);
      expect(topRight.style.left).toEqual(`${getColumnWidth(0)}px`);
      expect(bottomRight.style.left).toEqual(`${getColumnWidth(0)}px`);

      const topRightLefts = new Map<number, string>();
      for (const grid of [topLeft, topRight, bottomLeft, bottomRight]) {
        const cells = grid.querySelectorAll<HTMLElement>(".gridItem");
        expect(cells.length).toBeGreaterThan(0);
        for (const cell of cells) {
          const [, row, column] = cell.textContent!.match(
            /row:(\d+), column:(\d+)/
          )!;
          const columnIndex = Number(column);
          expect(cell.style.width).toEqual(`${getColumnWidth(columnIndex)}px`);
          if (grid === topRight) {
            topRightLefts.set(columnIndex, cell.style.left);
          } else if (grid === bottomRight && topRightLefts.has(columnIndex)) {
            expect(cell.style.left).toEqual(topRightLefts.get(columnIndex));
          }
          expect(Number(row)).toBeGreaterThanOrEqual(0);
        }
      }
      expect(topRight.scrollLeft).toEqual(bottomRight.scrollLeft);
    }

    it("should measure the cells of all quadrants (in StrictMode)", () => {
      renderMeasuredMultiGrid();
      expectMeasuredColumns();
    });

    it("should apply the measurements of cells rendered while scrolling (in StrictMode)", () => {
      const ref = renderMeasuredMultiGrid();

      // The newly rendered cells are rendered (and measured) by the inner Grids only
      act(() => {
        ref.current!.scrollToPosition({ scrollLeft: 1500 });
      });
      const bottomRight = document.body.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Grid"
      )[3];
      expect(bottomRight.textContent).toContain("column:30");
      expectMeasuredColumns();
    });
  });

  describe("onScrollbarPresenceChange", () => {
    function getScrollbarSize20() {
      return 20;
    }

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
});
