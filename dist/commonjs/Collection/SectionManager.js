'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Window Sections are used to group nearby cells.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This enables us to more quickly determine which cells to display in a given region of the Window.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECTION_SIZE = 100;

/**
 * Contains 0 to many Sections.
 * Grows (and adds Sections) dynamically as cells are registered.
 * Automatically adds cells to the appropriate Section(s).
 */

var SectionManager = function () {
  function SectionManager() {
    var sectionSize = arguments.length <= 0 || arguments[0] === undefined ? SECTION_SIZE : arguments[0];

    _classCallCheck(this, SectionManager);

    this._sectionSize = sectionSize;

    this._cellMetadata = [];
    this._sections = {};
  }

  /**
   * Gets all cell indices contained in the specified region.
   * A region may encompass 1 or more Sections.
   */


  _createClass(SectionManager, [{
    key: 'getCellIndices',
    value: function getCellIndices(_ref) {
      var height = _ref.height;
      var width = _ref.width;
      var x = _ref.x;
      var y = _ref.y;

      var indices = {};

      this.getSections({ height: height, width: width, x: x, y: y }).forEach(function (section) {
        return section.getCellIndices().forEach(function (index) {
          return indices[index] = index;
        });
      });

      // Object keys are strings; this function returns numbers
      return Object.keys(indices).map(function (index) {
        return indices[index];
      });
    }

    /** Get size and position information for the cell specified. */

  }, {
    key: 'getCellMetadata',
    value: function getCellMetadata(index) {
      return this._cellMetadata[index];
    }

    /** Get all Sections overlapping the specified region. */

  }, {
    key: 'getSections',
    value: function getSections(_ref2) {
      var height = _ref2.height;
      var width = _ref2.width;
      var x = _ref2.x;
      var y = _ref2.y;

      var sectionXStart = Math.floor(x / this._sectionSize);
      var sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
      var sectionYStart = Math.floor(y / this._sectionSize);
      var sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

      var sections = [];

      for (var sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
        for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
          var key = sectionX + '.' + sectionY;

          if (!this._sections[key]) {
            this._sections[key] = new _Section2.default({
              height: this._sectionSize,
              width: this._sectionSize,
              x: sectionX * this._sectionSize,
              y: sectionY * this._sectionSize
            });
          }

          sections.push(this._sections[key]);
        }
      }

      return sections;
    }

    /** Total number of Sections based on the currently registered cells. */

  }, {
    key: 'getTotalSectionCount',
    value: function getTotalSectionCount() {
      return Object.keys(this._sections).length;
    }

    /** Intended for debugger/test purposes only */

  }, {
    key: 'toString',
    value: function toString() {
      var _this = this;

      return Object.keys(this._sections).map(function (index) {
        return _this._sections[index].toString();
      });
    }

    /** Adds a cell to the appropriate Sections and registers it metadata for later retrievable. */

  }, {
    key: 'registerCell',
    value: function registerCell(_ref3) {
      var cellMetadatum = _ref3.cellMetadatum;
      var index = _ref3.index;

      this._cellMetadata[index] = cellMetadatum;

      this.getSections(cellMetadatum).forEach(function (section) {
        return section.addCellIndex(index);
      });
    }
  }]);

  return SectionManager;
}();

exports.default = SectionManager;