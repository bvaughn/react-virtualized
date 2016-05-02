import CellSizeAndPositionManager from './CellSizeAndPositionManager'

describe('CellSizeAndPositionManager', () => {
  function getCellSizeAndPositionManager ({
    cellCount = 100,
    estimatedCellSize = 15
  } = {}) {
    const cellSizeGetterCalls = []
    const cellSizeAndPositionManager = new CellSizeAndPositionManager({
      cellCount,
      cellSizeGetter: ({ index }) => {
        cellSizeGetterCalls.push(index)
        return 10
      },
      estimatedCellSize
    })

    return {
      cellSizeAndPositionManager,
      cellSizeGetterCalls
    }
  }

  describe('configure', () => {
    it('should update inner :cellCount and :estimatedCellSize', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(100)
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(15)

      cellSizeAndPositionManager.configure({
        cellCount: 20,
        estimatedCellSize: 30
      })
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(20)
      expect(cellSizeAndPositionManager.getEstimatedCellSize()).toEqual(30)
    })
  })

  describe('findNearestCell', () => {
    it('should error if given NaN', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(() => cellSizeAndPositionManager.findNearestCell(NaN)).toThrow()
    })

    // @TODO Should I test bounds outside of the total size?

    it('should find the first cell', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.findNearestCell(0)).toEqual(0)
      expect(cellSizeAndPositionManager.findNearestCell(9)).toEqual(0)
    })

    it('should find the last cell', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.findNearestCell(990)).toEqual(99)
      expect(cellSizeAndPositionManager.findNearestCell(991)).toEqual(99)
    })

    it('should find the a cell that exactly matches a specified offset in the middle', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.findNearestCell(100)).toEqual(10)
    })

    it('should find the cell closest to (but before) the specified offset in the middle', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.findNearestCell(101)).toEqual(10)
    })
  })

  describe('getSizeAndPositionOfCell', () => {
    it('should error if an invalid index is specified', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(() => cellSizeAndPositionManager.getSizeAndPositionOfCell(-1)).toThrow()
      expect(() => cellSizeAndPositionManager.getSizeAndPositionOfCell(100)).toThrow()
    })

    it('should returnt he correct size and position information for the requested cell', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(0).offset).toEqual(0)
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(0).size).toEqual(10)
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(1).offset).toEqual(10)
      expect(cellSizeAndPositionManager.getSizeAndPositionOfCell(2).offset).toEqual(20)
    })

    it('should only measure the necessary cells to return the information requested', () => {
      const { cellSizeAndPositionManager, cellSizeGetterCalls } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(0)
      expect(cellSizeGetterCalls).toEqual([0])
    })

    it('should just-in-time measure all cells up to the requested cell if no cells have yet been measured', () => {
      const { cellSizeAndPositionManager, cellSizeGetterCalls } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      expect(cellSizeGetterCalls).toEqual([0, 1, 2, 3, 4, 5])
    })

    it('should just-in-time measure cells up to the requested cell if some but not all cells have been measured', () => {
      const { cellSizeAndPositionManager, cellSizeGetterCalls } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      cellSizeGetterCalls.splice(0)
      cellSizeAndPositionManager.getSizeAndPositionOfCell(10)
      expect(cellSizeGetterCalls).toEqual([6, 7, 8, 9, 10])
    })

    it('should return cached size and position data if cell has already been measured', () => {
      const { cellSizeAndPositionManager, cellSizeGetterCalls } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      cellSizeGetterCalls.splice(0)
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      expect(cellSizeGetterCalls).toEqual([])
    })
  })

  describe('getSizeAndPositionOfLastMeasuredCell', () => {
    it('should return an empty object if no cached cells are present', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell()).toEqual({
        offset: 0,
        size: 0
      })
    })

    it('should return size and position data for the highest/last measured cell', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      expect(cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell()).toEqual({
        offset: 50,
        size: 10
      })
    })
  })

  describe('getTotalSize', () => {
    it('should calculate total size based purely on :estimatedCellSize if no measurements have been done', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1500)
    })

    it('should calculate total size based on a mixture of actual cell sizes and :estimatedCellSize if some cells have been measured', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(49)
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1250)
    })

    it('should calculate total size based on the actual measured sizes if all cells have been measured', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(99)
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(1000)
    })
  })

  describe('getVisibleCellRange', () => {
    it('should not return any indices if :cellCount is 0', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager({
        cellCount: 0
      })
      const {
        start,
        stop
      } = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0
      })
      expect(start).toEqual(undefined)
      expect(stop).toEqual(undefined)
    })

    it('should return a visible range of cells for the beginning of the list', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      const {
        start,
        stop
      } = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0
      })
      expect(start).toEqual(0)
      expect(stop).toEqual(4)
    })

    it('should return a visible range of cells for the middle of the list where some are partially visible', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      const {
        start,
        stop
      } = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 425
      })
      // 42 and 47 are partially visible
      expect(start).toEqual(42)
      expect(stop).toEqual(47)
    })

    it('should return a visible range of cells for the end of the list', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      const {
        start,
        stop
      } = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 950
      })
      expect(start).toEqual(95)
      expect(stop).toEqual(99)
    })
  })

  describe('resetCell', () => {
    it('should clear size and position metadata for the specified index and all cells after it', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      cellSizeAndPositionManager.resetCell(3)
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(2)
      cellSizeAndPositionManager.resetCell(0)
      expect(cellSizeAndPositionManager.getLastMeasuredIndex()).toEqual(-1)
    })

    it('should not clear size and position metadata for cells before the specified index', () => {
      const { cellSizeAndPositionManager, cellSizeGetterCalls } = getCellSizeAndPositionManager()
      cellSizeAndPositionManager.getSizeAndPositionOfCell(5)
      cellSizeGetterCalls.splice(0)
      cellSizeAndPositionManager.resetCell(3)
      cellSizeAndPositionManager.getSizeAndPositionOfCell(4)
      expect(cellSizeGetterCalls).toEqual([3, 4])
    })
  })
})
