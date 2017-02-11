/** @flow */
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { findDOMNode } from 'react-dom'
import type { CellMeasurerCacheType } from './CellMeasurerCache'

type Props = {
  cache: any, // TODO type CellMeasurerCacheType
  children: mixed,
  columnIndex: number,
  rowIndex: number
};

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
export default class CellMeasurer extends Component {
  constructor (props : Props, state) {
    super(props, state)
  }

  componentDidMount() {
    this._maybeMeasureCell()
  }

  componentDidUpdate(prevProps, prevState) {
    this._maybeMeasureCell()
  }

  render() {
    return this.props.children;
  }

  _maybeMeasureCell () {
    const { cache, columnIndex, rowIndex } = this.props

    if (!cache.has(rowIndex, columnIndex)) {
      const node = findDOMNode(this)
      const height = node.clientHeight
      const width = node.clientWidth

      cache.set(
        rowIndex,
        columnIndex,
        width,
        height
      )
    }
  }
}
