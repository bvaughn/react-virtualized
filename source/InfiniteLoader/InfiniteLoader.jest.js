import InfiniteLoader, {
  forceUpdateReactVirtualizedComponent,
  isRangeVisible,
  scanForUnloadedRanges,
} from './InfiniteLoader';
import * as React from 'react';
import List from '../List';
import {render} from '../TestUtils';

describe('InfiniteLoader', () => {
  let innerOnRowsRendered;
  let isRowLoadedCalls = [];
  let isRowLoadedMap = {};
  let loadMoreRowsCalls = [];
  let rowRendererCalls = [];

  beforeEach(() => {
    isRowLoadedCalls = [];
    isRowLoadedMap = {};
    loadMoreRowsCalls = [];
    rowRendererCalls = [];
  });

  function defaultIsRowLoaded({index}) {
    isRowLoadedCalls.push(index);
    return !!isRowLoadedMap[index];
  }

  function defaultLoadMoreRows({startIndex, stopIndex}) {
    loadMoreRowsCalls.push({startIndex, stopIndex});
  }

  function rowRenderer({index, key, style}) {
    rowRendererCalls.push(index);
    return <div key={key} style={style} />;
  }

  function getMarkup({
    height = 100,
    isRowLoaded = defaultIsRowLoaded,
    loadMoreRows = defaultLoadMoreRows,
    minimumBatchSize = 1,
    rowHeight = 20,
    rowCount = 100,
    scrollToIndex,
    threshold = 10,
    width = 200,
  } = {}) {
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        minimumBatchSize={minimumBatchSize}
        rowCount={rowCount}
        threshold={threshold}>
        {({onRowsRendered, registerChild}) => {
          innerOnRowsRendered = onRowsRendered;

          return (
            <List
              ref={registerChild}
              height={height}
              onRowsRendered={onRowsRendered}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              scrollToIndex={scrollToIndex}
              width={width}
            />
          );
        }}
      </InfiniteLoader>
    );
  }

  it('should call :isRowLoaded for all rows within the threshold each time a range of rows are rendered', () => {
    render(getMarkup());
    expect(isRowLoadedCalls).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
    ]);
  });

  it('should call :isRowLoaded for all rows within the rowCount each time a range of rows are rendered', () => {
    render(getMarkup({rowCount: 10}));
    expect(isRowLoadedCalls).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should call :loadMoreRows for unloaded rows within the threshold', () => {
    render(getMarkup());
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 14}]);
  });

  it('should call :loadMoreRows for unloaded rows within the rowCount', () => {
    render(getMarkup({rowCount: 10}));
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 9}]);
  });

  it('should :forceUpdate once rows have loaded if :loadMoreRows returns a Promise', async done => {
    let savedResolve;
    function loadMoreRows() {
      return new Promise(resolve => {
        savedResolve = resolve;
      });
    }
    render(getMarkup({loadMoreRows}));
    rowRendererCalls.splice(0);
    await savedResolve();
    expect(rowRendererCalls.length > 0).toEqual(true);
    done();
  });

  it('should not :forceUpdate once rows have loaded rows are no longer visible', async done => {
    let resolves = [];
    function loadMoreRows() {
      return new Promise(resolve => {
        resolves.push(resolve);
      });
    }
    render(getMarkup({loadMoreRows}));
    // Simulate a new range of rows being loaded
    innerOnRowsRendered({startIndex: 100, stopIndex: 101});
    rowRendererCalls.splice(0);
    await resolves[0](); // Resolve the first request only, not the simulated row-change
    expect(rowRendererCalls.length).toEqual(0);
    done();
  });

  describe('minimumBatchSize', () => {
    it('should respect the specified :minimumBatchSize when scrolling down', () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 0,
        }),
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 9}]);
    });

    it('should respect the specified :minimumBatchSize when scrolling up', () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          scrollToIndex: 20,
          threshold: 0,
        }),
      );
      loadMoreRowsCalls.splice(0);
      render(
        getMarkup({
          isRowLoaded: ({index}) => index >= 20,
          minimumBatchSize: 10,
          scrollToIndex: 15,
          threshold: 0,
        }),
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{startIndex: 10, stopIndex: 19}]);
    });

    it('should not interfere with :threshold', () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          threshold: 10,
        }),
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 14}]);
    });

    it('should respect the specified :minimumBatchSize if a user scrolls past the previous range', () => {
      const isRowLoadedIndices = {};

      function isRowLoaded({index}) {
        if (!isRowLoadedIndices[index]) {
          isRowLoadedIndices[index] = true;

          return false;
        } else {
          return true;
        }
      }

      render(
        getMarkup({
          isRowLoaded,
          minimumBatchSize: 10,
          threshold: 0,
        }),
      );
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({startIndex: 5, stopIndex: 10});
      expect(loadMoreRowsCalls).toEqual([
        {startIndex: 0, stopIndex: 9},
        {startIndex: 10, stopIndex: 19},
      ]);
    });

    it('should not exceed ending boundaries if :minimumBatchSize is larger than needed', () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          rowCount: 25,
          threshold: 0,
        }),
      );
      // Simulate a new range of rows being loaded
      innerOnRowsRendered({startIndex: 18, stopIndex: 22});
      expect(loadMoreRowsCalls).toEqual([
        {startIndex: 0, stopIndex: 9},
        {startIndex: 15, stopIndex: 24},
      ]);
    });

    it('should not exceed beginning boundaries if :minimumBatchSize is larger than needed', () => {
      render(
        getMarkup({
          minimumBatchSize: 10,
          scrollToIndex: 15,
          threshold: 0,
        }),
      );
      loadMoreRowsCalls.splice(0);
      render(
        getMarkup({
          isRowLoaded: ({index}) => index >= 6,
          minimumBatchSize: 10,
          scrollToIndex: 2,
          threshold: 0,
        }),
      );
      expect(loadMoreRowsCalls.length).toEqual(1);
      expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 5}]);
    });
  });

  // Verifies improved memoization; see bvaughn/react-virtualized/issues/345
  it('should memoize calls to :loadMoreRows (not calling unless unloaded ranges have changed)', () => {
    render(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 20,
        threshold: 0,
      }),
    );
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 19}]);
    innerOnRowsRendered({startIndex: 0, stopIndex: 15});
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 19}]);
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({startIndex: 0, stopIndex: 20});
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 20}]);
  });

  it('resetLoadMoreRowsCache should reset memoized state', () => {
    const component = render(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 20,
        threshold: 0,
      }),
    );
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 19}]);
    innerOnRowsRendered({startIndex: 0, stopIndex: 15});
    loadMoreRowsCalls.splice(0);
    expect(loadMoreRowsCalls).toEqual([]);
    component.resetLoadMoreRowsCache();
    innerOnRowsRendered({startIndex: 0, stopIndex: 15});
    expect(loadMoreRowsCalls).toEqual([{startIndex: 0, stopIndex: 19}]);
  });

  it('resetLoadMoreRowsCache should call :loadMoreRows if :autoReload parameter is true', () => {
    const component = render(
      getMarkup({
        isRowLoaded: () => false,
        minimumBatchSize: 1,
        threshold: 0,
      }),
    );

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({startIndex: 0, stopIndex: 10});
    component.resetLoadMoreRowsCache(true);
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 0,
      stopIndex: 10,
    });

    // Simulate a new range of rows being loaded
    loadMoreRowsCalls.splice(0);
    innerOnRowsRendered({startIndex: 20, stopIndex: 30});
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30,
    });

    loadMoreRowsCalls.splice(0);
    component.resetLoadMoreRowsCache(true);
    expect(loadMoreRowsCalls[loadMoreRowsCalls.length - 1]).toEqual({
      startIndex: 20,
      stopIndex: 30,
    });
  });
});

describe('scanForUnloadedRanges', () => {
  function createIsRowLoaded(rows) {
    return ({index}) => rows[index];
  }

  it('should return an empty array for a range of rows that have all been loaded', () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([true, true, true]),
        startIndex: 0,
        stopIndex: 2,
      }),
    ).toEqual([]);
  });

  it('return a range of only 1 unloaded row', () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([true, false, true]),
        startIndex: 0,
        stopIndex: 2,
      }),
    ).toEqual([{startIndex: 1, stopIndex: 1}]);
  });

  it('return a range of multiple unloaded rows', () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([false, false, true]),
        startIndex: 0,
        stopIndex: 2,
      }),
    ).toEqual([{startIndex: 0, stopIndex: 1}]);
  });

  it('return multiple ranges of unloaded rows', () => {
    expect(
      scanForUnloadedRanges({
        isRowLoaded: createIsRowLoaded([
          true,
          false,
          false,
          true,
          false,
          true,
          false,
        ]),
        startIndex: 0,
        stopIndex: 6,
      }),
    ).toEqual([
      {startIndex: 1, stopIndex: 2},
      {startIndex: 4, stopIndex: 4},
      {startIndex: 6, stopIndex: 6},
    ]);
  });
});

describe('isRangeVisible', () => {
  it('first row(s) are visible', () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 20,
        stopIndex: 30,
      }),
    ).toEqual(true);
  });

  it('last row(s) are visible', () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 0,
        stopIndex: 10,
      }),
    ).toEqual(true);
  });

  it('all row(s) are visible', () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 12,
        stopIndex: 14,
      }),
    ).toEqual(true);
  });

  it('no row(s) are visible', () => {
    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 0,
        stopIndex: 9,
      }),
    ).toEqual(false);

    expect(
      isRangeVisible({
        lastRenderedStartIndex: 10,
        lastRenderedStopIndex: 20,
        startIndex: 21,
        stopIndex: 30,
      }),
    ).toEqual(false);
  });
});

describe('forceUpdateReactVirtualizedComponent', () => {
  it('should call :recomputeGridSize if defined', () => {
    const recomputeGridSize = jest.fn();
    class TestComponent extends React.Component {
      recomputeGridSize = recomputeGridSize;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(render(<TestComponent />), 10);
    expect(recomputeGridSize).toHaveBeenCalledTimes(1);
    expect(recomputeGridSize).toHaveBeenCalledWith(10);
  });

  it('should called :recomputeRowHeights if defined', () => {
    const recomputeRowHeights = jest.fn();
    class TestComponent extends React.Component {
      recomputeRowHeights = recomputeRowHeights;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(render(<TestComponent />), 10);
    expect(recomputeRowHeights).toHaveBeenCalledTimes(1);
    expect(recomputeRowHeights).toHaveBeenCalledWith(10);
  });

  it('should call :forceUpdate otherwise', () => {
    const forceUpdate = jest.fn();
    class TestComponent extends React.Component {
      forceUpdate = forceUpdate;
      render() {
        return <div />;
      }
    }
    forceUpdateReactVirtualizedComponent(render(<TestComponent />), 10);
    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });
});
