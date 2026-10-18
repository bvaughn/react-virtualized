/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { CellSizeAndPositionManager } from "./CellSizeAndPositionManager";
import { updateScrollIndexHelper } from "./updateScrollIndexHelper";

// Default cell sizes and offsets for use in shared tests
export function getCellSizeAndPositionManager({
  cellCount = CELL_SIZES.length,
  estimatedCellSize = 10
}: {
  cellCount?: number;
  estimatedCellSize?: number;
}) {
  return new CellSizeAndPositionManager({
    cellCount,
    cellSizeGetter: ({ index }) => CELL_SIZES[index % CELL_SIZES.length],
    estimatedCellSize
  });
}

const CELL_SIZES = [
  10, // 0: 0..0 (min)
  20, // 1: 0..10
  15, // 2: 0..30
  10, // 3: 5..45
  15, // 4: 20..55
  30, // 5: 50..70
  20, // 6: 70..100
  10, // 7: 80..110
  30 //  8: 110..110 (max)
];

describe("updateScrollIndexHelper", () => {
  function helper({
    cellCount = undefined,
    cellSizeAndPositionManager,
    previousCellsCount = undefined,
    previousSize = 50,
    scrollOffset = 0,
    size = 50
  }: {
    cellCount?: number;
    cellSizeAndPositionManager?: any;
    previousCellsCount?: number;
    previousSize?: number;
    scrollOffset?: number;
    size?: number;
  } = {}) {
    cellSizeAndPositionManager =
      cellSizeAndPositionManager ||
      getCellSizeAndPositionManager({ cellCount });
    cellCount =
      cellCount === undefined
        ? cellSizeAndPositionManager.getCellCount()
        : cellCount;
    previousCellsCount =
      previousCellsCount === undefined ? cellCount : previousCellsCount;

    const indices: number[] = [];

    updateScrollIndexHelper({
      cellSizeAndPositionManager,
      previousCellsCount: previousCellsCount!,
      previousSize,
      scrollOffset,
      size,
      updateScrollIndexCallback: (index) => indices.push(index)
    });

    return indices;
  }

  it("should not call :updateScrollIndexCallback if neither :size nor :cellCount have changed", () => {
    expect(helper({ scrollOffset: 510 })).toEqual([]);
  });

  it("should call :updateScrollIndexCallback with the last index if :cellCount has been reduced past the current scroll offset", () => {
    expect(
      helper({
        previousCellsCount: 100,
        scrollOffset: 510
      })
    ).toEqual([CELL_SIZES.length - 1]);
  });

  it("should call :updateScrollIndexCallback with the last index if :size has been reduced past the current scroll offset", () => {
    expect(
      helper({
        previousSize: 100,
        scrollOffset: 510,
        size: 50
      })
    ).toEqual([CELL_SIZES.length - 1]);
  });

  it("should not call :updateScrollIndexCallback if :size has been reduced but the scroll offset is still within range", () => {
    expect(
      helper({
        previousSize: 100,
        scrollOffset: 0,
        size: 50
      })
    ).toEqual([]);
  });

  it("should not measure rows if :size or :cellCount have been reduced but only use already measured (or estimated) total size", () => {
    const cellSizeAndPositionManager = {
      getCellCount: () => CELL_SIZES.length,
      getTotalSize: () => 560
    };

    expect(
      helper({
        cellSizeAndPositionManager,
        previousSize: 100,
        scrollOffset: 510,
        size: 50
      })
    ).toEqual([]);
  });

  it("should not call :updateScrollIndexCallback if :cellCount has been increased", () => {
    expect(
      helper({
        cellCount: 100,
        previousCellsCount: 50,
        scrollOffset: 510
      })
    ).toEqual([]);
  });

  it("should not call :updateScrollIndexCallback if :size has been increased", () => {
    expect(
      helper({
        previousSize: 50,
        scrollOffset: 510,
        size: 100
      })
    ).toEqual([]);
  });
});
