/** @flow */
import Immutable from 'immutable'
import React, { PropTypes, PureComponent } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import { CellMeasurer, CellMeasurerCache } from '../CellMeasurer'
import AutoSizer from '../AutoSizer'
import WindowScroller from '../WindowScroller'
import createCellPositioner from './createCellPositioner'
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
      fixedWidth: true
    })

    this._columnHeights = {}

    this.state = {
      columnWidth: 200,
      height: 300,
      gutterSize: 10,
      windowScrollerEnabled: false
    }

    this._cellRenderer = this._cellRenderer.bind(this)
    this._onResize = this._onResize.bind(this)
    this._renderAutoSizer = this._renderAutoSizer.bind(this)
    this._renderMasonry = this._renderMasonry.bind(this)
    this._setMasonryRef = this._setMasonryRef.bind(this)
  }

  render () {
    const {
      columnWidth,
      height,
      gutterSize,
      windowScrollerEnabled
    } = this.state

    let child

    if (windowScrollerEnabled) {
      child = (
        <WindowScroller>
          {this._renderAutoSizer}
        </WindowScroller>
      )
    } else {
      child = this._renderAutoSizer({ height })
    }

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

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label='Use WindowScroller?'
              checked={windowScrollerEnabled}
              className={styles.checkbox}
              type='checkbox'
              onChange={event => {
                // HACK Because this demo switches between using WindowScroller and not,
                // It's easier to clear the cache when toggling modes to avoid a partially stale state.
                this._cache.clearAll()
                this.setState({
                  windowScrollerEnabled: event.target.checked
                })
              }}
            />
            Use <code>WindowScroller</code>?
          </label>
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
                this._resetCellPositioner()
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
                this._resetCellPositioner()
                this._masonry.recomputeCellPositions()
              })
            }}
            value={gutterSize}
          />
        </InputRow>

        {child}
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

  _cellRenderer ({ index, key, parent, style }) {
    const { list } = this.context
    const { columnWidth } = this.state

    const datum = list.get(index % list.size)

    return (
      <CellMeasurer
        cache={this._cache}
        index={index}
        key={key}
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

  _initCellPositioner () {
    if (typeof this._cellPositioner === 'undefined') {
      const {
        columnWidth,
        gutterSize
      } = this.state

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize
      })
    }
  }

  _onResize ({ height, width }) {
    this._width = width

    this._columnHeights = {}
    this._calculateColumnCount()
    this._resetCellPositioner()
    this._masonry.recomputeCellPositions()
  }

  _renderAutoSizer ({ height, scrollTop }) {
    this._height = height
    this._scrollTop = scrollTop

    return (
      <AutoSizer
        disableHeight
        onResize={this._onResize}
        scrollTop={this._scrollTop}
      >
        {this._renderMasonry}
      </AutoSizer>
    )
  }

  _renderMasonry ({ width }) {
    this._width = width

    this._calculateColumnCount()
    this._initCellPositioner()

    const { height, windowScrollerEnabled } = this.state

    return (
      <Masonry
        autoHeight={windowScrollerEnabled}
        cellCount={1000}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={windowScrollerEnabled ? this._height : height}
        ref={this._setMasonryRef}
        scrollTop={this._scrollTop}
        width={width}
      />
    )
  }

  _resetCellPositioner () {
    const {
      columnWidth,
      gutterSize
    } = this.state

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize
    })
  }

  _setMasonryRef (ref) {
    this._masonry = ref
  }
}
