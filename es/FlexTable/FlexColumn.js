'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _class, _temp;

exports.defaultCellRenderer = defaultCellRenderer;
exports.defaultCellDataGetter = defaultCellDataGetter;

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
function defaultCellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
  function _ref(_id) {
    if (!(typeof _id === 'string')) {
      throw new TypeError('Function "defaultCellRenderer" return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id));
    }

    return _id;
  }

  if (!(typeof cellDataKey === 'string')) {
    throw new TypeError('Value of argument "cellDataKey" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(cellDataKey));
  }

  if (!(typeof rowIndex === 'number')) {
    throw new TypeError('Value of argument "rowIndex" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(rowIndex));
  }

  if (cellData === null || cellData === undefined) {
    return _ref('');
  } else {
    return _ref(String(cellData));
  }
}

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
function defaultCellDataGetter(dataKey, rowData, columnData) {
  if (!(typeof dataKey === 'string')) {
    throw new TypeError('Value of argument "dataKey" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dataKey));
  }

  if (rowData.get instanceof Function) {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}

/**
 * Describes the header and cell contents of a table column.
 */
var Column = (_temp = _class = function (_Component) {
  _inherits(Column, _Component);

  function Column() {
    _classCallCheck(this, Column);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Column).apply(this, arguments));
  }

  return Column;
}(_react.Component), _class.defaultProps = {
  cellDataGetter: defaultCellDataGetter,
  cellRenderer: defaultCellRenderer,
  flexGrow: 0,
  flexShrink: 1
}, _class.propTypes = {
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
  /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
  maxWidth: _react.PropTypes.number,
  /** Minimum width of column. */
  minWidth: _react.PropTypes.number,
  /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
  width: _react.PropTypes.number.isRequired
}, _temp);
exports.default = Column;

function _inspect(input) {
  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var first = _inspect(input[0]);

      if (input.every(function (item) {
        return _inspect(item) === first;
      })) {
        return first.trim() + '[]';
      } else {
        return '[' + input.map(_inspect).join(', ') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    var entries = keys.map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }).join('\n  ');

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + entries + '\n}';
    } else {
      return '{ ' + entries + '\n}';
    }
  }
}