Grid
---------------

This component efficiently renders a virtualized grid of elements.
Only a small number of cells are rendered based on the horizontal and vertical scroll position.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| autoContainerWidth | Boolean |  | Set the width of the inner scrollable container to 'auto'. This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar. |
| autoHeight | Boolean |  | Outer `height` of `Grid` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC. |
| cellClassName | String or Function |  | Optional custom CSS class name to attach to `Grid__cell` element. If function given then signature should be look like: ({ columnIndex: number, rowIndex: number }): PropTypes.string |
| cellRangeRenderer | Function |  | Responsible for rendering a group of cells given their index ranges.: `({ cellCache: Map, cellRenderer: Function, columnSizeAndPositionManager: CellSizeAndPositionManager, columnStartIndex: number, columnStopIndex: number, isScrolling: boolean, rowSizeAndPositionManager: CellSizeAndPositionManager, rowStartIndex: number, rowStopIndex: number, scrollLeft: number, scrollTop: number }): Array<PropTypes.node>`. [Learn more](#cellrangerenderer) |
| cellRenderer | Function | ✓ | Responsible for rendering a cell given an row and column index: `({ columnIndex: number, isScrolling: boolean, rowIndex: number }): PropTypes.node` |
| cellStyle | Object or Function |  | Optional custom inline style for individual cell. If function given then signature should be look like: ({ columnIndex: number, rowIndex: number }): PropTypes.object |
| className | String |  | Optional custom CSS class name to attach to root `Grid` element. |
| columnCount | Number | ✓ | Number of columns in grid. |
| columnWidth | Number or Function | ✓ | Either a fixed column width (number) or a function that returns the width of a column given its index: `({ index: number }): number` |
| estimatedColumnSize | Number |  | Used to estimate the total width of a `Grid` before all of its columns have actually been measured. The estimated total width is adjusted as columns are rendered. |
| estimatedRowSize | Number |  | Used to estimate the total height of a `Grid` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered. |
| height | Number | ✓ | Height of Grid; this property determines the number of visible (vs virtualized) rows. |
| noContentRenderer | Function |  | Optional renderer to be rendered inside the grid when either `rowCount` or `columnCount` is empty: `(): PropTypes.node` |
| onSectionRendered | Function |  | Callback invoked with information about the section of the Grid that was just rendered: `({ columnOverscanStartIndex: number, columnOverscanStopIndex: number, columnStartIndex: number, columnStopIndex: number, rowOverscanStartIndex: number, rowOverscanStopIndex: number, rowStartIndex: number, rowStopIndex: number }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, clientWidth: number, scrollHeight: number, scrollLeft: number, scrollTop: number, scrollWidth: number }): void` |
| overscanColumnCount | Number |  | Number of columns to render before/after the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| overscanRowCount | Number |  | Number of rows to render above/below the visible slice of the grid. This can help reduce flickering during scrolling on certain browers/devices. |
| rowCount | Number | ✓ | Number of rows in grid. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number` |
| scrollLeft | Number |  | Horizontal offset |
| scrollToAlignment | String |  | Controls the alignment of scrolled-to-cells. The default ("_auto_") scrolls the least amount possible to ensure that the specified cell is fully visible. Use "_start_" to always align cells to the top/left of the `Grid` and "_end_" to align them bottom/right. Use "_center_" to align specified cell in the middle of container. |
| scrollToColumn | Number |  | Column index to ensure visible (by forcefully scrolling if necessary) |
| scrollToRow | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| style | Object |  | Optional custom inline style to attach to root `Grid` element. |
| tabIndex | Number |  | Optional override of tab index default; defaults to `null`. |
| width | Number | ✓ | Width of Grid; this property determines the number of visible (vs virtualized) columns. |

### Public Methods

##### measureAllCells

Pre-measure all columns and rows in a `Grid`.

Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

##### recomputeGridSize ({ columnIndex: number, rowIndex: number })

Recomputes row heights and column widths after the specified index (both default to 0).

This function should be called if dynamic column or row sizes have changed but nothing else has.
Since `Grid` only receives `columnCount` and `rowCount` it has no way of detecting when the underlying data changes.

This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered grid.

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

If you do want to override `cellRangeRenderer` the easiest way is to decorate the default implementation like so:

```js
import { defaultCellRangeRenderer, Grid } from 'react-virtualized'

function cellRangeRenderer (props) {
  const children = defaultCellRangeRenderer(props)
  children.push(
    <div>My custom overlay</div>
  )
  return children
}

function CustomizedGrid (props) {
  return (
    <Grid
      cellRangeRenderer={cellRangeRenderer}
      {...props}
    />
  )
}
```

If you require greater customization, you may want to fork the [`defaultCellRangeRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/defaultCellRangeRenderer.js) function.

This function accepts the following named parameters:

```js
function cellRangeRenderer ({
  cellCache: Object,
  cellClassName: Function,
  cellRenderer: Function,
  cellStyle: Function,
  columnSizeAndPositionManager: ScalingCellSizeAndPositionManager,
  columnStartIndex: number,
  columnStopIndex: number,
  horizontalOffsetAdjustment: number
  isScrolling: boolean,
  rowSizeAndPositionManager: ScalingCellSizeAndPositionManager,
  rowStartIndex: number,
  rowStopIndex: number,
  scrollLeft: number,
  scrollTop: number,
  verticalOffsetAdjustment: number
}) {
  const renderedCells = []

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    // This contains :offset (top) and :size (height) information for the cell
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      // This contains :offset (left) and :size (width) information for the cell
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)

      // Be sure to adjust cell position in case the total set of cells is too large to be supported by the browser natively.
      // In this case, Grid will shift cells as a user scrolls to increase cell density.
      let left = columnDatum.offset + horizontalOffsetAdjustment
      let top = rowDatum.offset + verticalOffsetAdjustment

      // The rest of the information you need to render the cell are contained in the data.
      // Be sure to provide unique :key attributes.
      let key = `${rowIndex}-${columnIndex}`
      let height = rowDatum.size
      let width = columnDatum.size

      // Now render your cell and additional UI as you see fit.
      // Add all rendered children to the :renderedCells Array.
    }
  }

  return renderedCells
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
