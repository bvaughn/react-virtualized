import { describe, expect, it } from "vitest";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import { CellMeasurerCacheDecorator } from "./CellMeasurerCacheDecorator";

describe("CellMeasurerCacheDecorator", () => {
  function createDecorator() {
    const cellMeasurerCache = new CellMeasurerCache({
      defaultHeight: 25,
      defaultWidth: 50
    });
    cellMeasurerCache.set(3, 2, 100, 40);

    return new CellMeasurerCacheDecorator({
      cellMeasurerCache,
      columnIndexOffset: 2,
      rowIndexOffset: 3
    });
  }

  it("should return the (offset) column width", () => {
    const decorator = createDecorator();
    expect(decorator.columnWidth({ index: 0 })).toBe(100);
    expect(decorator.columnWidth({ index: 1 })).toBe(50);
  });

  it("should return the (offset) row height", () => {
    const decorator = createDecorator();
    expect(decorator.rowHeight({ index: 0 })).toBe(40);
    expect(decorator.rowHeight({ index: 1 })).toBe(25);
  });
});
