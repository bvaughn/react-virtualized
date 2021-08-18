"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _TestUtils = require("../TestUtils");

var _CellMeasurer = _interopRequireDefault(require("./CellMeasurer"));

var _CellMeasurerCache = _interopRequireWildcard(require("./CellMeasurerCache"));

// Accounts for the fact that JSDom doesn't support measurements.
function mockClientWidthAndHeight(_ref) {
  var height = _ref.height,
      width = _ref.width;
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : HTMLElement.prototype;
  var heightFn = jest.fn().mockReturnValue(height);
  var widthFn = jest.fn().mockReturnValue(width);
  Object.defineProperty(object, 'offsetHeight', {
    configurable: true,
    get: heightFn
  });
  Object.defineProperty(object, 'offsetWidth', {
    configurable: true,
    get: widthFn
  });
  return {
    heightFn: heightFn,
    widthFn: widthFn
  };
}

function createParent() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      cache = _ref2.cache,
      _ref2$invalidateCellS = _ref2.invalidateCellSizeAfterRender,
      invalidateCellSizeAfterRender = _ref2$invalidateCellS === void 0 ? jest.fn() : _ref2$invalidateCellS;

  return {
    invalidateCellSizeAfterRender: invalidateCellSizeAfterRender,
    props: {
      deferredMeasurementCache: cache
    }
  };
}

function renderHelper() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$cache = _ref3.cache,
      cache = _ref3$cache === void 0 ? new _CellMeasurerCache["default"]({
    fixedWidth: true
  }) : _ref3$cache,
      _ref3$children = _ref3.children,
      children = _ref3$children === void 0 ? React.createElement("div", null) : _ref3$children,
      parent = _ref3.parent;

  (0, _TestUtils.render)(React.createElement(_CellMeasurer["default"], {
    cache: cache,
    columnIndex: 0,
    parent: parent,
    rowIndex: 0,
    style: {}
  }, children));
}

describe('CellMeasurer', function () {
  it('componentDidMount() should measure content that is not already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    var parent = createParent({
      cache: cache
    });

    var _mockClientWidthAndHe = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }),
        heightFn = _mockClientWidthAndHe.heightFn,
        widthFn = _mockClientWidthAndHe.widthFn;

    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
    expect(cache.has(0, 0)).toBe(false);
    renderHelper({
      cache: cache,
      parent: parent
    });
    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });
  it('componentDidMount() should not measure content that is already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    var parent = createParent({
      cache: cache
    });

    var _mockClientWidthAndHe2 = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }),
        heightFn = _mockClientWidthAndHe2.heightFn,
        widthFn = _mockClientWidthAndHe2.widthFn;

    expect(cache.has(0, 0)).toBe(true);
    renderHelper({
      cache: cache,
      parent: parent
    });
    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });
  it('componentDidUpdate() should measure content that is not already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    var parent = createParent({
      cache: cache
    });
    renderHelper({
      cache: cache,
      parent: parent
    });
    cache.clear(0, 0);
    parent.invalidateCellSizeAfterRender.mockReset();
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.getWidth(0, 0)).toBe(_CellMeasurerCache.DEFAULT_WIDTH);
    expect(cache.getHeight(0, 0)).toBe(_CellMeasurerCache.DEFAULT_HEIGHT);

    var _mockClientWidthAndHe3 = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }),
        heightFn = _mockClientWidthAndHe3.heightFn,
        widthFn = _mockClientWidthAndHe3.widthFn;

    renderHelper({
      cache: cache,
      parent: parent
    });
    expect(cache.has(0, 0)).toBe(true);
    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });
  it('componentDidUpdate() should not measure content that is already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    var parent = createParent({
      cache: cache
    });
    expect(cache.has(0, 0)).toBe(true);

    var _mockClientWidthAndHe4 = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }),
        heightFn = _mockClientWidthAndHe4.heightFn,
        widthFn = _mockClientWidthAndHe4.widthFn;

    renderHelper({
      cache: cache,
      parent: parent
    });
    renderHelper({
      cache: cache,
      parent: parent
    });
    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });
  it('registerChild() should measure content that is not already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    var parent = createParent({
      cache: cache
    });
    var element = document.createElement('div');

    var _mockClientWidthAndHe5 = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }, element),
        heightFn = _mockClientWidthAndHe5.heightFn,
        widthFn = _mockClientWidthAndHe5.widthFn;

    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
    expect(cache.has(0, 0)).toBe(false);
    renderHelper({
      cache: cache,
      parent: parent,
      children: function children(_ref4) {
        var registerChild = _ref4.registerChild;
        registerChild(element);
        return null;
      }
    });
    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(1);
    expect(widthFn).toHaveBeenCalledTimes(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });
  it('registerChild() should not measure content that is already in the cache', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    var parent = createParent({
      cache: cache
    });
    var element = document.createElement('div');

    var _mockClientWidthAndHe6 = mockClientWidthAndHeight({
      height: 20,
      width: 100
    }, element),
        heightFn = _mockClientWidthAndHe6.heightFn,
        widthFn = _mockClientWidthAndHe6.widthFn;

    expect(cache.has(0, 0)).toBe(true);
    renderHelper({
      cache: cache,
      parent: parent,
      children: function children(_ref5) {
        var registerChild = _ref5.registerChild;
        registerChild(element);
        return null;
      }
    });
    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(heightFn).toHaveBeenCalledTimes(0);
    expect(widthFn).toHaveBeenCalledTimes(0);
  });
  it('should pass a :measure param to a function child', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    var children = jest.fn().mockReturnValue(React.createElement("div", null));
    renderHelper({
      cache: cache,
      children: children
    });
    expect(children).toHaveBeenCalled();
    var params = children.mock.calls[0][0];
    expect(typeof params.measure === 'function').toBe(true);
  });
  it('should still update cache without a parent Grid', function () {
    jest.spyOn(console, 'warn');
    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    renderHelper({
      cache: cache
    }); // No parent Grid

    expect(cache.has(0, 0)).toBe(true);
    expect(console.warn).not.toHaveBeenCalled();
  }); // See issue #593

  it('should explicitly set width/height style to "auto" before re-measuring', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedWidth: true
    });
    var parent = createParent({
      cache: cache
    });
    var child = jest.fn().mockReturnValue(React.createElement("div", {
      style: {
        width: 100,
        height: 30
      }
    }));
    var measurer;
    var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(React.createElement(_CellMeasurer["default"], {
      ref: function ref(_ref6) {
        measurer = _ref6;
      },
      cache: cache,
      columnIndex: 0,
      parent: parent,
      rowIndex: 0,
      style: {}
    }, child)));
    var styleHeights = [30];
    var styleWidths = [100];
    Object.defineProperties(node.style, {
      height: {
        get: function get() {
          return styleHeights[styleHeights.length - 1];
        },
        set: function set(value) {
          return styleHeights.push(value);
        }
      },
      width: {
        get: function get() {
          return styleWidths[styleWidths.length - 1];
        },
        set: function set(value) {
          return styleWidths.push(value);
        }
      }
    });

    var _measurer$_getCellMea = measurer._getCellMeasurements(node),
        height = _measurer$_getCellMea.height,
        width = _measurer$_getCellMea.width;

    expect(height).toBeGreaterThan(0);
    expect(width).toBeGreaterThan(0);
    expect(styleHeights).toEqual([30, 'auto', 30]);
    expect(styleWidths).toEqual([100, 100]);
  }); // See issue #660

  it('should reset width/height style values after measuring with style "auto"', function () {
    var cache = new _CellMeasurerCache["default"]({
      fixedHeight: true
    });
    var parent = createParent({
      cache: cache
    });
    var child = jest.fn().mockReturnValue(React.createElement("div", {
      style: {
        width: 100,
        height: 30
      }
    }));
    var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(React.createElement(_CellMeasurer["default"], {
      cache: cache,
      columnIndex: 0,
      parent: parent,
      rowIndex: 0,
      style: {}
    }, child)));
    node.style.width = 200;
    node.style.height = 60;
    child.mock.calls[0][0].measure();
    expect(node.style.height).toBe('30px');
    expect(node.style.width).toBe('100px');
  });
});