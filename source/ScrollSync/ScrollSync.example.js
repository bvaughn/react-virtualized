/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from '../AutoSizer'
import Grid from '../Grid'
import ScrollSync from './ScrollSync'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from './ScrollSync.example.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'

const LEFT_COLOR_FROM = hexToRgb('#471061')
const LEFT_COLOR_TO = hexToRgb('#BC3959')
const TOP_COLOR_FROM = hexToRgb('#000000')
const TOP_COLOR_TO = hexToRgb('#333333')

export default class GridExample extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      columnWidth: 75,
      columnsCount: 50,
      height: 300,
      overscanColumnsCount: 0,
      overscanRowsCount: 5,
      rowHeight: 40,
      rowsCount: 100
    }

    this._renderBodyCell = this._renderBodyCell.bind(this)
    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this)
  }

  render () {
    const { list, ...props } = this.props

    const {
      columnsCount,
      columnWidth,
      height,
      overscanColumnsCount,
      overscanRowsCount,
      rowHeight,
      rowsCount
    } = this.state

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='ScrollSync'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/ScrollSync/ScrollSync.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/ScrollSync.md'
        />

        <ContentBoxParagraph>
          High order component that simplifies the process of synchronizing scrolling between two or more virtualized components.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          This example shows two <code>Grid</code>s and one <code>VirtualScroll</code> configured to mimic a spreadsheet with a fixed header and first column.
          It also shows how a scroll callback can be used to control UI properties such as background color.
        </ContentBoxParagraph>

        <ScrollSync>
          {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => {
            const x = scrollLeft / (scrollWidth - clientWidth)
            const y = scrollTop / (scrollHeight - clientHeight)

            const leftBackgroundColor = mixColors(LEFT_COLOR_FROM, LEFT_COLOR_TO, y)
            const leftColor = `#ffffff`
            const topBackgroundColor = mixColors(TOP_COLOR_FROM, TOP_COLOR_TO, x)
            const topColor = `#ffffff`
            const middleBackgroundColor = mixColors(leftBackgroundColor, topBackgroundColor, 0.5)
            const middleColor = `#ffffff`

            return (
              <div className={styles.GridRow }>
                <div
                  className={styles.LeftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: leftColor,
                    backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`
                  }}
                >
                  <Grid
                    renderCell={this._renderLeftHeaderCell}
                    className={styles.HeaderGrid}
                    width={columnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={columnWidth}
                    rowsCount={1}
                    columnsCount={1}
                  />
                </div>
                <div
                  className={styles.LeftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rowHeight,
                    color: leftColor,
                    backgroundColor: `rgb(${leftBackgroundColor.r},${leftBackgroundColor.g},${leftBackgroundColor.b})`
                  }}
                >
                  <Grid
                    overscanColumnsCount={overscanColumnsCount}
                    overscanRowsCount={overscanRowsCount}
                    renderCell={this._renderLeftSideCell}
                    columnWidth={columnWidth}
                    columnsCount={1}
                    className={styles.LeftSideGrid}
                    height={height - scrollbarSize()}
                    rowHeight={rowHeight}
                    rowsCount={rowsCount}
                    scrollTop={scrollTop}
                    width={columnWidth}
                  />
                </div>
                <div className={styles.GridColumn}>
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <div>
                        <div style={{
                          backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                          color: topColor,
                          height: rowHeight,
                          width: width - scrollbarSize()
                        }}>
                          <Grid
                            className={styles.HeaderGrid}
                            columnWidth={columnWidth}
                            columnsCount={columnsCount}
                            height={rowHeight}
                            overscanColumnsCount={overscanColumnsCount}
                            renderCell={this._renderHeaderCell}
                            rowHeight={rowHeight}
                            rowsCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarSize()}
                          />
                        </div>
                        <div
                          style={{
                            backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            color: middleColor,
                            height,
                            width
                          }}
                        >
                          <Grid
                            className={styles.BodyGrid}
                            columnWidth={columnWidth}
                            columnsCount={columnsCount}
                            height={height}
                            onScroll={onScroll}
                            overscanColumnsCount={overscanColumnsCount}
                            overscanRowsCount={overscanRowsCount}
                            renderCell={this._renderBodyCell}
                            rowHeight={rowHeight}
                            rowsCount={rowsCount}
                            width={width}
                          />
                        </div>
                      </div>
                    )}
                  </AutoSizer>
                </div>
              </div>
            )
          }}
        </ScrollSync>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _renderBodyCell ({ columnIndex, rowIndex }) {
    if (columnIndex < 1) {
      return
    }

    return this._renderLeftSideCell({ columnIndex, rowIndex })
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {
    if (columnIndex < 1) {
      return
    }

    return this._renderLeftHeaderCell({ columnIndex, rowIndex })
  }

  _renderLeftHeaderCell ({ columnIndex, rowIndex }) {
    return (
      <div className={styles.headerCell}>
        {`C${columnIndex}`}
      </div>
    )
  }

  _renderLeftSideCell ({ columnIndex, rowIndex }) {
    const rowClass = rowIndex % 2 === 0
      ? columnIndex % 2 === 0 ? styles.evenRow : styles.oddRow
      : columnIndex % 2 !== 0 ? styles.evenRow : styles.oddRow
    const classNames = cn(rowClass, styles.cell)

    return (
      <div className={classNames}>
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    )
  }
}

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors (color1, color2, amount) {
  const weight1 = amount
  const weight2 = 1 - amount

  const r = Math.round(weight1 * color1.r + weight2 * color2.r)
  const g = Math.round(weight1 * color1.g + weight2 * color2.g)
  const b = Math.round(weight1 * color1.b + weight2 * color2.b)

  return { r, g, b }
}
