import { createIntervalTree } from "../../vendor/intervalTree";

type RenderCallback = (index: number, left: number, top: number) => void;

// Position cache requirements:
//   O(log(n)) lookup of cells to render for a given viewport size
//   O(1) lookup of shortest measured column (so we know when to enter phase 1)
export class PositionCache {
  // Tracks the height of each column
  _columnSizeMap: { [x: number]: number } = {};

  // Store tops and bottoms of each cell for fast intersection lookup.
  _intervalTree = createIntervalTree();

  // Maps cell index to x coordinates for quick lookup.
  _leftMap: { [index: number]: number } = {};

  // Maps cell index to the y coordinate of its bottom edge.
  _bottomMap: { [index: number]: number } = {};

  estimateTotalHeight(
    cellCount: number,
    columnCount: number,
    defaultCellHeight: number
  ): number {
    const unmeasuredCellCount = cellCount - this.count;
    if (unmeasuredCellCount < 0) {
      // Some of the cached cells have since been removed (cellCount shrank);
      // only the remaining cells (all of which have been positioned) contribute to the height.
      let size = 0;
      for (let index = 0; index < cellCount; index++) {
        const bottom = this._bottomMap[index];
        if (bottom !== undefined && bottom > size) {
          size = bottom;
        }
      }
      return size;
    }

    return (
      this.tallestColumnSize +
      Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight
    );
  }

  // Render all cells visible within the viewport range defined.
  range(
    scrollTop: number,
    clientHeight: number,
    renderCallback: RenderCallback
  ): void {
    this._intervalTree.queryInterval(
      scrollTop,
      scrollTop + clientHeight,
      ([top, , index]) =>
        renderCallback(index as number, this._leftMap[index as number], top)
    );
  }

  setPosition(index: number, left: number, top: number, height: number): void {
    this._intervalTree.insert([top, top + height, index]);
    this._leftMap[index] = left;
    this._bottomMap[index] = top + height;

    const columnSizeMap = this._columnSizeMap;
    const columnHeight = columnSizeMap[left];
    if (columnHeight === undefined) {
      columnSizeMap[left] = top + height;
    } else {
      columnSizeMap[left] = Math.max(columnHeight, top + height);
    }
  }

  get count(): number {
    return this._intervalTree.count;
  }

  get shortestColumnSize(): number {
    const columnSizeMap = this._columnSizeMap;

    let size = Infinity;

    for (const i in columnSizeMap) {
      const height = columnSizeMap[i as unknown as number];
      size = Math.min(size, height);
    }

    return size === Infinity ? 0 : size;
  }

  get tallestColumnSize(): number {
    const columnSizeMap = this._columnSizeMap;

    let size = 0;

    for (const i in columnSizeMap) {
      const height = columnSizeMap[i as unknown as number];
      size = Math.max(size, height);
    }

    return size;
  }
}
