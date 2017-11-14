'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InfiniteLoader = require('./InfiniteLoader');

var _InfiniteLoader2 = _interopRequireDefault(_InfiniteLoader);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _TestUtils = require('../TestUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('InfiniteLoader', function () {
  var innerOnRowsRendered = void 0;
  var isRowLoadedCalls = [];
  var isRowLoadedMap = {};
  var loadMoreRowsCalls = [];
  var rowRendererCalls = [];

  beforeEach(function () {
    isRowLoadedCalls = [];
    isRowLoadedMap = {};
    loadMoreRowsCalls = [];
    rowRendererCalls = [];
  });

  function defaultIsRowLoaded(_ref) {
    var index = _ref.index;

    isRowLoadedCalls.push(index);
    return !!isRowLoadedMap[index];
  }

  function defaultLoadMoreRows(_ref2) {
    var startIndex = _ref2.startIndex,
        stopIndex = _ref2.stopIndex;

    loadMoreRowsCalls.push({ startIndex: startIndex, stopIndex: stopIndex });
  }

  function rowRenderer(_ref3) {
    var index = _ref3.index,
        key = _ref3.key,
        style = _ref3.style;

    rowRendererCalls.push(index);
    return _react2.default.createElement('div', { key: key, style: style });
  }

  function getMarkup() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$height = _ref4.height,
        height = _ref4$height === undefined ? 100 : _ref4$height,
        _ref4$isRowLoaded = _ref4.isRowLoaded,
        isRowLoaded = _ref4$isRowLoaded === undefined ? defaultIsRowLoaded : _ref4$isRowLoaded,
        _ref4$loadMoreRows = _ref4.loadMoreRows,
        loadMoreRows = _ref4$loadMoreRows === undefined ? defaultLoadMoreRows : _ref4$loadMoreRows,
        _ref4$minimumBatchSiz = _ref4.minimumBatchSize,
        minimumBatchSize = _ref4$minimumBatchSiz === undefined ? 1 : _ref4$minimumBatchSiz,
        _ref4$rowHeight = _ref4.rowHeight,
        rowHeight = _ref4$rowHeight === undefined ? 20 : _ref4$rowHeight,
        _ref4$rowCount = _ref4.rowCount,
        rowCount = _ref4$rowCount === undefined ? 100 : _ref4$rowCount,
        scrollToIndex = _ref4.scrollToIndex,
        _ref4$threshold = _ref4.threshold,
        threshold = _ref4$threshold === undefined ? 10 : _ref4$threshold,
        _ref4$width = _ref4.width,
        width = _ref4$width === undefined ? 200 : _ref4$width;

    return _react2.default.createElement(
      _InfiniteLoader2.default,
      {
        isRowLoaded: isRowLoaded,
        loadMoreRows: loadMoreRows,
        minimumBatchSize: minimumBatchSize,
        rowCount: rowCount,
        threshold: threshold },
      function (_ref5) {
        var onRowsRendered = _ref5.onRowsRendered,
            registerChild = _ref5.registerChild;

        innerOnRowsRendered = onRowsRendered;

        return _react2.default.createElement(_List2.default, {
          ref: registerChild,
          height: height,
          onRowsRendered: onRowsRendered,
          rowHeight: rowHeight,
          rowRenderer: rowRenderer,
          rowCount: rowCount,
          scrollToIndex: scrollToIndex,
          width: width
        });
      }
    );
  }

  it('should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', function () {
    (0, _TestUtils.render)(getMarkup());
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('should call :isRowLoaded for all rows within the rowCount each time a range of rows are rendered', function () {
    (0, _TestUtils.render)(getMarkup({ rowCount: 10 }));
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should call :loadMoreRows for unloaded rows within the threshold', function () {
    (0, _TestUtils.render)(getMarkup());
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);
  });

  it('should call :loadMoreRows for unloaded rows within the rowCount', function () {
    (0, _TestUtils.render)(getMarkup({ rowCount: 10 }));
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }]);
  });

  it('should :forceUpdate once rows have loaded if :loadMoreRows returns a Promise', function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(done) {
      var savedResolve, loadMoreRows;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              loadMoreRows = function loadMoreRows() {
                return new Promise(function (resolve) {
                  savedResolve = resolve;
                });
              };

              savedResolve = void 0;

              (0, _TestUtils.render)(getMarkup({ loadMoreRows: loadMoreRows }));
              rowRendererCalls.splice(0);
              _context.next = 6;
              return savedResolve();

            case 6:
              expect(rowRendererCalls.length > 0).toEqual(true);
              done();

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x2) {
      return _ref6.apply(this, arguments);
    };
  }());

  it('should not :forceUpdate once rows have loaded rows are no longer visible', function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(done) {
      var resolves, loadMoreRows;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              loadMoreRows = function loadMoreRows() {
                return new Promise(function (resolve) {
                  resolves.push(resolve);
                });
              };

              resolves = [];

              (0, _TestUtils.render)(getMarkup({ loadMoreRows: loadMoreRows }));
              // Simulate a new range of rows being loaded
              innerOnRowsRendered({ startIndex: 100, stopIndex: 101 });
              rowRendererCalls.splice(0);
              _context2.next = 7;
              return resolves[0]();

            case 7:
              // Resolve the first request only, not the simulated row-change
              expect(rowRendererCalls.length).toEqual(0);
              done();

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3) {
      return _ref7.apply(this, arguments);
    };
  }());

  describe('minimumBatchSize', function () {
    it('should respect the specified :minimumBatchSize when scrolling down', function () {
      (0, _TestUtils.render)(getMarkup({
        minimumBatchSize: 10,
        threshold: 0
      }));
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }]);
    });

    it('should respect the specified :minimumBatchSize when scrolling up', function () {
      (0, _TestUtils.render)(getMarkup({
        minimumBatchSize: 10,
        scrollToIndex: 20,
        threshold: 0
      }));
      loadMoreRowsCalls.splice(0);
      (0, _TestUtils.render)(getMarkup({
        isRowLoaded: function isRowLoaded(_ref8) {
          var index = _ref8.index;
          return index >= 20;
        },
        minimumBatchSize: 10,
        scrollToIndex: 15,
        threshold: 0
      }));
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 10, stopIndex: 19 }]);
    });

    it('should not interfere with :threshold', function () {
      (0, _TestUtils.render)(getMarkup({
        minimumBatchSize: 10,
        threshold: 10
      }));
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 14 }]);
    });

    it('should respect the specified :minimumBatchSize if a user scrolls past the previous range', function () {
      var isRowLoadedIndices = {};

      function isRowLoaded(_ref9) {
        var index = _ref9.index;

        if (!isRowLoadedIndices[index]) {
          isRowLoadedIndices[index] = true;

          return false;
        } else {
          return true;
        }
      }

      (0, _TestUtils.render)(getMarkup({
        isRowLoaded: isRowLoaded,
        minimumBatchSize: 10,
        threshold: 0
      }));
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({ startIndex: 5, stopIndex: 10 });
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }, { startIndex: 10, stopIndex: 19 }]);
    });

    it('should not exceed ending boundaries if :minimumBatchSize is larger than needed', function () {
      (0, _TestUtils.render)(getMarkup({
        minimumBatchSize: 10,
        rowCount: 25,
        threshold: 0
      }));
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({ startIndex: 18, stopIndex: 22 });
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 9 }, { startIndex: 15, stopIndex: 24 }]);
    });

    it('should not exceed beginning boundaries if :minimumBatchSize is larger than needed', function () {
      (0, _TestUtils.render)(getMarkup({
        minimumBatchSize: 10,
        scrollToIndex: 15,
        threshold: 0
      }));
      loadMoreRowsCalls.splice(0);
      (0, _TestUtils.render)(getMarkup({
        isRowLoaded: function isRowLoaded(_ref10) {
          var index = _ref10.index;
          return index >= 6;
        },
        minimumBatchSize: 10,
        scrollToIndex: 2,
        threshold: 0
      }));
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 5 }]);
    });
  });

  // Verifies improved memoization; see bvaughn/react-virtualized/issues/345
  it('should memoize calls to :loadMoreRows (not calling unless unloaded ranges have changed)', function () {
    (0, _TestUtils.render)(getMarkup({
      isRowLoaded: function isRowLoaded() {
        return false;
      },
      minimumBatchSize: 20,
      threshold: 0
    }));
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 20 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 20 }]);
  });

  it('resetLoadMoreRowsCache should reset memoized state', function () {
    var component = (0, _TestUtils.render)(getMarkup({
      isRowLoaded: function isRowLoaded() {
        return false;
      },
      minimumBatchSize: 20,
      threshold: 0
    }));
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    loadMoreRowsCalls.splice(0);
    expect(loadMoreRowsCalls).toEqual([]);
    component.resetLoadMoreRowsCache();
    innerOnRowsRendered({ startIndex: 0, stopIndex: 15 });
    expect(loadMoreRowsCalls).toEqual([{ startIndex: 0, stopIndex: 19 }]);
  });

  it('resetLoadMoreRowsCache should call :loadMoreRows if :autoReload parameter is true', function () {
    var component = (0, _TestUtils.render)(getMarkup({
      isRowLoaded: function isRowLoaded() {
        return false;
      },
      minimumBatchSize: 1,
      threshold: 0
    }));

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 0, stopIndex: 10 });
    component.resetLoadMoreRowsCache(true);
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 0,
      stopIndex: 10
    });

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({ startIndex: 20, stopIndex: 30 });
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30
    });

    loadMoreRowsCalls.splice(0);
    component.resetLoadMoreRowsCache(true);
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30
    });
  });
});

describe('scanForUnloadedRanges', function () {
  function createIsRowLoaded(rows) {
    return function (_ref11) {
      var index = _ref11.index;
      return rows[index];
    };
  }

  it('should return an empty array for a range of rows that have all been loaded', function () {
    expect((0, _InfiniteLoader.scanForUnloadedRanges)({
      isRowLoaded: createIsRowLoaded([true, true, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([]);
  });

  it('return a range of only 1 unloaded row', function () {
    expect((0, _InfiniteLoader.scanForUnloadedRanges)({
      isRowLoaded: createIsRowLoaded([true, false, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([{ startIndex: 1, stopIndex: 1 }]);
  });

  it('return a range of multiple unloaded rows', function () {
    expect((0, _InfiniteLoader.scanForUnloadedRanges)({
      isRowLoaded: createIsRowLoaded([false, false, true]),
      startIndex: 0,
      stopIndex: 2
    })).toEqual([{ startIndex: 0, stopIndex: 1 }]);
  });

  it('return multiple ranges of unloaded rows', function () {
    expect((0, _InfiniteLoader.scanForUnloadedRanges)({
      isRowLoaded: createIsRowLoaded([true, false, false, true, false, true, false]),
      startIndex: 0,
      stopIndex: 6
    })).toEqual([{ startIndex: 1, stopIndex: 2 }, { startIndex: 4, stopIndex: 4 }, { startIndex: 6, stopIndex: 6 }]);
  });
});

describe('isRangeVisible', function () {
  it('first row(s) are visible', function () {
    expect((0, _InfiniteLoader.isRangeVisible)({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 20,
      stopIndex: 30
    })).toEqual(true);
  });

  it('last row(s) are visible', function () {
    expect((0, _InfiniteLoader.isRangeVisible)({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 0,
      stopIndex: 10
    })).toEqual(true);
  });

  it('all row(s) are visible', function () {
    expect((0, _InfiniteLoader.isRangeVisible)({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 12,
      stopIndex: 14
    })).toEqual(true);
  });

  it('no row(s) are visible', function () {
    expect((0, _InfiniteLoader.isRangeVisible)({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 0,
      stopIndex: 9
    })).toEqual(false);

    expect((0, _InfiniteLoader.isRangeVisible)({
      lastRenderedStartIndex: 10,
      lastRenderedStopIndex: 20,
      startIndex: 21,
      stopIndex: 30
    })).toEqual(false);
  });
});

describe('forceUpdateReactVirtualizedComponent', function () {
  it('should call :recomputeGridSize if defined', function () {
    var recomputeGridSize = jest.fn();

    var TestComponent = function (_Component) {
      _inherits(TestComponent, _Component);

      function TestComponent() {
        var _ref12;

        var _temp, _this, _ret;

        _classCallCheck(this, TestComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref12 = TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).call.apply(_ref12, [this].concat(args))), _this), _this.recomputeGridSize = recomputeGridSize, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(TestComponent, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement('div', null);
        }
      }]);

      return TestComponent;
    }(_react.Component);

    (0, _InfiniteLoader.forceUpdateReactVirtualizedComponent)((0, _TestUtils.render)(_react2.default.createElement(TestComponent, null)), 10);
    expect(recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(recomputeGridSize).toHaveBeenCalledWith(10);
  });

  it('should called :recomputeRowHeights if defined', function () {
    var recomputeRowHeights = jest.fn();

    var TestComponent = function (_Component2) {
      _inherits(TestComponent, _Component2);

      function TestComponent() {
        var _ref13;

        var _temp2, _this2, _ret2;

        _classCallCheck(this, TestComponent);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref13 = TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).call.apply(_ref13, [this].concat(args))), _this2), _this2.recomputeRowHeights = recomputeRowHeights, _temp2), _possibleConstructorReturn(_this2, _ret2);
      }

      _createClass(TestComponent, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement('div', null);
        }
      }]);

      return TestComponent;
    }(_react.Component);

    (0, _InfiniteLoader.forceUpdateReactVirtualizedComponent)((0, _TestUtils.render)(_react2.default.createElement(TestComponent, null)), 10);
    expect(recomputeRowHeights).toHaveBeenCalledTimes(1);
    expect(recomputeRowHeights).toHaveBeenCalledWith(10);
  });

  it('should call :forceUpdate otherwise', function () {
    var forceUpdate = jest.fn();

    var TestComponent = function (_Component3) {
      _inherits(TestComponent, _Component3);

      function TestComponent() {
        var _ref14;

        var _temp3, _this3, _ret3;

        _classCallCheck(this, TestComponent);

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_ref14 = TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).call.apply(_ref14, [this].concat(args))), _this3), _this3.forceUpdate = forceUpdate, _temp3), _possibleConstructorReturn(_this3, _ret3);
      }

      _createClass(TestComponent, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement('div', null);
        }
      }]);

      return TestComponent;
    }(_react.Component);

    (0, _InfiniteLoader.forceUpdateReactVirtualizedComponent)((0, _TestUtils.render)(_react2.default.createElement(TestComponent, null)), 10);
    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });
});