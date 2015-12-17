/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from './AutoSizer'
import VirtualScroll from '../VirtualScroll'
import styles from './AutoSizer.example.css'

export default class AutoSizerExample extends Component {
  render () {
    return (
      <ContentBox className={styles.AutoSizerExample}>
        <ContentBoxHeader
          text='AutoSizer'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/AutoSizer/AutoSizer.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md'
        />

        <ContentBoxParagraph>
          This component decorates <code>VirtualScroll</code>, <code>FlexTable</code>, or any other component and automatically manages its width and height.
          It uses Sebastian Decima's <a href='https://github.com/sdecima/javascript-detect-element-resize' target='_blank'>element resize event</a> to determine the appropriate size.
          In this example <code>AutoSizer</code> grows to fill the remaining width and height of this flex column.
        </ContentBoxParagraph>

        <div className={styles.AutoSizerWrapper}>
          <AutoSizer
            ChildComponent={VirtualScroll}
            className={styles.AutoSizer}
            noRowsRenderer={() => (
              <div className={styles.Empty}>
                Empty &nbsp; <code>VirtualScroll</code>
              </div>
            )}
            rowsCount={0}
            rowHeight={1}
            rowRenderer={() => {}}
          />
        </div>
      </ContentBox>
    )
  }
}
