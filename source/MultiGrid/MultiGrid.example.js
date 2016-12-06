/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import MultiGrid from './MultiGrid'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './MultiGrid.example.css'

const STYLE = {
  border: '1px solid #ddd',
  overflow: 'hidden'
}
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7'
}
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold'
}
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold'
}

export default class MultiGridExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1
    }

    this._cellRenderer = this._cellRenderer.bind(this)
    this._onFixedColumnCountChange = this._onFixedColumnCountChange.bind(this)
    this._onFixedRowCountChange = this._onFixedRowCountChange.bind(this)
  }

  render () {
    const { fixedColumnCount, fixedRowCount } = this.state

    return (
      <ContentBox>
        <ContentBoxHeader
          text='MultiGrid'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md'
        />

        <ContentBoxParagraph>
          This component stitches together several grids to provide a fixed column/row interface.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Num fixed columns'
            name='fixedColumnCount'
            onChange={this._onFixedColumnCountChange}
            value={fixedColumnCount}
          />
          <LabeledInput
            label='Num fixed rows'
            name='fixedRowCount'
            onChange={this._onFixedRowCountChange}
            value={fixedRowCount}
          />
        </InputRow>

        <AutoSizer disableHeight>
          {({ width }) => (
            <MultiGrid
              cellRenderer={this._cellRenderer}
              columnWidth={100}
              columnCount={1000}
              fixedColumnCount={fixedColumnCount}
              fixedRowCount={fixedRowCount}
              height={300}
              rowHeight={25}
              rowCount={1000}
              style={STYLE}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
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

  _cellRenderer ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {columnIndex}, {rowIndex}
      </div>
    )
  }

  _onFixedColumnCountChange (event) {
    const fixedColumnCount = parseInt(event.target.value, 10) || 0

    this.setState({ fixedColumnCount })
  }

  _onFixedRowCountChange (event) {
    const fixedRowCount = parseInt(event.target.value, 10) || 0

    this.setState({ fixedRowCount })
  }
}
