/** @flow */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from './AutoSizer'
import VirtualScroll from '../VirtualScroll'
import styles from './AutoSizer.example.css'

export default class AutoSizerExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hideDescription: false
    }
  }

  render () {
    const { hideDescription } = this.state

    return (
      <ContentBox
         {...this.props}
        style={{
          maxHeight: 600
        }}
      >
        <ContentBoxHeader
          text='AutoSizer'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/AutoSizer/AutoSizer.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md'
        />

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              className={styles.checkbox}
              type='checkbox'
              value={hideDescription}
              onChange={event => this.setState({ hideDescription: event.target.checked })}
            />
            Hide description (to show resize)?
          </label>
        </ContentBoxParagraph>

        {!hideDescription &&
          <ContentBoxParagraph>
            This component decorates <code>VirtualScroll</code>, <code>FlexTable</code>, or any other component and automatically manages its width and height.
            It uses Sebastian Decima's <a href='https://github.com/sdecima/javascript-detect-element-resize' target='_blank'>element resize event</a> to determine the appropriate size.
            In this example <code>AutoSizer</code> grows to fill the remaining width and height of this flex column.
          </ContentBoxParagraph>
        }

        <div className={styles.AutoSizerWrapper}>
          <AutoSizer className={styles.AutoSizer}>
            <VirtualScroll
              height={0}
              noRowsRenderer={() => (
                <div className={styles.Empty}>
                  Empty &nbsp; <code>VirtualScroll</code>
                </div>
              )}
              rowsCount={0}
              rowHeight={1}
              rowRenderer={() => {}}
            />
          </AutoSizer>
        </div>
      </ContentBox>
    )
  }
}
