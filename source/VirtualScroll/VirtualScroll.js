/** @flow */
import {
  computeCellMetadataAndUpdateScrollOffsetHelper,
  createCallbackMemoizer,
  getOverscanIndices,
  getUpdatedOffsetForIndex,
  getVisibleCellIndices,
  initCellMetadata,
  updateScrollIndexHelper
} from '../utils'
import cn from 'classnames'
import raf from 'raf'
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
const IS_SCROLLING_TIMEOUT = 150

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export default class VirtualScroll extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /** Optional CSS class name */
    className: PropTypes.string,
    /** Height constraint for list (determines how many actual rows are rendered) */
    height: PropTypes.number.isRequired,
    /** Optional renderer to be used in place of rows when rowsCount is 0 */
    noRowsRenderer: PropTypes.func.isRequired,
    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered: PropTypes.func.isRequired,
    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowsCount: PropTypes.number.isRequired,
    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ scrollTop }): void
     */
    onScroll: PropTypes.func.isRequired,
    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * (index: number): number
     */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
    /** Responsbile for rendering a row given an index */
    rowRenderer: PropTypes.func.isRequired,
    /** Number of rows in list. */
    rowsCount: PropTypes.number.isRequired,
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number
  }

  static defaultProps = {
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanRowsCount: 10
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      computeCellMetadataOnNextUpdate: false,
      isScrolling: false,
      scrollTop: 0
    }

    // Invokes onRowsRendered callback only when start/stop row indices change
    this._onRowsRenderedMemoizer = createCallbackMemoizer()
    this._onScrollMemoizer = createCallbackMemoizer(false)

    // Bind functions to instance so they don't lose context when passed around
    this._computeCellMetadata = this._computeCellMetadata.bind(this)
    this._invokeOnRowsRenderedHelper = this._invokeOnRowsRenderedHelper.bind(this)
    this._onKeyPress = this._onKeyPress.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._updateScrollTopForScrollToIndex = this._updateScrollTopForScrollToIndex.bind(this)
  }

  /**
   * Forced recompute of row heights.
   * This function should be called if dynamic row heights have changed but nothing else has.
   * Since VirtualScroll receives a :rowsCount it has no way of knowing if the underlying list data has changed.
   */
  recomputeRowHeights () {
    this.setState({
      computeCellMetadataOnNextUpdate: true
    })
  }

  /**
   * Scroll the list to ensure the row at the specified index is visible.
   * This method exists so that a user can forcefully scroll to the same row twice.
   * (The :scrollToIndex property would not change in that case, so it would not be picked up by the component.)
   */
  scrollToRow (scrollToIndex) {
    this._updateScrollTopForScrollToIndex(scrollToIndex)
  }

  /**
   * Set the :scrollTop position within the inner scroll container.
   * Normally it is best to let VirtualScroll manage this properties or to use a method like :scrollToRow.
   * This method enables VirtualScroll to be scroll-synced to another react-virtualized component though.
   * It is appropriate to use in that case.
   */
  setScrollTop (scrollTop) {
    scrollTop = Number.isNaN(scrollTop) ? 0 : scrollTop

    this.setState({ scrollTop })
  }

  componentDidMount () {
    const { scrollToIndex } = this.props

    if (scrollToIndex >= 0) {
      // Without setImmediate() the initial scrollingContainer.scrollTop assignment doesn't work
      this._scrollTopId = setImmediate(() => {
        this._scrollTopId = null
        this._updateScrollTopForScrollToIndex()
      })
    }

    // Update onRowsRendered callback
    this._invokeOnRowsRenderedHelper()
  }

  componentDidUpdate (prevProps, prevState) {
    const { height, rowsCount, rowHeight, scrollToIndex } = this.props
    const { scrollTop } = this.state

    // Make sure any changes to :scrollTop (from :scrollToIndex) get applied
    if (scrollTop >= 0 && scrollTop !== prevState.scrollTop) {
      this.refs.scrollingContainer.scrollTop = scrollTop
    }

    // Update scrollTop if appropriate
    updateScrollIndexHelper({
      cellsCount: rowsCount,
      cellMetadata: this._cellMetadata,
      cellSize: rowHeight,
      previousCellsCount: prevProps.rowsCount,
      previousCellSize: prevProps.rowHeight,
      previousScrollToIndex: prevProps.scrollToIndex,
      previousSize: prevProps.height,
      scrollOffset: scrollTop,
      scrollToIndex,
      size: height,
      updateScrollIndexCallback: this._updateScrollTopForScrollToIndex
    })

    // Update onRowsRendered callback if start/stop indices have changed
    this._invokeOnRowsRenderedHelper()
  }

  componentWillMount () {
    this._computeCellMetadata(this.props)
  }

  componentWillUnmount () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }
    if (this._scrollTopId) {
      clearImmediate(this._scrollTopId)
    }
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (
      nextProps.rowsCount === 0 &&
      nextState.scrollTop !== 0
    ) {
      this.setState({ scrollTop: 0 })
    }

    computeCellMetadataAndUpdateScrollOffsetHelper({
      cellsCount: this.props.rowsCount,
      cellSize: this.props.rowHeight,
      computeMetadataCallback: this._computeCellMetadata,
      computeMetadataCallbackProps: nextProps,
      computeMetadataOnNextUpdate: nextState.computeCellMetadataOnNextUpdate,
      nextCellsCount: nextProps.rowsCount,
      nextCellSize: nextProps.rowHeight,
      nextScrollToIndex: nextProps.scrollToIndex,
      scrollToIndex: this.props.scrollToIndex,
      updateScrollOffsetForScrollToIndex: this._updateScrollTopForScrollToIndex
    })

    this.setState({
      computeCellMetadataOnNextUpdate: false
    })
  }

  render () {
    const {
      className,
      height,
      noRowsRenderer,
      overscanRowsCount,
      rowsCount,
      rowRenderer
    } = this.props

    const {
      isScrolling,
      scrollTop
    } = this.state

    let childrenToDisplay = []

    // Render only enough rows to cover the visible (vertical) area of the table.
    if (height > 0) {
      let {
        start,
        stop
      } = getVisibleCellIndices({
        cellsCount: rowsCount,
        cellMetadata: this._cellMetadata,
        containerSize: height,
        currentOffset: scrollTop
      })

      // Store for onRowsRendered callback in componentDidUpdate
      this._renderedStartIndex = start
      this._renderedStopIndex = stop

      const {
        overscanStartIndex,
        overscanStopIndex
      } = getOverscanIndices({
        cellsCount: rowsCount,
        overscanCellsCount: overscanRowsCount,
        startIndex: start,
        stopIndex: stop
      })

      start = overscanStartIndex
      stop = overscanStopIndex

      for (let i = start; i <= stop; i++) {
        let datum = this._cellMetadata[i]
        let child = rowRenderer(i)
        child = (
          <div
            key={i}
            className='VirtualScroll__row'
            style={{
              top: datum.offset,
              width: '100%',
              height: this._getRowHeight(i)
            }}
          >
            {child}
          </div>
        )

        childrenToDisplay.push(child)
      }
    }

    return (
      <div
        ref='scrollingContainer'
        className={cn('VirtualScroll', className)}
        onKeyDown={this._onKeyPress}
        onScroll={this._onScroll}
        tabIndex={0}
        style={{
          height: height
        }}
      >
        {rowsCount > 0 &&
          <div
            className='VirtualScroll__innerScrollContainer'
            style={{
              height: this._getTotalRowsHeight(),
              maxHeight: this._getTotalRowsHeight(),
              pointerEvents: isScrolling ? 'none' : 'auto'
            }}
          >
            {childrenToDisplay}
          </div>
        }
        {rowsCount === 0 &&
          noRowsRenderer()
        }
      </div>
    )
  }

  /* ---------------------------- Helper methods ---------------------------- */

  _computeCellMetadata (props) {
    const { rowHeight, rowsCount } = props

    this._cellMetadata = initCellMetadata({
      cellsCount: rowsCount,
      size: rowHeight
    })
  }

  _getRowHeight (index) {
    const { rowHeight } = this.props

    return rowHeight instanceof Function
      ? rowHeight(index)
      : rowHeight
  }

  _getTotalRowsHeight () {
    if (this._cellMetadata.length === 0) {
      return 0
    }

    const datum = this._cellMetadata[this._cellMetadata.length - 1]
    return datum.offset + datum.size
  }

  _invokeOnRowsRenderedHelper () {
    const { onRowsRendered, overscanRowsCount, rowsCount } = this.props

    const startIndex = this._renderedStartIndex
    const stopIndex = this._renderedStopIndex

    const {
      overscanStartIndex,
      overscanStopIndex
    } = getOverscanIndices({
      cellsCount: rowsCount,
      overscanCellsCount: overscanRowsCount,
      startIndex,
      stopIndex
    })

    this._onRowsRenderedMemoizer({
      callback: onRowsRendered,
      indices: {
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex
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

  _setNextStateForScrollHelper ({ scrollTop }) {
    // Certain devices (like Apple touchpad) rapid-fire duplicate events.
    // Don't force a re-render if this is the case.
    if (this.state.scrollTop === scrollTop) {
      return
    }

    // Prevent pointer events from interrupting a smooth scroll
    this._temporarilyDisablePointerEvents()

    // The mouse may move faster then the animation frame does.
    // Use requestAnimationFrame to avoid over-updating.
    this._setNextState({
      isScrolling: true,
      scrollTop
    })
  }

  _stopEvent (event) {
    event.preventDefault()
  }

  /**
   * Sets an :isScrolling flag for a small window of time.
   * This flag is used to disable pointer events on the scrollable portion of the table (the rows).
   * This prevents jerky/stuttery mouse-wheel scrolling.
   */
  _temporarilyDisablePointerEvents () {
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

  /**
   * Calculates and adjusts scrollTop if necessary to ensure that the row at the specified index is visible.
   */
  _updateScrollTopForScrollToIndex (scrollToIndexOverride) {
    const scrollToIndex = scrollToIndexOverride !== undefined
      ? scrollToIndexOverride
      : this.props.scrollToIndex

    const { height } = this.props
    const { scrollTop } = this.state

    if (scrollToIndex >= 0) {
      const calculatedScrollTop = getUpdatedOffsetForIndex({
        cellMetadata: this._cellMetadata,
        containerSize: height,
        currentOffset: scrollTop,
        targetIndex: scrollToIndex
      })

      if (scrollTop !== calculatedScrollTop) {
        this.setState({ scrollTop: calculatedScrollTop })
      }
    }
  }

  /* ---------------------------- Event Handlers ---------------------------- */

  _onKeyPress (event) {
    const { height, rowsCount } = this.props
    const { scrollTop } = this.state

    let start, datum, newScrollTop

    if (rowsCount === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: rowsCount,
          cellMetadata: this._cellMetadata,
          containerSize: height,
          currentOffset: scrollTop
        }).start
        datum = this._cellMetadata[start]
        newScrollTop = Math.min(
          this._getTotalRowsHeight() - height,
          scrollTop + datum.size
        )

        this.setState({
          scrollTop: newScrollTop
        })
        break
      case 'ArrowUp':
        this._stopEvent(event) // Prevent key from also scrolling surrounding window

        start = getVisibleCellIndices({
          cellsCount: rowsCount,
          cellMetadata: this._cellMetadata,
          containerSize: height,
          currentOffset: scrollTop
        }).start

        this.scrollToRow(Math.max(0, start - 1))
        break
    }
  }

  _onScroll (event) {
    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (event.target !== this.refs.scrollingContainer) {
      return
    }

    // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
    // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
    // This causes a series of rapid renders that is slow for long lists.
    // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
    const { height, onScroll } = this.props
    const totalRowsHeight = this._getTotalRowsHeight()
    const scrollTop = Math.min(totalRowsHeight - height, event.target.scrollTop)

    this._setNextStateForScrollHelper({ scrollTop })

    this._onScrollMemoizer({
      callback: onScroll,
      indices: {
        scrollTop
      }
    })
  }
}
