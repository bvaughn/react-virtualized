VirtualScroll
---------------

Describes the header and cell contents of a table column

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | CSS class name |
| height | Number | ✓ | Height constraint for list (determines how many actual rows are rendered) |
| noRowsRenderer |  | Function | Callback used to render placeholder content when :rowsCount is 0 |
| onRowsRendered |  | Function | Callback invoked with information about the slice of rows that were just rendered: `({ startIndex, stopIndex }): void` |
| rowHeight | Number | ✓ | Fixed row height; the number of rows displayed is calculated by dividing height by rowHeight |
| rowRenderer | Function | ✓ | Responsbile for rendering a row given an index. Rendered rows must have a unique `key` attribute. |
| rowsCount | Number | ✓ | Number of rows in list. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |

### Public Methods

##### recomputeRowHeights
Recompute row heights and offsets.

VirtualScroll has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property. If the `rowHeight` is a number it can compare before and after values but if it is a function- that comparison is error prone. In the event that a dynamic `rowHeight` function is in use and the row heights have changed, this function should be manually called by the "smart" container parent.

##### scrollToRow

Scroll the list to ensure the row at the specified index is visible. This method exists so that a user can forcefully scroll to the same row twice. (The `scrollToIndex` property would not change in that case and so it would not be picked up by VirtualScroll.)
