import ScalingCellSizeAndPositionManager from './ScalingCellSizeAndPositionManager';

describe('ScalingCellSizeAndPositionManager', () => {
  function init({
    cellCount = 10,
    cellSize = 10,
    estimatedCellSize = 10,
    maxScrollSize = 50,
  } = {}) {
    const cellSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
      cellCount,
      cellSize,
      estimatedCellSize,
      maxScrollSize,
    });

    return cellSizeAndPositionManager;
  }

  describe('_getOffsetPercentage', () => {
    it('should return the correct offset fraction', () => {
      var expectations = [
        {offset: 0, expectedOffsetPercentage: 0},
        {offset: 35, expectedOffsetPercentage: 0.5},
        {offset: 70, expectedOffsetPercentage: 1},
      ];
      const instance = init();
      expectations.forEach(expectation => {
        expect(
          instance._getOffsetPercentage({
            containerSize: 30,
            offset: expectation.offset,
            totalSize: 100,
          }),
        ).toBe(expectation.expectedOffsetPercentage);
      });
    });
  });

  describe('getOffsetAdjustment', () => {
    it('should always return 0 as the adjustment for unscaled lists', () => {
      const maxScrollSizes = [100, 150];
      maxScrollSizes.forEach(maxScrollSize => {
        const instance = init({
          cellCount: 10,
          maxScrollSize,
        });
        const offsets = [0, 35, 70];
        offsets.forEach(offset => {
          expect(
            instance.getOffsetAdjustment({
              containerSize: 30,
              offset,
            }),
          ).toBe(0);
        });
      });
    });

    it('should properly scale an offset at the beginning, middle, and end of the list', () => {
      var offsetsAndExpectedAdjustements = [
        {offset: 0, expectedAdjustment: -0},
        {offset: 10, expectedAdjustment: -25},
        {offset: 20, expectedAdjustment: -50},
      ];
      const instance = init();
      offsetsAndExpectedAdjustements.forEach(offsetAndExpectedAdjustement => {
        expect(
          instance.getOffsetAdjustment({
            containerSize: 30,
            offset: offsetAndExpectedAdjustement.offset,
          }),
        ).toBe(offsetAndExpectedAdjustement.expectedAdjustment);
      });
    });
  });

  describe('getTotalSize', () => {
    it('should return :totalSize if it is not greater than :maxScrollSize', () => {
      const maxScrollSizes = [500, 750];
      maxScrollSizes.forEach(maxScrollSize => {
        const instance = init({
          cellCount: 50,
          maxScrollSize,
        });
        expect(instance.getTotalSize()).toEqual(500);
      });
    });

    it('should return :maxScrollSize if :totalSize is greater', () => {
      const instance = init({
        cellCount: 100,
        maxScrollSize: 100,
      });
      expect(instance.getTotalSize()).toEqual(100);
    });
  });

  describe('getUpdatedOffsetForIndex', () => {
    it('should scroll to a cell before the current range', () => {
      const data = [
        {targetIndex: 0, expectedOffset: 0},
        {targetIndex: 1, expectedOffset: 3}, // (unsafe: 10)
        {targetIndex: 2, expectedOffset: 6}, // (unsafe: 20)
      ];
      const instance = init();
      data.forEach(datum => {
        expect(
          instance.getUpdatedOffsetForIndex({
            containerSize: 30,
            currentOffset: 10, // (unsafe: 35)
            targetIndex: datum.targetIndex,
          }),
        ).toBe(datum.expectedOffset);
      });
    });

    it('should scroll to a cell after the current range', () => {
      const data = [
        {targetIndex: 7, expectedOffset: 14}, // (unsafe: 50)
        {targetIndex: 9, expectedOffset: 20}, // (unsafe: 70)
      ];
      const instance = init();
      data.forEach(datum => {
        expect(
          instance.getUpdatedOffsetForIndex({
            containerSize: 30,
            currentOffset: 0,
            targetIndex: datum.targetIndex,
          }),
        ).toBe(datum.expectedOffset);
      });
    });

    it('should not scroll to a cell already visible within the current range', () => {
      const instance = init();
      expect(
        instance.getUpdatedOffsetForIndex({
          containerSize: 30,
          currentOffset: 10, // (unsafe: 35)
          targetIndex: 4,
        }),
      ).toBe(10);
    });
  });

  describe('getVisibleCellRange', () => {
    it('should correct identify the first set of cells', () => {
      const instance = init();
      expect(
        instance.getVisibleCellRange({
          containerSize: 30,
          offset: 0,
        }),
      ).toEqual({
        start: 0,
        stop: 2,
      });
    });

    it('should correct identify cells in the middle', () => {
      const instance = init();
      expect(
        instance.getVisibleCellRange({
          containerSize: 30,
          offset: 2.85, // (unsafe: 10)
        }),
      ).toEqual({
        start: 1,
        stop: 3,
      });
    });

    it('should correct identify partially visible cells', () => {
      const instance = init();
      expect(
        instance.getVisibleCellRange({
          containerSize: 30,
          offset: 10, // (unsafe: 35)
        }),
      ).toEqual({
        start: 3,
        stop: 6,
      });
    });

    it('should correct identify the last set of cells', () => {
      const instance = init();
      expect(
        instance.getVisibleCellRange({
          containerSize: 30,
          offset: 20,
        }),
      ).toEqual({
        start: 7,
        stop: 9,
      });
    });
  });
});
