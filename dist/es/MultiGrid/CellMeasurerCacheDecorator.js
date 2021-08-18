import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { CellMeasurerCache } from '../CellMeasurer';
/*:: type CellMeasurerCacheDecoratorParams = {
  cellMeasurerCache: CellMeasurerCache,
  columnIndexOffset: number,
  rowIndexOffset: number,
};*/

/*:: type IndexParam = {
  index: number,
};*/

/**
 * Caches measurements for a given cell.
 */
var CellMeasurerCacheDecorator =
/*#__PURE__*/
function () {
  function CellMeasurerCacheDecorator() {
    var _this = this;

    var params
    /*: CellMeasurerCacheDecoratorParams*/
    = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CellMeasurerCacheDecorator);

    _defineProperty(this, "_cellMeasurerCache", void 0);

    _defineProperty(this, "_columnIndexOffset", void 0);

    _defineProperty(this, "_rowIndexOffset", void 0);

    _defineProperty(this, "columnWidth", function (_ref) {
      var index = _ref.index;

      _this._cellMeasurerCache.columnWidth({
        index: index + _this._columnIndexOffset
      });
    });

    _defineProperty(this, "rowHeight", function (_ref2) {
      var index = _ref2.index;

      _this._cellMeasurerCache.rowHeight({
        index: index + _this._rowIndexOffset
      });
    });

    var cellMeasurerCache = params.cellMeasurerCache,
        _params$columnIndexOf = params.columnIndexOffset,
        columnIndexOffset = _params$columnIndexOf === void 0 ? 0 : _params$columnIndexOf,
        _params$rowIndexOffse = params.rowIndexOffset,
        rowIndexOffset = _params$rowIndexOffse === void 0 ? 0 : _params$rowIndexOffse;
    this._cellMeasurerCache = cellMeasurerCache;
    this._columnIndexOffset = columnIndexOffset;
    this._rowIndexOffset = rowIndexOffset;
  }

  _createClass(CellMeasurerCacheDecorator, [{
    key: "clear",
    value: function clear(rowIndex
    /*: number*/
    , columnIndex
    /*: number*/
    )
    /*: void*/
    {
      this._cellMeasurerCache.clear(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
  }, {
    key: "clearAll",
    value: function clearAll()
    /*: void*/
    {
      this._cellMeasurerCache.clearAll();
    }
  }, {
    key: "hasFixedHeight",
    value: function hasFixedHeight()
    /*: boolean*/
    {
      return this._cellMeasurerCache.hasFixedHeight();
    }
  }, {
    key: "hasFixedWidth",
    value: function hasFixedWidth()
    /*: boolean*/
    {
      return this._cellMeasurerCache.hasFixedWidth();
    }
  }, {
    key: "getHeight",
    value: function getHeight(rowIndex
    /*: number*/
    )
    /*: ?number*/
    {
      var columnIndex
      /*: ?number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return this._cellMeasurerCache.getHeight(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
  }, {
    key: "getWidth",
    value: function getWidth(rowIndex
    /*: number*/
    )
    /*: ?number*/
    {
      var columnIndex
      /*: ?number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return this._cellMeasurerCache.getWidth(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
  }, {
    key: "has",
    value: function has(rowIndex
    /*: number*/
    )
    /*: boolean*/
    {
      var columnIndex
      /*: ?number*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return this._cellMeasurerCache.has(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
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
      this._cellMeasurerCache.set(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset, (width
      /*: number*/
      ), (height
      /*: number*/
      ));
    }
  }, {
    key: "defaultHeight",
    get: function get()
    /*: number*/
    {
      return this._cellMeasurerCache.defaultHeight;
    }
  }, {
    key: "defaultWidth",
    get: function get()
    /*: number*/
    {
      return this._cellMeasurerCache.defaultWidth;
    }
  }]);

  return CellMeasurerCacheDecorator;
}();

export { CellMeasurerCacheDecorator as default };