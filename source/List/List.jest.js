import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import {Simulate} from 'react-dom/test-utils';
import Immutable from 'immutable';
import List from './List';
import {defaultOverscanIndicesGetter} from '../Grid';

describe('List', () => {
  const array = [];
  for (var i = 0; i < 100; i++) {
    array.push(`Name ${i}`);
  }
  const names = Immutable.fromJS(array);

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter({startIndex, stopIndex}) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex,
    };
  }

  function getMarkup(props = {}) {
    function rowRenderer({index, key, style}) {
      return (
        <div className="listItem" key={key} style={style}>
          {names.get(index)}
        </div>
      );
    }

    return (
      <List
        height={100}
        overscanIndicesGetter={overscanIndicesGetter}
        overscanRowCount={0}
        rowHeight={10}
        rowCount={names.size}
        rowRenderer={rowRenderer}
        width={100}
        {...props}
      />
    );
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the view', () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll('.listItem').length).toEqual(10);
    });

    it('should not render more children than available if the list is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({rowCount: 5})));
      expect(rendered.querySelectorAll('.listItem').length).toEqual(5);
    });
  });

  describe('scrollToPosition', () => {
    it('should scroll to the top', () => {
      const instance = render(
        getMarkup({
          rowHeight: 10,
        }),
      );
      instance.scrollToPosition(100);
      const rendered = findDOMNode(instance);
      expect(rendered.textContent).toContain('Name 10');
      expect(rendered.textContent).toContain('Name 19');
    });
  });

  /** Tests scrolling via initial props */
  describe('scrollToIndex', () => {
    it('should scroll to the top', () => {
      const rendered = findDOMNode(render(getMarkup({scrollToIndex: 0})));
      expect(rendered.textContent).toContain('Name 0');
    });

    it('should scroll down to the middle', () => {
      const rendered = findDOMNode(render(getMarkup({scrollToIndex: 49})));
      // 100 items * 10 item height = 1,000 total item height
      // 10 items can be visible at a time and :scrollTop is initially 0,
      // So the minimum amount of scrolling leaves the 50th item at the bottom (just scrolled into view).
      expect(rendered.textContent).toContain('Name 49');
    });

    it('should scroll to the bottom', () => {
      const rendered = findDOMNode(render(getMarkup({scrollToIndex: 99})));
      // 100 height - 10 header = 90 available scroll space.
      // 100 items * 10 item height = 1,000 total item height
      // Target height for the last item then is 1000 - 90
      expect(rendered.textContent).toContain('Name 99');
    });

    it('should scroll to the correct position for :scrollToAlignment "start"', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            scrollToAlignment: 'start',
            scrollToIndex: 49,
          }),
        ),
      );
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 49');
      expect(rendered.textContent).toContain('Name 58');
    });

    it('should scroll to the correct position for :scrollToAlignment "end"', () => {
      render(
        getMarkup({
          scrollToIndex: 99,
        }),
      );
      const rendered = findDOMNode(
        render(
          getMarkup({
            scrollToAlignment: 'end',
            scrollToIndex: 49,
          }),
        ),
      );
      // 100 items * 10 item height = 1,000 total item height; 10 items can be visible at a time.
      expect(rendered.textContent).toContain('Name 40');
      expect(rendered.textContent).toContain('Name 49');
    });

    it('should scroll to the correct position for :scrollToAlignment "center"', () => {
      render(
        getMarkup({
          scrollToIndex: 99,
        }),
      );
      const rendered = findDOMNode(
        render(
          getMarkup({
            scrollToAlignment: 'center',
            scrollToIndex: 49,
          }),
        ),
      );
      // 100 items * 10 item height = 1,000 total item height; 11 items can be visible at a time (the first and last item are only partially visible)
      expect(rendered.textContent).toContain('Name 44');
      expect(rendered.textContent).toContain('Name 54');
    });
  });

  describe('property updates', () => {
    it('should update :scrollToIndex position when :rowHeight changes', () => {
      let rendered = findDOMNode(render(getMarkup({scrollToIndex: 50})));
      expect(rendered.textContent).toContain('Name 50');
      // Making rows taller pushes name off/beyond the scrolled area
      rendered = findDOMNode(
        render(getMarkup({scrollToIndex: 50, rowHeight: 20})),
      );
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update :scrollToIndex position when :height changes', () => {
      let rendered = findDOMNode(render(getMarkup({scrollToIndex: 50})));
      expect(rendered.textContent).toContain('Name 50');
      // Making the list shorter leaves only room for 1 item
      rendered = findDOMNode(
        render(getMarkup({scrollToIndex: 50, height: 20})),
      );
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update :scrollToIndex position when :scrollToIndex changes', () => {
      let rendered = findDOMNode(render(getMarkup()));
      expect(rendered.textContent).not.toContain('Name 50');
      rendered = findDOMNode(render(getMarkup({scrollToIndex: 50})));
      expect(rendered.textContent).toContain('Name 50');
    });

    it('should update scroll position if size shrinks smaller than the current scroll', () => {
      findDOMNode(render(getMarkup({scrollToIndex: 500})));
      findDOMNode(render(getMarkup()));
      const rendered = findDOMNode(
        render(getMarkup({scrollToIndex: 500, rowCount: 10})),
      );
      expect(rendered.textContent).toContain('Name 9');
    });
  });

  describe('noRowsRenderer', () => {
    it('should call :noRowsRenderer if :rowCount is 0', () => {
      let rendered = findDOMNode(
        render(
          getMarkup({
            noRowsRenderer: () => <div>No rows!</div>,
            rowCount: 0,
          }),
        ),
      );
      expect(rendered.textContent).toEqual('No rows!');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', () => {
      let rendered = findDOMNode(
        render(
          getMarkup({
            rowCount: 0,
          }),
        ),
      );
      expect(rendered.textContent).toEqual('');
    });
  });

  describe('onRowsRendered', () => {
    it('should call :onRowsRendered if at least one row is rendered', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
        }),
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it('should not call :onRowsRendered unless the start or stop indices have changed', () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = params => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({onRowsRendered})));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(render(getMarkup({onRowsRendered})));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
    });

    it('should call :onRowsRendered if the start or stop indices have changed', () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = params => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      findDOMNode(render(getMarkup({onRowsRendered})));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);
      findDOMNode(
        render(
          getMarkup({
            height: 50,
            onRowsRendered,
          }),
        ),
      );
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(4);
    });

    it('should not call :onRowsRendered if no rows are rendered', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          height: 0,
          onRowsRendered: params => ({startIndex, stopIndex} = params),
        }),
      );
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe(':scrollTop property', () => {
    it('should render correctly when an initial :scrollTop property is specified', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
          scrollTop: 100,
        }),
      );
      expect(startIndex).toEqual(10);
      expect(stopIndex).toEqual(19);
    });

    it('should render correctly when :scrollTop property is updated', () => {
      let startIndex, stopIndex;

      findDOMNode(
        render(
          getMarkup({
            onRowsRendered: params => ({startIndex, stopIndex} = params),
          }),
        ),
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(9);

      findDOMNode(
        render(
          getMarkup({
            onRowsRendered: params => ({startIndex, stopIndex} = params),
            scrollTop: 100,
          }),
        ),
      );
      expect(startIndex).toEqual(10);
      expect(stopIndex).toEqual(19);
    });
  });

  describe('styles, classNames, and ids', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(render(getMarkup()));
      expect(node.className).toContain('ReactVirtualized__List');
    });

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(render(getMarkup({className: 'foo'})));
      expect(node.className).toContain('foo');
    });

    it('should use a custom :id if specified', () => {
      const node = findDOMNode(render(getMarkup({id: 'bar'})));
      expect(node.getAttribute('id')).toEqual('bar');
    });

    it('should use a custom :style if specified', () => {
      const style = {backgroundColor: 'red'};
      const rendered = findDOMNode(render(getMarkup({style})));
      expect(rendered.style.backgroundColor).toEqual('red');
    });

    it('should set the width of a row to be 100% by default', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const cell = rendered.querySelector('.listItem');
      expect(cell.style.width).toEqual('100%');
    });
  });

  describe('overscanRowCount', () => {
    it('should not overscan by default', () => {
      const mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
        }),
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it('should overscan the specified amount', () => {
      const mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
          overscanRowCount: 10,
        }),
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe('onScroll', () => {
    it('should trigger callback when component initially mounts', () => {
      const onScrollCalls = [];
      render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 100,
          scrollHeight: 1000,
          scrollTop: 0,
        },
      ]);
    });

    it('should trigger callback when component scrolls', () => {
      const onScrollCalls = [];
      const rendered = render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      const target = {
        scrollLeft: 0,
        scrollTop: 100,
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered), {target});
      expect(onScrollCalls[onScrollCalls.length - 1]).toEqual({
        clientHeight: 100,
        scrollHeight: 1000,
        scrollTop: 100,
      });
    });
  });

  describe('measureAllRows', () => {
    it('should measure any unmeasured rows', () => {
      const rendered = render(
        getMarkup({
          estimatedRowSize: 15,
          height: 0,
          rowCount: 10,
          rowHeight: () => 20,
          width: 0,
        }),
      );
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(
        150,
      );
      rendered.measureAllRows();
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(
        200,
      );
    });
  });

  describe('recomputeRowHeights', () => {
    it('should recompute row heights and other values when called', () => {
      const indices = [];
      const rowHeight = ({index}) => {
        indices.push(index);
        return 10;
      };
      const component = render(
        getMarkup({
          rowHeight,
          rowCount: 50,
        }),
      );

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

  describe('forceUpdateGrid', () => {
    it('should refresh inner Grid content when called', () => {
      let marker = 'a';
      function rowRenderer({index, key, style}) {
        return (
          <div key={key} style={style}>
            {index}
            {marker}
          </div>
        );
      }
      const component = render(getMarkup({rowRenderer}));
      const node = findDOMNode(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });

  describe('tabIndex', () => {
    it('should be focusable by default', () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.tabIndex).toEqual(0);
    });

    it('should allow tabIndex to be overridden', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            tabIndex: -1,
          }),
        ),
      );
      expect(rendered.tabIndex).toEqual(-1);
    });
  });

  it('should pass the cellRenderer an :isVisible flag', () => {
    const rowRendererCalls = [];
    function rowRenderer(props) {
      rowRendererCalls.push(props);
      return null;
    }
    findDOMNode(
      render(
        getMarkup({
          height: 50,
          overscanIndicesGetter: defaultOverscanIndicesGetter,
          overscanRowCount: 1,
          rowHeight: 50,
          rowRenderer,
        }),
      ),
    );
    expect(rowRendererCalls[0].isVisible).toEqual(true);
    expect(rowRendererCalls[1].isVisible).toEqual(false);
  });

  it('should relay the Grid :parent param to the :rowRenderer', () => {
    const rowRenderer = jest.fn().mockReturnValue(null);
    findDOMNode(render(getMarkup({rowRenderer})));
    expect(rowRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });

  describe('pure', () => {
    it('should not re-render unless props have changed', () => {
      let rowRendererCalled = false;
      function rowRenderer({index, key, style}) {
        rowRendererCalled = true;
        return (
          <div key={key} style={style}>
            {index}
          </div>
        );
      }
      const markup = getMarkup({rowRenderer});
      render(markup);
      expect(rowRendererCalled).toEqual(true);
      rowRendererCalled = false;
      render(markup);
      expect(rowRendererCalled).toEqual(false);
    });
  });

  it('should set the width of the single-column inner Grid to auto', () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(
      rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer')
        .style.width,
    ).toEqual('auto');
  });
});
