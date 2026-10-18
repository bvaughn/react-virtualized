import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { List } from "../../components/List/List";
import type { RenderedRows } from "../../components/List/types";
import { mockWindowScrolling } from "../test/scrollElement";

describe("scrollElement (hydration)", () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  afterEach(() => {
    if (root !== null) {
      const currentRoot = root;
      act(() => currentRoot.unmount());
      root = null;
    }
    container?.remove();
    container = null;
    vi.restoreAllMocks();
  });

  function getMarkup(onRowsRendered?: (params: RenderedRows) => void) {
    return (
      <List
        height={100}
        onRowsRendered={onRowsRendered}
        overscanIndicesGetter={({ startIndex, stopIndex }) => ({
          overscanStartIndex: startIndex,
          overscanStopIndex: stopIndex
        })}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={20}
        rowRenderer={({ index, key, style }) => (
          <div className="row" key={key} style={style}>
            {`Row ${index}`}
          </div>
        )}
        scrollElement="window"
        width={200}
      />
    );
  }

  function hydrate(onRowsRendered: (params: RenderedRows) => void) {
    container = document.createElement("div");
    container.innerHTML = renderToString(getMarkup());
    document.body.appendChild(container);
    expect(container.textContent).toContain("Row 4");
    expect(container.textContent).not.toContain("Row 5");

    const hydrationContainer = container;
    act(() => {
      root = hydrateRoot(hydrationContainer, getMarkup(onRowsRendered));
    });
    return hydrationContainer;
  }

  it("should hydrate the server-rendered markup without errors, and then link to the window", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const windowScrolling = mockWindowScrolling({ innerHeight: 200 });
    let rendered: RenderedRows | null = null;

    const element = hydrate((params) => (rendered = params));
    expect(console.error).not.toHaveBeenCalled();

    // The viewport height is measured after hydration
    expect(rendered).toMatchObject({ startIndex: 0, stopIndex: 9 });
    expect(
      element.querySelector<HTMLElement>(".ReactVirtualized__List")!.style
        .height
    ).toBe("auto");

    windowScrolling.scroll(1000);
    expect(rendered).toMatchObject({ startIndex: 50, stopIndex: 59 });
    expect(element.textContent).toContain("Row 50");
  });

  it("should render the visible rows of an already scrolled window after hydration", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockWindowScrolling({ innerHeight: 100, scrollY: 2000 });
    let rendered: RenderedRows | null = null;

    const element = hydrate((params) => (rendered = params));
    expect(console.error).not.toHaveBeenCalled();
    expect(rendered).toMatchObject({ startIndex: 100, stopIndex: 104 });
    expect(element.textContent).toContain("Row 100");
  });
});
