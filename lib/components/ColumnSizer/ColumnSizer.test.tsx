import { StrictMode, useCallback, type Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "../../utils/test/render";
import { Grid } from "../Grid/Grid";
import type { CellRendererParams } from "../Grid/types";
import { ColumnSizer } from "./ColumnSizer";
import type { ColumnSizerChildProps, ColumnSizerProps } from "./types";

describe("ColumnSizer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function getMarkup({
    columnMinWidth = undefined,
    columnMaxWidth = undefined,
    columnCount = 10,
    width = 200
  }: {
    columnMinWidth?: number;
    columnMaxWidth?: number;
    columnCount?: number;
    width?: number;
  } = {}) {
    function cellRenderer({
      columnIndex,
      key,
      rowIndex,
      style
    }: CellRendererParams) {
      return (
        <div className="gridItem" key={key} style={style}>
          {`row:${rowIndex}, column:${columnIndex}`}
        </div>
      );
    }

    return (
      <ColumnSizer
        columnMinWidth={columnMinWidth}
        columnMaxWidth={columnMaxWidth}
        columnCount={columnCount}
        width={width}
      >
        {({ adjustedWidth, columnWidth, registerChild }) => (
          <div>
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={50}
              ref={registerChild}
              cellRenderer={cellRenderer}
              rowHeight={50}
              rowCount={1}
              width={adjustedWidth}
            />
            <div className="debug">
              {`adjustedWidth:${adjustedWidth} columnWidth:${columnWidth}`}
            </div>
          </div>
        )}
      </ColumnSizer>
    );
  }

  // ColumnSizer has no imperative handle, so the value returned by render() is ignored
  // and the rendered output is queried from the DOM instead.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getDebugText(_: unknown) {
    return document.querySelector(".debug")!.textContent;
  }

  it("should distribute column widths evenly if no min/max boundaries have been set", () => {
    expect(getDebugText(render(getMarkup()))).toContain("columnWidth:20");
  });

  it("should respect :columnMaxWidth if specified", () => {
    expect(
      getDebugText(
        render(
          getMarkup({
            columnMaxWidth: 10
          })
        )
      )
    ).toContain("columnWidth:10");
  });

  it("should respect :columnMinWidth if specified", () => {
    expect(
      getDebugText(
        render(
          getMarkup({
            columnMinWidth: 30
          })
        )
      )
    ).toContain("columnWidth:30");
  });

  describe("recomputeGridSize", () => {
    function helper(
      updatedProps: Parameters<typeof getMarkup>[0],
      expectedTextContent: string
    ) {
      expect(getDebugText(render(getMarkup()))).toContain("columnWidth:20");

      expect(getDebugText(render(getMarkup(updatedProps)))).toContain(
        expectedTextContent
      );
    }

    it("should recompute metadata sizes if :columnMinWidth changes", () => {
      helper({ columnMinWidth: 30 }, "columnWidth:30");
    });

    it("should recompute metadata sizes if :columnMaxWidth changes", () => {
      helper({ columnMaxWidth: 15 }, "columnWidth:15");
    });

    it("should recompute metadata sizes if :width changes", () => {
      helper({ width: 300 }, "columnWidth:30");
    });

    it("should recompute metadata sizes if :columnCount changes", () => {
      helper({ columnCount: 2 }, "columnWidth:100");
    });
  });

  it("should pass the :width as :adjustedWidth if columns require more than the :width to be displayed", () => {
    expect(
      getDebugText(
        render(
          getMarkup({
            columnMinWidth: 30
          })
        )
      )
    ).toContain("adjustedWidth:200");
  });

  it("should pass an :adjustedWidth if columns require less than the :width to be displayed", () => {
    expect(
      getDebugText(
        render(
          getMarkup({
            columnMaxWidth: 10
          })
        )
      )
    ).toContain("adjustedWidth:100");
  });

  it("should error if the registered child is not a Grid or a MultiGrid", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        <ColumnSizer
          columnMinWidth={100}
          columnMaxWidth={100}
          columnCount={100}
          width={100}
        >
          {({ registerChild }) => (
            <div ref={registerChild as unknown as Ref<HTMLDivElement>} />
          )}
        </ColumnSizer>
      );
    }).toThrow();
  });

  describe("registered child", () => {
    function createChild() {
      return { recomputeGridSize: vi.fn() };
    }

    function renderWithChild(
      child: ReturnType<typeof createChild>,
      props: Partial<Omit<ColumnSizerProps, "children">> = {},
      onRender?: (params: ColumnSizerChildProps) => void,
      strict = false
    ) {
      const markup = (
        <ColumnSizer columnCount={10} width={200} {...props}>
          {(params) => {
            onRender?.(params);
            return (
              <Registrar child={child} registerChild={params.registerChild} />
            );
          }}
        </ColumnSizer>
      );
      render(strict ? <StrictMode>{markup}</StrictMode> : markup);
    }

    function Registrar({
      child,
      registerChild
    }: {
      child: ReturnType<typeof createChild>;
      registerChild: ColumnSizerChildProps["registerChild"];
    }) {
      const ref = useCallback(
        (element: HTMLDivElement | null) => {
          registerChild(element ? child : null);
        },
        [child, registerChild]
      );
      return <div ref={ref} />;
    }

    it("should call recomputeGridSize when the child is registered", () => {
      const child = createChild();
      renderWithChild(child);
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(1);
    });

    it("should call recomputeGridSize only when sizing props change", () => {
      const child = createChild();
      renderWithChild(child);
      child.recomputeGridSize.mockClear();

      renderWithChild(child, { width: 300 });
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(1);

      renderWithChild(child, { width: 300, columnCount: 5 });
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(2);

      renderWithChild(child, {
        width: 300,
        columnCount: 5,
        columnMinWidth: 10
      });
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(3);

      renderWithChild(child, {
        width: 300,
        columnCount: 5,
        columnMinWidth: 10,
        columnMaxWidth: 50
      });
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(4);
    });

    it("should pass a stable registerChild function", () => {
      const child = createChild();
      const registerChildren = new Set<unknown>();
      const onRender = (params: ColumnSizerChildProps) => {
        registerChildren.add(params.registerChild);
      };

      renderWithChild(child, {}, onRender);
      renderWithChild(child, { width: 300 }, onRender);
      expect(registerChildren.size).toBe(1);
    });

    it("should pass a deprecated getColumnWidth function", () => {
      const child = createChild();
      let getColumnWidth: (() => number) | undefined;
      renderWithChild(child, {}, (params) => {
        getColumnWidth = params.getColumnWidth;
      });
      expect(getColumnWidth!()).toBe(20);
    });

    it("should work in StrictMode", () => {
      const child = createChild();
      renderWithChild(child, {}, undefined, true);

      // StrictMode (re-)attaches refs on mount, so the child may be registered more than once
      expect(child.recomputeGridSize).toHaveBeenCalled();
      child.recomputeGridSize.mockClear();

      // Re-rendering with the same props should not recompute
      renderWithChild(child, { columnCount: 10 }, undefined, true);
      expect(child.recomputeGridSize).not.toHaveBeenCalled();

      renderWithChild(child, { width: 300 }, undefined, true);
      expect(child.recomputeGridSize).toHaveBeenCalledTimes(1);
    });

    it("should work with a Grid in StrictMode", () => {
      render(<StrictMode>{getMarkup()}</StrictMode>);
      expect(getDebugText(null)).toContain("columnWidth:20");

      render(<StrictMode>{getMarkup({ width: 300 })}</StrictMode>);
      expect(getDebugText(null)).toContain("columnWidth:30");
      expect(document.querySelectorAll(".gridItem")).toHaveLength(10);
    });
  });
});
