Grid
---------------

This component efficiently renders a virtualized grid of elements.
Only a small number of cells are rendered based on the horizontal and vertical scroll position.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | Optional custom CSS class name to attach to root Grid element. |
| columnsCount | Number | ✓ | Number of columns in grid. |
| columnWidth | Number or Function | ✓ | Either a fixed column width (number) or a function that returns the width of a column given its index: `(index: number): number` |
| height | Number | ✓ | Height of Grid; this property determines the number of visible (vs virtualized) rows. |
| noContentRenderer | Function |  | Optional renderer to be rendered inside the grid when either `rowsCount` or `columnsCount` is 0: `(): PropTypes.node` |
| onSectionRendered | Function |  | Callback invoked with information about the section of the Grid that was just rendered: `({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }): void` |
| renderCell | Function | ✓ | Responsible for rendering a cell given an row and column index: `({ columnIndex: number, rowIndex: number }): PropTypes.node` |
| rowsCount | Number | ✓ | Number of rows in grid. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `(index: number): number` |
| scrollToColumn | Number |  | Column index to ensure visible (by forcefully scrolling if necessary) |
| scrollToRow | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| width | Number | ✓ | Width of Grid; this property determines the number of visible (vs virtualized) columns. |

### Public Methods

##### recomputeGridSize

Recomputes row heights and column widths.

This function should be called if dynamic column or row sizes have changed but nothing else has.
Since Grid only receives `columnsCount` and `rowsCount` it has no way of detecting when the underlying data changes.

##### scrollToCell

Updates the Grid to ensure the cell at the specified row and column indices is visible.
This method exists so that a user can forcefully scroll to the same cell twice.
(The `scrollToColumn` and `scrollToRow` properties would not change in that case so it would not be picked up by the component.)

### Class names

The Grid component supports the following static class names

| Property | Description |
|:---|:---|
| Grid | Main (outer) element |
