/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import ArrowKeyStepper from './ArrowKeyStepper'
import AutoSizer from '../AutoSizer'
import Grid from '../Grid'
import shouldPureComponentUpdate from 'react-pure-render/function'
import styles from './ArrowKeyStepper.example.css'

export default class ArrowKeyStepperExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._renderCell = this._renderCell.bind(this)
  }

  render () {
    const { list, ...props } = this.props

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='ArrowKeyStepper'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md'
        />

        <ContentBoxParagraph>
          This high-order component decorates a <code>VirtualScroll</code>, <code>FlexTable</code>, or <code>Grid</code> and responds to arrow-key events by scrolling one row or column at a time.
          Focus in the `Grid` below and use the left, right, up, or down arrow keys to move around within the grid.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          Note that unlike the other HOCs in react-virtualized, the <code>ArrowKeyStepper</code> adds a <code>&lt;div&gt;</code> element around its children in order to attach a key-down event handler.
        </ContentBoxParagraph>

        <ArrowKeyStepper
          columnsCount={100}
          rowsCount={100}
        >
          {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
            <div>
              <ContentBoxParagraph>
                {`Most-recently-stepped column: ${scrollToColumn}, row: ${scrollToRow}`}
              </ContentBoxParagraph>

              <AutoSizer disableHeight>
                {({ width }) => (
                  <Grid
                    className={styles.Grid}
                    columnWidth={this._getColumnWidth}
                    columnsCount={100}
                    height={200}
                    onSectionRendered={onSectionRendered}
                    renderCell={this._renderCell}
                    rowHeight={this._getRowHeight}
                    rowsCount={100}
                    scrollToColumn={scrollToColumn}
                    scrollToRow={scrollToRow}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </ArrowKeyStepper>
      </ContentBox>
    )
  }

  _getColumnWidth (index) {
    return (1 + (index % 3)) * 60
  }

  _getRowHeight (index) {
    return (1 + (index % 3)) * 30
  }

  _renderCell ({ columnIndex, rowIndex }) {
    const className = rowIndex % 2 === 0
      ? columnIndex % 2 === 0 ? styles.EvenCell : styles.OddCell
      : columnIndex % 2 !== 0 ? styles.EvenCell : styles.OddCell

    return (
      <div className={className}>
        {`r:${rowIndex}, c:${columnIndex}`}
      </div>
    )
  }
}
