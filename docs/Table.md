## Table

Table component with fixed headers and windowed rows for improved performance with large data sets.
This component expects explicit `width` and `height` parameters.
`Table` content can scroll vertically but it is not meant to scroll horizontally.

### Prop Types

| Property          | Type                              | Required? | Description                                                                                                                                                                                                                                                                                               |
| :---------------- | :-------------------------------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoHeight        | Boolean                           |           | Outer `height` of `Table` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC.                                                                                                                                                                               |
| children          | [Column](Column.md)               |     ✓     | One or more Columns describing the data displayed in this table                                                                                                                                                                                                                                           |
| className         | String                            |           | Optional custom CSS class name to attach to root `Table` element.                                                                                                                                                                                                                                         |
| disableHeader     | Boolean                           |           | Do not render the table header (only the rows)                                                                                                                                                                                                                                                            |
| estimatedRowSize  | Number                            |           | Used to estimate the total height of a `Table` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered.                                                                                                                                           |
| gridClassName     | String                            |           | Optional custom CSS class name to attach to inner Grid element                                                                                                                                                                                                                                            |
| gridStyle         | Object                            |           | Optional inline style to attach to inner Grid element                                                                                                                                                                                                                                                     |
| headerClassName   | String                            |           | CSS class to apply to all column headers                                                                                                                                                                                                                                                                  |
| headerHeight      | Number                            |     ✓     | Fixed height of header row                                                                                                                                                                                                                                                                                |
| headerRowRenderer | Function                          |           | Responsible for rendering the table header row given an array of columns. [Learn more](#headerrowrenderer)                                                                                                                                                                                                |
| headerStyle       | Object                            |           | Optional custom inline style to attach to table header columns.                                                                                                                                                                                                                                           |
| height            | Number                            |     ✓     | Fixed/available height for out DOM element                                                                                                                                                                                                                                                                |
| id                | String                            |           | Optional custom id to attach to root `Table` element.                                                                                                                                                                                                                                                     |
| noRowsRenderer    | Function                          |           | Callback used to render placeholder content when :rowCount is 0                                                                                                                                                                                                                                           |
| onColumnClick     | Function                          |           | Callback invoked when a user clicks on a table column. `({ columnData: any, dataKey: string, event: Event }): void`                                                                                                                                                                                       |
| onHeaderClick     | Function                          |           | Callback invoked when a user clicks on a table header. `({ columnData: any, dataKey: string, event: Event }): void`                                                                                                                                                                                       |
| onRowClick        | Function                          |           | Callback invoked when a user clicks on a table row. `({ event: Event, index: number, rowData: any }): void`                                                                                                                                                                                               |
| onRowDoubleClick  | Function                          |           | Callback invoked when a user double-clicks on a table row. `({ event: Event, index: number, rowData: any }): void`                                                                                                                                                                                        |
| onRowMouseOut     | Function                          |           | Callback invoked when the mouse leaves a table row. `({ event: Event, index: number, rowData: any }): void`                                                                                                                                                                                               |
| onRowMouseOver    | Function                          |           | Callback invoked when a user moves the mouse over a table row. `({ event: Event, index: number, rowData: any }): void`                                                                                                                                                                                    |
| onRowRightClick   | Function                          |           | Callback invoked when a user right-clicks on a table row. `({ event: Event, index: number, rowData: any }): void`                                                                                                                                                                                         |
| onRowsRendered    | Function                          |           | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void`                                                                                                             |
| overscanRowCount  | Number                            |           | Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browsers/devices. See [here](overscanUsage.md) for an important note about this property.                                                                                |
| onScroll          | Function                          |           | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`                                                                                                                                       |
| rowClassName      | String or Function                |           | CSS class to apply to all table rows (including the header row). This value may be either a static string or a function with the signature `({ index: number }): string`. Note that for the header row an index of `-1` is provided.                                                                      |
| rowCount          | Number                            |     ✓     | Number of rows in table.                                                                                                                                                                                                                                                                                  |
| rowGetter         | Function                          |     ✓     | Callback responsible for returning a data row given an index. `({ index: int }): any`                                                                                                                                                                                                                     |
| rowHeight         | Number or Function                |     ✓     | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`                                                                                                                                                                          |
| rowRenderer       | Function                          |           | Responsible for rendering a table row given an array of columns. [Learn more](#rowrenderer)                                                                                                                                                                                                               |
| rowStyle          | Object or Function                |           | Optional custom inline style to attach to table rows. This value may be either a style object or a function with the signature `({ index: number }): Object`. Note that for the header row an index of `-1` is provided.                                                                                  |
| scrollToAlignment | String                            |           | Controls the alignment scrolled-to-rows. The default ("_auto_") scrolls the least amount possible to ensure that the specified row is fully visible. Use "_start_" to always align rows to the top of the list and "_end_" to align them bottom. Use "_center_" to align them in the middle of container. |
| scrollToIndex     | Number                            |           | Row index to ensure visible (by forcefully scrolling if necessary)                                                                                                                                                                                                                                        |
| scrollTop         | Number                            |           | Vertical offset                                                                                                                                                                                                                                                                                           |
| sort              | Function                          |           | Sort function to be called if a sortable header is clicked. `({ defaultSortDirection: string, event: MouseEvent, sortBy: string, sortDirection: SortDirection }): void`                                                                                                                                   |
| sortBy            | String                            |           | Data is currently sorted by this `dataKey` (if it is sorted at all)                                                                                                                                                                                                                                       |
| sortDirection     | [SortDirection](SortDirection.md) |           | Data is currently sorted in this direction (if it is sorted at all)                                                                                                                                                                                                                                       |
| style             | Object                            |           | Optional custom inline style to attach to root `Table` element.                                                                                                                                                                                                                                           |
| tabIndex          | Number                            |           | Optional override of inner `Grid` tab index default; defaults to `0`.                                                                                                                                                                                                                                     |
| width             | Number                            |     ✓     | Width of the table                                                                                                                                                                                                                                                                                        |

### Public Methods

##### forceUpdateGrid

Forcefully re-render the inner `Grid` component.

Calling `forceUpdate` on `Table` may not re-render the inner `Grid` since it uses `shallowCompare` as a performance optimization.
Use this method if you want to manually trigger a re-render.
This may be appropriate if the underlying row data has changed but the row sizes themselves have not.

##### getOffsetForRow ({ alignment: ?string, index: ?number })

Gets offset for a given row and alignment.

##### getScrollbarWidth

Gets the scrollbar width used to pad the table-header.

##### measureAllRows

Pre-measure all rows in a `Table`.

Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

##### recomputeRowHeights (index: number)

Recompute row heights and offsets after the specified index (defaults to 0).

`Table` has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property.
If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone.
In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered table.

##### scrollToPosition (scrollTop: number)

Scroll to the specified offset.
Useful for animating position changes.

##### scrollToRow (index: number)

Ensure row is visible.
This method can be used to safely scroll back to a cell that a user has scrolled away from even if it was previously scrolled to.

### Class names

The Table component supports the following static class names

| Property                                          | Description                                 |
| :------------------------------------------------ | :------------------------------------------ |
| ReactVirtualized\_\_Table                         | Main (outer) element                        |
| ReactVirtualized\_\_Table\_\_headerColumnn        | Header cell (similar to `thead > tr > th`)  |
| ReactVirtualized\_\_Table\_\_headerRow            | Header row (similar to `thead > tr`)        |
| ReactVirtualized\_\_Table\_\_row                  | Table row (akin to `tbody > tr`)            |
| ReactVirtualized\_\_Table\_\_rowColumn            | Table column (akin to `tbody > tr > td`)    |
| ReactVirtualized\_\_Table\_\_sortableHeaderColumn | Applied to header columns that are sortable |
| ReactVirtualized\_\_Table\_\_sortableHeaderIcon   | SVG sort indicator                          |

### headerRowRenderer

This is an advanced property.
It is useful for situations where you require additional hooks into `Table` to render additional custom UI elements.
You may want to start by forking the [`defaultTableHeaderRowRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultHeaderRowRenderer.js) function.

This function accepts the following named parameters:

| Property  | Description          |
| :-------- | :------------------- |
| className | Header class name    |
| columns   | Array of React nodes |
| style     | Header style object  |

### rowRenderer

This is an advanced property.
It is useful for situations where you require additional hooks into `Table` (eg integration with a library like `react-sortable-hoc`).
If you do override `rowRenderer` the easiest way is to decorate the default implementation like so:

```jsx
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {defaultTableRowRenderer, Table} from 'react-virtualized';

const SortableTable = SortableContainer(Table);
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer);

function rowRenderer(props) {
  return <SortableTableRowRenderer {...props} />;
}

function CustomizedTable(props) {
  return <SortableTable rowRenderer={rowRenderer} {...props} />;
}
```

If you require greater customization, you may want to fork the [`defaultTableRowRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultRowRenderer.js) function.

This function accepts the following named parameters:

| Property         | Description                                                    |
| :--------------- | :------------------------------------------------------------- |
| className        | Row-level class name                                           |
| columns          | Array of React nodes                                           |
| index            | Row index                                                      |
| isScrolling      | Boolean flag indicating if `Table` is currently being scrolled |
| onRowClick       | Optional row `onClick` handler                                 |
| onRowDoubleClick | Optional row `onDoubleClick` handler                           |
| onRowMouseOver   | Optional row `onMouseOver` handler                             |
| onRowMouseOut    | Optional row `onMouseOut` handler                              |
| rowData          | Row data                                                       |
| style            | Row-level style object                                         |
| key              | Unique key within array of rendered rows                       |

### Examples

Below is a very basic `Table` example. This table has only 2 columns, each containing a simple string. Both have a fixed width and neither is sortable. [See here](../source/Table/Table.example.js) for a more full-featured example including custom cell renderers, sortable headers, and more.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Table data as an array of objects
const list = [
  {name: 'Brian Vaughn', description: 'Software engineer'},
  // And so on...
];

// Render your table
ReactDOM.render(
  <Table
    width={300}
    height={300}
    headerHeight={20}
    rowHeight={30}
    rowCount={list.length}
    rowGetter={({index}) => list[index]}>
    <Column label="Name" dataKey="name" width={100} />
    <Column width={200} label="Description" dataKey="description" />
  </Table>,
  document.getElementById('example'),
);
```
