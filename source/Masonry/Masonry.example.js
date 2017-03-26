/** @flow */
import Immutable from 'immutable'
import React, { PropTypes, PureComponent } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import { CellMeasurer, CellMeasurerCache } from '../CellMeasurer'
import AutoSizer from '../AutoSizer'
import Masonry from './Masonry'
import styles from './Masonry.example.css'

export default class GridExample extends PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  constructor (props, context) {
    super(props, context)

    this._columnCount = 0

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true,
      keyMapper: (index) => index
    })

    this._columnHeights = {}

    this.state = {
      columnWidth: 200,
      height: 300,
      gutterSize: 10
    }

    this._cellPositioner = this._cellPositioner.bind(this)
    this._cellRenderer = this._cellRenderer.bind(this)
    this._onResize = this._onResize.bind(this)
    this._renderMasonry = this._renderMasonry.bind(this)
    this._setMasonryRef = this._setMasonryRef.bind(this)
  }

  render () {
    const {
      columnWidth,
      height,
      gutterSize
    } = this.state

    return (
      <ContentBox>
        <ContentBoxHeader
          text='Masonry'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/Masonry/Masonry.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/Masonry.md'
        />

        <ContentBoxParagraph>
          Optimized for masonry layouts.
          Cells are j.i.t. measured and layed out as a user scrolls.
          Sizes are cached so that resize/reflow is fast and does not require re-measuring.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Height'
            name='height'
            onChange={(event) => {
              this.setState({
                height: parseInt(event.target.value, 10) || 300
              })
            }}
            value={height}
          />
          <LabeledInput
            label='Column Width'
            name='columnWidth'
            onChange={(event) => {
              this._columnHeights = {}
              this._cache.clearAll()
              this.setState({
                columnWidth: parseInt(event.target.value, 10) || 200
              }, () => {
                this._calculateColumnCount()
                this._masonry.clearCellPositions()
              })
            }}
            value={columnWidth}
          />
          <LabeledInput
            label='Gutter Size'
            name='gutterSize'
            onChange={(event) => {
              this._columnHeights = {}
              this.setState({
                gutterSize: parseInt(event.target.value, 10) || 10
              }, () => {
                this._calculateColumnCount()
                this._masonry.recomputeCellPositions()
              })
            }}
            value={gutterSize}
          />
        </InputRow>

        <AutoSizer
          disableHeight
          height={height}
          onResize={this._onResize}
        >
          {this._renderMasonry}
        </AutoSizer>
      </ContentBox>
    )
  }

  _calculateColumnCount () {
    const {
      columnWidth,
      gutterSize
    } = this.state

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize))
  }

  _cellPositioner (index) {
    const {
      columnWidth,
      gutterSize
    } = this.state

    // Super naive Masonry layout
    let columnIndex = 0
    if (index < this._columnCount) {
      columnIndex = index
    } else {
      for (let index in this._columnHeights) {
        if (this._columnHeights[index] < this._columnHeights[columnIndex]) {
          columnIndex = index
        }
      }
    }

    const left = columnIndex * (columnWidth + gutterSize)
    const top = this._columnHeights[columnIndex] || 0

    this._columnHeights[columnIndex] = top + gutterSize + this._cache.getHeight(index)

    return {
      left,
      top
    }
  }

  _cellRenderer ({ index, key, parent, style }) {
    const { list } = this.context
    const { columnWidth } = this.state

    const datum = list.get(index % list.size)

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        <div
          className={styles.Cell}
          style={{
            ...style,
            width: columnWidth
          }}
        >
          <div
            style={{
              backgroundColor: datum.color,
              borderRadius: '0.5rem',
              height: datum.size * 3,
              marginBottom: '0.5rem',
              width: '100%'
            }}
          />
          {datum.random}
        </div>
      </CellMeasurer>
    )
  }

  _onResize (prevProps, prevState) {
    this._columnHeights = {}
    this._calculateColumnCount()
    this._masonry.recomputeCellPositions()
  }

  _renderMasonry ({ width }) {
    this._width = width
    this._calculateColumnCount()

    const { height } = this.state

    return (
      <Masonry
        cellCount={1000}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={height}
        ref={this._setMasonryRef}
        width={width}
      />
    )
  }

  _setMasonryRef (ref) {
    this._masonry = ref
  }
}
