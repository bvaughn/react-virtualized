FlexTable
---------------

Table component with fixed headers and virtualized rows for improved performance with large data sets.
This component expects explicit width, height, and padding parameters.

#### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | [FlexColumn](FlexColumn.md) | ✓ | One or more FlexColumns describing the data displayed in this row |
| className | String |  | CSS class name |
| disableHeader | Boolean |  | Disable rendering the header at all |
| headerClassName | String |  | CSS class to apply to all column headers |
| headerHeight | Number | ✓ | Fixed height of header row |
| height | Number | ✓ | Fixed/available height for out DOM element |
| horizontalPadding | Number |  | Horizontal padding of outer DOM element |
| noRowsRenderer |  | Function | Callback used to render placeholder content when :rowsCount is 0 |
| onRowClick |  | Function | Callback invoked when a user clicks on a table row. `(rowIndex: number): void` |
| rowClassName | String or Function |  | CSS class to apply to all table rows (including the header row). This value may be either a static string or a function with the signature `(rowIndex: number): string`. Note that for the header row an index of `-1` is provided. |
| rowGetter | Function | ✓ | Callback responsible for returning a data row given an index. `(index: int): any` |
| rowHeight |  | ✓ | Fixed height of table row |
| rowsCount | Number | ✓ | Number of rows in table. |
| sort | Function |  | Sort function to be called if a sortable header is clicked. `(dataKey: string, sortDirection: SortDirection): void` |
| sortBy | String |  | Data is currently sorted by this `dataKey` (if it is sorted at all) |
| sortDirection | [SortDirection](SortDirection.md) |  | Data is currently sorted in this direction (if it is sorted at all) |
| width | Number | ✓ | Fixed/available width for out DOM element |
| verticalPadding | Number |  | Vertical padding of outer DOM element |
