/** @flow */
import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import Collection from './Collection'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './Collection.example.css'

// Defines a pattern of sizes and positions for a range of 10 rotating cells
// These cells cover an area of 600 (wide) x 400 (tall)
const GUTTER_SIZE = 3
const CELL_WIDTH = 75

export default class CollectionExample extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      cellCount: props.list.size,
      columnCount: this._getColumnCount(props.list.size),
      height: 300,
      scrollToCell: undefined
    }

    this._columnYMap = []

    this._cellRenderer = this._cellRenderer.bind(this)
    this._cellSizeAndPositionGetter = this._cellSizeAndPositionGetter.bind(this)
    this._noContentRenderer = this._noContentRenderer.bind(this)
    this._onCellCountChange = this._onCellCountChange.bind(this)
    this._onHeightChange = this._onHeightChange.bind(this)
    this._onScrollToCellChange = this._onScrollToCellChange.bind(this)
  }

  render () {
    const { cellCount, height, scrollToCell } = this.state

    return (
      <ContentBox {...this.props}>
        <ContentBoxHeader
          text='Collection'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/Collection/Collection.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md'
        />

        <ContentBoxParagraph>
          Renders scattered or non-linear data.
          Unlike <code>Grid</code>, which renders checkerboard data, <code>Collection</code> can render arbitrarily positioned- even overlapping- data.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Num cells'
            name='cellCount'
            onChange={this._onCellCountChange}
            value={cellCount}
          />
          <LabeledInput
            label='Scroll to cell'
            name='onScrollToCell'
            placeholder='Index...'
            onChange={this._onScrollToCellChange}
            value={scrollToCell}
          />
          <LabeledInput
            label='Height'
            name='height'
            onChange={this._onHeightChange}
            value={height}
          />
        </InputRow>

        <AutoSizer disableHeight>
          {({ width }) => (
            <Collection
              cellCount={cellCount}
              cellRenderer={this._cellRenderer}
              cellSizeAndPositionGetter={this._cellSizeAndPositionGetter}
              className={styles.collection}
              height={height}
              noContentRenderer={this._noContentRenderer}
              scrollToCell={scrollToCell}
              width={width}
            />
          )}
        </AutoSizer>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ index }) {
    const { list } = this.props
    const datum = list.get(index % list.size)

    return (
      <div
        className={styles.cell}
        style={{
          backgroundColor: datum.color
        }}
      >
        {index}
      </div>
    )
  }

  _cellSizeAndPositionGetter ({ index }) {
    const { list } = this.props
    const { columnCount } = this.state

    const columnPosition = index % (columnCount || 1)
    const datum = list.get(index % list.size)

    // Poor man's Masonry layout; columns won't all line up equally with the bottom.
    const height = datum.size
    const width = CELL_WIDTH
    const x = columnPosition * (GUTTER_SIZE + width)
    const y = this._columnYMap[columnPosition] || 0

    this._columnYMap[columnPosition] = y + height + GUTTER_SIZE

    return {
      height,
      width,
      x,
      y
    }
  }

  _getColumnCount (cellCount) {
    return Math.round(Math.sqrt(cellCount))
  }

  _noContentRenderer () {
    return (
      <div className={styles.noCells}>
        No cells
      </div>
    )
  }

  _onCellCountChange (event) {
    const cellCount = parseInt(event.target.value, 10) || 0

    this._columnYMap = []

    this.setState({
      cellCount,
      columnCount: this._getColumnCount(cellCount)
    })
  }

  _onHeightChange (event) {
    const height = parseInt(event.target.value, 10) || 0

    this.setState({ height })
  }

  _onScrollToCellChange (event) {
    const { cellCount } = this.state

    let scrollToCell = Math.min(cellCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToCell)) {
      scrollToCell = undefined
    }

    this.setState({ scrollToCell })
  }
}
