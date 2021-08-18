import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache from './CellMeasurerCache';
import { Column, Table } from '../Table';
import styles from './CellMeasurer.example.css';

var DynamicHeightTableColumn =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(DynamicHeightTableColumn, _React$PureComponent);

  function DynamicHeightTableColumn() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DynamicHeightTableColumn);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DynamicHeightTableColumn)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_cache", new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 25
    }));

    _defineProperty(_assertThisInitialized(_this), "_lastRenderedWidth", _this.props.width);

    _defineProperty(_assertThisInitialized(_this), "_columnCellRenderer", function (_ref) {
      var dataKey = _ref.dataKey,
          parent = _ref.parent,
          rowIndex = _ref.rowIndex;
      var list = _this.props.list;
      var datum = list.get(rowIndex % list.size);
      var content = rowIndex % 5 === 0 ? '' : datum.randomLong;
      return React.createElement(CellMeasurer, {
        cache: _this._cache,
        columnIndex: 0,
        key: dataKey,
        parent: parent,
        rowIndex: rowIndex
      }, React.createElement("div", {
        className: styles.tableColumn,
        style: {
          whiteSpace: 'normal'
        }
      }, content));
    });

    _defineProperty(_assertThisInitialized(_this), "_rowGetter", function (_ref2) {
      var index = _ref2.index;
      var list = _this.props.list;
      return list.get(index % list.size);
    });

    return _this;
  }

  _createClass(DynamicHeightTableColumn, [{
    key: "render",
    value: function render() {
      var width = this.props.width;

      if (this._lastRenderedWidth !== this.props.width) {
        this._lastRenderedWidth = this.props.width;

        this._cache.clearAll();
      }

      return React.createElement(Table, {
        deferredMeasurementCache: this._cache,
        headerHeight: 20,
        footerHeight: 20,
        height: 400,
        overscanRowCount: 2,
        rowClassName: styles.tableRow,
        rowHeight: this._cache.rowHeight,
        rowGetter: this._rowGetter,
        rowCount: 1000,
        width: width
      }, React.createElement(Column, {
        className: styles.tableColumn,
        dataKey: "name",
        label: "Name",
        width: 125
      }), React.createElement(Column, {
        className: styles.tableColumn,
        dataKey: "color",
        label: "Color",
        width: 75
      }), React.createElement(Column, {
        width: width - 200,
        dataKey: "random",
        label: "Dynamic text",
        cellRenderer: this._columnCellRenderer
      }));
    }
  }]);

  return DynamicHeightTableColumn;
}(React.PureComponent);

export { DynamicHeightTableColumn as default };
DynamicHeightTableColumn.propTypes = process.env.NODE_ENV !== "production" ? {
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  width: PropTypes.number.isRequired
} : {};