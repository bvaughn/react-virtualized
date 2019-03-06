import CellSizeAndPositionManager from './CellSizeAndPositionManager';

describe('CellSizeAndPositionManager', () => {
  function getCellSizeAndPositionManager({
    cellCount = 100,
    estimatedCellSize = 15,
    cellSize = () => 10,
  } = {}) {
    const cellSizeAndPositionManager = new CellSizeAndPositionManager({
      cellCount,
      cellSize,
      estimatedCellSize,
    });

    const cellSizeGetterCalls = jest.spyOn(
      cellSizeAndPositionManager,
      '_getSize',
    );

    return {
      cellSizeAndPositionManager,
      cellSizeGetterCalls,
    };
  }

  describe('configure', () => {
    it('should update inner :cellCount and :estimatedCellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(100);
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(15);

      cellSizeAndPositionManager.configure({
        cellCount: 20,
        estimatedCellSize: 30,
      });
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(20);
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(30);
    });
  });

  describe('findNearestCell', () => {
    it('should error if given NaN', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(() => cellSizeAndPositionManager._findNearestCell(NaN)).toThrow();
    });

    it('should gracefully handle offets outisde of bounds (to account for elastic scrolling)', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager._findNearestCell(-100)).toEqual(0);
      expect(cellSizeAndPositionManager._findNearestCell(1234567890)).toEqual(
        99,
      );
    });

    it('should find the first cell for numeric CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellSize: 10,
      });
      expect(cellSizeAndPositionManager._findNearestCell(0)).toEqual(0);
      expect(cellSizeAndPositionManager._findNearestCell(9)).toEqual(0);
    });

    it('should find the first cell for thunk CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager._findNearestCell(0)).toEqual(0);
      expect(cellSizeAndPositionManager._findNearestCell(9)).toEqual(0);
    });

    it('should find the last cell for numeric CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellSize: 10,
      });
      expect(cellSizeAndPositionManager._findNearestCell(990)).toEqual(99);
      expect(cellSizeAndPositionManager._findNearestCell(991)).toEqual(99);
    });

    it('should find the last cell for thunk CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager._findNearestCell(990)).toEqual(99);
      expect(cellSizeAndPositionManager._findNearestCell(991)).toEqual(99);
    });

    it('should find the a cell that exactly matches a specified offset in the middle, numeric CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellSize: 10,
      });
      expect(cellSizeAndPositionManager._findNearestCell(100)).toEqual(10);
    });

    it('should find the a cell that exactly matches a specified offset in the middle, thunk CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager._findNearestCell(100)).toEqual(10);
    });

    it('should find the cell closest to (but before) the specified offset in the middle, numeric CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellSize: 10,
      });
      expect(cellSizeAndPositionManager._findNearestCell(100)).toEqual(10);
    });

    it('should find the cell closest to (but before) the specified offset in the middle, thunk CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager._findNearestCell(100)).toEqual(10);
    });
  });

  describe('getSizeAndPositionOfCell', () => {
    it('should error if an invalid index is specified', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(() =>
        cellSizeAndPositionManager.getSizeAndPositionOfCell(-1),
      ).toThrow();
      expect(() =>
        cellSizeAndPositionManager.getSizeAndPositionOfCell(100),
      ).toThrow();
    });

    it('should return the correct size and position information for the requested cell, numeric CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellSize: 10,
      });
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(0).offset,
      ).toEqual(0);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(0).size,
      ).toEqual(10);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(1).offset,
      ).toEqual(10);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(2).offset,
      ).toEqual(20);
    });

    it('should return the correct size and position information for the requested cell, thunk CellSize', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(0).offset,
      ).toEqual(0);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(0).size,
      ).toEqual(10);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(1).offset,
      ).toEqual(10);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfCell(2).offset,
      ).toEqual(20);
    });

    it('should only measure the necessary cells to return the information requested', () => {
      const {
        cellSizeAndPositionManager,
        cellSizeGetterCalls,
      } = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(0);
      expect(cellSizeGetterCalls.mock.calls).toEqual([[0]]);
    });

    it('should just-in-time measure all cells up to the requested cell if no cells have yet been measured', () => {
      const {
        cellSizeAndPositionManager,
        cellSizeGetterCalls,
      } = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(cellSizeGetterCalls.mock.calls).toEqual([
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
      ]);
    });

    it('should just-in-time measure cells up to the requested cell if some but not all cells have been measured', () => {
      const {
        cellSizeAndPositionManager,
        cellSizeGetterCalls,
      } = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.mockClear();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(10);
      expect(cellSizeGetterCalls.mock.calls).toEqual([
        [6],
        [7],
        [8],
        [9],
        [10],
      ]);
    });

    it('should return cached size and position data if cell has already been measured', () => {
      const {
        cellSizeAndPositionManager,
        cellSizeGetterCalls,
      } = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.mockClear();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(cellSizeGetterCalls).not.toBeCalled();
    });
  });

  describe('getSizeAndPositionOfLastMeasuredCell', () => {
    it('should return an empty object if no cached cells are present', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell(),
      ).toEqual({
        offset: 0,
        size: 0,
      });
    });

    it('should return size and position data for the highest/last measured cell', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      expect(
        cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell(),
      ).toEqual({
        offset: 50,
        size: 10,
      });
    });
  });

  describe('getTotalSize', () => {
    it('should calculate total size based purely on :estimatedCellSize if no measurements have been done', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1500);
    });

    it('should calculate total size based on a mixture of actual cell sizes and :estimatedCellSize if some cells have been measured', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(49);
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1250);
    });

    it('should calculate total size based on the actual measured sizes if all cells have been measured', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(99);
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1000);
    });
  });

  function runCommonUpdatedOffsetForIndexTests(getUpdatedOffsetForIndexHelper) {
    it('should scroll to the beginning', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          currentOffset: 100,
          targetIndex: 0,
        }),
      ).toEqual(0);
    });

    it('should scroll to the end', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          currentOffset: 0,
          targetIndex: 9,
        }),
      ).toEqual(50);
    });

    it('should scroll forward to the middle', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          currentOffset: 0,
          targetIndex: 6,
        }),
      ).toEqual(20);
    });

    it('should scroll backward to the middle', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          currentOffset: 50,
          targetIndex: 2,
        }),
      ).toEqual(20);
    });

    it('should not scroll if an item is already visible', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          currentOffset: 20,
          targetIndex: 3,
        }),
      ).toEqual(20);
    });

    it('should honor specified :align values', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'auto',
          currentOffset: 0,
          targetIndex: 5,
        }),
      ).toEqual(10);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'start',
          currentOffset: 0,
          targetIndex: 5,
        }),
      ).toEqual(50);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'auto',
          currentOffset: 50,
          targetIndex: 4,
        }),
      ).toEqual(40);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'end',
          currentOffset: 50,
          targetIndex: 5,
        }),
      ).toEqual(10);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'center',
          currentOffset: 50,
          targetIndex: 5,
        }),
      ).toEqual(30);
    });

    it('should always return an offset of 0 when :containerSize is 0', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          containerSize: 0,
          currentOffset: 50,
          targetIndex: 2,
        }),
      ).toEqual(0);
    });
  }

  describe('getUpdatedOffsetForIndex numeric CellSize', () => {
    function getUpdatedOffsetForIndexHelper({
      align = 'auto',
      cellCount = 10,
      cellSize = 10,
      containerSize = 50,
      currentOffset = 0,
      estimatedCellSize = 15,
      targetIndex = 0,
    }) {
      const cellSizeAndPositionManager = new CellSizeAndPositionManager({
        cellCount,
        cellSize,
        estimatedCellSize,
      });

      return cellSizeAndPositionManager.getUpdatedOffsetForIndex({
        align,
        containerSize,
        currentOffset,
        targetIndex,
      });
    }

    runCommonUpdatedOffsetForIndexTests(getUpdatedOffsetForIndexHelper);

    it('should not scroll past the safe bounds even if the specified :align requests it', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'end',
          currentOffset: 50,
          targetIndex: 0,
        }),
      ).toEqual(0);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'center',
          currentOffset: 50,
          targetIndex: 1,
        }),
      ).toEqual(0);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'start',
          currentOffset: 0,
          targetIndex: 9,
        }),
      ).toEqual(50);

      // In case it is a numeric cellSize we don't have the tricky situation
      // described in the thunk CellSize case
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'center',
          currentOffset: 0,
          targetIndex: 8,
        }),
      ).toEqual(50);
    });
  });

  describe('getUpdatedOffsetForIndex thunk CellSize', () => {
    function getUpdatedOffsetForIndexHelper({
      align = 'auto',
      cellCount = 10,
      cellSize = () => 10,
      containerSize = 50,
      currentOffset = 0,
      estimatedCellSize = 15,
      targetIndex = 0,
    }) {
      const cellSizeAndPositionManager = new CellSizeAndPositionManager({
        cellCount,
        cellSize,
        estimatedCellSize,
      });

      return cellSizeAndPositionManager.getUpdatedOffsetForIndex({
        align,
        containerSize,
        currentOffset,
        targetIndex,
      });
    }

    runCommonUpdatedOffsetForIndexTests(getUpdatedOffsetForIndexHelper);

    it('should not scroll past the safe bounds even if the specified :align requests it', () => {
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'end',
          currentOffset: 50,
          targetIndex: 0,
        }),
      ).toEqual(0);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'center',
          currentOffset: 50,
          targetIndex: 1,
        }),
      ).toEqual(0);
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'start',
          currentOffset: 0,
          targetIndex: 9,
        }),
      ).toEqual(50);

      // TRICKY: We would expect this to be positioned at 50.
      // But since the :estimatedCellSize is 15 and we only measure up to the 8th item,
      // The helper assumes it can scroll farther than it actually can.
      // Not sure if this edge case is worth "fixing" or just acknowledging...
      expect(
        getUpdatedOffsetForIndexHelper({
          align: 'center',
          currentOffset: 0,
          targetIndex: 8,
        }),
      ).toEqual(55);
    });
  });

  describe('getVisibleCellRange', () => {
    it('should not return any indices if :cellCount is 0', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager({
        cellCount: 0,
      });
      const {start, stop} = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0,
      });
      expect(start).toEqual(undefined);
      expect(stop).toEqual(undefined);
    });

    it('should return a visible range of cells for the beginning of the list', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      const {start, stop} = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0,
      });
      expect(start).toEqual(0);
      expect(stop).toEqual(4);
    });

    it('should return a visible range of cells for the middle of the list where some are partially visible', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      const {start, stop} = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 425,
      });
      // 42 and 47 are partially visible
      expect(start).toEqual(42);
      expect(stop).toEqual(47);
    });

    it('should return a visible range of cells for the end of the list', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      const {start, stop} = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 950,
      });
      expect(start).toEqual(95);
      expect(stop).toEqual(99);
    });
  });

  describe('resetCell', () => {
    it('should clear size and position metadata for the specified index and all cells after it', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeAndPositionManager.resetCell(3);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(2);
      cellSizeAndPositionManager.resetCell(0);
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(-1);
    });

    it('should not clear size and position metadata for cells before the specified index', () => {
      const {
        cellSizeAndPositionManager,
        cellSizeGetterCalls,
      } = getCellSizeAndPositionManager();
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5);
      cellSizeGetterCalls.mockClear();
      cellSizeAndPositionManager.resetCell(3);
      cellSizeAndPositionManager.getSizeAndPositionOfCell(4);
      expect(cellSizeGetterCalls.mock.calls).toEqual([[3], [4]]);
    });

    it('should not skip over any unmeasured or previously-cleared cells', () => {
      const {cellSizeAndPositionManager} = getCellSizeAndPositionManager();
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
