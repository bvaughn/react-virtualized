import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache from './CellMeasurerCache';
import List from '../List';
import styles from './CellMeasurer.example.css';

export default class DynamicHeightList extends React.PureComponent {
  static propTypes = {
    getClassName: PropTypes.func.isRequired,
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 50,
    });

    this._rowRenderer = this._rowRenderer.bind(this);
  }

  render() {
    const {width} = this.props;

    return (
      <List
        className={styles.BodyGrid}
        deferredMeasurementCache={this._cache}
        height={400}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this._rowRenderer}
        width={width}
      />
    );
  }

  _rowRenderer({index, key, parent, style}) {
    const {getClassName, list} = this.props;

    const datum = list.get(index % list.size);
    const classNames = getClassName({columnIndex: 0, rowIndex: index});

    const imageWidth = 300;
    const imageHeight = datum.size * (1 + index % 3);

    const source = `https://fillmurray.com/${imageWidth}/${imageHeight}`;

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
        {({measure}) => (
          <div className={classNames} style={style}>
            <img
              onLoad={measure}
              src={source}
              style={{
                width: imageWidth,
              }}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }
}
