!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? factory(exports, require("react"), require("react-dom")) : "function" == typeof define && define.amd ? define([ "exports", "react", "react-dom" ], factory) : factory((global = global || self).ReactVirtualized = {}, global.React, global.ReactDOM);
}(this, function(exports, React, ReactDOM) {
    "use strict";
    var React__default = "default" in React ? React.default : React;
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
        Constructor;
    }
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    function _extends() {
        return (_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }).apply(this, arguments);
    }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            enumerableOnly && (symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            })), keys.push.apply(keys, symbols);
        }
        return keys;
    }
    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = null != arguments[i] ? arguments[i] : {};
            i % 2 ? ownKeys(source, !0).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(source).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
        return target;
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        })(o);
    }
    function _setPrototypeOf(o, p) {
        return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
            return o.__proto__ = p, o;
        })(o, p);
    }
    function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++) key = sourceKeys[i], 0 <= excluded.indexOf(key) || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) key = sourceSymbolKeys[i], 0 <= excluded.indexOf(key) || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }
    function _assertThisInitialized(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        return !call || "object" != typeof call && "function" != typeof call ? _assertThisInitialized(self) : call;
    }
    function _slicedToArray(arr, i) {
        return function(arr) {
            if (Array.isArray(arr)) return arr;
        }(arr) || function(arr, i) {
            if (!(Symbol.iterator in Object(arr) || "[object Arguments]" === Object.prototype.toString.call(arr))) return;
            var _arr = [], _n = !0, _d = !1, _e = void 0;
            try {
                for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
                !i || _arr.length !== i); _n = !0) ;
            } catch (err) {
                _d = !0, _e = err;
            } finally {
                try {
                    _n || null == _i.return || _i.return();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }(arr, i) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
        /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */ ();
    }
    function _toConsumableArray(arr) {
        return function(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
        }(arr) || function(iter) {
            if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
        }(arr) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
        }();
    }
    function componentWillMount() {
        // Call this.constructor.gDSFP to support sub-classes.
        var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
        null != state && this.setState(state);
    }
    function componentWillReceiveProps(nextProps) {
        // Binding "this" is important for shallow renderer support.
        this.setState(
        // Call this.constructor.gDSFP to support sub-classes.
        // Use the setState() updater to ensure state isn't stale in certain edge cases.
        function(prevState) {
            var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
            return null != state ? state : null;
        }.bind(this));
    }
    function componentWillUpdate(nextProps, nextState) {
        try {
            var prevProps = this.props, prevState = this.state;
            this.props = nextProps, this.state = nextState, this.__reactInternalSnapshotFlag = !0, 
            this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(prevProps, prevState);
        } finally {
            this.props = prevProps, this.state = prevState;
        }
    }
    // React may warn about cWM/cWRP/cWU methods being deprecated.
    // Add a flag to suppress these warnings for this special case.
        function polyfill(Component) {
        var prototype = Component.prototype;
        if (!prototype || !prototype.isReactComponent) throw new Error("Can only polyfill class components");
        if ("function" != typeof Component.getDerivedStateFromProps && "function" != typeof prototype.getSnapshotBeforeUpdate) return Component;
        // If new component APIs are defined, "unsafe" lifecycles won't be called.
        // Error if any of these lifecycles are present,
        // Because they would work differently between older and newer (16.3+) versions of React.
                var foundWillMountName = null, foundWillReceivePropsName = null, foundWillUpdateName = null;
        if ("function" == typeof prototype.componentWillMount ? foundWillMountName = "componentWillMount" : "function" == typeof prototype.UNSAFE_componentWillMount && (foundWillMountName = "UNSAFE_componentWillMount"), 
        "function" == typeof prototype.componentWillReceiveProps ? foundWillReceivePropsName = "componentWillReceiveProps" : "function" == typeof prototype.UNSAFE_componentWillReceiveProps && (foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps"), 
        "function" == typeof prototype.componentWillUpdate ? foundWillUpdateName = "componentWillUpdate" : "function" == typeof prototype.UNSAFE_componentWillUpdate && (foundWillUpdateName = "UNSAFE_componentWillUpdate"), 
        null !== foundWillMountName || null !== foundWillReceivePropsName || null !== foundWillUpdateName) {
            var componentName = Component.displayName || Component.name, newApiName = "function" == typeof Component.getDerivedStateFromProps ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            throw Error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n" + componentName + " uses " + newApiName + " but also contains the following legacy lifecycles:" + (null !== foundWillMountName ? "\n  " + foundWillMountName : "") + (null !== foundWillReceivePropsName ? "\n  " + foundWillReceivePropsName : "") + (null !== foundWillUpdateName ? "\n  " + foundWillUpdateName : "") + "\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks");
        }
        // React <= 16.2 does not support static getDerivedStateFromProps.
        // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
        // Newer versions of React will ignore these lifecycles if gDSFP exists.
                // React <= 16.2 does not support getSnapshotBeforeUpdate.
        // As a workaround, use cWU to invoke the new lifecycle.
        // Newer versions of React will ignore that lifecycle if gSBU exists.
        if ("function" == typeof Component.getDerivedStateFromProps && (prototype.componentWillMount = componentWillMount, 
        prototype.componentWillReceiveProps = componentWillReceiveProps), "function" == typeof prototype.getSnapshotBeforeUpdate) {
            if ("function" != typeof prototype.componentDidUpdate) throw new Error("Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype");
            prototype.componentWillUpdate = componentWillUpdate;
            var componentDidUpdate = prototype.componentDidUpdate;
            prototype.componentDidUpdate = function(prevProps, prevState, maybeSnapshot) {
                // 16.3+ will not execute our will-update method;
                // It will pass a snapshot value to did-update though.
                // Older versions will require our polyfilled will-update value.
                // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
                // Because for <= 15.x versions this might be a "prevContext" object.
                // We also can't just check "__reactInternalSnapshot",
                // Because get-snapshot might return a falsy value.
                // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
                var snapshot = this.__reactInternalSnapshotFlag ? this.__reactInternalSnapshot : maybeSnapshot;
                componentDidUpdate.call(this, prevProps, prevState, snapshot);
            };
        }
        return Component;
    }
    componentWillUpdate.__suppressDeprecationWarning = componentWillReceiveProps.__suppressDeprecationWarning = componentWillMount.__suppressDeprecationWarning = !0;
    var ArrowKeyStepper = function() {
        function ArrowKeyStepper() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, ArrowKeyStepper);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ArrowKeyStepper)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "state", {
                scrollToColumn: 0,
                scrollToRow: 0,
                instanceProps: {
                    prevScrollToColumn: 0,
                    prevScrollToRow: 0
                }
            }), _defineProperty(_assertThisInitialized(_this), "_columnStartIndex", 0), _defineProperty(_assertThisInitialized(_this), "_columnStopIndex", 0), 
            _defineProperty(_assertThisInitialized(_this), "_rowStartIndex", 0), _defineProperty(_assertThisInitialized(_this), "_rowStopIndex", 0), 
            _defineProperty(_assertThisInitialized(_this), "_onKeyDown", function(event) {
                var _this$props = _this.props, columnCount = _this$props.columnCount, disabled = _this$props.disabled, mode = _this$props.mode, rowCount = _this$props.rowCount;
                if (!disabled) {
                    var _this$_getScrollState = _this._getScrollState(), scrollToColumnPrevious = _this$_getScrollState.scrollToColumn, scrollToRowPrevious = _this$_getScrollState.scrollToRow, _this$_getScrollState2 = _this._getScrollState(), scrollToColumn = _this$_getScrollState2.scrollToColumn, scrollToRow = _this$_getScrollState2.scrollToRow;
                    switch (event.key) {
                      case "ArrowDown":
                        scrollToRow = "cells" === mode ? Math.min(scrollToRow + 1, rowCount - 1) : Math.min(_this._rowStopIndex + 1, rowCount - 1);
                        break;

                      case "ArrowLeft":
                        scrollToColumn = "cells" === mode ? Math.max(scrollToColumn - 1, 0) : Math.max(_this._columnStartIndex - 1, 0);
                        break;

                      case "ArrowRight":
                        scrollToColumn = "cells" === mode ? Math.min(scrollToColumn + 1, columnCount - 1) : Math.min(_this._columnStopIndex + 1, columnCount - 1);
                        break;

                      case "ArrowUp":
                        scrollToRow = "cells" === mode ? Math.max(scrollToRow - 1, 0) : Math.max(_this._rowStartIndex - 1, 0);
                    }
                    scrollToColumn === scrollToColumnPrevious && scrollToRow === scrollToRowPrevious || (event.preventDefault(), 
                    _this._updateScrollState({
                        scrollToColumn: scrollToColumn,
                        scrollToRow: scrollToRow
                    }));
                }
            }), _defineProperty(_assertThisInitialized(_this), "_onSectionRendered", function(_ref) {
                var columnStartIndex = _ref.columnStartIndex, columnStopIndex = _ref.columnStopIndex, rowStartIndex = _ref.rowStartIndex, rowStopIndex = _ref.rowStopIndex;
                _this._columnStartIndex = columnStartIndex, _this._columnStopIndex = columnStopIndex, 
                _this._rowStartIndex = rowStartIndex, _this._rowStopIndex = rowStopIndex;
            }), _this;
        }
        return _inherits(ArrowKeyStepper, React.PureComponent), _createClass(ArrowKeyStepper, [ {
            key: "setScrollIndexes",
            value: function(_ref2) {
                var scrollToColumn = _ref2.scrollToColumn, scrollToRow = _ref2.scrollToRow;
                this.setState({
                    scrollToRow: scrollToRow,
                    scrollToColumn: scrollToColumn
                });
            }
        }, {
            key: "render",
            value: function() {
                var _this$props2 = this.props, className = _this$props2.className, children = _this$props2.children, _this$_getScrollState3 = this._getScrollState(), scrollToColumn = _this$_getScrollState3.scrollToColumn, scrollToRow = _this$_getScrollState3.scrollToRow;
                return React.createElement("div", {
                    className: className,
                    onKeyDown: this._onKeyDown
                }, children({
                    onSectionRendered: this._onSectionRendered,
                    scrollToColumn: scrollToColumn,
                    scrollToRow: scrollToRow
                }));
            }
        }, {
            key: "_getScrollState",
            value: function() {
                return this.props.isControlled ? this.props : this.state;
            }
        }, {
            key: "_updateScrollState",
            value: function(_ref3) {
                var scrollToColumn = _ref3.scrollToColumn, scrollToRow = _ref3.scrollToRow, _this$props3 = this.props, isControlled = _this$props3.isControlled, onScrollToChange = _this$props3.onScrollToChange;
                "function" == typeof onScrollToChange && onScrollToChange({
                    scrollToColumn: scrollToColumn,
                    scrollToRow: scrollToRow
                }), isControlled || this.setState({
                    scrollToColumn: scrollToColumn,
                    scrollToRow: scrollToRow
                });
            }
        } ], [ {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                return nextProps.isControlled ? {} : nextProps.scrollToColumn !== prevState.instanceProps.prevScrollToColumn || nextProps.scrollToRow !== prevState.instanceProps.prevScrollToRow ? _objectSpread2({}, prevState, {
                    scrollToColumn: nextProps.scrollToColumn,
                    scrollToRow: nextProps.scrollToRow,
                    instanceProps: {
                        prevScrollToColumn: nextProps.scrollToColumn,
                        prevScrollToRow: nextProps.scrollToRow
                    }
                }) : {};
            }
        } ]), ArrowKeyStepper;
    }();
    function createDetectElementResize(nonce, hostWindow) {
        var _window, cancel, raf, attachEvent = void 0 !== (_window = void 0 !== hostWindow ? hostWindow : "undefined" != typeof window ? window : "undefined" != typeof self ? self : global).document && _window.document.attachEvent;
        if (!attachEvent) {
            var requestFrame = (raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame || function(fn) {
                return _window.setTimeout(fn, 20);
            }, function(fn) {
                return raf(fn);
            }), cancelFrame = (cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame || _window.clearTimeout, 
            function(id) {
                return cancel(id);
            }), resetTriggers = function(element) {
                var triggers = element.__resizeTriggers__, expand = triggers.firstElementChild, contract = triggers.lastElementChild, expandChild = expand.firstElementChild;
                contract.scrollLeft = contract.scrollWidth, contract.scrollTop = contract.scrollHeight, 
                expandChild.style.width = expand.offsetWidth + 1 + "px", expandChild.style.height = expand.offsetHeight + 1 + "px", 
                expand.scrollLeft = expand.scrollWidth, expand.scrollTop = expand.scrollHeight;
            }, scrollListener = function(e) {
                if (!(e.target.className && "function" == typeof e.target.className.indexOf && e.target.className.indexOf("contract-trigger") < 0 && e.target.className.indexOf("expand-trigger") < 0)) {
                    var element = this;
                    resetTriggers(this), this.__resizeRAF__ && cancelFrame(this.__resizeRAF__), this.__resizeRAF__ = requestFrame(function() {
                        !function(element) {
                            return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height;
                        }(element) || (element.__resizeLast__.width = element.offsetWidth, element.__resizeLast__.height = element.offsetHeight, 
                        element.__resizeListeners__.forEach(function(fn) {
                            fn.call(element, e);
                        }));
                    });
                }
            }, animation = !1, keyframeprefix = "", animationstartevent = "animationstart", domPrefixes = "Webkit Moz O ms".split(" "), startEvents = "webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "), elm = _window.document.createElement("fakeelement");
            if (void 0 !== elm.style.animationName && (animation = !0), !1 === animation) for (var i = 0; i < domPrefixes.length; i++) if (void 0 !== elm.style[domPrefixes[i] + "AnimationName"]) {
                keyframeprefix = "-" + domPrefixes[i].toLowerCase() + "-", animationstartevent = startEvents[i], 
                animation = !0;
                break;
            }
            var animationName = "resizeanim", animationKeyframes = "@" + keyframeprefix + "keyframes " + animationName + " { from { opacity: 0; } to { opacity: 0; } } ", animationStyle = keyframeprefix + "animation: 1ms " + animationName + "; ";
        }
        return {
            addResizeListener: function(element, fn) {
                if (attachEvent) element.attachEvent("onresize", fn); else {
                    if (!element.__resizeTriggers__) {
                        var doc = element.ownerDocument, elementStyle = _window.getComputedStyle(element);
                        elementStyle && "static" == elementStyle.position && (element.style.position = "relative"), 
                        function(doc) {
                            if (!doc.getElementById("detectElementResize")) {
                                var css = (animationKeyframes || "") + ".resize-triggers { " + (animationStyle || "") + 'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }', head = doc.head || doc.getElementsByTagName("head")[0], style = doc.createElement("style");
                                style.id = "detectElementResize", style.type = "text/css", null != nonce && style.setAttribute("nonce", nonce), 
                                style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(doc.createTextNode(css)), 
                                head.appendChild(style);
                            }
                        }(doc), element.__resizeLast__ = {}, element.__resizeListeners__ = [], (element.__resizeTriggers__ = doc.createElement("div")).className = "resize-triggers";
                        var expandTrigger = doc.createElement("div");
                        expandTrigger.className = "expand-trigger", expandTrigger.appendChild(doc.createElement("div"));
                        var contractTrigger = doc.createElement("div");
                        contractTrigger.className = "contract-trigger", element.__resizeTriggers__.appendChild(expandTrigger), 
                        element.__resizeTriggers__.appendChild(contractTrigger), element.appendChild(element.__resizeTriggers__), 
                        resetTriggers(element), element.addEventListener("scroll", scrollListener, !0), 
                        animationstartevent && (element.__resizeTriggers__.__animationListener__ = function(e) {
                            e.animationName == animationName && resetTriggers(element);
                        }, element.__resizeTriggers__.addEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__));
                    }
                    element.__resizeListeners__.push(fn);
                }
            },
            removeResizeListener: function(element, fn) {
                if (attachEvent) element.detachEvent("onresize", fn); else if (element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1), 
                !element.__resizeListeners__.length) {
                    element.removeEventListener("scroll", scrollListener, !0), element.__resizeTriggers__.__animationListener__ && (element.__resizeTriggers__.removeEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__), 
                    element.__resizeTriggers__.__animationListener__ = null);
                    try {
                        element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
                    } catch (e) {}
                }
            }
        };
    }
    _defineProperty(ArrowKeyStepper, "defaultProps", {
        disabled: !1,
        isControlled: !1,
        mode: "edges",
        scrollToColumn: 0,
        scrollToRow: 0
    }), polyfill(ArrowKeyStepper);
    var AutoSizer = function() {
        function AutoSizer() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, AutoSizer);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AutoSizer)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "state", {
                height: _this.props.defaultHeight || 0,
                width: _this.props.defaultWidth || 0
            }), _defineProperty(_assertThisInitialized(_this), "_parentNode", void 0), _defineProperty(_assertThisInitialized(_this), "_autoSizer", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_window", void 0), _defineProperty(_assertThisInitialized(_this), "_detectElementResize", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_onResize", function() {
                var _this$props = _this.props, disableHeight = _this$props.disableHeight, disableWidth = _this$props.disableWidth, onResize = _this$props.onResize;
                if (_this._parentNode) {
                    var height = _this._parentNode.offsetHeight || 0, width = _this._parentNode.offsetWidth || 0, style = (_this._window || window).getComputedStyle(_this._parentNode) || {}, paddingLeft = parseInt(style.paddingLeft, 10) || 0, paddingRight = parseInt(style.paddingRight, 10) || 0, paddingTop = parseInt(style.paddingTop, 10) || 0, paddingBottom = parseInt(style.paddingBottom, 10) || 0, newHeight = height - paddingTop - paddingBottom, newWidth = width - paddingLeft - paddingRight;
                    (!disableHeight && _this.state.height !== newHeight || !disableWidth && _this.state.width !== newWidth) && (_this.setState({
                        height: height - paddingTop - paddingBottom,
                        width: width - paddingLeft - paddingRight
                    }), onResize({
                        height: height,
                        width: width
                    }));
                }
            }), _defineProperty(_assertThisInitialized(_this), "_setRef", function(autoSizer) {
                _this._autoSizer = autoSizer;
            }), _this;
        }
        return _inherits(AutoSizer, React.Component), _createClass(AutoSizer, [ {
            key: "componentDidMount",
            value: function() {
                var nonce = this.props.nonce;
                this._autoSizer && this._autoSizer.parentNode && this._autoSizer.parentNode.ownerDocument && this._autoSizer.parentNode.ownerDocument.defaultView && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement && (this._parentNode = this._autoSizer.parentNode, 
                this._window = this._autoSizer.parentNode.ownerDocument.defaultView, this._detectElementResize = createDetectElementResize(nonce, this._window), 
                this._detectElementResize.addResizeListener(this._parentNode, this._onResize), this._onResize());
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._detectElementResize && this._parentNode && this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
            }
        }, {
            key: "render",
            value: function() {
                var _this$props2 = this.props, children = _this$props2.children, className = _this$props2.className, disableHeight = _this$props2.disableHeight, disableWidth = _this$props2.disableWidth, style = _this$props2.style, _this$state = this.state, height = _this$state.height, width = _this$state.width, outerStyle = {
                    overflow: "visible"
                }, childParams = {};
                return disableHeight || (outerStyle.height = 0, childParams.height = height), disableWidth || (outerStyle.width = 0, 
                childParams.width = width), React.createElement("div", {
                    className: className,
                    ref: this._setRef,
                    style: _objectSpread2({}, outerStyle, {}, style)
                }, children(childParams));
            }
        } ]), AutoSizer;
    }();
    _defineProperty(AutoSizer, "defaultProps", {
        onResize: function() {},
        disableHeight: !1,
        disableWidth: !1,
        style: {}
    });
    var CellMeasurer = function() {
        function CellMeasurer() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, CellMeasurer);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CellMeasurer)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "_child", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_measure", function() {
                var _this$props = _this.props, cache = _this$props.cache, _this$props$columnInd = _this$props.columnIndex, columnIndex = void 0 === _this$props$columnInd ? 0 : _this$props$columnInd, parent = _this$props.parent, _this$props$rowIndex = _this$props.rowIndex, rowIndex = void 0 === _this$props$rowIndex ? _this.props.index || 0 : _this$props$rowIndex, _this$_getCellMeasure = _this._getCellMeasurements(), height = _this$_getCellMeasure.height, width = _this$_getCellMeasure.width;
                height === cache.getHeight(rowIndex, columnIndex) && width === cache.getWidth(rowIndex, columnIndex) || (cache.set(rowIndex, columnIndex, width, height), 
                parent && "function" == typeof parent.recomputeGridSize && parent.recomputeGridSize({
                    columnIndex: columnIndex,
                    rowIndex: rowIndex
                }));
            }), _defineProperty(_assertThisInitialized(_this), "_registerChild", function(element) {
                !element || element instanceof Element || console.warn("CellMeasurer registerChild expects to be passed Element or null"), 
                (_this._child = element) && _this._maybeMeasureCell();
            }), _this;
        }
        return _inherits(CellMeasurer, React.PureComponent), _createClass(CellMeasurer, [ {
            key: "componentDidMount",
            value: function() {
                this._maybeMeasureCell();
            }
        }, {
            key: "componentDidUpdate",
            value: function() {
                this._maybeMeasureCell();
            }
        }, {
            key: "render",
            value: function() {
                var children = this.props.children;
                return "function" == typeof children ? children({
                    measure: this._measure,
                    registerChild: this._registerChild
                }) : children;
            }
        }, {
            key: "_getCellMeasurements",
            value: function() {
                var cache = this.props.cache, node = this._child || ReactDOM.findDOMNode(this);
                if (node && node.ownerDocument && node.ownerDocument.defaultView && node instanceof node.ownerDocument.defaultView.HTMLElement) {
                    var styleWidth = node.style.width, styleHeight = node.style.height;
                    cache.hasFixedWidth() || (node.style.width = "auto"), cache.hasFixedHeight() || (node.style.height = "auto");
                    var height = Math.ceil(node.offsetHeight), width = Math.ceil(node.offsetWidth);
                    return styleWidth && (node.style.width = styleWidth), styleHeight && (node.style.height = styleHeight), 
                    {
                        height: height,
                        width: width
                    };
                }
                return {
                    height: 0,
                    width: 0
                };
            }
        }, {
            key: "_maybeMeasureCell",
            value: function() {
                var _this$props2 = this.props, cache = _this$props2.cache, _this$props2$columnIn = _this$props2.columnIndex, columnIndex = void 0 === _this$props2$columnIn ? 0 : _this$props2$columnIn, parent = _this$props2.parent, _this$props2$rowIndex = _this$props2.rowIndex, rowIndex = void 0 === _this$props2$rowIndex ? this.props.index || 0 : _this$props2$rowIndex;
                if (!cache.has(rowIndex, columnIndex)) {
                    var _this$_getCellMeasure2 = this._getCellMeasurements(), height = _this$_getCellMeasure2.height, width = _this$_getCellMeasure2.width;
                    cache.set(rowIndex, columnIndex, width, height), parent && "function" == typeof parent.invalidateCellSizeAfterRender && parent.invalidateCellSizeAfterRender({
                        columnIndex: columnIndex,
                        rowIndex: rowIndex
                    });
                }
            }
        } ]), CellMeasurer;
    }();
    _defineProperty(CellMeasurer, "__internalCellMeasurerFlag", !1), CellMeasurer.__internalCellMeasurerFlag = !0;
    var CellMeasurerCache = function() {
        function CellMeasurerCache() {
            var _this = this, params = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
            _classCallCheck(this, CellMeasurerCache), _defineProperty(this, "_cellHeightCache", {}), 
            _defineProperty(this, "_cellWidthCache", {}), _defineProperty(this, "_columnWidthCache", {}), 
            _defineProperty(this, "_rowHeightCache", {}), _defineProperty(this, "_defaultHeight", void 0), 
            _defineProperty(this, "_defaultWidth", void 0), _defineProperty(this, "_minHeight", void 0), 
            _defineProperty(this, "_minWidth", void 0), _defineProperty(this, "_keyMapper", void 0), 
            _defineProperty(this, "_hasFixedHeight", void 0), _defineProperty(this, "_hasFixedWidth", void 0), 
            _defineProperty(this, "_columnCount", 0), _defineProperty(this, "_rowCount", 0), 
            _defineProperty(this, "columnWidth", function(_ref) {
                var index = _ref.index, key = _this._keyMapper(0, index);
                return void 0 !== _this._columnWidthCache[key] ? _this._columnWidthCache[key] : _this._defaultWidth;
            }), _defineProperty(this, "rowHeight", function(_ref2) {
                var index = _ref2.index, key = _this._keyMapper(index, 0);
                return void 0 !== _this._rowHeightCache[key] ? _this._rowHeightCache[key] : _this._defaultHeight;
            });
            var defaultHeight = params.defaultHeight, defaultWidth = params.defaultWidth, fixedHeight = params.fixedHeight, fixedWidth = params.fixedWidth, keyMapper = params.keyMapper, minHeight = params.minHeight, minWidth = params.minWidth;
            this._hasFixedHeight = !0 === fixedHeight, this._hasFixedWidth = !0 === fixedWidth, 
            this._minHeight = minHeight || 0, this._minWidth = minWidth || 0, this._keyMapper = keyMapper || defaultKeyMapper, 
            this._defaultHeight = Math.max(this._minHeight, "number" == typeof defaultHeight ? defaultHeight : 30), 
            this._defaultWidth = Math.max(this._minWidth, "number" == typeof defaultWidth ? defaultWidth : 100), 
            !1 === this._hasFixedHeight && !1 === this._hasFixedWidth && console.warn("CellMeasurerCache should only measure a cell's width or height. You have configured CellMeasurerCache to measure both. This will result in poor performance."), 
            !1 === this._hasFixedHeight && 0 === this._defaultHeight && console.warn("Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. Failing to do so will lead to unnecessary layout and poor performance."), 
            !1 === this._hasFixedWidth && 0 === this._defaultWidth && console.warn("Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. Failing to do so will lead to unnecessary layout and poor performance.");
        }
        return _createClass(CellMeasurerCache, [ {
            key: "clear",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0, key = this._keyMapper(rowIndex, columnIndex);
                delete this._cellHeightCache[key], delete this._cellWidthCache[key], this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
            }
        }, {
            key: "clearAll",
            value: function() {
                this._cellHeightCache = {}, this._cellWidthCache = {}, this._columnWidthCache = {}, 
                this._rowHeightCache = {}, this._rowCount = 0, this._columnCount = 0;
            }
        }, {
            key: "hasFixedHeight",
            value: function() {
                return this._hasFixedHeight;
            }
        }, {
            key: "hasFixedWidth",
            value: function() {
                return this._hasFixedWidth;
            }
        }, {
            key: "getHeight",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0;
                if (this._hasFixedHeight) return this._defaultHeight;
                var _key = this._keyMapper(rowIndex, columnIndex);
                return void 0 !== this._cellHeightCache[_key] ? Math.max(this._minHeight, this._cellHeightCache[_key]) : this._defaultHeight;
            }
        }, {
            key: "getWidth",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0;
                if (this._hasFixedWidth) return this._defaultWidth;
                var _key2 = this._keyMapper(rowIndex, columnIndex);
                return void 0 !== this._cellWidthCache[_key2] ? Math.max(this._minWidth, this._cellWidthCache[_key2]) : this._defaultWidth;
            }
        }, {
            key: "has",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0, key = this._keyMapper(rowIndex, columnIndex);
                return void 0 !== this._cellHeightCache[key];
            }
        }, {
            key: "set",
            value: function(rowIndex, columnIndex, width, height) {
                var key = this._keyMapper(rowIndex, columnIndex);
                columnIndex >= this._columnCount && (this._columnCount = columnIndex + 1), rowIndex >= this._rowCount && (this._rowCount = rowIndex + 1), 
                this._cellHeightCache[key] = height, this._cellWidthCache[key] = width, this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
            }
        }, {
            key: "_updateCachedColumnAndRowSizes",
            value: function(rowIndex, columnIndex) {
                if (!this._hasFixedWidth) {
                    for (var columnWidth = 0, i = 0; i < this._rowCount; i++) columnWidth = Math.max(columnWidth, this.getWidth(i, columnIndex));
                    var columnKey = this._keyMapper(0, columnIndex);
                    this._columnWidthCache[columnKey] = columnWidth;
                }
                if (!this._hasFixedHeight) {
                    for (var rowHeight = 0, _i = 0; _i < this._columnCount; _i++) rowHeight = Math.max(rowHeight, this.getHeight(rowIndex, _i));
                    var rowKey = this._keyMapper(rowIndex, 0);
                    this._rowHeightCache[rowKey] = rowHeight;
                }
            }
        }, {
            key: "defaultHeight",
            get: function() {
                return this._defaultHeight;
            }
        }, {
            key: "defaultWidth",
            get: function() {
                return this._defaultWidth;
            }
        } ]), CellMeasurerCache;
    }();
    function defaultKeyMapper(rowIndex, columnIndex) {
        return "".concat(rowIndex, "-").concat(columnIndex);
    }
    function unwrapExports(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
    }
    function createCommonjsModule(fn, module) {
        return fn(module = {
            exports: {}
        }, module.exports), module.exports;
    }
    var reactIs_production_min = createCommonjsModule(function(module, exports) {
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var b = "function" == typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") : 60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.fundamental") : 60117, w = b ? Symbol.for("react.responder") : 60118, x = b ? Symbol.for("react.scope") : 60119;
        function y(a) {
            if ("object" == typeof a && null !== a) {
                var u = a.$$typeof;
                switch (u) {
                  case c:
                    switch (a = a.type) {
                      case l:
                      case m:
                      case e:
                      case g:
                      case f:
                      case p:
                        return a;

                      default:
                        switch (a = a && a.$$typeof) {
                          case k:
                          case n:
                          case h:
                            return a;

                          default:
                            return u;
                        }
                    }

                  case t:
                  case r:
                  case d:
                    return u;
                }
            }
        }
        function z(a) {
            return y(a) === m;
        }
        exports.typeOf = y, exports.AsyncMode = l, exports.ConcurrentMode = m, exports.ContextConsumer = k, 
        exports.ContextProvider = h, exports.Element = c, exports.ForwardRef = n, exports.Fragment = e, 
        exports.Lazy = t, exports.Memo = r, exports.Portal = d, exports.Profiler = g, exports.StrictMode = f, 
        exports.Suspense = p, exports.isValidElementType = function(a) {
            return "string" == typeof a || "function" == typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" == typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === v || a.$$typeof === w || a.$$typeof === x);
        }, exports.isAsyncMode = function(a) {
            return z(a) || y(a) === l;
        }, exports.isConcurrentMode = z, exports.isContextConsumer = function(a) {
            return y(a) === k;
        }, exports.isContextProvider = function(a) {
            return y(a) === h;
        }, exports.isElement = function(a) {
            return "object" == typeof a && null !== a && a.$$typeof === c;
        }, exports.isForwardRef = function(a) {
            return y(a) === n;
        }, exports.isFragment = function(a) {
            return y(a) === e;
        }, exports.isLazy = function(a) {
            return y(a) === t;
        }, exports.isMemo = function(a) {
            return y(a) === r;
        }, exports.isPortal = function(a) {
            return y(a) === d;
        }, exports.isProfiler = function(a) {
            return y(a) === g;
        }, exports.isStrictMode = function(a) {
            return y(a) === f;
        }, exports.isSuspense = function(a) {
            return y(a) === p;
        };
    });
    unwrapExports(reactIs_production_min);
    reactIs_production_min.typeOf, reactIs_production_min.AsyncMode, reactIs_production_min.ConcurrentMode, 
    reactIs_production_min.ContextConsumer, reactIs_production_min.ContextProvider, 
    reactIs_production_min.Element, reactIs_production_min.ForwardRef, reactIs_production_min.Fragment, 
    reactIs_production_min.Lazy, reactIs_production_min.Memo, reactIs_production_min.Portal, 
    reactIs_production_min.Profiler, reactIs_production_min.StrictMode, reactIs_production_min.Suspense, 
    reactIs_production_min.isValidElementType, reactIs_production_min.isAsyncMode, reactIs_production_min.isConcurrentMode, 
    reactIs_production_min.isContextConsumer, reactIs_production_min.isContextProvider, 
    reactIs_production_min.isElement, reactIs_production_min.isForwardRef, reactIs_production_min.isFragment, 
    reactIs_production_min.isLazy, reactIs_production_min.isMemo, reactIs_production_min.isPortal, 
    reactIs_production_min.isProfiler, reactIs_production_min.isStrictMode, reactIs_production_min.isSuspense;
    var reactIs_development = createCommonjsModule(function(module, exports) {
        !function() {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
            // nor polyfill, then a plain number is used for performance.
            var hasSymbol = "function" == typeof Symbol && Symbol.for, REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103, REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106, REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107, REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108, REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114, REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109, REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110, REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111, REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111, REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112, REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113, REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120, REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115, REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116, REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117, REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118, REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
            /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */
            var lowPriorityWarningWithoutStack$1 = function(condition, format) {
                if (void 0 === format) throw new Error("`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning message argument");
                if (!condition) {
                    for (var _len2 = arguments.length, args = new Array(2 < _len2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) args[_key2 - 2] = arguments[_key2];
                    (function(format) {
                        for (var _len = arguments.length, args = new Array(1 < _len ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                        var argIndex = 0, message = "Warning: " + format.replace(/%s/g, function() {
                            return args[argIndex++];
                        });
                        "undefined" != typeof console && console.warn(message);
                        try {
                            // --- Welcome to debugging React ---
                            // This error was thrown as a convenience so that you can use this stack
                            // to find the callsite that caused this warning to fire.
                            throw new Error(message);
                        } catch (x) {}
                    }).apply(void 0, [ format ].concat(args));
                }
            };
            function typeOf(object) {
                if ("object" == typeof object && null !== object) {
                    var $$typeof = object.$$typeof;
                    switch ($$typeof) {
                      case REACT_ELEMENT_TYPE:
                        var type = object.type;
                        switch (type) {
                          case REACT_ASYNC_MODE_TYPE:
                          case REACT_CONCURRENT_MODE_TYPE:
                          case REACT_FRAGMENT_TYPE:
                          case REACT_PROFILER_TYPE:
                          case REACT_STRICT_MODE_TYPE:
                          case REACT_SUSPENSE_TYPE:
                            return type;

                          default:
                            var $$typeofType = type && type.$$typeof;
                            switch ($$typeofType) {
                              case REACT_CONTEXT_TYPE:
                              case REACT_FORWARD_REF_TYPE:
                              case REACT_PROVIDER_TYPE:
                                return $$typeofType;

                              default:
                                return $$typeof;
                            }
                        }

                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PORTAL_TYPE:
                        return $$typeof;
                    }
                }
            }
 // AsyncMode is deprecated along with isAsyncMode
                        var AsyncMode = REACT_ASYNC_MODE_TYPE, ConcurrentMode = REACT_CONCURRENT_MODE_TYPE, ContextConsumer = REACT_CONTEXT_TYPE, ContextProvider = REACT_PROVIDER_TYPE, Element = REACT_ELEMENT_TYPE, ForwardRef = REACT_FORWARD_REF_TYPE, Fragment = REACT_FRAGMENT_TYPE, Lazy = REACT_LAZY_TYPE, Memo = REACT_MEMO_TYPE, Portal = REACT_PORTAL_TYPE, Profiler = REACT_PROFILER_TYPE, StrictMode = REACT_STRICT_MODE_TYPE, Suspense = REACT_SUSPENSE_TYPE, hasWarnedAboutDeprecatedIsAsyncMode = !1;
            function isConcurrentMode(object) {
                return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
            }
            exports.typeOf = typeOf, exports.AsyncMode = AsyncMode, exports.ConcurrentMode = ConcurrentMode, 
            exports.ContextConsumer = ContextConsumer, exports.ContextProvider = ContextProvider, 
            exports.Element = Element, exports.ForwardRef = ForwardRef, exports.Fragment = Fragment, 
            exports.Lazy = Lazy, exports.Memo = Memo, exports.Portal = Portal, exports.Profiler = Profiler, 
            exports.StrictMode = StrictMode, exports.Suspense = Suspense, exports.isValidElementType = function(type) {
                return "string" == typeof type || "function" == typeof type || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
                type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || "object" == typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
            }, exports.isAsyncMode = // AsyncMode should be deprecated
            function(object) {
                return hasWarnedAboutDeprecatedIsAsyncMode || lowPriorityWarningWithoutStack$1(!(hasWarnedAboutDeprecatedIsAsyncMode = !0), "The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API."), 
                isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
            }, exports.isConcurrentMode = isConcurrentMode, exports.isContextConsumer = function(object) {
                return typeOf(object) === REACT_CONTEXT_TYPE;
            }, exports.isContextProvider = function(object) {
                return typeOf(object) === REACT_PROVIDER_TYPE;
            }, exports.isElement = function(object) {
                return "object" == typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
            }, exports.isForwardRef = function(object) {
                return typeOf(object) === REACT_FORWARD_REF_TYPE;
            }, exports.isFragment = function(object) {
                return typeOf(object) === REACT_FRAGMENT_TYPE;
            }, exports.isLazy = function(object) {
                return typeOf(object) === REACT_LAZY_TYPE;
            }, exports.isMemo = function(object) {
                return typeOf(object) === REACT_MEMO_TYPE;
            }, exports.isPortal = function(object) {
                return typeOf(object) === REACT_PORTAL_TYPE;
            }, exports.isProfiler = function(object) {
                return typeOf(object) === REACT_PROFILER_TYPE;
            }, exports.isStrictMode = function(object) {
                return typeOf(object) === REACT_STRICT_MODE_TYPE;
            }, exports.isSuspense = function(object) {
                return typeOf(object) === REACT_SUSPENSE_TYPE;
            };
        }();
    });
    unwrapExports(reactIs_development);
    reactIs_development.typeOf, reactIs_development.AsyncMode, reactIs_development.ConcurrentMode, 
    reactIs_development.ContextConsumer, reactIs_development.ContextProvider, reactIs_development.Element, 
    reactIs_development.ForwardRef, reactIs_development.Fragment, reactIs_development.Lazy, 
    reactIs_development.Memo, reactIs_development.Portal, reactIs_development.Profiler, 
    reactIs_development.StrictMode, reactIs_development.Suspense, reactIs_development.isValidElementType, 
    reactIs_development.isAsyncMode, reactIs_development.isConcurrentMode, reactIs_development.isContextConsumer, 
    reactIs_development.isContextProvider, reactIs_development.isElement, reactIs_development.isForwardRef, 
    reactIs_development.isFragment, reactIs_development.isLazy, reactIs_development.isMemo, 
    reactIs_development.isPortal, reactIs_development.isProfiler, reactIs_development.isStrictMode, 
    reactIs_development.isSuspense;
    var reactIs = createCommonjsModule(function(module) {
        module.exports = reactIs_development;
    }), getOwnPropertySymbols = Object.getOwnPropertySymbols, hasOwnProperty = Object.prototype.hasOwnProperty, propIsEnumerable = Object.prototype.propertyIsEnumerable;
    var printWarning, objectAssign = function() {
        try {
            if (!Object.assign) return !1;
            // Detect buggy property enumeration order in older V8 versions.
            // https://bugs.chromium.org/p/v8/issues/detail?id=4118
                        var test1 = new String("abc");
 // eslint-disable-line no-new-wrappers
                        if (test1[5] = "de", "5" === Object.getOwnPropertyNames(test1)[0]) return !1;
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                        for (var test2 = {}, i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
            if ("0123456789" !== Object.getOwnPropertyNames(test2).map(function(n) {
                return test2[n];
            }).join("")) return !1;
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                        var test3 = {};
            return "abcdefghijklmnopqrst".split("").forEach(function(letter) {
                test3[letter] = letter;
            }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, test3)).join("");
        } catch (err) {
            // We don't expect any of the above to throw, but better to be safe.
            return !1;
        }
    }() ? Object.assign : function(target, source) {
        for (var from, symbols, to = function(val) {
            if (null == val) throw new TypeError("Object.assign cannot be called with null or undefined");
            return Object(val);
        }(target), s = 1; s < arguments.length; s++) {
            for (var key in from = Object(arguments[s])) hasOwnProperty.call(from, key) && (to[key] = from[key]);
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) propIsEnumerable.call(from, symbols[i]) && (to[symbols[i]] = from[symbols[i]]);
            }
        }
        return to;
    }, ReactPropTypesSecret_1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED", loggedTypeFailures = {}, has = Function.call.bind(Object.prototype.hasOwnProperty);
    /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */    
    /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
        for (var typeSpecName in typeSpecs) if (has(typeSpecs, typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
                        try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                if ("function" != typeof typeSpecs[typeSpecName]) {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.");
                    throw err.name = "Invariant Violation", err;
                }
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ex) {
                error = ex;
            }
            if (!error || error instanceof Error || printWarning((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."), 
            error instanceof Error && !(error.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error.message] = !0;
                var stack = getStack ? getStack() : "";
                printWarning("Failed " + location + " type: " + error.message + (null != stack ? stack : ""));
            }
        }
    }
    /**
   * Resets warning cache when testing.
   *
   * @private
   */    printWarning = function(text) {
        var message = "Warning: " + text;
        "undefined" != typeof console && console.error(message);
        try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
        } catch (x) {}
    }, checkPropTypes.resetWarningCache = function() {
        loggedTypeFailures = {};
    };
    var printWarning$1, checkPropTypes_1 = checkPropTypes, has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
    function emptyFunctionThatReturnsNull() {
        return null;
    }
    printWarning$1 = function(text) {
        var message = "Warning: " + text;
        "undefined" != typeof console && console.error(message);
        try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
        } catch (x) {}
    };
    function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
        /* global Symbol */
        var ITERATOR_SYMBOL = "function" == typeof Symbol && Symbol.iterator, FAUX_ITERATOR_SYMBOL = "@@iterator", ANONYMOUS = "<<anonymous>>", ReactPropTypes = {
            array: createPrimitiveTypeChecker("array"),
            bool: createPrimitiveTypeChecker("boolean"),
            func: createPrimitiveTypeChecker("function"),
            number: createPrimitiveTypeChecker("number"),
            object: createPrimitiveTypeChecker("object"),
            string: createPrimitiveTypeChecker("string"),
            symbol: createPrimitiveTypeChecker("symbol"),
            any: createChainableTypeChecker(emptyFunctionThatReturnsNull),
            arrayOf: function(typeChecker) {
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    if ("function" != typeof typeChecker) return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
                    var propValue = props[propName];
                    if (!Array.isArray(propValue)) return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + getPropType(propValue) + "` supplied to `" + componentName + "`, expected an array.");
                    for (var i = 0; i < propValue.length; i++) {
                        var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret_1);
                        if (error instanceof Error) return error;
                    }
                    return null;
                });
            },
            element: createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                return isValidElement(propValue) ? null : new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + getPropType(propValue) + "` supplied to `" + componentName + "`, expected a single ReactElement.");
            }),
            elementType: createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                return reactIs.isValidElementType(propValue) ? null : new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + getPropType(propValue) + "` supplied to `" + componentName + "`, expected a single ReactElement type.");
            }),
            instanceOf: function(expectedClass) {
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    if (props[propName] instanceof expectedClass) return null;
                    var expectedClassName = expectedClass.name || ANONYMOUS;
                    return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + 
                    // Returns class name of the object, if any.
                    function(propValue) {
                        return propValue.constructor && propValue.constructor.name ? propValue.constructor.name : ANONYMOUS;
                    }(props[propName]) + "` supplied to `" + componentName + "`, expected instance of `" + expectedClassName + "`.");
                });
            },
            node: createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                return isNode(props[propName]) ? null : new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to `" + componentName + "`, expected a ReactNode.");
            }),
            objectOf: function(typeChecker) {
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    if ("function" != typeof typeChecker) return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
                    var propValue = props[propName], propType = getPropType(propValue);
                    if ("object" !== propType) return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` supplied to `" + componentName + "`, expected an object.");
                    for (var key in propValue) if (has$1(propValue, key)) {
                        var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret_1);
                        if (error instanceof Error) return error;
                    }
                    return null;
                });
            },
            oneOf: function(expectedValues) {
                if (!Array.isArray(expectedValues)) return printWarning$1(1 < arguments.length ? "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])." : "Invalid argument supplied to oneOf, expected an array."), 
                emptyFunctionThatReturnsNull;
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    for (var propValue = props[propName], i = 0; i < expectedValues.length; i++) if (is(propValue, expectedValues[i])) return null;
                    var valuesString = JSON.stringify(expectedValues, function(key, value) {
                        return "symbol" === getPreciseType(value) ? String(value) : value;
                    });
                    return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` supplied to `" + componentName + "`, expected one of " + valuesString + ".");
                });
            },
            oneOfType: function(arrayOfTypeCheckers) {
                if (!Array.isArray(arrayOfTypeCheckers)) return printWarning$1("Invalid argument supplied to oneOfType, expected an instance of array."), 
                emptyFunctionThatReturnsNull;
                for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                    var checker = arrayOfTypeCheckers[i];
                    if ("function" != typeof checker) return printWarning$1("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + "."), 
                    emptyFunctionThatReturnsNull;
                }
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                        if (null == (0, arrayOfTypeCheckers[i])(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1)) return null;
                    }
                    return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to `" + componentName + "`.");
                });
            },
            shape: function(shapeTypes) {
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    var propValue = props[propName], propType = getPropType(propValue);
                    if ("object" !== propType) return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` supplied to `" + componentName + "`, expected `object`.");
                    for (var key in shapeTypes) {
                        var checker = shapeTypes[key];
                        if (checker) {
                            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret_1);
                            if (error) return error;
                        }
                    }
                    return null;
                });
            },
            exact: function(shapeTypes) {
                return createChainableTypeChecker(function(props, propName, componentName, location, propFullName) {
                    var propValue = props[propName], propType = getPropType(propValue);
                    if ("object" !== propType) return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` supplied to `" + componentName + "`, expected `object`.");
                    // We need to check all keys in case some are required but missing from
                    // props.
                                        var allKeys = objectAssign({}, props[propName], shapeTypes);
                    for (var key in allKeys) {
                        var checker = shapeTypes[key];
                        if (!checker) return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
                        var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret_1);
                        if (error) return error;
                    }
                    return null;
                });
            }
        };
        /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
        /*eslint-disable no-self-compare*/
        function is(x, y) {
            // SameValue algorithm
            return x === y ? 0 !== x || 1 / x == 1 / y : x != x && y != y;
        }
        /*eslint-enable no-self-compare*/
        /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */        function PropTypeError(message) {
            this.message = message, this.stack = "";
        }
        // Make `instanceof Error` still work for returned errors.
                function createChainableTypeChecker(validate) {
            var manualPropTypeCallCache = {}, manualPropTypeWarningCount = 0;
            function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
                if (componentName = componentName || ANONYMOUS, propFullName = propFullName || propName, 
                secret !== ReactPropTypesSecret_1) {
                    if (throwOnDirectAccess) {
                        // New behavior only for users of `prop-types` package
                        var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
                        throw err.name = "Invariant Violation", err;
                    }
                    if ("undefined" != typeof console) {
                        // Old behavior for people using React.PropTypes
                        var cacheKey = componentName + ":" + propName;
                        !manualPropTypeCallCache[cacheKey] && 
                        // Avoid spamming the console because they are often not actionable except for lib authors
                        manualPropTypeWarningCount < 3 && (printWarning$1("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."), 
                        manualPropTypeCallCache[cacheKey] = !0, manualPropTypeWarningCount++);
                    }
                }
                return null == props[propName] ? isRequired ? null === props[propName] ? new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in `" + componentName + "`, but its value is `null`.") : new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in `" + componentName + "`, but its value is `undefined`.") : null : validate(props, propName, componentName, location, propFullName);
            }
            var chainedCheckType = checkType.bind(null, !1);
            return chainedCheckType.isRequired = checkType.bind(null, !0), chainedCheckType;
        }
        function createPrimitiveTypeChecker(expectedType) {
            return createChainableTypeChecker(function(props, propName, componentName, location, propFullName, secret) {
                var propValue = props[propName];
                return getPropType(propValue) === expectedType ? null : new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + getPreciseType(propValue) + "` supplied to `" + componentName + "`, expected `" + expectedType + "`.");
            });
        }
        function isNode(propValue) {
            switch (typeof propValue) {
              case "number":
              case "string":
              case "undefined":
                return !0;

              case "boolean":
                return !propValue;

              case "object":
                if (Array.isArray(propValue)) return propValue.every(isNode);
                if (null === propValue || isValidElement(propValue)) return !0;
                var iteratorFn = // Before Symbol spec.
                /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
                function(maybeIterable) {
                    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
                    if ("function" == typeof iteratorFn) return iteratorFn;
                }
                /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */ (propValue);
                if (!iteratorFn) return !1;
                var step, iterator = iteratorFn.call(propValue);
                if (iteratorFn !== propValue.entries) {
                    for (;!(step = iterator.next()).done; ) if (!isNode(step.value)) return !1;
                } else 
                // Iterator will provide entry [k,v] tuples rather than values.
                for (;!(step = iterator.next()).done; ) {
                    var entry = step.value;
                    if (entry && !isNode(entry[1])) return !1;
                }
                return !0;

              default:
                return !1;
            }
        }
        // Equivalent of `typeof` but with special handling for array and regexp.
        function getPropType(propValue) {
            var propType = typeof propValue;
            return Array.isArray(propValue) ? "array" : propValue instanceof RegExp ? "object" : function(propType, propValue) {
                // Native Symbol.
                return "symbol" === propType || 
                // falsy value can't be a Symbol
                !!propValue && (
                // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
                "Symbol" === propValue["@@toStringTag"] || "function" == typeof Symbol && propValue instanceof Symbol);
            }(propType, propValue) ? "symbol" : propType;
        }
        // This handles more types than `getPropType`. Only used for error messages.
        // See `createPrimitiveTypeChecker`.
                function getPreciseType(propValue) {
            if (null == propValue) return "" + propValue;
            var propType = getPropType(propValue);
            if ("object" === propType) {
                if (propValue instanceof Date) return "date";
                if (propValue instanceof RegExp) return "regexp";
            }
            return propType;
        }
        // Returns a string that is postfixed to a warning about an invalid type.
        // For example, "undefined" or "of type array"
                function getPostfixForTypeWarning(value) {
            var type = getPreciseType(value);
            switch (type) {
              case "array":
              case "object":
                return "an " + type;

              case "boolean":
              case "date":
              case "regexp":
                return "a " + type;

              default:
                return type;
            }
        }
        return PropTypeError.prototype = Error.prototype, ReactPropTypes.checkPropTypes = checkPropTypes_1, 
        ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache, ReactPropTypes.PropTypes = ReactPropTypes;
    }
    var propTypes = createCommonjsModule(function(module) {
        var ReactIs = reactIs;
        // By explicitly using `prop-types` you are opting into new development behavior.
        // http://fb.me/prop-types-in-prod
                module.exports = factoryWithTypeCheckers(ReactIs.isElement, !0);
    });
    function toVal(mix) {
        var k, y, str = "";
        if (mix) if ("object" == typeof mix) if (mix.push) for (k = 0; k < mix.length; k++) mix[k] && (y = toVal(mix[k])) && (str && (str += " "), 
        str += y); else for (k in mix) mix[k] && (y = toVal(k)) && (str && (str += " "), 
        str += y); else "boolean" == typeof mix || mix.call || (str && (str += " "), str += mix);
        return str;
    }
    function clsx() {
        for (var x, i = 0, str = ""; i < arguments.length; ) (x = toVal(arguments[i++])) && (str && (str += " "), 
        str += x);
        return str;
    }
    function createCallbackMemoizer(argument_0) {
        var requireAllKeys = !(0 < arguments.length && void 0 !== argument_0) || argument_0, cachedIndices = {};
        return function(_ref) {
            var callback = _ref.callback, indices = _ref.indices, keys = Object.keys(indices), allInitialized = !requireAllKeys || keys.every(function(key) {
                var value = indices[key];
                return Array.isArray(value) ? 0 < value.length : 0 <= value;
            }), indexChanged = keys.length !== Object.keys(cachedIndices).length || keys.some(function(key) {
                var cachedValue = cachedIndices[key], value = indices[key];
                return Array.isArray(value) ? cachedValue.join(",") !== value.join(",") : cachedValue !== value;
            });
            cachedIndices = indices, allInitialized && indexChanged && callback(indices);
        };
    }
    var size, canUseDOM = !("undefined" == typeof window || !window.document || !window.document.createElement);
    function scrollbarSize(recalc) {
        if ((!size && 0 !== size || recalc) && canUseDOM) {
            var scrollDiv = document.createElement("div");
            scrollDiv.style.position = "absolute", scrollDiv.style.top = "-9999px", scrollDiv.style.width = "50px", 
            scrollDiv.style.height = "50px", scrollDiv.style.overflow = "scroll", document.body.appendChild(scrollDiv), 
            size = scrollDiv.offsetWidth - scrollDiv.clientWidth, document.body.removeChild(scrollDiv);
        }
        return size;
    }
    var SCROLL_POSITION_CHANGE_REASONS_OBSERVED = "observed", SCROLL_POSITION_CHANGE_REASONS_REQUESTED = "requested", CollectionView = function() {
        function CollectionView() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, CollectionView);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CollectionView)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "state", {
                isScrolling: !1,
                scrollLeft: 0,
                scrollTop: 0
            }), _defineProperty(_assertThisInitialized(_this), "_calculateSizeAndPositionDataOnNextUpdate", !1), 
            _defineProperty(_assertThisInitialized(_this), "_onSectionRenderedMemoizer", createCallbackMemoizer()), 
            _defineProperty(_assertThisInitialized(_this), "_onScrollMemoizer", createCallbackMemoizer(!1)), 
            _defineProperty(_assertThisInitialized(_this), "_invokeOnSectionRenderedHelper", function() {
                var _this$props = _this.props, cellLayoutManager = _this$props.cellLayoutManager, onSectionRendered = _this$props.onSectionRendered;
                _this._onSectionRenderedMemoizer({
                    callback: onSectionRendered,
                    indices: {
                        indices: cellLayoutManager.getLastRenderedIndices()
                    }
                });
            }), _defineProperty(_assertThisInitialized(_this), "_setScrollingContainerRef", function(ref) {
                _this._scrollingContainer = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_updateScrollPositionForScrollToCell", function() {
                var _this$props2 = _this.props, cellLayoutManager = _this$props2.cellLayoutManager, height = _this$props2.height, scrollToAlignment = _this$props2.scrollToAlignment, scrollToCell = _this$props2.scrollToCell, width = _this$props2.width, _this$state = _this.state, scrollLeft = _this$state.scrollLeft, scrollTop = _this$state.scrollTop;
                if (0 <= scrollToCell) {
                    var scrollPosition = cellLayoutManager.getScrollPositionForCell({
                        align: scrollToAlignment,
                        cellIndex: scrollToCell,
                        height: height,
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        width: width
                    });
                    scrollPosition.scrollLeft === scrollLeft && scrollPosition.scrollTop === scrollTop || _this._setScrollPosition(scrollPosition);
                }
            }), _defineProperty(_assertThisInitialized(_this), "_onScroll", function(event) {
                if (event.target === _this._scrollingContainer) {
                    _this._enablePointerEventsAfterDelay();
                    var _this$props3 = _this.props, cellLayoutManager = _this$props3.cellLayoutManager, height = _this$props3.height, isScrollingChange = _this$props3.isScrollingChange, width = _this$props3.width, scrollbarSize = _this._scrollbarSize, _cellLayoutManager$ge = cellLayoutManager.getTotalSize(), totalHeight = _cellLayoutManager$ge.height, totalWidth = _cellLayoutManager$ge.width, scrollLeft = Math.max(0, Math.min(totalWidth - width + scrollbarSize, event.target.scrollLeft)), scrollTop = Math.max(0, Math.min(totalHeight - height + scrollbarSize, event.target.scrollTop));
                    if (_this.state.scrollLeft !== scrollLeft || _this.state.scrollTop !== scrollTop) {
                        var scrollPositionChangeReason = event.cancelable ? SCROLL_POSITION_CHANGE_REASONS_OBSERVED : SCROLL_POSITION_CHANGE_REASONS_REQUESTED;
                        _this.state.isScrolling || isScrollingChange(!0), _this.setState({
                            isScrolling: !0,
                            scrollLeft: scrollLeft,
                            scrollPositionChangeReason: scrollPositionChangeReason,
                            scrollTop: scrollTop
                        });
                    }
                    _this._invokeOnScrollMemoizer({
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        totalWidth: totalWidth,
                        totalHeight: totalHeight
                    });
                }
            }), _this._scrollbarSize = scrollbarSize(), void 0 === _this._scrollbarSize ? (_this._scrollbarSizeMeasured = !1, 
            _this._scrollbarSize = 0) : _this._scrollbarSizeMeasured = !0, _this;
        }
        return _inherits(CollectionView, React.PureComponent), _createClass(CollectionView, [ {
            key: "recomputeCellSizesAndPositions",
            value: function() {
                this._calculateSizeAndPositionDataOnNextUpdate = !0, this.forceUpdate();
            }
        }, {
            key: "componentDidMount",
            value: function() {
                var _this$props4 = this.props, cellLayoutManager = _this$props4.cellLayoutManager, scrollLeft = _this$props4.scrollLeft, scrollToCell = _this$props4.scrollToCell, scrollTop = _this$props4.scrollTop;
                this._scrollbarSizeMeasured || (this._scrollbarSize = scrollbarSize(), this._scrollbarSizeMeasured = !0, 
                this.setState({})), 0 <= scrollToCell ? this._updateScrollPositionForScrollToCell() : (0 <= scrollLeft || 0 <= scrollTop) && this._setScrollPosition({
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop
                }), this._invokeOnSectionRenderedHelper();
                var _cellLayoutManager$ge2 = cellLayoutManager.getTotalSize(), totalHeight = _cellLayoutManager$ge2.height, totalWidth = _cellLayoutManager$ge2.width;
                this._invokeOnScrollMemoizer({
                    scrollLeft: scrollLeft || 0,
                    scrollTop: scrollTop || 0,
                    totalHeight: totalHeight,
                    totalWidth: totalWidth
                });
            }
        }, {
            key: "componentDidUpdate",
            value: function(prevProps, prevState) {
                var _this$props5 = this.props, height = _this$props5.height, scrollToAlignment = _this$props5.scrollToAlignment, scrollToCell = _this$props5.scrollToCell, width = _this$props5.width, _this$state2 = this.state, scrollLeft = _this$state2.scrollLeft, scrollPositionChangeReason = _this$state2.scrollPositionChangeReason, scrollTop = _this$state2.scrollTop;
                scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS_REQUESTED && (0 <= scrollLeft && scrollLeft !== prevState.scrollLeft && scrollLeft !== this._scrollingContainer.scrollLeft && (this._scrollingContainer.scrollLeft = scrollLeft), 
                0 <= scrollTop && scrollTop !== prevState.scrollTop && scrollTop !== this._scrollingContainer.scrollTop && (this._scrollingContainer.scrollTop = scrollTop)), 
                height === prevProps.height && scrollToAlignment === prevProps.scrollToAlignment && scrollToCell === prevProps.scrollToCell && width === prevProps.width || this._updateScrollPositionForScrollToCell(), 
                this._invokeOnSectionRenderedHelper();
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._disablePointerEventsTimeoutId && clearTimeout(this._disablePointerEventsTimeoutId);
            }
        }, {
            key: "render",
            value: function() {
                var _this$props6 = this.props, autoHeight = _this$props6.autoHeight, cellCount = _this$props6.cellCount, cellLayoutManager = _this$props6.cellLayoutManager, className = _this$props6.className, height = _this$props6.height, horizontalOverscanSize = _this$props6.horizontalOverscanSize, id = _this$props6.id, noContentRenderer = _this$props6.noContentRenderer, style = _this$props6.style, verticalOverscanSize = _this$props6.verticalOverscanSize, width = _this$props6.width, _this$state3 = this.state, isScrolling = _this$state3.isScrolling, scrollLeft = _this$state3.scrollLeft, scrollTop = _this$state3.scrollTop;
                this._lastRenderedCellCount === cellCount && this._lastRenderedCellLayoutManager === cellLayoutManager && !this._calculateSizeAndPositionDataOnNextUpdate || (this._lastRenderedCellCount = cellCount, 
                this._lastRenderedCellLayoutManager = cellLayoutManager, this._calculateSizeAndPositionDataOnNextUpdate = !1, 
                cellLayoutManager.calculateSizeAndPositionData());
                var _cellLayoutManager$ge3 = cellLayoutManager.getTotalSize(), totalHeight = _cellLayoutManager$ge3.height, totalWidth = _cellLayoutManager$ge3.width, left = Math.max(0, scrollLeft - horizontalOverscanSize), top = Math.max(0, scrollTop - verticalOverscanSize), right = Math.min(totalWidth, scrollLeft + width + horizontalOverscanSize), bottom = Math.min(totalHeight, scrollTop + height + verticalOverscanSize), childrenToDisplay = 0 < height && 0 < width ? cellLayoutManager.cellRenderers({
                    height: bottom - top,
                    isScrolling: isScrolling,
                    width: right - left,
                    x: left,
                    y: top
                }) : [], collectionStyle = {
                    boxSizing: "border-box",
                    direction: "ltr",
                    height: autoHeight ? "auto" : height,
                    position: "relative",
                    WebkitOverflowScrolling: "touch",
                    width: width,
                    willChange: "transform"
                }, verticalScrollBarSize = height < totalHeight ? this._scrollbarSize : 0, horizontalScrollBarSize = width < totalWidth ? this._scrollbarSize : 0;
                return collectionStyle.overflowX = totalWidth + verticalScrollBarSize <= width ? "hidden" : "auto", 
                collectionStyle.overflowY = totalHeight + horizontalScrollBarSize <= height ? "hidden" : "auto", 
                React.createElement("div", {
                    ref: this._setScrollingContainerRef,
                    "aria-label": this.props["aria-label"],
                    className: clsx("ReactVirtualized__Collection", className),
                    id: id,
                    onScroll: this._onScroll,
                    role: "grid",
                    style: _objectSpread2({}, collectionStyle, {}, style),
                    tabIndex: 0
                }, 0 < cellCount && React.createElement("div", {
                    className: "ReactVirtualized__Collection__innerScrollContainer",
                    style: {
                        height: totalHeight,
                        maxHeight: totalHeight,
                        maxWidth: totalWidth,
                        overflow: "hidden",
                        pointerEvents: isScrolling ? "none" : "",
                        width: totalWidth
                    }
                }, childrenToDisplay), 0 === cellCount && noContentRenderer());
            }
        }, {
            key: "_enablePointerEventsAfterDelay",
            value: function() {
                var _this2 = this;
                this._disablePointerEventsTimeoutId && clearTimeout(this._disablePointerEventsTimeoutId), 
                this._disablePointerEventsTimeoutId = setTimeout(function() {
                    (0, _this2.props.isScrollingChange)(!1), _this2._disablePointerEventsTimeoutId = null, 
                    _this2.setState({
                        isScrolling: !1
                    });
                }, 150);
            }
        }, {
            key: "_invokeOnScrollMemoizer",
            value: function(_ref) {
                var _this3 = this, scrollLeft = _ref.scrollLeft, scrollTop = _ref.scrollTop, totalHeight = _ref.totalHeight, totalWidth = _ref.totalWidth;
                this._onScrollMemoizer({
                    callback: function(_ref2) {
                        var scrollLeft = _ref2.scrollLeft, scrollTop = _ref2.scrollTop, _this3$props = _this3.props, height = _this3$props.height;
                        (0, _this3$props.onScroll)({
                            clientHeight: height,
                            clientWidth: _this3$props.width,
                            scrollHeight: totalHeight,
                            scrollLeft: scrollLeft,
                            scrollTop: scrollTop,
                            scrollWidth: totalWidth
                        });
                    },
                    indices: {
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop
                    }
                });
            }
        }, {
            key: "_setScrollPosition",
            value: function(_ref3) {
                var scrollLeft = _ref3.scrollLeft, scrollTop = _ref3.scrollTop, newState = {
                    scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS_REQUESTED
                };
                0 <= scrollLeft && (newState.scrollLeft = scrollLeft), 0 <= scrollTop && (newState.scrollTop = scrollTop), 
                (0 <= scrollLeft && scrollLeft !== this.state.scrollLeft || 0 <= scrollTop && scrollTop !== this.state.scrollTop) && this.setState(newState);
            }
        } ], [ {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                return 0 !== nextProps.cellCount || 0 === prevState.scrollLeft && 0 === prevState.scrollTop ? nextProps.scrollLeft !== prevState.scrollLeft || nextProps.scrollTop !== prevState.scrollTop ? {
                    scrollLeft: null != nextProps.scrollLeft ? nextProps.scrollLeft : prevState.scrollLeft,
                    scrollTop: null != nextProps.scrollTop ? nextProps.scrollTop : prevState.scrollTop,
                    scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS_REQUESTED
                } : null : {
                    scrollLeft: 0,
                    scrollTop: 0,
                    scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS_REQUESTED
                };
            }
        } ]), CollectionView;
    }();
    _defineProperty(CollectionView, "propTypes", {
        "aria-label": propTypes.string,
        autoHeight: propTypes.bool,
        cellCount: propTypes.number.isRequired,
        cellLayoutManager: propTypes.object.isRequired,
        className: propTypes.string,
        height: propTypes.number.isRequired,
        id: propTypes.string,
        horizontalOverscanSize: propTypes.number.isRequired,
        isScrollingChange: propTypes.func,
        noContentRenderer: propTypes.func.isRequired,
        onScroll: propTypes.func.isRequired,
        onSectionRendered: propTypes.func.isRequired,
        scrollLeft: propTypes.number,
        scrollToAlignment: propTypes.oneOf([ "auto", "end", "start", "center" ]).isRequired,
        scrollToCell: propTypes.number.isRequired,
        scrollTop: propTypes.number,
        style: propTypes.object,
        verticalOverscanSize: propTypes.number.isRequired,
        width: propTypes.number.isRequired
    }), _defineProperty(CollectionView, "defaultProps", {
        "aria-label": "grid",
        horizontalOverscanSize: 0,
        noContentRenderer: function() {
            return null;
        },
        onScroll: function() {
            return null;
        },
        onSectionRendered: function() {
            return null;
        },
        scrollToAlignment: "auto",
        scrollToCell: -1,
        style: {},
        verticalOverscanSize: 0
    }), polyfill(CollectionView);
    var Section = function() {
        function Section(_ref) {
            var height = _ref.height, width = _ref.width, x = _ref.x, y = _ref.y;
            _classCallCheck(this, Section), this.height = height, this.width = width, this.x = x, 
            this.y = y, this._indexMap = {}, this._indices = [];
        }
        return _createClass(Section, [ {
            key: "addCellIndex",
            value: function(_ref2) {
                var index = _ref2.index;
                this._indexMap[index] || (this._indexMap[index] = !0, this._indices.push(index));
            }
        }, {
            key: "getCellIndices",
            value: function() {
                return this._indices;
            }
        }, {
            key: "toString",
            value: function() {
                return "".concat(this.x, ",").concat(this.y, " ").concat(this.width, "x").concat(this.height);
            }
        } ]), Section;
    }(), SectionManager = function() {
        function SectionManager() {
            var sectionSize = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 100;
            _classCallCheck(this, SectionManager), this._sectionSize = sectionSize, this._cellMetadata = [], 
            this._sections = {};
        }
        return _createClass(SectionManager, [ {
            key: "getCellIndices",
            value: function(_ref) {
                var height = _ref.height, width = _ref.width, x = _ref.x, y = _ref.y, indices = {};
                return this.getSections({
                    height: height,
                    width: width,
                    x: x,
                    y: y
                }).forEach(function(section) {
                    return section.getCellIndices().forEach(function(index) {
                        indices[index] = index;
                    });
                }), Object.keys(indices).map(function(index) {
                    return indices[index];
                });
            }
        }, {
            key: "getCellMetadata",
            value: function(_ref2) {
                var index = _ref2.index;
                return this._cellMetadata[index];
            }
        }, {
            key: "getSections",
            value: function(_ref3) {
                for (var height = _ref3.height, width = _ref3.width, x = _ref3.x, y = _ref3.y, sectionXStart = Math.floor(x / this._sectionSize), sectionXStop = Math.floor((x + width - 1) / this._sectionSize), sectionYStart = Math.floor(y / this._sectionSize), sectionYStop = Math.floor((y + height - 1) / this._sectionSize), sections = [], sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                    var key = "".concat(sectionX, ".").concat(sectionY);
                    this._sections[key] || (this._sections[key] = new Section({
                        height: this._sectionSize,
                        width: this._sectionSize,
                        x: sectionX * this._sectionSize,
                        y: sectionY * this._sectionSize
                    })), sections.push(this._sections[key]);
                }
                return sections;
            }
        }, {
            key: "getTotalSectionCount",
            value: function() {
                return Object.keys(this._sections).length;
            }
        }, {
            key: "toString",
            value: function() {
                var _this = this;
                return Object.keys(this._sections).map(function(index) {
                    return _this._sections[index].toString();
                });
            }
        }, {
            key: "registerCell",
            value: function(_ref4) {
                var cellMetadatum = _ref4.cellMetadatum, index = _ref4.index;
                this._cellMetadata[index] = cellMetadatum, this.getSections(cellMetadatum).forEach(function(section) {
                    return section.addCellIndex({
                        index: index
                    });
                });
            }
        } ]), SectionManager;
    }();
    function getUpdatedOffsetForIndex(_ref) {
        var _ref$align = _ref.align, align = void 0 === _ref$align ? "auto" : _ref$align, cellOffset = _ref.cellOffset, cellSize = _ref.cellSize, containerSize = _ref.containerSize, currentOffset = _ref.currentOffset, maxOffset = cellOffset, minOffset = maxOffset - containerSize + cellSize;
        switch (align) {
          case "start":
            return maxOffset;

          case "end":
            return minOffset;

          case "center":
            return maxOffset - (containerSize - cellSize) / 2;

          default:
            return Math.max(minOffset, Math.min(maxOffset, currentOffset));
        }
    }
    var Collection = function() {
        function Collection(props, context) {
            var _this;
            return _classCallCheck(this, Collection), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Collection).call(this, props, context)))._cellMetadata = [], 
            _this._lastRenderedCellIndices = [], _this._cellCache = [], _this._isScrollingChange = _this._isScrollingChange.bind(_assertThisInitialized(_this)), 
            _this._setCollectionViewRef = _this._setCollectionViewRef.bind(_assertThisInitialized(_this)), 
            _this;
        }
        return _inherits(Collection, React.PureComponent), _createClass(Collection, [ {
            key: "forceUpdate",
            value: function() {
                void 0 !== this._collectionView && this._collectionView.forceUpdate();
            }
        }, {
            key: "recomputeCellSizesAndPositions",
            value: function() {
                this._cellCache = [], this._collectionView.recomputeCellSizesAndPositions();
            }
        }, {
            key: "render",
            value: function() {
                var props = _extends({}, this.props);
                return React.createElement(CollectionView, _extends({
                    cellLayoutManager: this,
                    isScrollingChange: this._isScrollingChange,
                    ref: this._setCollectionViewRef
                }, props));
            }
        }, {
            key: "calculateSizeAndPositionData",
            value: function() {
                var _this$props = this.props, data = function(_ref) {
                    for (var cellCount = _ref.cellCount, cellSizeAndPositionGetter = _ref.cellSizeAndPositionGetter, sectionSize = _ref.sectionSize, cellMetadata = [], sectionManager = new SectionManager(sectionSize), height = 0, width = 0, index = 0; index < cellCount; index++) {
                        var cellMetadatum = cellSizeAndPositionGetter({
                            index: index
                        });
                        if (null == cellMetadatum.height || isNaN(cellMetadatum.height) || null == cellMetadatum.width || isNaN(cellMetadatum.width) || null == cellMetadatum.x || isNaN(cellMetadatum.x) || null == cellMetadatum.y || isNaN(cellMetadatum.y)) throw Error("Invalid metadata returned for cell ".concat(index, ":\n        x:").concat(cellMetadatum.x, ", y:").concat(cellMetadatum.y, ", width:").concat(cellMetadatum.width, ", height:").concat(cellMetadatum.height));
                        height = Math.max(height, cellMetadatum.y + cellMetadatum.height), width = Math.max(width, cellMetadatum.x + cellMetadatum.width), 
                        cellMetadata[index] = cellMetadatum, sectionManager.registerCell({
                            cellMetadatum: cellMetadatum,
                            index: index
                        });
                    }
                    return {
                        cellMetadata: cellMetadata,
                        height: height,
                        sectionManager: sectionManager,
                        width: width
                    };
                }({
                    cellCount: _this$props.cellCount,
                    cellSizeAndPositionGetter: _this$props.cellSizeAndPositionGetter,
                    sectionSize: _this$props.sectionSize
                });
                this._cellMetadata = data.cellMetadata, this._sectionManager = data.sectionManager, 
                this._height = data.height, this._width = data.width;
            }
        }, {
            key: "getLastRenderedIndices",
            value: function() {
                return this._lastRenderedCellIndices;
            }
        }, {
            key: "getScrollPositionForCell",
            value: function(_ref) {
                var align = _ref.align, cellIndex = _ref.cellIndex, height = _ref.height, scrollLeft = _ref.scrollLeft, scrollTop = _ref.scrollTop, width = _ref.width, cellCount = this.props.cellCount;
                if (0 <= cellIndex && cellIndex < cellCount) {
                    var cellMetadata = this._cellMetadata[cellIndex];
                    scrollLeft = getUpdatedOffsetForIndex({
                        align: align,
                        cellOffset: cellMetadata.x,
                        cellSize: cellMetadata.width,
                        containerSize: width,
                        currentOffset: scrollLeft,
                        targetIndex: cellIndex
                    }), scrollTop = getUpdatedOffsetForIndex({
                        align: align,
                        cellOffset: cellMetadata.y,
                        cellSize: cellMetadata.height,
                        containerSize: height,
                        currentOffset: scrollTop,
                        targetIndex: cellIndex
                    });
                }
                return {
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop
                };
            }
        }, {
            key: "getTotalSize",
            value: function() {
                return {
                    height: this._height,
                    width: this._width
                };
            }
        }, {
            key: "cellRenderers",
            value: function(_ref2) {
                var _this2 = this, height = _ref2.height, isScrolling = _ref2.isScrolling, width = _ref2.width, x = _ref2.x, y = _ref2.y, _this$props2 = this.props, cellGroupRenderer = _this$props2.cellGroupRenderer, cellRenderer = _this$props2.cellRenderer;
                return this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
                    height: height,
                    width: width,
                    x: x,
                    y: y
                }), cellGroupRenderer({
                    cellCache: this._cellCache,
                    cellRenderer: cellRenderer,
                    cellSizeAndPositionGetter: function(_ref3) {
                        var index = _ref3.index;
                        return _this2._sectionManager.getCellMetadata({
                            index: index
                        });
                    },
                    indices: this._lastRenderedCellIndices,
                    isScrolling: isScrolling
                });
            }
        }, {
            key: "_isScrollingChange",
            value: function(isScrolling) {
                isScrolling || (this._cellCache = []);
            }
        }, {
            key: "_setCollectionViewRef",
            value: function(ref) {
                this._collectionView = ref;
            }
        } ]), Collection;
    }();
    _defineProperty(Collection, "propTypes", {
        "aria-label": propTypes.string,
        cellCount: propTypes.number.isRequired,
        cellGroupRenderer: propTypes.func.isRequired,
        cellRenderer: propTypes.func.isRequired,
        cellSizeAndPositionGetter: propTypes.func.isRequired,
        sectionSize: propTypes.number
    }), _defineProperty(Collection, "defaultProps", {
        "aria-label": "grid",
        cellGroupRenderer: function(_ref4) {
            var cellCache = _ref4.cellCache, cellRenderer = _ref4.cellRenderer, cellSizeAndPositionGetter = _ref4.cellSizeAndPositionGetter, indices = _ref4.indices, isScrolling = _ref4.isScrolling;
            return indices.map(function(index) {
                var cellMetadata = cellSizeAndPositionGetter({
                    index: index
                }), cellRendererProps = {
                    index: index,
                    isScrolling: isScrolling,
                    key: index,
                    style: {
                        height: cellMetadata.height,
                        left: cellMetadata.x,
                        position: "absolute",
                        top: cellMetadata.y,
                        width: cellMetadata.width
                    }
                };
                return isScrolling ? (index in cellCache || (cellCache[index] = cellRenderer(cellRendererProps)), 
                cellCache[index]) : cellRenderer(cellRendererProps);
            }).filter(function(renderedCell) {
                return !!renderedCell;
            });
        }
    });
    var ColumnSizer = function() {
        function ColumnSizer(props, context) {
            var _this;
            return _classCallCheck(this, ColumnSizer), (_this = _possibleConstructorReturn(this, _getPrototypeOf(ColumnSizer).call(this, props, context)))._registerChild = _this._registerChild.bind(_assertThisInitialized(_this)), 
            _this;
        }
        return _inherits(ColumnSizer, React.PureComponent), _createClass(ColumnSizer, [ {
            key: "componentDidUpdate",
            value: function(prevProps) {
                var _this$props = this.props, columnMaxWidth = _this$props.columnMaxWidth, columnMinWidth = _this$props.columnMinWidth, columnCount = _this$props.columnCount, width = _this$props.width;
                columnMaxWidth === prevProps.columnMaxWidth && columnMinWidth === prevProps.columnMinWidth && columnCount === prevProps.columnCount && width === prevProps.width || this._registeredChild && this._registeredChild.recomputeGridSize();
            }
        }, {
            key: "render",
            value: function() {
                var _this$props2 = this.props, children = _this$props2.children, columnMaxWidth = _this$props2.columnMaxWidth, columnMinWidth = _this$props2.columnMinWidth, columnCount = _this$props2.columnCount, width = _this$props2.width, safeColumnMinWidth = columnMinWidth || 1, safeColumnMaxWidth = columnMaxWidth ? Math.min(columnMaxWidth, width) : width, columnWidth = width / columnCount;
                return columnWidth = Math.max(safeColumnMinWidth, columnWidth), columnWidth = Math.min(safeColumnMaxWidth, columnWidth), 
                columnWidth = Math.floor(columnWidth), children({
                    adjustedWidth: Math.min(width, columnWidth * columnCount),
                    columnWidth: columnWidth,
                    getColumnWidth: function() {
                        return columnWidth;
                    },
                    registerChild: this._registerChild
                });
            }
        }, {
            key: "_registerChild",
            value: function(child) {
                if (child && "function" != typeof child.recomputeGridSize) throw Error("Unexpected child type registered; only Grid/MultiGrid children are supported.");
                this._registeredChild = child, this._registeredChild && this._registeredChild.recomputeGridSize();
            }
        } ]), ColumnSizer;
    }();
    function calculateSizeAndPositionDataAndUpdateScrollOffset(_ref) {
        var cellCount = _ref.cellCount, cellSize = _ref.cellSize, computeMetadataCallback = _ref.computeMetadataCallback, computeMetadataCallbackProps = _ref.computeMetadataCallbackProps, nextCellsCount = _ref.nextCellsCount, nextCellSize = _ref.nextCellSize, nextScrollToIndex = _ref.nextScrollToIndex, scrollToIndex = _ref.scrollToIndex, updateScrollOffsetForScrollToIndex = _ref.updateScrollOffsetForScrollToIndex;
        cellCount === nextCellsCount && ("number" != typeof cellSize && "number" != typeof nextCellSize || cellSize === nextCellSize) || (computeMetadataCallback(computeMetadataCallbackProps), 
        0 <= scrollToIndex && scrollToIndex === nextScrollToIndex && updateScrollOffsetForScrollToIndex());
    }
    _defineProperty(ColumnSizer, "propTypes", {
        children: propTypes.func.isRequired,
        columnMaxWidth: propTypes.number,
        columnMinWidth: propTypes.number,
        columnCount: propTypes.number.isRequired,
        width: propTypes.number.isRequired
    });
    var win, CellSizeAndPositionManager = function() {
        function CellSizeAndPositionManager(_ref) {
            var cellCount = _ref.cellCount, cellSizeGetter = _ref.cellSizeGetter, estimatedCellSize = _ref.estimatedCellSize;
            _classCallCheck(this, CellSizeAndPositionManager), _defineProperty(this, "_cellSizeAndPositionData", {}), 
            _defineProperty(this, "_lastMeasuredIndex", -1), _defineProperty(this, "_lastBatchedIndex", -1), 
            _defineProperty(this, "_cellCount", void 0), _defineProperty(this, "_cellSizeGetter", void 0), 
            _defineProperty(this, "_estimatedCellSize", void 0), this._cellSizeGetter = cellSizeGetter, 
            this._cellCount = cellCount, this._estimatedCellSize = estimatedCellSize;
        }
        return _createClass(CellSizeAndPositionManager, [ {
            key: "areOffsetsAdjusted",
            value: function() {
                return !1;
            }
        }, {
            key: "configure",
            value: function(_ref2) {
                var cellCount = _ref2.cellCount, estimatedCellSize = _ref2.estimatedCellSize, cellSizeGetter = _ref2.cellSizeGetter;
                this._cellCount = cellCount, this._estimatedCellSize = estimatedCellSize, this._cellSizeGetter = cellSizeGetter;
            }
        }, {
            key: "getCellCount",
            value: function() {
                return this._cellCount;
            }
        }, {
            key: "getEstimatedCellSize",
            value: function() {
                return this._estimatedCellSize;
            }
        }, {
            key: "getLastMeasuredIndex",
            value: function() {
                return this._lastMeasuredIndex;
            }
        }, {
            key: "getOffsetAdjustment",
            value: function() {
                return 0;
            }
        }, {
            key: "getSizeAndPositionOfCell",
            value: function(index) {
                if (index < 0 || index >= this._cellCount) throw Error("Requested index ".concat(index, " is outside of range 0..").concat(this._cellCount));
                if (index > this._lastMeasuredIndex) for (var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell(), offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size, i = this._lastMeasuredIndex + 1; i <= index; i++) {
                    var size = this._cellSizeGetter({
                        index: i
                    });
                    if (void 0 === size || isNaN(size)) throw Error("Invalid size returned for cell ".concat(i, " of value ").concat(size));
                    null === size ? (this._cellSizeAndPositionData[i] = {
                        offset: offset,
                        size: 0
                    }, this._lastBatchedIndex = index) : (this._cellSizeAndPositionData[i] = {
                        offset: offset,
                        size: size
                    }, offset += size, this._lastMeasuredIndex = index);
                }
                return this._cellSizeAndPositionData[index];
            }
        }, {
            key: "getSizeAndPositionOfLastMeasuredCell",
            value: function() {
                return 0 <= this._lastMeasuredIndex ? this._cellSizeAndPositionData[this._lastMeasuredIndex] : {
                    offset: 0,
                    size: 0
                };
            }
        }, {
            key: "getTotalSize",
            value: function() {
                var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
                return lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size + (this._cellCount - this._lastMeasuredIndex - 1) * this._estimatedCellSize;
            }
        }, {
            key: "getUpdatedOffsetForIndex",
            value: function(_ref3) {
                var _ref3$align = _ref3.align, align = void 0 === _ref3$align ? "auto" : _ref3$align, containerSize = _ref3.containerSize, currentOffset = _ref3.currentOffset, targetIndex = _ref3.targetIndex;
                if (containerSize <= 0) return 0;
                var idealOffset, datum = this.getSizeAndPositionOfCell(targetIndex), maxOffset = datum.offset, minOffset = maxOffset - containerSize + datum.size;
                switch (align) {
                  case "start":
                    idealOffset = maxOffset;
                    break;

                  case "end":
                    idealOffset = minOffset;
                    break;

                  case "center":
                    idealOffset = maxOffset - (containerSize - datum.size) / 2;
                    break;

                  default:
                    idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
                }
                var totalSize = this.getTotalSize();
                return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
            }
        }, {
            key: "getVisibleCellRange",
            value: function(params) {
                var containerSize = params.containerSize, offset = params.offset;
                if (0 === this.getTotalSize()) return {};
                var maxOffset = offset + containerSize, start = this._findNearestCell(offset), datum = this.getSizeAndPositionOfCell(start);
                offset = datum.offset + datum.size;
                for (var stop = start; offset < maxOffset && stop < this._cellCount - 1; ) stop++, 
                offset += this.getSizeAndPositionOfCell(stop).size;
                return {
                    start: start,
                    stop: stop
                };
            }
        }, {
            key: "resetCell",
            value: function(index) {
                this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
            }
        }, {
            key: "_binarySearch",
            value: function(high, low, offset) {
                for (;low <= high; ) {
                    var middle = low + Math.floor((high - low) / 2), currentOffset = this.getSizeAndPositionOfCell(middle).offset;
                    if (currentOffset === offset) return middle;
                    currentOffset < offset ? low = middle + 1 : offset < currentOffset && (high = middle - 1);
                }
                return 0 < low ? low - 1 : 0;
            }
        }, {
            key: "_exponentialSearch",
            value: function(index, offset) {
                for (var interval = 1; index < this._cellCount && this.getSizeAndPositionOfCell(index).offset < offset; ) index += interval, 
                interval *= 2;
                return this._binarySearch(Math.min(index, this._cellCount - 1), Math.floor(index / 2), offset);
            }
        }, {
            key: "_findNearestCell",
            value: function(offset) {
                if (isNaN(offset)) throw Error("Invalid offset ".concat(offset, " specified"));
                offset = Math.max(0, offset);
                var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell(), lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);
                return lastMeasuredCellSizeAndPosition.offset >= offset ? this._binarySearch(lastMeasuredIndex, 0, offset) : this._exponentialSearch(lastMeasuredIndex, offset);
            }
        } ]), CellSizeAndPositionManager;
    }(), getMaxElementSize = function() {
        return "undefined" != typeof window && window.chrome ? 16777100 : 15e5;
    }, ScalingCellSizeAndPositionManager = function() {
        function ScalingCellSizeAndPositionManager(_ref) {
            var _ref$maxScrollSize = _ref.maxScrollSize, maxScrollSize = void 0 === _ref$maxScrollSize ? getMaxElementSize() : _ref$maxScrollSize, params = _objectWithoutProperties(_ref, [ "maxScrollSize" ]);
            _classCallCheck(this, ScalingCellSizeAndPositionManager), _defineProperty(this, "_cellSizeAndPositionManager", void 0), 
            _defineProperty(this, "_maxScrollSize", void 0), this._cellSizeAndPositionManager = new CellSizeAndPositionManager(params), 
            this._maxScrollSize = maxScrollSize;
        }
        return _createClass(ScalingCellSizeAndPositionManager, [ {
            key: "areOffsetsAdjusted",
            value: function() {
                return this._cellSizeAndPositionManager.getTotalSize() > this._maxScrollSize;
            }
        }, {
            key: "configure",
            value: function(params) {
                this._cellSizeAndPositionManager.configure(params);
            }
        }, {
            key: "getCellCount",
            value: function() {
                return this._cellSizeAndPositionManager.getCellCount();
            }
        }, {
            key: "getEstimatedCellSize",
            value: function() {
                return this._cellSizeAndPositionManager.getEstimatedCellSize();
            }
        }, {
            key: "getLastMeasuredIndex",
            value: function() {
                return this._cellSizeAndPositionManager.getLastMeasuredIndex();
            }
        }, {
            key: "getOffsetAdjustment",
            value: function(_ref2) {
                var containerSize = _ref2.containerSize, offset = _ref2.offset, totalSize = this._cellSizeAndPositionManager.getTotalSize(), safeTotalSize = this.getTotalSize(), offsetPercentage = this._getOffsetPercentage({
                    containerSize: containerSize,
                    offset: offset,
                    totalSize: safeTotalSize
                });
                return Math.round(offsetPercentage * (safeTotalSize - totalSize));
            }
        }, {
            key: "getSizeAndPositionOfCell",
            value: function(index) {
                return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
            }
        }, {
            key: "getSizeAndPositionOfLastMeasuredCell",
            value: function() {
                return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
            }
        }, {
            key: "getTotalSize",
            value: function() {
                return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
            }
        }, {
            key: "getUpdatedOffsetForIndex",
            value: function(_ref3) {
                var _ref3$align = _ref3.align, align = void 0 === _ref3$align ? "auto" : _ref3$align, containerSize = _ref3.containerSize, currentOffset = _ref3.currentOffset, targetIndex = _ref3.targetIndex;
                currentOffset = this._safeOffsetToOffset({
                    containerSize: containerSize,
                    offset: currentOffset
                });
                var offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex({
                    align: align,
                    containerSize: containerSize,
                    currentOffset: currentOffset,
                    targetIndex: targetIndex
                });
                return this._offsetToSafeOffset({
                    containerSize: containerSize,
                    offset: offset
                });
            }
        }, {
            key: "getVisibleCellRange",
            value: function(_ref4) {
                var containerSize = _ref4.containerSize, offset = _ref4.offset;
                return offset = this._safeOffsetToOffset({
                    containerSize: containerSize,
                    offset: offset
                }), this._cellSizeAndPositionManager.getVisibleCellRange({
                    containerSize: containerSize,
                    offset: offset
                });
            }
        }, {
            key: "resetCell",
            value: function(index) {
                this._cellSizeAndPositionManager.resetCell(index);
            }
        }, {
            key: "_getOffsetPercentage",
            value: function(_ref5) {
                var containerSize = _ref5.containerSize, offset = _ref5.offset, totalSize = _ref5.totalSize;
                return totalSize <= containerSize ? 0 : offset / (totalSize - containerSize);
            }
        }, {
            key: "_offsetToSafeOffset",
            value: function(_ref6) {
                var containerSize = _ref6.containerSize, offset = _ref6.offset, totalSize = this._cellSizeAndPositionManager.getTotalSize(), safeTotalSize = this.getTotalSize();
                if (totalSize === safeTotalSize) return offset;
                var offsetPercentage = this._getOffsetPercentage({
                    containerSize: containerSize,
                    offset: offset,
                    totalSize: totalSize
                });
                return Math.round(offsetPercentage * (safeTotalSize - containerSize));
            }
        }, {
            key: "_safeOffsetToOffset",
            value: function(_ref7) {
                var containerSize = _ref7.containerSize, offset = _ref7.offset, totalSize = this._cellSizeAndPositionManager.getTotalSize(), safeTotalSize = this.getTotalSize();
                if (totalSize === safeTotalSize) return offset;
                var offsetPercentage = this._getOffsetPercentage({
                    containerSize: containerSize,
                    offset: offset,
                    totalSize: safeTotalSize
                });
                return Math.round(offsetPercentage * (totalSize - containerSize));
            }
        } ]), ScalingCellSizeAndPositionManager;
    }();
    function defaultOverscanIndicesGetter(_ref) {
        var cellCount = _ref.cellCount, overscanCellsCount = _ref.overscanCellsCount, scrollDirection = _ref.scrollDirection, startIndex = _ref.startIndex, stopIndex = _ref.stopIndex;
        return 1 === scrollDirection ? {
            overscanStartIndex: Math.max(0, startIndex),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        } : {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex)
        };
    }
    function updateScrollIndexHelper(_ref) {
        var cellSize = _ref.cellSize, cellSizeAndPositionManager = _ref.cellSizeAndPositionManager, previousCellsCount = _ref.previousCellsCount, previousCellSize = _ref.previousCellSize, previousScrollToAlignment = _ref.previousScrollToAlignment, previousScrollToIndex = _ref.previousScrollToIndex, previousSize = _ref.previousSize, scrollOffset = _ref.scrollOffset, scrollToAlignment = _ref.scrollToAlignment, scrollToIndex = _ref.scrollToIndex, size = _ref.size, sizeJustIncreasedFromZero = _ref.sizeJustIncreasedFromZero, updateScrollIndexCallback = _ref.updateScrollIndexCallback, cellCount = cellSizeAndPositionManager.getCellCount(), hasScrollToIndex = 0 <= scrollToIndex && scrollToIndex < cellCount;
        hasScrollToIndex && (size !== previousSize || sizeJustIncreasedFromZero || !previousCellSize || "number" == typeof cellSize && cellSize !== previousCellSize || scrollToAlignment !== previousScrollToAlignment || scrollToIndex !== previousScrollToIndex) ? updateScrollIndexCallback(scrollToIndex) : !hasScrollToIndex && 0 < cellCount && (size < previousSize || cellCount < previousCellsCount) && scrollOffset > cellSizeAndPositionManager.getTotalSize() - size && updateScrollIndexCallback(cellCount - 1);
    }
    function defaultCellRangeRenderer(_ref) {
        for (var cellCache = _ref.cellCache, cellRenderer = _ref.cellRenderer, columnSizeAndPositionManager = _ref.columnSizeAndPositionManager, columnStartIndex = _ref.columnStartIndex, columnStopIndex = _ref.columnStopIndex, deferredMeasurementCache = _ref.deferredMeasurementCache, horizontalOffsetAdjustment = _ref.horizontalOffsetAdjustment, isScrolling = _ref.isScrolling, isScrollingOptOut = _ref.isScrollingOptOut, parent = _ref.parent, rowSizeAndPositionManager = _ref.rowSizeAndPositionManager, rowStartIndex = _ref.rowStartIndex, rowStopIndex = _ref.rowStopIndex, styleCache = _ref.styleCache, verticalOffsetAdjustment = _ref.verticalOffsetAdjustment, visibleColumnIndices = _ref.visibleColumnIndices, visibleRowIndices = _ref.visibleRowIndices, renderedCells = [], areOffsetsAdjusted = columnSizeAndPositionManager.areOffsetsAdjusted() || rowSizeAndPositionManager.areOffsetsAdjusted(), canCacheStyle = !isScrolling && !areOffsetsAdjusted, rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) for (var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex), columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex), isVisible = columnIndex >= visibleColumnIndices.start && columnIndex <= visibleColumnIndices.stop && rowIndex >= visibleRowIndices.start && rowIndex <= visibleRowIndices.stop, key = "".concat(rowIndex, "-").concat(columnIndex), style = void 0;
            canCacheStyle && styleCache[key] ? style = styleCache[key] : deferredMeasurementCache && !deferredMeasurementCache.has(rowIndex, columnIndex) ? style = {
                height: "auto",
                left: 0,
                position: "absolute",
                top: 0,
                width: "auto"
            } : (style = {
                height: rowDatum.size,
                left: columnDatum.offset + horizontalOffsetAdjustment,
                position: "absolute",
                top: rowDatum.offset + verticalOffsetAdjustment,
                width: columnDatum.size
            }, styleCache[key] = style);
            var cellRendererParams = {
                columnIndex: columnIndex,
                isScrolling: isScrolling,
                isVisible: isVisible,
                key: key,
                parent: parent,
                rowIndex: rowIndex,
                style: style
            }, renderedCell = void 0;
            null != (renderedCell = !isScrollingOptOut && !isScrolling || horizontalOffsetAdjustment || verticalOffsetAdjustment ? cellRenderer(cellRendererParams) : (cellCache[key] || (cellCache[key] = cellRenderer(cellRendererParams)), 
            cellCache[key])) && !1 !== renderedCell && (warnAboutMissingStyle(parent, renderedCell), 
            renderedCell.props.role || (renderedCell = React__default.cloneElement(renderedCell, {
                role: "gridcell"
            })), renderedCells.push(renderedCell));
        }
        return renderedCells;
    }
    function warnAboutMissingStyle(parent, renderedCell) {
        renderedCell && (renderedCell.type && renderedCell.type.__internalCellMeasurerFlag && (renderedCell = renderedCell.props.children), 
        renderedCell && renderedCell.props && void 0 === renderedCell.props.style && !0 !== parent.__warnedAboutMissingStyle && (parent.__warnedAboutMissingStyle = !0, 
        console.warn("Rendered cell should include style property for positioning.")));
    }
    var request = (win = "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function(callback) {
        return win.setTimeout(callback, 1e3 / 60);
    }, cancel = win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame || function(id) {
        win.clearTimeout(id);
    }, raf = request, caf = cancel, cancelAnimationTimeout = function(frame) {
        return caf(frame.id);
    }, requestAnimationTimeout = function(callback, delay) {
        var start;
        Promise.resolve().then(function() {
            start = Date.now();
        });
        var frame = {
            id: raf(function timeout() {
                Date.now() - start >= delay ? callback.call() : frame.id = raf(timeout);
            })
        };
        return frame;
    }, SCROLL_POSITION_CHANGE_REASONS$1_OBSERVED = "observed", SCROLL_POSITION_CHANGE_REASONS$1_REQUESTED = "requested", Grid = function() {
        function Grid(props) {
            var _this;
            _classCallCheck(this, Grid), _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, _getPrototypeOf(Grid).call(this, props))), "_onGridRenderedMemoizer", createCallbackMemoizer()), 
            _defineProperty(_assertThisInitialized(_this), "_onScrollMemoizer", createCallbackMemoizer(!1)), 
            _defineProperty(_assertThisInitialized(_this), "_deferredInvalidateColumnIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_deferredInvalidateRowIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_recomputeScrollLeftFlag", !1), 
            _defineProperty(_assertThisInitialized(_this), "_recomputeScrollTopFlag", !1), _defineProperty(_assertThisInitialized(_this), "_horizontalScrollBarSize", 0), 
            _defineProperty(_assertThisInitialized(_this), "_verticalScrollBarSize", 0), _defineProperty(_assertThisInitialized(_this), "_scrollbarPresenceChanged", !1), 
            _defineProperty(_assertThisInitialized(_this), "_scrollingContainer", void 0), _defineProperty(_assertThisInitialized(_this), "_childrenToDisplay", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_columnStartIndex", void 0), _defineProperty(_assertThisInitialized(_this), "_columnStopIndex", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_rowStartIndex", void 0), _defineProperty(_assertThisInitialized(_this), "_rowStopIndex", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_renderedColumnStartIndex", 0), 
            _defineProperty(_assertThisInitialized(_this), "_renderedColumnStopIndex", 0), _defineProperty(_assertThisInitialized(_this), "_renderedRowStartIndex", 0), 
            _defineProperty(_assertThisInitialized(_this), "_renderedRowStopIndex", 0), _defineProperty(_assertThisInitialized(_this), "_initialScrollTop", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_initialScrollLeft", void 0), _defineProperty(_assertThisInitialized(_this), "_disablePointerEventsTimeoutId", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_styleCache", {}), _defineProperty(_assertThisInitialized(_this), "_cellCache", {}), 
            _defineProperty(_assertThisInitialized(_this), "_debounceScrollEndedCallback", function() {
                _this._disablePointerEventsTimeoutId = null, _this.setState({
                    isScrolling: !1,
                    needToResetStyleCache: !1
                });
            }), _defineProperty(_assertThisInitialized(_this), "_invokeOnGridRenderedHelper", function() {
                var onSectionRendered = _this.props.onSectionRendered;
                _this._onGridRenderedMemoizer({
                    callback: onSectionRendered,
                    indices: {
                        columnOverscanStartIndex: _this._columnStartIndex,
                        columnOverscanStopIndex: _this._columnStopIndex,
                        columnStartIndex: _this._renderedColumnStartIndex,
                        columnStopIndex: _this._renderedColumnStopIndex,
                        rowOverscanStartIndex: _this._rowStartIndex,
                        rowOverscanStopIndex: _this._rowStopIndex,
                        rowStartIndex: _this._renderedRowStartIndex,
                        rowStopIndex: _this._renderedRowStopIndex
                    }
                });
            }), _defineProperty(_assertThisInitialized(_this), "_setScrollingContainerRef", function(ref) {
                _this._scrollingContainer = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_onScroll", function(event) {
                event.target === _this._scrollingContainer && _this.handleScrollEvent(event.target);
            });
            var columnSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
                cellCount: props.columnCount,
                cellSizeGetter: function(params) {
                    return Grid._wrapSizeGetter(props.columnWidth)(params);
                },
                estimatedCellSize: Grid._getEstimatedColumnSize(props)
            }), rowSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
                cellCount: props.rowCount,
                cellSizeGetter: function(params) {
                    return Grid._wrapSizeGetter(props.rowHeight)(params);
                },
                estimatedCellSize: Grid._getEstimatedRowSize(props)
            });
            return _this.state = {
                instanceProps: {
                    columnSizeAndPositionManager: columnSizeAndPositionManager,
                    rowSizeAndPositionManager: rowSizeAndPositionManager,
                    prevColumnWidth: props.columnWidth,
                    prevRowHeight: props.rowHeight,
                    prevColumnCount: props.columnCount,
                    prevRowCount: props.rowCount,
                    prevIsScrolling: !0 === props.isScrolling,
                    prevScrollToColumn: props.scrollToColumn,
                    prevScrollToRow: props.scrollToRow,
                    scrollbarSize: 0,
                    scrollbarSizeMeasured: !1
                },
                isScrolling: !1,
                scrollDirectionHorizontal: 1,
                scrollDirectionVertical: 1,
                scrollLeft: 0,
                scrollTop: 0,
                scrollPositionChangeReason: null,
                needToResetStyleCache: !1
            }, 0 < props.scrollToRow && (_this._initialScrollTop = _this._getCalculatedScrollTop(props, _this.state)), 
            0 < props.scrollToColumn && (_this._initialScrollLeft = _this._getCalculatedScrollLeft(props, _this.state)), 
            _this;
        }
        return _inherits(Grid, React.PureComponent), _createClass(Grid, [ {
            key: "getOffsetForCell",
            value: function(argument_0) {
                var _ref = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref$alignment = _ref.alignment, alignment = void 0 === _ref$alignment ? this.props.scrollToAlignment : _ref$alignment, _ref$columnIndex = _ref.columnIndex, columnIndex = void 0 === _ref$columnIndex ? this.props.scrollToColumn : _ref$columnIndex, _ref$rowIndex = _ref.rowIndex, rowIndex = void 0 === _ref$rowIndex ? this.props.scrollToRow : _ref$rowIndex, offsetProps = _objectSpread2({}, this.props, {
                    scrollToAlignment: alignment,
                    scrollToColumn: columnIndex,
                    scrollToRow: rowIndex
                });
                return {
                    scrollLeft: this._getCalculatedScrollLeft(offsetProps),
                    scrollTop: this._getCalculatedScrollTop(offsetProps)
                };
            }
        }, {
            key: "getTotalRowsHeight",
            value: function() {
                return this.state.instanceProps.rowSizeAndPositionManager.getTotalSize();
            }
        }, {
            key: "getTotalColumnsWidth",
            value: function() {
                return this.state.instanceProps.columnSizeAndPositionManager.getTotalSize();
            }
        }, {
            key: "handleScrollEvent",
            value: function(_ref2) {
                var _ref2$scrollLeft = _ref2.scrollLeft, scrollLeftParam = void 0 === _ref2$scrollLeft ? 0 : _ref2$scrollLeft, _ref2$scrollTop = _ref2.scrollTop, scrollTopParam = void 0 === _ref2$scrollTop ? 0 : _ref2$scrollTop;
                if (!(scrollTopParam < 0)) {
                    this._debounceScrollEnded();
                    var _this$props = this.props, autoHeight = _this$props.autoHeight, autoWidth = _this$props.autoWidth, height = _this$props.height, width = _this$props.width, instanceProps = this.state.instanceProps, scrollbarSize = instanceProps.scrollbarSize, totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize(), totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize(), scrollLeft = Math.min(Math.max(0, totalColumnsWidth - width + scrollbarSize), scrollLeftParam), scrollTop = Math.min(Math.max(0, totalRowsHeight - height + scrollbarSize), scrollTopParam);
                    if (this.state.scrollLeft !== scrollLeft || this.state.scrollTop !== scrollTop) {
                        var newState = {
                            isScrolling: !0,
                            scrollDirectionHorizontal: scrollLeft !== this.state.scrollLeft ? scrollLeft > this.state.scrollLeft ? 1 : -1 : this.state.scrollDirectionHorizontal,
                            scrollDirectionVertical: scrollTop !== this.state.scrollTop ? scrollTop > this.state.scrollTop ? 1 : -1 : this.state.scrollDirectionVertical,
                            scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS$1_OBSERVED
                        };
                        autoHeight || (newState.scrollTop = scrollTop), autoWidth || (newState.scrollLeft = scrollLeft), 
                        newState.needToResetStyleCache = !1, this.setState(newState);
                    }
                    this._invokeOnScrollMemoizer({
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        totalColumnsWidth: totalColumnsWidth,
                        totalRowsHeight: totalRowsHeight
                    });
                }
            }
        }, {
            key: "invalidateCellSizeAfterRender",
            value: function(_ref3) {
                var columnIndex = _ref3.columnIndex, rowIndex = _ref3.rowIndex;
                this._deferredInvalidateColumnIndex = "number" == typeof this._deferredInvalidateColumnIndex ? Math.min(this._deferredInvalidateColumnIndex, columnIndex) : columnIndex, 
                this._deferredInvalidateRowIndex = "number" == typeof this._deferredInvalidateRowIndex ? Math.min(this._deferredInvalidateRowIndex, rowIndex) : rowIndex;
            }
        }, {
            key: "measureAllCells",
            value: function() {
                var _this$props2 = this.props, columnCount = _this$props2.columnCount, rowCount = _this$props2.rowCount, instanceProps = this.state.instanceProps;
                instanceProps.columnSizeAndPositionManager.getSizeAndPositionOfCell(columnCount - 1), 
                instanceProps.rowSizeAndPositionManager.getSizeAndPositionOfCell(rowCount - 1);
            }
        }, {
            key: "recomputeGridSize",
            value: function(argument_0) {
                var _ref4 = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref4$columnIndex = _ref4.columnIndex, columnIndex = void 0 === _ref4$columnIndex ? 0 : _ref4$columnIndex, _ref4$rowIndex = _ref4.rowIndex, rowIndex = void 0 === _ref4$rowIndex ? 0 : _ref4$rowIndex, _this$props3 = this.props, scrollToColumn = _this$props3.scrollToColumn, scrollToRow = _this$props3.scrollToRow, instanceProps = this.state.instanceProps;
                instanceProps.columnSizeAndPositionManager.resetCell(columnIndex), instanceProps.rowSizeAndPositionManager.resetCell(rowIndex), 
                this._recomputeScrollLeftFlag = 0 <= scrollToColumn && (1 === this.state.scrollDirectionHorizontal ? columnIndex <= scrollToColumn : scrollToColumn <= columnIndex), 
                this._recomputeScrollTopFlag = 0 <= scrollToRow && (1 === this.state.scrollDirectionVertical ? rowIndex <= scrollToRow : scrollToRow <= rowIndex), 
                this._styleCache = {}, this._cellCache = {}, this.forceUpdate();
            }
        }, {
            key: "scrollToCell",
            value: function(_ref5) {
                var columnIndex = _ref5.columnIndex, rowIndex = _ref5.rowIndex, columnCount = this.props.columnCount, props = this.props;
                1 < columnCount && void 0 !== columnIndex && this._updateScrollLeftForScrollToColumn(_objectSpread2({}, props, {
                    scrollToColumn: columnIndex
                })), void 0 !== rowIndex && this._updateScrollTopForScrollToRow(_objectSpread2({}, props, {
                    scrollToRow: rowIndex
                }));
            }
        }, {
            key: "componentDidMount",
            value: function() {
                var _this$props4 = this.props, getScrollbarSize = _this$props4.getScrollbarSize, height = _this$props4.height, scrollLeft = _this$props4.scrollLeft, scrollToColumn = _this$props4.scrollToColumn, scrollTop = _this$props4.scrollTop, scrollToRow = _this$props4.scrollToRow, width = _this$props4.width, instanceProps = this.state.instanceProps;
                if (this._initialScrollTop = 0, this._initialScrollLeft = 0, this._handleInvalidatedGridSize(), 
                instanceProps.scrollbarSizeMeasured || this.setState(function(prevState) {
                    var stateUpdate = _objectSpread2({}, prevState, {
                        needToResetStyleCache: !1
                    });
                    return stateUpdate.instanceProps.scrollbarSize = getScrollbarSize(), stateUpdate.instanceProps.scrollbarSizeMeasured = !0, 
                    stateUpdate;
                }), "number" == typeof scrollLeft && 0 <= scrollLeft || "number" == typeof scrollTop && 0 <= scrollTop) {
                    var stateUpdate = Grid._getScrollToPositionStateUpdate({
                        prevState: this.state,
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop
                    });
                    stateUpdate && (stateUpdate.needToResetStyleCache = !1, this.setState(stateUpdate));
                }
                this._scrollingContainer && (this._scrollingContainer.scrollLeft !== this.state.scrollLeft && (this._scrollingContainer.scrollLeft = this.state.scrollLeft), 
                this._scrollingContainer.scrollTop !== this.state.scrollTop && (this._scrollingContainer.scrollTop = this.state.scrollTop));
                var sizeIsBiggerThanZero = 0 < height && 0 < width;
                0 <= scrollToColumn && sizeIsBiggerThanZero && this._updateScrollLeftForScrollToColumn(), 
                0 <= scrollToRow && sizeIsBiggerThanZero && this._updateScrollTopForScrollToRow(), 
                this._invokeOnGridRenderedHelper(), this._invokeOnScrollMemoizer({
                    scrollLeft: scrollLeft || 0,
                    scrollTop: scrollTop || 0,
                    totalColumnsWidth: instanceProps.columnSizeAndPositionManager.getTotalSize(),
                    totalRowsHeight: instanceProps.rowSizeAndPositionManager.getTotalSize()
                }), this._maybeCallOnScrollbarPresenceChange();
            }
        }, {
            key: "componentDidUpdate",
            value: function(prevProps, prevState) {
                var _this2 = this, _this$props5 = this.props, autoHeight = _this$props5.autoHeight, autoWidth = _this$props5.autoWidth, columnCount = _this$props5.columnCount, height = _this$props5.height, rowCount = _this$props5.rowCount, scrollToAlignment = _this$props5.scrollToAlignment, scrollToColumn = _this$props5.scrollToColumn, scrollToRow = _this$props5.scrollToRow, width = _this$props5.width, _this$state = this.state, scrollLeft = _this$state.scrollLeft, scrollPositionChangeReason = _this$state.scrollPositionChangeReason, scrollTop = _this$state.scrollTop, instanceProps = _this$state.instanceProps;
                this._handleInvalidatedGridSize();
                var columnOrRowCountJustIncreasedFromZero = 0 < columnCount && 0 === prevProps.columnCount || 0 < rowCount && 0 === prevProps.rowCount;
                scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS$1_REQUESTED && (!autoWidth && 0 <= scrollLeft && (scrollLeft !== this._scrollingContainer.scrollLeft || columnOrRowCountJustIncreasedFromZero) && (this._scrollingContainer.scrollLeft = scrollLeft), 
                !autoHeight && 0 <= scrollTop && (scrollTop !== this._scrollingContainer.scrollTop || columnOrRowCountJustIncreasedFromZero) && (this._scrollingContainer.scrollTop = scrollTop));
                var sizeJustIncreasedFromZero = (0 === prevProps.width || 0 === prevProps.height) && 0 < height && 0 < width;
                if (this._recomputeScrollLeftFlag ? (this._recomputeScrollLeftFlag = !1, this._updateScrollLeftForScrollToColumn(this.props)) : updateScrollIndexHelper({
                    cellSizeAndPositionManager: instanceProps.columnSizeAndPositionManager,
                    previousCellsCount: prevProps.columnCount,
                    previousCellSize: prevProps.columnWidth,
                    previousScrollToAlignment: prevProps.scrollToAlignment,
                    previousScrollToIndex: prevProps.scrollToColumn,
                    previousSize: prevProps.width,
                    scrollOffset: scrollLeft,
                    scrollToAlignment: scrollToAlignment,
                    scrollToIndex: scrollToColumn,
                    size: width,
                    sizeJustIncreasedFromZero: sizeJustIncreasedFromZero,
                    updateScrollIndexCallback: function() {
                        return _this2._updateScrollLeftForScrollToColumn(_this2.props);
                    }
                }), this._recomputeScrollTopFlag ? (this._recomputeScrollTopFlag = !1, this._updateScrollTopForScrollToRow(this.props)) : updateScrollIndexHelper({
                    cellSizeAndPositionManager: instanceProps.rowSizeAndPositionManager,
                    previousCellsCount: prevProps.rowCount,
                    previousCellSize: prevProps.rowHeight,
                    previousScrollToAlignment: prevProps.scrollToAlignment,
                    previousScrollToIndex: prevProps.scrollToRow,
                    previousSize: prevProps.height,
                    scrollOffset: scrollTop,
                    scrollToAlignment: scrollToAlignment,
                    scrollToIndex: scrollToRow,
                    size: height,
                    sizeJustIncreasedFromZero: sizeJustIncreasedFromZero,
                    updateScrollIndexCallback: function() {
                        return _this2._updateScrollTopForScrollToRow(_this2.props);
                    }
                }), this._invokeOnGridRenderedHelper(), scrollLeft !== prevState.scrollLeft || scrollTop !== prevState.scrollTop) {
                    var totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize(), totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize();
                    this._invokeOnScrollMemoizer({
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        totalColumnsWidth: totalColumnsWidth,
                        totalRowsHeight: totalRowsHeight
                    });
                }
                this._maybeCallOnScrollbarPresenceChange();
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._disablePointerEventsTimeoutId && cancelAnimationTimeout(this._disablePointerEventsTimeoutId);
            }
        }, {
            key: "render",
            value: function() {
                var _this$props6 = this.props, autoContainerWidth = _this$props6.autoContainerWidth, autoHeight = _this$props6.autoHeight, autoWidth = _this$props6.autoWidth, className = _this$props6.className, containerProps = _this$props6.containerProps, containerRole = _this$props6.containerRole, containerStyle = _this$props6.containerStyle, height = _this$props6.height, id = _this$props6.id, noContentRenderer = _this$props6.noContentRenderer, role = _this$props6.role, style = _this$props6.style, tabIndex = _this$props6.tabIndex, width = _this$props6.width, _this$state2 = this.state, instanceProps = _this$state2.instanceProps, needToResetStyleCache = _this$state2.needToResetStyleCache, isScrolling = this._isScrolling(), gridStyle = {
                    boxSizing: "border-box",
                    direction: "ltr",
                    height: autoHeight ? "auto" : height,
                    position: "relative",
                    width: autoWidth ? "auto" : width,
                    WebkitOverflowScrolling: "touch",
                    willChange: "transform"
                };
                needToResetStyleCache && (this._styleCache = {}), this.state.isScrolling || this._resetStyleCache(), 
                this._calculateChildrenToRender(this.props, this.state);
                var totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize(), totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize(), verticalScrollBarSize = height < totalRowsHeight ? instanceProps.scrollbarSize : 0, horizontalScrollBarSize = width < totalColumnsWidth ? instanceProps.scrollbarSize : 0;
                horizontalScrollBarSize === this._horizontalScrollBarSize && verticalScrollBarSize === this._verticalScrollBarSize || (this._horizontalScrollBarSize = horizontalScrollBarSize, 
                this._verticalScrollBarSize = verticalScrollBarSize, this._scrollbarPresenceChanged = !0), 
                gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize <= width ? "hidden" : "auto", 
                gridStyle.overflowY = totalRowsHeight + horizontalScrollBarSize <= height ? "hidden" : "auto";
                var childrenToDisplay = this._childrenToDisplay, showNoContentRenderer = 0 === childrenToDisplay.length && 0 < height && 0 < width;
                return React.createElement("div", _extends({
                    ref: this._setScrollingContainerRef
                }, containerProps, {
                    "aria-label": this.props["aria-label"],
                    "aria-readonly": this.props["aria-readonly"],
                    className: clsx("ReactVirtualized__Grid", className),
                    id: id,
                    onScroll: this._onScroll,
                    role: role,
                    style: _objectSpread2({}, gridStyle, {}, style),
                    tabIndex: tabIndex
                }), 0 < childrenToDisplay.length && React.createElement("div", {
                    className: "ReactVirtualized__Grid__innerScrollContainer",
                    role: containerRole,
                    style: _objectSpread2({
                        width: autoContainerWidth ? "auto" : totalColumnsWidth,
                        height: totalRowsHeight,
                        maxWidth: totalColumnsWidth,
                        maxHeight: totalRowsHeight,
                        overflow: "hidden",
                        pointerEvents: isScrolling ? "none" : "",
                        position: "relative"
                    }, containerStyle)
                }, childrenToDisplay), showNoContentRenderer && noContentRenderer());
            }
        }, {
            key: "_calculateChildrenToRender",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state, cellRenderer = props.cellRenderer, cellRangeRenderer = props.cellRangeRenderer, columnCount = props.columnCount, deferredMeasurementCache = props.deferredMeasurementCache, height = props.height, overscanColumnCount = props.overscanColumnCount, overscanIndicesGetter = props.overscanIndicesGetter, overscanRowCount = props.overscanRowCount, rowCount = props.rowCount, width = props.width, isScrollingOptOut = props.isScrollingOptOut, scrollDirectionHorizontal = state.scrollDirectionHorizontal, scrollDirectionVertical = state.scrollDirectionVertical, instanceProps = state.instanceProps, scrollTop = 0 < this._initialScrollTop ? this._initialScrollTop : state.scrollTop, scrollLeft = 0 < this._initialScrollLeft ? this._initialScrollLeft : state.scrollLeft, isScrolling = this._isScrolling(props, state);
                if (this._childrenToDisplay = [], 0 < height && 0 < width) {
                    var visibleColumnIndices = instanceProps.columnSizeAndPositionManager.getVisibleCellRange({
                        containerSize: width,
                        offset: scrollLeft
                    }), visibleRowIndices = instanceProps.rowSizeAndPositionManager.getVisibleCellRange({
                        containerSize: height,
                        offset: scrollTop
                    }), horizontalOffsetAdjustment = instanceProps.columnSizeAndPositionManager.getOffsetAdjustment({
                        containerSize: width,
                        offset: scrollLeft
                    }), verticalOffsetAdjustment = instanceProps.rowSizeAndPositionManager.getOffsetAdjustment({
                        containerSize: height,
                        offset: scrollTop
                    });
                    this._renderedColumnStartIndex = visibleColumnIndices.start, this._renderedColumnStopIndex = visibleColumnIndices.stop, 
                    this._renderedRowStartIndex = visibleRowIndices.start, this._renderedRowStopIndex = visibleRowIndices.stop;
                    var overscanColumnIndices = overscanIndicesGetter({
                        direction: "horizontal",
                        cellCount: columnCount,
                        overscanCellsCount: overscanColumnCount,
                        scrollDirection: scrollDirectionHorizontal,
                        startIndex: "number" == typeof visibleColumnIndices.start ? visibleColumnIndices.start : 0,
                        stopIndex: "number" == typeof visibleColumnIndices.stop ? visibleColumnIndices.stop : -1
                    }), overscanRowIndices = overscanIndicesGetter({
                        direction: "vertical",
                        cellCount: rowCount,
                        overscanCellsCount: overscanRowCount,
                        scrollDirection: scrollDirectionVertical,
                        startIndex: "number" == typeof visibleRowIndices.start ? visibleRowIndices.start : 0,
                        stopIndex: "number" == typeof visibleRowIndices.stop ? visibleRowIndices.stop : -1
                    }), columnStartIndex = overscanColumnIndices.overscanStartIndex, columnStopIndex = overscanColumnIndices.overscanStopIndex, rowStartIndex = overscanRowIndices.overscanStartIndex, rowStopIndex = overscanRowIndices.overscanStopIndex;
                    if (deferredMeasurementCache) {
                        if (!deferredMeasurementCache.hasFixedHeight()) for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) if (!deferredMeasurementCache.has(rowIndex, 0)) {
                            columnStartIndex = 0, columnStopIndex = columnCount - 1;
                            break;
                        }
                        if (!deferredMeasurementCache.hasFixedWidth()) for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) if (!deferredMeasurementCache.has(0, columnIndex)) {
                            rowStartIndex = 0, rowStopIndex = rowCount - 1;
                            break;
                        }
                    }
                    this._childrenToDisplay = cellRangeRenderer({
                        cellCache: this._cellCache,
                        cellRenderer: cellRenderer,
                        columnSizeAndPositionManager: instanceProps.columnSizeAndPositionManager,
                        columnStartIndex: columnStartIndex,
                        columnStopIndex: columnStopIndex,
                        deferredMeasurementCache: deferredMeasurementCache,
                        horizontalOffsetAdjustment: horizontalOffsetAdjustment,
                        isScrolling: isScrolling,
                        isScrollingOptOut: isScrollingOptOut,
                        parent: this,
                        rowSizeAndPositionManager: instanceProps.rowSizeAndPositionManager,
                        rowStartIndex: rowStartIndex,
                        rowStopIndex: rowStopIndex,
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        styleCache: this._styleCache,
                        verticalOffsetAdjustment: verticalOffsetAdjustment,
                        visibleColumnIndices: visibleColumnIndices,
                        visibleRowIndices: visibleRowIndices
                    }), this._columnStartIndex = columnStartIndex, this._columnStopIndex = columnStopIndex, 
                    this._rowStartIndex = rowStartIndex, this._rowStopIndex = rowStopIndex;
                }
            }
        }, {
            key: "_debounceScrollEnded",
            value: function() {
                var scrollingResetTimeInterval = this.props.scrollingResetTimeInterval;
                this._disablePointerEventsTimeoutId && cancelAnimationTimeout(this._disablePointerEventsTimeoutId), 
                this._disablePointerEventsTimeoutId = requestAnimationTimeout(this._debounceScrollEndedCallback, scrollingResetTimeInterval);
            }
        }, {
            key: "_handleInvalidatedGridSize",
            value: function() {
                if ("number" == typeof this._deferredInvalidateColumnIndex && "number" == typeof this._deferredInvalidateRowIndex) {
                    var columnIndex = this._deferredInvalidateColumnIndex, rowIndex = this._deferredInvalidateRowIndex;
                    this._deferredInvalidateColumnIndex = null, this._deferredInvalidateRowIndex = null, 
                    this.recomputeGridSize({
                        columnIndex: columnIndex,
                        rowIndex: rowIndex
                    });
                }
            }
        }, {
            key: "_invokeOnScrollMemoizer",
            value: function(_ref6) {
                var _this3 = this, scrollLeft = _ref6.scrollLeft, scrollTop = _ref6.scrollTop, totalColumnsWidth = _ref6.totalColumnsWidth, totalRowsHeight = _ref6.totalRowsHeight;
                this._onScrollMemoizer({
                    callback: function(_ref7) {
                        var scrollLeft = _ref7.scrollLeft, scrollTop = _ref7.scrollTop, _this3$props = _this3.props, height = _this3$props.height;
                        (0, _this3$props.onScroll)({
                            clientHeight: height,
                            clientWidth: _this3$props.width,
                            scrollHeight: totalRowsHeight,
                            scrollLeft: scrollLeft,
                            scrollTop: scrollTop,
                            scrollWidth: totalColumnsWidth
                        });
                    },
                    indices: {
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop
                    }
                });
            }
        }, {
            key: "_isScrolling",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state;
                return Object.hasOwnProperty.call(props, "isScrolling") ? Boolean(props.isScrolling) : Boolean(state.isScrolling);
            }
        }, {
            key: "_maybeCallOnScrollbarPresenceChange",
            value: function() {
                if (this._scrollbarPresenceChanged) {
                    var onScrollbarPresenceChange = this.props.onScrollbarPresenceChange;
                    this._scrollbarPresenceChanged = !1, onScrollbarPresenceChange({
                        horizontal: 0 < this._horizontalScrollBarSize,
                        size: this.state.instanceProps.scrollbarSize,
                        vertical: 0 < this._verticalScrollBarSize
                    });
                }
            }
        }, {
            key: "scrollToPosition",
            value: function(_ref8) {
                var scrollLeft = _ref8.scrollLeft, scrollTop = _ref8.scrollTop, stateUpdate = Grid._getScrollToPositionStateUpdate({
                    prevState: this.state,
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop
                });
                stateUpdate && (stateUpdate.needToResetStyleCache = !1, this.setState(stateUpdate));
            }
        }, {
            key: "_getCalculatedScrollLeft",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state;
                return Grid._getCalculatedScrollLeft(props, state);
            }
        }, {
            key: "_updateScrollLeftForScrollToColumn",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state, stateUpdate = Grid._getScrollLeftForScrollToColumnStateUpdate(props, state);
                stateUpdate && (stateUpdate.needToResetStyleCache = !1, this.setState(stateUpdate));
            }
        }, {
            key: "_getCalculatedScrollTop",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state;
                return Grid._getCalculatedScrollTop(props, state);
            }
        }, {
            key: "_resetStyleCache",
            value: function() {
                var styleCache = this._styleCache, cellCache = this._cellCache, isScrollingOptOut = this.props.isScrollingOptOut;
                this._cellCache = {}, this._styleCache = {};
                for (var rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) for (var columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
                    var key = "".concat(rowIndex, "-").concat(columnIndex);
                    this._styleCache[key] = styleCache[key], isScrollingOptOut && (this._cellCache[key] = cellCache[key]);
                }
            }
        }, {
            key: "_updateScrollTopForScrollToRow",
            value: function(argument_0, argument_1) {
                var props = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props, state = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : this.state, stateUpdate = Grid._getScrollTopForScrollToRowStateUpdate(props, state);
                stateUpdate && (stateUpdate.needToResetStyleCache = !1, this.setState(stateUpdate));
            }
        } ], [ {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                var newState = {};
                0 === nextProps.columnCount && 0 !== prevState.scrollLeft || 0 === nextProps.rowCount && 0 !== prevState.scrollTop ? (newState.scrollLeft = 0, 
                newState.scrollTop = 0) : (nextProps.scrollLeft !== prevState.scrollLeft && nextProps.scrollToColumn < 0 || nextProps.scrollTop !== prevState.scrollTop && nextProps.scrollToRow < 0) && Object.assign(newState, Grid._getScrollToPositionStateUpdate({
                    prevState: prevState,
                    scrollLeft: nextProps.scrollLeft,
                    scrollTop: nextProps.scrollTop
                }));
                var maybeStateA, maybeStateB, instanceProps = prevState.instanceProps;
                return newState.needToResetStyleCache = !1, nextProps.columnWidth === instanceProps.prevColumnWidth && nextProps.rowHeight === instanceProps.prevRowHeight || (newState.needToResetStyleCache = !0), 
                instanceProps.columnSizeAndPositionManager.configure({
                    cellCount: nextProps.columnCount,
                    estimatedCellSize: Grid._getEstimatedColumnSize(nextProps),
                    cellSizeGetter: Grid._wrapSizeGetter(nextProps.columnWidth)
                }), instanceProps.rowSizeAndPositionManager.configure({
                    cellCount: nextProps.rowCount,
                    estimatedCellSize: Grid._getEstimatedRowSize(nextProps),
                    cellSizeGetter: Grid._wrapSizeGetter(nextProps.rowHeight)
                }), 0 !== instanceProps.prevColumnCount && 0 !== instanceProps.prevRowCount || (instanceProps.prevColumnCount = 0, 
                instanceProps.prevRowCount = 0), nextProps.autoHeight && !1 === nextProps.isScrolling && !0 === instanceProps.prevIsScrolling && Object.assign(newState, {
                    isScrolling: !1
                }), calculateSizeAndPositionDataAndUpdateScrollOffset({
                    cellCount: instanceProps.prevColumnCount,
                    cellSize: "number" == typeof instanceProps.prevColumnWidth ? instanceProps.prevColumnWidth : null,
                    computeMetadataCallback: function() {
                        return instanceProps.columnSizeAndPositionManager.resetCell(0);
                    },
                    computeMetadataCallbackProps: nextProps,
                    nextCellsCount: nextProps.columnCount,
                    nextCellSize: "number" == typeof nextProps.columnWidth ? nextProps.columnWidth : null,
                    nextScrollToIndex: nextProps.scrollToColumn,
                    scrollToIndex: instanceProps.prevScrollToColumn,
                    updateScrollOffsetForScrollToIndex: function() {
                        maybeStateA = Grid._getScrollLeftForScrollToColumnStateUpdate(nextProps, prevState);
                    }
                }), calculateSizeAndPositionDataAndUpdateScrollOffset({
                    cellCount: instanceProps.prevRowCount,
                    cellSize: "number" == typeof instanceProps.prevRowHeight ? instanceProps.prevRowHeight : null,
                    computeMetadataCallback: function() {
                        return instanceProps.rowSizeAndPositionManager.resetCell(0);
                    },
                    computeMetadataCallbackProps: nextProps,
                    nextCellsCount: nextProps.rowCount,
                    nextCellSize: "number" == typeof nextProps.rowHeight ? nextProps.rowHeight : null,
                    nextScrollToIndex: nextProps.scrollToRow,
                    scrollToIndex: instanceProps.prevScrollToRow,
                    updateScrollOffsetForScrollToIndex: function() {
                        maybeStateB = Grid._getScrollTopForScrollToRowStateUpdate(nextProps, prevState);
                    }
                }), instanceProps.prevColumnCount = nextProps.columnCount, instanceProps.prevColumnWidth = nextProps.columnWidth, 
                instanceProps.prevIsScrolling = !0 === nextProps.isScrolling, instanceProps.prevRowCount = nextProps.rowCount, 
                instanceProps.prevRowHeight = nextProps.rowHeight, instanceProps.prevScrollToColumn = nextProps.scrollToColumn, 
                instanceProps.prevScrollToRow = nextProps.scrollToRow, instanceProps.scrollbarSize = nextProps.getScrollbarSize(), 
                void 0 === instanceProps.scrollbarSize ? (instanceProps.scrollbarSizeMeasured = !1, 
                instanceProps.scrollbarSize = 0) : instanceProps.scrollbarSizeMeasured = !0, newState.instanceProps = instanceProps, 
                _objectSpread2({}, newState, {}, maybeStateA, {}, maybeStateB);
            }
        }, {
            key: "_getEstimatedColumnSize",
            value: function(props) {
                return "number" == typeof props.columnWidth ? props.columnWidth : props.estimatedColumnSize;
            }
        }, {
            key: "_getEstimatedRowSize",
            value: function(props) {
                return "number" == typeof props.rowHeight ? props.rowHeight : props.estimatedRowSize;
            }
        }, {
            key: "_getScrollToPositionStateUpdate",
            value: function(_ref9) {
                var prevState = _ref9.prevState, scrollLeft = _ref9.scrollLeft, scrollTop = _ref9.scrollTop, newState = {
                    scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS$1_REQUESTED
                };
                return "number" == typeof scrollLeft && 0 <= scrollLeft && (newState.scrollDirectionHorizontal = scrollLeft > prevState.scrollLeft ? 1 : -1, 
                newState.scrollLeft = scrollLeft), "number" == typeof scrollTop && 0 <= scrollTop && (newState.scrollDirectionVertical = scrollTop > prevState.scrollTop ? 1 : -1, 
                newState.scrollTop = scrollTop), "number" == typeof scrollLeft && 0 <= scrollLeft && scrollLeft !== prevState.scrollLeft || "number" == typeof scrollTop && 0 <= scrollTop && scrollTop !== prevState.scrollTop ? newState : {};
            }
        }, {
            key: "_wrapSizeGetter",
            value: function(value) {
                return "function" == typeof value ? value : function() {
                    return value;
                };
            }
        }, {
            key: "_getCalculatedScrollLeft",
            value: function(nextProps, prevState) {
                var columnCount = nextProps.columnCount, height = nextProps.height, scrollToAlignment = nextProps.scrollToAlignment, scrollToColumn = nextProps.scrollToColumn, width = nextProps.width, scrollLeft = prevState.scrollLeft, instanceProps = prevState.instanceProps;
                if (0 < columnCount) {
                    var finalColumn = columnCount - 1, targetIndex = scrollToColumn < 0 ? finalColumn : Math.min(finalColumn, scrollToColumn), totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize(), scrollBarSize = instanceProps.scrollbarSizeMeasured && height < totalRowsHeight ? instanceProps.scrollbarSize : 0;
                    return instanceProps.columnSizeAndPositionManager.getUpdatedOffsetForIndex({
                        align: scrollToAlignment,
                        containerSize: width - scrollBarSize,
                        currentOffset: scrollLeft,
                        targetIndex: targetIndex
                    });
                }
                return 0;
            }
        }, {
            key: "_getScrollLeftForScrollToColumnStateUpdate",
            value: function(nextProps, prevState) {
                var scrollLeft = prevState.scrollLeft, calculatedScrollLeft = Grid._getCalculatedScrollLeft(nextProps, prevState);
                return "number" == typeof calculatedScrollLeft && 0 <= calculatedScrollLeft && scrollLeft !== calculatedScrollLeft ? Grid._getScrollToPositionStateUpdate({
                    prevState: prevState,
                    scrollLeft: calculatedScrollLeft,
                    scrollTop: -1
                }) : {};
            }
        }, {
            key: "_getCalculatedScrollTop",
            value: function(nextProps, prevState) {
                var height = nextProps.height, rowCount = nextProps.rowCount, scrollToAlignment = nextProps.scrollToAlignment, scrollToRow = nextProps.scrollToRow, width = nextProps.width, scrollTop = prevState.scrollTop, instanceProps = prevState.instanceProps;
                if (0 < rowCount) {
                    var finalRow = rowCount - 1, targetIndex = scrollToRow < 0 ? finalRow : Math.min(finalRow, scrollToRow), totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize(), scrollBarSize = instanceProps.scrollbarSizeMeasured && width < totalColumnsWidth ? instanceProps.scrollbarSize : 0;
                    return instanceProps.rowSizeAndPositionManager.getUpdatedOffsetForIndex({
                        align: scrollToAlignment,
                        containerSize: height - scrollBarSize,
                        currentOffset: scrollTop,
                        targetIndex: targetIndex
                    });
                }
                return 0;
            }
        }, {
            key: "_getScrollTopForScrollToRowStateUpdate",
            value: function(nextProps, prevState) {
                var scrollTop = prevState.scrollTop, calculatedScrollTop = Grid._getCalculatedScrollTop(nextProps, prevState);
                return "number" == typeof calculatedScrollTop && 0 <= calculatedScrollTop && scrollTop !== calculatedScrollTop ? Grid._getScrollToPositionStateUpdate({
                    prevState: prevState,
                    scrollLeft: -1,
                    scrollTop: calculatedScrollTop
                }) : {};
            }
        } ]), Grid;
    }();
    _defineProperty(Grid, "defaultProps", {
        "aria-label": "grid",
        "aria-readonly": !0,
        autoContainerWidth: !1,
        autoHeight: !1,
        autoWidth: !1,
        cellRangeRenderer: defaultCellRangeRenderer,
        containerRole: "row",
        containerStyle: {},
        estimatedColumnSize: 100,
        estimatedRowSize: 30,
        getScrollbarSize: scrollbarSize,
        noContentRenderer: function() {
            return null;
        },
        onScroll: function() {},
        onScrollbarPresenceChange: function() {},
        onSectionRendered: function() {},
        overscanColumnCount: 0,
        overscanIndicesGetter: defaultOverscanIndicesGetter,
        overscanRowCount: 10,
        role: "grid",
        scrollingResetTimeInterval: 150,
        scrollToAlignment: "auto",
        scrollToColumn: -1,
        scrollToRow: -1,
        style: {},
        tabIndex: 0,
        isScrollingOptOut: !1
    }), polyfill(Grid);
    function defaultOverscanIndicesGetter$1(_ref) {
        var cellCount = _ref.cellCount, overscanCellsCount = _ref.overscanCellsCount, scrollDirection = _ref.scrollDirection, startIndex = _ref.startIndex, stopIndex = _ref.stopIndex;
        return overscanCellsCount = Math.max(1, overscanCellsCount), 1 === scrollDirection ? {
            overscanStartIndex: Math.max(0, startIndex - 1),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        } : {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + 1)
        };
    }
    var InfiniteLoader = function() {
        function InfiniteLoader(props, context) {
            var _this;
            return _classCallCheck(this, InfiniteLoader), (_this = _possibleConstructorReturn(this, _getPrototypeOf(InfiniteLoader).call(this, props, context)))._loadMoreRowsMemoizer = createCallbackMemoizer(), 
            _this._onRowsRendered = _this._onRowsRendered.bind(_assertThisInitialized(_this)), 
            _this._registerChild = _this._registerChild.bind(_assertThisInitialized(_this)), 
            _this;
        }
        return _inherits(InfiniteLoader, React.PureComponent), _createClass(InfiniteLoader, [ {
            key: "resetLoadMoreRowsCache",
            value: function(autoReload) {
                this._loadMoreRowsMemoizer = createCallbackMemoizer(), autoReload && this._doStuff(this._lastRenderedStartIndex, this._lastRenderedStopIndex);
            }
        }, {
            key: "render",
            value: function() {
                return (0, this.props.children)({
                    onRowsRendered: this._onRowsRendered,
                    registerChild: this._registerChild
                });
            }
        }, {
            key: "_loadUnloadedRanges",
            value: function(unloadedRanges) {
                var _this2 = this, loadMoreRows = this.props.loadMoreRows;
                unloadedRanges.forEach(function(unloadedRange) {
                    var promise = loadMoreRows(unloadedRange);
                    promise && promise.then(function() {
                        (function(_ref4) {
                            var lastRenderedStartIndex = _ref4.lastRenderedStartIndex, lastRenderedStopIndex = _ref4.lastRenderedStopIndex, startIndex = _ref4.startIndex, stopIndex = _ref4.stopIndex;
                            return !(lastRenderedStopIndex < startIndex || stopIndex < lastRenderedStartIndex);
                        })({
                            lastRenderedStartIndex: _this2._lastRenderedStartIndex,
                            lastRenderedStopIndex: _this2._lastRenderedStopIndex,
                            startIndex: unloadedRange.startIndex,
                            stopIndex: unloadedRange.stopIndex
                        }) && _this2._registeredChild && function(component) {
                            var currentIndex = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0, recomputeSize = "function" == typeof component.recomputeGridSize ? component.recomputeGridSize : component.recomputeRowHeights;
                            recomputeSize ? recomputeSize.call(component, currentIndex) : component.forceUpdate();
                        }(_this2._registeredChild, _this2._lastRenderedStartIndex);
                    });
                });
            }
        }, {
            key: "_onRowsRendered",
            value: function(_ref) {
                var startIndex = _ref.startIndex, stopIndex = _ref.stopIndex;
                this._lastRenderedStartIndex = startIndex, this._lastRenderedStopIndex = stopIndex, 
                this._doStuff(startIndex, stopIndex);
            }
        }, {
            key: "_doStuff",
            value: function(startIndex, stopIndex) {
                var _ref2, _this3 = this, _this$props = this.props, isRowLoaded = _this$props.isRowLoaded, minimumBatchSize = _this$props.minimumBatchSize, rowCount = _this$props.rowCount, threshold = _this$props.threshold, unloadedRanges = function(_ref5) {
                    for (var isRowLoaded = _ref5.isRowLoaded, minimumBatchSize = _ref5.minimumBatchSize, rowCount = _ref5.rowCount, startIndex = _ref5.startIndex, stopIndex = _ref5.stopIndex, unloadedRanges = [], rangeStartIndex = null, rangeStopIndex = null, index = startIndex; index <= stopIndex; index++) {
                        isRowLoaded({
                            index: index
                        }) ? null !== rangeStopIndex && (unloadedRanges.push({
                            startIndex: rangeStartIndex,
                            stopIndex: rangeStopIndex
                        }), rangeStartIndex = rangeStopIndex = null) : (rangeStopIndex = index, null === rangeStartIndex && (rangeStartIndex = index));
                    }
                    if (null !== rangeStopIndex) {
                        for (var potentialStopIndex = Math.min(Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1), rowCount - 1), _index = rangeStopIndex + 1; _index <= potentialStopIndex && !isRowLoaded({
                            index: _index
                        }); _index++) rangeStopIndex = _index;
                        unloadedRanges.push({
                            startIndex: rangeStartIndex,
                            stopIndex: rangeStopIndex
                        });
                    }
                    if (unloadedRanges.length) for (var firstUnloadedRange = unloadedRanges[0]; firstUnloadedRange.stopIndex - firstUnloadedRange.startIndex + 1 < minimumBatchSize && 0 < firstUnloadedRange.startIndex; ) {
                        var _index2 = firstUnloadedRange.startIndex - 1;
                        if (isRowLoaded({
                            index: _index2
                        })) break;
                        firstUnloadedRange.startIndex = _index2;
                    }
                    return unloadedRanges;
                }({
                    isRowLoaded: isRowLoaded,
                    minimumBatchSize: minimumBatchSize,
                    rowCount: rowCount,
                    startIndex: Math.max(0, startIndex - threshold),
                    stopIndex: Math.min(rowCount - 1, stopIndex + threshold)
                }), squashedUnloadedRanges = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(unloadedRanges.map(function(_ref3) {
                    return [ _ref3.startIndex, _ref3.stopIndex ];
                })));
                this._loadMoreRowsMemoizer({
                    callback: function() {
                        _this3._loadUnloadedRanges(unloadedRanges);
                    },
                    indices: {
                        squashedUnloadedRanges: squashedUnloadedRanges
                    }
                });
            }
        }, {
            key: "_registerChild",
            value: function(registeredChild) {
                this._registeredChild = registeredChild;
            }
        } ]), InfiniteLoader;
    }();
    _defineProperty(InfiniteLoader, "propTypes", {
        children: propTypes.func.isRequired,
        isRowLoaded: propTypes.func.isRequired,
        loadMoreRows: propTypes.func.isRequired,
        minimumBatchSize: propTypes.number.isRequired,
        rowCount: propTypes.number.isRequired,
        threshold: propTypes.number.isRequired
    }), _defineProperty(InfiniteLoader, "defaultProps", {
        minimumBatchSize: 10,
        rowCount: 0,
        threshold: 15
    });
    var List = function() {
        function List() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, List);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(List)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "Grid", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_cellRenderer", function(_ref) {
                var parent = _ref.parent, rowIndex = _ref.rowIndex, style = _ref.style, isScrolling = _ref.isScrolling, isVisible = _ref.isVisible, key = _ref.key, rowRenderer = _this.props.rowRenderer, widthDescriptor = Object.getOwnPropertyDescriptor(style, "width");
                return widthDescriptor && widthDescriptor.writable && (style.width = "100%"), rowRenderer({
                    index: rowIndex,
                    style: style,
                    isScrolling: isScrolling,
                    isVisible: isVisible,
                    key: key,
                    parent: parent
                });
            }), _defineProperty(_assertThisInitialized(_this), "_setRef", function(ref) {
                _this.Grid = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_onScroll", function(_ref2) {
                var clientHeight = _ref2.clientHeight, scrollHeight = _ref2.scrollHeight, scrollTop = _ref2.scrollTop;
                (0, _this.props.onScroll)({
                    clientHeight: clientHeight,
                    scrollHeight: scrollHeight,
                    scrollTop: scrollTop
                });
            }), _defineProperty(_assertThisInitialized(_this), "_onSectionRendered", function(_ref3) {
                var rowOverscanStartIndex = _ref3.rowOverscanStartIndex, rowOverscanStopIndex = _ref3.rowOverscanStopIndex, rowStartIndex = _ref3.rowStartIndex, rowStopIndex = _ref3.rowStopIndex;
                (0, _this.props.onRowsRendered)({
                    overscanStartIndex: rowOverscanStartIndex,
                    overscanStopIndex: rowOverscanStopIndex,
                    startIndex: rowStartIndex,
                    stopIndex: rowStopIndex
                });
            }), _this;
        }
        return _inherits(List, React.PureComponent), _createClass(List, [ {
            key: "forceUpdateGrid",
            value: function() {
                this.Grid && this.Grid.forceUpdate();
            }
        }, {
            key: "getOffsetForRow",
            value: function(_ref4) {
                var alignment = _ref4.alignment, index = _ref4.index;
                return this.Grid ? this.Grid.getOffsetForCell({
                    alignment: alignment,
                    rowIndex: index,
                    columnIndex: 0
                }).scrollTop : 0;
            }
        }, {
            key: "invalidateCellSizeAfterRender",
            value: function(_ref5) {
                var columnIndex = _ref5.columnIndex, rowIndex = _ref5.rowIndex;
                this.Grid && this.Grid.invalidateCellSizeAfterRender({
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                });
            }
        }, {
            key: "measureAllRows",
            value: function() {
                this.Grid && this.Grid.measureAllCells();
            }
        }, {
            key: "recomputeGridSize",
            value: function(argument_0) {
                var _ref6 = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref6$columnIndex = _ref6.columnIndex, columnIndex = void 0 === _ref6$columnIndex ? 0 : _ref6$columnIndex, _ref6$rowIndex = _ref6.rowIndex, rowIndex = void 0 === _ref6$rowIndex ? 0 : _ref6$rowIndex;
                this.Grid && this.Grid.recomputeGridSize({
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                });
            }
        }, {
            key: "recomputeRowHeights",
            value: function(argument_0) {
                var index = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.recomputeGridSize({
                    rowIndex: index,
                    columnIndex: 0
                });
            }
        }, {
            key: "scrollToPosition",
            value: function(argument_0) {
                var scrollTop = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.scrollToPosition({
                    scrollTop: scrollTop
                });
            }
        }, {
            key: "scrollToRow",
            value: function(argument_0) {
                var index = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.scrollToCell({
                    columnIndex: 0,
                    rowIndex: index
                });
            }
        }, {
            key: "render",
            value: function() {
                var _this$props = this.props, className = _this$props.className, noRowsRenderer = _this$props.noRowsRenderer, scrollToIndex = _this$props.scrollToIndex, width = _this$props.width, classNames = clsx("ReactVirtualized__List", className);
                return React.createElement(Grid, _extends({}, this.props, {
                    autoContainerWidth: !0,
                    cellRenderer: this._cellRenderer,
                    className: classNames,
                    columnWidth: width,
                    columnCount: 1,
                    noContentRenderer: noRowsRenderer,
                    onScroll: this._onScroll,
                    onSectionRendered: this._onSectionRendered,
                    ref: this._setRef,
                    scrollToRow: scrollToIndex
                }));
            }
        } ]), List;
    }();
    _defineProperty(List, "defaultProps", {
        autoHeight: !1,
        estimatedRowSize: 30,
        onScroll: function() {},
        noRowsRenderer: function() {
            return null;
        },
        onRowsRendered: function() {},
        overscanIndicesGetter: defaultOverscanIndicesGetter$1,
        overscanRowCount: 10,
        scrollToAlignment: "auto",
        scrollToIndex: -1,
        style: {}
    });
    var bounds = {
        ge: function(a, y, c, l, h) {
            return "function" == typeof c ? function(a, l, h, y, c) {
                for (var i = h + 1; l <= h; ) {
                    var m = l + h >>> 1;
                    0 <= c(a[m], y) ? h = (i = m) - 1 : l = 1 + m;
                }
                return i;
            }(a, void 0 === l ? 0 : 0 | l, void 0 === h ? a.length - 1 : 0 | h, y, c) : function(a, l, h, y) {
                for (var i = h + 1; l <= h; ) {
                    var m = l + h >>> 1;
                    y <= a[m] ? h = (i = m) - 1 : l = 1 + m;
                }
                return i;
            }(a, void 0 === c ? 0 : 0 | c, void 0 === l ? a.length - 1 : 0 | l, y);
        },
        gt: function(a, y, c, l, h) {
            return "function" == typeof c ? function(a, l, h, y, c) {
                for (var i = h + 1; l <= h; ) {
                    var m = l + h >>> 1;
                    0 < c(a[m], y) ? h = (i = m) - 1 : l = 1 + m;
                }
                return i;
            }(a, void 0 === l ? 0 : 0 | l, void 0 === h ? a.length - 1 : 0 | h, y, c) : function(a, l, h, y) {
                for (var i = h + 1; l <= h; ) {
                    var m = l + h >>> 1;
                    y < a[m] ? h = (i = m) - 1 : l = 1 + m;
                }
                return i;
            }(a, void 0 === c ? 0 : 0 | c, void 0 === l ? a.length - 1 : 0 | l, y);
        },
        lt: function(a, y, c, l, h) {
            return "function" == typeof c ? function(a, l, h, y, c) {
                for (var i = l - 1; l <= h; ) {
                    var m = l + h >>> 1;
                    c(a[m], y) < 0 ? l = 1 + (i = m) : h = m - 1;
                }
                return i;
            }(a, void 0 === l ? 0 : 0 | l, void 0 === h ? a.length - 1 : 0 | h, y, c) : function(a, l, h, y) {
                for (var i = l - 1; l <= h; ) {
                    var m = l + h >>> 1;
                    a[m] < y ? l = 1 + (i = m) : h = m - 1;
                }
                return i;
            }(a, void 0 === c ? 0 : 0 | c, void 0 === l ? a.length - 1 : 0 | l, y);
        },
        le: function(a, y, c, l, h) {
            return "function" == typeof c ? function(a, l, h, y, c) {
                for (var i = l - 1; l <= h; ) {
                    var m = l + h >>> 1;
                    c(a[m], y) <= 0 ? l = 1 + (i = m) : h = m - 1;
                }
                return i;
            }(a, void 0 === l ? 0 : 0 | l, void 0 === h ? a.length - 1 : 0 | h, y, c) : function(a, l, h, y) {
                for (var i = l - 1; l <= h; ) {
                    var m = l + h >>> 1;
                    a[m] <= y ? l = 1 + (i = m) : h = m - 1;
                }
                return i;
            }(a, void 0 === c ? 0 : 0 | c, void 0 === l ? a.length - 1 : 0 | l, y);
        },
        eq: function(a, y, c, l, h) {
            return "function" == typeof c ? function(a, l, h, y, c) {
                for (;l <= h; ) {
                    var m = l + h >>> 1, p = c(a[m], y);
                    if (0 === p) return m;
                    p <= 0 ? l = 1 + m : h = m - 1;
                }
                return -1;
            }(a, void 0 === l ? 0 : 0 | l, void 0 === h ? a.length - 1 : 0 | h, y, c) : function(a, l, h, y) {
                for (;l <= h; ) {
                    var m = l + h >>> 1, x = a[m];
                    if (x === y) return m;
                    x <= y ? l = 1 + m : h = m - 1;
                }
                return -1;
            }(a, void 0 === c ? 0 : 0 | c, void 0 === l ? a.length - 1 : 0 | l, y);
        }
    };
    function IntervalTreeNode(mid, left, right, leftPoints, rightPoints) {
        this.mid = mid, this.left = left, this.right = right, this.leftPoints = leftPoints, 
        this.rightPoints = rightPoints, this.count = (left ? left.count : 0) + (right ? right.count : 0) + leftPoints.length;
    }
    var proto = IntervalTreeNode.prototype;
    function copy(a, b) {
        a.mid = b.mid, a.left = b.left, a.right = b.right, a.leftPoints = b.leftPoints, 
        a.rightPoints = b.rightPoints, a.count = b.count;
    }
    function rebuild(node, intervals) {
        var ntree = createIntervalTree(intervals);
        node.mid = ntree.mid, node.left = ntree.left, node.right = ntree.right, node.leftPoints = ntree.leftPoints, 
        node.rightPoints = ntree.rightPoints, node.count = ntree.count;
    }
    function rebuildWithInterval(node, interval) {
        var intervals = node.intervals([]);
        intervals.push(interval), rebuild(node, intervals);
    }
    function rebuildWithoutInterval(node, interval) {
        var intervals = node.intervals([]), idx = intervals.indexOf(interval);
        return idx < 0 ? 0 : (intervals.splice(idx, 1), rebuild(node, intervals), 1);
    }
    function reportLeftRange(arr, hi, cb) {
        for (var i = 0; i < arr.length && arr[i][0] <= hi; ++i) {
            var r = cb(arr[i]);
            if (r) return r;
        }
    }
    function reportRightRange(arr, lo, cb) {
        for (var i = arr.length - 1; 0 <= i && arr[i][1] >= lo; --i) {
            var r = cb(arr[i]);
            if (r) return r;
        }
    }
    function reportRange(arr, cb) {
        for (var i = 0; i < arr.length; ++i) {
            var r = cb(arr[i]);
            if (r) return r;
        }
    }
    function compareNumbers(a, b) {
        return a - b;
    }
    function compareBegin(a, b) {
        var d = a[0] - b[0];
        return d || a[1] - b[1];
    }
    function compareEnd(a, b) {
        var d = a[1] - b[1];
        return d || a[0] - b[0];
    }
    function createIntervalTree(intervals) {
        if (0 === intervals.length) return null;
        for (var pts = [], i = 0; i < intervals.length; ++i) pts.push(intervals[i][0], intervals[i][1]);
        pts.sort(compareNumbers);
        var mid = pts[pts.length >> 1], leftIntervals = [], rightIntervals = [], centerIntervals = [];
        for (i = 0; i < intervals.length; ++i) {
            var s = intervals[i];
            s[1] < mid ? leftIntervals.push(s) : mid < s[0] ? rightIntervals.push(s) : centerIntervals.push(s);
        }
        var leftPoints = centerIntervals, rightPoints = centerIntervals.slice();
        return leftPoints.sort(compareBegin), rightPoints.sort(compareEnd), new IntervalTreeNode(mid, createIntervalTree(leftIntervals), createIntervalTree(rightIntervals), leftPoints, rightPoints);
    }
    function IntervalTree(root) {
        this.root = root;
    }
    proto.intervals = function(result) {
        return result.push.apply(result, this.leftPoints), this.left && this.left.intervals(result), 
        this.right && this.right.intervals(result), result;
    }, proto.insert = function(interval) {
        var weight = this.count - this.leftPoints.length;
        if (this.count += 1, interval[1] < this.mid) this.left ? 4 * (this.left.count + 1) > 3 * (1 + weight) ? rebuildWithInterval(this, interval) : this.left.insert(interval) : this.left = createIntervalTree([ interval ]); else if (interval[0] > this.mid) this.right ? 4 * (this.right.count + 1) > 3 * (1 + weight) ? rebuildWithInterval(this, interval) : this.right.insert(interval) : this.right = createIntervalTree([ interval ]); else {
            var l = bounds.ge(this.leftPoints, interval, compareBegin), r = bounds.ge(this.rightPoints, interval, compareEnd);
            this.leftPoints.splice(l, 0, interval), this.rightPoints.splice(r, 0, interval);
        }
    }, proto.remove = function(interval) {
        var weight = this.count - this.leftPoints;
        if (interval[1] < this.mid) {
            return this.left ? 3 * (weight - 1) < 4 * (this.right ? this.right.count : 0) ? rebuildWithoutInterval(this, interval) : 2 === (r = this.left.remove(interval)) ? (this.left = null, 
            this.count -= 1, 1) : (1 === r && (this.count -= 1), r) : 0;
        } else {
            if (interval[0] > this.mid) return this.right ? 3 * (weight - 1) < 4 * (this.left ? this.left.count : 0) ? rebuildWithoutInterval(this, interval) : 2 === (r = this.right.remove(interval)) ? (this.right = null, 
            this.count -= 1, 1) : (1 === r && (this.count -= 1), r) : 0;
            if (1 === this.count) return this.leftPoints[0] === interval ? 2 : 0;
            if (1 === this.leftPoints.length && this.leftPoints[0] === interval) {
                if (this.left && this.right) {
                    for (var p = this, n = this.left; n.right; ) n = (p = n).right;
                    if (p === this) n.right = this.right; else {
                        var l = this.left;
                        r = this.right;
                        p.count -= n.count, p.right = n.left, n.left = l, n.right = r;
                    }
                    copy(this, n), this.count = (this.left ? this.left.count : 0) + (this.right ? this.right.count : 0) + this.leftPoints.length;
                } else this.left ? copy(this, this.left) : copy(this, this.right);
                return 1;
            }
            for (l = bounds.ge(this.leftPoints, interval, compareBegin); l < this.leftPoints.length && this.leftPoints[l][0] === interval[0]; ++l) if (this.leftPoints[l] === interval) {
                this.count -= 1, this.leftPoints.splice(l, 1);
                for (r = bounds.ge(this.rightPoints, interval, compareEnd); r < this.rightPoints.length && this.rightPoints[r][1] === interval[1]; ++r) if (this.rightPoints[r] === interval) return this.rightPoints.splice(r, 1), 
                1;
            }
            return 0;
            var r;
        }
    }, proto.queryPoint = function(x, cb) {
        if (x < this.mid) {
            if (this.left) if (r = this.left.queryPoint(x, cb)) return r;
            return reportLeftRange(this.leftPoints, x, cb);
        }
        if (x > this.mid) {
            var r;
            if (this.right) if (r = this.right.queryPoint(x, cb)) return r;
            return reportRightRange(this.rightPoints, x, cb);
        }
        return reportRange(this.leftPoints, cb);
    }, proto.queryInterval = function(lo, hi, cb) {
        var r;
        if (lo < this.mid && this.left && (r = this.left.queryInterval(lo, hi, cb))) return r;
        if (hi > this.mid && this.right && (r = this.right.queryInterval(lo, hi, cb))) return r;
        return hi < this.mid ? reportLeftRange(this.leftPoints, hi, cb) : lo > this.mid ? reportRightRange(this.rightPoints, lo, cb) : reportRange(this.leftPoints, cb);
    };
    var tproto = IntervalTree.prototype;
    tproto.insert = function(interval) {
        this.root ? this.root.insert(interval) : this.root = new IntervalTreeNode(interval[0], null, null, [ interval ], [ interval ]);
    }, tproto.remove = function(interval) {
        if (this.root) {
            var r = this.root.remove(interval);
            return 2 === r && (this.root = null), 0 !== r;
        }
        return !1;
    }, tproto.queryPoint = function(p, cb) {
        if (this.root) return this.root.queryPoint(p, cb);
    }, tproto.queryInterval = function(lo, hi, cb) {
        if (lo <= hi && this.root) return this.root.queryInterval(lo, hi, cb);
    }, Object.defineProperty(tproto, "count", {
        get: function() {
            return this.root ? this.root.count : 0;
        }
    }), Object.defineProperty(tproto, "intervals", {
        get: function() {
            return this.root ? this.root.intervals([]) : [];
        }
    });
    var PositionCache = function() {
        function PositionCache() {
            _classCallCheck(this, PositionCache), _defineProperty(this, "_columnSizeMap", {}), 
            _defineProperty(this, "_intervalTree", function(intervals) {
                return intervals && 0 !== intervals.length ? new IntervalTree(createIntervalTree(intervals)) : new IntervalTree(null);
            }()), _defineProperty(this, "_leftMap", {});
        }
        return _createClass(PositionCache, [ {
            key: "estimateTotalHeight",
            value: function(cellCount, columnCount, defaultCellHeight) {
                var unmeasuredCellCount = cellCount - this.count;
                return this.tallestColumnSize + Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight;
            }
        }, {
            key: "range",
            value: function(scrollTop, clientHeight, renderCallback) {
                var _this = this;
                this._intervalTree.queryInterval(scrollTop, scrollTop + clientHeight, function(_ref) {
                    var _ref2 = _slicedToArray(_ref, 3), top = _ref2[0], index = (_ref2[1], _ref2[2]);
                    return renderCallback(index, _this._leftMap[index], top);
                });
            }
        }, {
            key: "setPosition",
            value: function(index, left, top, height) {
                this._intervalTree.insert([ top, top + height, index ]), this._leftMap[index] = left;
                var columnSizeMap = this._columnSizeMap, columnHeight = columnSizeMap[left];
                columnSizeMap[left] = void 0 === columnHeight ? top + height : Math.max(columnHeight, top + height);
            }
        }, {
            key: "count",
            get: function() {
                return this._intervalTree.count;
            }
        }, {
            key: "shortestColumnSize",
            get: function() {
                var columnSizeMap = this._columnSizeMap, size = 0;
                for (var i in columnSizeMap) {
                    var height = columnSizeMap[i];
                    size = 0 === size ? height : Math.min(size, height);
                }
                return size;
            }
        }, {
            key: "tallestColumnSize",
            get: function() {
                var columnSizeMap = this._columnSizeMap, size = 0;
                for (var i in columnSizeMap) {
                    var height = columnSizeMap[i];
                    size = Math.max(size, height);
                }
                return size;
            }
        } ]), PositionCache;
    }(), Masonry = function() {
        function Masonry() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, Masonry);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Masonry)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "state", {
                isScrolling: !1,
                scrollTop: 0
            }), _defineProperty(_assertThisInitialized(_this), "_debounceResetIsScrollingId", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_invalidateOnUpdateStartIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_invalidateOnUpdateStopIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_positionCache", new PositionCache()), 
            _defineProperty(_assertThisInitialized(_this), "_startIndex", null), _defineProperty(_assertThisInitialized(_this), "_startIndexMemoized", null), 
            _defineProperty(_assertThisInitialized(_this), "_stopIndex", null), _defineProperty(_assertThisInitialized(_this), "_stopIndexMemoized", null), 
            _defineProperty(_assertThisInitialized(_this), "_debounceResetIsScrollingCallback", function() {
                _this.setState({
                    isScrolling: !1
                });
            }), _defineProperty(_assertThisInitialized(_this), "_setScrollingContainerRef", function(ref) {
                _this._scrollingContainer = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_onScroll", function(event) {
                var height = _this.props.height, eventScrollTop = event.currentTarget.scrollTop, scrollTop = Math.min(Math.max(0, _this._getEstimatedTotalHeight() - height), eventScrollTop);
                eventScrollTop === scrollTop && (_this._debounceResetIsScrolling(), _this.state.scrollTop !== scrollTop && _this.setState({
                    isScrolling: !0,
                    scrollTop: scrollTop
                }));
            }), _this;
        }
        return _inherits(Masonry, React.PureComponent), _createClass(Masonry, [ {
            key: "clearCellPositions",
            value: function() {
                this._positionCache = new PositionCache(), this.forceUpdate();
            }
        }, {
            key: "invalidateCellSizeAfterRender",
            value: function(_ref) {
                var index = _ref.rowIndex;
                null === this._invalidateOnUpdateStartIndex ? (this._invalidateOnUpdateStartIndex = index, 
                this._invalidateOnUpdateStopIndex = index) : (this._invalidateOnUpdateStartIndex = Math.min(this._invalidateOnUpdateStartIndex, index), 
                this._invalidateOnUpdateStopIndex = Math.max(this._invalidateOnUpdateStopIndex, index));
            }
        }, {
            key: "recomputeCellPositions",
            value: function() {
                var stopIndex = this._positionCache.count - 1;
                this._positionCache = new PositionCache(), this._populatePositionCache(0, stopIndex), 
                this.forceUpdate();
            }
        }, {
            key: "componentDidMount",
            value: function() {
                this._checkInvalidateOnUpdate(), this._invokeOnScrollCallback(), this._invokeOnCellsRenderedCallback();
            }
        }, {
            key: "componentDidUpdate",
            value: function(prevProps) {
                this._checkInvalidateOnUpdate(), this._invokeOnScrollCallback(), this._invokeOnCellsRenderedCallback(), 
                this.props.scrollTop !== prevProps.scrollTop && this._debounceResetIsScrolling();
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._debounceResetIsScrollingId && cancelAnimationTimeout(this._debounceResetIsScrollingId);
            }
        }, {
            key: "render",
            value: function() {
                var stopIndex, _this2 = this, _this$props = this.props, autoHeight = _this$props.autoHeight, cellCount = _this$props.cellCount, cellMeasurerCache = _this$props.cellMeasurerCache, cellRenderer = _this$props.cellRenderer, className = _this$props.className, height = _this$props.height, id = _this$props.id, keyMapper = _this$props.keyMapper, overscanByPixels = _this$props.overscanByPixels, role = _this$props.role, style = _this$props.style, tabIndex = _this$props.tabIndex, width = _this$props.width, rowDirection = _this$props.rowDirection, _this$state = this.state, isScrolling = _this$state.isScrolling, scrollTop = _this$state.scrollTop, children = [], estimateTotalHeight = this._getEstimatedTotalHeight(), shortestColumnSize = this._positionCache.shortestColumnSize, measuredCellCount = this._positionCache.count, startIndex = 0;
                if (this._positionCache.range(Math.max(0, scrollTop - overscanByPixels), height + 2 * overscanByPixels, function(index, left, top) {
                    var _style;
                    stopIndex = void 0 === stopIndex ? startIndex = index : (startIndex = Math.min(startIndex, index), 
                    Math.max(stopIndex, index)), children.push(cellRenderer({
                        index: index,
                        isScrolling: isScrolling,
                        key: keyMapper(index),
                        parent: _this2,
                        style: (_style = {
                            height: cellMeasurerCache.getHeight(index)
                        }, _defineProperty(_style, "ltr" === rowDirection ? "left" : "right", left), _defineProperty(_style, "position", "absolute"), 
                        _defineProperty(_style, "top", top), _defineProperty(_style, "width", cellMeasurerCache.getWidth(index)), 
                        _style)
                    }));
                }), shortestColumnSize < scrollTop + height + overscanByPixels && measuredCellCount < cellCount) for (var batchSize = Math.min(cellCount - measuredCellCount, Math.ceil((scrollTop + height + overscanByPixels - shortestColumnSize) / cellMeasurerCache.defaultHeight * width / cellMeasurerCache.defaultWidth)), _index = measuredCellCount; _index < measuredCellCount + batchSize; _index++) stopIndex = _index, 
                children.push(cellRenderer({
                    index: _index,
                    isScrolling: isScrolling,
                    key: keyMapper(_index),
                    parent: this,
                    style: {
                        width: cellMeasurerCache.getWidth(_index)
                    }
                }));
                return this._startIndex = startIndex, this._stopIndex = stopIndex, React.createElement("div", {
                    ref: this._setScrollingContainerRef,
                    "aria-label": this.props["aria-label"],
                    className: clsx("ReactVirtualized__Masonry", className),
                    id: id,
                    onScroll: this._onScroll,
                    role: role,
                    style: _objectSpread2({
                        boxSizing: "border-box",
                        direction: "ltr",
                        height: autoHeight ? "auto" : height,
                        overflowX: "hidden",
                        overflowY: estimateTotalHeight < height ? "hidden" : "auto",
                        position: "relative",
                        width: width,
                        WebkitOverflowScrolling: "touch",
                        willChange: "transform"
                    }, style),
                    tabIndex: tabIndex
                }, React.createElement("div", {
                    className: "ReactVirtualized__Masonry__innerScrollContainer",
                    style: {
                        width: "100%",
                        height: estimateTotalHeight,
                        maxWidth: "100%",
                        maxHeight: estimateTotalHeight,
                        overflow: "hidden",
                        pointerEvents: isScrolling ? "none" : "",
                        position: "relative"
                    }
                }, children));
            }
        }, {
            key: "_checkInvalidateOnUpdate",
            value: function() {
                if ("number" == typeof this._invalidateOnUpdateStartIndex) {
                    var startIndex = this._invalidateOnUpdateStartIndex, stopIndex = this._invalidateOnUpdateStopIndex;
                    this._invalidateOnUpdateStartIndex = null, this._invalidateOnUpdateStopIndex = null, 
                    this._populatePositionCache(startIndex, stopIndex), this.forceUpdate();
                }
            }
        }, {
            key: "_debounceResetIsScrolling",
            value: function() {
                var scrollingResetTimeInterval = this.props.scrollingResetTimeInterval;
                this._debounceResetIsScrollingId && cancelAnimationTimeout(this._debounceResetIsScrollingId), 
                this._debounceResetIsScrollingId = requestAnimationTimeout(this._debounceResetIsScrollingCallback, scrollingResetTimeInterval);
            }
        }, {
            key: "_getEstimatedTotalHeight",
            value: function() {
                var _this$props2 = this.props, cellCount = _this$props2.cellCount, cellMeasurerCache = _this$props2.cellMeasurerCache, width = _this$props2.width, estimatedColumnCount = Math.max(1, Math.floor(width / cellMeasurerCache.defaultWidth));
                return this._positionCache.estimateTotalHeight(cellCount, estimatedColumnCount, cellMeasurerCache.defaultHeight);
            }
        }, {
            key: "_invokeOnScrollCallback",
            value: function() {
                var _this$props3 = this.props, height = _this$props3.height, onScroll = _this$props3.onScroll, scrollTop = this.state.scrollTop;
                this._onScrollMemoized !== scrollTop && (onScroll({
                    clientHeight: height,
                    scrollHeight: this._getEstimatedTotalHeight(),
                    scrollTop: scrollTop
                }), this._onScrollMemoized = scrollTop);
            }
        }, {
            key: "_invokeOnCellsRenderedCallback",
            value: function() {
                this._startIndexMemoized === this._startIndex && this._stopIndexMemoized === this._stopIndex || ((0, 
                this.props.onCellsRendered)({
                    startIndex: this._startIndex,
                    stopIndex: this._stopIndex
                }), this._startIndexMemoized = this._startIndex, this._stopIndexMemoized = this._stopIndex);
            }
        }, {
            key: "_populatePositionCache",
            value: function(startIndex, stopIndex) {
                for (var _this$props4 = this.props, cellMeasurerCache = _this$props4.cellMeasurerCache, cellPositioner = _this$props4.cellPositioner, _index2 = startIndex; _index2 <= stopIndex; _index2++) {
                    var _cellPositioner = cellPositioner(_index2), left = _cellPositioner.left, top = _cellPositioner.top;
                    this._positionCache.setPosition(_index2, left, top, cellMeasurerCache.getHeight(_index2));
                }
            }
        } ], [ {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                return void 0 !== nextProps.scrollTop && prevState.scrollTop !== nextProps.scrollTop ? {
                    isScrolling: !0,
                    scrollTop: nextProps.scrollTop
                } : null;
            }
        } ]), Masonry;
    }();
    function noop() {}
    _defineProperty(Masonry, "defaultProps", {
        autoHeight: !1,
        keyMapper: function(value) {
            return value;
        },
        onCellsRendered: noop,
        onScroll: noop,
        overscanByPixels: 20,
        role: "grid",
        scrollingResetTimeInterval: 150,
        style: {},
        tabIndex: 0,
        rowDirection: "ltr"
    }), polyfill(Masonry);
    var CellMeasurerCacheDecorator = function() {
        function CellMeasurerCacheDecorator() {
            var _this = this, params = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
            _classCallCheck(this, CellMeasurerCacheDecorator), _defineProperty(this, "_cellMeasurerCache", void 0), 
            _defineProperty(this, "_columnIndexOffset", void 0), _defineProperty(this, "_rowIndexOffset", void 0), 
            _defineProperty(this, "columnWidth", function(_ref) {
                var index = _ref.index;
                _this._cellMeasurerCache.columnWidth({
                    index: index + _this._columnIndexOffset
                });
            }), _defineProperty(this, "rowHeight", function(_ref2) {
                var index = _ref2.index;
                _this._cellMeasurerCache.rowHeight({
                    index: index + _this._rowIndexOffset
                });
            });
            var cellMeasurerCache = params.cellMeasurerCache, _params$columnIndexOf = params.columnIndexOffset, columnIndexOffset = void 0 === _params$columnIndexOf ? 0 : _params$columnIndexOf, _params$rowIndexOffse = params.rowIndexOffset, rowIndexOffset = void 0 === _params$rowIndexOffse ? 0 : _params$rowIndexOffse;
            this._cellMeasurerCache = cellMeasurerCache, this._columnIndexOffset = columnIndexOffset, 
            this._rowIndexOffset = rowIndexOffset;
        }
        return _createClass(CellMeasurerCacheDecorator, [ {
            key: "clear",
            value: function(rowIndex, columnIndex) {
                this._cellMeasurerCache.clear(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
            }
        }, {
            key: "clearAll",
            value: function() {
                this._cellMeasurerCache.clearAll();
            }
        }, {
            key: "hasFixedHeight",
            value: function() {
                return this._cellMeasurerCache.hasFixedHeight();
            }
        }, {
            key: "hasFixedWidth",
            value: function() {
                return this._cellMeasurerCache.hasFixedWidth();
            }
        }, {
            key: "getHeight",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0;
                return this._cellMeasurerCache.getHeight(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
            }
        }, {
            key: "getWidth",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0;
                return this._cellMeasurerCache.getWidth(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
            }
        }, {
            key: "has",
            value: function(rowIndex, argument_1) {
                var columnIndex = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : 0;
                return this._cellMeasurerCache.has(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
            }
        }, {
            key: "set",
            value: function(rowIndex, columnIndex, width, height) {
                this._cellMeasurerCache.set(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset, width, height);
            }
        }, {
            key: "defaultHeight",
            get: function() {
                return this._cellMeasurerCache.defaultHeight;
            }
        }, {
            key: "defaultWidth",
            get: function() {
                return this._cellMeasurerCache.defaultWidth;
            }
        } ]), CellMeasurerCacheDecorator;
    }(), MultiGrid = function() {
        function MultiGrid(props, context) {
            var _this;
            _classCallCheck(this, MultiGrid), _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, _getPrototypeOf(MultiGrid).call(this, props, context))), "state", {
                scrollLeft: 0,
                scrollTop: 0,
                scrollbarSize: 0,
                showHorizontalScrollbar: !1,
                showVerticalScrollbar: !1
            }), _defineProperty(_assertThisInitialized(_this), "_deferredInvalidateColumnIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_deferredInvalidateRowIndex", null), 
            _defineProperty(_assertThisInitialized(_this), "_bottomLeftGridRef", function(ref) {
                _this._bottomLeftGrid = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_bottomRightGridRef", function(ref) {
                _this._bottomRightGrid = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_cellRendererBottomLeftGrid", function(_ref) {
                var rowIndex = _ref.rowIndex, rest = _objectWithoutProperties(_ref, [ "rowIndex" ]), _this$props = _this.props, cellRenderer = _this$props.cellRenderer, fixedRowCount = _this$props.fixedRowCount;
                return rowIndex === _this$props.rowCount - fixedRowCount ? React.createElement("div", {
                    key: rest.key,
                    style: _objectSpread2({}, rest.style, {
                        height: 20
                    })
                }) : cellRenderer(_objectSpread2({}, rest, {
                    parent: _assertThisInitialized(_this),
                    rowIndex: rowIndex + fixedRowCount
                }));
            }), _defineProperty(_assertThisInitialized(_this), "_cellRendererBottomRightGrid", function(_ref2) {
                var columnIndex = _ref2.columnIndex, rowIndex = _ref2.rowIndex, rest = _objectWithoutProperties(_ref2, [ "columnIndex", "rowIndex" ]), _this$props2 = _this.props, cellRenderer = _this$props2.cellRenderer, fixedColumnCount = _this$props2.fixedColumnCount, fixedRowCount = _this$props2.fixedRowCount;
                return cellRenderer(_objectSpread2({}, rest, {
                    columnIndex: columnIndex + fixedColumnCount,
                    parent: _assertThisInitialized(_this),
                    rowIndex: rowIndex + fixedRowCount
                }));
            }), _defineProperty(_assertThisInitialized(_this), "_cellRendererTopRightGrid", function(_ref3) {
                var columnIndex = _ref3.columnIndex, rest = _objectWithoutProperties(_ref3, [ "columnIndex" ]), _this$props3 = _this.props, cellRenderer = _this$props3.cellRenderer, columnCount = _this$props3.columnCount, fixedColumnCount = _this$props3.fixedColumnCount;
                return columnIndex === columnCount - fixedColumnCount ? React.createElement("div", {
                    key: rest.key,
                    style: _objectSpread2({}, rest.style, {
                        width: 20
                    })
                }) : cellRenderer(_objectSpread2({}, rest, {
                    columnIndex: columnIndex + fixedColumnCount,
                    parent: _assertThisInitialized(_this)
                }));
            }), _defineProperty(_assertThisInitialized(_this), "_columnWidthRightGrid", function(_ref4) {
                var index = _ref4.index, _this$props4 = _this.props, columnCount = _this$props4.columnCount, fixedColumnCount = _this$props4.fixedColumnCount, columnWidth = _this$props4.columnWidth, _this$state = _this.state, scrollbarSize = _this$state.scrollbarSize;
                return _this$state.showHorizontalScrollbar && index === columnCount - fixedColumnCount ? scrollbarSize : "function" == typeof columnWidth ? columnWidth({
                    index: index + fixedColumnCount
                }) : columnWidth;
            }), _defineProperty(_assertThisInitialized(_this), "_onScroll", function(scrollInfo) {
                var scrollLeft = scrollInfo.scrollLeft, scrollTop = scrollInfo.scrollTop;
                _this.setState({
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop
                });
                var onScroll = _this.props.onScroll;
                onScroll && onScroll(scrollInfo);
            }), _defineProperty(_assertThisInitialized(_this), "_onScrollbarPresenceChange", function(_ref5) {
                var horizontal = _ref5.horizontal, size = _ref5.size, vertical = _ref5.vertical, _this$state2 = _this.state, showHorizontalScrollbar = _this$state2.showHorizontalScrollbar, showVerticalScrollbar = _this$state2.showVerticalScrollbar;
                if (horizontal !== showHorizontalScrollbar || vertical !== showVerticalScrollbar) {
                    _this.setState({
                        scrollbarSize: size,
                        showHorizontalScrollbar: horizontal,
                        showVerticalScrollbar: vertical
                    });
                    var onScrollbarPresenceChange = _this.props.onScrollbarPresenceChange;
                    "function" == typeof onScrollbarPresenceChange && onScrollbarPresenceChange({
                        horizontal: horizontal,
                        size: size,
                        vertical: vertical
                    });
                }
            }), _defineProperty(_assertThisInitialized(_this), "_onScrollLeft", function(scrollInfo) {
                var scrollLeft = scrollInfo.scrollLeft;
                _this._onScroll({
                    scrollLeft: scrollLeft,
                    scrollTop: _this.state.scrollTop
                });
            }), _defineProperty(_assertThisInitialized(_this), "_onScrollTop", function(scrollInfo) {
                var scrollTop = scrollInfo.scrollTop;
                _this._onScroll({
                    scrollTop: scrollTop,
                    scrollLeft: _this.state.scrollLeft
                });
            }), _defineProperty(_assertThisInitialized(_this), "_rowHeightBottomGrid", function(_ref6) {
                var index = _ref6.index, _this$props5 = _this.props, fixedRowCount = _this$props5.fixedRowCount, rowCount = _this$props5.rowCount, rowHeight = _this$props5.rowHeight, _this$state3 = _this.state, scrollbarSize = _this$state3.scrollbarSize;
                return _this$state3.showVerticalScrollbar && index === rowCount - fixedRowCount ? scrollbarSize : "function" == typeof rowHeight ? rowHeight({
                    index: index + fixedRowCount
                }) : rowHeight;
            }), _defineProperty(_assertThisInitialized(_this), "_topLeftGridRef", function(ref) {
                _this._topLeftGrid = ref;
            }), _defineProperty(_assertThisInitialized(_this), "_topRightGridRef", function(ref) {
                _this._topRightGrid = ref;
            });
            var deferredMeasurementCache = props.deferredMeasurementCache, _fixedColumnCount = props.fixedColumnCount, _fixedRowCount = props.fixedRowCount;
            return _this._maybeCalculateCachedStyles(!0), deferredMeasurementCache && (_this._deferredMeasurementCacheBottomLeftGrid = 0 < _fixedRowCount ? new CellMeasurerCacheDecorator({
                cellMeasurerCache: deferredMeasurementCache,
                columnIndexOffset: 0,
                rowIndexOffset: _fixedRowCount
            }) : deferredMeasurementCache, _this._deferredMeasurementCacheBottomRightGrid = 0 < _fixedColumnCount || 0 < _fixedRowCount ? new CellMeasurerCacheDecorator({
                cellMeasurerCache: deferredMeasurementCache,
                columnIndexOffset: _fixedColumnCount,
                rowIndexOffset: _fixedRowCount
            }) : deferredMeasurementCache, _this._deferredMeasurementCacheTopRightGrid = 0 < _fixedColumnCount ? new CellMeasurerCacheDecorator({
                cellMeasurerCache: deferredMeasurementCache,
                columnIndexOffset: _fixedColumnCount,
                rowIndexOffset: 0
            }) : deferredMeasurementCache), _this;
        }
        return _inherits(MultiGrid, React.PureComponent), _createClass(MultiGrid, [ {
            key: "forceUpdateGrids",
            value: function() {
                this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate(), this._bottomRightGrid && this._bottomRightGrid.forceUpdate(), 
                this._topLeftGrid && this._topLeftGrid.forceUpdate(), this._topRightGrid && this._topRightGrid.forceUpdate();
            }
        }, {
            key: "invalidateCellSizeAfterRender",
            value: function(argument_0) {
                var _ref7 = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref7$columnIndex = _ref7.columnIndex, columnIndex = void 0 === _ref7$columnIndex ? 0 : _ref7$columnIndex, _ref7$rowIndex = _ref7.rowIndex, rowIndex = void 0 === _ref7$rowIndex ? 0 : _ref7$rowIndex;
                this._deferredInvalidateColumnIndex = "number" == typeof this._deferredInvalidateColumnIndex ? Math.min(this._deferredInvalidateColumnIndex, columnIndex) : columnIndex, 
                this._deferredInvalidateRowIndex = "number" == typeof this._deferredInvalidateRowIndex ? Math.min(this._deferredInvalidateRowIndex, rowIndex) : rowIndex;
            }
        }, {
            key: "measureAllCells",
            value: function() {
                this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells(), this._bottomRightGrid && this._bottomRightGrid.measureAllCells(), 
                this._topLeftGrid && this._topLeftGrid.measureAllCells(), this._topRightGrid && this._topRightGrid.measureAllCells();
            }
        }, {
            key: "recomputeGridSize",
            value: function(argument_0) {
                var _ref8 = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref8$columnIndex = _ref8.columnIndex, columnIndex = void 0 === _ref8$columnIndex ? 0 : _ref8$columnIndex, _ref8$rowIndex = _ref8.rowIndex, rowIndex = void 0 === _ref8$rowIndex ? 0 : _ref8$rowIndex, _this$props6 = this.props, fixedColumnCount = _this$props6.fixedColumnCount, fixedRowCount = _this$props6.fixedRowCount, adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount), adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount);
                this._bottomLeftGrid && this._bottomLeftGrid.recomputeGridSize({
                    columnIndex: columnIndex,
                    rowIndex: adjustedRowIndex
                }), this._bottomRightGrid && this._bottomRightGrid.recomputeGridSize({
                    columnIndex: adjustedColumnIndex,
                    rowIndex: adjustedRowIndex
                }), this._topLeftGrid && this._topLeftGrid.recomputeGridSize({
                    columnIndex: columnIndex,
                    rowIndex: rowIndex
                }), this._topRightGrid && this._topRightGrid.recomputeGridSize({
                    columnIndex: adjustedColumnIndex,
                    rowIndex: rowIndex
                }), this._leftGridWidth = null, this._topGridHeight = null, this._maybeCalculateCachedStyles(!0);
            }
        }, {
            key: "componentDidMount",
            value: function() {
                var _this$props7 = this.props, scrollLeft = _this$props7.scrollLeft, scrollTop = _this$props7.scrollTop;
                if (0 < scrollLeft || 0 < scrollTop) {
                    var newState = {};
                    0 < scrollLeft && (newState.scrollLeft = scrollLeft), 0 < scrollTop && (newState.scrollTop = scrollTop), 
                    this.setState(newState);
                }
                this._handleInvalidatedGridSize();
            }
        }, {
            key: "componentDidUpdate",
            value: function() {
                this._handleInvalidatedGridSize();
            }
        }, {
            key: "render",
            value: function() {
                var _this$props8 = this.props, onScroll = _this$props8.onScroll, onSectionRendered = _this$props8.onSectionRendered, scrollToColumn = (_this$props8.onScrollbarPresenceChange, 
                _this$props8.scrollLeft, _this$props8.scrollToColumn), scrollToRow = (_this$props8.scrollTop, 
                _this$props8.scrollToRow), rest = _objectWithoutProperties(_this$props8, [ "onScroll", "onSectionRendered", "onScrollbarPresenceChange", "scrollLeft", "scrollToColumn", "scrollTop", "scrollToRow" ]);
                if (this._prepareForRender(), 0 === this.props.width || 0 === this.props.height) return null;
                var _this$state4 = this.state, scrollLeft = _this$state4.scrollLeft, scrollTop = _this$state4.scrollTop;
                return React.createElement("div", {
                    style: this._containerOuterStyle
                }, React.createElement("div", {
                    style: this._containerTopStyle
                }, this._renderTopLeftGrid(rest), this._renderTopRightGrid(_objectSpread2({}, rest, {
                    onScroll: onScroll,
                    scrollLeft: scrollLeft
                }))), React.createElement("div", {
                    style: this._containerBottomStyle
                }, this._renderBottomLeftGrid(_objectSpread2({}, rest, {
                    onScroll: onScroll,
                    scrollTop: scrollTop
                })), this._renderBottomRightGrid(_objectSpread2({}, rest, {
                    onScroll: onScroll,
                    onSectionRendered: onSectionRendered,
                    scrollLeft: scrollLeft,
                    scrollToColumn: scrollToColumn,
                    scrollToRow: scrollToRow,
                    scrollTop: scrollTop
                }))));
            }
        }, {
            key: "_getBottomGridHeight",
            value: function(props) {
                return props.height - this._getTopGridHeight(props);
            }
        }, {
            key: "_getLeftGridWidth",
            value: function(props) {
                var fixedColumnCount = props.fixedColumnCount, columnWidth = props.columnWidth;
                if (null == this._leftGridWidth) if ("function" == typeof columnWidth) {
                    for (var leftGridWidth = 0, index = 0; index < fixedColumnCount; index++) leftGridWidth += columnWidth({
                        index: index
                    });
                    this._leftGridWidth = leftGridWidth;
                } else this._leftGridWidth = columnWidth * fixedColumnCount;
                return this._leftGridWidth;
            }
        }, {
            key: "_getRightGridWidth",
            value: function(props) {
                return props.width - this._getLeftGridWidth(props);
            }
        }, {
            key: "_getTopGridHeight",
            value: function(props) {
                var fixedRowCount = props.fixedRowCount, rowHeight = props.rowHeight;
                if (null == this._topGridHeight) if ("function" == typeof rowHeight) {
                    for (var topGridHeight = 0, index = 0; index < fixedRowCount; index++) topGridHeight += rowHeight({
                        index: index
                    });
                    this._topGridHeight = topGridHeight;
                } else this._topGridHeight = rowHeight * fixedRowCount;
                return this._topGridHeight;
            }
        }, {
            key: "_handleInvalidatedGridSize",
            value: function() {
                if ("number" == typeof this._deferredInvalidateColumnIndex) {
                    var columnIndex = this._deferredInvalidateColumnIndex, rowIndex = this._deferredInvalidateRowIndex;
                    this._deferredInvalidateColumnIndex = null, this._deferredInvalidateRowIndex = null, 
                    this.recomputeGridSize({
                        columnIndex: columnIndex,
                        rowIndex: rowIndex
                    }), this.forceUpdate();
                }
            }
        }, {
            key: "_maybeCalculateCachedStyles",
            value: function(resetAll) {
                var _this$props9 = this.props, columnWidth = _this$props9.columnWidth, enableFixedColumnScroll = _this$props9.enableFixedColumnScroll, enableFixedRowScroll = _this$props9.enableFixedRowScroll, height = _this$props9.height, fixedColumnCount = _this$props9.fixedColumnCount, fixedRowCount = _this$props9.fixedRowCount, rowHeight = _this$props9.rowHeight, style = _this$props9.style, styleBottomLeftGrid = _this$props9.styleBottomLeftGrid, styleBottomRightGrid = _this$props9.styleBottomRightGrid, styleTopLeftGrid = _this$props9.styleTopLeftGrid, styleTopRightGrid = _this$props9.styleTopRightGrid, width = _this$props9.width, sizeChange = resetAll || height !== this._lastRenderedHeight || width !== this._lastRenderedWidth, leftSizeChange = resetAll || columnWidth !== this._lastRenderedColumnWidth || fixedColumnCount !== this._lastRenderedFixedColumnCount, topSizeChange = resetAll || fixedRowCount !== this._lastRenderedFixedRowCount || rowHeight !== this._lastRenderedRowHeight;
                (resetAll || sizeChange || style !== this._lastRenderedStyle) && (this._containerOuterStyle = _objectSpread2({
                    height: height,
                    overflow: "visible",
                    width: width
                }, style)), (resetAll || sizeChange || topSizeChange) && (this._containerTopStyle = {
                    height: this._getTopGridHeight(this.props),
                    position: "relative",
                    width: width
                }, this._containerBottomStyle = {
                    height: height - this._getTopGridHeight(this.props),
                    overflow: "visible",
                    position: "relative",
                    width: width
                }), !resetAll && styleBottomLeftGrid === this._lastRenderedStyleBottomLeftGrid || (this._bottomLeftGridStyle = _objectSpread2({
                    left: 0,
                    overflowX: "hidden",
                    overflowY: enableFixedColumnScroll ? "auto" : "hidden",
                    position: "absolute"
                }, styleBottomLeftGrid)), (resetAll || leftSizeChange || styleBottomRightGrid !== this._lastRenderedStyleBottomRightGrid) && (this._bottomRightGridStyle = _objectSpread2({
                    left: this._getLeftGridWidth(this.props),
                    position: "absolute"
                }, styleBottomRightGrid)), !resetAll && styleTopLeftGrid === this._lastRenderedStyleTopLeftGrid || (this._topLeftGridStyle = _objectSpread2({
                    left: 0,
                    overflowX: "hidden",
                    overflowY: "hidden",
                    position: "absolute",
                    top: 0
                }, styleTopLeftGrid)), (resetAll || leftSizeChange || styleTopRightGrid !== this._lastRenderedStyleTopRightGrid) && (this._topRightGridStyle = _objectSpread2({
                    left: this._getLeftGridWidth(this.props),
                    overflowX: enableFixedRowScroll ? "auto" : "hidden",
                    overflowY: "hidden",
                    position: "absolute",
                    top: 0
                }, styleTopRightGrid)), this._lastRenderedColumnWidth = columnWidth, this._lastRenderedFixedColumnCount = fixedColumnCount, 
                this._lastRenderedFixedRowCount = fixedRowCount, this._lastRenderedHeight = height, 
                this._lastRenderedRowHeight = rowHeight, this._lastRenderedStyle = style, this._lastRenderedStyleBottomLeftGrid = styleBottomLeftGrid, 
                this._lastRenderedStyleBottomRightGrid = styleBottomRightGrid, this._lastRenderedStyleTopLeftGrid = styleTopLeftGrid, 
                this._lastRenderedStyleTopRightGrid = styleTopRightGrid, this._lastRenderedWidth = width;
            }
        }, {
            key: "_prepareForRender",
            value: function() {
                this._lastRenderedColumnWidth === this.props.columnWidth && this._lastRenderedFixedColumnCount === this.props.fixedColumnCount || (this._leftGridWidth = null), 
                this._lastRenderedFixedRowCount === this.props.fixedRowCount && this._lastRenderedRowHeight === this.props.rowHeight || (this._topGridHeight = null), 
                this._maybeCalculateCachedStyles(), this._lastRenderedColumnWidth = this.props.columnWidth, 
                this._lastRenderedFixedColumnCount = this.props.fixedColumnCount, this._lastRenderedFixedRowCount = this.props.fixedRowCount, 
                this._lastRenderedRowHeight = this.props.rowHeight;
            }
        }, {
            key: "_renderBottomLeftGrid",
            value: function(props) {
                var enableFixedColumnScroll = props.enableFixedColumnScroll, fixedColumnCount = props.fixedColumnCount, fixedRowCount = props.fixedRowCount, rowCount = props.rowCount, hideBottomLeftGridScrollbar = props.hideBottomLeftGridScrollbar, showVerticalScrollbar = this.state.showVerticalScrollbar;
                if (!fixedColumnCount) return null;
                var additionalRowCount = showVerticalScrollbar ? 1 : 0, height = this._getBottomGridHeight(props), width = this._getLeftGridWidth(props), scrollbarSize = this.state.showVerticalScrollbar ? this.state.scrollbarSize : 0, gridWidth = hideBottomLeftGridScrollbar ? width + scrollbarSize : width, bottomLeftGrid = React.createElement(Grid, _extends({}, props, {
                    cellRenderer: this._cellRendererBottomLeftGrid,
                    className: this.props.classNameBottomLeftGrid,
                    columnCount: fixedColumnCount,
                    deferredMeasurementCache: this._deferredMeasurementCacheBottomLeftGrid,
                    height: height,
                    onScroll: enableFixedColumnScroll ? this._onScrollTop : void 0,
                    ref: this._bottomLeftGridRef,
                    rowCount: Math.max(0, rowCount - fixedRowCount) + additionalRowCount,
                    rowHeight: this._rowHeightBottomGrid,
                    style: this._bottomLeftGridStyle,
                    tabIndex: null,
                    width: gridWidth
                }));
                return hideBottomLeftGridScrollbar ? React.createElement("div", {
                    className: "BottomLeftGrid_ScrollWrapper",
                    style: _objectSpread2({}, this._bottomLeftGridStyle, {
                        height: height,
                        width: width,
                        overflowY: "hidden"
                    })
                }, bottomLeftGrid) : bottomLeftGrid;
            }
        }, {
            key: "_renderBottomRightGrid",
            value: function(props) {
                var columnCount = props.columnCount, fixedColumnCount = props.fixedColumnCount, fixedRowCount = props.fixedRowCount, rowCount = props.rowCount, scrollToColumn = props.scrollToColumn, scrollToRow = props.scrollToRow;
                return React.createElement(Grid, _extends({}, props, {
                    cellRenderer: this._cellRendererBottomRightGrid,
                    className: this.props.classNameBottomRightGrid,
                    columnCount: Math.max(0, columnCount - fixedColumnCount),
                    columnWidth: this._columnWidthRightGrid,
                    deferredMeasurementCache: this._deferredMeasurementCacheBottomRightGrid,
                    height: this._getBottomGridHeight(props),
                    onScroll: this._onScroll,
                    onScrollbarPresenceChange: this._onScrollbarPresenceChange,
                    ref: this._bottomRightGridRef,
                    rowCount: Math.max(0, rowCount - fixedRowCount),
                    rowHeight: this._rowHeightBottomGrid,
                    scrollToColumn: scrollToColumn - fixedColumnCount,
                    scrollToRow: scrollToRow - fixedRowCount,
                    style: this._bottomRightGridStyle,
                    width: this._getRightGridWidth(props)
                }));
            }
        }, {
            key: "_renderTopLeftGrid",
            value: function(props) {
                var fixedColumnCount = props.fixedColumnCount, fixedRowCount = props.fixedRowCount;
                return fixedColumnCount && fixedRowCount ? React.createElement(Grid, _extends({}, props, {
                    className: this.props.classNameTopLeftGrid,
                    columnCount: fixedColumnCount,
                    height: this._getTopGridHeight(props),
                    ref: this._topLeftGridRef,
                    rowCount: fixedRowCount,
                    style: this._topLeftGridStyle,
                    tabIndex: null,
                    width: this._getLeftGridWidth(props)
                })) : null;
            }
        }, {
            key: "_renderTopRightGrid",
            value: function(props) {
                var columnCount = props.columnCount, enableFixedRowScroll = props.enableFixedRowScroll, fixedColumnCount = props.fixedColumnCount, fixedRowCount = props.fixedRowCount, scrollLeft = props.scrollLeft, hideTopRightGridScrollbar = props.hideTopRightGridScrollbar, _this$state5 = this.state, showHorizontalScrollbar = _this$state5.showHorizontalScrollbar, scrollbarSize = _this$state5.scrollbarSize;
                if (!fixedRowCount) return null;
                var additionalColumnCount = showHorizontalScrollbar ? 1 : 0, height = this._getTopGridHeight(props), width = this._getRightGridWidth(props), additionalHeight = showHorizontalScrollbar ? scrollbarSize : 0, gridHeight = height, style = this._topRightGridStyle;
                hideTopRightGridScrollbar && (gridHeight = height + additionalHeight, style = _objectSpread2({}, this._topRightGridStyle, {
                    left: 0
                }));
                var topRightGrid = React.createElement(Grid, _extends({}, props, {
                    cellRenderer: this._cellRendererTopRightGrid,
                    className: this.props.classNameTopRightGrid,
                    columnCount: Math.max(0, columnCount - fixedColumnCount) + additionalColumnCount,
                    columnWidth: this._columnWidthRightGrid,
                    deferredMeasurementCache: this._deferredMeasurementCacheTopRightGrid,
                    height: gridHeight,
                    onScroll: enableFixedRowScroll ? this._onScrollLeft : void 0,
                    ref: this._topRightGridRef,
                    rowCount: fixedRowCount,
                    scrollLeft: scrollLeft,
                    style: style,
                    tabIndex: null,
                    width: width
                }));
                return hideTopRightGridScrollbar ? React.createElement("div", {
                    className: "TopRightGrid_ScrollWrapper",
                    style: _objectSpread2({}, this._topRightGridStyle, {
                        height: height,
                        width: width,
                        overflowX: "hidden"
                    })
                }, topRightGrid) : topRightGrid;
            }
        } ], [ {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                return nextProps.scrollLeft !== prevState.scrollLeft || nextProps.scrollTop !== prevState.scrollTop ? {
                    scrollLeft: null != nextProps.scrollLeft && 0 <= nextProps.scrollLeft ? nextProps.scrollLeft : prevState.scrollLeft,
                    scrollTop: null != nextProps.scrollTop && 0 <= nextProps.scrollTop ? nextProps.scrollTop : prevState.scrollTop
                } : null;
            }
        } ]), MultiGrid;
    }();
    _defineProperty(MultiGrid, "propTypes", {
        classNameBottomLeftGrid: propTypes.string.isRequired,
        classNameBottomRightGrid: propTypes.string.isRequired,
        classNameTopLeftGrid: propTypes.string.isRequired,
        classNameTopRightGrid: propTypes.string.isRequired,
        enableFixedColumnScroll: propTypes.bool.isRequired,
        enableFixedRowScroll: propTypes.bool.isRequired,
        fixedColumnCount: propTypes.number.isRequired,
        fixedRowCount: propTypes.number.isRequired,
        onScrollbarPresenceChange: propTypes.func,
        style: propTypes.object.isRequired,
        styleBottomLeftGrid: propTypes.object.isRequired,
        styleBottomRightGrid: propTypes.object.isRequired,
        styleTopLeftGrid: propTypes.object.isRequired,
        styleTopRightGrid: propTypes.object.isRequired,
        hideTopRightGridScrollbar: propTypes.bool,
        hideBottomLeftGridScrollbar: propTypes.bool
    }), _defineProperty(MultiGrid, "defaultProps", {
        classNameBottomLeftGrid: "",
        classNameBottomRightGrid: "",
        classNameTopLeftGrid: "",
        classNameTopRightGrid: "",
        enableFixedColumnScroll: !1,
        enableFixedRowScroll: !1,
        fixedColumnCount: 0,
        fixedRowCount: 0,
        scrollToColumn: -1,
        scrollToRow: -1,
        style: {},
        styleBottomLeftGrid: {},
        styleBottomRightGrid: {},
        styleTopLeftGrid: {},
        styleTopRightGrid: {},
        hideTopRightGridScrollbar: !1,
        hideBottomLeftGridScrollbar: !1
    }), polyfill(MultiGrid);
    var ScrollSync = function() {
        function ScrollSync(props, context) {
            var _this;
            return _classCallCheck(this, ScrollSync), (_this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollSync).call(this, props, context))).state = {
                clientHeight: 0,
                clientWidth: 0,
                scrollHeight: 0,
                scrollLeft: 0,
                scrollTop: 0,
                scrollWidth: 0
            }, _this._onScroll = _this._onScroll.bind(_assertThisInitialized(_this)), _this;
        }
        return _inherits(ScrollSync, React.PureComponent), _createClass(ScrollSync, [ {
            key: "render",
            value: function() {
                var children = this.props.children, _this$state = this.state, clientHeight = _this$state.clientHeight, clientWidth = _this$state.clientWidth, scrollHeight = _this$state.scrollHeight, scrollLeft = _this$state.scrollLeft, scrollTop = _this$state.scrollTop, scrollWidth = _this$state.scrollWidth;
                return children({
                    clientHeight: clientHeight,
                    clientWidth: clientWidth,
                    onScroll: this._onScroll,
                    scrollHeight: scrollHeight,
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop,
                    scrollWidth: scrollWidth
                });
            }
        }, {
            key: "_onScroll",
            value: function(_ref) {
                var clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth, scrollHeight = _ref.scrollHeight, scrollLeft = _ref.scrollLeft, scrollTop = _ref.scrollTop, scrollWidth = _ref.scrollWidth;
                this.setState({
                    clientHeight: clientHeight,
                    clientWidth: clientWidth,
                    scrollHeight: scrollHeight,
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop,
                    scrollWidth: scrollWidth
                });
            }
        } ]), ScrollSync;
    }();
    function defaultCellDataGetter(_ref) {
        var dataKey = _ref.dataKey, rowData = _ref.rowData;
        return "function" == typeof rowData.get ? rowData.get(dataKey) : rowData[dataKey];
    }
    function defaultCellRenderer(_ref) {
        var cellData = _ref.cellData;
        return null == cellData ? "" : String(cellData);
    }
    function defaultHeaderRowRenderer(_ref) {
        var className = _ref.className, columns = _ref.columns, style = _ref.style;
        return React.createElement("div", {
            className: className,
            role: "row",
            style: style
        }, columns);
    }
    function defaultFooterRowRenderer(_ref) {
        var className = _ref.className, columns = _ref.columns, style = _ref.style;
        return React.createElement("div", {
            className: className,
            role: "row",
            style: style
        }, columns);
    }
    _defineProperty(ScrollSync, "propTypes", {
        children: propTypes.func.isRequired
    });
    var SortDirection = {
        ASC: "ASC",
        DESC: "DESC"
    };
    function SortIndicator(_ref) {
        var sortDirection = _ref.sortDirection, classNames = clsx("ReactVirtualized__Table__sortableHeaderIcon", {
            "ReactVirtualized__Table__sortableHeaderIcon--ASC": sortDirection === SortDirection.ASC,
            "ReactVirtualized__Table__sortableHeaderIcon--DESC": sortDirection === SortDirection.DESC
        });
        return React.createElement("svg", {
            className: classNames,
            width: 18,
            height: 18,
            viewBox: "0 0 24 24"
        }, sortDirection === SortDirection.ASC ? React.createElement("path", {
            d: "M7 14l5-5 5 5z"
        }) : React.createElement("path", {
            d: "M7 10l5 5 5-5z"
        }), React.createElement("path", {
            d: "M0 0h24v24H0z",
            fill: "none"
        }));
    }
    function defaultHeaderRenderer(_ref) {
        var dataKey = _ref.dataKey, label = _ref.label, sortBy = _ref.sortBy, sortDirection = _ref.sortDirection, showSortIndicator = sortBy === dataKey, children = [ React.createElement("span", {
            className: "ReactVirtualized__Table__headerTruncatedText",
            key: "label",
            title: "string" == typeof label ? label : null
        }, label) ];
        return showSortIndicator && children.push(React.createElement(SortIndicator, {
            key: "SortIndicator",
            sortDirection: sortDirection
        })), children;
    }
    function defaultRowRenderer(_ref) {
        var className = _ref.className, columns = _ref.columns, index = _ref.index, key = _ref.key, onRowClick = _ref.onRowClick, onRowDoubleClick = _ref.onRowDoubleClick, onRowMouseOut = _ref.onRowMouseOut, onRowMouseOver = _ref.onRowMouseOver, onRowRightClick = _ref.onRowRightClick, rowData = _ref.rowData, style = _ref.style, a11yProps = {
            "aria-rowindex": index + 1
        };
        return (onRowClick || onRowDoubleClick || onRowMouseOut || onRowMouseOver || onRowRightClick) && (a11yProps["aria-label"] = "row", 
        a11yProps.tabIndex = 0, onRowClick && (a11yProps.onClick = function(event) {
            return onRowClick({
                event: event,
                index: index,
                rowData: rowData
            });
        }), onRowDoubleClick && (a11yProps.onDoubleClick = function(event) {
            return onRowDoubleClick({
                event: event,
                index: index,
                rowData: rowData
            });
        }), onRowMouseOut && (a11yProps.onMouseOut = function(event) {
            return onRowMouseOut({
                event: event,
                index: index,
                rowData: rowData
            });
        }), onRowMouseOver && (a11yProps.onMouseOver = function(event) {
            return onRowMouseOver({
                event: event,
                index: index,
                rowData: rowData
            });
        }), onRowRightClick && (a11yProps.onContextMenu = function(event) {
            return onRowRightClick({
                event: event,
                index: index,
                rowData: rowData
            });
        })), React.createElement("div", _extends({}, a11yProps, {
            className: className,
            key: key,
            role: "row",
            style: style
        }), columns);
    }
    SortIndicator.propTypes = {
        sortDirection: propTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ])
    };
    var Column = function() {
        function Column() {
            return _classCallCheck(this, Column), _possibleConstructorReturn(this, _getPrototypeOf(Column).apply(this, arguments));
        }
        return _inherits(Column, React.Component), Column;
    }();
    _defineProperty(Column, "propTypes", {
        "aria-label": propTypes.string,
        cellDataGetter: propTypes.func,
        cellRenderer: propTypes.func,
        className: propTypes.string,
        columnData: propTypes.object,
        dataKey: propTypes.any.isRequired,
        defaultSortDirection: propTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ]),
        disableSort: propTypes.bool,
        flexGrow: propTypes.number,
        flexShrink: propTypes.number,
        headerClassName: propTypes.string,
        headerRenderer: propTypes.func.isRequired,
        headerStyle: propTypes.object,
        footerClassName: propTypes.string,
        footerRenderer: propTypes.func.isRequired,
        footerStyle: propTypes.object,
        id: propTypes.string,
        label: propTypes.node,
        maxWidth: propTypes.number,
        minWidth: propTypes.number,
        style: propTypes.object,
        width: propTypes.number.isRequired
    }), _defineProperty(Column, "defaultProps", {
        cellDataGetter: defaultCellDataGetter,
        cellRenderer: defaultCellRenderer,
        defaultSortDirection: SortDirection.ASC,
        flexGrow: 0,
        flexShrink: 1,
        headerRenderer: defaultHeaderRenderer,
        footerRenderer: function(_ref) {
            var label = _ref.label;
            return [ React.createElement("span", {
                className: "ReactVirtualized__Table__footerTruncatedText",
                key: "label",
                title: "string" == typeof label ? label : null
            }, label) ];
        },
        style: {}
    });
    var Table = function() {
        function Table(props) {
            var _this;
            return _classCallCheck(this, Table), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this, props))).state = {
                scrollbarWidth: 0
            }, _this._createColumn = _this._createColumn.bind(_assertThisInitialized(_this)), 
            _this._createRow = _this._createRow.bind(_assertThisInitialized(_this)), _this._onScroll = _this._onScroll.bind(_assertThisInitialized(_this)), 
            _this._onSectionRendered = _this._onSectionRendered.bind(_assertThisInitialized(_this)), 
            _this._setRef = _this._setRef.bind(_assertThisInitialized(_this)), _this;
        }
        return _inherits(Table, React.PureComponent), _createClass(Table, [ {
            key: "forceUpdateGrid",
            value: function() {
                this.Grid && this.Grid.forceUpdate();
            }
        }, {
            key: "getOffsetForRow",
            value: function(_ref) {
                var alignment = _ref.alignment, index = _ref.index;
                return this.Grid ? this.Grid.getOffsetForCell({
                    alignment: alignment,
                    rowIndex: index
                }).scrollTop : 0;
            }
        }, {
            key: "invalidateCellSizeAfterRender",
            value: function(_ref2) {
                var columnIndex = _ref2.columnIndex, rowIndex = _ref2.rowIndex;
                this.Grid && this.Grid.invalidateCellSizeAfterRender({
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                });
            }
        }, {
            key: "measureAllRows",
            value: function() {
                this.Grid && this.Grid.measureAllCells();
            }
        }, {
            key: "recomputeGridSize",
            value: function(argument_0) {
                var _ref3 = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : {}, _ref3$columnIndex = _ref3.columnIndex, columnIndex = void 0 === _ref3$columnIndex ? 0 : _ref3$columnIndex, _ref3$rowIndex = _ref3.rowIndex, rowIndex = void 0 === _ref3$rowIndex ? 0 : _ref3$rowIndex;
                this.Grid && this.Grid.recomputeGridSize({
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                });
            }
        }, {
            key: "recomputeRowHeights",
            value: function(argument_0) {
                var index = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.recomputeGridSize({
                    rowIndex: index
                });
            }
        }, {
            key: "scrollToPosition",
            value: function(argument_0) {
                var scrollTop = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.scrollToPosition({
                    scrollTop: scrollTop
                });
            }
        }, {
            key: "scrollToRow",
            value: function(argument_0) {
                var index = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : 0;
                this.Grid && this.Grid.scrollToCell({
                    columnIndex: 0,
                    rowIndex: index
                });
            }
        }, {
            key: "getScrollbarWidth",
            value: function() {
                if (this.Grid) {
                    var _Grid = ReactDOM.findDOMNode(this.Grid), clientWidth = _Grid.clientWidth || 0;
                    return (_Grid.offsetWidth || 0) - clientWidth;
                }
                return 0;
            }
        }, {
            key: "componentDidMount",
            value: function() {
                this._setScrollbarWidth();
            }
        }, {
            key: "componentDidUpdate",
            value: function() {
                this._setScrollbarWidth();
            }
        }, {
            key: "render",
            value: function() {
                var _this2 = this, _this$props = this.props, children = _this$props.children, className = _this$props.className, disableHeader = _this$props.disableHeader, enableFooter = _this$props.enableFooter, gridClassName = _this$props.gridClassName, gridStyle = _this$props.gridStyle, headerHeight = _this$props.headerHeight, headerRowRenderer = _this$props.headerRowRenderer, footerHeight = _this$props.footerHeight, footerRowRenderer = _this$props.footerRowRenderer, height = _this$props.height, id = _this$props.id, noRowsRenderer = _this$props.noRowsRenderer, rowClassName = _this$props.rowClassName, rowStyle = _this$props.rowStyle, scrollToIndex = _this$props.scrollToIndex, style = _this$props.style, width = _this$props.width, scrollbarWidth = this.state.scrollbarWidth, availableRowsHeight = disableHeader ? height : height - headerHeight, rowClass = "function" == typeof rowClassName ? rowClassName({
                    index: -1
                }) : rowClassName, rowStyleObject = "function" == typeof rowStyle ? rowStyle({
                    index: -1
                }) : rowStyle;
                return this._cachedColumnStyles = [], React.Children.toArray(children).forEach(function(column, index) {
                    var flexStyles = _this2._getFlexStyleForColumn(column, column.props.style);
                    _this2._cachedColumnStyles[index] = _objectSpread2({
                        overflow: "hidden"
                    }, flexStyles);
                }), React.createElement("div", {
                    "aria-label": this.props["aria-label"],
                    "aria-labelledby": this.props["aria-labelledby"],
                    "aria-colcount": React.Children.toArray(children).length,
                    "aria-rowcount": this.props.rowCount,
                    className: clsx("ReactVirtualized__Table", className),
                    id: id,
                    role: "grid",
                    style: style
                }, !disableHeader && headerRowRenderer({
                    className: clsx("ReactVirtualized__Table__headerRow", rowClass),
                    columns: this._getHeaderColumns(),
                    style: _objectSpread2({
                        height: headerHeight,
                        overflow: "hidden",
                        paddingRight: scrollbarWidth,
                        width: width
                    }, rowStyleObject)
                }), React.createElement(Grid, _extends({}, this.props, {
                    "aria-readonly": null,
                    autoContainerWidth: !0,
                    className: clsx("ReactVirtualized__Table__Grid", gridClassName),
                    cellRenderer: this._createRow,
                    columnWidth: width,
                    columnCount: 1,
                    height: availableRowsHeight,
                    id: void 0,
                    noContentRenderer: noRowsRenderer,
                    onScroll: this._onScroll,
                    onSectionRendered: this._onSectionRendered,
                    ref: this._setRef,
                    role: "rowgroup",
                    scrollbarWidth: scrollbarWidth,
                    scrollToRow: scrollToIndex,
                    style: _objectSpread2({}, gridStyle, {
                        overflowX: "hidden"
                    })
                })), enableFooter && footerRowRenderer({
                    className: clsx("ReactVirtualized__Table__footerRow", rowClass),
                    columns: this._getFooterColumns(),
                    style: _objectSpread2({
                        height: footerHeight,
                        overflow: "hidden",
                        paddingRight: scrollbarWidth,
                        width: width
                    }, rowStyleObject)
                }));
            }
        }, {
            key: "_createColumn",
            value: function(_ref4) {
                var column = _ref4.column, columnIndex = _ref4.columnIndex, isScrolling = _ref4.isScrolling, parent = _ref4.parent, rowData = _ref4.rowData, rowIndex = _ref4.rowIndex, onColumnClick = this.props.onColumnClick, _column$props = column.props, cellDataGetter = _column$props.cellDataGetter, cellRenderer = _column$props.cellRenderer, className = _column$props.className, columnData = _column$props.columnData, dataKey = _column$props.dataKey, id = _column$props.id, renderedCell = cellRenderer({
                    cellData: cellDataGetter({
                        columnData: columnData,
                        dataKey: dataKey,
                        rowData: rowData
                    }),
                    columnData: columnData,
                    columnIndex: columnIndex,
                    dataKey: dataKey,
                    isScrolling: isScrolling,
                    parent: parent,
                    rowData: rowData,
                    rowIndex: rowIndex
                }), style = this._cachedColumnStyles[columnIndex], title = "string" == typeof renderedCell ? renderedCell : null;
                return React.createElement("div", {
                    "aria-colindex": columnIndex + 1,
                    "aria-describedby": id,
                    className: clsx("ReactVirtualized__Table__rowColumn", className),
                    key: "Row" + rowIndex + "-Col" + columnIndex,
                    onClick: function(event) {
                        onColumnClick && onColumnClick({
                            columnData: columnData,
                            dataKey: dataKey,
                            event: event
                        });
                    },
                    role: "gridcell",
                    style: style,
                    title: title
                }, renderedCell);
            }
        }, {
            key: "_createHeader",
            value: function(_ref5) {
                var headerOnClick, headerOnKeyDown, headerTabIndex, headerAriaSort, headerAriaLabel, column = _ref5.column, index = _ref5.index, _this$props2 = this.props, headerClassName = _this$props2.headerClassName, headerStyle = _this$props2.headerStyle, onHeaderClick = _this$props2.onHeaderClick, sort = _this$props2.sort, sortBy = _this$props2.sortBy, sortDirection = _this$props2.sortDirection, _column$props2 = column.props, columnData = _column$props2.columnData, dataKey = _column$props2.dataKey, defaultSortDirection = _column$props2.defaultSortDirection, disableSort = _column$props2.disableSort, headerRenderer = _column$props2.headerRenderer, id = _column$props2.id, label = _column$props2.label, sortEnabled = !disableSort && sort, classNames = clsx("ReactVirtualized__Table__headerColumn", headerClassName, column.props.headerClassName, {
                    ReactVirtualized__Table__sortableHeaderColumn: sortEnabled
                }), style = this._getFlexStyleForColumn(column, _objectSpread2({}, headerStyle, {}, column.props.headerStyle)), renderedHeader = headerRenderer({
                    columnData: columnData,
                    dataKey: dataKey,
                    disableSort: disableSort,
                    label: label,
                    sortBy: sortBy,
                    sortDirection: sortDirection
                });
                if (sortEnabled || onHeaderClick) {
                    var newSortDirection = sortBy !== dataKey ? defaultSortDirection : sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC, onClick = function(event) {
                        sortEnabled && sort({
                            defaultSortDirection: defaultSortDirection,
                            event: event,
                            sortBy: dataKey,
                            sortDirection: newSortDirection
                        }), onHeaderClick && onHeaderClick({
                            columnData: columnData,
                            dataKey: dataKey,
                            event: event
                        });
                    };
                    headerAriaLabel = column.props["aria-label"] || label || dataKey, headerAriaSort = "none", 
                    headerTabIndex = 0, headerOnClick = onClick, headerOnKeyDown = function(event) {
                        "Enter" !== event.key && " " !== event.key || onClick(event);
                    };
                }
                return sortBy === dataKey && (headerAriaSort = sortDirection === SortDirection.ASC ? "ascending" : "descending"), 
                React.createElement("div", {
                    "aria-label": headerAriaLabel,
                    "aria-sort": headerAriaSort,
                    className: classNames,
                    id: id,
                    key: "Header-Col" + index,
                    onClick: headerOnClick,
                    onKeyDown: headerOnKeyDown,
                    role: "columnheader",
                    style: style,
                    tabIndex: headerTabIndex
                }, renderedHeader);
            }
        }, {
            key: "_createFooter",
            value: function(_ref6) {
                var footerOnClick, footerOnKeyDown, footerTabIndex, footerAriaLabel, column = _ref6.column, index = _ref6.index, _this$props3 = this.props, footerClassName = _this$props3.footerClassName, footerStyle = _this$props3.footerStyle, onFooterClick = _this$props3.onFooterClick, _column$props3 = column.props, columnData = _column$props3.columnData, dataKey = _column$props3.dataKey, footerRenderer = _column$props3.footerRenderer, id = _column$props3.id, label = _column$props3.label, classNames = clsx("ReactVirtualized__Table__footerColumn", footerClassName, column.props.footerClassName), style = this._getFlexStyleForColumn(column, _objectSpread2({}, footerStyle, {}, column.props.footerStyle)), renderedFooter = footerRenderer({
                    columnData: columnData,
                    dataKey: dataKey,
                    label: label
                });
                if (onFooterClick) {
                    var onClick = function(event) {
                        onFooterClick && onFooterClick({
                            columnData: columnData,
                            dataKey: dataKey,
                            event: event
                        });
                    };
                    footerAriaLabel = column.props["aria-label"] || label || dataKey, footerTabIndex = 0, 
                    footerOnClick = onClick, footerOnKeyDown = function(event) {
                        "Enter" !== event.key && " " !== event.key || onClick(event);
                    };
                }
                return React.createElement("div", {
                    "aria-label": footerAriaLabel,
                    className: classNames,
                    id: id,
                    key: "Footer-Col" + index,
                    onClick: footerOnClick,
                    onKeyDown: footerOnKeyDown,
                    role: "columnfooter",
                    style: style,
                    tabIndex: footerTabIndex
                }, renderedFooter);
            }
        }, {
            key: "_createRow",
            value: function(_ref7) {
                var _this3 = this, index = _ref7.rowIndex, isScrolling = _ref7.isScrolling, key = _ref7.key, parent = _ref7.parent, style = _ref7.style, _this$props4 = this.props, children = _this$props4.children, onRowClick = _this$props4.onRowClick, onRowDoubleClick = _this$props4.onRowDoubleClick, onRowRightClick = _this$props4.onRowRightClick, onRowMouseOver = _this$props4.onRowMouseOver, onRowMouseOut = _this$props4.onRowMouseOut, rowClassName = _this$props4.rowClassName, rowGetter = _this$props4.rowGetter, rowRenderer = _this$props4.rowRenderer, rowStyle = _this$props4.rowStyle, scrollbarWidth = this.state.scrollbarWidth, rowClass = "function" == typeof rowClassName ? rowClassName({
                    index: index
                }) : rowClassName, rowStyleObject = "function" == typeof rowStyle ? rowStyle({
                    index: index
                }) : rowStyle, rowData = rowGetter({
                    index: index
                }), columns = React.Children.toArray(children).map(function(column, columnIndex) {
                    return _this3._createColumn({
                        column: column,
                        columnIndex: columnIndex,
                        isScrolling: isScrolling,
                        parent: parent,
                        rowData: rowData,
                        rowIndex: index,
                        scrollbarWidth: scrollbarWidth
                    });
                }), className = clsx("ReactVirtualized__Table__row", rowClass), flattenedStyle = _objectSpread2({}, style, {
                    height: this._getRowHeight(index),
                    overflow: "hidden",
                    paddingRight: scrollbarWidth
                }, rowStyleObject);
                return rowRenderer({
                    className: className,
                    columns: columns,
                    index: index,
                    isScrolling: isScrolling,
                    key: key,
                    onRowClick: onRowClick,
                    onRowDoubleClick: onRowDoubleClick,
                    onRowRightClick: onRowRightClick,
                    onRowMouseOver: onRowMouseOver,
                    onRowMouseOut: onRowMouseOut,
                    rowData: rowData,
                    style: flattenedStyle
                });
            }
        }, {
            key: "_getFlexStyleForColumn",
            value: function(column, argument_1) {
                var customStyle = 1 < arguments.length && void 0 !== argument_1 ? argument_1 : {}, flexValue = "".concat(column.props.flexGrow, " ").concat(column.props.flexShrink, " ").concat(column.props.width, "px"), style = _objectSpread2({}, customStyle, {
                    flex: flexValue,
                    msFlex: flexValue,
                    WebkitFlex: flexValue
                });
                return column.props.maxWidth && (style.maxWidth = column.props.maxWidth), column.props.minWidth && (style.minWidth = column.props.minWidth), 
                style;
            }
        }, {
            key: "_getHeaderColumns",
            value: function() {
                var _this4 = this, _this$props5 = this.props, children = _this$props5.children;
                return (_this$props5.disableHeader ? [] : React.Children.toArray(children)).map(function(column, index) {
                    return _this4._createHeader({
                        column: column,
                        index: index
                    });
                });
            }
        }, {
            key: "_getFooterColumns",
            value: function() {
                var _this5 = this, _this$props6 = this.props, children = _this$props6.children;
                return (_this$props6.enableFooter ? React.Children.toArray(children) : []).map(function(column, index) {
                    return _this5._createFooter({
                        column: column,
                        index: index
                    });
                });
            }
        }, {
            key: "_getRowHeight",
            value: function(rowIndex) {
                var rowHeight = this.props.rowHeight;
                return "function" == typeof rowHeight ? rowHeight({
                    index: rowIndex
                }) : rowHeight;
            }
        }, {
            key: "_onScroll",
            value: function(_ref8) {
                var clientHeight = _ref8.clientHeight, scrollHeight = _ref8.scrollHeight, scrollTop = _ref8.scrollTop;
                (0, this.props.onScroll)({
                    clientHeight: clientHeight,
                    scrollHeight: scrollHeight,
                    scrollTop: scrollTop
                });
            }
        }, {
            key: "_onSectionRendered",
            value: function(_ref9) {
                var rowOverscanStartIndex = _ref9.rowOverscanStartIndex, rowOverscanStopIndex = _ref9.rowOverscanStopIndex, rowStartIndex = _ref9.rowStartIndex, rowStopIndex = _ref9.rowStopIndex;
                (0, this.props.onRowsRendered)({
                    overscanStartIndex: rowOverscanStartIndex,
                    overscanStopIndex: rowOverscanStopIndex,
                    startIndex: rowStartIndex,
                    stopIndex: rowStopIndex
                });
            }
        }, {
            key: "_setRef",
            value: function(ref) {
                this.Grid = ref;
            }
        }, {
            key: "_setScrollbarWidth",
            value: function() {
                var scrollbarWidth = this.getScrollbarWidth();
                this.setState({
                    scrollbarWidth: scrollbarWidth
                });
            }
        } ]), Table;
    }();
    _defineProperty(Table, "propTypes", {
        "aria-label": propTypes.string,
        "aria-labelledby": propTypes.string,
        autoHeight: propTypes.bool,
        children: function(props) {
            for (var children = React.Children.toArray(props.children), i = 0; i < children.length; i++) {
                var childType = children[i].type;
                if (childType !== Column && !(childType.prototype instanceof Column)) return new Error("Table only accepts children of type Column");
            }
        },
        className: propTypes.string,
        disableHeader: propTypes.bool,
        enableFooter: propTypes.bool,
        estimatedRowSize: propTypes.number.isRequired,
        gridClassName: propTypes.string,
        gridStyle: propTypes.object,
        headerClassName: propTypes.string,
        headerHeight: propTypes.number.isRequired,
        headerRowRenderer: propTypes.func,
        headerStyle: propTypes.object,
        footerClassName: propTypes.string,
        footerHeight: propTypes.number.isRequired,
        footerRowRenderer: propTypes.func,
        footerStyle: propTypes.object,
        height: propTypes.number.isRequired,
        id: propTypes.string,
        noRowsRenderer: propTypes.func,
        onColumnClick: propTypes.func,
        onHeaderClick: propTypes.func,
        onFooterClick: propTypes.func,
        onRowClick: propTypes.func,
        onRowDoubleClick: propTypes.func,
        onRowMouseOut: propTypes.func,
        onRowMouseOver: propTypes.func,
        onRowRightClick: propTypes.func,
        onRowsRendered: propTypes.func,
        onScroll: propTypes.func.isRequired,
        overscanIndicesGetter: propTypes.func.isRequired,
        overscanRowCount: propTypes.number.isRequired,
        rowClassName: propTypes.oneOfType([ propTypes.string, propTypes.func ]),
        rowGetter: propTypes.func.isRequired,
        rowHeight: propTypes.oneOfType([ propTypes.number, propTypes.func ]).isRequired,
        rowCount: propTypes.number.isRequired,
        rowRenderer: propTypes.func,
        rowStyle: propTypes.oneOfType([ propTypes.object, propTypes.func ]).isRequired,
        scrollToAlignment: propTypes.oneOf([ "auto", "end", "start", "center" ]).isRequired,
        scrollToIndex: propTypes.number.isRequired,
        scrollTop: propTypes.number,
        sort: propTypes.func,
        sortBy: propTypes.string,
        sortDirection: propTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ]),
        style: propTypes.object,
        tabIndex: propTypes.number,
        width: propTypes.number.isRequired
    }), _defineProperty(Table, "defaultProps", {
        disableHeader: !1,
        enableFooter: !1,
        estimatedRowSize: 30,
        headerHeight: 0,
        headerStyle: {},
        footerHeight: 0,
        footerStyle: {},
        noRowsRenderer: function() {
            return null;
        },
        onRowsRendered: function() {
            return null;
        },
        onScroll: function() {
            return null;
        },
        overscanIndicesGetter: defaultOverscanIndicesGetter$1,
        overscanRowCount: 10,
        rowRenderer: defaultRowRenderer,
        headerRowRenderer: defaultHeaderRowRenderer,
        footerRowRenderer: defaultFooterRowRenderer,
        rowStyle: {},
        scrollToAlignment: "auto",
        scrollToIndex: -1,
        style: {}
    });
    var mountedInstances = [], originalBodyPointerEvents = null, disablePointerEventsTimeoutId = null;
    function enablePointerEventsIfDisabled() {
        disablePointerEventsTimeoutId && (disablePointerEventsTimeoutId = null, document.body && null != originalBodyPointerEvents && (document.body.style.pointerEvents = originalBodyPointerEvents), 
        originalBodyPointerEvents = null);
    }
    function enablePointerEventsAfterDelayCallback() {
        enablePointerEventsIfDisabled(), mountedInstances.forEach(function(instance) {
            return instance.__resetIsScrolling();
        });
    }
    function onScrollWindow(event) {
        event.currentTarget === window && null == originalBodyPointerEvents && document.body && (originalBodyPointerEvents = document.body.style.pointerEvents, 
        document.body.style.pointerEvents = "none"), function() {
            disablePointerEventsTimeoutId && cancelAnimationTimeout(disablePointerEventsTimeoutId);
            var maximumTimeout = 0;
            mountedInstances.forEach(function(instance) {
                maximumTimeout = Math.max(maximumTimeout, instance.props.scrollingResetTimeInterval);
            }), disablePointerEventsTimeoutId = requestAnimationTimeout(enablePointerEventsAfterDelayCallback, maximumTimeout);
        }(), mountedInstances.forEach(function(instance) {
            instance.props.scrollElement === event.currentTarget && instance.__handleWindowScrollEvent();
        });
    }
    function registerScrollListener(component, element) {
        mountedInstances.some(function(instance) {
            return instance.props.scrollElement === element;
        }) || element.addEventListener("scroll", onScrollWindow), mountedInstances.push(component);
    }
    function unregisterScrollListener(component, element) {
        (mountedInstances = mountedInstances.filter(function(instance) {
            return instance !== component;
        })).length || (element.removeEventListener("scroll", onScrollWindow), disablePointerEventsTimeoutId && (cancelAnimationTimeout(disablePointerEventsTimeoutId), 
        enablePointerEventsIfDisabled()));
    }
    var isWindow = function(element) {
        return element === window;
    }, getBoundingBox = function(element) {
        return element.getBoundingClientRect();
    };
    function getDimensions(scrollElement, props) {
        if (scrollElement) {
            if (isWindow(scrollElement)) {
                var _window = window, innerHeight = _window.innerHeight, innerWidth = _window.innerWidth;
                return {
                    height: "number" == typeof innerHeight ? innerHeight : 0,
                    width: "number" == typeof innerWidth ? innerWidth : 0
                };
            }
            return getBoundingBox(scrollElement);
        }
        return {
            height: props.serverHeight,
            width: props.serverWidth
        };
    }
    function getScrollOffset(element) {
        return isWindow(element) && document.documentElement ? {
            top: "scrollY" in window ? window.scrollY : document.documentElement.scrollTop,
            left: "scrollX" in window ? window.scrollX : document.documentElement.scrollLeft
        } : {
            top: element.scrollTop,
            left: element.scrollLeft
        };
    }
    var getWindow = function() {
        return "undefined" != typeof window ? window : void 0;
    }, WindowScroller = function() {
        function WindowScroller() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, WindowScroller);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _defineProperty(_assertThisInitialized(_this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WindowScroller)).call.apply(_getPrototypeOf2, [ this ].concat(args)))), "_window", getWindow()), 
            _defineProperty(_assertThisInitialized(_this), "_isMounted", !1), _defineProperty(_assertThisInitialized(_this), "_positionFromTop", 0), 
            _defineProperty(_assertThisInitialized(_this), "_positionFromLeft", 0), _defineProperty(_assertThisInitialized(_this), "_detectElementResize", void 0), 
            _defineProperty(_assertThisInitialized(_this), "_child", void 0), _defineProperty(_assertThisInitialized(_this), "state", _objectSpread2({}, getDimensions(_this.props.scrollElement, _this.props), {
                isScrolling: !1,
                scrollLeft: 0,
                scrollTop: 0
            })), _defineProperty(_assertThisInitialized(_this), "_registerChild", function(element) {
                !element || element instanceof Element || console.warn("WindowScroller registerChild expects to be passed Element or null"), 
                _this._child = element, _this.updatePosition();
            }), _defineProperty(_assertThisInitialized(_this), "_onChildScroll", function(_ref) {
                var scrollTop = _ref.scrollTop;
                if (_this.state.scrollTop !== scrollTop) {
                    var scrollElement = _this.props.scrollElement;
                    scrollElement && ("function" == typeof scrollElement.scrollTo ? scrollElement.scrollTo(0, scrollTop + _this._positionFromTop) : scrollElement.scrollTop = scrollTop + _this._positionFromTop);
                }
            }), _defineProperty(_assertThisInitialized(_this), "_registerResizeListener", function(element) {
                element === window ? window.addEventListener("resize", _this._onResize, !1) : _this._detectElementResize.addResizeListener(element, _this._onResize);
            }), _defineProperty(_assertThisInitialized(_this), "_unregisterResizeListener", function(element) {
                element === window ? window.removeEventListener("resize", _this._onResize, !1) : element && _this._detectElementResize.removeResizeListener(element, _this._onResize);
            }), _defineProperty(_assertThisInitialized(_this), "_onResize", function() {
                _this.updatePosition();
            }), _defineProperty(_assertThisInitialized(_this), "__handleWindowScrollEvent", function() {
                if (_this._isMounted) {
                    var onScroll = _this.props.onScroll, scrollElement = _this.props.scrollElement;
                    if (scrollElement) {
                        var scrollOffset = getScrollOffset(scrollElement), scrollLeft = Math.max(0, scrollOffset.left - _this._positionFromLeft), scrollTop = Math.max(0, scrollOffset.top - _this._positionFromTop);
                        _this.setState({
                            isScrolling: !0,
                            scrollLeft: scrollLeft,
                            scrollTop: scrollTop
                        }), onScroll({
                            scrollLeft: scrollLeft,
                            scrollTop: scrollTop
                        });
                    }
                }
            }), _defineProperty(_assertThisInitialized(_this), "__resetIsScrolling", function() {
                _this.setState({
                    isScrolling: !1
                });
            }), _this;
        }
        return _inherits(WindowScroller, React.PureComponent), _createClass(WindowScroller, [ {
            key: "updatePosition",
            value: function(argument_0) {
                var scrollElement = 0 < arguments.length && void 0 !== argument_0 ? argument_0 : this.props.scrollElement, onResize = this.props.onResize, _this$state = this.state, height = _this$state.height, width = _this$state.width, thisNode = this._child || ReactDOM.findDOMNode(this);
                if (thisNode instanceof Element && scrollElement) {
                    var offset = function(element, container) {
                        if (isWindow(container) && document.documentElement) {
                            var containerElement = document.documentElement, elementRect = getBoundingBox(element), containerRect = getBoundingBox(containerElement);
                            return {
                                top: elementRect.top - containerRect.top,
                                left: elementRect.left - containerRect.left
                            };
                        }
                        var scrollOffset = getScrollOffset(container), _elementRect = getBoundingBox(element), _containerRect = getBoundingBox(container);
                        return {
                            top: _elementRect.top + scrollOffset.top - _containerRect.top,
                            left: _elementRect.left + scrollOffset.left - _containerRect.left
                        };
                    }(thisNode, scrollElement);
                    this._positionFromTop = offset.top, this._positionFromLeft = offset.left;
                }
                var dimensions = getDimensions(scrollElement, this.props);
                height === dimensions.height && width === dimensions.width || (this.setState({
                    height: dimensions.height,
                    width: dimensions.width
                }), onResize({
                    height: dimensions.height,
                    width: dimensions.width
                })), !0 === this.props.updateScrollTopOnUpdatePosition && (this.__handleWindowScrollEvent(), 
                this.__resetIsScrolling());
            }
        }, {
            key: "componentDidMount",
            value: function() {
                var scrollElement = this.props.scrollElement;
                this._detectElementResize = createDetectElementResize(), this.updatePosition(scrollElement), 
                scrollElement && (registerScrollListener(this, scrollElement), this._registerResizeListener(scrollElement)), 
                this._isMounted = !0;
            }
        }, {
            key: "componentDidUpdate",
            value: function(prevProps) {
                var scrollElement = this.props.scrollElement, prevScrollElement = prevProps.scrollElement;
                prevScrollElement !== scrollElement && null != prevScrollElement && null != scrollElement && (this.updatePosition(scrollElement), 
                unregisterScrollListener(this, prevScrollElement), registerScrollListener(this, scrollElement), 
                this._unregisterResizeListener(prevScrollElement), this._registerResizeListener(scrollElement));
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                var scrollElement = this.props.scrollElement;
                scrollElement && (unregisterScrollListener(this, scrollElement), this._unregisterResizeListener(scrollElement)), 
                this._isMounted = !1;
            }
        }, {
            key: "render",
            value: function() {
                var children = this.props.children, _this$state2 = this.state, isScrolling = _this$state2.isScrolling, scrollTop = _this$state2.scrollTop, scrollLeft = _this$state2.scrollLeft, height = _this$state2.height, width = _this$state2.width;
                return children({
                    onChildScroll: this._onChildScroll,
                    registerChild: this._registerChild,
                    height: height,
                    isScrolling: isScrolling,
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop,
                    width: width
                });
            }
        } ]), WindowScroller;
    }();
    _defineProperty(WindowScroller, "defaultProps", {
        onResize: function() {},
        onScroll: function() {},
        scrollingResetTimeInterval: 150,
        scrollElement: getWindow(),
        serverHeight: 0,
        serverWidth: 0
    }), exports.ArrowKeyStepper = ArrowKeyStepper, exports.AutoSizer = AutoSizer, exports.CellMeasurer = CellMeasurer, 
    exports.CellMeasurerCache = CellMeasurerCache, exports.Collection = Collection, 
    exports.Column = Column, exports.ColumnSizer = ColumnSizer, exports.Grid = Grid, 
    exports.InfiniteLoader = InfiniteLoader, exports.List = List, exports.Masonry = Masonry, 
    exports.MultiGrid = MultiGrid, exports.ScrollSync = ScrollSync, exports.SortDirection = SortDirection, 
    exports.SortIndicator = SortIndicator, exports.Table = Table, exports.WindowScroller = WindowScroller, 
    exports.accessibilityOverscanIndicesGetter = defaultOverscanIndicesGetter$1, exports.createMasonryCellPositioner = function(_ref) {
        var columnHeights, cellMeasurerCache = _ref.cellMeasurerCache, columnCount = _ref.columnCount, columnWidth = _ref.columnWidth, _ref$spacer = _ref.spacer, spacer = void 0 === _ref$spacer ? 0 : _ref$spacer;
        function cellPositioner(index) {
            for (var columnIndex = 0, i = 1; i < columnHeights.length; i++) columnHeights[i] < columnHeights[columnIndex] && (columnIndex = i);
            var left = columnIndex * (columnWidth + spacer), top = columnHeights[columnIndex] || 0;
            return columnHeights[columnIndex] = top + cellMeasurerCache.getHeight(index) + spacer, 
            {
                left: left,
                top: top
            };
        }
        function initOrResetDerivedValues() {
            columnHeights = [];
            for (var i = 0; i < columnCount; i++) columnHeights[i] = 0;
        }
        return initOrResetDerivedValues(), cellPositioner.reset = function(params) {
            columnCount = params.columnCount, columnWidth = params.columnWidth, spacer = params.spacer, 
            initOrResetDerivedValues();
        }, cellPositioner;
    }, exports.createTableMultiSort = function(sortCallback) {
        var _ref = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, defaultSortBy = _ref.defaultSortBy, _ref$defaultSortDirec = _ref.defaultSortDirection, defaultSortDirection = void 0 === _ref$defaultSortDirec ? {} : _ref$defaultSortDirec;
        if (!sortCallback) throw Error('Required parameter "sortCallback" not specified');
        var sortBy = defaultSortBy || [], sortDirection = {};
        return sortBy.forEach(function(dataKey) {
            sortDirection[dataKey] = void 0 !== defaultSortDirection[dataKey] ? defaultSortDirection[dataKey] : "ASC";
        }), {
            sort: function(_ref2) {
                var defaultSortDirection = _ref2.defaultSortDirection, event = _ref2.event, dataKey = _ref2.sortBy;
                if (event.shiftKey) void 0 !== sortDirection[dataKey] ? sortDirection[dataKey] = "ASC" === sortDirection[dataKey] ? "DESC" : "ASC" : (sortDirection[dataKey] = defaultSortDirection, 
                sortBy.push(dataKey)); else if (event.ctrlKey || event.metaKey) {
                    var index = sortBy.indexOf(dataKey);
                    0 <= index && (sortBy.splice(index, 1), delete sortDirection[dataKey]);
                } else {
                    sortBy.length = 0, sortBy.push(dataKey), Object.keys(sortDirection).forEach(function(key) {
                        key !== dataKey && delete sortDirection[key];
                    }), void 0 !== sortDirection[dataKey] ? sortDirection[dataKey] = "ASC" === sortDirection[dataKey] ? "DESC" : "ASC" : sortDirection[dataKey] = defaultSortDirection;
                }
                sortCallback({
                    sortBy: sortBy,
                    sortDirection: sortDirection
                });
            },
            sortBy: sortBy,
            sortDirection: sortDirection
        };
    }, exports.defaultCellRangeRenderer = defaultCellRangeRenderer, exports.defaultOverscanIndicesGetter = defaultOverscanIndicesGetter, 
    exports.defaultTableCellDataGetter = defaultCellDataGetter, exports.defaultTableCellRenderer = defaultCellRenderer, 
    exports.defaultTableFooterRowRenderer = defaultFooterRowRenderer, exports.defaultTableHeaderRenderer = defaultHeaderRenderer, 
    exports.defaultTableHeaderRowRenderer = defaultHeaderRowRenderer, exports.defaultTableRowRenderer = defaultRowRenderer, 
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
