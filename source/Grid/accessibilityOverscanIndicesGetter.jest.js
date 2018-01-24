import overscanIndicesGetter, {
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FORWARD,
} from './accessibilityOverscanIndicesGetter';

describe('overscanIndicesGetter', () => {
  function testHelper({
    cellCount,
    startIndex,
    stopIndex,
    overscanCellsCount,
    scrollDirection,
  }) {
    return overscanIndicesGetter({
      cellCount,
      overscanCellsCount,
      scrollDirection,
      startIndex,
      stopIndex,
    });
  }

  it('should still overscan by 1 (for keyboard accessibility) if :overscanCellsCount is 0', () => {
    expect(
      testHelper({
        cellCount: 100,
        startIndex: 10,
        stopIndex: 20,
        overscanCellsCount: 0,
        scrollDirection: SCROLL_DIRECTION_BACKWARD,
      }),
    ).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 21,
    });

    expect(
      testHelper({
        cellCount: 100,
        startIndex: 10,
        stopIndex: 20,
        overscanCellsCount: 0,
        scrollDirection: SCROLL_DIRECTION_FORWARD,
      }),
    ).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 21,
    });
  });

  it('should overscan forward', () => {
    expect(
      testHelper({
        cellCount: 100,
        startIndex: 20,
        stopIndex: 30,
        overscanCellsCount: 10,
        scrollDirection: SCROLL_DIRECTION_FORWARD,
      }),
    ).toEqual({
      overscanStartIndex: 19,
      overscanStopIndex: 40,
    });
  });

  it('should overscan backward', () => {
    expect(
      testHelper({
        cellCount: 100,
        startIndex: 20,
        stopIndex: 30,
        overscanCellsCount: 10,
        scrollDirection: SCROLL_DIRECTION_BACKWARD,
      }),
    ).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 31,
    });
  });

  it('should not overscan beyond the start of the list', () => {
    expect(
      testHelper({
        cellCount: 100,
        startIndex: 5,
        stopIndex: 15,
        overscanCellsCount: 10,
        scrollDirection: SCROLL_DIRECTION_BACKWARD,
      }),
    ).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 16,
    });
  });

  it('should not overscan beyond the end of the list', () => {
    expect(
      testHelper({
        cellCount: 25,
        startIndex: 10,
        stopIndex: 20,
        overscanCellsCount: 10,
        scrollDirection: SCROLL_DIRECTION_FORWARD,
      }),
    ).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 24,
    });
  });
});
