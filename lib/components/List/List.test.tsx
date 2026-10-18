/* eslint-disable @typescript-eslint/no-explicit-any */
import Immutable from "immutable";
import { fireEvent } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  act,
  createRef,
  StrictMode,
  useLayoutEffect,
  type CSSProperties
} from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getObserverCount,
  mockResizeObserver
} from "../../utils/test/mockResizeObserver";
import {
  findDOMNode as findDOMNodeUntyped,
  render
} from "../../utils/test/render";
import {
  createScrollContainer,
  mockWindowScrolling
} from "../../utils/test/scrollElement";
import { CellMeasurer } from "../CellMeasurer/CellMeasurer";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import { accessibilityOverscanIndicesGetter } from "../Grid/accessibilityOverscanIndicesGetter";
import { defaultOverscanIndicesGetter } from "../Grid/defaultOverscanIndicesGetter";
import type { Alignment, OverscanIndicesGetterParams } from "../Grid/types";
import { defaultListProps } from "./defaultListProps";
import { List } from "./List";
import type {
  ListImperativeAPI,
  ListProps,
  RenderedRows,
  RowRendererParams,
  Scroll
} from "./types";

function findDOMNode(
  instance: Parameters<typeof findDOMNodeUntyped>[0]
): HTMLDivElement {
  return findDOMNodeUntyped(instance) as HTMLDivElement;
}

describe("List", () => {
  const array: string[] = [];
  for (let i = 0; i < 100; i++) {
    array.push(`Name ${i}`);
  }
  const names = Immutable.fromJS(array);

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter({
    startIndex,
    stopIndex
  }: OverscanIndicesGetterParams) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex
    };
  }

  function getMarkup(props: Partial<ListProps> = {}) {
    function rowRenderer({ index, key, style }: RowRendererParams) {
      return (
        <div className="listItem" key={key} style={style}>
          {names.get(index)}
        </div>
      );
    }

    return (
      <List
        height={100}
        overscanIndicesGetter={overscanIndicesGetter}
        overscanRowCount={0}
        rowHeight={10}
        rowCount={names.size}
        rowRenderer={rowRenderer}
        width={100}
        {...props}
      />
    );
  }

  function getInnerScrollContainerHeight() {
    return document.body.querySelector<HTMLElement>(
      ".ReactVirtualized__Grid__innerScrollContainer"
    )!.style.height;
  }

  function renderAndScrollToRow(
    props: Partial<ListProps>,
    params: { align?: Alignment; index: number }
  ) {
    const list = render<ListImperativeAPI>(getMarkup(props));
    act(() => {
      list.scrollToRow(params);
    });
    return list;
  }

  describe("number of rendered children", () => {
    it("should render enough children to fill the view", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll(".listItem").length).toEqual(10);
    });

    it("should not render more children than available if the list is not filled", () => {
      const rendered = findDOMNode(render(getMarkup({ rowCount: 5 })));
      expect(rendered.querySelectorAll(".listItem").length).toEqual(5);
    });
  });

  describe("scrollToPosition", () => {
    it("should scroll to the top", () => {
      const instance = render<ListImperativeAPI>(
        getMarkup({
          rowHeight: 10
        })
      );
      act(() => {
        instance.scrollToPosition({ scrollTop: 100 });
      });
      const rendered = findDOMNode(instance);
      expect(rendered.textContent).toContain("Name 10");
      expect(rendered.textContent).toContain("Name 19");
    });

    it("should ignore scrollLeft", () => {
      const instance = render<ListImperativeAPI>(getMarkup());
      act(() => {
        instance.scrollToPosition({ scrollLeft: 100 });
      });
      const rendered = findDOMNode(instance);
      expect(rendered.scrollLeft).toEqual(0);
      expect(rendered.scrollTop).toEqual(0);
      act(() => {
        instance.scrollToPosition({ scrollLeft: 100, scrollTop: 50 });
      });
      expect(rendered.scrollLeft).toEqual(0);
      expect(rendered.scrollTop).toEqual(50);
    });
  });

  /** Tests scrolling via the imperative scrollToRow() method */
  describe("scrollToRow", () => {
    it("should scroll to the top", () => {
      const rendered = findDOMNode(renderAndScrollToRow({}, { index: 0 }));
      expect(rendered.textContent).toContain("Name 0");
    });

    it("should scroll down to the middle", () => {
      const rendered = findDOMNode(renderAndScrollToRow({}, { index: 49 }));
      // 100 items * 10 item height = 1,000 total item height
      // 10 items can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(rendered.textContent).toContain("Name 49");
      expect(rendered.scrollTop).toEqual(400);
    });

    it("should scroll to the bottom", () => {
      const rendered = findDOMNode(renderAndScrollToRow({}, { index: 99 }));
      // 100 height - 10 header = 90 available scroll space.
      // 100 items * 10 item height = 1,000 total item height
      // Target height for the last item then is 1000 - 90
      expect(rendered.textContent).toContain("Name 99");
    });

    it('should scroll to the correct position for align "start"', () => {
      const rendered = findDOMNode(
        renderAndScrollToRow({}, { align: "start", index: 49 })
      );
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain("Name 49");
      expect(rendered.textContent).toContain("Name 58");
    });

    it('should scroll to the correct position for align "end"', () => {
      const list = renderAndScrollToRow({}, { index: 99 });
      act(() => {
        list.scrollToRow({ align: "end", index: 49 });
      });
      const rendered = findDOMNode(list);
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain("Name 40");
      expect(rendered.textContent).toContain("Name 49");
    });

    it('should scroll to the correct position for align "center"', () => {
      const list = renderAndScrollToRow({}, { index: 99 });
      act(() => {
        list.scrollToRow({ align: "center", index: 49 });
      });
      const rendered = findDOMNode(list);
      // 100 items * 10 item height = 1,000 total item height; 11 items can be visible at a time (the first and last item are only partially visible)
      expect(rendered.textContent).toContain("Name 44");
      expect(rendered.textContent).toContain("Name 54");
    });

    it("should support scrollToCell() (e.g. for ArrowKeyStepper)", () => {
      const list = render<ListImperativeAPI>(getMarkup());
      act(() => {
        list.scrollToCell({ align: "start", columnIndex: 3, rowIndex: 49 });
      });
      const rendered = findDOMNode(list);
      expect(rendered.scrollLeft).toEqual(0);
      expect(rendered.scrollTop).toEqual(490);
    });

    it("should support getOffsetForRow()", () => {
      const list = render<ListImperativeAPI>(getMarkup());
      expect(list.getOffsetForRow({ index: 49 })).toEqual(400);
      expect(list.getOffsetForRow({ align: "start", index: 49 })).toEqual(490);
      expect(list.getOffsetForRow({ align: "center", index: 49 })).toEqual(445);
      // The deprecated alignment param is still supported (align takes precedence)
      expect(list.getOffsetForRow({ alignment: "start", index: 49 })).toEqual(
        490
      );
      expect(
        list.getOffsetForRow({ align: "end", alignment: "start", index: 49 })
      ).toEqual(400);
      // Defaults to the last row (and auto alignment), not to the row most recently scrolled to
      act(() => {
        list.scrollToRow({ align: "start", index: 20 });
      });
      const lastRowOffset = list.getOffsetForRow({ index: names.size - 1 });
      expect(list.getOffsetForRow({})).toEqual(lastRowOffset);
      expect(list.getOffsetForRow()).toEqual(lastRowOffset);
    });

    it("should work in StrictMode", () => {
      const ref = createRef<ListImperativeAPI>();
      render(
        <StrictMode>
          <div>{getMarkup({ ref } as Partial<ListProps>)}</div>
        </StrictMode>
      );
      act(() => {
        ref.current!.scrollToRow({ index: 49 });
      });
      const rendered = document.body.querySelector<HTMLElement>(
        ".ReactVirtualized__List"
      )!;
      expect(rendered.scrollTop).toEqual(400);
      expect(rendered.textContent).toContain("Name 49");
    });
  });

  describe("initialScrollTop", () => {
    it("should render and scroll to the initial offset on mount", () => {
      const list = render<ListImperativeAPI>(
        getMarkup({ initialScrollTop: 200 })
      );
      const element = findDOMNode(list);
      expect(element.scrollTop).toEqual(200);
      expect(element.textContent).toContain("Name 20");
      expect(element.textContent).not.toContain("Name 0");
    });

    it("should render the rows at the initial offset on the server, shifted into view", () => {
      const html = renderToString(getMarkup({ initialScrollTop: 200 }));
      expect(html).toContain("Name 20");
      expect(html).toContain("margin-top:-200px");
    });
  });

  describe("property updates", () => {
    it("should not keep the row scrolled to in view when :rowHeight changes", () => {
      const list = renderAndScrollToRow({}, { index: 50 });
      expect(findDOMNode(list).scrollTop).toEqual(410);
      // scrollToRow is a one-time scroll; making rows taller doesn't scroll back to row 50
      render(getMarkup({ rowHeight: 20 }));
      expect(findDOMNode(list).scrollTop).toEqual(410);
      expect(findDOMNode(list).textContent).not.toContain("Name 50");
    });

    it("should update scroll position if size shrinks smaller than the current scroll", () => {
      const list = renderAndScrollToRow({}, { index: 500 });
      render(getMarkup({ rowCount: 10 }));
      expect(findDOMNode(list).textContent).toContain("Name 9");
    });
  });

  describe("noRowsRenderer", () => {
    it("should call :noRowsRenderer if :rowCount is 0", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            noRowsRenderer: () => <div>No rows!</div>,
            rowCount: 0
          })
        )
      );
      expect(rendered.textContent).toEqual("No rows!");
    });

    it("should render an empty body if :rowCount is 0 and there is no :noRowsRenderer", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowCount: 0
          })
        )
      );
      expect(rendered.textContent).toEqual("");
    });
  });

  describe("onRowsRendered", () => {
    it("should call :onRowsRendered if at least one row is rendered", () => {
      let startIndex: number | undefined, stopIndex: number | undefined;
      render(
        getMarkup({
          onRowsRendered: (params: RenderedRows) =>
            ({ startIndex, stopIndex } = params)
        })
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it("should not call :onRowsRendered unless the start or stop indices have changed", () => {
      let numCalls = 0;
      let startIndex: number | undefined;
      let stopIndex: number | undefined;
      const onRowsRendered = (params: RenderedRows) => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({ onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(render(getMarkup({ onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it("should call :onRowsRendered if the start or stop indices have changed", () => {
      let numCalls = 0;
      let startIndex: number | undefined;
      let stopIndex: number | undefined;
      const onRowsRendered = (params: RenderedRows) => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({ onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(
        render(
          getMarkup({
            height: 50,
            onRowsRendered
          })
        )
      );
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(4);
    });

    it("should not call :onRowsRendered if no rows are rendered", () => {
      let startIndex: number | undefined, stopIndex: number | undefined;
      render(
        getMarkup({
          height: 0,
          onRowsRendered: (params: RenderedRows) =>
            ({ startIndex, stopIndex } = params)
        })
      );
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
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

    // Renders the List within a scroll container (with a 100px viewport), below `contentOffset` pixels of other content
    function renderInScrollContainer(
      props: Partial<ListProps> = {},
      {
        contentOffset = 0,
        height = 100,
        scrollTop = 0
      }: { contentOffset?: number; height?: number; scrollTop?: number } = {}
    ) {
      const container = createScrollContainer({
        contentOffset,
        height,
        width: 100
      });
      container.element.scrollTop = scrollTop;
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      const list = render<ListImperativeAPI>(
        getMarkup({ scrollElement: container.element, ...props })
      );
      return { container, list, scrollTo };
    }

    it("should render the rows within the viewport of the scroll element", () => {
      let startIndex: number | undefined, stopIndex: number | undefined;
      const { container, list } = renderInScrollContainer(
        {
          onRowsRendered: (params: RenderedRows) =>
            ({ startIndex, stopIndex } = params)
        },
        { scrollTop: 100 }
      );
      expect(startIndex).toEqual(10);
      expect(stopIndex).toEqual(19);
      expect(findDOMNode(list).style.height).toEqual("auto");

      container.scroll(200);
      expect(startIndex).toEqual(20);
      expect(stopIndex).toEqual(29);
      expect(findDOMNode(list).scrollTop).toEqual(0);
    });

    it("should measure its position within the scroll element", () => {
      let startIndex: number | undefined;
      const { container } = renderInScrollContainer(
        { onRowsRendered: (params: RenderedRows) => ({ startIndex } = params) },
        { contentOffset: 150 }
      );
      expect(startIndex).toEqual(0);

      container.scroll(250);
      expect(startIndex).toEqual(10);
    });

    it("should scroll the scroll element with scrollToRow (#32)", () => {
      const { list, scrollTo } = renderInScrollContainer();

      act(() => {
        list.scrollToRow({ index: 49 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 400);
      expect(findDOMNode(list).textContent).toContain("Name 49");

      act(() => {
        list.scrollToRow({ align: "start", index: 20 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 200);
      expect(findDOMNode(list).scrollTop).toEqual(0);

      // Already visible
      scrollTo.mockClear();
      act(() => {
        list.scrollToRow({ index: 25 });
      });
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("should scroll the scroll element with scrollToCell", () => {
      const { list, scrollTo } = renderInScrollContainer();

      act(() => {
        list.scrollToCell({ align: "center", columnIndex: 0, rowIndex: 50 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 455);
    });

    it("should scroll the scroll element with scrollToPosition", () => {
      const { list, scrollTo } = renderInScrollContainer(
        {},
        { contentOffset: 100 }
      );

      act(() => {
        list.scrollToPosition({ scrollTop: 300 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 400);
      expect(findDOMNode(list).textContent).toContain("Name 30");
    });

    it("should calculate getOffsetForRow relative to the viewport", () => {
      const { list } = renderInScrollContainer({}, { scrollTop: 100 });
      expect(list.getOffsetForRow({ index: 5 })).toEqual(50);
      expect(list.getOffsetForRow({ index: 15 })).toEqual(100);
    });

    it("should use the viewport height of the scroll element", () => {
      let stopIndex: number | undefined;
      renderInScrollContainer(
        {
          height: undefined,
          onRowsRendered: (params: RenderedRows) => ({ stopIndex } = params)
        },
        { height: 200 }
      );
      expect(stopIndex).toEqual(19);
    });

    it("should start and stop being scrolled when the scrollElement changes from null to an element and back (#6)", () => {
      let startIndex: number | undefined;
      const onRowsRendered = (params: RenderedRows) =>
        ({ startIndex } = params);
      const container = createScrollContainer({ height: 100 });
      container.element.scrollTop = 300;

      const list = render(getMarkup({ onRowsRendered, scrollElement: null }));
      expect(findDOMNode(list).style.height).toEqual("auto");
      expect(startIndex).toEqual(0);

      render(getMarkup({ onRowsRendered, scrollElement: container.element }));
      expect(startIndex).toEqual(30);
      expect(getObserverCount(container.element)).toBe(1);

      render(getMarkup({ onRowsRendered, scrollElement: null }));
      expect(startIndex).toEqual(0);
      expect(getObserverCount(container.element)).toBe(0);
      container.scroll(500);
      expect(startIndex).toEqual(0);

      // Without a scrollElement, it scrolls itself again
      render(getMarkup({ onRowsRendered }));
      expect(findDOMNode(list).style.height).toEqual("100px");
    });

    it("should ignore initialScrollTop", () => {
      let startIndex: number | undefined;
      const { list } = renderInScrollContainer({
        initialScrollTop: 200,
        onRowsRendered: (params: RenderedRows) => ({ startIndex } = params)
      });
      expect(startIndex).toEqual(0);
      expect(findDOMNode(list).scrollTop).toEqual(0);
    });

    it('should be scrolled by the window (scrollElement="window")', () => {
      let startIndex: number | undefined, stopIndex: number | undefined;
      const windowScrolling = mockWindowScrolling({ innerHeight: 200 });
      const list = render<ListImperativeAPI>(
        getMarkup({
          onRowsRendered: (params: RenderedRows) =>
            ({ startIndex, stopIndex } = params),
          scrollElement: "window"
        })
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(19);

      windowScrolling.scroll(500);
      expect(startIndex).toEqual(50);
      expect(document.body.style.pointerEvents).toEqual("none");

      act(() => {
        list.scrollToRow({ align: "start", index: 10 });
      });
      expect(window.scrollY).toEqual(100);
      expect(startIndex).toEqual(10);
    });

    it("should work in StrictMode", () => {
      let startIndex: number | undefined;
      const ref = createRef<ListImperativeAPI>();
      const container = createScrollContainer({ height: 100 });
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(
        <StrictMode>
          <div>
            {getMarkup({
              onRowsRendered: (params: RenderedRows) =>
                ({ startIndex } = params),
              ref,
              scrollElement: container.element
            } as Partial<ListProps>)}
          </div>
        </StrictMode>
      );
      container.scroll(200);
      expect(startIndex).toEqual(20);

      act(() => {
        ref.current!.scrollToRow({ align: "start", index: 50 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 500);
      expect(startIndex).toEqual(50);
    });
  });

  it("should warn in DEV if there is neither a height nor a scrollElement", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(getMarkup({ height: undefined }));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "List requires a height prop (unless a scrollElement is specified)"
    );
    warn.mockRestore();
  });

  describe("styles, classNames, and ids", () => {
    it("should use the expected global CSS classNames", () => {
      const node = findDOMNode(render(getMarkup()));
      expect(node.className).toContain("ReactVirtualized__List");
    });

    it("should use a custom :className if specified", () => {
      const node = findDOMNode(render(getMarkup({ className: "foo" })));
      expect(node.className).toContain("foo");
    });

    it("should use a custom :id if specified", () => {
      const node = findDOMNode(render(getMarkup({ id: "bar" })));
      expect(node.getAttribute("id")).toEqual("bar");
    });

    it("should use a custom :style if specified", () => {
      const style = { backgroundColor: "red" };
      const rendered = findDOMNode(render(getMarkup({ style })));
      expect(rendered.style.backgroundColor).toEqual("red");
    });

    it("should set the width of a row to be 100% by default", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const cell = rendered.querySelector<HTMLElement>(".listItem")!;
      expect(cell.style.width).toEqual("100%");
    });
  });

  describe("overscanRowCount", () => {
    it("should not overscan by default", () => {
      const mock = vi.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock
        })
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it("should overscan the specified amount", () => {
      const mock = vi.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
          overscanRowCount: 10
        })
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe("onScroll", () => {
    it("should trigger callback when component initially mounts", () => {
      const onScrollCalls: Scroll[] = [];
      render(
        getMarkup({
          onScroll: (params: Scroll) => onScrollCalls.push(params)
        })
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 100,
          scrollHeight: 1000,
          scrollTop: 0
        }
      ]);
    });

    it("should trigger callback when component scrolls", () => {
      const onScrollCalls: Scroll[] = [];
      const rendered = render<any>(
        getMarkup({
          onScroll: (params: Scroll) => onScrollCalls.push(params)
        })
      );
      fireEvent.scroll(findDOMNode(rendered), {
        target: { scrollLeft: 0, scrollTop: 100 }
      });
      expect(onScrollCalls[onScrollCalls.length - 1]).toEqual({
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });

  describe("measureAllRows", () => {
    it("should measure any unmeasured rows", () => {
      const rowHeight = vi.fn(() => 20);
      const props = {
        estimatedRowSize: 15,
        rowCount: 10,
        rowHeight
      };
      const rendered = render<ListImperativeAPI>(
        getMarkup({ ...props, height: 0, width: 0 })
      );
      expect(rowHeight).not.toHaveBeenCalled();
      act(() => {
        rendered.measureAllRows();
      });
      expect(rowHeight).toHaveBeenCalledTimes(10);

      // All rows are measured (rather than just the 5 visible rows, with an estimated size for the others)
      render(getMarkup({ ...props, height: 100, width: 100 }));
      expect(getInnerScrollContainerHeight()).toEqual("200px");
    });

    it("should estimate the size of rows that have not been measured", () => {
      render(
        getMarkup({
          estimatedRowSize: 15,
          rowCount: 10,
          rowHeight: () => 20
        })
      );
      // 5 visible (measured) rows * 20 + 5 estimated rows * 15
      expect(getInnerScrollContainerHeight()).toEqual("175px");
    });

    it("should not throw if there are no rows", () => {
      const rendered = render<any>(getMarkup({ rowCount: 0 }));
      expect(() => {
        act(() => {
          rendered.measureAllRows();
        });
      }).not.toThrow();
    });
  });

  describe("recomputeRowHeights", () => {
    it("should recompute row heights and other values when called", () => {
      const indices: number[] = [];
      const rowHeight = ({ index }: { index: number }) => {
        indices.push(index);
        return 10;
      };
      const component = render<ListImperativeAPI>(
        getMarkup({
          rowHeight,
          rowCount: 50
        })
      );

      indices.splice(0);
      act(() => {
        component.recomputeRowHeights();
      });

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(9);

      indices.splice(0);
      act(() => {
        component.recomputeRowHeights(4);
      });

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(9);
    });
  });

  describe("forceUpdateGrid", () => {
    it("should refresh inner Grid content when called", () => {
      let marker = "a";
      function rowRenderer({ index, key, style }: RowRendererParams) {
        return (
          <div key={key} style={style}>
            {index}
            {marker}
          </div>
        );
      }
      const component = render<ListImperativeAPI>(getMarkup({ rowRenderer }));
      const node = findDOMNode(component);
      expect(node.textContent).toContain("1a");
      marker = "b";
      act(() => {
        component.forceUpdateGrid();
      });
      expect(node.textContent).toContain("1b");
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

  it("should pass the cellRenderer an :isVisible flag", () => {
    const rowRendererCalls: RowRendererParams[] = [];
    function rowRenderer(props: RowRendererParams) {
      rowRendererCalls.push(props);
      return null;
    }
    findDOMNode(
      render(
        getMarkup({
          height: 50,
          overscanIndicesGetter: defaultOverscanIndicesGetter,
          overscanRowCount: 1,
          rowHeight: 50,
          rowRenderer
        })
      )
    );
    expect(rowRendererCalls[0].isVisible).toEqual(true);
    expect(rowRendererCalls[1].isVisible).toEqual(false);
  });

  it("should pass the List handle to the :rowRenderer as its :parent", () => {
    const rowRenderer = vi.fn().mockReturnValue(null);
    const list = render<ListImperativeAPI>(getMarkup({ rowRenderer }));
    expect(rowRenderer.mock.calls[0][0].parent).toBe(list);
  });

  describe("imperative handle", () => {
    it("should be stable across renders", () => {
      const list = render<ListImperativeAPI>(getMarkup());
      const updated = render<ListImperativeAPI>(getMarkup({ width: 200 }));
      expect(updated).toBe(list);
    });

    it("should not throw if called after the List has unmounted", () => {
      const list = render<ListImperativeAPI>(getMarkup());
      render.unmount();
      expect(() => {
        list.forceUpdateGrid();
        list.measureAllRows();
        list.recomputeRowHeights();
        list.recomputeGridSize();
        list.scrollToRow({ index: 10 });
        list.scrollToCell({ rowIndex: 10 });
        list.scrollToPosition({ scrollTop: 10 });
      }).not.toThrow();
      expect(list.getOffsetForRow({ index: 10 })).toEqual(0);
    });
  });

  describe("CellMeasurer", () => {
    let measuredHeight = 25;

    // JSDom doesn't support measurements
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetHeight"
    )!;
    function mockOffsetHeight() {
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get: () => measuredHeight
      });
    }

    afterEach(() => {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetHeight",
        originalOffsetHeight
      );
      measuredHeight = 25;
    });

    function getCellMeasurerMarkup(
      cache: CellMeasurerCache,
      props: Partial<ListProps> = {}
    ) {
      const measureCallbacks: Array<() => void> = [];
      function rowRenderer({ index, key, parent, style }: RowRendererParams) {
        return (
          <CellMeasurer
            cache={cache}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}
          >
            {({ measure, registerChild }) => {
              measureCallbacks[index] = measure;
              return (
                <div
                  className="listItem"
                  ref={registerChild as (element: Element | null) => void}
                  style={style}
                >
                  {names.get(index)}
                </div>
              );
            }}
          </CellMeasurer>
        );
      }

      return {
        markup: getMarkup({
          deferredMeasurementCache: cache,
          rowCount: 10,
          rowHeight: cache.rowHeight,
          rowRenderer,
          ...props
        }),
        measureCallbacks
      };
    }

    function getRowTops() {
      return Array.from(
        document.body.querySelectorAll<HTMLElement>(".listItem")
      ).map((row) => row.style.top);
    }

    it("should measure rows through the List handle (invalidateCellSizeAfterRender)", () => {
      mockOffsetHeight();
      const cache = new CellMeasurerCache({
        defaultHeight: 10,
        fixedWidth: true
      });
      const { markup } = getCellMeasurerMarkup(cache);
      const list = render<ListImperativeAPI>(markup);
      const invalidateCellSizeAfterRender = vi.spyOn(
        list,
        "invalidateCellSizeAfterRender"
      );

      expect(cache.getHeight(0, 0)).toEqual(25);
      // Rows were re-positioned using their measured heights
      expect(getRowTops().slice(0, 4)).toEqual(["0px", "25px", "50px", "75px"]);
      // 4 visible (measured) rows * 25 + 6 estimated rows * 30 (estimatedRowSize)
      expect(getInnerScrollContainerHeight()).toEqual("280px");

      // Newly rendered (unmeasured) rows are reported to the List handle
      expect(cache.has(9, 0)).toBe(true);
      expect(cache.has(10, 0)).toBe(false);
      render(getCellMeasurerMarkup(cache, { rowCount: 20 }).markup);
      // Rows that haven't been measured yet are positioned using the cache's default height (10),
      // so scrolling to row 19 (a one-time scroll) brings rows 10-13 into view
      act(() => {
        list.scrollToRow({ index: 19 });
      });
      expect(invalidateCellSizeAfterRender).toHaveBeenCalledWith({
        columnIndex: 0,
        rowIndex: 10
      });
      expect(cache.getHeight(10, 0)).toEqual(25);
      const row = Array.from(
        document.body.querySelectorAll<HTMLElement>(".listItem")
      ).find((row) => row.textContent === "Name 13")!;
      expect(row.style.top).toEqual("325px");
    });

    it("should re-measure rows through the List handle (recomputeGridSize)", () => {
      mockOffsetHeight();
      const cache = new CellMeasurerCache({
        defaultHeight: 10,
        fixedWidth: true
      });
      const { markup, measureCallbacks } = getCellMeasurerMarkup(cache);
      const list = render<ListImperativeAPI>(markup);
      const recomputeGridSize = vi.spyOn(list, "recomputeGridSize");
      expect(getRowTops().slice(0, 3)).toEqual(["0px", "25px", "50px"]);

      measuredHeight = 40;
      act(() => {
        measureCallbacks[0]();
      });
      expect(recomputeGridSize).toHaveBeenCalledWith({
        columnIndex: 0,
        rowIndex: 0
      });
      expect(cache.getHeight(0, 0)).toEqual(40);
      expect(getRowTops().slice(0, 3)).toEqual(["0px", "40px", "65px"]);
    });

    it("should pass on a recomputeGridSize() call made by a row while the List is mounting", () => {
      // Row 0 makes all rows taller as it mounts (before the List's inner Grid ref has been attached)
      let rowHeight = 10;
      function GrowingRow({
        index,
        parent,
        style
      }: {
        index: number;
        parent: ListImperativeAPI;
        style: CSSProperties;
      }) {
        useLayoutEffect(() => {
          if (index === 0 && rowHeight === 10) {
            rowHeight = 20;
            parent.recomputeGridSize({ rowIndex: 0 });
          }
        }, [index, parent]);
        return (
          <div className="listItem" style={style}>
            {names.get(index)}
          </div>
        );
      }

      render(
        getMarkup({
          rowHeight: () => rowHeight,
          rowRenderer: ({ index, key, parent, style }) => (
            <GrowingRow index={index} key={key} parent={parent} style={style} />
          )
        })
      );
      const rows = document.body.querySelectorAll<HTMLElement>(".listItem");
      expect(rows[1].style.top).toEqual("20px");
      expect(rows[1].style.height).toEqual("20px");
    });

    it("should measure rows in StrictMode", () => {
      mockOffsetHeight();
      const cache = new CellMeasurerCache({
        defaultHeight: 10,
        fixedWidth: true
      });
      const { markup } = getCellMeasurerMarkup(cache);
      render(<StrictMode>{markup}</StrictMode>);
      expect(cache.getHeight(0, 0)).toEqual(25);
      expect(getRowTops().slice(0, 4)).toEqual(["0px", "25px", "50px", "75px"]);
      // 4 visible (measured) rows * 25 + 6 estimated rows * 30 (estimatedRowSize)
      expect(getInnerScrollContainerHeight()).toEqual("280px");
    });
  });

  describe("pure", () => {
    it("should not re-render unless props have changed", () => {
      let rowRendererCalled = false;
      function rowRenderer({ index, key, style }: RowRendererParams) {
        rowRendererCalled = true;
        return (
          <div key={key} style={style}>
            {index}
          </div>
        );
      }
      const markup = getMarkup({ rowRenderer });
      render(markup);
      expect(rowRendererCalled).toEqual(true);
      rowRendererCalled = false;
      render(markup);
      expect(rowRendererCalled).toEqual(false);
    });
  });

  it("should export its default props", () => {
    expect(defaultListProps).toEqual({
      estimatedRowSize: 30,
      noRowsRenderer: expect.any(Function),
      onRowsRendered: expect.any(Function),
      onScroll: expect.any(Function),
      overscanIndicesGetter: accessibilityOverscanIndicesGetter,
      overscanRowCount: 10,
      role: "list",
      style: {},
      tabIndex: 0
    });
    expect(Object.isFrozen(defaultListProps)).toBe(true);
  });

  describe("roles (#1657)", () => {
    it("should render a list of list items by default", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.getAttribute("role")).toEqual("list");
      expect(rendered.hasAttribute("aria-label")).toBe(false);
      expect(rendered.hasAttribute("aria-readonly")).toBe(false);
      expect(
        rendered
          .querySelector(".ReactVirtualized__Grid__innerScrollContainer")!
          .getAttribute("role")
      ).toEqual("presentation");
      const rows = rendered.querySelectorAll(".listItem");
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.getAttribute("role")).toEqual("listitem");
      }
    });

    it("should not override a role set by the row renderer", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowRenderer: ({ index, key, style }) => (
              <div className="listItem" key={key} role="option" style={style}>
                {index}
              </div>
            )
          })
        )
      );
      expect(rendered.querySelector(".listItem")!.getAttribute("role")).toEqual(
        "option"
      );
    });

    it("should support the aria-label, aria-readonly and containerRole props", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            "aria-label": "Users",
            "aria-readonly": true,
            containerRole: "none"
          })
        )
      );
      expect(rendered.getAttribute("aria-label")).toEqual("Users");
      expect(rendered.getAttribute("aria-readonly")).toEqual("true");
      expect(
        rendered
          .querySelector(".ReactVirtualized__Grid__innerScrollContainer")!
          .getAttribute("role")
      ).toEqual("none");
    });

    it('should use the version 9 roles with role="grid"', () => {
      const rendered = findDOMNode(render(getMarkup({ role: "grid" })));
      expect(rendered.getAttribute("role")).toEqual("grid");
      expect(rendered.getAttribute("aria-label")).toEqual("grid");
      expect(rendered.getAttribute("aria-readonly")).toEqual("true");
      expect(
        rendered
          .querySelector(".ReactVirtualized__Grid__innerScrollContainer")!
          .getAttribute("role")
      ).toEqual("row");
      expect(rendered.querySelector(".listItem")!.getAttribute("role")).toEqual(
        "gridcell"
      );
    });
  });

  it("should use the accessibility overscan indices getter by default", () => {
    const rendered = findDOMNode(
      render(
        getMarkup({ overscanIndicesGetter: undefined, overscanRowCount: 0 })
      )
    );
    // At least one row is overscanned (for accessibility)
    expect(rendered.querySelectorAll(".listItem").length).toEqual(11);
  });

  it("should set the width of the single-column inner Grid to auto", () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(
      rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid__innerScrollContainer"
      )!.style.width
    ).toEqual("auto");
  });
});
