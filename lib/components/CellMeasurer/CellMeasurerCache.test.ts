/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from "vitest";
import {
  CellMeasurerCache,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH
} from "./CellMeasurerCache";
import type { CellMeasurerCacheParams } from "./types";

// The derived sizes computed without the #1747 optimization: every measured cell of the column (or row) is checked on every update
class ReferenceCellMeasurerCache extends CellMeasurerCache {
  override _updateCachedColumnAndRowSizes(
    rowIndex: number,
    columnIndex: number
  ) {
    if (!this._hasFixedWidth) {
      const key = this._keyMapper(0, columnIndex);
      delete this._columnWidthCache[key];
      for (let i = 0; i < this._rowCount; i++) {
        if (this.has(i, columnIndex)) {
          this._columnWidthCache[key] = Math.max(
            this._columnWidthCache[key] ?? 0,
            this.getWidth(i, columnIndex)
          );
        }
      }
    }
    if (!this._hasFixedHeight) {
      const key = this._keyMapper(rowIndex, 0);
      delete this._rowHeightCache[key];
      for (let i = 0; i < this._columnCount; i++) {
        if (this.has(rowIndex, i)) {
          this._rowHeightCache[key] = Math.max(
            this._rowHeightCache[key] ?? 0,
            this.getHeight(rowIndex, i)
          );
        }
      }
    }
  }
}

// Deterministic pseudo-random numbers (so failures are reproducible)
function createRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe("CellMeasurerCache", () => {
  it("should override defaultHeight/defaultWidth if minHeight/minWidth are greater", () => {
    const cache = new CellMeasurerCache({
      defaultHeight: 20,
      defaultWidth: 100,
      fixedHeight: true,
      fixedWidth: true,
      minHeight: 30,
      minWidth: 150
    });
    cache.set(0, 0, 50, 10);
    expect(cache.getHeight(0, 0)).toBe(30);
    expect(cache.getWidth(0, 0)).toBe(150);
    expect(cache.rowHeight({ index: 0 })).toBe(30);
    expect(cache.columnWidth({ index: 0 })).toBe(150);
  });

  it("should correctly report cache status", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.has(0, 0)).toBe(false);
  });

  it("should cache cells", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
  });

  it("should return the correct default sizes for uncached cells if specified", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {}); // Ignore warning about variable width and height

    const cache = new CellMeasurerCache({
      defaultHeight: 20,
      defaultWidth: 100,
      minHeight: 15,
      minWidth: 80
    });
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
    cache.set(0, 0, 70, 10);
    expect(cache.getWidth(0, 0)).toBe(80);
    expect(cache.getHeight(0, 0)).toBe(15);
  });

  it("should clear a single cached cell", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.has(1, 0)).toBe(true);
    cache.clear(0, 0);
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(true);
  });

  it("should clear a single cached row cell in column 0 when columnIndex param is absent", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.has(1, 0)).toBe(true);
    cache.clear(0);
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(true);
  });

  it("should clear all cached cells", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.has(1, 0)).toBe(true);
    cache.clearAll();
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(false);
  });

  it("should clear row and column counts when clearing all cells", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache._rowCount).toBe(2);
    expect(cache._columnCount).toBe(1);
    cache.clearAll();
    expect(cache._rowCount).toBe(0);
    expect(cache._columnCount).toBe(0);
  });

  it("should support a custom :keyMapper", () => {
    const keyMapper = vi.fn();
    keyMapper.mockReturnValue("a");

    vi.spyOn(console, "warn").mockImplementation(() => {}); // Ignore warning about variable width and height

    const cache = new CellMeasurerCache({
      defaultHeight: 30,
      defaultWidth: 50,
      keyMapper
    });
    cache.set(0, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);

    // Changing the returned key should cause cache misses
    keyMapper.mockReset();
    keyMapper.mockReturnValue("b");
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.columnWidth(0 as any)).toBe(50);
    expect(cache.rowHeight(0 as any)).toBe(30);
    expect(keyMapper.mock.calls).toHaveLength(3);

    // Restoring it should fix
    keyMapper.mockReset();
    keyMapper.mockReturnValue("a");
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.columnWidth(0 as any)).toBe(100);
    expect(cache.rowHeight(0 as any)).toBe(20);
    expect(keyMapper.mock.calls).toHaveLength(3);
  });

  it("should provide a Grid-compatible :columnWidth method", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true
    });
    expect(cache.columnWidth({ index: 0 })).toBe(DEFAULT_WIDTH);
    cache.set(0, 0, 100, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(100);
    expect(cache.columnWidth({ index: 1 })).toBe(DEFAULT_WIDTH);
    cache.set(1, 0, 75, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(100);
    cache.set(2, 0, 125, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(125);
  });

  it("should provide a Grid-compatible :rowHeight method", () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true
    });
    expect(cache.rowHeight({ index: 0 })).toBe(DEFAULT_HEIGHT);
    cache.set(0, 0, 100, 50);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    expect(cache.rowHeight({ index: 1 })).toBe(DEFAULT_HEIGHT);
    cache.set(0, 1, 100, 25);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    cache.set(0, 2, 100, 75);
    expect(cache.rowHeight({ index: 0 })).toBe(75);
  });

  it("should return the :defaultWidth for :columnWidth if not measured", () => {
    const cache = new CellMeasurerCache({
      defaultWidth: 25,
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.columnWidth({ index: 0 })).toBe(25);
  });

  it("should return the :defaultHeight for :rowHeight if not measured", () => {
    const cache = new CellMeasurerCache({
      defaultHeight: 25,
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.rowHeight({ index: 0 })).toBe(25);
  });

  it("should recalculate cached :columnWidth when cells are cleared", () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true
    });
    expect(cache.columnWidth({ index: 0 })).toBe(DEFAULT_WIDTH);
    cache.set(0, 0, 125, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(125);
    cache.set(1, 0, 150, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(150);
    cache.clear(1, 0);
    expect(cache.columnWidth({ index: 0 })).toBe(125);
    cache.clear(0, 0);
    expect(cache.columnWidth({ index: 0 })).toBe(DEFAULT_WIDTH);
    cache.set(0, 0, 125, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(125);
    cache.clearAll();
    expect(cache.columnWidth({ index: 0 })).toBe(DEFAULT_WIDTH);
  });

  it("should recalculate cached :rowHeight when cells are cleared", () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true
    });
    expect(cache.rowHeight({ index: 0 })).toBe(DEFAULT_HEIGHT);
    cache.set(0, 0, 125, 50);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    cache.set(0, 1, 150, 75);
    expect(cache.rowHeight({ index: 0 })).toBe(75);
    cache.clear(0, 1);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    cache.clear(0, 0);
    expect(cache.rowHeight({ index: 0 })).toBe(DEFAULT_HEIGHT);
    cache.set(0, 0, 125, 50);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    cache.clearAll();
    expect(cache.rowHeight({ index: 0 })).toBe(DEFAULT_HEIGHT);
  });

  describe("DEV mode", () => {
    it("should warn about dynamic width and height configurations", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const cache = new CellMeasurerCache({
        fixedHeight: false,
        fixedWidth: false
      });

      expect(cache.hasFixedHeight()).toBe(false);
      expect(cache.hasFixedWidth()).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "CellMeasurerCache should only measure a cell's width or height. " +
          "You have configured CellMeasurerCache to measure both. " +
          "This will result in poor performance."
      );
    });

    it("should warn about dynamic width with a defaultWidth of 0", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const cache = new CellMeasurerCache({
        defaultWidth: 0,
        fixedHeight: true
      });

      expect(cache.getWidth(0, 0)).toBe(0);
      expect(console.warn).toHaveBeenCalledWith(
        "Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. " +
          "Failing to do so will lead to unnecessary layout and poor performance."
      );
    });

    it("should warn about dynamic height with a defaultHeight of 0", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const cache = new CellMeasurerCache({
        defaultHeight: 0,
        fixedWidth: true
      });

      expect(cache.getHeight(0, 0)).toBe(0);
      expect(console.warn).toHaveBeenCalledWith(
        "Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. " +
          "Failing to do so will lead to unnecessary layout and poor performance."
      );
    });
  });

  // #1747
  describe("derived column widths and row heights", () => {
    const configurations: [string, CellMeasurerCacheParams][] = [
      ["default", {}],
      ["minimum sizes", { minHeight: 15, minWidth: 25 }],
      ["fixed width", { fixedWidth: true }],
      ["fixed height", { fixedHeight: true }],
      // Measured sizes are smaller than the default sizes (which unmeasured cells shouldn't contribute)
      ["large defaults", { defaultHeight: 200, defaultWidth: 300 }],
      [
        "row key mapper",
        { fixedWidth: true, keyMapper: (rowIndex) => `id-${rowIndex % 37}` }
      ]
    ];

    configurations.forEach(([name, params]) => {
      it.each([1, 2, 3])(
        `should match the full recomputation (${name}, seed %i)`,
        (seed) => {
          const random = createRandom(name.length * 7919 + seed);
          const cache = new CellMeasurerCache({
            defaultHeight: 20,
            defaultWidth: 40,
            ...params
          });
          const reference = new ReferenceCellMeasurerCache({
            defaultHeight: 20,
            defaultWidth: 40,
            ...params
          });
          const size = (max: number) => Math.floor(random() * max);

          for (let step = 0; step < 800; step++) {
            const rowIndex = size(60);
            const columnIndex = size(12);
            const operation = random();
            if (operation < 0.8) {
              // Sizes both grow and shrink (a re-measured cell may get smaller)
              const width = 5 + size(100);
              const height = 5 + size(60);
              cache.set(rowIndex, columnIndex, width, height);
              reference.set(rowIndex, columnIndex, width, height);
            } else if (operation < 0.98) {
              cache.clear(rowIndex, columnIndex);
              reference.clear(rowIndex, columnIndex);
            } else {
              cache.clearAll();
              reference.clearAll();
            }

            for (let index = 0; index < 60; index++) {
              expect(cache.rowHeight({ index })).toEqual(
                reference.rowHeight({ index })
              );
            }
            for (let index = 0; index < 12; index++) {
              expect(cache.columnWidth({ index })).toEqual(
                reference.columnWidth({ index })
              );
            }
          }
        }
      );
    });

    it("should not check every cell of a column when a cell is measured", () => {
      const cache = new CellMeasurerCache({
        defaultHeight: 20,
        defaultWidth: 40
      });
      // Measure the last row of a 100,000-row grid first (e.g. after scrolling to the bottom)
      cache.set(99_999, 0, 50, 20);
      const getWidth = vi.spyOn(cache, "getWidth");
      for (let rowIndex = 99_990; rowIndex < 99_999; rowIndex++) {
        cache.set(rowIndex, 0, 60, 20);
      }
      // A few calls per measured cell (previously 100,000 per cell)
      expect(getWidth.mock.calls.length).toBeLessThan(100);
      expect(cache.columnWidth({ index: 0 })).toEqual(60);
    });

    it("should not check every cell of a column when cells smaller than the default size are measured", () => {
      const cache = new CellMeasurerCache({
        defaultHeight: 20,
        defaultWidth: 100
      });
      cache.set(99_999, 0, 50, 20);
      const getWidth = vi.spyOn(cache, "getWidth");
      for (let rowIndex = 99_990; rowIndex < 99_999; rowIndex++) {
        cache.set(rowIndex, 0, 60, 20);
      }
      expect(getWidth.mock.calls.length).toBeLessThan(100);
      expect(cache.columnWidth({ index: 0 })).toEqual(60);
    });

    it("should not use the default size as a minimum when other cells of the column (or row) haven't been measured", () => {
      const cache = new CellMeasurerCache({
        defaultHeight: 50,
        defaultWidth: 100
      });
      expect(cache.columnWidth({ index: 2 })).toEqual(100);
      expect(cache.rowHeight({ index: 5 })).toEqual(50);

      // e.g. a Grid first rendered scrolled down and to the right
      cache.set(5, 2, 60, 20);
      cache.set(6, 2, 40, 30);
      expect(cache.columnWidth({ index: 2 })).toEqual(60);
      expect(cache.rowHeight({ index: 5 })).toEqual(20);
      expect(cache.rowHeight({ index: 6 })).toEqual(30);

      // The default size is used again once none of the cells are measured
      cache.clear(5, 2);
      expect(cache.columnWidth({ index: 2 })).toEqual(40);
      expect(cache.rowHeight({ index: 5 })).toEqual(50);
      cache.clear(6, 2);
      expect(cache.columnWidth({ index: 2 })).toEqual(100);
    });
  });
});
