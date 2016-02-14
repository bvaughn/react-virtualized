FlexTable
---------------

Table component with fixed headers and virtualized rows for improved performance with large data sets.
This component expects explicit width, height, and padding parameters.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | [FlexColumn](FlexColumn.md) | ✓ | One or more FlexColumns describing the data displayed in this row |
| className | String |  | CSS class name |
| disableHeader | Boolean |  | Disable rendering the header at all |
| headerClassName | String |  | CSS class to apply to all column headers |
| headerHeight | Number | ✓ | Fixed height of header row |
| height | Number | ✓ | Fixed/available height for out DOM element |
| noRowsRenderer |  | Function | Callback used to render placeholder content when :rowsCount is 0 |
| onHeaderClick |  | Function | Callback invoked when a user clicks on a table header. `(dataKey: string, columnData: any): void` |
| onRowClick |  | Function | Callback invoked when a user clicks on a table row. `(rowIndex: number): void` |
| onRowsRendered |  | Function | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }): void` |
| overscanRowsCount |  | Number | Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browers/devices. |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight, scrollHeight, scrollTop }): void` |
| rowClassName | String or Function |  | CSS class to apply to all table rows (including the header row). This value may be either a static string or a function with the signature `(rowIndex: number): string`. Note that for the header row an index of `-1` is provided. |
| rowGetter | Function | ✓ | Callback responsible for returning a data row given an index. `(index: int): any` |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `(index: number): number` |
| rowsCount | Number | ✓ | Number of rows in table. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| sort | Function |  | Sort function to be called if a sortable header is clicked. `(dataKey: string, sortDirection: SortDirection): void` |
| sortBy | String |  | Data is currently sorted by this `dataKey` (if it is sorted at all) |
| sortDirection | [SortDirection](SortDirection.md) |  | Data is currently sorted in this direction (if it is sorted at all) |

### Public Methods

##### recomputeRowHeights
Recompute row heights and offsets.

VirtualScroll has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property. If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone. In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

##### scrollToRow(rowIndex)

Scroll the list to ensure the row at the specified index is visible. This method exists so that a user can forcefully scroll to the same row twice. (The `scrollToIndex` property would not change in that case and so it would not be picked up by VirtualScroll.)

##### setScrollTop(scrollTop)

Set the `scrollTop` position within the inner scroll container.

Normally it is best to let `FlexTable` manage this properties or to use a method like `scrollToRow`.
This method enables `FlexTable` to be scroll-synced to another react-virtualized component though.
It is appropriate to use in that case.

### Class names

The FlexTable component supports the following static class names

| Property | Description |
|:---|:---|
| FlexTable | Main (outer) element |
| FlexTable__headerColumn | Header cell (similar to `thead > tr > th`) |
| FlexTable__headerRow | Header row (similar to `thead > tr`) |
| FlexTable__headerTruncatedText | Element within header cell responsible for truncating text |
| FlexTable__row | Table row (akin to `tbody > tr`) |
| FlexTable__rowColumn | Table column (akin to `tbody > tr > td`) |
| FlexTable__sortableHeaderColumn | Applied to header columns that are sortable |
| FlexTable__sortableHeaderIcon | SVG sort indicator |
| FlexTable__truncatedColumnText | Element within table column responsible for truncating text |
