import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/*:: import type {CellMeasureCache} from './types';*/
export var DEFAULT_HEIGHT = 30;
export var DEFAULT_WIDTH = 100; // Enables more intelligent mapping of a given column and row index to an item ID.
// This prevents a cell cache from being invalidated when its parent collection is modified.

/*:: type KeyMapper = (rowIndex: number, columnIndex: number) => any;*/

/*:: type CellMeasurerCacheParams = {
  defaultHeight?: number,
  defaultWidth?: number,
  fixedHeight?: boolean,
  fixedWidth?: boolean,
  minHeight?: number,
  minWidth?: number,
  keyMapper?: KeyMapper,
};*/

/*:: type Cache = {
  [key: any]: number,
};*/

/*:: type IndexParam = {
  index: number,
};*/

/**
 * Caches measurements for a given cell.
 */
var CellMeasurerCache =
/*#__PURE__*/
function () {
  function CellMeasurerCache() {
    var _this = this;

    var params
    /*: CellMeasurerCacheParams*/
    = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CellMeasurerCache);

    _defineProperty(this, "_cellHeightCache", {});

    _defineProperty(this, "_cellWidthCache", {});

    _defineProperty(this, "_columnWidthCache", {});

    _defineProperty(this, "_rowHeightCache", {});

    _defineProperty(this, "_defaultHeight", void 0);

    _defineProperty(this, "_defaultWidth", void 0);

    _defineProperty(this, "_minHeight", void 0);

    _defineProperty(this, "_minWidth", void 0);

    _defineProperty(this, "_keyMapper", void 0);

    _defineProperty(this, "_hasFixedHeight", void 0);

    _defineProperty(this, "_hasFixedWidth", void 0);

    _defineProperty(this, "_columnCount", 0);

    _defineProperty(this, "_rowCount", 0);

    _defineProperty(this, "columnWidth", function (_ref) {
      var index = _ref.index;

      var key = _this._keyMapper(0, index);

      return _this._columnWidthCache[key] !== undefined ? _this._columnWidthCache[key] : _this._defaultWidth;
    });

    _defineProperty(this, "rowHeight", function (_ref2) {
      var index = _ref2.index;

      var key = _this._keyMapper(index, 0);

      return _this._rowHeightCache[key] !== undefined ? _this._rowHeightCache[key] : _this._defaultHeight;
    });

    var defaultHeight = params.defaultHeight,
        defaultWidth = params.defaultWidth,
        fixedHeight = params.fixedHeight,
        fixedWidth = params.fixedWidth,
        keyMapper = params.keyMapper,
        minHeight = params.minHeight,
        minWidth = params.minWidth;
    this._hasFixedHeight = fixedHeight === true;
    this._hasFixedWidth = fixedWidth === true;
    this._minHeight = minHeight || 0;
    this._minWidth = minWidth || 0;
    this._keyMapper = keyMapper || defaultKeyMapper;
    this._defaultHeight = Math.max(this._minHeight, typeof defaultHeight === 'number' ? defaultHeight : DEFAULT_HEIGHT);
    this._defaultWidth = Math.max(this._minWidth, typeof defaultWidth === 'number' ? defaultWidth : DEFAULT_WIDTH);

    if (process.env.NODE_ENV !== 'production') {
      if (this._hasFixedHeight === false && this._hasFixedWidth === false) {
        console.warn("CellMeasurerCache should only measure a cell's width or height. " + 'You have configured CellMeasurerCache to measure both. ' + 'This will result in poor performance.');
      }

      if (this._hasFixedHeight === false && this._defaultHeight === 0) {
        console.warn('Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. ' + 'Failing to do so will lead to unnecessary layout and poor performance.');
      }

      if (this._hasFixedWidth === false && this._defaultWidth === 0) {
        console.warn('Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. ' + 'Failing to do so will lead to unnecessary layout and poor performance.');
      }
    }
  }

  _createClass(CellMeasurerCache, [{
    key: "clear",
    value: function clear(rowIndex
    /*: number*/
    ) {
      var columnIndex
      /*: number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var key = this._keyMapper(rowIndex, columnIndex);

      delete this._cellHeightCache[key];
      delete this._cellWidthCache[key];

      this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      this._cellHeightCache = {};
      this._cellWidthCache = {};
      this._columnWidthCache = {};
      this._rowHeightCache = {};
      this._rowCount = 0;
      this._columnCount = 0;
    }
  }, {
    key: "hasFixedHeight",
    value: function hasFixedHeight()
    /*: boolean*/
    {
      return this._hasFixedHeight;
    }
  }, {
    key: "hasFixedWidth",
    value: function hasFixedWidth()
    /*: boolean*/
    {
      return this._hasFixedWidth;
    }
  }, {
    key: "getHeight",
    value: function getHeight(rowIndex
    /*: number*/
    )
    /*: number*/
    {
      var columnIndex
      /*: number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this._hasFixedHeight) {
        return this._defaultHeight;
      } else {
        var _key = this._keyMapper(rowIndex, columnIndex);

        return this._cellHeightCache[_key] !== undefined ? Math.max(this._minHeight, this._cellHeightCache[_key]) : this._defaultHeight;
      }
    }
  }, {
    key: "getWidth",
    value: function getWidth(rowIndex
    /*: number*/
    )
    /*: number*/
    {
      var columnIndex
      /*: number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this._hasFixedWidth) {
        return this._defaultWidth;
      } else {
        var _key2 = this._keyMapper(rowIndex, columnIndex);

        return this._cellWidthCache[_key2] !== undefined ? Math.max(this._minWidth, this._cellWidthCache[_key2]) : this._defaultWidth;
      }
    }
  }, {
    key: "has",
    value: function has(rowIndex
    /*: number*/
    )
    /*: boolean*/
    {
      var columnIndex
      /*: number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var key = this._keyMapper(rowIndex, columnIndex);

      return this._cellHeightCache[key] !== undefined;
    }
  }, {
    key: "set",
    value: function set(rowIndex
    /*: number*/
    , columnIndex
    /*: number*/
    , width
    /*: number*/
    , height
    /*: number*/
    )
    /*: void*/
    {
      var key = this._keyMapper(rowIndex, columnIndex);

      if (columnIndex >= this._columnCount) {
        this._columnCount = columnIndex + 1;
      }

      if (rowIndex >= this._rowCount) {
        this._rowCount = rowIndex + 1;
      } // Size is cached per cell so we don't have to re-measure if cells are re-ordered.


      this._cellHeightCache[key] = height;
      this._cellWidthCache[key] = width;

      this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
    }
  }, {
    key: "_updateCachedColumnAndRowSizes",
    value: function _updateCachedColumnAndRowSizes(rowIndex
    /*: number*/
    , columnIndex
    /*: number*/
    ) {
      // :columnWidth and :rowHeight are derived based on all cells in a column/row.
      // Pre-cache these derived values for faster lookup later.
      // Reads are expected to occur more frequently than writes in this case.
      // Only update non-fixed dimensions though to avoid doing unnecessary work.
      if (!this._hasFixedWidth) {
        var columnWidth = 0;

        for (var i = 0; i < this._rowCount; i++) {
          columnWidth = Math.max(columnWidth, this.getWidth(i, columnIndex));
        }

        var columnKey = this._keyMapper(0, columnIndex);

        this._columnWidthCache[columnKey] = columnWidth;
      }

      if (!this._hasFixedHeight) {
        var rowHeight = 0;

        for (var _i = 0; _i < this._columnCount; _i++) {
          rowHeight = Math.max(rowHeight, this.getHeight(rowIndex, _i));
        }

        var rowKey = this._keyMapper(rowIndex, 0);

        this._rowHeightCache[rowKey] = rowHeight;
      }
    }
  }, {
    key: "defaultHeight",
    get: function get()
    /*: number*/
    {
      return this._defaultHeight;
    }
  }, {
    key: "defaultWidth",
    get: function get()
    /*: number*/
    {
      return this._defaultWidth;
    }
  }]);

  return CellMeasurerCache;
}();

export { CellMeasurerCache as default };

function defaultKeyMapper(rowIndex
/*: number*/
, columnIndex
/*: number*/
) {
  return "".concat(rowIndex, "-").concat(columnIndex);
}