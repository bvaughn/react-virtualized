import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _extends from "@babel/runtime/helpers/extends";
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import MultiGrid from './MultiGrid';
import { CellMeasurerCache } from '../CellMeasurer'; // These tests only focus on what MultiGrid does specifically.
// The inner Grid component is tested in depth elsewhere.

describe('MultiGrid', function () {
  function defaultCellRenderer(_ref) {
    var columnIndex = _ref.columnIndex,
        key = _ref.key,
        rowIndex = _ref.rowIndex,
        style = _ref.style;
    return React.createElement("div", {
      className: "gridItem",
      key: key,
      style: style
    }, "row:".concat(rowIndex, ", column:").concat(columnIndex));
  }

  function getMarkup() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return React.createElement(MultiGrid, _extends({
      cellRenderer: defaultCellRenderer,
      columnCount: 50,
      columnWidth: 50,
      fixedColumnCount: 2,
      fixedRowCount: 1,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 0,
      autoHeight: false,
      rowHeight: 20,
      rowCount: 100,
      width: 400
    }, props));
  }

  describe('fixed columns and rows', function () {
    it('should render 4 Grids when configured for fixed columns and rows', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 1,
        fixedRowCount: 1
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(4);

      var _grids = _slicedToArray(grids, 4),
          topLeft = _grids[0],
          topRight = _grids[1],
          bottomLeft = _grids[2],
          bottomRight = _grids[3];

      expect(topLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topLeft.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
    it('should render 2 Grids when configured for fixed columns only', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 1,
        fixedRowCount: 0
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(2);

      var _grids2 = _slicedToArray(grids, 2),
          bottomLeft = _grids2[0],
          bottomRight = _grids2[1];

      expect(bottomLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
    it('should render 2 Grids when configured for fixed rows only', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 1
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(2);

      var _grids3 = _slicedToArray(grids, 2),
          topRight = _grids3[0],
          bottomRight = _grids3[1];

      expect(topRight.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
    it('should render 1 Grid when configured for neither fixed columns and rows', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 0
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(1);

      var _grids4 = _slicedToArray(grids, 1),
          bottomRight = _grids4[0];

      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
    it('should adjust the number of Grids when fixed column or row counts change', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 2,
        fixedRowCount: 1
      })));
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(4);
      rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 0
      })));
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(1);
      rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 0,
        fixedRowCount: 2
      })));
      expect(rendered.querySelectorAll('.ReactVirtualized__Grid').length).toEqual(2);
    });
    it('should allow scrolling of fixed Grids when configured for fixed columns and rows with scroll interaction', function () {
      var rendered = findDOMNode(render(getMarkup({
        enableFixedColumnScroll: true,
        enableFixedRowScroll: true,
        fixedColumnCount: 1,
        fixedRowCount: 1
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(4);

      var _grids5 = _slicedToArray(grids, 4),
          topLeft = _grids5[0],
          topRight = _grids5[1],
          bottomLeft = _grids5[2],
          bottomRight = _grids5[3];

      expect(topLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topLeft.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(topRight.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-y')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
  });
  describe('hideTopRightGridScrollbar, hideBottomLeftGridScrollbar should hide the scrollbars', function () {
    function getScrollbarSize20() {
      return 20;
    }

    it('should add scroll wrappers to hide scroll bar when configured for fixed columns and rows with scroll interaction', function () {
      var rendered = findDOMNode(render(getMarkup({
        enableFixedColumnScroll: true,
        enableFixedRowScroll: true,
        fixedColumnCount: 1,
        fixedRowCount: 1,
        hideTopRightGridScrollbar: true,
        hideBottomLeftGridScrollbar: true,
        getScrollbarSize: getScrollbarSize20
      })));
      var wrappers = rendered.querySelectorAll('.TopRightGrid_ScrollWrapper');
      expect(wrappers.length).toEqual(1);

      var _wrappers = wrappers,
          _wrappers2 = _slicedToArray(_wrappers, 1),
          topRightWrapper = _wrappers2[0];

      wrappers = rendered.querySelectorAll('.BottomLeftGrid_ScrollWrapper');
      expect(wrappers.length).toEqual(1);

      var _wrappers3 = wrappers,
          _wrappers4 = _slicedToArray(_wrappers3, 1),
          bottomLeftWrapper = _wrappers4[0];

      expect(topRightWrapper.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topRightWrapper.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(bottomLeftWrapper.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(bottomLeftWrapper.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(topRightWrapper.style.getPropertyValue('height')).toEqual('20px');
      expect(bottomLeftWrapper.style.getPropertyValue('height')).toEqual('280px');
      expect(topRightWrapper.style.getPropertyValue('width')).toEqual('350px');
      expect(bottomLeftWrapper.style.getPropertyValue('width')).toEqual('50px');
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(4);

      var _grids6 = _slicedToArray(grids, 4),
          topLeft = _grids6[0],
          topRight = _grids6[1],
          bottomLeft = _grids6[2],
          bottomRight = _grids6[3];

      expect(topLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(topLeft.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(topRight.style.getPropertyValue('overflow-y')).toEqual('hidden');
      expect(topRight.style.getPropertyValue('height')).toEqual('40px');
      expect(bottomLeft.style.getPropertyValue('overflow-x')).toEqual('hidden');
      expect(bottomLeft.style.getPropertyValue('overflow-y')).toEqual('auto');
      expect(bottomLeft.style.getPropertyValue('width')).toEqual('70px');
      expect(bottomRight.style.getPropertyValue('overflow-x')).toEqual('auto');
      expect(bottomRight.style.getPropertyValue('overflow-y')).toEqual('auto');
    });
  });
  describe('#recomputeGridSize', function () {
    it('should clear calculated cached styles in recomputeGridSize', function () {
      var fixedRowHeight = 75;
      var fixedColumnWidth = 100;

      function variableRowHeight(_ref2) {
        var index = _ref2.index;

        if (index === 0) {
          return fixedRowHeight;
        }

        return 20;
      }

      function variableColumnWidth(_ref3) {
        var index = _ref3.index;

        if (index === 0) {
          return fixedColumnWidth;
        }

        return 50;
      }

      var multiGrid;
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 1,
        fixedRowCount: 1,
        rowHeight: variableRowHeight,
        columnWidth: variableColumnWidth,
        ref: function ref(_ref4) {
          multiGrid = _ref4;
        }
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(grids.length).toEqual(4);

      var _grids7 = _slicedToArray(grids, 4),
          topLeft = _grids7[0],
          topRight = _grids7[1],
          bottomLeft = _grids7[2],
          bottomRight = _grids7[3];

      expect(topLeft.style.getPropertyValue('height')).toEqual('75px');
      expect(topRight.style.getPropertyValue('height')).toEqual('75px');
      expect(bottomLeft.style.getPropertyValue('height')).toEqual('225px');
      expect(bottomRight.style.getPropertyValue('height')).toEqual('225px');
      expect(topLeft.style.getPropertyValue('width')).toEqual('100px');
      expect(topRight.style.getPropertyValue('width')).toEqual('300px');
      expect(bottomLeft.style.getPropertyValue('width')).toEqual('100px');
      expect(bottomRight.style.getPropertyValue('width')).toEqual('300px');
      expect(multiGrid._topGridHeight).toEqual(75);
      expect(multiGrid._leftGridWidth).toEqual(100);
      fixedRowHeight = 125;
      fixedColumnWidth = 75;
      multiGrid.recomputeGridSize();
      expect(multiGrid._topGridHeight).toEqual(125);
      expect(multiGrid._leftGridWidth).toEqual(75);
      multiGrid.forceUpdate();
      var gridsAfter = rendered.querySelectorAll('.ReactVirtualized__Grid');
      expect(gridsAfter.length).toEqual(4);

      var _gridsAfter = _slicedToArray(gridsAfter, 4),
          topLeftAfter = _gridsAfter[0],
          topRightAfter = _gridsAfter[1],
          bottomLeftAfter = _gridsAfter[2],
          bottomRightAfter = _gridsAfter[3];

      expect(topLeftAfter.style.getPropertyValue('height')).toEqual('125px');
      expect(topRightAfter.style.getPropertyValue('height')).toEqual('125px');
      expect(bottomLeftAfter.style.getPropertyValue('height')).toEqual('175px');
      expect(bottomRightAfter.style.getPropertyValue('height')).toEqual('175px');
      expect(topLeftAfter.style.getPropertyValue('width')).toEqual('75px');
      expect(topRightAfter.style.getPropertyValue('width')).toEqual('325px');
      expect(bottomLeftAfter.style.getPropertyValue('width')).toEqual('75px');
      expect(bottomRightAfter.style.getPropertyValue('width')).toEqual('325px');
    });
  });
  describe('scrollToColumn and scrollToRow', function () {
    it('should adjust :scrollLeft for the main Grid when scrollToColumn is used', function () {
      var rendered = findDOMNode(render(getMarkup({
        columnWidth: 50,
        fixedColumnCount: 2,
        scrollToAlignment: 'start',
        scrollToColumn: 19
      }))); // Bottom-right Grid is the last Grid

      var grid = rendered.querySelectorAll('.ReactVirtualized__Grid')[3]; // 20th column, less 2 for the fixed-column Grid, 50px column width

      expect(grid.scrollLeft).toEqual(850);
    });
    it('should adjust :scrollTop for the main Grid when scrollToRow is used', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedRowCount: 1,
        rowHeight: 50,
        scrollToAlignment: 'start',
        scrollToRow: 19
      }))); // Bottom-right Grid is the last Grid

      var grid = rendered.querySelectorAll('.ReactVirtualized__Grid')[3]; // 20th row, less 1 for the fixed-row Grid, 50px row width

      expect(grid.scrollTop).toEqual(900);
    });
  });
  describe('#forceUpdateGrids', function () {
    it('should call forceUpdate() on inner Grids', function () {
      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (_ref5) {
        var key = _ref5.key;
        return React.createElement("div", {
          key: key,
          style: {}
        });
      });
      var rendered = render(getMarkup({
        cellRenderer: cellRenderer,
        columnCount: 2,
        fixedColumnCount: 1,
        fixedRowCount: 1,
        rowCount: 2
      }));
      expect(cellRenderer.mock.calls).toHaveLength(4);
      cellRenderer.mockReset();
      rendered.forceUpdateGrids();
      expect(cellRenderer.mock.calls).toHaveLength(4);
    });
  });
  describe('#invalidateCellSizeAfterRender', function () {
    it('should call invalidateCellSizeAfterRender() on inner Grids', function () {
      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (_ref6) {
        var key = _ref6.key;
        return React.createElement("div", {
          key: key,
          style: {}
        });
      });
      var rendered = render(getMarkup({
        cellRenderer: cellRenderer,
        columnCount: 2,
        fixedColumnCount: 1,
        fixedRowCount: 1,
        rowCount: 2
      }));
      cellRenderer.mockReset();
      rendered.invalidateCellSizeAfterRender({
        columnIndex: 0,
        rowIndex: 0
      });
      rendered.forceUpdate();
      expect(cellRenderer.mock.calls).toHaveLength(4);
    });
    it('should specify itself as the :parent for CellMeasurer rendered cells', function () {
      // HACK For some reason, using Jest mock broke here
      var savedParent;

      function cellRenderer(_ref7) {
        var key = _ref7.key,
            parent = _ref7.parent;
        savedParent = parent;
        return React.createElement("div", {
          key: key,
          style: {}
        });
      }

      var rendered = render(getMarkup({
        cellRenderer: cellRenderer,
        columnCount: 2,
        fixedColumnCount: 1,
        fixedRowCount: 1,
        rowCount: 2
      }));
      expect(savedParent).toBe(rendered);
    });
  });
  describe('styles', function () {
    it('should support custom style for the outer MultiGrid wrapper element', function () {
      var rendered = findDOMNode(render(getMarkup({
        style: {
          backgroundColor: 'black'
        }
      })));
      expect(rendered.style.backgroundColor).toEqual('black');
    });
    it('should support custom styles for each Grid', function () {
      var rendered = findDOMNode(render(getMarkup({
        fixedColumnCount: 2,
        fixedRowCount: 1,
        styleBottomLeftGrid: {
          backgroundColor: 'green'
        },
        styleBottomRightGrid: {
          backgroundColor: 'red'
        },
        styleTopLeftGrid: {
          backgroundColor: 'blue'
        },
        styleTopRightGrid: {
          backgroundColor: 'purple'
        }
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      var topLeftGrid = grids[0];
      var topRightGrid = grids[1];
      var bottomLeftGrid = grids[2];
      var bottomRightGrid = grids[3];
      expect(topLeftGrid.style.backgroundColor).toEqual('blue');
      expect(topRightGrid.style.backgroundColor).toEqual('purple');
      expect(bottomLeftGrid.style.backgroundColor).toEqual('green');
      expect(bottomRightGrid.style.backgroundColor).toEqual('red');
    });
  });
  describe('scrollTop and scrollLeft', function () {
    it('should adjust :scrollLeft for top-right and main grids when scrollLeft is used', function () {
      var rendered = findDOMNode(render(getMarkup({
        columnWidth: 50,
        fixedColumnCount: 2,
        scrollLeft: 850
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      var topRightGrid = grids[1];
      var bottomRightGrid = grids[3];
      expect(topRightGrid.scrollLeft).toEqual(850);
      expect(bottomRightGrid.scrollLeft).toEqual(850);
    });
    it('should adjust :scrollTop for bottom-left and main grids when scrollTop is used', function () {
      var rendered = findDOMNode(render(getMarkup({
        columnWidth: 50,
        fixedColumnCount: 2,
        scrollTop: 500
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      var bottomLeftGrid = grids[2];
      var bottomRightGrid = grids[3];
      expect(bottomLeftGrid.scrollTop).toEqual(500);
      expect(bottomRightGrid.scrollTop).toEqual(500);
    });
    it('should adjust :scrollTop and :scrollLeft when scrollTop and scrollLeft change', function () {
      render(getMarkup());
      var rendered = findDOMNode(render(getMarkup({
        scrollTop: 750,
        scrollLeft: 900
      })));
      var grids = rendered.querySelectorAll('.ReactVirtualized__Grid');
      var topRightGrid = grids[1];
      var bottomLeftGrid = grids[2];
      var bottomRightGrid = grids[3];
      expect(topRightGrid.scrollLeft).toEqual(900);
      expect(bottomRightGrid.scrollLeft).toEqual(900);
      expect(bottomLeftGrid.scrollTop).toEqual(750);
      expect(bottomRightGrid.scrollTop).toEqual(750);
    });
    it('should not crash when decreasing :rowCount', function () {
      render(getMarkup());
      var updated = render(getMarkup({
        rowCount: 2
      }));
      expect(updated.props.rowCount).toEqual(2);
    });
    it('should not crash when decreasing :columnCount', function () {
      render(getMarkup());
      var updated = render(getMarkup({
        columnCount: 3
      }));
      expect(updated.props.columnCount).toEqual(3);
    });
  });
  describe('deferredMeasurementCache', function () {
    function getDeferredMeasurementCache() {
      var deferredMeasurementCache = new CellMeasurerCache({
        fixedHeight: true,
        fixedWidth: true
      });
      deferredMeasurementCache._columnIndices = {};
      deferredMeasurementCache._rowIndices = {};

      deferredMeasurementCache.has = function (rowIndex, columnIndex) {
        deferredMeasurementCache._columnIndices[columnIndex] = columnIndex;
        deferredMeasurementCache._rowIndices[rowIndex] = rowIndex;
        return true;
      };

      return deferredMeasurementCache;
    }

    it('should wrap top-right and bottom-right deferredMeasurementCache if fixedColumnCount is > 0', function () {
      var deferredMeasurementCache = getDeferredMeasurementCache();
      render(getMarkup({
        deferredMeasurementCache: deferredMeasurementCache,
        columnCount: 3,
        fixedColumnCount: 1,
        fixedRowCount: 0,
        rowCount: 1
      }));
      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual(['0', '1', '2']);
    });
    it('should not wrap top-right and bottom-right deferredMeasurementCache if fixedColumnCount is 0', function () {
      var deferredMeasurementCache = getDeferredMeasurementCache();
      render(getMarkup({
        deferredMeasurementCache: deferredMeasurementCache,
        columnCount: 2,
        fixedColumnCount: 0,
        fixedRowCount: 0,
        rowCount: 1
      }));
      expect(Object.keys(deferredMeasurementCache._columnIndices)).toEqual(['0', '1']);
    });
    it('should wrap bottom-left and bottom-right deferredMeasurementCache if fixedRowCount is > 0', function () {
      var deferredMeasurementCache = getDeferredMeasurementCache();
      render(getMarkup({
        deferredMeasurementCache: deferredMeasurementCache,
        columnCount: 1,
        fixedColumnCount: 0,
        fixedRowCount: 1,
        rowCount: 3
      }));
      expect(Object.keys(deferredMeasurementCache._rowIndices)).toEqual(['0', '1', '2']);
    });
    it('should not wrap bottom-left and bottom-right deferredMeasurementCache if fixedRowCount is 0', function () {
      var deferredMeasurementCache = getDeferredMeasurementCache();
      render(getMarkup({
        deferredMeasurementCache: deferredMeasurementCache,
        columnCount: 1,
        fixedColumnCount: 0,
        fixedRowCount: 0,
        rowCount: 2
      }));
      expect(Object.keys(deferredMeasurementCache._rowIndices)).toEqual(['0', '1']);
    });
  });
  describe('onScrollbarPresenceChange', function () {
    function getScrollbarSize20() {
      return 20;
    }

    it('should not trigger on-mount if scrollbars are hidden', function () {
      var onScrollbarPresenceChange = jest.fn();
      render(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });
    it('should trigger on-mount if scrollbars are visible', function () {
      var onScrollbarPresenceChange = jest.fn();
      render(getMarkup({
        columnCount: 100,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 100
      }));
      expect(onScrollbarPresenceChange).toHaveBeenCalled();
      var args = onScrollbarPresenceChange.mock.calls[0][0];
      expect(args.horizontal).toBe(true);
      expect(args.size).toBe(getScrollbarSize20());
      expect(args.vertical).toBe(true);
    });
    it('should trigger on-update if scrollbar visibility has changed', function () {
      var onScrollbarPresenceChange = jest.fn();
      render(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
      render(getMarkup({
        columnCount: 100,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 100
      }));
      expect(onScrollbarPresenceChange).toHaveBeenCalled();
      var args = onScrollbarPresenceChange.mock.calls[0][0];
      expect(args.horizontal).toBe(true);
      expect(args.size).toBe(getScrollbarSize20());
      expect(args.vertical).toBe(true);
    });
    it('should not trigger on-update if scrollbar visibility does not change', function () {
      var onScrollbarPresenceChange = jest.fn();
      render(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
      render(getMarkup({
        columnCount: 2,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 2
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });
  });
});