/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from '../AutoSizer'
import Grid from '../Grid'
import ScrollSync from './ScrollSync'
import VirtualScroll from '../VirtualScroll'
import shouldPureComponentUpdate from 'react-pure-render/function'
import cn from 'classnames'
import styles from './ScrollSync.example.css'

export default class GridExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

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

            const leftBackgroundColor = fadeBetweenRGB([65, 65, 65], [0, 0, 0], y)
            const leftColor = `#ffffff`

            const topBackgroundColor = fadeBetweenRGB([77, 182, 172], [23, 146, 135], x)
            const topColor = `#ffffff`

            return (
              <div className={styles.GridRow}>
                <div
                  className={styles.LeftSideGridContainer}
                  style={{
                    backgroundColor: leftBackgroundColor,
                    color: leftColor,
                    marginTop: rowHeight
                  }}
                >
                  <VirtualScroll
                    className={styles.LeftSideGrid}
                    height={height}
                    overscanRowsCount={overscanRowsCount}
                    rowHeight={rowHeight}
                    rowRenderer={this._renderLeftSideCell}
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
                          backgroundColor: topBackgroundColor,
                          color: topColor,
                          height: rowHeight,
                          width
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
                            width={width}
                          />
                        </div>
                        <div>
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

  _renderBodyCell ({ columnIndex, rowIndex }) {
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

  _renderHeaderCell ({ columnIndex, rowIndex }) {
    return (
      <div className={styles.headerCell}>
        {`C${columnIndex}`}
      </div>
    )
  }

  _renderLeftSideCell (rowIndex) {
    const classNames = cn(styles.cell, styles.leftCell)

    return (
      <div className={classNames}>
        {`R${rowIndex}`}
      </div>
    )
  }
}

function fadeBetweenRGB (rgbFrom, rgbTo, amount) {
  const r = Math.round(rgbFrom[0] + (rgbTo[0] - rgbFrom[0]) * amount)
  const g = Math.round(rgbFrom[1] + (rgbTo[1] - rgbFrom[1]) * amount)
  const b = Math.round(rgbFrom[2] + (rgbTo[2] - rgbFrom[2]) * amount)

  return `rgb(${r}, ${g}, ${b})`
}
