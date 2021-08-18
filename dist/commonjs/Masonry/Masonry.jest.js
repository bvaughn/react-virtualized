"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _testUtils = require("react-dom/test-utils");

var _TestUtils = require("../TestUtils");

var _createCellPositioner = _interopRequireDefault(require("./createCellPositioner"));

var _Masonry = _interopRequireDefault(require("./Masonry"));

var _CellMeasurer = require("../CellMeasurer");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ALTERNATING_CELL_HEIGHTS = [100, 50, 100, 150];
var CELL_SIZE_MULTIPLIER = 50;
var COLUMN_COUNT = 3;

function assertVisibleCells(rendered, text) {
  expect(Array.from(rendered.querySelectorAll('.cell')).map(function (node) {
    return node.textContent;
  }).sort().join(',')).toEqual(text);
}

function createCellMeasurerCache() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new _CellMeasurer.CellMeasurerCache(_objectSpread({
    defaultHeight: CELL_SIZE_MULTIPLIER,
    defaultWidth: CELL_SIZE_MULTIPLIER,
    fixedWidth: true,
    keyMapper: function keyMapper(index) {
      return index;
    }
  }, props));
}

function createCellPositioner(cache) {
  return (0, _createCellPositioner["default"])({
    cellMeasurerCache: cache,
    columnCount: COLUMN_COUNT,
    columnWidth: CELL_SIZE_MULTIPLIER
  });
}

function createCellRenderer(cache, renderCallback) {
  renderCallback = typeof renderCallback === 'function' ? renderCallback : function (index) {
    return index;
  };
  return function cellRenderer(_ref) {
    var index = _ref.index,
        isScrolling = _ref.isScrolling,
        key = _ref.key,
        parent = _ref.parent,
        style = _ref.style;
    var height = ALTERNATING_CELL_HEIGHTS[index % ALTERNATING_CELL_HEIGHTS.length];
    var width = CELL_SIZE_MULTIPLIER;
    return React.createElement(_CellMeasurer.CellMeasurer, {
      cache: cache,
      index: index,
      key: key,
      parent: parent
    }, React.createElement("div", {
      className: "cell",
      ref: function ref(_ref2) {
        if (_ref2) {
          // Accounts for the fact that JSDom doesn't support measurements.
          Object.defineProperty(_ref2, 'offsetHeight', {
            configurable: true,
            value: height
          });
          Object.defineProperty(_ref2, 'offsetWidth', {
            configurable: true,
            value: width
          });
        }
      },
      style: _objectSpread({}, style, {
        minHeight: height,
        minWidth: width
      })
    }, renderCallback(index, {
      index: index,
      isScrolling: isScrolling,
      key: key,
      parent: parent,
      style: style
    })));
  };
}

function getMarkup() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cellMeasurerCache = props.cellMeasurerCache || createCellMeasurerCache();
  return React.createElement(_Masonry["default"], (0, _extends2["default"])({
    cellCount: 1000,
    cellMeasurerCache: cellMeasurerCache,
    cellPositioner: createCellPositioner(cellMeasurerCache),
    cellRenderer: createCellRenderer(cellMeasurerCache),
    columnCount: COLUMN_COUNT,
    height: CELL_SIZE_MULTIPLIER * 2,
    overscanByPixels: CELL_SIZE_MULTIPLIER,
    width: CELL_SIZE_MULTIPLIER * COLUMN_COUNT
  }, props));
}

function simulateScroll(masonry) {
  var scrollTop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var target = {
    scrollTop: scrollTop
  };
  masonry._scrollingContainer = target; // HACK to work around _onScroll target check

  var masonryNode = (0, _reactDom.findDOMNode)(masonry);
  masonryNode.scrollTop = scrollTop;

  _testUtils.Simulate.scroll(masonryNode);
}

describe('Masonry', function () {
  beforeEach(_TestUtils.render.unmount);
  describe('layout and measuring', function () {
    it('should measure only enough cells required for initial render', function () {
      // avg cell size: CELL_SIZE_MULTIPLIER
      // width: CELL_SIZE_MULTIPLIER * 3
      // height: CELL_SIZE_MULTIPLIER * 2
      // overcsan by: CELL_SIZE_MULTIPLIER
      // Expected to measure 9 cells
      var cellMeasurerCache = createCellMeasurerCache();
      (0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache
      }));

      for (var i = 0; i <= 8; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }

      expect(cellMeasurerCache.has(9)).toBe(false);
    });
    it('should not measure cells while scrolling until they are needed', function () {
      // Expected to measure 9 cells
      var cellMeasurerCache = createCellMeasurerCache();
      var renderCallback = jest.fn().mockImplementation(function (index) {
        return index;
      });
      var cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellRenderer: cellRenderer
      })));
      renderCallback.mockClear(); // Scroll a little bit, but not so much to require re-measuring

      simulateScroll(rendered, 51); // Verify that render was only called enough times to fill view port (no extra for measuring)

      expect(renderCallback).toHaveBeenCalledTimes(9);
    });
    it('should measure additional cells on scroll when it runs out of measured cells', function () {
      var cellMeasurerCache = createCellMeasurerCache();
      var renderCallback = jest.fn().mockImplementation(function (index) {
        return index;
      });
      var cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRenderer: cellRenderer,
        cellMeasurerCache: cellMeasurerCache
      })));
      expect(cellMeasurerCache.has(9)).toBe(false);
      renderCallback.mockClear();
      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      expect(cellMeasurerCache.has(10)).toBe(false);
    }); // Masonry used to do a render pass for only unmeasured cells,
    // But this resulting in removing (and later re-adding) measured cells from the DOM,
    // Which was bad for performance. See GitHub issue #875

    it('should not remove previously-measured cells when measuring new ones', function () {
      var log = [];
      var cellMeasurerCache = createCellMeasurerCache();

      var renderCallback = function renderCallback(index) {
        log.push(index);
      };

      var cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellRenderer: cellRenderer
      }))); // Expected to have rendered twice:
      // 1st time to measure 9 cells (b'c of esimated size)
      // 2nd time to render and position 9 cells (b'c of actual size)

      expect(log).toHaveLength(18);
      log.splice(0);
      simulateScroll(rendered, 101); // Expected to have rendered twice:
      // 1st time to measure additional cells (based on estimated size)
      // 2nd time to render and position with new cells
      // The 1st render should also have included the pre-measured cells,
      // To prevent them from being removed, recreated, and re-added to the DOM.

      expect(log).toHaveLength(18);
    });
    it('should only render enough cells to fill the viewport', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        overscanByPixels: 0
      })));
      assertVisibleCells(rendered, '0,1,2,3,4,5');
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, '0,2,3,4,5,6');
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, '3,4,5,6,7,8');
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, '30,31,32,33,34,35');
    });
    it('should only render enough cells to fill the viewport plus overscanByPixels', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        overscanByPixels: 100
      })));
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, '26,27,28,29,30,31,32,33,34,35,36,37');
    });
    it('should still render correctly when autoHeight is true (eg WindowScroller)', function () {
      // Share instances between renders to avoid resetting state in ways we don't intend
      var cellMeasurerCache = createCellMeasurerCache();
      var cellPositioner = createCellPositioner(cellMeasurerCache);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        autoHeight: true,
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner
      })));
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        autoHeight: true,
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner,
        scrollTop: 51
      })));
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        autoHeight: true,
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner,
        scrollTop: 101
      })));
      assertVisibleCells(rendered, '0,2,3,4,5,6,7,8,9');
      rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        autoHeight: true,
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner,
        scrollTop: 1001
      })));
      assertVisibleCells(rendered, '27,29,30,31,32,33,34,35,36');
    });
    it('should set right instead of left in a cell styles for rtl row direction', function () {
      // Share instances between renders to avoid resetting state in ways we don't intend
      var cellMeasurerCache = createCellMeasurerCache();
      var cellPositioner = createCellPositioner(cellMeasurerCache);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner,
        rowDirection: 'rtl'
      })));
      Array.from(rendered.querySelectorAll('.cell')).map(function (node) {
        expect(node.style.right).toMatch(/px/);
      });
    });
    it('should consider scroll only of the container element and not of any ancestor element', function () {
      var cellMeasurerCache = createCellMeasurerCache();

      var renderScrollableCell = function renderScrollableCell(index) {
        return React.createElement("div", {
          style: {
            height: '50px',
            overflow: 'visible'
          },
          id: "scrollable-cell-".concat(index)
        }, React.createElement("div", {
          style: {
            height: '500px'
          }
        }, index));
      };

      var cellRenderer = createCellRenderer(cellMeasurerCache, renderScrollableCell);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        overscanByPixels: 0,
        cellMeasurerCache: cellMeasurerCache,
        cellRenderer: cellRenderer
      })));
      assertVisibleCells(rendered, '0,1,2,3,4,5');
      var cellEl = rendered.querySelector('#scrollable-cell-1');

      _testUtils.Simulate.scroll(cellEl, {
        target: {
          scrollTop: 100
        }
      });

      assertVisibleCells(rendered, '0,1,2,3,4,5');
    });
  });
  describe('recomputeCellPositions', function () {
    it('should refresh all cell positions', function () {
      // Share instances between renders to avoid resetting state in ways we don't intend
      var cellMeasurerCache = createCellMeasurerCache();
      var cellPositioner = jest.fn().mockImplementation(createCellPositioner(cellMeasurerCache));
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner
      })));
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      cellPositioner.mockImplementation(function (index) {
        return {
          left: 0,
          top: index * CELL_SIZE_MULTIPLIER
        };
      });
      var component = (0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellPositioner: cellPositioner
      }));
      rendered = (0, _reactDom.findDOMNode)(component);
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      component.recomputeCellPositions();
      assertVisibleCells(rendered, '0,1,2,3,4');
    });
    it('should not reset measurement cache', function () {
      var cellMeasurerCache = createCellMeasurerCache();
      var component = (0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache
      }));
      var rendered = (0, _reactDom.findDOMNode)(component);
      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      simulateScroll(rendered, 0);
      component.recomputeCellPositions();

      for (var i = 0; i <= 9; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }
    });
  });
  describe('isScrolling', function () {
    it('should be true for cellRenderer while scrolling is in progress', function () {
      var cellMeasurerCache = createCellMeasurerCache();
      var renderCallback = jest.fn().mockImplementation(function (index) {
        return index;
      });
      var cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellRenderer: cellRenderer
      })));
      renderCallback.mockClear();
      simulateScroll(rendered, 51);
      expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(true);
    });
    it('should be reset after a small debounce when scrolling stops', function () {
      var cellMeasurerCache = createCellMeasurerCache();
      var renderCallback = jest.fn().mockImplementation(function (index) {
        return index;
      });
      var cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback);
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellMeasurerCache: cellMeasurerCache,
        cellRenderer: cellRenderer
      })));
      simulateScroll(rendered, 51);
      renderCallback.mockClear();
      setTimeout(function () {
        expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(false);
      }, 0);
    });
  });
  describe('callbacks', function () {
    it('should call onCellsRendered when rendered cells change', function () {
      var onCellsRendered = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onCellsRendered: onCellsRendered
      })));
      expect(onCellsRendered.mock.calls).toEqual([[{
        startIndex: 0,
        stopIndex: 8
      }]]);
      simulateScroll(rendered, 51);
      expect(onCellsRendered.mock.calls).toEqual([[{
        startIndex: 0,
        stopIndex: 8
      }]]);
      simulateScroll(rendered, 101);
      expect(onCellsRendered.mock.calls).toEqual([[{
        startIndex: 0,
        stopIndex: 8
      }], [{
        startIndex: 0,
        stopIndex: 9
      }]]);
    });
    it('should call onScroll when scroll position changes', function () {
      var onScroll = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onScroll: onScroll
      })));
      expect(onScroll.mock.calls).toEqual([[{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 0
      }]]);
      simulateScroll(rendered, 51);
      expect(onScroll.mock.calls).toEqual([[{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 0
      }], [{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 51
      }]]);
      simulateScroll(rendered, 0);
      expect(onScroll.mock.calls).toEqual([[{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 0
      }], [{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 51
      }], [{
        clientHeight: 100,
        scrollHeight: 16900,
        scrollTop: 0
      }]]);
    });
  });
  describe('keyMapper', function () {
    it('should pass the correct key to rendered cells', function () {
      var keyMapper = jest.fn().mockImplementation(function (index) {
        return "key:".concat(index);
      });
      var cellRenderer = jest.fn().mockImplementation(function (_ref3) {
        var index = _ref3.index,
            key = _ref3.key,
            style = _ref3.style;
        return React.createElement("div", {
          key: key,
          style: style
        }, index);
      });
      (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRenderer: cellRenderer,
        keyMapper: keyMapper
      })));
      expect(keyMapper).toHaveBeenCalled();
      expect(cellRenderer).toHaveBeenCalled();
      expect(cellRenderer.mock.calls[0][0].key).toEqual('key:0');
    });
  });
});