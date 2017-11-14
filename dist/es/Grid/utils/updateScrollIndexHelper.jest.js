import updateScrollIndexHelper from './updateScrollIndexHelper';
import CellSizeAndPositionManager from './CellSizeAndPositionManager';

// Default cell sizes and offsets for use in shared tests
export function getCellSizeAndPositionManager(_ref) {
  var _ref$cellCount = _ref.cellCount,
      cellCount = _ref$cellCount === undefined ? CELL_SIZES.length : _ref$cellCount,
      _ref$estimatedCellSiz = _ref.estimatedCellSize,
      estimatedCellSize = _ref$estimatedCellSiz === undefined ? 10 : _ref$estimatedCellSiz;

  return new CellSizeAndPositionManager({
    cellCount: cellCount,
    cellSizeGetter: function cellSizeGetter(_ref2) {
      var index = _ref2.index;
      return CELL_SIZES[index % CELL_SIZES.length];
    },
    estimatedCellSize: estimatedCellSize
  });
}

var CELL_SIZES = [10, // 0: 0..0 (min)
20, // 1: 0..10
15, // 2: 0..30
10, // 3: 5..45
15, // 4: 20..55
30, // 5: 50..70
20, // 6: 70..100
10, // 7: 80..110
30];

describe('updateScrollIndexHelper', function () {
  function helper() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$cellCount = _ref3.cellCount,
        cellCount = _ref3$cellCount === undefined ? undefined : _ref3$cellCount,
        cellSizeAndPositionManager = _ref3.cellSizeAndPositionManager,
        _ref3$cellSize = _ref3.cellSize,
        cellSize = _ref3$cellSize === undefined ? 10 : _ref3$cellSize,
        _ref3$previousCellsCo = _ref3.previousCellsCount,
        previousCellsCount = _ref3$previousCellsCo === undefined ? undefined : _ref3$previousCellsCo,
        _ref3$previousCellSiz = _ref3.previousCellSize,
        previousCellSize = _ref3$previousCellSiz === undefined ? 10 : _ref3$previousCellSiz,
        _ref3$previousScrollT = _ref3.previousScrollToAlignment,
        previousScrollToAlignment = _ref3$previousScrollT === undefined ? 'auto' : _ref3$previousScrollT,
        previousScrollToIndex = _ref3.previousScrollToIndex,
        _ref3$previousSize = _ref3.previousSize,
        previousSize = _ref3$previousSize === undefined ? 50 : _ref3$previousSize,
        _ref3$scrollOffset = _ref3.scrollOffset,
        scrollOffset = _ref3$scrollOffset === undefined ? 0 : _ref3$scrollOffset,
        _ref3$scrollToAlignme = _ref3.scrollToAlignment,
        scrollToAlignment = _ref3$scrollToAlignme === undefined ? 'auto' : _ref3$scrollToAlignme,
        scrollToIndex = _ref3.scrollToIndex,
        _ref3$size = _ref3.size,
        size = _ref3$size === undefined ? 50 : _ref3$size;

    cellSizeAndPositionManager = cellSizeAndPositionManager || getCellSizeAndPositionManager({ cellCount: cellCount });
    cellCount = cellCount === undefined ? cellSizeAndPositionManager.getCellCount() : cellCount;
    previousCellsCount = previousCellsCount === undefined ? cellCount : previousCellsCount;

    var updateScrollIndexCallbackCalled = false;

    function updateScrollIndexCallback() {
      updateScrollIndexCallbackCalled = true;
    }

    updateScrollIndexHelper({
      cellCount: cellCount,
      cellSizeAndPositionManager: cellSizeAndPositionManager,
      cellSize: cellSize,
      previousCellsCount: previousCellsCount,
      previousCellSize: previousCellSize,
      previousScrollToAlignment: previousScrollToAlignment,
      previousScrollToIndex: previousScrollToIndex,
      previousSize: previousSize,
      scrollOffset: scrollOffset,
      scrollToAlignment: scrollToAlignment,
      scrollToIndex: scrollToIndex,
      size: size,
      updateScrollIndexCallback: updateScrollIndexCallback
    });

    return updateScrollIndexCallbackCalled;
  }

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex and size has not changed', function () {
    expect(helper()).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if an invalid :scrollToIndex has been specified', function () {
    expect(helper({
      size: 100,
      previousSize: 50,
      scrollToIndex: -1
    })).toEqual(false);
  });

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :size has changed', function () {
    expect(helper({
      cellCount: 100,
      size: 100,
      previousSize: 50,
      scrollToIndex: 10
    })).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if there is a :scrollToIndex and :cellSize has changed', function () {
    expect(helper({
      cellCount: 100,
      cellSize: 15,
      previousCellSize: 20,
      scrollToIndex: 10
    })).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if previous :scrollToIndex has changed', function () {
    expect(helper({
      cellCount: 15,
      previousScrollToIndex: 20,
      scrollToIndex: 10
    })).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if :cellCount has been reduced past the current scroll offset', function () {
    expect(helper({
      previousCellsCount: 100,
      scrollOffset: 510
    })).toEqual(true);
  });

  it('should call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been reduced', function () {
    expect(helper({
      previousSize: 100,
      scrollOffset: 510,
      size: 50
    })).toEqual(true);
  });

  it('should not measure rows if :size or :cellCount have been reduced but only use already measured (or estimated) total size', function () {
    var cellSizeAndPositionManager = {
      getCellCount: function getCellCount() {
        return CELL_SIZES.length;
      },
      getTotalSize: function getTotalSize() {
        return 560;
      }
    };

    expect(helper({
      cellSizeAndPositionManager: cellSizeAndPositionManager,
      previousSize: 100,
      scrollOffset: 510,
      size: 50
    })).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :cellCount has been increased', function () {
    expect(helper({
      cellCount: 100,
      previousCellsCount: 50
    })).toEqual(false);
  });

  it('should not call :updateScrollIndexCallback if there is no :scrollToIndex but :size has been increased', function () {
    expect(helper({
      previousSize: 50,
      size: 100
    })).toEqual(false);
  });

  it('should call :updateScrollIndexCallback if :scrollToAlignment has changed', function () {
    expect(helper({
      previousScrollToAlignment: 'start',
      scrollToAlignment: 'end',
      scrollToIndex: 5
    })).toEqual(true);
  });

  it('should not call :updateScrollIndexCallback if :scrollToAlignment has changed but there is no :scrollToIndex', function () {
    expect(helper({
      previousScrollToAlignment: 'start',
      scrollToAlignment: 'end'
    })).toEqual(false);
  });
});