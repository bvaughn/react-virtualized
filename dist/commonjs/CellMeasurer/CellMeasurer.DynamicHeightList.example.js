"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var _List = _interopRequireDefault(require("../List"));

var _CellMeasurerExample = _interopRequireDefault(require("./CellMeasurer.example.css"));

var DynamicHeightList =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(DynamicHeightList, _React$PureComponent);

  function DynamicHeightList(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, DynamicHeightList);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DynamicHeightList).call(this, props, context));
    _this._cache = new _CellMeasurerCache["default"]({
      fixedWidth: true,
      minHeight: 50
    });
    _this._rowRenderer = _this._rowRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(DynamicHeightList, [{
    key: "render",
    value: function render() {
      var width = this.props.width;
      return React.createElement(_List["default"], {
        className: _CellMeasurerExample["default"].BodyGrid,
        deferredMeasurementCache: this._cache,
        height: 400,
        overscanRowCount: 0,
        rowCount: 1000,
        rowHeight: this._cache.rowHeight,
        rowRenderer: this._rowRenderer,
        width: width
      });
    }
  }, {
    key: "_rowRenderer",
    value: function _rowRenderer(_ref) {
      var index = _ref.index,
          key = _ref.key,
          parent = _ref.parent,
          style = _ref.style;
      var _this$props = this.props,
          getClassName = _this$props.getClassName,
          list = _this$props.list;
      var datum = list.get(index % list.size);
      var classNames = getClassName({
        columnIndex: 0,
        rowIndex: index
      });
      var imageWidth = 300;
      var imageHeight = datum.size * (1 + index % 3);
      var source = "https://www.fillmurray.com/".concat(imageWidth, "/").concat(imageHeight);
      return React.createElement(_CellMeasurer["default"], {
        cache: this._cache,
        columnIndex: 0,
        key: key,
        rowIndex: index,
        parent: parent
      }, function (_ref2) {
        var measure = _ref2.measure,
            registerChild = _ref2.registerChild;
        return React.createElement("div", {
          ref: registerChild,
          className: classNames,
          style: style
        }, React.createElement("img", {
          onLoad: measure,
          src: source,
          style: {
            width: imageWidth
          }
        }));
      });
    }
  }]);
  return DynamicHeightList;
}(React.PureComponent);

exports["default"] = DynamicHeightList;
DynamicHeightList.propTypes = process.env.NODE_ENV !== "production" ? {
  getClassName: _propTypes["default"].func.isRequired,
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired,
  width: _propTypes["default"].number.isRequired
} : {};