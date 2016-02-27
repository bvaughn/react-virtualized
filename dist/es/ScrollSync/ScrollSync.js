import { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */

var ScrollSync = function (_Component) {
  babelHelpers.inherits(ScrollSync, _Component);

  function ScrollSync(props, context) {
    babelHelpers.classCallCheck(this, ScrollSync);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ScrollSync).call(this, props, context));

    _this.shouldComponentUpdate = shouldPureComponentUpdate;


    _this.state = {
      scrollLeft: 0,
      scrollTop: 0
    };

    _this._onScroll = _this._onScroll.bind(_this);
    return _this;
  }

  babelHelpers.createClass(ScrollSync, [{
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
}(Component);

ScrollSync.propTypes = {
  /**
   * Function respondible for rendering 2 or more virtualized components.
   * This function should implement the following signature:
   * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
   */
  children: PropTypes.func.isRequired
};
export default ScrollSync;