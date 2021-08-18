import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import { Simulate } from 'react-dom/test-utils';
import Immutable from 'immutable';
import Column from './Column';
import Table from './Table';
import SortDirection from './SortDirection';
describe('Table', function () {
  var array = [];

  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: "Name ".concat(i),
      email: "user-".concat(i, "@treasure-data.com")
    });
  }

  var list = Immutable.fromJS(array); // Works with an Immutable List of Maps

  function immutableRowGetter(_ref) {
    var index = _ref.index;
    return list.get(index);
  } // Works with an Array of Objects


  function vanillaRowGetter(_ref2) {
    var index = _ref2.index;
    return array[index];
  } // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below


  function overscanIndicesGetter(_ref3) {
    var startIndex = _ref3.startIndex,
        stopIndex = _ref3.stopIndex;
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex
    };
  }

  function getMarkup() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        cellDataGetter = _ref4.cellDataGetter,
        cellRenderer = _ref4.cellRenderer,
        _ref4$columnData = _ref4.columnData,
        columnData = _ref4$columnData === void 0 ? {
      data: 123
    } : _ref4$columnData,
        columnID = _ref4.columnID,
        columnStyle = _ref4.columnStyle,
        columnHeaderStyle = _ref4.columnHeaderStyle,
        _ref4$disableSort = _ref4.disableSort,
        disableSort = _ref4$disableSort === void 0 ? false : _ref4$disableSort,
        headerRenderer = _ref4.headerRenderer,
        maxWidth = _ref4.maxWidth,
        minWidth = _ref4.minWidth,
        defaultSortDirection = _ref4.defaultSortDirection,
        label = _ref4.label,
        flexTableProps = _objectWithoutProperties(_ref4, ["cellDataGetter", "cellRenderer", "columnData", "columnID", "columnStyle", "columnHeaderStyle", "disableSort", "headerRenderer", "maxWidth", "minWidth", "defaultSortDirection", "label"]);

    return React.createElement(Table, _extends({
      headerHeight: 20,
      height: 100,
      overscanRowCount: 0,
      overscanIndicesGetter: overscanIndicesGetter,
      rowCount: list.size,
      rowGetter: immutableRowGetter,
      rowHeight: 10,
      width: 100
    }, flexTableProps), React.createElement(Column, {
      label: label || 'Name',
      dataKey: "name",
      columnData: columnData,
      width: 50,
      cellRenderer: cellRenderer,
      cellDataGetter: cellDataGetter,
      headerRenderer: headerRenderer,
      disableSort: disableSort,
      defaultSortDirection: defaultSortDirection,
      style: columnStyle,
      headerStyle: columnHeaderStyle,
      id: columnID
    }), React.createElement(Column, {
      label: "Email",
      dataKey: "email",
      maxWidth: maxWidth,
      minWidth: minWidth,
      width: 50
    }), false, true, null, undefined);
  }

  beforeEach(function () {
    return jest.resetModules();
  });
  describe('children', function () {
    it('should accept Column children', function () {
      var children = [React.createElement(Column, {
        dataKey: "foo",
        width: 100
      })];
      var result = Table.propTypes.children({
        children: children
      }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
    it('should accept subclasses of Column as children', function () {
      var AnotherColumn =
      /*#__PURE__*/
      function (_Column) {
        _inherits(AnotherColumn, _Column);

        function AnotherColumn() {
          _classCallCheck(this, AnotherColumn);

          return _possibleConstructorReturn(this, _getPrototypeOf(AnotherColumn).apply(this, arguments));
        }

        return AnotherColumn;
      }(Column);

      var children = [React.createElement(AnotherColumn, {
        dataKey: "foo",
        width: 100
      })];
      var result = Table.propTypes.children({
        children: children
      }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
    it('should not accept non-Column children', function () {
      var children = [React.createElement("div", null)];
      var result = Table.propTypes.children({
        children: children
      }, 'children', 'Table');
      expect(result instanceof Error).toEqual(true);
    });
    it('should accept falsy children to allow easier dynamic showing/hiding of columns', function () {
      var children = [false, React.createElement(Column, {
        dataKey: "foo",
        width: 100
      }), null];
      var result = Table.propTypes.children({
        children: children
      }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
  });
  describe('height', function () {
    it('should subtract header row height from the inner Grid height if headers are enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(2);
    });
    it('should not subtract header row height from the inner Grid height if headers are disabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableHeader: true,
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(3);
    });
  });
  describe('initial rendering', function () {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    var useImmutable = [true, false];
    useImmutable.forEach(function (useImmutable) {
      it('should render the correct number of rows', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        }))); // 100px height should fit 1 header (20px) and 8 rows (10px each) -

        expect(rendered.querySelectorAll('.ReactVirtualized__Table__headerRow').length).toEqual(1);
        expect(rendered.querySelectorAll('.ReactVirtualized__Table__row').length).toEqual(8);
      });
      it('should render the expected headers', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })));
        var columns = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn');
        expect(columns.length).toEqual(2);
        expect(columns[0].textContent).toEqual('Name');
        expect(columns[1].textContent).toEqual('Email');
      });
      it('should render the expected rows and columns', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
          headerHeight: 10,
          rowHeight: 20,
          height: 50
        })));
        var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
        expect(rows.length).toEqual(2);
        Array.from(rows).forEach(function (row, index) {
          var rowData = list.get(index);
          var columns = row.querySelectorAll('.ReactVirtualized__Table__rowColumn');
          expect(columns.length).toEqual(2);
          expect(columns[0].textContent).toEqual(rowData.get('name'));
          expect(columns[1].textContent).toEqual(rowData.get('email'));
        });
      });
    });
    it('should support a :rowHeight function', function () {
      var rowHeight = function rowHeight(_ref5) {
        var index = _ref5.index;
        return 10 + index * 10;
      };

      var rendered = findDOMNode(render(getMarkup({
        rowHeight: rowHeight,
        rowCount: 3
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
        expect(Number.parseInt(row.style.height, 10)).toEqual(rowHeight({
          index: index
        }));
      });
    });
    it('should support :minWidth and :maxWidth values for a column', function () {
      var rendered = findDOMNode(render(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowCount: 1
      })));
      var columns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn');
      var emailColumn = columns[1];
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75);
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25);
    });
  });
  describe('measureAllRows', function () {
    it('should measure any unmeasured rows', function () {
      var rendered = render(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: function rowHeight() {
          return 20;
        },
        width: 0
      }));
      expect(rendered.Grid.state.instanceProps.rowSizeAndPositionManager.getTotalSize()).toEqual(150);
      rendered.measureAllRows();
      expect(rendered.Grid.state.instanceProps.rowSizeAndPositionManager.getTotalSize()).toEqual(200);
    });
  });
  describe('recomputeRowHeights', function () {
    it('should recompute row heights and other values when called', function () {
      var indices = [];

      var rowHeight = function rowHeight(_ref6) {
        var index = _ref6.index;
        indices.push(index);
        return 10;
      };

      var component = render(getMarkup({
        rowHeight: rowHeight,
        rowCount: 50
      }));
      indices.splice(0);
      component.recomputeRowHeights(); // Only the rows required to fill the current viewport will be rendered

      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(7);
      indices.splice(0);
      component.recomputeRowHeights(4);
      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(7);
    });
  });
  describe('forceUpdateGrid', function () {
    it('should refresh inner Grid content when called', function () {
      var marker = 'a';

      function cellRenderer(_ref7) {
        var rowIndex = _ref7.rowIndex;
        return "".concat(rowIndex).concat(marker);
      }

      var component = render(getMarkup({
        cellRenderer: cellRenderer
      }));
      var node = findDOMNode(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });
  describe('custom getter functions', function () {
    it('should use a custom cellDataGetter if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellDataGetter: function cellDataGetter(_ref8) {
          var dataKey = _ref8.dataKey,
              rowData = _ref8.rowData;
          return "Custom ".concat(dataKey, " for row ").concat(rowData.get('id'));
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      Array.from(nameColumns).forEach(function (nameColumn, index) {
        expect(nameColumn.textContent).toEqual("Custom name for row ".concat(index));
      });
    });
    it('should use a custom cellRenderer if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer(_ref9) {
          var cellData = _ref9.cellData;
          return "Custom ".concat(cellData);
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      Array.from(nameColumns).forEach(function (nameColumn, index) {
        var rowData = list.get(index);
        expect(nameColumn.textContent).toEqual("Custom ".concat(rowData.get('name')));
      });
    });
    it('should set the rendered cell content as the cell :title if it is a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer() {
          return 'Custom';
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toContain('Custom');
    });
    it('should not set a cell :title if the rendered cell content is not a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer() {
          return React.createElement("div", null, "Custom");
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toEqual(null);
    });
    it('should set the rendered header label as header :title if it is a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        label: 'Custom'
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerTruncatedText:first-of-type');
      expect(nameColumn.getAttribute('title')).toContain('Custom');
    });
    it('should not set a header :title if the rendered header label is not a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        label: React.createElement("div", null, "Custom")
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerTruncatedText:first-of-type');
      expect(nameColumn.getAttribute('title')).toEqual(null);
    });
  });
  describe('sorting', function () {
    it('should not render sort indicators if no sort function is provided', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
    });
    it('should not render sort indicators for non-sortable columns', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(1); // Email only
    });
    it('should render sortable column headers as sortable', function () {
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(nameColumn.className).toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(2); // Email and Name
    });
    it('should render the correct sort indicator by the current sort-by column', function () {
      var sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(function (sortDirection) {
        var rendered = findDOMNode(render(getMarkup({
          sort: function sort() {},
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
        expect(nameColumn.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).not.toEqual(null);
        expect(nameColumn.querySelector(".ReactVirtualized__Table__sortableHeaderIcon--".concat(sortDirection))).not.toEqual(null);
      });
    });
    it('should call sort with the correct arguments when the current sort-by column header is clicked', function () {
      var sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(function (sortDirection) {
        var sortCalls = [];
        var rendered = findDOMNode(render(getMarkup({
          sort: function sort(_ref10) {
            var sortBy = _ref10.sortBy,
                sortDirection = _ref10.sortDirection;
            return sortCalls.push({
              sortBy: sortBy,
              sortDirection: sortDirection
            });
          },
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
        Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);
        var _sortCalls$ = sortCalls[0],
            sortBy = _sortCalls$.sortBy,
            newSortDirection = _sortCalls$.sortDirection;
        var expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(expectedSortDirection);
      });
    });
    it('should call sort with the correct arguments when a new sort-by column header is clicked', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort(_ref11) {
          var sortBy = _ref11.sortBy,
              sortDirection = _ref11.sortDirection;
          return sortCalls.push({
            sortBy: sortBy,
            sortDirection: sortDirection
          });
        },
        sortBy: 'email',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(sortCalls.length).toEqual(1);
      var _sortCalls$2 = sortCalls[0],
          sortBy = _sortCalls$2.sortBy,
          sortDirection = _sortCalls$2.sortDirection;
      expect(sortBy).toEqual('name');
      expect(sortDirection).toEqual(SortDirection.ASC);
    });
    it('should call sort when a column header is activated via ENTER or SPACE key', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort(_ref12) {
          var sortBy = _ref12.sortBy,
              sortDirection = _ref12.sortDirection;
          return sortCalls.push({
            sortBy: sortBy,
            sortDirection: sortDirection
          });
        },
        sortBy: 'name'
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(sortCalls.length).toEqual(0);
      Simulate.keyDown(nameColumn, {
        key: ' '
      });
      expect(sortCalls.length).toEqual(1);
      Simulate.keyDown(nameColumn, {
        key: 'Enter'
      });
      expect(sortCalls.length).toEqual(2);
      Simulate.keyDown(nameColumn, {
        key: 'F'
      });
      expect(sortCalls.length).toEqual(2);
    });
    it('should honor the default sort order on first click of the column', function () {
      var sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(function (sortDirection) {
        var sortCalls = [];
        var rendered = findDOMNode(render(getMarkup({
          sort: function sort(_ref13) {
            var sortBy = _ref13.sortBy,
                sortDirection = _ref13.sortDirection;
            return sortCalls.push({
              sortBy: sortBy,
              sortDirection: sortDirection
            });
          },
          defaultSortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
        Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);
        var _sortCalls$3 = sortCalls[0],
            sortBy = _sortCalls$3.sortBy,
            newSortDirection = _sortCalls$3.sortDirection;
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(sortDirection);
      });
    });
  });
  describe('headerRowRenderer', function () {
    it('should render a custom header row if one is provided', function () {
      var headerRowRenderer = jest.fn().mockReturnValue(React.createElement("div", null, "foo bar"));
      var rendered = findDOMNode(render(getMarkup({
        headerHeight: 33,
        headerRowRenderer: headerRowRenderer,
        rowClassName: 'someRowClass'
      })));
      expect(rendered.textContent).toContain('foo bar');
      expect(headerRowRenderer).toHaveBeenCalled();
      var params = headerRowRenderer.mock.calls[0][0];
      expect(params.className).toContain('someRowClass');
      expect(params.columns).toHaveLength(2);
      expect(params.style.height).toBe(33);
    });
  });
  describe('headerRenderer', function () {
    it('should render a custom header if one is provided', function () {
      var columnData = {
        foo: 'foo',
        bar: 'bar'
      };
      var headerRendererCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer(params) {
          headerRendererCalls.push(params);
          return 'custom header';
        },
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(nameColumn.textContent).toContain('custom header');
      expect(headerRendererCalls.length).toBeTruthy();
      var headerRendererCall = headerRendererCalls[0];
      expect(headerRendererCall.columnData).toEqual(columnData);
      expect(headerRendererCall.dataKey).toEqual('name');
      expect(headerRendererCall.disableSort).toEqual(false);
      expect(headerRendererCall.label).toEqual('Name');
      expect(headerRendererCall.sortBy).toEqual('name');
      expect(headerRendererCall.sortDirection).toEqual(SortDirection.ASC);
    });
    it('should honor sort for custom headers', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        headerRenderer: function headerRenderer() {
          return 'custom header';
        },
        sort: function sort(_ref14) {
          var sortBy = _ref14.sortBy,
              sortDirection = _ref14.sortDirection;
          return sortCalls.push([sortBy, sortDirection]);
        },
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(sortCalls.length).toEqual(1);
      var sortCall = sortCalls[0];
      expect(sortCall[0]).toEqual('name');
      expect(sortCall[1]).toEqual(SortDirection.DESC);
    });
    it('should honor :onHeaderClick for custom header', function () {
      var columnData = {
        foo: 'foo',
        bar: 'bar'
      };
      var onHeaderClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer() {
          return 'custom header';
        },
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData).toEqual(columnData);
      expect(params.event.type).toEqual('click');
    });
  });
  describe('noRowsRenderer', function () {
    it('should call :noRowsRenderer if :rowCount is 0', function () {
      var rendered = render(getMarkup({
        noRowsRenderer: function noRowsRenderer() {
          return React.createElement("div", null, "No rows!");
        },
        rowCount: 0
      }));
      var bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('No rows!');
    });
    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', function () {
      var rendered = render(getMarkup({
        rowCount: 0
      }));
      var bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('');
    });
  });
  describe('onColumnClick', function () {
    it('should call :onColumnClick with the correct arguments when a column is clicked', function () {
      var onColumnClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        onColumnClick: onColumnClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(onColumnClick).toHaveBeenCalledTimes(1);
      var params = onColumnClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });
  });
  describe('onHeaderClick', function () {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', function () {
      var onHeaderClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', function () {
      var onHeaderClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      Simulate.click(nameColumn);
      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });
  });
  describe('onRowClick', function () {
    it('should call :onRowClick with the correct :rowIndex when a row is clicked', function () {
      var onRowClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: onRowClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.click(rows[0]);
      Simulate.click(rows[3]);
      expect(onRowClick).toHaveBeenCalledTimes(2);
      expect(onRowClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });
  describe('onRowDoubleClick', function () {
    it('should call :onRowDoubleClick with the correct :rowIndex when a row is clicked', function () {
      var onRowDoubleClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        onRowDoubleClick: onRowDoubleClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.doubleClick(rows[0]);
      Simulate.doubleClick(rows[3]);
      expect(onRowDoubleClick).toHaveBeenCalledTimes(2);
      expect(onRowDoubleClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });
  describe('onRowRightClick', function () {
    it('should call :onRowRightClick with the correct :rowIndex when a row is right-clicked', function () {
      var onRowRightClick = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        onRowRightClick: onRowRightClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.contextMenu(rows[0]);
      Simulate.contextMenu(rows[3]);
      expect(onRowRightClick).toHaveBeenCalledTimes(2);
      expect(onRowRightClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });
  describe('onRowMouseOver/Out', function () {
    it('should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows', function () {
      var onRowMouseOver = jest.fn();
      var onRowMouseOut = jest.fn();
      var rendered = findDOMNode(render(getMarkup({
        onRowMouseOver: onRowMouseOver,
        onRowMouseOut: onRowMouseOut
      })));

      var simulateMouseOver = function simulateMouseOver(from, to) {
        Simulate.mouseOut(from, {
          relatedTarget: to
        });
        Simulate.mouseOver(to, {
          relatedTarget: from
        });
      };

      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      simulateMouseOver(rows[0], rows[1]);
      simulateMouseOver(rows[1], rows[2]);
      simulateMouseOver(rows[2], rows[3]);
      expect(onRowMouseOver).toHaveBeenCalled();
      expect(onRowMouseOut).toHaveBeenCalled();
      expect(onRowMouseOver.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([1, 2, 3]);
      expect(onRowMouseOut.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 1, 2]);
    });
  });
  describe('rowClassName', function () {
    it('should render a static classname given :rowClassName as a string', function () {
      var staticClassName = 'staticClass';
      var rendered = findDOMNode(render(getMarkup({
        rowClassName: staticClassName
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row) {
        expect(row.className).toContain(staticClassName);
      });
    });
    it('should render dynamic classname given :rowClassName as a function', function () {
      var rendered = findDOMNode(render(getMarkup({
        rowClassName: function rowClassName(_ref15) {
          var index = _ref15.index;
          return index % 2 === 0 ? 'even' : 'odd';
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
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
  describe('onRowsRendered', function () {
    it('should call :onRowsRendered at least one row is rendered', function () {
      var startIndex, stopIndex;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params;

          return _params = params, startIndex = _params.startIndex, stopIndex = _params.stopIndex, _params;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });
    it('should not call :onRowsRendered unless the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex;
      var stopIndex;

      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };

      render(getMarkup({
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });
    it('should call :onRowsRendered if the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex;
      var stopIndex;

      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };

      render(getMarkup({
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({
        height: 50,
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(2);
    });
    it('should not call :onRowsRendered if no rows are rendered', function () {
      var startIndex, stopIndex;
      render(getMarkup({
        height: 0,
        onRowsRendered: function onRowsRendered(params) {
          var _params2;

          return _params2 = params, startIndex = _params2.startIndex, stopIndex = _params2.stopIndex, _params2;
        }
      }));
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });
  describe(':scrollTop property', function () {
    it('should render correctly when an initial :scrollTop property is specified', function () {
      var startIndex, stopIndex;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params3;

          return _params3 = params, startIndex = _params3.startIndex, stopIndex = _params3.stopIndex, _params3;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });
    it('should render correctly when :scrollTop property is updated', function () {
      var startIndex, stopIndex;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params4;

          return _params4 = params, startIndex = _params4.startIndex, stopIndex = _params4.stopIndex, _params4;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params5;

          return _params5 = params, startIndex = _params5.startIndex, stopIndex = _params5.stopIndex, _params5;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });
  });
  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var node = findDOMNode(render(getMarkup({
        sort: function sort() {},
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      expect(node.className).toEqual('ReactVirtualized__Table');
      expect(node.querySelector('.ReactVirtualized__Table__headerRow')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__row')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).toBeTruthy();
    });
    it('should use a custom :className if specified', function () {
      var node = findDOMNode(render(getMarkup({
        className: 'foo',
        headerClassName: 'bar',
        rowClassName: 'baz'
      })));
      expect(node.className).toContain('foo');
      expect(node.querySelectorAll('.bar').length).toEqual(2);
      expect(node.querySelectorAll('.baz').length).toEqual(9);
    });
    it('should use a custom :id if specified', function () {
      var node = findDOMNode(render(getMarkup({
        id: 'bar'
      })));
      expect(node.getAttribute('id')).toEqual('bar');
    });
    it('should not set :id on the inner Grid', function () {
      var node = findDOMNode(render(getMarkup({
        id: 'bar'
      })));
      var grid = node.querySelector('.ReactVirtualized__Grid');
      expect(grid.getAttribute('id')).not.toEqual('bar');
    });
    it('should use custom :styles if specified', function () {
      var columnStyle = {
        backgroundColor: 'red',
        overflow: 'visible'
      };
      var headerStyle = {
        backgroundColor: 'blue'
      };
      var columnHeaderStyle = {
        color: 'yellow'
      };
      var rowStyle = {
        backgroundColor: 'green'
      };
      var style = {
        backgroundColor: 'orange'
      };
      var node = findDOMNode(render(getMarkup({
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        columnHeaderStyle: columnHeaderStyle,
        rowStyle: rowStyle,
        style: style
      })));
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn').style.backgroundColor).toEqual('red');
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn').style.overflow).toEqual('visible');
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn').style.backgroundColor).toEqual('blue');
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn').style.color).toEqual('yellow');
      expect(node.querySelector('.ReactVirtualized__Table__row').style.backgroundColor).toEqual('green');
      expect(node.style.backgroundColor).toEqual('orange');
    });
    it('should render dynamic style given :rowStyle as a function', function () {
      var rendered = findDOMNode(render(getMarkup({
        rowStyle: function rowStyle(_ref16) {
          var index = _ref16.index;
          return index % 2 === 0 ? {
            backgroundColor: 'red'
          } : {
            backgroundColor: 'green'
          };
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual('red');
        } else {
          expect(row.style.backgroundColor).toEqual('green');
        }
      });
    });
    it('should pass :gridClassName and :gridStyle to the inner Grid', function () {
      var rendered = findDOMNode(render(getMarkup({
        gridClassName: 'foo',
        gridStyle: {
          backgroundColor: 'red'
        }
      })));
      var grid = rendered.querySelector('.ReactVirtualized__Grid');
      expect(grid.className).toContain('foo');
      expect(grid.style.backgroundColor).toEqual('red');
    });
  });
  describe('overscanRowCount', function () {
    it('should not overscan by default', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);
      render(getMarkup({
        overscanIndicesGetter: mock
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });
    it('should overscan the specified amount', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);
      render(getMarkup({
        overscanIndicesGetter: mock,
        overscanRowCount: 10
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });
  describe('onScroll', function () {
    it('should trigger callback when component initially mounts', function () {
      var onScrollCalls = [];
      render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 0
      }]);
    });
    it('should trigger callback when component scrolls', function () {
      var onScrollCalls = [];
      var rendered = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      var target = {
        scrollLeft: 0,
        scrollTop: 100
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check

      Simulate.scroll(findDOMNode(rendered.Grid), {
        target: target
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });
  describe('a11y properties', function () {
    it('should set aria role on the table', function () {
      var node = findDOMNode(render(getMarkup()));
      expect(node.getAttribute('role')).toEqual('grid');
    });
    it('should set aria col/row count on the table', function () {
      var node = findDOMNode(render(getMarkup()));
      expect(node.getAttribute('aria-colcount')).toEqual('2');
      expect(node.getAttribute('aria-rowcount')).toEqual("".concat(list.size));
    });
    it('should pass down aria labels on the table', function () {
      var node = findDOMNode(render(getMarkup({
        'aria-label': 'my-table-label',
        'aria-labelledby': 'my-table-label-id'
      })));
      expect(node.getAttribute('aria-label')).toEqual('my-table-label');
      expect(node.getAttribute('aria-labelledby')).toEqual('my-table-label-id');
    });
    it('should set aria role on the header row', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerRow');
      expect(row.getAttribute('role')).toEqual('row');
    });
    it('should set appropriate aria role on the grid', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var grid = rendered.querySelector('.ReactVirtualized__Table__Grid');
      expect(grid.getAttribute('role')).toEqual('rowgroup');
    });
    it('should set aria role on a row', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('role')).toEqual('row');
    });
    it('should set aria rowindex on a row', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows[0].getAttribute('aria-rowindex')).toEqual('1');
      expect(rows[1].getAttribute('aria-rowindex')).toEqual('2');
    });
    it('should set aria role on a cell', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var cell = rendered.querySelector('.ReactVirtualized__Table__rowColumn');
      expect(cell.getAttribute('role')).toEqual('gridcell');
    });
    it('should set aria colindex on a cell', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var cells = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn');
      expect(cells[0].getAttribute('aria-colindex')).toEqual('1');
      expect(cells[1].getAttribute('aria-colindex')).toEqual('2');
    });
    it('should set aria-describedby on a cell when the column has an id', function () {
      var columnID = 'column-header-test';
      var rendered = findDOMNode(render(getMarkup({
        columnID: columnID
      })));
      var cell = rendered.querySelector('.ReactVirtualized__Table__rowColumn');
      expect(cell.getAttribute('aria-describedby')).toEqual(columnID);
    });
    it('should attach a11y properties to a row if :onRowClick is specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: function onRowClick() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual('row');
      expect(row.tabIndex).toEqual(0);
    });
    it('should not attach a11y properties to a row if no :onRowClick is specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: null
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
    it('should set aria role on a header column', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('role')).toEqual('columnheader');
    });
    it('should set aria-sort ascending on a header column if the column is sorted ascending', function () {
      var rendered = findDOMNode(render(getMarkup({
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('aria-sort')).toEqual('ascending');
    });
    it('should set aria-sort descending on a header column if the column is sorted descending', function () {
      var rendered = findDOMNode(render(getMarkup({
        sortBy: 'name',
        sortDirection: SortDirection.DESC
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('aria-sort')).toEqual('descending');
    });
    it('should set aria-sort to "none" if the column is sortable but not the current sort', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        sort: jest.fn()
      })));
      var headers = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn'); // the first column is not sortable

      expect(headers[0].getAttribute('aria-sort')).toBe(null); // the second column is sortable

      expect(headers[1].getAttribute('aria-sort')).toEqual('none');
    });
    it('should set id on a header column when the column has an id', function () {
      var columnID = 'column-header-test';
      var rendered = findDOMNode(render(getMarkup({
        columnID: columnID
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('id')).toEqual(columnID);
    });
    it('should attach a11y properties to a header column if sort is enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        sort: function sort() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual('Name');
      expect(row.tabIndex).toEqual(0);
    });
    it('should not attach a11y properties to a header column if sort is not enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
  });
  describe('tabIndex', function () {
    it('should be focusable by default', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(0);
    });
    it('should allow tabIndex to be overridden', function () {
      var rendered = findDOMNode(render(getMarkup({
        tabIndex: -1
      })));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(-1);
    });
  });
  describe('pure', function () {
    it('should not re-render unless props have changed', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;

      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }

      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }

      var markup = getMarkup({
        headerRenderer: headerRenderer,
        cellRenderer: cellRenderer
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
    it('should re-render both the Table and the inner Grid whenever an external property changes', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;

      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }

      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }

      var initialProperties = {
        autoHeight: false,
        cellRenderer: cellRenderer,
        estimatedRowSize: 15,
        headerRenderer: headerRenderer,
        overscanRowCount: 1,
        rowHeight: 15,
        rowCount: 20,
        scrollToAlignment: 'auto',
        scrollTop: 0,
        sortBy: 'name',
        sortDirection: SortDirection.ASC,
        tabIndex: null
      };
      var changedProperties = {
        autoHeight: true,
        estimatedRowSize: 10,
        overscanRowCount: 0,
        rowHeight: 10,
        rowCount: 10,
        scrollToAlignment: 'center',
        scrollTop: 1,
        sortBy: 'email',
        sortDirection: SortDirection.DESC,
        tabIndex: 1
      };
      Object.entries(changedProperties).forEach(function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
            key = _ref18[0],
            value = _ref18[1];

        render.unmount(); // Reset

        render(getMarkup(initialProperties));
        headerRendererCalled = true;
        cellRendererCalled = false;
        render(getMarkup(_objectSpread({}, initialProperties, _defineProperty({}, key, value))));
        expect(headerRendererCalled).toEqual(true);
        expect(cellRendererCalled).toEqual(true);
      });
    });
  });
  it('should set the width of the single-column inner Grid to auto', function () {
    var rendered = findDOMNode(render(getMarkup()));
    expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto');
  });
  it('should relay the Grid :parent param to the Column :cellRenderer', function () {
    var cellRenderer = jest.fn().mockReturnValue(null);
    findDOMNode(render(getMarkup({
      cellRenderer: cellRenderer
    })));
    expect(cellRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });
});