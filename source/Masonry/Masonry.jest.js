import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {render} from '../TestUtils';
import createCellPositionerUtil from './createCellPositioner';
import Masonry from './Masonry';
import {CellMeasurer, CellMeasurerCache} from '../CellMeasurer';

const ALTERNATING_CELL_HEIGHTS = [100, 50, 100, 150];
const CELL_SIZE_MULTIPLIER = 50;
const COLUMN_COUNT = 3;

function assertVisibleCells(rendered, text) {
  expect(
    Array.from(rendered.querySelectorAll('.cell'))
      .map(node => node.textContent)
      .sort()
      .join(','),
  ).toEqual(text);
}

function createCellMeasurerCache(props = {}) {
  return new CellMeasurerCache({
    defaultHeight: CELL_SIZE_MULTIPLIER,
    defaultWidth: CELL_SIZE_MULTIPLIER,
    fixedWidth: true,
    keyMapper: index => index,
    ...props,
  });
}

function createCellPositioner(cache) {
  return createCellPositionerUtil({
    cellMeasurerCache: cache,
    columnCount: COLUMN_COUNT,
    columnWidth: CELL_SIZE_MULTIPLIER,
  });
}

function createCellRenderer(cache, renderCallback) {
  renderCallback =
    typeof renderCallback === 'function' ? renderCallback : index => index;

  return function cellRenderer({index, isScrolling, key, parent, style}) {
    const height =
      ALTERNATING_CELL_HEIGHTS[index % ALTERNATING_CELL_HEIGHTS.length];
    const width = CELL_SIZE_MULTIPLIER;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          className="cell"
          ref={ref => {
            if (ref) {
              // Accounts for the fact that JSDom doesn't support measurements.
              Object.defineProperty(ref, 'offsetHeight', {
                configurable: true,
                value: height,
              });
              Object.defineProperty(ref, 'offsetWidth', {
                configurable: true,
                value: width,
              });
            }
          }}
          style={{
            ...style,
            minHeight: height,
            minWidth: width,
          }}>
          {renderCallback(index, {index, isScrolling, key, parent, style})}
        </div>
      </CellMeasurer>
    );
  };
}

function getMarkup(props = {}) {
  const cellMeasurerCache =
    props.cellMeasurerCache || createCellMeasurerCache();

  return (
    <Masonry
      cellCount={1000}
      cellMeasurerCache={cellMeasurerCache}
      cellPositioner={createCellPositioner(cellMeasurerCache)}
      cellRenderer={createCellRenderer(cellMeasurerCache)}
      columnCount={COLUMN_COUNT}
      height={CELL_SIZE_MULTIPLIER * 2}
      overscanByPixels={CELL_SIZE_MULTIPLIER}
      width={CELL_SIZE_MULTIPLIER * COLUMN_COUNT}
      {...props}
    />
  );
}

function simulateScroll(masonry, scrollTop = 0) {
  const target = {scrollTop};
  masonry._scrollingContainer = target; // HACK to work around _onScroll target check
  Simulate.scroll(findDOMNode(masonry), {target});
}

describe('Masonry', () => {
  beforeEach(render.unmount);

  describe('layout and measuring', () => {
    it('should measure only enough cells required for initial render', () => {
      // avg cell size: CELL_SIZE_MULTIPLIER
      // width: CELL_SIZE_MULTIPLIER * 3
      // height: CELL_SIZE_MULTIPLIER * 2
      // overcsan by: CELL_SIZE_MULTIPLIER
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache();
      render(getMarkup({cellMeasurerCache}));
      for (let i = 0; i <= 8; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }
      expect(cellMeasurerCache.has(9)).toBe(false);
    });

    it('should not measure cells while scrolling until they are needed', () => {
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = jest.fn().mockImplementation(index => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback,
      );
      const rendered = findDOMNode(
        render(getMarkup({cellMeasurerCache, cellRenderer})),
      );
      renderCallback.mockClear();
      // Scroll a little bit, but not so much to require re-measuring
      simulateScroll(rendered, 51);
      // Verify that render was only called enough times to fill view port (no extra for measuring)
      expect(renderCallback).toHaveBeenCalledTimes(9);
    });

    it('should measure additional cells on scroll when it runs out of measured cells', () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = jest.fn().mockImplementation(index => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback,
      );
      const rendered = findDOMNode(
        render(getMarkup({cellRenderer, cellMeasurerCache})),
      );
      expect(cellMeasurerCache.has(9)).toBe(false);

      renderCallback.mockClear();

      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      expect(cellMeasurerCache.has(10)).toBe(false);
    });

    // Masonry used to do a render pass for only unmeasured cells,
    // But this resulting in removing (and later re-adding) measured cells from the DOM,
    // Which was bad for performance. See GitHub issue #875
    it('should not remove previously-measured cells when measuring new ones', () => {
      const log = [];

      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = index => {
        log.push(index);
      };
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback,
      );

      const rendered = findDOMNode(
        render(
          getMarkup({
            cellMeasurerCache,
            cellRenderer,
          }),
        ),
      );

      // Expected to have rendered twice:
      // 1st time to measure 9 cells (b'c of esimated size)
      // 2nd time to render and position 9 cells (b'c of actual size)
      expect(log).toHaveLength(18);

      log.splice(0);

      simulateScroll(rendered, 101);

      // Expected to have rendered twice:
      // 1st time to measure additional cells (based on estimated size)
      // 2nd time to render and position with new cells
      // The 1st render should also have included the pre-measured cells,
      // To prevent them from being removed, recreated, and re-added to the DOM.
      expect(log).toHaveLength(18);
    });

    it('should only render enough cells to fill the viewport', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            overscanByPixels: 0,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,1,2,3,4,5');
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, '0,2,3,4,5,6');
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, '3,4,5,6,7,8');
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, '30,31,32,33,34,35');
    });

    it('should only render enough cells to fill the viewport plus overscanByPixels', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            overscanByPixels: 100,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 51);
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 101);
      assertVisibleCells(rendered, '0,1,10,11,2,3,4,5,6,7,8,9');
      simulateScroll(rendered, 1001);
      assertVisibleCells(rendered, '26,27,28,29,30,31,32,33,34,35,36,37');
    });

    it('should still render correctly when autoHeight is true (eg WindowScroller)', () => {
      // Share instances between renders to avoid resetting state in ways we don't intend
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = createCellPositioner(cellMeasurerCache);

      let rendered = findDOMNode(
        render(
          getMarkup({
            autoHeight: true,
            cellMeasurerCache,
            cellPositioner,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      rendered = findDOMNode(
        render(
          getMarkup({
            autoHeight: true,
            cellMeasurerCache,
            cellPositioner,
            scrollTop: 51,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      rendered = findDOMNode(
        render(
          getMarkup({
            autoHeight: true,
            cellMeasurerCache,
            cellPositioner,
            scrollTop: 101,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,2,3,4,5,6,7,8,9');
      rendered = findDOMNode(
        render(
          getMarkup({
            autoHeight: true,
            cellMeasurerCache,
            cellPositioner,
            scrollTop: 1001,
          }),
        ),
      );
      assertVisibleCells(rendered, '27,29,30,31,32,33,34,35,36');
    });
  });

  describe('recomputeCellPositions', () => {
    it('should refresh all cell positions', () => {
      // Share instances between renders to avoid resetting state in ways we don't intend
      const cellMeasurerCache = createCellMeasurerCache();
      const cellPositioner = jest
        .fn()
        .mockImplementation(createCellPositioner(cellMeasurerCache));

      let rendered = findDOMNode(
        render(
          getMarkup({
            cellMeasurerCache,
            cellPositioner,
          }),
        ),
      );
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');

      cellPositioner.mockImplementation(index => ({
        left: 0,
        top: index * CELL_SIZE_MULTIPLIER,
      }));

      const component = render(
        getMarkup({
          cellMeasurerCache,
          cellPositioner,
        }),
      );
      rendered = findDOMNode(component);
      assertVisibleCells(rendered, '0,1,2,3,4,5,6,7,8');
      component.recomputeCellPositions();
      assertVisibleCells(rendered, '0,1,2,3,4');
    });

    it('should not reset measurement cache', () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const component = render(getMarkup({cellMeasurerCache}));
      const rendered = findDOMNode(component);
      simulateScroll(rendered, 101);
      expect(cellMeasurerCache.has(9)).toBe(true);
      simulateScroll(rendered, 0);
      component.recomputeCellPositions();
      for (let i = 0; i <= 9; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true);
      }
    });
  });

  describe('isScrolling', () => {
    it('should be true for cellRenderer while scrolling is in progress', () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = jest.fn().mockImplementation(index => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback,
      );
      const rendered = findDOMNode(
        render(getMarkup({cellMeasurerCache, cellRenderer})),
      );
      renderCallback.mockClear();
      simulateScroll(rendered, 51);
      expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(true);
    });

    it('should be reset after a small debounce when scrolling stops', () => {
      const cellMeasurerCache = createCellMeasurerCache();
      const renderCallback = jest.fn().mockImplementation(index => index);
      const cellRenderer = createCellRenderer(
        cellMeasurerCache,
        renderCallback,
      );
      const rendered = findDOMNode(
        render(getMarkup({cellMeasurerCache, cellRenderer})),
      );
      simulateScroll(rendered, 51);
      renderCallback.mockClear();
      setTimeout(() => {
        expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(false);
      }, 0);
    });
  });

  describe('callbacks', () => {
    it('should call onCellsRendered when rendered cells change', () => {
      const onCellsRendered = jest.fn();
      const rendered = findDOMNode(render(getMarkup({onCellsRendered})));
      expect(onCellsRendered.mock.calls).toEqual([
        [{startIndex: 0, stopIndex: 8}],
      ]);
      simulateScroll(rendered, 51);
      expect(onCellsRendered.mock.calls).toEqual([
        [{startIndex: 0, stopIndex: 8}],
      ]);
      simulateScroll(rendered, 101);
      expect(onCellsRendered.mock.calls).toEqual([
        [{startIndex: 0, stopIndex: 8}],
        [{startIndex: 0, stopIndex: 9}],
      ]);
    });

    it('should call onScroll when scroll position changes', () => {
      const onScroll = jest.fn();
      const rendered = findDOMNode(render(getMarkup({onScroll})));
      expect(onScroll.mock.calls).toEqual([
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 0}],
      ]);
      simulateScroll(rendered, 51);
      expect(onScroll.mock.calls).toEqual([
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 0}],
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 51}],
      ]);
      simulateScroll(rendered, 0);
      expect(onScroll.mock.calls).toEqual([
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 0}],
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 51}],
        [{clientHeight: 100, scrollHeight: 16900, scrollTop: 0}],
      ]);
    });
  });

  describe('keyMapper', () => {
    it('should pass the correct key to rendered cells', () => {
      const keyMapper = jest.fn().mockImplementation(index => `key:${index}`);
      const cellRenderer = jest
        .fn()
        .mockImplementation(({index, key, style}) => (
          <div key={key} style={style}>
            {index}
          </div>
        ));
      findDOMNode(render(getMarkup({cellRenderer, keyMapper})));
      expect(keyMapper).toHaveBeenCalled();
      expect(cellRenderer).toHaveBeenCalled();
      expect(cellRenderer.mock.calls[0][0].key).toEqual('key:0');
    });
  });
});
