'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CollectionView = require('./CollectionView');

var _CollectionView2 = _interopRequireDefault(_CollectionView);

var _calculateSizeAndPositionData2 = require('./utils/calculateSizeAndPositionData');

var _calculateSizeAndPositionData3 = _interopRequireDefault(_calculateSizeAndPositionData2);

var _getUpdatedOffsetForIndex = require('../utils/getUpdatedOffsetForIndex');

var _getUpdatedOffsetForIndex2 = _interopRequireDefault(_getUpdatedOffsetForIndex);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */

var Collection = function (_Component) {
  _inherits(Collection, _Component);

  function Collection(props, context) {
    _classCallCheck(this, Collection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this, props, context));

    _this._cellMetadata = [];
    _this._lastRenderedCellIndices = [];
    return _this;
  }

  /** React lifecycle methods */

  _createClass(Collection, [{
    key: 'render',
    value: function render() {
      var props = _objectWithoutProperties(this.props, []);

      return _react2.default.createElement(_CollectionView2.default, _extends({
        cellLayoutManager: this,
        ref: 'CollectionView'
      }, props));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
    }

    /** CellLayoutManager interface */

  }, {
    key: 'calculateSizeAndPositionData',
    value: function calculateSizeAndPositionData() {
      var _props = this.props;
      var cellCount = _props.cellCount;
      var cellSizeAndPositionGetter = _props.cellSizeAndPositionGetter;
      var sectionSize = _props.sectionSize;


      var data = (0, _calculateSizeAndPositionData3.default)({
        cellCount: cellCount,
        cellSizeAndPositionGetter: cellSizeAndPositionGetter,
        sectionSize: sectionSize
      });

      this._cellMetadata = data.cellMetadata;
      this._sectionManager = data.sectionManager;
      this._height = data.height;
      this._width = data.width;
    }

    /**
     * Returns the most recently rendered set of cell indices.
     */

  }, {
    key: 'getLastRenderedIndices',
    value: function getLastRenderedIndices() {
      return this._lastRenderedCellIndices;
    }

    /**
     * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
     */

  }, {
    key: 'getScrollPositionForCell',
    value: function getScrollPositionForCell(_ref) {
      var cellIndex = _ref.cellIndex;
      var height = _ref.height;
      var scrollLeft = _ref.scrollLeft;
      var scrollTop = _ref.scrollTop;
      var width = _ref.width;
      var cellCount = this.props.cellCount;


      if (cellIndex >= 0 && cellIndex < cellCount) {
        var cellMetadata = this._cellMetadata[cellIndex];

        scrollLeft = (0, _getUpdatedOffsetForIndex2.default)({
          cellOffset: cellMetadata.x,
          cellSize: cellMetadata.width,
          containerSize: width,
          currentOffset: scrollLeft,
          targetIndex: cellIndex
        });

        scrollTop = (0, _getUpdatedOffsetForIndex2.default)({
          cellOffset: cellMetadata.y,
          cellSize: cellMetadata.height,
          containerSize: height,
          currentOffset: scrollTop,
          targetIndex: cellIndex
        });
      }

      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }
  }, {
    key: 'getTotalSize',
    value: function getTotalSize() {
      return {
        height: this._height,
        width: this._width
      };
    }
  }, {
    key: 'renderCells',
    value: function renderCells(_ref2) {
      var _this2 = this;

      var height = _ref2.height;
      var isScrolling = _ref2.isScrolling;
      var width = _ref2.width;
      var x = _ref2.x;
      var y = _ref2.y;
      var _props2 = this.props;
      var cellGroupRenderer = _props2.cellGroupRenderer;
      var cellRenderer = _props2.cellRenderer;

      // Store for later calls to getLastRenderedIndices()

      this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
        height: height,
        width: width,
        x: x,
        y: y
      });

      return cellGroupRenderer({
        cellRenderer: cellRenderer,
        cellSizeAndPositionGetter: function cellSizeAndPositionGetter(index) {
          return _this2._sectionManager.getCellMetadata(index);
        },
        indices: this._lastRenderedCellIndices
      });
    }
  }]);

  return Collection;
}(_react.Component);

Collection.propTypes = {
  'aria-label': _react.PropTypes.string,

  /**
   * Number of cells in Collection.
   */
  cellCount: _react.PropTypes.number.isRequired,

  /**
   * Responsible for rendering a group of cells given their indices.
   * Should implement the following interface: ({
   *   cellSizeAndPositionGetter:Function,
   *   indices: Array<number>,
   *   cellRenderer: Function
   * }): Array<PropTypes.node>
   */
  cellGroupRenderer: _react.PropTypes.func.isRequired,

  /**
   * Responsible for rendering a cell given an row and column index.
   * Should implement the following interface: (index: number): PropTypes.node
   */
  cellRenderer: _react.PropTypes.func.isRequired,

  /**
   * Callback responsible for returning size and offset/position information for a given cell (index).
   * (index): { height: number, width: number, x: number, y: number }
   */
  cellSizeAndPositionGetter: _react.PropTypes.func.isRequired,

  /**
   * Optionally override the size of the sections a Collection's cells are split into.
   */
  sectionSize: _react.PropTypes.number
};
Collection.defaultProps = {
  'aria-label': 'grid',
  cellGroupRenderer: defaultCellGroupRenderer
};
exports.default = Collection;


function defaultCellGroupRenderer(_ref3) {
  var cellRenderer = _ref3.cellRenderer;
  var cellSizeAndPositionGetter = _ref3.cellSizeAndPositionGetter;
  var indices = _ref3.indices;

  return indices.map(function (index) {
    var cellMetadata = cellSizeAndPositionGetter(index);
    var renderedCell = cellRenderer(index);

    if (renderedCell == null || renderedCell === false) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      {
        className: 'Collection__cell',
        key: index,
        style: {
          height: cellMetadata.height,
          left: cellMetadata.x,
          top: cellMetadata.y,
          width: cellMetadata.width
        }
      },
      renderedCell
    );
  }).filter(function (renderedCell) {
    return !!renderedCell;
  });
}