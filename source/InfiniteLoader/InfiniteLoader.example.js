/** @flow */
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import Immutable from 'immutable'
import AutoSizer from '../AutoSizer'
import InfiniteLoader from './InfiniteLoader'
import VirtualScroll from '../VirtualScroll'
import shouldPureComponentUpdate from 'react-pure-render/function'
import styles from './InfiniteLoader.example.css'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

export default class InfiniteLoaderExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      loadedRowsCount: 0,
      loadedRowsMap: {},
      loadingRowsCount: 0,
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
    const { loadedRowsCount, loadingRowsCount, randomScrollToIndex } = this.state

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
              {`${loadingRowsCount} loading, ${loadedRowsCount} loaded`}
            </div>
          </div>
        </ContentBoxParagraph>

        <AutoSizer disableHeight>
          <InfiniteLoader
            ref='InfiniteLoader'
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this._loadMoreRows}
            rowsCount={list.size}
          >
            <VirtualScroll
              className={styles.VirtualScroll}
              height={200}
              rowsCount={list.size}
              rowHeight={30}
              rowRenderer={this._rowRenderer}
              scrollToIndex={randomScrollToIndex}
              width={0}
            />
          </InfiniteLoader>
        </AutoSizer>
      </ContentBox>
    )
  }

  _clearData () {
    this.setState({
      loadedRowsCount: 0,
      loadedRowsMap: {},
      loadingRowsCount: 0
    })
  }

  _isRowLoaded (index) {
    const { loadedRowsMap } = this.state
    return !!loadedRowsMap[index] // STATUS_LOADING or STATUS_LOADED
  }

  _loadMoreRows ({ startIndex, stopIndex }) {
    const { loadedRowsMap, loadingRowsCount } = this.state
    const increment = stopIndex - startIndex + 1

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }

    this.setState({
      loadingRowsCount: loadingRowsCount + increment
    })

    const timeoutId = setTimeout(() => {
      const { loadedRowsCount, loadingRowsCount } = this.state

      delete this._timeoutIdMap[timeoutId]

      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED
      }

      this.setState({
        loadingRowsCount: loadingRowsCount - increment,
        loadedRowsCount: loadedRowsCount + increment
      })

      promiseResolver()
    }, 1000 + Math.round(Math.random() * 2000))

    this._timeoutIdMap[timeoutId] = true

    let promiseResolver

    return new Promise(resolve => promiseResolver = resolve)
  }

  _rowRenderer (index) {
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
