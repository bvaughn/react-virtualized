import calculateSizeAndPositionData from './calculateSizeAndPositionData';
describe('calculateSizeAndPositionData', function () {
  it('should query for size and position of each cell', function () {
    var cellSizeAndPositionGetterCalls = [];

    function cellSizeAndPositionGetter(_ref) {
      var index = _ref.index;
      cellSizeAndPositionGetterCalls.push(index);
      return {
        x: index * 50,
        y: 0,
        width: 50,
        height: 50
      };
    }

    var _calculateSizeAndPosi = calculateSizeAndPositionData({
      cellCount: 3,
      cellSizeAndPositionGetter: cellSizeAndPositionGetter
    }),
        sectionManager = _calculateSizeAndPosi.sectionManager;

    expect(cellSizeAndPositionGetterCalls).toEqual([0, 1, 2]);
    expect(sectionManager.getTotalSectionCount()).toEqual(2);
  });
  it('should throw an error if invalid metadata is returned for a cell', function () {
    expect(function () {
      return calculateSizeAndPositionData({
        cellCount: 3,
        cellSizeAndPositionGetter: function cellSizeAndPositionGetter() {}
      });
    }).toThrow();
  });
});