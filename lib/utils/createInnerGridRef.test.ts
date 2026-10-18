import { describe, expect, it, vi } from "vitest";
import type { GridImperativeAPI } from "../components/Grid/types";
import { createInnerGridRef } from "./createInnerGridRef";

function createGrid() {
  return {
    invalidateCellSizeAfterRender: vi.fn(),
    recomputeGridSize: vi.fn()
  } as unknown as GridImperativeAPI & {
    invalidateCellSizeAfterRender: ReturnType<typeof vi.fn>;
    recomputeGridSize: ReturnType<typeof vi.fn>;
  };
}

describe("createInnerGridRef", () => {
  it("should forward calls once the Grid's ref has been attached", () => {
    const innerGrid = createInnerGridRef();
    const grid = createGrid();
    innerGrid.setGridRef(grid);
    expect(innerGrid.getGrid()).toBe(grid);

    innerGrid.invalidateCellSizeAfterRender({ columnIndex: 1, rowIndex: 2 });
    innerGrid.recomputeGridSize({ columnIndex: 3, rowIndex: 4 });
    expect(grid.invalidateCellSizeAfterRender).toHaveBeenCalledWith({
      columnIndex: 1,
      rowIndex: 2
    });
    expect(grid.recomputeGridSize).toHaveBeenCalledWith({
      columnIndex: 3,
      rowIndex: 4
    });
  });

  it("should keep calls made before the Grid's ref is attached (merged to the smallest indices) until it is attached", () => {
    const innerGrid = createInnerGridRef();
    expect(innerGrid.getGrid()).toBe(null);

    innerGrid.invalidateCellSizeAfterRender({ columnIndex: 2, rowIndex: 5 });
    innerGrid.invalidateCellSizeAfterRender({ columnIndex: 0, rowIndex: 7 });
    innerGrid.recomputeGridSize({ columnIndex: 4, rowIndex: 3 });
    innerGrid.recomputeGridSize({ columnIndex: 6, rowIndex: 1 });

    const grid = createGrid();
    innerGrid.setGridRef(grid);
    expect(grid.invalidateCellSizeAfterRender).toHaveBeenCalledTimes(1);
    expect(grid.invalidateCellSizeAfterRender).toHaveBeenCalledWith({
      columnIndex: 0,
      rowIndex: 5
    });
    expect(grid.recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(grid.recomputeGridSize).toHaveBeenCalledWith({
      columnIndex: 4,
      rowIndex: 1
    });

    // Kept calls are only passed on once
    innerGrid.setGridRef(null);
    innerGrid.setGridRef(grid);
    expect(grid.invalidateCellSizeAfterRender).toHaveBeenCalledTimes(1);
    expect(grid.recomputeGridSize).toHaveBeenCalledTimes(1);
  });

  it("should keep calls made after the Grid's ref has been detached", () => {
    const innerGrid = createInnerGridRef();
    const grid = createGrid();
    innerGrid.setGridRef(grid);
    innerGrid.setGridRef(null);

    innerGrid.recomputeGridSize({ columnIndex: 0, rowIndex: 3 });
    expect(grid.recomputeGridSize).not.toHaveBeenCalled();

    const nextGrid = createGrid();
    innerGrid.setGridRef(nextGrid);
    expect(nextGrid.recomputeGridSize).toHaveBeenCalledWith({
      columnIndex: 0,
      rowIndex: 3
    });
  });
});
