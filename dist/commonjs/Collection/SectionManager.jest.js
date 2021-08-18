"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _SectionManager = _interopRequireDefault(require("./SectionManager"));

var _TestData = require("./TestData");

function initSectionManager() {
  var sectionManager = new _SectionManager["default"](_TestData.SECTION_SIZE);

  _TestData.CELLS.forEach(function (cellMetadatum, index) {
    sectionManager.registerCell({
      cellMetadatum: cellMetadatum,
      index: index
    });
  });

  return sectionManager;
}

function verifySections(sectionManager, sizeAndPosition, expectedSizeAndPositionInfos) {
  var sections = sectionManager.getSections(sizeAndPosition);
  expect(sections.length).toEqual(expectedSizeAndPositionInfos.length);
  expectedSizeAndPositionInfos.forEach(function (sizeAndPosition) {
    var match = sections.find(function (section) {
      return section.x === sizeAndPosition.x && section.y === sizeAndPosition.y;
    });
    expect(!!match).toEqual(true);
  });
}

describe('SectionManager', function () {
  it('creates the appropriate number of Sections', function () {
    var sectionManager = initSectionManager();
    expect(sectionManager.getTotalSectionCount()).toEqual(6);
  });
  it('returns the proper Sections based on the specified area', function () {
    var sectionManager = initSectionManager();
    verifySections(sectionManager, {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    }, [{
      x: 0,
      y: 0
    }]);
    verifySections(sectionManager, {
      x: 1,
      y: 1,
      width: 1,
      height: 1
    }, [{
      x: 0,
      y: 0
    }]);
    verifySections(sectionManager, {
      x: 0,
      y: 0,
      width: 4,
      height: 4
    }, [{
      x: 0,
      y: 0
    }, {
      x: 2,
      y: 0
    }, {
      x: 0,
      y: 2
    }, {
      x: 2,
      y: 2
    }]);
    verifySections(sectionManager, {
      x: 4,
      y: 0,
      width: 2,
      height: 3
    }, [{
      x: 4,
      y: 0
    }, {
      x: 4,
      y: 2
    }]);
  });
  it('assigns cells to the appropriate sections', function () {
    var sectionManager = initSectionManager();
    expect(sectionManager.getCellIndices({
      x: 0,
      y: 0,
      width: 2,
      height: 2
    })).toEqual([0]);
    expect(sectionManager.getCellIndices({
      x: 2,
      y: 0,
      width: 2,
      height: 2
    })).toEqual([1, 2, 3]);
    expect(sectionManager.getCellIndices({
      x: 4,
      y: 0,
      width: 2,
      height: 2
    })).toEqual([6]);
    expect(sectionManager.getCellIndices({
      x: 0,
      y: 2,
      width: 2,
      height: 2
    })).toEqual([4]);
    expect(sectionManager.getCellIndices({
      x: 2,
      y: 2,
      width: 2,
      height: 2
    })).toEqual([3, 4, 5]);
    expect(sectionManager.getCellIndices({
      x: 4,
      y: 2,
      width: 2,
      height: 2
    })).toEqual([7, 8, 9]);
  });
});