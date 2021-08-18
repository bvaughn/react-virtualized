import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import PropTypes from 'prop-types';
import * as React from 'react';
/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */

var ColumnSizer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ColumnSizer, _React$PureComponent);

  function ColumnSizer(props, context) {
    var _this;

    _classCallCheck(this, ColumnSizer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ColumnSizer).call(this, props, context));
    _this._registerChild = _this._registerChild.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ColumnSizer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          columnMaxWidth = _this$props.columnMaxWidth,
          columnMinWidth = _this$props.columnMinWidth,
          columnCount = _this$props.columnCount,
          width = _this$props.width;

      if (columnMaxWidth !== prevProps.columnMaxWidth || columnMinWidth !== prevProps.columnMinWidth || columnCount !== prevProps.columnCount || width !== prevProps.width) {
        if (this._registeredChild) {
          this._registeredChild.recomputeGridSize();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          columnMaxWidth = _this$props2.columnMaxWidth,
          columnMinWidth = _this$props2.columnMinWidth,
          columnCount = _this$props2.columnCount,
          width = _this$props2.width;
      var safeColumnMinWidth = columnMinWidth || 1;
      var safeColumnMaxWidth = columnMaxWidth ? Math.min(columnMaxWidth, width) : width;
      var columnWidth = width / columnCount;
      columnWidth = Math.max(safeColumnMinWidth, columnWidth);
      columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
      columnWidth = Math.floor(columnWidth);
      var adjustedWidth = Math.min(width, columnWidth * columnCount);
      return children({
        adjustedWidth: adjustedWidth,
        columnWidth: columnWidth,
        getColumnWidth: function getColumnWidth() {
          return columnWidth;
        },
        registerChild: this._registerChild
      });
    }
  }, {
    key: "_registerChild",
    value: function _registerChild(child) {
      if (child && typeof child.recomputeGridSize !== 'function') {
        throw Error('Unexpected child type registered; only Grid/MultiGrid children are supported.');
      }

      this._registeredChild = child;

      if (this._registeredChild) {
        this._registeredChild.recomputeGridSize();
      }
    }
  }]);

  return ColumnSizer;
}(React.PureComponent);

export { ColumnSizer as default };
ColumnSizer.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * Function responsible for rendering a virtualized Grid.
   * This function should implement the following signature:
   * ({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element
   *
   * The specified :getColumnWidth function should be passed to the Grid's :columnWidth property.
   * The :registerChild should be passed to the Grid's :ref property.
   * The :adjustedWidth property is optional; it reflects the lesser of the overall width or the width of all columns.
   */
  children: PropTypes.func.isRequired,

  /** Optional maximum allowed column width */
  columnMaxWidth: PropTypes.number,

  /** Optional minimum allowed column width */
  columnMinWidth: PropTypes.number,

  /** Number of columns in Grid or Table child */
  columnCount: PropTypes.number.isRequired,

  /** Width of Grid or Table child */
  width: PropTypes.number.isRequired
} : {};