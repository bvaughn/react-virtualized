import React from 'react';

var babelPluginFlowReactPropTypes_proptype_HeaderRowRendererParams = require('./types').babelPluginFlowReactPropTypes_proptype_HeaderRowRendererParams || require('prop-types').any;

export default function defaultHeaderRowRenderer(_ref) {
  var className = _ref.className,
      columns = _ref.columns,
      style = _ref.style;

  return React.createElement(
    'div',
    { className: className, role: 'row', style: style },
    columns
  );
}
defaultHeaderRowRenderer.propTypes = babelPluginFlowReactPropTypes_proptype_HeaderRowRendererParams === require('prop-types').any ? {} : babelPluginFlowReactPropTypes_proptype_HeaderRowRendererParams;