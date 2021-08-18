"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _defaultOverscanIndicesGetter = _interopRequireWildcard(require("./defaultOverscanIndicesGetter"));

describe('overscanIndicesGetter', function () {
  function testHelper(_ref) {
    var cellCount = _ref.cellCount,
        startIndex = _ref.startIndex,
        stopIndex = _ref.stopIndex,
        overscanCellsCount = _ref.overscanCellsCount,
        scrollDirection = _ref.scrollDirection;
    return (0, _defaultOverscanIndicesGetter["default"])({
      cellCount: cellCount,
      overscanCellsCount: overscanCellsCount,
      scrollDirection: scrollDirection,
      startIndex: startIndex,
      stopIndex: stopIndex
    });
  }

  it('should not overscan if :overscanCellsCount is 0', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 0,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 20
    });
    expect(testHelper({
      cellCount: 100,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 0,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 20
    });
  });
  it('should overscan forward', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 20,
      stopIndex: 30,
      overscanCellsCount: 10,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 20,
      overscanStopIndex: 40
    });
  });
  it('should overscan backward', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 20,
      stopIndex: 30,
      overscanCellsCount: 10,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 30
    });
  });
  it('should not overscan beyond the start of the list', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 5,
      stopIndex: 15,
      overscanCellsCount: 10,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 15
    });
  });
  it('should not overscan beyond the end of the list', function () {
    expect(testHelper({
      cellCount: 25,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 10,
      scrollDirection: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 24
    });
  });
});