/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from './AutoSizer'
import VirtualScroll from '../VirtualScroll'
import shouldPureComponentUpdate from 'react-pure-render/function'
import styles from './AutoSizer.example.css'

export default class AutoSizerExample extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      hideDescription: false
    }

    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { hideDescription } = this.state
    const { list } = this.props

    return (
      <ContentBox
        {...this.props}
        style={{
          height: 400
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
          <AutoSizer>
            <VirtualScroll
              className={styles.VirtualScroll}
              height={0}
              rowsCount={list.size}
              rowHeight={30}
              rowRenderer={this._rowRenderer}
            />
          </AutoSizer>
        </div>
      </ContentBox>
    )
  }

  _rowRenderer (index) {
    const { list } = this.props
    const row = list.get(index)

    return (
      <div
        key={index}
        className={styles.row}
        style={{ height: 30 }}
      >
        {row.name}
      </div>
    )
  }
}
