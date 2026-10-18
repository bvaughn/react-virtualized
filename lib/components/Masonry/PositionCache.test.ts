import { describe, expect, it } from "vitest";
import { PositionCache } from "./PositionCache";

describe("PositionCache", () => {
  describe("shortestColumnSize", () => {
    it("should return 0 if no positions have been set", () => {
      const positionCache = new PositionCache();
      expect(positionCache.shortestColumnSize).toBe(0);
    });

    it("should return the height of the shortest column", () => {
      const positionCache = new PositionCache();
      positionCache.setPosition(0, 0, 0, 300);
      positionCache.setPosition(1, 100, 0, 200);
      positionCache.setPosition(2, 200, 0, 500);
      expect(positionCache.shortestColumnSize).toBe(200);
    });

    it("should not treat a column with a height of 0 as unset", () => {
      const positionCache = new PositionCache();
      positionCache.setPosition(0, 0, 0, 300);
      positionCache.setPosition(1, 100, 0, 0);
      positionCache.setPosition(2, 200, 0, 500);
      expect(positionCache.shortestColumnSize).toBe(0);
    });
  });

  describe("estimateTotalHeight", () => {
    it("should add the estimated height of unmeasured cells to the tallest column", () => {
      const positionCache = new PositionCache();
      positionCache.setPosition(0, 0, 0, 300);
      positionCache.setPosition(1, 100, 0, 200);
      // 4 unmeasured cells in 2 columns of 50px each
      expect(positionCache.estimateTotalHeight(6, 2, 50)).toBe(400);
    });

    it("should only count the cells that remain after cellCount shrinks", () => {
      const positionCache = new PositionCache();
      positionCache.setPosition(0, 0, 0, 300);
      positionCache.setPosition(1, 100, 0, 200);
      positionCache.setPosition(2, 100, 200, 500);
      positionCache.setPosition(3, 0, 300, 100);
      expect(positionCache.estimateTotalHeight(4, 2, 50)).toBe(700);
      expect(positionCache.estimateTotalHeight(2, 2, 50)).toBe(300);
      expect(positionCache.estimateTotalHeight(0, 2, 50)).toBe(0);
    });
  });
});
