/** @flow */
import { List as ImmutableList } from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import { Column, Table } from '../Table'
import styles from './CellMeasurer.example.css'

type Datum = {
  color: string,
  name: string,
  randomLong: string,
  random: string
}

type Props = {
  list: ImmutableList<Datum>,
  width: number
}

export default class DynamicHeightTableColumn extends PureComponent {
  props: Props

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 25
  })

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.width !== this.props.width) {
      this._cache.clearAll()
    }
  }

  render () {
    const { width } = this.props

    return (
      <Table
        deferredMeasurementCache={this._cache}
        headerHeight={20}
        height={400}
        overscanRowCount={2}
        rowClassName={styles.tableRow}
        rowHeight={this._cache.rowHeight}
        rowGetter={this._rowGetter}
        rowCount={1000}
        width={width}
      >
        <Column
          className={styles.tableColumn}
          dataKey='name'
          label='Name'
          width={125}
        />
        <Column
          className={styles.tableColumn}
          dataKey='color'
          label='Color'
          width={75}
        />
        <Column
          width={width - 200}
          dataKey='random'
          label='Dyanmic text'
          cellRenderer={this._columnCellRenderer}
        />
      </Table>
    )
  }

  _columnCellRenderer = ({ cellData, columnData, dataKey, parent, rowData, rowIndex }: {
    cellData: mixed,
    columnData: mixed,
    dataKey: string,
    parent: mixed,
    rowData: mixed,
    rowIndex: number
  }) => {
    const { list } = this.props

    const datum = list.get(rowIndex % list.size)
    const content = rowIndex % 5 === 0
      ? ''
      : datum.randomLong

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={styles.tableColumn}
          style={{
            whiteSpace: 'normal'
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }

  _rowGetter = ({ index }: { index: number }) => {
    const { list } = this.props

    return list.get(index % list.size)
  }
}
