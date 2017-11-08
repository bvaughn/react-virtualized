// @flow

import cn from 'classnames';
import React from 'react';
import type {NodeRendererParams} from './types';

export default function defaultNodeRenderer({
  childrenCount,
  className,
  isOpened,
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
}: NodeRendererParams): React.Element<*> {
  const a11yProps = {};

  if (
    onNodeClick ||
    onNodeDoubleClick ||
    onNodeMouseOver ||
    onNodeMouseOut ||
    onNodeRightClick
  ) {
    a11yProps['aria-label'] = 'tree-node';
    a11yProps.tabIndex = 0;

    if (onNodeClick) {
      a11yProps.onClick = event => onNodeClick({event, nodeData});
    }

    if (onNodeDoubleClick) {
      a11yProps.onDoubleClick = event => onNodeDoubleClick({event, nodeData});
    }

    if (onNodeMouseOver) {
      a11yProps.onMouseOut = event => onNodeMouseOver({event, nodeData});
    }

    if (onNodeMouseOut) {
      a11yProps.onMouseOver = event => onNodeMouseOut({event, nodeData});
    }

    if (onNodeRightClick) {
      a11yProps.onContextMenu = event => onNodeRightClick({event, nodeData});
    }
  }

  const s = {
    ...style,
    marginLeft: nestingLevel * nodeNestingMultiplier,
  };

  const isLeaf = childrenCount === 0;

  return (
    <div
      {...a11yProps}
      className={cn('ReactVirtualized__Tree__node', className)}
      key={key}
      style={s}>
      <div>
        {!isLeaf && (
          <button type="button" onClick={onNodeToggle}>
            {isOpened ? '-' : '+'}
          </button>
        )}
      </div>
      <div>{String(nodeData)}</div>
    </div>
  );
}
