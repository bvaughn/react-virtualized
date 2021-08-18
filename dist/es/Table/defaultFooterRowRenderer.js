import * as React from 'react';
/*:: import type {FooterRowRendererParams} from './types';*/

export default function defaultFooterRowRenderer(_ref) {
  var className = _ref.className,
      columns = _ref.columns,
      style = _ref.style;
  return React.createElement("div", {
    className: className,
    role: "row",
    style: style
  }, columns);
}