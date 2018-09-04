/** @flow */
import * as React from 'react';
import type {HeaderRowRendererParams} from './types';

export default function defaultHeaderRowRenderer({
  className,
  columns,
  style,
}: HeaderRowRendererParams) {
  return (
    <div className={className} role="rowheader" style={style}>
      {columns}
    </div>
  );
}
