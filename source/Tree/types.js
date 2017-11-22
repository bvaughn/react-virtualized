import React from 'react';

export type Node = {
  childrenCount: number,
  id: string,
  height?: number,
  isOpenedByDefault: boolean,
  nestingLevel: number,
  nodeData: any,
  style?: $Shape<CSSStyleDeclaration>,
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
  onNodeToggle: () => void,
  onRowClick?: RowMouseEventHandler,
  onRowDoubleClick?: RowMouseEventHandler,
  onRowMouseOut?: RowMouseEventHandler,
  onRowMouseOver?: RowMouseEventHandler,
  onRowRightClick?: RowMouseEventHandler,
  style: $Shape<CSSStyleDeclaration>,
};

export type RowRenderer = (params: RowRendererParams) => React.Element<*>;