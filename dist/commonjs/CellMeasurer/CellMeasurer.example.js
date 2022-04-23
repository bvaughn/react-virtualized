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

var _AutoSizer = _interopRequireDefault(require('../AutoSizer'));

var _clsx3 = _interopRequireDefault(require('clsx'));

var _CellMeasurerExample = _interopRequireDefault(
  require('./CellMeasurer.example.css'),
);

var _CellMeasurerDynamicWidthGridExample = _interopRequireDefault(
  require('./CellMeasurer.DynamicWidthGrid.example.js'),
);

var _CellMeasurerDynamicHeightGridExample = _interopRequireDefault(
  require('./CellMeasurer.DynamicHeightGrid.example.js'),
);

var _CellMeasurerDynamicWidthMultiGridExample = _interopRequireDefault(
  require('./CellMeasurer.DynamicWidthMultiGrid.example.js'),
);

var _CellMeasurerDynamicHeightListExample = _interopRequireDefault(
  require('./CellMeasurer.DynamicHeightList.example.js'),
);

var _CellMeasurerDynamicHeightTableColumnExample = _interopRequireDefault(
  require('./CellMeasurer.DynamicHeightTableColumn.example.js'),
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

var demoComponents = [
  _CellMeasurerDynamicWidthGridExample['default'],
  _CellMeasurerDynamicHeightGridExample['default'],
  _CellMeasurerDynamicWidthMultiGridExample['default'],
  _CellMeasurerDynamicHeightListExample['default'],
  _CellMeasurerDynamicHeightTableColumnExample['default'],
];

var CellMeasurerExample = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(CellMeasurerExample, _React$PureComponent);

  var _super = _createSuper(CellMeasurerExample);

  function CellMeasurerExample(props, context) {
    var _this;

    (0, _classCallCheck2['default'])(this, CellMeasurerExample);
    _this = _super.call(this, props, context);
    _this.state = {
      currentTab: 0,
    };
    _this._onClick = _this._onClick.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    return _this;
  }

  (0, _createClass2['default'])(CellMeasurerExample, [
    {
      key: 'render',
      value: function render() {
        var list = this.context.list;
        var currentTab = this.state.currentTab;
        var buttonProps = {
          currentTab: currentTab,
          onClick: this._onClick,
        };
        var DemoComponent = demoComponents[currentTab];
        return /*#__PURE__*/ React.createElement(
          _ContentBox.ContentBox,
          null,
          /*#__PURE__*/ React.createElement(_ContentBox.ContentBoxHeader, {
            text: 'CellMeasurer',
            sourceLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js',
            docsLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md',
          }),
          /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBoxParagraph,
            null,
            'This component can be used to just-in-time measure dynamic content (eg. messages in a chat interface).',
          ),
          /*#__PURE__*/ React.createElement(
            _AutoSizer['default'],
            {
              disableHeight: true,
            },
            function(_ref) {
              var width = _ref.width;
              return /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    width: width,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  null,
                  /*#__PURE__*/ React.createElement('strong', null, 'Grid'),
                  ':',
                  /*#__PURE__*/ React.createElement(
                    Tab,
                    (0, _extends2['default'])(
                      {
                        id: 0,
                      },
                      buttonProps,
                    ),
                    'dynamic width text',
                  ),
                  /*#__PURE__*/ React.createElement(
                    Tab,
                    (0, _extends2['default'])(
                      {
                        id: 1,
                      },
                      buttonProps,
                    ),
                    'dynamic height text',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'strong',
                    null,
                    'MultiGrid',
                  ),
                  ':',
                  /*#__PURE__*/ React.createElement(
                    Tab,
                    (0, _extends2['default'])(
                      {
                        id: 2,
                      },
                      buttonProps,
                    ),
                    'dynamic width text',
                  ),
                  /*#__PURE__*/ React.createElement('strong', null, 'List'),
                  ':',
                  /*#__PURE__*/ React.createElement(
                    Tab,
                    (0, _extends2['default'])(
                      {
                        id: 3,
                      },
                      buttonProps,
                    ),
                    'dynamic height image',
                  ),
                  /*#__PURE__*/ React.createElement('strong', null, 'Table'),
                  ':',
                  /*#__PURE__*/ React.createElement(
                    Tab,
                    (0, _extends2['default'])(
                      {
                        id: 4,
                      },
                      buttonProps,
                    ),
                    'mixed fixed and dynamic height text',
                  ),
                ),
                /*#__PURE__*/ React.createElement(DemoComponent, {
                  getClassName: getClassName,
                  getContent: getContent,
                  list: list,
                  width: width,
                }),
              );
            },
          ),
        );
      },
    },
    {
      key: '_onClick',
      value: function _onClick(id) {
        this.setState({
          currentTab: id,
        });
      },
    },
  ]);
  return CellMeasurerExample;
})(React.PureComponent);

exports['default'] = CellMeasurerExample;
(0, _defineProperty2['default'])(CellMeasurerExample, 'contextTypes', {
  list: _propTypes['default'].instanceOf(_immutable['default'].List).isRequired,
});

function getClassName(_ref2) {
  var columnIndex = _ref2.columnIndex,
    rowIndex = _ref2.rowIndex;
  var rowClass =
    rowIndex % 2 === 0
      ? _CellMeasurerExample['default'].evenRow
      : _CellMeasurerExample['default'].oddRow;
  return (0, _clsx3['default'])(
    rowClass,
    _CellMeasurerExample['default'].cell,
    (0, _defineProperty2['default'])(
      {},
      _CellMeasurerExample['default'].centeredCell,
      columnIndex > 2,
    ),
  );
}

function getContent(_ref3) {
  var index = _ref3.index,
    datum = _ref3.datum,
    _ref3$long = _ref3['long'],
    _long = _ref3$long === void 0 ? true : _ref3$long;

  switch (index % 3) {
    case 0:
      return datum.color;

    case 1:
      return datum.name;

    case 2:
      return _long ? datum.randomLong : datum.random;
  }
}

function Tab(_ref4) {
  var children = _ref4.children,
    currentTab = _ref4.currentTab,
    id = _ref4.id,
    _onClick2 = _ref4.onClick;
  var classNames = (0, _clsx3['default'])(
    _CellMeasurerExample['default'].Tab,
    (0, _defineProperty2['default'])(
      {},
      _CellMeasurerExample['default'].ActiveTab,
      currentTab === id,
    ),
  );
  return /*#__PURE__*/ React.createElement(
    'button',
    {
      className: classNames,
      onClick: function onClick() {
        return _onClick2(id);
      },
    },
    children,
  );
}
