import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';

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

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache from './CellMeasurerCache';
import List from '../List';
import styles from './CellMeasurer.example.css';

var DynamicHeightList = /*#__PURE__*/ (function(_React$PureComponent) {
  _inherits(DynamicHeightList, _React$PureComponent);

  var _super = _createSuper(DynamicHeightList);

  function DynamicHeightList(props, context) {
    var _this;

    _classCallCheck(this, DynamicHeightList);

    _this = _super.call(this, props, context);
    _this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 50,
    });
    _this._rowRenderer = _this._rowRenderer.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DynamicHeightList, [
    {
      key: 'render',
      value: function render() {
        var width = this.props.width;
        return /*#__PURE__*/ React.createElement(List, {
          className: styles.BodyGrid,
          deferredMeasurementCache: this._cache,
          height: 400,
          overscanRowCount: 0,
          rowCount: 1000,
          rowHeight: this._cache.rowHeight,
          rowRenderer: this._rowRenderer,
          width: width,
        });
      },
    },
    {
      key: '_rowRenderer',
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
          rowIndex: index,
        });
        var imageWidth = 300;
        var imageHeight = datum.size * (1 + (index % 3));
        var source = 'https://www.fillmurray.com/'
          .concat(imageWidth, '/')
          .concat(imageHeight);
        return /*#__PURE__*/ React.createElement(
          CellMeasurer,
          {
            cache: this._cache,
            columnIndex: 0,
            key: key,
            rowIndex: index,
            parent: parent,
          },
          function(_ref2) {
            var measure = _ref2.measure,
              registerChild = _ref2.registerChild;
            return /*#__PURE__*/ React.createElement(
              'div',
              {
                ref: registerChild,
                className: classNames,
                style: style,
              },
              /*#__PURE__*/ React.createElement('img', {
                onLoad: measure,
                src: source,
                style: {
                  width: imageWidth,
                },
              }),
            );
          },
        );
      },
    },
  ]);

  return DynamicHeightList;
})(React.PureComponent);

export {DynamicHeightList as default};
DynamicHeightList.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        getClassName: PropTypes.func.isRequired,
        list: PropTypes.instanceOf(Immutable.List).isRequired,
        width: PropTypes.number.isRequired,
      }
    : {};
