import { describe, expect, it } from "vitest";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import { createCellPositioner } from "./createCellPositioner";

describe("createCellPositioner", () => {
  function createCache() {
    return new CellMeasurerCache({
      defaultHeight: 50,
      defaultWidth: 80,
      fixedWidth: true
    });
  }

  it("should default spacer to 0", () => {
    const cellPositioner = createCellPositioner({
      cellMeasurerCache: createCache(),
      columnCount: 3,
      columnWidth: 80
    });
    expect(cellPositioner(0)).toEqual({ left: 0, top: 0 });
    expect(cellPositioner(1)).toEqual({ left: 80, top: 0 });
    expect(cellPositioner(2)).toEqual({ left: 160, top: 0 });
    expect(cellPositioner(3)).toEqual({ left: 0, top: 50 });
  });

  it("should default spacer to 0 when reset without a spacer", () => {
    const cellPositioner = createCellPositioner({
      cellMeasurerCache: createCache(),
      columnCount: 2,
      columnWidth: 100,
      spacer: 10
    });
    cellPositioner.reset({ columnCount: 3, columnWidth: 80 });
    expect(cellPositioner(0)).toEqual({ left: 0, top: 0 });
    expect(cellPositioner(1)).toEqual({ left: 80, top: 0 });
    expect(cellPositioner(2)).toEqual({ left: 160, top: 0 });
    expect(cellPositioner(3)).toEqual({ left: 0, top: 50 });
  });

  it("should use the spacer passed to reset", () => {
    const cellPositioner = createCellPositioner({
      cellMeasurerCache: createCache(),
      columnCount: 2,
      columnWidth: 100
    });
    cellPositioner.reset({ columnCount: 3, columnWidth: 80, spacer: 10 });
    expect(cellPositioner(0)).toEqual({ left: 0, top: 0 });
    expect(cellPositioner(1)).toEqual({ left: 90, top: 0 });
    expect(cellPositioner(2)).toEqual({ left: 180, top: 0 });
    expect(cellPositioner(3)).toEqual({ left: 0, top: 60 });
  });
});
