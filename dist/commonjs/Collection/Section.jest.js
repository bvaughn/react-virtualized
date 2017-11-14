'use strict';

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Section', function () {
  function helper() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 100 : _ref$height,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? 200 : _ref$width,
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y;

    return new _Section2.default({
      height: height,
      width: width,
      x: x,
      y: y
    });
  }

  it('should add a new cell index', function () {
    var section = helper();
    expect(section.getCellIndices()).toEqual([]);
    section.addCellIndex({ index: 0 });
    expect(section.getCellIndices()).toEqual([0]);
    section.addCellIndex({ index: 1 });
    expect(section.getCellIndices()).toEqual([0, 1]);
  });

  it('should not add a duplicate cell index', function () {
    var section = helper();
    section.addCellIndex({ index: 0 });
    section.addCellIndex({ index: 1 });
    section.addCellIndex({ index: 0 });
    section.addCellIndex({ index: 1 });
    section.addCellIndex({ index: 2 });
    expect(section.getCellIndices()).toEqual([0, 1, 2]);
  });

  it('should define a working toString() method for debugging', function () {
    var section = helper({
      height: 100,
      width: 200,
      x: 25,
      y: 50
    });

    expect(section.toString()).toEqual('25,50 200x100');
  });
});