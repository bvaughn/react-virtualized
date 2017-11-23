// @flow

import type {
  NoContentRenderer,
  Alignment,
  CellPosition,
  OverscanIndicesGetter,
  RenderedSection,
  CellRendererParams,
} from '../Grid';
import type {
  Node,
  NodeGetter,
  RowMouseEventHandler,
  RowRenderer,
} from './types';
import type {RenderedRows, Scroll} from '../List/types';

import cn from 'classnames';
import React from 'react';
import memoize from 'sb-memoize';
import Grid, {accessibilityOverscanIndicesGetter} from '../Grid';
import defaultRowRenderer from './defaultRowRenderer';

type Props = {
  'aria-label'?: string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight?: boolean,

  /** Optional CSS class name */
  className?: string,

  /**
   * Used to estimate the total height of a List before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize?: number,

  /** Height constraint for list (determines how many actual rows are rendered) */
  height: number,

  /**
   * Optional CSS class to apply to all nodes.
   */
  nodeClassName?: string,

  /**
   * Callback responsible for returning nodes in flat format basing on their openness. It should
   * be a generator function that yields node information, receives info about node's openness
   * and basing on it returns children of current node or next sibling at the next iteration.
   * (): Generator<{
   *   childrenCount: number,
   *   id: string,
   *   isOpenedByDefault: boolean,
   *   nestingLevel: number,
   *   nodeData: any,
   * }>
   */
  nodeGetter: NodeGetter,

  /**
   * Multiplier for a margin that depends on node's nesting level. E.g. if multiplier is 10 and
   * nesting level for node is 2 then margin will be 20px, and for node with nesting level 3 it will be 30px.
   */
  nodeNestingMultiplier?: number,

  /** Optional renderer to be used in place of rows when tree is empty */
  noRowsRenderer?: NoContentRenderer,

  /**
   * Callback invoked when a user clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onRowClick?: RowMouseEventHandler,

  /**
   * Callback invoked when a user double-clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onRowDoubleClick?: RowMouseEventHandler,

  /**
   * Callback invoked when the mouse leaves a node.
   * ({event: Event, nodeData: any}): void
   */
  onRowMouseOut?: RowMouseEventHandler,

  /**
   * Callback invoked when a user moves the mouse over a node.
   * ({event: Event, nodeData: any}): void
   */
  onRowMouseOver?: RowMouseEventHandler,

  /**
   * Callback invoked when a user right-clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onRowRightClick?: RowMouseEventHandler,

  /** Callback invoked with information about the slice of rows that were just rendered. */
  onRowsRendered?: (params: RenderedRows) => void,

  /**
   * Responsible for rendering a data received from NodeGetter:
   * Should implement the following interface: ({
   *   className?: string,
   *   deepLevel: number,
   *   index: number,
   *   isLeaf: boolean,
   *   isOpened: boolean,
   *   isScrolling: boolean,
   *   key: string,
   *   nodeData: any,
   *   onRowClick?: RowMouseEventHandler,
   *   onRowDoubleClick?: RowMouseEventHandler,
   *   onRowMouseOut?: RowMouseEventHandler,
   *   onRowMouseOver?: RowMouseEventHandler,
   *   onRowRightClick?: RowMouseEventHandler,
   *   onNodeToggle: () => void,
   *   style: $Shape<CSSStyleDeclaration>,
   * }): ReactElement<*>
   */
  rowRenderer?: RowRenderer,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll?: (params: Scroll) => void,

  /** See Grid#overscanIndicesGetter */
  overscanIndicesGetter?: OverscanIndicesGetter,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount?: number,

  /** Fixed row height */
  rowHeight: number,

  /** See Grid#scrollToAlignment */
  scrollToAlignment?: Alignment,

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex?: number,

  /** Vertical offset. */
  scrollTop?: number,

  /** Optional inline style */
  style?: Object,

  /** Tab index for focus */
  tabIndex?: number,

  /** Width of list */
  width: number,
};

/**
 * This component renders a tree of elements using powerful virtualization technology to render
 * only visible elements to the HTML document.
 */
export default class Tree extends React.PureComponent {
  static defaultProps = {
    autoHeight: false,
    estimatedRowSize: 30,
    nodeNestingMultiplier: 10,
    noRowsRenderer: () => null,
    onRowsRendered: () => {},
    onScroll: () => {},
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    rowRenderer: defaultRowRenderer,
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {},
  };

  props: Props;
  _grid: ?Grid;
  _nodes: Node[] = [];
  _nodesStates: { [id: string]: boolean } = {};

  forceUpdateGrid() {
    if (this._grid) {
      this._grid.forceUpdate();
    }
  }

  /**
   * Sets nodes states (opened/closed) to a states defined in `boolOrObject` parameter.
   * @param states object that contains nodes' ids as keys and boolean states as values.
   */
  setNodesStates(states: { [id: string]: boolean }) {
    this._nodesStates = {...this._nodesStates, ...states};
    this.forceUpdate();
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({alignment, index}: { alignment: Alignment, index: number }) {
    if (this._grid) {
      const {scrollTop} = this._grid.getOffsetForCell({
        alignment,
        rowIndex: index,
        columnIndex: 0,
      });

      return scrollTop;
    }
    return 0;
  }

  /** CellMeasurer compatibility */
  invalidateCellSizeAfterRender({columnIndex, rowIndex}: CellPosition) {
    if (this._grid) {
      this._grid.invalidateCellSizeAfterRender({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    if (this._grid) {
      this._grid.measureAllCells();
    }
  }

  /** CellMeasurer compatibility */
  recomputeGridSize({columnIndex = 0, rowIndex = 0}: CellPosition = {}) {
    if (this._grid) {
      this._grid.recomputeGridSize({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index: number = 0) {
    if (this._grid) {
      this._grid.recomputeGridSize({
        rowIndex: index,
        columnIndex: 0,
      });
    }
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop: number = 0) {
    if (this._grid) {
      this._grid.scrollToPosition({scrollTop});
    }
  }

  /** See Grid#scrollToCell */
  scrollToRow(index: number = 0) {
    if (this._grid) {
      this._grid.scrollToCell({
        columnIndex: 0,
        rowIndex: index,
      });
    }
  }

  render() {
    const {
      className,
      noRowsRenderer,
      scrollToIndex,
      width,
    } = this.props;

    const classNames = cn('ReactVirtualized__Tree', className);

    const rowCount = this._prepareNodes();

    return (
      <Grid
        {...this.props}
        autoContainerWidth
        cellRenderer={this._cellRenderer}
        className={classNames}
        columnWidth={width}
        columnCount={1}
        noContentRenderer={noRowsRenderer}
        onSectionRendered={this._onSectionRendered}
        ref={this._setRef}
        rowCount={rowCount}
        scrollToRow={scrollToIndex}
      />
    );
  }

  _cellRenderer = ({rowIndex, style, isScrolling, key}: CellRendererParams) => {
    const {
      nodeClassName,
      nodeNestingMultiplier,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOver,
      onRowMouseOut,
      onRowRightClick,
      rowHeight,
      rowRenderer,
    } = this.props;

    // TRICKY The style object is sometimes cached by Grid.
    // This prevents new style objects from bypassing shallowCompare().
    // However as of React 16, style props are auto-frozen (at least in dev mode)
    // Check to make sure we can still modify the style before proceeding.
    // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
    const {writable} = Object.getOwnPropertyDescriptor(style, 'width');

    if (writable) {
      // By default, Tree cells should be 100% width.
      // This prevents them from flowing under a scrollbar (if present).
      style.width = '100%';
    }

    const {
      childrenCount,
      id,
      nestingLevel,
      nodeData,
      height,
      style: rowStyle,
    } = this._nodes[rowIndex];

    const isOpened = this._nodesStates[id];

    const onNodeToggle = this._createOnNodeToggleCallback(id);

    // disable flow check because rowRenderer is set by default
    // $FlowFixMe
    return rowRenderer({
      childrenCount,
      className: nodeClassName,
      index: rowIndex,
      isOpened,
      isScrolling,
      key,
      nestingLevel,
      nodeData,
      onNodeToggle,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOut,
      onRowMouseOver,
      onRowRightClick,
      style: {
        ...style,
        ...rowStyle,
        height: height || rowHeight,
        overflow: 'hidden',
        marginLeft: nestingLevel * nodeNestingMultiplier,
      },
    });
  };

  _createOnNodeToggleCallback = memoize((id: string) => () => {
    this._nodesStates[id] = !this._nodesStates[id];
    this.forceUpdate();
  });

  _onSectionRendered = ({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex,
  }: RenderedSection) => {
    const {onRowsRendered} = this.props;

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex,
    });
  };

  /*
   * Converts complex tree to a flat array to display it with Grid using a `_nodeGetter` generator function.
   * Generator provides ability to inform user's algorithm about current node state: is it opened or closed.
   * Basing on this information generator can decide whether it is necessary to render children.
   */
  _prepareNodes(): number {
    const {nodeGetter} = this.props;

    this._nodes = [];

    const g = nodeGetter();

    let isPreviousOpened = false;

    while (true) {
      const {value, done} = g.next(isPreviousOpened);

      if (done) {
        break;
      }

      this._nodes.push(value);

      if (this._nodesStates[value.id] === undefined) {
        this._nodesStates[value.id] = value.isOpenedByDefault;
      }

      isPreviousOpened = this._nodesStates[value.id];
    }

    return this._nodes.length;
  }

  _setRef = (grid: Grid) => {
    this._grid = grid;
  };
}
