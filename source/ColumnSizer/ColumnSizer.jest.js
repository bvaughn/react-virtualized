import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import ColumnSizer from './ColumnSizer';
import Grid from '../Grid';

describe('ColumnSizer', () => {
  function getMarkup({
    columnMinWidth = undefined,
    columnMaxWidth = undefined,
    columnCount = 10,
    width = 200,
  } = {}) {
    function cellRenderer({columnIndex, key, rowIndex, style}) {
      return (
        <div className="gridItem" key={key} style={style}>
          {`row:${rowIndex}, column:${columnIndex}`}
        </div>
      );
    }

    return (
      <ColumnSizer
        columnMinWidth={columnMinWidth}
        columnMaxWidth={columnMaxWidth}
        columnCount={columnCount}
        width={width}>
        {({adjustedWidth, columnWidth, registerChild}) => (
          <div>
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={50}
              ref={registerChild}
              cellRenderer={cellRenderer}
              rowHeight={50}
              rowCount={1}
              width={adjustedWidth}
            />
            <div className="debug">
              {`adjustedWidth:${adjustedWidth} columnWidth:${columnWidth}`}
            </div>
          </div>
        )}
      </ColumnSizer>
    );
  }

  it('should distribute column widths evenly if no min/max boundaries have been set', () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(rendered.querySelector('.debug').textContent).toContain(
      'columnWidth:20',
    );
  });

  it('should respect :columnMaxWidth if specified', () => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          columnMaxWidth: 10,
        }),
      ),
    );
    expect(rendered.querySelector('.debug').textContent).toContain(
      'columnWidth:10',
    );
  });

  it('should respect :columnMinWidth if specified', () => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          columnMinWidth: 30,
        }),
      ),
    );
    expect(rendered.querySelector('.debug').textContent).toContain(
      'columnWidth:30',
    );
  });

  describe('recomputeGridSize', () => {
    function helper(updatedProps, expectedTextContent) {
      const renderedA = findDOMNode(render(getMarkup()));
      expect(renderedA.querySelector('.debug').textContent).toContain(
        'columnWidth:20',
      );

      const renderedB = findDOMNode(render(getMarkup(updatedProps)));
      expect(renderedB.querySelector('.debug').textContent).toContain(
        expectedTextContent,
      );
    }

    it('should recompute metadata sizes if :columnMinWidth changes', () => {
      helper({columnMinWidth: 30}, 'columnWidth:30');
    });

    it('should recompute metadata sizes if :columnMaxWidth changes', () => {
      helper({columnMaxWidth: 15}, 'columnWidth:15');
    });

    it('should recompute metadata sizes if :width changes', () => {
      helper({width: 300}, 'columnWidth:30');
    });

    it('should recompute metadata sizes if :columnCount changes', () => {
      helper({columnCount: 2}, 'columnWidth:100');
    });
  });

  it('should pass the :width as :adjustedWidth if columns require more than the :width to be displayed', () => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          columnMinWidth: 30,
        }),
      ),
    );
    expect(rendered.querySelector('.debug').textContent).toContain(
      'adjustedWidth:200',
    );
  });

  it('should pass an :adjustedWidth if columns require less than the :width to be displayed', () => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          columnMaxWidth: 10,
        }),
      ),
    );
    expect(rendered.querySelector('.debug').textContent).toContain(
      'adjustedWidth:100',
    );
  });

  it('should error if the registered child is not a Grid or a MultiGrid', () => {
    spyOn(console, 'error');

    expect(() => {
      render(
        <ColumnSizer
          columnMinWidth={100}
          columnMaxWidth={100}
          columnCount={100}
          width={100}>
          {({registerChild}) => <div ref={registerChild} />}
        </ColumnSizer>,
      );
    }).toThrow();
  });
});
