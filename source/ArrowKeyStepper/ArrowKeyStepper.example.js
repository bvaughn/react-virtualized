/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import ArrowKeyStepper from './ArrowKeyStepper'
import AutoSizer from '../AutoSizer'
import Grid from '../Grid'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from './ArrowKeyStepper.example.css'

export default class ArrowKeyStepperExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: 'edges'
    }

    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._cellRenderer = this._cellRenderer.bind(this)
  }

  render () {
    const { mode } = this.state

    return (
      <ContentBox>
        <ContentBoxHeader
          text='ArrowKeyStepper'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md'
        />

        <ContentBoxParagraph>
          This high-order component decorates a <code>List</code>, <code>Table</code>, or <code>Grid</code> and responds to arrow-key events by scrolling one row or column at a time.
          Focus in the `Grid` below and use the left, right, up, or down arrow keys to move around within the grid.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          Note that unlike the other HOCs in react-virtualized, the <code>ArrowKeyStepper</code> adds a <code>&lt;div&gt;</code> element around its children in order to attach a key-down event handler.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <strong>mode</strong>:
          <label>
            <input
              aria-label='Set mode equal to "cells"'
              checked={mode === 'cells'}
              className={styles.Radio}
              type='radio'
              onChange={event => event.target.checked && this.setState({ mode: 'cells' })}
              value='cells'
            />
            cells
          </label>
          <label>
            <input
              aria-label='Set mode equal to "edges"'
              checked={mode === 'edges'}
              className={styles.Radio}
              type='radio'
              onChange={event => event.target.checked && this.setState({ mode: 'edges' })}
              value='edges'
            />
            edges (default)
          </label>
          <label>
            <input
              aria-label='Set mode equal to "align:top-left"'
              checked={mode === 'align:top-left'}
              className={styles.Radio}
              type='radio'
              onChange={event => event.target.checked && this.setState({ mode: 'align:top-left' })}
              value='align:top-left'
            />
            align:top-left (<code>Grid</code> prop <code>SetToAlignment</code> is set to <code>start</code>)
          </label>
          <label>
            <input
              aria-label='Set mode equal to "align:bottom-right"'
              checked={mode === 'align:bottom-right'}
              className={styles.Radio}
              type='radio'
              onChange={event => event.target.checked && this.setState({ mode: 'align:bottom-right' })}
              value='align:bottom-right'
            />
            align:bottom-right (<code>Grid</code> prop <code>SetToAlignment</code> is set to <code>end</code>)
          </label>

        </ContentBoxParagraph>

        <ArrowKeyStepper
          columnCount={100}
          mode={mode}
          rowCount={100}
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
                    columnCount={100}
                    height={200}
                    onSectionRendered={onSectionRendered}
                    cellRenderer={({ columnIndex, key, rowIndex, style }) => this._cellRenderer({ columnIndex, key, rowIndex, scrollToColumn, scrollToRow, style })}
                    rowHeight={this._getRowHeight}
                    rowCount={100}
                    scrollToAlignment={mode === 'align:top-left' ? 'start' : (mode === 'align:bottom-right' ? 'end' : 'auto')}
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

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _getColumnWidth ({ index }) {
    return (1 + (index % 3)) * 60
  }

  _getRowHeight ({ index }) {
    return (1 + (index % 3)) * 30
  }

  _cellRenderer ({ columnIndex, key, rowIndex, scrollToColumn, scrollToRow, style }) {
    const className = cn(styles.Cell, {
      [styles.FocusedCell]: columnIndex === scrollToColumn && rowIndex === scrollToRow
    })

    return (
      <div
        className={className}
        key={key}
        style={style}
      >
        {`r:${rowIndex}, c:${columnIndex}`}
      </div>
    )
  }
}
