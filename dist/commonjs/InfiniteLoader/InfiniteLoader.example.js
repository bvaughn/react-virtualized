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

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var React = _interopRequireWildcard(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _ContentBox = require('../demo/ContentBox');

var _immutable = _interopRequireDefault(require('immutable'));

var _AutoSizer = _interopRequireDefault(require('../AutoSizer'));

var _InfiniteLoader = _interopRequireDefault(require('./InfiniteLoader'));

var _List = _interopRequireDefault(require('../List'));

var _InfiniteLoaderExample = _interopRequireDefault(
  require('./InfiniteLoader.example.css'),
);

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
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

var STATUS_LOADING = 1;
var STATUS_LOADED = 2;

var InfiniteLoaderExample = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(InfiniteLoaderExample, _React$PureComponent);

  var _super = _createSuper(InfiniteLoaderExample);

  function InfiniteLoaderExample(props) {
    var _this;

    (0, _classCallCheck2['default'])(this, InfiniteLoaderExample);
    _this = _super.call(this, props);
    _this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    };
    _this._timeoutIdMap = {};
    _this._clearData = _this._clearData.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._isRowLoaded = _this._isRowLoaded.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._loadMoreRows = _this._loadMoreRows.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._rowRenderer = _this._rowRenderer.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    return _this;
  }

  (0, _createClass2['default'])(InfiniteLoaderExample, [
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        Object.keys(this._timeoutIdMap).forEach(function(timeoutId) {
          clearTimeout(timeoutId);
        });
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var list = this.context.list;
        var _this$state = this.state,
          loadedRowCount = _this$state.loadedRowCount,
          loadingRowCount = _this$state.loadingRowCount;
        return /*#__PURE__*/ React.createElement(
          _ContentBox.ContentBox,
          null,
          /*#__PURE__*/ React.createElement(_ContentBox.ContentBoxHeader, {
            text: 'InfiniteLoader',
            sourceLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/source/InfiniteLoader/InfiniteLoader.example.js',
            docsLink:
              'https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md',
          }),
          /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBoxParagraph,
            null,
            'This component manages just-in-time data fetching to ensure that the all visible rows have been loaded. It also uses a threshold to determine how early to pre-fetch rows (before a user scrolls to them).',
          ),
          /*#__PURE__*/ React.createElement(
            _ContentBox.ContentBoxParagraph,
            null,
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className:
                  _InfiniteLoaderExample['default'].cacheButtonAndCountRow,
              },
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: _InfiniteLoaderExample['default'].button,
                  onClick: this._clearData,
                },
                'Flush Cached Data',
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: _InfiniteLoaderExample['default'].cacheCountRow,
                },
                loadingRowCount,
                ' loading, ',
                loadedRowCount,
                ' loaded',
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            _InfiniteLoader['default'],
            {
              isRowLoaded: this._isRowLoaded,
              loadMoreRows: this._loadMoreRows,
              rowCount: list.size,
            },
            function(_ref) {
              var onRowsRendered = _ref.onRowsRendered,
                registerChild = _ref.registerChild;
              return /*#__PURE__*/ React.createElement(
                _AutoSizer['default'],
                {
                  disableHeight: true,
                },
                function(_ref2) {
                  var width = _ref2.width;
                  return /*#__PURE__*/ React.createElement(_List['default'], {
                    ref: registerChild,
                    className: _InfiniteLoaderExample['default'].List,
                    height: 200,
                    onRowsRendered: onRowsRendered,
                    rowCount: list.size,
                    rowHeight: 30,
                    rowRenderer: _this2._rowRenderer,
                    width: width,
                  });
                },
              );
            },
          ),
        );
      },
    },
    {
      key: '_clearData',
      value: function _clearData() {
        this.setState({
          loadedRowCount: 0,
          loadedRowsMap: {},
          loadingRowCount: 0,
        });
      },
    },
    {
      key: '_isRowLoaded',
      value: function _isRowLoaded(_ref3) {
        var index = _ref3.index;
        var loadedRowsMap = this.state.loadedRowsMap;
        return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
      },
    },
    {
      key: '_loadMoreRows',
      value: function _loadMoreRows(_ref4) {
        var _this3 = this;

        var startIndex = _ref4.startIndex,
          stopIndex = _ref4.stopIndex;
        var _this$state2 = this.state,
          loadedRowsMap = _this$state2.loadedRowsMap,
          loadingRowCount = _this$state2.loadingRowCount;
        var increment = stopIndex - startIndex + 1;

        for (var i = startIndex; i <= stopIndex; i++) {
          loadedRowsMap[i] = STATUS_LOADING;
        }

        this.setState({
          loadingRowCount: loadingRowCount + increment,
        });
        var timeoutId = setTimeout(function() {
          var _this3$state = _this3.state,
            loadedRowCount = _this3$state.loadedRowCount,
            loadingRowCount = _this3$state.loadingRowCount;
          delete _this3._timeoutIdMap[timeoutId];

          for (var i = startIndex; i <= stopIndex; i++) {
            loadedRowsMap[i] = STATUS_LOADED;
          }

          _this3.setState({
            loadingRowCount: loadingRowCount - increment,
            loadedRowCount: loadedRowCount + increment,
          });

          promiseResolver();
        }, 1000 + Math.round(Math.random() * 2000));
        this._timeoutIdMap[timeoutId] = true;
        var promiseResolver;
        return new Promise(function(resolve) {
          promiseResolver = resolve;
        });
      },
    },
    {
      key: '_rowRenderer',
      value: function _rowRenderer(_ref5) {
        var index = _ref5.index,
          key = _ref5.key,
          style = _ref5.style;
        var list = this.context.list;
        var loadedRowsMap = this.state.loadedRowsMap;
        var row = list.get(index);
        var content;

        if (loadedRowsMap[index] === STATUS_LOADED) {
          content = row.name;
        } else {
          content = /*#__PURE__*/ React.createElement('div', {
            className: _InfiniteLoaderExample['default'].placeholder,
            style: {
              width: row.size,
            },
          });
        }

        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: _InfiniteLoaderExample['default'].row,
            key: key,
            style: style,
          },
          content,
        );
      },
    },
  ]);
  return InfiniteLoaderExample;
})(React.PureComponent);

exports['default'] = InfiniteLoaderExample;
(0, _defineProperty2['default'])(InfiniteLoaderExample, 'contextTypes', {
  list: _propTypes['default'].instanceOf(_immutable['default'].List).isRequired,
});
