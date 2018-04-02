import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {render} from '../TestUtils';
import Grid, {DEFAULT_SCROLLING_RESET_TIME_INTERVAL} from './Grid';
import {CellMeasurer, CellMeasurerCache} from '../CellMeasurer';
import {
  SCROLL_DIRECTION_BACKWARD,
  SCROLL_DIRECTION_FORWARD,
} from './defaultOverscanIndicesGetter';
import {getMaxElementSize} from './utils/maxElementSize.js';

const DEFAULT_COLUMN_WIDTH = 50;
const DEFAULT_HEIGHT = 100;
const DEFAULT_ROW_HEIGHT = 20;
const DEFAULT_WIDTH = 200;
const NUM_ROWS = 100;
const NUM_COLUMNS = 50;

function getScrollbarSize0() {
  return 0;
}

function getScrollbarSize20() {
  return 20;
}

describe('Grid', () => {
  function defaultCellRenderer({columnIndex, key, rowIndex, style}) {
    return (
      <div className="gridItem" key={key} style={style}>
        {`row:${rowIndex}, column:${columnIndex}`}
      </div>
    );
  }

  function simulateScroll({grid, scrollLeft = 0, scrollTop = 0}) {
    const target = {scrollLeft, scrollTop};
    grid._scrollingContainer = target; // HACK to work around _onScroll target check
    Simulate.scroll(findDOMNode(grid), {target});
  }

  function getMarkup(props = {}) {
    return (
      <Grid
        cellRenderer={defaultCellRenderer}
        columnCount={NUM_COLUMNS}
        columnWidth={DEFAULT_COLUMN_WIDTH}
        getScrollbarSize={getScrollbarSize0}
        height={DEFAULT_HEIGHT}
        overscanColumnCount={0}
        overscanRowCount={0}
        autoHeight={false}
        rowHeight={DEFAULT_ROW_HEIGHT}
        rowCount={NUM_ROWS}
        width={DEFAULT_WIDTH}
        {...props}
      />
    );
  }

  it('should trigger on-update if scrollbar visibility has changed', () => {
    const onScrollbarPresenceChange = jest.fn();
    render(
      getMarkup({
        columnCount: 1,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange,
        rowCount: 1,
      }),
    );
    expect(onScrollbarPresenceChange).not.toHaveBeenCalled();

    render(
      getMarkup({
        columnCount: 100,
        getScrollbarSize: getScrollbarSize20,
        onScrollbarPresenceChange,
        rowCount: 100,
      }),
    );
    expect(onScrollbarPresenceChange).toHaveBeenCalled();

    const args = onScrollbarPresenceChange.mock.calls[0][0];
    expect(args.horizontal).toBe(true);
    expect(args.size).toBe(getScrollbarSize20());
    expect(args.vertical).toBe(true);
  });
});
