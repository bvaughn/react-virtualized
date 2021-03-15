'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var _immutable = _interopRequireDefault(require('immutable'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var React = _interopRequireWildcard(require('react'));

var _CellMeasurer = _interopRequireDefault(require('./CellMeasurer'));

var _CellMeasurerCache = _interopRequireDefault(require('./CellMeasurerCache'));

var _Table = require('../Table');

var _CellMeasurerExample = _interopRequireDefault(
  require('./CellMeasurer.example.css'),
);

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function() {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

var DynamicHeightTableColumn = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(DynamicHeightTableColumn, _React$PureComponent);

  var _super = _createSuper(DynamicHeightTableColumn);

  function DynamicHeightTableColumn() {
    var _this;

    (0, _classCallCheck2['default'])(this, DynamicHeightTableColumn);

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2['default'])(
      (0, _assertThisInitialized2['default'])(_this),
      '_cache',
      new _CellMeasurerCache['default']({
        fixedWidth: true,
        minHeight: 25,
      }),
    );
    (0, _defineProperty2['default'])(
      (0, _assertThisInitialized2['default'])(_this),
      '_lastRenderedWidth',
      _this.props.width,
    );
    (0, _defineProperty2['default'])(
      (0, _assertThisInitialized2['default'])(_this),
      '_columnCellRenderer',
      function(_ref) {
        var dataKey = _ref.dataKey,
          parent = _ref.parent,
          rowIndex = _ref.rowIndex;
        var list = _this.props.list;
        var datum = list.get(rowIndex % list.size);
        var content = rowIndex % 5 === 0 ? '' : datum.randomLong;
        return /*#__PURE__*/ React.createElement(
          _CellMeasurer['default'],
          {
            cache: _this._cache,
            columnIndex: 0,
            key: dataKey,
            parent: parent,
            rowIndex: rowIndex,
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: _CellMeasurerExample['default'].tableColumn,
              style: {
                whiteSpace: 'normal',
              },
            },
            content,
          ),
        );
      },
    );
    (0, _defineProperty2['default'])(
      (0, _assertThisInitialized2['default'])(_this),
      '_rowGetter',
      function(_ref2) {
        var index = _ref2.index;
        var list = _this.props.list;
        return list.get(index % list.size);
      },
    );
    return _this;
  }

  (0, _createClass2['default'])(DynamicHeightTableColumn, [
    {
      key: 'render',
      value: function render() {
        var width = this.props.width;

        if (this._lastRenderedWidth !== this.props.width) {
          this._lastRenderedWidth = this.props.width;

          this._cache.clearAll();
        }

        return /*#__PURE__*/ React.createElement(
          _Table.Table,
          {
            deferredMeasurementCache: this._cache,
            headerHeight: 20,
            height: 400,
            overscanRowCount: 2,
            rowClassName: _CellMeasurerExample['default'].tableRow,
            rowHeight: this._cache.rowHeight,
            rowGetter: this._rowGetter,
            rowCount: 1000,
            width: width,
          },
          /*#__PURE__*/ React.createElement(_Table.Column, {
            className: _CellMeasurerExample['default'].tableColumn,
            dataKey: 'name',
            label: 'Name',
            width: 125,
          }),
          /*#__PURE__*/ React.createElement(_Table.Column, {
            className: _CellMeasurerExample['default'].tableColumn,
            dataKey: 'color',
            label: 'Color',
            width: 75,
          }),
          /*#__PURE__*/ React.createElement(_Table.Column, {
            width: width - 200,
            dataKey: 'random',
            label: 'Dynamic text',
            cellRenderer: this._columnCellRenderer,
          }),
        );
      },
    },
  ]);
  return DynamicHeightTableColumn;
})(React.PureComponent);

exports['default'] = DynamicHeightTableColumn;
DynamicHeightTableColumn.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        list: _propTypes['default'].instanceOf(_immutable['default'].List)
          .isRequired,
        width: _propTypes['default'].number.isRequired,
      }
    : {};
