import * as React from 'react';
/*:: import type {FooterRendererParams} from './types';*/

/**
 * Default table footer renderer.
 */
export default function defaultFooterRenderer(_ref) {
  var label = _ref.label;
  var children = [React.createElement("span", {
    className: "ReactVirtualized__Table__footerTruncatedText",
    key: "label",
    title: typeof label === 'string' ? label : null
  }, label)];
  return children;
}