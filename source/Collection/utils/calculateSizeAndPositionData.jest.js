import calculateSizeAndPositionData from './calculateSizeAndPositionData';

describe('calculateSizeAndPositionData', () => {
  it('should query for size and position of each cell', () => {
    const cellSizeAndPositionGetterCalls = [];
    function cellSizeAndPositionGetter({index}) {
      cellSizeAndPositionGetterCalls.push(index);
      return {
        x: index * 50,
        y: 0,
        width: 50,
        height: 50,
      };
    }
    const {sectionManager} = calculateSizeAndPositionData({
      cellCount: 3,
      cellSizeAndPositionGetter,
    });
    expect(cellSizeAndPositionGetterCalls).toEqual([0, 1, 2]);
    expect(sectionManager.getTotalSectionCount()).toEqual(2);
  });

  it('should throw an error if invalid metadata is returned for a cell', () => {
    expect(() =>
      calculateSizeAndPositionData({
        cellCount: 3,
        cellSizeAndPositionGetter: () => {},
      }),
    ).toThrow();
  });
});
