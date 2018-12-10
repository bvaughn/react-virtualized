/** @flow */
import * as React from 'react';
import PropTypes from 'prop-types';
import createCallbackMemoizer from '../utils/createCallbackMemoizer';

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */
export default class InfiniteLoader extends React.PureComponent {
  static propTypes = {
    /**
     * Function responsible for rendering a virtualized component.
     * This function should implement the following signature:
     * ({ onRowsRendered, registerChild }) => PropTypes.element
     *
     * The specified :onRowsRendered function should be passed through to the child's :onRowsRendered property.
     * The :registerChild callback should be set as the virtualized component's :ref.
     */
    children: PropTypes.func.isRequired,

    /**
     * Function responsible for tracking the loaded state of each row.
     * It should implement the following signature: ({ index: number }): boolean
     */
    isRowLoaded: PropTypes.func.isRequired,

    /**
     * Callback to be invoked when more rows must be loaded.
     * It should implement the following signature: ({ startIndex, stopIndex }): Promise
     * The returned Promise should be resolved once row data has finished loading.
     * It will be used to determine when to refresh the list with the newly-loaded data.
     * This callback may be called multiple times in reaction to a single scroll event.
     */
    loadMoreRows: PropTypes.func.isRequired,

    /**
     * Minimum number of rows to be loaded at a time.
     * This property can be used to batch requests to reduce HTTP requests.
     */
    minimumBatchSize: PropTypes.number.isRequired,

    /**
     * Number of rows in list; can be arbitrary high number if actual number is unknown.
     */
    rowCount: PropTypes.number.isRequired,

    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means that data will start loading when a user scrolls within X rows.
     * This value defaults to 15.
     */
    threshold: PropTypes.number.isRequired,
  };

  static defaultProps = {
    minimumBatchSize: 10,
    rowCount: 0,
    threshold: 15,
  };

  constructor(props, context) {
    super(props, context);

    this._loadMoreRowsMemoizer = createCallbackMemoizer();

    this._onRowsRendered = this._onRowsRendered.bind(this);
    this._registerChild = this._registerChild.bind(this);
  }

  resetLoadMoreRowsCache(autoReload) {
    this._loadMoreRowsMemoizer = createCallbackMemoizer();

    if (autoReload) {
      this._doStuff(this._lastRenderedStartIndex, this._lastRenderedStopIndex);
    }
  }

  render() {
    const {children} = this.props;

    return children({
      onRowsRendered: this._onRowsRendered,
      registerChild: this._registerChild,
    });
  }

  _loadUnloadedRanges(unloadedRanges) {
    const {loadMoreRows} = this.props;

    unloadedRanges.forEach(unloadedRange => {
      let promise = loadMoreRows(unloadedRange);
      if (promise) {
        promise.then(() => {
          // Refresh the visible rows if any of them have just been loaded.
          // Otherwise they will remain in their unloaded visual state.
          if (
            isRangeVisible({
              lastRenderedStartIndex: this._lastRenderedStartIndex,
              lastRenderedStopIndex: this._lastRenderedStopIndex,
              startIndex: unloadedRange.startIndex,
              stopIndex: unloadedRange.stopIndex,
            })
          ) {
            if (this._registeredChild) {
              forceUpdateReactVirtualizedComponent(
                this._registeredChild,
                this._lastRenderedStartIndex,
              );
            }
          }
        });
      }
    });
  }

  _onRowsRendered({startIndex, stopIndex}) {
    this._lastRenderedStartIndex = startIndex;
    this._lastRenderedStopIndex = stopIndex;

    this._doStuff(startIndex, stopIndex);
  }

  _doStuff(startIndex, stopIndex) {
    const {isRowLoaded, minimumBatchSize, rowCount, threshold} = this.props;

    const unloadedRanges = scanForUnloadedRanges({
      isRowLoaded,
      minimumBatchSize,
      rowCount,
      startIndex: Math.max(0, startIndex - threshold),
      stopIndex: Math.min(rowCount - 1, stopIndex + threshold),
    });

    // For memoize comparison
    const squashedUnloadedRanges = [].concat(
      ...unloadedRanges.map(({startIndex, stopIndex}) => [
        startIndex,
        stopIndex,
      ]),
    );

    this._loadMoreRowsMemoizer({
      callback: () => {
        this._loadUnloadedRanges(unloadedRanges);
      },
      indices: {squashedUnloadedRanges},
    });
  }

  _registerChild(registeredChild) {
    this._registeredChild = registeredChild;
  }
}

/**
 * Determines if the specified start/stop range is visible based on the most recently rendered range.
 */
export function isRangeVisible({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex,
}) {
  return !(
    startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex
  );
}

/**
 * Returns all of the ranges within a larger range that contain unloaded rows.
 */
export function scanForUnloadedRanges({
  isRowLoaded,
  minimumBatchSize,
  rowCount,
  startIndex,
  stopIndex,
}) {
  const unloadedRanges = [];

  let rangeStartIndex = null;
  let rangeStopIndex = null;

  for (let index = startIndex; index <= stopIndex; index++) {
    let loaded = isRowLoaded({index});

    if (!loaded) {
      rangeStopIndex = index;
      if (rangeStartIndex === null) {
        rangeStartIndex = index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push({
        startIndex: rangeStartIndex,
        stopIndex: rangeStopIndex,
      });

      rangeStartIndex = rangeStopIndex = null;
    }
  }

  // If :rangeStopIndex is not null it means we haven't ran out of unloaded rows.
  // Scan forward to try filling our :minimumBatchSize.
  if (rangeStopIndex !== null) {
    const potentialStopIndex = Math.min(
      Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1),
      rowCount - 1,
    );

    for (let index = rangeStopIndex + 1; index <= potentialStopIndex; index++) {
      if (!isRowLoaded({index})) {
        rangeStopIndex = index;
      } else {
        break;
      }
    }

    unloadedRanges.push({
      startIndex: rangeStartIndex,
      stopIndex: rangeStopIndex,
    });
  }

  // Check to see if our first range ended prematurely.
  // In this case we should scan backwards to try filling our :minimumBatchSize.
  if (unloadedRanges.length) {
    const firstUnloadedRange = unloadedRanges[0];

    while (
      firstUnloadedRange.stopIndex - firstUnloadedRange.startIndex + 1 <
        minimumBatchSize &&
      firstUnloadedRange.startIndex > 0
    ) {
      let index = firstUnloadedRange.startIndex - 1;

      if (!isRowLoaded({index})) {
        firstUnloadedRange.startIndex = index;
      } else {
        break;
      }
    }
  }

  return unloadedRanges;
}

/**
 * Since RV components use shallowCompare we need to force a render (even though props haven't changed).
 * However InfiniteLoader may wrap a Grid or it may wrap a Table or List.
 * In the first case the built-in React forceUpdate() method is sufficient to force a re-render,
 * But in the latter cases we need to use the RV-specific forceUpdateGrid() method.
 * Else the inner Grid will not be re-rendered and visuals may be stale.
 *
 * Additionally, while a Grid is scrolling the cells can be cached,
 * So it's important to invalidate that cache by recalculating sizes
 * before forcing a rerender.
 */
export function forceUpdateReactVirtualizedComponent(
  component,
  currentIndex = 0,
) {
  const recomputeSize =
    typeof component.recomputeGridSize === 'function'
      ? component.recomputeGridSize
      : component.recomputeRowHeights;

  if (recomputeSize) {
    recomputeSize.call(component, currentIndex);
  } else {
    component.forceUpdate();
  }
}
