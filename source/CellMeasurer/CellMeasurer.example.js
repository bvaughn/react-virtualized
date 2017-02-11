import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from '../AutoSizer'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import Grid from '../Grid'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from './CellMeasurer.example.css'

const COLUMN_WIDTH = 150
const ROW_COUNT = 50
const ROW_HEIGHT = 35

const cache = new CellMeasurerCache()

export default class CellMeasurerExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cellRendererOne = this._cellRendererOne.bind(this)
  }

  render () {
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
         <Grid
            className={styles.BodyGrid}
            columnCount={50}
            columnWidth={cache.getWidth}
            height={150}
            overscanColumnCount={0}
            overscanRowCount={0}
            cellRenderer={() => <div/>}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            width={width}
          />
        )}
      </AutoSizer>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRendererOne ({ columnIndex, key, rowIndex, style }) {
    const classNames = cn(rowClass, styles.cell, {
      [styles.centeredCell]: columnIndex > 2
    })

    return (
      <CellMeasurer
        cache={cache}
        columnCount={50}
        rowCount={ROW_COUNT}
        style={style}
      >
        <div className={classNames}>
          {rowIndex}, {columnIndex}
        </div>
      </CellMeasurer>
    )
  }
}
