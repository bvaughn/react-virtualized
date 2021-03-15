'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

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

var _immutable = require('immutable');

var _propTypes = _interopRequireDefault(require('prop-types'));

var React = _interopRequireWildcard(require('react'));

var _ContentBox = require('../demo/ContentBox');

var _AutoSizer = _interopRequireDefault(require('./AutoSizer'));

var _List = _interopRequireWildcard(require('../List'));

var _AutoSizerExample = _interopRequireDefault(
  require('./AutoSizer.example.css'),
);

var _class, _temp;

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

var AutoSizerExample =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    (0, _inherits2['default'])(AutoSizerExample, _React$PureComponent);

    var _super = _createSuper(AutoSizerExample);

    function AutoSizerExample() {
      var _this;

      (0, _classCallCheck2['default'])(this, AutoSizerExample);

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
        'state',
        {
          hideDescription: false,
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_rowRenderer',
        function(_ref) {
          var index = _ref.index,
            key = _ref.key,
            style = _ref.style;
          var list = _this.context.list;
          var row = list.get(index);
          return /*#__PURE__*/ React.createElement(
            'div',
            {
              key: key,
              className: _AutoSizerExample['default'].row,
              style: style,
            },
            row.name,
          );
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(AutoSizerExample, [
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var list = this.context.list;
          var hideDescription = this.state.hideDescription;
          return /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBox,
            (0, _extends2['default'])({}, this.props, {
              style: {
                height: 400,
              },
            }),
            /*#__PURE__*/ React.createElement(_ContentBox.ContentBoxHeader, {
              text: 'AutoSizer',
              sourceLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/source/AutoSizer/AutoSizer.example.js',
              docsLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md',
            }),
            /*#__PURE__*/ React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement(
                'label',
                {
                  className: _AutoSizerExample['default'].checkboxLabel,
                },
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Hide description (to show resize)?',
                  className: _AutoSizerExample['default'].checkbox,
                  type: 'checkbox',
                  checked: hideDescription,
                  onChange: function onChange(event) {
                    return _this2.setState({
                      hideDescription: event.target.checked,
                    });
                  },
                }),
                'Hide description (to show resize)?',
              ),
            ),
            !hideDescription &&
              /*#__PURE__*/ React.createElement(
                _ContentBox.ContentBoxParagraph,
                null,
                'This component decorates ',
                /*#__PURE__*/ React.createElement('code', null, 'List'),
                ', ',
                /*#__PURE__*/ React.createElement('code', null, 'Table'),
                ", or any other component and automatically manages its width and height. It uses Sebastian Decima's",
                ' ',
                /*#__PURE__*/ React.createElement(
                  'a',
                  {
                    href:
                      'https://github.com/sdecima/javascript-detect-element-resize',
                    target: '_blank',
                  },
                  'element resize event',
                ),
                ' ',
                'to determine the appropriate size. In this example',
                ' ',
                /*#__PURE__*/ React.createElement('code', null, 'AutoSizer'),
                ' grows to fill the remaining width and height of this flex column.',
              ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: _AutoSizerExample['default'].AutoSizerWrapper,
              },
              /*#__PURE__*/ React.createElement(
                _AutoSizer['default'],
                null,
                function(_ref2) {
                  var width = _ref2.width,
                    height = _ref2.height;
                  return /*#__PURE__*/ React.createElement(_List['default'], {
                    className: _AutoSizerExample['default'].List,
                    height: height,
                    rowCount: list.size,
                    rowHeight: 30,
                    rowRenderer: _this2._rowRenderer,
                    width: width,
                  });
                },
              ),
            ),
          );
        },
      },
    ]);
    return AutoSizerExample;
  })(React.PureComponent)),
  (0, _defineProperty2['default'])(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production' ? null : {},
  ),
  _temp);
exports['default'] = AutoSizerExample;
(0, _defineProperty2['default'])(AutoSizerExample, 'contextTypes', {
  list: _propTypes['default'].instanceOf(_immutable.List).isRequired,
});
