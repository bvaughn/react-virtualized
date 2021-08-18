import ScalingCellSizeAndPositionManager from './ScalingCellSizeAndPositionManager';
describe('ScalingCellSizeAndPositionManager', function () {
  function init() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$cellCount = _ref.cellCount,
        cellCount = _ref$cellCount === void 0 ? 10 : _ref$cellCount,
        _ref$cellSize = _ref.cellSize,
        cellSize = _ref$cellSize === void 0 ? 10 : _ref$cellSize,
        _ref$estimatedCellSiz = _ref.estimatedCellSize,
        estimatedCellSize = _ref$estimatedCellSiz === void 0 ? 10 : _ref$estimatedCellSiz,
        _ref$maxScrollSize = _ref.maxScrollSize,
        maxScrollSize = _ref$maxScrollSize === void 0 ? 50 : _ref$maxScrollSize;

    var cellSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      cellCount: cellCount,
      cellSizeGetter: function cellSizeGetter() {
        return cellSize;
      },
      estimatedCellSize: estimatedCellSize,
      maxScrollSize: maxScrollSize
    });
    return cellSizeAndPositionManager;
  }

  describe('_getOffsetPercentage', function () {
    it('should return the correct offset fraction', function () {
      var expectations = [{
        offset: 0,
        expectedOffsetPercentage: 0
      }, {
        offset: 35,
        expectedOffsetPercentage: 0.5
      }, {
        offset: 70,
        expectedOffsetPercentage: 1
      }];
      var instance = init();
      expectations.forEach(function (expectation) {
        expect(instance._getOffsetPercentage({
          containerSize: 30,
          offset: expectation.offset,
          totalSize: 100
        })).toBe(expectation.expectedOffsetPercentage);
      });
    });
  });
  describe('getOffsetAdjustment', function () {
    it('should always return 0 as the adjustment for unscaled lists', function () {
      var maxScrollSizes = [100, 150];
      maxScrollSizes.forEach(function (maxScrollSize) {
        var instance = init({
          cellCount: 10,
          maxScrollSize: maxScrollSize
        });
        var offsets = [0, 35, 70];
        offsets.forEach(function (offset) {
          expect(instance.getOffsetAdjustment({
            containerSize: 30,
            offset: offset
          })).toBe(0);
        });
      });
    });
    it('should properly scale an offset at the beginning, middle, and end of the list', function () {
      var offsetsAndExpectedAdjustements = [{
        offset: 0,
        expectedAdjustment: -0
      }, {
        offset: 10,
        expectedAdjustment: -25
      }, {
        offset: 20,
        expectedAdjustment: -50
      }];
      var instance = init();
      offsetsAndExpectedAdjustements.forEach(function (offsetAndExpectedAdjustement) {
        expect(instance.getOffsetAdjustment({
          containerSize: 30,
          offset: offsetAndExpectedAdjustement.offset
        })).toBe(offsetAndExpectedAdjustement.expectedAdjustment);
      });
    });
  });
  describe('getTotalSize', function () {
    it('should return :totalSize if it is not greater than :maxScrollSize', function () {
      var maxScrollSizes = [500, 750];
      maxScrollSizes.forEach(function (maxScrollSize) {
        var instance = init({
          cellCount: 50,
          maxScrollSize: maxScrollSize
        });
        expect(instance.getTotalSize()).toEqual(500);
      });
    });
    it('should return :maxScrollSize if :totalSize is greater', function () {
      var instance = init({
        cellCount: 100,
        maxScrollSize: 100
      });
      expect(instance.getTotalSize()).toEqual(100);
    });
  });
  describe('getUpdatedOffsetForIndex', function () {
    it('should scroll to a cell before the current range', function () {
      var data = [{
        targetIndex: 0,
        expectedOffset: 0
      }, {
        targetIndex: 1,
        expectedOffset: 3
      }, // (unsafe: 10)
      {
        targetIndex: 2,
        expectedOffset: 6
      } // (unsafe: 20)
      ];
      var instance = init();
      data.forEach(function (datum) {
        expect(instance.getUpdatedOffsetForIndex({
          containerSize: 30,
          currentOffset: 10,
          // (unsafe: 35)
          targetIndex: datum.targetIndex
        })).toBe(datum.expectedOffset);
      });
    });
    it('should scroll to a cell after the current range', function () {
      var data = [{
        targetIndex: 7,
        expectedOffset: 14
      }, // (unsafe: 50)
      {
        targetIndex: 9,
        expectedOffset: 20
      } // (unsafe: 70)
      ];
      var instance = init();
      data.forEach(function (datum) {
        expect(instance.getUpdatedOffsetForIndex({
          containerSize: 30,
          currentOffset: 0,
          targetIndex: datum.targetIndex
        })).toBe(datum.expectedOffset);
      });
    });
    it('should not scroll to a cell already visible within the current range', function () {
      var instance = init();
      expect(instance.getUpdatedOffsetForIndex({
        containerSize: 30,
        currentOffset: 10,
        // (unsafe: 35)
        targetIndex: 4
      })).toBe(10);
    });
  });
  describe('getVisibleCellRange', function () {
    it('should correct identify the first set of cells', function () {
      var instance = init();
      expect(instance.getVisibleCellRange({
        containerSize: 30,
        offset: 0
      })).toEqual({
        start: 0,
        stop: 2
      });
    });
    it('should correct identify cells in the middle', function () {
      var instance = init();
      expect(instance.getVisibleCellRange({
        containerSize: 30,
        offset: 2.85 // (unsafe: 10)

      })).toEqual({
        start: 1,
        stop: 3
      });
    });
    it('should correct identify partially visible cells', function () {
      var instance = init();
      expect(instance.getVisibleCellRange({
        containerSize: 30,
        offset: 10 // (unsafe: 35)

      })).toEqual({
        start: 3,
        stop: 6
      });
    });
    it('should correct identify the last set of cells', function () {
      var instance = init();
      expect(instance.getVisibleCellRange({
        containerSize: 30,
        offset: 20
      })).toEqual({
        start: 7,
        stop: 9
      });
    });
  });
});