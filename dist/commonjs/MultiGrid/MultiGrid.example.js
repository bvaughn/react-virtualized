'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _extends2 = _interopRequireDefault(
  require('@babel/runtime/helpers/extends'),
);

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

var _ContentBox = require('../demo/ContentBox');

var _LabeledInput = require('../demo/LabeledInput');

var _AutoSizer = _interopRequireDefault(require('../AutoSizer'));

var _MultiGrid = _interopRequireDefault(require('./MultiGrid'));

var _MultiGridExample = _interopRequireDefault(
  require('./MultiGrid.example.css'),
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

var STYLE = {
  border: '1px solid #ddd',
};
var STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
var STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
var STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

var MultiGridExample = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(MultiGridExample, _React$PureComponent);

  var _super = _createSuper(MultiGridExample);

  function MultiGridExample(props, context) {
    var _this;

    (0, _classCallCheck2['default'])(this, MultiGridExample);
    _this = _super.call(this, props, context);
    _this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    };
    _this._cellRenderer = _this._cellRenderer.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._onFixedColumnCountChange = _this._createEventHandler(
      'fixedColumnCount',
    );
    _this._onFixedRowCountChange = _this._createEventHandler('fixedRowCount');
    _this._onScrollToColumnChange = _this._createEventHandler('scrollToColumn');
    _this._onScrollToRowChange = _this._createEventHandler('scrollToRow');
    return _this;
  }

  (0, _createClass2['default'])(MultiGridExample, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return /*#__PURE__*/ React.createElement(
          _ContentBox.ContentBox,
          null,
          /*#__PURE__*/ React.createElement(_ContentBox.ContentBoxHeader, {
            text: 'MultiGrid',
            sourceLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js',
            docsLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md',
          }),
          /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBoxParagraph,
            null,
            'This component stitches together several grids to provide a fixed column/row interface.',
          ),
          /*#__PURE__*/ React.createElement(
            _LabeledInput.InputRow,
            null,
            this._createLabeledInput(
              'fixedColumnCount',
              this._onFixedColumnCountChange,
            ),
            this._createLabeledInput(
              'fixedRowCount',
              this._onFixedRowCountChange,
            ),
            this._createLabeledInput(
              'scrollToColumn',
              this._onScrollToColumnChange,
            ),
            this._createLabeledInput('scrollToRow', this._onScrollToRowChange),
          ),
          /*#__PURE__*/ React.createElement(
            _AutoSizer['default'],
            {
              disableHeight: true,
            },
            function(_ref) {
              var width = _ref.width;
              return /*#__PURE__*/ React.createElement(
                _MultiGrid['default'],
                (0, _extends2['default'])({}, _this2.state, {
                  cellRenderer: _this2._cellRenderer,
                  columnWidth: 75,
                  columnCount: 50,
                  enableFixedColumnScroll: true,
                  enableFixedRowScroll: true,
                  height: 300,
                  rowHeight: 40,
                  rowCount: 100,
                  style: STYLE,
                  styleBottomLeftGrid: STYLE_BOTTOM_LEFT_GRID,
                  styleTopLeftGrid: STYLE_TOP_LEFT_GRID,
                  styleTopRightGrid: STYLE_TOP_RIGHT_GRID,
                  width: width,
                  hideTopRightGridScrollbar: true,
                  hideBottomLeftGridScrollbar: true,
                }),
              );
            },
          ),
        );
      },
    },
    {
      key: '_cellRenderer',
      value: function _cellRenderer(_ref2) {
        var columnIndex = _ref2.columnIndex,
          key = _ref2.key,
          rowIndex = _ref2.rowIndex,
          style = _ref2.style;
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: _MultiGridExample['default'].Cell,
            key: key,
            style: style,
          },
          columnIndex,
          ', ',
          rowIndex,
        );
      },
    },
    {
      key: '_createEventHandler',
      value: function _createEventHandler(property) {
        var _this3 = this;

        return function(event) {
          var value = parseInt(event.target.value, 10) || 0;

          _this3.setState(
            (0, _defineProperty2['default'])({}, property, value),
          );
        };
      },
    },
    {
      key: '_createLabeledInput',
      value: function _createLabeledInput(property, eventHandler) {
        var value = this.state[property];
        return /*#__PURE__*/ React.createElement(_LabeledInput.LabeledInput, {
          label: property,
          name: property,
          onChange: eventHandler,
          value: value,
        });
      },
    },
  ]);
  return MultiGridExample;
})(React.PureComponent);

exports['default'] = MultiGridExample;
(0, _defineProperty2['default'])(MultiGridExample, 'contextTypes', {
  list: _propTypes['default'].instanceOf(_immutable['default'].List).isRequired,
});
