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

  it('should clear style cache if cell sizes change', () => {
    const cellRendererCalls = [];
    function cellRenderer(params) {
      cellRendererCalls.push(params);
      return <div key={params.key} style={params.style} />;
    }

    const props = {
      cellRenderer,
      columnWidth: 100,
      height: 100,
      overscanColumnCount: 0,
      overscanRowCount: 0,
      rowHeight: 100,
      width: 100,
    };

    render(getMarkup(props));

    expect(cellRendererCalls.length).toEqual(1);
    expect(cellRendererCalls[0].style.width).toEqual(100);

    render(
      getMarkup({
        ...props,
        columnWidth: 50,
        width: 50,
      }),
    );

    expect(cellRendererCalls.length).toEqual(2);
    expect(cellRendererCalls[1].style.width).toEqual(50);
  });
});
