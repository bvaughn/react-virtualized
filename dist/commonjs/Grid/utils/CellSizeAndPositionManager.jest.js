"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _CellSizeAndPositionManager = _interopRequireDefault(require("./CellSizeAndPositionManager"));

describe('CellSizeAndPositionManager', function () {
  function getCellSizeAndPositionManager() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$cellCount = _ref.cellCount,
        cellCount = _ref$cellCount === void 0 ? 100 : _ref$cellCount,
        _ref$estimatedCellSiz = _ref.estimatedCellSize,
        estimatedCellSize = _ref$estimatedCellSiz === void 0 ? 15 : _ref$estimatedCellSiz;

    var cellSizeGetterCalls = [];
    var cellSizeAndPositionManager = new _CellSizeAndPositionManager["default"]({
      cellCount: cellCount,
      cellSizeGetter: function cellSizeGetter(_ref2) {
        var index = _ref2.index;
        cellSizeGetterCalls.push(index);
        return 10;
      },
      estimatedCellSize: estimatedCellSize
    });
    return {
      cellSizeAndPositionManager: cellSizeAndPositionManager,
      cellSizeGetterCalls: cellSizeGetterCalls
    };
  }

  describe('configure', function () {
    it('should update inner :cellCount and :estimatedCellSize', function () {
      var _getCellSizeAndPositi = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager.getCellCount()).toEqual(100);
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(15);
      cellSizeAndPositionManager.configure({
        cellCount: 20,
        estimatedCellSize: 30
      });
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(20);
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(30);
    });
  });
  describe('findNearestCell', function () {
    it('should error if given NaN', function () {
      var _getCellSizeAndPositi2 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi2.cellSizeAndPositionManager;

      expect(function () {
        return cellSizeAndPositionManager._findNearestCell(NaN);
      }).toThrow();
    });
    it('should gracefully handle offets outisde of bounds (to account for elastic scrolling)', function () {
      var _getCellSizeAndPositi3 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi3.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager._findNearestCell(-100)).toEqual(0);
      expect(cellSizeAndPositionManager._findNearestCell(1234567890)).toEqual(99);
    });
    it('should find the first cell', function () {
      var _getCellSizeAndPositi4 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi4.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager._findNearestCell(0)).toEqual(0);
      expect(cellSizeAndPositionManager._findNearestCell(9)).toEqual(0);
    });
    it('should find the last cell', function () {
      var _getCellSizeAndPositi5 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi5.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager._findNearestCell(990)).toEqual(99);
      expect(cellSizeAndPositionManager._findNearestCell(991)).toEqual(99);
    });
    it('should find the a cell that exactly matches a specified offset in the middle', function () {
      var _getCellSizeAndPositi6 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi6.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager._findNearestCell(100)).toEqual(10);
    });
    it('should find the cell closest to (but before) the specified offset in the middle', function () {
      var _getCellSizeAndPositi7 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi7.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager._findNearestCell(101)).toEqual(10);
    });
  });
  describe('getSizeAndPositionOfCell', function () {
    it('should error if an invalid index is specified', function () {
      var _getCellSizeAndPositi8 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi8.cellSizeAndPositionManager;

      expect(function () {
        return cellSizeAndPositionManager.getSizeAndPositionOfCell(-1);
      }).toThrow();
      expect(function () {
        return cellSizeAndPositionManager.getSizeAndPositionOfCell(100);
      }).toThrow();
    });
    it('should return the correct size and position information for the requested cell', function () {
      var _getCellSizeAndPositi9 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi9.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(0).offset).toEqual(0);
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(0).size).toEqual(10);
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(1).offset).toEqual(10);
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(2).offset).toEqual(20);
    });
    it('should only measure the necessary cells to return the information requested', function () {
      var _getCellSizeAndPositi10 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi10.cellSizeAndPositionManager,
          cellSizeGetterCalls = _getCellSizeAndPositi10.cellSizeGetterCalls;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(0);
      expect(cellSizeGetterCalls).toEqual([0]);
    });
    it('should just-in-time measure all cells up to the requested cell if no cells have yet been measured', function () {
      var _getCellSizeAndPositi11 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi11.cellSizeAndPositionManager,
          cellSizeGetterCalls = _getCellSizeAndPositi11.cellSizeGetterCalls;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(cellSizeGetterCalls).toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('should just-in-time measure cells up to the requested cell if some but not all cells have been measured', function () {
      var _getCellSizeAndPositi12 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi12.cellSizeAndPositionManager,
          cellSizeGetterCalls = _getCellSizeAndPositi12.cellSizeGetterCalls;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.splice(0);
      cellSizeAndPositionManager.getSizeAndPositionOfCell(10);
      expect(cellSizeGetterCalls).toEqual([6, 7, 8, 9, 10]);
    });
    it('should return cached size and position data if cell has already been measured', function () {
      var _getCellSizeAndPositi13 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi13.cellSizeAndPositionManager,
          cellSizeGetterCalls = _getCellSizeAndPositi13.cellSizeGetterCalls;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.splice(0);
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(cellSizeGetterCalls).toEqual([]);
    });
  });
  describe('getSizeAndPositionOfLastMeasuredCell', function () {
    it('should return an empty object if no cached cells are present', function () {
      var _getCellSizeAndPositi14 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi14.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell()).toEqual({
        offset: 0,
        size: 0
      });
    });
    it('should return size and position data for the highest/last measured cell', function () {
      var _getCellSizeAndPositi15 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi15.cellSizeAndPositionManager;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell()).toEqual({
        offset: 50,
        size: 10
      });
    });
  });
  describe('getTotalSize', function () {
    it('should calculate total size based purely on :estimatedCellSize if no measurements have been done', function () {
      var _getCellSizeAndPositi16 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi16.cellSizeAndPositionManager;

      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1500);
    });
    it('should calculate total size based on a mixture of actual cell sizes and :estimatedCellSize if some cells have been measured', function () {
      var _getCellSizeAndPositi17 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi17.cellSizeAndPositionManager;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(49);
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1250);
    });
    it('should calculate total size based on the actual measured sizes if all cells have been measured', function () {
      var _getCellSizeAndPositi18 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi18.cellSizeAndPositionManager;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(99);
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1000);
    });
  });
  describe('getUpdatedOffsetForIndex', function () {
    function getUpdatedOffsetForIndexHelper(_ref3) {
      var _ref3$align = _ref3.align,
          align = _ref3$align === void 0 ? 'auto' : _ref3$align,
          _ref3$cellCount = _ref3.cellCount,
          cellCount = _ref3$cellCount === void 0 ? 10 : _ref3$cellCount,
          _ref3$cellSize = _ref3.cellSize,
          cellSize = _ref3$cellSize === void 0 ? 10 : _ref3$cellSize,
          _ref3$containerSize = _ref3.containerSize,
          containerSize = _ref3$containerSize === void 0 ? 50 : _ref3$containerSize,
          _ref3$currentOffset = _ref3.currentOffset,
          currentOffset = _ref3$currentOffset === void 0 ? 0 : _ref3$currentOffset,
          _ref3$estimatedCellSi = _ref3.estimatedCellSize,
          estimatedCellSize = _ref3$estimatedCellSi === void 0 ? 15 : _ref3$estimatedCellSi,
          _ref3$targetIndex = _ref3.targetIndex,
          targetIndex = _ref3$targetIndex === void 0 ? 0 : _ref3$targetIndex;
      var cellSizeAndPositionManager = new _CellSizeAndPositionManager["default"]({
        cellCount: cellCount,
        cellSizeGetter: function cellSizeGetter() {
          return cellSize;
        },
        estimatedCellSize: estimatedCellSize
      });
      return cellSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: align,
        containerSize: containerSize,
        currentOffset: currentOffset,
        targetIndex: targetIndex
      });
    }

    it('should scroll to the beginning', function () {
      expect(getUpdatedOffsetForIndexHelper({
        currentOffset: 100,
        targetIndex: 0
      })).toEqual(0);
    });
    it('should scroll to the end', function () {
      expect(getUpdatedOffsetForIndexHelper({
        currentOffset: 0,
        targetIndex: 9
      })).toEqual(50);
    });
    it('should scroll forward to the middle', function () {
      expect(getUpdatedOffsetForIndexHelper({
        currentOffset: 0,
        targetIndex: 6
      })).toEqual(20);
    });
    it('should scroll backward to the middle', function () {
      expect(getUpdatedOffsetForIndexHelper({
        currentOffset: 50,
        targetIndex: 2
      })).toEqual(20);
    });
    it('should not scroll if an item is already visible', function () {
      expect(getUpdatedOffsetForIndexHelper({
        currentOffset: 20,
        targetIndex: 3
      })).toEqual(20);
    });
    it('should honor specified :align values', function () {
      expect(getUpdatedOffsetForIndexHelper({
        align: 'auto',
        currentOffset: 0,
        targetIndex: 5
      })).toEqual(10);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'start',
        currentOffset: 0,
        targetIndex: 5
      })).toEqual(50);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'auto',
        currentOffset: 50,
        targetIndex: 4
      })).toEqual(40);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'end',
        currentOffset: 50,
        targetIndex: 5
      })).toEqual(10);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'center',
        currentOffset: 50,
        targetIndex: 5
      })).toEqual(30);
    });
    it('should not scroll past the safe bounds even if the specified :align requests it', function () {
      expect(getUpdatedOffsetForIndexHelper({
        align: 'end',
        currentOffset: 50,
        targetIndex: 0
      })).toEqual(0);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'center',
        currentOffset: 50,
        targetIndex: 1
      })).toEqual(0);
      expect(getUpdatedOffsetForIndexHelper({
        align: 'start',
        currentOffset: 0,
        targetIndex: 9
      })).toEqual(50); // TRICKY: We would expect this to be positioned at 50.
      // But since the :estimatedCellSize is 15 and we only measure up to the 8th item,
      // The helper assumes it can scroll farther than it actually can.
      // Not sure if this edge case is worth "fixing" or just acknowledging...

      expect(getUpdatedOffsetForIndexHelper({
        align: 'center',
        currentOffset: 0,
        targetIndex: 8
      })).toEqual(55);
    });
    it('should always return an offset of 0 when :containerSize is 0', function () {
      expect(getUpdatedOffsetForIndexHelper({
        containerSize: 0,
        currentOffset: 50,
        targetIndex: 2
      })).toEqual(0);
    });
  });
  describe('getVisibleCellRange', function () {
    it('should not return any indices if :cellCount is 0', function () {
      var _getCellSizeAndPositi19 = getCellSizeAndPositionManager({
        cellCount: 0
      }),
          cellSizeAndPositionManager = _getCellSizeAndPositi19.cellSizeAndPositionManager;

      var _cellSizeAndPositionM = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0
      }),
          start = _cellSizeAndPositionM.start,
          stop = _cellSizeAndPositionM.stop;

      expect(start).toEqual(undefined);
      expect(stop).toEqual(undefined);
    });
    it('should return a visible range of cells for the beginning of the list', function () {
      var _getCellSizeAndPositi20 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi20.cellSizeAndPositionManager;

      var _cellSizeAndPositionM2 = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0
      }),
          start = _cellSizeAndPositionM2.start,
          stop = _cellSizeAndPositionM2.stop;

      expect(start).toEqual(0);
      expect(stop).toEqual(4);
    });
    it('should return a visible range of cells for the middle of the list where some are partially visible', function () {
      var _getCellSizeAndPositi21 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi21.cellSizeAndPositionManager;

      var _cellSizeAndPositionM3 = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 425
      }),
          start = _cellSizeAndPositionM3.start,
          stop = _cellSizeAndPositionM3.stop; // 42 and 47 are partially visible


      expect(start).toEqual(42);
      expect(stop).toEqual(47);
    });
    it('should return a visible range of cells for the end of the list', function () {
      var _getCellSizeAndPositi22 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi22.cellSizeAndPositionManager;

      var _cellSizeAndPositionM4 = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 950
      }),
          start = _cellSizeAndPositionM4.start,
          stop = _cellSizeAndPositionM4.stop;

      expect(start).toEqual(95);
      expect(stop).toEqual(99);
    });
  });
  describe('resetCell', function () {
    it('should clear size and position metadata for the specified index and all cells after it', function () {
      var _getCellSizeAndPositi23 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi23.cellSizeAndPositionManager;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeAndPositionManager.resetCell(3);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(2);
      cellSizeAndPositionManager.resetCell(0);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(-1);
    });
    it('should not clear size and position metadata for cells before the specified index', function () {
      var _getCellSizeAndPositi24 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi24.cellSizeAndPositionManager,
          cellSizeGetterCalls = _getCellSizeAndPositi24.cellSizeGetterCalls;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.splice(0);
      cellSizeAndPositionManager.resetCell(3);
      cellSizeAndPositionManager.getSizeAndPositionOfCell(4);
      expect(cellSizeGetterCalls).toEqual([3, 4]);
    });
    it('should not skip over any unmeasured or previously-cleared cells', function () {
      var _getCellSizeAndPositi25 = getCellSizeAndPositionManager(),
          cellSizeAndPositionManager = _getCellSizeAndPositi25.cellSizeAndPositionManager;

      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeAndPositionManager.resetCell(2);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(1);
      cellSizeAndPositionManager.resetCell(4);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(1);
      cellSizeAndPositionManager.resetCell(0);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(-1);
    });
  });
});