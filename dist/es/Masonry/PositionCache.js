import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import createIntervalTree from '../vendor/intervalTree';
/*:: type RenderCallback = (index: number, left: number, top: number) => void;*/

// Position cache requirements:
//   O(log(n)) lookup of cells to render for a given viewport size
//   O(1) lookup of shortest measured column (so we know when to enter phase 1)
var PositionCache =
/*#__PURE__*/
function () {
  function PositionCache() {
    _classCallCheck(this, PositionCache);

    _defineProperty(this, "_columnSizeMap", {});

    _defineProperty(this, "_intervalTree", createIntervalTree());

    _defineProperty(this, "_leftMap", {});
  }

  _createClass(PositionCache, [{
    key: "estimateTotalHeight",
    value: function estimateTotalHeight(cellCount
    /*: number*/
    , columnCount
    /*: number*/
    , defaultCellHeight
    /*: number*/
    )
    /*: number*/
    {
      var unmeasuredCellCount = cellCount - this.count;
      return this.tallestColumnSize + Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight;
    } // Render all cells visible within the viewport range defined.

  }, {
    key: "range",
    value: function range(scrollTop
    /*: number*/
    , clientHeight
    /*: number*/
    , renderCallback
    /*: RenderCallback*/
    )
    /*: void*/
    {
      var _this = this;

      this._intervalTree.queryInterval(scrollTop, scrollTop + clientHeight, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            top = _ref2[0],
            _ = _ref2[1],
            index = _ref2[2];

        return renderCallback(index, _this._leftMap[index], top);
      });
    }
  }, {
    key: "setPosition",
    value: function setPosition(index
    /*: number*/
    , left
    /*: number*/
    , top
    /*: number*/
    , height
    /*: number*/
    )
    /*: void*/
    {
      this._intervalTree.insert([top, top + height, index]);

      this._leftMap[index] = left;
      var columnSizeMap = this._columnSizeMap;
      var columnHeight = columnSizeMap[left];

      if (columnHeight === undefined) {
        columnSizeMap[left] = top + height;
      } else {
        columnSizeMap[left] = Math.max(columnHeight, top + height);
      }
    }
  }, {
    key: "count",
    get: function get()
    /*: number*/
    {
      return this._intervalTree.count;
    }
  }, {
    key: "shortestColumnSize",
    get: function get()
    /*: number*/
    {
      var columnSizeMap = this._columnSizeMap;
      var size = 0;

      for (var i in columnSizeMap) {
        var height = columnSizeMap[(i
        /*: any*/
        )];
        size = size === 0 ? height : Math.min(size, height);
      }

      return size;
    }
  }, {
    key: "tallestColumnSize",
    get: function get()
    /*: number*/
    {
      var columnSizeMap = this._columnSizeMap;
      var size = 0;

      for (var i in columnSizeMap) {
        var height = columnSizeMap[(i
        /*: any*/
        )];
        size = Math.max(size, height);
      }

      return size;
    }
  }]);

  return PositionCache;
}();

export { PositionCache as default };