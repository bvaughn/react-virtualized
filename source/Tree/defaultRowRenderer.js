// @flow

import cn from 'classnames';
import React from 'react';
import type {RowRendererParams} from './types';

export default function defaultNodeRenderer({
  childrenCount,
  className,
  isOpened,
  key,
  nodeData,
  onNodeToggle,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  style,
}: RowRendererParams<string>): React.Element<*> {
  const a11yProps = {};

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOver ||
    onRowMouseOut ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'tree-node';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({event, nodeData});
    }

    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event => onRowDoubleClick({event, nodeData});
    }

    if (onRowMouseOver) {
      a11yProps.onMouseOut = event => onRowMouseOver({event, nodeData});
    }

    if (onRowMouseOut) {
      a11yProps.onMouseOver = event => onRowMouseOut({event, nodeData});
    }

    if (onRowRightClick) {
      a11yProps.onContextMenu = event => onRowRightClick({event, nodeData});
    }
  }

  const isLeaf = childrenCount === 0;

  return (
    <div
      {...a11yProps}
      className={cn('ReactVirtualized__Tree__node', className)}
      key={key}
      style={style}>
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
