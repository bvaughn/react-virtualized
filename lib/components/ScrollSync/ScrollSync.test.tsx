import {
  act,
  forwardRef,
  StrictMode,
  useImperativeHandle,
  type ReactNode
} from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../utils/test/render";
import { Grid } from "../Grid/Grid";
import type { CellRendererParams, GridImperativeAPI } from "../Grid/types";
import { ScrollSync } from "./ScrollSync";
import type {
  ScrollSyncChild,
  ScrollSyncChildProps,
  ScrollSyncScrollParams
} from "./types";

function ChildComponent({
  clientHeight,
  clientWidth,
  scrollHeight,
  scrollLeft,
  scrollTop,
  scrollWidth
}: Partial<ScrollSyncChildProps>) {
  return (
    <div data-testid="values">
      {`clientHeight:${clientHeight}`}
      {`clientWidth:${clientWidth}`}
      {`scrollHeight:${scrollHeight}`}
      {`scrollLeft:${scrollLeft}`}
      {`scrollTop:${scrollTop}`}
      {`scrollWidth:${scrollWidth}`}
    </div>
  );
}

function getTextContent() {
  return document.querySelector('[data-testid="values"]')!.textContent;
}

function scrollParams(
  params: Partial<ScrollSyncScrollParams> = {}
): ScrollSyncScrollParams {
  return {
    clientHeight: 100,
    clientWidth: 100,
    scrollHeight: 1000,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 1000,
    ...params
  };
}

/** Minimal registered child; optionally echoes the new offset through onScroll (like Grid does). */
const MockChild = forwardRef<
  ScrollSyncChild,
  {
    onScroll?: (params: ScrollSyncScrollParams) => void;
    scrollToPosition: ScrollSyncChild["scrollToPosition"];
  }
>(function MockChild({ onScroll, scrollToPosition }, ref) {
  useImperativeHandle(
    ref,
    () => ({
      scrollToPosition: (position) => {
        scrollToPosition(position);
        onScroll?.(scrollParams(position));
      }
    }),
    [onScroll, scrollToPosition]
  );
  return null;
});

describe("ScrollSync", () => {
  it("should pass through an initial value of 0 for :scrollLeft and :scrollTop", () => {
    render(
      <ScrollSync>{(params) => <ChildComponent {...params} />}</ScrollSync>
    );
    expect(getTextContent()).toContain("clientHeight:0");
    expect(getTextContent()).toContain("clientWidth:0");
    expect(getTextContent()).toContain("scrollHeight:0");
    expect(getTextContent()).toContain("scrollLeft:0");
    expect(getTextContent()).toContain("scrollTop:0");
    expect(getTextContent()).toContain("scrollWidth:0");
  });

  it("should update :scrollLeft and :scrollTop when :onScroll is called", () => {
    let onScroll: ((params: ScrollSyncScrollParams) => void) | undefined;
    render(
      <ScrollSync>
        {(params) => {
          onScroll = params.onScroll;
          return <ChildComponent {...params} />;
        }}
      </ScrollSync>
    );
    act(() => {
      onScroll!({
        clientHeight: 400,
        clientWidth: 200,
        scrollHeight: 1000,
        scrollLeft: 50,
        scrollTop: 100,
        scrollWidth: 500
      });
    });
    expect(getTextContent()).toContain("clientHeight:400");
    expect(getTextContent()).toContain("clientWidth:200");
    expect(getTextContent()).toContain("scrollHeight:1000");
    expect(getTextContent()).toContain("scrollLeft:50");
    expect(getTextContent()).toContain("scrollTop:100");
    expect(getTextContent()).toContain("scrollWidth:500");
  });

  it("should return a stable ref callback per key from :registerChild", () => {
    const callbacks: Array<ReturnType<ScrollSyncChildProps["registerChild"]>> =
      [];
    let onScroll: ((params: ScrollSyncScrollParams) => void) | undefined;
    render(
      <ScrollSync>
        {(params) => {
          onScroll = params.onScroll;
          callbacks.push(params.registerChild("a"), params.registerChild("b"));
          return null;
        }}
      </ScrollSync>
    );
    act(() => onScroll!(scrollParams({ scrollTop: 10 })));
    expect(callbacks.length).toBe(4);
    expect(callbacks[0]).toBe(callbacks[2]);
    expect(callbacks[1]).toBe(callbacks[3]);
    expect(callbacks[0]).not.toBe(callbacks[1]);
  });

  it("should throw if a child without a scrollToPosition() method is registered", () => {
    let registerChild: ScrollSyncChildProps["registerChild"] | undefined;
    render(
      <ScrollSync>
        {(params) => {
          registerChild = params.registerChild;
          return null;
        }}
      </ScrollSync>
    );
    expect(() => registerChild!("a")({} as unknown as ScrollSyncChild)).toThrow(
      "Unexpected child type registered"
    );
  });

  describe("registerChild", () => {
    const ROW_HEIGHT = 50;
    const COLUMN_WIDTH = 50;

    function cellRenderer({
      columnIndex,
      key,
      rowIndex,
      style
    }: CellRendererParams) {
      return (
        <div className="cell" key={key} style={style}>
          {`${rowIndex}:${columnIndex}`}
        </div>
      );
    }

    function getCells(id: string) {
      return Array.from(
        document.querySelectorAll(`[data-testid="${id}"] .cell`)
      ).map((cell) => cell.textContent);
    }

    function renderSpreadsheet({
      bodyRef,
      headerRef,
      leftRef,
      strictMode = false
    }: {
      bodyRef?: (grid: GridImperativeAPI | null) => void;
      headerRef?: (grid: GridImperativeAPI | null) => void;
      leftRef?: (grid: GridImperativeAPI | null) => void;
      strictMode?: boolean;
    } = {}) {
      let latestParams: ScrollSyncChildProps | undefined;
      const onBodyScroll = vi.fn();
      const onHeaderScroll = vi.fn();

      const element: ReactNode = (
        <ScrollSync>
          {(params) => {
            latestParams = params;
            const { onScroll, registerChild } = params;
            return (
              <>
                <ChildComponent {...params} />
                <div data-testid="header">
                  <Grid
                    cellRenderer={cellRenderer}
                    columnCount={20}
                    columnWidth={COLUMN_WIDTH}
                    height={ROW_HEIGHT}
                    onScroll={(scrollParams) => {
                      onHeaderScroll(scrollParams);
                      onScroll(scrollParams);
                    }}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    ref={(grid: GridImperativeAPI | null) => {
                      headerRef?.(grid);
                      return registerChild("header")(grid);
                    }}
                    rowCount={1}
                    rowHeight={ROW_HEIGHT}
                    width={100}
                  />
                </div>
                <div data-testid="left">
                  <Grid
                    cellRenderer={cellRenderer}
                    columnCount={1}
                    columnWidth={COLUMN_WIDTH}
                    height={100}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    ref={(grid: GridImperativeAPI | null) => {
                      leftRef?.(grid);
                      return registerChild("left")(grid);
                    }}
                    rowCount={20}
                    rowHeight={ROW_HEIGHT}
                    width={COLUMN_WIDTH}
                  />
                </div>
                <div data-testid="body">
                  <Grid
                    cellRenderer={cellRenderer}
                    columnCount={20}
                    columnWidth={COLUMN_WIDTH}
                    height={100}
                    onScroll={(scrollParams) => {
                      onBodyScroll(scrollParams);
                      onScroll(scrollParams);
                    }}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    ref={(grid: GridImperativeAPI | null) => {
                      bodyRef?.(grid);
                      return registerChild("body")(grid);
                    }}
                    rowCount={20}
                    rowHeight={ROW_HEIGHT}
                    width={100}
                  />
                </div>
              </>
            );
          }}
        </ScrollSync>
      );

      render(
        <div>{strictMode ? <StrictMode>{element}</StrictMode> : element}</div>
      );

      return {
        getParams: () => latestParams!,
        onBodyScroll,
        onHeaderScroll
      };
    }

    it.each([false, true])(
      "should scroll the other registered children when a registered child scrolls (strict mode: %s)",
      (strictMode) => {
        let body: GridImperativeAPI | null = null;
        let header: GridImperativeAPI | null = null;
        const { onBodyScroll, onHeaderScroll } = renderSpreadsheet({
          bodyRef: (grid) => {
            body = grid;
          },
          headerRef: (grid) => {
            header = grid;
          },
          strictMode
        });

        expect(getCells("header")).toEqual(["0:0", "0:1"]);
        expect(getCells("left")).toEqual(["0:0", "1:0"]);

        const scrollToPosition = vi.spyOn(header!, "scrollToPosition");
        onBodyScroll.mockClear();
        onHeaderScroll.mockClear();

        // Simulate the user scrolling the body Grid
        act(() => {
          body!.handleScrollEvent({ scrollLeft: 100, scrollTop: 150 });
        });

        expect(getCells("body")).toEqual(["3:2", "3:3", "4:2", "4:3"]);
        expect(getCells("header")).toEqual(["0:2", "0:3"]);
        expect(getCells("left")).toEqual(["3:0", "4:0"]);

        expect(getTextContent()).toContain("scrollLeft:100");
        expect(getTextContent()).toContain("scrollTop:150");
        // Size values are those of the scrolled (body) Grid, not of the header's echo
        expect(getTextContent()).toContain("clientHeight:100");
        expect(getTextContent()).toContain("scrollHeight:1000");

        // No feedback loop: the header was synced once and its echo was not propagated back to the body
        expect(scrollToPosition).toHaveBeenCalledTimes(1);
        expect(scrollToPosition).toHaveBeenCalledWith({
          scrollLeft: 100,
          scrollTop: 150
        });
        expect(onBodyScroll).toHaveBeenCalledTimes(1);
        expect(onHeaderScroll).toHaveBeenCalledTimes(1);
      }
    );

    it("should only sync the axes that changed", () => {
      let body: GridImperativeAPI | null = null;
      let left: GridImperativeAPI | null = null;
      renderSpreadsheet({
        bodyRef: (grid) => {
          body = grid;
        },
        leftRef: (grid) => {
          left = grid;
        }
      });

      const scrollToPosition = vi.spyOn(left!, "scrollToPosition");

      act(() => {
        body!.handleScrollEvent({ scrollLeft: 0, scrollTop: 150 });
      });
      expect(scrollToPosition).toHaveBeenLastCalledWith({ scrollTop: 150 });

      act(() => {
        body!.handleScrollEvent({ scrollLeft: 100, scrollTop: 150 });
      });
      expect(scrollToPosition).toHaveBeenLastCalledWith({ scrollLeft: 100 });
      expect(scrollToPosition).toHaveBeenCalledTimes(2);
    });

    it("should not propagate an offset a synced child reports after clamping it", () => {
      let body: GridImperativeAPI | null = null;
      let header: GridImperativeAPI | null = null;
      const { getParams } = renderSpreadsheet({
        bodyRef: (grid) => {
          body = grid;
        },
        headerRef: (grid) => {
          header = grid;
        }
      });

      act(() => {
        body!.handleScrollEvent({ scrollLeft: 100, scrollTop: 150 });
      });

      const bodyScrollToPosition = vi.spyOn(body!, "scrollToPosition");

      // The header can't scroll vertically; the next time it handles a (horizontal) scroll event
      // it reports a scrollTop of 0, which must not scroll the body back to the top.
      act(() => {
        header!.handleScrollEvent({ scrollLeft: 100, scrollTop: 0 });
      });
      expect(bodyScrollToPosition).not.toHaveBeenCalled();
      expect(getParams().scrollTop).toBe(150);
      expect(getCells("body")).toEqual(["3:2", "3:3", "4:2", "4:3"]);

      // But horizontal scrolling of the header is still synced
      act(() => {
        header!.handleScrollEvent({ scrollLeft: 200, scrollTop: 0 });
      });
      expect(bodyScrollToPosition).toHaveBeenCalledWith({ scrollLeft: 200 });
      expect(getParams().scrollLeft).toBe(200);
      expect(getParams().scrollTop).toBe(150);
      expect(getCells("body")).toEqual(["3:4", "3:5", "4:4", "4:5"]);
    });

    it("should not loop when children echo synchronously", () => {
      const a = vi.fn();
      const b = vi.fn();
      let params: ScrollSyncChildProps | undefined;
      render(
        <ScrollSync>
          {(p) => {
            params = p;
            return (
              <>
                <MockChild
                  onScroll={p.onScroll}
                  ref={p.registerChild("a")}
                  scrollToPosition={a}
                />
                <MockChild
                  onScroll={p.onScroll}
                  ref={p.registerChild("b")}
                  scrollToPosition={b}
                />
              </>
            );
          }}
        </ScrollSync>
      );

      act(() => params!.onScroll(scrollParams({ scrollTop: 10 })));
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
      expect(a).toHaveBeenCalledWith({ scrollTop: 10 });
      expect(params!.scrollTop).toBe(10);
    });

    it("should stop syncing a registered child after it unmounts", () => {
      const a = vi.fn();
      const b = vi.fn();
      let params: ScrollSyncChildProps | undefined;
      const renderChildren = (showB: boolean) =>
        render(
          <ScrollSync>
            {(p) => {
              params = p;
              return (
                <>
                  <MockChild ref={p.registerChild("a")} scrollToPosition={a} />
                  {showB && (
                    <MockChild
                      ref={p.registerChild("b")}
                      scrollToPosition={b}
                    />
                  )}
                </>
              );
            }}
          </ScrollSync>
        );

      renderChildren(true);
      act(() => params!.onScroll(scrollParams({ scrollTop: 10 })));
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);

      renderChildren(false);
      act(() => params!.onScroll(scrollParams({ scrollTop: 20 })));
      expect(a).toHaveBeenCalledTimes(2);
      expect(b).toHaveBeenCalledTimes(1);
    });

    it("should sync a child registered under an existing key (or registered late) to the current offset", () => {
      const first = vi.fn();
      const second = vi.fn();
      let params: ScrollSyncChildProps | undefined;
      const renderChild = (scrollToPosition: typeof first) =>
        render(
          <ScrollSync>
            {(p) => {
              params = p;
              return (
                <MockChild
                  key={scrollToPosition === first ? "first" : "second"}
                  ref={p.registerChild("a")}
                  scrollToPosition={scrollToPosition}
                />
              );
            }}
          </ScrollSync>
        );

      renderChild(first);
      // No sync is needed when the offset is still 0
      expect(first).not.toHaveBeenCalled();

      act(() =>
        params!.onScroll(scrollParams({ scrollLeft: 5, scrollTop: 10 }))
      );
      expect(first).toHaveBeenCalledTimes(1);

      // Replace the child registered under key "a"
      renderChild(second);
      expect(second).toHaveBeenCalledTimes(1);
      expect(second).toHaveBeenCalledWith({ scrollLeft: 5, scrollTop: 10 });

      act(() =>
        params!.onScroll(scrollParams({ scrollLeft: 5, scrollTop: 20 }))
      );
      expect(first).toHaveBeenCalledTimes(1);
      expect(second).toHaveBeenCalledTimes(2);
      expect(second).toHaveBeenLastCalledWith({ scrollTop: 20 });
    });

    it("should keep registered children in StrictMode", () => {
      const a = vi.fn();
      let params: ScrollSyncChildProps | undefined;
      render(
        <StrictMode>
          <ScrollSync>
            {(p) => {
              params = p;
              return (
                <MockChild ref={p.registerChild("a")} scrollToPosition={a} />
              );
            }}
          </ScrollSync>
        </StrictMode>
      );

      act(() => params!.onScroll(scrollParams({ scrollTop: 10 })));
      expect(a).toHaveBeenCalledTimes(1);
      expect(a).toHaveBeenCalledWith({ scrollTop: 10 });
    });
  });
});
