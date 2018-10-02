/** @flow */
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';
import {CellMeasurer, CellMeasurerCache} from '../CellMeasurer';
import AutoSizer from '../AutoSizer';
import WindowScroller from '../WindowScroller';
import createCellPositioner from './createCellPositioner';
import Masonry from './Masonry';
import styles from './Masonry.example.css';

export default class GridExample extends React.PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._columnCount = 0;

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true,
    });

    this.state = {
      columnWidth: 200,
      height: 300,
      gutterSize: 10,
      overscanByPixels: 0,
      windowScrollerEnabled: false,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._onResize = this._onResize.bind(this);
    this._renderAutoSizer = this._renderAutoSizer.bind(this);
    this._renderMasonry = this._renderMasonry.bind(this);
    this._setMasonryRef = this._setMasonryRef.bind(this);
  }

  render() {
    const {
      columnWidth,
      height,
      gutterSize,
      overscanByPixels,
      windowScrollerEnabled,
    } = this.state;

    let child;

    if (windowScrollerEnabled) {
      child = (
        <WindowScroller overscanByPixels={overscanByPixels}>
          {this._renderAutoSizer}
        </WindowScroller>
      );
    } else {
      child = this._renderAutoSizer({height});
    }

    return (
      <ContentBox>
        <ContentBoxHeader
          text="Masonry"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/Masonry/Masonry.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/Masonry.md"
        />

        <ContentBoxParagraph>
          Optimized for masonry layouts. Cells are j.i.t. measured and layed out
          as a user scrolls. Sizes are cached so that resize/reflow is fast and
          does not require re-measuring.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Use WindowScroller?"
              checked={windowScrollerEnabled}
              className={styles.checkbox}
              type="checkbox"
              onChange={event => {
                // HACK Because this demo switches between using WindowScroller and not,
                // It's easier to clear the cache when toggling modes to avoid a partially stale state.
                this._cache.clearAll();
                this.setState({
                  windowScrollerEnabled: event.target.checked,
                });
              }}
            />
            Use <code>WindowScroller</code>?
          </label>
          <label className={styles.checkboxLabel}>
            <button onClick={this._resetList}>Reset List Data</button>
          </label>
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label="Height"
            name="height"
            onChange={event => {
              this.setState({
                height: parseInt(event.target.value, 10) || 300,
              });
            }}
            value={height}
          />
          <LabeledInput
            label="Column Width"
            name="columnWidth"
            onChange={event => {
              this._cache.clearAll();
              this.setState(
                {
                  columnWidth: parseInt(event.target.value, 10) || 200,
                },
                () => {
                  this._calculateColumnCount();
                  this._resetCellPositioner();
                  this._masonry.clearCellPositions();
                },
              );
            }}
            value={columnWidth}
          />
          <LabeledInput
            label="Gutter Size"
            name="gutterSize"
            onChange={event => {
              this.setState(
                {
                  gutterSize: parseInt(event.target.value, 10) || 10,
                },
                () => {
                  this._calculateColumnCount();
                  this._resetCellPositioner();
                  this._masonry.recomputeCellPositions();
                },
              );
            }}
            value={gutterSize}
          />
          <LabeledInput
            label="Overscan (px)"
            name="overscanByPixels"
            onChange={event => {
              this.setState({
                overscanByPixels: parseInt(event.target.value, 10) || 0,
              });
            }}
            value={overscanByPixels}
          />
        </InputRow>

        {child}
      </ContentBox>
    );
  }

  _calculateColumnCount() {
    const {columnWidth, gutterSize} = this.state;

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _cellRenderer({index, key, parent, style}) {
    const {list} = this.context;
    const {columnWidth} = this.state;

    const datum = list.get(index % list.size);

    return (
      <CellMeasurer cache={this._cache} index={index} key={key} parent={parent}>
        <div
          className={styles.Cell}
          style={{
            ...style,
            width: columnWidth,
          }}>
          <div
            style={{
              backgroundColor: datum.color,
              borderRadius: '0.5rem',
              height: datum.size * 3,
              marginBottom: '0.5rem',
              width: '100%',
              fontSize: 20,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {index}
          </div>
          {datum.random}
        </div>
      </CellMeasurer>
    );
  }

  _initCellPositioner() {
    if (typeof this._cellPositioner === 'undefined') {
      const {columnWidth, gutterSize} = this.state;

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize,
      });
    }
  }

  _onResize({width}) {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _renderAutoSizer({height, scrollTop}) {
    this._height = height;
    this._scrollTop = scrollTop;

    const {overscanByPixels} = this.state;

    return (
      <AutoSizer
        disableHeight
        height={height}
        onResize={this._onResize}
        overscanByPixels={overscanByPixels}
        scrollTop={this._scrollTop}>
        {this._renderMasonry}
      </AutoSizer>
    );
  }

  _renderMasonry({width}) {
    this._width = width;

    this._calculateColumnCount();
    this._initCellPositioner();

    const {height, overscanByPixels, windowScrollerEnabled} = this.state;

    return (
      <Masonry
        autoHeight={windowScrollerEnabled}
        cellCount={1000}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={windowScrollerEnabled ? this._height : height}
        overscanByPixels={overscanByPixels}
        ref={this._setMasonryRef}
        scrollTop={this._scrollTop}
        width={width}
      />
    );
  }

  // This is a bit of a hack to simulate newly loaded cells
  _resetList = () => {
    const ROW_HEIGHTS = [25, 50, 75, 100];

    const {list} = this.context;
    list.forEach(datum => {
      datum.size = ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)];
    });

    this._cache.clearAll();
    this._resetCellPositioner();
    this._masonry.clearCellPositions();
  };

  _resetCellPositioner() {
    const {columnWidth, gutterSize} = this.state;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize,
    });
  }

  _setMasonryRef(ref) {
    this._masonry = ref;
  }
}
