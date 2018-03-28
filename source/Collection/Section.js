/** @flow */
import type {Index, SizeAndPositionInfo} from './types';

/**
 * A section of the Window.
 * Window Sections are used to group nearby cells.
 * This enables us to more quickly determine which cells to display in a given region of the Window.
 * Sections have a fixed size and contain 0 to many cells (tracked by their indices).
 */
export default class Section {
  constructor({height, width, x, y}: SizeAndPositionInfo) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

    this._indexMap = {};
    this._indices = [];
  }

  /** Add a cell to this section. */
  addCellIndex({index}: Index) {
    if (!this._indexMap[index]) {
      this._indexMap[index] = true;
      this._indices.push(index);
    }
  }

  /** Get all cell indices that have been added to this section. */
  getCellIndices(): Array<number> {
    return this._indices;
  }

  /** Intended for debugger/test purposes only */
  toString() {
    return `${this.x},${this.y} ${this.width}x${this.height}`;
  }
}
