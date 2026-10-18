import { act, StrictMode, useRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getObserverCount,
  mockResizeObserver
} from "../test/mockResizeObserver";
import { render } from "../test/render";
import {
  createScrollContainer,
  mockWindowScrolling
} from "../test/scrollElement";
import type {
  ScrollElement,
  ScrollElementLinkSource,
  ScrollElementLinkTarget,
  ScrollElementViewport
} from "./types";
import {
  resolveScrollElement,
  useScrollElementLink
} from "./useScrollElementLink";

type Recorder = {
  link: ReturnType<typeof vi.fn<ScrollElementLinkTarget["link"]>>;
  setViewport: ReturnType<typeof vi.fn<ScrollElementLinkTarget["setViewport"]>>;
  source: ScrollElementLinkSource | null;
  viewport: ScrollElementViewport | null;
};

function createRecorder(): Recorder {
  const recorder: Recorder = {
    link: vi.fn((source, viewport) => {
      recorder.source = source;
      recorder.viewport = source !== null ? viewport : null;
    }),
    setViewport: vi.fn((viewport) => {
      recorder.viewport = viewport;
    }),
    source: null,
    viewport: null
  };
  return recorder;
}

// A minimal link target: a 1000px high element
function Target({
  recorder,
  scrollElement,
  scrollingResetTimeInterval = 10
}: {
  recorder: Recorder;
  scrollElement: ScrollElement | null | undefined;
  scrollingResetTimeInterval?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [target] = useState<ScrollElementLinkTarget>(() => ({
    getElement: () => elementRef.current,
    link: (source, viewport) => recorder.link(source, viewport),
    setViewport: (viewport) => recorder.setViewport(viewport)
  }));
  useScrollElementLink(scrollElement, target, scrollingResetTimeInterval);
  return <div ref={elementRef} style={{ height: 1000 }} />;
}

function wait(ms: number) {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

describe("useScrollElementLink", () => {
  let unmockResizeObserver: () => void;
  beforeEach(() => {
    unmockResizeObserver = mockResizeObserver();
  });
  afterEach(() => {
    render.unmount();
    unmockResizeObserver();
  });

  it("should resolve the scrollElement prop", () => {
    const element = document.createElement("div");
    expect(resolveScrollElement("window")).toBe(window);
    expect(resolveScrollElement(element)).toBe(element);
    expect(resolveScrollElement(null)).toBe(null);
    expect(resolveScrollElement(undefined)).toBe(null);
  });

  it("should link the target to the measured viewport when mounted", () => {
    const recorder = createRecorder();
    const container = createScrollContainer({
      contentOffset: 100,
      height: 300
    });
    container.element.scrollTop = 250;
    render(<Target recorder={recorder} scrollElement={container.element} />);

    expect(recorder.link).toHaveBeenCalledTimes(1);
    expect(recorder.source).not.toBe(null);
    expect(recorder.viewport).toEqual({
      height: 300,
      isScrolling: false,
      scrollTop: 150
    });
  });

  it("should not link the target without a scroll element", () => {
    const recorder = createRecorder();
    render(<Target recorder={recorder} scrollElement={null} />);
    render(<Target recorder={recorder} scrollElement={undefined} />);
    expect(recorder.link).not.toHaveBeenCalled();
    expect(recorder.setViewport).not.toHaveBeenCalled();
  });

  it("should update the viewport (isScrolling) when the scroll element scrolls, and reset isScrolling afterwards", async () => {
    const recorder = createRecorder();
    const container = createScrollContainer({ contentOffset: 100 });
    render(<Target recorder={recorder} scrollElement={container.element} />);
    expect(recorder.viewport).toEqual({
      height: 100,
      isScrolling: false,
      scrollTop: -100
    });

    container.scroll(300);
    expect(recorder.viewport).toEqual({
      height: 100,
      isScrolling: true,
      scrollTop: 200
    });

    await wait(50);
    expect(recorder.viewport).toEqual({
      height: 100,
      isScrolling: false,
      scrollTop: 200
    });
  });

  it("should use the latest scrollingResetTimeInterval", async () => {
    const recorder = createRecorder();
    const container = createScrollContainer();
    render(
      <Target
        recorder={recorder}
        scrollElement={container.element}
        scrollingResetTimeInterval={10}
      />
    );
    render(
      <Target
        recorder={recorder}
        scrollElement={container.element}
        scrollingResetTimeInterval={300}
      />
    );

    container.scroll(100);
    await wait(100);
    expect(recorder.viewport!.isScrolling).toBe(true);

    await wait(400);
    expect(recorder.viewport!.isScrolling).toBe(false);
  });

  it("should not update the viewport unless it changed", () => {
    const recorder = createRecorder();
    const container = createScrollContainer();
    render(<Target recorder={recorder} scrollElement={container.element} />);
    container.scroll(100);
    recorder.setViewport.mockClear();

    // Re-rendering re-measures the position, which hasn't changed
    render(<Target recorder={recorder} scrollElement={container.element} />);
    expect(recorder.setViewport).not.toHaveBeenCalled();
  });

  it("should re-measure when the scroll element is resized", () => {
    const recorder = createRecorder();
    const container = createScrollContainer({ contentOffset: 100 });
    container.element.scrollTop = 200;
    render(<Target recorder={recorder} scrollElement={container.element} />);
    expect(getObserverCount(container.element)).toBe(1);

    container.setContentOffset(50);
    container.resize({ height: 400 });
    expect(recorder.viewport).toEqual({
      height: 400,
      isScrolling: false,
      scrollTop: 150
    });
  });

  it("should re-measure the position after every commit", () => {
    const recorder = createRecorder();
    const container = createScrollContainer({ contentOffset: 100 });
    container.element.scrollTop = 200;
    render(<Target recorder={recorder} scrollElement={container.element} />);

    container.setContentOffset(150);
    render(
      <Target
        recorder={recorder}
        scrollElement={container.element}
        scrollingResetTimeInterval={20}
      />
    );
    expect(recorder.viewport!.scrollTop).toEqual(50);
  });

  it("should re-measure when the window is resized", () => {
    const recorder = createRecorder();
    const windowScrolling = mockWindowScrolling({ innerHeight: 500 });
    render(<Target recorder={recorder} scrollElement="window" />);
    expect(recorder.viewport).toEqual({
      height: 500,
      isScrolling: false,
      scrollTop: 0
    });

    windowScrolling.resize({ height: 800 });
    expect(recorder.viewport!.height).toEqual(800);

    // The position is measured again as well (e.g. content above the target reflowed)
    const contentAbove = document.createElement("div");
    contentAbove.style.height = "100px";
    document.body.prepend(contentAbove);
    windowScrolling.resize({ height: 600 });
    expect(recorder.viewport).toEqual({
      height: 600,
      isScrolling: false,
      scrollTop: -100
    });
    contentAbove.remove();
  });

  it("should link to an already scrolled window (measuring the position relative to the scrolled document)", () => {
    const recorder = createRecorder();
    mockWindowScrolling({ scrollY: 400 });
    const contentAbove = document.createElement("div");
    contentAbove.style.height = "100px";
    document.body.prepend(contentAbove);

    render(<Target recorder={recorder} scrollElement="window" />);
    expect(recorder.viewport!.scrollTop).toEqual(300);
    contentAbove.remove();
  });

  it("should unlink the target and stop listening when unmounted", () => {
    const recorder = createRecorder();
    const container = createScrollContainer();
    const removeEventListener = vi.spyOn(
      container.element,
      "removeEventListener"
    );
    render(<Target recorder={recorder} scrollElement={container.element} />);

    render.unmount();
    expect(recorder.link).toHaveBeenLastCalledWith(null, expect.anything());
    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(getObserverCount(container.element)).toBe(0);

    recorder.setViewport.mockClear();
    container.scroll(100);
    expect(recorder.setViewport).not.toHaveBeenCalled();
  });

  it("should re-link the target when the scroll element changes", () => {
    const recorder = createRecorder();
    const containerA = createScrollContainer();
    const containerB = createScrollContainer({ adopt: false, height: 200 });
    containerB.element.scrollTop = 300;
    render(<Target recorder={recorder} scrollElement={containerA.element} />);

    containerB.adopt();
    render(<Target recorder={recorder} scrollElement={containerB.element} />);
    expect(recorder.link.mock.calls.map(([source]) => source !== null)).toEqual(
      [true, false, true]
    );
    expect(recorder.viewport).toEqual({
      height: 200,
      isScrolling: false,
      scrollTop: 300
    });
    expect(getObserverCount(containerA.element)).toBe(0);
    expect(getObserverCount(containerB.element)).toBe(1);

    recorder.setViewport.mockClear();
    containerA.scroll(100);
    expect(recorder.setViewport).not.toHaveBeenCalled();
  });

  it("should work in StrictMode", () => {
    const recorder = createRecorder();
    const container = createScrollContainer();
    const addEventListener = vi.spyOn(container.element, "addEventListener");
    const removeEventListener = vi.spyOn(
      container.element,
      "removeEventListener"
    );
    render(
      <StrictMode>
        <Target recorder={recorder} scrollElement={container.element} />
      </StrictMode>
    );
    expect(recorder.source).not.toBe(null);
    expect(
      addEventListener.mock.calls.filter(([type]) => type === "scroll").length -
        removeEventListener.mock.calls.filter(([type]) => type === "scroll")
          .length
    ).toBe(1);
    expect(getObserverCount(container.element)).toBe(1);

    container.scroll(100);
    expect(recorder.viewport!.scrollTop).toEqual(100);
  });

  describe("link source (scrollTo)", () => {
    it("should scroll the scroll element to the offset relative to the target, preserving the horizontal scroll position (#18)", () => {
      const recorder = createRecorder();
      const container = createScrollContainer({ contentOffset: 100 });
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(<Target recorder={recorder} scrollElement={container.element} />);
      container.scroll(0, 40);

      let scrolled = false;
      act(() => {
        scrolled = recorder.source!.scrollTo(200);
      });
      expect(scrolled).toBe(true);
      expect(scrollTo).toHaveBeenLastCalledWith(40, 300);
      expect(recorder.viewport!.scrollTop).toEqual(200);
    });

    it("should scroll the window, preserving its horizontal scroll position (#18)", () => {
      const recorder = createRecorder();
      const windowScrolling = mockWindowScrolling();
      const scrollTo = vi.spyOn(window, "scrollTo");
      render(<Target recorder={recorder} scrollElement="window" />);
      windowScrolling.scroll(0, 300);

      act(() => {
        recorder.source!.scrollTo(200);
      });
      expect(scrollTo).toHaveBeenLastCalledWith(300, 200);
      expect(window.scrollY).toEqual(200);
    });

    it("should set scrollTop on a scroll element without scrollTo()", () => {
      const recorder = createRecorder();
      const container = createScrollContainer({ contentOffset: 100 });
      (container.element as unknown as { scrollTo: unknown }).scrollTo =
        undefined;
      render(<Target recorder={recorder} scrollElement={container.element} />);

      act(() => {
        recorder.source!.scrollTo(200);
      });
      expect(container.element.scrollTop).toEqual(300);
    });

    it("should not scroll if the scroll element is already scrolled to the offset", () => {
      const recorder = createRecorder();
      const container = createScrollContainer({ contentOffset: 100 });
      container.element.scrollTop = 300;
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(<Target recorder={recorder} scrollElement={container.element} />);

      let scrolled = true;
      act(() => {
        scrolled = recorder.source!.scrollTo(200);
      });
      expect(scrolled).toBe(false);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("should measure the position of the target again before scrolling", () => {
      const recorder = createRecorder();
      const container = createScrollContainer({ contentOffset: 100 });
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(<Target recorder={recorder} scrollElement={container.element} />);

      container.setContentOffset(250);
      act(() => {
        recorder.source!.scrollTo(200);
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 450);
    });
  });
});
