/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import InfiniteLoader from './InfiniteLoader'
import VirtualScroll from '../VirtualScroll'
import styles from './InfiniteLoader.example.css'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

export default class InfiniteLoaderExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loadedRowsMap: {},
      randomScrollToIndex: null
    }

    this._isRowLoaded = this._isRowLoaded.bind(this)
    this._loadMoreRows = this._loadMoreRows.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { list, ...props } = this.props
    const { randomScrollToIndex } = this.state

    // TODO Reset button

    return (
      <ContentBox {...props}>
        <ContentBoxHeader
          text='InfiniteLoader'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/InfiniteLoader/InfiniteLoader.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md'
        />

        <ContentBoxParagraph>
          Coming soon...
        </ContentBoxParagraph>

        <InfiniteLoader
          isRowLoaded={this._isRowLoaded}
          loadMoreRows={this._loadMoreRows}
          rowsCount={list.size}
        >
          <VirtualScroll
            className={styles.VirtualScroll}
            height={300}
            rowsCount={list.size}
            rowHeight={30}
            rowRenderer={this._rowRenderer}
            scrollToIndex={randomScrollToIndex}
          />
        </InfiniteLoader>
      </ContentBox>
    )
  }

  _isRowLoaded (index) {
    const { loadedRowsMap } = this.state
    return !!loadedRowsMap[index]
  }

  _loadMoreRows ({ startIndex, stopIndex }) {
    const { loadedRowsMap } = this.state

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }

    setTimeout(() => {
      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED
      }
    }, 1000) // TODO Randomize time?
  }

  _rowRenderer (index) {
    const { list } = this.props
    const { loadedRowsMap } = this.state

    let content

    if (loadedRowsMap[index] === STATUS_LOADED) {
      const row = list.get(index)
      content = row.name
    } else {
      content = (
        <div
          className={styles.placeholder}
          style={{ width: 100 + Math.round(Math.random() * 100) }}
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
