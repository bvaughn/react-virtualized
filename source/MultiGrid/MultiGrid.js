/** @flow */
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Grid from '../Grid'

// TODO: Handle misplaced horizontal scrollbar for bottom/right grid
// TODO: Handle :scrollLeft prop conflict with onScroll :scrollLeft param

/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */
export default class MultiGrid extends Component {
  static propTypes = {
    fixedColumnCount: PropTypes.number.isRequired,
    fixedRowCount: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    styleBottomLeftGrid: PropTypes.object.isRequired,
    styleBottomRightGrid: PropTypes.object.isRequired,
    styleTopLeftGrid: PropTypes.object.isRequired,
    styleTopRightGrid: PropTypes.object.isRequired
  };

  static defaultProps = {
    fixedColumnCount: 0,
    fixedRowCount: 0,
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

    this._cellRendererBottomLeftGrid = this._cellRendererBottomLeftGrid.bind(this)
    this._cellRendererBottomRightGrid = this._cellRendererBottomRightGrid.bind(this)
    this._cellRendererTopRightGrid = this._cellRendererTopRightGrid.bind(this)
    this._columnWidthRightGrid = this._columnWidthRightGrid.bind(this)
    this._onScrollHorizontal = this._onScrollHorizontal.bind(this)
    this._onScrollVertical = this._onScrollVertical.bind(this)
    this._rowHeightBottomGrid = this._rowHeightBottomGrid.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
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
  }

  render () {
    const {
      height,
      onScroll,
      onSectionRendered,
      scrollLeft: scrollLeftProp,
      scrollToColumn,
      style,
      width,
      ...rest
    } = this.props

    // scrollTop and scrollToRow props are explicitly filtered out and ignored

    const {
      scrollLeft,
      scrollTop
    } = this.state

    return (
      <div
        style={{
          height,
          width,
          ...style
        }}
      >
        <div
          style={{
            height: this._getTopGridHeight(),
            position: 'relative',
            width
          }}
        >
          {this._renderTopLeftGrid(rest)}
          {this._renderTopRightGrid({
            ...rest,
            scrollLeft
          })}
        </div>
        <div
          onScroll={this._onScrollVertical}
          ref={(ref) => {
            this._scrollingContainer = ref
          }}
          style={{
            height: height - this._getTopGridHeight(),
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            width
          }}
        >
          {this._renderBottomLeftGrid({
            ...rest,
            scrollTop
          })}
          {this._renderBottomRightGrid({
            ...rest,
            onScroll,
            onSectionRendered,
            scrollLeft: scrollLeftProp,
            scrollToColumn,
            scrollTop
          })}
        </div>
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRendererBottomLeftGrid ({ rowIndex, ...rest }) {
    const { cellRenderer, fixedRowCount } = this.props

    return cellRenderer({
      ...rest,
      rowIndex: rowIndex + fixedRowCount
    })
  }

  _cellRendererBottomRightGrid ({ columnIndex, rowIndex, ...rest }) {
    const { cellRenderer, fixedColumnCount, fixedRowCount } = this.props

    return cellRenderer({
      ...rest,
      columnIndex: columnIndex + fixedColumnCount,
      rowIndex: rowIndex + fixedRowCount
    })
  }

  _cellRendererTopRightGrid ({ columnIndex, ...rest }) {
    const { cellRenderer, fixedColumnCount } = this.props

    return cellRenderer({
      ...rest,
      columnIndex: columnIndex + fixedColumnCount
    })
  }

  _columnWidthRightGrid (index) {
    const { fixedColumnCount, columnWidth } = this.props

    return columnWidth instanceof Function
      ? columnWidth({index: index.index + fixedColumnCount})
      : columnWidth
  }

  _getBottomGridHeight () {
    const { height } = this.props

    let topGridHeight = this._getTopGridHeight()

    return height - topGridHeight
  }

  _getLeftGridWidth () {
    const { fixedColumnCount, columnWidth } = this.props

    if (this._leftGridWidth == null) {
      if (columnWidth instanceof Function) {
        let leftGridWidth = 0

        for (let index = 0; index < fixedColumnCount; index++) {
          leftGridWidth += columnWidth({index: index})
        }

        this._leftGridWidth = leftGridWidth
      } else {
        this._leftGridWidth = columnWidth * fixedColumnCount
      }
    }

    return this._leftGridWidth
  }

  _getRightGridWidth () {
    const { width } = this.props

    let leftGridWidth = this._getLeftGridWidth()

    return width - leftGridWidth
  }

  _getTopGridHeight () {
    const { fixedRowCount, rowHeight } = this.props

    if (this._topGridHeight == null) {
      if (rowHeight instanceof Function) {
        let topGridHeight = 0

        for (let index = 0; index < fixedRowCount; index++) {
          topGridHeight += rowHeight(index)
        }

        this._topGridHeight = topGridHeight
      } else {
        this._topGridHeight = rowHeight * fixedRowCount
      }
    }

    return this._topGridHeight
  }

  _onScrollHorizontal ({ scrollLeft }) {
    this.setState({
      scrollLeft
    })
  }

  _onScrollVertical (event) {
    if (event.target !== this._scrollingContainer) {
      return
    }

    this.setState({
      scrollTop: event.target.scrollTop
    })
  }

  _renderBottomLeftGrid (props) {
    const {
      fixedColumnCount,
      fixedRowCount,
      rowCount,
      scrollTop,
      styleBottomLeftGrid
    } = props

    if (!fixedColumnCount) {
      return null
    }

    return (
      <Grid
        {...props}
        autoHeight
        cellRenderer={this._cellRendererBottomLeftGrid}
        columnCount={fixedColumnCount}
        height={this._getBottomGridHeight()}
        rowCount={rowCount - fixedRowCount}
        rowHeight={this._rowHeightBottomGrid}
        scrollTop={scrollTop}
        style={{
          height: 'auto',
          left: 0,
          outline: 0,
          overflow: 'hidden',
          position: 'absolute',
          ...styleBottomLeftGrid
        }}
        width={this._getLeftGridWidth()}
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
      scrollTop,
      styleBottomRightGrid
    } = props

    return (
      <Grid
        {...props}
        autoHeight
        cellRenderer={this._cellRendererBottomRightGrid}
        columnCount={columnCount - fixedColumnCount}
        columnWidth={this._columnWidthRightGrid}
        height={this._getBottomGridHeight()}
        onScroll={this._onScrollHorizontal}
        rowCount={rowCount - fixedRowCount}
        rowHeight={this._rowHeightBottomGrid}
        scrollToColumn={scrollToColumn - fixedColumnCount}
        scrollTop={scrollTop}
        style={{
          height: 'auto',
          left: this._getLeftGridWidth(),
          outline: 0,
          position: 'absolute',
          ...styleBottomRightGrid
        }}
        width={this._getRightGridWidth()}
      />
    )
  }

  _renderTopLeftGrid (props) {
    const {
      fixedColumnCount,
      fixedRowCount,
      styleTopLeftGrid
    } = props

    if (!fixedColumnCount || !fixedRowCount) {
      return null
    }

    return (
      <Grid
        {...props}
        columnCount={fixedColumnCount}
        height={this._getTopGridHeight()}
        rowCount={fixedRowCount}
        style={{
          left: 0,
          outline: 0,
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          ...styleTopLeftGrid
        }}
        width={this._getLeftGridWidth()}
      />
    )
  }

  _renderTopRightGrid (props) {
    const {
      columnCount,
      fixedColumnCount,
      fixedRowCount,
      scrollLeft,
      styleTopRightGrid
    } = props

    if (!fixedRowCount) {
      return null
    }

    return (
      <Grid
        {...props}
        cellRenderer={this._cellRendererTopRightGrid}
        columnCount={columnCount - fixedColumnCount}
        columnWidth={this._columnWidthRightGrid}
        height={this._getTopGridHeight()}
        rowCount={fixedRowCount}
        scrollLeft={scrollLeft}
        style={{
          left: this._getLeftGridWidth(),
          outline: 0,
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          ...styleTopRightGrid
        }}
        width={this._getRightGridWidth()}
      />
    )
  }

  _rowHeightBottomGrid (index) {
    const { fixedRowCount, rowHeight } = this.props

    return rowHeight instanceof Function
      ? rowHeight(index + fixedRowCount)
      : rowHeight
  }
}
