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
      rowHeight: 40,
      rowsCount: 1000,
      scrollToColumn: undefined,
      scrollToRow: undefined,
      useDynamicRowHeights: false
    }

    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._getRowClassName = this._getRowClassName.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._noContentRenderer = this._noContentRenderer.bind(this)
    this._onColumnsCountChange = this._onColumnsCountChange.bind(this)
    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToColumnChange = this._onScrollToColumnChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._renderCell = this._renderCell.bind(this)
  }

  render () {
    const {
      columnsCount,
      height,
      rowHeight,
      rowsCount,
      scrollToColumn,
      scrollToRow,
      useDynamicRowHeights
    } = this.state

    return (
      <ContentBox {...this.props}>
        <ContentBoxHeader
          text='Grid'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md'
        />

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              className={styles.checkbox}
              type='checkbox'
              value={useDynamicRowHeights}
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
            label='Row height'
            name='rowHeight'
            onChange={event => this.setState({ rowHeight: parseInt(event.target.value, 10) || 1 })}
            value={rowHeight}
          />
        </InputRow>

        <div>
        <AutoSizer disableHeight>
          <Grid
            ref='Grid'
            className={styles.Grid}
            columnWidth={this._getColumnWidth}
            columnsCount={columnsCount}
            height={height}
            noContentRenderer={this._noContentRenderer}
            renderCell={this._renderCell}
            rowHeight={useDynamicRowHeights ? this._getRowHeight : rowHeight}
            rowsCount={rowsCount}
            scrollToColumn={scrollToColumn}
            scrollToRow={scrollToRow}
            width={0}
          />
        </AutoSizer>
        </div>
      </ContentBox>
    )
  }

  _getColumnWidth (index) {
    switch (index) {
      case 0:
        return 40
      case 1:
        return 100
      case 2:
        return 300
      default:
        return 50
    }
  }

  _getRowClassName (row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _getRowHeight (index) {
    const { list } = this.props
    return list.get(index).size
  }

  _noContentRenderer () {
    return (
      <div className={styles.noCells}>
        No cells
      </div>
    )
  }

  _renderCell ({ columnIndex, rowIndex }) {
    const { list } = this.props
    const rowClass = this._getRowClassName(rowIndex)
    const datum = list.get(rowIndex)

    let content

    switch (columnIndex) {
      case 0:
        content = datum.name.charAt(0)
        break
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
      [styles.centeredCell]: columnIndex > 2,
      [styles.letterCell]: columnIndex === 0
    })
    const style = columnIndex === 0
      ? { backgroundColor: datum.color }
      : {}

    return (
      <div
        className={classNames}
        style={style}
      >
        {content}
      </div>
    )
  }

  _updateUseDynamicRowHeights (value) {
    this.setState({
      useDynamicRowHeights: value
    })
  }

  _onColumnsCountChange (event) {
    let columnsCount = parseInt(event.target.value, 10) || 0
    columnsCount = Math.max(0, Math.min(this.props.list.size, columnsCount))

    this.setState({ columnsCount })
  }

  _onRowsCountChange (event) {
    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this.props.list.size, rowsCount))

    this.setState({ rowsCount })
  }

  _onScrollToColumnChange (event) {
    const { columnsCount, scrollToRow } = this.state
    let scrollToColumn = Math.min(columnsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToColumn)) {
      scrollToColumn = undefined
    }

    this.setState({ scrollToColumn })

    this.refs.Grid.scrollToCell({ scrollToColumn, scrollToRow })
  }

  _onScrollToRowChange (event) {
    const { scrollToColumn, rowsCount } = this.state
    let scrollToRow = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToRow)) {
      scrollToRow = undefined
    }

    this.setState({ scrollToRow })

    this.refs.Grid.scrollToCell({ scrollToColumn, scrollToRow })
  }
}
