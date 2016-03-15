/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import Grid from './Grid'
import shouldPureComponentUpdate from 'react-pure-render/function'
import cn from 'classnames'
import styles from './Grid.example.css'

export default class GridExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      columnWidth: 100,
      columnsCount: 1000,
      height: 300,
      overscanColumnsCount: 0,
      overscanRowsCount: 5,
      rowHeight: 40,
      rowsCount: 1000,
      scrollToColumn: undefined,
      scrollToRow: undefined,
      useDynamicRowHeight: false,
      lockedColumnCount: 1,
      lockedRowCount: 0
    }

    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._getRowClassName = this._getRowClassName.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._noContentRenderer = this._noContentRenderer.bind(this)
    this._onColumnsCountChange = this._onColumnsCountChange.bind(this)
    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToColumnChange = this._onScrollToColumnChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._renderBodyCell = this._renderBodyCell.bind(this)
    this._renderCell = this._renderCell.bind(this)
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this)
  }

  render () {
    const { list, ...props } = this.props

    const {
      columnsCount,
      height,
      lockedRowCount,
      lockedColumnCount,
      overscanColumnsCount,
      overscanRowsCount,
      rowHeight,
      rowsCount,
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
            name='columnsCount'
            onChange={this._onColumnsCountChange}
            value={columnsCount}
          />
          <LabeledInput
            label='Num rows'
            name='rowsCount'
            onChange={this._onRowsCountChange}
            value={rowsCount}
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
            label='Locked columns'
            name='lockedColumnCount'
            onChange={event => this.setState({ lockedColumnCount: parseInt(event.target.value, 10) || 0 })}
            value={lockedColumnCount}
          />
          <LabeledInput
            label='Locked rows'
            name='lockedRowCount'
            onChange={event => this.setState({ lockedRowCount: parseInt(event.target.value, 10) || 0 })}
            value={lockedRowCount}
          />
          <LabeledInput
            label='Overscan columns'
            name='overscanColumnsCount'
            onChange={event => this.setState({ overscanColumnsCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanColumnsCount}
          />
          <LabeledInput
            label='Overscan rows'
            name='overscanRowsCount'
            onChange={event => this.setState({ overscanRowsCount: parseInt(event.target.value, 10) || 0 })}
            value={overscanRowsCount}
          />
        </InputRow>

        <AutoSizer disableHeight>
          {({ width }) => (
            <Grid
              className={styles.BodyGrid}
              columnWidth={this._getColumnWidth}
              columnsCount={columnsCount}
              height={height}
              rowsLocked={lockedRowCount}
              columnsLocked={lockedColumnCount}
              noContentRenderer={this._noContentRenderer}
              overscanColumnsCount={overscanColumnsCount}
              overscanRowsCount={overscanRowsCount}
              renderCell={this._renderCell}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowsCount={rowsCount}
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
              width={width}
            />
          )}
        </AutoSizer>
      </ContentBox>
    )
  }

  _getColumnWidth (index) {
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

  _getRowHeight (index) {
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
        content = `${rowIndex}, ${columnIndex}`
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

  _renderCell ({ columnIndex, rowIndex }) {
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

  _onColumnsCountChange (event) {
    const columnsCount = parseInt(event.target.value, 10) || 0

    this.setState({ columnsCount })
  }

  _onRowsCountChange (event) {
    const rowsCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowsCount })
  }

  _onScrollToColumnChange (event) {
    const { columnsCount } = this.state
    let scrollToColumn = Math.min(columnsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToColumn)) {
      scrollToColumn = undefined
    }

    this.setState({ scrollToColumn })
  }

  _onScrollToRowChange (event) {
    const { rowsCount } = this.state
    let scrollToRow = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToRow)) {
      scrollToRow = undefined
    }

    this.setState({ scrollToRow })
  }
}
