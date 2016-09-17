/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from '../AutoSizer'
import CellMeasurer from './CellMeasurer'
import CellSizeCache from './defaultCellSizeCache'
import Grid from '../Grid'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from './CellMeasurer.example.css'

const COLUMN_COUNT = 20
const COLUMN_WIDTH = 150
const ROW_COUNT = 50
const ROW_HEIGHT = 35

export default class CellMeasurerExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._uniformSizeCellSizeCache = new CellSizeCache({
      uniformColumnWidth: true,
      uniformRowHeight: true
    })

    this._cellRenderer = this._cellRenderer.bind(this)
    this._uniformCellRenderer = this._uniformCellRenderer.bind(this)
  }

  render () {
    return (
      <ContentBox>
        <ContentBoxHeader
          text='CellMeasurer'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md'
        />

        <ContentBoxParagraph>
          This component renders content for a given column or row in order to determine the widest or tallest cell.
          It can be used to just-in-time measure dynamic content (eg. messages in a chat interface).
        </ContentBoxParagraph>

        <AutoSizer disableHeight>
          {({ width }) => (
            <div style={{ width }}>
              <h3>Fixed height, dynamic width</h3>
              <CellMeasurer
                cellRenderer={this._cellRenderer}
                columnCount={COLUMN_COUNT}
                height={ROW_HEIGHT}
                ref={(ref) => {
                  this._columnWidthMeasurerRef = ref
                }}
                rowCount={ROW_COUNT}
              >
                {({ getColumnWidth }) => (
                  <Grid
                    className={styles.BodyGrid}
                    columnCount={COLUMN_COUNT}
                    columnWidth={getColumnWidth}
                    height={150}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    cellRenderer={this._cellRenderer}
                    rowCount={ROW_COUNT}
                    rowHeight={ROW_HEIGHT}
                    width={width}
                  />
                )}
              </CellMeasurer>

              <h3>Fixed width, dynamic height</h3>
              <CellMeasurer
                cellRenderer={this._cellRenderer}
                columnCount={COLUMN_COUNT}
                rowCount={ROW_COUNT}
                width={COLUMN_WIDTH}
              >
                {({ getRowHeight }) => (
                  <Grid
                    className={styles.BodyGrid}
                    columnCount={COLUMN_COUNT}
                    columnWidth={COLUMN_WIDTH}
                    height={150}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    cellRenderer={this._cellRenderer}
                    rowCount={ROW_COUNT}
                    rowHeight={getRowHeight}
                    width={width}
                  />
                )}
              </CellMeasurer>

              <h3>Uniform width and height</h3>
              <CellMeasurer
                cellRenderer={this._uniformCellRenderer}
                cellSizeCache={this._uniformSizeCellSizeCache}
                columnCount={COLUMN_COUNT}
                rowCount={ROW_COUNT}
              >
                {({ getColumnWidth, getRowHeight }) => (
                  <Grid
                    className={styles.BodyGrid}
                    columnCount={COLUMN_COUNT}
                    columnWidth={getColumnWidth}
                    height={150}
                    overscanColumnCount={0}
                    overscanRowCount={0}
                    cellRenderer={this._uniformCellRenderer}
                    rowCount={ROW_COUNT}
                    rowHeight={getRowHeight}
                    width={width}
                  />
                )}
              </CellMeasurer>
            </div>
          )}
        </AutoSizer>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ columnIndex, key, rowIndex, style }) {
    const datum = this._getDatum(rowIndex)
    const rowClass = this._getRowClassName(rowIndex)
    const classNames = cn(rowClass, styles.cell, {
      [styles.centeredCell]: columnIndex > 2
    })

    let content

    switch (columnIndex % 3) {
      case 0:
        content = datum.color
        break
      case 1:
        content = datum.name
        break
      case 2:
        content = datum.random
        break
    }

    return (
      <div
        className={classNames}
        key={key}
        style={style}
      >
        {content}
      </div>
    )
  }

  _getDatum (index) {
    const { list } = this.context

    return list.get(index % list.size)
  }

  _getRowClassName (row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _uniformCellRenderer ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className={styles.uniformSizeCell}
        key={key}
        style={style}
      >
        {rowIndex}, {columnIndex}
      </div>
    )
  }
}
