import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PureComponent } from 'react';
import cn from 'classnames';
import PositionCache from './PositionCache';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../utils/requestAnimationTimeout';

var babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId = require('../utils/requestAnimationTimeout').babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId || require('prop-types').any;

var emptyObject = {};

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
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

var Masonry = function (_PureComponent) {
  _inherits(Masonry, _PureComponent);

  function Masonry(props, context) {
    _classCallCheck(this, Masonry);

    var _this = _possibleConstructorReturn(this, (Masonry.__proto__ || _Object$getPrototypeOf(Masonry)).call(this, props, context));

    _this._invalidateOnUpdateStartIndex = null;
    _this._invalidateOnUpdateStopIndex = null;
    _this._positionCache = new PositionCache();
    _this._startIndex = null;
    _this._startIndexMemoized = null;
    _this._stopIndex = null;
    _this._stopIndexMemoized = null;


    _this.state = {
      isScrolling: false,
      scrollTop: 0
    };

    _this._debounceResetIsScrollingCallback = _this._debounceResetIsScrollingCallback.bind(_this);
    _this._setScrollingContainerRef = _this._setScrollingContainerRef.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    return _this;
  }

  _createClass(Masonry, [{
    key: 'clearCellPositions',
    value: function clearCellPositions() {
      this._positionCache = new PositionCache();
      this.forceUpdate();
    }

    // HACK This method signature was intended for Grid

  }, {
    key: 'invalidateCellSizeAfterRender',
    value: function invalidateCellSizeAfterRender(_ref) {
      var index = _ref.rowIndex;

      if (this._invalidateOnUpdateStartIndex === null) {
        this._invalidateOnUpdateStartIndex = index;
        this._invalidateOnUpdateStopIndex = index;
      } else {
        this._invalidateOnUpdateStartIndex = Math.min(this._invalidateOnUpdateStartIndex, index);
        this._invalidateOnUpdateStopIndex = Math.max(this._invalidateOnUpdateStopIndex, index);
      }
    }
  }, {
    key: 'recomputeCellPositions',
    value: function recomputeCellPositions() {
      var stopIndex = this._positionCache.count - 1;

      this._positionCache = new PositionCache();
      this._populatePositionCache(0, stopIndex);

      this.forceUpdate();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._checkInvalidateOnUpdate();
      this._invokeOnScrollCallback();
      this._invokeOnCellsRenderedCallback();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._checkInvalidateOnUpdate();
      this._invokeOnScrollCallback();
      this._invokeOnCellsRenderedCallback();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._debounceResetIsScrollingId) {
        cancelAnimationTimeout(this._debounceResetIsScrollingId);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var scrollTop = this.props.scrollTop;


      if (scrollTop !== nextProps.scrollTop) {
        this._debounceResetIsScrolling();

        this.setState({
          isScrolling: true,
          scrollTop: nextProps.scrollTop
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          autoHeight = _props.autoHeight,
          cellCount = _props.cellCount,
          cellMeasurerCache = _props.cellMeasurerCache,
          cellRenderer = _props.cellRenderer,
          className = _props.className,
          height = _props.height,
          id = _props.id,
          keyMapper = _props.keyMapper,
          overscanByPixels = _props.overscanByPixels,
          role = _props.role,
          style = _props.style,
          tabIndex = _props.tabIndex,
          width = _props.width;
      var _state = this.state,
          isScrolling = _state.isScrolling,
          scrollTop = _state.scrollTop;


      var children = [];

      var estimateTotalHeight = this._getEstimatedTotalHeight();

      var shortestColumnSize = this._positionCache.shortestColumnSize;
      var measuredCellCount = this._positionCache.count;

      // We need to measure more cells before layout
      if (shortestColumnSize < scrollTop + height + overscanByPixels && measuredCellCount < cellCount) {
        var batchSize = Math.min(cellCount - measuredCellCount, Math.ceil((scrollTop + height + overscanByPixels - shortestColumnSize) / cellMeasurerCache.defaultHeight * width / cellMeasurerCache.defaultWidth));

        for (var _index = measuredCellCount; _index < measuredCellCount + batchSize; _index++) {
          children.push(cellRenderer({
            index: _index,
            isScrolling: isScrolling,
            key: keyMapper(_index),
            parent: this,
            style: {
              width: cellMeasurerCache.getWidth(_index)
            }
          }));
        }
      } else {
        (function () {
          var stopIndex = void 0;
          var startIndex = void 0;

          _this2._positionCache.range(Math.max(0, scrollTop - overscanByPixels), height + overscanByPixels * 2, function (index, left, top) {
            if (typeof startIndex === 'undefined') {
              startIndex = index;
              stopIndex = index;
            } else {
              startIndex = Math.min(startIndex, index);
              stopIndex = Math.max(stopIndex, index);
            }

            children.push(cellRenderer({
              index: index,
              isScrolling: isScrolling,
              key: keyMapper(index),
              parent: _this2,
              style: {
                height: cellMeasurerCache.getHeight(index),
                left: left,
                position: 'absolute',
                top: top,
                width: cellMeasurerCache.getWidth(index)
              }
            }));

            _this2._startIndex = startIndex;
            _this2._stopIndex = stopIndex;
          });
        })();
      }

      return React.createElement(
        'div',
        {
          ref: this._setScrollingContainerRef,
          'aria-label': this.props['aria-label'],
          className: cn('ReactVirtualized__Masonry', className),
          id: id,
          onScroll: this._onScroll,
          role: role,
          style: _extends({
            boxSizing: 'border-box',
            direction: 'ltr',
            height: autoHeight ? 'auto' : height,
            overflowX: 'hidden',
            overflowY: estimateTotalHeight < height ? 'hidden' : 'auto',
            position: 'relative',
            width: width,
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform'
          }, style),
          tabIndex: tabIndex },
        React.createElement(
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
              position: 'relative'
            } },
          children
        )
      );
    }
  }, {
    key: '_checkInvalidateOnUpdate',
    value: function _checkInvalidateOnUpdate() {
      if (typeof this._invalidateOnUpdateStartIndex === 'number') {
        var _startIndex = this._invalidateOnUpdateStartIndex;
        var _stopIndex = this._invalidateOnUpdateStopIndex;

        this._invalidateOnUpdateStartIndex = null;
        this._invalidateOnUpdateStopIndex = null;

        // Query external layout logic for position of newly-measured cells
        this._populatePositionCache(_startIndex, _stopIndex);

        this.forceUpdate();
      }
    }
  }, {
    key: '_debounceResetIsScrolling',
    value: function _debounceResetIsScrolling() {
      var scrollingResetTimeInterval = this.props.scrollingResetTimeInterval;


      if (this._debounceResetIsScrollingId) {
        cancelAnimationTimeout(this._debounceResetIsScrollingId);
      }

      this._debounceResetIsScrollingId = requestAnimationTimeout(this._debounceResetIsScrollingCallback, scrollingResetTimeInterval);
    }
  }, {
    key: '_debounceResetIsScrollingCallback',
    value: function _debounceResetIsScrollingCallback() {
      this.setState({
        isScrolling: false
      });
    }
  }, {
    key: '_getEstimatedTotalHeight',
    value: function _getEstimatedTotalHeight() {
      var _props2 = this.props,
          cellCount = _props2.cellCount,
          cellMeasurerCache = _props2.cellMeasurerCache,
          width = _props2.width;


      var estimatedColumnCount = Math.floor(width / cellMeasurerCache.defaultWidth);

      return this._positionCache.estimateTotalHeight(cellCount, estimatedColumnCount, cellMeasurerCache.defaultHeight);
    }
  }, {
    key: '_invokeOnScrollCallback',
    value: function _invokeOnScrollCallback() {
      var _props3 = this.props,
          height = _props3.height,
          onScroll = _props3.onScroll;
      var scrollTop = this.state.scrollTop;


      if (this._onScrollMemoized !== scrollTop) {
        onScroll({
          clientHeight: height,
          scrollHeight: this._getEstimatedTotalHeight(),
          scrollTop: scrollTop
        });

        this._onScrollMemoized = scrollTop;
      }
    }
  }, {
    key: '_invokeOnCellsRenderedCallback',
    value: function _invokeOnCellsRenderedCallback() {
      if (this._startIndexMemoized !== this._startIndex || this._stopIndexMemoized !== this._stopIndex) {
        var _onCellsRendered = this.props.onCellsRendered;


        _onCellsRendered({
          startIndex: this._startIndex,
          stopIndex: this._stopIndex
        });

        this._startIndexMemoized = this._startIndex;
        this._stopIndexMemoized = this._stopIndex;
      }
    }
  }, {
    key: '_populatePositionCache',
    value: function _populatePositionCache(startIndex, stopIndex) {
      var _props4 = this.props,
          cellMeasurerCache = _props4.cellMeasurerCache,
          cellPositioner = _props4.cellPositioner;


      for (var _index2 = startIndex; _index2 <= stopIndex; _index2++) {
        var _cellPositioner = cellPositioner(_index2),
            _left = _cellPositioner.left,
            _top = _cellPositioner.top;

        this._positionCache.setPosition(_index2, _left, _top, cellMeasurerCache.getHeight(_index2));
      }
    }
  }, {
    key: '_setScrollingContainerRef',
    value: function _setScrollingContainerRef(ref) {
      this._scrollingContainer = ref;
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(event) {
      var height = this.props.height;


      var eventScrollTop = event.target.scrollTop;

      // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
      // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
      // This causes a series of rapid renders that is slow for long lists.
      // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
      var scrollTop = Math.min(Math.max(0, this._getEstimatedTotalHeight() - height), eventScrollTop);

      // On iOS, we can arrive at negative offsets by swiping past the start or end.
      // Avoid re-rendering in this case as it can cause problems; see #532 for more.
      if (eventScrollTop !== scrollTop) {
        return;
      }

      // Prevent pointer events from interrupting a smooth scroll
      this._debounceResetIsScrolling();

      // Certain devices (like Apple touchpad) rapid-fire duplicate events.
      // Don't force a re-render if this is the case.
      // The mouse may move faster then the animation frame does.
      // Use requestAnimationFrame to avoid over-updating.
      if (this.state.scrollTop !== scrollTop) {
        this.setState({
          isScrolling: true,
          scrollTop: scrollTop
        });
      }
    }
  }]);

  return Masonry;
}(PureComponent);

Masonry.defaultProps = {
  autoHeight: false,
  keyMapper: identity,
  onCellsRendered: noop,
  onScroll: noop,
  overscanByPixels: 20,
  role: 'grid',
  scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
  style: emptyObject,
  tabIndex: 0
};
export default Masonry;


function identity(value) {
  return value;
}

function noop() {}

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CellMeasurerCache', {
  value: {
    defaultHeight: require('prop-types').number.isRequired,
    defaultWidth: require('prop-types').number.isRequired,
    getHeight: require('prop-types').func.isRequired,
    getWidth: require('prop-types').func.isRequired
  },
  configurable: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Positioner', {
  value: require('prop-types').func,
  configurable: true
});