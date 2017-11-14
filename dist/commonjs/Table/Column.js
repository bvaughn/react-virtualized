'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _defaultHeaderRenderer = require('./defaultHeaderRenderer');

var _defaultHeaderRenderer2 = _interopRequireDefault(_defaultHeaderRenderer);

var _defaultCellRenderer = require('./defaultCellRenderer');

var _defaultCellRenderer2 = _interopRequireDefault(_defaultCellRenderer);

var _defaultCellDataGetter = require('./defaultCellDataGetter');

var _defaultCellDataGetter2 = _interopRequireDefault(_defaultCellDataGetter);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Describes the header and cell contents of a table column.
 */
var Column = function (_Component) {
  _inherits(Column, _Component);

  function Column() {
    _classCallCheck(this, Column);

    return _possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).apply(this, arguments));
  }

  return Column;
}(_react.Component);

Column.defaultProps = {
  cellDataGetter: _defaultCellDataGetter2.default,
  cellRenderer: _defaultCellRenderer2.default,
  defaultSortDirection: _SortDirection2.default.ASC,
  flexGrow: 0,
  flexShrink: 1,
  headerRenderer: _defaultHeaderRenderer2.default,
  style: {}
};
exports.default = Column;
Column.propTypes = process.env.NODE_ENV !== "production" ? {
  /** Optional aria-label value to set on the column header */
  'aria-label': _propTypes2.default.string,

  /**
   * Callback responsible for returning a cell's data, given its :dataKey
   * ({ columnData: any, dataKey: string, rowData: any }): any
   */
  cellDataGetter: _propTypes2.default.func,

  /**
   * Callback responsible for rendering a cell's contents.
   * ({ cellData: any, columnData: any, dataKey: string, rowData: any, rowIndex: number }): node
   */
  cellRenderer: _propTypes2.default.func,

  /** Optional CSS class to apply to cell */
  className: _propTypes2.default.string,

  /** Optional additional data passed to this column's :cellDataGetter */
  columnData: _propTypes2.default.object,

  /** Uniquely identifies the row-data attribute corresponding to this cell */
  dataKey: _propTypes2.default.any.isRequired,

  /** Optional direction to be used when clicked the first time */
  defaultSortDirection: _propTypes2.default.oneOf([_SortDirection2.default.ASC, _SortDirection2.default.DESC]),

  /** If sort is enabled for the table at large, disable it for this column */
  disableSort: _propTypes2.default.bool,

  /** Flex grow style; defaults to 0 */
  flexGrow: _propTypes2.default.number,

  /** Flex shrink style; defaults to 1 */
  flexShrink: _propTypes2.default.number,

  /** Optional CSS class to apply to this column's header */
  headerClassName: _propTypes2.default.string,

  /**
   * Optional callback responsible for rendering a column header contents.
   * ({ columnData: object, dataKey: string, disableSort: boolean, label: node, sortBy: string, sortDirection: string }): PropTypes.node
   */
  headerRenderer: _propTypes2.default.func.isRequired,

  /** Optional id to set on the column header */
  id: _propTypes2.default.string,

  /** Header label for this column */
  label: _propTypes2.default.node,

  /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
  maxWidth: _propTypes2.default.number,

  /** Minimum width of column. */
  minWidth: _propTypes2.default.number,

  /** Optional inline style to apply to cell */
  style: _propTypes2.default.object,

  /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
  width: _propTypes2.default.number.isRequired
} : {};