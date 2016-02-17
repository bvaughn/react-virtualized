'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.defaultCellRenderer = defaultCellRenderer;
exports.defaultCellDataGetter = defaultCellDataGetter;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */

function defaultCellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
  if (cellData === null || cellData === undefined) {
    return '';
  } else {
    return String(cellData);
  }
}

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */

function defaultCellDataGetter(dataKey, rowData, columnData) {
  if (rowData.get instanceof Function) {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}

/**
 * Describes the header and cell contents of a table column.
 */

var Column = (function (_Component) {
  _inherits(Column, _Component);

  function Column() {
    _classCallCheck(this, Column);

    _get(Object.getPrototypeOf(Column.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Column, null, [{
    key: 'defaultProps',
    value: {
      cellDataGetter: defaultCellDataGetter,
      cellRenderer: defaultCellRenderer,
      flexGrow: 0,
      flexShrink: 1
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      /** Optional CSS class to apply to cell */
      cellClassName: _react.PropTypes.string,
      /**
       * Callback responsible for returning a cell's data, given its :dataKey
       * (dataKey: string, rowData: any): any
       */
      cellDataGetter: _react.PropTypes.func,
      /**
       * Callback responsible for rendering a cell's contents.
       * (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
       */
      cellRenderer: _react.PropTypes.func,
      /** Optional additional data passed to this column's :cellDataGetter */
      columnData: _react.PropTypes.object,
      /** Uniquely identifies the row-data attribute correspnding to this cell */
      dataKey: _react.PropTypes.any.isRequired,
      /** If sort is enabled for the table at large, disable it for this column */
      disableSort: _react.PropTypes.bool,
      /** Flex grow style; defaults to 0 */
      flexGrow: _react.PropTypes.number,
      /** Flex shrink style; defaults to 1 */
      flexShrink: _react.PropTypes.number,
      /** Optional CSS class to apply to this column's header */
      headerClassName: _react.PropTypes.string,
      /** Header label for this column */
      label: _react.PropTypes.string,
      /** Optional fixed width for this column */
      width: _react.PropTypes.number.isRequired
    },
    enumerable: true
  }]);

  return Column;
})(_react.Component);

exports['default'] = Column;