Grid
---------------

This component efficiently renders a virtualized grid of elements.
Only a small number of cells are rendered based on the horizontal and vertical scroll position.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellRenderer | Function | ✓ | Responsible for rendering a cell given an row and column index: `({ columnIndex: number, rowIndex: number }): PropTypes.node` |
| cellRangeRenderer | Function | ✓ | Responsible for rendering a group of cells given their index ranges.: `({ columnMetadata:Array<Object>, columnStartIndex: number, columnStopIndex: number, cellRenderer: Function, rowMetadata:Array<Object>, rowStartIndex: number, rowStopIndex: number }): Array<PropTypes.node>` |
| className | String |  | Optional custom CSS class name to attach to root Grid element. |
| columnCount | Number | ✓ | Number of columns in grid. |
| columnWidth | Number or Function | ✓ | Either a fixed column width (number) or a function that returns the width of a column given its index: `({ index: number }): number` |
| height | Number | ✓ | Height of Grid; this property determines the number of visible (vs virtualized) rows. |
| noContentRenderer | Function |  | Optional renderer to be rendered inside the grid when either `rowCount` or `columnCount` is 0: `(): PropTypes.node` |
| onSectionRendered | Function |  | Callback invoked with information about the section of the Grid that was just rendered: `({ columnOverscanStartIndex, columnOverscanStopIndex, columnStartIndex, columnStopIndex, rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void` |
| overscanColumnCount |  | Number | Number of columns to render before/after the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| overscanRowCount |  | Number | Number of rows to render above/below the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| rowCount | Number | ✓ | Number of rows in grid. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number` |
| scrollLeft | Number |  | Horizontal offset |
| scrollToColumn | Number |  | Column index to ensure visible (by forcefully scrolling if necessary) |
| scrollToRow | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| width | Number | ✓ | Width of Grid; this property determines the number of visible (vs virtualized) columns. |

### Public Methods

##### recomputeGridSize

Recomputes row heights and column widths.

This function should be called if dynamic column or row sizes have changed but nothing else has.
Since Grid only receives `columnCount` and `rowCount` it has no way of detecting when the underlying data changes.

### Class names

The Grid component supports the following static class names

| Property | Description |
|:---|:---|
| Grid | Main (outer) element |
| Grid__innerScrollContainer | Inner scrollable area |
| Grid__cell | Individual cell |

### Examples

Below is a very basic `Grid` example. The grid displays an array of objects with fixed row and column sizes. (Dynamic sizes are also supported but this example is intended to be basic.) [See here](../source/Grid/Grid.example.js) for a more full-featured example with dynamic cell sizes and more.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Grid data as an array of arrays
const list = [
  ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */ ]
  // And so on...
];

// Render your grid
ReactDOM.render(
  <Grid
    width={300}
    height={300}
    columnWidth={100}
    rowHeight={30}
    columnCount={list[0].length}
    rowCount={list.length}
    cellRenderer={({ columnIndex, rowIndex }) => list[rowIndex][columnIndex]}
  />,
  document.getElementById('example')
);
```
