
import { computeCellMetadataAndUpdateScrollOffsetHelper, createCallbackMemoizer, getOverscanIndices, getUpdatedOffsetForIndex, getVisibleCellIndices, initCellMetadata, updateScrollIndexHelper } from '../utils';
import cn from 'classnames';
import raf from 'raf';
import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
var IS_SCROLLING_TIMEOUT = 150;

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
var SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: 'observed',
  REQUESTED: 'requested'
};

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 */

var Grid = function (_Component) {
  babelHelpers.inherits(Grid, _Component);

  function Grid(props, context) {
    babelHelpers.classCallCheck(this, Grid);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Grid).call(this, props, context));

    _this.shouldComponentUpdate = shouldPureComponentUpdate;


    _this.state = {
      computeGridMetadataOnNextUpdate: false,
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    };

    // Invokes onSectionRendered callback only when start/stop row or column indices change
    _this._onGridRenderedMemoizer = createCallbackMemoizer();
    _this._onScrollMemoizer = createCallbackMemoizer(false);

    // Bind functions to instance so they don't lose context when passed around
    _this._computeGridMetadata = _this._computeGridMetadata.bind(_this);
    _this._invokeOnGridRenderedHelper = _this._invokeOnGridRenderedHelper.bind(_this);
    _this._onKeyPress = _this._onKeyPress.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    _this._updateScrollLeftForScrollToColumn = _this._updateScrollLeftForScrollToColumn.bind(_this);
    _this._updateScrollTopForScrollToRow = _this._updateScrollTopForScrollToRow.bind(_this);
    return _this;
  }

  /**
   * Forced recompute of row heights and column widths.
   * This function should be called if dynamic column or row sizes have changed but nothing else has.
   * Since Grid only receives :columnsCount and :rowsCount it has no way of detecting when the underlying data changes.
   */


  babelHelpers.createClass(Grid, [{
    key: 'recomputeGridSize',
    value: function recomputeGridSize() {
      this.setState({
        computeGridMetadataOnNextUpdate: true
      });
    }

    /**
     * Updates the Grid to ensure the cell at the specified row and column indices is visible.
     * This method exists so that a user can forcefully scroll to the same cell twice.
     * (The :scrollToColumn and :scrollToRow properties would not change in that case so it would not be picked up by the component.)
     */

  }, {
    key: 'scrollToCell',
    value: function scrollToCell(_ref) {
      var scrollToColumn = _ref.scrollToColumn;
      var scrollToRow = _ref.scrollToRow;

      this._updateScrollLeftForScrollToColumn(scrollToColumn);
      this._updateScrollTopForScrollToRow(scrollToRow);
    }

    /**
     * Set the :scrollLeft and :scrollTop position within the inner scroll container.
     * Normally it is best to let Grid manage these properties or to use a method like :scrollToCell.
     * This method enables Grid to be scroll-synced to another react-virtualized component though.
     * It is appropriate to use in that case.
     */

  }, {
    key: 'setScrollPosition',
    value: function setScrollPosition(_ref2) {
      var scrollLeft = _ref2.scrollLeft;
      var scrollTop = _ref2.scrollTop;

      var newState = {
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
      };

      if (scrollLeft >= 0) {
        newState.scrollLeft = scrollLeft;
      }

      if (scrollTop >= 0) {
        newState.scrollTop = scrollTop;
      }

      if (scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft || scrollTop >= 0 && scrollTop !== this.state.scrollTop) {
        this.setState(newState);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props;
      var scrollLeft = _props.scrollLeft;
      var scrollToColumn = _props.scrollToColumn;
      var scrollTop = _props.scrollTop;
      var scrollToRow = _props.scrollToRow;


      if (scrollLeft >= 0 || scrollTop >= 0) {
        this.setScrollPosition({ scrollLeft: scrollLeft, scrollTop: scrollTop });
      }

      if (scrollToColumn >= 0 || scrollToRow >= 0) {
        // Without setImmediate() the initial scrollingContainer.scrollTop assignment doesn't work
        this._setImmediateId = setImmediate(function () {
          _this2._setImmediateId = null;
          _this2._updateScrollLeftForScrollToColumn();
          _this2._updateScrollTopForScrollToRow();
        });
      }

      // Update onRowsRendered callback
      this._invokeOnGridRenderedHelper();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _props2 = this.props;
      var columnsCount = _props2.columnsCount;
      var columnWidth = _props2.columnWidth;
      var height = _props2.height;
      var rowHeight = _props2.rowHeight;
      var rowsCount = _props2.rowsCount;
      var scrollToColumn = _props2.scrollToColumn;
      var scrollToRow = _props2.scrollToRow;
      var width = _props2.width;
      var _state = this.state;
      var scrollLeft = _state.scrollLeft;
      var scrollPositionChangeReason = _state.scrollPositionChangeReason;
      var scrollTop = _state.scrollTop;

      // Make sure requested changes to :scrollLeft or :scrollTop get applied.
      // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
      // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
      // So we only set these when we require an adjustment of the scroll position.
      // See issue #2 for more information.

      if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
        if (scrollLeft >= 0 && scrollLeft !== prevState.scrollLeft && scrollLeft !== this.refs.scrollingContainer.scrollLeft) {
          this.refs.scrollingContainer.scrollLeft = scrollLeft;
        }
        if (scrollTop >= 0 && scrollTop !== prevState.scrollTop && scrollTop !== this.refs.scrollingContainer.scrollTop) {
          this.refs.scrollingContainer.scrollTop = scrollTop;
        }
      }

      // Update scrollLeft if appropriate
      updateScrollIndexHelper({
        cellsCount: columnsCount,
        cellMetadata: this._columnMetadata,
        cellSize: columnWidth,
        previousCellsCount: prevProps.columnsCount,
        previousCellSize: prevProps.columnWidth,
        previousScrollToIndex: prevProps.scrollToColumn,
        previousSize: prevProps.width,
        scrollOffset: scrollLeft,
        scrollToIndex: scrollToColumn,
        size: width,
        updateScrollIndexCallback: this._updateScrollLeftForScrollToColumn
      });

      // Update scrollTop if appropriate
      updateScrollIndexHelper({
        cellsCount: rowsCount,
        cellMetadata: this._rowMetadata,
        cellSize: rowHeight,
        previousCellsCount: prevProps.rowsCount,
        previousCellSize: prevProps.rowHeight,
        previousScrollToIndex: prevProps.scrollToRow,
        previousSize: prevProps.height,
        scrollOffset: scrollTop,
        scrollToIndex: scrollToRow,
        size: height,
        updateScrollIndexCallback: this._updateScrollTopForScrollToRow
      });

      // Update onRowsRendered callback if start/stop indices have changed
      this._invokeOnGridRenderedHelper();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._computeGridMetadata(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._disablePointerEventsTimeoutId) {
        clearTimeout(this._disablePointerEventsTimeoutId);
      }

      if (this._setImmediateId) {
        clearImmediate(this._setImmediateId);
      }

      if (this._setNextStateAnimationFrameId) {
        raf.cancel(this._setNextStateAnimationFrameId);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.columnsCount === 0 && nextState.scrollLeft !== 0) {
        this.setScrollPosition({ scrollLeft: 0 });
      }

      if (nextProps.rowsCount === 0 && nextState.scrollTop !== 0) {
        this.setScrollPosition({ scrollTop: 0 });
      }

      if (nextProps.scrollLeft !== this.props.scrollLeft) {
        this.setScrollPosition({ scrollLeft: nextProps.scrollLeft });
      }

      if (nextProps.scrollTop !== this.props.scrollTop) {
        this.setScrollPosition({ scrollTop: nextProps.scrollTop });
      }

      computeCellMetadataAndUpdateScrollOffsetHelper({
        cellsCount: this.props.columnsCount,
        cellSize: this.props.columnWidth,
        computeMetadataCallback: this._computeGridMetadata,
        computeMetadataCallbackProps: nextProps,
        computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
        nextCellsCount: nextProps.columnsCount,
        nextCellSize: nextProps.columnWidth,
        nextScrollToIndex: nextProps.scrollToColumn,
        scrollToIndex: this.props.scrollToColumn,
        updateScrollOffsetForScrollToIndex: this._updateScrollLeftForScrollToColumn
      });

      computeCellMetadataAndUpdateScrollOffsetHelper({
        cellsCount: this.props.rowsCount,
        cellSize: this.props.rowHeight,
        computeMetadataCallback: this._computeGridMetadata,
        computeMetadataCallbackProps: nextProps,
        computeMetadataOnNextUpdate: nextState.computeGridMetadataOnNextUpdate,
        nextCellsCount: nextProps.rowsCount,
        nextCellSize: nextProps.rowHeight,
        nextScrollToIndex: nextProps.scrollToRow,
        scrollToIndex: this.props.scrollToRow,
        updateScrollOffsetForScrollToIndex: this._updateScrollTopForScrollToRow
      });

      this.setState({
        computeGridMetadataOnNextUpdate: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var className = _props3.className;
      var columnsCount = _props3.columnsCount;
      var height = _props3.height;
      var noContentRenderer = _props3.noContentRenderer;
      var overscanColumnsCount = _props3.overscanColumnsCount;
      var overscanRowsCount = _props3.overscanRowsCount;
      var renderCell = _props3.renderCell;
      var rowsCount = _props3.rowsCount;
      var width = _props3.width;
      var _state2 = this.state;
      var isScrolling = _state2.isScrolling;
      var scrollLeft = _state2.scrollLeft;
      var scrollTop = _state2.scrollTop;


      var childrenToDisplay = [];

      // Render only enough columns and rows to cover the visible area of the grid.
      if (height > 0 && width > 0) {
        var _getVisibleCellIndice = getVisibleCellIndices({
          cellsCount: columnsCount,
          cellMetadata: this._columnMetadata,
          containerSize: width,
          currentOffset: scrollLeft
        });

        var columnStartIndex = _getVisibleCellIndice.start;
        var columnStopIndex = _getVisibleCellIndice.stop;

        var _getVisibleCellIndice2 = getVisibleCellIndices({
          cellsCount: rowsCount,
          cellMetadata: this._rowMetadata,
          containerSize: height,
          currentOffset: scrollTop
        });

        var rowStartIndex = _getVisibleCellIndice2.start;
        var rowStopIndex = _getVisibleCellIndice2.stop;

        // Store for :onSectionRendered callback in componentDidUpdate

        this._renderedColumnStartIndex = columnStartIndex;
        this._renderedColumnStopIndex = columnStopIndex;
        this._renderedRowStartIndex = rowStartIndex;
        this._renderedRowStopIndex = rowStopIndex;

        var overscanColumnIndices = getOverscanIndices({
          cellsCount: columnsCount,
          overscanCellsCount: overscanColumnsCount,
          startIndex: columnStartIndex,
          stopIndex: columnStopIndex
        });

        var overscanRowIndices = getOverscanIndices({
          cellsCount: rowsCount,
          overscanCellsCount: overscanRowsCount,
          startIndex: rowStartIndex,
          stopIndex: rowStopIndex
        });

        columnStartIndex = overscanColumnIndices.overscanStartIndex;
        columnStopIndex = overscanColumnIndices.overscanStopIndex;
        rowStartIndex = overscanRowIndices.overscanStartIndex;
        rowStopIndex = overscanRowIndices.overscanStopIndex;

        for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
          var rowDatum = this._rowMetadata[rowIndex];

          for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            var columnDatum = this._columnMetadata[columnIndex];
            var child = renderCell({ columnIndex: columnIndex, rowIndex: rowIndex });
            var key = rowIndex + '-' + columnIndex;

            child = React.createElement(
              'div',
              {
                key: key,
                className: 'Grid__cell',
                style: {
                  height: this._getRowHeight(rowIndex),
                  left: columnDatum.offset + 'px',
                  top: rowDatum.offset + 'px',
                  width: this._getColumnWidth(columnIndex)
                }
              },
              child
            );

            childrenToDisplay.push(child);
          }
        }
      }

      return React.createElement(
        'div',
        {
          ref: 'scrollingContainer',
          className: cn('Grid', className),
          onKeyDown: this._onKeyPress,
          onScroll: this._onScroll,
          tabIndex: 0,
          style: {
            height: height,
            width: width
          }
        },
        childrenToDisplay.length > 0 && React.createElement(
          'div',
          {
            className: 'Grid__innerScrollContainer',
            style: {
              width: this._getTotalColumnsWidth(),
              height: this._getTotalRowsHeight(),
              maxWidth: this._getTotalColumnsWidth(),
              maxHeight: this._getTotalRowsHeight(),
              pointerEvents: isScrolling ? 'none' : 'auto'
            }
          },
          childrenToDisplay
        ),
        childrenToDisplay.length === 0 && noContentRenderer()
      );
    }

    /* ---------------------------- Helper methods ---------------------------- */

  }, {
    key: '_computeGridMetadata',
    value: function _computeGridMetadata(props) {
      var columnsCount = props.columnsCount;
      var columnWidth = props.columnWidth;
      var rowHeight = props.rowHeight;
      var rowsCount = props.rowsCount;


      this._columnMetadata = initCellMetadata({
        cellsCount: columnsCount,
        size: columnWidth
      });
      this._rowMetadata = initCellMetadata({
        cellsCount: rowsCount,
        size: rowHeight
      });
    }

    /**
     * Sets an :isScrolling flag for a small window of time.
     * This flag is used to disable pointer events on the scrollable portion of the Grid.
     * This prevents jerky/stuttery mouse-wheel scrolling.
     */

  }, {
    key: '_enablePointerEventsAfterDelay',
    value: function _enablePointerEventsAfterDelay() {
      var _this3 = this;

      if (this._disablePointerEventsTimeoutId) {
        clearTimeout(this._disablePointerEventsTimeoutId);
      }

      this._disablePointerEventsTimeoutId = setTimeout(function () {
        _this3._disablePointerEventsTimeoutId = null;
        _this3.setState({
          isScrolling: false
        });
      }, IS_SCROLLING_TIMEOUT);
    }
  }, {
    key: '_getColumnWidth',
    value: function _getColumnWidth(index) {
      var columnWidth = this.props.columnWidth;


      return columnWidth instanceof Function ? columnWidth(index) : columnWidth;
    }
  }, {
    key: '_getRowHeight',
    value: function _getRowHeight(index) {
      var rowHeight = this.props.rowHeight;


      return rowHeight instanceof Function ? rowHeight(index) : rowHeight;
    }
  }, {
    key: '_getTotalColumnsWidth',
    value: function _getTotalColumnsWidth() {
      if (this._columnMetadata.length === 0) {
        return 0;
      }

      var datum = this._columnMetadata[this._columnMetadata.length - 1];
      return datum.offset + datum.size;
    }
  }, {
    key: '_getTotalRowsHeight',
    value: function _getTotalRowsHeight() {
      if (this._rowMetadata.length === 0) {
        return 0;
      }

      var datum = this._rowMetadata[this._rowMetadata.length - 1];
      return datum.offset + datum.size;
    }
  }, {
    key: '_invokeOnGridRenderedHelper',
    value: function _invokeOnGridRenderedHelper() {
      var _props4 = this.props;
      var columnsCount = _props4.columnsCount;
      var onSectionRendered = _props4.onSectionRendered;
      var overscanColumnsCount = _props4.overscanColumnsCount;
      var overscanRowsCount = _props4.overscanRowsCount;
      var rowsCount = _props4.rowsCount;

      var _getOverscanIndices = getOverscanIndices({
        cellsCount: columnsCount,
        overscanCellsCount: overscanColumnsCount,
        startIndex: this._renderedColumnStartIndex,
        stopIndex: this._renderedColumnStopIndex
      });

      var columnOverscanStartIndex = _getOverscanIndices.overscanStartIndex;
      var columnOverscanStopIndex = _getOverscanIndices.overscanStopIndex;

      var _getOverscanIndices2 = getOverscanIndices({
        cellsCount: rowsCount,
        overscanCellsCount: overscanRowsCount,
        startIndex: this._renderedRowStartIndex,
        stopIndex: this._renderedRowStopIndex
      });

      var rowOverscanStartIndex = _getOverscanIndices2.overscanStartIndex;
      var rowOverscanStopIndex = _getOverscanIndices2.overscanStopIndex;


      this._onGridRenderedMemoizer({
        callback: onSectionRendered,
        indices: {
          columnOverscanStartIndex: columnOverscanStartIndex,
          columnOverscanStopIndex: columnOverscanStopIndex,
          columnStartIndex: this._renderedColumnStartIndex,
          columnStopIndex: this._renderedColumnStopIndex,
          rowOverscanStartIndex: rowOverscanStartIndex,
          rowOverscanStopIndex: rowOverscanStopIndex,
          rowStartIndex: this._renderedRowStartIndex,
          rowStopIndex: this._renderedRowStopIndex
        }
      });
    }

    /**
     * Updates the state during the next animation frame.
     * Use this method to avoid multiple renders in a small span of time.
     * This helps performance for bursty events (like onScroll).
     */

  }, {
    key: '_setNextState',
    value: function _setNextState(state) {
      var _this4 = this;

      if (this._setNextStateAnimationFrameId) {
        raf.cancel(this._setNextStateAnimationFrameId);
      }

      this._setNextStateAnimationFrameId = raf(function () {
        _this4._setNextStateAnimationFrameId = null;
        _this4.setState(state);
      });
    }
  }, {
    key: '_stopEvent',
    value: function _stopEvent(event) {
      event.preventDefault();
    }
  }, {
    key: '_updateScrollLeftForScrollToColumn',
    value: function _updateScrollLeftForScrollToColumn(scrollToColumnOverride) {
      var scrollToColumn = scrollToColumnOverride != null ? scrollToColumnOverride : this.props.scrollToColumn;

      var width = this.props.width;
      var scrollLeft = this.state.scrollLeft;


      if (scrollToColumn >= 0) {
        var calculatedScrollLeft = getUpdatedOffsetForIndex({
          cellMetadata: this._columnMetadata,
          containerSize: width,
          currentOffset: scrollLeft,
          targetIndex: scrollToColumn
        });

        if (scrollLeft !== calculatedScrollLeft) {
          this.setScrollPosition({
            scrollLeft: calculatedScrollLeft
          });
        }
      }
    }
  }, {
    key: '_updateScrollTopForScrollToRow',
    value: function _updateScrollTopForScrollToRow(scrollToRowOverride) {
      var scrollToRow = scrollToRowOverride != null ? scrollToRowOverride : this.props.scrollToRow;

      var height = this.props.height;
      var scrollTop = this.state.scrollTop;


      if (scrollToRow >= 0) {
        var calculatedScrollTop = getUpdatedOffsetForIndex({
          cellMetadata: this._rowMetadata,
          containerSize: height,
          currentOffset: scrollTop,
          targetIndex: scrollToRow
        });

        if (scrollTop !== calculatedScrollTop) {
          this.setScrollPosition({
            scrollTop: calculatedScrollTop
          });
        }
      }
    }

    /* ---------------------------- Event handlers ---------------------------- */

  }, {
    key: '_onKeyPress',
    value: function _onKeyPress(event) {
      var _props5 = this.props;
      var columnsCount = _props5.columnsCount;
      var height = _props5.height;
      var rowsCount = _props5.rowsCount;
      var width = _props5.width;
      var _state3 = this.state;
      var scrollLeft = _state3.scrollLeft;
      var scrollTop = _state3.scrollTop;


      var start = undefined,
          datum = undefined,
          newScrollLeft = undefined,
          newScrollTop = undefined;

      if (columnsCount === 0 || rowsCount === 0) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          this._stopEvent(event); // Prevent key from also scrolling surrounding window

          start = getVisibleCellIndices({
            cellsCount: rowsCount,
            cellMetadata: this._rowMetadata,
            containerSize: height,
            currentOffset: scrollTop
          }).start;
          datum = this._rowMetadata[start];
          newScrollTop = Math.min(this._getTotalRowsHeight() - height, scrollTop + datum.size);

          this.setScrollPosition({
            scrollTop: newScrollTop
          });
          break;
        case 'ArrowLeft':
          this._stopEvent(event); // Prevent key from also scrolling surrounding window

          start = getVisibleCellIndices({
            cellsCount: columnsCount,
            cellMetadata: this._columnMetadata,
            containerSize: width,
            currentOffset: scrollLeft
          }).start;

          this.scrollToCell({
            scrollToColumn: Math.max(0, start - 1),
            scrollToRow: this.props.scrollToRow
          });
          break;
        case 'ArrowRight':
          this._stopEvent(event); // Prevent key from also scrolling surrounding window

          start = getVisibleCellIndices({
            cellsCount: columnsCount,
            cellMetadata: this._columnMetadata,
            containerSize: width,
            currentOffset: scrollLeft
          }).start;
          datum = this._columnMetadata[start];
          newScrollLeft = Math.min(this._getTotalColumnsWidth() - width, scrollLeft + datum.size);

          this.setScrollPosition({
            scrollLeft: newScrollLeft
          });
          break;
        case 'ArrowUp':
          this._stopEvent(event); // Prevent key from also scrolling surrounding window

          start = getVisibleCellIndices({
            cellsCount: rowsCount,
            cellMetadata: this._rowMetadata,
            containerSize: height,
            currentOffset: scrollTop
          }).start;

          this.scrollToCell({
            scrollToColumn: this.props.scrollToColumn,
            scrollToRow: Math.max(0, start - 1)
          });
          break;
      }
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(event) {
      // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
      // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
      // See issue #404 for more information.
      if (event.target !== this.refs.scrollingContainer) {
        return;
      }

      // Prevent pointer events from interrupting a smooth scroll
      this._enablePointerEventsAfterDelay();

      // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
      // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
      // This causes a series of rapid renders that is slow for long lists.
      // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
      var _props6 = this.props;
      var height = _props6.height;
      var onScroll = _props6.onScroll;
      var width = _props6.width;

      var totalRowsHeight = this._getTotalRowsHeight();
      var totalColumnsWidth = this._getTotalColumnsWidth();
      var scrollLeft = Math.min(totalColumnsWidth - width, event.target.scrollLeft);
      var scrollTop = Math.min(totalRowsHeight - height, event.target.scrollTop);

      // Certain devices (like Apple touchpad) rapid-fire duplicate events.
      // Don't force a re-render if this is the case.
      // The mouse may move faster then the animation frame does.
      // Use requestAnimationFrame to avoid over-updating.
      if (this.state.scrollLeft !== scrollLeft || this.state.scrollTop !== scrollTop) {
        var scrollPositionChangeReason = event.cancelable ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED : SCROLL_POSITION_CHANGE_REASONS.REQUESTED;

        this._setNextState({
          isScrolling: true,
          scrollLeft: scrollLeft,
          scrollPositionChangeReason: scrollPositionChangeReason,
          scrollTop: scrollTop
        });
      }

      this._onScrollMemoizer({
        callback: function callback(_ref3) {
          var scrollLeft = _ref3.scrollLeft;
          var scrollTop = _ref3.scrollTop;

          onScroll({
            clientHeight: height,
            clientWidth: width,
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
  }]);
  return Grid;
}(Component);

Grid.propTypes = {
  /**
   * Optional custom CSS class name to attach to root Grid element.
   */
  className: PropTypes.string,

  /**
   * Number of columns in grid.
   */
  columnsCount: PropTypes.number.isRequired,

  /**
   * Either a fixed column width (number) or a function that returns the width of a column given its index.
   * Should implement the following interface: (index: number): number
   */
  columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

  /**
   * Height of Grid; this property determines the number of visible (vs virtualized) rows.
   */
  height: PropTypes.number.isRequired,

  /**
   * Optional renderer to be used in place of rows when either :rowsCount or :columnsCount is 0.
   */
  noContentRenderer: PropTypes.func.isRequired,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
   */
  onScroll: PropTypes.func.isRequired,

  /**
   * Callback invoked with information about the section of the Grid that was just rendered.
   * ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }): void
   */
  onSectionRendered: PropTypes.func.isRequired,

  /**
   * Number of columns to render before/after the visible section of the grid.
   * These columns can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
   */
  overscanColumnsCount: PropTypes.number.isRequired,

  /**
   * Number of rows to render above/below the visible section of the grid.
   * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
   */
  overscanRowsCount: PropTypes.number.isRequired,

  /**
   * Responsible for rendering a cell given an row and column index.
   * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
   */
  renderCell: PropTypes.func.isRequired,

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index.
   * Should implement the following interface: (index: number): number
   */
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,

  /**
   * Number of rows in grid.
   */
  rowsCount: PropTypes.number.isRequired,

  /** Horizontal offset. */
  scrollLeft: PropTypes.number,

  /**
   * Column index to ensure visible (by forcefully scrolling if necessary)
   */
  scrollToColumn: PropTypes.number,

  /** Vertical offset. */
  scrollTop: PropTypes.number,

  /**
   * Row index to ensure visible (by forcefully scrolling if necessary)
   */
  scrollToRow: PropTypes.number,

  /**
   * Width of Grid; this property determines the number of visible (vs virtualized) columns.
   */
  width: PropTypes.number.isRequired
};
Grid.defaultProps = {
  noContentRenderer: function noContentRenderer() {
    return null;
  },
  onScroll: function onScroll() {
    return null;
  },
  onSectionRendered: function onSectionRendered() {
    return null;
  },
  overscanColumnsCount: 0,
  overscanRowsCount: 10
};
export default Grid;