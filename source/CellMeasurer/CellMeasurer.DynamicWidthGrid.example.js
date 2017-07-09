/** @flow */
import { List as ImmutableList } from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import Grid from '../Grid'
import styles from './CellMeasurer.example.css'

type Datum = {
  color: string,
  name: string,
  randomLong: string,
  random: string
}

type Props = {
  getClassName: (params: { columnIndex: number, rowIndex: number }) => string,
  getContent: (params: { index: number, datum: Datum, long: boolean }) => string,
  list: ImmutableList<Datum>,
  width: number
}

export default class DynamicWidthGrid extends PureComponent {
  props: Props

  _cache = new CellMeasurerCache({
    defaultWidth: 100,
    fixedHeight: true
  })


  render () {
    const { width } = this.props

    return (
      <Grid
        className={styles.BodyGrid}
        columnCount={1000}
        columnWidth={this._cache.columnWidth}
        deferredMeasurementCache={this._cache}
        height={400}
        overscanColumnCount={0}
        overscanRowCount={2}
        cellRenderer={this._cellRenderer}
        rowCount={50}
        rowHeight={35}
        width={width}
      />
    )
  }

  _cellRenderer = ({ columnIndex, key, parent, rowIndex, style }: {
    columnIndex: number,
    key: string,
    parent: mixed,
    rowIndex: number,
    style: CSSStyleDeclaration
  }) => {
    const { getClassName, getContent, list } = this.props

    const datum = list.get((rowIndex + columnIndex) % list.size)
    const classNames = getClassName({ columnIndex, rowIndex })
    const content = getContent({ index: columnIndex, datum, long: false })

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={classNames}
          style={{
            ...style,
            height: 35,
            whiteSpace: 'nowrap'
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }
}
