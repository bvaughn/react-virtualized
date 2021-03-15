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

import PropTypes from 'prop-types';
import * as React from 'react';
/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */

var ScrollSync = /*#__PURE__*/ (function(_React$PureComponent) {
  _inherits(ScrollSync, _React$PureComponent);

  var _super = _createSuper(ScrollSync);

  function ScrollSync(props, context) {
    var _this;

    _classCallCheck(this, ScrollSync);

    _this = _super.call(this, props, context);
    _this.state = {
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollLeft: 0,
      scrollTop: 0,
      scrollWidth: 0,
    };
    _this._onScroll = _this._onScroll.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ScrollSync, [
    {
      key: 'render',
      value: function render() {
        var children = this.props.children;
        var _this$state = this.state,
          clientHeight = _this$state.clientHeight,
          clientWidth = _this$state.clientWidth,
          scrollHeight = _this$state.scrollHeight,
          scrollLeft = _this$state.scrollLeft,
          scrollTop = _this$state.scrollTop,
          scrollWidth = _this$state.scrollWidth;
        return children({
          clientHeight: clientHeight,
          clientWidth: clientWidth,
          onScroll: this._onScroll,
          scrollHeight: scrollHeight,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          scrollWidth: scrollWidth,
        });
      },
    },
    {
      key: '_onScroll',
      value: function _onScroll(_ref) {
        var clientHeight = _ref.clientHeight,
          clientWidth = _ref.clientWidth,
          scrollHeight = _ref.scrollHeight,
          scrollLeft = _ref.scrollLeft,
          scrollTop = _ref.scrollTop,
          scrollWidth = _ref.scrollWidth;
        this.setState({
          clientHeight: clientHeight,
          clientWidth: clientWidth,
          scrollHeight: scrollHeight,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          scrollWidth: scrollWidth,
        });
      },
    },
  ]);

  return ScrollSync;
})(React.PureComponent);

export {ScrollSync as default};
ScrollSync.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        /**
         * Function responsible for rendering 2 or more virtualized components.
         * This function should implement the following signature:
         * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
         */
        children: PropTypes.func.isRequired,
      }
    : {};
