'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _extends2 = _interopRequireDefault(
  require('@babel/runtime/helpers/extends'),
);

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

var _propTypes = _interopRequireDefault(require('prop-types'));

var React = _interopRequireWildcard(require('react'));

var _CollectionView = _interopRequireDefault(require('./CollectionView'));

var _calculateSizeAndPositionData2 = _interopRequireDefault(
  require('./utils/calculateSizeAndPositionData'),
);

var _getUpdatedOffsetForIndex = _interopRequireDefault(
  require('../utils/getUpdatedOffsetForIndex'),
);

var _types = require('./types');

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

/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */
var Collection = /*#__PURE__*/ (function(_React$PureComponent) {
  (0, _inherits2['default'])(Collection, _React$PureComponent);

  var _super = _createSuper(Collection);

  function Collection(props, context) {
    var _this;

    (0, _classCallCheck2['default'])(this, Collection);
    _this = _super.call(this, props, context);
    _this._cellMetadata = [];
    _this._lastRenderedCellIndices = []; // Cell cache during scroll (for performance)

    _this._cellCache = [];
    _this._isScrollingChange = _this._isScrollingChange.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    _this._setCollectionViewRef = _this._setCollectionViewRef.bind(
      (0, _assertThisInitialized2['default'])(_this),
    );
    return _this;
  }

  (0, _createClass2['default'])(Collection, [
    {
      key: 'forceUpdate',
      value: function forceUpdate() {
        if (this._collectionView !== undefined) {
          this._collectionView.forceUpdate();
        }
      },
      /** See Collection#recomputeCellSizesAndPositions */
    },
    {
      key: 'recomputeCellSizesAndPositions',
      value: function recomputeCellSizesAndPositions() {
        this._cellCache = [];

        this._collectionView.recomputeCellSizesAndPositions();
      },
      /** React lifecycle methods */
    },
    {
      key: 'render',
      value: function render() {
        var props = (0, _extends2['default'])({}, this.props);
        return /*#__PURE__*/ React.createElement(
          _CollectionView['default'],
          (0, _extends2['default'])(
            {
              cellLayoutManager: this,
              isScrollingChange: this._isScrollingChange,
              ref: this._setCollectionViewRef,
            },
            props,
          ),
        );
      },
      /** CellLayoutManager interface */
    },
    {
      key: 'calculateSizeAndPositionData',
      value: function calculateSizeAndPositionData() {
        var _this$props = this.props,
          cellCount = _this$props.cellCount,
          cellSizeAndPositionGetter = _this$props.cellSizeAndPositionGetter,
          sectionSize = _this$props.sectionSize;
        var data = (0, _calculateSizeAndPositionData2['default'])({
          cellCount: cellCount,
          cellSizeAndPositionGetter: cellSizeAndPositionGetter,
          sectionSize: sectionSize,
        });
        this._cellMetadata = data.cellMetadata;
        this._sectionManager = data.sectionManager;
        this._height = data.height;
        this._width = data.width;
      },
      /**
       * Returns the most recently rendered set of cell indices.
       */
    },
    {
      key: 'getLastRenderedIndices',
      value: function getLastRenderedIndices() {
        return this._lastRenderedCellIndices;
      },
      /**
       * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
       */
    },
    {
      key: 'getScrollPositionForCell',
      value: function getScrollPositionForCell(_ref) {
        var align = _ref.align,
          cellIndex = _ref.cellIndex,
          height = _ref.height,
          scrollLeft = _ref.scrollLeft,
          scrollTop = _ref.scrollTop,
          width = _ref.width;
        var cellCount = this.props.cellCount;

        if (cellIndex >= 0 && cellIndex < cellCount) {
          var cellMetadata = this._cellMetadata[cellIndex];
          scrollLeft = (0, _getUpdatedOffsetForIndex['default'])({
            align: align,
            cellOffset: cellMetadata.x,
            cellSize: cellMetadata.width,
            containerSize: width,
            currentOffset: scrollLeft,
            targetIndex: cellIndex,
          });
          scrollTop = (0, _getUpdatedOffsetForIndex['default'])({
            align: align,
            cellOffset: cellMetadata.y,
            cellSize: cellMetadata.height,
            containerSize: height,
            currentOffset: scrollTop,
            targetIndex: cellIndex,
          });
        }

        return {
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
        };
      },
    },
    {
      key: 'getTotalSize',
      value: function getTotalSize() {
        return {
          height: this._height,
          width: this._width,
        };
      },
    },
    {
      key: 'cellRenderers',
      value: function cellRenderers(_ref2) {
        var _this2 = this;

        var height = _ref2.height,
          isScrolling = _ref2.isScrolling,
          width = _ref2.width,
          x = _ref2.x,
          y = _ref2.y;
        var _this$props2 = this.props,
          cellGroupRenderer = _this$props2.cellGroupRenderer,
          cellRenderer = _this$props2.cellRenderer; // Store for later calls to getLastRenderedIndices()

        this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
          height: height,
          width: width,
          x: x,
          y: y,
        });
        return cellGroupRenderer({
          cellCache: this._cellCache,
          cellRenderer: cellRenderer,
          cellSizeAndPositionGetter: function cellSizeAndPositionGetter(_ref3) {
            var index = _ref3.index;
            return _this2._sectionManager.getCellMetadata({
              index: index,
            });
          },
          indices: this._lastRenderedCellIndices,
          isScrolling: isScrolling,
        });
      },
    },
    {
      key: '_isScrollingChange',
      value: function _isScrollingChange(isScrolling) {
        if (!isScrolling) {
          this._cellCache = [];
        }
      },
    },
    {
      key: '_setCollectionViewRef',
      value: function _setCollectionViewRef(ref) {
        this._collectionView = ref;
      },
    },
  ]);
  return Collection;
})(React.PureComponent);

exports['default'] = Collection;
(0, _defineProperty2['default'])(Collection, 'defaultProps', {
  'aria-label': 'grid',
  cellGroupRenderer: defaultCellGroupRenderer,
});
Collection.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        'aria-label': _propTypes['default'].string,

        /**
         * Number of cells in Collection.
         */
        cellCount: _propTypes['default'].number.isRequired,

        /**
         * Responsible for rendering a group of cells given their indices.
         * Should implement the following interface: ({
         *   cellSizeAndPositionGetter:Function,
         *   indices: Array<number>,
         *   cellRenderer: Function
         * }): Array<PropTypes.node>
         */
        cellGroupRenderer: _propTypes['default'].func.isRequired,

        /**
         * Responsible for rendering a cell given an row and column index.
         * Should implement the following interface: ({ index: number, key: string, style: object }): PropTypes.element
         */
        cellRenderer: _propTypes['default'].func.isRequired,

        /**
         * Callback responsible for returning size and offset/position information for a given cell (index).
         * ({ index: number }): { height: number, width: number, x: number, y: number }
         */
        cellSizeAndPositionGetter: _propTypes['default'].func.isRequired,

        /**
         * Optionally override the size of the sections a Collection's cells are split into.
         */
        sectionSize: _propTypes['default'].number,
      }
    : {};

function defaultCellGroupRenderer(_ref4) {
  var cellCache = _ref4.cellCache,
    cellRenderer = _ref4.cellRenderer,
    cellSizeAndPositionGetter = _ref4.cellSizeAndPositionGetter,
    indices = _ref4.indices,
    isScrolling = _ref4.isScrolling;
  return indices
    .map(function(index) {
      var cellMetadata = cellSizeAndPositionGetter({
        index: index,
      });
      var cellRendererProps = {
        index: index,
        isScrolling: isScrolling,
        key: index,
        style: {
          height: cellMetadata.height,
          left: cellMetadata.x,
          position: 'absolute',
          top: cellMetadata.y,
          width: cellMetadata.width,
        },
      }; // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling complets.

      if (isScrolling) {
        if (!(index in cellCache)) {
          cellCache[index] = cellRenderer(cellRendererProps);
        }

        return cellCache[index];
      } else {
        return cellRenderer(cellRendererProps);
      }
    })
    .filter(function(renderedCell) {
      return !!renderedCell;
    });
}
