/** @flow */
import * as React from 'react';
import type {FooterRendererParams} from './types';

/**
 * Default table footer renderer.
 */
export default function defaultFooterRenderer({label}: FooterRendererParams) {
  const children = [
    <span
      className="ReactVirtualized__Table__footerTruncatedText"
      key="label"
      title={typeof label === 'string' ? label : null}>
      {label}
    </span>,
  ];

  return children;
}
