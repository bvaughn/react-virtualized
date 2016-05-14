Grid
---------------

This component efficiently renders a virtualized grid of elements.
Only a small number of cells are rendered based on the horizontal and vertical scroll position.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellRangeRenderer | Function |  | Responsible for rendering a group of cells given their index ranges.: `({ cellCache: Map, cellRenderer: Function, columnSizeAndPositionManager: CellSizeAndPositionManager, columnStartIndex: number, columnStopIndex: number, isScrolling: boolean, rowSizeAndPositionManager: CellSizeAndPositionManager, rowStartIndex: number, rowStopIndex: number, scrollLeft: number, scrollTop: number }): Array<PropTypes.node>`. [Learn more](#cellRangeRenderer) |
| cellRenderer | Function | ✓ | Responsible for rendering a cell given an row and column index: `({ columnIndex: number, isScrolling: boolean, rowIndex: number }): PropTypes.node` |
| className | String |  | Optional custom CSS class name to attach to root `Grid` element. |
| columnCount | Number | ✓ | Number of columns in grid. |
| columnWidth | Number or Function | ✓ | Either a fixed column width (number) or a function that returns the width of a column given its index: `({ index: number }): number` |
| height | Number | ✓ | Height of Grid; this property determines the number of visible (vs virtualized) rows. |
| noContentRenderer | Function |  | Optional renderer to be rendered inside the grid when either `rowCount` or `columnCount` is empty: `(): PropTypes.node` |
| onSectionRendered | Function |  | Callback invoked with information about the section of the Grid that was just rendered: `({ columnOverscanStartIndex: number, columnOverscanStopIndex: number, columnStartIndex: number, columnStopIndex: number, rowOverscanStartIndex: number, rowOverscanStopIndex: number, rowStartIndex: number, rowStopIndex: number }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, clientWidth: number, scrollHeight: number, scrollLeft: number, scrollTop: number, scrollWidth: number }): void` |
| overscanColumnCount | Number |  | Number of columns to render before/after the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| overscanRowCount | Number |  | Number of rows to render above/below the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| rowCount | Number | ✓ | Number of rows in grid. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number` |
| scrollLeft | Number |  | Horizontal offset |
| scrollToColumn | Number |  | Column index to ensure visible (by forcefully scrolling if necessary) |
| scrollToRow | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| style | Object |  | Optional custom inline style to attach to root `Grid` element. |
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

### cellRangeRenderer

This is an advanced property.
It is useful for situations where the `Grid` requires additional, overlayed UI (such as a Gantt chart or a calendar application).
Many use cases can be solved more easily using the `onScroll` callback or the `ScrollSync` HOC.
If you do choose to implement your own range renderer though, consider starting by forking the [`defaultCellRangeRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/defaultCellRangeRenderer.js) function.

The general shape of your range renderer function should look something like the following:

```js
function cellRangeRenderer ({
  cellCache,
  cellRenderer,
  columnSizeAndPositionManager,
  columnStartIndex,
  columnStopIndex,
  isScrolling,
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  scrollLeft: number,
  scrollTop: number
}) {
  const renderedCells = []

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    // This contains :offset (top) and :size (height) information for the cell
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      // This contains :offset (left) and :size (width) information for the cell
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)

      // Now render your cell and additional UI as you see fit.
      // Be sure to provide unique :key attributes.
      // Add all rendered children to the :renderedCells Array.
    }
  }

  return renderedCells
}
}
```

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
    cellRenderer={({ columnIndex, isScrolling, rowIndex }) => list[rowIndex][columnIndex]}
  />,
  document.getElementById('example')
);
```
