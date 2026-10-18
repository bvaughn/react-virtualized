import {
  act,
  Component,
  createRef,
  forwardRef,
  StrictMode,
  type ReactNode,
  type Ref
} from "react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { render } from "../../utils/test/render";
import { CellMeasurer } from "./CellMeasurer";
import {
  CellMeasurerCache,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH
} from "./CellMeasurerCache";
import type {
  CellMeasurerChildFunction,
  CellMeasurerChildParams,
  CellMeasurerProps
} from "./types";

// Accounts for the fact that JSDom doesn't support measurements.
function mockClientWidthAndHeight(
  { height, width }: { height: number; width: number },
  object: object = HTMLElement.prototype
) {
  const heightFn = vi.fn().mockReturnValue(height);
  const widthFn = vi.fn().mockReturnValue(width);

  Object.defineProperty(object, "offsetHeight", {
    configurable: true,
    get: heightFn
  });

  Object.defineProperty(object, "offsetWidth", {
    configurable: true,
    get: widthFn
  });

  return {
    heightFn,
    widthFn
  };
}

// Elements report the size specified by their data-height and data-width attributes
function mockSizesFromDataAttributes() {
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return Number(this.getAttribute("data-height") ?? 0);
    }
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return Number(this.getAttribute("data-width") ?? 0);
    }
  });
}

function createParent({
  cache,
  invalidateCellSizeAfterRender = vi.fn(),
  recomputeGridSize = vi.fn()
}: {
  cache?: CellMeasurerCache;
  invalidateCellSizeAfterRender?: Mock;
  recomputeGridSize?: Mock;
} = {}) {
  return {
    invalidateCellSizeAfterRender,
    recomputeGridSize,
    props: {
      deferredMeasurementCache: cache
    }
  };
}

function renderHelper({
  cache = new CellMeasurerCache({
    fixedWidth: true
  }),
  children = <div />,
  parent,
  strictMode = false
}: {
  cache?: CellMeasurerCache;
  children?: ReactNode | CellMeasurerChildFunction;
  parent?: ReturnType<typeof createParent>;
  strictMode?: boolean;
} = {}) {
  const measurer = (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      parent={parent as CellMeasurerProps["parent"]}
      rowIndex={0}
    >
      {children}
    </CellMeasurer>
  );

  render(strictMode ? <StrictMode>{measurer}</StrictMode> : measurer);
}

// Captures the params passed to a function child
function createChildFunction(renderChild: CellMeasurerChildFunction) {
  const calls: CellMeasurerChildParams[] = [];
  const children: CellMeasurerChildFunction = (params) => {
    calls.push(params);
    return renderChild(params);
  };
  return { calls, children };
}

describe("CellMeasurer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should measure content that is not already in the cache on mount", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    const { heightFn, widthFn } = mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
    expect(cache.has(0, 0)).toBe(false);

    renderHelper({ cache, parent });

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it("should not measure content that is already in the cache on mount", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    cache.set(0, 0, 100, 20);

    const parent = createParent({ cache });

    const { heightFn, widthFn } = mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    expect(cache.has(0, 0)).toBe(true);

    renderHelper({ cache, parent });

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });

  it("should measure content that is not already in the cache on update", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    renderHelper({ cache, parent });

    cache.clear(0, 0);
    parent.invalidateCellSizeAfterRender.mockReset();

    expect(cache.has(0, 0)).toBe(false);
    expect(cache.getWidth(0, 0)).toBe(DEFAULT_WIDTH);
    expect(cache.getHeight(0, 0)).toBe(DEFAULT_HEIGHT);

    const { heightFn, widthFn } = mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    // A new child element (as a cell renderer would create) re-renders the memoized CellMeasurer
    renderHelper({ cache, children: <div />, parent });

    expect(cache.has(0, 0)).toBe(true);

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it("should not measure content that is already in the cache on update", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    cache.set(0, 0, 100, 20);

    const parent = createParent({ cache });

    expect(cache.has(0, 0)).toBe(true);

    const { heightFn, widthFn } = mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    renderHelper({ cache, parent });
    renderHelper({ cache, children: <div />, parent });

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });

  it("registerChild() should measure content that is not already in the cache", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    const element = document.createElement("div");
    const { heightFn, widthFn } = mockClientWidthAndHeight(
      {
        height: 20,
        width: 100
      },
      element
    );

    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
    expect(cache.has(0, 0)).toBe(false);

    renderHelper({
      cache,
      parent,
      children({ registerChild }) {
        registerChild(element);
        return null;
      }
    });

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it("registerChild() should not measure content that is already in the cache", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });
    cache.set(0, 0, 100, 20);

    const parent = createParent({ cache });

    const element = document.createElement("div");
    const { heightFn, widthFn } = mockClientWidthAndHeight(
      {
        height: 20,
        width: 100
      },
      element
    );

    expect(cache.has(0, 0)).toBe(true);

    renderHelper({
      cache,
      parent,
      children({ registerChild }) {
        registerChild(element);
        return null;
      }
    });

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });

  it("registerChild() should be usable as a ref", () => {
    mockSizesFromDataAttributes();

    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    renderHelper({
      cache,
      parent,
      children: ({ registerChild }) => (
        <div ref={registerChild} data-height={25} data-width={100} />
      )
    });

    expect(cache.getHeight(0, 0)).toBe(25);
    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalledTimes(1);
  });

  it("should pass a :measure param to a function child", () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true
    });

    const children = vi.fn().mockReturnValue(<div />);

    renderHelper({ cache, children });

    expect(children).toHaveBeenCalled();

    const params = children.mock.calls[0][0];

    expect(typeof params.measure === "function").toBe(true);
  });

  it("should pass stable :measure and :registerChild params to a function child", () => {
    const cache = new CellMeasurerCache({ fixedWidth: true });

    const { calls, children } = createChildFunction(() => <div />);

    renderHelper({ cache, children });
    renderHelper({ cache, children: (params) => children(params) });

    expect(calls).toHaveLength(2);
    expect(calls[0].measure).toBe(calls[1].measure);
    expect(calls[0].registerChild).toBe(calls[1].registerChild);
  });

  it("measure() should re-measure the cell and recompute the parent's size if it changed", () => {
    mockSizesFromDataAttributes();

    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    let height = 20;
    const { calls, children } = createChildFunction(() => (
      <div data-height={height} data-width={100} />
    ));
    renderHelper({ cache, children, parent });

    expect(cache.getHeight(0, 0)).toBe(20);

    // Unchanged size
    act(() => calls[0].measure());
    expect(parent.recomputeGridSize).not.toHaveBeenCalled();

    // Changed size
    height = 40;
    renderHelper({ cache, children: (params) => children(params), parent });
    act(() => calls[0].measure());
    expect(cache.getHeight(0, 0)).toBe(40);
    expect(parent.recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(parent.recomputeGridSize).toHaveBeenCalledWith({
      columnIndex: 0,
      rowIndex: 0
    });
  });

  it("should use :index as the row index if :rowIndex is not specified", () => {
    mockSizesFromDataAttributes();

    const cache = new CellMeasurerCache({ fixedWidth: true });

    render(
      <CellMeasurer cache={cache} index={3} parent={createParent()}>
        <div data-height={45} />
      </CellMeasurer>
    );

    expect(cache.has(3, 0)).toBe(true);
    expect(cache.getHeight(3, 0)).toBe(45);
  });

  it("should still update cache without a parent Grid", () => {
    vi.spyOn(console, "warn");

    mockClientWidthAndHeight({ height: 20, width: 100 });

    const cache = new CellMeasurerCache({
      fixedWidth: true
    });

    renderHelper({ cache }); // No parent Grid

    expect(cache.has(0, 0)).toBe(true);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should measure under StrictMode", () => {
    mockSizesFromDataAttributes();
    vi.spyOn(console, "error");
    vi.spyOn(console, "warn");

    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    const { calls, children } = createChildFunction(() => (
      <div data-height={20} data-width={100} />
    ));
    renderHelper({ cache, children, parent, strictMode: true });

    expect(cache.getHeight(0, 0)).toBe(20);
    // Measured once; the second (StrictMode) effect run finds the cell in the cache
    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalledTimes(1);

    // StrictMode double-invokes the render function, but the params are stable
    expect(calls.length).toBeGreaterThan(1);
    expect(new Set(calls.map((call) => call.measure)).size).toBe(1);
    expect(new Set(calls.map((call) => call.registerChild)).size).toBe(1);

    // The ref is re-attached after StrictMode's simulated unmount, so measure() still works
    act(() => calls[0].measure());
    expect(parent.recomputeGridSize).not.toHaveBeenCalled();

    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  // See issue #593
  it('should explicitly set width/height style to "auto" before re-measuring', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true
    });
    const parent = createParent({ cache });
    const child = vi
      .fn()
      .mockReturnValue(<div style={{ width: 100, height: 30 }} />);

    render(
      <CellMeasurer cache={cache} columnIndex={0} parent={parent} rowIndex={0}>
        {child}
      </CellMeasurer>
    );

    const node = document.querySelector("div div") as HTMLElement;

    const styleHeights: unknown[] = [30];
    const styleWidths: unknown[] = [100];
    Object.defineProperties(node.style, {
      height: {
        get: () => styleHeights[styleHeights.length - 1],
        set: (value: unknown) => styleHeights.push(value)
      },
      width: {
        get: () => styleWidths[styleWidths.length - 1],
        set: (value: unknown) => styleWidths.push(value)
      }
    });

    mockClientWidthAndHeight({ height: 30, width: 100 });

    act(() => child.mock.calls[0][0].measure());

    expect(styleHeights).toEqual([30, "auto", 30]);
    expect(styleWidths).toEqual([100, 100]);
  });

  // See issue #660
  it('should reset width/height style values after measuring with style "auto"', () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true
    });
    const parent = createParent({ cache });
    const child = vi
      .fn()
      .mockReturnValue(<div style={{ width: 100, height: 30 }} />);

    render(
      <CellMeasurer cache={cache} columnIndex={0} parent={parent} rowIndex={0}>
        {child}
      </CellMeasurer>
    );

    const node = document.querySelector("div div") as HTMLElement;

    (node.style as unknown as Record<string, unknown>).width = 200;
    (node.style as unknown as Record<string, unknown>).height = 60;

    act(() => child.mock.calls[0][0].measure());

    expect(node.style.height).toBe("30px");
    expect(node.style.width).toBe("100px");
  });

  it("should be flagged for Grid's missing style warning", () => {
    expect(CellMeasurer.__internalCellMeasurerFlag).toBe(true);
  });

  // Bug #1
  describe("function component children", () => {
    it("should measure a function component that passes its ref prop to a DOM element (React 19)", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "error");

      function Row({ ref }: { ref?: Ref<HTMLDivElement> }) {
        return <div ref={ref} data-height={50} data-width={100} />;
      }

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({ cache, children: <Row /> });

      expect(cache.getHeight(0, 0)).toBe(50);
      expect(console.error).not.toHaveBeenCalled();
    });

    it("should measure a forwardRef function component", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "error");

      const Row = forwardRef<HTMLDivElement>(function Row(_, ref) {
        return <div ref={ref} data-height={50} data-width={100} />;
      });

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({ cache, children: <Row /> });

      expect(cache.getHeight(0, 0)).toBe(50);
      expect(console.error).not.toHaveBeenCalled();
    });

    it("should warn (and not cache 0x0) for a function component that doesn't attach its ref", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "warn").mockImplementation(() => {});

      function Row() {
        return <div data-height={50} data-width={100} />;
      }

      const cache = new CellMeasurerCache({ fixedWidth: true });
      const parent = createParent({ cache });
      renderHelper({ cache, children: <Row />, parent });

      expect(cache.has(0, 0)).toBe(false);
      expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("registerChild")
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("forwardRef")
      );

      // Warns once per cache
      renderHelper({ cache, children: <Row />, parent });
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("should measure a function component that uses registerChild", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "warn");

      function Row({
        registerChild
      }: {
        registerChild: CellMeasurerChildParams["registerChild"];
      }) {
        return <div ref={registerChild} data-height={50} data-width={100} />;
      }

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({
        cache,
        children: ({ registerChild }) => <Row registerChild={registerChild} />
      });

      expect(cache.getHeight(0, 0)).toBe(50);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  // Bug #2
  describe("registerChild precedence", () => {
    it("should measure the registered element rather than the outer element", () => {
      mockSizesFromDataAttributes();

      const cache = new CellMeasurerCache({ fixedWidth: true });
      const parent = createParent({ cache });

      const { calls, children } = createChildFunction(({ registerChild }) => (
        <div data-height={99} data-width={100}>
          <div ref={registerChild} data-height={30} data-width={100} />
        </div>
      ));
      renderHelper({ cache, children, parent });

      expect(cache.getHeight(0, 0)).toBe(30);

      // Later measurements also use the registered element
      act(() => calls[0].measure());
      expect(cache.getHeight(0, 0)).toBe(30);
      expect(parent.recomputeGridSize).not.toHaveBeenCalled();

      // Even after re-rendering
      cache.clear(0, 0);
      renderHelper({ cache, children: (params) => children(params), parent });
      expect(cache.getHeight(0, 0)).toBe(30);
      act(() => calls[0].measure());
      expect(cache.getHeight(0, 0)).toBe(30);
    });

    it("should measure the registered element when the child is a class component", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "warn");

      class Wrapper extends Component<{
        registerChild: CellMeasurerChildParams["registerChild"];
      }> {
        render() {
          return (
            <div
              ref={this.props.registerChild}
              data-height={30}
              data-width={100}
            />
          );
        }
      }

      const cache = new CellMeasurerCache({ fixedWidth: true });
      const parent = createParent({ cache });

      const { calls, children } = createChildFunction(({ registerChild }) => (
        <Wrapper registerChild={registerChild} />
      ));
      renderHelper({ cache, children, parent });

      expect(cache.getHeight(0, 0)).toBe(30);

      act(() => calls[0].measure());
      expect(cache.getHeight(0, 0)).toBe(30);
      expect(parent.recomputeGridSize).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  // Bug #3
  describe("children that are not a single element", () => {
    it.each([
      ["undefined", undefined, ""],
      ["false", false, ""],
      ["a string", "text", "text"],
      ["a number", 123, "123"],
      ["an array", [<span key="a">a</span>, <span key="b">b</span>], "ab"],
      [
        "a fragment",
        <>
          <span>a</span>
          <span>b</span>
        </>,
        "ab"
      ]
    ])(
      "should render %s returned by a function child as-is and warn",
      (_, value, textContent) => {
        vi.spyOn(console, "error");
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const cache = new CellMeasurerCache({ fixedWidth: true });
        const parent = createParent({ cache });

        const { calls, children } = createChildFunction(
          () => value as ReactNode
        );
        renderHelper({ cache, children, parent });

        expect(document.body.textContent).toBe(textContent);
        expect(cache.has(0, 0)).toBe(false);
        expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining("could not find a DOM element to measure")
        );

        // measure() doesn't throw or write to the cache either
        act(() => calls[0].measure());
        expect(cache.has(0, 0)).toBe(false);
        expect(parent.recomputeGridSize).not.toHaveBeenCalled();
      }
    );

    it("should render a string child as-is", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderHelper({ children: "text" });

      expect(document.body.textContent).toBe("text");
    });

    it("should measure an element nested in a fragment with registerChild (without warning)", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "error");
      vi.spyOn(console, "warn");

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({
        cache,
        children: ({ registerChild }) => (
          <>
            <div ref={registerChild} data-height={30} data-width={100} />
          </>
        )
      });

      expect(cache.getHeight(0, 0)).toBe(30);
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  // Bug #17
  it("should not write to the cache when measure() is called after unmounting", () => {
    mockSizesFromDataAttributes();

    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    const { calls, children } = createChildFunction(() => (
      <div data-height={20} data-width={100} />
    ));
    renderHelper({ cache, children, parent });

    expect(cache.getHeight(0, 0)).toBe(20);

    render.unmount();

    act(() => calls[0].measure());

    expect(cache.getHeight(0, 0)).toBe(20);
    expect(parent.recomputeGridSize).not.toHaveBeenCalled();
  });

  it("should not write to the cache when measure() is called after the registered element unmounted", () => {
    mockSizesFromDataAttributes();

    const element = document.createElement("div");
    element.setAttribute("data-height", "20");

    const cache = new CellMeasurerCache({ fixedWidth: true });
    const parent = createParent({ cache });

    const { calls, children } = createChildFunction(({ registerChild }) => {
      registerChild(element);
      return null;
    });
    renderHelper({ cache, children, parent });
    expect(cache.getHeight(0, 0)).toBe(20);

    render.unmount();
    act(() => calls[0].measure());

    expect(cache.getHeight(0, 0)).toBe(20);
    expect(parent.recomputeGridSize).not.toHaveBeenCalled();
  });

  // Bug #31
  describe("child refs", () => {
    it("should forward the element to the child's own object ref (without logging an error)", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "error");

      const ref = createRef<HTMLDivElement>();

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({
        cache,
        children: <div ref={ref} data-height={20} data-width={100} />
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(cache.getHeight(0, 0)).toBe(20);

      render.unmount();
      expect(ref.current).toBeNull();

      expect(console.error).not.toHaveBeenCalled();
    });

    it("should forward the element to the child's own callback ref (without logging an error)", () => {
      mockSizesFromDataAttributes();
      vi.spyOn(console, "error");

      const ref = vi.fn();

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({
        cache,
        children: <div ref={ref} data-height={20} data-width={100} />
      });

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
      expect(cache.getHeight(0, 0)).toBe(20);

      render.unmount();
      expect(ref).toHaveBeenCalledTimes(2);
      expect(ref.mock.calls[1][0]).toBeNull();

      expect(console.error).not.toHaveBeenCalled();
    });

    it("should call the cleanup function returned by the child's callback ref", () => {
      const cleanup = vi.fn();
      const ref = vi.fn(() => cleanup);

      renderHelper({ children: <div ref={ref} /> });

      expect(ref).toHaveBeenCalledTimes(1);
      expect(cleanup).not.toHaveBeenCalled();

      render.unmount();

      expect(ref).toHaveBeenCalledTimes(1);
      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("should forward the element to a forwardRef child's ref", () => {
      mockSizesFromDataAttributes();

      const Row = forwardRef<HTMLDivElement>(function Row(_, ref) {
        return <div ref={ref} data-height={50} data-width={100} />;
      });
      const ref = createRef<HTMLDivElement>();

      const cache = new CellMeasurerCache({ fixedWidth: true });
      renderHelper({ cache, children: <Row ref={ref} /> });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(cache.getHeight(0, 0)).toBe(50);
    });
  });
});
