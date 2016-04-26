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
  function immutableRowGetter (index) {
    return list.get(index)
  }

  // Works with an Array of Objects
  function vanillaRowGetter (index) {
    return array[index]
  }

  function getMarkup ({
    cellRenderer,
    cellDataGetter,
    className,
    columnData = { data: 123 },
    disableSort = false,
    headerClassName,
    headerHeight = 20,
    headerRenderer = undefined,
    height = 100,
    maxWidth = undefined,
    minWidth = undefined,
    noRowsRenderer = undefined,
    onHeaderClick = undefined,
    onRowClick = undefined,
    onRowsRendered = undefined,
    onScroll = undefined,
    overscanRowsCount = 0,
    rowClassName = undefined,
    rowGetter = immutableRowGetter,
    rowHeight = 10,
    rowsCount = list.size,
    scrollToIndex,
    scrollTop,
    sort,
    sortBy,
    sortDirection,
    style,
    width = 100
  } = {}) {
    return (
      <FlexTable
        className={className}
        headerClassName={headerClassName}
        headerHeight={headerHeight}
        height={height}
        noRowsRenderer={noRowsRenderer}
        onHeaderClick={onHeaderClick}
        onRowClick={onRowClick}
        onRowsRendered={onRowsRendered}
        onScroll={onScroll}
        overscanRowsCount={overscanRowsCount}
        rowClassName={rowClassName}
        rowGetter={rowGetter}
        rowHeight={rowHeight}
        rowsCount={rowsCount}
        scrollToIndex={scrollToIndex}
        scrollTop={scrollTop}
        sort={sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        width={width}
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
        />
        <FlexColumn
          label='Email'
          dataKey='email'
          maxWidth={maxWidth}
          minWidth={minWidth}
          style={style}
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
        <div/>
      ]
      const result = FlexTable.propTypes.children({ children }, 'children', 'FlexTable')
      expect(result instanceof Error).toEqual(true)
    })

    it('should accept falsy children to allow easier dyanmic showing/hiding of columns', () => {
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
      const rowHeight = (index) => 10 + index * 10
      const rendered = findDOMNode(render(getMarkup({
        rowHeight,
        rowsCount: 3
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Array.from(rows).forEach((row, index) => {
        expect(Number.parseInt(row.style.height, 10)).toEqual(rowHeight(index))
      })
    })

    it('should support :minWidth and :maxWidth values for a column', () => {
      const rendered = findDOMNode(render(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowsCount: 1
      })))
      const columns = rendered.querySelectorAll('.FlexTable__rowColumn')
      const emailColumn = columns[1]
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75)
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25)
    })

    it('should support a :style value for a column', () => {
      const rendered = findDOMNode(render(getMarkup({
        rowsCount: 1,
        style: {
          backgroundColor: 'blue'
        }
      })))
      const columns = rendered.querySelectorAll('.FlexTable__rowColumn')
      const emailColumn = columns[1]
      expect(emailColumn.style.backgroundColor).toEqual('blue')
    })

    it('should prioritize calculated styles over user-specified styles', () => {
      const rendered = findDOMNode(render(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowsCount: 1,
        style: {
          backgroundColor: 'blue',
          maxWidth: 2400,
          minWidth: 10
        }
      })))
      const columns = rendered.querySelectorAll('.FlexTable__rowColumn')
      const emailColumn = columns[1]
      expect(emailColumn.style.backgroundColor).toEqual('blue')
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75)
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25)
    })
  })

  describe('recomputeRowHeights', () => {
    it('should recompute row heights and other values when called', () => {
      let highestRowIndex = 0
      const rowHeight = (index) => {
        highestRowIndex = Math.max(index, highestRowIndex)
        return 10
      }
      const component = render(getMarkup({
        rowHeight,
        rowsCount: 50
      }))
      highestRowIndex = 0
      component.recomputeRowHeights()
      expect(highestRowIndex).toEqual(49)
    })
  })

  describe('custom getter functions', () => {
    it('should use a custom cellDataGetter if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellDataGetter: (dataKey, rowData, columnData) => `Custom ${dataKey} for row ${rowData.get('id')}`
      })))
      const nameColumns = rendered.querySelectorAll('.FlexTable__rowColumn:first-of-type')
      Array.from(nameColumns).forEach((nameColumn, index) => {
        expect(nameColumn.textContent).toEqual(`Custom name for row ${index}`)
      })
    })

    it('should use a custom cellRenderer if specified', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => `Custom ${cellData}`
      })))
      const nameColumns = rendered.querySelectorAll('.FlexTable__rowColumn:first-of-type')
      Array.from(nameColumns).forEach((nameColumn, index) => {
        let rowData = list.get(index)
        expect(nameColumn.textContent).toEqual(`Custom ${rowData.get('name')}`)
      })
    })

    it('should set the rendered cell content as the cell :title if it is a string', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => 'Custom'
      })))
      const nameColumn = rendered.querySelector('.FlexTable__rowColumn:first-of-type')
      expect(nameColumn.children[0].getAttribute('title')).toContain('Custom')
    })

    it('should not set a cell :title if the rendered cell content is not a string', () => {
      const rendered = findDOMNode(render(getMarkup({
        cellRenderer: (cellData, dataKey, rowData, rowIndex, columnData) => <div>Custom</div>
      })))
      const nameColumn = rendered.querySelector('.FlexTable__rowColumn:first-of-type')
      expect(nameColumn.children[0].getAttribute('title')).toEqual(null)
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
          sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
          sortBy: 'name',
          sortDirection
        })))
        const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

        Simulate.click(nameColumn)
        expect(sortCalls.length).toEqual(1)

        const {dataKey, newSortDirection} = sortCalls[0]
        const expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
        expect(dataKey).toEqual('name')
        expect(newSortDirection).toEqual(expectedSortDirection)
      })
    })

    it('should call sort with the correct arguments when a new sort-by column header is clicked', () => {
      const sortCalls = []
      const rendered = findDOMNode(render(getMarkup({
        sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
        sortBy: 'email',
        sortDirection: SortDirection.ASC
      })))
      const nameColumn = rendered.querySelector('.FlexTable__headerColumn:first-of-type')

      Simulate.click(nameColumn)
      expect(sortCalls.length).toEqual(1)

      const {dataKey, newSortDirection} = sortCalls[0]
      expect(dataKey).toEqual('name')
      expect(newSortDirection).toEqual(SortDirection.ASC)
    })

    it('should call sort when a column header is activated via ENTER or SPACE key', () => {
      const sortCalls = []
      const rendered = findDOMNode(render(getMarkup({
        sort: (dataKey, newSortDirection) => sortCalls.push({dataKey, newSortDirection}),
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
        sort: (sortKey, sortDirection) => sortCalls.push([sortKey, sortDirection]),
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
        onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push([dataKey, columnData])
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
    it('should call :noRowsRenderer if :rowsCount is 0', () => {
      const rendered = render(getMarkup({
        noRowsRenderer: () => <div>No rows!</div>,
        rowsCount: 0
      }))
      const bodyDOMNode = findDOMNode(rendered.refs.Grid)
      expect(bodyDOMNode.textContent).toEqual('No rows!')
    })

    it('should render an empty body if :rowsCount is 0 and there is no :noRowsRenderer', () => {
      const rendered = render(getMarkup({
        rowsCount: 0
      }))
      const bodyDOMNode = findDOMNode(rendered.refs.Grid)
      expect(bodyDOMNode.textContent).toEqual('')
    })
  })

  describe('onHeaderClick', () => {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', () => {
      let onHeaderClickCalls = []
      const rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push({dataKey, columnData})
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
        onHeaderClick: (dataKey, columnData) => onHeaderClickCalls.push({dataKey, columnData})
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
        onRowClick: index => onRowClickCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      expect(onRowClickCalls).toEqual([0, 3])
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
        rowClassName: rowIndex => rowIndex % 2 === 0 ? 'even' : 'odd'
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
      expect(node.querySelector('.FlexTable__truncatedColumnText')).toBeTruthy()
      expect(node.querySelector('.FlexTable__headerColumn')).toBeTruthy()
      expect(node.querySelector('.FlexTable__headerTruncatedText')).toBeTruthy()
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
  })

  describe('overscanRowsCount', () => {
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
        overscanRowsCount: 10,
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
        overscanRowsCount: 10
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
        overscanRowsCount: 10,
        rowsCount: 15
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
      rendered.refs.Grid.refs.scrollingContainer = target // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered.refs.Grid), { target })
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
})
