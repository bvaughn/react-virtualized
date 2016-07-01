/** @flow */
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import createCallbackMemoizer from '../utils/createCallbackMemoizer'
import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import raf from 'raf'
import shallowCompare from 'react-addons-shallow-compare'

// @TODO It would be nice to refactor Grid to use this code as well.

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
const IS_SCROLLING_TIMEOUT = 150

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
const SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: 'observed',
  REQUESTED: 'requested'
}

/**
 * Monitors changes in properties (eg. cellCount) and state (eg. scroll offsets) to determine when rendering needs to occur.
 * This component does not render any visible content itself; it defers to the specified :cellLayoutManager.
 */
export default class CollectionView extends Component {
  static propTypes = {
    'aria-label': PropTypes.string,

    /**
     * Number of cells in collection.
     */
    cellCount: PropTypes.number.isRequired,

    /**
     * Calculates cell sizes and positions and manages rendering the appropriate cells given a specified window.
     */
    cellLayoutManager: PropTypes.object.isRequired,

    /**
     * Optional custom CSS class name to attach to root Collection element.
     */
    className: PropTypes.string,

    /**
     * Height of Collection; this property determines the number of visible (vs virtualized) rows.
     */
    height: PropTypes.number.isRequired,

    /**
     * Optional renderer to be used in place of rows when either :rowCount or :cellCount is 0.
     */
    noContentRenderer: PropTypes.func.isRequired,

    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
     */
    onScroll: PropTypes.func.isRequired,

    /**
     * Callback invoked with information about the section of the Collection that was just rendered.
     * This callback is passed a named :indices parameter which is an Array of the most recently rendered section indices.
     */
    onSectionRendered: PropTypes.func.isRequired,

    /**
     * Horizontal offset.
     */
    scrollLeft: PropTypes.number,

    /**
     * Controls scroll-to-cell behavior of the Grid.
     * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
     * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
     */
    scrollToAlignment: PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

    /**
     * Cell index to ensure visible (by forcefully scrolling if necessary).
     */
    scrollToCell: PropTypes.number,

    /**
     * Vertical offset.
     */
    scrollTop: PropTypes.number,

    /**
     * Optional custom inline style to attach to root Collection element.
     */
    style: PropTypes.object,

    /**
     * Width of Collection; this property determines the number of visible (vs virtualized) columns.
     */
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    'aria-label': 'grid',
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    scrollToAlignment: 'auto',
    style: {}
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      calculateSizeAndPositionDataOnNextUpdate: false,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    }

    // Invokes callbacks only when their values have changed.
    this._onSectionRenderedMemoizer = createCallbackMemoizer()
    this._onScrollMemoizer = createCallbackMemoizer(false)

    // Bind functions to instance so they don't lose context when passed around.
    this._invokeOnSectionRenderedHelper = this._invokeOnSectionRenderedHelper.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._updateScrollPositionForScrollToCell = this._updateScrollPositionForScrollToCell.bind(this)
  }

  /**
   * Forced recompute of cell sizes and positions.
   * This function should be called if cell sizes have changed but nothing else has.
   * Since cell positions are calculated by callbacks, the collection view has no way of detecting when the underlying data has changed.
   */
  recomputeCellSizesAndPositions () {
    this.setState({
      calculateSizeAndPositionDataOnNextUpdate: true
    })
  }

  /* ---------------------------- Component lifecycle methods ---------------------------- */

  componentDidMount () {
    const { cellLayoutManager, scrollLeft, scrollToCell, scrollTop } = this.props

    // If this component was first rendered server-side, scrollbar size will be undefined.
    // In that event we need to remeasure.
    if (!this._scrollbarSizeMeasured) {
      this._scrollbarSize = getScrollbarSize()
      this._scrollbarSizeMeasured = true
      this.setState({})
    }

    if (scrollToCell >= 0) {
      this._updateScrollPositionForScrollToCell()
    } else if (scrollLeft >= 0 || scrollTop >= 0) {
      this._setScrollPosition({ scrollLeft, scrollTop })
    }

    // Update onSectionRendered callback.
    this._invokeOnSectionRenderedHelper()

    const {
      height: totalHeight,
      width: totalWidth
    } = cellLayoutManager.getTotalSize()

    // Initialize onScroll callback.
    this._invokeOnScrollMemoizer({
      scrollLeft: scrollLeft || 0,
      scrollTop: scrollTop || 0,
      totalHeight,
      totalWidth
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { height, scrollToCell, width } = this.props
    const { scrollLeft, scrollPositionChangeReason, scrollToAlignment, scrollTop } = this.state

    // Make sure requested changes to :scrollLeft or :scrollTop get applied.
    // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
    // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
    // So we only set these when we require an adjustment of the scroll position.
    // See issue #2 for more information.
    if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
      if (
        scrollLeft >= 0 &&
        scrollLeft !== prevState.scrollLeft &&
        scrollLeft !== this._scrollingContainer.scrollLeft
      ) {
        this._scrollingContainer.scrollLeft = scrollLeft
      }
      if (
        scrollTop >= 0 &&
        scrollTop !== prevState.scrollTop &&
        scrollTop !== this._scrollingContainer.scrollTop
      ) {
        this._scrollingContainer.scrollTop = scrollTop
      }
    }

    // Update scroll offsets if the current :scrollToCell values requires it
    if (
      height !== prevProps.height ||
      scrollToAlignment !== prevProps.scrollToAlignment ||
      scrollToCell !== prevProps.scrollToCell ||
      width !== prevProps.width
    ) {
      this._updateScrollPositionForScrollToCell()
    }

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnSectionRenderedHelper()
  }

  componentWillMount () {
    const { cellLayoutManager } = this.props

    cellLayoutManager.calculateSizeAndPositionData()

    // If this component is being rendered server-side, getScrollbarSize() will return undefined.
    // We handle this case in componentDidMount()
    this._scrollbarSize = getScrollbarSize()
    if (this._scrollbarSize === undefined) {
      this._scrollbarSizeMeasured = false
      this._scrollbarSize = 0
    } else {
      this._scrollbarSizeMeasured = true
    }
  }

  componentWillUnmount () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }
  }

  /**
   * @private
   * This method updates scrollLeft/scrollTop in state for the following conditions:
   * 1) Empty content (0 rows or columns)
   * 2) New scroll props overriding the current state
   * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
   */
  componentWillUpdate (nextProps, nextState) {
    if (
      nextProps.cellCount === 0 &&
      (
        nextState.scrollLeft !== 0 ||
        nextState.scrollTop !== 0
      )
    ) {
      this._setScrollPosition({
        scrollLeft: 0,
        scrollTop: 0
      })
    } else if (
      nextProps.scrollLeft !== this.props.scrollLeft ||
      nextProps.scrollTop !== this.props.scrollTop
    ) {
      this._setScrollPosition({
        scrollLeft: nextProps.scrollLeft,
        scrollTop: nextProps.scrollTop
      })
    }

    if (
      nextProps.cellCount !== this.props.cellCount ||
      nextProps.cellLayoutManager !== this.props.cellLayoutManager ||
      nextState.calculateSizeAndPositionDataOnNextUpdate
    ) {
      nextProps.cellLayoutManager.calculateSizeAndPositionData()
    }

    if (nextState.calculateSizeAndPositionDataOnNextUpdate) {
      this.setState({
        calculateSizeAndPositionDataOnNextUpdate: false
      })
    }
  }

  render () {
    const {
      cellLayoutManager,
      className,
      height,
      noContentRenderer,
      style,
      width
    } = this.props

    const {
      isScrolling,
      scrollLeft,
      scrollTop
    } = this.state

    const childrenToDisplay = height > 0 && width > 0
      ? cellLayoutManager.cellRenderers({
        height,
        isScrolling,
        width,
        x: scrollLeft,
        y: scrollTop
      }) : []

    const {
      height: totalHeight,
      width: totalWidth
    } = cellLayoutManager.getTotalSize()

    const collectionStyle = {
      ...style,
      height,
      width
    }

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize = totalHeight > height ? this._scrollbarSize : 0
    const horizontalScrollBarSize = totalWidth > width ? this._scrollbarSize : 0
    if (totalWidth + verticalScrollBarSize <= width) {
      collectionStyle.overflowX = 'hidden'
    }
    if (totalHeight + horizontalScrollBarSize <= height) {
      collectionStyle.overflowY = 'hidden'
    }

    return (
      <div
        ref={(ref) => {
          this._scrollingContainer = ref
        }}
        aria-label={this.props['aria-label']}
        className={cn('Collection', className)}
        onScroll={this._onScroll}
        role='grid'
        style={collectionStyle}
        tabIndex={0}
      >
        {childrenToDisplay.length > 0 &&
          <div
            className='Collection__innerScrollContainer'
            style={{
              height: totalHeight,
              maxHeight: totalHeight,
              maxWidth: totalWidth,
              pointerEvents: isScrolling ? 'none' : 'auto',
              width: totalWidth
            }}
          >
            {childrenToDisplay}
          </div>
        }
        {childrenToDisplay.length === 0 &&
          noContentRenderer()
        }
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /* ---------------------------- Helper methods ---------------------------- */

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the Collection.
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _enablePointerEventsAfterDelay () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    this._disablePointerEventsTimeoutId = setTimeout(() => {
      this._disablePointerEventsTimeoutId = null
      this.setState({
        isScrolling: false
      })
    }, IS_SCROLLING_TIMEOUT)
  }

  _invokeOnSectionRenderedHelper () {
    const { cellLayoutManager, onSectionRendered } = this.props

    this._onSectionRenderedMemoizer({
      callback: onSectionRendered,
      indices: {
        indices: cellLayoutManager.getLastRenderedIndices()
      }
    })
  }

  _invokeOnScrollMemoizer ({ scrollLeft, scrollTop, totalHeight, totalWidth }) {
    this._onScrollMemoizer({
      callback: ({ scrollLeft, scrollTop }) => {
        const { height, onScroll, width } = this.props

        onScroll({
          clientHeight: height,
          clientWidth: width,
          scrollHeight: totalHeight,
          scrollLeft,
          scrollTop,
          scrollWidth: totalWidth
        })
      },
      indices: {
        scrollLeft,
        scrollTop
      }
    })
  }

  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  _setNextState (state) {
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }

    this._setNextStateAnimationFrameId = raf(() => {
      this._setNextStateAnimationFrameId = null
      this.setState(state)
    })
  }

  _setScrollPosition ({ scrollLeft, scrollTop }) {
    const newState = {
      scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
    }

    if (scrollLeft >= 0) {
      newState.scrollLeft = scrollLeft
    }

    if (scrollTop >= 0) {
      newState.scrollTop = scrollTop
    }

    if (
      (
        scrollLeft >= 0 &&
        scrollLeft !== this.state.scrollLeft
      ) ||
      (
        scrollTop >= 0 &&
        scrollTop !== this.state.scrollTop
      )
    ) {
      this.setState(newState)
    }
  }

  _updateScrollPositionForScrollToCell () {
    const { cellLayoutManager, height, scrollToAlignment, scrollToCell, width } = this.props
    const { scrollLeft, scrollTop } = this.state

    if (scrollToCell >= 0) {
      const scrollPosition = cellLayoutManager.getScrollPositionForCell({
        align: scrollToAlignment,
        cellIndex: scrollToCell,
        height,
        scrollLeft,
        scrollTop,
        width
      })

      if (
        scrollPosition.scrollLeft !== scrollLeft ||
        scrollPosition.scrollTop !== scrollTop
      ) {
        this._setScrollPosition(scrollPosition)
      }
    }
  }

  _onScroll (event) {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target !== this._scrollingContainer) {
      return
    }

    // Prevent pointer events from interrupting a smooth scroll
    this._enablePointerEventsAfterDelay()

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
    const { cellLayoutManager, height, width } = this.props
    const scrollbarSize = this._scrollbarSize
    const {
      height: totalHeight,
      width: totalWidth
    } = cellLayoutManager.getTotalSize()
    const scrollLeft = Math.max(0, Math.min(totalWidth - width + scrollbarSize, event.target.scrollLeft))
    const scrollTop = Math.max(0, Math.min(totalHeight - height + scrollbarSize, event.target.scrollTop))

    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    if (
      this.state.scrollLeft !== scrollLeft ||
      this.state.scrollTop !== scrollTop
    ) {
      // Browsers with cancelable scroll events (eg. Firefox) interrupt scrolling animations if scrollTop/scrollLeft is set.
      // Other browsers (eg. Safari) don't scroll as well without the help under certain conditions (DOM or style changes during scrolling).
      // All things considered, this seems to be the best current work around that I'm aware of.
      // For more information see https://github.com/bvaughn/react-virtualized/pull/124
      const scrollPositionChangeReason = event.cancelable
        ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED
        : SCROLL_POSITION_CHANGE_REASONS.REQUESTED

      // Synchronously set :isScrolling the first time (since _setNextState will reschedule its animation frame each time it's called)
      if (!this.state.isScrolling) {
        this.setState({
          isScrolling: true
        })
      }

      this._setNextState({
        isScrolling: true,
        scrollLeft,
        scrollPositionChangeReason,
        scrollTop
      })
    }

    this._invokeOnScrollMemoizer({
      scrollLeft,
      scrollTop,
      totalWidth,
      totalHeight
    })
  }
}
