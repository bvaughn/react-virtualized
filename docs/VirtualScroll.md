VirtualScroll
---------------

Describes the header and cell contents of a table column

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | CSS class name |
| height | Number | ✓ | Height constraint for list (determines how many actual rows are rendered) |
| noRowsRenderer |  | Function | Callback used to render placeholder content when `rowsCount` is 0 |
| onRowsRendered |  | Function | Callback invoked with information about the slice of rows that were just rendered: `({ startIndex, stopIndex }): void` |
| overscanRowsCount |  | Number | Number of rows to render above/below the visible bounds of the list. These rows can help for smoother scrolling on touch devices. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `(index: number): number` |
| rowRenderer | Function | ✓ | Responsbile for rendering a row given an index. Rendered rows must have a unique `key` attribute. |
| rowsCount | Number | ✓ | Number of rows in list. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |

### Public Methods

##### recomputeRowHeights
Recompute row heights and offsets.

VirtualScroll has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property. If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone. In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

##### scrollToRow

Scroll the list to ensure the row at the specified index is visible. This method exists so that a user can forcefully scroll to the same row twice. (The `scrollToIndex` property would not change in that case and so it would not be picked up by VirtualScroll.)

### Class names

The VirtualScroll component supports the following static class names

| Property | Description |
|:---|:---|
| VirtualScroll | Main (outer) element |
| VirtualScroll_innerScrollContainer | Inner element on which virtual items are positioned |
