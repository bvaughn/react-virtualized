import updateScrollIndexHelper from './updateScrollIndexHelper';
import CellSizeAndPositionManager from './CellSizeAndPositionManager';

// Default cell sizes and offsets for use in shared tests
export function getCellSizeAndPositionManager({
  cellCount = CELL_SIZES.length,
  estimatedCellSize = 10,
}) {
  return new CellSizeAndPositionManager({
    cellCount,
    cellSizeGetter: ({index}) => CELL_SIZES[index % CELL_SIZES.length],
    estimatedCellSize,
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
  30, //  8: 110..110 (max)
];

describe('updateScrollIndexHelper', () => {
  function helper({
    cellCount = undefined,
    cellSizeAndPositionManager,
    cellSize = 10,
    previousCellsCount = undefined,
    previousCellSize = 10,
    previousScrollToAlignment = 'auto',
    previousScrollToIndex,
    previousSize = 50,
    scrollOffset = 0,
    scrollToAlignment = 'auto',
    scrollToIndex,
    size = 50,
  } = {}) {
    cellSizeAndPositionManager =
      cellSizeAndPositionManager || getCellSizeAndPositionManager({cellCount});
    cellCount =
      cellCount === undefined
        ? cellSizeAndPositionManager.getCellCount()
        : cellCount;
    previousCellsCount =
      previousCellsCount === undefined ? cellCount : previousCellsCount;

    let updateScrollIndexCallbackCalled = false;

    function updateScrollIndexCallback() {
      updateScrollIndexCallbackCalled = true;
    }

    updateScrollIndexHelper({
      cellCount,
      cellSizeAndPositionManager,
      cellSize,
      previousCellsCount,
      previousCellSize,
      previousScrollToAlignment,
      previousScrollToIndex,
      previousSize,
      scrollOffset,
      scrollToAlignment,
      scrollToIndex,
      size,
      updateScrollIndexCallback,
    });

    return updateScrollIndexCallbackCalled;
  }

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex and size has not changed', () => {
    expect(helper()).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if an invalid :scrollToIndex has been specified', () => {
    expect(
      helper({
        size: 100,
        previousSize: 50,
        scrollToIndex: -1,
      }),
    ).toEqual(false);
  });

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :size has changed', () => {
    expect(
      helper({
        cellCount: 100,
        size: 100,
        previousSize: 50,
        scrollToIndex: 10,
      }),
    ).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :cellSize has changed', () => {
    expect(
      helper({
        cellCount: 100,
        cellSize: 15,
        previousCellSize: 20,
        scrollToIndex: 10,
      }),
    ).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if previous :scrollToIndex has changed', () => {
    expect(
      helper({
        cellCount: 15,
        previousScrollToIndex: 20,
        scrollToIndex: 10,
      }),
    ).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if :cellCount has been reduced past the current scroll offset', () => {
    expect(
      helper({
        previousCellsCount: 100,
        scrollOffset: 510,
      }),
    ).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been reduced', () => {
    expect(
      helper({
        previousSize: 100,
        scrollOffset: 510,
        size: 50,
      }),
    ).toEqual(true);
  });

  it('should not measure rows if :size or :cellCount have been reduced but only use already measured (or estimated) total size', () => {
    const cellSizeAndPositionManager = {
      getCellCount: () => CELL_SIZES.length,
      getTotalSize: () => 560,
    };

    expect(
      helper({
        cellSizeAndPositionManager,
        previousSize: 100,
        scrollOffset: 510,
        size: 50,
      }),
    ).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :cellCount has been increased', () => {
    expect(
      helper({
        cellCount: 100,
        previousCellsCount: 50,
      }),
    ).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been increased', () => {
    expect(
      helper({
        previousSize: 50,
        size: 100,
      }),
    ).toEqual(false);
  });

  it('should call :updateScrollIndexCallback if :scrollToAlignment has changed', () => {
    expect(
      helper({
        previousScrollToAlignment: 'start',
        scrollToAlignment: 'end',
        scrollToIndex: 5,
      }),
    ).toEqual(true);
  });

  it('should not call :updateScrollIndexCallback if :scrollToAlignment has changed but there is no :scrollToIndex', () => {
    expect(
      helper({
        previousScrollToAlignment: 'start',
        scrollToAlignment: 'end',
      }),
    ).toEqual(false);
  });
});
