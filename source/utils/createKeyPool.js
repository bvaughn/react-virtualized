/** @flow */

function createSimplePool() {
  const availableKeys = [];
  const inUseKeys = [];

  let previousCycle = null;
  let keyCounter = 0;

  function releaseKeys({ startIndex, stopIndex }) {
    if (previousCycle !== null) {
      const {
        startIndex: prevStartIndex,
        stopIndex: prevStopIndex
      } = previousCycle;

      let targetIndex = Math.min(prevStopIndex + 1, startIndex);
      for (let i = prevStartIndex; i < targetIndex; i++) {
        const key = inUseKeys[i];
        delete inUseKeys[i];
        if (key != null) {
          availableKeys.push(key);
        }
      }
      targetIndex = Math.max(prevStartIndex - 1, stopIndex);
      for (let i = prevStopIndex; i > stopIndex; i--) {
        const key = inUseKeys[i];
        delete inUseKeys[i];
        if (key != null) {
          availableKeys.push(key);
        }
      }
    }

    previousCycle = { startIndex, stopIndex };
  }

  function getKey(index) {
    let key;

    if (inUseKeys.hasOwnProperty(index)) {
      key = inUseKeys[index];
    } else if (availableKeys.length > 0) {
      key = availableKeys.pop();
    } else {
      key = keyCounter++;
    }

    inUseKeys[index] = key;

    return key;
  }

  return { releaseKeys, getKey };
}

export function createCellKeyPool() {
  const columnPool = createSimplePool();
  const rowPool = createSimplePool();

  type onSectionRenderedParams = {
    columnOverscanStartIndex: number,
    columnOverscanStopIndex: number,
    rowOverscanStartIndex: number,
    rowOverscanStopIndex: number
  };

  function onSectionRendered({
    columnOverscanStartIndex,
    columnOverscanStopIndex,
    rowOverscanStartIndex,
    rowOverscanStopIndex
  }: onSectionRenderedParams) {
    columnPool.releaseKeys({
      startIndex: columnOverscanStartIndex,
      stopIndex: columnOverscanStopIndex
    });
    rowPool.releaseKeys({
      startIndex: rowOverscanStartIndex,
      stopIndex: rowOverscanStopIndex
    });
  }

  type keyGetterParams = {
    columnIndex: number,
    rowIndex: number
  };

  function cellKeyGetter({ columnIndex, rowIndex }: keyGetterParams) {
    return `${rowPool.getKey(rowIndex)}-${columnPool.getKey(columnIndex)}`;
  }

  return {
    cellKeyGetter,
    onSectionRendered
  };
}

export function createKeyPool() {
  const pool = createSimplePool();

  type onRowsRenderedParams = {
    overscanStartIndex: number,
    overscanStopIndex: number
  };

  function onRowsRendered({
    overscanStartIndex,
    overscanStopIndex
  }: onRowsRenderedParams) {
    pool.releaseKeys({
      startIndex: overscanStartIndex,
      stopIndex: overscanStopIndex
    });
  }

  type keyGetterParams = {
    index: number
  };

  function keyGetter({ index }: keyGetterParams) {
    return pool.getKey(index);
  }

  return {
    keyGetter,
    onRowsRendered
  };
}
