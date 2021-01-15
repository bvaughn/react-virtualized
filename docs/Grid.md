## Grid

A windowed grid of elements. `Grid` only renders cells necessary to fill itself based on the current horizontal and vertical scroll position. A simple `Grid` example can be seen [here](#basic-grid-example).

### Prop Types

| Property                   | Type               | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| :------------------------- | :----------------- | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoContainerWidth         | Boolean            |           | Set the width of the inner scrollable container to 'auto'. This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar.                                                                                                                                                                                                                             |
| autoHeight                 | Boolean            |           | Outer `height` of `Grid` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC.                                                                                                                                                                                                                                                                         |
| autoWidth                  | Boolean            |           | Outer `width` of `Grid` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC.                                                                                                                                                                                                                                                                          |
| cellRangeRenderer          | Function           |           | Responsible for rendering a group of cells given their index ranges. [Learn more](#cellrangerenderer)                                                                                                                                                                                                                                                                                              |
| cellRenderer               | Function           |     ✓     | Responsible for rendering a cell given an row and column index. [Learn more](#cellrenderer)                                                                                                                                                                                                                                                                                                        |
| className                  | String             |           | Optional custom CSS class name to attach to root `Grid` element.                                                                                                                                                                                                                                                                                                                                   |
| columnCount                | Number             |     ✓     | Number of columns in grid.                                                                                                                                                                                                                                                                                                                                                                         |
| columnWidth                | Number or Function |     ✓     | Either a fixed column width (number) or a function that returns the width of a column given its index: `({ index: number }): number`. If function is used, specify `estimatedColumnSize` for more consistent scrolling behavior.                                                                                                                                                                   |
| containerProps             | Object             |           | Responsible for adding props to the cell-container, i.e. `onWheel`.                                                                                                                                                                                                                                                                                                                                |
| containerRole              | string             |           | ARIA role for the cell-container; defaults to "rowgroup"                                                                                                                                                                                                                                                                                                                                           |
| containerStyle             | Object             |           | Optional custom inline style to attach to inner cell-container element.                                                                                                                                                                                                                                                                                                                            |
| deferredMeasurementCache   | `CellMeasurer`     |           | If CellMeasurer is used to measure this Grid's children, this should be a pointer to its CellMeasurerCache. A shared CellMeasurerCache reference enables Grid and CellMeasurer to share measurement data.                                                                                                                                                                                          |
| estimatedColumnSize        | Number             |           | Used to estimate the total width of a `Grid` before all of its columns have actually been measured. The estimated total width is adjusted as columns are rendered.                                                                                                                                                                                                                                 |
| estimatedRowSize           | Number             |           | Used to estimate the total height of a `Grid` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered.                                                                                                                                                                                                                                     |
| height                     | Number             |     ✓     | Height of Grid; this property determines the number of visible (vs virtualized) rows.                                                                                                                                                                                                                                                                                                              |
| id                         | String             |           | Optional custom id to attach to root `Grid` element.                                                                                                                                                                                                                                                                                                                                               |
| isScrolling                | Boolean            |           | Override internal is-scrolling state tracking. This property is primarily intended for use with the WindowScroller component.                                                                                                                                                                                                                                                                      |
| isScrollingOptOut          | Boolean            |           | Prevents re-rendering of visible cells on scroll end.                                                                                                                                                                                                                                                                                                                                              |
| noContentRenderer          | Function           |           | Optional renderer to be rendered inside the grid when either `rowCount` or `columnCount` is empty: `(): PropTypes.node`                                                                                                                                                                                                                                                                            |
| onSectionRendered          | Function           |           | Callback invoked with information about the section of the Grid that was just rendered. This callback is only invoked when visible rows have changed: `({ columnOverscanStartIndex: number, columnOverscanStopIndex: number, columnStartIndex: number, columnStopIndex: number, rowOverscanStartIndex: number, rowOverscanStopIndex: number, rowStartIndex: number, rowStopIndex: number }): void` |
| onScroll                   | Function           |           | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, clientWidth: number, scrollHeight: number, scrollLeft: number, scrollTop: number, scrollWidth: number }): void`                                                                                                                                                                  |
| onScrollbarPresenceChange  | Function           |           | Called whenever a horizontal or vertical scrollbar is added or removed: `({ horizontal: boolean, size: number, vertical: boolean }): void`                                                                                                                                                                                                                                                         |
| overscanColumnCount        | Number             |           | Number of columns to render before/after the visible slice of the grid. This can help reduce flickering during scrolling on certain browsers/devices. See [here](overscanUsage.md) for an important note about this property.                                                                                                                                                                      |
| overscanIndicesGetter      | Function           |           | Responsible for calculating the number of cells to overscan before and after a specified range [Learn more](#overscanindicesgetter)                                                                                                                                                                                                                                                                |
| overscanRowCount           | Number             |           | Number of rows to render above/below the visible slice of the grid. This can help reduce flickering during scrolling on certain browsers/devices. See [here](overscanUsage.md) for an important note about this property.                                                                                                                                                                          |
| role                       | String             |           | Optional override of ARIA role default; defaults to `grid`.                                                                                                                                                                                                                                                                                                                                        |
| rowCount                   | Number             |     ✓     | Number of rows in grid.                                                                                                                                                                                                                                                                                                                                                                            |
| rowHeight                  | Number or Function |     ✓     | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`. If function is used, specify `estimatedRowSize` for more consistent scrolling behavior.                                                                                                                                                                          |
| scrollingResetTimeInterval | Number             |           | Wait this amount of time after the last scroll event before resetting Grid `pointer-events`; defaults to 150ms.                                                                                                                                                                                                                                                                                    |
| scrollLeft                 | Number             |           | Horizontal offset                                                                                                                                                                                                                                                                                                                                                                                  |
| scrollToAlignment          | String             |           | Controls the alignment of scrolled-to-cells. The default ("_auto_") scrolls the least amount possible to ensure that the specified cell is fully visible. Use "_start_" to always align cells to the top/left of the `Grid` and "_end_" to align them bottom/right. Use "_center_" to align specified cell in the middle of container.                                                             |
| scrollToColumn             | Number             |           | Column index to ensure visible (by forcefully scrolling if necessary). Takes precedence over `scrollLeft`.                                                                                                                                                                                                                                                                                         |
| scrollToRow                | Number             |           | Row index to ensure visible (by forcefully scrolling if necessary). Takes precedence over `scrollTop`.                                                                                                                                                                                                                                                                                             |
| scrollTop                  | Number             |           | Vertical offset                                                                                                                                                                                                                                                                                                                                                                                    |
| style                      | Object             |           | Optional custom inline style to attach to root `Grid` element.                                                                                                                                                                                                                                                                                                                                     |
| tabIndex                   | Number             |           | Optional override of tab index default; defaults to `0`.                                                                                                                                                                                                                                                                                                                                           |
| width                      | Number             |     ✓     | Width of Grid; this property determines the number of visible (vs virtualized) columns.                                                                                                                                                                                                                                                                                                            |

### Public Methods

##### getOffsetForCell ({ alignment: ?string, columnIndex: ?number, rowIndex: ?number })

Gets offsets for a given cell and alignment.

##### getTotalRowsHeight

Gets estimated total rows' height.

##### getTotalColumnsWidth

Gets estimated total columns' width.

##### handleScrollEvent ({ scrollLeft, scrollTop })

This method handles a scroll event originating from an external scroll control.
It's an advanced method and should probably not be used unless you're implementing a custom scroll-bar solution.

##### measureAllCells

Pre-measure all columns and rows in a `Grid`.

Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

##### recomputeGridSize ({ columnIndex: number, rowIndex: number })

Recomputes row heights and column widths after the specified index (both default to 0).

This function should be called if dynamic column or row sizes have changed but nothing else has.
Since `Grid` only receives `columnCount` and `rowCount` it has no way of detecting when the underlying data changes.

This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered grid.

##### scrollToCell ({ columnIndex: number, rowIndex: number })

Ensure column and row are visible.
This method can be used to safely scroll back to a cell that a user has scrolled away from even if it was previously scrolled to.

##### scrollToPosition ({ scrollLeft, scrollTop })

Scroll to the specified offset(s).
Useful for animating position changes.

### Class names

The Grid component supports the following static class names

| Property                                     | Description           |
| :------------------------------------------- | :-------------------- |
| ReactVirtualized\_\_Grid                     | Main (outer) element  |
| ReactVirtualized**Grid**innerScrollContainer | Inner scrollable area |

### cellRangeRenderer

This is an advanced property.
It is useful for situations where the `Grid` requires additional, overlayed UI (such as a Gantt chart or a calendar application).
Many use cases can be solved more easily using the `onScroll` callback or the `ScrollSync` HOC.

If you do want to override `cellRangeRenderer` the easiest way is to decorate the default implementation like so:

```jsx
import {defaultCellRangeRenderer, Grid} from 'react-virtualized';

function cellRangeRenderer(props) {
  const children = defaultCellRangeRenderer(props);
  children.push(<div>My custom overlay</div>);
  return children;
}

function CustomizedGrid(props) {
  return <Grid cellRangeRenderer={cellRangeRenderer} {...props} />;
}
```

If you require greater customization, you may want to fork the [`defaultCellRangeRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/defaultCellRangeRenderer.js) function.

This function accepts the following named parameters:

```js
function cellRangeRenderer({
  cellCache, // Temporary cell cache used while scrolling
  cellRenderer, // Cell renderer prop supplied to Grid
  columnSizeAndPositionManager, // @see CellSizeAndPositionManager,
  columnStartIndex, // Index of first column (inclusive) to render
  columnStopIndex, // Index of last column (inclusive) to render
  horizontalOffsetAdjustment, // Horizontal pixel offset (required for scaling)
  isScrolling, // The Grid is currently being scrolled
  rowSizeAndPositionManager, // @see CellSizeAndPositionManager,
  rowStartIndex, // Index of first row (inclusive) to render
  rowStopIndex, // Index of last row (inclusive) to render
  scrollLeft, // Current horizontal scroll offset of Grid
  scrollTop, // Current vertical scroll offset of Grid
  styleCache, // Temporary style (size & position) cache used while scrolling
  verticalOffsetAdjustment, // Vertical pixel offset (required for scaling)
}) {
  const renderedCells = [];

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    // This contains :offset (top) and :size (height) information for the cell
    let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    for (
      let columnIndex = columnStartIndex;
      columnIndex <= columnStopIndex;
      columnIndex++
    ) {
      // This contains :offset (left) and :size (width) information for the cell
      let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(
        columnIndex,
      );

      // Be sure to adjust cell position in case the total set of cells is too large to be supported by the browser natively.
      // In this case, Grid will shift cells as a user scrolls to increase cell density.
      let left = columnDatum.offset + horizontalOffsetAdjustment;
      let top = rowDatum.offset + verticalOffsetAdjustment;

      // The rest of the information you need to render the cell are contained in the data.
      // Be sure to provide unique :key attributes.
      let key = `${rowIndex}-${columnIndex}`;
      let height = rowDatum.size;
      let width = columnDatum.size;

      // Now render your cell and additional UI as you see fit.
      // Add all rendered children to the :renderedCells Array.
    }
  }

  return renderedCells;
}
```

### overscanIndicesGetter

This is an advanced property.
This function is responsible for calculating the number of cells to overscan before and after a specified range. By default, React Virtualized optimizes the number of cells to overscan based on scroll direction. If you'd like to customize this behavior, you may want to fork the [`defaultOverscanIndicesGetter`](https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/defaultOverscanIndicesGetter.js) function.

```js
function overscanIndicesGetter({
  direction, // One of "horizontal" or "vertical"
  cellCount, // Number of rows or columns in the current axis
  scrollDirection, // 1 (forwards) or -1 (backwards)
  overscanCellsCount, // Maximum number of cells to over-render in either direction
  startIndex, // Begin of range of visible cells
  stopIndex, // End of range of visible cells
}) {
  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
  };
}
```

### cellRenderer

Responsible for rendering a single cell, given its row and column index.
This function accepts the following named parameters:

```jsx
function cellRenderer({
  columnIndex, // Horizontal (column) index of cell
  isScrolling, // The Grid is currently being scrolled
  isVisible, // This cell is visible within the grid (eg it is not an overscanned cell)
  key, // Unique key within array of cells
  parent, // Reference to the parent Grid (instance)
  rowIndex, // Vertical (row) index of cell
  style, // Style object to be applied to cell (to position it);
  // This must be passed through to the rendered cell element.
}) {
  // Grid data is a 2d array in this example...
  const user = list[rowIndex][columnIndex];

  // If cell content is complex, consider rendering a lighter-weight placeholder while scrolling.
  const content = isScrolling ? '...' : <User user={user} />;

  // Style is required since it specifies how the cell is to be sized and positioned.
  // React Virtualized depends on this sizing/positioning for proper scrolling behavior.
  // By default, the grid component provides the following style properties:
  //    position
  //    left
  //    top
  //    height
  //    width
  // You can add additional class names or style properties as you would like.
  // Key is also required by React to more efficiently manage the array of cells.
  return (
    <div key={key} style={style}>
      {content}
    </div>
  );
}
```

### Basic `Grid` Example

Below is a very basic `Grid` example. The grid displays an array of objects with fixed row and column sizes. (Dynamic sizes are also supported but this example is intended to be basic.) [See here](../source/Grid/Grid.example.js) for a more full-featured example with dynamic cell sizes and more.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Grid} from 'react-virtualized';

// Grid data as an array of arrays
const list = [
  ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
  // And so on...
];

function cellRenderer({columnIndex, key, rowIndex, style}) {
  return (
    <div key={key} style={style}>
      {list[rowIndex][columnIndex]}
    </div>
  );
}

// Render your grid
ReactDOM.render(
  <Grid
    cellRenderer={cellRenderer}
    columnCount={list[0].length}
    columnWidth={100}
    height={300}
    rowCount={list.length}
    rowHeight={30}
    width={300}
  />,
  document.getElementById('example'),
);
```
