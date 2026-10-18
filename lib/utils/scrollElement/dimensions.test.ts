import { afterEach, describe, expect, it } from "vitest";
import { mockWindowScrolling } from "../test/scrollElement";
import {
  getDimensions,
  getPositionOffset,
  getScrollOffset
} from "./dimensions";

function mockRect(element: Element, rect: DOMRect) {
  element.getBoundingClientRect = () => rect;
}

describe("dimensions", () => {
  afterEach(() => {
    // Remove the per-instance mocks
    delete (document.documentElement as { getBoundingClientRect?: unknown })
      .getBoundingClientRect;
  });

  describe("getDimensions", () => {
    it("should return the inner size of the window", () => {
      mockWindowScrolling({ innerHeight: 300, innerWidth: 400 });
      expect(getDimensions(window)).toEqual({ height: 300, width: 400 });
    });

    it("should return the size of an element (reading the DOMRect fields explicitly) (#27)", () => {
      const element = document.createElement("div");
      // Real DOMRect fields are prototype getters (which can't be copied by spreading)
      mockRect(element, new DOMRect(10, 20, 200, 100));
      expect(getDimensions(element)).toEqual({ height: 100, width: 200 });
    });
  });

  describe("getPositionOffset", () => {
    it("should return the position of an element within a scroll container, including its scroll offset", () => {
      const container = document.createElement("div");
      container.scrollTop = 100;
      container.scrollLeft = 150;
      mockRect(container, new DOMRect(250, 200, 400, 300));
      const element = document.createElement("div");
      mockRect(element, new DOMRect(350, 300, 100, 100));

      expect(getPositionOffset(element, container)).toEqual({
        top: 300 + 100 - 200,
        left: 350 + 150 - 250
      });
    });

    it("should return negative values for an element that has been scrolled past", () => {
      const container = document.createElement("div");
      container.scrollTop = 500;
      mockRect(container, new DOMRect(0, 0, 400, 300));
      const element = document.createElement("div");
      // 200px into the content, scrolled 500px
      mockRect(element, new DOMRect(0, -300, 100, 100));

      expect(getPositionOffset(element, container).top).toEqual(200);
    });

    it("should return the position of an element within the document", () => {
      mockRect(document.documentElement, new DOMRect(0, 0, 500, 5000));
      const element = document.createElement("div");
      mockRect(element, new DOMRect(50, 100, 100, 100));

      expect(getPositionOffset(element, window)).toEqual({
        top: 100,
        left: 50
      });
    });

    // Edge-case reported in bvaughn/react-virtualized/pull/346 (e.g. navigating back to an already scrolled page)
    it("should account for an already scrolled document element", () => {
      mockRect(document.documentElement, new DOMRect(-100, -100, 500, 5000));
      const element = document.createElement("div");
      mockRect(element, new DOMRect(50, 100, 100, 100));

      expect(getPositionOffset(element, window)).toEqual({
        top: 100 + 100,
        left: 50 + 100
      });
    });
  });

  describe("getScrollOffset", () => {
    it("should return the scroll offsets of the window", () => {
      const windowScrolling = mockWindowScrolling();
      windowScrolling.scroll(300, 50);
      expect(getScrollOffset(window)).toEqual({ top: 300, left: 50 });
    });

    it("should return the scroll offsets of an element", () => {
      const element = document.createElement("div");
      element.scrollTop = 120;
      element.scrollLeft = 30;
      expect(getScrollOffset(element)).toEqual({ top: 120, left: 30 });
    });
  });
});
