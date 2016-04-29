/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import AutoSizer from './AutoSizer'
import VirtualScroll from '../VirtualScroll'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './AutoSizer.example.css'

export default class AutoSizerExample extends Component {
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
    const { list, ...props } = this.props

    return (
      <ContentBox
        {...props}
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
              aria-label='Hide description (to show resize)?'
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
            {({ width, height }) => (
              <VirtualScroll
                className={styles.VirtualScroll}
                height={height}
                rowCount={list.size}
                rowHeight={30}
                rowRenderer={this._rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
