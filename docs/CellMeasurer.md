CellMeasurer
---------------

High-order component for automatically measuring a cell's contents by rendering it in a way that is not visible to the user.
Specify a fixed width or height constraint if you only want to measure one dimension.

**Warning**: This HOC is fairly experimental and may change in future releases.
At this time it is only intended for use with a `Grid` (not `VirtualScroll` or `FlexTable` as their item rendering and cell measuring signatures are different).
Also note that in order to measure a column's width for a `Grid`, that column's content must be rendered for all rows in order to determine the maximum width.
For this reason it may not be a good idea to use this HOC for `Grid`s containing both a large number of columns _and_ cells.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellRenderer | Function | ✓ | Renders a cell given its indices. `({ columnIndex: number, rowIndex: number }): PropTypes.node` |
| children | Function | ✓ | Function respondible for rendering a virtualized component; `({ getColumnWidth, getRowHeight, resetMeasurements }) => PropTypes.element` |
| columnCount | number | ✓ | Number of columns in the `Grid`; in order to measure a row's height, all of that row's columns must be rendered. |
| container |  |  | A Node, Component instance, or function that returns either. If this property is not specified the document body will be used. |
| height | number |  | Fixed height; specify this property to measure width only. |
| rowCount | number | ✓ | Number of rows in the `Grid`; in order to measure a column's width, all of that column's rows must be rendered. |
| width | number |  | Fixed width; specify this property to measure height only. |

### Examples

This example shows a `Grid` with fixed column widths and dynamic row heights.
For more examples check out the component [demo page](https://bvaughn.github.io/react-virtualized/?component=CellMeasurer).

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { CellMeasurer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <CellMeasurer
    cellRenderer={cellRenderer}
    columnCount={columnCount}
    height={height}
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
