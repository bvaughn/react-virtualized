/** @flow */
import PropTypes from 'prop-types';
import * as React from 'react';

/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */
export default class ColumnSizer extends React.PureComponent {
  static propTypes = {
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
    width: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._registerChild = this._registerChild.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {columnMaxWidth, columnMinWidth, columnCount, width} = this.props;

    if (
      columnMaxWidth !== prevProps.columnMaxWidth ||
      columnMinWidth !== prevProps.columnMinWidth ||
      columnCount !== prevProps.columnCount ||
      width !== prevProps.width
    ) {
      if (this._registeredChild) {
        this._registeredChild.recomputeGridSize();
      }
    }
  }

  render() {
    const {
      children,
      columnMaxWidth,
      columnMinWidth,
      columnCount,
      width,
    } = this.props;

    const safeColumnMinWidth = columnMinWidth || 1;

    const safeColumnMaxWidth = columnMaxWidth
      ? Math.min(columnMaxWidth, width)
      : width;

    let columnWidth = width / columnCount;
    columnWidth = Math.max(safeColumnMinWidth, columnWidth);
    columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
    columnWidth = Math.floor(columnWidth);

    let adjustedWidth = Math.min(width, columnWidth * columnCount);

    return children({
      adjustedWidth,
      columnWidth,
      getColumnWidth: () => columnWidth,
      registerChild: this._registerChild,
    });
  }

  _registerChild(child) {
    if (child && typeof child.recomputeGridSize !== 'function') {
      throw Error(
        'Unexpected child type registered; only Grid/MultiGrid children are supported.',
      );
    }

    this._registeredChild = child;

    if (this._registeredChild) {
      this._registeredChild.recomputeGridSize();
    }
  }
}
