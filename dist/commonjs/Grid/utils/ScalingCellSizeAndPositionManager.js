'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var _CellSizeAndPositionManager = _interopRequireDefault(
  require('./CellSizeAndPositionManager'),
);

var _maxElementSize = require('./maxElementSize.js');

/*:: import type {Alignment, CellSizeGetter, VisibleCellRange} from '../types';*/

/**
 * Extends CellSizeAndPositionManager and adds scaling behavior for lists that are too large to fit within a browser's native limits.
 */
var ScalingCellSizeAndPositionManager =
  /*#__PURE__*/
  (function() {
    function ScalingCellSizeAndPositionManager(_ref) {
      var _ref$maxScrollSize = _ref.maxScrollSize,
        maxScrollSize =
          _ref$maxScrollSize === void 0
            ? (0, _maxElementSize.getMaxElementSize)()
            : _ref$maxScrollSize,
        params = (0, _objectWithoutProperties2['default'])(_ref, [
          'maxScrollSize',
        ]);
      (0, _classCallCheck2['default'])(this, ScalingCellSizeAndPositionManager);
      (0, _defineProperty2['default'])(
        this,
        '_cellSizeAndPositionManager',
        void 0,
      );
      (0, _defineProperty2['default'])(this, '_maxScrollSize', void 0);
      // Favor composition over inheritance to simplify IE10 support
      this._cellSizeAndPositionManager = new _CellSizeAndPositionManager[
        'default'
      ](params);
      this._maxScrollSize = maxScrollSize;
    }

    (0, _createClass2['default'])(ScalingCellSizeAndPositionManager, [
      {
        key: 'areOffsetsAdjusted',
        value: function areOffsetsAdjusted() /*: boolean*/
        {
          return (
            this._cellSizeAndPositionManager.getTotalSize() >
            this._maxScrollSize
          );
        },
      },
      {
        key: 'configure',
        value: function configure(
          params,
          /*: {
        cellCount: number,
        estimatedCellSize: number,
        cellSizeGetter: CellSizeGetter,
      }*/
        ) {
          this._cellSizeAndPositionManager.configure(params);
        },
      },
      {
        key: 'getCellCount',
        value: function getCellCount() /*: number*/
        {
          return this._cellSizeAndPositionManager.getCellCount();
        },
      },
      {
        key: 'getEstimatedCellSize',
        value: function getEstimatedCellSize() /*: number*/
        {
          return this._cellSizeAndPositionManager.getEstimatedCellSize();
        },
      },
      {
        key: 'getLastMeasuredIndex',
        value: function getLastMeasuredIndex() /*: number*/
        {
          return this._cellSizeAndPositionManager.getLastMeasuredIndex();
        },
        /**
         * Number of pixels a cell at the given position (offset) should be shifted in order to fit within the scaled container.
         * The offset passed to this function is scaled (safe) as well.
         */
      },
      {
        key: 'getOffsetAdjustment',
        value: function getOffsetAdjustment(_ref2) /*: number*/
        {
          var containerSize = _ref2.containerSize,
            offset = _ref2.offset;

          var totalSize = this._cellSizeAndPositionManager.getTotalSize();

          var safeTotalSize = this.getTotalSize();

          var offsetPercentage = this._getOffsetPercentage({
            containerSize: containerSize,
            offset: offset,
            totalSize: safeTotalSize,
          });

          return Math.round(offsetPercentage * (safeTotalSize - totalSize));
        },
      },
      {
        key: 'getSizeAndPositionOfCell',
        value: function getSizeAndPositionOfCell(
          index,
          /*: number*/
        ) {
          return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(
            index,
          );
        },
      },
      {
        key: 'getSizeAndPositionOfLastMeasuredCell',
        value: function getSizeAndPositionOfLastMeasuredCell() {
          return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
        },
        /** See CellSizeAndPositionManager#getTotalSize */
      },
      {
        key: 'getTotalSize',
        value: function getTotalSize() /*: number*/
        {
          return Math.min(
            this._maxScrollSize,
            this._cellSizeAndPositionManager.getTotalSize(),
          );
        },
        /** See CellSizeAndPositionManager#getUpdatedOffsetForIndex */
      },
      {
        key: 'getUpdatedOffsetForIndex',
        value: function getUpdatedOffsetForIndex(_ref3) {
          var _ref3$align = _ref3.align,
            align = _ref3$align === void 0 ? 'auto' : _ref3$align,
            containerSize = _ref3.containerSize,
            currentOffset = _ref3.currentOffset,
            targetIndex = _ref3.targetIndex;
          currentOffset = this._safeOffsetToOffset({
            containerSize: containerSize,
            offset: currentOffset,
          });

          var offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex(
            {
              align: align,
              containerSize: containerSize,
              currentOffset: currentOffset,
              targetIndex: targetIndex,
            },
          );

          return this._offsetToSafeOffset({
            containerSize: containerSize,
            offset: offset,
          });
        },
        /** See CellSizeAndPositionManager#getVisibleCellRange */
      },
      {
        key: 'getVisibleCellRange',
        value: function getVisibleCellRange(_ref4) /*: VisibleCellRange*/
        {
          var containerSize = _ref4.containerSize,
            offset = _ref4.offset;
          offset = this._safeOffsetToOffset({
            containerSize: containerSize,
            offset: offset,
          });
          return this._cellSizeAndPositionManager.getVisibleCellRange({
            containerSize: containerSize,
            offset: offset,
          });
        },
      },
      {
        key: 'resetCell',
        value: function resetCell(
          index,
          /*: number*/
        ) /*: void*/
        {
          this._cellSizeAndPositionManager.resetCell(index);
        },
      },
      {
        key: '_getOffsetPercentage',
        value: function _getOffsetPercentage(_ref5) {
          var containerSize = _ref5.containerSize,
            offset = _ref5.offset,
            totalSize = _ref5.totalSize;
          return totalSize <= containerSize
            ? 0
            : offset / (totalSize - containerSize);
        },
      },
      {
        key: '_offsetToSafeOffset',
        value: function _offsetToSafeOffset(_ref6) /*: number*/
        {
          var containerSize = _ref6.containerSize,
            offset = _ref6.offset;

          var totalSize = this._cellSizeAndPositionManager.getTotalSize();

          var safeTotalSize = this.getTotalSize();

          if (totalSize === safeTotalSize) {
            return offset;
          } else {
            var offsetPercentage = this._getOffsetPercentage({
              containerSize: containerSize,
              offset: offset,
              totalSize: totalSize,
            });

            return Math.round(
              offsetPercentage * (safeTotalSize - containerSize),
            );
          }
        },
      },
      {
        key: '_safeOffsetToOffset',
        value: function _safeOffsetToOffset(_ref7) /*: number*/
        {
          var containerSize = _ref7.containerSize,
            offset = _ref7.offset;

          var totalSize = this._cellSizeAndPositionManager.getTotalSize();

          var safeTotalSize = this.getTotalSize();

          if (totalSize === safeTotalSize) {
            return offset;
          } else {
            var offsetPercentage = this._getOffsetPercentage({
              containerSize: containerSize,
              offset: offset,
              totalSize: safeTotalSize,
            });

            return Math.round(offsetPercentage * (totalSize - containerSize));
          }
        },
      },
    ]);
    return ScalingCellSizeAndPositionManager;
  })();

exports['default'] = ScalingCellSizeAndPositionManager;
