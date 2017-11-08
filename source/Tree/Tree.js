// @flow

import type {
  NoContentRenderer,
  Alignment,
  CellSize,
  CellPosition,
  OverscanIndicesGetter,
  RenderedSection,
  CellRendererParams,
  Scroll as GridScroll,
} from '../Grid';
import type {
  Node,
  NodeGetter,
  NodeMouseEventHandler,
  NodeRenderer,
} from './types';
import type {RenderedRows, Scroll} from '../List/types';

import React from 'react';
import cn from 'classnames';
import Grid, {accessibilityOverscanIndicesGetter} from '../Grid';
import defaultNodeRenderer from './defaultNodeRenderer';

type Props = {
  'aria-label'?: string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight: boolean,

  /** Optional CSS class name */
  className?: string,

  /**
   * Used to estimate the total height of a List before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize: number,

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

  /**
   * Responsible for rendering a node given node data received from NodeGetter:
   * Should implement the following interface: ({
   *   className?: string,
   *   deepLevel: number,
   *   index: number,
   *   isLeaf: boolean,
   *   isOpened: boolean,
   *   isScrolling: boolean,
   *   key: string,
   *   nodeData: any,
   *   onNodeClick?: NodeMouseEventHandler,
   *   onNodeDoubleClick?: NodeMouseEventHandler,
   *   onNodeMouseOut?: NodeMouseEventHandler,
   *   onNodeMouseOver?: NodeMouseEventHandler,
   *   onNodeRightClick?: NodeMouseEventHandler,
   *   onNodeToggle: () => void,
   *   style: $Shape<CSSStyleDeclaration>,
   * }): ReactElement<*>
   */
  nodeRenderer?: NodeRenderer,

  /** Optional renderer to be used in place of rows when rowCount is 0 */
  noRowsRenderer: NoContentRenderer,

  /**
   * Callback invoked when a user clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onNodeClick?: NodeMouseEventHandler,

  /**
   * Callback invoked when a user double-clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onNodeDoubleClick?: NodeMouseEventHandler,

  /**
   * Callback invoked when the mouse leaves a node.
   * ({event: Event, nodeData: any}): void
   */
  onNodeMouseOut?: NodeMouseEventHandler,

  /**
   * Callback invoked when a user moves the mouse over a node.
   * ({event: Event, nodeData: any}): void
   */
  onNodeMouseOver?: NodeMouseEventHandler,

  /**
   * Callback invoked when a user right-clicks on a node.
   * ({event: Event, nodeData: any}): void
   */
  onNodeRightClick?: NodeMouseEventHandler,

  /** Callback invoked with information about the slice of rows that were just rendered. */
  onRowsRendered: (params: RenderedRows) => void,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   */
  onScroll: (params: Scroll) => void,

  /** See Grid#overscanIndicesGetter */
  overscanIndicesGetter: OverscanIndicesGetter,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount: number,

  /** Either a fixed row height (number) or a function that returns the height of a row given its index. */
  rowHeight: CellSize,

  /** See Grid#scrollToAlignment */
  scrollToAlignment: Alignment,

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex: number,

  /** Vertical offset. */
  scrollTop?: number,

  /** Optional inline style */
  style: Object,

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
    nodeRenderer: defaultNodeRenderer,
    onScroll: () => {},
    noRowsRenderer: () => null,
    onRowsRendered: () => {},
    overscanIndicesGetter: accessibilityOverscanIndicesGetter,
    overscanRowCount: 10,
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {},
  };

  props: Props;
  Grid: ?Grid;
  _nodes: Node[] = [];
  _nodesStates: {[id: string]: boolean} = {};

  forceUpdateGrid() {
    if (this.Grid) {
      this.Grid.forceUpdate();
    }
  }

  /**
   * Sets nodes states (opened/closed) to a states defined in `states` parameter.
   * @param states Object that contains nodes' ids as keys and their states as boolean values.
   */
  setNodesStates(states: {[id: string]: boolean}) {
    this._nodesStates = {...this._nodesStates, ...states};
    this.forceUpdate();
  }

  /** See Grid#getOffsetForCell */
  getOffsetForRow({alignment, index}: {alignment: Alignment, index: number}) {
    if (this.Grid) {
      const {scrollTop} = this.Grid.getOffsetForCell({
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
    if (this.Grid) {
      this.Grid.invalidateCellSizeAfterRender({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#measureAllCells */
  measureAllRows() {
    if (this.Grid) {
      this.Grid.measureAllCells();
    }
  }

  /** CellMeasurer compatibility */
  recomputeGridSize({columnIndex = 0, rowIndex = 0}: CellPosition = {}) {
    if (this.Grid) {
      this.Grid.recomputeGridSize({
        rowIndex,
        columnIndex,
      });
    }
  }

  /** See Grid#recomputeGridSize */
  recomputeRowHeights(index: number = 0) {
    if (this.Grid) {
      this.Grid.recomputeGridSize({
        rowIndex: index,
        columnIndex: 0,
      });
    }
  }

  /** See Grid#scrollToPosition */
  scrollToPosition(scrollTop: number = 0) {
    if (this.Grid) {
      this.Grid.scrollToPosition({scrollTop});
    }
  }

  /** See Grid#scrollToCell */
  scrollToRow(index: number = 0) {
    if (this.Grid) {
      this.Grid.scrollToCell({
        columnIndex: 0,
        rowIndex: index,
      });
    }
  }

  render() {
    const {className, noRowsRenderer, scrollToIndex, width} = this.props;

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
        onScroll={this._onScroll}
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
      nodeRenderer,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOver,
      onNodeMouseOut,
      onNodeRightClick,
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

    const {childrenCount, id, nestingLevel, nodeData} = this._nodes[rowIndex];

    const isOpened = this._nodesStates[id];

    const onNodeToggle = this._createOnNodeToggleCallback(id);

    // disable flow check because nodeRenderer is set by default
    // $FlowFixMe
    return nodeRenderer({
      childrenCount,
      className: nodeClassName,
      index: rowIndex,
      isOpened,
      isScrolling,
      key,
      nestingLevel,
      nodeData,
      nodeNestingMultiplier,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOut,
      onNodeMouseOver,
      onNodeRightClick,
      onNodeToggle,
      style,
    });
  };

  _createOnNodeToggleCallback(id: string): () => void {
    return () => {
      this._nodesStates[id] = !this._nodesStates[id];
      this.forceUpdate();
    };
  }

  _onScroll = ({clientHeight, scrollHeight, scrollTop}: GridScroll) => {
    const {onScroll} = this.props;

    onScroll({clientHeight, scrollHeight, scrollTop});
  };

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
   * Converts complex tree to a flat array to display it with Grid using a `nodeGetter` generator function.
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
    this.Grid = grid;
  };
}
