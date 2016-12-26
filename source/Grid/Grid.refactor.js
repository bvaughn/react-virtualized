import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { findDOMNode } from 'react-dom'

// When a user scrolls slower than this we should smooth scroll.
// When scrolling is faster, it's okay to adjust/reconsider our visible cells.
const MAX_PIXEL_THRESHOLD = 5000
const PIXELS_PER_SECOND_THRESHOLD = 50

// If this interval (ms) passes without a scroll event,
// Scrolling can be considered completed.
// This may trigger an additional render pass as well as an offset adjustment.
const ON_SCROLL_DEBOUNCE_INTERVAL = 150

// TODO Decide on controlled/uncontrolled scroll positions
//      How does this impact ScrollSync or pure functional usage?
//      Should I support a semi-backwards compatible passiveScrollTop property?
//      Or should scrollTop always be purely controlled/uncontrolled
//      If so this could be used to auto-disable overflow scrolling

type PropTypes = {
  cellRenderer: Function,
  columnCount: number,
  columnWidth: number | Function,
  estimatedColumnWidth?: number,
  estimatedRowHeight?: number,
  height: number,
  rowCount: number,
  rowHeight: number | Function,
  style?: Object,
  width: number
};

export default class Grid extends Component {
  prop: PropTypes;

  static defaultProps = {
    estimatedColumnWidth: 100,
    estimatedRowHeight: 30
  };

  constructor (props, context) {
    super(props, context)

    this.state = {}

    // Cache estimated sizes for faster access.
    this._defaultColumnWidth = typeof props.columnWidth === 'number' ? props.columnWidth : props.estimatedColumnWidth
    this._defaultRowHeight = typeof props.rowHeight === 'number' ? props.rowHeight : props.estimatedRowHeight
    this._estimatedTotalWidth = props.columnCount * props.estimatedColumnWidth
    this._estimatedTotalHeight = props.rowCount * props.estimatedRowHeight

    // Cache measured sizes for reuse; (measuring is expensive)
    // Cache is reset when props change or when cleared via API.
    // Offsets are not cached because they are too easily bulk-invalidated,
    // eg a change in a cell's size invalidates the offset of all cells after.
    // Instead we store an anchor and position nearby cells relative to it.
    this._cachedColumnWidths = {}
    this._cachedRowHeights = {}

    // Set/reset as the result of large scrolls.
    this._anchoredColumnStartIndex = 0
    this._anchoredColumnStartPosition = 0
    this._anchoredColumnStopIndex = 0
    this._anchoredRowStartIndex = 0
    this._anchoredRowStopIndex = 0
    this._anchoredRowStartPosition = 0
    this._lastScrollLeft = 0
    this._lastScrollTime = 0
    this._lastScrollTop = 0

    // Changes in scroll position will already trigger a re-render.
    // Store this outside of state to avoid additional renders.
    this._isScrolling = false

    // Recalculate scrollbar size once we've mounted; assume 0 for initial render
    this._scrollbarSize = 0
    this._scrollbarSizeMeasured = false

    this._calculateGridStyle(props)
    this._calculateVisibleCells(0, 0, props)

    this._onScroll = this._onScroll.bind(this)
    this._onScrollDebounce = this._onScrollDebounce.bind(this)
    this._scrollTargetRef = this._scrollTargetRef.bind(this)
  }

  componentDidMount () {
    // If this component was first rendered server-side, scrollbar size will be undefined.
    // In that event we need to remeasure.
    if (!this._scrollbarSizeMeasured) {
      this._scrollbarSize = getScrollbarSize()
      this._scrollbarSizeMeasured = true
      this.forceUpdate()
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    const {
      columnCount,
      columnWidth,
      estimatedColumnWidth,
      estimatedRowHeight,
      height,
      rowCount,
      rowHeight,
      style,
      width
    } = this.props

    const columnWidthHasChanged = (
      (
        typeof columnWidth === 'number' ||
        typeof nextProps.columnWidth === 'number'
      ) &&
      columnWidth !== nextProps.columnWidth
    )
    const rowHeightHasChanged = (
      (
        typeof rowHeight === 'number' ||
        typeof nextProps.rowHeight === 'number'
      ) &&
      rowHeight !== nextProps.rowHeight
    )

    let recalculateVisibleCells = false

    if (
      columnCount !== nextProps.columnCount ||
      estimatedColumnWidth !== nextProps.estimatedColumnWidth ||
      columnWidthHasChanged
    ) {
      const defaultColumnWidth = typeof nextProps.columnWidth === 'number'
        ? nextProps.columnWidth
        : nextProps.estimatedColumnWidth

      this._defaultColumnWidth = defaultColumnWidth
      this._estimatedTotalWidth = nextProps.columnCount * defaultColumnWidth

      if (columnWidthHasChanged) {
        this._cachedColumnWidths = {}
      }

      recalculateVisibleCells = true
    }

    if (
      rowCount !== nextProps.rowCount ||
      estimatedRowHeight !== nextProps.estimatedRowHeight ||
      rowHeightHasChanged
    ) {
      const defaultRowHeight = typeof nextProps.rowHeight === 'number'
        ? nextProps.rowHeight
        : nextProps.estimatedRowHeight

      this._defaultRowHeight = defaultRowHeight
      this._estimatedTotalHeight = nextProps.rowCount * nextProps.estimatedRowHeight

      if (rowHeightHasChanged) {
        this._cachedRowHeights = {}
      }

      recalculateVisibleCells = true
    }

    // TODO Certain types of resizing may require resetting anchored indices.
    //      eg Since offset is estimated based on offset within total size,
    //      and resizing may impact total size (eg think of List case with text rows).

    if (
      recalculateVisibleCells ||
      height !== nextProps.height ||
      width !== nextProps.width
    ) {
      this._calculateVisibleCells(this._lastScrollLeft, this._lastScrollTop, nextProps)
    }

    // TODO Is this really worth doing to avoid a single style?
    if (
      height !== nextProps.height ||
      width !== nextProps.width ||
      recalculateVisibleCells ||
      style !== nextProps.style
    ) {
      this._calculateGridStyle(nextProps)
    }
  }

  render () {
    const {
      cellRenderer
    } = this.props

    // TODO Cache cell renderers and style objects
    // TODO Support isVisible prop
    // TODO Move to cellRangeRenderer
    const rendereredCells = []

    // Local variables are faster access than instance properties.
    // Extract variables that are referred to multiple times in loops below.
    // Render is particularly performance sensitive.
    const anchoredColumnStartIndex = this._anchoredColumnStartIndex
    const anchoredColumnStartPosition = this._anchoredColumnStartPosition
    const anchoredColumnStopIndex = this._anchoredColumnStopIndex
    const anchoredRowStartIndex = this._anchoredRowStartIndex
    const anchoredRowStartPosition = this._anchoredRowStartPosition
    const anchoredRowStopIndex = this._anchoredRowStopIndex
    const cachedColumnWidths = this._cachedColumnWidths
    const cachedRowHeights = this._cachedRowHeights
    const isScrolling = this._isScrolling

    let rowOffset = anchoredRowStartPosition

    for (let rowIndex = anchoredRowStartIndex; rowIndex <= anchoredRowStopIndex; rowIndex++) {
      let rowSize = cachedRowHeights[rowIndex]
      let columnOffset = anchoredColumnStartPosition

      for (let columnIndex = anchoredColumnStartIndex; columnIndex <= anchoredColumnStopIndex; columnIndex++) {
        let columnSize = cachedColumnWidths[columnIndex]
        let key = `${rowIndex}-${columnIndex}`

        // TODO Cache cell styles
        let style = {
          height: rowSize,
          left: columnOffset,
          position: 'absolute',
          top: rowOffset,
          width: columnSize
        }

        rendereredCells.push(
          cellRenderer({
            columnIndex,
            isScrolling,
            key,
            rowIndex,
            style
          })
        )

        columnOffset += columnSize
      }

      rowOffset += rowSize
    }

    return (
      <div
        ref={this._scrollTargetRef}
        onScroll={this._onScroll}
        role='grid'
        style={this._outerStyle}
      >
        <div style={this._innerStyle}>
          {rendereredCells}
        </div>
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _calculateGridStyle (props = this.props) {
    const {
      containerStyle,
      height,
      style,
      width
    } = props

    const estimatedTotalWidth = this._estimatedTotalWidth
    const estimatedTotalHeight = this._estimatedTotalHeight
    const isScrolling = this._isScrolling

    const outerStyle = {
      boxSizing: 'border-box',
      direction: 'ltr',
      height,
      position: 'relative',
      width,
      WebkitOverflowScrolling: 'touch',
      willChange: 'transform',
      ...style
    }

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize = estimatedTotalHeight > height ? this._scrollbarSize : 0
    const horizontalScrollBarSize = estimatedTotalWidth > width ? this._scrollbarSize : 0

    // Also explicitly init styles to 'auto' if scrollbars are required.
    // This works around an obscure edge case where external CSS styles have not yet been loaded,
    // But an initial scroll index of offset is set as an external prop.
    // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
    // This was originally reported via clauderic/react-infinite-calendar/issues/23
    outerStyle.overflowX = estimatedTotalWidth + verticalScrollBarSize <= width
      ? 'hidden'
      : 'auto'
    outerStyle.overflowY = estimatedTotalHeight + horizontalScrollBarSize <= height
      ? 'hidden'
      : 'auto'

    const innerStyle = {
      width: estimatedTotalWidth,
      height: estimatedTotalHeight,
      maxWidth: estimatedTotalWidth,
      maxHeight: estimatedTotalHeight,
      overflow: 'hidden',
      pointerEvents: isScrolling ? 'none' : '',
      ...containerStyle
    }

    this._innerStyle = innerStyle
    this._outerStyle = outerStyle
  }

  /**
   * This method is the core of the windowing logic.
   * Big scroll deltas will guess a range of visible cells based on the new scroll offsets.
   * To make this guess, estimated cell sizes are used.
   * This allows us to avoid actually measuring cells (which may be expensive).
   * Subsequent small scroll deltas will prepend/append cells to those previous guessed.
   * This means that after any given scroll event, only a small number of cells will be measured.
   */
  _calculateVisibleCells (
    scrollLeft: number,
    scrollTop: number,
    props: PropTypes = this.props
  ) {
    const {
      columnCount,
      columnWidth,
      height,
      rowCount,
      rowHeight,
      width
    } = props

    // Local variables are faster access than instance properties.
    // Extract variables that are referred to multiple times in loops below.
    // Scroll handler is particularly performance sensitive.
    const cachedColumnWidths = this._cachedColumnWidths
    const cachedRowHeights = this._cachedRowHeights
    const isScrollingRight = scrollLeft > this._lastScrollLeft
    const isScrollingDown = scrollTop > this._lastScrollTop

    let anchoredColumnStartIndex = this._anchoredColumnStartIndex
    let anchoredColumnStartPosition = this._anchoredColumnStartPosition
    let anchoredRowStartIndex = this._anchoredRowStartIndex
    let anchoredRowStartPosition = this._anchoredRowStartPosition
    let renderNeeded = false

    const scrollTime = Date.now()
    const timeDelta = scrollTime - this._lastScrollTime
    const deltaX = Math.abs(scrollLeft - this._lastScrollLeft)
    const deltaY = Math.abs(scrollTop - this._lastScrollTop)

    // Reset anchor cells if scroll delta exceeds threshold.
    // Otherwise re-evaluate anchor and update if necessary.
    // The code below is a bit repetitive for performance reasons.
    if (
      deltaX > MAX_PIXEL_THRESHOLD ||
      deltaX / timeDelta > PIXELS_PER_SECOND_THRESHOLD
    ) {
      anchoredColumnStartIndex = getIndexForOffset(scrollLeft, width, this._estimatedTotalWidth, columnCount)
      anchoredColumnStartPosition = scrollLeft
    } else {
      let columnSize = this._measureAndCacheColumnWidth(anchoredColumnStartIndex, columnWidth, cachedColumnWidths)

      if (isScrollingRight) {
        while (anchoredColumnStartIndex < columnCount) {
          if (anchoredColumnStartPosition + columnSize > scrollLeft) {
            break
          }

          anchoredColumnStartIndex++
          anchoredColumnStartPosition += columnSize
          columnSize = this._measureAndCacheColumnWidth(anchoredColumnStartIndex, columnWidth, cachedColumnWidths)
        }
      } else {
        while (anchoredColumnStartIndex > 0) {
          // TODO Account for overscan
          if (anchoredColumnStartPosition <= scrollLeft) {
            break
          }

          anchoredColumnStartIndex--
          columnSize = this._measureAndCacheColumnWidth(anchoredColumnStartIndex, columnWidth, cachedColumnWidths)
          anchoredColumnStartPosition -= columnSize
        }
      }
    }

    if (
      deltaY > MAX_PIXEL_THRESHOLD ||
      deltaY / timeDelta > PIXELS_PER_SECOND_THRESHOLD
    ) {
      anchoredRowStartIndex = getIndexForOffset(scrollTop, height, this._estimatedTotalHeight, rowCount)
      anchoredRowStartPosition = scrollTop
    } else {
      let rowSize = this._measureAndCacheRowHeight(anchoredRowStartIndex, rowHeight, cachedRowHeights)

      if (isScrollingDown) {
        while (anchoredRowStartIndex < rowCount) {
          if (anchoredRowStartPosition + rowSize > scrollTop) {
            break
          }

          anchoredRowStartIndex++
          anchoredRowStartPosition += rowSize
          rowSize = this._measureAndCacheRowHeight(anchoredRowStartIndex, rowHeight, cachedRowHeights)
        }
      } else {
        while (anchoredRowStartIndex > 0) {
          // TODO Account for overscan
          if (anchoredRowStartPosition <= scrollTop) {
            break
          }

          anchoredRowStartIndex--
          rowSize = this._measureAndCacheRowHeight(anchoredRowStartIndex, rowHeight, cachedRowHeights)
          anchoredRowStartPosition -= rowSize
        }
      }
    }

    // Recalculate visible cells only when anchors change.

    if (
      anchoredColumnStartIndex !== this._anchoredColumnStartIndex ||
      width !== this._lastWidth
    ) {
      const rightBoundary = scrollLeft + width

      let anchoredColumnStopIndex = anchoredColumnStartIndex
      let anchoredColumnStopPosition = anchoredColumnStartPosition

      while (anchoredColumnStopIndex < columnCount) {
        let columnSize = this._measureAndCacheColumnWidth(anchoredColumnStopIndex, columnWidth, cachedColumnWidths)

        // TODO Account for overscan (if scrolling right)

        // TODO Technically this will result in us render 1 too many columns
        if (anchoredColumnStopPosition + columnSize > rightBoundary) {
          break
        }

        anchoredColumnStopIndex++
        anchoredColumnStopPosition += columnSize
      }

      this._anchoredColumnStartIndex = anchoredColumnStartIndex
      this._anchoredColumnStopIndex = anchoredColumnStopIndex
      this._anchoredColumnStartPosition = anchoredColumnStartPosition

      renderNeeded = true
    }

    if (
      anchoredRowStartIndex !== this._anchoredRowStartIndex ||
      height !== this._lastHeight
    ) {
      const bottomBoundary = scrollTop + height

      let anchoredRowStopIndex = anchoredRowStartIndex
      let anchoredRowStopPosition = anchoredRowStartPosition

      while (anchoredRowStopIndex < rowCount) {
        let rowSize = this._measureAndCacheRowHeight(anchoredRowStopIndex, rowHeight, cachedRowHeights)

        // TODO Account for overscan (if scrolling down)

        // TODO Technically this will result in us render 1 too many rows
        if (anchoredRowStopPosition + rowSize > bottomBoundary) {
          break
        }

        anchoredRowStopIndex++
        anchoredRowStopPosition += rowSize
      }

      this._anchoredRowStartIndex = anchoredRowStartIndex
      this._anchoredRowStopIndex = anchoredRowStopIndex
      this._anchoredRowStartPosition = anchoredRowStartPosition

      renderNeeded = true

      // TODO Perhaps reset style cache here for rows/cols that have been bumped out?
      //      Or would this be too slow / result in too many writes?
    }

    // Store most recent scroll positions for tracking direction and delta between scrolls.
    this._lastHeight = height
    this._lastScrollLeft = scrollLeft
    this._lastScrollTime = scrollTime
    this._lastScrollTop = scrollTop
    this._lastWidth = width

    return renderNeeded
  }

  _measureAndCacheColumnWidth (
    index: number,
    columnWidth: number | Function,
    cachedColumnWidths: Object
  ): number {
    if (cachedColumnWidths.hasOwnProperty(index)) {
      return cachedColumnWidths[index]
    }

    const columnSize = columnWidth instanceof Function
      ? columnWidth({ index })
      : columnWidth

    cachedColumnWidths[index] = columnSize

    return columnSize
  }

  _measureAndCacheRowHeight (
    index: number,
    rowHeight: number | Function,
    cachedRowHeights: Object
  ): number {
    if (cachedRowHeights.hasOwnProperty(index)) {
      return cachedRowHeights[index]
    }

    const rowSize = rowHeight instanceof Function
      ? rowHeight({ index })
      : rowHeight

    cachedRowHeights[index] = rowSize

    return rowSize
  }

  _scrollTargetRef (scrollTarget) {
    this._scrollTarget = scrollTarget
  }

  _onScroll (event) {
    if (this._ignoreNextOnScroll) {
      this._ignoreNextOnScroll = false
      return
    }

    const target = event.target

    // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
    // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
    // See issue #404 for more information.
    if (target !== this._scrollTarget) {
      return
    }

    const {
      scrollLeft,
      scrollTop
    } = target

    this._isScrolling = true

    if (this._calculateVisibleCells(scrollLeft, scrollTop)) {
      this.forceUpdate()
    }

    if (this._onScrollDebounceTimeout) {
      clearTimeout(this._onScrollDebounceTimeout)
    }

    // Once scrolling stops, re-adjust scrollLeft/scrollTop for the rows remaining visible.
    // This helps things from getting too far off track if a user slow-scrolls for a long time.
    this._onScrollDebounceTimeout = setTimeout(this._onScrollDebounce, ON_SCROLL_DEBOUNCE_INTERVAL)
  }

  /**
   * If the user slow-scrolls for a long time the estimated positions may become less accurate.
   * When the user stops scrolling, this method re-adjust offsets if necessary.
   * Doing so reduce the chance of a user scrolling to the edge of a grid and things being misaligned.
   */
  _onScrollDebounce () {
    const {
      columnCount,
      height,
      rowCount,
      width
    } = this.props

    this._isScrolling = false

    // TODO Do we need to guard against overscroll edge-cases here?
    //      Or will the TODO in getIndexForOffset() protect us from that case?

    const scrollLeft = getOffsetForIndex(this._anchoredColumnStartIndex, width, this._estimatedTotalWidth, columnCount)
    const scrollTop = getOffsetForIndex(this._anchoredRowStartIndex, height, this._estimatedTotalHeight, rowCount)

    this._anchoredColumnStartPosition -= this._lastScrollLeft - scrollLeft
    this._anchoredRowStartPosition -= this._lastScrollTop - scrollTop

    // Don't trigger an onScroll cycle.
    this._ignoreNextOnScroll = true

    const scrollTarget = findDOMNode(this._scrollTarget)
    scrollTarget.scrollLeft = scrollLeft
    scrollTarget.scrollTop = scrollTop

    this.forceUpdate()
  }
}

export function getIndexForOffset (
  scrollOffset: number,
  portalSize: number,
  totalSize: number,
  cellCount: number
): number {
  // TODO Do we need to be more precise near boundaries?
  //      Set a threshold beyond which we won't estimate this way.
  //      Otherwise we run the risk of users slow-scrolling to misaligned outer edges.
  return Math.floor(scrollOffset / (totalSize - portalSize) * cellCount)
}

export function getOffsetForIndex (
  index: number,
  portalSize: number,
  totalSize: number,
  cellCount: number
): number {
  return Math.floor(index / cellCount * (totalSize - portalSize))
}
