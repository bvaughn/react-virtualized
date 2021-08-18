'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf3 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var _clsx2 = _interopRequireDefault(require('clsx'));

var _immutable = _interopRequireDefault(require('immutable'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var React = _interopRequireWildcard(require('react'));

var _ContentBox = require('../demo/ContentBox');

var _LabeledInput = require('../demo/LabeledInput');

var _WindowScroller = _interopRequireDefault(require('./WindowScroller'));

var _List = _interopRequireDefault(require('../List'));

var _AutoSizer = _interopRequireDefault(require('../AutoSizer'));

var _WindowScrollerExample = _interopRequireDefault(
  require('./WindowScroller.example.css'),
);

var WindowScrollerExample =
  /*#__PURE__*/
  (function(_React$PureComponent) {
    (0, _inherits2['default'])(WindowScrollerExample, _React$PureComponent);

    function WindowScrollerExample() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2['default'])(this, WindowScrollerExample);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2['default'])(
        this,
        (_getPrototypeOf2 = (0, _getPrototypeOf3['default'])(
          WindowScrollerExample,
        )).call.apply(_getPrototypeOf2, [this].concat(args)),
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        'state',
        {
          scrollToIndex: -1,
          showHeaderText: true,
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_windowScroller',
        void 0,
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_hideHeader',
        function() {
          var showHeaderText = _this.state.showHeaderText;

          _this.setState(
            {
              showHeaderText: !showHeaderText,
            },
            function() {
              if (_this._windowScroller) {
                _this._windowScroller.updatePosition();
              }
            },
          );
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_rowRenderer',
        function(_ref) {
          var _clsx;

          var index = _ref.index,
            isScrolling = _ref.isScrolling,
            isVisible = _ref.isVisible,
            key = _ref.key,
            style = _ref.style;
          var list = _this.context.list;
          var row = list.get(index);
          var className = (0, _clsx2['default'])(
            _WindowScrollerExample['default'].row,
            ((_clsx = {}),
            (0, _defineProperty2['default'])(
              _clsx,
              _WindowScrollerExample['default'].rowScrolling,
              isScrolling,
            ),
            (0, _defineProperty2['default'])(_clsx, 'isVisible', isVisible),
            _clsx),
          );
          return React.createElement(
            'div',
            {
              key: key,
              className: className,
              style: style,
            },
            row.name,
          );
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_setRef',
        function(windowScroller) {
          _this._windowScroller = windowScroller;
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onCheckboxChange',
        function(event) {
          _this.context.setScrollingCustomElement(event.target.checked);
        },
      );
      (0, _defineProperty2['default'])(
        (0, _assertThisInitialized2['default'])(_this),
        '_onScrollToRowChange',
        function(event) {
          var list = _this.context.list;
          var scrollToIndex = Math.min(
            list.size - 1,
            parseInt(event.target.value, 10),
          );

          if (isNaN(scrollToIndex)) {
            scrollToIndex = undefined;
          }

          setTimeout(function() {
            _this.setState({
              scrollToIndex: scrollToIndex,
            });
          }, 0);
        },
      );
      return _this;
    }

    (0, _createClass2['default'])(WindowScrollerExample, [
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var _this$context = this.context,
            customElement = _this$context.customElement,
            isScrollingCustomElement = _this$context.isScrollingCustomElement,
            list = _this$context.list;
          var _this$state = this.state,
            scrollToIndex = _this$state.scrollToIndex,
            showHeaderText = _this$state.showHeaderText;
          return React.createElement(
            _ContentBox.ContentBox,
            null,
            React.createElement(_ContentBox.ContentBoxHeader, {
              text: 'WindowScroller',
              sourceLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/source/WindowScroller/WindowScroller.example.js',
              docsLink:
                'https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md',
            }),
            showHeaderText &&
              React.createElement(
                _ContentBox.ContentBoxParagraph,
                null,
                'This component decorates ',
                React.createElement('code', null, 'List'),
                ', ',
                React.createElement('code', null, 'Table'),
                ', or any other component and manages the window scroll to scroll through the list',
              ),
            showHeaderText &&
              React.createElement(
                _ContentBox.ContentBoxParagraph,
                null,
                React.createElement(
                  'button',
                  {
                    onClick: this._hideHeader,
                  },
                  'Hide header text',
                ),
              ),
            React.createElement(
              _ContentBox.ContentBoxParagraph,
              null,
              React.createElement(
                'label',
                {
                  className: _WindowScrollerExample['default'].checkboxLabel,
                },
                React.createElement('input', {
                  'aria-label': 'Use custom element for scrolling',
                  className: _WindowScrollerExample['default'].checkbox,
                  type: 'checkbox',
                  checked: isScrollingCustomElement,
                  onChange: this._onCheckboxChange,
                }),
                'Use custom element for scrolling',
              ),
            ),
            React.createElement(
              _LabeledInput.InputRow,
              null,
              React.createElement(_LabeledInput.LabeledInput, {
                label: 'Scroll to',
                name: 'onScrollToRow',
                placeholder: 'Index...',
                onChange: this._onScrollToRowChange,
                value: scrollToIndex || '',
              }),
            ),
            React.createElement(
              _WindowScroller['default'],
              {
                ref: this._setRef,
                scrollElement: isScrollingCustomElement
                  ? customElement
                  : window,
              },
              function(_ref2) {
                var height = _ref2.height,
                  isScrolling = _ref2.isScrolling,
                  registerChild = _ref2.registerChild,
                  onChildScroll = _ref2.onChildScroll,
                  scrollTop = _ref2.scrollTop;
                return React.createElement(
                  'div',
                  {
                    className:
                      _WindowScrollerExample['default'].WindowScrollerWrapper,
                  },
                  React.createElement(
                    _AutoSizer['default'],
                    {
                      disableHeight: true,
                    },
                    function(_ref3) {
                      var width = _ref3.width;
                      return React.createElement(
                        'div',
                        {
                          ref: registerChild,
                        },
                        React.createElement(_List['default'], {
                          ref: function ref(el) {
                            window.listEl = el;
                          },
                          autoHeight: true,
                          className: _WindowScrollerExample['default'].List,
                          height: height,
                          isScrolling: isScrolling,
                          onScroll: onChildScroll,
                          overscanRowCount: 2,
                          rowCount: list.size,
                          rowHeight: 30,
                          rowRenderer: _this2._rowRenderer,
                          scrollToIndex: scrollToIndex,
                          scrollTop: scrollTop,
                          width: width,
                        }),
                      );
                    },
                  ),
                );
              },
            ),
          );
        },
      },
    ]);
    return WindowScrollerExample;
  })(React.PureComponent);

exports['default'] = WindowScrollerExample;
(0, _defineProperty2['default'])(WindowScrollerExample, 'contextTypes', {
  customElement: _propTypes['default'].any,
  isScrollingCustomElement: _propTypes['default'].bool.isRequired,
  list: _propTypes['default'].instanceOf(_immutable['default'].List).isRequired,
  setScrollingCustomElement: _propTypes['default'].func,
});
