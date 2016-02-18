'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */

var AutoSizer = (function (_Component) {
  _inherits(AutoSizer, _Component);

  _createClass(AutoSizer, null, [{
    key: 'propTypes',
    value: {
      /**
       * Function respondible for rendering children.
       * This function should implement the following signature:
       * ({ height, width }) => PropTypes.element
       */
      children: _react.PropTypes.func.isRequired,

      /** Disable dynamic :height property */
      disableHeight: _react.PropTypes.bool,

      /** Disable dynamic :width property */
      disableWidth: _react.PropTypes.bool,

      /** Callback to be invoked on-resize: ({ height, width }) */
      onResize: _react.PropTypes.func.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      onResize: function onResize() {}
    },
    enumerable: true
  }]);

  function AutoSizer(props) {
    _classCallCheck(this, AutoSizer);

    _get(Object.getPrototypeOf(AutoSizer.prototype), 'constructor', this).call(this, props);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
    this.state = {
      height: 0,
      width: 0
    };

    this._onResize = this._onResize.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  _createClass(AutoSizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Defer requiring resize handler in order to support server-side rendering.
      // See issue #41
      this._detectElementResize = require('../vendor/detectElementResize');
      this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

      this._onResize();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var disableHeight = _props.disableHeight;
      var disableWidth = _props.disableWidth;
      var _state = this.state;
      var height = _state.height;
      var width = _state.width;

      // Outer div should not force width/height since that may prevent containers from shrinking.
      // Inner component should overflow and use calculated width/height.
      // See issue #68 for more information.
      var outerStyle = { overflow: 'visible' };

      if (!disableHeight) {
        outerStyle.height = 0;
      }

      if (!disableWidth) {
        outerStyle.width = 0;
      }

      return _react2['default'].createElement(
        'div',
        {
          ref: this._setRef,
          style: outerStyle
        },
        children({ height: height, width: width })
      );
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      var onResize = this.props.onResize;

      var _parentNode$getBoundingClientRect = this._parentNode.getBoundingClientRect();

      var height = _parentNode$getBoundingClientRect.height;
      var width = _parentNode$getBoundingClientRect.width;

      var style = getComputedStyle(this._parentNode);
      var paddingLeft = parseInt(style.paddingLeft, 10);
      var paddingRight = parseInt(style.paddingRight, 10);
      var paddingTop = parseInt(style.paddingTop, 10);
      var paddingBottom = parseInt(style.paddingBottom, 10);

      this.setState({
        height: height - paddingTop - paddingBottom,
        width: width - paddingLeft - paddingRight
      });

      onResize({ height: height, width: width });
    }
  }, {
    key: '_setRef',
    value: function _setRef(autoSizer) {
      // In case the component has been unmounted
      this._parentNode = autoSizer && autoSizer.parentNode;
    }
  }]);

  return AutoSizer;
})(_react.Component);

exports['default'] = AutoSizer;
module.exports = exports['default'];