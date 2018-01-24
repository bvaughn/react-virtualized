/** @flow */
import type {CellRendererParams} from './types';

/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
export default function defaultCellRenderer({
  cellData,
}: CellRendererParams): string {
  if (cellData == null) {
    return '';
  } else {
    return String(cellData);
  }
}
