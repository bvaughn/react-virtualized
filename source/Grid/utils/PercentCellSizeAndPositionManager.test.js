/** @flow */
import PercentCellSizeAndPositionManager from './PercentCellSizeAndPositionManager'

describe('PercentCellSizeAndPositionManager', () => {
  function getCellSizeAndPositionManager ({
    cellCount = 10,
    totalSize = 200
  } = {}) {
    const cellSizeGetterCalls = []
    const cellSizeAndPositionManager = new PercentCellSizeAndPositionManager({
      cellCount,
      cellSizeGetter: ({ index }) => {
        cellSizeGetterCalls.push(index)
        return 10
      },
      totalSize
    })

    return {
      cellSizeAndPositionManager,
      cellSizeGetterCalls
    }
  }

  describe('configure', () => {
    it('should update inner :cellCount and :totalSize', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(10)
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(200)

      cellSizeAndPositionManager.configure({
        cellCount: 20,
        totalSize: 300
      })
      expect(cellSizeAndPositionManager.getCellCount()).toEqual(20)
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(300)
    })
  })

  describe('getUnit', () => {
    it('should return "%"', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getUnit()).toEqual('%')
    })
  })

  describe('getSizeAndPositionOfCell', () => {
    it('should error if an invalid index is specified', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(() => cellSizeAndPositionManager.getSizeAndPositionOfCell(-1)).toThrow()
      expect(() => cellSizeAndPositionManager.getSizeAndPositionOfCell(100)).toThrow()
    })

    it('should return the correct size and position information for the requested cell', () => {
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
      cellSizeAndPositionManager.getSizeAndPositionOfCell(9)
      expect(cellSizeGetterCalls).toEqual([6, 7, 8, 9])
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
    it('should return fixed total size', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      expect(cellSizeAndPositionManager.getTotalSize()).toEqual(200)
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

    it('should return entire range of cells for non-zero cell count', () => {
      const { cellSizeAndPositionManager } = getCellSizeAndPositionManager()
      const {
        start,
        stop
      } = cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: 50,
        offset: 0
      })
      expect(start).toEqual(0)
      expect(stop).toEqual(9)
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
