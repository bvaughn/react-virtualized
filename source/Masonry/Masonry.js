/** @flow */
import React, { PureComponent } from 'react'
import cn from 'classnames'
import PositionCache from './PositionCache'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150

// Other considerations:
// • Pre-measure threshold (in pixels)
// • Ovescan threshold (in pixels)

// TODO Should I create a new CellMeasurerCache for Masonry?
//      Make it clearer that only 1 index is okay.
//      Don't warn about measuring both width and height.

// TODO Should I require positioner to specify a :top and :columnIndex rather than :left?

/**
 * This component efficiently displays arbitrarily positioned cells using windowing techniques.
 * Cell position is determined by an injected `cellPositioner` property.
 * Windowing is vertical; this component does not support horizontal scrolling.
 *
 * Rendering occurs in two phases:
 * 1) First pass uses estimated cell sizes (provided by the cache) to determine how many cells to measure in a batch.
 *    Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled.
 *    After measurement is complete (componentDidMount or componentDidUpdate) this component evaluates positioned cells
 *    in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes).
 *    All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.
 * 2) Second pass uses the external `cellPositioner` to layout cells.
 *    At this time the positioner has access to cached size measurements for all cells.
 *    The positions it returns are cached by Masonry for fast access later.
 *    Phase one is repeated if the user scrolls beyond the current layout's bounds.
 *    If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()`.
 *
 * Animation constraints:
 *   Simple animations are supported (eg translate/slide into place on initial reveal).
 *   More complex animations are not (eg flying from one position to another on resize).
 *
 * Layout constraints:
 *   This component supports multi-column layout.
 *   The height of each item may vary.
 *   The width of each item must not exceed the width of the column it is "in".
 *   The left position of all items within a column must align.
 *   (Items may not span multiple columns.)
 */
export default class Masonry extends PureComponent {
  props: Props;

  static defaultProps = {
    keyMapper: identity,
    onCellsRendered: noop,
    onScroll: noop,
    overscanSize: 0,
    role: 'grid',
    scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
    style: emptyObject,
    tabIndex: 0
  }

  _invalidateOnUpdateStartIndex: ?number = null;
  _invalidateOnUpdateStopIndex: ?number = null;
  _positionCache: PositionCache = new PositionCache();
  _startIndex: number = 0;
  _stopIndex: number = -1;

  constructor (props, context) {
    super(props, context)

    this.state = {
      isScrolling: false,
      scrollTop: 0
    }

    this._debounceResetIsScrollingCallback = this._debounceResetIsScrollingCallback.bind(this)
    this._setScrollingContainerRef = this._setScrollingContainerRef.bind(this)
    this._onScroll = this._onScroll.bind(this)
  }

  clearCellPositions () {
    this._positionCache = new PositionCache()
    this.forceUpdate()
  }

  // HACK This method signature was intended for Grid
  invalidateCellSizeAfterRender ({ rowIndex: index }) {
    if (this._invalidateOnUpdateStartIndex === null) {
      this._invalidateOnUpdateStartIndex = index
      this._invalidateOnUpdateStopIndex = index
    } else {
      this._invalidateOnUpdateStartIndex = Math.min(this._invalidateOnUpdateStartIndex, index)
      this._invalidateOnUpdateStopIndex = Math.max(this._invalidateOnUpdateStopIndex, index)
    }
  }

  recomputeCellPositions () {
    const stopIndex = this._positionCache.count - 1

    this._positionCache = new PositionCache()
    this._populatePositionCache(0, stopIndex)

    this.forceUpdate()
  }

  componentDidMount () {
    this._checkInvalidateOnUpdate()
  }

  componentDidUpdate (prevProps, prevState) {
    this._checkInvalidateOnUpdate()

    // TODO Call onCellsRendered callback
  }

  render () {
    const {
      cellCount,
      cellMeasurerCache,
      cellRenderer,
      className,
      columnCount,
      height,
      id,
      keyMapper,
      role,
      style,
      tabIndex,
      width
    } = this.props

    const {
      isScrolling,
      scrollTop
    } = this.state

    const children = []

    // TODO Style overflow based on the size and presence scrollbars
    const estimatedHeight = this._positionCache.estimateTotalHeight(
      cellCount,
      columnCount,
      cellMeasurerCache.defaultHeight
    )

    const shortestColumnSize = this._positionCache.shortestColumnSize
    const measuredCellCount = this._positionCache.count

    // We need to measure more cells before layout
    if (
      shortestColumnSize < scrollTop + height &&
      measuredCellCount < cellCount
    ) {
      // TODO Account for a configurable pre-measure threshold
      const batchSize =
        Math.min(
          cellCount - measuredCellCount,
          Math.ceil(
            (scrollTop + height - shortestColumnSize) / cellMeasurerCache.defaultHeight *
            width / cellMeasurerCache.defaultWidth
          )
        )

      for (let index = 0; index < batchSize; index++) {
        children.push(
          cellRenderer({
            index: index + measuredCellCount,
            isScrolling,
            key: keyMapper(index),
            parent: this,
            style: {
              width: cellMeasurerCache.getWidth(index)
            }
          })
        )
      }
    } else {
      // TODO Support overscan rendering
      this._positionCache.range(
        scrollTop,
        height,
        (index: number, left: number, top: number) => {
          children.push(
            cellRenderer({
              index,
              isScrolling,
              key: keyMapper(index),
              parent: this,
              style: {
                height: cellMeasurerCache.getHeight(index),
                left,
                position: 'absolute',
                top,
                width: cellMeasurerCache.getWidth(index)
              }
            })
          )
        }
      )
    }

    return (
      <div
        ref={this._setScrollingContainerRef}
        aria-label={this.props['aria-label']}
        className={cn('ReactVirtualized__Masonry', className)}
        id={id}
        onScroll={this._onScroll}
        role={role}
        style={{
          boxSizing: 'border-box',
          direction: 'ltr',
          height,
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          width,
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          ...style
        }}
        tabIndex={tabIndex}
      >
        <div
          className='ReactVirtualized__Masonry__innerScrollContainer'
          style={{
            width: '100%',
            height: estimatedHeight,
            maxWidth: '100%',
            maxHeight: estimatedHeight,
            overflow: 'hidden',
            pointerEvents: isScrolling ? 'none' : '',
            position: 'relative'
          }}
        >
          {children}
        </div>
      </div>
    )
  }

  _checkInvalidateOnUpdate () {
    if (typeof this._invalidateOnUpdateStartIndex === 'number') {
      const startIndex = this._invalidateOnUpdateStartIndex
      const stopIndex = this._invalidateOnUpdateStopIndex

      this._invalidateOnUpdateStartIndex = null
      this._invalidateOnUpdateStopIndex = null

      // Query external layout logic for position of newly-measured cells
      this._populatePositionCache(startIndex, stopIndex)

      this.forceUpdate()
    }
  }

  _debounceResetIsScrolling () {
    const { scrollingResetTimeInterval } = this.props

    if (this._debounceResetIsScrollingId) {
      clearTimeout(this._debounceResetIsScrollingId)
    }

    this._debounceResetIsScrollingId = setTimeout(
      this._debounceResetIsScrollingCallback,
      scrollingResetTimeInterval
    )
  }

  _debounceResetIsScrollingCallback () {
    this.setState({
      isScrolling: false
    })
  }

  _populatePositionCache (
    startIndex: number,
    stopIndex: number
  ) {
    const {
      cellMeasurerCache,
      cellPositioner
    } = this.props

    for (let index = startIndex; index <= stopIndex; index++) {
      const { left, top } = cellPositioner(index)

      this._positionCache.setPosition(
        index,
        left,
        top,
        cellMeasurerCache.getHeight(index)
      )
    }
  }

  _setScrollingContainerRef (ref) {
    this._scrollingContainer = ref
  }

  _onScroll (event) {
    // TODO Account for scrollbar size and other min/max conditions like Grid
    const {
      scrollLeft,
      scrollTop
    } = event.target

    // Prevent pointer events from interrupting a smooth scroll
    this._debounceResetIsScrolling()

    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    if (
      this.state.scrollLeft !== scrollLeft ||
      this.state.scrollTop !== scrollTop
    ) {
      this.setState({
        isScrolling: true,
        scrollLeft,
        scrollTop
      })
    }

    // TODO Call onScroll callback
  }
}

const emptyObject = {}

function identity (value) {
  return value
}

function noop () {
}

type KeyMapper = (index: number) => mixed;

type CellRenderer = (params: {|
  index: number,
  isScrolling: boolean,
  key: mixed,
  parent: mixed,
  style: mixed
|}) => mixed;

type OnCellsRenderedCallback = (params: {|
  startIndex: number,
  stopIndex: number
|}) => void;

type OnScrollCallback = (params: {|
  clientHeight: number,
  scrollHeight: number,
  scrollTop: number
|}) => void;

type Position = {
  left: number,
  top: number
};

type Positioner = (index: number) => Position;

type Props = {
  cellCount: number,
  cellMeasurerCache: mixed,
  cellPositioner: Positioner,
  cellRenderer: CellRenderer,
  className: ?string,
  columnCount: number,
  height: number,
  id: ?string,
  keyMapper: KeyMapper,
  onCellsRendered: ?OnCellsRenderedCallback,
  onScroll: ?OnScrollCallback,
  overscanSize: number,
  role: string,
  scrollingResetTimeInterval: number,
  style: mixed,
  tabIndex: number,
  width: number
};
