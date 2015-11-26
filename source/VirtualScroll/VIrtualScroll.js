/** @flow */
import shouldPureComponentUpdate from 'react-pure-render/function'
import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import raf from 'raf'

const IS_SCROLLING_TIMEOUT = 150

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a simple list of elements with a fixed height. It is similar to the
 * 'react-infinite' library's `Infinite` component but offers some additional functionality such as
 * the ability to programmatically scroll to ensure that a specific row/item is visible within the
 * container.
 */
export default class VirtualScroll extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /** Optional CSS class name */
    className: PropTypes.string,
    /** Height constraint for list (determines how many actual rows are rendered) */
    height: PropTypes.number.isRequired,
    /** Fixed row height; the number of rows displayed is calculated by dividing height by rowHeight */
    rowHeight: PropTypes.number.isRequired,
    /** Responsbile for rednering a row given an index */
    rowRenderer: PropTypes.func.isRequired,
    /** Number of rows in list. */
    rowsCount: PropTypes.number.isRequired,
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      isScrolling: false,
      scrollTop: 0
    }

    this._onScroll = this._onScroll.bind(this)
    this._onWheel = this._onWheel.bind(this)
  }

  /**
   * Scroll the list to ensure the row at the specified index is visible.
   * This method exists so that a user can forcefully scroll to the same row twice.
   * (The :scrollToIndex property would not change in that case, so it would not be picked up by the component.)
   */
  scrollToRow (scrollToIndex) {
    this._updateScrollTopForScrollToIndex(scrollToIndex)
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

  componentDidUpdate (prevProps, prevState) {
    const { height, rowsCount, rowHeight, scrollToIndex } = this.props
    const { scrollTop } = this.state

    const previousRowsCount = prevProps.rowsCount

    // Make sure any changes to :scrollTop (from :scrollToIndex) get applied
    if (scrollTop >= 0 && scrollTop !== prevState.scrollTop) {
      this.refs.scrollingContainer.scrollTop = scrollTop
    }

    const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < rowsCount
    const sizeHasChanged = height !== prevProps.height || rowHeight !== prevProps.rowHeight

    // If we have a new scroll target OR if height/row-height has changed,
    // We should ensure that the scroll target is visible.
    if (hasScrollToIndex && (sizeHasChanged || scrollToIndex !== prevProps.scrollToIndex)) {
      this._updateScrollTopForScrollToIndex()

    // If we don't have a selected item but list size or number of children have decreased,
    // Make sure we aren't scrolled too far past the current content.
    } else if (!hasScrollToIndex && (height < prevProps.height || rowsCount < previousRowsCount)) {
      const calculatedScrollTop = VirtualScroll._calculateScrollTopForIndex({
        height,
        rowHeight,
        rowsCount,
        scrollTop,
        scrollToIndex: rowsCount - 1
      })

      // Only adjust the scroll position if we've scrolled below the last set of rows.
      if (calculatedScrollTop < scrollTop) {
        this._updateScrollTopForScrollToIndex(rowsCount - 1)
      }
    }
  }

  componentWillUpdate (prevProps, prevState) {
    const { rowsCount } = this.props

    if (rowsCount === 0) {
      this.setState({ scrollTop: 0 })
    }
  }

  render () {
    const {
      className,
      height,
      rowsCount,
      rowHeight,
      rowRenderer
    } = this.props

    const {
      isScrolling,
      scrollTop
    } = this.state

    const totalRowsHeight = rowsCount * rowHeight

    // Shift the visible rows down so that they remain visible while scrolling.
    // This mimicks scrolling behavior within a non-virtualized list.
    const paddingTop = scrollTop - (scrollTop % rowHeight)

    let childrenToDisplay = []

    // Render only enough rows to cover the visible (vertical) area of the table.
    if (height > 0) {
      const {
        rowIndexStart,
        rowIndexStop
      } = VirtualScroll._getStartAndStopIndexForScrollTop({
        height,
        rowHeight,
        rowsCount,
        scrollTop
      })

      childrenToDisplay = []

      for (let i = rowIndexStart; i <= rowIndexStop; i++) {
        childrenToDisplay.push(rowRenderer(i))
      }
    }

    return (
      <div
        ref='scrollingContainer'
        className={cn('VirtualScroll', className)}
        onScroll={this._onScroll}
        onWheel={this._onWheel}
        style={{
          height: height,
          overflow: 'auto'
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            height: totalRowsHeight,
            maxHeight: totalRowsHeight,
            paddingTop: paddingTop,
            overflow: 'hidden',
            pointerEvents: isScrolling ? 'none' : 'auto'
          }}
        >
          {childrenToDisplay}
        </div>
      </div>
    )
  }

  /**
   * Scroll the table to ensure the specified index is visible.
   *
   * @private
   * Why was this functionality implemented as a method instead of a property?
   * Short answer: A user of this component may want to scroll to the same row twice.
   * In this case the scroll-to-row property would not change and so it would not be picked up by the component.
   */
  static _calculateScrollTopForIndex ({ rowsCount, height, rowHeight, scrollTop, scrollToIndex }) {
    scrollToIndex = Math.max(0, Math.min(rowsCount - 1, scrollToIndex))

    const maxScrollTop = scrollToIndex * rowHeight
    const minScrollTop = maxScrollTop - height + rowHeight
    const newScrollTop = Math.max(minScrollTop, Math.min(maxScrollTop, scrollTop))

    return newScrollTop
  }

  /**
   * Calculates the maximum number of visible rows based on the row-height and the number of rows in the table.
   */
  static _getMaxVisibleRows ({ height, rowHeight, rowsCount }) {
    const minNumRowsToFillSpace = Math.ceil(height / rowHeight)

    // Add one to account for partially-clipped rows on the top and bottom
    const maxNumRowsToFillSpace = minNumRowsToFillSpace + 1

    return Math.min(rowsCount, maxNumRowsToFillSpace)
  }

  /**
   * Calculates the start and end index for visible rows based on a scroll offset.
   * Handles edge-cases to ensure that the table never scrolls past the available rows.
   */
  static _getStartAndStopIndexForScrollTop ({ height, rowHeight, rowsCount, scrollTop }) {
    const maxVisibleRows = VirtualScroll._getMaxVisibleRows({ height, rowHeight, rowsCount })
    const totalRowsHeight = rowHeight * rowsCount
    const safeScrollTop = Math.max(0, Math.min(totalRowsHeight - height, scrollTop))

    let scrollPercentage = safeScrollTop / totalRowsHeight
    let rowIndexStart = Math.floor(scrollPercentage * rowsCount)
    let rowIndexStop = Math.min(rowsCount, rowIndexStart + maxVisibleRows) - 1

    return {
      rowIndexStart,
      rowIndexStop
    }
  }

  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onWheel).
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

    const { height, rowsCount, rowHeight } = this.props
    const { scrollTop } = this.state

    if (scrollToIndex >= 0) {
      const calculatedScrollTop = VirtualScroll._calculateScrollTopForIndex({
        height,
        rowHeight,
        rowsCount,
        scrollTop,
        scrollToIndex
      })

      if (scrollTop !== calculatedScrollTop) {
        this.setState({ scrollTop: calculatedScrollTop })
      }
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
    const { height, rowsCount, rowHeight } = this.props
    const totalRowsHeight = rowsCount * rowHeight
    const scrollTop = Math.min(totalRowsHeight - height, event.target.scrollTop)

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

  _onWheel (event) {
    const scrollTop = this.refs.scrollingContainer.scrollTop

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
}
