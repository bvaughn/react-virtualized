/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from '../AutoSizer'
import CellMeasurer from './CellMeasurer'
import CellMeasurerCache from './CellMeasurerCache'
import Grid from '../Grid'
import List from '../List'
import { Column, Table } from '../Table'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import { findDOMNode } from 'react-dom'
import styles from './CellMeasurer.example.css'

const COLUMN_COUNT = 50
const COLUMN_WIDTH = 150
const HEIGHT = 400
const ROW_COUNT = 50
const ROW_HEIGHT = 35

export default class CellMeasurerExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      currentTab: 0
    }

    this._onClick = this._onClick.bind(this)
  }

  render () {
    const { list } = this.context
    const { currentTab } = this.state

    const buttonProps = {
      currentTab,
      onClick: this._onClick
    }

    const DemoComponent = demoComponents[currentTab]

    return (
      <ContentBox>
        <ContentBoxHeader
          text='CellMeasurer'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md'
        />

        <ContentBoxParagraph>
          This component can be used to just-in-time measure dynamic content (eg. messages in a chat interface).
        </ContentBoxParagraph>

        <AutoSizer disableHeight>
          {({ width }) => (
            <div style={{ width }}>
              <div>
                <strong>Grid</strong>:
                <Tab id={0} {...buttonProps}>dynamic width text</Tab>
                <Tab id={1} {...buttonProps}>dynamic height text</Tab>

                <strong>List</strong>:
                <Tab id={2} {...buttonProps}>dynamic height image</Tab>

                <strong>Table</strong>:
                <Tab id={3} {...buttonProps}>mixed fixed and dynamic height text</Tab>
              </div>

              <DemoComponent
                list={list}
                width={width}
              />
            </div>
          )}
        </AutoSizer>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _onClick (id) {
    this.setState({
      currentTab: id
    })
  }
}

function getClassName ({ columnIndex, rowIndex }) {
  const rowClass = rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow

  return cn(rowClass, styles.cell, {
    [styles.centeredCell]: columnIndex > 2
  })
}

function getContent ({ index, datum, long = true }) {
  switch (index % 3) {
    case 0:
      return datum.color
    case 1:
      return datum.name
    case 2:
      return long ? datum.randomLong : datum.random
  }
}

function Tab ({ children, currentTab, id, onClick }) {
  const classNames = cn(styles.Tab, {
    [styles.ActiveTab]: currentTab === id
  })

  return (
    <button
      className={classNames}
      onClick={() => onClick(id)}
    >
      {children}
    </button>
  )
}

class DynamicWidthGrid extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cache = new CellMeasurerCache({
      defaultHeight: ROW_HEIGHT,
      fixedHeight: true
    })

    this._cellRenderer = this._cellRenderer.bind(this)
  }

  render () {
    const { width } = this.props

    return (
      <Grid
        className={styles.BodyGrid}
        columnCount={1000}
        columnWidth={this._cache.columnWidth}
        deferredMeasurementCache={this._cache}
        height={HEIGHT}
        overscanColumnCount={0}
        overscanRowCount={2}
        cellRenderer={this._cellRenderer}
        rowCount={ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        width={width}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ columnIndex, key, parent, rowIndex, style }) {
    const { list } = this.props

    const datum = list.get(rowIndex + columnIndex % list.size)
    const classNames = getClassName({ columnIndex, rowIndex })
    const content = getContent({ index: columnIndex, datum, long: false })

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={classNames}
          style={{
            ...style,
            height: ROW_HEIGHT,
            whiteSpace: 'nowrap'
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }
}

class DynamiHeightGrid extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cache = new CellMeasurerCache({
      defaultWidth: COLUMN_WIDTH,
      fixedWidth: true
    })

    this._cellRenderer = this._cellRenderer.bind(this)
  }

  render () {
    const { width } = this.props

    return (
      <Grid
        className={styles.BodyGrid}
        columnCount={COLUMN_COUNT}
        columnWidth={COLUMN_WIDTH}
        deferredMeasurementCache={this._cache}
        height={HEIGHT}
        overscanColumnCount={0}
        overscanRowCount={2}
        cellRenderer={this._cellRenderer}
        rowCount={1000}
        rowHeight={this._cache.rowHeight}
        width={width}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ columnIndex, key, parent, rowIndex, style }) {
    const { list } = this.props

    const datum = list.get(rowIndex + columnIndex % list.size)
    const classNames = getClassName({ columnIndex, rowIndex })
    const content = getContent({ index: rowIndex, datum })

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={classNames}
          style={{
            ...style,
            width: COLUMN_WIDTH
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }
}

class DynamicHeightList extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 50
    })

    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { width } = this.props

    return (
      <List
        className={styles.BodyGrid}
        deferredMeasurementCache={this._cache}
        height={HEIGHT}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this._rowRenderer}
        width={width}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _rowRenderer ({ index, isScrolling, key, parent, style }) {
    const { list } = this.props

    const datum = list.get(index % list.size)
    const classNames = getClassName({ columnIndex: 0, rowIndex: index })

    const imageWidth = 300
    const imageHeight = datum.size

    const source = `http://lorempixel.com/${imageWidth}/${imageHeight}/`

     return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div
            className={classNames}
            style={{
              ...style,
              height: 'auto'
            }}
          >
            <img
              onLoad={measure}
              src={source}
              style={{
                width: imageWidth
              }}
            />
          </div>
        )}
      </CellMeasurer>
    )
  }
}

class DynamicHeightTableColumn extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 25
    })

    this._columnCellRenderer = this._columnCellRenderer.bind(this)
    this._rowGetter = this._rowGetter.bind(this)
  }

  render () {
    const { width } = this.props

    return (
      <Table
        deferredMeasurementCache={this._cache}
        headerHeight={20}
        height={HEIGHT}
        overscanRowCount={2}
        rowClassName={styles.tableRow}
        rowHeight={this._cache.rowHeight}
        rowGetter={this._rowGetter}
        rowCount={1000}
        width={width}
      >
        <Column
          className={styles.tableColumn}
          dataKey='name'
          label='Name'
          width={125}
        />
        <Column
          className={styles.tableColumn}
          dataKey='color'
          label='Color'
          width={75}
        />
        <Column
          width={width - 200}
          dataKey='random'
          label='Dyanmic text'
          cellRenderer={this._columnCellRenderer}
        />
      </Table>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _columnCellRenderer ({ cellData, columnData, dataKey, parent, rowData, rowIndex }) {
    const { list } = this.props

    const datum = list.get(rowIndex % list.size)
    const content = rowIndex % 5 === 0
      ? ''
      : datum.randomLong

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          className={styles.tableColumn}
          style={{
            whiteSpace: 'normal'
          }}
        >
          {content}
        </div>
      </CellMeasurer>
    )
  }

  _rowGetter ({ index }) {
    const { list } = this.props

    return list.get(index % list.size)
  }
}

const demoComponents = [
  DynamicWidthGrid,
  DynamiHeightGrid,
  DynamicHeightList,
  DynamicHeightTableColumn
]
