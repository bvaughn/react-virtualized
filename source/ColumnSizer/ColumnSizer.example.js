/**
 * @flow
 */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import styles from './ColumnSizer.example.css'
import AutoSizer from '../AutoSizer'
import ColumnSizer from './ColumnSizer'
import Grid from '../Grid'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class ColumnSizerExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      columnMaxWidth: 100,
      columnMinWidth: 75,
      columnsCount: 10
    }

    this._noColumnMaxWidthChange = this._noColumnMaxWidthChange.bind(this)
    this._noColumnMinWidthChange = this._noColumnMinWidthChange.bind(this)
    this._onColumnsCountChange = this._onColumnsCountChange.bind(this)
    this._noContentRenderer = this._noContentRenderer.bind(this)
    this._renderCell = this._renderCell.bind(this)
  }

  render () {
    const { list, ...props } = this.props

    const {
      columnMaxWidth,
      columnMinWidth,
      columnsCount
    } = this.state

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='ColumnSizer'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/ColumnSizer/ColumnSizer.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/ColumnSizer.md'
        />

        <ContentBoxParagraph>
          This component decorates a <code>Grid</code> and calculates the width of its columns based on the current (<code>Grid</code>) width.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Num Columns'
            name='columnsCount'
            onChange={this._onColumnsCountChange}
            value={columnsCount}
          />
          <LabeledInput
            label='Column Min Width'
            name='columnMinWidth'
            onChange={this._noColumnMinWidthChange}
            value={columnMinWidth}
          />
          <LabeledInput
            label='Column Max Width'
            name='columnMaxWidth'
            onChange={this._noColumnMaxWidthChange}
            value={columnMaxWidth}
          />
        </InputRow>

        <div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <ColumnSizer
                columnMaxWidth={columnMaxWidth}
                columnMinWidth={columnMinWidth}
                columnsCount={columnsCount}
                key='GridColumnSizer'
                width={width}
              >
                {({ adjustedWidth, getColumnWidth, registerChild }) => (
                  <div
                    className={styles.GridContainer}
                    style={{
                      height: 50,
                      width: adjustedWidth
                    }}
                  >
                    <Grid
                      ref={registerChild}
                      columnWidth={getColumnWidth}
                      columnsCount={columnsCount}
                      height={50}
                      noContentRenderer={this._noContentRenderer}
                      renderCell={this._renderCell}
                      rowHeight={50}
                      rowsCount={1}
                      width={adjustedWidth}
                    />
                  </div>
                )}
              </ColumnSizer>
            )}
          </AutoSizer>
        </div>
      </ContentBox>
    )
  }

  _noColumnMaxWidthChange (event) {
    let columnMaxWidth = parseInt(event.target.value, 10)

    if (isNaN(columnMaxWidth)) {
      columnMaxWidth = undefined
    } else {
      columnMaxWidth = Math.min(1000, columnMaxWidth)
    }

    this.setState({ columnMaxWidth })
  }

  _noColumnMinWidthChange (event) {
    let columnMinWidth = parseInt(event.target.value, 10)

    if (isNaN(columnMinWidth)) {
      columnMinWidth = undefined
    } else {
      columnMinWidth = Math.max(1, columnMinWidth)
    }

    this.setState({ columnMinWidth })
  }

  _onColumnsCountChange (event) {
    this.setState({ columnsCount: parseInt(event.target.value, 10) || 0 })
  }

  _noContentRenderer () {
    return (
      <div className={styles.noCells}>
        No cells
      </div>
    )
  }

  _renderCell ({ columnIndex, rowIndex }) {
    const className = columnIndex === 0
      ? styles.firstCell
      : styles.cell

    return (
      <div className={className}>
        {`R:${rowIndex}, C:${columnIndex}`}
      </div>
    )
  }
}
