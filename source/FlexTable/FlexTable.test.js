import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { Simulate } from 'react-addons-test-utils'
import Immutable from 'immutable'
import FlexColumn from './FlexColumn'
import FlexTable from './FlexTable'
import SortDirection from './SortDirection'

describe('FlexTable', () => {
  const array = []
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: `Name ${i}`,
      email: `user-${i}@treasure-data.com`
    })
  }
  const list = Immutable.fromJS(array)

  // Works with an Immutable List of Maps
  function immutableRowGetter ({ index }) {
    return list.get(index)
  }

  // Works with an Array of Objects
  function vanillaRowGetter ({ index }) {
    return array[index]
  }

  function getMarkup ({
    cellDataGetter,
    cellRenderer,
    cellStyle,
    columnData = { data: 123 },
    disableSort = false,
    headerRenderer,
    maxWidth,
    minWidth,
    ...flexTableProps
  } = {}) {
    return (
      <FlexTable
        headerHeight={20}
        height={100}
        overscanRowCount={0}
        rowCount={list.size}
        rowGetter={immutableRowGetter}
        rowHeight={10}
        width={100}
        {...flexTableProps}
      >
        <FlexColumn
          label='Name'
          dataKey='name'
          columnData={columnData}
          width={50}
          cellRenderer={cellRenderer}
          cellDataGetter={cellDataGetter}
          headerRenderer={headerRenderer}
          disableSort={disableSort}
          style={cellStyle}
        />
        <FlexColumn
          label='Email'
          dataKey='email'
          maxWidth={maxWidth}
          minWidth={minWidth}
          width={50}
        />
        {false}
        {true}
        {null}
        {undefined}
      </FlexTable>
    )
  }

  describe('children', () => {
    it('should accept FlexColumn children', () => {
      const children = [
        <FlexColumn
          dataKey='foo'
          width={100}
        />
      ]
      const result = FlexTable.propTypes.children({ children }, 'children', 'FlexTable')
      expect(result instanceof Error).toEqual(false)
    })

    it('should not accept non-FlexColumn children', () => {
      const children = [
        <div />
      ]
      const result = FlexTable.propTypes.children({ children }, 'children', 'FlexTable')
      expect(result instanceof Error).toEqual(true)
    })

    it('should accept falsy children to allow easier dynamic showing/hiding of columns', () => {
      const children = [
        false,
        <FlexColumn
          dataKey='foo'
          width={100}
        />,
        null
      ]
      const result = FlexTable.propTypes.children({ children }, 'children', 'FlexTable')
      expect(result instanceof Error).toEqual(false)
    })
  })

  describe('initial rendering', () => {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    const useImmutable = [true, false]
    useImmutable.forEach(useImmutable => {
      it('should render the correct number of rows', () => {
        const rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })))
        // 100px height should fit 1 header (20px) and 8 rows (10px each) -
        expect(rendered.querySelectorAll('.FlexTable__headerRow').length).toEqual(1)
        expect(rendered.querySelectorAll('.FlexTable__row').length).toEqual(8)
      })

      it('should render the expected headers', () => {
        const rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })))
        const columns = rendered.querySelectorAll('.FlexTable__headerColumn')
        expect(columns.length).toEqual(2)
        expect(columns[0].textContent).toEqual('Name')
        expect(columns[1].textContent).toEqual('Email')
      })

      it('should render the expected rows and columns', () => {
        const rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
          headerHeight: 10,
          rowHeight: 20,
          height: 50
        })))
        const rows = rendered.querySelectorAll('.FlexTable__row')
        expect(rows.length).toEqual(2)
        Array.from(rows).forEach((row, index) => {
          let rowData = list.get(index)
          let columns = row.querySelectorAll('.FlexTable__rowColumn')
          expect(columns.length).toEqual(2)
          expect(columns[0].textContent).toEqual(rowData.get('name'))
          expect(columns[1].textContent).toEqual(rowData.get('email'))
        })
      })
    })

    it('should support a :rowHeight function', () => {
      const rowHeight = ({ index }) => 10 + index * 10
      const rendered = findDOMNode(render(getMarkup({
        rowHeight,
        rowCount: 3
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Array.from(rows).forEach((row, index) => {
        expect(Number.parseInt(row.style.height, 10)).toEqual(rowHeight({ index }))
      })
    })

    it('should support :minWidth and :maxWidth values for a column', () => {
      const rendered = findDOMNode(render(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowCount: 1
      })))
      const columns = rendered.querySelectorAll('.FlexTable__rowColumn')
      const emailColumn = columns[1]
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75)
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25)
    })
  })

  describe('measureAllRows', () => {
    it('should measure any unmeasured rows', () => {
      const rendered = render(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: () => 20,
        width: 0
      }))
      expect(rendered._grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150)
      rendered.measureAllRows()
      expect(rendered._grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200)
    })
  })

  describe('recomputeRowHeights', () => {
    it('should recompute row heights and other values when called', () => {
      const indices = []
      const rowHeight = ({ index }) => {
        indices.push(index)
        return 10
      }
      const component = render(getMarkup({
        rowHeight,
        rowCount: 50
      }))

      indices.splice(0)
      component.recomputeRowHeights()

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0)
      expect(indices[indices.length - 1]).toEqual(7)

      indices.splice(0)
      component.recomputeRowHeights(4)

      expect(indices[0]).toEqual(4)
      expect(indices[indices.length - 1]).toEqual(7)
    })
  })

  describe('forceUpdateGrid', () => {
    it('should refresh inner Grid content when called', () => {
      let marker = 'a'
      function cellRenderer ({ cellData, columnData, dataKey, rowData, rowIndex }) {
        return `${rowIndex}${marker}`
      }
      const component = render(getMarkup({ cellRenderer }))
      const node = findDOMNode(component)
      expect(node.textContent).toContain('1a')
      marker = 'b'
      component.forceUpdateGrid()
      expect(node.textContent).toContain('1b')
    })
  })

  describe('custom getter functions', () => {
    it('should use a custom cellDataGetter if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellDataGetter: ({ columnData, dataKey, rowData }) => `Custom ${dataKey} for row ${rowData.get('id')}`
      })))
      const nameColumns = rendered.querySelectorAll('.FlexTable__rowColumn:first-of-type')
      Array.from(nameColumns).forEach((nameColumn, index) => {
        expect(nameColumn.textContent).toEqual(`Custom name for row ${index}`)
      })
    })

    it('should use a custom cellRenderer if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: ({ cellData, columnData, dataKey, rowData, rowIndex }) => `Custom ${cellData}`
      })))
      const nameColumns = rendered.querySelectorAll('.FlexTable__rowColumn:first-of-type')
      Array.from(nameColumns).forEach((nameColumn, index) => {
        let rowData = list.get(index)
        expect(nameColumn.textContent).toEqual(`Custom ${rowData.get('name')}`)
      })
    })

    it('should set the rendered cell content as the cell :title if it is a string', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: ({ cellData, columnData, dataKey, rowData, rowIndex }) => 'Custom'
      })))
      const nameColumn = rendered.querySelector('.FlexTable__rowColumn:first-of-type')
      expect(nameColumn.getAttribute('title')).toContain('Custom')
    })

    it('should not set a cell :title if the rendered cell content is not a string', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: ({ cellData, columnData, dataKey, rowData, rowIndex }) => <div>Custom</div>
      })))
      const nameColumn = rendered.querySelector('.FlexTable__rowColumn:first-of-type')
      expect(nameColumn.getAttribute('title')).toEqual(null)
    })
  })

  describe('sorting', () => {
    it('should not render sort indicators if no sort function is provided', () => {
      const rendered = findDOMNode(render(getMarkup()))
      const nameColumn = rendered.querySelectorAll('.FlexTable__headerColumn:first-of-type')

      expect(nameColumn.className).not.toContain('FlexTable__sortableHeaderColumn')
    })

    it('should not render sort indicators for non-sortable columns', () => {
      const rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        sort: () => {}
      })))
      const nameColumn = rendered.querySelectorAll('.FlexTable__headerColumn:first-of-type')

      expect(nameColumn.className).not.toContain('FlexTable__sortableHeaderColumn')
      expect(rendered.querySelectorAll('.FlexTable__sortableHeaderColumn').length).toEqual(1) // Email only
    })

    it('should render sortable column headers as sortable', () => {
      const rendered = findDOMNode(render(getMarkup({
        sort: () => {}
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      expect(nameColumn.className).toContain('FlexTable__sortableHeaderColumn')
      expect(rendered.querySelectorAll('.FlexTable__sortableHeaderColumn').length).toEqual(2) // Email and Name
    })

    it('should render the correct sort indicator by the current sort-by column', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC]
      sortDirections.forEach(sortDirection => {
        const rendered = findDOMNode(render(getMarkup({
          sort: () => {},
          sortBy: 'name',
          sortDirection
        })))
        const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

        expect(nameColumn.querySelector('.FlexTable__sortableHeaderIcon')).not.toEqual(null)
        expect(nameColumn.querySelector(`.FlexTable__sortableHeaderIcon--${sortDirection}`)).not.toEqual(null)
      })
    })

    it('should call sort with the correct arguments when the current sort-by column header is clicked', () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC]
      sortDirections.forEach(sortDirection => {
        const sortCalls = []
        const rendered = findDOMNode(render(getMarkup({
          sort: ({ sortBy, sortDirection }) => sortCalls.push({ sortBy, sortDirection }),
          sortBy: 'name',
          sortDirection
        })))
        const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

        Simulate.click(nameColumn)
        expect(sortCalls.length).toEqual(1)

        const { sortBy, sortDirection: newSortDirection } = sortCalls[0]
        const expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
        expect(sortBy).toEqual('name')
        expect(newSortDirection).toEqual(expectedSortDirection)
      })
    })

    it('should call sort with the correct arguments when a new sort-by column header is clicked', () => {
      const sortCalls = []
      const rendered = findDOMNode(render(getMarkup({
        sort: ({ sortBy, sortDirection }) => sortCalls.push({ sortBy, sortDirection }),
        sortBy: 'email',
        sortDirection: SortDirection.ASC
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)
      expect(sortCalls.length).toEqual(1)

      const {sortBy, sortDirection} = sortCalls[0]
      expect(sortBy).toEqual('name')
      expect(sortDirection).toEqual(SortDirection.ASC)
    })

    it('should call sort when a column header is activated via ENTER or SPACE key', () => {
      const sortCalls = []
      const rendered = findDOMNode(render(getMarkup({
        sort: ({ sortBy, sortDirection }) => sortCalls.push({ sortBy, sortDirection }),
        sortBy: 'name'
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')
      expect(sortCalls.length).toEqual(0)
      Simulate.keyDown(nameColumn, {key: ' '})
      expect(sortCalls.length).toEqual(1)
      Simulate.keyDown(nameColumn, {key: 'Enter'})
      expect(sortCalls.length).toEqual(2)
      Simulate.keyDown(nameColumn, {key: 'F'})
      expect(sortCalls.length).toEqual(2)
    })
  })

  describe('headerRenderer', () => {
    it('should render a custom header if one is provided', () => {
      const columnData = { foo: 'foo', bar: 'bar' }
      const headerRendererCalls = []
      const rendered = findDOMNode(render(getMarkup({
        columnData,
        headerRenderer: (params) => {
          headerRendererCalls.push(params)
          return 'custom header'
        },
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      expect(nameColumn.textContent).toContain('custom header')
      expect(headerRendererCalls.length).toBeTruthy()

      const headerRendererCall = headerRendererCalls[0]
      expect(headerRendererCall.columnData).toEqual(columnData)
      expect(headerRendererCall.dataKey).toEqual('name')
      expect(headerRendererCall.disableSort).toEqual(false)
      expect(headerRendererCall.label).toEqual('Name')
      expect(headerRendererCall.sortBy).toEqual('name')
      expect(headerRendererCall.sortDirection).toEqual(SortDirection.ASC)
    })

    it('should honor sort for custom headers', () => {
      const sortCalls = []
      const rendered = findDOMNode(render(getMarkup({
        headerRenderer: (params) => 'custom header',
        sort: ({ sortBy, sortDirection }) => sortCalls.push([sortBy, sortDirection]),
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)

      expect(sortCalls.length).toEqual(1)
      const sortCall = sortCalls[0]
      expect(sortCall[0]).toEqual('name')
      expect(sortCall[1]).toEqual(SortDirection.DESC)
    })

    it('should honor :onHeaderClick for custom header', () => {
      const columnData = { foo: 'foo', bar: 'bar' }
      const onHeaderClickCalls = []
      const rendered = findDOMNode(render(getMarkup({
        columnData,
        headerRenderer: (params) => 'custom header',
        onHeaderClick: ({ columnData, dataKey }) => onHeaderClickCalls.push([dataKey, columnData])
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)

      expect(onHeaderClickCalls.length).toEqual(1)
      const onHeaderClickCall = onHeaderClickCalls[0]
      expect(onHeaderClickCall[0]).toEqual('name')
      expect(onHeaderClickCall[1]).toEqual(columnData)
    })
  })

  describe('noRowsRenderer', () => {
    it('should call :noRowsRenderer if :rowCount is 0', () => {
      const rendered = render(getMarkup({
        noRowsRenderer: () => <div>No rows!</div>,
        rowCount: 0
      }))
      const bodyDOMNode = findDOMNode(rendered._grid)
      expect(bodyDOMNode.textContent).toEqual('No rows!')
    })

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', () => {
      const rendered = render(getMarkup({
        rowCount: 0
      }))
      const bodyDOMNode = findDOMNode(rendered._grid)
      expect(bodyDOMNode.textContent).toEqual('')
    })
  })

  describe('onHeaderClick', () => {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', () => {
      let onHeaderClickCalls = []
      const rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        onHeaderClick: ({ columnData, dataKey }) => onHeaderClickCalls.push({dataKey, columnData})
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)
      expect(onHeaderClickCalls.length).toEqual(1)
      expect(onHeaderClickCalls[0].dataKey).toEqual('name')
      expect(onHeaderClickCalls[0].columnData.data).toEqual(123)
    })

    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', () => {
      let onHeaderClickCalls = []
      const rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        onHeaderClick: ({ columnData, dataKey }) => onHeaderClickCalls.push({dataKey, columnData})
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)
      expect(onHeaderClickCalls.length).toEqual(1)
      expect(onHeaderClickCalls[0].dataKey).toEqual('name')
      expect(onHeaderClickCalls[0].columnData.data).toEqual(123)
    })
  })

  describe('onRowClick', () => {
    it('should call :onRowClick with the correct :rowIndex when a row is clicked', () => {
      const onRowClickCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowClick: ({ index }) => onRowClickCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      expect(onRowClickCalls).toEqual([0, 3])
    })
  })

  describe('onRowMouseOver/Out', () => {
    it('should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows', () => {
      let onRowMouseOverCalls = []
      let onRowMouseOutCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowMouseOver: ({ index }) => onRowMouseOverCalls.push(index),
        onRowMouseOut: ({ index }) => onRowMouseOutCalls.push(index)
      })))

      const simulateMouseOver = (from, to) => {
        Simulate.mouseOut(from, { relatedTarget: to })
        Simulate.mouseOver(to, { relatedTarget: from })
      }

      const rows = rendered.querySelectorAll('.FlexTable__row')
      simulateMouseOver(rows[0], rows[1])
      simulateMouseOver(rows[1], rows[2])
      simulateMouseOver(rows[2], rows[3])
      expect(onRowMouseOverCalls).toEqual([1, 2, 3])
      expect(onRowMouseOutCalls).toEqual([0, 1, 2])
    })
  })

  describe('rowClassName', () => {
    it('should render a static classname given :rowClassName as a string', () => {
      const staticClassName = 'staticClass'
      const rendered = findDOMNode(render(getMarkup({
        rowClassName: staticClassName
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Array.from(rows).forEach((row, index) => {
        expect(row.className).toContain(staticClassName)
      })
    })

    it('should render dynamic classname given :rowClassName as a function', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowClassName: ({ index }) => index % 2 === 0 ? 'even' : 'odd'
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.className).toContain('even')
          expect(row.className).not.toContain('odd')
        } else {
          expect(row.className).toContain('odd')
          expect(row.className).not.toContain('even')
        }
      })
    })
  })

  describe('onRowsRendered', () => {
    it('should call :onRowsRendered at least one row is rendered', () => {
      let startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      }))
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
    })

    it('should not call :onRowsRendered unless the start or stop indices have changed', () => {
      let numCalls = 0
      let startIndex
      let stopIndex
      const onRowsRendered = params => {
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
      render(getMarkup({ onRowsRendered }))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
      render(getMarkup({ onRowsRendered }))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
    })

    it('should call :onRowsRendered if the start or stop indices have changed', () => {
      let numCalls = 0
      let startIndex
      let stopIndex
      const onRowsRendered = params => {
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
      render(getMarkup({ onRowsRendered }))
      expect(numCalls).toEqual(1)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
      render(getMarkup({
        height: 50,
        onRowsRendered
      }))
      expect(numCalls).toEqual(2)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(2)
    })

    it('should not call :onRowsRendered if no rows are rendered', () => {
      let startIndex, stopIndex
      render(getMarkup({
        height: 0,
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      }))
      expect(startIndex).toEqual(undefined)
      expect(stopIndex).toEqual(undefined)
    })
  })

  describe(':scrollTop property', () => {
    it('should render correctly when an initial :scrollTop property is specified', () => {
      let startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params),
        scrollTop: 80
      }))
      expect(startIndex).toEqual(8)
      expect(stopIndex).toEqual(15)
    })

    it('should render correctly when :scrollTop property is updated', () => {
      let startIndex, stopIndex

      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params)
      }))
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)

      render(getMarkup({
        onRowsRendered: params => ({ startIndex, stopIndex } = params),
        scrollTop: 80
      }))
      expect(startIndex).toEqual(8)
      expect(stopIndex).toEqual(15)
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const node = findDOMNode(render(getMarkup({
        sort: () => {},
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })))
      expect(node.className).toEqual('FlexTable')
      expect(node.querySelector('.FlexTable__headerRow')).toBeTruthy()
      expect(node.querySelector('.FlexTable__rowColumn')).toBeTruthy()
      expect(node.querySelector('.FlexTable__headerColumn')).toBeTruthy()
      expect(node.querySelector('.FlexTable__row')).toBeTruthy()
      expect(node.querySelector('.FlexTable__sortableHeaderColumn')).toBeTruthy()
      expect(node.querySelector('.FlexTable__sortableHeaderIcon')).toBeTruthy()
    })

    it('should use a custom :className if specified', () => {
      const node = findDOMNode(render(getMarkup({
        className: 'foo',
        headerClassName: 'bar',
        rowClassName: 'baz'
      })))
      expect(node.className).toContain('foo')
      expect(node.querySelectorAll('.bar').length).toEqual(2)
      expect(node.querySelectorAll('.baz').length).toEqual(9)
    })

    it('should use custom :styles if specified', () => {
      const cellStyle = { backgroundColor: 'red' }
      const headerStyle = { backgroundColor: 'blue' }
      const rowStyle = { backgroundColor: 'green' }
      const style = { backgroundColor: 'orange' }
      const node = findDOMNode(render(getMarkup({
        cellStyle,
        headerStyle,
        rowStyle,
        style
      })))
      expect(node.querySelector('.FlexTable__rowColumn').style.backgroundColor).toEqual('red')
      expect(node.querySelector('.FlexTable__headerColumn').style.backgroundColor).toEqual('blue')
      expect(node.querySelector('.FlexTable__row').style.backgroundColor).toEqual('green')
      expect(node.style.backgroundColor).toEqual('orange')
    })

    it('should render dynamic style given :rowStyle as a function', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowStyle: ({ index }) => index % 2 === 0
          ? { backgroundColor: 'red' }
          : { backgroundColor: 'green' }
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual('red')
        } else {
          expect(row.style.backgroundColor).toEqual('green')
        }
      })
    })

    it('should use the expected global CSS classNames for rows', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.className === 'Grid__cell')
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :rowWrapperClassName if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1,
        rowWrapperClassName: 'foo'
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.classList.contains('foo'))
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :rowWrapperClassName if function specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 3,
        columnCount: 1,
        rowWrapperClassName: () => 'foo'
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.classList.contains('foo'))
      expect(rows.length).toEqual(3)
      expect(rows).toEqual([true, true, true])
    })

    it('should use a custom :rowWrapperClassName indexes', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowCount: 2,
        columnCount: 2,
        rowWrapperClassName: ({index}) => `row-${index}`
      })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const rows = Array.from(cells).map(row => row.className.split(' ')[1])
      expect(rows.length).toEqual(2)
      expect(rows).toEqual(['row--1', 'row-0'])
    })

    it('should use a custom :rowWrapperStyle if specified', () => {
      const rowWrapperStyle = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ rowWrapperStyle })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const result = Array.from(cells).map(el => el.style.backgroundColor)
      expect(result).toEqual((new Array(cells.length)).fill('red'))
    })

    it('should use a custom :rowWrapperStyle if function specified', () => {
      const rowWrapperStyle = () => { return { backgroundColor: 'red' } }
      const rendered = findDOMNode(render(getMarkup({ rowWrapperStyle })))
      const cells = rendered.querySelectorAll('.Grid__cell')
      const result = Array.from(cells).map(el => el.style.backgroundColor)
      expect(result).toEqual((new Array(cells.length)).fill('red'))
    })

    it('should pass :gridClassName and :gridStyle to the inner Grid', () => {
      const rendered = findDOMNode(render(getMarkup({
        gridClassName: 'foo',
        gridStyle: { backgroundColor: 'red' }
      })))
      const grid = rendered.querySelector('.Grid')
      expect(grid.className).toContain('foo')
      expect(grid.style.backgroundColor).toEqual('red')
    })
  })

  describe('overscanRowCount', () => {
    it('should not overscan by default', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params)
      }))
      expect(overscanStartIndex).toEqual(startIndex)
      expect(overscanStopIndex).toEqual(stopIndex)
    })

    it('should overscan the specified amount', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10,
        scrollToIndex: 30
      }))
      expect(overscanStartIndex).toEqual(13)
      expect(startIndex).toEqual(23)
      expect(stopIndex).toEqual(30)
      expect(overscanStopIndex).toEqual(40)
    })

    it('should not overscan beyond the start of the list', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10
      }))
      expect(overscanStartIndex).toEqual(0)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
      expect(overscanStopIndex).toEqual(17)
    })

    it('should not overscan beyond the end of the list', () => {
      let overscanStartIndex, overscanStopIndex, startIndex, stopIndex
      render(getMarkup({
        onRowsRendered: params => ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = params),
        overscanRowCount: 10,
        rowCount: 15
      }))
      expect(overscanStartIndex).toEqual(0)
      expect(startIndex).toEqual(0)
      expect(stopIndex).toEqual(7)
      expect(overscanStopIndex).toEqual(14)
    })
  })

  describe('onScroll', () => {
    it('should trigger callback when component initially mounts', () => {
      const onScrollCalls = []
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      expect(onScrollCalls).toEqual([{
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 0
      }])
    })

    it('should trigger callback when component scrolls', () => {
      const onScrollCalls = []
      const rendered = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      const target = {
        scrollTop: 100
      }
      rendered._grid._scrollingContainer = target // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered._grid), { target })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100
      })
    })
  })

  describe('a11y properties', () => {
    it('should attach a11y properties to a row if :onRowClick is specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        onRowClick: () => {}
      })))
      const row = rendered.querySelector('.FlexTable__row')
      expect(row.getAttribute('aria-label')).toEqual('row')
      expect(row.getAttribute('role')).toEqual('row')
      expect(row.tabIndex).toEqual(0)
    })

    it('should not attach a11y properties to a row if no :onRowClick is specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        onRowClick: null
      })))
      const row = rendered.querySelector('.FlexTable__row')
      expect(row.getAttribute('aria-label')).toEqual(null)
      expect(row.getAttribute('role')).toEqual(null)
      expect(row.tabIndex).toEqual(-1)
    })

    it('should attach a11y properties to a header column if sort is enabled', () => {
      const rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        sort: () => {}
      })))
      const row = rendered.querySelector('.FlexTable__headerColumn')
      expect(row.getAttribute('aria-label')).toEqual('Name')
      expect(row.getAttribute('role')).toEqual('rowheader')
      expect(row.tabIndex).toEqual(0)
    })

    it('should not attach a11y properties to a header column if sort is not enabled', () => {
      const rendered = findDOMNode(render(getMarkup({
        disableSort: true
      })))
      const row = rendered.querySelector('.FlexTable__headerColumn')
      expect(row.getAttribute('aria-label')).toEqual(null)
      expect(row.getAttribute('role')).toEqual(null)
      expect(row.tabIndex).toEqual(-1)
    })
  })

  describe('tabIndex', () => {
    it('should be focusable by default', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.querySelector('.Grid').tabIndex).toEqual(0)
    })

    it('should allow tabIndex to be overridden', () => {
      const rendered = findDOMNode(render(getMarkup({
        tabIndex: -1
      })))
      expect(rendered.querySelector('.Grid').tabIndex).toEqual(-1)
    })
  })

  describe('pure', () => {
    it('should not re-render unless props have changed', () => {
      let headerRendererCalled = false
      let cellRendererCalled = false
      function headerRenderer () {
        headerRendererCalled = true
        return 'foo'
      }
      function cellRenderer () {
        cellRendererCalled = true
        return 'foo'
      }
      const markup = getMarkup({
        headerRenderer,
        cellRenderer
      })
      render(markup)
      expect(headerRendererCalled).toEqual(true)
      expect(cellRendererCalled).toEqual(true)
      headerRendererCalled = false
      cellRendererCalled = false
      render(markup)
      expect(headerRendererCalled).toEqual(false)
      expect(cellRendererCalled).toEqual(false)
    })

    it('should re-render both the FlexTable and the inner Grid whenever an external property changes', () => {
      let headerRendererCalled = false
      let cellRendererCalled = false
      function headerRenderer () {
        headerRendererCalled = true
        return 'foo'
      }
      function cellRenderer () {
        cellRendererCalled = true
        return 'foo'
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
        tabIndex: null
      }
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
        tabIndex: 1
      }
      Object.entries(changedProperties).forEach(([key, value]) => {
        render.unmount() // Reset
        render(getMarkup(initialProperties))
        headerRendererCalled = true
        cellRendererCalled = false
        render(getMarkup({
          ...initialProperties,
          [key]: value
        }))
        expect(headerRendererCalled).toEqual(true)
        expect(cellRendererCalled).toEqual(true)
      })
    })
  })
})
