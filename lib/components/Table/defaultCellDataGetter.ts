import type { TableCellDataGetterParams } from "./types";

/**
 * Default accessor for returning a cell value for a given attribute.
 * This function expects to operate on either a vanilla Object or an Immutable Map.
 * You should override the column's cellDataGetter if your data is some other type of object.
 */
export function defaultCellDataGetter({
  dataKey,
  rowData
}: Pick<TableCellDataGetterParams, "dataKey" | "rowData">) {
  if (typeof rowData.get === "function") {
    return rowData.get(dataKey);
  } else {
    return rowData[dataKey];
  }
}
