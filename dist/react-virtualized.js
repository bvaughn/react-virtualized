!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory(require("react")) : "function" == typeof define && define.amd ? define([ "react" ], factory) : "object" == typeof exports ? exports["react-virtualized"] = factory(require("react")) : root["react-virtualized"] = factory(root.React);
}(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
    /******/
    return function(modules) {
        /******/
        /******/
        // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/
            // Check if module is in cache
            /******/
            if (installedModules[moduleId]) /******/
            return installedModules[moduleId].exports;
            /******/
            /******/
            // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                exports: {},
                /******/
                id: moduleId,
                /******/
                loaded: !1
            };
            /******/
            /******/
            // Return the exports of the module
            /******/
            /******/
            /******/
            // Execute the module function
            /******/
            /******/
            /******/
            // Flag the module as loaded
            /******/
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.loaded = !0, module.exports;
        }
        // webpackBootstrap
        /******/
        // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/
        // Load entry module and return exports
        /******/
        /******/
        /******/
        /******/
        // expose the modules object (__webpack_modules__)
        /******/
        /******/
        /******/
        // expose the module cache
        /******/
        /******/
        /******/
        // __webpack_public_path__
        /******/
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.p = "", __webpack_require__(0);
    }([ /* 0 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _AutoSizer = __webpack_require__(1);
        Object.defineProperty(exports, "AutoSizer", {
            enumerable: !0,
            get: function() {
                return _AutoSizer.AutoSizer;
            }
        });
        var _FlexTable = __webpack_require__(8);
        Object.defineProperty(exports, "FlexTable", {
            enumerable: !0,
            get: function() {
                return _FlexTable.FlexTable;
            }
        }), Object.defineProperty(exports, "FlexColumn", {
            enumerable: !0,
            get: function() {
                return _FlexTable.FlexColumn;
            }
        }), Object.defineProperty(exports, "SortDirection", {
            enumerable: !0,
            get: function() {
                return _FlexTable.SortDirection;
            }
        }), Object.defineProperty(exports, "SortIndicator", {
            enumerable: !0,
            get: function() {
                return _FlexTable.SortIndicator;
            }
        });
        var _InfiniteLoader = __webpack_require__(19);
        Object.defineProperty(exports, "InfiniteLoader", {
            enumerable: !0,
            get: function() {
                return _InfiniteLoader.InfiniteLoader;
            }
        });
        var _VirtualScroll = __webpack_require__(11);
        Object.defineProperty(exports, "VirtualScroll", {
            enumerable: !0,
            get: function() {
                return _VirtualScroll.VirtualScroll;
            }
        });
    }, /* 1 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _AutoSizer2 = __webpack_require__(2), _AutoSizer3 = _interopRequireDefault(_AutoSizer2);
        exports["default"] = _AutoSizer3["default"];
        var _AutoSizer4 = _interopRequireDefault(_AutoSizer2);
        exports.AutoSizer = _AutoSizer4["default"];
    }, /* 2 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        function _objectWithoutProperties(obj, keys) {
            var target = {};
            for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
            return target;
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _get = function(_x, _x2, _x3) {
            for (var _again = !0; _again; ) {
                var object = _x, property = _x2, receiver = _x3;
                _again = !1, null === object && (object = Function.prototype);
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (void 0 !== desc) {
                    if ("value" in desc) return desc.value;
                    var getter = desc.get;
                    if (void 0 === getter) return;
                    return getter.call(receiver);
                }
                var parent = Object.getPrototypeOf(object);
                if (null === parent) return;
                _x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
            }
        }, _classnames = __webpack_require__(3), _classnames2 = _interopRequireDefault(_classnames), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactPureRenderFunction = __webpack_require__(5), _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction), AutoSizer = function(_Component) {
            function AutoSizer(props) {
                _classCallCheck(this, AutoSizer), _get(Object.getPrototypeOf(AutoSizer.prototype), "constructor", this).call(this, props), 
                this.shouldComponentUpdate = _reactPureRenderFunction2["default"], this.state = {
                    height: 0,
                    width: 0
                }, this._onResize = this._onResize.bind(this), this._setRef = this._setRef.bind(this);
            }
            return _inherits(AutoSizer, _Component), _createClass(AutoSizer, null, [ {
                key: "propTypes",
                value: {
                    /** Component to manage width/height of */
                    children: _react.PropTypes.element,
                    /** Optional CSS class name */
                    className: _react.PropTypes.string
                },
                enumerable: !0
            } ]), _createClass(AutoSizer, [ {
                key: "componentDidMount",
                value: function() {
                    // Defer requiring resize handler in order to support server-side rendering.
                    // See issue #41
                    this._detectElementResize = __webpack_require__(7), this._detectElementResize.addResizeListener(this._parentNode, this._onResize), 
                    this._onResize();
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
                }
            }, {
                key: "render",
                value: function() {
                    var _props = this.props, children = _props.children, className = _props.className, _state = (_objectWithoutProperties(_props, [ "children", "className" ]), 
                    this.state), height = _state.height, width = _state.width, child = _react2["default"].Children.only(children);
                    return child = _react2["default"].cloneElement(child, {
                        height: height,
                        width: width
                    }), _react2["default"].createElement("div", {
                        ref: this._setRef,
                        className: (0, _classnames2["default"])("AutoSizer", className),
                        style: {
                            width: "100%",
                            height: "100%"
                        }
                    }, child);
                }
            }, {
                key: "_onResize",
                value: function() {
                    var _parentNode$getBoundingClientRect = this._parentNode.getBoundingClientRect(), height = _parentNode$getBoundingClientRect.height, width = _parentNode$getBoundingClientRect.width;
                    this.setState({
                        height: height,
                        width: width
                    });
                }
            }, {
                key: "_setRef",
                value: function(autoSizer) {
                    // In case the component has been unmounted
                    this._parentNode = autoSizer && autoSizer.parentNode;
                }
            } ]), AutoSizer;
        }(_react.Component);
        exports["default"] = AutoSizer, module.exports = exports["default"];
    }, /* 3 */
    /***/
    function(module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        /*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
        /* global define */
        !function() {
            "use strict";
            function classNames() {
                for (var classes = [], i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    if (arg) {
                        var argType = typeof arg;
                        if ("string" === argType || "number" === argType) classes.push(arg); else if (Array.isArray(arg)) classes.push(classNames.apply(null, arg)); else if ("object" === argType) for (var key in arg) hasOwn.call(arg, key) && arg[key] && classes.push(key);
                    }
                }
                return classes.join(" ");
            }
            var hasOwn = {}.hasOwnProperty;
            "undefined" != typeof module && module.exports ? module.exports = classNames : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
            __WEBPACK_AMD_DEFINE_RESULT__ = function() {
                return classNames;
            }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), !(void 0 !== __WEBPACK_AMD_DEFINE_RESULT__ && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
        }();
    }, /* 4 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_4__;
    }, /* 5 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        function shouldPureComponentUpdate(nextProps, nextState) {
            return !(0, _shallowEqual2["default"])(this.props, nextProps) || !(0, _shallowEqual2["default"])(this.state, nextState);
        }
        exports.__esModule = !0, exports["default"] = shouldPureComponentUpdate;
        var _shallowEqual = __webpack_require__(6), _shallowEqual2 = _interopRequireDefault(_shallowEqual);
        module.exports = exports["default"];
    }, /* 6 */
    /***/
    function(module, exports) {
        "use strict";
        function shallowEqual(objA, objB) {
            if (objA === objB) return !0;
            if ("object" != typeof objA || null === objA || "object" != typeof objB || null === objB) return !1;
            var keysA = Object.keys(objA), keysB = Object.keys(objB);
            if (keysA.length !== keysB.length) return !1;
            for (var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB), i = 0; i < keysA.length; i++) if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) return !1;
            return !0;
        }
        exports.__esModule = !0, exports["default"] = shallowEqual, module.exports = exports["default"];
    }, /* 7 */
    /***/
    function(module, exports) {
        /**
	* Detect Element Resize.
	* Forked in order to guard against unsafe 'window' and 'document' references.
	*
	* https://github.com/sdecima/javascript-detect-element-resize
	* Sebastian Decima
	*
	* version: 0.5.3
	**/
        // Check `document` and `window` in case of server-side rendering
        "use strict";
        var _window;
        _window = "undefined" != typeof window ? window : "undefined" != typeof self ? self : void 0;
        var attachEvent = "undefined" != typeof document && document.attachEvent, stylesCreated = !1;
        if (!attachEvent) {
            var requestFrame = function() {
                var raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame || function(fn) {
                    return _window.setTimeout(fn, 20);
                };
                return function(fn) {
                    return raf(fn);
                };
            }(), cancelFrame = function() {
                var cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame || _window.clearTimeout;
                return function(id) {
                    return cancel(id);
                };
            }(), resetTriggers = function(element) {
                var triggers = element.__resizeTriggers__, expand = triggers.firstElementChild, contract = triggers.lastElementChild, expandChild = expand.firstElementChild;
                contract.scrollLeft = contract.scrollWidth, contract.scrollTop = contract.scrollHeight, 
                expandChild.style.width = expand.offsetWidth + 1 + "px", expandChild.style.height = expand.offsetHeight + 1 + "px", 
                expand.scrollLeft = expand.scrollWidth, expand.scrollTop = expand.scrollHeight;
            }, checkTriggers = function(element) {
                return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height;
            }, scrollListener = function(e) {
                var element = this;
                resetTriggers(this), this.__resizeRAF__ && cancelFrame(this.__resizeRAF__), this.__resizeRAF__ = requestFrame(function() {
                    checkTriggers(element) && (element.__resizeLast__.width = element.offsetWidth, element.__resizeLast__.height = element.offsetHeight, 
                    element.__resizeListeners__.forEach(function(fn) {
                        fn.call(element, e);
                    }));
                });
            }, animation = !1, animationstring = "animation", keyframeprefix = "", animationstartevent = "animationstart", domPrefixes = "Webkit Moz O ms".split(" "), startEvents = "webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "), pfx = "", elm = document.createElement("fakeelement");
            if (void 0 !== elm.style.animationName && (animation = !0), animation === !1) for (var i = 0; i < domPrefixes.length; i++) if (void 0 !== elm.style[domPrefixes[i] + "AnimationName"]) {
                pfx = domPrefixes[i], animationstring = pfx + "Animation", keyframeprefix = "-" + pfx.toLowerCase() + "-", 
                animationstartevent = startEvents[i], animation = !0;
                break;
            }
            var animationName = "resizeanim", animationKeyframes = "@" + keyframeprefix + "keyframes " + animationName + " { from { opacity: 0; } to { opacity: 0; } } ", animationStyle = keyframeprefix + "animation: 1ms " + animationName + "; ";
        }
        var createStyles = function() {
            if (!stylesCreated) {
                //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
                var css = (animationKeyframes ? animationKeyframes : "") + ".resize-triggers { " + (animationStyle ? animationStyle : "") + 'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }', head = document.head || document.getElementsByTagName("head")[0], style = document.createElement("style");
                style.type = "text/css", style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css)), 
                head.appendChild(style), stylesCreated = !0;
            }
        }, addResizeListener = function(element, fn) {
            attachEvent ? element.attachEvent("onresize", fn) : (element.__resizeTriggers__ || ("static" == getComputedStyle(element).position && (element.style.position = "relative"), 
            createStyles(), element.__resizeLast__ = {}, element.__resizeListeners__ = [], (element.__resizeTriggers__ = document.createElement("div")).className = "resize-triggers", 
            element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>', 
            element.appendChild(element.__resizeTriggers__), resetTriggers(element), element.addEventListener("scroll", scrollListener, !0), 
            /* Listen for a css animation to detect element display/re-attach */
            animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
                e.animationName == animationName && resetTriggers(element);
            })), element.__resizeListeners__.push(fn));
        }, removeResizeListener = function(element, fn) {
            attachEvent ? element.detachEvent("onresize", fn) : (element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1), 
            element.__resizeListeners__.length || (element.removeEventListener("scroll", scrollListener), 
            element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__)));
        };
        module.exports = {
            addResizeListener: addResizeListener,
            removeResizeListener: removeResizeListener
        };
    }, /* 8 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _FlexTable2 = __webpack_require__(9), _FlexTable3 = _interopRequireDefault(_FlexTable2);
        exports["default"] = _FlexTable3["default"];
        var _FlexTable4 = _interopRequireDefault(_FlexTable2);
        exports.FlexTable = _FlexTable4["default"], Object.defineProperty(exports, "SortDirection", {
            enumerable: !0,
            get: function() {
                return _FlexTable2.SortDirection;
            }
        }), Object.defineProperty(exports, "SortIndicator", {
            enumerable: !0,
            get: function() {
                return _FlexTable2.SortIndicator;
            }
        });
        var _FlexColumn2 = __webpack_require__(10), _FlexColumn3 = _interopRequireDefault(_FlexColumn2);
        exports.FlexColumn = _FlexColumn3["default"];
    }, /* 9 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        function SortIndicator(_ref) {
            var sortDirection = _ref.sortDirection, classNames = (0, _classnames2["default"])("FlexTable__sortableHeaderIcon", {
                "FlexTable__sortableHeaderIcon--ASC": sortDirection === SortDirection.ASC,
                "FlexTable__sortableHeaderIcon--DESC": sortDirection === SortDirection.DESC
            });
            return _react2["default"].createElement("svg", {
                className: classNames,
                width: 18,
                height: 18,
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, sortDirection === SortDirection.ASC ? _react2["default"].createElement("path", {
                d: "M7 14l5-5 5 5z"
            }) : _react2["default"].createElement("path", {
                d: "M7 10l5 5 5-5z"
            }), _react2["default"].createElement("path", {
                d: "M0 0h24v24H0z",
                fill: "none"
            }));
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _get = function(_x, _x2, _x3) {
            for (var _again = !0; _again; ) {
                var object = _x, property = _x2, receiver = _x3;
                _again = !1, null === object && (object = Function.prototype);
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (void 0 !== desc) {
                    if ("value" in desc) return desc.value;
                    var getter = desc.get;
                    if (void 0 === getter) return;
                    return getter.call(receiver);
                }
                var parent = Object.getPrototypeOf(object);
                if (null === parent) return;
                _x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
            }
        };
        exports.SortIndicator = SortIndicator;
        var _classnames = __webpack_require__(3), _classnames2 = _interopRequireDefault(_classnames), _FlexColumn = __webpack_require__(10), _FlexColumn2 = _interopRequireDefault(_FlexColumn), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactPureRenderFunction = __webpack_require__(5), _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction), _VirtualScroll = __webpack_require__(11), _VirtualScroll2 = _interopRequireDefault(_VirtualScroll), SortDirection = {
            /**
	   * Sort items in ascending order.
	   * This means arranging from the lowest value to the highest (e.g. a-z, 0-9).
	   */
            ASC: "ASC",
            /**
	   * Sort items in descending order.
	   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
	   */
            DESC: "DESC"
        };
        exports.SortDirection = SortDirection;
        /**
	 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
	 * This component expects explicit width, height, and padding parameters.
	 */
        var FlexTable = function(_Component) {
            function FlexTable(props) {
                _classCallCheck(this, FlexTable), _get(Object.getPrototypeOf(FlexTable.prototype), "constructor", this).call(this, props), 
                this.shouldComponentUpdate = _reactPureRenderFunction2["default"], this._createRow = this._createRow.bind(this);
            }
            /**
	   * Displayed beside a header to indicate that a FlexTable is currently sorted by this column.
	   */
            /**
	   * See VirtualScroll#recomputeRowHeights
	   */
            return _inherits(FlexTable, _Component), _createClass(FlexTable, null, [ {
                key: "propTypes",
                value: {
                    /** One or more FlexColumns describing the data displayed in this row */
                    children: function children(props, propName, componentName) {
                        for (var children = _react2["default"].Children.toArray(props.children), i = 0; i < children.length; i++) if (children[i].type !== _FlexColumn2["default"]) return new Error("FlexTable only accepts children of type FlexColumn");
                    },
                    /** Optional CSS class name */
                    className: _react.PropTypes.string,
                    /** Disable rendering the header at all */
                    disableHeader: _react.PropTypes.bool,
                    /** Optional CSS class to apply to all column headers */
                    headerClassName: _react.PropTypes.string,
                    /** Fixed height of header row */
                    headerHeight: _react.PropTypes.number.isRequired,
                    /** Fixed/available height for out DOM element */
                    height: _react.PropTypes.number.isRequired,
                    /** Horizontal padding of outer DOM element */
                    horizontalPadding: _react.PropTypes.number,
                    /** Optional renderer to be used in place of table body rows when rowsCount is 0 */
                    noRowsRenderer: _react.PropTypes.func,
                    /**
	      * Optional callback when a column's header is clicked.
	      * (dataKey: string): void
	      */
                    onHeaderClick: _react.PropTypes.func,
                    /**
	       * Callback invoked when a user clicks on a table row.
	       * (rowIndex: number): void
	       */
                    onRowClick: _react.PropTypes.func,
                    /**
	       * Callback invoked with information about the slice of rows that were just rendered.
	       * ({ startIndex, stopIndex }): void
	       */
                    onRowsRendered: _react.PropTypes.func,
                    /**
	       * Optional CSS class to apply to all table rows (including the header row).
	       * This property can be a CSS class name (string) or a function that returns a class name.
	       * If a function is provided its signature should be: (rowIndex: number): string
	       */
                    rowClassName: _react.PropTypes.oneOfType([ _react.PropTypes.string, _react.PropTypes.func ]),
                    /**
	       * Callback responsible for returning a data row given an index.
	       * (index: number): any
	       */
                    rowGetter: _react.PropTypes.func.isRequired,
                    /** Fixed height of table row */
                    rowHeight: _react.PropTypes.number.isRequired,
                    /** Number of rows in table. */
                    rowsCount: _react.PropTypes.number.isRequired,
                    /**
	       * Sort function to be called if a sortable header is clicked.
	       * (dataKey: string, sortDirection: SortDirection): void
	       */
                    sort: _react.PropTypes.func,
                    /** FlexTable data is currently sorted by this :dataKey (if it is sorted at all) */
                    sortBy: _react.PropTypes.string,
                    /** FlexTable data is currently sorted in this direction (if it is sorted at all) */
                    sortDirection: _react.PropTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ]),
                    /** Vertical padding of outer DOM element */
                    verticalPadding: _react.PropTypes.number
                },
                enumerable: !0
            }, {
                key: "defaultProps",
                value: {
                    disableHeader: !1,
                    horizontalPadding: 0,
                    noRowsRenderer: function() {
                        return null;
                    },
                    onHeaderClick: function() {
                        return null;
                    },
                    onRowClick: function() {
                        return null;
                    },
                    onRowsRendered: function() {
                        return null;
                    },
                    verticalPadding: 0
                },
                enumerable: !0
            } ]), _createClass(FlexTable, [ {
                key: "recomputeRowHeights",
                value: function() {
                    this.refs.VirtualScroll.recomputeRowHeights();
                }
            }, {
                key: "scrollToRow",
                value: function(scrollToIndex) {
                    this.refs.VirtualScroll.scrollToRow(scrollToIndex);
                }
            }, {
                key: "render",
                value: function() {
                    var _this = this, _props = this.props, className = _props.className, disableHeader = _props.disableHeader, headerHeight = _props.headerHeight, height = _props.height, noRowsRenderer = _props.noRowsRenderer, onRowsRendered = _props.onRowsRendered, rowClassName = _props.rowClassName, rowHeight = _props.rowHeight, rowsCount = _props.rowsCount, verticalPadding = _props.verticalPadding, availableRowsHeight = height - headerHeight - verticalPadding, rowRenderer = function(index) {
                        return _this._createRow(index);
                    }, rowClass = rowClassName instanceof Function ? rowClassName(-1) : rowClassName;
                    return _react2["default"].createElement("div", {
                        className: (0, _classnames2["default"])("FlexTable", className)
                    }, !disableHeader && _react2["default"].createElement("div", {
                        className: (0, _classnames2["default"])("FlexTable__headerRow", rowClass),
                        style: {
                            height: headerHeight
                        }
                    }, this._getRenderedHeaderRow()), _react2["default"].createElement(_VirtualScroll2["default"], {
                        ref: "VirtualScroll",
                        height: availableRowsHeight,
                        noRowsRenderer: noRowsRenderer,
                        onRowsRendered: onRowsRendered,
                        rowHeight: rowHeight,
                        rowRenderer: rowRenderer,
                        rowsCount: rowsCount
                    }));
                }
            }, {
                key: "_createColumn",
                value: function(column, columnIndex, rowData, rowIndex) {
                    var _column$props = column.props, cellClassName = _column$props.cellClassName, cellDataGetter = _column$props.cellDataGetter, columnData = _column$props.columnData, dataKey = _column$props.dataKey, cellRenderer = _column$props.cellRenderer, cellData = cellDataGetter(dataKey, rowData, columnData), renderedCell = cellRenderer(cellData, dataKey, rowData, rowIndex, columnData), flex = this._getFlexStyleForColumn(column), style = {
                        flex: flex
                    }, title = "string" == typeof renderedCell ? renderedCell : null;
                    return _react2["default"].createElement("div", {
                        key: "Row" + rowIndex + "-Col" + columnIndex,
                        className: (0, _classnames2["default"])("FlexTable__rowColumn", cellClassName),
                        style: style
                    }, _react2["default"].createElement("div", {
                        className: "FlexTable__truncatedColumnText",
                        title: title
                    }, renderedCell));
                }
            }, {
                key: "_createHeader",
                value: function(column, columnIndex) {
                    var _props2 = this.props, headerClassName = _props2.headerClassName, onHeaderClick = _props2.onHeaderClick, sort = _props2.sort, sortBy = _props2.sortBy, sortDirection = _props2.sortDirection, _column$props2 = column.props, dataKey = _column$props2.dataKey, disableSort = _column$props2.disableSort, label = _column$props2.label, columnData = _column$props2.columnData, showSortIndicator = sortBy === dataKey, sortEnabled = !disableSort && sort, classNames = (0, 
                    _classnames2["default"])("FlexTable__headerColumn", headerClassName, column.props.headerClassName, {
                        FlexTable__sortableHeaderColumn: sortEnabled
                    }), flex = this._getFlexStyleForColumn(column), style = {
                        flex: flex
                    }, newSortDirection = sortBy !== dataKey || sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC, onClick = function() {
                        sortEnabled && sort(dataKey, newSortDirection), onHeaderClick(dataKey, columnData);
                    };
                    return _react2["default"].createElement("div", {
                        key: "Header-Col" + columnIndex,
                        className: classNames,
                        style: style,
                        onClick: onClick
                    }, _react2["default"].createElement("div", {
                        className: "FlexTable__headerTruncatedText",
                        title: label
                    }, label), showSortIndicator && _react2["default"].createElement(SortIndicator, {
                        sortDirection: sortDirection
                    }));
                }
            }, {
                key: "_createRow",
                value: function(rowIndex) {
                    var _this2 = this, _props3 = this.props, children = _props3.children, onRowClick = _props3.onRowClick, rowClassName = _props3.rowClassName, rowGetter = _props3.rowGetter, rowHeight = _props3.rowHeight, rowClass = rowClassName instanceof Function ? rowClassName(rowIndex) : rowClassName, renderedRow = _react2["default"].Children.map(children, function(column, columnIndex) {
                        return _this2._createColumn(column, columnIndex, rowGetter(rowIndex), rowIndex);
                    });
                    return _react2["default"].createElement("div", {
                        key: rowIndex,
                        className: (0, _classnames2["default"])("FlexTable__row", rowClass),
                        onClick: function() {
                            return onRowClick(rowIndex);
                        },
                        style: {
                            height: rowHeight
                        }
                    }, renderedRow);
                }
            }, {
                key: "_getFlexStyleForColumn",
                value: function(column) {
                    var flex = [];
                    return flex.push(column.props.flexGrow), flex.push(column.props.flexShrink), flex.push(column.props.width ? column.props.width + "px" : "auto"), 
                    flex.join(" ");
                }
            }, {
                key: "_getRenderedHeaderRow",
                value: function() {
                    var _this3 = this, _props4 = this.props, children = _props4.children, disableHeader = _props4.disableHeader, items = disableHeader ? [] : children;
                    return _react2["default"].Children.map(items, function(column, columnIndex) {
                        return _this3._createHeader(column, columnIndex);
                    });
                }
            } ]), FlexTable;
        }(_react.Component);
        exports["default"] = FlexTable, SortIndicator.propTypes = {
            sortDirection: _react.PropTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ])
        };
    }, /* 10 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        /**
	 * Default cell renderer that displays an attribute as a simple string
	 * You should override the column's cellRenderer if your data is some other type of object.
	 */
        function defaultCellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
            return null === cellData || void 0 === cellData ? "" : String(cellData);
        }
        /**
	 * Default accessor for returning a cell value for a given attribute.
	 * This function expects to operate on either a vanilla Object or an Immutable Map.
	 * You should override the column's cellDataGetter if your data is some other type of object.
	 */
        function defaultCellDataGetter(dataKey, rowData, columnData) {
            return rowData.get instanceof Function ? rowData.get(dataKey) : rowData[dataKey];
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _get = function(_x, _x2, _x3) {
            for (var _again = !0; _again; ) {
                var object = _x, property = _x2, receiver = _x3;
                _again = !1, null === object && (object = Function.prototype);
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (void 0 !== desc) {
                    if ("value" in desc) return desc.value;
                    var getter = desc.get;
                    if (void 0 === getter) return;
                    return getter.call(receiver);
                }
                var parent = Object.getPrototypeOf(object);
                if (null === parent) return;
                _x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
            }
        };
        exports.defaultCellRenderer = defaultCellRenderer, exports.defaultCellDataGetter = defaultCellDataGetter;
        var _react = __webpack_require__(4), Column = function(_Component) {
            function Column() {
                _classCallCheck(this, Column), _get(Object.getPrototypeOf(Column.prototype), "constructor", this).apply(this, arguments);
            }
            return _inherits(Column, _Component), _createClass(Column, null, [ {
                key: "defaultProps",
                value: {
                    cellDataGetter: defaultCellDataGetter,
                    cellRenderer: defaultCellRenderer,
                    flexGrow: 0,
                    flexShrink: 1
                },
                enumerable: !0
            }, {
                key: "propTypes",
                value: {
                    /** Optional CSS class to apply to cell */
                    cellClassName: _react.PropTypes.string,
                    /**
	       * Callback responsible for returning a cell's data, given its :dataKey
	       * (dataKey: string, rowData: any): any
	       */
                    cellDataGetter: _react.PropTypes.func,
                    /**
	       * Callback responsible for rendering a cell's contents.
	       * (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
	       */
                    cellRenderer: _react.PropTypes.func,
                    /** Optional additional data passed to this column's :cellDataGetter */
                    columnData: _react.PropTypes.object,
                    /** Uniquely identifies the row-data attribute correspnding to this cell */
                    dataKey: _react.PropTypes.any.isRequired,
                    /** If sort is enabled for the table at large, disable it for this column */
                    disableSort: _react.PropTypes.bool,
                    /** Flex grow style; defaults to 0 */
                    flexGrow: _react.PropTypes.number,
                    /** Flex shrink style; defaults to 1 */
                    flexShrink: _react.PropTypes.number,
                    /** Optional CSS class to apply to this column's header */
                    headerClassName: _react.PropTypes.string,
                    /** Header label for this column */
                    label: _react.PropTypes.string,
                    /** Optional fixed width for this column */
                    width: _react.PropTypes.number
                },
                enumerable: !0
            } ]), Column;
        }(_react.Component);
        exports["default"] = Column;
    }, /* 11 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _VirtualScroll2 = __webpack_require__(12), _VirtualScroll3 = _interopRequireDefault(_VirtualScroll2);
        exports["default"] = _VirtualScroll3["default"];
        var _VirtualScroll4 = _interopRequireDefault(_VirtualScroll2);
        exports.VirtualScroll = _VirtualScroll4["default"];
    }, /* 12 */
    /***/
    function(module, exports, __webpack_require__) {
        /* WEBPACK VAR INJECTION */
        (function(setImmediate, clearImmediate) {
            "use strict";
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    "default": obj
                };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            }, _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                        "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                    Constructor;
                };
            }(), _get = function(_x, _x2, _x3) {
                for (var _again = !0; _again; ) {
                    var object = _x, property = _x2, receiver = _x3;
                    _again = !1, null === object && (object = Function.prototype);
                    var desc = Object.getOwnPropertyDescriptor(object, property);
                    if (void 0 !== desc) {
                        if ("value" in desc) return desc.value;
                        var getter = desc.get;
                        if (void 0 === getter) return;
                        return getter.call(receiver);
                    }
                    var parent = Object.getPrototypeOf(object);
                    if (null === parent) return;
                    _x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
                }
            }, _utils = __webpack_require__(15), _classnames = __webpack_require__(3), _classnames2 = _interopRequireDefault(_classnames), _raf = __webpack_require__(16), _raf2 = _interopRequireDefault(_raf), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactPureRenderFunction = __webpack_require__(5), _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction), IS_SCROLLING_TIMEOUT = 150, VirtualScroll = function(_Component) {
                function VirtualScroll(props, context) {
                    _classCallCheck(this, VirtualScroll), _get(Object.getPrototypeOf(VirtualScroll.prototype), "constructor", this).call(this, props, context), 
                    this.shouldComponentUpdate = _reactPureRenderFunction2["default"], this.state = {
                        computeCellMetadataOnNextUpdate: !1,
                        isScrolling: !1,
                        scrollTop: 0
                    }, // Invokes onRowsRendered callback only when start/stop row indices change
                    this._OnRowsRenderedHelper = (0, _utils.initOnRowsRenderedHelper)(), this._onKeyPress = this._onKeyPress.bind(this), 
                    this._onScroll = this._onScroll.bind(this), this._onWheel = this._onWheel.bind(this);
                }
                /**
	   * Forced recompute of row heights.
	   * This function should be called if dynamic row heights have changed but nothing else has.
	   * Since VirtualScroll receives a :rowsCount it has no way of knowing if the underlying list data has changed.
	   */
                return _inherits(VirtualScroll, _Component), _createClass(VirtualScroll, null, [ {
                    key: "propTypes",
                    value: {
                        /** Optional CSS class name */
                        className: _react.PropTypes.string,
                        /** Height constraint for list (determines how many actual rows are rendered) */
                        height: _react.PropTypes.number.isRequired,
                        /** Optional renderer to be used in place of rows when rowsCount is 0 */
                        noRowsRenderer: _react.PropTypes.func,
                        /**
	       * Callback invoked with information about the slice of rows that were just rendered.
	       * ({ startIndex, stopIndex }): void
	       */
                        onRowsRendered: _react.PropTypes.func,
                        /** Either a fixed row height (number) or a function that returns the height of a row given its index. */
                        rowHeight: _react.PropTypes.oneOfType([ _react.PropTypes.number, _react.PropTypes.func ]).isRequired,
                        /** Responsbile for rendering a row given an index */
                        rowRenderer: _react.PropTypes.func.isRequired,
                        /** Number of rows in list. */
                        rowsCount: _react.PropTypes.number.isRequired,
                        /** Row index to ensure visible (by forcefully scrolling if necessary) */
                        scrollToIndex: _react.PropTypes.number
                    },
                    enumerable: !0
                }, {
                    key: "defaultProps",
                    value: {
                        noRowsRenderer: function() {
                            return null;
                        },
                        onRowsRendered: function() {
                            return null;
                        }
                    },
                    enumerable: !0
                } ]), _createClass(VirtualScroll, [ {
                    key: "recomputeRowHeights",
                    value: function() {
                        this.setState({
                            computeCellMetadataOnNextUpdate: !0
                        });
                    }
                }, {
                    key: "scrollToRow",
                    value: function(scrollToIndex) {
                        this._updateScrollTopForScrollToIndex(scrollToIndex);
                    }
                }, {
                    key: "componentDidMount",
                    value: function() {
                        var _this = this, _props = this.props, onRowsRendered = _props.onRowsRendered, scrollToIndex = _props.scrollToIndex;
                        scrollToIndex >= 0 && (// Without setImmediate() the initial scrollingContainer.scrollTop assignment doesn't work
                        this._scrollTopId = setImmediate(function() {
                            _this._scrollTopId = null, _this._updateScrollTopForScrollToIndex();
                        })), // Update onRowsRendered callback
                        this._OnRowsRenderedHelper({
                            onRowsRendered: onRowsRendered,
                            startIndex: this._renderedStartIndex,
                            stopIndex: this._renderedStopIndex
                        });
                    }
                }, {
                    key: "componentDidUpdate",
                    value: function(prevProps, prevState) {
                        var _props2 = this.props, height = _props2.height, onRowsRendered = _props2.onRowsRendered, rowsCount = _props2.rowsCount, rowHeight = _props2.rowHeight, scrollToIndex = _props2.scrollToIndex, scrollTop = this.state.scrollTop;
                        // Make sure any changes to :scrollTop (from :scrollToIndex) get applied
                        scrollTop >= 0 && scrollTop !== prevState.scrollTop && (this.refs.scrollingContainer.scrollTop = scrollTop);
                        var hasScrollToIndex = scrollToIndex >= 0 && rowsCount > scrollToIndex, sizeHasChanged = height !== prevProps.height || !prevProps.rowHeight || "number" == typeof rowHeight && rowHeight !== prevProps.rowHeight;
                        // If we have a new scroll target OR if height/row-height has changed,
                        // We should ensure that the scroll target is visible.
                        if (hasScrollToIndex && (sizeHasChanged || scrollToIndex !== prevProps.scrollToIndex)) this._updateScrollTopForScrollToIndex(); else if (!hasScrollToIndex && (height < prevProps.height || rowsCount < prevProps.rowsCount)) {
                            var calculatedScrollTop = (0, _utils.getUpdatedOffsetForIndex)({
                                cellMetadata: this._cellMetadata,
                                containerSize: height,
                                currentOffset: scrollTop,
                                targetIndex: rowsCount - 1
                            });
                            // Only adjust the scroll position if we've scrolled below the last set of rows.
                            scrollTop > calculatedScrollTop && this._updateScrollTopForScrollToIndex(rowsCount - 1);
                        }
                        // Update onRowsRendered callback if start/stop indices have changed
                        this._OnRowsRenderedHelper({
                            onRowsRendered: onRowsRendered,
                            startIndex: this._renderedStartIndex,
                            stopIndex: this._renderedStopIndex
                        });
                    }
                }, {
                    key: "componentWillMount",
                    value: function() {
                        this._computeCellMetadata(this.props);
                    }
                }, {
                    key: "componentWillUnmount",
                    value: function() {
                        this._disablePointerEventsTimeoutId && clearTimeout(this._disablePointerEventsTimeoutId), 
                        this._scrollTopId && clearImmediate(this._scrollTopId), this._setNextStateAnimationFrameId && _raf2["default"].cancel(this._setNextStateAnimationFrameId);
                    }
                }, {
                    key: "componentWillUpdate",
                    value: function(nextProps, nextState) {
                        0 === nextProps.rowsCount && 0 !== nextState.scrollTop && this.setState({
                            scrollTop: 0
                        }), // Don't compare rowHeight if it's a function because inline functions would cause infinite loops.
                        // In that event users should use recomputeRowHeights() to inform of changes.
                        (nextState.computeCellMetadataOnNextUpdate || this.props.rowsCount !== nextProps.rowsCount || ("number" == typeof this.props.rowHeight || "number" == typeof nextProps.rowHeight) && this.props.rowHeight !== nextProps.rowHeight) && (this._computeCellMetadata(nextProps), 
                        this.setState({
                            computeCellMetadataOnNextUpdate: !1
                        }), // Updated cell metadata may have hidden the previous scrolled-to item.
                        // In this case we should also update the scrollTop to ensure it stays visible.
                        this.props.scrollToIndex === nextProps.scrollToIndex && this._updateScrollTopForScrollToIndex());
                    }
                }, {
                    key: "render",
                    value: function() {
                        var _props3 = this.props, className = _props3.className, height = _props3.height, noRowsRenderer = _props3.noRowsRenderer, rowsCount = _props3.rowsCount, rowRenderer = _props3.rowRenderer, _state = this.state, isScrolling = _state.isScrolling, scrollTop = _state.scrollTop, childrenToDisplay = [];
                        // Render only enough rows to cover the visible (vertical) area of the table.
                        if (height > 0) {
                            var _getVisibleCellIndices = (0, _utils.getVisibleCellIndices)({
                                cellCount: rowsCount,
                                cellMetadata: this._cellMetadata,
                                containerSize: height,
                                currentOffset: scrollTop
                            }), start = _getVisibleCellIndices.start, _stop = _getVisibleCellIndices.stop;
                            // Store for onRowsRendered callback in componentDidUpdate
                            this._renderedStartIndex = start, this._renderedStopIndex = _stop;
                            for (var i = start; _stop >= i; i++) {
                                var datum = this._cellMetadata[i], child = rowRenderer(i);
                                child = _react2["default"].cloneElement(child, {
                                    style: _extends({}, child.props.style, {
                                        position: "absolute",
                                        top: datum.offset,
                                        width: "100%",
                                        height: this._getRowHeight(i)
                                    })
                                }), childrenToDisplay.push(child);
                            }
                        }
                        return _react2["default"].createElement("div", {
                            ref: "scrollingContainer",
                            className: (0, _classnames2["default"])("VirtualScroll", className),
                            onKeyDown: this._onKeyPress,
                            onScroll: this._onScroll,
                            onWheel: this._onWheel,
                            tabIndex: 0,
                            style: {
                                position: "relative",
                                overflow: "auto",
                                height: height,
                                outline: 0
                            }
                        }, rowsCount > 0 && _react2["default"].createElement("div", {
                            style: {
                                height: this._getTotalRowsHeight(),
                                maxHeight: this._getTotalRowsHeight(),
                                pointerEvents: isScrolling ? "none" : "auto",
                                boxSizing: "border-box",
                                overflowX: "auto",
                                overflowY: "hidden"
                            }
                        }, childrenToDisplay), 0 === rowsCount && noRowsRenderer());
                    }
                }, {
                    key: "_computeCellMetadata",
                    value: function(props) {
                        var rowHeight = props.rowHeight, rowsCount = props.rowsCount;
                        this._cellMetadata = (0, _utils.initCellMetadata)({
                            cellCount: rowsCount,
                            size: rowHeight
                        });
                    }
                }, {
                    key: "_getRowHeight",
                    value: function(index) {
                        var rowHeight = this.props.rowHeight;
                        return rowHeight instanceof Function ? rowHeight(index) : rowHeight;
                    }
                }, {
                    key: "_getTotalRowsHeight",
                    value: function() {
                        if (0 === this._cellMetadata.length) return 0;
                        var datum = this._cellMetadata[this._cellMetadata.length - 1];
                        return datum.offset + datum.size;
                    }
                }, {
                    key: "_setNextState",
                    value: function(state) {
                        var _this2 = this;
                        this._setNextStateAnimationFrameId && _raf2["default"].cancel(this._setNextStateAnimationFrameId), 
                        this._setNextStateAnimationFrameId = (0, _raf2["default"])(function() {
                            _this2._setNextStateAnimationFrameId = null, _this2.setState(state);
                        });
                    }
                }, {
                    key: "_stopEvent",
                    value: function(event) {
                        event.preventDefault(), event.stopPropagation();
                    }
                }, {
                    key: "_temporarilyDisablePointerEvents",
                    value: function() {
                        var _this3 = this;
                        this._disablePointerEventsTimeoutId && clearTimeout(this._disablePointerEventsTimeoutId), 
                        this._disablePointerEventsTimeoutId = setTimeout(function() {
                            _this3._disablePointerEventsTimeoutId = null, _this3.setState({
                                isScrolling: !1
                            });
                        }, IS_SCROLLING_TIMEOUT);
                    }
                }, {
                    key: "_updateScrollTopForScrollToIndex",
                    value: function(scrollToIndexOverride) {
                        var scrollToIndex = void 0 !== scrollToIndexOverride ? scrollToIndexOverride : this.props.scrollToIndex, height = this.props.height, scrollTop = this.state.scrollTop;
                        if (scrollToIndex >= 0) {
                            var calculatedScrollTop = (0, _utils.getUpdatedOffsetForIndex)({
                                cellMetadata: this._cellMetadata,
                                containerSize: height,
                                currentOffset: scrollTop,
                                targetIndex: scrollToIndex
                            });
                            scrollTop !== calculatedScrollTop && this.setState({
                                scrollTop: calculatedScrollTop
                            });
                        }
                    }
                }, {
                    key: "_onKeyPress",
                    value: function(event) {
                        var _props4 = this.props, height = _props4.height, rowsCount = _props4.rowsCount, scrollTop = this.state.scrollTop, start = void 0, datum = void 0, newScrollTop = void 0;
                        if (0 !== rowsCount) switch (event.key) {
                          case "ArrowDown":
                            this._stopEvent(event), // Prevent key from also scrolling surrounding window
                            start = (0, _utils.getVisibleCellIndices)({
                                cellCount: rowsCount,
                                cellMetadata: this._cellMetadata,
                                containerSize: height,
                                currentOffset: scrollTop
                            }).start, datum = this._cellMetadata[start], newScrollTop = Math.min(this._getTotalRowsHeight() - height, scrollTop + datum.size), 
                            this.setState({
                                scrollTop: newScrollTop
                            });
                            break;

                          case "ArrowUp":
                            this._stopEvent(event), // Prevent key from also scrolling surrounding window
                            start = (0, _utils.getVisibleCellIndices)({
                                cellCount: rowsCount,
                                cellMetadata: this._cellMetadata,
                                containerSize: height,
                                currentOffset: scrollTop
                            }).start, this.scrollToRow(Math.max(0, start - 1));
                        }
                    }
                }, {
                    key: "_onScroll",
                    value: function(event) {
                        // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollTop.
                        // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
                        // See issue #404 for more information.
                        if (event.target === this.refs.scrollingContainer) {
                            // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
                            // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
                            // This causes a series of rapid renders that is slow for long lists.
                            // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
                            var height = this.props.height, totalRowsHeight = this._getTotalRowsHeight(), scrollTop = Math.min(totalRowsHeight - height, event.target.scrollTop);
                            // Certain devices (like Apple touchpad) rapid-fire duplicate events.
                            // Don't force a re-render if this is the case.
                            this.state.scrollTop !== scrollTop && (// Prevent pointer events from interrupting a smooth scroll
                            this._temporarilyDisablePointerEvents(), // The mouse may move faster then the animation frame does.
                            // Use requestAnimationFrame to avoid over-updating.
                            this._setNextState({
                                isScrolling: !0,
                                scrollTop: scrollTop
                            }));
                        }
                    }
                }, {
                    key: "_onWheel",
                    value: function(event) {
                        var scrollTop = this.refs.scrollingContainer.scrollTop;
                        // Certain devices (like Apple touchpad) rapid-fire duplicate events.
                        // Don't force a re-render if this is the case.
                        this.state.scrollTop !== scrollTop && (// Prevent pointer events from interrupting a smooth scroll
                        this._temporarilyDisablePointerEvents(), // The mouse may move faster then the animation frame does.
                        // Use requestAnimationFrame to avoid over-updating.
                        this._setNextState({
                            isScrolling: !0,
                            scrollTop: scrollTop
                        }));
                    }
                } ]), VirtualScroll;
            }(_react.Component);
            exports["default"] = VirtualScroll, module.exports = exports["default"];
        }).call(exports, __webpack_require__(13).setImmediate, __webpack_require__(13).clearImmediate);
    }, /* 13 */
    /***/
    function(module, exports, __webpack_require__) {
        /* WEBPACK VAR INJECTION */
        (function(setImmediate, clearImmediate) {
            function Timeout(id, clearFn) {
                this._id = id, this._clearFn = clearFn;
            }
            var nextTick = __webpack_require__(14).nextTick, apply = Function.prototype.apply, slice = Array.prototype.slice, immediateIds = {}, nextImmediateId = 0;
            // DOM APIs, for completeness
            exports.setTimeout = function() {
                return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
            }, exports.setInterval = function() {
                return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
            }, exports.clearTimeout = exports.clearInterval = function(timeout) {
                timeout.close();
            }, Timeout.prototype.unref = Timeout.prototype.ref = function() {}, Timeout.prototype.close = function() {
                this._clearFn.call(window, this._id);
            }, // Does not start the time, just sets up the members needed.
            exports.enroll = function(item, msecs) {
                clearTimeout(item._idleTimeoutId), item._idleTimeout = msecs;
            }, exports.unenroll = function(item) {
                clearTimeout(item._idleTimeoutId), item._idleTimeout = -1;
            }, exports._unrefActive = exports.active = function(item) {
                clearTimeout(item._idleTimeoutId);
                var msecs = item._idleTimeout;
                msecs >= 0 && (item._idleTimeoutId = setTimeout(function() {
                    item._onTimeout && item._onTimeout();
                }, msecs));
            }, // That's not how node.js implements it but the exposed api is the same.
            exports.setImmediate = "function" == typeof setImmediate ? setImmediate : function(fn) {
                var id = nextImmediateId++, args = arguments.length < 2 ? !1 : slice.call(arguments, 1);
                return immediateIds[id] = !0, nextTick(function() {
                    immediateIds[id] && (// fn.call() is faster so we optimize for the common use-case
                    // @see http://jsperf.com/call-apply-segu
                    args ? fn.apply(null, args) : fn.call(null), // Prevent ids from leaking
                    exports.clearImmediate(id));
                }), id;
            }, exports.clearImmediate = "function" == typeof clearImmediate ? clearImmediate : function(id) {
                delete immediateIds[id];
            };
        }).call(exports, __webpack_require__(13).setImmediate, __webpack_require__(13).clearImmediate);
    }, /* 14 */
    /***/
    function(module, exports) {
        function cleanUpNextTick() {
            draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue();
        }
        function drainQueue() {
            if (!draining) {
                var timeout = setTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, clearTimeout(timeout);
            }
        }
        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        // shim for using process in browser
        var currentQueue, process = module.exports = {}, queue = [], draining = !1, queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || setTimeout(drainQueue, 0);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", // empty string to avoid regexp issues
        process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, 
        process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, /* 15 */
    /***/
    function(module, exports) {
        /**
	 * Binary search function inspired by react-infinite.
	 */
        "use strict";
        function findNearestCell(_ref) {
            for (var cellMetadata = _ref.cellMetadata, mode = _ref.mode, offset = _ref.offset, high = cellMetadata.length - 1, low = 0, middle = void 0, currentOffset = void 0; high >= low; ) {
                if (middle = low + Math.floor((high - low) / 2), currentOffset = cellMetadata[middle].offset, 
                currentOffset === offset) return middle;
                offset > currentOffset ? low = middle + 1 : currentOffset > offset && (high = middle - 1);
            }
            return mode === findNearestCell.EQUAL_OR_LOWER && low > 0 ? low - 1 : mode === findNearestCell.EQUAL_OR_HIGHER && high < cellMetadata.length - 1 ? high + 1 : void 0;
        }
        /**
	 * Determines a new offset that ensures a certain cell is visible, given the current offset.
	 * If the cell is already visible then the current offset will be returned.
	 * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
	 *
	 * @param cellMetadata Metadata initially computed by initCellMetadata()
	 * @param containerSize Total size (width or height) of the container
	 * @param currentOffset Container's current (x or y) offset
	 * @param targetIndex Index of target cell
	 * @return Offset to use to ensure the specified cell is visible
	 */
        function getUpdatedOffsetForIndex(_ref2) {
            var cellMetadata = _ref2.cellMetadata, containerSize = _ref2.containerSize, currentOffset = _ref2.currentOffset, targetIndex = _ref2.targetIndex;
            if (0 === cellMetadata.length) return 0;
            targetIndex = Math.max(0, Math.min(cellMetadata.length - 1, targetIndex));
            var datum = cellMetadata[targetIndex], maxOffset = datum.offset, minOffset = maxOffset - containerSize + datum.size, newOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
            return newOffset;
        }
        /**
	 * Determines the range of cells to display for a given offset in order to fill the specified container.
	 *
	 * @param cellCount Total number of cells.
	 * @param cellMetadata Metadata initially computed by initCellMetadata()
	 * @param containerSize Total size (width or height) of the container
	 * @param currentOffset Container's current (x or y) offset
	 * @return An object containing :start and :stop attributes, each specifying a cell index
	 */
        function getVisibleCellIndices(_ref3) {
            var cellCount = _ref3.cellCount, cellMetadata = _ref3.cellMetadata, containerSize = _ref3.containerSize, currentOffset = _ref3.currentOffset;
            if (0 === cellCount) return {};
            currentOffset = Math.max(0, currentOffset);
            var maxOffset = currentOffset + containerSize, start = findNearestCell({
                cellMetadata: cellMetadata,
                mode: findNearestCell.EQUAL_OR_LOWER,
                offset: currentOffset
            }), datum = cellMetadata[start];
            currentOffset = datum.offset + datum.size;
            for (var stop = start; maxOffset > currentOffset && cellCount - 1 > stop; ) stop++, 
            currentOffset += cellMetadata[stop].size;
            return {
                start: start,
                stop: stop
            };
        }
        /**
	 * Initializes metadata for an axis and its cells.
	 * This data is used to determine which cells are visible given a container size and scroll position.
	 *
	 * @param cellCount Total number of cells.
	 * @param size Either a fixed size or a function that returns the size for a given given an index.
	 * @return Object mapping cell index to cell metadata (size, offset)
	 */
        function initCellMetadata(_ref4) {
            for (var cellCount = _ref4.cellCount, size = _ref4.size, sizeGetter = size instanceof Function ? size : function(index) {
                return size;
            }, cellMetadata = [], offset = 0, i = 0; cellCount > i; i++) {
                var _size = sizeGetter(i);
                cellMetadata[i] = {
                    size: _size,
                    offset: offset
                }, offset += _size;
            }
            return cellMetadata;
        }
        /**
	 * Helper utility that updates the specified onRowsRendered callback on when start or stop indices have changed.
	 */
        function initOnRowsRenderedHelper() {
            var cachedStartIndex = void 0, cachedStopIndex = void 0;
            return function(_ref5) {
                var onRowsRendered = _ref5.onRowsRendered, startIndex = _ref5.startIndex, stopIndex = _ref5.stopIndex;
                startIndex >= 0 && stopIndex >= 0 && (startIndex !== cachedStartIndex || stopIndex !== cachedStopIndex) && (cachedStartIndex = startIndex, 
                cachedStopIndex = stopIndex, onRowsRendered({
                    startIndex: startIndex,
                    stopIndex: stopIndex
                }));
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.findNearestCell = findNearestCell, exports.getUpdatedOffsetForIndex = getUpdatedOffsetForIndex, 
        exports.getVisibleCellIndices = getVisibleCellIndices, exports.initCellMetadata = initCellMetadata, 
        exports.initOnRowsRenderedHelper = initOnRowsRenderedHelper, findNearestCell.EQUAL_OR_LOWER = 1, 
        findNearestCell.EQUAL_OR_HIGHER = 2;
    }, /* 16 */
    /***/
    function(module, exports, __webpack_require__) {
        for (var now = __webpack_require__(17), global = "undefined" == typeof window ? {} : window, vendors = [ "moz", "webkit" ], suffix = "AnimationFrame", raf = global["request" + suffix], caf = global["cancel" + suffix] || global["cancelRequest" + suffix], i = 0; i < vendors.length && !raf; i++) raf = global[vendors[i] + "Request" + suffix], 
        caf = global[vendors[i] + "Cancel" + suffix] || global[vendors[i] + "CancelRequest" + suffix];
        // Some versions of FF have rAF but not cAF
        if (!raf || !caf) {
            var last = 0, id = 0, queue = [], frameDuration = 1e3 / 60;
            raf = function(callback) {
                if (0 === queue.length) {
                    var _now = now(), next = Math.max(0, frameDuration - (_now - last));
                    last = next + _now, setTimeout(function() {
                        var cp = queue.slice(0);
                        // Clear queue here to prevent
                        // callbacks from appending listeners
                        // to the current frame's queue
                        queue.length = 0;
                        for (var i = 0; i < cp.length; i++) if (!cp[i].cancelled) try {
                            cp[i].callback(last);
                        } catch (e) {
                            setTimeout(function() {
                                throw e;
                            }, 0);
                        }
                    }, Math.round(next));
                }
                return queue.push({
                    handle: ++id,
                    callback: callback,
                    cancelled: !1
                }), id;
            }, caf = function(handle) {
                for (var i = 0; i < queue.length; i++) queue[i].handle === handle && (queue[i].cancelled = !0);
            };
        }
        module.exports = function(fn) {
            // Wrap in a new function to prevent
            // `cancel` potentially being assigned
            // to the native rAF function
            return raf.call(global, fn);
        }, module.exports.cancel = function() {
            caf.apply(global, arguments);
        };
    }, /* 17 */
    /***/
    function(module, exports, __webpack_require__) {
        /* WEBPACK VAR INJECTION */
        (function(process) {
            // Generated by CoffeeScript 1.7.1
            (function() {
                var getNanoSeconds, hrtime, loadTime;
                "undefined" != typeof performance && null !== performance && performance.now ? module.exports = function() {
                    return performance.now();
                } : "undefined" != typeof process && null !== process && process.hrtime ? (module.exports = function() {
                    return (getNanoSeconds() - loadTime) / 1e6;
                }, hrtime = process.hrtime, getNanoSeconds = function() {
                    var hr;
                    return hr = hrtime(), 1e9 * hr[0] + hr[1];
                }, loadTime = getNanoSeconds()) : Date.now ? (module.exports = function() {
                    return Date.now() - loadTime;
                }, loadTime = Date.now()) : (module.exports = function() {
                    return new Date().getTime() - loadTime;
                }, loadTime = new Date().getTime());
            }).call(this);
        }).call(exports, __webpack_require__(18));
    }, /* 18 */
    /***/
    function(module, exports) {
        function cleanUpNextTick() {
            draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue();
        }
        function drainQueue() {
            if (!draining) {
                var timeout = setTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, clearTimeout(timeout);
            }
        }
        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        // shim for using process in browser
        var currentQueue, process = module.exports = {}, queue = [], draining = !1, queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || setTimeout(drainQueue, 0);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", // empty string to avoid regexp issues
        process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, 
        process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, /* 19 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _InfiniteLoader2 = __webpack_require__(20), _InfiniteLoader3 = _interopRequireDefault(_InfiniteLoader2);
        exports["default"] = _InfiniteLoader3["default"];
        var _InfiniteLoader4 = _interopRequireDefault(_InfiniteLoader2);
        exports.InfiniteLoader = _InfiniteLoader4["default"];
    }, /* 20 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }
        function _objectWithoutProperties(obj, keys) {
            var target = {};
            for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
            return target;
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        function isRangeVisible(_ref2) {
            var lastRenderedStartIndex = _ref2.lastRenderedStartIndex, lastRenderedStopIndex = _ref2.lastRenderedStopIndex, startIndex = _ref2.startIndex, stopIndex = _ref2.stopIndex;
            return !(startIndex > lastRenderedStopIndex || lastRenderedStartIndex > stopIndex);
        }
        /**
	 * Returns all of the ranges within a larger range that contain unloaded rows.
	 */
        function scanForUnloadedRanges(_ref3) {
            for (var isRowLoaded = _ref3.isRowLoaded, startIndex = _ref3.startIndex, stopIndex = _ref3.stopIndex, unloadedRanges = [], rangeStartIndex = null, rangeStopIndex = null, i = startIndex; stopIndex >= i; i++) {
                var loaded = isRowLoaded(i);
                loaded ? null !== rangeStopIndex && (unloadedRanges.push({
                    startIndex: rangeStartIndex,
                    stopIndex: rangeStopIndex
                }), rangeStartIndex = rangeStopIndex = null) : (rangeStopIndex = i, null === rangeStartIndex && (rangeStartIndex = i));
            }
            return null !== rangeStopIndex && unloadedRanges.push({
                startIndex: rangeStartIndex,
                stopIndex: rangeStopIndex
            }), unloadedRanges;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _get = function(_x, _x2, _x3) {
            for (var _again = !0; _again; ) {
                var object = _x, property = _x2, receiver = _x3;
                _again = !1, null === object && (object = Function.prototype);
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (void 0 !== desc) {
                    if ("value" in desc) return desc.value;
                    var getter = desc.get;
                    if (void 0 === getter) return;
                    return getter.call(receiver);
                }
                var parent = Object.getPrototypeOf(object);
                if (null === parent) return;
                _x = parent, _x2 = property, _x3 = receiver, _again = !0, desc = parent = void 0;
            }
        };
        exports.isRangeVisible = isRangeVisible, exports.scanForUnloadedRanges = scanForUnloadedRanges;
        var _FlexTable = __webpack_require__(8), _FlexTable2 = _interopRequireDefault(_FlexTable), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactPureRenderFunction = __webpack_require__(5), _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction), _VirtualScroll = __webpack_require__(11), _VirtualScroll2 = _interopRequireDefault(_VirtualScroll), InfiniteLoader = function(_Component) {
            function InfiniteLoader(props) {
                _classCallCheck(this, InfiniteLoader), _get(Object.getPrototypeOf(InfiniteLoader.prototype), "constructor", this).call(this, props), 
                this.shouldComponentUpdate = _reactPureRenderFunction2["default"], this._onRowsRendered = this._onRowsRendered.bind(this);
            }
            /**
	   * Determines if the specified start/stop range is visible based on the most recently rendered range.
	   */
            return _inherits(InfiniteLoader, _Component), _createClass(InfiniteLoader, null, [ {
                key: "propTypes",
                value: {
                    /** Children must be either FlexTable or VirtualScroll */
                    children: function(props, propName, componentName) {
                        var error = void 0;
                        return _react2["default"].Children.forEach(props.children, function(child) {
                            child.type !== _FlexTable2["default"] && child.type !== _VirtualScroll2["default"] && (error = new Error("InfiniteLoader only accepts children of types FlexTable or VirtualScroll not " + child.type));
                        }), error;
                    },
                    /**
	       * Function responsible for tracking the loaded state of each row.
	       * It should implement the following signature: (index: number): boolean
	       */
                    isRowLoaded: _react.PropTypes.func,
                    /**
	       * Callback to be invoked when more rows must be loaded.
	       * It should implement the following signature: ({ startIndex, stopIndex }): Promise
	       * The returned Promise should be resolved once row data has finished loading.
	       * It will be used to determine when to refresh the list with the newly-loaded data.
	       * This callback may be called multiple times in reaction to a single scroll event.
	       */
                    loadMoreRows: _react.PropTypes.func.isRequired,
                    /**
	       * Number of rows in list; can be arbitrary high number if actual number is unknown.
	       */
                    rowsCount: _react.PropTypes.number,
                    /**
	       * Threshold at which to pre-fetch data.
	       * A threshold X means that data will start loading when a user scrolls within X rows.
	       * This value defaults to 15.
	       */
                    threshold: _react.PropTypes.number
                },
                enumerable: !0
            }, {
                key: "defaultProps",
                value: {
                    threshold: 15
                },
                enumerable: !0
            } ]), _createClass(InfiniteLoader, [ {
                key: "componentDidReceiveProps",
                value: function(previousProps) {
                    var children = this.props.children;
                    if (previousProps.children !== children) {
                        var child = _react2["default"].Children.only(children);
                        this._originalOnRowsRendered = child.props.onRowsRendered;
                    }
                }
            }, {
                key: "componentWillMount",
                value: function() {
                    var children = this.props.children, child = _react2["default"].Children.only(children);
                    this._originalOnRowsRendered = child.props.onRowsRendered;
                }
            }, {
                key: "render",
                value: function() {
                    var _props = this.props, children = _props.children, child = (_objectWithoutProperties(_props, [ "children" ]), 
                    _react2["default"].Children.only(children));
                    return child = _react2["default"].cloneElement(child, {
                        onRowsRendered: this._onRowsRendered,
                        ref: "VirtualScroll"
                    });
                }
            }, {
                key: "_onRowsRendered",
                value: function(_ref) {
                    var _this = this, startIndex = _ref.startIndex, stopIndex = _ref.stopIndex, _props2 = this.props, isRowLoaded = _props2.isRowLoaded, loadMoreRows = _props2.loadMoreRows, rowsCount = _props2.rowsCount, threshold = _props2.threshold;
                    this._lastRenderedStartIndex = startIndex, this._lastRenderedStopIndex = stopIndex;
                    var unloadedRanges = scanForUnloadedRanges({
                        isRowLoaded: isRowLoaded,
                        startIndex: Math.max(0, startIndex - threshold),
                        stopIndex: Math.min(rowsCount, stopIndex + threshold)
                    });
                    unloadedRanges.forEach(function(unloadedRange) {
                        var promise = loadMoreRows(unloadedRange);
                        promise && promise.then(function() {
                            // Refresh the visible rows if any of them have just been loaded
                            isRangeVisible({
                                lastRenderedStartIndex: _this._lastRenderedStartIndex,
                                lastRenderedStopIndex: _this._lastRenderedStopIndex,
                                startIndex: unloadedRange.startIndex,
                                stopIndex: unloadedRange.stopIndex
                            }) && _this.refs.VirtualScroll && _this.refs.VirtualScroll.forceUpdate();
                        });
                    }), this._originalOnRowsRendered && this._originalOnRowsRendered({
                        startIndex: startIndex,
                        stopIndex: stopIndex
                    });
                }
            } ]), InfiniteLoader;
        }(_react.Component);
        exports["default"] = InfiniteLoader;
    } ]);
});
//# sourceMappingURL=react-virtualized.js.map