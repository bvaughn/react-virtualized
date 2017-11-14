'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CellMeasurerCacheDecorator = require('./CellMeasurerCacheDecorator');

var _CellMeasurerCacheDecorator2 = _interopRequireDefault(_CellMeasurerCacheDecorator);

var _Grid = require('../Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCROLLBAR_SIZE_BUFFER = 20;

/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */

var MultiGrid = function (_PureComponent) {
  _inherits(MultiGrid, _PureComponent);

  function MultiGrid(props, context) {
    _classCallCheck(this, MultiGrid);

    var _this = _possibleConstructorReturn(this, (MultiGrid.__proto__ || Object.getPrototypeOf(MultiGrid)).call(this, props, context));

    _this.state = {
      scrollLeft: 0,
      scrollTop: 0,
      scrollbarSize: 0,
      showHorizontalScrollbar: false,
      showVerticalScrollbar: false
    };

    _this._deferredInvalidateColumnIndex = null;
    _this._deferredInvalidateRowIndex = null;

    _this._bottomLeftGridRef = _this._bottomLeftGridRef.bind(_this);
    _this._bottomRightGridRef = _this._bottomRightGridRef.bind(_this);
    _this._cellRendererBottomLeftGrid = _this._cellRendererBottomLeftGrid.bind(_this);
    _this._cellRendererBottomRightGrid = _this._cellRendererBottomRightGrid.bind(_this);
    _this._cellRendererTopRightGrid = _this._cellRendererTopRightGrid.bind(_this);
    _this._columnWidthRightGrid = _this._columnWidthRightGrid.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    _this._onScrollbarPresenceChange = _this._onScrollbarPresenceChange.bind(_this);
    _this._onScrollLeft = _this._onScrollLeft.bind(_this);
    _this._onScrollTop = _this._onScrollTop.bind(_this);
    _this._rowHeightBottomGrid = _this._rowHeightBottomGrid.bind(_this);
    _this._topLeftGridRef = _this._topLeftGridRef.bind(_this);
    _this._topRightGridRef = _this._topRightGridRef.bind(_this);
    return _this;
  }

  _createClass(MultiGrid, [{
    key: 'forceUpdateGrids',
    value: function forceUpdateGrids() {
      this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate();
      this._bottomRightGrid && this._bottomRightGrid.forceUpdate();
      this._topLeftGrid && this._topLeftGrid.forceUpdate();
      this._topRightGrid && this._topRightGrid.forceUpdate();
    }

    /** See Grid#invalidateCellSizeAfterRender */

  }, {
    key: 'invalidateCellSizeAfterRender',
    value: function invalidateCellSizeAfterRender() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$columnIndex = _ref.columnIndex,
          columnIndex = _ref$columnIndex === undefined ? 0 : _ref$columnIndex,
          _ref$rowIndex = _ref.rowIndex,
          rowIndex = _ref$rowIndex === undefined ? 0 : _ref$rowIndex;

      this._deferredInvalidateColumnIndex = typeof this._deferredInvalidateColumnIndex === 'number' ? Math.min(this._deferredInvalidateColumnIndex, columnIndex) : columnIndex;
      this._deferredInvalidateRowIndex = typeof this._deferredInvalidateRowIndex === 'number' ? Math.min(this._deferredInvalidateRowIndex, rowIndex) : rowIndex;
    }

    /** See Grid#measureAllCells */

  }, {
    key: 'measureAllCells',
    value: function measureAllCells() {
      this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells();
      this._bottomRightGrid && this._bottomRightGrid.measureAllCells();
      this._topLeftGrid && this._topLeftGrid.measureAllCells();
      this._topRightGrid && this._topRightGrid.measureAllCells();
    }

    /** See Grid#recomputeGridSize */

  }, {
    key: 'recomputeGridSize',
    value: function recomputeGridSize() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$columnIndex = _ref2.columnIndex,
          columnIndex = _ref2$columnIndex === undefined ? 0 : _ref2$columnIndex,
          _ref2$rowIndex = _ref2.rowIndex,
          rowIndex = _ref2$rowIndex === undefined ? 0 : _ref2$rowIndex;

      var _props = this.props,
          fixedColumnCount = _props.fixedColumnCount,
          fixedRowCount = _props.fixedRowCount;


      var adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount);
      var adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount);

      this._bottomLeftGrid && this._bottomLeftGrid.recomputeGridSize({
        columnIndex: columnIndex,
        rowIndex: adjustedRowIndex
      });
      this._bottomRightGrid && this._bottomRightGrid.recomputeGridSize({
        columnIndex: adjustedColumnIndex,
        rowIndex: adjustedRowIndex
      });
      this._topLeftGrid && this._topLeftGrid.recomputeGridSize({
        columnIndex: columnIndex,
        rowIndex: rowIndex
      });
      this._topRightGrid && this._topRightGrid.recomputeGridSize({
        columnIndex: adjustedColumnIndex,
        rowIndex: rowIndex
      });

      this._leftGridWidth = null;
      this._topGridHeight = null;
      this._maybeCalculateCachedStyles(null, this.props, null, this.state);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props2 = this.props,
          scrollLeft = _props2.scrollLeft,
          scrollTop = _props2.scrollTop;


      if (scrollLeft > 0 || scrollTop > 0) {
        var newState = {};

        if (scrollLeft > 0) {
          newState.scrollLeft = scrollLeft;
        }

        if (scrollTop > 0) {
          newState.scrollTop = scrollTop;
        }

        this.setState(newState);
      }
      this._handleInvalidatedGridSize();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._handleInvalidatedGridSize();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props3 = this.props,
          deferredMeasurementCache = _props3.deferredMeasurementCache,
          fixedColumnCount = _props3.fixedColumnCount,
          fixedRowCount = _props3.fixedRowCount;


      this._maybeCalculateCachedStyles(null, this.props, null, this.state);

      if (deferredMeasurementCache) {
        this._deferredMeasurementCacheBottomLeftGrid = fixedRowCount > 0 ? new _CellMeasurerCacheDecorator2.default({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: 0,
          rowIndexOffset: fixedRowCount
        }) : deferredMeasurementCache;

        this._deferredMeasurementCacheBottomRightGrid = fixedColumnCount > 0 || fixedRowCount > 0 ? new _CellMeasurerCacheDecorator2.default({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: fixedRowCount
        }) : deferredMeasurementCache;

        this._deferredMeasurementCacheTopRightGrid = fixedColumnCount > 0 ? new _CellMeasurerCacheDecorator2.default({
          cellMeasurerCache: deferredMeasurementCache,
          columnIndexOffset: fixedColumnCount,
          rowIndexOffset: 0
        }) : deferredMeasurementCache;
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextState) {
      var _props4 = this.props,
          columnWidth = _props4.columnWidth,
          fixedColumnCount = _props4.fixedColumnCount,
          fixedRowCount = _props4.fixedRowCount,
          rowHeight = _props4.rowHeight;


      if (columnWidth !== nextProps.columnWidth || fixedColumnCount !== nextProps.fixedColumnCount) {
        this._leftGridWidth = null;
      }

      if (fixedRowCount !== nextProps.fixedRowCount || rowHeight !== nextProps.rowHeight) {
        this._topGridHeight = null;
      }

      if (nextProps.scrollLeft !== this.props.scrollLeft || nextProps.scrollTop !== this.props.scrollTop) {
        var newState = {};

        if (nextProps.scrollLeft != null && nextProps.scrollLeft >= 0) {
          newState.scrollLeft = nextProps.scrollLeft;
        }

        if (nextProps.scrollTop != null && nextProps.scrollTop >= 0) {
          newState.scrollTop = nextProps.scrollTop;
        }

        this.setState(newState);
      }

      this._maybeCalculateCachedStyles(this.props, nextProps, this.state, nextState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          onScroll = _props5.onScroll,
          onSectionRendered = _props5.onSectionRendered,
          scrollLeftProp = _props5.scrollLeft,
          scrollToColumn = _props5.scrollToColumn,
          scrollTopProp = _props5.scrollTop,
          scrollToRow = _props5.scrollToRow,
          rest = _objectWithoutProperties(_props5, ['onScroll', 'onSectionRendered', 'scrollLeft', 'scrollToColumn', 'scrollTop', 'scrollToRow']);

      // Don't render any of our Grids if there are no cells.
      // This mirrors what Grid does,
      // And prevents us from recording inaccurage measurements when used with CellMeasurer.


      if (this.props.width === 0 || this.props.height === 0) {
        return null;
      }

      // scrollTop and scrollLeft props are explicitly filtered out and ignored

      var _state = this.state,
          scrollLeft = _state.scrollLeft,
          scrollTop = _state.scrollTop;


      return _react2.default.createElement(
        'div',
        { style: this._containerOuterStyle },
        _react2.default.createElement(
          'div',
          { style: this._containerTopStyle },
          this._renderTopLeftGrid(rest),
          this._renderTopRightGrid(_extends({}, rest, {
            onScroll: onScroll,
            scrollLeft: scrollLeft
          }))
        ),
        _react2.default.createElement(
          'div',
          { style: this._containerBottomStyle },
          this._renderBottomLeftGrid(_extends({}, rest, {
            onScroll: onScroll,
            scrollTop: scrollTop
          })),
          this._renderBottomRightGrid(_extends({}, rest, {
            onScroll: onScroll,
            onSectionRendered: onSectionRendered,
            scrollLeft: scrollLeft,
            scrollToColumn: scrollToColumn,
            scrollToRow: scrollToRow,
            scrollTop: scrollTop
          }))
        )
      );
    }
  }, {
    key: '_bottomLeftGridRef',
    value: function _bottomLeftGridRef(ref) {
      this._bottomLeftGrid = ref;
    }
  }, {
    key: '_bottomRightGridRef',
    value: function _bottomRightGridRef(ref) {
      this._bottomRightGrid = ref;
    }
  }, {
    key: '_cellRendererBottomLeftGrid',
    value: function _cellRendererBottomLeftGrid(_ref3) {
      var rowIndex = _ref3.rowIndex,
          rest = _objectWithoutProperties(_ref3, ['rowIndex']);

      var _props6 = this.props,
          cellRenderer = _props6.cellRenderer,
          fixedRowCount = _props6.fixedRowCount,
          rowCount = _props6.rowCount;


      if (rowIndex === rowCount - fixedRowCount) {
        return _react2.default.createElement('div', {
          key: rest.key,
          style: _extends({}, rest.style, {
            height: SCROLLBAR_SIZE_BUFFER
          })
        });
      } else {
        return cellRenderer(_extends({}, rest, {
          parent: this,
          rowIndex: rowIndex + fixedRowCount
        }));
      }
    }
  }, {
    key: '_cellRendererBottomRightGrid',
    value: function _cellRendererBottomRightGrid(_ref4) {
      var columnIndex = _ref4.columnIndex,
          rowIndex = _ref4.rowIndex,
          rest = _objectWithoutProperties(_ref4, ['columnIndex', 'rowIndex']);

      var _props7 = this.props,
          cellRenderer = _props7.cellRenderer,
          fixedColumnCount = _props7.fixedColumnCount,
          fixedRowCount = _props7.fixedRowCount;


      return cellRenderer(_extends({}, rest, {
        columnIndex: columnIndex + fixedColumnCount,
        parent: this,
        rowIndex: rowIndex + fixedRowCount
      }));
    }
  }, {
    key: '_cellRendererTopRightGrid',
    value: function _cellRendererTopRightGrid(_ref5) {
      var columnIndex = _ref5.columnIndex,
          rest = _objectWithoutProperties(_ref5, ['columnIndex']);

      var _props8 = this.props,
          cellRenderer = _props8.cellRenderer,
          columnCount = _props8.columnCount,
          fixedColumnCount = _props8.fixedColumnCount;


      if (columnIndex === columnCount - fixedColumnCount) {
        return _react2.default.createElement('div', {
          key: rest.key,
          style: _extends({}, rest.style, {
            width: SCROLLBAR_SIZE_BUFFER
          })
        });
      } else {
        return cellRenderer(_extends({}, rest, {
          columnIndex: columnIndex + fixedColumnCount,
          parent: this
        }));
      }
    }
  }, {
    key: '_columnWidthRightGrid',
    value: function _columnWidthRightGrid(_ref6) {
      var index = _ref6.index;
      var _props9 = this.props,
          columnCount = _props9.columnCount,
          fixedColumnCount = _props9.fixedColumnCount,
          columnWidth = _props9.columnWidth;
      var _state2 = this.state,
          scrollbarSize = _state2.scrollbarSize,
          showHorizontalScrollbar = _state2.showHorizontalScrollbar;

      // An extra cell is added to the count
      // This gives the smaller Grid extra room for offset,
      // In case the main (bottom right) Grid has a scrollbar
      // If no scrollbar, the extra space is overflow:hidden anyway

      if (showHorizontalScrollbar && index === columnCount - fixedColumnCount) {
        return scrollbarSize;
      }

      return typeof columnWidth === 'function' ? columnWidth({ index: index + fixedColumnCount }) : columnWidth;
    }
  }, {
    key: '_getBottomGridHeight',
    value: function _getBottomGridHeight(props) {
      var height = props.height;


      var topGridHeight = this._getTopGridHeight(props);

      return height - topGridHeight;
    }
  }, {
    key: '_getLeftGridWidth',
    value: function _getLeftGridWidth(props) {
      var fixedColumnCount = props.fixedColumnCount,
          columnWidth = props.columnWidth;


      if (this._leftGridWidth == null) {
        if (typeof columnWidth === 'function') {
          var leftGridWidth = 0;

          for (var index = 0; index < fixedColumnCount; index++) {
            leftGridWidth += columnWidth({ index: index });
          }

          this._leftGridWidth = leftGridWidth;
        } else {
          this._leftGridWidth = columnWidth * fixedColumnCount;
        }
      }

      return this._leftGridWidth;
    }
  }, {
    key: '_getRightGridWidth',
    value: function _getRightGridWidth(props) {
      var width = props.width;


      var leftGridWidth = this._getLeftGridWidth(props);

      return width - leftGridWidth;
    }
  }, {
    key: '_getTopGridHeight',
    value: function _getTopGridHeight(props) {
      var fixedRowCount = props.fixedRowCount,
          rowHeight = props.rowHeight;


      if (this._topGridHeight == null) {
        if (typeof rowHeight === 'function') {
          var topGridHeight = 0;

          for (var index = 0; index < fixedRowCount; index++) {
            topGridHeight += rowHeight({ index: index });
          }

          this._topGridHeight = topGridHeight;
        } else {
          this._topGridHeight = rowHeight * fixedRowCount;
        }
      }

      return this._topGridHeight;
    }
  }, {
    key: '_handleInvalidatedGridSize',
    value: function _handleInvalidatedGridSize() {
      if (typeof this._deferredInvalidateColumnIndex === 'number') {
        var columnIndex = this._deferredInvalidateColumnIndex;
        var rowIndex = this._deferredInvalidateRowIndex;

        this._deferredInvalidateColumnIndex = null;
        this._deferredInvalidateRowIndex = null;

        this.recomputeGridSize({
          columnIndex: columnIndex,
          rowIndex: rowIndex
        });
        this.forceUpdate();
      }
    }

    /**
     * Avoid recreating inline styles each render; this bypasses Grid's shallowCompare.
     * This method recalculates styles only when specific props change.
     */

  }, {
    key: '_maybeCalculateCachedStyles',
    value: function _maybeCalculateCachedStyles(prevProps, props) {
      var columnWidth = props.columnWidth,
          enableFixedColumnScroll = props.enableFixedColumnScroll,
          enableFixedRowScroll = props.enableFixedRowScroll,
          height = props.height,
          fixedColumnCount = props.fixedColumnCount,
          fixedRowCount = props.fixedRowCount,
          rowHeight = props.rowHeight,
          style = props.style,
          styleBottomLeftGrid = props.styleBottomLeftGrid,
          styleBottomRightGrid = props.styleBottomRightGrid,
          styleTopLeftGrid = props.styleTopLeftGrid,
          styleTopRightGrid = props.styleTopRightGrid,
          width = props.width;


      var firstRender = !prevProps;
      var sizeChange = firstRender || height !== prevProps.height || width !== prevProps.width;
      var leftSizeChange = firstRender || columnWidth !== prevProps.columnWidth || fixedColumnCount !== prevProps.fixedColumnCount;
      var topSizeChange = firstRender || fixedRowCount !== prevProps.fixedRowCount || rowHeight !== prevProps.rowHeight;

      if (firstRender || sizeChange || style !== prevProps.style) {
        this._containerOuterStyle = _extends({
          height: height,
          overflow: 'visible', // Let :focus outline show through
          width: width
        }, style);
      }

      if (firstRender || sizeChange || topSizeChange) {
        this._containerTopStyle = {
          height: this._getTopGridHeight(props),
          position: 'relative',
          width: width
        };

        this._containerBottomStyle = {
          height: height - this._getTopGridHeight(props),
          overflow: 'visible', // Let :focus outline show through
          position: 'relative',
          width: width
        };
      }

      if (firstRender || styleBottomLeftGrid !== prevProps.styleBottomLeftGrid) {
        this._bottomLeftGridStyle = _extends({
          left: 0,
          overflowX: 'hidden',
          overflowY: enableFixedColumnScroll ? 'auto' : 'hidden',
          position: 'absolute'
        }, styleBottomLeftGrid);
      }

      if (firstRender || leftSizeChange || styleBottomRightGrid !== prevProps.styleBottomRightGrid) {
        this._bottomRightGridStyle = _extends({
          left: this._getLeftGridWidth(props),
          position: 'absolute'
        }, styleBottomRightGrid);
      }

      if (firstRender || styleTopLeftGrid !== prevProps.styleTopLeftGrid) {
        this._topLeftGridStyle = _extends({
          left: 0,
          overflowX: 'hidden',
          overflowY: 'hidden',
          position: 'absolute',
          top: 0
        }, styleTopLeftGrid);
      }

      if (firstRender || leftSizeChange || styleTopRightGrid !== prevProps.styleTopRightGrid) {
        this._topRightGridStyle = _extends({
          left: this._getLeftGridWidth(props),
          overflowX: enableFixedRowScroll ? 'auto' : 'hidden',
          overflowY: 'hidden',
          position: 'absolute',
          top: 0
        }, styleTopRightGrid);
      }
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(scrollInfo) {
      var scrollLeft = scrollInfo.scrollLeft,
          scrollTop = scrollInfo.scrollTop;

      this.setState({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
      var onScroll = this.props.onScroll;
      if (onScroll) {
        onScroll(scrollInfo);
      }
    }
  }, {
    key: '_onScrollbarPresenceChange',
    value: function _onScrollbarPresenceChange(_ref7) {
      var horizontal = _ref7.horizontal,
          size = _ref7.size,
          vertical = _ref7.vertical;
      var _state3 = this.state,
          showHorizontalScrollbar = _state3.showHorizontalScrollbar,
          showVerticalScrollbar = _state3.showVerticalScrollbar;


      if (horizontal !== showHorizontalScrollbar || vertical !== showVerticalScrollbar) {
        this.setState({
          scrollbarSize: size,
          showHorizontalScrollbar: horizontal,
          showVerticalScrollbar: vertical
        });
      }
    }
  }, {
    key: '_onScrollLeft',
    value: function _onScrollLeft(scrollInfo) {
      var scrollLeft = scrollInfo.scrollLeft;

      this._onScroll({
        scrollLeft: scrollLeft,
        scrollTop: this.state.scrollTop
      });
    }
  }, {
    key: '_onScrollTop',
    value: function _onScrollTop(scrollInfo) {
      var scrollTop = scrollInfo.scrollTop;

      this._onScroll({
        scrollTop: scrollTop,
        scrollLeft: this.state.scrollLeft
      });
    }
  }, {
    key: '_renderBottomLeftGrid',
    value: function _renderBottomLeftGrid(props) {
      var enableFixedColumnScroll = props.enableFixedColumnScroll,
          fixedColumnCount = props.fixedColumnCount,
          fixedRowCount = props.fixedRowCount,
          rowCount = props.rowCount,
          scrollTop = props.scrollTop;
      var showVerticalScrollbar = this.state.showVerticalScrollbar;


      if (!fixedColumnCount) {
        return null;
      }

      var additionalRowCount = showVerticalScrollbar ? 1 : 0;

      return _react2.default.createElement(_Grid2.default, _extends({}, props, {
        cellRenderer: this._cellRendererBottomLeftGrid,
        className: this.props.classNameBottomLeftGrid,
        columnCount: fixedColumnCount,
        deferredMeasurementCache: this._deferredMeasurementCacheBottomLeftGrid,
        height: this._getBottomGridHeight(props),
        onScroll: enableFixedColumnScroll ? this._onScrollTop : undefined,
        ref: this._bottomLeftGridRef,
        rowCount: Math.max(0, rowCount - fixedRowCount) + additionalRowCount,
        rowHeight: this._rowHeightBottomGrid,
        scrollTop: scrollTop,
        style: this._bottomLeftGridStyle,
        tabIndex: null,
        width: this._getLeftGridWidth(props)
      }));
    }
  }, {
    key: '_renderBottomRightGrid',
    value: function _renderBottomRightGrid(props) {
      var columnCount = props.columnCount,
          fixedColumnCount = props.fixedColumnCount,
          fixedRowCount = props.fixedRowCount,
          rowCount = props.rowCount,
          scrollToColumn = props.scrollToColumn,
          scrollToRow = props.scrollToRow;


      return _react2.default.createElement(_Grid2.default, _extends({}, props, {
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
    key: '_renderTopLeftGrid',
    value: function _renderTopLeftGrid(props) {
      var fixedColumnCount = props.fixedColumnCount,
          fixedRowCount = props.fixedRowCount;


      if (!fixedColumnCount || !fixedRowCount) {
        return null;
      }

      return _react2.default.createElement(_Grid2.default, _extends({}, props, {
        className: this.props.classNameTopLeftGrid,
        columnCount: fixedColumnCount,
        height: this._getTopGridHeight(props),
        ref: this._topLeftGridRef,
        rowCount: fixedRowCount,
        style: this._topLeftGridStyle,
        tabIndex: null,
        width: this._getLeftGridWidth(props)
      }));
    }
  }, {
    key: '_renderTopRightGrid',
    value: function _renderTopRightGrid(props) {
      var columnCount = props.columnCount,
          enableFixedRowScroll = props.enableFixedRowScroll,
          fixedColumnCount = props.fixedColumnCount,
          fixedRowCount = props.fixedRowCount,
          scrollLeft = props.scrollLeft;
      var showHorizontalScrollbar = this.state.showHorizontalScrollbar;


      if (!fixedRowCount) {
        return null;
      }

      var additionalColumnCount = showHorizontalScrollbar ? 1 : 0;

      return _react2.default.createElement(_Grid2.default, _extends({}, props, {
        cellRenderer: this._cellRendererTopRightGrid,
        className: this.props.classNameTopRightGrid,
        columnCount: Math.max(0, columnCount - fixedColumnCount) + additionalColumnCount,
        columnWidth: this._columnWidthRightGrid,
        deferredMeasurementCache: this._deferredMeasurementCacheTopRightGrid,
        height: this._getTopGridHeight(props),
        onScroll: enableFixedRowScroll ? this._onScrollLeft : undefined,
        ref: this._topRightGridRef,
        rowCount: fixedRowCount,
        scrollLeft: scrollLeft,
        style: this._topRightGridStyle,
        tabIndex: null,
        width: this._getRightGridWidth(props)
      }));
    }
  }, {
    key: '_rowHeightBottomGrid',
    value: function _rowHeightBottomGrid(_ref8) {
      var index = _ref8.index;
      var _props10 = this.props,
          fixedRowCount = _props10.fixedRowCount,
          rowCount = _props10.rowCount,
          rowHeight = _props10.rowHeight;
      var _state4 = this.state,
          scrollbarSize = _state4.scrollbarSize,
          showVerticalScrollbar = _state4.showVerticalScrollbar;

      // An extra cell is added to the count
      // This gives the smaller Grid extra room for offset,
      // In case the main (bottom right) Grid has a scrollbar
      // If no scrollbar, the extra space is overflow:hidden anyway

      if (showVerticalScrollbar && index === rowCount - fixedRowCount) {
        return scrollbarSize;
      }

      return typeof rowHeight === 'function' ? rowHeight({ index: index + fixedRowCount }) : rowHeight;
    }
  }, {
    key: '_topLeftGridRef',
    value: function _topLeftGridRef(ref) {
      this._topLeftGrid = ref;
    }
  }, {
    key: '_topRightGridRef',
    value: function _topRightGridRef(ref) {
      this._topRightGrid = ref;
    }
  }]);

  return MultiGrid;
}(_react.PureComponent);

MultiGrid.defaultProps = {
  classNameBottomLeftGrid: '',
  classNameBottomRightGrid: '',
  classNameTopLeftGrid: '',
  classNameTopRightGrid: '',
  enableFixedColumnScroll: false,
  enableFixedRowScroll: false,
  fixedColumnCount: 0,
  fixedRowCount: 0,
  scrollToColumn: -1,
  scrollToRow: -1,
  style: {},
  styleBottomLeftGrid: {},
  styleBottomRightGrid: {},
  styleTopLeftGrid: {},
  styleTopRightGrid: {}
};
exports.default = MultiGrid;
MultiGrid.propTypes = process.env.NODE_ENV !== "production" ? {
  classNameBottomLeftGrid: _propTypes2.default.string.isRequired,
  classNameBottomRightGrid: _propTypes2.default.string.isRequired,
  classNameTopLeftGrid: _propTypes2.default.string.isRequired,
  classNameTopRightGrid: _propTypes2.default.string.isRequired,
  enableFixedColumnScroll: _propTypes2.default.bool.isRequired,
  enableFixedRowScroll: _propTypes2.default.bool.isRequired,
  fixedColumnCount: _propTypes2.default.number.isRequired,
  fixedRowCount: _propTypes2.default.number.isRequired,
  style: _propTypes2.default.object.isRequired,
  styleBottomLeftGrid: _propTypes2.default.object.isRequired,
  styleBottomRightGrid: _propTypes2.default.object.isRequired,
  styleTopLeftGrid: _propTypes2.default.object.isRequired,
  styleTopRightGrid: _propTypes2.default.object.isRequired
} : {};