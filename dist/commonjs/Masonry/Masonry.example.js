"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _immutable = _interopRequireDefault(require("immutable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _ContentBox = require("../demo/ContentBox");

var _LabeledInput = require("../demo/LabeledInput");

var _CellMeasurer = require("../CellMeasurer");

var _AutoSizer = _interopRequireDefault(require("../AutoSizer"));

var _WindowScroller = _interopRequireDefault(require("../WindowScroller"));

var _createCellPositioner = _interopRequireDefault(require("./createCellPositioner"));

var _Masonry = _interopRequireDefault(require("./Masonry"));

var _MasonryExample = _interopRequireDefault(require("./Masonry.example.css"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var GridExample =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(GridExample, _React$PureComponent);

  function GridExample(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, GridExample);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GridExample).call(this, props, context));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resetList", function () {
      var ROW_HEIGHTS = [25, 50, 75, 100];
      var list = _this.context.list;
      list.forEach(function (datum) {
        datum.size = ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)];
      });

      _this._cache.clearAll();

      _this._resetCellPositioner();

      _this._masonry.clearCellPositions();
    });
    _this._columnCount = 0;
    _this._cache = new _CellMeasurer.CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true
    });
    _this.state = {
      columnWidth: 200,
      height: 300,
      gutterSize: 10,
      overscanByPixels: 0,
      windowScrollerEnabled: false
    };
    _this._cellRenderer = _this._cellRenderer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._onResize = _this._onResize.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderAutoSizer = _this._renderAutoSizer.bind((0, _assertThisInitialized2["default"])(_this));
    _this._renderMasonry = _this._renderMasonry.bind((0, _assertThisInitialized2["default"])(_this));
    _this._setMasonryRef = _this._setMasonryRef.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(GridExample, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          columnWidth = _this$state.columnWidth,
          height = _this$state.height,
          gutterSize = _this$state.gutterSize,
          overscanByPixels = _this$state.overscanByPixels,
          windowScrollerEnabled = _this$state.windowScrollerEnabled;
      var child;

      if (windowScrollerEnabled) {
        child = React.createElement(_WindowScroller["default"], {
          overscanByPixels: overscanByPixels
        }, this._renderAutoSizer);
      } else {
        child = this._renderAutoSizer({
          height: height
        });
      }

      return React.createElement(_ContentBox.ContentBox, null, React.createElement(_ContentBox.ContentBoxHeader, {
        text: "Masonry",
        sourceLink: "https://github.com/bvaughn/react-virtualized/blob/master/source/Masonry/Masonry.example.js",
        docsLink: "https://github.com/bvaughn/react-virtualized/blob/master/docs/Masonry.md"
      }), React.createElement(_ContentBox.ContentBoxParagraph, null, "Optimized for masonry layouts. Cells are j.i.t. measured and layed out as a user scrolls. Sizes are cached so that resize/reflow is fast and does not require re-measuring."), React.createElement(_ContentBox.ContentBoxParagraph, null, React.createElement("label", {
        className: _MasonryExample["default"].checkboxLabel
      }, React.createElement("input", {
        "aria-label": "Use WindowScroller?",
        checked: windowScrollerEnabled,
        className: _MasonryExample["default"].checkbox,
        type: "checkbox",
        onChange: function onChange(event) {
          // HACK Because this demo switches between using WindowScroller and not,
          // It's easier to clear the cache when toggling modes to avoid a partially stale state.
          _this2._cache.clearAll();

          _this2.setState({
            windowScrollerEnabled: event.target.checked
          });
        }
      }), "Use ", React.createElement("code", null, "WindowScroller"), "?"), React.createElement("label", {
        className: _MasonryExample["default"].checkboxLabel
      }, React.createElement("button", {
        onClick: this._resetList
      }, "Reset List Data"))), React.createElement(_LabeledInput.InputRow, null, React.createElement(_LabeledInput.LabeledInput, {
        label: "Height",
        name: "height",
        onChange: function onChange(event) {
          _this2.setState({
            height: parseInt(event.target.value, 10) || 300
          });
        },
        value: height
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Column Width",
        name: "columnWidth",
        onChange: function onChange(event) {
          _this2._cache.clearAll();

          _this2.setState({
            columnWidth: parseInt(event.target.value, 10) || 200
          }, function () {
            _this2._calculateColumnCount();

            _this2._resetCellPositioner();

            _this2._masonry.clearCellPositions();
          });
        },
        value: columnWidth
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Gutter Size",
        name: "gutterSize",
        onChange: function onChange(event) {
          _this2.setState({
            gutterSize: parseInt(event.target.value, 10) || 10
          }, function () {
            _this2._calculateColumnCount();

            _this2._resetCellPositioner();

            _this2._masonry.recomputeCellPositions();
          });
        },
        value: gutterSize
      }), React.createElement(_LabeledInput.LabeledInput, {
        label: "Overscan (px)",
        name: "overscanByPixels",
        onChange: function onChange(event) {
          _this2.setState({
            overscanByPixels: parseInt(event.target.value, 10) || 0
          });
        },
        value: overscanByPixels
      })), child);
    }
  }, {
    key: "_calculateColumnCount",
    value: function _calculateColumnCount() {
      var _this$state2 = this.state,
          columnWidth = _this$state2.columnWidth,
          gutterSize = _this$state2.gutterSize;
      this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
    }
  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref) {
      var index = _ref.index,
          key = _ref.key,
          parent = _ref.parent,
          style = _ref.style;
      var list = this.context.list;
      var columnWidth = this.state.columnWidth;
      var datum = list.get(index % list.size);
      return React.createElement(_CellMeasurer.CellMeasurer, {
        cache: this._cache,
        index: index,
        key: key,
        parent: parent
      }, React.createElement("div", {
        className: _MasonryExample["default"].Cell,
        style: _objectSpread({}, style, {
          width: columnWidth
        })
      }, React.createElement("div", {
        style: {
          backgroundColor: datum.color,
          borderRadius: '0.5rem',
          height: datum.size * 3,
          marginBottom: '0.5rem',
          width: '100%',
          fontSize: 20,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, index), datum.random));
    }
  }, {
    key: "_initCellPositioner",
    value: function _initCellPositioner() {
      if (typeof this._cellPositioner === 'undefined') {
        var _this$state3 = this.state,
            columnWidth = _this$state3.columnWidth,
            gutterSize = _this$state3.gutterSize;
        this._cellPositioner = (0, _createCellPositioner["default"])({
          cellMeasurerCache: this._cache,
          columnCount: this._columnCount,
          columnWidth: columnWidth,
          spacer: gutterSize
        });
      }
    }
  }, {
    key: "_onResize",
    value: function _onResize(_ref2) {
      var width = _ref2.width;
      this._width = width;

      this._calculateColumnCount();

      this._resetCellPositioner();

      this._masonry.recomputeCellPositions();
    }
  }, {
    key: "_renderAutoSizer",
    value: function _renderAutoSizer(_ref3) {
      var height = _ref3.height,
          scrollTop = _ref3.scrollTop;
      this._height = height;
      this._scrollTop = scrollTop;
      var overscanByPixels = this.state.overscanByPixels;
      return React.createElement(_AutoSizer["default"], {
        disableHeight: true,
        height: height,
        onResize: this._onResize,
        overscanByPixels: overscanByPixels,
        scrollTop: this._scrollTop
      }, this._renderMasonry);
    }
  }, {
    key: "_renderMasonry",
    value: function _renderMasonry(_ref4) {
      var width = _ref4.width;
      this._width = width;

      this._calculateColumnCount();

      this._initCellPositioner();

      var _this$state4 = this.state,
          height = _this$state4.height,
          overscanByPixels = _this$state4.overscanByPixels,
          windowScrollerEnabled = _this$state4.windowScrollerEnabled;
      return React.createElement(_Masonry["default"], {
        autoHeight: windowScrollerEnabled,
        cellCount: 1000,
        cellMeasurerCache: this._cache,
        cellPositioner: this._cellPositioner,
        cellRenderer: this._cellRenderer,
        height: windowScrollerEnabled ? this._height : height,
        overscanByPixels: overscanByPixels,
        ref: this._setMasonryRef,
        scrollTop: this._scrollTop,
        width: width
      });
    } // This is a bit of a hack to simulate newly loaded cells

  }, {
    key: "_resetCellPositioner",
    value: function _resetCellPositioner() {
      var _this$state5 = this.state,
          columnWidth = _this$state5.columnWidth,
          gutterSize = _this$state5.gutterSize;

      this._cellPositioner.reset({
        columnCount: this._columnCount,
        columnWidth: columnWidth,
        spacer: gutterSize
      });
    }
  }, {
    key: "_setMasonryRef",
    value: function _setMasonryRef(ref) {
      this._masonry = ref;
    }
  }]);
  return GridExample;
}(React.PureComponent);

exports["default"] = GridExample;
(0, _defineProperty2["default"])(GridExample, "contextTypes", {
  list: _propTypes["default"].instanceOf(_immutable["default"].List).isRequired
});