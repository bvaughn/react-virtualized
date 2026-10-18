import {
  act,
  cloneElement,
  Component,
  createRef,
  forwardRef,
  StrictMode,
  useImperativeHandle
} from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../utils/test/render";
import { List } from "../List/List";
import type { ListImperativeAPI, RowRendererParams } from "../List/types";
import { defaultInfiniteLoaderProps } from "./defaultInfiniteLoaderProps";
import { InfiniteLoader } from "./InfiniteLoader";
import {
  forceUpdateReactVirtualizedComponent,
  isRangeVisible,
  scanForUnloadedRanges
} from "./utils";
import type {
  IndexRange,
  InfiniteLoaderChildInstance,
  InfiniteLoaderChildProps,
  InfiniteLoaderImperativeAPI
} from "./types";

type ScanParams = Parameters<typeof scanForUnloadedRanges>[0];

describe("InfiniteLoader", () => {
  let innerOnRowsRendered: InfiniteLoaderChildProps["onRowsRendered"];
  let isRowLoadedCalls: number[] = [];
  let isRowLoadedMap: Record<number, boolean> = {};
  let loadMoreRowsCalls: IndexRange[] = [];
  let rowRendererCalls: number[] = [];

  beforeEach(() => {
    isRowLoadedCalls = [];
    isRowLoadedMap = {};
    loadMoreRowsCalls = [];
    rowRendererCalls = [];
  });

  function defaultIsRowLoaded({ index }: { index: number }) {
    isRowLoadedCalls.push(index);
    return !!isRowLoadedMap[index];
  }

  function defaultLoadMoreRows({ startIndex, stopIndex }: IndexRange) {
    loadMoreRowsCalls.push({ startIndex, stopIndex });
  }

  function rowRenderer({ index, key, style }: RowRendererParams) {
    rowRendererCalls.push(index);
    return <div key={key} style={style} />;
  }

  // The rendered List (in addition to registering it with the InfiniteLoader)
  let list: ListImperativeAPI | null = null;
  const listRefs = new WeakMap<
    InfiniteLoaderChildProps["registerChild"],
    (instance: ListImperativeAPI | null) => void
  >();
  function getListRef(
    registerChild: InfiniteLoaderChildProps["registerChild"]
  ) {
    let ref = listRefs.get(registerChild);
    if (!ref) {
      ref = (instance: ListImperativeAPI | null) => {
        list = instance;
        registerChild(instance);
      };
      listRefs.set(registerChild, ref);
    }
    return ref;
  }

  function scrollToRow(index: number) {
    act(() => {
      list!.scrollToRow({ index });
    });
  }

  function getMarkup({
    height = 100,
    isRowLoaded = defaultIsRowLoaded,
    loadMoreRows = defaultLoadMoreRows,
    minimumBatchSize = 1,
    rowHeight = 20,
    rowCount = 100,
    threshold = 10,
    width = 200
  }: {
    height?: number;
    isRowLoaded?: (params: { index: number }) => boolean;
    loadMoreRows?: (params: IndexRange) => Promise<unknown> | void;
    minimumBatchSize?: number;
    rowHeight?: number;
    rowCount?: number;
    threshold?: number;
    width?: number;
  } = {}) {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        minimumBatchSize={minimumBatchSize}
        rowCount={rowCount}
        threshold={threshold}
      >
        {({ onRowsRendered, registerChild }) => {
          innerOnRowsRendered = onRowsRendered;

          return (
            <List
              ref={getListRef(registerChild)}
              height={height}
              onRowsRendered={onRowsRendered}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              width={width}
            />
          );
        }}
      </InfiniteLoader>
    );
  }

  it("should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered", () => {
    render(getMarkup());
    expect(isRowLoadedCalls).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
    ]);
  });

  it("should call :isRowLoaded for all rows within the rowCount each time a range of rows are rendered", () => {
    render(getMarkup({ rowCount: 10 }));
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("should call :loadMoreRows for unloaded rows within the threshold", () => {
    render(getMarkup());
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);
  });

  it("should call :loadMoreRows for unloaded rows within the rowCount", () => {
    render(getMarkup({ rowCount: 10 }));
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }]);
  });

  it("should :forceUpdate once rows have loaded if :loadMoreRows returns a Promise", async () => {
    let savedResolve: (value?: unknown) => void = () => {};
    function loadMoreRows() {
      return new Promise((resolve) => {
        savedResolve = resolve;
      });
    }
    render(getMarkup({ loadMoreRows }));
    rowRendererCalls.splice(0);
    await act(async () => {
      await savedResolve();
    });
    expect(rowRendererCalls.length > 0).toEqual(true);
  });

  it("should not :forceUpdate once rows have loaded rows are no longer visible", async () => {
    const resolves: Array<(value?: unknown) => void> = [];
    function loadMoreRows() {
      return new Promise((resolve) => {
        resolves.push(resolve);
      });
    }
    render(getMarkup({ loadMoreRows }));
    // Simulate a new range of rows being loaded
    innerOnRowsRendered({ startIndex: 100, stopIndex: 101 });
    rowRendererCalls.splice(0);
    await act(async () => {
      await resolves[0](); // Resolve the first request only, not the simulated row-change
    });
    expect(rowRendererCalls.length).toEqual(0);
  });

  describe("minimumBatchSize", () => {
    it("should respect the specified :minimumBatchSize when scrolling down", () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }]);
    });

    it("should respect the specified :minimumBatchSize when scrolling up", () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      scrollToRow(20);
      loadMoreRowsCalls.splice(0);
      render(
        getMarkup({
          isRowLoaded: ({ index }) => index >= 20,
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      scrollToRow(15);
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 10, stopIndex: 19 }]);
    });

    it("should not interfere with :threshold", () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 10
        })
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);
    });

    it("should respect the specified :minimumBatchSize if a user scrolls past the previous range", () => {
      const isRowLoadedIndices: Record<number, boolean> = {};

      function isRowLoaded({ index }: { index: number }) {
        if (!isRowLoadedIndices[index]) {
          isRowLoadedIndices[index] = true;

          return false;
        } else {
          return true;
        }
      }

      render(
        getMarkup({
          isRowLoaded,
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({ startIndex: 5, stopIndex: 10 });
      expect(loadMoreRowsCalls).toEqual([
        { startIndex: 0, stopIndex: 9 },
        { startIndex: 10, stopIndex: 19 }
      ]);
    });

    it("should not exceed ending boundaries if :minimumBatchSize is larger than needed", () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          rowCount: 25,
          threshold: 0
        })
      );
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({ startIndex: 18, stopIndex: 22 });
      expect(loadMoreRowsCalls).toEqual([
        { startIndex: 0, stopIndex: 9 },
        { startIndex: 15, stopIndex: 24 }
      ]);
    });

    it("should not exceed beginning boundaries if :minimumBatchSize is larger than needed", () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      scrollToRow(15);
      loadMoreRowsCalls.splice(0);
      render(
        getMarkup({
          isRowLoaded: ({ index }) => index >= 6,
          minimumBatchSize: 10,
          threshold: 0
        })
      );
      scrollToRow(2);
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 5 }]);
    });
  });

  // Verifies improved memoization; see bvaughn/react-virtualized/issues/345
  it("should memoize calls to :loadMoreRows (not calling unless unloaded ranges have changed)", () => {
    render(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 20,
        threshold: 0
      })
    );
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 20 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 20 }]);
  });

  it("resetLoadMoreRowsCache should reset memoized state", () => {
    const component = render<InfiniteLoaderImperativeAPI>(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 20,
        threshold: 0
      })
    );
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    loadMoreRowsCalls.splice(0);
    expect(loadMoreRowsCalls).toEqual([]);
    act(() => {
      component.resetLoadMoreRowsCache();
    });
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
  });

  it("resetLoadMoreRowsCache should call :loadMoreRows if :autoReload parameter is true", () => {
    const component = render<InfiniteLoaderImperativeAPI>(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 1,
        threshold: 0
      })
    );

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 10 });
    act(() => {
      component.resetLoadMoreRowsCache(true);
    });
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 0,
      stopIndex: 10
    });

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 20, stopIndex: 30 });
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30
    });

    loadMoreRowsCalls.splice(0);
    act(() => {
      component.resetLoadMoreRowsCache(true);
    });
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30
    });
  });

  it("should expose a stable imperative handle", () => {
    const first = render<InfiniteLoaderImperativeAPI>(getMarkup());
    const second = render<InfiniteLoaderImperativeAPI>(getMarkup());
    expect(typeof first.resetLoadMoreRowsCache).toBe("function");
    expect(second).toBe(first);
  });

  it("should pass stable :onRowsRendered and :registerChild functions to children", () => {
    const params: InfiniteLoaderChildProps[] = [];
    const children = (childProps: InfiniteLoaderChildProps) => {
      params.push(childProps);
      return null;
    };
    render(
      <InfiniteLoader isRowLoaded={() => true} loadMoreRows={() => {}}>
        {children}
      </InfiniteLoader>
    );
    render(
      <InfiniteLoader isRowLoaded={() => false} loadMoreRows={() => {}}>
        {children}
      </InfiniteLoader>
    );
    expect(params.length).toBe(2);
    expect(params[1].onRowsRendered).toBe(params[0].onRowsRendered);
    expect(params[1].registerChild).toBe(params[0].registerChild);
  });

  it("should use the default prop values", () => {
    expect(defaultInfiniteLoaderProps).toEqual({
      minimumBatchSize: 10,
      rowCount: 0,
      threshold: 15
    });
    expect(Object.isFrozen(defaultInfiniteLoaderProps)).toBe(true);

    let onRowsRendered: InfiniteLoaderChildProps["onRowsRendered"] = () => {};
    render(
      <InfiniteLoader
        isRowLoaded={defaultIsRowLoaded}
        loadMoreRows={defaultLoadMoreRows}
      >
        {(params) => {
          onRowsRendered = params.onRowsRendered;
          return null;
        }}
      </InfiniteLoader>
    );
    // rowCount defaults to 0, so there is nothing to load
    onRowsRendered({ startIndex: 0, stopIndex: 5 });
    expect(loadMoreRowsCalls).toEqual([]);

    render(
      <InfiniteLoader
        isRowLoaded={defaultIsRowLoaded}
        loadMoreRows={defaultLoadMoreRows}
        rowCount={100}
      >
        {(params) => {
          onRowsRendered = params.onRowsRendered;
          return null;
        }}
      </InfiniteLoader>
    );
    // threshold defaults to 15 (0 + 1 + 15 => 0-16) and minimumBatchSize to 10
    onRowsRendered({ startIndex: 0, stopIndex: 1 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 16 }]);
    loadMoreRowsCalls.splice(0);
    isRowLoadedMap = Object.fromEntries(
      Array.from({ length: 63 }, (_, index) => [index, true])
    );
    // threshold 15 => 35-65 is scanned; minimumBatchSize 10 => 63-72 is loaded
    onRowsRendered({ startIndex: 50, stopIndex: 50 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 63, stopIndex: 72 }]);
  });

  it("should use the latest props when the child calls :onRowsRendered during its commit", () => {
    render(getMarkup({ rowCount: 10 }));
    loadMoreRowsCalls.splice(0);
    // The child List re-renders with (and reports) the new rowCount;
    // InfiniteLoader must already see the new isRowLoaded/rowCount at that point.
    render(
      getMarkup({
        isRowLoaded: ({ index }) => index < 10,
        rowCount: 20
      })
    );
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 10, stopIndex: 14 }]);
  });

  it("should re-render a function component child via its imperative handle once rows have loaded", async () => {
    const recomputeGridSize = vi.fn();
    const FunctionChild = forwardRef<
      InfiniteLoaderChildInstance,
      { onRowsRendered: InfiniteLoaderChildProps["onRowsRendered"] }
    >(function FunctionChild({ onRowsRendered }, ref) {
      useImperativeHandle(ref, () => ({ recomputeGridSize }), []);
      onRowsRenderedFromChild = onRowsRendered;
      return <div />;
    });
    let onRowsRenderedFromChild: InfiniteLoaderChildProps["onRowsRendered"] =
      () => {};

    let savedResolve: (value?: unknown) => void = () => {};
    render(
      <InfiniteLoader
        isRowLoaded={() => false}
        loadMoreRows={() =>
          new Promise((resolve) => {
            savedResolve = resolve;
          })
        }
        rowCount={100}
      >
        {({ onRowsRendered, registerChild }) => (
          <FunctionChild onRowsRendered={onRowsRendered} ref={registerChild} />
        )}
      </InfiniteLoader>
    );
    act(() => {
      onRowsRenderedFromChild({ startIndex: 5, stopIndex: 10 });
    });
    await act(async () => {
      await savedResolve();
    });
    expect(recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(recomputeGridSize).toHaveBeenCalledWith({ rowIndex: 5 });
  });

  it("should not update the child if rows finish loading after unmount", async () => {
    const recomputeGridSize = vi.fn();
    let savedResolve: (value?: unknown) => void = () => {};
    let onRowsRendered: InfiniteLoaderChildProps["onRowsRendered"] = () => {};
    let registerChild: InfiniteLoaderChildProps["registerChild"] = () => {};
    render(
      <InfiniteLoader
        isRowLoaded={() => false}
        loadMoreRows={() =>
          new Promise((resolve) => {
            savedResolve = resolve;
          })
        }
        rowCount={100}
      >
        {(params) => {
          onRowsRendered = params.onRowsRendered;
          registerChild = params.registerChild;
          return <div ref={() => {}} />;
        }}
      </InfiniteLoader>
    );
    registerChild({ recomputeGridSize });
    onRowsRendered({ startIndex: 0, stopIndex: 10 });

    // Unmounting a child detaches its ref, which unregisters it
    registerChild(null);
    render.unmount();

    await act(async () => {
      await savedResolve();
    });
    expect(recomputeGridSize).not.toHaveBeenCalled();
  });

  it("should not update a List that is unmounted before rows finish loading", async () => {
    const consoleError = vi.spyOn(console, "error");
    let savedResolve: (value?: unknown) => void = () => {};
    render(
      getMarkup({
        loadMoreRows: () =>
          new Promise((resolve) => {
            savedResolve = resolve;
          })
      })
    );
    render.unmount();
    rowRendererCalls.splice(0);
    await act(async () => {
      await savedResolve();
    });
    expect(rowRendererCalls).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("should work in StrictMode", async () => {
    const consoleError = vi.spyOn(console, "error");
    const resolves: Array<(value?: unknown) => void> = [];
    function loadMoreRows(range: IndexRange) {
      loadMoreRowsCalls.push(range);
      return new Promise((resolve) => {
        resolves.push(resolve);
      });
    }
    const handleRef = createRef<InfiniteLoaderImperativeAPI>();
    render(
      <StrictMode>
        {cloneElement(getMarkup({ loadMoreRows }), { ref: handleRef })}
      </StrictMode>
    );
    const handle = handleRef.current!;
    // Memoization survives StrictMode's double render / effect re-run
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);

    rowRendererCalls.splice(0);
    await act(async () => {
      await resolves[0]();
    });
    expect(rowRendererCalls.length > 0).toEqual(true);

    loadMoreRowsCalls.splice(0);
    act(() => {
      innerOnRowsRendered({ startIndex: 0, stopIndex: 4 });
    });
    expect(loadMoreRowsCalls).toEqual([]);
    act(() => {
      handle.resetLoadMoreRowsCache(true);
    });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe("scanForUnloadedRanges", () => {
  function createIsRowLoaded(rows: boolean[]) {
    return ({ index }: { index: number }) => rows[index];
  }

  it("should return an empty array for a range of rows that have all been loaded", () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([true, true, true]),
        startIndex: 0,
        stopIndex: 2
      } as ScanParams)
    ).toEqual([]);
  });

  it("return a range of only 1 unloaded row", () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([true, false, true]),
        startIndex: 0,
        stopIndex: 2
      } as ScanParams)
    ).toEqual([{ startIndex: 1, stopIndex: 1 }]);
  });

  it("return a range of multiple unloaded rows", () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([false, false, true]),
        startIndex: 0,
        stopIndex: 2
      } as ScanParams)
    ).toEqual([{ startIndex: 0, stopIndex: 1 }]);
  });

  it("return multiple ranges of unloaded rows", () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([
          true,
          false,
          false,
          true,
          false,
          true,
          false
        ]),
        startIndex: 0,
        stopIndex: 6
      } as ScanParams)
    ).toEqual([
      { startIndex: 1, stopIndex: 2 },
      { startIndex: 4, stopIndex: 4 },
      { startIndex: 6, stopIndex: 6 }
    ]);
  });
});

describe("isRangeVisible", () => {
  it("first row(s) are visible", () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 20,
        stopIndex: 30
      })
    ).toEqual(true);
  });

  it("last row(s) are visible", () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 0,
        stopIndex: 10
      })
    ).toEqual(true);
  });

  it("all row(s) are visible", () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 12,
        stopIndex: 14
      })
    ).toEqual(true);
  });

  it("no row(s) are visible", () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 0,
        stopIndex: 9
      })
    ).toEqual(false);

    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 21,
        stopIndex: 30
      })
    ).toEqual(false);
  });
});

describe("forceUpdateReactVirtualizedComponent", () => {
  it("should call :recomputeGridSize if defined", () => {
    const recomputeGridSize = vi.fn();
    class TestComponent extends Component {
      recomputeGridSize = recomputeGridSize;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(
      render<TestComponent>(<TestComponent />),
      10
    );
    expect(recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(recomputeGridSize).toHaveBeenCalledWith({ rowIndex: 10 });
  });

  it("should only recompute List row heights from the specified index", () => {
    const rowHeightCalls: number[] = [];
    const list = render<ListImperativeAPI>(
      <List
        height={100}
        overscanRowCount={0}
        rowCount={100}
        rowHeight={({ index }) => {
          rowHeightCalls.push(index);
          return 20;
        }}
        rowRenderer={({ key, style }) => <div key={key} style={style} />}
        width={200}
      />
    );
    expect(rowHeightCalls).toContain(0);

    rowHeightCalls.splice(0);
    act(() => {
      forceUpdateReactVirtualizedComponent(list, 3);
    });
    expect(rowHeightCalls.length).toBeGreaterThan(0);
    expect(Math.min(...rowHeightCalls)).toBe(3);
  });

  it("should called :recomputeRowHeights if defined", () => {
    const recomputeRowHeights = vi.fn();
    class TestComponent extends Component {
      recomputeRowHeights = recomputeRowHeights;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(
      render<TestComponent>(<TestComponent />),
      10
    );
    expect(recomputeRowHeights).toHaveBeenCalledTimes(1);
    expect(recomputeRowHeights).toHaveBeenCalledWith(10);
  });

  it("should call :forceUpdateGrid if neither recompute method is defined", () => {
    const forceUpdateGrid = vi.fn();
    const forceUpdate = vi.fn();
    forceUpdateReactVirtualizedComponent({ forceUpdate, forceUpdateGrid }, 10);
    expect(forceUpdateGrid).toHaveBeenCalledTimes(1);
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it("should call :forceUpdate otherwise", () => {
    const forceUpdate = vi.fn();
    class TestComponent extends Component {
      forceUpdate = forceUpdate;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(
      render<TestComponent>(<TestComponent />),
      10
    );
    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });

  it("should prefer the methods in order: recomputeGridSize, recomputeRowHeights, forceUpdateGrid, forceUpdate", () => {
    const child = {
      forceUpdate: vi.fn(),
      forceUpdateGrid: vi.fn(),
      recomputeGridSize: vi.fn(),
      recomputeRowHeights: vi.fn()
    };
    forceUpdateReactVirtualizedComponent(child, 3);
    expect(child.recomputeGridSize).toHaveBeenCalledWith({ rowIndex: 3 });
    expect(child.recomputeRowHeights).not.toHaveBeenCalled();
    expect(child.forceUpdateGrid).not.toHaveBeenCalled();
    expect(child.forceUpdate).not.toHaveBeenCalled();

    const { recomputeRowHeights, forceUpdateGrid, forceUpdate } = child;
    forceUpdateReactVirtualizedComponent(
      { forceUpdate, forceUpdateGrid, recomputeRowHeights },
      3
    );
    expect(recomputeRowHeights).toHaveBeenCalledWith(3);
    expect(forceUpdateGrid).not.toHaveBeenCalled();
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it("should default the index to 0", () => {
    const recomputeGridSize = vi.fn();
    forceUpdateReactVirtualizedComponent({ recomputeGridSize });
    expect(recomputeGridSize).toHaveBeenCalledWith({ rowIndex: 0 });
  });

  it("should warn (in DEV) if the child implements none of the methods", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    forceUpdateReactVirtualizedComponent({}, 0);
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    consoleWarn.mockRestore();
  });
});
