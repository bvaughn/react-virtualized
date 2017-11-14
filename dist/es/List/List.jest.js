import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import { Simulate } from 'react-dom/test-utils';
import Immutable from 'immutable';
import List from './List';
import { defaultOverscanIndicesGetter } from '../Grid';

describe('List', function () {
  var array = [];
  for (var i = 0; i < 100; i++) {
    array.push('Name ' + i);
  }
  var names = Immutable.fromJS(array);

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter(_ref) {
    var startIndex = _ref.startIndex,
        stopIndex = _ref.stopIndex;

    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex
    };
  }

  function getMarkup() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function rowRenderer(_ref2) {
      var index = _ref2.index,
          key = _ref2.key,
          style = _ref2.style;

      return React.createElement(
        'div',
        { className: 'listItem', key: key, style: style },
        names.get(index)
      );
    }

    return React.createElement(List, _extends({
      height: 100,
      overscanIndicesGetter: overscanIndicesGetter,
      overscanRowCount: 0,
      rowHeight: 10,
      rowCount: names.size,
      rowRenderer: rowRenderer,
      width: 100
    }, props));
  }

  describe('number of rendered children', function () {
    it('should render enough children to fill the view', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll('.listItem').length).toEqual(10);
    });

    it('should not render more children than available if the list is not filled', function () {
      var rendered = findDOMNode(render(getMarkup({ rowCount: 5 })));
      expect(rendered.querySelectorAll('.listItem').length).toEqual(5);
    });
  });

  describe('scrollToPosition', function () {
    it('should scroll to the top', function () {
      var instance = render(getMarkup({
        rowHeight: 10
      }));
      instance.scrollToPosition(100);
      var rendered = findDOMNode(instance);
      expect(rendered.textContent).toContain('Name 10');
      expect(rendered.textContent).toContain('Name 19');
    });
  });

  /** Tests scrolling via initial props */
  describe('scrollToIndex', function () {
    it('should scroll to the top', function () {
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 0 })));
      expect(rendered.textContent).toContain('Name 0');
    });

    it('should scroll down to the middle', function () {
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 49 })));
      // 100 items * 10 item height = 1,000 total item height
      // 10 items can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(rendered.textContent).toContain('Name 49');
    });

    it('should scroll to the bottom', function () {
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 99 })));
      // 100 height - 10 header = 90 available scroll space.
      // 100 items * 10 item height = 1,000 total item height
      // Target height for the last item then is 1000 - 90
      expect(rendered.textContent).toContain('Name 99');
    });

    it('should scroll to the correct position for :scrollToAlignment "start"', function () {
      var rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'start',
        scrollToIndex: 49
      })));
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 49');
      expect(rendered.textContent).toContain('Name 58');
    });

    it('should scroll to the correct position for :scrollToAlignment "end"', function () {
      render(getMarkup({
        scrollToIndex: 99
      }));
      var rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'end',
        scrollToIndex: 49
      })));
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 40');
      expect(rendered.textContent).toContain('Name 49');
    });

    it('should scroll to the correct position for :scrollToAlignment "center"', function () {
      render(getMarkup({
        scrollToIndex: 99
      }));
      var rendered = findDOMNode(render(getMarkup({
        scrollToAlignment: 'center',
        scrollToIndex: 49
      })));
      // 100 items * 10 item height = 1,000 total item height; 11 items can be visible at a time (the first and last item are only partially visible)
      expect(rendered.textContent).toContain('Name 44');
      expect(rendered.textContent).toContain('Name 54');
    });
  });

  describe('property updates', function () {
    it('should update :scrollToIndex position when :rowHeight changes', function () {
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })));
      expect(rendered.textContent).toContain('Name 50');
      // Making rows taller pushes name off/beyond the scrolled area
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50, rowHeight: 20 })));
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update :scrollToIndex position when :height changes', function () {
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })));
      expect(rendered.textContent).toContain('Name 50');
      // Making the list shorter leaves only room for 1 item
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50, height: 20 })));
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update :scrollToIndex position when :scrollToIndex changes', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.textContent).not.toContain('Name 50');
      rendered = findDOMNode(render(getMarkup({ scrollToIndex: 50 })));
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update scroll position if size shrinks smaller than the current scroll', function () {
      findDOMNode(render(getMarkup({ scrollToIndex: 500 })));
      findDOMNode(render(getMarkup()));
      var rendered = findDOMNode(render(getMarkup({ scrollToIndex: 500, rowCount: 10 })));
      expect(rendered.textContent).toContain('Name 9');
    });
  });

  describe('noRowsRenderer', function () {
    it('should call :noRowsRenderer if :rowCount is 0', function () {
      var rendered = findDOMNode(render(getMarkup({
        noRowsRenderer: function noRowsRenderer() {
          return React.createElement(
            'div',
            null,
            'No rows!'
          );
        },
        rowCount: 0
      })));
      expect(rendered.textContent).toEqual('No rows!');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', function () {
      var rendered = findDOMNode(render(getMarkup({
        rowCount: 0
      })));
      expect(rendered.textContent).toEqual('');
    });
  });

  describe('onRowsRendered', function () {
    it('should call :onRowsRendered if at least one row is rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params;

          return _params = params, startIndex = _params.startIndex, stopIndex = _params.stopIndex, _params;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it('should not call :onRowsRendered unless the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({ onRowsRendered: onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(render(getMarkup({ onRowsRendered: onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it('should call :onRowsRendered if the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({ onRowsRendered: onRowsRendered })));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(render(getMarkup({
        height: 50,
        onRowsRendered: onRowsRendered
      })));
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(4);
    });

    it('should not call :onRowsRendered if no rows are rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        height: 0,
        onRowsRendered: function onRowsRendered(params) {
          var _params2;

          return _params2 = params, startIndex = _params2.startIndex, stopIndex = _params2.stopIndex, _params2;
        }
      }));
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe(':scrollTop property', function () {
    it('should render correctly when an initial :scrollTop property is specified', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params3;

          return _params3 = params, startIndex = _params3.startIndex, stopIndex = _params3.stopIndex, _params3;
        },
        scrollTop: 100
      }));
      expect(startIndex).toEqual(10);
      expect(stopIndex).toEqual(19);
    });

    it('should render correctly when :scrollTop property is updated', function () {
      var startIndex = void 0,
          stopIndex = void 0;

      findDOMNode(render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params4;

          return _params4 = params, startIndex = _params4.startIndex, stopIndex = _params4.stopIndex, _params4;
        }
      })));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);

      findDOMNode(render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params5;

          return _params5 = params, startIndex = _params5.startIndex, stopIndex = _params5.stopIndex, _params5;
        },
        scrollTop: 100
      })));
      expect(startIndex).toEqual(10);
      expect(stopIndex).toEqual(19);
    });
  });

  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var node = findDOMNode(render(getMarkup()));
      expect(node.className).toContain('ReactVirtualized__List');
    });

    it('should use a custom :className if specified', function () {
      var node = findDOMNode(render(getMarkup({ className: 'foo' })));
      expect(node.className).toContain('foo');
    });

    it('should use a custom :id if specified', function () {
      var node = findDOMNode(render(getMarkup({ id: 'bar' })));
      expect(node.getAttribute('id')).toEqual('bar');
    });

    it('should use a custom :style if specified', function () {
      var style = { backgroundColor: 'red' };
      var rendered = findDOMNode(render(getMarkup({ style: style })));
      expect(rendered.style.backgroundColor).toEqual('red');
    });

    it('should set the width of a row to be 100% by default', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var cell = rendered.querySelector('.listItem');
      expect(cell.style.width).toEqual('100%');
    });
  });

  describe('overscanRowCount', function () {
    it('should not overscan by default', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(getMarkup({
        overscanIndicesGetter: mock
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it('should overscan the specified amount', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(getMarkup({
        overscanIndicesGetter: mock,
        overscanRowCount: 10
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe('onScroll', function () {
    it('should trigger callback when component initially mounts', function () {
      var onScrollCalls = [];
      render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 0
      }]);
    });

    it('should trigger callback when component scrolls', function () {
      var onScrollCalls = [];
      var rendered = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      var target = {
        scrollLeft: 0,
        scrollTop: 100
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered), { target: target });
      expect(onScrollCalls[onScrollCalls.length - 1]).toEqual({
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });

  describe('measureAllRows', function () {
    it('should measure any unmeasured rows', function () {
      var rendered = render(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: function rowHeight() {
          return 20;
        },
        width: 0
      }));
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150);
      rendered.measureAllRows();
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200);
    });
  });

  describe('recomputeRowHeights', function () {
    it('should recompute row heights and other values when called', function () {
      var indices = [];
      var rowHeight = function rowHeight(_ref3) {
        var index = _ref3.index;

        indices.push(index);
        return 10;
      };
      var component = render(getMarkup({
        rowHeight: rowHeight,
        rowCount: 50
      }));

      indices.splice(0);
      component.recomputeRowHeights();

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(9);

      indices.splice(0);
      component.recomputeRowHeights(4);

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(9);
    });
  });

  describe('forceUpdateGrid', function () {
    it('should refresh inner Grid content when called', function () {
      var marker = 'a';
      function rowRenderer(_ref4) {
        var index = _ref4.index,
            key = _ref4.key,
            style = _ref4.style;

        return React.createElement(
          'div',
          { key: key, style: style },
          index,
          marker
        );
      }
      var component = render(getMarkup({ rowRenderer: rowRenderer }));
      var node = findDOMNode(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });

  describe('tabIndex', function () {
    it('should be focusable by default', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.tabIndex).toEqual(0);
    });

    it('should allow tabIndex to be overridden', function () {
      var rendered = findDOMNode(render(getMarkup({
        tabIndex: -1
      })));
      expect(rendered.tabIndex).toEqual(-1);
    });
  });

  it('should pass the cellRenderer an :isVisible flag', function () {
    var rowRendererCalls = [];
    function rowRenderer(props) {
      rowRendererCalls.push(props);
      return null;
    }
    findDOMNode(render(getMarkup({
      height: 50,
      overscanIndicesGetter: defaultOverscanIndicesGetter,
      overscanRowCount: 1,
      rowHeight: 50,
      rowRenderer: rowRenderer
    })));
    expect(rowRendererCalls[0].isVisible).toEqual(true);
    expect(rowRendererCalls[1].isVisible).toEqual(false);
  });

  it('should relay the Grid :parent param to the :rowRenderer', function () {
    var rowRenderer = jest.fn().mockReturnValue(null);
    findDOMNode(render(getMarkup({ rowRenderer: rowRenderer })));
    expect(rowRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });

  describe('pure', function () {
    it('should not re-render unless props have changed', function () {
      var rowRendererCalled = false;
      function rowRenderer(_ref5) {
        var index = _ref5.index,
            key = _ref5.key,
            style = _ref5.style;

        rowRendererCalled = true;
        return React.createElement(
          'div',
          { key: key, style: style },
          index
        );
      }
      var markup = getMarkup({ rowRenderer: rowRenderer });
      render(markup);
      expect(rowRendererCalled).toEqual(true);
      rowRendererCalled = false;
      render(markup);
      expect(rowRendererCalled).toEqual(false);
    });
  });

  it('should set the width of the single-column inner Grid to auto', function () {
    var rendered = findDOMNode(render(getMarkup()));
    expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto');
  });
});