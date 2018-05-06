/** @flow */

import type {Alignment, CellSizeGetter, VisibleCellRange} from '../types';

import CellSizeAndPositionManager from './CellSizeAndPositionManager';
import {getMaxElementSize} from './maxElementSize.js';

type ContainerSizeAndOffset = {
  containerSize: number,
  offset: number,
};

/**
 * Browsers have scroll offset limitations (eg Chrome stops scrolling at ~33.5M pixels where as Edge tops out at ~1.5M pixels).
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 */

type Params = {
  maxScrollSize?: number,
  cellCount: number,
  cellSizeGetter: CellSizeGetter,
  estimatedCellSize: number,
};

/**
 * Extends CellSizeAndPositionManager and adds scaling behavior for lists that are too large to fit within a browser's native limits.
 */
export default class ScalingCellSizeAndPositionManager {
  _cellSizeAndPositionManager: CellSizeAndPositionManager;
  _maxScrollSize: number;

  constructor({maxScrollSize = getMaxElementSize(), ...params}: Params) {
    // Favor composition over inheritance to simplify IE10 support
    this._cellSizeAndPositionManager = new CellSizeAndPositionManager(params);
    this._maxScrollSize = maxScrollSize;
  }

  areOffsetsAdjusted(): boolean {
    return (
      this._cellSizeAndPositionManager.getTotalSize() > this._maxScrollSize
    );
  }

  configure(params: {
    cellCount: number,
    estimatedCellSize: number,
    cellSizeGetter: CellSizeGetter,
  }) {
    this._cellSizeAndPositionManager.configure(params);
  }

  getCellCount(): number {
    return this._cellSizeAndPositionManager.getCellCount();
  }

  getEstimatedCellSize(): number {
    return this._cellSizeAndPositionManager.getEstimatedCellSize();
  }

  getLastMeasuredIndex(): number {
    return this._cellSizeAndPositionManager.getLastMeasuredIndex();
  }

  /**
   * Number of pixels a cell at the given position (offset) should be shifted in order to fit within the scaled container.
   * The offset passed to this function is scaled (safe) as well.
   */
  getOffsetAdjustment({
    containerSize,
    offset, // safe
  }: ContainerSizeAndOffset): number {
    const totalSize = this._cellSizeAndPositionManager.getTotalSize();
    const safeTotalSize = this.getTotalSize();
    const offsetPercentage = this._getOffsetPercentage({
      containerSize,
      offset,
      totalSize: safeTotalSize,
    });

    return Math.round(offsetPercentage * (safeTotalSize - totalSize));
  }

  getSizeAndPositionOfCell(index: number) {
    return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
  }

  getSizeAndPositionOfLastMeasuredCell() {
    return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
  }

  /** See CellSizeAndPositionManager#getTotalSize */
  getTotalSize(): number {
    return Math.min(
      this._maxScrollSize,
      this._cellSizeAndPositionManager.getTotalSize(),
    );
  }

  /** See CellSizeAndPositionManager#getUpdatedOffsetForIndex */
  getUpdatedOffsetForIndex({
    align = 'auto',
    containerSize,
    currentOffset, // safe
    targetIndex,
  }: {
    align: Alignment,
    containerSize: number,
    currentOffset: number,
    targetIndex: number,
  }) {
    currentOffset = this._safeOffsetToOffset({
      containerSize,
      offset: currentOffset,
    });

    const offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex({
      align,
      containerSize,
      currentOffset,
      targetIndex,
    });

    return this._offsetToSafeOffset({
      containerSize,
      offset,
    });
  }

  /** See CellSizeAndPositionManager#getVisibleCellRange */
  getVisibleCellRange({
    containerSize,
    offset, // safe
  }: ContainerSizeAndOffset): VisibleCellRange {
    offset = this._safeOffsetToOffset({
      containerSize,
      offset,
    });

    return this._cellSizeAndPositionManager.getVisibleCellRange({
      containerSize,
      offset,
    });
  }

  resetCell(index: number): void {
    this._cellSizeAndPositionManager.resetCell(index);
  }

  _getOffsetPercentage({
    containerSize,
    offset, // safe
    totalSize,
  }: {
    containerSize: number,
    offset: number,
    totalSize: number,
  }) {
    return totalSize <= containerSize
      ? 0
      : offset / (totalSize - containerSize);
  }

  _offsetToSafeOffset({
    containerSize,
    offset, // unsafe
  }: ContainerSizeAndOffset): number {
    const totalSize = this._cellSizeAndPositionManager.getTotalSize();
    const safeTotalSize = this.getTotalSize();

    if (totalSize === safeTotalSize) {
      return offset;
    } else {
      const offsetPercentage = this._getOffsetPercentage({
        containerSize,
        offset,
        totalSize,
      });

      return Math.round(offsetPercentage * (safeTotalSize - containerSize));
    }
  }

  _safeOffsetToOffset({
    containerSize,
    offset, // safe
  }: ContainerSizeAndOffset): number {
    const totalSize = this._cellSizeAndPositionManager.getTotalSize();
    const safeTotalSize = this.getTotalSize();

    if (totalSize === safeTotalSize) {
      return offset;
    } else {
      const offsetPercentage = this._getOffsetPercentage({
        containerSize,
        offset,
        totalSize: safeTotalSize,
      });

      return Math.round(offsetPercentage * (totalSize - containerSize));
    }
  }
}
