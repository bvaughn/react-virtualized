/** @flow */
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import MultiGrid from './MultiGrid';
import styles from './MultiGrid.example.css';

const STYLE = {
  border: '1px solid #ddd',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

export default class MultiGridExample extends React.PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._onFixedColumnCountChange = this._createEventHandler(
      'fixedColumnCount',
    );
    this._onFixedRowCountChange = this._createEventHandler('fixedRowCount');
    this._onScrollToColumnChange = this._createEventHandler('scrollToColumn');
    this._onScrollToRowChange = this._createEventHandler('scrollToRow');
  }

  render() {
    return (
      <ContentBox>
        <ContentBoxHeader
          text="MultiGrid"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md"
        />

        <ContentBoxParagraph>
          This component stitches together several grids to provide a fixed
          column/row interface.
        </ContentBoxParagraph>

        <InputRow>
          {this._createLabeledInput(
            'fixedColumnCount',
            this._onFixedColumnCountChange,
          )}
          {this._createLabeledInput(
            'fixedRowCount',
            this._onFixedRowCountChange,
          )}
          {this._createLabeledInput(
            'scrollToColumn',
            this._onScrollToColumnChange,
          )}
          {this._createLabeledInput('scrollToRow', this._onScrollToRowChange)}
        </InputRow>

        <AutoSizer disableHeight>
          {({width}) => (
            <MultiGrid
              {...this.state}
              cellRenderer={this._cellRenderer}
              columnWidth={75}
              columnCount={50}
              enableFixedColumnScroll
              enableFixedRowScroll
              height={300}
              rowHeight={40}
              rowCount={100}
              style={STYLE}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={width}
              hideTopRightGridScrollbar
              hideBottomLeftGridScrollbar
              ScrollWrapper={ColoredScrollbars}
            />
          )}
        </AutoSizer>
      </ContentBox>
    );
  }

  _cellRenderer({columnIndex, key, rowIndex, style}) {
    return (
      <div className={styles.Cell} key={key} style={style}>
        {columnIndex}, {rowIndex}
      </div>
    );
  }

  _createEventHandler(property) {
    return event => {
      const value = parseInt(event.target.value, 10) || 0;

      this.setState({
        [property]: value,
      });
    };
  }

  _createLabeledInput(property, eventHandler) {
    const value = this.state[property];

    return (
      <LabeledInput
        label={property}
        name={property}
        onChange={eventHandler}
        value={value}
      />
    );
  }
}

// Custom scrollbar to showcase

class ColoredScrollbars extends React.Component {
  state = {top: 0};

  handleUpdate = values => {
    const {top} = values;
    this.setState({top});
  };

  renderThumb = ({style, ...props}) => {
    const {top} = this.state;
    const color = Math.round(255 - top * 255);
    const thumbStyle = {
      backgroundColor: `rgb(${color}, ${color}, ${color})`,
    };
    return <div style={{...style, ...thumbStyle}} {...props} />;
  };

  registerRef = node => {
    this.props.innerRef(node.view);
  };

  render() {
    const {innerRef, ...rest} = this.props;
    return (
      <Scrollbars
        ref={this.registerRef}
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        onUpdate={this.handleUpdate}
        {...rest}
      />
    );
  }
}
