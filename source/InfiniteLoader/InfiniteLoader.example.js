/** @flow */
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import Immutable from 'immutable'
import AutoSizer from '../AutoSizer'
import InfiniteLoader from './InfiniteLoader'
import VirtualScroll from '../VirtualScroll'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './InfiniteLoader.example.css'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

export default class InfiniteLoaderExample extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
      randomScrollToIndex: null
    }

    this._timeoutIdMap = {}

    this._clearData = this._clearData.bind(this)
    this._isRowLoaded = this._isRowLoaded.bind(this)
    this._loadMoreRows = this._loadMoreRows.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  componentWillUnmount () {
    Object.keys(this._timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId)
    })
  }

  render () {
    const { list, ...props } = this.props
    const { loadedRowCount, loadingRowCount, randomScrollToIndex } = this.state

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='InfiniteLoader'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/InfiniteLoader/InfiniteLoader.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md'
        />

        <ContentBoxParagraph>
          This component manages just-in-time data fetching to ensure that the all visible rows have been loaded.
          It also uses a threshold to determine how early to pre-fetch rows (before a user scrolls to them).
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <div className={styles.cacheButtonAndCountRow}>
            <button
              className={styles.button}
              onClick={this._clearData}
            >
              Flush Cached Data
            </button>

            <div className={styles.cacheCountRow}>
              {`${loadingRowCount} loading, ${loadedRowCount} loaded`}
            </div>
          </div>
        </ContentBoxParagraph>

        <InfiniteLoader
          isRowLoaded={this._isRowLoaded}
          loadMoreRows={this._loadMoreRows}
          rowCount={list.size}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <VirtualScroll
                  ref={registerChild}
                  className={styles.VirtualScroll}
                  height={200}
                  onRowsRendered={onRowsRendered}
                  rowCount={list.size}
                  rowHeight={30}
                  rowRenderer={this._rowRenderer}
                  scrollToIndex={randomScrollToIndex}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _clearData () {
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0
    })
  }

  _isRowLoaded ({ index }) {
    const { loadedRowsMap } = this.state
    return !!loadedRowsMap[index] // STATUS_LOADING or STATUS_LOADED
  }

  _loadMoreRows ({ startIndex, stopIndex }) {
    const { loadedRowsMap, loadingRowCount } = this.state
    const increment = stopIndex - startIndex + 1

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment
    })

    const timeoutId = setTimeout(() => {
      const { loadedRowCount, loadingRowCount } = this.state

      delete this._timeoutIdMap[timeoutId]

      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED
      }

      this.setState({
        loadingRowCount: loadingRowCount - increment,
        loadedRowCount: loadedRowCount + increment
      })

      promiseResolver()
    }, 1000 + Math.round(Math.random() * 2000))

    this._timeoutIdMap[timeoutId] = true

    let promiseResolver

    return new Promise(resolve => {
      promiseResolver = resolve
    })
  }

  _rowRenderer ({ index }) {
    const { list } = this.props
    const { loadedRowsMap } = this.state

    const row = list.get(index)
    let content

    if (loadedRowsMap[index] === STATUS_LOADED) {
      content = row.name
    } else {
      content = (
        <div
          className={styles.placeholder}
          style={{ width: row.size }}
        />
      )
    }

    return (
      <div
        key={index}
        className={styles.row}
        style={{ height: 30 }}
      >
        {content}
      </div>
    )
  }
}
