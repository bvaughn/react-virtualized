import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _defineProperty from '@babel/runtime/helpers/defineProperty';

var _class, _temp;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
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

import clsx from 'clsx';
import * as React from 'react';
import {polyfill} from 'react-lifecycles-compat';
import PositionCache from './PositionCache';
import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../utils/requestAnimationTimeout';
var emptyObject = {};
/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */

export var DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;
/**
 * This component efficiently displays arbitrarily positioned cells using windowing techniques.
 * Cell position is determined by an injected `cellPositioner` property.
 * Windowing is vertical; this component does not support horizontal scrolling.
 *
 * Rendering occurs in two phases:
 * 1) First pass uses estimated cell sizes (provided by the cache) to determine how many cells to measure in a batch.
 *    Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled.
 *    After measurement is complete (componentDidMount or componentDidUpdate) this component evaluates positioned cells
 *    in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes).
 *    All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.
 * 2) Second pass uses the external `cellPositioner` to layout cells.
 *    At this time the positioner has access to cached size measurements for all cells.
 *    The positions it returns are cached by Masonry for fast access later.
 *    Phase one is repeated if the user scrolls beyond the current layout's bounds.
 *    If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()`.
 *
 * Animation constraints:
 *   Simple animations are supported (eg translate/slide into place on initial reveal).
 *   More complex animations are not (eg flying from one position to another on resize).
 *
 * Layout constraints:
 *   This component supports multi-column layout.
 *   The height of each item may vary.
 *   The width of each item must not exceed the width of the column it is "in".
 *   The left position of all items within a column must align.
 *   (Items may not span multiple columns.)
 */

var Masonry =
  ((_temp = _class = /*#__PURE__*/ (function(_React$PureComponent) {
    _inherits(Masonry, _React$PureComponent);

    var _super = _createSuper(Masonry);

    function Masonry() {
      var _this;

      _classCallCheck(this, Masonry);

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), 'state', {
        isScrolling: false,
        scrollTop: 0,
      });

      _defineProperty(
        _assertThisInitialized(_this),
        '_debounceResetIsScrollingId',
        void 0,
      );

      _defineProperty(
        _assertThisInitialized(_this),
        '_invalidateOnUpdateStartIndex',
        null,
      );

      _defineProperty(
        _assertThisInitialized(_this),
        '_invalidateOnUpdateStopIndex',
        null,
      );

      _defineProperty(
        _assertThisInitialized(_this),
        '_positionCache',
        new PositionCache(),
      );

      _defineProperty(_assertThisInitialized(_this), '_startIndex', null);

      _defineProperty(
        _assertThisInitialized(_this),
        '_startIndexMemoized',
        null,
      );

      _defineProperty(_assertThisInitialized(_this), '_stopIndex', null);

      _defineProperty(
        _assertThisInitialized(_this),
        '_stopIndexMemoized',
        null,
      );

      _defineProperty(
        _assertThisInitialized(_this),
        '_debounceResetIsScrollingCallback',
        function() {
          _this.setState({
            isScrolling: false,
          });
        },
      );

      _defineProperty(
        _assertThisInitialized(_this),
        '_setScrollingContainerRef',
        function(ref) {
          _this._scrollingContainer = ref;
        },
      );

      _defineProperty(_assertThisInitialized(_this), '_onScroll', function(
        event,
      ) {
        var height = _this.props.height;
        var eventScrollTop = event.currentTarget.scrollTop; // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
        // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
        // This causes a series of rapid renders that is slow for long lists.
        // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.

        var scrollTop = Math.min(
          Math.max(0, _this._getEstimatedTotalHeight() - height),
          eventScrollTop,
        ); // On iOS, we can arrive at negative offsets by swiping past the start or end.
        // Avoid re-rendering in this case as it can cause problems; see #532 for more.

        if (eventScrollTop !== scrollTop) {
          return;
        } // Prevent pointer events from interrupting a smooth scroll

        _this._debounceResetIsScrolling(); // Certain devices (like Apple touchpad) rapid-fire duplicate events.
        // Don't force a re-render if this is the case.
        // The mouse may move faster then the animation frame does.
        // Use requestAnimationFrame to avoid over-updating.

        if (_this.state.scrollTop !== scrollTop) {
          _this.setState({
            isScrolling: true,
            scrollTop: scrollTop,
          });
        }
      });

      return _this;
    }

    _createClass(
      Masonry,
      [
        {
          key: 'clearCellPositions',
          value: function clearCellPositions() {
            this._positionCache = new PositionCache();
            this.forceUpdate();
          }, // HACK This method signature was intended for Grid
        },
        {
          key: 'invalidateCellSizeAfterRender',
          value: function invalidateCellSizeAfterRender(_ref) {
            var index = _ref.rowIndex;

            if (this._invalidateOnUpdateStartIndex === null) {
              this._invalidateOnUpdateStartIndex = index;
              this._invalidateOnUpdateStopIndex = index;
            } else {
              this._invalidateOnUpdateStartIndex = Math.min(
                this._invalidateOnUpdateStartIndex,
                index,
              );
              this._invalidateOnUpdateStopIndex = Math.max(
                this._invalidateOnUpdateStopIndex,
                index,
              );
            }
          },
        },
        {
          key: 'recomputeCellPositions',
          value: function recomputeCellPositions() {
            var stopIndex = this._positionCache.count - 1;
            this._positionCache = new PositionCache();

            this._populatePositionCache(0, stopIndex);

            this.forceUpdate();
          },
        },
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            this._checkInvalidateOnUpdate();

            this._invokeOnScrollCallback();

            this._invokeOnCellsRenderedCallback();
          },
        },
        {
          key: 'componentDidUpdate',
          value: function componentDidUpdate(prevProps, prevState) {
            this._checkInvalidateOnUpdate();

            this._invokeOnScrollCallback();

            this._invokeOnCellsRenderedCallback();

            if (this.props.scrollTop !== prevProps.scrollTop) {
              this._debounceResetIsScrolling();
            }
          },
        },
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            if (this._debounceResetIsScrollingId) {
              cancelAnimationTimeout(this._debounceResetIsScrollingId);
            }
          },
        },
        {
          key: 'render',
          value: function render() {
            var _this2 = this;

            var _this$props = this.props,
              autoHeight = _this$props.autoHeight,
              cellCount = _this$props.cellCount,
              cellMeasurerCache = _this$props.cellMeasurerCache,
              cellRenderer = _this$props.cellRenderer,
              className = _this$props.className,
              height = _this$props.height,
              id = _this$props.id,
              keyMapper = _this$props.keyMapper,
              overscanByPixels = _this$props.overscanByPixels,
              role = _this$props.role,
              style = _this$props.style,
              tabIndex = _this$props.tabIndex,
              width = _this$props.width,
              rowDirection = _this$props.rowDirection;
            var _this$state = this.state,
              isScrolling = _this$state.isScrolling,
              scrollTop = _this$state.scrollTop;
            var children = [];

            var estimateTotalHeight = this._getEstimatedTotalHeight();

            var shortestColumnSize = this._positionCache.shortestColumnSize;
            var measuredCellCount = this._positionCache.count;
            var startIndex = 0;
            var stopIndex;

            this._positionCache.range(
              Math.max(0, scrollTop - overscanByPixels),
              height + overscanByPixels * 2,
              function(index, left, top) {
                var _style;

                if (typeof stopIndex === 'undefined') {
                  startIndex = index;
                  stopIndex = index;
                } else {
                  startIndex = Math.min(startIndex, index);
                  stopIndex = Math.max(stopIndex, index);
                }

                children.push(
                  cellRenderer({
                    index: index,
                    isScrolling: isScrolling,
                    key: keyMapper(index),
                    parent: _this2,
                    style:
                      ((_style = {
                        height: cellMeasurerCache.getHeight(index),
                      }),
                      _defineProperty(
                        _style,
                        rowDirection === 'ltr' ? 'left' : 'right',
                        left,
                      ),
                      _defineProperty(_style, 'position', 'absolute'),
                      _defineProperty(_style, 'top', top),
                      _defineProperty(
                        _style,
                        'width',
                        cellMeasurerCache.getWidth(index),
                      ),
                      _style),
                  }),
                );
              },
            ); // We need to measure additional cells for this layout

            if (
              shortestColumnSize < scrollTop + height + overscanByPixels &&
              measuredCellCount < cellCount
            ) {
              var batchSize = Math.min(
                cellCount - measuredCellCount,
                Math.ceil(
                  (((scrollTop +
                    height +
                    overscanByPixels -
                    shortestColumnSize) /
                    cellMeasurerCache.defaultHeight) *
                    width) /
                    cellMeasurerCache.defaultWidth,
                ),
              );

              for (
                var _index = measuredCellCount;
                _index < measuredCellCount + batchSize;
                _index++
              ) {
                stopIndex = _index;
                children.push(
                  cellRenderer({
                    index: _index,
                    isScrolling: isScrolling,
                    key: keyMapper(_index),
                    parent: this,
                    style: {
                      width: cellMeasurerCache.getWidth(_index),
                    },
                  }),
                );
              }
            }

            this._startIndex = startIndex;
            this._stopIndex = stopIndex;
            return /*#__PURE__*/ React.createElement(
              'div',
              {
                ref: this._setScrollingContainerRef,
                'aria-label': this.props['aria-label'],
                className: clsx('ReactVirtualized__Masonry', className),
                id: id,
                onScroll: this._onScroll,
                role: role,
                style: _objectSpread(
                  {
                    boxSizing: 'border-box',
                    direction: 'ltr',
                    height: autoHeight ? 'auto' : height,
                    overflowX: 'hidden',
                    overflowY: estimateTotalHeight < height ? 'hidden' : 'auto',
                    position: 'relative',
                    width: width,
                    WebkitOverflowScrolling: 'touch',
                    willChange: 'transform',
                  },
                  style,
                ),
                tabIndex: tabIndex,
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'ReactVirtualized__Masonry__innerScrollContainer',
                  style: {
                    width: '100%',
                    height: estimateTotalHeight,
                    maxWidth: '100%',
                    maxHeight: estimateTotalHeight,
                    overflow: 'hidden',
                    pointerEvents: isScrolling ? 'none' : '',
                    position: 'relative',
                  },
                },
                children,
              ),
            );
          },
        },
        {
          key: '_checkInvalidateOnUpdate',
          value: function _checkInvalidateOnUpdate() {
            if (typeof this._invalidateOnUpdateStartIndex === 'number') {
              var startIndex = this._invalidateOnUpdateStartIndex;
              var stopIndex = this._invalidateOnUpdateStopIndex;
              this._invalidateOnUpdateStartIndex = null;
              this._invalidateOnUpdateStopIndex = null; // Query external layout logic for position of newly-measured cells

              this._populatePositionCache(startIndex, stopIndex);

              this.forceUpdate();
            }
          },
        },
        {
          key: '_debounceResetIsScrolling',
          value: function _debounceResetIsScrolling() {
            var scrollingResetTimeInterval = this.props
              .scrollingResetTimeInterval;

            if (this._debounceResetIsScrollingId) {
              cancelAnimationTimeout(this._debounceResetIsScrollingId);
            }

            this._debounceResetIsScrollingId = requestAnimationTimeout(
              this._debounceResetIsScrollingCallback,
              scrollingResetTimeInterval,
            );
          },
        },
        {
          key: '_getEstimatedTotalHeight',
          value: function _getEstimatedTotalHeight() {
            var _this$props2 = this.props,
              cellCount = _this$props2.cellCount,
              cellMeasurerCache = _this$props2.cellMeasurerCache,
              width = _this$props2.width;
            var estimatedColumnCount = Math.max(
              1,
              Math.floor(width / cellMeasurerCache.defaultWidth),
            );
            return this._positionCache.estimateTotalHeight(
              cellCount,
              estimatedColumnCount,
              cellMeasurerCache.defaultHeight,
            );
          },
        },
        {
          key: '_invokeOnScrollCallback',
          value: function _invokeOnScrollCallback() {
            var _this$props3 = this.props,
              height = _this$props3.height,
              onScroll = _this$props3.onScroll;
            var scrollTop = this.state.scrollTop;

            if (this._onScrollMemoized !== scrollTop) {
              onScroll({
                clientHeight: height,
                scrollHeight: this._getEstimatedTotalHeight(),
                scrollTop: scrollTop,
              });
              this._onScrollMemoized = scrollTop;
            }
          },
        },
        {
          key: '_invokeOnCellsRenderedCallback',
          value: function _invokeOnCellsRenderedCallback() {
            if (
              this._startIndexMemoized !== this._startIndex ||
              this._stopIndexMemoized !== this._stopIndex
            ) {
              var onCellsRendered = this.props.onCellsRendered;
              onCellsRendered({
                startIndex: this._startIndex,
                stopIndex: this._stopIndex,
              });
              this._startIndexMemoized = this._startIndex;
              this._stopIndexMemoized = this._stopIndex;
            }
          },
        },
        {
          key: '_populatePositionCache',
          value: function _populatePositionCache(startIndex, stopIndex) {
            var _this$props4 = this.props,
              cellMeasurerCache = _this$props4.cellMeasurerCache,
              cellPositioner = _this$props4.cellPositioner;

            for (var _index2 = startIndex; _index2 <= stopIndex; _index2++) {
              var _cellPositioner = cellPositioner(_index2),
                left = _cellPositioner.left,
                top = _cellPositioner.top;

              this._positionCache.setPosition(
                _index2,
                left,
                top,
                cellMeasurerCache.getHeight(_index2),
              );
            }
          },
        },
      ],
      [
        {
          key: 'getDerivedStateFromProps',
          value: function getDerivedStateFromProps(nextProps, prevState) {
            if (
              nextProps.scrollTop !== undefined &&
              prevState.scrollTop !== nextProps.scrollTop
            ) {
              return {
                isScrolling: true,
                scrollTop: nextProps.scrollTop,
              };
            }

            return null;
          },
        },
      ],
    );

    return Masonry;
  })(React.PureComponent)),
  _defineProperty(
    _class,
    'propTypes',
    process.env.NODE_ENV === 'production'
      ? null
      : {
          autoHeight: PropTypes.bool.isRequired,
          cellCount: PropTypes.number.isRequired,
          cellMeasurerCache: function cellMeasurerCache() {
            return (typeof CellMeasurerCache === 'function'
              ? PropTypes.instanceOf(CellMeasurerCache).isRequired
              : PropTypes.any.isRequired
            ).apply(this, arguments);
          },
          cellPositioner: function cellPositioner() {
            return (typeof Positioner === 'function'
              ? PropTypes.instanceOf(Positioner).isRequired
              : PropTypes.any.isRequired
            ).apply(this, arguments);
          },
          cellRenderer: function cellRenderer() {
            return (typeof CellRenderer === 'function'
              ? PropTypes.instanceOf(CellRenderer).isRequired
              : PropTypes.any.isRequired
            ).apply(this, arguments);
          },
          className: PropTypes.string,
          height: PropTypes.number.isRequired,
          id: PropTypes.string,
          keyMapper: function keyMapper() {
            return (typeof KeyMapper === 'function'
              ? PropTypes.instanceOf(KeyMapper).isRequired
              : PropTypes.any.isRequired
            ).apply(this, arguments);
          },
          onCellsRendered: function onCellsRendered() {
            return (typeof OnCellsRenderedCallback === 'function'
              ? PropTypes.instanceOf(OnCellsRenderedCallback)
              : PropTypes.any
            ).apply(this, arguments);
          },
          onScroll: function onScroll() {
            return (typeof OnScrollCallback === 'function'
              ? PropTypes.instanceOf(OnScrollCallback)
              : PropTypes.any
            ).apply(this, arguments);
          },
          overscanByPixels: PropTypes.number.isRequired,
          role: PropTypes.string.isRequired,
          scrollingResetTimeInterval: PropTypes.number.isRequired,
          style: function style(props, propName, componentName) {
            if (!Object.prototype.hasOwnProperty.call(props, propName)) {
              throw new Error(
                'Prop `'
                  .concat(
                    propName,
                    "` has type 'any' or 'mixed', but was not provided to `",
                  )
                  .concat(
                    componentName,
                    '`. Pass undefined or any other value.',
                  ),
              );
            }
          },
          tabIndex: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          rowDirection: PropTypes.string.isRequired,
          scrollTop: PropTypes.number,
        },
  ),
  _temp);

_defineProperty(Masonry, 'defaultProps', {
  autoHeight: false,
  keyMapper: identity,
  onCellsRendered: noop,
  onScroll: noop,
  overscanByPixels: 20,
  role: 'grid',
  scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
  style: emptyObject,
  tabIndex: 0,
  rowDirection: 'ltr',
});

function identity(value) {
  return value;
}

function noop() {}

var bpfrpt_proptype_CellMeasurerCache =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        defaultHeight: PropTypes.number.isRequired,
        defaultWidth: PropTypes.number.isRequired,
        getHeight: PropTypes.func.isRequired,
        getWidth: PropTypes.func.isRequired,
      };
polyfill(Masonry);
export default Masonry;
var bpfrpt_proptype_Positioner =
  process.env.NODE_ENV === 'production' ? null : PropTypes.func;
import {bpfrpt_proptype_AnimationTimeoutId} from '../utils/requestAnimationTimeout';
import PropTypes from 'prop-types';
export {bpfrpt_proptype_CellMeasurerCache};
export {bpfrpt_proptype_Positioner};
