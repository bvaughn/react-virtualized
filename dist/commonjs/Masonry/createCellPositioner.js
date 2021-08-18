'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = createCellPositioner;

/*:: import type {CellMeasurerCache, Positioner} from './Masonry';*/

/*:: type createCellPositionerParams = {
  cellMeasurerCache: CellMeasurerCache,
  columnCount: number,
  columnWidth: number,
  spacer?: number,
};*/

/*:: type resetParams = {
  columnCount: number,
  columnWidth: number,
  spacer?: number,
};*/
function createCellPositioner(_ref) {
  /*: Positioner*/
  var cellMeasurerCache = _ref.cellMeasurerCache,
    columnCount = _ref.columnCount,
    columnWidth = _ref.columnWidth,
    _ref$spacer = _ref.spacer,
    spacer = _ref$spacer === void 0 ? 0 : _ref$spacer;
  var columnHeights;
  initOrResetDerivedValues();

  function cellPositioner(index) {
    // Find the shortest column and use it.
    var columnIndex = 0;

    for (var i = 1; i < columnHeights.length; i++) {
      if (columnHeights[i] < columnHeights[columnIndex]) {
        columnIndex = i;
      }
    }

    var left = columnIndex * (columnWidth + spacer);
    var top = columnHeights[columnIndex] || 0;
    columnHeights[columnIndex] =
      top + cellMeasurerCache.getHeight(index) + spacer;
    return {
      left: left,
      top: top,
    };
  }

  function initOrResetDerivedValues() {
    /*: void*/
    // Track the height of each column.
    // Layout algorithm below always inserts into the shortest column.
    columnHeights = [];

    for (var i = 0; i < columnCount; i++) {
      columnHeights[i] = 0;
    }
  }

  function reset(
    params,
    /*: resetParams*/
  ) {
    /*: void*/
    columnCount = params.columnCount;
    columnWidth = params.columnWidth;
    spacer = params.spacer;
    initOrResetDerivedValues();
  }

  cellPositioner.reset = reset;
  return cellPositioner;
}
