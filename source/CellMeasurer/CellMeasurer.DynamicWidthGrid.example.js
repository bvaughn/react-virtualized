import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache from './CellMeasurerCache';
import Grid from '../Grid';
import styles from './CellMeasurer.example.css';

export default class DynamicWidthGrid extends React.PureComponent {
  static propTypes = {
    getClassName: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._cache = new CellMeasurerCache({
      defaultWidth: 100,
      fixedHeight: true,
    });

    this._cellRenderer = this._cellRenderer.bind(this);
  }

  render() {
    const {width} = this.props;

    return (
      <Grid
        className={styles.BodyGrid}
        columnCount={1000}
        columnWidth={this._cache.columnWidth}
        deferredMeasurementCache={this._cache}
        height={400}
        overscanColumnCount={0}
        overscanRowCount={2}
        cellRenderer={this._cellRenderer}
        rowCount={50}
        rowHeight={35}
        width={width}
      />
    );
  }

  _cellRenderer({columnIndex, key, parent, rowIndex, style}) {
    const {getClassName, getContent, list} = this.props;

    const datum = list.get((rowIndex + columnIndex) % list.size);
    const classNames = getClassName({columnIndex, rowIndex});
    const content = getContent({index: columnIndex, datum, long: false});

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}>
        <div
          className={classNames}
          style={{
            ...style,
            height: 35,
            whiteSpace: 'nowrap',
          }}>
          {content}
        </div>
      </CellMeasurer>
    );
  }
}
