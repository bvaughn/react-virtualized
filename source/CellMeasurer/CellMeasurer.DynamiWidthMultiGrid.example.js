/** @flow */
import { List as ImmutableList } from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import MultiGrid from '../MultiGrid'
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

export default class DynamiHeightMultiGrid extends PureComponent {
  props: Props

  _cache = new CellMeasurerCache({
    defaultHeight: 30,
    defaultWidth: 150,
    fixedHeight: true
  })

  render () {
    const { width } = this.props

    return (
      <MultiGrid
        className={styles.BodyGrid}
        columnCount={50}
        columnWidth={this._cache.columnWidth}
        deferredMeasurementCache={this._cache}
        fixedColumnCount={1}
        fixedRowCount={0}
        height={400}
        overscanColumnCount={0}
        overscanRowCount={0}
        cellRenderer={this._cellRenderer}
        rowCount={50}
        rowHeight={30}
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
    let content = getContent({ index: rowIndex, datum, long: false })

    if (columnIndex === 0) {
      content = content.substr(0, 50)
    }

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
            whiteSpace: 'nowrap'
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }
}
