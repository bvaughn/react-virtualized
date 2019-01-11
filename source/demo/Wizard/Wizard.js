import clsx from 'clsx';
import CodeMirror from 'react-codemirror';
import * as React from 'react';
import {ContentBox, ContentBoxHeader} from '../ContentBox';
import generate from './Generator';
import styles from './Wizard.css';

require('codemirror/mode/jsx/jsx');

const codeMirrorOptions = {
  mode: 'jsx',
  theme: 'dracula',
};

// @TODO Clean up this class; it's pretty hacky.
export default class Wizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 0,
      cellsHaveKnownHeight: true,
      cellsHaveKnownWidth: true,
      cellsHaveUniformHeight: true,
      cellsHaveUniformWidth: true,
      collectionHasFixedHeight: false,
      collectionHasFixedWidth: false,
      doNotVirtualizeColumns: false,
      hasMultipleColumns: true,
      hasMultipleRows: true,
      nonCheckerboardPattern: false,
    };
  }

  // TODO Remove this key hack once JedWatson/react-codemirror/issues/106 is fixed
  updateState = obj => this.setState(state => ({...obj, key: state.key + 1}));

  render() {
    const state = this._sanitizeState();
    const markup = generate(state);

    const {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight,
      cellsHaveUniformWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern,
    } = state;

    return (
      <div className={styles.Wrapper}>
        <ContentBox>
          <ContentBoxHeader text="Collection Layout and Sizing" />
          <Option
            checked={hasMultipleRows}
            label="Will your collection have more than 1 row of data?"
            onChange={hasMultipleRows => this.updateState({hasMultipleRows})}
          />
          <Option
            checked={hasMultipleColumns}
            label="Will your collection have more than 1 column of data?"
            onChange={hasMultipleColumns =>
              this.updateState({hasMultipleColumns})
            }
          />
          <Option
            checked={doNotVirtualizeColumns}
            disabled={!hasMultipleColumns}
            label="Should all your columns be visible at once?"
            onChange={doNotVirtualizeColumns =>
              this.updateState({doNotVirtualizeColumns})
            }
          />
          <Option
            checked={nonCheckerboardPattern}
            disabled={!hasMultipleColumns || !hasMultipleRows}
            label="Is your data scattered (not in a checkerboard pattern)?"
            onChange={nonCheckerboardPattern =>
              this.updateState({nonCheckerboardPattern})
            }
          />
          <Option
            disabled={!hasMultipleRows && !hasMultipleColumns}
            checked={collectionHasFixedHeight}
            label="Does your collection have a fixed height?"
            onChange={collectionHasFixedHeight =>
              this.updateState({collectionHasFixedHeight})
            }
          />
          <Option
            disabled={!hasMultipleRows && !hasMultipleColumns}
            checked={collectionHasFixedWidth}
            label="Does your collection have a fixed width?"
            onChange={collectionHasFixedWidth =>
              this.updateState({collectionHasFixedWidth})
            }
          />
        </ContentBox>
        <ContentBox>
          <ContentBoxHeader text="Cell Sizing" />
          <Option
            disabled={
              nonCheckerboardPattern ||
              doNotVirtualizeColumns ||
              !cellsHaveKnownWidth ||
              (!hasMultipleRows && !hasMultipleColumns)
            }
            checked={
              cellsHaveKnownHeight &&
              !nonCheckerboardPattern &&
              !doNotVirtualizeColumns
            }
            label="Do you know the height of your rows ahead of time?"
            onChange={cellsHaveKnownHeight =>
              this.updateState({cellsHaveKnownHeight})
            }
          />
          <Option
            disabled={
              nonCheckerboardPattern ||
              doNotVirtualizeColumns ||
              !cellsHaveKnownHeight ||
              (!hasMultipleRows && !hasMultipleColumns)
            }
            checked={
              cellsHaveKnownWidth &&
              !nonCheckerboardPattern &&
              !doNotVirtualizeColumns
            }
            label="Do you know the width of your columns ahead of time?"
            onChange={cellsHaveKnownWidth =>
              this.updateState({cellsHaveKnownWidth})
            }
          />
          <Option
            checked={cellsHaveUniformHeight}
            disabled={
              !hasMultipleRows ||
              nonCheckerboardPattern ||
              !cellsHaveKnownHeight
            }
            label="Are all of your rows the same height?"
            onChange={cellsHaveUniformHeight =>
              this.updateState({cellsHaveUniformHeight})
            }
          />
          <Option
            checked={cellsHaveUniformWidth}
            disabled={
              !hasMultipleColumns ||
              nonCheckerboardPattern ||
              !cellsHaveKnownWidth
            }
            label="Are all of your columns the same width?"
            onChange={cellsHaveUniformWidth =>
              this.updateState({cellsHaveUniformWidth})
            }
          />
        </ContentBox>
        <ContentBox>
          <ContentBoxHeader text="Suggested Starting Point" />
          <CodeMirror
            options={codeMirrorOptions}
            value={markup}
            key={this.state.key}
          />
        </ContentBox>
      </div>
    );
  }

  _sanitizeState() {
    const {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight,
      cellsHaveUniformWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern,
    } = this.state;

    return {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight:
        cellsHaveUniformHeight &&
        hasMultipleRows &&
        !nonCheckerboardPattern &&
        cellsHaveKnownHeight,
      cellsHaveUniformWidth:
        cellsHaveUniformWidth &&
        hasMultipleColumns &&
        !nonCheckerboardPattern &&
        cellsHaveKnownWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns: doNotVirtualizeColumns && hasMultipleColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern:
        nonCheckerboardPattern && hasMultipleColumns && hasMultipleRows,
    };
  }
}

function Option({checked, disabled = false, label, onChange}) {
  return (
    <div
      className={clsx(styles.Option, {
        [styles.OptionDisabled]: disabled,
      })}>
      <label className={styles.Label}>
        <input
          checked={checked}
          className={styles.Input}
          disabled={disabled}
          onChange={event => onChange(event.target.checked)}
          type="checkbox"
        />
        {label}
      </label>
    </div>
  );
}
