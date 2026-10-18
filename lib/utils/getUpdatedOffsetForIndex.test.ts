import { describe, expect, it } from "vitest";
import { getUpdatedOffsetForIndex } from "./getUpdatedOffsetForIndex";
import { getCellMetadata } from "./TestHelper";

describe("getUpdatedOffsetForIndex", () => {
  function testHelper(
    targetIndex: number,
    currentOffset: number,
    cellMetadata = getCellMetadata()
  ) {
    return getUpdatedOffsetForIndex({
      cellOffset: cellMetadata[targetIndex].offset,
      cellSize: cellMetadata[targetIndex].size,
      containerSize: 50,
      currentOffset
    });
  }

  it("should scroll to the beginning", () => {
    expect(testHelper(0, 100)).toEqual(0);
  });

  it("should scroll forward to the middle", () => {
    expect(testHelper(4, 0)).toEqual(20);
  });

  it("should scroll backward to the middle", () => {
    expect(testHelper(2, 100)).toEqual(30);
  });

  it("should not scroll if an item is already visible", () => {
    expect(testHelper(2, 20)).toEqual(20);
  });

  it("should scroll to the end", () => {
    expect(testHelper(8, 0)).toEqual(110);
  });

  it("should align a cell larger than the container to its start with auto alignment (#1264)", () => {
    // Scrolling forward (and backward) to a cell that doesn't fit shows its start rather than its end
    for (const currentOffset of [0, 200]) {
      expect(
        getUpdatedOffsetForIndex({
          cellOffset: 100,
          cellSize: 80,
          containerSize: 50,
          currentOffset
        })
      ).toEqual(100);
    }
  });

  it("should honor specified :align values", () => {
    expect(
      getUpdatedOffsetForIndex({
        align: "auto",
        cellOffset: 50,
        cellSize: 10,
        containerSize: 50,
        currentOffset: 0
      })
    ).toEqual(10);
    expect(
      getUpdatedOffsetForIndex({
        align: "start",
        cellOffset: 50,
        cellSize: 10,
        containerSize: 50,
        currentOffset: 0
      })
    ).toEqual(50);
    expect(
      getUpdatedOffsetForIndex({
        align: "auto",
        cellOffset: 50,
        cellSize: 10,
        containerSize: 50,
        currentOffset: 100
      })
    ).toEqual(50);
    expect(
      getUpdatedOffsetForIndex({
        align: "end",
        cellOffset: 50,
        cellSize: 10,
        containerSize: 50,
        currentOffset: 100
      })
    ).toEqual(10);
    expect(
      getUpdatedOffsetForIndex({
        align: "center",
        cellOffset: 50,
        cellSize: 10,
        containerSize: 50,
        currentOffset: 100
      })
    ).toEqual(30);
  });
});
