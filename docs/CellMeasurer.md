CellMeasurer
---------------

High-order component that automatically measures a cell's contents by temporarily rendering it in a way that is not visible to the user.
Specify a fixed width to measure dynamic height (or vice versa).

This is an advanced component and has some limitations and performance considerations.
[See below for more information](#limitations-and-performance-considerations).

`CellMeasurer` is intended for use with `Grid` components but [can be adapted to work with `List` as well](#using-cellmeasurer-with-list).

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellRenderer | Function | ✓ | Renders a cell given its indices. `({ columnIndex: number, rowIndex: number, index: number }): PropTypes.node`.<br/>**NOTE**: `index` is just an alias to `rowIndex` |
| cellSizeCache | Object |  | Optional, custom caching strategy for cell sizes. Learn more [here](#cellsizecache). |
| children | Function | ✓ | Function responsible for rendering a virtualized component; `({ getColumnWidth: Function, getRowHeight: Function, resetMeasurements: Function }) => PropTypes.element` |
| columnCount | number | ✓ | Number of columns in the `Grid`; in order to measure a row's height, all of that row's columns must be rendered. |
| container |  |  | A Node, Component instance, or function that returns either. If this property is not specified the document body will be used. |
| height | number |  | Fixed height; specify this property to measure cell-width only. |
| rowCount | number | ✓ | Number of rows in the `Grid`; in order to measure a column's width, all of that column's rows must be rendered. |
| width | number |  | Fixed width; specify this property to measure cell-height only. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
| getColumnWidth | Function | Callback to set as the `columnWidth` property of a `Grid` |
| getRowHeight | Function | Callback to set as the `rowHeight` property of a `Grid` |
| resetMeasurementForColumn(index) | Function | Use this function to clear cached measurements for specific column in `CellRenderer`; its size will be remeasured the next time it is requested. |
| resetMeasurementForRow(index) | Function | Use this function to clear cached measurements for specific row in `CellRenderer`; its size will be remeasured the next time it is requested. |
| resetMeasurements | Function | Use this function to clear cached measurements in `CellRenderer`; each cell will be remeasured the next time its size is requested. |

### CellSizeCache

If you choose to override the `cellSizeCache` property your cache should support the following operations:

```js
class CellSizeCache {
  clearAllColumnWidths (): void;
  clearAllRowHeights (): void;
  clearColumnWidth (index: number): void;
  clearRowHeight (index: number): void;
  getColumnWidth (index: number): number | undefined | null;
  getRowHeight (index: number): number | undefined | null;
  setColumnWidth (index: number, width: number): void;
  setRowHeight (index: number, height: number): void;
}
```

The [default caching strategy](https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/defaultCellSizeCache.js) is exported as `defaultCellMeasurerCellSizeCache` should you wish to decorate it.
You can also pass `uniformRowHeight` and/or `uniformColumnWidth` named parameters to the constructor for lists with a uniform (yet unknown) cell sizes.

An [id-based caching strategy](https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/idCellSizeCache.js) is also available for data that may be sorted.
This strategy maps data ids to cell sizes rathe than index so that the sorting order of the data does not invalidate sizes.

### Examples

###### Default `cellSizeCache`

This example shows a `Grid` with fixed row heights and dynamic column widths.
For more examples check out the component [demo page](https://bvaughn.github.io/react-virtualized/#/components/CellMeasurer).

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { CellMeasurer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <CellMeasurer
    cellRenderer={cellRenderer}
    columnCount={columnCount}
    height={fixedRowHeight}
    rowCount={rowCount}
  >
    {({ getColumnWidth }) => (
      <Grid
        columnCount={columnCount}
        columnWidth={getColumnWidth}
        height={height}
        cellRenderer={cellRenderer}
        rowCount={rowCount}
        rowHeight={fixedRowHeight}
        width={width}
      />
    )}
  </CellMeasurer>,
  document.getElementById('example')
);
```

###### Customizing `cellSizeCache`

The cell size cache can be optimized when width and/or height is uniform across cells.
In this case the cache will allow only a single cell width/height measurement and then return that value for all other cells.
You can use it like so:

```jsx
import {
  CellMeasurer,
  defaultCellMeasurerCellSizeCache as CellSizeCache,
  Grid
} from 'react-virtualized';

// Column widths vary but row heights are uniform
const cellSizeCache = new CellSizeCache({
  uniformRowHeight: true,
  uniformColumnWidth: false
})

function render () {
  return (
    <CellMeasurer
      cellRenderer={cellRenderer}
      cellSizeCache={cellSizeCache}
      columnCount={columnCount}
      rowCount={rowCount}
    >
      {({ getColumnWidth, getRowHeight }) => (
        <Grid
          columnCount={columnCount}
          columnWidth={getColumnWidth}
          cellRenderer={cellRenderer}
          rowCount={rowCount}
          rowHeight={getRowHeight}
          {...otherProps}
        />
      )}
    </CellMeasurer>
  )
}
```

###### Using `CellMeasurer` with `List`

`CellMeasurer` is intended for use with `Grid` components but can be adapted to work with `List` as well.
Doing this is just a matter of renaming the `rowIndex` property specified by `CellMeasurer` to an `index` property expected by `rowRenderer`.

```jsx
<CellMeasurer
  cellRenderer={
    // CellMeasurer expects to work with a Grid
    // But your rowRenderer was written for a List
    // The only difference is the named parameter they
    // So map the Grid params (eg rowIndex) to List params (eg index)
    ({ rowIndex, ...rest }) => listProps.rowRenderer({ index: rowIndex, ...rest })
  }
  columnCount={1}
  rowCount={listProps.rowCount}
  width={listProps.width}
>
  {({ getRowHeight, setRef }) => (
    <List
      {...listProps}
      ref={setRef}
      rowHeight={getRowHeight}
    />
  )}
</CellMeasurer>
```

### Limitations and Performance Considerations

###### Stateful Components

The current implementation of `CellMeasurer` creates cells on demand, measures them, and then throws them away.
Future versions of this component may try to clone or in some other way share cells with their parent `Grid` in order to improve performance.
However until that happens, be wary of using `CellMeasurer` to measure stateful components.
Since cells are just-in-time created for measuring purposes they will only be measured with their default state.
To avoid this issue for now, use controlled props (instead of state) for cell rendering behavior.

###### Styling

Cells may be measured outside of the context of their intended `Grid` (or `List`).
This means that they will not inherit the parent styles while being measured.
Take care not rely on inherited styles for things that will affect measurement (eg `font-size`).
(See [issue 352](https://github.com/bvaughn/react-virtualized/issues/352) for more background information.)

Certain box-sizing settings (eg `box-sizing: border-box`) may cause slight discrepancies if borders are applied to a `Grid` whose cells are being measured.
For this reason, it is recommended that you avoid placing borders on a `Grid` that uses a `CellMeasurer` and instead style its parent container.
(See [issue 338](https://github.com/bvaughn/react-virtualized/issues/338) for more background information.)

###### Performance

Measuring a column's width requires measuring all rows in order to determine the widest occurrence of that column.
The same is true in reverse for measuring a row's height.
For this reason it may not be a good idea to use this HOC for `Grid`s containing a large number of both columns _and_ cells.

Since this component measures one cell at a time to determine it's width/height, it will likely be slow if a user skips many rows (or columns) at once by scrolling with a scrollbar or via a scroll-to-cell prop.
There is (unfortunately) no workaround for this performance limitation at the moment.
