"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _immutable = _interopRequireDefault(require("immutable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _CellMeasurer = _interopRequireDefault(require("./CellMeasurer"));

var _CellMeasurerCache = _interopRequireDefault(require("./CellMeasurerCache"));

var _Grid = _interopRequireDefault(require("../Grid"));

var _CellMeasurerExample = _interopRequireDefault(require("./CellMeasurer.example.css"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DynamicHeightGrid =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(DynamicHeightGrid, _React$PureComponent);

  function DynamicHeightGrid(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, DynamicHeightGrid);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DynamicHeightGrid).call(this, props, context));
    _this._cache = new _CellMeasurerCache["default"]({
      defaultWidth: 150,
      fixedWidth: true
    });
    _this._cellRenderer = _this._cellRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(DynamicHeightGrid, [{
    key: "render",
    value: function render() {
      var width = this.props.width;
      return React.createElement(_Grid["default"], {
        className: _CellMeasurerExample["default"].BodyGrid,
        columnCount: 50,
        columnWidth: 150,
        deferredMeasurementCache: this._cache,
        height: 400,
        overscanColumnCount: 0,
        overscanRowCount: 2,
        cellRenderer: this._cellRenderer,
        rowCount: 1000,
        rowHeight: this._cache.rowHeight,
        width: width
      });
    }
  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref) {
      var columnIndex = _ref.columnIndex,
          key = _ref.key,
          parent = _ref.parent,
          rowIndex = _ref.rowIndex,
          style = _ref.style;
      var _this$props = this.props,
          getClassName = _this$props.getClassName,
          getContent = _this$props.getContent,
          list = _this$props.list;
      var datum = list.get((rowIndex + columnIndex) % list.size);
      var classNames = getClassName({
        columnIndex: columnIndex,
        rowIndex: rowIndex
      });
      var content = getContent({
        index: rowIndex,
        datum: datum
      });
      return React.createElement(_CellMeasurer["default"], {
        cache: this._cache,
        columnIndex: columnIndex,
        key: key,
        parent: parent,
        rowIndex: rowIndex
      }, React.createElement("div", {
        className: classNames,
        style: _objectSpread({}, style, {
          width: 150
        })
      }, content));
    }
  }]);
  return DynamicHeightGrid;
}(React.PureComponent);

exports["default"] = DynamicHeightGrid;
DynamicHeightGrid.propTypes = process.env.NODE_ENV !== "production" ? {
  getClassName: _propTypes["default"].func.isRequired,
  getContent: _propTypes["default"].func.isRequired,
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired,
  width: _propTypes["default"].number.isRequired
} : {};