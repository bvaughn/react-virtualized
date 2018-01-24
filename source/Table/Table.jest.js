import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import {Simulate} from 'react-dom/test-utils';
import Immutable from 'immutable';
import Column from './Column';
import Table from './Table';
import SortDirection from './SortDirection';

describe('Table', () => {
  const array = [];
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: `Name ${i}`,
      email: `user-${i}@treasure-data.com`,
    });
  }
  const list = Immutable.fromJS(array);

  // Works with an Immutable List of Maps
  function immutableRowGetter({index}) {
    return list.get(index);
  }

  // Works with an Array of Objects
  function vanillaRowGetter({index}) {
    return array[index];
  }

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter({startIndex, stopIndex}) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex,
    };
  }

  function getMarkup({
    cellDataGetter,
    cellRenderer,
    columnData = {data: 123},
    columnID,
    columnStyle,
    columnHeaderStyle,
    disableSort = false,
    headerRenderer,
    maxWidth,
    minWidth,
    defaultSortDirection,
    ...flexTableProps
  } = {}) {
    return (
      <Table
        headerHeight={20}
        height={100}
        overscanRowCount={0}
        overscanIndicesGetter={overscanIndicesGetter}
        rowCount={list.size}
        rowGetter={immutableRowGetter}
        rowHeight={10}
        width={100}
        {...flexTableProps}>
        <Column
          label="Name"
          dataKey="name"
          columnData={columnData}
          width={50}
          cellRenderer={cellRenderer}
          cellDataGetter={cellDataGetter}
          headerRenderer={headerRenderer}
          disableSort={disableSort}
          defaultSortDirection={defaultSortDirection}
          style={columnStyle}
          headerStyle={columnHeaderStyle}
          id={columnID}
        />
        <Column
          label="Email"
          dataKey="email"
          maxWidth={maxWidth}
          minWidth={minWidth}
          width={50}
        />
        {false}
        {true}
        {null}
        {undefined}
      </Table>
    );
  }

  beforeEach(() => jest.resetModules());

  describe('children', () => {
    it('should accept Column children', () => {
      const children = [<Column dataKey="foo" width={100} />];
      const result = Table.propTypes.children({children}, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });

    it('should accept subclasses of Column as children', () => {
      class AnotherColumn extends Column {}

      const children = [<AnotherColumn dataKey="foo" width={100} />];
      const result = Table.propTypes.children({children}, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });

    it('should not accept non-Column children', () => {
      const children = [<div />];
      const result = Table.propTypes.children({children}, 'children', 'Table');
      expect(result instanceof Error).toEqual(true);
    });

    it('should accept falsy children to allow easier dynamic showing/hiding of columns', () => {
      const children = [false, <Column dataKey="foo" width={100} />, null];
      const result = Table.propTypes.children({children}, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
  });

  describe('height', () => {
    it('should subtract header row height from the inner Grid height if headers are enabled', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerHeight: 10,
            overscanRowCount: 0,
            rowHeight: 20,
            height: 50,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(2);
    });

    it('should not subtract header row height from the inner Grid height if headers are disabled', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableHeader: true,
            headerHeight: 10,
            overscanRowCount: 0,
            rowHeight: 20,
            height: 50,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(3);
    });
  });

  describe('initial rendering', () => {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    const useImmutable = [true, false];
    useImmutable.forEach(useImmutable => {
      it('should render the correct number of rows', () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
            }),
          ),
        );
        // 100px height should fit 1 header (20px) and 8 rows (10px each) -
        expect(
          rendered.querySelectorAll('.ReactVirtualized__Table__headerRow')
            .length,
        ).toEqual(1);
        expect(
          rendered.querySelectorAll('.ReactVirtualized__Table__row').length,
        ).toEqual(8);
      });

      it('should render the expected headers', () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
            }),
          ),
        );
        const columns = rendered.querySelectorAll(
          '.ReactVirtualized__Table__headerColumn',
        );
        expect(columns.length).toEqual(2);
        expect(columns[0].textContent).toEqual('Name');
        expect(columns[1].textContent).toEqual('Email');
      });

      it('should render the expected rows and columns', () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
              headerHeight: 10,
              rowHeight: 20,
              height: 50,
            }),
          ),
        );
        const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
        expect(rows.length).toEqual(2);
        Array.from(rows).forEach((row, index) => {
          let rowData = list.get(index);
          let columns = row.querySelectorAll(
            '.ReactVirtualized__Table__rowColumn',
          );
          expect(columns.length).toEqual(2);
          expect(columns[0].textContent).toEqual(rowData.get('name'));
          expect(columns[1].textContent).toEqual(rowData.get('email'));
        });
      });
    });

    it('should support a :rowHeight function', () => {
      const rowHeight = ({index}) => 10 + index * 10;
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowHeight,
            rowCount: 3,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach((row, index) => {
        expect(Number.parseInt(row.style.height, 10)).toEqual(
          rowHeight({index}),
        );
      });
    });

    it('should support :minWidth and :maxWidth values for a column', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            maxWidth: 75,
            minWidth: 25,
            rowCount: 1,
          }),
        ),
      );
      const columns = rendered.querySelectorAll(
        '.ReactVirtualized__Table__rowColumn',
      );
      const emailColumn = columns[1];
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75);
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25);
    });
  });

  describe('measureAllRows', () => {
    it('should measure any unmeasured rows', () => {
      const rendered = render(
        getMarkup({
          estimatedRowSize: 15,
          height: 0,
          rowCount: 10,
          rowHeight: () => 20,
          width: 0,
        }),
      );
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(
        150,
      );
      rendered.measureAllRows();
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(
        200,
      );
    });
  });

  describe('recomputeRowHeights', () => {
    it('should recompute row heights and other values when called', () => {
      const indices = [];
      const rowHeight = ({index}) => {
        indices.push(index);
        return 10;
      };
      const component = render(
        getMarkup({
          rowHeight,
          rowCount: 50,
        }),
      );

      indices.splice(0);
      component.recomputeRowHeights();

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(7);

      indices.splice(0);
      component.recomputeRowHeights(4);

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(7);
    });
  });

  describe('forceUpdateGrid', () => {
    it('should refresh inner Grid content when called', () => {
      let marker = 'a';
      function cellRenderer({rowIndex}) {
        return `${rowIndex}${marker}`;
      }
      const component = render(getMarkup({cellRenderer}));
      const node = findDOMNode(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });

  describe('custom getter functions', () => {
    it('should use a custom cellDataGetter if specified', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellDataGetter: ({dataKey, rowData}) =>
              `Custom ${dataKey} for row ${rowData.get('id')}`,
          }),
        ),
      );
      const nameColumns = rendered.querySelectorAll(
        '.ReactVirtualized__Table__rowColumn:first-of-type',
      );
      Array.from(nameColumns).forEach((nameColumn, index) => {
        expect(nameColumn.textContent).toEqual(`Custom name for row ${index}`);
      });
    });

    it('should use a custom cellRenderer if specified', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: ({cellData}) => `Custom ${cellData}`,
          }),
        ),
      );
      const nameColumns = rendered.querySelectorAll(
        '.ReactVirtualized__Table__rowColumn:first-of-type',
      );
      Array.from(nameColumns).forEach((nameColumn, index) => {
        let rowData = list.get(index);
        expect(nameColumn.textContent).toEqual(`Custom ${rowData.get('name')}`);
      });
    });

    it('should set the rendered cell content as the cell :title if it is a string', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: () => 'Custom',
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__rowColumn:first-of-type',
      );
      expect(nameColumn.getAttribute('title')).toContain('Custom');
    });

    it('should not set a cell :title if the rendered cell content is not a string', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: () => <div>Custom</div>,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__rowColumn:first-of-type',
      );
      expect(nameColumn.getAttribute('title')).toEqual(null);
    });
  });

  describe('sorting', () => {
    it('should not render sort indicators if no sort function is provided', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const nameColumn = rendered.querySelectorAll(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      expect(nameColumn.className || '').not.toContain(
        'ReactVirtualized__Table__sortableHeaderColumn',
      );
    });

    it('should not render sort indicators for non-sortable columns', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
            sort: () => {},
          }),
        ),
      );
      const nameColumn = rendered.querySelectorAll(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      expect(nameColumn.className || '').not.toContain(
        'ReactVirtualized__Table__sortableHeaderColumn',
      );
      expect(
        rendered.querySelectorAll(
          '.ReactVirtualized__Table__sortableHeaderColumn',
        ).length,
      ).toEqual(1); // Email only
    });

    it('should render sortable column headers as sortable', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: () => {},
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      expect(nameColumn.className).toContain(
        'ReactVirtualized__Table__sortableHeaderColumn',
      );
      expect(
        rendered.querySelectorAll(
          '.ReactVirtualized__Table__sortableHeaderColumn',
        ).length,
      ).toEqual(2); // Email and Name
    });

    it('should render the correct sort indicator by the current sort-by column', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(sortDirection => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: () => {},
              sortBy: 'name',
              sortDirection,
            }),
          ),
        );
        const nameColumn = rendered.querySelector(
          '.ReactVirtualized__Table__headerColumn:first-of-type',
        );

        expect(
          nameColumn.querySelector(
            '.ReactVirtualized__Table__sortableHeaderIcon',
          ),
        ).not.toEqual(null);
        expect(
          nameColumn.querySelector(
            `.ReactVirtualized__Table__sortableHeaderIcon--${sortDirection}`,
          ),
        ).not.toEqual(null);
      });
    });

    it('should call sort with the correct arguments when the current sort-by column header is clicked', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(sortDirection => {
        const sortCalls = [];
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: ({sortBy, sortDirection}) =>
                sortCalls.push({sortBy, sortDirection}),
              sortBy: 'name',
              sortDirection,
            }),
          ),
        );
        const nameColumn = rendered.querySelector(
          '.ReactVirtualized__Table__headerColumn:first-of-type',
        );

        Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        const {sortBy, sortDirection: newSortDirection} = sortCalls[0];
        const expectedSortDirection =
          sortDirection === SortDirection.ASC
            ? SortDirection.DESC
            : SortDirection.ASC;
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(expectedSortDirection);
      });
    });

    it('should call sort with the correct arguments when a new sort-by column header is clicked', () => {
      const sortCalls = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: ({sortBy, sortDirection}) =>
              sortCalls.push({sortBy, sortDirection}),
            sortBy: 'email',
            sortDirection: SortDirection.ASC,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      Simulate.click(nameColumn);
      expect(sortCalls.length).toEqual(1);

      const {sortBy, sortDirection} = sortCalls[0];
      expect(sortBy).toEqual('name');
      expect(sortDirection).toEqual(SortDirection.ASC);
    });

    it('should call sort when a column header is activated via ENTER or SPACE key', () => {
      const sortCalls = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: ({sortBy, sortDirection}) =>
              sortCalls.push({sortBy, sortDirection}),
            sortBy: 'name',
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );
      expect(sortCalls.length).toEqual(0);
      Simulate.keyDown(nameColumn, {key: ' '});
      expect(sortCalls.length).toEqual(1);
      Simulate.keyDown(nameColumn, {key: 'Enter'});
      expect(sortCalls.length).toEqual(2);
      Simulate.keyDown(nameColumn, {key: 'F'});
      expect(sortCalls.length).toEqual(2);
    });

    it('should honor the default sort order on first click of the column', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(sortDirection => {
        const sortCalls = [];
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: ({sortBy, sortDirection}) =>
                sortCalls.push({sortBy, sortDirection}),
              defaultSortDirection: sortDirection,
            }),
          ),
        );
        const nameColumn = rendered.querySelector(
          '.ReactVirtualized__Table__headerColumn:first-of-type',
        );

        Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        const {sortBy, sortDirection: newSortDirection} = sortCalls[0];
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(sortDirection);
      });
    });
  });

  describe('headerRowRenderer', () => {
    it('should render a custom header row if one is provided', () => {
      const headerRowRenderer = jest.fn().mockReturnValue(<div>foo bar</div>);
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerHeight: 33,
            headerRowRenderer,
            rowClassName: 'someRowClass',
          }),
        ),
      );
      expect(rendered.textContent).toContain('foo bar');
      expect(headerRowRenderer).toHaveBeenCalled();
      const params = headerRowRenderer.mock.calls[0][0];
      expect(params.className).toContain('someRowClass');
      expect(params.columns).toHaveLength(2);
      expect(params.style.height).toBe(33);
    });
  });

  describe('headerRenderer', () => {
    it('should render a custom header if one is provided', () => {
      const columnData = {foo: 'foo', bar: 'bar'};
      const headerRendererCalls = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnData,
            headerRenderer: params => {
              headerRendererCalls.push(params);
              return 'custom header';
            },
            sortBy: 'name',
            sortDirection: SortDirection.ASC,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      expect(nameColumn.textContent).toContain('custom header');
      expect(headerRendererCalls.length).toBeTruthy();

      const headerRendererCall = headerRendererCalls[0];
      expect(headerRendererCall.columnData).toEqual(columnData);
      expect(headerRendererCall.dataKey).toEqual('name');
      expect(headerRendererCall.disableSort).toEqual(false);
      expect(headerRendererCall.label).toEqual('Name');
      expect(headerRendererCall.sortBy).toEqual('name');
      expect(headerRendererCall.sortDirection).toEqual(SortDirection.ASC);
    });

    it('should honor sort for custom headers', () => {
      const sortCalls = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerRenderer: () => 'custom header',
            sort: ({sortBy, sortDirection}) =>
              sortCalls.push([sortBy, sortDirection]),
            sortBy: 'name',
            sortDirection: SortDirection.ASC,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      Simulate.click(nameColumn);

      expect(sortCalls.length).toEqual(1);
      const sortCall = sortCalls[0];
      expect(sortCall[0]).toEqual('name');
      expect(sortCall[1]).toEqual(SortDirection.DESC);
    });

    it('should honor :onHeaderClick for custom header', () => {
      const columnData = {foo: 'foo', bar: 'bar'};
      const onHeaderClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnData,
            headerRenderer: () => 'custom header',
            onHeaderClick,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData).toEqual(columnData);
      expect(params.event.type).toEqual('click');
    });
  });

  describe('noRowsRenderer', () => {
    it('should call :noRowsRenderer if :rowCount is 0', () => {
      const rendered = render(
        getMarkup({
          noRowsRenderer: () => <div>No rows!</div>,
          rowCount: 0,
        }),
      );
      const bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('No rows!');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', () => {
      const rendered = render(
        getMarkup({
          rowCount: 0,
        }),
      );
      const bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('');
    });
  });

  describe('onHeaderClick', () => {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', () => {
      const onHeaderClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
            onHeaderClick,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });

    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', () => {
      const onHeaderClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: false,
            onHeaderClick,
          }),
        ),
      );
      const nameColumn = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn:first-of-type',
      );

      Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });
  });

  describe('onRowClick', () => {
    it('should call :onRowClick with the correct :rowIndex when a row is clicked', () => {
      const onRowClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.click(rows[0]);
      Simulate.click(rows[3]);
      expect(onRowClick).toHaveBeenCalledTimes(2);
      expect(onRowClick.mock.calls.map(call => call[0].index)).toEqual([0, 3]);
    });
  });

  describe('onRowDoubleClick', () => {
    it('should call :onRowDoubleClick with the correct :rowIndex when a row is clicked', () => {
      const onRowDoubleClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowDoubleClick,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.doubleClick(rows[0]);
      Simulate.doubleClick(rows[3]);
      expect(onRowDoubleClick).toHaveBeenCalledTimes(2);
      expect(onRowDoubleClick.mock.calls.map(call => call[0].index)).toEqual([
        0,
        3,
      ]);
    });
  });

  describe('onRowRightClick', () => {
    it('should call :onRowRightClick with the correct :rowIndex when a row is right-clicked', () => {
      const onRowRightClick = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowRightClick,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.contextMenu(rows[0]);
      Simulate.contextMenu(rows[3]);
      expect(onRowRightClick).toHaveBeenCalledTimes(2);
      expect(onRowRightClick.mock.calls.map(call => call[0].index)).toEqual([
        0,
        3,
      ]);
    });
  });

  describe('onRowMouseOver/Out', () => {
    it('should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows', () => {
      let onRowMouseOver = jest.fn();
      let onRowMouseOut = jest.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowMouseOver,
            onRowMouseOut,
          }),
        ),
      );

      const simulateMouseOver = (from, to) => {
        Simulate.mouseOut(from, {relatedTarget: to});
        Simulate.mouseOver(to, {relatedTarget: from});
      };

      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');

      simulateMouseOver(rows[0], rows[1]);
      simulateMouseOver(rows[1], rows[2]);
      simulateMouseOver(rows[2], rows[3]);

      expect(onRowMouseOver).toHaveBeenCalled();
      expect(onRowMouseOut).toHaveBeenCalled();
      expect(onRowMouseOver.mock.calls.map(call => call[0].index)).toEqual([
        1,
        2,
        3,
      ]);
      expect(onRowMouseOut.mock.calls.map(call => call[0].index)).toEqual([
        0,
        1,
        2,
      ]);
    });
  });

  describe('rowClassName', () => {
    it('should render a static classname given :rowClassName as a string', () => {
      const staticClassName = 'staticClass';
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowClassName: staticClassName,
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(row => {
        expect(row.className).toContain(staticClassName);
      });
    });

    it('should render dynamic classname given :rowClassName as a function', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowClassName: ({index}) => (index % 2 === 0 ? 'even' : 'odd'),
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.className).toContain('even');
          expect(row.className).not.toContain('odd');
        } else {
          expect(row.className).toContain('odd');
          expect(row.className).not.toContain('even');
        }
      });
    });
  });

  describe('onRowsRendered', () => {
    it('should call :onRowsRendered at least one row is rendered', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
        }),
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should not call :onRowsRendered unless the start or stop indices have changed', () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = params => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({onRowsRendered}));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({onRowsRendered}));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should call :onRowsRendered if the start or stop indices have changed', () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = params => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({onRowsRendered}));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(
        getMarkup({
          height: 50,
          onRowsRendered,
        }),
      );
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(2);
    });

    it('should not call :onRowsRendered if no rows are rendered', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          height: 0,
          onRowsRendered: params => ({startIndex, stopIndex} = params),
        }),
      );
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe(':scrollTop property', () => {
    it('should render correctly when an initial :scrollTop property is specified', () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
          scrollTop: 80,
        }),
      );
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });

    it('should render correctly when :scrollTop property is updated', () => {
      let startIndex, stopIndex;

      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
        }),
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);

      render(
        getMarkup({
          onRowsRendered: params => ({startIndex, stopIndex} = params),
          scrollTop: 80,
        }),
      );
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });
  });

  describe('styles, classNames, and ids', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(
        render(
          getMarkup({
            sort: () => {},
            sortBy: 'name',
            sortDirection: SortDirection.ASC,
          }),
        ),
      );
      expect(node.className).toEqual('ReactVirtualized__Table');
      expect(
        node.querySelector('.ReactVirtualized__Table__headerRow'),
      ).toBeTruthy();
      expect(
        node.querySelector('.ReactVirtualized__Table__rowColumn'),
      ).toBeTruthy();
      expect(
        node.querySelector('.ReactVirtualized__Table__headerColumn'),
      ).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__row')).toBeTruthy();
      expect(
        node.querySelector('.ReactVirtualized__Table__sortableHeaderColumn'),
      ).toBeTruthy();
      expect(
        node.querySelector('.ReactVirtualized__Table__sortableHeaderIcon'),
      ).toBeTruthy();
    });

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(
        render(
          getMarkup({
            className: 'foo',
            headerClassName: 'bar',
            rowClassName: 'baz',
          }),
        ),
      );
      expect(node.className).toContain('foo');
      expect(node.querySelectorAll('.bar').length).toEqual(2);
      expect(node.querySelectorAll('.baz').length).toEqual(9);
    });

    it('should use a custom :id if specified', () => {
      const node = findDOMNode(render(getMarkup({id: 'bar'})));
      expect(node.getAttribute('id')).toEqual('bar');
    });

    it('should not set :id on the inner Grid', () => {
      const node = findDOMNode(render(getMarkup({id: 'bar'})));
      const grid = node.querySelector('.ReactVirtualized__Grid');
      expect(grid.getAttribute('id')).not.toEqual('bar');
    });

    it('should use custom :styles if specified', () => {
      const columnStyle = {backgroundColor: 'red'};
      const headerStyle = {backgroundColor: 'blue'};
      const columnHeaderStyle = {color: 'yellow'};
      const rowStyle = {backgroundColor: 'green'};
      const style = {backgroundColor: 'orange'};
      const node = findDOMNode(
        render(
          getMarkup({
            columnStyle,
            headerStyle,
            columnHeaderStyle,
            rowStyle,
            style,
          }),
        ),
      );
      expect(
        node.querySelector('.ReactVirtualized__Table__rowColumn').style
          .backgroundColor,
      ).toEqual('red');
      expect(
        node.querySelector('.ReactVirtualized__Table__headerColumn').style
          .backgroundColor,
      ).toEqual('blue');
      expect(
        node.querySelector('.ReactVirtualized__Table__headerColumn').style
          .color,
      ).toEqual('yellow');
      expect(
        node.querySelector('.ReactVirtualized__Table__row').style
          .backgroundColor,
      ).toEqual('green');
      expect(node.style.backgroundColor).toEqual('orange');
    });

    it('should render dynamic style given :rowStyle as a function', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowStyle: ({index}) =>
              index % 2 === 0
                ? {backgroundColor: 'red'}
                : {backgroundColor: 'green'},
          }),
        ),
      );
      const rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual('red');
        } else {
          expect(row.style.backgroundColor).toEqual('green');
        }
      });
    });

    it('should pass :gridClassName and :gridStyle to the inner Grid', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            gridClassName: 'foo',
            gridStyle: {backgroundColor: 'red'},
          }),
        ),
      );
      const grid = rendered.querySelector('.ReactVirtualized__Grid');
      expect(grid.className).toContain('foo');
      expect(grid.style.backgroundColor).toEqual('red');
    });
  });

  describe('overscanRowCount', () => {
    it('should not overscan by default', () => {
      const mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
        }),
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it('should overscan the specified amount', () => {
      const mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
          overscanRowCount: 10,
        }),
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe('onScroll', () => {
    it('should trigger callback when component initially mounts', () => {
      const onScrollCalls = [];
      render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 80,
          scrollHeight: 1000,
          scrollTop: 0,
        },
      ]);
    });

    it('should trigger callback when component scrolls', () => {
      const onScrollCalls = [];
      const rendered = render(
        getMarkup({
          onScroll: params => onScrollCalls.push(params),
        }),
      );
      const target = {
        scrollLeft: 0,
        scrollTop: 100,
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered.Grid), {target});
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100,
      });
    });
  });

  describe('a11y properties', () => {
    it('should set aria role on the table', () => {
      const node = findDOMNode(render(getMarkup()));
      expect(node.getAttribute('role')).toEqual('grid');
    });

    it('should set aria role on the header row', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const row = rendered.querySelector('.ReactVirtualized__Table__headerRow');
      expect(row.getAttribute('role')).toEqual('row');
    });

    it('should set appropriate aria role on the grid', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const grid = rendered.querySelector('.ReactVirtualized__Table__Grid');
      expect(grid.getAttribute('role')).toEqual('rowgroup');
    });

    it('should set aria role on a row', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('role')).toEqual('row');
    });

    it('should set aria role on a cell', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const cell = rendered.querySelector(
        '.ReactVirtualized__Table__rowColumn',
      );
      expect(cell.getAttribute('role')).toEqual('gridcell');
    });

    it('should set aria-describedby on a cell when the column has an id', () => {
      const columnID = 'column-header-test';
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnID,
          }),
        ),
      );
      const cell = rendered.querySelector(
        '.ReactVirtualized__Table__rowColumn',
      );
      expect(cell.getAttribute('aria-describedby')).toEqual(columnID);
    });

    it('should attach a11y properties to a row if :onRowClick is specified', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick: () => {},
          }),
        ),
      );
      const row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual('row');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a row if no :onRowClick is specified', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick: null,
          }),
        ),
      );
      const row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });

    it('should set aria role on a header column', () => {
      const rendered = findDOMNode(render(getMarkup()));
      const header = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(header.getAttribute('role')).toEqual('columnheader');
    });

    it('should set aria-sort ascending on a header column if the column is sorted ascending', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sortBy: 'name',
            sortDirection: SortDirection.ASC,
          }),
        ),
      );
      const header = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(header.getAttribute('aria-sort')).toEqual('ascending');
    });

    it('should set aria-sort descending on a header column if the column is sorted descending', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sortBy: 'name',
            sortDirection: SortDirection.DESC,
          }),
        ),
      );
      const header = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(header.getAttribute('aria-sort')).toEqual('descending');
    });

    it('should set id on a header column when the column has an id', () => {
      const columnID = 'column-header-test';
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnID,
          }),
        ),
      );
      const header = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(header.getAttribute('id')).toEqual(columnID);
    });

    it('should attach a11y properties to a header column if sort is enabled', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: false,
            sort: () => {},
          }),
        ),
      );
      const row = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(row.getAttribute('aria-label')).toEqual('Name');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a header column if sort is not enabled', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
          }),
        ),
      );
      const row = rendered.querySelector(
        '.ReactVirtualized__Table__headerColumn',
      );
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
  });

  describe('tabIndex', () => {
    it('should be focusable by default', () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(
        rendered.querySelector('.ReactVirtualized__Grid').tabIndex,
      ).toEqual(0);
    });

    it('should allow tabIndex to be overridden', () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            tabIndex: -1,
          }),
        ),
      );
      expect(
        rendered.querySelector('.ReactVirtualized__Grid').tabIndex,
      ).toEqual(-1);
    });
  });

  describe('pure', () => {
    it('should not re-render unless props have changed', () => {
      let headerRendererCalled = false;
      let cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      const markup = getMarkup({
        headerRenderer,
        cellRenderer,
      });
      render(markup);
      expect(headerRendererCalled).toEqual(true);
      expect(cellRendererCalled).toEqual(true);
      headerRendererCalled = false;
      cellRendererCalled = false;
      render(markup);
      expect(headerRendererCalled).toEqual(false);
      expect(cellRendererCalled).toEqual(false);
    });

    it('should re-render both the Table and the inner Grid whenever an external property changes', () => {
      let headerRendererCalled = false;
      let cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      const initialProperties = {
        autoHeight: false,
        cellRenderer,
        estimatedRowSize: 15,
        headerRenderer,
        overscanRowCount: 1,
        rowHeight: 15,
        rowCount: 20,
        scrollToAlignment: 'auto',
        scrollTop: 0,
        sortBy: 'name',
        sortDirection: SortDirection.ASC,
        tabIndex: null,
      };
      const changedProperties = {
        autoHeight: true,
        estimatedRowSize: 10,
        overscanRowCount: 0,
        rowHeight: 10,
        rowCount: 10,
        scrollToAlignment: 'center',
        scrollTop: 1,
        sortBy: 'email',
        sortDirection: SortDirection.DESC,
        tabIndex: 1,
      };
      Object.entries(changedProperties).forEach(([key, value]) => {
        render.unmount(); // Reset
        render(getMarkup(initialProperties));
        headerRendererCalled = true;
        cellRendererCalled = false;
        render(
          getMarkup({
            ...initialProperties,
            [key]: value,
          }),
        );
        expect(headerRendererCalled).toEqual(true);
        expect(cellRendererCalled).toEqual(true);
      });
    });
  });

  it('should set the width of the single-column inner Grid to auto', () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(
      rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer')
        .style.width,
    ).toEqual('auto');
  });

  it('should relay the Grid :parent param to the Column :cellRenderer', () => {
    const cellRenderer = jest.fn().mockReturnValue(null);
    findDOMNode(render(getMarkup({cellRenderer})));
    expect(cellRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });
});
