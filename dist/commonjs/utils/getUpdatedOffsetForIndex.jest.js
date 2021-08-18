"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _getUpdatedOffsetForIndex = _interopRequireDefault(require("./getUpdatedOffsetForIndex"));

var _TestHelper = require("./TestHelper");

describe('getUpdatedOffsetForIndex', function () {
  function testHelper(targetIndex, currentOffset) {
    var cellMetadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _TestHelper.getCellMetadata)();
    return (0, _getUpdatedOffsetForIndex["default"])({
      cellOffset: cellMetadata[targetIndex].offset,
      cellSize: cellMetadata[targetIndex].size,
      containerSize: 50,
      currentOffset: currentOffset
    });
  }

  it('should scroll to the beginning', function () {
    expect(testHelper(0, 100)).toEqual(0);
  });
  it('should scroll forward to the middle', function () {
    expect(testHelper(4, 0)).toEqual(20);
  });
  it('should scroll backward to the middle', function () {
    expect(testHelper(2, 100)).toEqual(30);
  });
  it('should not scroll if an item is already visible', function () {
    expect(testHelper(2, 20)).toEqual(20);
  });
  it('should scroll to the end', function () {
    expect(testHelper(8, 0)).toEqual(110);
  });
  it('should honor specified :align values', function () {
    expect((0, _getUpdatedOffsetForIndex["default"])({
      align: 'auto',
      cellOffset: 50,
      cellSize: 10,
      containerSize: 50,
      currentOffset: 0
    })).toEqual(10);
    expect((0, _getUpdatedOffsetForIndex["default"])({
      align: 'start',
      cellOffset: 50,
      cellSize: 10,
      containerSize: 50,
      currentOffset: 0
    })).toEqual(50);
    expect((0, _getUpdatedOffsetForIndex["default"])({
      align: 'auto',
      cellOffset: 50,
      cellSize: 10,
      containerSize: 50,
      currentOffset: 100
    })).toEqual(50);
    expect((0, _getUpdatedOffsetForIndex["default"])({
      align: 'end',
      cellOffset: 50,
      cellSize: 10,
      containerSize: 50,
      currentOffset: 100
    })).toEqual(10);
    expect((0, _getUpdatedOffsetForIndex["default"])({
      align: 'center',
      cellOffset: 50,
      cellSize: 10,
      containerSize: 50,
      currentOffset: 100
    })).toEqual(30);
  });
});