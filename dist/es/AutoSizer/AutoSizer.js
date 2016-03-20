
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */

var AutoSizer = function (_Component) {
  babelHelpers.inherits(AutoSizer, _Component);

  function AutoSizer(props) {
    babelHelpers.classCallCheck(this, AutoSizer);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(AutoSizer).call(this, props));

    _this.state = {
      height: 0,
      width: 0
    };

    _this._onResize = _this._onResize.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    _this._setRef = _this._setRef.bind(_this);
    return _this;
  }

  babelHelpers.createClass(AutoSizer, [{
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

      return React.createElement(
        'div',
        {
          ref: this._setRef,
          onScroll: this._onScroll,
          style: outerStyle
        },
        children({ height: height, width: width })
      );
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      var onResize = this.props.onResize;

      var _parentNode$getBoundi = this._parentNode.getBoundingClientRect();

      var height = _parentNode$getBoundi.height;
      var width = _parentNode$getBoundi.width;


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
    key: '_onScroll',
    value: function _onScroll(event) {
      // Prevent detectElementResize library from being triggered by this scroll event.
      event.stopPropagation();
    }
  }, {
    key: '_setRef',
    value: function _setRef(autoSizer) {
      // In case the component has been unmounted
      this._parentNode = autoSizer && autoSizer.parentNode;
    }
  }]);
  return AutoSizer;
}(Component);

AutoSizer.propTypes = {
  /**
   * Function respondible for rendering children.
   * This function should implement the following signature:
   * ({ height, width }) => PropTypes.element
   */
  children: PropTypes.func.isRequired,

  /** Disable dynamic :height property */
  disableHeight: PropTypes.bool,

  /** Disable dynamic :width property */
  disableWidth: PropTypes.bool,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: PropTypes.func.isRequired
};
AutoSizer.defaultProps = {
  onResize: function onResize() {}
};
export default AutoSizer;