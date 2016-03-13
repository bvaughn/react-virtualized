import React from 'react'
import GridCell from './GridCell'

// TODO
export default class CellCache {
  constructor () {
    this._columnPoolSize = 0
    this._indicesMap = {}
    this._pool = {}
    this._rowPoolSize = 0
  }

  // TODO
  getGridCell ({
    columnDatum,
    columnIndex,
    renderCell,
    rowDatum,
    rowIndex
  }) {
    let key = `${columnIndex},${rowIndex}`
    let rotatingKey = `${columnIndex % this._columnPoolSize},${rowIndex % this._rowPoolSize}`

    if (this._indicesMap[rotatingKey] !== key) {
      this._indicesMap[rotatingKey] = key

      const renderedCell = renderCell({ columnIndex, rowIndex })
      const props = {
        children: renderedCell,
        className: 'Grid__cell',
        height: rowDatum.size,
        left: columnDatum.offset,
        key: key,
        top: rowDatum.offset,
        width: columnDatum.size
      }

      if (!this._pool[rotatingKey]) {
        this._pool[rotatingKey] = React.createElement(GridCell, props)
      } else {
        this._pool[rotatingKey] = React.cloneElement(this._pool[rotatingKey], props)
      }
    }

    return this._pool[rotatingKey]
  }

  // TODO
  increasePoolSize ({ columnsCount, rowsCount }) {
    this._columnPoolSize = Math.max(this._columnPoolSize, columnsCount)
    this._rowPoolSize = Math.max(this._rowPoolSize, rowsCount)
  }
}
