/** @flow */
import * as React from 'react';
import type {FooterRowRendererParams} from './types';

export default function defaultFooterRowRenderer({
  className,
  columns,
  style,
}: FooterRowRendererParams) {
  return (
    <div className={className} role="row" style={style}>
      {columns}
    </div>
  );
}
