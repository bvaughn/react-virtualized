/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import Grid from './Grid'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from './Grid.example.css'

export default class GridExample extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      columnWidth: 100,
      columnCount: 1000,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 1000,
      scrollToColumn: undefined,
      scrollToRow: undefined,
      useDynamicRowHeight: false
    }

    this._cellRenderer = this._cellRenderer.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._getRowClassName = this._getRowClassName.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._noContentRenderer = this._noContentRenderer.bind(this)
    this._onColumnCountChange = this._onColumnCountChange.bind(this)
    this._onRowCountChange = this._onRowCountChange.bind(this)
    this._onScrollToColumnChange = this._onScrollToColumnChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._renderBodyCell = this._renderBodyCell.bind(this)
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this)
  }

  render () {
    const { list, ...props } = this.props

    const {
      columnCount,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToColumn,
      scrollToRow,
      useDynamicRowHeight
    } = this.state

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='Grid'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md'
        />

        <ContentBoxParagraph>
          Renders tabular data with virtualization along the vertical and horizontal axes.
          Row heights and column widths must be calculated ahead of time and specified as a fixed size or returned by a getter function.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label='Use dynamic row height?'
              className={styles.checkbox}
              type='checkbox'
              value={useDynamicRowHeight}
              onChange={event => this._updateUseDynamicRowHeights(event.target.checked)}
            />
            Use dynamic row height?
          </label>
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Num columns'
            name='columnCount'
            onChange={this._onColumnCountChange}
            value={columnCount}
          />
          <LabeledInput
            label='Num rows'
            name='rowCount'
            onChange={this._onRowCountChange}
            value={rowCount}
          />
          <LabeledInput
            label='Scroll to column'
            name='onScrollToColumn'
            placeholder='Index...'
            onChange={this._onScrollToColumnChange}
            value={scrollToColumn}
          />
          <LabeledInput
            label='Scroll to row'
            name='onScrollToRow'
            placeholder='Index...'
            onChange={this._onScrollToRowChange}
            value={scrollToRow}
          />
          <LabeledInput
            label='List height'
            name='height'
            onChange={event => this.setState({ height: parseInt(event.target.value, 10) || 1 })}
            value={height}
          />
          <LabeledInput
            disabled={useDynamicRowHeight}
            label='Row height'
            name='rowHeight'
            onChange={event => this.setState({ rowHeight: parseInt(event.target.value, 10) || 1 })}
            value={rowHeight}
          />
          <LabeledInput
            label='Overscan columns'
            name='overscanColumnCount'
            onChange={event => this.setState({ overscanColumnCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanColumnCount}
          />
          <LabeledInput
            label='Overscan rows'
            name='overscanRowCount'
            onChange={event => this.setState({ overscanRowCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanRowCount}
          />
        </InputRow>

        <AutoSizer disableHeight>
          {({ width }) => (
            <Grid
              cellRenderer={this._cellRenderer}
              className={styles.BodyGrid}
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={height}
              noContentRenderer={this._noContentRenderer}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowCount={rowCount}
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
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

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 50
      case 1:
        return 100
      case 2:
        return 300
      default:
        return 50
    }
  }

  _getDatum (index) {
    const { list } = this.props

    return list.get(index % list.size)
  }

  _getRowClassName (row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _getRowHeight ({ index }) {
    return this._getDatum(index).size
  }

  _noContentRenderer () {
    return (
      <div className={styles.noCells}>
        No cells
      </div>
    )
  }

  _renderBodyCell ({ columnIndex, rowIndex }) {
    const rowClass = this._getRowClassName(rowIndex)
    const datum = this._getDatum(rowIndex)

    let content

    switch (columnIndex) {
      case 1:
        content = datum.name
        break
      case 2:
        content = datum.random
        break
      default:
        content = (
          <div>
            c:{columnIndex}
            <br/>
            r:{rowIndex}
          </div>
        )
        break
    }

    const classNames = cn(rowClass, styles.cell, {
      [styles.centeredCell]: columnIndex > 2
    })

    return (
      <div className={classNames}>
        {content}
      </div>
    )
  }

  _cellRenderer ({ columnIndex, rowIndex }) {
    if (columnIndex === 0) {
      return this._renderLeftSideCell({ columnIndex, rowIndex })
    } else {
      return this._renderBodyCell({ columnIndex, rowIndex })
    }
  }

  _renderLeftSideCell ({ rowIndex }) {
    const datum = this._getDatum(rowIndex)

    const classNames = cn(styles.cell, styles.letterCell)
    const style = { backgroundColor: datum.color }

    return (
      <div
        className={classNames}
        style={style}
      >
        {datum.name.charAt(0)}
      </div>
    )
  }

  _updateUseDynamicRowHeights (value) {
    this.setState({
      useDynamicRowHeight: value
    })
  }

  _onColumnCountChange (event) {
    const columnCount = parseInt(event.target.value, 10) || 0

    this.setState({ columnCount })
  }

  _onRowCountChange (event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToColumnChange (event) {
    const { columnCount } = this.state
    let scrollToColumn = Math.min(columnCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToColumn)) {
      scrollToColumn = undefined
    }

    this.setState({ scrollToColumn })
  }

  _onScrollToRowChange (event) {
    const { rowCount } = this.state
    let scrollToRow = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToRow)) {
      scrollToRow = undefined
    }

    this.setState({ scrollToRow })
  }
}
