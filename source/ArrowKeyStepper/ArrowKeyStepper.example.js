/** @flow */

import React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import ArrowKeyStepper, {type ScrollIndices} from './';
import AutoSizer from '../AutoSizer';
import Grid from '../Grid';
import cn from 'classnames';
import styles from './ArrowKeyStepper.example.css';

type State = {
  mode: 'edges' | 'cells',
  isClickable: boolean,
  scrollToColumn: number,
  scrollToRow: number,
};

export default class ArrowKeyStepperExample extends React.PureComponent<
  {},
  State,
> {
  state = {
    mode: 'edges',
    isClickable: true,
    scrollToColumn: 0,
    scrollToRow: 0,
  };

  render() {
    const {mode, isClickable, scrollToColumn, scrollToRow} = this.state;

    return (
      <ContentBox>
        <ContentBoxHeader
          text="ArrowKeyStepper"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md"
        />

        <ContentBoxParagraph>
          This high-order component decorates a <code>List</code>,{' '}
          <code>Table</code>, or <code>Grid</code> and responds to arrow-key
          events by scrolling one row or column at a time. Focus in the `Grid`
          below and use the left, right, up, or down arrow keys to move around
          within the grid.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          Note that unlike the other HOCs in react-virtualized, the{' '}
          <code>ArrowKeyStepper</code> adds a <code>&lt;div&gt;</code> element
          around its children in order to attach a key-down event handler.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <strong>mode</strong>:
          <label>
            <input
              aria-label="Set mode equal to &quot;cells&quot;"
              checked={mode === 'cells'}
              className={styles.Radio}
              type="radio"
              onChange={event =>
                event.target.checked && this.setState({mode: 'cells'})
              }
              value="cells"
            />
            cells
          </label>
          <label>
            <input
              aria-label="Set mode equal to &quot;edges&quot;"
              checked={mode === 'edges'}
              className={styles.Radio}
              type="radio"
              onChange={event =>
                event.target.checked && this.setState({mode: 'edges'})
              }
              value="edges"
            />
            edges (default)
          </label>
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Enable click selection? (resets selection)"
              className={styles.checkbox}
              type="checkbox"
              checked={isClickable}
              onChange={this._onClickableChange}
            />
            Enable click selection? (resets selection)
          </label>
        </ContentBoxParagraph>

        <ArrowKeyStepper
          columnCount={100}
          isControlled={isClickable}
          onScrollToChange={isClickable ? this._selectCell : undefined}
          mode={mode}
          rowCount={100}
          scrollToColumn={scrollToColumn}
          scrollToRow={scrollToRow}>
          {({onSectionRendered, scrollToColumn, scrollToRow}) => (
            <div>
              <ContentBoxParagraph>
                {`Most-recently-stepped column: ${scrollToColumn}, row: ${scrollToRow}`}
              </ContentBoxParagraph>

              <AutoSizer disableHeight>
                {({width}) => (
                  <Grid
                    className={styles.Grid}
                    columnWidth={this._getColumnWidth}
                    columnCount={100}
                    height={200}
                    onSectionRendered={onSectionRendered}
                    cellRenderer={({columnIndex, key, rowIndex, style}) =>
                      this._cellRenderer({
                        columnIndex,
                        key,
                        rowIndex,
                        scrollToColumn,
                        scrollToRow,
                        style,
                      })
                    }
                    rowHeight={this._getRowHeight}
                    rowCount={100}
                    scrollToColumn={scrollToColumn}
                    scrollToRow={scrollToRow}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </ArrowKeyStepper>
      </ContentBox>
    );
  }

  _getColumnWidth = ({index}: {index: number}) => {
    return (1 + index % 3) * 60;
  };

  _getRowHeight = ({index}: {index: number}) => {
    return (1 + index % 3) * 30;
  };

  _cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    scrollToColumn,
    scrollToRow,
    style,
  }: {
    columnIndex: number,
    key: string,
    rowIndex: number,
    scrollToColumn: number,
    scrollToRow: number,
    style: Object,
  }) => {
    const className = cn(styles.Cell, {
      [styles.FocusedCell]:
        columnIndex === scrollToColumn && rowIndex === scrollToRow,
    });

    return (
      <span
        role="none"
        className={className}
        key={key}
        onClick={
          this.state.isClickable &&
          (() =>
            this._selectCell({
              scrollToColumn: columnIndex,
              scrollToRow: rowIndex,
            }))
        }
        style={style}>
        {`r:${rowIndex}, c:${columnIndex}`}
      </span>
    );
  };

  _selectCell = ({scrollToColumn, scrollToRow}: ScrollIndices) => {
    this.setState({scrollToColumn, scrollToRow});
  };

  _onClickableChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        isClickable: event.target.checked,
        scrollToColumn: 0,
        scrollToRow: 0,
      });
    }
  };
}
