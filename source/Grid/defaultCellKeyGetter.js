/** @flow */

import type { CellKeyGetterParams } from "./types";

export default function defaultKeyGetter({
  rowIndex,
  columnIndex
}: CellKeyGetterParams) {
  return `${rowIndex}-${columnIndex}`;
}
