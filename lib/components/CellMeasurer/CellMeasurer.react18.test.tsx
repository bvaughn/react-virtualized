import { forwardRef, memo, type Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "../../utils/test/render";
import { CellMeasurer } from "./CellMeasurer";
import { CellMeasurerCache } from "./CellMeasurerCache";

// Simulates React 18 (where refs are not passed to function components as props)
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, default: actual, version: "18.3.1" };
});

function mockSizesFromDataAttributes() {
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return Number(this.getAttribute("data-height") ?? 0);
    }
  });
}

describe("CellMeasurer (React 18)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not attach a ref to a plain function component (and warn that it can't be measured)", () => {
    mockSizesFromDataAttributes();
    vi.spyOn(console, "error");
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const Row = vi.fn(function Row(props: { ref?: Ref<HTMLDivElement> }) {
      return <div ref={props.ref} data-height={50} />;
    });
    const MemoRow = memo(function MemoRow() {
      return <div data-height={50} />;
    });

    const cache = new CellMeasurerCache({ fixedWidth: true });
    render(
      <CellMeasurer cache={cache} parent={{}} rowIndex={0}>
        <Row />
      </CellMeasurer>
    );
    render(
      <CellMeasurer cache={cache} parent={{}} rowIndex={1}>
        <MemoRow />
      </CellMeasurer>
    );

    // The ref is not passed along (React 18 would log an error and ignore it)
    expect(Row.mock.calls[0][0].ref).toBeUndefined();
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(false);
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("forwardRef")
    );
  });

  it("should measure a forwardRef function component", () => {
    mockSizesFromDataAttributes();
    vi.spyOn(console, "warn");

    const Row = forwardRef<HTMLDivElement>(function Row(_, ref) {
      return <div ref={ref} data-height={50} />;
    });

    const cache = new CellMeasurerCache({ fixedWidth: true });
    render(
      <CellMeasurer cache={cache} parent={{}} rowIndex={0}>
        <Row />
      </CellMeasurer>
    );

    expect(cache.getHeight(0, 0)).toBe(50);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should measure a DOM element child", () => {
    mockSizesFromDataAttributes();

    const cache = new CellMeasurerCache({ fixedWidth: true });
    render(
      <CellMeasurer cache={cache} parent={{}} rowIndex={0}>
        <div data-height={20} />
      </CellMeasurer>
    );

    expect(cache.getHeight(0, 0)).toBe(20);
  });
});
