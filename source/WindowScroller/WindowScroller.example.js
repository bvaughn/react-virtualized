/** @flow */
import cn from 'classnames'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import WindowScroller from './WindowScroller'
import List from '../List'
import AutoSizer from '../AutoSizer'
import styles from './WindowScroller.example.css'

export default class WindowScrollerExample extends PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    customElement: PropTypes.any,
    isScrollingCustomElement: PropTypes.bool.isRequired,
    setScrollingCustomElement: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      showHeaderText: true,
      scrollToIndex: undefined
    }

    this._hideHeader = this._hideHeader.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
    this._onCheckboxChange = this._onCheckboxChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._setRef = this._setRef.bind(this)
  }

  render () {
    const { list, isScrollingCustomElement, customElement } = this.context
    const { showHeaderText, scrollToIndex } = this.state

    return (
      <ContentBox>
        <ContentBoxHeader
          text='WindowScroller'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/WindowScroller/WindowScroller.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md'
        />

        {showHeaderText && (
          <ContentBoxParagraph>
            This component decorates <code>List</code>, <code>Table</code>, or any other component
            and manages the window scroll to scroll through the list
          </ContentBoxParagraph>
        )}

        {showHeaderText && (
          <ContentBoxParagraph>
            <button onClick={this._hideHeader}>
              Hide header text
            </button>
          </ContentBoxParagraph>
        )}

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label='Use custom element for scrolling'
              className={styles.checkbox}
              type='checkbox'
              checked={isScrollingCustomElement}
              onChange={this._onCheckboxChange}
            />
            Use custom element for scrolling
          </label>
        </ContentBoxParagraph>
        <InputRow>
          <LabeledInput
            label='Scroll to'
            name='onScrollToRow'
            placeholder='Index...'
            onChange={this._onScrollToRowChange}
            value={scrollToIndex || ''}
          />
        </InputRow>
        <div className={styles.WindowScrollerWrapper}>
          <WindowScroller
            ref={this._setRef}
            scrollElement={isScrollingCustomElement ? customElement : null}
          >
            {({ height, isScrolling, scrollTop, onChildScroll }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={(el) => { window.listEl = el }}
                    autoHeight
                    className={styles.List}
                    height={height}
                    isScrolling={isScrolling}
                    overscanRowCount={2}
                    rowCount={list.size}
                    rowHeight={30}
                    rowRenderer={this._rowRenderer}
                    scrollTop={scrollTop}
                    scrollToIndex={scrollToIndex}
                    width={width}
                    onScroll={onChildScroll}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </ContentBox>
    )
  }

  _hideHeader () {
    const { showHeaderText } = this.state

    this.setState({
      showHeaderText: !showHeaderText
    }, () => {
      this._windowScroller.updatePosition()
    })
  }

  _rowRenderer ({ index, isScrolling, isVisible, key, style }) {
    const { list } = this.context
    const row = list.get(index)
    const className = cn(styles.row, {
      [styles.rowScrolling]: isScrolling,
      isVisible: isVisible
    })

    return (
      <div
        key={key}
        className={className}
        style={style}
      >
        <i style={{marginRight: 5}}>{index}</i>{row.name}
      </div>
    )
  }

  _setRef (windowScroller) {
    this._windowScroller = windowScroller
  }

  _onCheckboxChange (event) {
    this.context.setScrollingCustomElement(event.target.checked)
  }

  _onScrollToRowChange (event) {
    const { list } = this.context
    let scrollToIndex = Math.min(list.size - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }
}
