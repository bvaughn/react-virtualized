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

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */

var ScrollSync = (function (_Component) {
  _inherits(ScrollSync, _Component);

  _createClass(ScrollSync, null, [{
    key: 'propTypes',
    value: {
      /**
       * Function respondible for rendering 2 or more virtualized components.
       * This function should implement the following signature:
       * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
       */
      children: _react.PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  function ScrollSync(props, context) {
    _classCallCheck(this, ScrollSync);

    _get(Object.getPrototypeOf(ScrollSync.prototype), 'constructor', this).call(this, props, context);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
    this.state = {
      scrollLeft: 0,
      scrollTop: 0
    };

    this._onScroll = this._onScroll.bind(this);
  }

  _createClass(ScrollSync, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;
      var _state = this.state;
      var scrollLeft = _state.scrollLeft;
      var scrollTop = _state.scrollTop;

      return children({
        onScroll: this._onScroll,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(_ref) {
      var scrollLeft = _ref.scrollLeft;
      var scrollTop = _ref.scrollTop;

      this.setState({ scrollLeft: scrollLeft, scrollTop: scrollTop });
    }
  }]);

  return ScrollSync;
})(_react.Component);

exports['default'] = ScrollSync;
module.exports = exports['default'];