'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultCellDataGetter;

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
var babelPluginFlowReactPropTypes_proptype_CellDataGetterParams = require('./types').babelPluginFlowReactPropTypes_proptype_CellDataGetterParams || require('prop-types').any;

function defaultCellDataGetter(_ref) {
  var dataKey = _ref.dataKey,
      rowData = _ref.rowData;

  if (typeof rowData.get === 'function') {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}