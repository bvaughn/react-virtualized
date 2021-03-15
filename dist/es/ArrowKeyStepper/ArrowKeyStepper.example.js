import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _defineProperty from '@babel/runtime/helpers/defineProperty';

var _class, _temp;

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
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

import * as React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import ArrowKeyStepper from './';
import AutoSizer from '../AutoSizer';
import Grid from '../Grid';
import clsx from 'clsx';
import styles from './ArrowKeyStepper.example.css';
var ArrowKeyStepperExample =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    _inherits(ArrowKeyStepperExample, _React$PureComponent);

    var _super = _createSuper(ArrowKeyStepperExample);

    function ArrowKeyStepperExample() {
      var _this;

      _classCallCheck(this, ArrowKeyStepperExample);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), 'state', {
        mode: 'edges',
        isClickable: true,
        scrollToColumn: 0,
        scrollToRow: 0,
      });

      _defineProperty(
        _assertThisInitialized(_this),
        '_getColumnWidth',
        function(_ref) {
          var index = _ref.index;
          return (1 + (index % 3)) * 60;
        },
      );

      _defineProperty(_assertThisInitialized(_this), '_getRowHeight', function(
        _ref2,
      ) {
        var index = _ref2.index;
        return (1 + (index % 3)) * 30;
      });

      _defineProperty(_assertThisInitialized(_this), '_cellRenderer', function(
        _ref3,
      ) {
        var columnIndex = _ref3.columnIndex,
          key = _ref3.key,
          rowIndex = _ref3.rowIndex,
          scrollToColumn = _ref3.scrollToColumn,
          scrollToRow = _ref3.scrollToRow,
          style = _ref3.style;
        var className = clsx(
          styles.Cell,
          _defineProperty(
            {},
            styles.FocusedCell,
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
      });

      _defineProperty(_assertThisInitialized(_this), '_selectCell', function(
        _ref4,
      ) {
        var scrollToColumn = _ref4.scrollToColumn,
          scrollToRow = _ref4.scrollToRow;

        _this.setState({
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow,
        });
      });

      _defineProperty(
        _assertThisInitialized(_this),
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

    _createClass(ArrowKeyStepperExample, [
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
            ContentBox,
            null,
            /*#__PURE__*/ React.createElement(ContentBoxHeader, {
              text: 'ArrowKeyStepper',
              sourceLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/source/ArrowKeyStepper/ArrowKeyStepper.example.js',
              docsLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/docs/ArrowKeyStepper.md',
            }),
            /*#__PURE__*/ React.createElement(
              ContentBoxParagraph,
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
              ContentBoxParagraph,
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
              ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement('strong', null, 'mode'),
              ':',
              /*#__PURE__*/ React.createElement(
                'label',
                null,
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Set mode equal to "cells"',
                  checked: mode === 'cells',
                  className: styles.Radio,
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
                  className: styles.Radio,
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
              ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement(
                'label',
                {
                  className: styles.checkboxLabel,
                },
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Enable click selection? (resets selection)',
                  className: styles.checkbox,
                  type: 'checkbox',
                  checked: isClickable,
                  onChange: this._onClickableChange,
                }),
                'Enable click selection? (resets selection)',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              ArrowKeyStepper,
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
                    ContentBoxParagraph,
                    null,
                    'Most-recently-stepped column: '
                      .concat(scrollToColumn, ', row: ')
                      .concat(scrollToRow),
                  ),
                  /*#__PURE__*/ React.createElement(
                    AutoSizer,
                    {
                      disableHeight: true,
                    },
                    function(_ref6) {
                      var width = _ref6.width;
                      return /*#__PURE__*/ React.createElement(Grid, {
                        className: styles.Grid,
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
                      });
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
  _defineProperty(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production' ? null : {},
  ),
  _temp);
export {ArrowKeyStepperExample as default};
import {bpfrpt_proptype_ScrollIndices} from './';
