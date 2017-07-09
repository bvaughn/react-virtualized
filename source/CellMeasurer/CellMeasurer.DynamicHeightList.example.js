/** @flow */
import { List as ImmutableList } from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import List from '../List'
import styles from './CellMeasurer.example.css'

type Props = {
  getClassName: (params: { rowIndex: number, columnIndex: number }) => string,
  list: ImmutableList<*>,
  width: number
}

export default class DynamicHeightList extends PureComponent {
  props: Props

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 50
  })

  render () {
    const { width } = this.props

    return (
      <List
        className={styles.BodyGrid}
        deferredMeasurementCache={this._cache}
        height={400}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this._rowRenderer}
        width={width}
      />
    )
  }

  _rowRenderer = ({ index, isScrolling, key, parent, style }: {
    index: number,
    isScrolling: boolean,
    key: string,
    parent: mixed,
    style: CSSStyleDeclaration
  }) => {
    const { getClassName, list } = this.props

    const datum = list.get(index % list.size)
    const classNames = getClassName({ columnIndex: 0, rowIndex: index })

    const imageWidth = 300
    const imageHeight = datum.size * (1 + index % 3)

    const source = `https://fillmurray.com/${imageWidth}/${imageHeight}`

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        {({ measure }) => (
          <div
            className={classNames}
            style={style}
          >
            <img
              onLoad={measure}
              src={source}
              style={{
                width: imageWidth
              }}
            />
          </div>
        )}
      </CellMeasurer>
    )
  }
}
