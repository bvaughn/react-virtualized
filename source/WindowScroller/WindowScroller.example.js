// @flow

import clsx from 'clsx';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';
import WindowScroller from './WindowScroller';
import List from '../List';
import AutoSizer from '../AutoSizer';
import styles from './WindowScroller.example.css';

type State = {
  scrollToIndex: number,
  showHeaderText: boolean,
};

export default class WindowScrollerExample extends React.PureComponent<
  {},
  State,
> {
  static contextTypes = {
    customElement: PropTypes.any,
    isScrollingCustomElement: PropTypes.bool.isRequired,
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    setScrollingCustomElement: PropTypes.func,
  };

  state = {
    scrollToIndex: -1,
    showHeaderText: true,
  };

  _windowScroller: ?WindowScroller;

  render() {
    const {customElement, isScrollingCustomElement, list} = this.context;
    const {scrollToIndex, showHeaderText} = this.state;

    return (
      <ContentBox>
        <ContentBoxHeader
          text="WindowScroller"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/WindowScroller/WindowScroller.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md"
        />

        {showHeaderText && (
          <ContentBoxParagraph>
            This component decorates <code>List</code>, <code>Table</code>, or
            any other component and manages the window scroll to scroll through
            the list
          </ContentBoxParagraph>
        )}

        {showHeaderText && (
          <ContentBoxParagraph>
            <button onClick={this._hideHeader}>Hide header text</button>
          </ContentBoxParagraph>
        )}

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Use custom element for scrolling"
              className={styles.checkbox}
              type="checkbox"
              checked={isScrollingCustomElement}
              onChange={this._onCheckboxChange}
            />
            Use custom element for scrolling
          </label>
        </ContentBoxParagraph>
        <InputRow>
          <LabeledInput
            label="Scroll to"
            name="onScrollToRow"
            placeholder="Index..."
            onChange={this._onScrollToRowChange}
            value={scrollToIndex || ''}
          />
        </InputRow>

        <WindowScroller
          ref={this._setRef}
          scrollElement={isScrollingCustomElement ? customElement : window}>
          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
            <div className={styles.WindowScrollerWrapper}>
              <AutoSizer disableHeight>
                {({width}) => (
                  <div ref={registerChild}>
                    <List
                      ref={el => {
                        window.listEl = el;
                      }}
                      autoHeight
                      className={styles.List}
                      height={height}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      overscanRowCount={2}
                      rowCount={list.size}
                      rowHeight={30}
                      rowRenderer={this._rowRenderer}
                      scrollToIndex={scrollToIndex}
                      scrollTop={scrollTop}
                      width={width}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          )}
        </WindowScroller>
      </ContentBox>
    );
  }

  _hideHeader = () => {
    const {showHeaderText} = this.state;

    this.setState(
      {
        showHeaderText: !showHeaderText,
      },
      () => {
        if (this._windowScroller) {
          this._windowScroller.updatePosition();
        }
      },
    );
  };

  _rowRenderer = ({index, isScrolling, isVisible, key, style}) => {
    const {list} = this.context;
    const row = list.get(index);
    const className = clsx(styles.row, {
      [styles.rowScrolling]: isScrolling,
      isVisible: isVisible,
    });

    return (
      <div key={key} className={className} style={style}>
        {row.name}
      </div>
    );
  };

  _setRef = windowScroller => {
    this._windowScroller = windowScroller;
  };

  _onCheckboxChange = event => {
    this.context.setScrollingCustomElement(event.target.checked);
  };

  _onScrollToRowChange = event => {
    const {list} = this.context;
    let scrollToIndex = Math.min(
      list.size - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    setTimeout(() => {
      this.setState({scrollToIndex});
    }, 0);
  };
}
