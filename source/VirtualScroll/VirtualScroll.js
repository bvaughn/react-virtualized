/** @flow */
import {
  getUpdatedOffsetForIndex,
  getVisibleCellIndices,
  initCellMetadata,
  initOnRowsRenderedHelper,
  prefixStyleSheet
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
    /** Optional renderer to be used in place of rows when rowsCount is 0 */
    noRowsRenderer: PropTypes.func,
    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered: PropTypes.func,
    /** Either a fixed row height (number) or a function that returns the height of a row given its index. */
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
    /** Responsbile for rendering a row given an index */
    rowRenderer: PropTypes.func.isRequired,
    /** Number of rows in list. */
    rowsCount: PropTypes.number.isRequired,
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,
    /** Specifies presentational styles for component. */
    styleSheet: PropTypes.object
  }

  static defaultProps = {
    noRowsRenderer: () => null,
    onRowsRendered: () => null
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      computeCellMetadataOnNextUpdate: false,
      isScrolling: false,
      styleSheet: prefixStyleSheet(props.styleSheet || VirtualScroll.defaultStyleSheet),
      scrollTop: 0
    }

    // Invokes onRowsRendered callback only when start/stop row indices change
    this._OnRowsRenderedHelper = initOnRowsRenderedHelper()

    this._onKeyPress = this._onKeyPress.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._onWheel = this._onWheel.bind(this)
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

  componentDidMount () {
    const { onRowsRendered, scrollToIndex } = this.props

    if (scrollToIndex >= 0) {
      // Without setImmediate() the initial scrollingContainer.scrollTop assignment doesn't work
      this._scrollTopId = setImmediate(() => {
        this._scrollTopId = null
        this._updateScrollTopForScrollToIndex()
      })
    }

    // Update onRowsRendered callback
    this._OnRowsRenderedHelper({
      onRowsRendered,
      startIndex: this._renderedStartIndex,
      stopIndex: this._renderedStopIndex
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { height, onRowsRendered, rowsCount, rowHeight, scrollToIndex } = this.props
    const { scrollTop } = this.state

    // Make sure any changes to :scrollTop (from :scrollToIndex) get applied
    if (scrollTop >= 0 && scrollTop !== prevState.scrollTop) {
      this.refs.scrollingContainer.scrollTop = scrollTop
    }

    const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < rowsCount
    const sizeHasChanged = (
      height !== prevProps.height ||
      !prevProps.rowHeight ||
      (
        typeof rowHeight === 'number' &&
        rowHeight !== prevProps.rowHeight
      )
    )

    // If we have a new scroll target OR if height/row-height has changed,
    // We should ensure that the scroll target is visible.
    if (hasScrollToIndex && (sizeHasChanged || scrollToIndex !== prevProps.scrollToIndex)) {
      this._updateScrollTopForScrollToIndex()

    // If we don't have a selected item but list size or number of children have decreased,
    // Make sure we aren't scrolled too far past the current content.
    } else if (!hasScrollToIndex && (height < prevProps.height || rowsCount < prevProps.rowsCount)) {
      const calculatedScrollTop = getUpdatedOffsetForIndex({
        cellMetadata: this._cellMetadata,
        containerSize: height,
        currentOffset: scrollTop,
        targetIndex: rowsCount - 1
      })

      // Only adjust the scroll position if we've scrolled below the last set of rows.
      if (calculatedScrollTop < scrollTop) {
        this._updateScrollTopForScrollToIndex(rowsCount - 1)
      }
    }

    // Update onRowsRendered callback if start/stop indices have changed
    this._OnRowsRenderedHelper({
      onRowsRendered,
      startIndex: this._renderedStartIndex,
      stopIndex: this._renderedStopIndex
    })
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

    if (this.props.styleSheet !== nextProps.styleSheet) {
      this.setState({
        styleSheet: prefixStyleSheet(nextProps.styleSheet)
      })
    }

    // Don't compare rowHeight if it's a function because inline functions would cause infinite loops.
    // In that event users should use recomputeRowHeights() to inform of changes.
    if (
      nextState.computeCellMetadataOnNextUpdate ||
      this.props.rowsCount !== nextProps.rowsCount ||
      (
        (
          typeof this.props.rowHeight === 'number' ||
          typeof nextProps.rowHeight === 'number'
        ) &&
        this.props.rowHeight !== nextProps.rowHeight
      )
    ) {
      this._computeCellMetadata(nextProps)

      this.setState({
        computeCellMetadataOnNextUpdate: false
      })

      // Updated cell metadata may have hidden the previous scrolled-to item.
      // In this case we should also update the scrollTop to ensure it stays visible.
      if (this.props.scrollToIndex === nextProps.scrollToIndex) {
        this._updateScrollTopForScrollToIndex()
      }
    }
  }

  render () {
    const {
      className,
      height,
      noRowsRenderer,
      rowsCount,
      rowRenderer
    } = this.props

    const {
      isScrolling,
      scrollTop,
      styleSheet
    } = this.state

    let childrenToDisplay = []

    // Render only enough rows to cover the visible (vertical) area of the table.
    if (height > 0) {
      const {
        start,
        stop
      } = getVisibleCellIndices({
        cellCount: rowsCount,
        cellMetadata: this._cellMetadata,
        containerSize: height,
        currentOffset: scrollTop
      })

      // Store for onRowsRendered callback in componentDidUpdate
      this._renderedStartIndex = start
      this._renderedStopIndex = stop

      for (let i = start; i <= stop; i++) {
        let datum = this._cellMetadata[i]
        let child = rowRenderer(i)
        child = React.cloneElement(
          child,
          {
            style: {
              ...child.props.style,
              position: 'absolute',
              top: datum.offset,
              width: '100%',
              height: this._getRowHeight(i)
            }
          }
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
        onWheel={this._onWheel}
        tabIndex={0}
        style={{
          ...styleSheet.VirtualScroll,
          ...functionalStyles.VirtualScroll,
          height: height
        }}
      >
        {rowsCount > 0 &&
          <div
            style={{
              ...functionalStyles.innerScrollContainer,
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

  _computeCellMetadata (props) {
    const { rowHeight, rowsCount } = props

    this._cellMetadata = initCellMetadata({
      cellCount: rowsCount,
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

  _stopEvent (event) {
    event.preventDefault()
    event.stopPropagation()
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
          cellCount: rowsCount,
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
          cellCount: rowsCount,
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
    const { height } = this.props
    const totalRowsHeight = this._getTotalRowsHeight()
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

/** Functional styles can't be overridden so they only need to be prefixed once. */
const functionalStyles = prefixStyleSheet({
  VirtualScroll: {
    position: 'relative',
    overflow: 'auto',
    outline: 0
  },
  innerScrollContainer: {
    boxSizing: 'border-box',
    overflowX: 'auto',
    overflowY: 'hidden'
  }
})

/** Default presentational styles for all <VirtualScroll> instances. */
VirtualScroll.defaultStyleSheet = {
  VirtualScroll: {
  }
}
