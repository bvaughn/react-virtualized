/** @flow */
import type {CellDataGetterParams} from './types';

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
export default function defaultCellDataGetter({
  dataKey,
  rowData,
}: CellDataGetterParams) {
  if (typeof rowData.get === 'function') {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}
