/**
 * Tests Collection and CollectionView.
 * @flow
 */
import getScrollbarSize from 'dom-helpers/util/scrollbarSize';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {render} from '../TestUtils';
import Collection from './Collection';
import {CELLS, SECTION_SIZE} from './TestData';

describe('Collection', () => {
  function defaultCellRenderer({index, key, style}) {
    return (
      <div className="cell" key={key} style={style}>
        cell:{index}
      </div>
    );
  }

  function getMarkup(props = {}) {
    const {cellCount = CELLS.length} = props;

    function defaultCellSizeAndPositionGetter({index}) {
      index %= cellCount;

      return CELLS[index];
    }

    return (
      <Collection
        cellCount={cellCount}
        cellRenderer={defaultCellRenderer}
        cellSizeAndPositionGetter={defaultCellSizeAndPositionGetter}
        height={SECTION_SIZE}
        sectionSize={SECTION_SIZE}
        width={SECTION_SIZE * 2}
        {...props}
      />
    );
  }

  function simulateScroll({collection, scrollLeft = 0, scrollTop = 0}) {
    const target = {scrollLeft, scrollTop};
    collection._collectionView._scrollingContainer = target; // HACK to work around _onScroll target check
    Simulate.scroll(findDOMNode(collection), {target});
  }

  function compareArrays(array1, array2) {
    expect(array1.length).toEqual(array2.length);

    array2.forEach(value => {
      expect(array1).toContain(value);
    });
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the available area', () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelectorAll('.cell').length).toEqual(4);
    });

    it('should not render more cells than available if the area is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({cellCount: 2})));
      expect(rendered.querySelectorAll('.cell').length).toEqual(2);
    });

    // Small performance tweak added in 5.5.6
    it('should not render/parent cells that are null or false', () => {
      function cellRenderer({index, key, style}) {
        if (index > 2) {
          return null;
        } else {
          return (
            <div className="cell" key={key} style={style}>
              {index}
            </div>
          );
        }
      }
      const rendered = findDOMNode(render(getMarkup({cellRenderer})));
      expect(rendered.querySelectorAll('.cell').length).toEqual(3);
    });
  });

  describe('shows and hides scrollbars based on rendered content', () => {
    let scrollbarSize;

    beforeAll(() => {
      scrollbarSize = getScrollbarSize();
    });

    it('should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 4,
            width: 6,
          }),
        ),
      );
      expect(rendered.style.overflowX).toEqual('hidden');
    });

    it('should set overflowX:hidden if columns and y-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 1,
            width: 6 + scrollbarSize,
          }),
        ),
      );
      expect(rendered.style.overflowX).toEqual('hidden');
    });

    it('should leave overflowX:auto if columns require more than the available width', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            width: 1,
          }),
        ),
      );
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });

    it('should leave overflowX:auto if columns and y-axis scrollbar require more than the available width', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 1,
            width: 6 + scrollbarSize - 1,
          }),
        ),
      );
      expect(rendered.style.overflowX).not.toEqual('hidden');
    });

    it('should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 4,
            width: 6,
          }),
        ),
      );
      expect(rendered.style.overflowY).toEqual('hidden');
    });

    it('should set overflowY:hidden if rows and x-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 4 + scrollbarSize,
            width: 1,
          }),
        ),
      );
      expect(rendered.style.overflowY).toEqual('hidden');
    });

    it('should leave overflowY:auto if rows require more than the available height', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 1,
          }),
        ),
      );
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });

    it('should leave overflowY:auto if rows and y-axis scrollbar require more than the available height', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 4 + scrollbarSize - 1,
            width: 1,
          }),
        ),
      );
      expect(rendered.style.overflowY).not.toEqual('hidden');
    });

    it('should accept styles that overwrite calculated ones', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            height: 1,
            style: {
              overflowX: 'auto',
              overflowY: 'auto',
            },
            width: 1,
          }),
        ),
      );
      expect(rendered.style.overflowX).toEqual('auto');
      expect(rendered.style.overflowY).toEqual('auto');
    });
  });

  describe('autoHeight', () => {
    it('should set the container height to auto to adjust to innerScrollContainer height', () => {
      const props = {
        autoHeight: true,
      };
      const rendered = findDOMNode(render(getMarkup(props)));
      expect(rendered.style.height).toEqual('auto');
    });

    it('should have container height still affecting number of rows rendered', () => {
      let indices;
      const props = {
        autoHeight: true,
        height: 500,
        onSectionRendered: params => {
          indices = params.indices;
        },
      };
      findDOMNode(render(getMarkup(props)));
      compareArrays(indices, [0, 1, 2, 3, 4, 5]);
    });

    it('should have innerScrollContainer height to be equal number of rows * rowHeight', () => {
      const props = {
        autoHeight: true,
      };
      const rendered = findDOMNode(render(getMarkup(props)));
      expect(
        rendered.querySelector(
          '.ReactVirtualized__Collection__innerScrollContainer',
        ).style.height,
      ).toEqual('4px');
    });
  });

  describe(':scrollToCell', () => {
    it('should scroll to the top/left', () => {
      const collection = render(getMarkup({scrollToCell: 0}));
      expect(collection._collectionView.state.scrollLeft).toEqual(0);
      expect(collection._collectionView.state.scrollTop).toEqual(0);
    });

    it('should scroll over to the middle', () => {
      const collection = render(getMarkup({scrollToCell: 7}));
      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(1);
    });

    it('should scroll to the bottom/right', () => {
      const collection = render(getMarkup({scrollToCell: 9}));
      expect(collection._collectionView.state.scrollLeft).toEqual(2);
      expect(collection._collectionView.state.scrollTop).toEqual(2);
    });

    it('should honor the specified :scrollToAlignment', () => {
      let collection = render(
        getMarkup({
          scrollToAlignment: 'start',
          scrollToCell: 2,
          width: SECTION_SIZE,
        }),
      );
      // Minimum amount of scrolling ("auto") would be 0,0
      expect(collection._collectionView.state.scrollLeft).toEqual(2);
      expect(collection._collectionView.state.scrollTop).toEqual(1);

      collection = render(
        getMarkup({
          scrollToAlignment: 'end',
          scrollToCell: 2,
          width: SECTION_SIZE,
        }),
      );
      // This cell would already by visible by "auto" rules
      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(0);

      collection = render(
        getMarkup({
          scrollToAlignment: 'center',
          scrollToCell: 4,
          width: SECTION_SIZE,
        }),
      );
      // This cell doesn't fit entirely in the viewport but we center it anyway.
      expect(collection._collectionView.state.scrollLeft).toEqual(0.5);
      expect(collection._collectionView.state.scrollTop).toEqual(2);
    });

    it('should scroll to a cell just added', () => {
      let collection = render(
        getMarkup({
          cellCount: 4,
        }),
      );
      expect(collection._collectionView.state.scrollLeft).toEqual(0);
      expect(collection._collectionView.state.scrollTop).toEqual(0);
      collection = render(
        getMarkup({
          cellCount: 8,
          scrollToCell: 7,
        }),
      );
      expect(collection._collectionView.state.scrollLeft).toEqual(1);
      expect(collection._collectionView.state.scrollTop).toEqual(1);
    });
  });

  describe('property updates', () => {
    it('should update :scrollToCell position when :width changes', () => {
      let collection = findDOMNode(render(getMarkup({scrollToCell: 3})));
      expect(collection.textContent).toContain('cell:3');
      // Making the collection narrower leaves only room for 1 item
      collection = findDOMNode(render(getMarkup({scrollToCell: 3, width: 1})));
      expect(collection.textContent).toContain('cell:3');
    });

    it('should update :scrollToCell position when :height changes', () => {
      let collection = findDOMNode(render(getMarkup({scrollToCell: 4})));
      expect(collection.textContent).toContain('cell:4');
      // Making the collection shorter leaves only room for 1 item
      collection = findDOMNode(render(getMarkup({scrollToCell: 4, height: 1})));
      expect(collection.textContent).toContain('cell:4');
    });

    it('should update scroll position when :scrollToCell changes', () => {
      let collection = findDOMNode(render(getMarkup()));
      expect(collection.textContent).not.toContain('cell:9');
      collection = findDOMNode(render(getMarkup({scrollToCell: 9})));
      expect(collection.textContent).toContain('cell:9');
    });
  });

  describe('noContentRenderer', () => {
    it('should call :noContentRenderer if :cellCount is 0', () => {
      let list = findDOMNode(
        render(
          getMarkup({
            noContentRenderer: () => <div>No data</div>,
            cellCount: 0,
          }),
        ),
      );
      expect(list.textContent).toEqual('No data');
    });

    it('should render an empty body if :cellCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(
        render(
          getMarkup({
            cellCount: 0,
          }),
        ),
      );
      expect(list.textContent).toEqual('');
    });

    it('should not show the :noContentRenderer when there are children, even if no children are currently visible (sparse)', () => {
      const offscreenSizeAndPosition = {
        x: SECTION_SIZE * 3,
        y: SECTION_SIZE * 3,
        width: 1,
        height: 1,
      };

      function cellSizeAndPositionGetter() {
        return offscreenSizeAndPosition;
      }

      let list = findDOMNode(
        render(
          getMarkup({
            cellCount: 1,
            cellSizeAndPositionGetter,
            noContentRenderer: () => <div>No data</div>,
          }),
        ),
      );
      expect(list.textContent).not.toEqual('No data');
    });
  });

  describe('onSectionRendered', () => {
    it('should call :onSectionRendered if at least one cell is rendered', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
        }),
      );
      compareArrays(indices, [0, 1, 2, 3]);
    });

    it('should not call :onSectionRendered unless the rendered indices have changed', () => {
      let numCalls = 0;
      let indices;
      const onSectionRendered = params => {
        indices = params.indices;
        numCalls++;
      };
      render(getMarkup({onSectionRendered}));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
      render(getMarkup({onSectionRendered}));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
    });

    it('should call :onSectionRendered if the rendered indices have changed', () => {
      let numCalls = 0;
      let indices;
      const onSectionRendered = params => {
        indices = params.indices;
        numCalls++;
      };
      render(getMarkup({onSectionRendered}));
      expect(numCalls).toEqual(1);
      compareArrays(indices, [0, 1, 2, 3]);
      render(
        getMarkup({
          height: SECTION_SIZE * 2,
          onSectionRendered,
        }),
      );
      expect(numCalls).toEqual(2);
      compareArrays(indices, [0, 1, 2, 3, 4, 5]);
      render(
        getMarkup({
          height: SECTION_SIZE * 2,
          onSectionRendered,
          width: SECTION_SIZE,
        }),
      );
      expect(numCalls).toEqual(3);
      expect(indices).toEqual([0, 4]);
    });

    it('should not call :onSectionRendered if no cells are rendered', () => {
      let numCalls = 0;
      render(
        getMarkup({
          height: 0,
          onSectionRendered: () => numCalls++,
        }),
      );
      expect(numCalls).toEqual(0);
    });
  });

  describe(':scrollLeft and :scrollTop properties', () => {
    it('should render correctly when an initial :scrollLeft and :scrollTop properties are specified', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
          scrollLeft: 2,
          scrollTop: 2,
        }),
      );
      compareArrays(indices, [3, 4, 5, 7, 8, 9]);
    });

    it('should render correctly when :scrollLeft and :scrollTop properties are updated', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
        }),
      );
      compareArrays(indices, [0, 1, 2, 3]);
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
          scrollLeft: 2,
          scrollTop: 2,
        }),
      );
      compareArrays(indices, [3, 4, 5, 7, 8, 9]);
    });
  });

  describe('styles, classNames, and ids', () => {
    it('should use the expected global CSS classNames', () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(rendered.className).toEqual('ReactVirtualized__Collection');
    });

    it('should use a custom :className if specified', () => {
      const rendered = findDOMNode(render(getMarkup({className: 'foo'})));
      expect(rendered.className).toContain('foo');
    });

    it('should use a custom :id if specified', () => {
      const rendered = findDOMNode(render(getMarkup({id: 'bar'})));
      expect(rendered.getAttribute('id')).toEqual('bar');
    });

    it('should use a custom :style if specified', () => {
      const style = {backgroundColor: 'red'};
      const rendered = findDOMNode(render(getMarkup({style})));
      expect(rendered.style.backgroundColor).toEqual('red');
    });
  });

  describe('onScroll', () => {
    it('should trigger callback when component is mounted', () => {
      const onScrollCalls = [];
      render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
          scrollLeft: 2,
          scrollTop: 1,
        }),
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: SECTION_SIZE,
          clientWidth: SECTION_SIZE * 2,
          scrollHeight: 4,
          scrollLeft: 2,
          scrollTop: 1,
          scrollWidth: 6,
        },
      ]);
    });

    it('should trigger callback when component scrolls horizontally', () => {
      const onScrollCalls = [];
      const collection = render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      simulateScroll({
        collection,
        scrollLeft: 1,
        scrollTop: 0,
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 1,
        scrollTop: 0,
        scrollWidth: 6,
      });
    });

    it('should trigger callback when component scrolls vertically', () => {
      const onScrollCalls = [];
      const collection = render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      simulateScroll({
        collection,
        scrollLeft: 0,
        scrollTop: 2,
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 0,
        scrollTop: 2,
        scrollWidth: 6,
      });
    });

    it('should not allow negative scroll values', () => {
      const onScrollCalls = [];
      const collection = render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      simulateScroll({
        collection,
        scrollLeft: -1,
        scrollTop: -1,
      });
      expect(onScrollCalls.length).toEqual(1);
      expect(onScrollCalls[0].scrollLeft).toEqual(0);
      expect(onScrollCalls[0].scrollTop).toEqual(0);
    });
  });

  describe('cellGroupRenderer', () => {
    it('should use a custom :cellGroupRenderer if specified', () => {
      let cellGroupRendererCalled = 0;
      let cellGroupRendererParams;
      const cellRenderer = ({index, key, style}) => (
        <div key={key} style={style}>
          {index}
        </div>
      );
      findDOMNode(
        render(
          getMarkup({
            cellRenderer,
            cellGroupRenderer: params => {
              cellGroupRendererParams = params;
              cellGroupRendererCalled++;

              return [<div key="0">Fake content</div>];
            },
          }),
        ),
      );
      expect(cellGroupRendererCalled).toEqual(1);
      expect(cellGroupRendererParams.cellRenderer).toEqual(cellRenderer);
      expect(typeof cellGroupRendererParams.cellSizeAndPositionGetter).toEqual(
        'function',
      );
      compareArrays(cellGroupRendererParams.indices, [0, 1, 2, 3]);
    });
  });

  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', async done => {
    const cellRendererCalls = [];
    function cellRenderer({index, isScrolling, key, style}) {
      cellRendererCalls.push(isScrolling);
      return defaultCellRenderer({index, key, style});
    }

    const collection = render(
      getMarkup({
        cellRenderer,
      }),
    );

    expect(cellRendererCalls[0]).toEqual(false);

    cellRendererCalls.splice(0);

    simulateScroll({collection, scrollTop: 1});

    // Give React time to process the queued setState()
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(cellRendererCalls[0]).toEqual(true);

    done();
  });

  describe('horizontalOverscanSize and verticalOverscanSize', () => {
    it('should include the horizontal and vertical overscan size when rendering cells', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
          height: 1,
          horizontalOverscanSize: 2,
          sectionSize: 1,
          scrollLeft: 2,
          scrollTop: 2,
          width: 1,
          verticalOverscanSize: 1,
        }),
      );
      compareArrays(indices, [0, 2, 3, 4, 5, 6, 7, 9]);
    });

    it('should not exceed the top/left borders regardless of overscan size', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
          height: 2,
          horizontalOverscanSize: 1,
          sectionSize: 1,
          scrollLeft: 0,
          scrollTop: 0,
          width: 1,
          verticalOverscanSize: 2,
        }),
      );
      compareArrays(indices, [0, 4]);
    });

    it('should not exceed the bottom/right borders regardless of overscan size', () => {
      let indices;
      render(
        getMarkup({
          onSectionRendered: params => {
            indices = params.indices;
          },
          height: 2,
          horizontalOverscanSize: 1,
          sectionSize: 1,
          scrollLeft: 5,
          scrollTop: 2,
          width: 1,
          verticalOverscanSize: 2,
        }),
      );
      compareArrays(indices, [6, 7, 8, 9]);
    });
  });

  describe('cell caching', () => {
    it('should not cache cells if the Grid is not scrolling', () => {
      const cellRendererCalls = [];
      function cellRenderer({isScrolling, index, key, style}) {
        cellRendererCalls.push({isScrolling, index});
        return defaultCellRenderer({index, key, style});
      }

      const props = {
        cellRenderer,
        scrollLeft: 0,
        scrollTop: 0,
      };

      findDOMNode(render(getMarkup(props)));
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(call =>
        expect(call.isScrolling).toEqual(false),
      );

      cellRendererCalls.splice(0);

      render(
        getMarkup({
          ...props,
          foo: 'bar', // Force re-render
        }),
      );
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(call =>
        expect(call.isScrolling).toEqual(false),
      );
    });

    it('should cache a cell once it has been rendered while scrolling', () => {
      const cellRendererCalls = [];
      function cellRenderer({isScrolling, index, key, style}) {
        cellRendererCalls.push({isScrolling, index});
        return defaultCellRenderer({index, key, style});
      }

      const props = {
        cellRenderer,
        scrollLeft: 0,
        scrollTop: 0,
      };

      const collection = render(getMarkup(props));
      expect(cellRendererCalls.length).toEqual(4);
      cellRendererCalls.forEach(call =>
        expect(call.isScrolling).toEqual(false),
      );

      // Scroll a little bit; newly-rendered cells will be cached.
      simulateScroll({collection, scrollTop: 2});

      cellRendererCalls.splice(0);

      // At this point cells 4 and 5 have been rendered,
      // But cells 7, 8, and 9 have not.
      render(
        getMarkup({
          ...props,
          scrollLeft: 1,
          scrollTop: 3,
        }),
      );
      expect(cellRendererCalls.length).toEqual(3);
      cellRendererCalls.forEach(call => expect(call.isScrolling).toEqual(true));
    });

    it('should clear cache once :isScrolling is false', async done => {
      const cellRendererCalls = [];
      function cellRenderer({isScrolling, index, key, style}) {
        cellRendererCalls.push({isScrolling, index});
        return defaultCellRenderer({isScrolling, index, key, style});
      }

      const props = {
        cellRenderer,
        scrollLeft: 0,
        scrollTop: 0,
      };

      const collection = render(getMarkup(props));
      simulateScroll({collection, scrollTop: 1});

      // Allow scrolling timeout to complete so that cell cache is reset
      await new Promise(resolve => setTimeout(resolve, 500));

      cellRendererCalls.splice(0);

      render(
        getMarkup({
          ...props,
          scrollTop: 1,
        }),
      );
      expect(cellRendererCalls.length).not.toEqual(0);

      done();
    });
  });

  // See issue #568 for more
  it('forceUpdate will also forceUpdate the inner CollectionView', () => {
    const cellRenderer = jest.fn();
    cellRenderer.mockImplementation(({key}) => <div key={key} />);

    const rendered = render(getMarkup({cellRenderer}));

    expect(cellRenderer).toHaveBeenCalled();

    cellRenderer.mockReset();
    rendered.forceUpdate();

    expect(cellRenderer).toHaveBeenCalled();
  });
});
