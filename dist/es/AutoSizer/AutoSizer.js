import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import * as React from 'react';
import createDetectElementResize from '../vendor/detectElementResize';
/*:: type Size = {
  height: number,
  width: number,
};*/

/*:: type Props = {
  /** Function responsible for rendering children.*-/
  children: Size => React.Element<*>,

  /** Optional custom CSS class name to attach to root AutoSizer element.  *-/
  className?: string,

  /** Default height to use for initial render; useful for SSR *-/
  defaultHeight?: number,

  /** Default width to use for initial render; useful for SSR *-/
  defaultWidth?: number,

  /** Disable dynamic :height property *-/
  disableHeight: boolean,

  /** Disable dynamic :width property *-/
  disableWidth: boolean,

  /** Nonce of the inlined stylesheet for Content Security Policy *-/
  nonce?: string,

  /** Callback to be invoked on-resize *-/
  onResize: Size => void,

  /** Optional inline style *-/
  style: ?Object,
};*/

/*:: type State = {
  height: number,
  width: number,
};*/

/*:: type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;*/

/*:: type DetectElementResize = {
  addResizeListener: ResizeHandler,
  removeResizeListener: ResizeHandler,
};*/

var AutoSizer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AutoSizer, _React$Component);

  function AutoSizer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AutoSizer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AutoSizer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      height: _this.props.defaultHeight || 0,
      width: _this.props.defaultWidth || 0
    });

    _defineProperty(_assertThisInitialized(_this), "_parentNode", void 0);

    _defineProperty(_assertThisInitialized(_this), "_autoSizer", void 0);

    _defineProperty(_assertThisInitialized(_this), "_window", void 0);

    _defineProperty(_assertThisInitialized(_this), "_detectElementResize", void 0);

    _defineProperty(_assertThisInitialized(_this), "_onResize", function () {
      var _this$props = _this.props,
          disableHeight = _this$props.disableHeight,
          disableWidth = _this$props.disableWidth,
          onResize = _this$props.onResize;

      if (_this._parentNode) {
        // Guard against AutoSizer component being removed from the DOM immediately after being added.
        // This can result in invalid style values which can result in NaN values if we don't handle them.
        // See issue #150 for more context.
        var height = _this._parentNode.offsetHeight || 0;
        var width = _this._parentNode.offsetWidth || 0;
        var win = _this._window || window;
        var style = win.getComputedStyle(_this._parentNode) || {};
        var paddingLeft = parseInt(style.paddingLeft, 10) || 0;
        var paddingRight = parseInt(style.paddingRight, 10) || 0;
        var paddingTop = parseInt(style.paddingTop, 10) || 0;
        var paddingBottom = parseInt(style.paddingBottom, 10) || 0;
        var newHeight = height - paddingTop - paddingBottom;
        var newWidth = width - paddingLeft - paddingRight;

        if (!disableHeight && _this.state.height !== newHeight || !disableWidth && _this.state.width !== newWidth) {
          _this.setState({
            height: height - paddingTop - paddingBottom,
            width: width - paddingLeft - paddingRight
          });

          onResize({
            height: height,
            width: width
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_setRef", function (autoSizer
    /*: ?HTMLElement*/
    ) {
      _this._autoSizer = autoSizer;
    });

    return _this;
  }

  _createClass(AutoSizer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var nonce = this.props.nonce;

      if (this._autoSizer && this._autoSizer.parentNode && this._autoSizer.parentNode.ownerDocument && this._autoSizer.parentNode.ownerDocument.defaultView && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
        // Delay access of parentNode until mount.
        // This handles edge-cases where the component has already been unmounted before its ref has been set,
        // As well as libraries like react-lite which have a slightly different lifecycle.
        this._parentNode = this._autoSizer.parentNode;
        this._window = this._autoSizer.parentNode.ownerDocument.defaultView; // Defer requiring resize handler in order to support server-side rendering.
        // See issue #41

        this._detectElementResize = createDetectElementResize(nonce, this._window);

        this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

        this._onResize();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._detectElementResize && this._parentNode) {
        this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          disableHeight = _this$props2.disableHeight,
          disableWidth = _this$props2.disableWidth,
          style = _this$props2.style;
      var _this$state = this.state,
          height = _this$state.height,
          width = _this$state.width; // Outer div should not force width/height since that may prevent containers from shrinking.
      // Inner component should overflow and use calculated width/height.
      // See issue #68 for more information.

      var outerStyle
      /*: Object*/
      = {
        overflow: 'visible'
      };
      var childParams
      /*: Object*/
      = {};

      if (!disableHeight) {
        outerStyle.height = 0;
        childParams.height = height;
      }

      if (!disableWidth) {
        outerStyle.width = 0;
        childParams.width = width;
      }
      /**
       * TODO: Avoid rendering children before the initial measurements have been collected.
       * At best this would just be wasting cycles.
       * Add this check into version 10 though as it could break too many ref callbacks in version 9.
       * Note that if default width/height props were provided this would still work with SSR.
      if (
        height !== 0 &&
        width !== 0
      ) {
        child = children({ height, width })
      }
      */


      return React.createElement("div", {
        className: className,
        ref: this._setRef,
        style: _objectSpread({}, outerStyle, {}, style)
      }, children(childParams));
    }
  }]);

  return AutoSizer;
}(React.Component);

_defineProperty(AutoSizer, "defaultProps", {
  onResize: function onResize() {},
  disableHeight: false,
  disableWidth: false,
  style: {}
});

export { AutoSizer as default };