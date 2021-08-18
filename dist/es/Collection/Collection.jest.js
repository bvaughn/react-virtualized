import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _typeof from "@babel/runtime/helpers/typeof";
import _extends from "@babel/runtime/helpers/extends";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Tests Collection and CollectionView.
 * 
 */
import getScrollbarSize from 'dom-helpers/scrollbarSize';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { render } from '../TestUtils';
import Collection from './Collection';
import { CELLS, SECTION_SIZE } from './TestData';
describe('Collection', function () {
  function defaultCellRenderer(_ref) {
    var index = _ref.index,
        key = _ref.key,
        style = _ref.style;
    return React.createElement("div", {
      className: "cell",
      key: key,
      style: style
    }, "cell:", index);
  }

  function getMarkup() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _props$cellCount = props.cellCount,
        cellCount = _props$cellCount === void 0 ? CELLS.length : _props$cellCount;

    function defaultCellSizeAndPositionGetter(_ref2) {
      var index = _ref2.index;
      index %= cellCount;
      return CELLS[index];
    }

    return React.createElement(Collection, _extends({
      cellCount: cellCount,
      cellRenderer: defaultCellRenderer,
      cellSizeAndPositionGetter: defaultCellSizeAndPositionGetter,
      height: SECTION_SIZE,
      sectionSize: SECTION_SIZE,
      width: SECTION_SIZE * 2
    }, props));
  }

  function simulateScroll(_ref3) {
    var collection = _ref3.collection,
        _ref3$scrollLeft = _ref3.scrollLeft,
        scrollLeft = _ref3$scrollLeft === void 0 ? 0 : _ref3$scrollLeft,
        _ref3$scrollTop = _ref3.scrollTop,
        scrollTop = _ref3$scrollTop === void 0 ? 0 : _ref3$scrollTop;
    var target = {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
    collection._collectionView._scrollingContainer = target; // HACK to work around _onScroll target check

    Simulate.scroll(findDOMNode(collection), {
      target: target
    });
  }

  function compareArrays(array1, array2) {
    expect(array1.length).toEqual(array2.length);
    array2.forEach(function (value) {
      expect(array1).toContain(value);
    });
  }

  describe('number of rendered children', function () {
    it('should render enough children to fill the available area', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll('.cell').length).toEqual(4);
    });
    it('should not render more cells than available if the area is not filled', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellCount: 2
      })));
      expect(rendered.querySelectorAll('.cell').length).toEqual(2);
    }); // Small performance tweak added in 5.5.6

    it('should not render/parent cells that are null or false', function () {
      function cellRenderer(_ref4) {
        var index = _ref4.index,
            key = _ref4.key,
            style = _ref4.style;

        if (index > 2) {
          return null;
        } else {
          return React.createElement("div", {
            className: "cell",
            key: key,
            style: style
          }, index);
        }
      }

      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: cellRenderer
      })));
      expect(rendered.querySelectorAll('.cell').length).toEqual(3);
    });
  });
  describe('shows and hides scrollbars based on rendered content', function () {
    var scrollbarSize;
    beforeAll(function () {
      scrollbarSize = getScrollbarSize();
    });
    it('should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 4,
        width: 6
      })));
      expect(rendered.style.overflowX).toEqual('hidden');
    });
    it('should set overflowX:hidden if columns and y-axis scrollbar fit within the available width', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 1,
        width: 6 + scrollbarSize
      })));
      expect(rendered.style.overflowX).toEqual('hidden');
    });
    it('should leave overflowX:auto if columns require more than the available width', function () {
      var rendered = findDOMNode(render(getMarkup({
        width: 1
      })));
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });
    it('should leave overflowX:auto if columns and y-axis scrollbar require more than the available width', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 1,
        width: 6 + scrollbarSize - 1
      })));
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });
    it('should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 4,
        width: 6
      })));
      expect(rendered.style.overflowY).toEqual('hidden');
    });
    it('should set overflowY:hidden if rows and x-axis scrollbar fit within the available width', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 4 + scrollbarSize,
        width: 1
      })));
      expect(rendered.style.overflowY).toEqual('hidden');
    });
    it('should leave overflowY:auto if rows require more than the available height', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 1
      })));
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });
    it('should leave overflowY:auto if rows and y-axis scrollbar require more than the available height', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 4 + scrollbarSize - 1,
        width: 1
      })));
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });
    it('should accept styles that overwrite calculated ones', function () {
      var rendered = findDOMNode(render(getMarkup({
        height: 1,
        style: {
          overflowX: 'auto',
          overflowY: 'auto'
        },
        width: 1
      })));
      expect(rendered.style.overflowX).toEqual('auto');
      expect(rendered.style.overflowY).toEqual('auto');
    });
  });
  describe('autoHeight', function () {
    it('should set the container height to auto to adjust to innerScrollContainer height', function () {
      var props = {
        autoHeight: true
      };
      var rendered = findDOMNode(render(getMarkup(props)));
      expect(rendered.style.height).toEqual('auto');
    });
    it('should have container height still affecting number of rows rendered', function () {
      var indices;
      var props = {
        autoHeight: true,
        height: 500,
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        }
      };
      findDOMNode(render(getMarkup(props)));
      compareArrays(indices, [0, 1, 2, 3, 4, 5]);
    });
    it('should have innerScrollContainer height to be equal number of rows * rowHeight', function () {
      var props = {
        autoHeight: true
      };
      var rendered = findDOMNode(render(getMarkup(props)));
      expect(rendered.querySelector('.ReactVirtualized__Collection__innerScrollContainer').style.height).toEqual('4px');
    });
  });
  describe(':scrollToCell', function () {
    it('should scroll to the top/left', function () {
      var collection = render(getMarkup({
        scrollToCell: 0
      }));
      expect(collection._collectionView.state.scrollLeft).toEqual(0);
      expect(collection._collectionView.state.scrollTop).toEqual(0);
    });
    it('should scroll over to the middle', function () {
      var collection = render(getMarkup({
        scrollToCell: 7
      }));
      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(1);
    });
    it('should scroll to the bottom/right', function () {
      var collection = render(getMarkup({
        scrollToCell: 9
      }));
      expect(collection._collectionView.state.scrollLeft).toEqual(2);
      expect(collection._collectionView.state.scrollTop).toEqual(2);
    });
    it('should honor the specified :scrollToAlignment', function () {
      var collection = render(getMarkup({
        scrollToAlignment: 'start',
        scrollToCell: 2,
        width: SECTION_SIZE
      })); // Minimum amount of scrolling ("auto") would be 0,0

      expect(collection._collectionView.state.scrollLeft).toEqual(2);
      expect(collection._collectionView.state.scrollTop).toEqual(1);
      collection = render(getMarkup({
        scrollToAlignment: 'end',
        scrollToCell: 2,
        width: SECTION_SIZE
      })); // This cell would already by visible by "auto" rules

      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(0);
      collection = render(getMarkup({
        scrollToAlignment: 'center',
        scrollToCell: 4,
        width: SECTION_SIZE
      })); // This cell doesn't fit entirely in the viewport but we center it anyway.

      expect(collection._collectionView.state.scrollLeft).toEqual(0.5);
      expect(collection._collectionView.state.scrollTop).toEqual(2);
    });
    it('should scroll to a cell just added', function () {
      var collection = render(getMarkup({
        cellCount: 4
      }));
      expect(collection._collectionView.state.scrollLeft).toEqual(0);
      expect(collection._collectionView.state.scrollTop).toEqual(0);
      collection = render(getMarkup({
        cellCount: 8,
        scrollToCell: 7
      }));
      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(1);
    });
  });
  describe('property updates', function () {
    it('should update :scrollToCell position when :width changes', function () {
      var collection = findDOMNode(render(getMarkup({
        scrollToCell: 3
      })));
      expect(collection.textContent).toContain('cell:3'); // Making the collection narrower leaves only room for 1 item

      collection = findDOMNode(render(getMarkup({
        scrollToCell: 3,
        width: 1
      })));
      expect(collection.textContent).toContain('cell:3');
    });
    it('should update :scrollToCell position when :height changes', function () {
      var collection = findDOMNode(render(getMarkup({
        scrollToCell: 4
      })));
      expect(collection.textContent).toContain('cell:4'); // Making the collection shorter leaves only room for 1 item

      collection = findDOMNode(render(getMarkup({
        scrollToCell: 4,
        height: 1
      })));
      expect(collection.textContent).toContain('cell:4');
    });
    it('should update scroll position when :scrollToCell changes', function () {
      var collection = findDOMNode(render(getMarkup()));
      expect(collection.textContent).not.toContain('cell:9');
      collection = findDOMNode(render(getMarkup({
        scrollToCell: 9
      })));
      expect(collection.textContent).toContain('cell:9');
    });
  });
  describe('noContentRenderer', function () {
    it('should call :noContentRenderer if :cellCount is 0', function () {
      var list = findDOMNode(render(getMarkup({
        noContentRenderer: function noContentRenderer() {
          return React.createElement("div", null, "No data");
        },
        cellCount: 0
      })));
      expect(list.textContent).toEqual('No data');
    });
    it('should render an empty body if :cellCount is 0 and there is no :noContentRenderer', function () {
      var list = findDOMNode(render(getMarkup({
        cellCount: 0
      })));
      expect(list.textContent).toEqual('');
    });
    it('should not show the :noContentRenderer when there are children, even if no children are currently visible (sparse)', function () {
      var offscreenSizeAndPosition = {
        x: SECTION_SIZE * 3,
        y: SECTION_SIZE * 3,
        width: 1,
        height: 1
      };

      function cellSizeAndPositionGetter() {
        return offscreenSizeAndPosition;
      }

      var list = findDOMNode(render(getMarkup({
        cellCount: 1,
        cellSizeAndPositionGetter: cellSizeAndPositionGetter,
        noContentRenderer: function noContentRenderer() {
          return React.createElement("div", null, "No data");
        }
      })));
      expect(list.textContent).not.toEqual('No data');
    });
  });
  describe('onSectionRendered', function () {
    it('should call :onSectionRendered if at least one cell is rendered', function () {
      var indices;
      render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        }
      }));
      compareArrays(indices, [0, 1, 2, 3]);
    });
    it('should not call :onSectionRendered unless the rendered indices have changed', function () {
      var numCalls = 0;
      var indices;

      var onSectionRendered = function onSectionRendered(params) {
        indices = params.indices;
        numCalls++;
      };

      render(getMarkup({
        onSectionRendered: onSectionRendered
      }));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
      render(getMarkup({
        onSectionRendered: onSectionRendered
      }));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
    });
    it('should call :onSectionRendered if the rendered indices have changed', function () {
      var numCalls = 0;
      var indices;

      var onSectionRendered = function onSectionRendered(params) {
        indices = params.indices;
        numCalls++;
      };

      render(getMarkup({
        onSectionRendered: onSectionRendered
      }));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
      render(getMarkup({
        height: SECTION_SIZE * 2,
        onSectionRendered: onSectionRendered
      }));
      expect(numCalls).toEqual(2);
      compareArrays(indices, [0, 1, 2, 3, 4, 5]);
      render(getMarkup({
        height: SECTION_SIZE * 2,
        onSectionRendered: onSectionRendered,
        width: SECTION_SIZE
      }));
      expect(numCalls).toEqual(3);
      expect(indices).toEqual([0, 4]);
    });
    it('should not call :onSectionRendered if no cells are rendered', function () {
      var numCalls = 0;
      render(getMarkup({
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
      var indices;
      var collection = render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        },
        scrollLeft: 2,
        scrollTop: 2
      }));
      compareArrays(indices, [3, 4, 5, 7, 8, 9]);
      expect(collection._collectionView.state.scrollPositionChangeReason).toEqual('requested');
    });
    it('should render correctly when :scrollLeft and :scrollTop properties are updated', function () {
      var indices;
      render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        }
      }));
      compareArrays(indices, [0, 1, 2, 3]);
      var collection = render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        },
        scrollLeft: 2,
        scrollTop: 2
      }));
      compareArrays(indices, [3, 4, 5, 7, 8, 9]);
      expect(collection._collectionView.state.scrollPositionChangeReason).toEqual('requested');
    });
  });
  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.className).toEqual('ReactVirtualized__Collection');
    });
    it('should use a custom :className if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        className: 'foo'
      })));
      expect(rendered.className).toContain('foo');
    });
    it('should use a custom :id if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        id: 'bar'
      })));
      expect(rendered.getAttribute('id')).toEqual('bar');
    });
    it('should use a custom :style if specified', function () {
      var style = {
        backgroundColor: 'red'
      };
      var rendered = findDOMNode(render(getMarkup({
        style: style
      })));
      expect(rendered.style.backgroundColor).toEqual('red');
    });
  });
  describe('onScroll', function () {
    it('should trigger callback when component is mounted', function () {
      var onScrollCalls = [];
      render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        },
        scrollLeft: 2,
        scrollTop: 1
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 2,
        scrollTop: 1,
        scrollWidth: 6
      }]);
    });
    it('should trigger callback when component scrolls horizontally', function () {
      var onScrollCalls = [];
      var collection = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      simulateScroll({
        collection: collection,
        scrollLeft: 1,
        scrollTop: 0
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 1,
        scrollTop: 0,
        scrollWidth: 6
      });
    });
    it('should trigger callback when component scrolls vertically', function () {
      var onScrollCalls = [];
      var collection = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      simulateScroll({
        collection: collection,
        scrollLeft: 0,
        scrollTop: 2
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 0,
        scrollTop: 2,
        scrollWidth: 6
      });
    });
    it('should not allow negative scroll values', function () {
      var onScrollCalls = [];
      var collection = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      simulateScroll({
        collection: collection,
        scrollLeft: -1,
        scrollTop: -1
      });
      expect(onScrollCalls.length).toEqual(1);
      expect(onScrollCalls[0].scrollLeft).toEqual(0);
      expect(onScrollCalls[0].scrollTop).toEqual(0);
    });
  });
  describe('cellGroupRenderer', function () {
    it('should use a custom :cellGroupRenderer if specified', function () {
      var cellGroupRendererCalled = 0;
      var cellGroupRendererParams;

      var cellRenderer = function cellRenderer(_ref5) {
        var index = _ref5.index,
            key = _ref5.key,
            style = _ref5.style;
        return React.createElement("div", {
          key: key,
          style: style
        }, index);
      };

      findDOMNode(render(getMarkup({
        cellRenderer: cellRenderer,
        cellGroupRenderer: function cellGroupRenderer(params) {
          cellGroupRendererParams = params;
          cellGroupRendererCalled++;
          return [React.createElement("div", {
            key: "0"
          }, "Fake content")];
        }
      })));
      expect(cellGroupRendererCalled).toEqual(1);
      expect(cellGroupRendererParams.cellRenderer).toEqual(cellRenderer);
      expect(_typeof(cellGroupRendererParams.cellSizeAndPositionGetter)).toEqual('function');
      compareArrays(cellGroupRendererParams.indices, [0, 1, 2, 3]);
    });
  });
  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', function _callee(done) {
    var cellRendererCalls, cellRenderer, collection;
    return _regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cellRenderer = function _ref7(_ref6) {
              var index = _ref6.index,
                  isScrolling = _ref6.isScrolling,
                  key = _ref6.key,
                  style = _ref6.style;
              cellRendererCalls.push(isScrolling);
              return defaultCellRenderer({
                index: index,
                key: key,
                style: style
              });
            };

            cellRendererCalls = [];
            collection = render(getMarkup({
              cellRenderer: cellRenderer
            }));
            expect(cellRendererCalls[0]).toEqual(false);
            cellRendererCalls.splice(0);
            simulateScroll({
              collection: collection,
              scrollTop: 1
            }); // Give React time to process the queued setState()

            _context.next = 8;
            return _regeneratorRuntime.awrap(new Promise(function (resolve) {
              return setTimeout(resolve, 1);
            }));

          case 8:
            expect(cellRendererCalls[0]).toEqual(true);
            done();

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  describe('horizontalOverscanSize and verticalOverscanSize', function () {
    it('should include the horizontal and vertical overscan size when rendering cells', function () {
      var indices;
      render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        },
        height: 1,
        horizontalOverscanSize: 2,
        sectionSize: 1,
        scrollLeft: 2,
        scrollTop: 2,
        width: 1,
        verticalOverscanSize: 1
      }));
      compareArrays(indices, [0, 2, 3, 4, 5, 6, 7, 9]);
    });
    it('should not exceed the top/left borders regardless of overscan size', function () {
      var indices;
      render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        },
        height: 2,
        horizontalOverscanSize: 1,
        sectionSize: 1,
        scrollLeft: 0,
        scrollTop: 0,
        width: 1,
        verticalOverscanSize: 2
      }));
      compareArrays(indices, [0, 4]);
    });
    it('should not exceed the bottom/right borders regardless of overscan size', function () {
      var indices;
      render(getMarkup({
        onSectionRendered: function onSectionRendered(params) {
          indices = params.indices;
        },
        height: 2,
        horizontalOverscanSize: 1,
        sectionSize: 1,
        scrollLeft: 5,
        scrollTop: 2,
        width: 1,
        verticalOverscanSize: 2
      }));
      compareArrays(indices, [6, 7, 8, 9]);
    });
  });
  describe('cell caching', function () {
    it('should not cache cells if the Grid is not scrolling', function () {
      var cellRendererCalls = [];

      function cellRenderer(_ref8) {
        var isScrolling = _ref8.isScrolling,
            index = _ref8.index,
            key = _ref8.key,
            style = _ref8.style;
        cellRendererCalls.push({
          isScrolling: isScrolling,
          index: index
        });
        return defaultCellRenderer({
          index: index,
          key: key,
          style: style
        });
      }

      var props = {
        cellRenderer: cellRenderer,
        scrollLeft: 0,
        scrollTop: 0
      };
      findDOMNode(render(getMarkup(props)));
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(function (call) {
        return expect(call.isScrolling).toEqual(false);
      });
      cellRendererCalls.splice(0);
      render(getMarkup(_objectSpread({}, props, {
        foo: 'bar' // Force re-render

      })));
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(function (call) {
        return expect(call.isScrolling).toEqual(false);
      });
    });
    it.skip('should cache a cell once it has been rendered while scrolling', function () {
      var cellRendererCalls = [];

      function cellRenderer(_ref9) {
        var isScrolling = _ref9.isScrolling,
            index = _ref9.index,
            key = _ref9.key,
            style = _ref9.style;
        cellRendererCalls.push({
          isScrolling: isScrolling,
          index: index
        });
        return defaultCellRenderer({
          index: index,
          key: key,
          style: style
        });
      }

      var props = {
        cellRenderer: cellRenderer,
        scrollLeft: 0,
        scrollTop: 0
      };
      var collection = render(getMarkup(props));
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(function (call) {
        return expect(call.isScrolling).toEqual(false);
      }); // FIXME: simulate scroll is not triggering cells to render in cache
      // Scroll a little bit; newly-rendered cells will be cached.

      simulateScroll({
        collection: collection,
        scrollTop: 2
      });
      cellRendererCalls.splice(0); // At this point cells 4 and 5 have been rendered,
      // But cells 7, 8, and 9 have not.

      render(getMarkup(_objectSpread({}, props, {
        scrollLeft: 1,
        scrollTop: 3
      })));
      expect(cellRendererCalls.length).toEqual(3);
      cellRendererCalls.forEach(function (call) {
        return expect(call.isScrolling).toEqual(true);
      });
    });
    it('should clear cache once :isScrolling is false', function _callee2(done) {
      var cellRendererCalls, cellRenderer, props, collection;
      return _regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cellRenderer = function _ref11(_ref10) {
                var isScrolling = _ref10.isScrolling,
                    index = _ref10.index,
                    key = _ref10.key,
                    style = _ref10.style;
                cellRendererCalls.push({
                  isScrolling: isScrolling,
                  index: index
                });
                return defaultCellRenderer({
                  isScrolling: isScrolling,
                  index: index,
                  key: key,
                  style: style
                });
              };

              cellRendererCalls = [];
              props = {
                cellRenderer: cellRenderer,
                scrollLeft: 0,
                scrollTop: 0
              };
              collection = render(getMarkup(props));
              simulateScroll({
                collection: collection,
                scrollTop: 1
              }); // Allow scrolling timeout to complete so that cell cache is reset

              _context2.next = 7;
              return _regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 500);
              }));

            case 7:
              cellRendererCalls.splice(0);
              render(getMarkup(_objectSpread({}, props, {
                scrollTop: 1
              })));
              expect(cellRendererCalls.length).not.toEqual(0);
              done();

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
  }); // See issue #568 for more

  it('forceUpdate will also forceUpdate the inner CollectionView', function () {
    var cellRenderer = jest.fn();
    cellRenderer.mockImplementation(function (_ref12) {
      var key = _ref12.key;
      return React.createElement("div", {
        key: key
      });
    });
    var rendered = render(getMarkup({
      cellRenderer: cellRenderer
    }));
    expect(cellRenderer).toHaveBeenCalled();
    cellRenderer.mockReset();
    rendered.forceUpdate();
    expect(cellRenderer).toHaveBeenCalled();
  });
});