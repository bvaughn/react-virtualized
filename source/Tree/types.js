import React from 'react';

export type Node = {
  childrenCount: number,
  id: string,
  isOpenedByDefault: boolean,
  nestingLevel: number,
  nodeData: any,
};

export type NodeGetter = () => Generator<Node>;

export type RowMouseEventHandler = (params: {
  event: Event,
  nodeData: any,
}) => void;

export type RowRendererParams = {
  childrenCount: string,
  className?: string,
  index: number,
  isOpened: boolean,
  isScrolling: boolean,
  key: string,
  nestingLevel: number,
  nodeData: any,
  nodeNestingMultiplier: number,
  onNodeToggle: () => void,
  onRowClick?: RowMouseEventHandler,
  onRowDoubleClick?: RowMouseEventHandler,
  onRowMouseOut?: RowMouseEventHandler,
  onRowMouseOver?: RowMouseEventHandler,
  onRowRightClick?: RowMouseEventHandler,
  style: $Shape<CSSStyleDeclaration>,
};

export type RowRenderer = (params: RowRendererParams) => React.Element<*>;