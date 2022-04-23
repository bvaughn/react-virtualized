import _extends from '@babel/runtime/helpers/extends';
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

import {List as ImmutableList} from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import AutoSizer from './AutoSizer';
import List from '../List';
import styles from './AutoSizer.example.css';
var AutoSizerExample =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    _inherits(AutoSizerExample, _React$PureComponent);

    var _super = _createSuper(AutoSizerExample);

    function AutoSizerExample() {
      var _this;

      _classCallCheck(this, AutoSizerExample);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), 'state', {
        hideDescription: false,
      });

      _defineProperty(_assertThisInitialized(_this), '_rowRenderer', function(
        _ref,
      ) {
        var index = _ref.index,
          key = _ref.key,
          style = _ref.style;
        var list = _this.context.list;
        var row = list.get(index);
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            key: key,
            className: styles.row,
            style: style,
          },
          row.name,
        );
      });

      return _this;
    }

    _createClass(AutoSizerExample, [
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var list = this.context.list;
          var hideDescription = this.state.hideDescription;
          return /*#__PURE__*/ React.createElement(
            ContentBox,
            _extends({}, this.props, {
              style: {
                height: 400,
              },
            }),
            /*#__PURE__*/ React.createElement(ContentBoxHeader, {
              text: 'AutoSizer',
              sourceLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/source/AutoSizer/AutoSizer.example.js',
              docsLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md',
            }),
            /*#__PURE__*/ React.createElement(
              ContentBoxParagraph,
              null,
              /*#__PURE__*/ React.createElement(
                'label',
                {
                  className: styles.checkboxLabel,
                },
                /*#__PURE__*/ React.createElement('input', {
                  'aria-label': 'Hide description (to show resize)?',
                  className: styles.checkbox,
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
                ContentBoxParagraph,
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
                className: styles.AutoSizerWrapper,
              },
              /*#__PURE__*/ React.createElement(AutoSizer, null, function(
                _ref2,
              ) {
                var width = _ref2.width,
                  height = _ref2.height;
                return /*#__PURE__*/ React.createElement(List, {
                  className: styles.List,
                  height: height,
                  rowCount: list.size,
                  rowHeight: 30,
                  rowRenderer: _this2._rowRenderer,
                  width: width,
                });
              }),
            ),
          );
        },
      },
    ]);

    return AutoSizerExample;
  })(React.PureComponent)),
  _defineProperty(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production' ? null : {},
  ),
  _temp);

_defineProperty(AutoSizerExample, 'contextTypes', {
  list: PropTypes.instanceOf(ImmutableList).isRequired,
});

export {AutoSizerExample as default};
import {bpfrpt_proptype_RowRendererParams} from '../List';
