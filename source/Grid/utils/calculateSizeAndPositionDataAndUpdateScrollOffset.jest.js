import calculateSizeAndPositionDataAndUpdateScrollOffset from './calculateSizeAndPositionDataAndUpdateScrollOffset';

describe('calculateSizeAndPositionDataAndUpdateScrollOffset', () => {
  function helper({
    cellCount = 100,
    cellSize = 10,
    computeMetadataCallbackProps = {},
    nextCellsCount = 100,
    nextCellSize = 10,
    nextScrollToIndex,
    scrollToIndex,
  } = {}) {
    const computeMetadataCallbackCalls = [];
    const updateScrollOffsetForScrollToIndexCalls = [];

    calculateSizeAndPositionDataAndUpdateScrollOffset({
      cellCount,
      cellSize,
      computeMetadataCallback: params =>
        computeMetadataCallbackCalls.push(params),
      computeMetadataCallbackProps,
      nextCellsCount,
      nextCellSize,
      nextScrollToIndex,
      scrollToIndex,
      updateScrollOffsetForScrollToIndex: params =>
        updateScrollOffsetForScrollToIndexCalls.push(params),
    });

    return {
      computeMetadataCallbackCalls,
      updateScrollOffsetForScrollToIndexCalls,
    };
  }

  it('should call :computeMetadataCallback if :cellCount has changed', () => {
    const {computeMetadataCallbackCalls} = helper({
      cellCount: 100,
      nextCellsCount: 200,
    });
    expect(computeMetadataCallbackCalls.length).toEqual(1);
  });

  it('should call :computeMetadataCallback if numeric :cellSize has changed', () => {
    const {computeMetadataCallbackCalls} = helper({
      cellSize: 10,
      nextCellSize: 20,
    });
    expect(computeMetadataCallbackCalls.length).toEqual(1);
  });

  it('should not call :computeMetadataCallback if :cellSize callback has changed', () => {
    const {computeMetadataCallbackCalls} = helper({
      cellSize: () => {},
      nextCellSize: () => {},
    });
    expect(computeMetadataCallbackCalls.length).toEqual(0);
  });

  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex is not specified', () => {
    const {updateScrollOffsetForScrollToIndexCalls} = helper();
    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0);
  });

  it('should not call :updateScrollOffsetForScrollToIndex if :scrollToIndex has also changed', () => {
    const {updateScrollOffsetForScrollToIndexCalls} = helper({
      scrollToIndex: 10,
      nextScrollToIndex: 20,
    });
    expect(updateScrollOffsetForScrollToIndexCalls.length).toEqual(0);
  });

  it('should not call :computeMetadataCallback if the above conditions are not true', () => {
    const {computeMetadataCallbackCalls} = helper();
    expect(computeMetadataCallbackCalls.length).toEqual(0);
  });
});
