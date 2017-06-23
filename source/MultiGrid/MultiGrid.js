/** @flow */
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CellMeasurerCacheDecorator from './CellMeasurerCacheDecorator'
import Grid from '../Grid'

const SCROLLBAR_SIZE_BUFFER = 20

/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */
export default class MultiGrid extends PureComponent {
  static propTypes = {
    fixedColumnCount: PropTypes.number.isRequired,
    fixedColumnScrollInteraction: PropTypes.bool.isRequired,
    fixedRowCount: PropTypes.number.isRequired,
    fixedRowScrollInteraction: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    styleBottomLeftGrid: PropTypes.object.isRequired,
    styleBottomRightGrid: PropTypes.object.isRequired,
    styleTopLeftGrid: PropTypes.object.isRequired,
    styleTopRightGrid: PropTypes.object.isRequired
  };

  static defaultProps = {
    fixedColumnCount: 0,
    fixedColumnScrollInteraction: false,
    fixedRowCount: 0,
    fixedRowScrollInteraction: false,
    style: {},
    styleBottomLeftGrid: {},
    styleBottomRightGrid: {},
    styleTopLeftGrid: {},
    styleTopRightGrid: {}
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollLeft: 0,
      scrollTop: 0
    }

    this._deferredInvalidateColumnIndex = null
    this._deferredInvalidateRowIndex = null

    this._bottomLeftGridRef = this._bottomLeftGridRef.bind(this)
    this._bottomRightGridRef = this._bottomRightGridRef.bind(this)
    this._cellRendererBottomLeftGrid = this._cellRendererBottomLeftGrid.bind(this)
    this._cellRendererBottomRightGrid = this._cellRendererBottomRightGrid.bind(this)
    this._cellRendererTopRightGrid = this._cellRendererTopRightGrid.bind(this)
    this._columnWidthRightGrid = this._columnWidthRightGrid.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._onScrollLeft = this._onScrollLeft.bind(this)
    this._onScrollTop = this._onScrollTop.bind(this)
    this._rowHeightBottomGrid = this._rowHeightBottomGrid.bind(this)
    this._topLeftGridRef = this._topLeftGridRef.bind(this)
    this._topRightGridRef = this._topRightGridRef.bind(this)
  }

  forceUpdateGrids () {
    this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate()
    this._bottomRightGrid && this._bottomRightGrid.forceUpdate()
    this._topLeftGrid && this._topLeftGrid.forceUpdate()
    this._topRightGrid && this._topRightGrid.forceUpdate()
  }

  /** See Grid#invalidateCellSizeAfterRender */
  invalidateCellSizeAfterRender ({
    columnIndex = 0,
    rowIndex = 0
  } = {}) {
    this._deferredInvalidateColumnIndex = typeof this._deferredInvalidateColumnIndex === 'number'
      ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
      : columnIndex
    this._deferredInvalidateRowIndex = typeof this._deferredInvalidateRowIndex === 'number'
      ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
      : rowIndex
  }

  /** See Grid#measureAllCells */
  measureAllCells () {
    this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells()
    this._bottomRightGrid && this._bottomRightGrid.measureAllCells()
    this._topLeftGrid && this._topLeftGrid.measureAllCells()
    this._topRightGrid && this._topRightGrid.measureAllCells()
  }

  /** See Grid#recomputeGridSize */
  recomputeGridSize ({
    columnIndex = 0,
    rowIndex = 0
  } = {}) {
    const { fixedColumnCount, fixedRowCount } = this.props

    const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount)
    const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount)

    this._bottomLeftGrid && this._bottomLeftGrid.recomputeGridSize({
      columnIndex,
      rowIndex: adjustedRowIndex
    })
    this._bottomRightGrid && this._bottomRightGrid.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex: adjustedRowIndex
    })
    this._topLeftGrid && this._topLeftGrid.recomputeGridSize({
      columnIndex,
      rowIndex
    })
    this._topRightGrid && this._topRightGrid.recomputeGridSize({
      columnIndex: adjustedColumnIndex,
      rowIndex
    })

    this._leftGridWidth = null
    this._topGridHeight = null
    this._maybeCalculateCachedStyles(null, this.props, null, this.state)
  }

  componentDidMount () {
    const { scrollLeft, scrollTop } = this.props

    if (scrollLeft > 0 || scrollTop > 0) {
      const newState = {}

      if (scrollLeft > 0) {
        newState.scrollLeft = scrollLeft
      }

      if (scrollTop > 0) {
        newState.scrollTop = scrollTop
      }

      this.setState(newState)
    }
    this._handleInvalidatedGridSize()
  }

  componentDidUpdate (prevProps, prevState) {
    this._handleInvalidatedGridSize()
  }

  componentWillMount () {
    const { deferredMeasurementCache, fixedColumnCount, fixedRowCount } = this.props

    this._maybeCalculateCachedStyles(null, this.props, null, this.state)

    if (deferredMeasurementCache) {
      this._deferredMeasurementCacheBottomLeftGrid = fixedRowCount > 0
        ? new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: 0,
          rowIndexOffset: fixedRowCount
        })
        : deferredMeasurementCache

      this._deferredMeasurementCacheBottomRightGrid = fixedColumnCount > 0 || fixedRowCount > 0
        ? new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: fixedRowCount
        })
        : deferredMeasurementCache

      this._deferredMeasurementCacheTopRightGrid = fixedColumnCount > 0
        ? new CellMeasurerCacheDecorator({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: 0
        })
        : deferredMeasurementCache
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    const { columnWidth, fixedColumnCount, fixedRowCount, rowHeight } = this.props

    if (
      columnWidth !== nextProps.columnWidth ||
      fixedColumnCount !== nextProps.fixedColumnCount
    ) {
      this._leftGridWidth = null
    }

    if (
      fixedRowCount !== nextProps.fixedRowCount ||
      rowHeight !== nextProps.rowHeight
    ) {
      this._topGridHeight = null
    }

    if (
      nextProps.scrollLeft !== this.props.scrollLeft ||
      nextProps.scrollTop !== this.props.scrollTop
    ) {
      const newState = {}

      if (
        nextProps.scrollLeft != null &&
        nextProps.scrollLeft >= 0
      ) {
        newState.scrollLeft = nextProps.scrollLeft
      }

      if (
        nextProps.scrollTop != null &&
        nextProps.scrollTop >= 0
      ) {
        newState.scrollTop = nextProps.scrollTop
      }

      this.setState(newState)
    }

    this._maybeCalculateCachedStyles(this.props, nextProps, this.state, nextState)
  }

  render () {
    const {
      onScroll,
      onSectionRendered,
      scrollLeft: scrollLeftProp, // eslint-disable-line no-unused-vars
      scrollToColumn,
      scrollTop: scrollTopProp, // eslint-disable-line no-unused-vars
      scrollToRow,
      ...rest
    } = this.props

    // Don't render any of our Grids if there are no cells.
    // This mirrors what Grid does,
    // And prevents us from recording inaccurage measurements when used with CellMeasurer.
    if (this.props.width === 0 || this.props.height === 0) {
      return null
    }

    // scrollTop and scrollLeft props are explicitly filtered out and ignored

    const {
      scrollLeft,
      scrollTop
    } = this.state

    return (
      <div style={this._containerOuterStyle}>
        <div style={this._containerTopStyle}>
          {this._renderTopLeftGrid(rest)}
          {this._renderTopRightGrid({
            ...rest,
            onScroll,
            scrollLeft
          })}
        </div>
        <div style={this._containerBottomStyle}>
          {this._renderBottomLeftGrid({
            ...rest,
            onScroll,
            scrollTop
          })}
          {this._renderBottomRightGrid({
            ...rest,
            onScroll,
            onSectionRendered,
            scrollLeft,
            scrollToColumn,
            scrollToRow,
            scrollTop
          })}
        </div>
      </div>
    )
  }

  _bottomLeftGridRef (ref) {
    this._bottomLeftGrid = ref
  }

  _bottomRightGridRef (ref) {
    this._bottomRightGrid = ref
  }

  _cellRendererBottomLeftGrid ({ rowIndex, ...rest }) {
    const {
      cellRenderer,
      fixedRowCount,
      rowCount
    } = this.props

    if (rowIndex === rowCount - fixedRowCount) {
      return (
        <div
          key={rest.key}
          style={{
            ...rest.style,
            height: SCROLLBAR_SIZE_BUFFER
          }}
        />
      )
    } else {
      return cellRenderer({
        ...rest,
        parent: this,
        rowIndex: rowIndex + fixedRowCount
      })
    }
  }

  _cellRendererBottomRightGrid ({ columnIndex, rowIndex, ...rest }) {
    const { cellRenderer, fixedColumnCount, fixedRowCount } = this.props

    return cellRenderer({
      ...rest,
      columnIndex: columnIndex + fixedColumnCount,
      parent: this,
      rowIndex: rowIndex + fixedRowCount
    })
  }

  _cellRendererTopRightGrid ({ columnIndex, ...rest }) {
    const {
      cellRenderer,
      columnCount,
      fixedColumnCount
    } = this.props

    if (columnIndex === columnCount - fixedColumnCount) {
      return (
        <div
          key={rest.key}
          style={{
            ...rest.style,
            width: SCROLLBAR_SIZE_BUFFER
          }}
        />
      )
    } else {
      return cellRenderer({
        ...rest,
        columnIndex: columnIndex + fixedColumnCount,
        parent: this
      })
    }
  }

  _columnWidthRightGrid ({ index }) {
    const { columnCount, fixedColumnCount, columnWidth } = this.props

    // An extra cell is added to the count
    // This gives the smaller Grid extra room for offset,
    // In case the main (bottom right) Grid has a scrollbar
    // If no scrollbar, the extra space is overflow:hidden anyway
    if (index === columnCount - fixedColumnCount) {
      return SCROLLBAR_SIZE_BUFFER
    }

    return typeof columnWidth === 'function'
      ? columnWidth({ index: index + fixedColumnCount })
      : columnWidth
  }

  _getBottomGridHeight (props) {
    const { height } = props

    let topGridHeight = this._getTopGridHeight(props)

    return height - topGridHeight
  }

  _getLeftGridWidth (props) {
    const { fixedColumnCount, columnWidth } = props

    if (this._leftGridWidth == null) {
      if (typeof columnWidth === 'function') {
        let leftGridWidth = 0

        for (let index = 0; index < fixedColumnCount; index++) {
          leftGridWidth += columnWidth({ index })
        }

        this._leftGridWidth = leftGridWidth
      } else {
        this._leftGridWidth = columnWidth * fixedColumnCount
      }
    }

    return this._leftGridWidth
  }

  _getRightGridWidth (props) {
    const { width } = props

    let leftGridWidth = this._getLeftGridWidth(props)

    return width - leftGridWidth
  }

  _getTopGridHeight (props) {
    const { fixedRowCount, rowHeight } = props

    if (this._topGridHeight == null) {
      if (typeof rowHeight === 'function') {
        let topGridHeight = 0

        for (let index = 0; index < fixedRowCount; index++) {
          topGridHeight += rowHeight({ index })
        }

        this._topGridHeight = topGridHeight
      } else {
        this._topGridHeight = rowHeight * fixedRowCount
      }
    }

    return this._topGridHeight
  }

  _handleInvalidatedGridSize () {
    if (typeof this._deferredInvalidateColumnIndex === 'number') {
      const columnIndex = this._deferredInvalidateColumnIndex
      const rowIndex = this._deferredInvalidateRowIndex

      this._deferredInvalidateColumnIndex = null
      this._deferredInvalidateRowIndex = null

      this.recomputeGridSize({
        columnIndex,
        rowIndex
      })
      this.forceUpdate()
    }
  }

  /**
   * Avoid recreating inline styles each render; this bypasses Grid's shallowCompare.
   * This method recalculates styles only when specific props change.
   */
  _maybeCalculateCachedStyles (prevProps, props, prevState, state) {
    const {
      columnWidth,
      height,
      fixedColumnCount,
      fixedColumnScrollInteraction,
      fixedRowCount,
      fixedRowScrollInteraction,
      rowHeight,
      style,
      styleBottomLeftGrid,
      styleBottomRightGrid,
      styleTopLeftGrid,
      styleTopRightGrid,
      width
    } = props

    const firstRender = !prevProps
    const sizeChange = (
      firstRender ||
      height !== prevProps.height ||
      width !== prevProps.width
    )
    const leftSizeChange = (
      firstRender ||
      columnWidth !== prevProps.columnWidth ||
      fixedColumnCount !== prevProps.fixedColumnCount
    )
    const topSizeChange = (
      firstRender ||
      fixedRowCount !== prevProps.fixedRowCount ||
      rowHeight !== prevProps.rowHeight
    )

    if (
      firstRender ||
      sizeChange ||
      style !== prevProps.style
    ) {
      this._containerOuterStyle = {
        height,
        overflow: 'visible', // Let :focus outline show through
        width,
        ...style
      }
    }

    if (
      firstRender ||
      sizeChange ||
      topSizeChange
    ) {
      this._containerTopStyle = {
        height: this._getTopGridHeight(props),
        position: 'relative',
        width
      }

      this._containerBottomStyle = {
        height: height - this._getTopGridHeight(props),
        overflow: 'visible', // Let :focus outline show through
        position: 'relative',
        width
      }
    }

    if (
      firstRender ||
      styleBottomLeftGrid !== prevProps.styleBottomLeftGrid
    ) {
      this._bottomLeftGridStyle = {
        left: 0,
        overflowX: 'hidden',
        overflowY: fixedColumnScrollInteraction ? 'auto' : 'hidden',
        position: 'absolute',
        ...styleBottomLeftGrid
      }
    }

    if (
      firstRender ||
      leftSizeChange ||
      styleBottomRightGrid !== prevProps.styleBottomRightGrid
    ) {
      this._bottomRightGridStyle = {
        left: this._getLeftGridWidth(props),
        position: 'absolute',
        ...styleBottomRightGrid
      }
    }

    if (
      firstRender ||
      styleTopLeftGrid !== prevProps.styleTopLeftGrid
    ) {
      this._topLeftGridStyle = {
        left: 0,
        overflowX: 'hidden',
        overflowY: 'hidden',
        position: 'absolute',
        top: 0,
        ...styleTopLeftGrid
      }
    }

    if (
      firstRender ||
      leftSizeChange ||
      styleTopRightGrid !== prevProps.styleTopRightGrid
    ) {
      this._topRightGridStyle = {
        left: this._getLeftGridWidth(props),
        overflowX: fixedRowScrollInteraction ? 'auto' : 'hidden',
        overflowY: 'hidden',
        position: 'absolute',
        top: 0,
        ...styleTopRightGrid
      }
    }
  }

  _onScroll (scrollInfo) {
    const {scrollLeft, scrollTop} = scrollInfo
    this.setState({
      scrollLeft,
      scrollTop
    })
    const onScroll = this.props.onScroll
    if (onScroll) {
      onScroll(scrollInfo)
    }
  }

  _onScrollLeft (scrollInfo) {
    const {scrollLeft} = scrollInfo
    this._onScroll({
      scrollLeft,
      scrollTop: this.state.scrollTop
    })
  }

  _onScrollTop (scrollInfo) {
    const {scrollTop} = scrollInfo
    this._onScroll({
      scrollTop,
      scrollLeft: this.state.scrollLeft
    })
  }

  _renderBottomLeftGrid (props) {
    const {
      fixedColumnCount,
      fixedColumnScrollInteraction,
      fixedRowCount,
      rowCount,
      scrollTop
    } = props

    if (!fixedColumnCount) {
      return null
    }

    return (
      <Grid
        {...props}
        cellRenderer={this._cellRendererBottomLeftGrid}
        columnCount={fixedColumnCount}
        deferredMeasurementCache={this._deferredMeasurementCacheBottomLeftGrid}
        height={this._getBottomGridHeight(props)}
        onScroll={fixedColumnScrollInteraction ? this._onScrollTop : undefined}
        ref={this._bottomLeftGridRef}
        rowCount={Math.max(0, rowCount - fixedRowCount) + 1/* See _rowHeightBottomGrid */}
        rowHeight={this._rowHeightBottomGrid}
        scrollTop={scrollTop}
        style={this._bottomLeftGridStyle}
        tabIndex={null}
        width={this._getLeftGridWidth(props)}
      />
    )
  }

  _renderBottomRightGrid (props) {
    const {
      columnCount,
      fixedColumnCount,
      fixedRowCount,
      rowCount,
      scrollToColumn,
      scrollToRow
    } = props

    return (
      <Grid
        {...props}
        cellRenderer={this._cellRendererBottomRightGrid}
        columnCount={Math.max(0, columnCount - fixedColumnCount)}
        columnWidth={this._columnWidthRightGrid}
        deferredMeasurementCache={this._deferredMeasurementCacheBottomRightGrid}
        height={this._getBottomGridHeight(props)}
        onScroll={this._onScroll}
        ref={this._bottomRightGridRef}
        rowCount={Math.max(0, rowCount - fixedRowCount)}
        rowHeight={this._rowHeightBottomGrid}
        scrollToColumn={scrollToColumn - fixedColumnCount}
        scrollToRow={scrollToRow - fixedRowCount}
        style={this._bottomRightGridStyle}
        width={this._getRightGridWidth(props)}
      />
    )
  }

  _renderTopLeftGrid (props) {
    const {
      fixedColumnCount,
      fixedRowCount
    } = props

    if (!fixedColumnCount || !fixedRowCount) {
      return null
    }

    return (
      <Grid
        {...props}
        columnCount={fixedColumnCount}
        height={this._getTopGridHeight(props)}
        ref={this._topLeftGridRef}
        rowCount={fixedRowCount}
        style={this._topLeftGridStyle}
        tabIndex={null}
        width={this._getLeftGridWidth(props)}
      />
    )
  }

  _renderTopRightGrid (props) {
    const {
      columnCount,
      fixedColumnCount,
      fixedRowCount,
      fixedRowScrollInteraction,
      scrollLeft
    } = props

    if (!fixedRowCount) {
      return null
    }

    return (
      <Grid
        {...props}
        cellRenderer={this._cellRendererTopRightGrid}
        columnCount={Math.max(0, columnCount - fixedColumnCount) + 1/* See _columnWidthRightGrid */}
        columnWidth={this._columnWidthRightGrid}
        deferredMeasurementCache={this._deferredMeasurementCacheTopRightGrid}
        height={this._getTopGridHeight(props)}
        onScroll={fixedRowScrollInteraction ? this._onScrollLeft : undefined}
        ref={this._topRightGridRef}
        rowCount={fixedRowCount}
        scrollLeft={scrollLeft}
        style={this._topRightGridStyle}
        tabIndex={null}
        width={this._getRightGridWidth(props)}
      />
    )
  }

  _rowHeightBottomGrid ({ index }) {
    const { fixedRowCount, rowCount, rowHeight } = this.props

    // An extra cell is added to the count
    // This gives the smaller Grid extra room for offset,
    // In case the main (bottom right) Grid has a scrollbar
    // If no scrollbar, the extra space is overflow:hidden anyway
    if (index === rowCount - fixedRowCount) {
      return SCROLLBAR_SIZE_BUFFER
    }

    return typeof rowHeight === 'function'
      ? rowHeight({ index: index + fixedRowCount })
      : rowHeight
  }

  _topLeftGridRef (ref) {
    this._topLeftGrid = ref
  }

  _topRightGridRef (ref) {
    this._topRightGrid = ref
  }
}
