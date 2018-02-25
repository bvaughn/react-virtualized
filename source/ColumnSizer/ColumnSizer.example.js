/**
 * @flow
 */
import * as React from 'react';
import styles from './ColumnSizer.example.css';
import AutoSizer from '../AutoSizer';
import ColumnSizer from './ColumnSizer';
import Grid from '../Grid';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';

export default class ColumnSizerExample extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnMaxWidth: 100,
      columnMinWidth: 75,
      columnCount: 10,
    };

    this._noColumnMaxWidthChange = this._noColumnMaxWidthChange.bind(this);
    this._noColumnMinWidthChange = this._noColumnMinWidthChange.bind(this);
    this._onColumnCountChange = this._onColumnCountChange.bind(this);
    this._noContentRenderer = this._noContentRenderer.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
  }

  render() {
    const {columnMaxWidth, columnMinWidth, columnCount} = this.state;

    return (
      <ContentBox>
        <ContentBoxHeader
          text="ColumnSizer"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/ColumnSizer/ColumnSizer.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/ColumnSizer.md"
        />

        <ContentBoxParagraph>
          This component decorates a <code>Grid</code> and calculates the width
          of its columns based on the current (<code>Grid</code>) width.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label="Num Columns"
            name="columnCount"
            onChange={this._onColumnCountChange}
            value={columnCount}
          />
          <LabeledInput
            label="Column Min Width"
            name="columnMinWidth"
            onChange={this._noColumnMinWidthChange}
            value={columnMinWidth}
          />
          <LabeledInput
            label="Column Max Width"
            name="columnMaxWidth"
            onChange={this._noColumnMaxWidthChange}
            value={columnMaxWidth}
          />
        </InputRow>

        <div>
          <AutoSizer disableHeight>
            {({width}) => (
              <ColumnSizer
                columnMaxWidth={columnMaxWidth}
                columnMinWidth={columnMinWidth}
                columnCount={columnCount}
                key="GridColumnSizer"
                width={width}>
                {({adjustedWidth, columnWidth, registerChild}) => (
                  <div
                    className={styles.GridContainer}
                    style={{
                      height: 50,
                      width: adjustedWidth,
                    }}>
                    <Grid
                      ref={registerChild}
                      columnWidth={columnWidth}
                      columnCount={columnCount}
                      height={50}
                      noContentRenderer={this._noContentRenderer}
                      cellRenderer={this._cellRenderer}
                      rowHeight={50}
                      rowCount={1}
                      width={adjustedWidth}
                    />
                  </div>
                )}
              </ColumnSizer>
            )}
          </AutoSizer>
        </div>
      </ContentBox>
    );
  }

  _noColumnMaxWidthChange(event) {
    let columnMaxWidth = parseInt(event.target.value, 10);

    if (isNaN(columnMaxWidth)) {
      columnMaxWidth = undefined;
    } else {
      columnMaxWidth = Math.min(1000, columnMaxWidth);
    }

    this.setState({columnMaxWidth});
  }

  _noColumnMinWidthChange(event) {
    let columnMinWidth = parseInt(event.target.value, 10);

    if (isNaN(columnMinWidth)) {
      columnMinWidth = undefined;
    } else {
      columnMinWidth = Math.max(1, columnMinWidth);
    }

    this.setState({columnMinWidth});
  }

  _onColumnCountChange(event) {
    this.setState({columnCount: parseInt(event.target.value, 10) || 0});
  }

  _noContentRenderer() {
    return <div className={styles.noCells}>No cells</div>;
  }

  _cellRenderer({columnIndex, key, rowIndex, style}) {
    const className = columnIndex === 0 ? styles.firstCell : styles.cell;

    return (
      <div className={className} key={key} style={style}>
        {`R:${rowIndex}, C:${columnIndex}`}
      </div>
    );
  }
}
