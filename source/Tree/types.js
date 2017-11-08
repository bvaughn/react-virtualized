import React from 'react';

export type Node = {
  childrenCount: number,
  id: string,
  isOpenedByDefault: boolean,
  nestingLevel: number,
  nodeData: any,
};

export type NodeGetter = () => Generator<Node>;

export type NodeMouseEventHandler = (params: {
  event: Event,
  nodeData: any,
}) => void;

export type NodeRenderer = (params: NodeRendererParams) => React.Element<*>;

export type NodeRendererParams = {
  childrenCount: string,
  className?: string,
  index: number,
  isOpened: boolean,
  isScrolling: boolean,
  key: string,
  nestingLevel: number,
  nodeData: any,
  nodeNestingMultiplier: number,
  onNodeClick?: NodeMouseEventHandler,
  onNodeDoubleClick?: NodeMouseEventHandler,
  onNodeMouseOut?: NodeMouseEventHandler,
  onNodeMouseOver?: NodeMouseEventHandler,
  onNodeRightClick?: NodeMouseEventHandler,
  onNodeToggle: () => void,
  style: $Shape<CSSStyleDeclaration>,
};
