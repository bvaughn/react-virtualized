'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

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

var React = _interopRequireWildcard(require('react'));

var _ContentBox = require('../demo/ContentBox');

var _ = _interopRequireWildcard(require('./'));

var _AutoSizer = _interopRequireDefault(require('../AutoSizer'));

var _Grid = _interopRequireDefault(require('../Grid'));

var _clsx2 = _interopRequireDefault(require('clsx'));

var _ArrowKeyStepperExample = _interopRequireDefault(
  require('./ArrowKeyStepper.example.css'),
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

var ArrowKeyStepperExample =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    (0, _inherits2['default'])(ArrowKeyStepperExample, _React$PureComponent);

    var _super = _createSuper(ArrowKeyStepperExample);

    function ArrowKeyStepperExample() {
      var _this;

      (0, _classCallCheck2['default'])(this, ArrowKeyStepperExample);

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
          mode: 'edges',
          isClickable: true,
          scrollToColumn: 0,
          scrollToRow: 0,
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_getColumnWidth',
        function(_ref) {
          var index = _ref.index;
          return (1 + (index % 3)) * 60;
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_getRowHeight',
        function(_ref2) {
          var index = _ref2.index;
          return (1 + (index % 3)) * 30;
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_cellRenderer',
        function(_ref3) {
          var columnIndex = _ref3.columnIndex,
            key = _ref3.key,
            rowIndex = _ref3.rowIndex,
            scrollToColumn = _ref3.scrollToColumn,
            scrollToRow = _ref3.scrollToRow,
            style = _ref3.style;
          var className = (0, _clsx2['default'])(
            _ArrowKeyStepperExample['default'].Cell,
            (0, _defineProperty2['default'])(
              {},
              _ArrowKeyStepperExample['default'].FocusedCell,
              columnIndex === scrollToColumn && rowIndex === scrollToRow,
            ),
          );
          return /*#__PURE__*/ React.createElement(
            'span',
            {
              role: 'none',
              className: className,
              key: key,
              onClick:
                _this.state.isClickable &&
                function() {
                  return _this._selectCell({
                    scrollToColumn: columnIndex,
                    scrollToRow: rowIndex,
                  });
                },
              style: style,
            },
            'r:'.concat(rowIndex, ', c:').concat(columnIndex),
          );
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_selectCell',
        function(_ref4) {
          var scrollToColumn = _ref4.scrollToColumn,
            scrollToRow = _ref4.scrollToRow;

          _this.setState({
            scrollToColumn: scrollToColumn,
            scrollToRow: scrollToRow,
          });
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onClickableChange',
        function(event) {
          if (event.target instanceof HTMLInputElement) {
            _this.setState({
              isClickable: event.target.checked,
              scrollToColumn: 0,
              scrollToRow: 0,
            });
          }
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(ArrowKeyStepperExample, [
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var _this$state = this.state,
            mode = _this$state.mode,
            isClickable = _this$state.isClickable,
            scrollToColumn = _this$state.scrollToColumn,
            scrollToRow = _this$state.scrollToRow;
          return /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBox,
            null,
            /*#__PURE__*/ React.createElement(_ContentBox.ContentBoxHeader, {
              text: 'ArrowKeyStepper',
              sourceLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js',
              docsLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md',
            }),
            /*#__PURE__*/ React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              'This high-order component decorates a ',
              /*#__PURE__*/ React.createElement('code', null, 'List'),
              ',',
              ' ',
              /*#__PURE__*/ React.createElement('code', null, 'Table'),
              ', or ',
              /*#__PURE__*/ React.createElement('code', null, 'Grid'),
              ' and responds to arrow-key events by scrolling one row or column at a time. Focus in the `Grid` below and use the left, right, up, or down arrow keys to move around within the grid.',
            ),
            /*#__PURE__*/ React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              'Note that unlike the other HOCs in react-virtualized, the',
              ' ',
              /*#__PURE__*/ React.createElement(
                'code',
                null,
                'ArrowKeyStepper',
              ),
              ' adds a ',
              /*#__PURE__*/ React.createElement('code', null, '<div>'),
              ' element around its children in order to attach a key-down event handler.',
            ),
            /*#__PURE__*/ React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement('strong', null, 'mode'),
              ':',
              /*#__PURE__*/ React.createElement(
                'label',
                null,
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Set mode equal to "cells"',
                  checked: mode === 'cells',
                  className: _ArrowKeyStepperExample['default'].Radio,
                  type: 'radio',
                  onChange: function onChange(event) {
                    return (
                      event.target.checked &&
                      _this2.setState({
                        mode: 'cells',
                      })
                    );
                  },
                  value: 'cells',
                }),
                'cells',
              ),
              /*#__PURE__*/ React.createElement(
                'label',
                null,
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Set mode equal to "edges"',
                  checked: mode === 'edges',
                  className: _ArrowKeyStepperExample['default'].Radio,
                  type: 'radio',
                  onChange: function onChange(event) {
                    return (
                      event.target.checked &&
                      _this2.setState({
                        mode: 'edges',
                      })
                    );
                  },
                  value: 'edges',
                }),
                'edges (default)',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement(
                'label',
                {
                  className: _ArrowKeyStepperExample['default'].checkboxLabel,
                },
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Enable click selection? (resets selection)',
                  className: _ArrowKeyStepperExample['default'].checkbox,
                  type: 'checkbox',
                  checked: isClickable,
                  onChange: this._onClickableChange,
                }),
                'Enable click selection? (resets selection)',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              _['default'],
              {
                columnCount: 100,
                isControlled: isClickable,
                onScrollToChange: isClickable ? this._selectCell : undefined,
                mode: mode,
                rowCount: 100,
                scrollToColumn: scrollToColumn,
                scrollToRow: scrollToRow,
              },
              function(_ref5) {
                var onSectionRendered = _ref5.onSectionRendered,
                  scrollToColumn = _ref5.scrollToColumn,
                  scrollToRow = _ref5.scrollToRow;
                return /*#__PURE__*/ React.createElement(
                  'div',
                  null,
                  /*#__PURE__*/ React.createElement(
                    _ContentBox.ContentBoxParagraph,
                    null,
                    'Most-recently-stepped column: '
                      .concat(scrollToColumn, ', row: ')
                      .concat(scrollToRow),
                  ),
                  /*#__PURE__*/ React.createElement(
                    _AutoSizer['default'],
                    {
                      disableHeight: true,
                    },
                    function(_ref6) {
                      var width = _ref6.width;
                      return /*#__PURE__*/ React.createElement(
                        _Grid['default'],
                        {
                          className: _ArrowKeyStepperExample['default'].Grid,
                          columnWidth: _this2._getColumnWidth,
                          columnCount: 100,
                          height: 200,
                          onSectionRendered: onSectionRendered,
                          cellRenderer: function cellRenderer(_ref7) {
                            var columnIndex = _ref7.columnIndex,
                              key = _ref7.key,
                              rowIndex = _ref7.rowIndex,
                              style = _ref7.style;
                            return _this2._cellRenderer({
                              columnIndex: columnIndex,
                              key: key,
                              rowIndex: rowIndex,
                              scrollToColumn: scrollToColumn,
                              scrollToRow: scrollToRow,
                              style: style,
                            });
                          },
                          rowHeight: _this2._getRowHeight,
                          rowCount: 100,
                          scrollToColumn: scrollToColumn,
                          scrollToRow: scrollToRow,
                          width: width,
                        },
                      );
                    },
                  ),
                );
              },
            ),
          );
        },
      },
    ]);
    return ArrowKeyStepperExample;
  })(React.PureComponent)),
  (0, _defineProperty2['default'])(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production' ? null : {},
  ),
  _temp);
exports['default'] = ArrowKeyStepperExample;
