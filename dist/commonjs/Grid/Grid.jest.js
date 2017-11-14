'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _testUtils = require('react-dom/test-utils');

var _TestUtils = require('../TestUtils');

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _CellMeasurer = require('../CellMeasurer');

var _defaultOverscanIndicesGetter = require('./defaultOverscanIndicesGetter');

var _ScalingCellSizeAndPositionManager = require('./utils/ScalingCellSizeAndPositionManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var DEFAULT_COLUMN_WIDTH = 50;
var DEFAULT_HEIGHT = 100;
var DEFAULT_ROW_HEIGHT = 20;
var DEFAULT_WIDTH = 200;
var NUM_ROWS = 100;
var NUM_COLUMNS = 50;

function getScrollbarSize0() {
  return 0;
}

function getScrollbarSize20() {
  return 20;
}

describe('Grid', function () {
  function defaultCellRenderer(_ref) {
    var columnIndex = _ref.columnIndex,
        key = _ref.key,
        rowIndex = _ref.rowIndex,
        style = _ref.style;

    return _react2.default.createElement(
      'div',
      { className: 'gridItem', key: key, style: style },
      'row:' + rowIndex + ', column:' + columnIndex
    );
  }

  function simulateScroll(_ref2) {
    var grid = _ref2.grid,
        _ref2$scrollLeft = _ref2.scrollLeft,
        scrollLeft = _ref2$scrollLeft === undefined ? 0 : _ref2$scrollLeft,
        _ref2$scrollTop = _ref2.scrollTop,
        scrollTop = _ref2$scrollTop === undefined ? 0 : _ref2$scrollTop;

    var target = { scrollLeft: scrollLeft, scrollTop: scrollTop };
    grid._scrollingContainer = target; // HACK to work around _onScroll target check
    _testUtils.Simulate.scroll((0, _reactDom.findDOMNode)(grid), { target: target });
  }

  function getMarkup() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return _react2.default.createElement(_Grid2.default, _extends({
      cellRenderer: defaultCellRenderer,
      columnCount: NUM_COLUMNS,
      columnWidth: DEFAULT_COLUMN_WIDTH,
      getScrollbarSize: getScrollbarSize0,
      height: DEFAULT_HEIGHT,
      overscanColumnCount: 0,
      overscanRowCount: 0,
      autoHeight: false,
      rowHeight: DEFAULT_ROW_HEIGHT,
      rowCount: NUM_ROWS,
      width: DEFAULT_WIDTH
    }, props));
  }

  describe('number of rendered children', function () {
    it('should render enough children to fill the available area', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(20); // 5 rows x 4 columns
    });

    it('should not render more rows than available if the area is not filled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ rowCount: 2 })));
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(8); // 2 rows x 4 columns
    });

    it('should not render more columns than available if the area is not filled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ columnCount: 2 })));
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(10); // 5 rows x 2 columns
    });

    // Small performance tweak added in 5.5.6
    it('should not render/parent cells that are null or false', function () {
      function cellRenderer(_ref3) {
        var columnIndex = _ref3.columnIndex,
            key = _ref3.key,
            rowIndex = _ref3.rowIndex,
            style = _ref3.style;

        if (columnIndex === 0) {
          return null;
        } else if (rowIndex === 0) {
          return false;
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'cell', key: key, style: style },
            'row:' + rowIndex + ', column:' + columnIndex
          );
        }
      }
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 3,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowCount: 3,
        cellRenderer: cellRenderer
      })));
      expect(rendered.querySelectorAll('.cell').length).toEqual(4); // [1,1], [1,2], [2,1], and [2,2]
      expect(rendered.textContent).not.toContain('column:0');
      expect(rendered.textContent).not.toContain('row:0');
    });

    it('should scroll to the last existing point when rows are removed', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        rowCount: 15
      }));

      simulateScroll({
        grid: grid,
        scrollTop: 200
      });

      var updatedGrid = (0, _TestUtils.render)(getMarkup({
        rowCount: 10
      }));

      expect(updatedGrid.state.scrollTop).toEqual(100);
    });

    it('should scroll to the last existing point when columns are removed', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnCount: 12
      }));

      simulateScroll({
        grid: grid,
        scrollLeft: 400
      });

      var updatedGrid = (0, _TestUtils.render)(getMarkup({
        columnCount: 8
      }));

      expect(updatedGrid.state.scrollLeft).toEqual(200);
    });

    it('should not scroll unseen rows are removed', function () {
      (0, _TestUtils.render)(getMarkup({
        rowCount: 15
      }));
      var updatedGrid = (0, _TestUtils.render)(getMarkup({
        rowCount: 10
      }));

      expect(updatedGrid.state.scrollTop).toEqual(0);
    });

    it('should not scroll when unseen columns are removed', function () {
      (0, _TestUtils.render)(getMarkup({
        columnCount: 12
      }));
      var updatedGrid = (0, _TestUtils.render)(getMarkup({
        columnCount: 8
      }));

      expect(updatedGrid.state.scrollLeft).toEqual(0);
    });
  });

  describe('shows and hides scrollbars based on rendered content', function () {
    it('should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 4,
        getScrollbarSize: getScrollbarSize20,
        rowCount: 5
      })));
      expect(rendered.style.overflowX).toEqual('hidden');
    });

    it('should set overflowX:hidden if columns and y-axis scrollbar fit within the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 4,
        getScrollbarSize: getScrollbarSize20,
        width: 200 + getScrollbarSize20()
      })));
      expect(rendered.style.overflowX).toEqual('hidden');
    });

    it('should leave overflowX:auto if columns require more than the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 4,
        getScrollbarSize: getScrollbarSize20,
        width: 200 - 1,
        rowCount: 5
      })));
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });

    it('should leave overflowX:auto if columns and y-axis scrollbar require more than the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 4,
        getScrollbarSize: getScrollbarSize20,
        width: 200 + getScrollbarSize20() - 1
      })));
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });

    it('should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        getScrollbarSize: getScrollbarSize20,
        rowCount: 5,
        columnCount: 4
      })));
      expect(rendered.style.overflowY).toEqual('hidden');
    });

    it('should set overflowY:hidden if rows and x-axis scrollbar fit within the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        getScrollbarSize: getScrollbarSize20,
        rowCount: 5,
        height: 100 + getScrollbarSize20()
      })));
      expect(rendered.style.overflowY).toEqual('hidden');
    });

    it('should leave overflowY:auto if rows require more than the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        getScrollbarSize: getScrollbarSize20,
        rowCount: 5,
        height: 100 - 1,
        columnCount: 4
      })));
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });

    it('should leave overflowY:auto if rows and x-axis scrollbar require more than the available width', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        getScrollbarSize: getScrollbarSize20,
        rowCount: 5,
        height: 100 + getScrollbarSize20() - 1
      })));
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });

    it('should accept styles that overwrite calculated ones', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        height: 1,
        rowCount: 1,
        style: {
          overflowY: 'visible',
          overflowX: 'visible'
        },
        width: 1
      })));
      expect(rendered.style.overflowY).toEqual('visible');
      expect(rendered.style.overflowX).toEqual('visible');
    });
  });

  /** Tests scrolling via initial props */
  describe(':scrollToColumn and :scrollToRow', function () {
    it('should scroll to the left', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToColumn: 0 }));
      expect(grid.state.scrollLeft).toEqual(0);
    });

    it('should scroll over to the middle', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToColumn: 24 }));
      // 100 columns * 50 item width = 5,000 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(grid.state.scrollLeft).toEqual(1050);
    });

    it('should scroll to the far right', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToColumn: 49 }));
      // 100 columns * 50 item width = 5,000 total item width
      // Target offset for the last item then is 5,000 - 200
      expect(grid.state.scrollLeft).toEqual(2300);
    });

    it('should scroll to the top', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToRow: 0 }));
      expect(grid.state.scrollTop).toEqual(0);
    });

    it('should scroll down to the middle', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToRow: 49 }));
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(grid.state.scrollTop).toEqual(900);
    });

    it('should scroll to the bottom', function () {
      var grid = (0, _TestUtils.render)(getMarkup({ scrollToRow: 99 }));
      // 100 rows * 20 item height = 2,000 total item height
      // Target offset for the last item then is 2,000 - 100
      expect(grid.state.scrollTop).toEqual(1900);
    });

    it('should scroll to a row and column just added', function () {
      var grid = (0, _TestUtils.render)(getMarkup());
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);
      grid = (0, _TestUtils.render)(getMarkup({
        columnCount: NUM_COLUMNS + 1,
        rowCount: NUM_ROWS + 1,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }));
      expect(grid.state.scrollLeft).toEqual(2350);
      expect(grid.state.scrollTop).toEqual(1920);
    });

    it('should scroll back to a newly-added cell without a change in prop', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnCount: NUM_COLUMNS,
        rowCount: NUM_ROWS,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }));
      grid = (0, _TestUtils.render)(getMarkup({
        columnCount: NUM_COLUMNS + 1,
        rowCount: NUM_ROWS + 1,
        scrollToColumn: NUM_COLUMNS,
        scrollToRow: NUM_ROWS
      }));
      expect(grid.state.scrollLeft).toEqual(2350);
      expect(grid.state.scrollTop).toEqual(1920);
    });

    it('should scroll to the correct position for :scrollToAlignment "start"', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        scrollToAlignment: 'start',
        scrollToColumn: 24,
        scrollToRow: 49
      }));
      // 100 columns * 50 item width = 5,000 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // 4 columns and 5 rows can be visible at a time.
      // The minimum amount of scrolling leaves the specified cell in the bottom/right corner (just scrolled into view).
      // Since alignment is set to "start" we should scroll past this point until the cell is aligned top/left.
      expect(grid.state.scrollLeft).toEqual(1200);
      expect(grid.state.scrollTop).toEqual(980);
    });

    it('should scroll to the correct position for :scrollToAlignment "end"', function () {
      (0, _TestUtils.render)(getMarkup({
        scrollToColumn: 99,
        scrollToRow: 99
      }));
      var grid = (0, _TestUtils.render)(getMarkup({
        scrollToAlignment: 'end',
        scrollToColumn: 24,
        scrollToRow: 49
      }));
      // 100 columns * 50 item width = 5,000 total item width
      // 100 rows * 20 item height = 2,000 total item height
      // We first scroll past the specified cell and then back.
      // The minimum amount of scrolling then should leave the specified cell in the top/left corner (just scrolled into view).
      // Since alignment is set to "end" we should scroll past this point until the cell is aligned bottom/right.
      expect(grid.state.scrollLeft).toEqual(1050);
      expect(grid.state.scrollTop).toEqual(900);
    });

    it('should scroll to the correct position for :scrollToAlignment "center"', function () {
      (0, _TestUtils.render)(getMarkup({
        scrollToColumn: 99,
        scrollToRow: 99
      }));
      var grid = (0, _TestUtils.render)(getMarkup({
        scrollToAlignment: 'center',
        scrollToColumn: 24,
        scrollToRow: 49
      }));
      // 100 columns * 50 item width = 5,000 total item width
      // Viewport width is 200
      // Column 24 starts at 1,200, center point at 1,225, so...
      expect(grid.state.scrollLeft).toEqual(1125);
      // 100 rows * 20 item height = 2,000 total item height
      // Viewport height is 100
      // Row 49 starts at 980, center point at 990, so...
      expect(grid.state.scrollTop).toEqual(940);
    });

    // Tests issue #691
    it('should set the correct :scrollLeft after height increases from 0', function () {
      _TestUtils.render.unmount();
      expect((0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        height: 0,
        scrollToColumn: 24
      }))).scrollLeft || 0).toEqual(0);
      expect((0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        height: 100,
        scrollToColumn: 24
      }))).scrollLeft).toEqual(1050);
    });

    // Tests issue #691
    it('should set the correct :scrollTop after width increases from 0', function () {
      _TestUtils.render.unmount();
      expect((0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        scrollToRow: 49,
        width: 0
      }))).scrollTop || 0).toEqual(0);
      expect((0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        scrollToRow: 49,
        width: 100
      }))).scrollTop).toEqual(900);
    });

    // Tests issue #218
    it('should set the correct :scrollTop after row and column counts increase from 0', function () {
      var expectedScrollTop = 100 * DEFAULT_ROW_HEIGHT - DEFAULT_HEIGHT + DEFAULT_ROW_HEIGHT;
      (0, _TestUtils.render)(getMarkup({
        columnCount: 0,
        rowCount: 150,
        scrollToRow: 100
      }));
      expect((0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 150,
        rowCount: 150,
        scrollToRow: 100
      }))).scrollTop).toEqual(expectedScrollTop);
    });

    it('should support scrollToCell() public method', function () {
      var grid = (0, _TestUtils.render)(getMarkup());
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);
      grid.scrollToCell({
        columnIndex: 24,
        rowIndex: 49
      });
      // 100 columns * 50 item width = 5,000 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).
      expect(grid.state.scrollLeft).toEqual(1050);
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(grid.state.scrollTop).toEqual(900);

      // Change column without affecting row
      grid.scrollToCell({
        columnIndex: 49
      });
      expect(grid.state.scrollLeft).toEqual(2300);
      expect(grid.state.scrollTop).toEqual(900);

      // Change row without affecting column
      grid.scrollToCell({
        rowIndex: 99
      });
      expect(grid.state.scrollLeft).toEqual(2300);
      expect(grid.state.scrollTop).toEqual(1900);
    });

    it('should support scrollToPosition() public method', function () {
      var grid = (0, _TestUtils.render)(getMarkup());
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);

      grid.scrollToPosition({
        scrollLeft: 50,
        scrollTop: 100
      });
      expect(grid.state.scrollLeft).toEqual(50);
      expect(grid.state.scrollTop).toEqual(100);

      // Change column without affecting row
      grid.scrollToPosition({
        scrollLeft: 25
      });
      expect(grid.state.scrollLeft).toEqual(25);
      expect(grid.state.scrollTop).toEqual(100);

      // Change row without affecting column
      grid.scrollToPosition({
        scrollTop: 50
      });
      expect(grid.state.scrollLeft).toEqual(25);
      expect(grid.state.scrollTop).toEqual(50);
    });

    it('should support handleScrollEvent() public method', function () {
      var grid = (0, _TestUtils.render)(getMarkup());
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);

      grid.handleScrollEvent({
        scrollLeft: 50,
        scrollTop: 100
      });
      expect(grid.state.isScrolling).toEqual(true);
      expect(grid.state.scrollLeft).toEqual(50);
      expect(grid.state.scrollTop).toEqual(100);
    });

    it('should support getOffsetForCell() public method', function () {
      var grid = (0, _TestUtils.render)(getMarkup());

      var _grid$getOffsetForCel = grid.getOffsetForCell({
        columnIndex: 24,
        rowIndex: 49
      }),
          scrollLeft = _grid$getOffsetForCel.scrollLeft,
          scrollTop = _grid$getOffsetForCel.scrollTop;
      // 100 columns * 50 item width = 5,000 total item width
      // 4 columns can be visible at a time and :scrollLeft is initially 0,
      // So the minimum amount of scrolling leaves the 25th item at the right (just scrolled into view).


      expect(scrollLeft).toEqual(1050);
      // 100 rows * 20 item height = 2,000 total item height
      // 5 rows can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(scrollTop).toEqual(900);
    });

    // See issue #565
    it('should update scroll position to account for changed cell sizes within a function prop wrapper', function () {
      var _rowHeight = 20;

      var props = {
        height: 100,
        rowCount: 100,
        rowHeight: function rowHeight(_ref4) {
          var index = _ref4.index;
          return index === 99 ? _rowHeight : 20;
        },
        scrollToRow: 99
      };

      var grid = (0, _TestUtils.render)(getMarkup(props));
      var node = (0, _reactDom.findDOMNode)(grid);

      expect(node.scrollTop).toBe(1900);

      _rowHeight = 40;
      grid.recomputeGridSize({
        rowIndex: 99
      });

      expect(node.scrollTop).toBe(1920);
    });

    it('should restore scroll offset for column when row count increases from 0 (and vice versa)', function () {
      var props = {
        columnWidth: 50,
        columnCount: 100,
        height: 100,
        rowCount: 100,
        rowHeight: 20,
        scrollToColumn: 50,
        scrollToRow: 50,
        width: 100
      };
      var grid = (0, _TestUtils.render)(getMarkup(props));
      expect(grid.state.scrollLeft).toEqual(2450);
      expect(grid.state.scrollTop).toEqual(920);
      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        columnCount: 0
      })));
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);
      (0, _TestUtils.render)(getMarkup(props));
      expect(grid.state.scrollLeft).toEqual(2450);
      expect(grid.state.scrollTop).toEqual(920);
      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        rowCount: 0
      })));
      expect(grid.state.scrollLeft).toEqual(0);
      expect(grid.state.scrollTop).toEqual(0);
      (0, _TestUtils.render)(getMarkup(props));
      expect(grid.state.scrollLeft).toEqual(2450);
      expect(grid.state.scrollTop).toEqual(920);
    });

    it('should take scrollbar size into account when aligning cells', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnWidth: 50,
        columnCount: 100,
        getScrollbarSize: getScrollbarSize20,
        height: 100,
        rowCount: 100,
        rowHeight: 20,
        scrollToColumn: 50,
        scrollToRow: 50,
        width: 100
      }));

      expect(grid.state.scrollLeft).toEqual(2450 + getScrollbarSize20());
      expect(grid.state.scrollTop).toEqual(920 + getScrollbarSize20());
    });
  });

  describe('property updates', function () {
    it('should update :scrollToColumn position when :columnWidth changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 25 })));
      expect(grid.textContent).toContain('column:25');
      // Making columns taller pushes name off/beyond the scrolled area
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 25, columnWidth: 20 })));
      expect(grid.textContent).toContain('column:25');
    });

    it('should update :scrollToRow position when :rowHeight changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 50 })));
      expect(grid.textContent).toContain('row:50');
      // Making rows taller pushes name off/beyond the scrolled area
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 50, rowHeight: 20 })));
      expect(grid.textContent).toContain('row:50');
    });

    it('should update :scrollToColumn position when :width changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 25 })));
      expect(grid.textContent).toContain('column:25');
      // Making the grid narrower leaves only room for 1 item
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 25, width: 50 })));
      expect(grid.textContent).toContain('column:25');
    });

    it('should update :scrollToRow position when :height changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 50 })));
      expect(grid.textContent).toContain('row:50');
      // Making the grid shorter leaves only room for 1 item
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 50, height: 20 })));
      expect(grid.textContent).toContain('row:50');
    });

    it('should update :scrollToColumn position when :scrollToColumn changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(grid.textContent).not.toContain('column:25');
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 25 })));
      expect(grid.textContent).toContain('column:25');
    });

    it('should update :scrollToRow position when :scrollToRow changes', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(grid.textContent).not.toContain('row:50');
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 50 })));
      expect(grid.textContent).toContain('row:50');
    });

    it('should update scroll position if size shrinks smaller than the current scroll', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 250 })));
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToColumn: 250, columnCount: 10 })));
      expect(grid.textContent).toContain('column:9');
    });

    it('should update scroll position if size shrinks smaller than the current scroll', function () {
      var grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 500 })));
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      grid = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ scrollToRow: 500, rowCount: 10 })));
      expect(grid.textContent).toContain('row:9');
    });
  });

  describe('noContentRenderer', function () {
    it('should call :noContentRenderer if :columnCount is 0', function () {
      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: function noContentRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'No data'
          );
        },
        columnCount: 0
      })));
      expect(list.textContent).toEqual('No data');
    });

    it('should call :noContentRenderer if :rowCount is 0', function () {
      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: function noContentRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'No data'
          );
        },
        rowCount: 0
      })));
      expect(list.textContent).toEqual('No data');
    });

    // Sanity check for bvaughn/react-virtualized/pull/348
    it('should render an empty body if :rowCount or :columnCount changes to 0', function () {
      function noContentRenderer() {
        return _react2.default.createElement(
          'div',
          null,
          'No data'
        );
      }

      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: noContentRenderer
      })));
      expect(list.textContent).not.toEqual('No data');

      list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: noContentRenderer,
        rowCount: 0
      })));
      expect(list.textContent).toEqual('No data');

      list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: noContentRenderer
      })));
      expect(list.textContent).not.toEqual('No data');

      list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 0,
        noContentRenderer: noContentRenderer
      })));
      expect(list.textContent).toEqual('No data');
    });

    it('should render an empty body if :columnCount is 0 and there is no :noContentRenderer', function () {
      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnCount: 0
      })));
      expect(list.textContent).toEqual('');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noContentRenderer', function () {
      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        rowCount: 0
      })));
      expect(list.textContent).toEqual('');
    });

    it('should render an empty body there is a :noContentRenderer but :height or :width are 0', function () {
      var list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        height: 0,
        noContentRenderer: function noContentRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'No data'
          );
        }
      })));
      expect(list.textContent).toEqual('');
      list = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        noContentRenderer: function noContentRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'No data'
          );
        },
        width: 0
      })));
      expect(list.textContent).toEqual('');
    });
  });

  describe('onSectionRendered', function () {
    it('should call :onSectionRendered if at least one cell is rendered', function () {
      var columnStartIndex = void 0,
          columnStopIndex = void 0,
          rowStartIndex = void 0,
          rowStopIndex = void 0;
      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          var _params;

          return _params = params, columnStartIndex = _params.columnStartIndex, columnStopIndex = _params.columnStopIndex, rowStartIndex = _params.rowStartIndex, rowStopIndex = _params.rowStopIndex, _params;
        }
      }));
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
    });

    it('should not call :onSectionRendered unless the column or row start or stop indices have changed', function () {
      var numCalls = 0;
      var columnStartIndex = void 0,
          columnStopIndex = void 0,
          rowStartIndex = void 0,
          rowStopIndex = void 0;
      var onSectionRendered = function onSectionRendered(params) {
        columnStartIndex = params.columnStartIndex;
        columnStopIndex = params.columnStopIndex;
        rowStartIndex = params.rowStartIndex;
        rowStopIndex = params.rowStopIndex;
        numCalls++;
      };
      (0, _TestUtils.render)(getMarkup({ onSectionRendered: onSectionRendered }));
      expect(numCalls).toEqual(1);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
      (0, _TestUtils.render)(getMarkup({ onSectionRendered: onSectionRendered }));
      expect(numCalls).toEqual(1);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
    });

    it('should call :onSectionRendered if the row or column start or stop indices have changed', function () {
      var numCalls = 0;
      var columnStartIndex = void 0,
          columnStopIndex = void 0,
          rowStartIndex = void 0,
          rowStopIndex = void 0;
      var onSectionRendered = function onSectionRendered(params) {
        columnStartIndex = params.columnStartIndex;
        columnStopIndex = params.columnStopIndex;
        rowStartIndex = params.rowStartIndex;
        rowStopIndex = params.rowStopIndex;
        numCalls++;
      };
      (0, _TestUtils.render)(getMarkup({ onSectionRendered: onSectionRendered }));
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
      (0, _TestUtils.render)(getMarkup({
        height: 50,
        onSectionRendered: onSectionRendered
      }));
      expect(numCalls).toEqual(2);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(2);
      (0, _TestUtils.render)(getMarkup({
        height: 50,
        onSectionRendered: onSectionRendered,
        width: 100
      }));
      expect(numCalls).toEqual(3);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(1);
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(2);
    });

    it('should not call :onSectionRendered if no cells are rendered', function () {
      var numCalls = 0;
      (0, _TestUtils.render)(getMarkup({
        height: 0,
        onSectionRendered: function onSectionRendered() {
          return numCalls++;
        }
      }));
      expect(numCalls).toEqual(0);
    });
  });

  describe(':scrollLeft and :scrollTop properties', function () {
    it('should render correctly when an initial :scrollLeft and :scrollTop properties are specified', function () {
      var columnStartIndex = void 0,
          columnStopIndex = void 0,
          rowStartIndex = void 0,
          rowStopIndex = void 0;
      (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          var _params2;

          return _params2 = params, columnStartIndex = _params2.columnStartIndex, columnStopIndex = _params2.columnStopIndex, rowStartIndex = _params2.rowStartIndex, rowStopIndex = _params2.rowStopIndex, _params2;
        },
        scrollLeft: 250,
        scrollTop: 100
      })));
      expect(rowStartIndex).toEqual(5);
      expect(rowStopIndex).toEqual(9);
      expect(columnStartIndex).toEqual(5);
      expect(columnStopIndex).toEqual(8);
    });

    it('should render correctly when :scrollLeft and :scrollTop properties are updated', function () {
      var columnStartIndex = void 0,
          columnStopIndex = void 0,
          rowStartIndex = void 0,
          rowStopIndex = void 0;

      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          var _params3;

          return _params3 = params, columnStartIndex = _params3.columnStartIndex, columnStopIndex = _params3.columnStopIndex, rowStartIndex = _params3.rowStartIndex, rowStopIndex = _params3.rowStopIndex, _params3;
        }
      }));
      expect(rowStartIndex).toEqual(0);
      expect(rowStopIndex).toEqual(4);
      expect(columnStartIndex).toEqual(0);
      expect(columnStopIndex).toEqual(3);

      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          var _params4;

          return _params4 = params, columnStartIndex = _params4.columnStartIndex, columnStopIndex = _params4.columnStopIndex, rowStartIndex = _params4.rowStartIndex, rowStopIndex = _params4.rowStopIndex, _params4;
        },
        scrollLeft: 250,
        scrollTop: 100
      }));
      expect(rowStartIndex).toEqual(5);
      expect(rowStopIndex).toEqual(9);
      expect(columnStartIndex).toEqual(5);
      expect(columnStopIndex).toEqual(8);
    });
  });

  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(rendered.className).toEqual('ReactVirtualized__Grid');
    });

    it('should use a custom :className if specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ className: 'foo' })));
      expect(rendered.className).toContain('foo');
    });

    it('should use a custom :id if specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ id: 'bar' })));
      expect(rendered.getAttribute('id')).toEqual('bar');
    });

    it('should use a custom :style if specified', function () {
      var style = { backgroundColor: 'red' };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ style: style })));
      expect(rendered.style.backgroundColor).toEqual('red');
    });

    it('should use a custom :containerStyle if specified', function () {
      var containerStyle = { backgroundColor: 'red' };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ containerStyle: containerStyle })));
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.backgroundColor).toEqual('red');
    });
  });

  describe('onScroll', function () {
    it('should trigger callback when component is mounted', function () {
      var onScrollCalls = [];
      (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        },
        scrollLeft: 50,
        scrollTop: 100
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 50,
        scrollTop: 100,
        scrollWidth: 2500
      }]);
    });

    it('should trigger callback when component scrolls horizontally', function () {
      var onScrollCalls = [];
      var grid = (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      simulateScroll({
        grid: grid,
        scrollLeft: 100,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 100,
        scrollTop: 0,
        scrollWidth: 2500
      });
    });

    it('should trigger callback when component scrolls vertically', function () {
      var onScrollCalls = [];
      var grid = (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 100
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 100,
        scrollWidth: 2500
      });
    });

    it('should trigger callback with scrollLeft of 0 when total columns width is less than width', function () {
      var onScrollCalls = [];
      var grid = (0, _TestUtils.render)(getMarkup({
        columnCount: 1,
        columnWidth: 50,
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        },
        scrollLeft: 0,
        scrollTop: 10,
        width: 200
      }));
      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 50
      });
    });

    it('should trigger callback with scrollTop of 0 when total rows height is less than height', function () {
      var onScrollCalls = [];
      var grid = (0, _TestUtils.render)(getMarkup({
        rowCount: 1,
        rowHeight: 50,
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        },
        scrollLeft: 0,
        scrollTop: 10,
        height: 200
      }));
      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 200,
        clientWidth: 200,
        scrollHeight: 50,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 2500
      });
    });

    // Support use-cases like WindowScroller; enable them to stay in sync with scroll-to-cell changes.
    it('should trigger when :scrollToColumn or :scrollToRow are changed via props', function () {
      var onScrollCalls = [];
      (0, _TestUtils.render)(getMarkup());
      (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        },
        scrollToColumn: 24,
        scrollToRow: 49
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        clientWidth: 200,
        scrollHeight: 2000,
        scrollLeft: 1050,
        scrollTop: 900,
        scrollWidth: 2500
      }]);
    });
  });

  describe('overscanColumnCount & overscanRowCount', function () {
    function createHelper() {
      var _columnOverscanStartIndex = void 0,
          _columnOverscanStopIndex = void 0,
          _columnStartIndex = void 0,
          _columnStopIndex = void 0,
          _rowOverscanStartIndex = void 0,
          _rowOverscanStopIndex = void 0,
          _rowStartIndex = void 0,
          _rowStopIndex = void 0;

      function onSectionRendered(params) {
        _columnOverscanStartIndex = params.columnOverscanStartIndex;
        _columnOverscanStopIndex = params.columnOverscanStopIndex;
        _columnStartIndex = params.columnStartIndex;
        _columnStopIndex = params.columnStopIndex;
        _rowOverscanStartIndex = params.rowOverscanStartIndex;
        _rowOverscanStopIndex = params.rowOverscanStopIndex;
        _rowStartIndex = params.rowStartIndex;
        _rowStopIndex = params.rowStopIndex;
      }

      return {
        columnOverscanStartIndex: function columnOverscanStartIndex() {
          return _columnOverscanStartIndex;
        },
        columnOverscanStopIndex: function columnOverscanStopIndex() {
          return _columnOverscanStopIndex;
        },
        columnStartIndex: function columnStartIndex() {
          return _columnStartIndex;
        },
        columnStopIndex: function columnStopIndex() {
          return _columnStopIndex;
        },
        onSectionRendered: onSectionRendered,
        rowOverscanStartIndex: function rowOverscanStartIndex() {
          return _rowOverscanStartIndex;
        },
        rowOverscanStopIndex: function rowOverscanStopIndex() {
          return _rowOverscanStopIndex;
        },
        rowStartIndex: function rowStartIndex() {
          return _rowStartIndex;
        },
        rowStopIndex: function rowStopIndex() {
          return _rowStopIndex;
        }
      };
    }

    it('should not overscan if disabled', function () {
      var helper = createHelper();
      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: helper.onSectionRendered
      }));
      expect(helper.columnOverscanStartIndex()).toEqual(helper.columnStartIndex());
      expect(helper.columnOverscanStopIndex()).toEqual(helper.columnStopIndex());
      expect(helper.rowOverscanStartIndex()).toEqual(helper.rowStartIndex());
      expect(helper.rowOverscanStopIndex()).toEqual(helper.rowStopIndex());
    });

    it('should overscan the specified amount', function () {
      var helper = createHelper();
      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: helper.onSectionRendered,
        overscanColumnCount: 2,
        overscanRowCount: 5,
        scrollToColumn: 25,
        scrollToRow: 50
      }));
      expect(helper.columnOverscanStartIndex()).toEqual(22);
      expect(helper.columnOverscanStopIndex()).toEqual(27);
      expect(helper.columnStartIndex()).toEqual(22);
      expect(helper.columnStopIndex()).toEqual(25);
      expect(helper.rowOverscanStartIndex()).toEqual(46);
      expect(helper.rowOverscanStopIndex()).toEqual(55);
      expect(helper.rowStartIndex()).toEqual(46);
      expect(helper.rowStopIndex()).toEqual(50);
    });

    it('should not overscan beyond the bounds of the grid', function () {
      var helper = createHelper();
      (0, _TestUtils.render)(getMarkup({
        onSectionRendered: helper.onSectionRendered,
        columnCount: 6,
        overscanColumnCount: 10,
        overscanRowCount: 10,
        rowCount: 5
      }));
      expect(helper.columnOverscanStartIndex()).toEqual(0);
      expect(helper.columnOverscanStopIndex()).toEqual(5);
      expect(helper.columnStartIndex()).toEqual(0);
      expect(helper.columnStopIndex()).toEqual(3);
      expect(helper.rowOverscanStartIndex()).toEqual(0);
      expect(helper.rowOverscanStopIndex()).toEqual(4);
      expect(helper.rowStartIndex()).toEqual(0);
      expect(helper.rowStopIndex()).toEqual(4);
    });

    it('should set the correct scroll direction', function () {
      // Do not pass in the initial state as props, otherwise the internal state is forbidden from updating itself
      var grid = (0, _TestUtils.render)(getMarkup());

      // Simulate a scroll to set the initial internal state
      simulateScroll({
        grid: grid,
        scrollLeft: 50,
        scrollTop: 50
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 0
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);

      simulateScroll({
        grid: grid,
        scrollLeft: 100,
        scrollTop: 100
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
    });

    it('should set the correct scroll direction when scroll position is updated from props', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        scrollLeft: 50,
        scrollTop: 50
      }));

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);

      grid = (0, _TestUtils.render)(getMarkup({
        scrollLeft: 0,
        scrollTop: 0
      }));

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);

      grid = (0, _TestUtils.render)(getMarkup({
        scrollLeft: 100,
        scrollTop: 100
      }));

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
    });

    it('should not reset scroll direction for one axis when scrolled in another', function () {
      // Do not pass in the initial state as props, otherwise the internal state is forbidden from updating itself
      var grid = (0, _TestUtils.render)(getMarkup());

      // Simulate a scroll to set the initial internal state
      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 5
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid: grid,
        scrollLeft: 5,
        scrollTop: 5
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);

      simulateScroll({
        grid: grid,
        scrollLeft: 5,
        scrollTop: 0
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);

      simulateScroll({
        grid: grid,
        scrollLeft: 0,
        scrollTop: 0
      });

      expect(grid.state.scrollDirectionHorizontal).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);
      expect(grid.state.scrollDirectionVertical).toEqual(_defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD);
    });

    it('should overscan in the direction being scrolled', function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(done) {
        var helper, onSectionRenderedResolve, onSectionRendered, grid, onSectionRenderedPromise;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                onSectionRendered = function onSectionRendered(params) {
                  helper.onSectionRendered(params);

                  if (onSectionRenderedResolve) {
                    onSectionRenderedResolve();
                  }
                };

                helper = createHelper();
                onSectionRenderedResolve = void 0;
                grid = (0, _TestUtils.render)(getMarkup({
                  onSectionRendered: onSectionRendered,
                  overscanColumnCount: 2,
                  overscanRowCount: 5
                }));

                // Wait until the onSectionRendered handler / debouncer has processed

                onSectionRenderedPromise = new Promise(function (resolve) {
                  onSectionRenderedResolve = resolve;
                });


                simulateScroll({
                  grid: grid,
                  scrollLeft: 200,
                  scrollTop: 200
                });

                _context.next = 8;
                return onSectionRenderedPromise;

              case 8:

                // It should overscan in the direction being scrolled while scroll is in progress
                expect(helper.columnOverscanStartIndex()).toEqual(4);
                expect(helper.columnOverscanStopIndex()).toEqual(9);
                expect(helper.columnStartIndex()).toEqual(4);
                expect(helper.columnStopIndex()).toEqual(7);
                expect(helper.rowOverscanStartIndex()).toEqual(10);
                expect(helper.rowOverscanStopIndex()).toEqual(19);
                expect(helper.rowStartIndex()).toEqual(10);
                expect(helper.rowStopIndex()).toEqual(14);

                // Wait until the onSectionRendered handler / debouncer has processed
                onSectionRenderedPromise = new Promise(function (resolve) {
                  onSectionRenderedResolve = resolve;
                });

                simulateScroll({
                  grid: grid,
                  scrollLeft: 100,
                  scrollTop: 100
                });

                _context.next = 20;
                return onSectionRenderedPromise;

              case 20:

                // It reset overscan once scrolling has finished
                expect(helper.columnOverscanStartIndex()).toEqual(0);
                expect(helper.columnOverscanStopIndex()).toEqual(5);
                expect(helper.columnStartIndex()).toEqual(2);
                expect(helper.columnStopIndex()).toEqual(5);
                expect(helper.rowOverscanStartIndex()).toEqual(0);
                expect(helper.rowOverscanStopIndex()).toEqual(9);
                expect(helper.rowStartIndex()).toEqual(5);
                expect(helper.rowStopIndex()).toEqual(9);

                done();

              case 29:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x2) {
        return _ref5.apply(this, arguments);
      };
    }());
  });

  describe('cellRangeRenderer', function () {
    it('should use a custom :cellRangeRenderer if specified', function () {
      var cellRangeRendererCalled = 0;
      var cellRangeRendererParams = void 0;
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRangeRenderer: function cellRangeRenderer(params) {
          cellRangeRendererParams = params;
          cellRangeRendererCalled++;

          return [_react2.default.createElement(
            'div',
            { key: '0' },
            'Fake content'
          )];
        }
      })));
      expect(cellRangeRendererCalled).toEqual(1);
      expect(cellRangeRendererParams.columnStartIndex).toEqual(0);
      expect(cellRangeRendererParams.columnStopIndex).toEqual(3);
      expect(cellRangeRendererParams.rowStartIndex).toEqual(0);
      expect(cellRangeRendererParams.rowStopIndex).toEqual(4);
      expect(rendered.textContent).toContain('Fake content');
    });
  });

  describe('estimated row and column sizes', function () {
    it('should not estimate sizes if actual sizes are numbers', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnWidth: 100,
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        rowHeight: 20
      }));
      expect(grid._getEstimatedColumnSize(grid.props)).toEqual(100);
      expect(grid._getEstimatedRowSize(grid.props)).toEqual(20);
    });

    it('should estimate row and column sizes if actual sizes are functions', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnWidth: function columnWidth() {
          return 100;
        },
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        rowHeight: function rowHeight() {
          return 20;
        }
      }));
      expect(grid._getEstimatedColumnSize(grid.props)).toEqual(150);
      expect(grid._getEstimatedRowSize(grid.props)).toEqual(15);
    });
  });

  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(done) {
      var cellRendererCalls, cellRenderer, grid;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cellRenderer = function cellRenderer(_ref7) {
                var columnIndex = _ref7.columnIndex,
                    isScrolling = _ref7.isScrolling,
                    key = _ref7.key,
                    rowIndex = _ref7.rowIndex,
                    style = _ref7.style;

                cellRendererCalls.push(isScrolling);
                return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
              };

              cellRendererCalls = [];
              grid = (0, _TestUtils.render)(getMarkup({
                cellRenderer: cellRenderer
              }));

              expect(cellRendererCalls[0]).toEqual(false);
              cellRendererCalls.splice(0);

              // Give React time to process the queued setState()
              _context2.next = 7;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1);
              });

            case 7:

              simulateScroll({ grid: grid, scrollTop: 100 });
              expect(cellRendererCalls[0]).toEqual(true);

              done();

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3) {
      return _ref6.apply(this, arguments);
    };
  }());

  it('should pass the cellRenderer an :isScrolling flag based on props override', function () {
    var cellRenderer = jest.fn();
    cellRenderer.mockImplementation(function (_ref8) {
      var key = _ref8.key,
          style = _ref8.style;
      return _react2.default.createElement('div', { key: key, style: style });
    });
    (0, _TestUtils.render)(getMarkup({
      cellRenderer: cellRenderer,
      isScrolling: true
    }));
    expect(cellRenderer).toHaveBeenCalled();
    expect(cellRenderer.mock.calls[0][0].isScrolling).toBe(true);
    cellRenderer.mockReset();
    (0, _TestUtils.render)(getMarkup({
      cellRenderer: cellRenderer,
      isScrolling: false,
      width: DEFAULT_WIDTH + 1
    }));
    expect(cellRenderer).toHaveBeenCalled();
    expect(cellRenderer.mock.calls[0][0].isScrolling).toBe(false);
  });

  it('should pass the cellRenderer an :isVisible flag', function () {
    var cellRendererCalls = [];
    function cellRenderer(props) {
      cellRendererCalls.push(props);
      return defaultCellRenderer(props);
    }
    (0, _TestUtils.render)(getMarkup({
      cellRenderer: cellRenderer,
      height: DEFAULT_ROW_HEIGHT,
      overscanColumnCount: 1,
      overscanRowCount: 1,
      width: DEFAULT_COLUMN_WIDTH
    }));
    cellRendererCalls.forEach(function (props) {
      expect(props.isVisible).toEqual(props.columnIndex === 0 && props.rowIndex === 0); // Only the first cell is visible
    });
  });

  describe('cell caching', function () {
    it('should not cache cells if the Grid is not scrolling', function () {
      var cellRendererCalls = [];
      function cellRenderer(_ref9) {
        var columnIndex = _ref9.columnIndex,
            key = _ref9.key,
            rowIndex = _ref9.rowIndex,
            style = _ref9.style;

        cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
        return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
      }
      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollToRow: 0,
        width: 100
      };

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 0
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);

      cellRendererCalls.splice(0);

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 1
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);
    });

    it('should not cache cells if the offsets are not adjusted', function () {
      var cellRendererCalls = [];
      function cellRenderer(_ref10) {
        var columnIndex = _ref10.columnIndex,
            key = _ref10.key,
            rowIndex = _ref10.rowIndex,
            style = _ref10.style;

        cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
        return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
      }
      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        rowCount: 100000,
        scrollToRow: 0,
        width: 100
      };

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 0
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);

      cellRendererCalls.splice(0);

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 1
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);
    });

    it('should cache a cell once it has been rendered while scrolling', function () {
      var cellRendererCalls = [];
      function cellRenderer(_ref11) {
        var columnIndex = _ref11.columnIndex,
            key = _ref11.key,
            rowIndex = _ref11.rowIndex,
            style = _ref11.style;

        cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
        return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
      }
      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        width: 100
      };

      var grid = (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 0
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);

      simulateScroll({ grid: grid, scrollTop: 1 });

      cellRendererCalls.splice(0);

      // Rows 0-2 have already rendered but row 3 is not yet visible
      // This means that only row 3 should be newly-created
      // The others should come from the cache
      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollToRow: 3
      })));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 3 }]);
    });

    it('should clear cache once :isScrolling is false', function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(done) {
        var cellRendererCalls, cellRenderer, props, grid;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                cellRenderer = function cellRenderer(_ref13) {
                  var columnIndex = _ref13.columnIndex,
                      key = _ref13.key,
                      rowIndex = _ref13.rowIndex,
                      style = _ref13.style;

                  cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
                  return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
                };

                cellRendererCalls = [];
                props = {
                  cellRenderer: cellRenderer,
                  columnWidth: 100,
                  height: 40,
                  rowHeight: 20,
                  scrollToRow: 0,
                  width: 100
                };
                grid = (0, _TestUtils.render)(getMarkup(props));

                expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);

                simulateScroll({ grid: grid, scrollTop: 1 });

                // Allow scrolling timeout to complete so that cell cache is reset
                _context3.next = 8;
                return new Promise(function (resolve) {
                  return setTimeout(resolve, _Grid.DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2);
                });

              case 8:

                cellRendererCalls.splice(0);

                (0, _TestUtils.render)(getMarkup(_extends({}, props, {
                  scrollToRow: 1
                })));
                expect(cellRendererCalls.length).not.toEqual(0);

                done();

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function (_x4) {
        return _ref12.apply(this, arguments);
      };
    }());

    it('should clear cache once :isScrolling via props is false', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var cellRenderer, props, scrollingStyle;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              cellRenderer = jest.fn();

              cellRenderer.mockImplementation(function (params) {
                return _react2.default.createElement('div', { key: params.key, style: params.style });
              });

              props = {
                autoHeight: true,
                cellRenderer: cellRenderer,
                columnCount: 1,
                isScrolling: true,
                rowCount: 1
              };


              (0, _TestUtils.render)(getMarkup(props));
              (0, _TestUtils.render)(getMarkup(props));
              expect(cellRenderer).toHaveBeenCalledTimes(1); // Due to cell cache

              scrollingStyle = cellRenderer.mock.calls[0][0].style;


              cellRenderer.mockReset();

              (0, _TestUtils.render)(getMarkup(_extends({}, props, {
                isScrolling: false
              })));

              expect(cellRenderer.mock.calls[0][0].style).toBe(scrollingStyle);
              expect(cellRenderer).toHaveBeenCalledTimes(1); // Reset cache

              cellRenderer.mockReset();

              (0, _TestUtils.render)(getMarkup(_extends({}, props, {
                isScrolling: true
              })));

              expect(cellRenderer.mock.calls[0][0].style).not.toBe(scrollingStyle);
              expect(cellRenderer).toHaveBeenCalledTimes(1); // Only cached when scrolling

            case 15:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('should clear cache if :recomputeGridSize is called', function () {
      var cellRendererCalls = [];
      function cellRenderer(_ref15) {
        var columnIndex = _ref15.columnIndex,
            key = _ref15.key,
            rowIndex = _ref15.rowIndex,
            style = _ref15.style;

        cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
        return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
      }
      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollTop: 0,
        width: 100
      };

      var grid = (0, _TestUtils.render)(getMarkup(props));
      expect(cellRendererCalls).toEqual([{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 1 }]);

      simulateScroll({ grid: grid, scrollTop: 1 });

      cellRendererCalls.splice(0);

      grid.recomputeGridSize();

      expect(cellRendererCalls.length).not.toEqual(0);
    });

    it('should support a custom :scrollingResetTimeInterval prop', function () {
      var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(done) {
        var cellRendererCalls, scrollingResetTimeInterval, cellRenderer, props, grid;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                cellRenderer = function cellRenderer(_ref17) {
                  var columnIndex = _ref17.columnIndex,
                      key = _ref17.key,
                      rowIndex = _ref17.rowIndex,
                      style = _ref17.style;

                  cellRendererCalls.push({ columnIndex: columnIndex, rowIndex: rowIndex });
                  return defaultCellRenderer({ columnIndex: columnIndex, key: key, rowIndex: rowIndex, style: style });
                };

                cellRendererCalls = [];
                scrollingResetTimeInterval = _Grid.DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2;
                props = {
                  cellRenderer: cellRenderer,
                  scrollingResetTimeInterval: scrollingResetTimeInterval
                };
                grid = (0, _TestUtils.render)(getMarkup(props));

                expect(cellRendererCalls.length > 0).toEqual(true);

                simulateScroll({ grid: grid, scrollTop: 1 });

                _context5.next = 9;
                return new Promise(function (resolve) {
                  return setTimeout(resolve, _Grid.DEFAULT_SCROLLING_RESET_TIME_INTERVAL);
                });

              case 9:

                cellRendererCalls.splice(0);
                (0, _TestUtils.render)(getMarkup(_extends({}, props, {
                  className: 'foo'
                })));
                expect(cellRendererCalls.length).toEqual(0);

                _context5.next = 14;
                return new Promise(function (resolve) {
                  return setTimeout(resolve, _Grid.DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2);
                });

              case 14:

                cellRendererCalls.splice(0);
                (0, _TestUtils.render)(getMarkup(_extends({}, props, {
                  className: 'bar'
                })));
                expect(cellRendererCalls.length).not.toEqual(0);

                done();

              case 18:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function (_x5) {
        return _ref16.apply(this, arguments);
      };
    }());
  });

  describe('measureAllCells', function () {
    it('should measure any unmeasured columns and rows', function () {
      var grid = (0, _TestUtils.render)(getMarkup({
        columnCount: 10,
        columnWidth: function columnWidth() {
          return 100;
        },
        estimatedColumnSize: 150,
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: function rowHeight() {
          return 20;
        },
        width: 0
      }));
      expect(grid._columnSizeAndPositionManager.getTotalSize()).toEqual(1500);
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150);
      grid.measureAllCells();
      expect(grid._columnSizeAndPositionManager.getTotalSize()).toEqual(1000);
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200);
    });
  });

  describe('recomputeGridSize', function () {
    it('should recompute cell sizes and other values when called', function () {
      var columnIndices = [];
      var rowIndices = [];
      function columnWidth(_ref18) {
        var index = _ref18.index;

        columnIndices.push(index);
        return 10;
      }
      function rowHeight(_ref19) {
        var index = _ref19.index;

        rowIndices.push(index);
        return 10;
      }
      var props = {
        columnCount: 50,
        columnWidth: columnWidth,
        height: 50,
        rowHeight: rowHeight,
        rowCount: 50,
        width: 100
      };
      var component = (0, _TestUtils.render)(getMarkup(props));

      columnIndices.splice(0);
      rowIndices.splice(0);

      component.recomputeGridSize();

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(0);
      expect(columnIndices[columnIndices.length - 1]).toEqual(9);
      expect(rowIndices[0]).toEqual(0);
      expect(rowIndices[rowIndices.length - 1]).toEqual(4);

      columnIndices.splice(0);
      rowIndices.splice(0);

      component.recomputeGridSize({
        columnIndex: 4,
        rowIndex: 2
      });

      // Only the rows required to fill the current viewport will be rendered
      expect(columnIndices[0]).toEqual(4);
      expect(columnIndices[columnIndices.length - 1]).toEqual(9);
      expect(rowIndices[0]).toEqual(2);
      expect(rowIndices[rowIndices.length - 1]).toEqual(4);
    });
  });

  describe('autoContainerWidth', function () {
    it('should set the innerScrollContainer width to auto to better support single-column HOCs', function () {
      var props = {
        autoContainerWidth: true
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto');
    });

    it('should set the innerScrollContainer width to :totalColumnsWidth unless :autoContainerWidth', function () {
      var props = {
        autoContainerWidth: false
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('2500px'); // 50 columns x 50px
    });
  });

  describe('autoHeight', function () {
    it('should set the container height to auto to adjust to innerScrollContainer height', function () {
      var props = {
        autoHeight: true
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.style.height).toEqual('auto');
    });

    it('should have container height still affecting number of rows rendered', function () {
      var props = {
        height: 500,
        autoHeight: true
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(100); // 25 rows x 4 columns
    });

    it('should have innerScrollContainer height to be equal number of rows * rowHeight', function () {
      var props = {
        autoHeight: true
      };
      var grid = (0, _TestUtils.render)(getMarkup(props));
      var rendered = (0, _reactDom.findDOMNode)(grid);
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.height).toEqual('2000px'); // 100 rows * 20px rowHeight
      expect(grid._rowSizeAndPositionManager.getTotalSize()).toEqual(2000);
    });
  });

  describe('autoWidth', function () {
    it('should set the container width to auto to adjust to innerScrollContainer width', function () {
      var props = {
        autoWidth: true
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.style.width).toEqual('auto');
    });

    it('should have container width still affecting number of columns rendered', function () {
      var props = {
        width: 500,
        autoWidth: true
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(props)));
      expect(rendered.querySelectorAll('.gridItem').length).toEqual(50); // 5 rows x 10 columns
    });

    it('should have innerScrollContainer width to be equal number of columns * columnWidth', function () {
      var props = {
        autoWidth: true
      };
      var grid = (0, _TestUtils.render)(getMarkup(props));
      var rendered = (0, _reactDom.findDOMNode)(grid);
      expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('2500px'); // 50 columns * 50px columnWidth
      expect(grid._columnSizeAndPositionManager.getTotalSize()).toEqual(2500);
    });
  });

  describe('tabIndex', function () {
    it('should be focusable by default', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(rendered.tabIndex).toEqual(0);
    });

    it('should allow tabIndex to be overridden', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        tabIndex: -1
      })));
      expect(rendered.tabIndex).toEqual(-1);
    });
  });

  describe('role', function () {
    it('should have grid role by default', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(rendered.getAttribute('role')).toEqual('grid');
    });

    it('should allow role to be overridden', function () {
      var role = null;
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ role: role })));
      expect(rendered.getAttribute('role')).toEqual(role);
    });
  });

  describe('pure', function () {
    it('should not re-render unless props have changed', function () {
      var cellRendererCalled = false;
      function cellRenderer(_ref20) {
        var key = _ref20.key,
            style = _ref20.style;

        cellRendererCalled = true;
        return _react2.default.createElement('div', { key: key, style: style });
      }
      var markup = getMarkup({ cellRenderer: cellRenderer });
      (0, _TestUtils.render)(markup);
      expect(cellRendererCalled).toEqual(true);
      cellRendererCalled = false;
      (0, _TestUtils.render)(markup);
      expect(cellRendererCalled).toEqual(false);
    });

    it('should not re-render grid components if they extend PureComponent', function () {
      var componentUpdates = 0;

      var GridComponent = function (_React$PureComponent) {
        _inherits(GridComponent, _React$PureComponent);

        function GridComponent() {
          _classCallCheck(this, GridComponent);

          return _possibleConstructorReturn(this, (GridComponent.__proto__ || Object.getPrototypeOf(GridComponent)).apply(this, arguments));
        }

        _createClass(GridComponent, [{
          key: 'componentDidUpdate',
          value: function componentDidUpdate() {
            componentUpdates++;
          }
        }, {
          key: 'render',
          value: function render() {
            var _props = this.props,
                columnIndex = _props.columnIndex,
                rowIndex = _props.rowIndex,
                style = _props.style;

            return _react2.default.createElement(
              'div',
              { className: 'gridItem', style: style },
              'row:' + rowIndex + ', column:' + columnIndex
            );
          }
        }]);

        return GridComponent;
      }(_react2.default.PureComponent);

      function cellRenderer(_ref21) {
        var columnIndex = _ref21.columnIndex,
            key = _ref21.key,
            rowIndex = _ref21.rowIndex,
            style = _ref21.style;

        return _react2.default.createElement(GridComponent, {
          key: key,
          columnIndex: columnIndex,
          rowIndex: rowIndex,
          style: style
        });
      }

      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 40,
        rowHeight: 20,
        scrollTop: 0,
        width: 100
      };

      var grid = (0, _TestUtils.render)(getMarkup(props));
      simulateScroll({ grid: grid, scrollToIndex: 1 });

      expect(componentUpdates).toEqual(0);
    });

    it('should clear all but the visible rows from the style cache once :isScrolling is false', function () {
      var _ref22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(done) {
        var props, grid;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                props = {
                  columnWidth: 50,
                  height: 100,
                  overscanColumnCount: 0,
                  overscanRowCount: 0,
                  rowHeight: 50,
                  width: 100
                };
                grid = (0, _TestUtils.render)(getMarkup(props));


                expect(Object.keys(grid._styleCache).length).toBe(4);

                simulateScroll({ grid: grid, scrollTop: 50 });

                expect(Object.keys(grid._styleCache).length).toBe(6);

                // Allow scrolling timeout to complete so that cell cache is reset
                _context6.next = 7;
                return new Promise(function (resolve) {
                  return setTimeout(resolve, _Grid.DEFAULT_SCROLLING_RESET_TIME_INTERVAL * 2);
                });

              case 7:

                expect(Object.keys(grid._styleCache).length).toBe(4);

                done();

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      }));

      return function (_x6) {
        return _ref22.apply(this, arguments);
      };
    }());

    it('should clear style cache if :recomputeGridSize is called', function () {
      var props = {
        columnWidth: 50,
        height: 100,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowHeight: 50,
        width: 100
      };

      var grid = (0, _TestUtils.render)(getMarkup(props));

      expect(Object.keys(grid._styleCache).length).toBe(4);

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        scrollTop: 50
      })));

      expect(Object.keys(grid._styleCache).length).toBe(6);

      grid.recomputeGridSize();

      expect(Object.keys(grid._styleCache).length).toBe(4);
    });

    it('should clear style cache if cell sizes change', function () {
      var cellRendererCalls = [];
      function cellRenderer(params) {
        cellRendererCalls.push(params);
        return _react2.default.createElement('div', { key: params.key, style: params.style });
      }

      var props = {
        cellRenderer: cellRenderer,
        columnWidth: 100,
        height: 100,
        overscanColumnCount: 0,
        overscanRowCount: 0,
        rowHeight: 100,
        width: 100
      };

      (0, _TestUtils.render)(getMarkup(props));

      expect(cellRendererCalls.length).toEqual(1);
      expect(cellRendererCalls[0].style.width).toEqual(100);

      (0, _TestUtils.render)(getMarkup(_extends({}, props, {
        columnWidth: 50,
        width: 50
      })));

      expect(cellRendererCalls.length).toEqual(2);
      expect(cellRendererCalls[1].style.width).toEqual(50);
    });
  });

  it('should not pull from the style cache while scrolling if there is an offset adjustment', function () {
    var cellRendererCalls = [];
    function cellRenderer(params) {
      cellRendererCalls.push(params);
      return _react2.default.createElement('div', { key: params.key, style: params.style });
    }

    var grid = (0, _TestUtils.render)(getMarkup({
      cellRenderer: cellRenderer,
      width: 100,
      height: 100,
      rowHeight: 100,
      columnWidth: 100,
      rowCount: _ScalingCellSizeAndPositionManager.DEFAULT_MAX_SCROLL_SIZE * 2 / 100, // lots of offset
      scrollTop: 2000
    }));

    simulateScroll({
      grid: grid,
      scrollTop: 2100
    });

    // cellRendererCalls[0] is the element at rowIndex 0
    var firstProps = cellRendererCalls[1];
    var secondProps = cellRendererCalls[2];

    expect(cellRendererCalls.length).toEqual(3);
    expect(firstProps.style).not.toBe(secondProps.style);
  });

  it('should only cache styles when a :deferredMeasurementCache is provided if the cell has already been measured', function () {
    var cache = new _CellMeasurer.CellMeasurerCache({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 100);
    cache.set(1, 1, 100, 100);

    var grid = (0, _TestUtils.render)(getMarkup({
      columnCount: 2,
      deferredMeasurementCache: cache,
      rowCount: 2
    }));

    var keys = Object.keys(grid._styleCache);

    expect(keys).toEqual(['0-0', '1-1']);
  });

  describe('DEV warnings', function () {
    it('should warn about cells that forget to include the :style property', function () {
      spyOn(console, 'warn');

      function cellRenderer(params) {
        return _react2.default.createElement('div', { key: params.key });
      }

      (0, _TestUtils.render)(getMarkup({
        cellRenderer: cellRenderer
      }));

      expect(console.warn).toHaveBeenCalledWith('Rendered cell should include style property for positioning.');
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should warn about CellMeasurer measured cells that forget to include the :style property', function () {
      spyOn(console, 'warn');

      var cache = new _CellMeasurer.CellMeasurerCache({
        fixedWidth: true
      });

      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (params) {
        return _react2.default.createElement(
          _CellMeasurer.CellMeasurer,
          {
            cache: cache,
            columnIndex: params.columnIndex,
            key: params.key,
            parent: params.parent,
            rowIndex: params.rowIndex,
            style: params.style },
          _react2.default.createElement('div', null)
        );
      });

      (0, _TestUtils.render)(getMarkup({
        cellRenderer: cellRenderer,
        columnCount: 1,
        deferredMeasurementCache: cache,
        rowCount: 1
      }));

      expect(console.warn).toHaveBeenCalledWith('Rendered cell should include style property for positioning.');
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('deferredMeasurementCache', function () {
    it('invalidateCellSizeAfterRender should invalidate cache and refresh displayed cells after mount', function () {
      var cache = new _CellMeasurer.CellMeasurerCache({
        fixedWidth: true
      });

      var invalidateCellSizeAfterRender = true;

      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (params) {
        // Don't get stuck in a loop
        if (invalidateCellSizeAfterRender) {
          invalidateCellSizeAfterRender = false;

          params.parent.invalidateCellSizeAfterRender({
            columnIndex: 1,
            rowIndex: 0
          });
        }
        return _react2.default.createElement('div', { key: params.key, style: params.style });
      });

      var props = {
        cellRenderer: cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 2
      };

      (0, _TestUtils.render)(getMarkup(props));

      // 4 times for initial render + 4 once cellCache was cleared
      expect(cellRenderer).toHaveBeenCalledTimes(8);
    });

    it('should invalidate cache and refresh displayed cells after update', function () {
      var cache = new _CellMeasurer.CellMeasurerCache({
        fixedWidth: true
      });

      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (params) {
        return _react2.default.createElement('div', { key: params.key, style: params.style });
      });

      var props = {
        cellRenderer: cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 2
      };

      var grid = (0, _TestUtils.render)(getMarkup(props));

      expect(cellRenderer).toHaveBeenCalledTimes(4);

      var invalidateCellSizeAfterRender = false;

      cellRenderer.mockReset();
      cellRenderer.mockImplementation(function (params) {
        // Don't get stuck in a loop
        if (invalidateCellSizeAfterRender) {
          invalidateCellSizeAfterRender = false;
          params.parent.invalidateCellSizeAfterRender({
            columnIndex: 1,
            rowIndex: 0
          });
        }
        return _react2.default.createElement('div', { key: params.key, style: params.style });
      });

      invalidateCellSizeAfterRender = true;
      grid.recomputeGridSize();

      // 4 times for initial render + 4 once cellCache was cleared
      expect(cellRenderer).toHaveBeenCalledTimes(8);
    });

    it('should not cache cells until they have been measured by CellMeasurer', function () {
      var cache = new _CellMeasurer.CellMeasurerCache({
        fixedWidth: true
      });

      // Fake measure cell 0,0 but not cell 0,1
      cache.set(0, 0, 100, 30);

      var cellRenderer = jest.fn();
      cellRenderer.mockImplementation(function (params) {
        return _react2.default.createElement('div', { key: params.key, style: params.style });
      });

      var props = {
        cellRenderer: cellRenderer,
        columnCount: 2,
        deferredMeasurementCache: cache,
        rowCount: 1
      };

      // Trigger 2 renders
      // The second render should re-use the style for cell 0,0
      // But should not re-use the style for cell 0,1 since it was not measured
      var grid = (0, _TestUtils.render)(getMarkup(props));
      grid.forceUpdate();

      // 0,0 - 0,1 - 0,0 - 0,1
      expect(cellRenderer).toHaveBeenCalledTimes(4);
      var style00A = cellRenderer.mock.calls[0][0].style;
      var style01A = cellRenderer.mock.calls[1][0].style;
      var style00B = cellRenderer.mock.calls[2][0].style;
      var style01B = cellRenderer.mock.calls[3][0].style;
      expect(style00A).toBe(style00B);
      expect(style01A).not.toBe(style01B);
    });
  });

  describe('onScrollbarPresenceChange', function () {
    it('should not trigger on-mount if scrollbars are hidden', function () {
      var onScrollbarPresenceChange = jest.fn();

      (0, _TestUtils.render)(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });

    it('should trigger on-mount if scrollbars are visible', function () {
      var onScrollbarPresenceChange = jest.fn();

      (0, _TestUtils.render)(getMarkup({
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
      (0, _TestUtils.render)(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();

      (0, _TestUtils.render)(getMarkup({
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
      (0, _TestUtils.render)(getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 1
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
      (0, _TestUtils.render)(getMarkup({
        columnCount: 2,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange: onScrollbarPresenceChange,
        rowCount: 2
      }));
      expect(onScrollbarPresenceChange).not.toHaveBeenCalled();
    });
  });
});