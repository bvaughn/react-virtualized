"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _calculateSizeAndPositionDataAndUpdateScrollOffset = _interopRequireDefault(require("./calculateSizeAndPositionDataAndUpdateScrollOffset"));

describe('calculateSizeAndPositionDataAndUpdateScrollOffset', function () {
  function helper() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$cellCount = _ref.cellCount,
        cellCount = _ref$cellCount === void 0 ? 100 : _ref$cellCount,
        _ref$cellSize = _ref.cellSize,
        cellSize = _ref$cellSize === void 0 ? 10 : _ref$cellSize,
        _ref$computeMetadataC = _ref.computeMetadataCallbackProps,
        computeMetadataCallbackProps = _ref$computeMetadataC === void 0 ? {} : _ref$computeMetadataC,
        _ref$nextCellsCount = _ref.nextCellsCount,
        nextCellsCount = _ref$nextCellsCount === void 0 ? 100 : _ref$nextCellsCount,
        _ref$nextCellSize = _ref.nextCellSize,
        nextCellSize = _ref$nextCellSize === void 0 ? 10 : _ref$nextCellSize,
        nextScrollToIndex = _ref.nextScrollToIndex,
        scrollToIndex = _ref.scrollToIndex;

    var computeMetadataCallbackCalls = [];
    var updateScrollOffsetForScrollToIndexCalls = [];
    (0, _calculateSizeAndPositionDataAndUpdateScrollOffset["default"])({
      cellCount: cellCount,
      cellSize: cellSize,
      computeMetadataCallback: function computeMetadataCallback(params) {
        return computeMetadataCallbackCalls.push(params);
      },
      computeMetadataCallbackProps: computeMetadataCallbackProps,
      nextCellsCount: nextCellsCount,
      nextCellSize: nextCellSize,
      nextScrollToIndex: nextScrollToIndex,
      scrollToIndex: scrollToIndex,
      updateScrollOffsetForScrollToIndex: function updateScrollOffsetForScrollToIndex(params) {
        return updateScrollOffsetForScrollToIndexCalls.push(params);
      }
    });
    return {
      computeMetadataCallbackCalls: computeMetadataCallbackCalls,
      updateScrollOffsetForScrollToIndexCalls: updateScrollOffsetForScrollToIndexCalls
    };
  }

  it('should call :computeMetadataCallback if :cellCount has changed', function () {
    var _helper = helper({
      cellCount: 100,
      nextCellsCount: 200
    }),
        computeMetadataCallbackCalls = _helper.computeMetadataCallbackCalls;

    expect(computeMetadataCallbackCalls.length).toEqual(1);
  });
  it('should call :computeMetadataCallback if numeric :cellSize has changed', function () {
    var _helper2 = helper({
      cellSize: 10,
      nextCellSize: 20
    }),
        computeMetadataCallbackCalls = _helper2.computeMetadataCallbackCalls;

    expect(computeMetadataCallbackCalls.length).toEqual(1);
  });
  it('should not call :computeMetadataCallback if :cellSize callback has changed', function () {
    var _helper3 = helper({
      cellSize: function cellSize() {},
      nextCellSize: function nextCellSize() {}
    }),
        computeMetadataCallbackCalls = _helper3.computeMetadataCallbackCalls;

    expect(computeMetadataCallbackCalls.length).toEqual(0);
  });
  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex is not specified', function () {
    var _helper4 = helper(),
        updateScrollOffsetForScrollToIndexCalls = _helper4.updateScrollOffsetForScrollToIndexCalls;

    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0);
  });
  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex has also changed', function () {
    var _helper5 = helper({
      scrollToIndex: 10,
      nextScrollToIndex: 20
    }),
        updateScrollOffsetForScrollToIndexCalls = _helper5.updateScrollOffsetForScrollToIndexCalls;

    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0);
  });
  it('should not call :computeMetadataCallback if the above conditions are not true', function () {
    var _helper6 = helper(),
        computeMetadataCallbackCalls = _helper6.computeMetadataCallbackCalls;

    expect(computeMetadataCallbackCalls.length).toEqual(0);
  });
});