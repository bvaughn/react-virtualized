import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/*:: import type {
  NoContentRenderer,
  Alignment,
  CellSize,
  CellPosition,
  OverscanIndicesGetter,
  RenderedSection,
  CellRendererParams,
  Scroll as GridScroll,
} from '../Grid';*/

/*:: import type {RowRenderer, RenderedRows, Scroll} from './types';*/
import Grid, { accessibilityOverscanIndicesGetter } from '../Grid';
import * as React from 'react';
import clsx from 'clsx';
/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */

/*:: type Props = {
  'aria-label'?: string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   *-/
  autoHeight: boolean,

  /** Optional CSS class name *-/
  className?: string,

  /**
   * Used to estimate the total height of a List before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   *-/
  estimatedRowSize: number,

  /** Height constraint for list (determines how many actual rows are rendered) *-/
  height: number,

  /** Optional renderer to be used in place of rows when rowCount is 0 *-/
  noRowsRenderer: NoContentRenderer,

  /** Callback invoked with information about the slice of rows that were just rendered.  *-/

  onRowsRendered: (params: RenderedRows) => void,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   *-/
  onScroll: (params: Scroll) => void,

  /** See Grid#overscanIndicesGetter *-/
  overscanIndicesGetter: OverscanIndicesGetter,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   *-/
  overscanRowCount: number,

  /** Either a fixed row height (number) or a function that returns the height of a row given its index.  *-/
  rowHeight: CellSize,

  /** Responsible for rendering a row given an index; ({ index: number }): node *-/
  rowRenderer: RowRenderer,

  /** Number of rows in list. *-/
  rowCount: number,

  /** See Grid#scrollToAlignment *-/
  scrollToAlignment: Alignment,

  /** Row index to ensure visible (by forcefully scrolling if necessary) *-/
  scrollToIndex: number,

  /** Vertical offset. *-/
  scrollTop?: number,

  /** Optional inline style *-/
  style: Object,

  /** Tab index for focus *-/
  tabIndex?: number,

  /** Width of list *-/
  width: number,
};*/

var List =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(List, _React$PureComponent);

  function List() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(List)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "Grid", void 0);

    _defineProperty(_assertThisInitialized(_this), "_cellRenderer", function (_ref) {
      var parent = _ref.parent,
          rowIndex = _ref.rowIndex,
          style = _ref.style,
          isScrolling = _ref.isScrolling,
          isVisible = _ref.isVisible,
          key = _ref.key;
      var rowRenderer = _this.props.rowRenderer; // TRICKY The style object is sometimes cached by Grid.
      // This prevents new style objects from bypassing shallowCompare().
      // However as of React 16, style props are auto-frozen (at least in dev mode)
      // Check to make sure we can still modify the style before proceeding.
      // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713

      var widthDescriptor = Object.getOwnPropertyDescriptor(style, 'width');

      if (widthDescriptor && widthDescriptor.writable) {
        // By default, List cells should be 100% width.
        // This prevents them from flowing under a scrollbar (if present).
        style.width = '100%';
      }

      return rowRenderer({
        index: rowIndex,
        style: style,
        isScrolling: isScrolling,
        isVisible: isVisible,
        key: key,
        parent: parent
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_setRef", function (ref
    /*: ?React.ElementRef<typeof Grid>*/
    ) {
      _this.Grid = ref;
    });

    _defineProperty(_assertThisInitialized(_this), "_onScroll", function (_ref2) {
      var clientHeight = _ref2.clientHeight,
          scrollHeight = _ref2.scrollHeight,
          scrollTop = _ref2.scrollTop;
      var onScroll = _this.props.onScroll;
      onScroll({
        clientHeight: clientHeight,
        scrollHeight: scrollHeight,
        scrollTop: scrollTop
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onSectionRendered", function (_ref3) {
      var rowOverscanStartIndex = _ref3.rowOverscanStartIndex,
          rowOverscanStopIndex = _ref3.rowOverscanStopIndex,
          rowStartIndex = _ref3.rowStartIndex,
          rowStopIndex = _ref3.rowStopIndex;
      var onRowsRendered = _this.props.onRowsRendered;
      onRowsRendered({
        overscanStartIndex: rowOverscanStartIndex,
        overscanStopIndex: rowOverscanStopIndex,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex
      });
    });

    return _this;
  }

  _createClass(List, [{
    key: "forceUpdateGrid",
    value: function forceUpdateGrid() {
      if (this.Grid) {
        this.Grid.forceUpdate();
      }
    }
    /** See Grid#getOffsetForCell */

  }, {
    key: "getOffsetForRow",
    value: function getOffsetForRow(_ref4) {
      var alignment = _ref4.alignment,
          index = _ref4.index;

      if (this.Grid) {
        var _this$Grid$getOffsetF = this.Grid.getOffsetForCell({
          alignment: alignment,
          rowIndex: index,
          columnIndex: 0
        }),
            scrollTop = _this$Grid$getOffsetF.scrollTop;

        return scrollTop;
      }

      return 0;
    }
    /** CellMeasurer compatibility */

  }, {
    key: "invalidateCellSizeAfterRender",
    value: function invalidateCellSizeAfterRender(_ref5) {
      var columnIndex = _ref5.columnIndex,
          rowIndex = _ref5.rowIndex;

      if (this.Grid) {
        this.Grid.invalidateCellSizeAfterRender({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
      }
    }
    /** See Grid#measureAllCells */

  }, {
    key: "measureAllRows",
    value: function measureAllRows() {
      if (this.Grid) {
        this.Grid.measureAllCells();
      }
    }
    /** CellMeasurer compatibility */

  }, {
    key: "recomputeGridSize",
    value: function recomputeGridSize() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref6$columnIndex = _ref6.columnIndex,
          columnIndex = _ref6$columnIndex === void 0 ? 0 : _ref6$columnIndex,
          _ref6$rowIndex = _ref6.rowIndex,
          rowIndex = _ref6$rowIndex === void 0 ? 0 : _ref6$rowIndex;

      if (this.Grid) {
        this.Grid.recomputeGridSize({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
      }
    }
    /** See Grid#recomputeGridSize */

  }, {
    key: "recomputeRowHeights",
    value: function recomputeRowHeights() {
      var index
      /*: number*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.recomputeGridSize({
          rowIndex: index,
          columnIndex: 0
        });
      }
    }
    /** See Grid#scrollToPosition */

  }, {
    key: "scrollToPosition",
    value: function scrollToPosition() {
      var scrollTop
      /*: number*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.scrollToPosition({
          scrollTop: scrollTop
        });
      }
    }
    /** See Grid#scrollToCell */

  }, {
    key: "scrollToRow",
    value: function scrollToRow() {
      var index
      /*: number*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.scrollToCell({
          columnIndex: 0,
          rowIndex: index
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          noRowsRenderer = _this$props.noRowsRenderer,
          scrollToIndex = _this$props.scrollToIndex,
          width = _this$props.width;
      var classNames = clsx('ReactVirtualized__List', className);
      return React.createElement(Grid, _extends({}, this.props, {
        autoContainerWidth: true,
        cellRenderer: this._cellRenderer,
        className: classNames,
        columnWidth: width,
        columnCount: 1,
        noContentRenderer: noRowsRenderer,
        onScroll: this._onScroll,
        onSectionRendered: this._onSectionRendered,
        ref: this._setRef,
        scrollToRow: scrollToIndex
      }));
    }
  }]);

  return List;
}(React.PureComponent);

_defineProperty(List, "defaultProps", {
  autoHeight: false,
  estimatedRowSize: 30,
  onScroll: function onScroll() {},
  noRowsRenderer: function noRowsRenderer() {
    return null;
  },
  onRowsRendered: function onRowsRendered() {},
  overscanIndicesGetter: accessibilityOverscanIndicesGetter,
  overscanRowCount: 10,
  scrollToAlignment: 'auto',
  scrollToIndex: -1,
  style: {}
});

export { List as default };